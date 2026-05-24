# Handoff — generating `rsf_S5.tif` (and friends)

**Goal.** Produce a per-pixel raster of S(t = 5), the predicted probability
that a new beaver dam at that location persists at least five years,
from the existing Random Survival Forest (`rf_best`) in
`RSF_outputs_aligned_2026-05/RSF_best_model.rds`. Upload to Earth Engine
as `users/<you>/rsf_S5` and ingest into `earthengine/beaver-habitat-app.js`.

This is the **minimum** change to the existing RSF script. The
commented-out `terra::predict` block at the bottom of §11 is set up for
duration regression (`rf_dur`), not survival. Survival prediction
returns a *matrix* of S(t) values, not a single number — so we need a
small wrapper.

---

## 1. The shape of the problem

`predict(rf_best, data = newdat)` returns:

```r
List of:
  $ unique.death.times : num [1:T]      # the time grid
  $ survival           : num [n, T]     # S(t) per row × per time
  $ chf                : num [n, T]
```

`terra::predict(raster, model, fun, ...)` expects `fun` to return either
a numeric vector (single band) or a data.frame (multi-band). Out of the
box, `ranger::predict` doesn't return either — it returns the list
above. We wrap it.

The script already contains the exact extraction logic, as a row-wise
helper:

```r
S_at <- function(S, times, t0) {
  j <- which(times >= t0)[1]
  if (is.na(j)) return(rep(NA_real_, nrow(S)))
  S[, j]
}
```

The wrapper for `terra::predict` is the same idea, called raster-wise.

---

## 2. Smallest viable change — single-band S(5)

Add this block in place of the commented-out spatial prediction in §11.
The covariate stack and `keep` vector are already built earlier in the
script; this just plugs in the wrapper and writes the TIF.

```r
###############################################################################
# ---- 11) Spatial prediction: S(5) surface ----
###############################################################################

# Wrapper: terra::predict calls this with (model, data, ...) and a chunk of
# pixels in `data`. We return one number per row — S evaluated at t = 5.
predict_S5 <- function(model, data, ...) {
  # ranger errors on rows with any NA; terra::predict already drops them
  # when called with na.rm = TRUE, but be defensive.
  ok <- stats::complete.cases(data)
  out <- rep(NA_real_, nrow(data))
  if (!any(ok)) return(out)

  p     <- predict(model, data = data[ok, , drop = FALSE])
  times <- model$unique.death.times
  j     <- which(times >= 5)[1]
  if (is.na(j)) return(out)        # model never resolves to t = 5

  out[ok] <- p$survival[, j]
  out
}

# Reduced predictor stack, in the order the model was fit with.
# rf_best$forest$independent.variable.names gives the canonical order.
keep_order   <- rf_best$forest$independent.variable.names
cov_stack_red <- cov_stack[[keep_order]]

# Apply the same tcbwet sentinel cleanup the model was fit on.
if ("tcbwet" %in% names(cov_stack_red)) {
  cov_stack_red$tcbwet <- ifel(cov_stack_red$tcbwet > 1e10, NA,
                                cov_stack_red$tcbwet)
}

S5 <- terra::predict(
  object   = cov_stack_red,
  model    = rf_best,
  fun      = predict_S5,
  na.rm    = TRUE,
  filename = file.path(out_dir, "rsf_S5.tif"),
  overwrite = TRUE,
  wopt     = list(datatype = "FLT4S")
)

cat("Wrote", file.path(out_dir, "rsf_S5.tif"), "\n")
```

Three things worth noticing:

1. **Predictor order is from the fitted model**, not from the original
   18-name vector. `keep_order` reads it directly off `rf_best`, so if
   the reduced-model selection changes between runs, the stack still
   aligns.
2. **`tcbwet` sentinel cleanup must happen on the raster** the same way
   it happened on `model_df` — otherwise pixels with the sentinel value
   will get a wildly out-of-distribution prediction.
3. **`filename =` inside `terra::predict`** streams to disk in tiles
   instead of holding the whole prediction in RAM. For the 3,282 km²
   extent at native resolution this matters; expect ~minutes, not
   seconds.

---

## 3. Recommended — multi-band surface (S(2), S(5), S(10), median)

Same wrapper shape, just returns a data.frame. Then in GEE you can show
any of the bands without re-running R — and `median_t` in particular is
the most natural "how long does this hold" surface to a non-stats
audience.

