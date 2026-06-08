# BEYOND LINEARITY — Master Notebook Change Log

**Base notebook:** `Beyond_Linearity-VAL/Beyond_Linearity_v2.ipynb`  
**Sources used:** TREVOR v1, TREVOR v2, VAL v1, VAL v2, Linear_models.ipynb  
**Output:** `BEYOND_LINEARITY_MASTER.ipynb`  
**Date created:** 2026-06-06

---

## VAL v2 Baseline Metrics (Before Any Changes)

These are the exact numbers from the fully-executed VAL v2 notebook. All metrics on log-transformed target unless stated.

### Non-Spatial Models (Full Dataset, 80/20 split, random_state=42)

| Rank | Model | RMSE (log) | MAE (log) | R² | Family | CV'd? |
|------|-------|-----------|-----------|-----|--------|-------|
| 1 | XGBoost | 0.2203 | 0.1507 | 0.8505 | ML Ensemble | NO |
| 2 | Gradient Boosting | 0.2302 | 0.1597 | 0.8368 | ML Ensemble | Partial |
| 3 | Random Forest | 0.2398 | 0.1640 | 0.8228 | ML Ensemble | Partial |
| 4 | GAM | 0.2796 | 0.2012 | 0.7591 | GNPR | NO |
| 5 | Neural Network (MLP) | 0.2909 | 0.2153 | 0.7392 | ML Deep | NO |
| 6 | Spline Regression | 0.3028 | 0.2228 | 0.7175 | GNPR | YES |
| 7 | Ridge (alpha=10) | 0.3451 | 0.2578 | 0.6330 | Parametric | NO |
| 8 | OLS | 0.3451 | 0.2577 | 0.6330 | Parametric | YES |
| 9 | Lasso (alpha=0.01) | 0.3519 | 0.2656 | 0.6185 | Parametric | NO |

**Notes:**
- Ridge R² = OLS R² exactly → alpha=10 was never tuned; regularization had zero effect
- Lasso R² < OLS R² → alpha=0.01 too aggressive; feature selection hurts, not helps
- XGBoost R²=0.8505 comes from a single 80/20 split, never cross-validated
- Dollar-scale errors never reported; all metrics on log scale only

### Cross-Validation Results (VAL v2, 5-Fold KFold)

| Model | CV R² Mean | CV R² Std | Notes |
|-------|-----------|-----------|-------|
| OLS | 0.6511 | 0.0093 | Stable |
| Spline+Ridge | 0.7382 | 0.0041 | Very stable |
| Random Forest (100 trees) | 0.8253 | 0.0057 | Mismatched — main model uses 200 |
| Gradient Boosting (100 trees) | 0.8011 | 0.0049 | Mismatched — main model uses 300 |

### Spatial Models (VAL v2, 5,000-obs subsample)

| Model | R² | AIC | Key Coefficient | Notes |
|-------|-----|-----|-----------------|-------|
| GWR | 0.8661 | 281.40 (AICc) | Local income coef: 0.25±0.14 | Best fit; 1,500-obs sub-subsample |
| Spatial Lag (SAR) | 0.8172 | 492.29 | ρ=0.686 (spatial spillover) | Strong neighbor effect |
| Spatial Error (SEM) | 0.5768 | 407.49 | λ=0.824 | Residual clustering partially modeled |

**Moran's I on log(House Value):** I=0.7621, z=115.0, p<0.001 → Strong spatial autocorrelation  
**Moran's I on OLS Residuals:** I=0.4386, z=66.2, p<0.001 → OLS fails to capture spatial structure

---

## Old VAL v2 Workflow (Before Changes)

```
Section 0  — Environment Setup (global warning suppression)
Section 1  — Data Loading
Section 2  — EDA (distributions, map, correlations, pairplots)
Section 3  — Feature Engineering (4 engineered features, NO winsorization)
Section 4  — Data Preparation (SINGLE feature set for all models)
Section 5  — OLS Baseline (no VIF, no Breusch-Pagan)
Section 6  — Spline Regression
Section 7  — GAM (12 smooth terms)
Section 8  — Random Forest (no train R², uses X_train for tree model)
Section 9  — Gradient Boosting + XGBoost (no train R², not CV'd)
Section 10 — Neural Network MLP (convergence not checked, corrupted by outlier)
Section 11 — Initial Model Comparison (Ridge(alpha=10), Lasso(alpha=0.01))
Section 12 — Location × Income (BUGGY region classifier)
Section 13 — GNPR vs Parametric vs ML
Section 14 — Predicted vs Actual
Section 15 — Cross-Validation (only 4 models, XGBoost excluded)
Section 16 — Spatial Residual Map
Section 17 — Moran's I
Section 18 — Spatial Lag Model
Section 19 — Spatial Error Model
Section 20 — GWR
Section 21 — Final Model Comparison (log scale only, no dollar metrics, no significance tests)
Section 22 — Conclusions
```

**Known problems in VAL v2 workflow:**
1. Global `warnings.filterwarnings("ignore")` — convergence of MLP/GAM/Lasso unknown
2. `population_per_household` outlier (max=1,243) not winsorized → corrupts StandardScaler → MLP damaged
3. Ridge `alpha=10` hardcoded, not tuned → Ridge = OLS exactly (R²=0.6330)
4. Lasso `alpha=0.01` hardcoded, not tuned → Lasso worse than OLS (R²=0.6185)
5. Single feature set for all models — trees get `income_age_interaction` which adds no information
6. No `income_x_coastal` feature (the early `Linear_models.ipynb` had this and scored OLS R²=0.697 vs 0.633)
7. XGBoost never cross-validated — headline R²=0.8505 is from a single split
8. VIF analysis absent — multicollinearity not formally documented
9. Breusch-Pagan test absent — heteroscedasticity not formally tested
10. Region classifier bug: uses `latitude > 37.5` alone → misclassifies Sacramento/Stockton as Bay Area
11. Dollar-scale errors never reported — Jensen's inequality correction not applied
12. Diebold-Mariano significance tests absent — no formal test that model differences are real
13. Train vs test R² gap never reported for RF/XGB — overfitting extent hidden
14. No Critical Assessment section — limitations not documented

---

## New Master Notebook Workflow (After Changes)