```r
predict_S_multi <- function(model, data, ...) {
  ok <- stats::complete.cases(data)
  n  <- nrow(data)
  na_col <- function() rep(NA_real_, n)
  out <- data.frame(S2 = na_col(), S5 = na_col(), S10 = na_col(),
                    median_t = na_col())
  if (!any(ok)) return(out)

  p     <- predict(model, data = data[ok, , drop = FALSE])
  times <- model$unique.death.times

  S_at_vec <- function(t0) {
    j <- which(times >= t0)[1]
    if (is.na(j)) return(rep(NA_real_, sum(ok)))
    p$survival[, j]
  }
  median_t_vec <- function() {
    apply(p$survival, 1, function(row) {
      idx <- which(row <= 0.5)[1]
      if (is.na(idx)) NA_real_ else times[idx]
    })
  }

  out$S2[ok]       <- S_at_vec(2)
  out$S5[ok]       <- S_at_vec(5)
  out$S10[ok]      <- S_at_vec(10)
  out$median_t[ok] <- median_t_vec()
  out
}

S_multi <- terra::predict(
  object    = cov_stack_red,
  model     = rf_best,
  fun       = predict_S_multi,
  na.rm     = TRUE,
  filename  = file.path(out_dir, "rsf_persistence.tif"),
  overwrite = TRUE,
  wopt      = list(names = c("S2","S5","S10","median_t"),
                   datatype = "FLT4S")
)
```

This produces a 4-band GeoTIFF. In Earth Engine, `ee.Image('…/rsf_persistence').select('S5')` pulls just the S(5) band; the GEE app can expose a `t` dropdown that swaps the selected band without touching R.

---

## 4. Sanity checks before upload

Run after writing the TIF, before uploading anything:

```r
# 1. Range should be in [0, 1] for survival bands.
summary(values(S5, na.rm = TRUE))

# 2. The S(5) values at observed dam locations should correlate strongly
#    with the row-wise S(5) the script already computes.
obs_S5_raster <- terra::extract(S5, vect(dams_sf_proj))[, 2]
obs_S5_rowwise <- S_at(rf_best$predictions$survival,
                        rf_best$unique.death.times, 5)
# Note: rf_best is OOB-trained, so these won't be identical, but the
# Pearson correlation should be > 0.7.
cor(obs_S5_raster, obs_S5_rowwise, use = "complete.obs")

# 3. Plot: failed dams should lie in the lower tail of the raster S(5)
#    distribution; active dams in the upper. If they don't, the
#    predictor stack is misaligned with the model.
boxplot(obs_S5_raster ~ dams_tab$event,
        names = c("active (censored)", "failed"),
        ylab = "raster S(5) at dam location")
```

If (1) falls outside [0,1], something's off with the wrapper. If (2)
is < 0.5, the raster predictor names probably don't match
`rf_best$forest$independent.variable.names` — check the order from §2.

---

## 5. Upload to Earth Engine

Two assets to push (using the multi-band recommendation):

```
rf_habitat_suitability.tif   → users/<you>/rf_habitat_suitability
rsf_persistence.tif          → users/<you>/rsf_persistence  (4 bands)
```

In the Code Editor: **Assets → New → Image Upload → GeoTIFF**. The 4-band TIF
uploads as a single multi-band `ee.Image`. Tag both with:

- `description`: short paragraph for the asset listing
- `properties`: at minimum `model: "RSF (ranger)"`, `n_dams: 136`, `n_events: 70`, `T_end: 2025`

Then in `earthengine/beaver-habitat-app.js`:

```js
var USER_ASSETS = {
  suit: 'users/<you>/rf_habitat_suitability',
  pers: 'users/<you>/rsf_persistence'
};

var suit = ee.Image(USER_ASSETS.suit);
var pers = ee.Image(USER_ASSETS.pers);

// Default band shown is S(5); the dropdown lets users flip to S(10) etc.
var s5     = pers.select('S5');
var s10    = pers.select('S10');
var medT   = pers.select('median_t');
```

Once published, paste the `https://<you>.users.earthengine.app/view/…`
URL into the page's **Tweaks → GEE App URL** field and the local
preview swaps for the live app.

---

## 6. Memory / runtime notes

- The full 18-band prediction over a 3,282 km² extent at 10 m is ~30 M
  pixels. Each chunk passed to `predict_S5` is ~10 k rows by default;
  the wrapper allocates a [10 k × T] survival matrix per chunk, where
  T ≈ number of unique death times in the training set (~70 here). RAM
  per chunk is small.
- The bottleneck is `predict.ranger` itself; expect ~10–25 minutes on a
  laptop for the single-band version, ~12–30 min for the multi-band.
  Set `cores = parallel::detectCores() - 1` on `terra::predict` to
  parallelise.
- If you crank the resolution finer (5 m, 2 m), runtime scales linearly
  with pixel count. For the GEE app, 10 m is plenty — the SAR and
  ABoVE inputs are coarser than that anyway.

---

## 7. One subtle thing

`rf_best$prediction.error` gives `1 − C-index` for the OOB predictions
the *model* was fit on. The C-index doesn't transfer cleanly to a
per-pixel surface — every pixel is a hypothetical dam, most of which
will never be tested. Treat the raster as a *spatial decision
support layer*, not a probability you can validate at every cell. The
validation work belongs at observed dams (the §4 sanity check above).