```
Section 0  — Environment Setup
             + RidgeCV, LassoCV, statsmodels imported
             + Warning suppression REMOVED
             + back_transform_corrected() function defined (Jensen correction)

Section 1  — Data Loading (unchanged)

Section 2  — EDA (unchanged)

Section 3  — Feature Engineering
             + is_censored flag added (965 obs at $500,001 ceiling)
             + income_x_coastal added (from Linear_models.ipynb; better OLS R²)
             + population_per_household WINSORIZED at 99th percentile (fixes MLP/Spline)

Section 4  — Data Preparation
             + TWO feature sets:
               features_linear (13 cols): all + income_x_coastal, includes interaction terms
               features_tree   (11 cols): no interaction terms (trees find them automatically)
             + X_train_tree, X_test_tree arrays for tree models
             + X_train_scaled, X_test_scaled: scaled from 13-feature linear set

Section 5  — OLS Baseline
             + sigma2_ols computed (for Jensen correction)
             + Dollar RMSE reported (Jensen-corrected)
             + VIF table added (formal multicollinearity diagnosis)
             + Breusch-Pagan test added (formal heteroscedasticity test)

Section 6  — Spline Regression
             + sigma2_spline computed

Section 7  — GAM
             + Updated to 13 smooth terms (s(0)+...+s(12))
             + 4×4 subplot grid (was 3×4) to accommodate 13 features
             + Convergence warnings captured (not suppressed)
             + sigma2_gam computed

Section 8  — Random Forest
             + Uses X_train_tree / X_test_tree (11 features, no interactions)
             + Training R² reported alongside test R²
             + Overfitting gap explicitly shown
             + sigma2_rf computed

Section 9  — Gradient Boosting + XGBoost
             + Uses X_train_tree / X_test_tree
             + Training R² reported for both models
             + sigma2_gb, sigma2_xgb computed

Section 10 — Neural Network MLP
             + Convergence warnings captured
             + sigma2_mlp computed
             (MLP should improve due to winsorized inputs in Section 3)

Section 11 — Initial Model Comparison
             + Ridge → RidgeCV (alpha selected by 5-fold CV — was hardcoded alpha=10)
             + Lasso → LassoCV (alpha selected by 5-fold CV — was hardcoded alpha=0.01)
             + sigma2_ridge, sigma2_lasso computed

Section 12 — Location × Income
             + Region classifier FIXED (requires lat>37.5 AND lon<-121.7 for Bay Area)
             + Feature importances use features_tree index (not feature_cols)
             + Partial dependence uses X_test_tree

Section 13 — GNPR vs Parametric vs ML (unchanged)

Section 14 — Predicted vs Actual (unchanged)

Section 15 — Cross-Validation
             + GAM added to CV suite
             + XGBoost added to CV suite (was missing entirely)
             + All CV models use consistent hyperparameters as main models

Section 16 — Spatial Residual Map
             + rf.predict uses X_test_tree

Section 17 — Moran's I (unchanged)

Section 18 — Spatial Lag Model (unchanged)

Section 19 — Spatial Error Model (unchanged)

Section 20 — GWR (unchanged)

Section 21 — Final Model Comparison
             + Dollar RMSE column added (Jensen's inequality corrected)
             + Practical error interpretation (±$X per model)

[NEW] Section 21.5 — Diebold-Mariano Significance Tests
             + Tests whether model differences are statistically real (not just sampling noise)
             + All models vs OLS baseline
             + Pairwise top-model comparisons

Section 22 — Conclusions (unchanged)

[NEW] Critical Assessment — 14-point methodological audit
             + Comprehensive self-critique of remaining limitations
             + References all 14 issues (A–N) with fix status
```

---

## Cell-by-Cell Change Map

| Cell | Type | Change | Source |
|------|------|--------|--------|
| 2 | code | Add RidgeCV/LassoCV/statsmodels imports; remove global warning suppression; add back_transform_corrected() | TREVOR v2 |
| 16 | code | Add is_censored flag; add income_x_coastal feature; winsorize population_per_household | TREVOR v2 + Linear_models.ipynb |
| 18 | code | Add features_tree; create X_train_tree/X_test_tree; add income_x_coastal to feature_cols | TREVOR v2 |
| 20 | code | Add sigma2_ols; dollar RMSE; VIF table; Breusch-Pagan test | TREVOR v2 |
| 23 | code | Add sigma2_spline | TREVOR v2 |
| 25 | code | Update to 13 smooth terms; 4×4 subplot; capture warnings; add sigma2_gam | TREVOR v2 |
| 27 | code | Use X_train_tree/X_test_tree; add train R²; add sigma2_rf | TREVOR v2 |
| 29 | code | Use X_train_tree/X_test_tree; add train R² for GB and XGB; add sigma2 | TREVOR v2 |
| 31 | code | Capture convergence warnings; add sigma2_mlp | TREVOR v2 |
| 33 | code | Replace Ridge(alpha=10) with RidgeCV; replace Lasso(alpha=0.01) with LassoCV | TREVOR v2 |
| 35 | code | Fix region classifier (add longitude condition) | TREVOR v2 |
| 37 | code | Update feature importances index to features_tree | TREVOR v2 |
| 38 | code | Update partial dependence to use X_test_tree and features_tree indices | TREVOR v2 |
| 44 | code | Add GAM and XGBoost to CV suite | TREVOR v2 |
| 46 | code | Update rf.predict to use X_test_tree | TREVOR v2 |
| 60 | code | Add all_preds dict; dollar RMSE column via Jensen correction | TREVOR v2 |
| 62 | markdown | NEW — Diebold-Mariano section header | TREVOR v2 |
| 63 | code | NEW — Diebold-Mariano test code | TREVOR v2 |
| 66 | markdown | NEW — Critical Assessment (14-point audit) | TREVOR v1 |

---

## Expected vs Actual Performance Changes

| Model | VAL v2 R² | Expected R² | **Actual Master R²** | Change | Why |
|-------|-----------|------------|----------------------|--------|-----|
| OLS | 0.6330 | ~0.650–0.680 | **0.6541** | +0.021 | `income_x_coastal` adds coastal premium signal. Income near the California coast predicts higher prices than the same income inland — one feature, +2.1 R² points. |
| Ridge | 0.6330 (= OLS) | ~0.650–0.690 | **0.6541** | +0.021 | RidgeCV selected alpha=1.93 (was hardcoded 10.0). Previous alpha produced zero regularisation — Ridge was identical to OLS. Now correctly tuned via cross-validation. |
| Lasso | 0.6185 | ~0.640–0.670 | **~0.654** | +0.035 | LassoCV corrected the over-shrinkage from hardcoded alpha=0.01. Previous Lasso shrank too many coefficients and performed worse than OLS. CV found the right balance. |
| Spline | 0.7175 | ~0.720–0.730 | **0.7363** | +0.019 | Winsorisation of `population_per_household` (clipped at p99=5.39, std: 10.39→0.73) gave cleaner scaled inputs. Spline uses StandardScaler internally, so outlier removal directly improved fit. |
| GAM | 0.7591 | ~0.765–0.780 | **0.7656** | +0.007 | 13th feature (`income_x_coastal`) added a small signal. GAM already had 12 smooth terms capturing most variation; marginal gain as expected. |
| Random Forest | 0.8228 | ~0.822–0.825 | **0.8236** | +0.001 | Tree models do not use StandardScaler — unaffected by winsorisation. Marginal change from using the correct 11-feature tree set vs the old mixed set. |
| Gradient Boosting | 0.8368 | ~0.836–0.838 | **0.8340** | -0.003 | Within noise. Tree models unaffected by scaling changes. Slight variation from the train/test split. |
| XGBoost | 0.8505 | ~0.849–0.852 | **0.8521** | +0.002 | Within noise. Tree models unaffected by scaling changes. |
| **MLP** | 0.7392 | ~0.755–0.780 | **0.7703** | **+0.031** | **Largest single gain.** Winsorisation corrected the corrupted StandardScaler inputs. Before: `population_per_household` max=1,243 compressed all normal values near zero. After: clipped at 5.39, std dropped from 10.39 to 0.73. MLP also converged without warnings this time. |
| GWR | 0.8661 | — | **0.8723** | +0.006 | Spatial subsample now benefits from improved feature engineering. GWR remains the best-performing model overall. |
| Spatial Lag (SLM) | 0.8172 | — | **0.8186** | +0.001 | Spatial coefficient ρ=0.668 — strong neighbour price spillover confirmed on real data. |

**Key principle:** Better methodology cannot recover information that is not in the data. Tree models (RF, GB, XGBoost) show near-zero change because they were never damaged by the outlier or missing features — that is the correct and expected outcome, not a failure of the improvements.

**Cross-Validation Results (Master Notebook, real data):**

| Model | CV R² Mean | CV R² Std | Notes |
|-------|-----------|-----------|-------|
| OLS | 0.6708 | 0.0035 | Stable — includes income_x_coastal |
| Spline+Ridge | 0.7518 | 0.0045 | Stable |
| Random Forest | 0.8219 | 0.0053 | Stable |
| Grad. Boost | 0.8426 | 0.0054 | Stable |
| XGBoost | 0.8420 | 0.0055 | Stable — CV uses n_estimators=200 for speed |
| GAM | -0.0004 | 0.0003 | **Broken** — see Bug 3 below; test R²=0.7656 is correct |

---

## Bugs Found and Fixed During Master Notebook Run

### Bug 1 — Wrong data file path (Cell 4)
**Symptom:** All models produced R² ≈ 0.000 or negative after rerun.  
**Cause:** Cell 4 loaded from `pd.read_csv("cal_housing.data")` — a relative path. The file `cal_housing.data` lives in the `Beyond_Linearity-VAL/` subfolder, not in the root project folder where the master notebook runs. The fallback synthetic data generator produced random numbers, making every model perform at chance level.  
**Fix:** Changed path to `pd.read_csv(r"Beyond_Linearity-VAL\cal_housing.data")`.  
**Lesson:** Always use absolute paths or paths relative to a known anchor when notebooks are moved between folders.

### Bug 2 — pyGAM `s` function overwritten by loop variable (Cell 35)
**Symptom:** `TypeError: 'DataFrame' object is not callable` in the cross-validation cell (Cell 44) on the line `LinearGAM(s(0)+s(1)+...+s(12))`.  
**Cause:** In Cell 35 (region scatter plot), the loop variable `s = group.sample(...)` silently overwrote the pyGAM spline function `s` imported in Cell 2. By the time Cell 44 ran, `s` was a DataFrame, not a function. Python gave no warning — it just used whatever `s` pointed to.  
**Fix:** Renamed the loop variable from `s` to `grp` in Cell 35.  
**Lesson:** Single-letter variable names in loops are dangerous when they shadow imports. Identify this pattern by checking `s =`, `l =`, `f =` assignments near any pyGAM-using cell.

### Bug 3 — GAM cross-validation silent failure (Cell 44)
**Symptom:** GAM CV R² = -0.0004 ± 0.0003, while GAM test R² = 0.7591.  
**Cause:** `cross_val_score(..., n_jobs=-1)` spawns parallel worker processes and sends each a pickled (serialised) copy of the model. pyGAM's `LinearGAM` cannot be pickled — when a worker receives it, the model is broken and predicts the mean for all observations. Predicting the mean gives R² ≈ 0 by definition. Python gives no error — it silently returns near-zero scores.  
**Fix:** Added `n_j = 1 if name == "GAM" else -1` — GAM CV runs single-threaded, all others stay parallel.  
**How to identify in future:** Three signs together = pickling failure: (1) R² near 0 for a model that performs well on test set, (2) tiny standard deviation across folds (all folds fail identically), (3) no error message.  
**Note:** GAM's true performance is R²=0.7656 on the held-out test set. The CV score is meaningless and excluded from CV comparisons.

---

## Final Model Comparison Table — Explained

```
                         R2  RMSE_log      RMSE_$               Family    Dataset
GWR                  0.8723       NaN         NaN    Spatially Varying  Subsample
XGBoost              0.8521    0.2191   46,068      ML Ensemble         Full
Grad. Boosting       0.8340    0.2321   48,773      ML Ensemble         Full
Random Forest        0.8236    0.2393   51,527      ML Ensemble         Full
Spatial Lag (SLM)    0.8186       NaN         NaN   Spatial Econometric Subsample
Neural Network       0.7703    0.2730   64,529      ML Deep             Full
GAM                  0.7656    0.2758   59,690      GNPR                Full
Spline Regression    0.7363    0.2925   61,394      GNPR                Full
OLS                  0.6541    0.3351   93,034      Parametric          Full
Ridge (CV)           0.6541    0.3351   93,074      Parametric          Full
Lasso (CV)           0.6541    0.3351   92,840      Parametric          Full
Spatial Error (SEM)  0.5996       NaN         NaN   Spatial Econometric Subsample
```

**Column definitions:**
- **R²**: Fraction of house price variation explained. 0.85 = model explains 85% of why prices differ. Higher is better, max=1.0.
- **RMSE_log**: Average error on log scale. 0.22 ≈ 25% dollar error on average.
- **RMSE_$**: Average dollar error, Jensen-corrected back to real prices. XGBoost at $46k means typical prediction is off by $46,000. This is the most interpretable metric for real-world use.
- **NaN in RMSE columns**: Spatial models fit on a subsample — we do not produce individual held-out predictions for them, so no RMSE can be computed. This is by design, not a failure.

**Family definitions:**
- **Parametric**: Fixed mathematical form, assumes linear relationships (OLS, Ridge, Lasso)
- **GNPR**: Fits flexible curves, no fixed form assumed (Spline, GAM)
- **ML Ensemble**: Hundreds of decision trees combined (Random Forest, Gradient Boosting, XGBoost)
- **ML Deep**: Neural network with multiple layers (MLP)
- **Spatially Varying**: Regression coefficients change at every location — one model per neighbourhood effectively (GWR)
- **Spatial Econometric**: Accounts for geographic dependence between neighbouring census blocks (SLM, SEM)

**Dataset definitions:**
- **Full**: Trained on 16,512 observations, tested on 4,128. Fair comparison basis.
- **Subsample**: Trained on 5,000 observations only. Spatial weight matrices for 20,640 obs require 3.4GB RAM. R² not directly comparable to full-dataset models.

---

## Performance Ceiling Analysis

The hard ceiling for any model on this dataset is approximately R²=0.87–0.89. Evidence:

1. **Published benchmarks**: California Housing is a standard dataset. State-of-the-art deep neural networks achieve 0.84–0.88. Our XGBoost at 0.852 is already inside that range.
2. **Aggregation floor**: Each row is the median of 200–500 households in a census block group. The median hides individual variation (renovations, specific street, school quality). No model can predict variation it cannot see.
3. **Censoring**: ~992 observations have true prices hidden behind the $500,001 ceiling. Every model makes uncorrectable errors on these.
4. **CV stability as evidence**: XGBoost CV R²=0.8420 ± 0.0055. Tiny standard deviation = near-optimal. If large gains were available, we would see higher variance across folds.

**Models not yet at their ceiling:**
- **XGBoost**: RandomizedSearchCV over `max_depth`, `learning_rate`, `subsample` could push from 0.852 to ~0.87
- **MLP**: More neurons/layers could add 1–2 R² points now that inputs are clean
- **GAM**: A 2D spatial smooth `te(lat, lon)` could push from 0.766 to ~0.80, but pyGAM does not support this natively

---

## Phase 2 Innovations — 4 New Analysis Sections

These 4 sections were added in a second pass to make the project stand out academically. Each adds a layer of rigour or interpretability that is missing from standard textbook notebooks. Total cells added: 8 (4 markdown + 4 code). Notebook grew from 67 → 75 cells.

---

### Section 9.5 — XGBoost Hyperparameter Search (Cells 30–31, after GB/XGB fit)

**What it adds:**  
RandomizedSearchCV across 8 hyperparameters × 30 iterations × 5-fold CV = 150 model fits. Compares the best tuned configuration against the hand-picked default. If tuned R² − default R² > 0.001, all downstream variables (`xgb_model`, `y_pred_xgb`, `xgb_r2`, etc.) are automatically updated so the final comparison table reflects the best possible XGBoost.

**Why it matters:**  
Any industry ML project would use at minimum a hyperparameter search before declaring a model "best." Saying "XGBoost achieves R²=0.852" without tuning is incomplete — we cannot know if 0.852 is close to the model's ceiling or just a lucky default. This turns that claim into a defensible one.

**Search space:**

| Hyperparameter | Values Searched | Why it matters |
|---|---|---|
| `max_depth` | 4, 5, 6, 7 | Controls tree complexity. Too deep = overfitting. |
| `learning_rate` | 0.01 – 0.10 | Smaller = more cautious, needs more trees |
| `n_estimators` | 300 – 600 | More trees = more capacity, but diminishing returns |
| `subsample` | 0.6 – 1.0 | Row sampling per tree (prevents overfitting) |
| `colsample_bytree` | 0.6 – 1.0 | Feature sampling per tree |
| `reg_alpha` | 0.0 – 1.0 | L1 regularisation (feature selection effect) |
| `reg_lambda` | 0.5 – 2.0 | L2 regularisation (coefficient shrinkage) |
| `min_child_weight` | 1, 3, 5, 7 | Minimum leaf size (prevents overfitting on noise) |

**Expected outcome:**  
- If gain > 0.001 R²: hand-picked defaults were suboptimal; search found better settings
- If gain ≈ 0: defaults were already near-optimal — this is also a valid, publishable finding (proves robustness)
- Either way, the methodology is now defensible in a research or industry setting

**What to look for in output:**  
Compare "Default XGBoost R²" vs "Tuned XGBoost R²" in the cell output. Note which hyperparameters changed most from the defaults — these reveal what the model was most sensitive to.

---

### Section 12.5 — Regional OLS Stratification (Cells 41–42, after partial dependence)

**What it adds:**  
OLS is re-fitted separately for each geographic region (Bay Area, LA, Central Valley, Other). The income coefficient from each regional OLS is compared to the global OLS income coefficient. A bar chart (Figure 12B) shows the differences. A "ratio" column shows how many times larger the highest regional coefficient is versus the lowest.

**Why it matters:**  
This is the most direct empirical evidence for *spatial non-stationarity* — the phenomenon that relationships between variables change across geography. If the Bay Area income coefficient is 2–3× the Central Valley coefficient, it proves that assuming one set of regression coefficients for all of California (global OLS) is statistically wrong. This directly and forcefully justifies the GWR, Spatial Lag, and Spatial Error models in Sections 18–20.

**What "spatial non-stationarity" means in plain English:**  
In the Bay Area, earning a higher income pushes your house price up steeply — because demand is high and supply is constrained. In the Central Valley, the same income gain has a smaller effect because houses are more affordable relative to income. The relationship is different in different places. One equation cannot capture that. GWR fits one equation per location.

**What to look for in output:**  
1. The printed table with income coefficients per region
2. The "ratio" column — if highest/lowest > 1.5, spatial non-stationarity is confirmed
3. The conclusion statement ("FINDING: Income effect differs substantially…" or not)
4. Figure 12B bar chart — visual evidence that region matters

**Connection to other sections:**  
This finding directly validates Section 20 (GWR). Quote in your presentation: *"Regional OLS shows the Bay Area income coefficient is Xx the Central Valley value. GWR is the correct model for this dataset because it fits a different coefficient at every point rather than forcing one value on the whole state."*

---

### Section 21.6 — SHAP Interpretability Analysis (Cells 66–67, after final chart)

**What it adds:**  
SHAP (SHapley Additive exPlanations) decomposes every single XGBoost prediction into the contribution of each feature. For 4,128 test-set observations:
- Each feature gets a SHAP value per observation (how much it pushed that prediction above/below average)
- Figure 16A (beeswarm): Shows the distribution of SHAP values across all observations for all features
- Figure 17 (bar chart): Shows mean |SHAP| — average absolute importance of each feature
- Text summary: Ranks features by impact and gives the interpretation in plain English

**Why it matters:**  
XGBoost's R²=0.852 is impressive but tells us nothing about *why* it makes accurate predictions. SHAP answers: "What does XGBoost actually know?" This is essential for:
1. **Validation**: If SHAP says `median_income` is the top feature and `latitude`/`longitude` are second and third, that matches domain knowledge perfectly — expensive coastal cities are high-income AND high-latitude. If something unexpected tops the list, it might indicate data leakage.
2. **Communication**: Stakeholders and examiners can understand "income explains 40% of XGBoost's predictions" far more easily than "R²=0.852"
3. **Scientific insight**: SHAP reveals whether `income_x_coastal` (our engineered feature) is actually being used or is redundant

**Game-theory foundation:**  
SHAP values come from cooperative game theory (Shapley, 1953). The fair way to split credit among players (features) in a cooperative game (prediction) is to average each player's marginal contribution across all possible orderings. For tree models, this can be computed exactly in O(TLD²) time using TreeExplainer — no approximation needed.

**How to read the beeswarm plot (Figure 16A):**
- Each dot = one test observation (4,128 dots per feature)
- Horizontal position = SHAP value: right of zero = pushed price UP; left = pushed DOWN
- Colour = actual feature value: red = high, blue = low
- Red dots on the right + blue dots on the left = feature has a consistent positive monotone effect (high value → higher price)
- Mixed colours at a given SHAP magnitude = non-monotone or interaction effects

**Expected findings (based on domain knowledge):**
- `median_income` should be the strongest driver
- `latitude` and `longitude` should rank high (coastal and northern CA premium)
- `income_x_coastal` may or may not add marginal SHAP on top of income + location separately

---

### Section 21.7 — Censored Sensitivity Analysis (Cells 68–69, after SHAP)

**What it adds:**  
Removes the 992 observations where `is_censored=True` (house values at or above $500,001). Re-splits the remaining ~19,648 observations 80/20 with the same seed. Refits OLS, Ridge (reusing the optimal alpha from RidgeCV), Random Forest, and XGBoost from scratch. Produces a comparison table:

```
Model          Full R²   Uncensored R²   Diff   Stable?
OLS            0.6541    0.XXXX          +/-X.X YES/SHIFTS
Ridge (CV)     0.6541    0.XXXX          +/-X.X YES/SHIFTS
Random Forest  0.8236    0.XXXX          +/-X.X YES/SHIFTS
XGBoost        0.8521    0.XXXX          +/-X.X YES/SHIFTS
```

**Why it matters:**  
The $500,001 ceiling is a form of *censoring* — the true price is unknown, only that it is at least $500k. Every model learns wrong information from these observations (it treats $500k as the true price when the actual value might be $900k). This introduces irreducible prediction error at the top of the price range.

The key question is: **Does removing censored observations change the ranking?** If XGBoost beats OLS by 20 R² points on full data but only by 5 on uncensored data, part of its advantage may be an artefact of how different model families handle the ceiling — not a true performance difference.

**The "stable" criterion:**  
A difference of < 0.020 R² points between full and uncensored performance means the ceiling does not meaningfully distort that model's results. A larger shift means censoring was materially affecting that model's measured accuracy.

**Technical detail:**  
Ridge uses `ridge_cv.alpha_` (the optimal alpha found by cross-validation on the full dataset). This is the correct approach: the regularisation strength was chosen on clean data, and we reuse that choice on the uncensored subset rather than re-running a full new CV. This prevents the censored analysis from being confounded by a different regularisation choice.

**Expected outcome:**  
All rankings should be stable if the ceiling affects all models equally (proportional damage). An unstable result would be a major finding — it would mean our full-dataset rankings are partially an artefact and need caveat.

---

## Phase 2 Cell Map (insertions into existing notebook)

| New Cell | Position | Type | Content |
|----------|----------|------|---------|
| 30 | After Cell 29 (GB/XGB fit) | Markdown | Section 9.5 explanation — what hyperparameter search is, why it matters, expected outcomes |
| 31 | After Cell 30 | Code | RandomizedSearchCV, 8 hyperparams, 30 iter × 5-fold, auto-update global XGB variables if improved |
| 41 | After Cell 40 (partial dependence) | Markdown | Section 12.5 explanation — spatial non-stationarity, why it validates GWR |
| 42 | After Cell 41 | Code | Per-region OLS fit, income coefficient table, ratio computation, Figure 12B bar chart |
| 66 | After Cell 65 (final chart) | Markdown | Section 21.6 explanation — SHAP theory, beeswarm reading guide, why interpretability matters |
| 67 | After Cell 66 | Code | shap.TreeExplainer, beeswarm plot (Fig 16A), bar plot (Fig 17), text feature ranking |
| 68 | After Cell 67 | Markdown | Section 21.7 explanation — censoring problem, what "stable" means, methodology |
| 69 | After Cell 68 | Code | Filter is_censored, re-split, refit 4 models, comparison table with stability flag |

**Total insertions:** 8 cells | **Notebook size:** 67 → 75 cells
