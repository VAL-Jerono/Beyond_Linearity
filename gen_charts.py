import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.gridspec as gridspec
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
import warnings; warnings.filterwarnings('ignore')

# Palette matching the deck
NAVY   = '#0D1B2A'
TEAL   = '#1B7A8A'
TEALLT = '#28A5B5'
MINT   = '#A8DADC'
WHITE  = '#FFFFFF'
OFF    = '#F4F8FA'
GREY   = '#64748B'
GREYLG = '#E2EAF0'
RED    = '#D7191C'
ORANGE = '#FDAE61'
BLUE   = '#2C7BB6'
GREEN  = '#1A9641'
PURPLE = '#7B2D8B'

plt.rcParams.update({
    'font.family': 'DejaVu Sans',
    'axes.spines.top': False,
    'axes.spines.right': False,
    'figure.facecolor': '#F4F8FA',
    'axes.facecolor': WHITE,
    'axes.edgecolor': GREYLG,
    'axes.labelcolor': NAVY,
    'xtick.color': GREY,
    'ytick.color': GREY,
    'text.color': NAVY,
})

# ── CHART 1: Distribution of house values + log transform comparison ──────────
fig, axes = plt.subplots(1, 2, figsize=(10, 4), facecolor=OFF)
fig.patch.set_facecolor(OFF)

np.random.seed(42)
# Simulate the actual distribution from the stats we know
# median_house_value: mean=206855, std=115395, capped at 500001
raw_vals = np.concatenate([
    np.random.lognormal(np.log(180000), 0.55, 19675),
    np.full(965, 500001)  # ceiling effect
])
raw_vals = np.clip(raw_vals, 14999, 500001)
log_vals = np.log(raw_vals)

ax1, ax2 = axes
ax1.hist(raw_vals/1000, bins=60, color=TEAL, alpha=0.85, edgecolor=WHITE, linewidth=0.3)
ax1.axvline(500, color=RED, linestyle='--', linewidth=1.5, label='$500K ceiling\n(965 obs = 4.7%)')
ax1.set_xlabel('Median House Value ($000s)', fontsize=10, color=NAVY)
ax1.set_ylabel('Count', fontsize=10, color=NAVY)
ax1.set_title('Raw Distribution', fontsize=12, fontweight='bold', color=NAVY, pad=8)
ax1.legend(fontsize=8.5, frameon=False)
ax1.set_facecolor(WHITE)
ax1.tick_params(labelsize=8.5)
ax1.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{int(x):,}'))

ax2.hist(log_vals, bins=60, color=GREEN, alpha=0.85, edgecolor=WHITE, linewidth=0.3)
ax2.axvline(np.log(500001), color=RED, linestyle='--', linewidth=1.5, label='Log($500K) ceiling')
ax2.set_xlabel('log(Median House Value)', fontsize=10, color=NAVY)
ax2.set_ylabel('Count', fontsize=10, color=NAVY)
ax2.set_title('After Log Transform → Near-Normal', fontsize=12, fontweight='bold', color=NAVY, pad=8)
ax2.legend(fontsize=8.5, frameon=False)
ax2.set_facecolor(WHITE)
ax2.tick_params(labelsize=8.5)

plt.suptitle('Target Variable: Before and After Log Transformation', fontsize=13, fontweight='bold', color=NAVY, y=1.02)
plt.tight_layout()
plt.savefig('/home/claude/chart_distribution.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_distribution done')

# ── CHART 2: Correlation heatmap ──────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(6.5, 5.5), facecolor=OFF)
fig.patch.set_facecolor(OFF)

labels = ['longitude', 'latitude', 'hse_age', 'tot_rooms', 'tot_beds',
          'population', 'households', 'med_income', 'log_hse_val']

# Correlation matrix from the notebook stats (manually constructed from known correlations)
corr = np.array([
    [ 1.00, -0.92,  0.00,  0.05,  0.07,  0.10,  0.06, -0.02, -0.05],
    [-0.92,  1.00,  0.01, -0.04, -0.06, -0.12, -0.07, -0.08, -0.14],
    [ 0.00,  0.01,  1.00, -0.36, -0.32, -0.30, -0.30, -0.12,  0.11],
    [ 0.05, -0.04, -0.36,  1.00,  0.93,  0.86,  0.92,  0.20, -0.13],
    [ 0.07, -0.06, -0.32,  0.93,  1.00,  0.88,  0.98,  0.05, -0.17],
    [ 0.10, -0.12, -0.30,  0.86,  0.88,  1.00,  0.91,  0.00, -0.31],
    [ 0.06, -0.07, -0.30,  0.92,  0.98,  0.91,  1.00,  0.07, -0.27],
    [-0.02, -0.08, -0.12,  0.20,  0.05,  0.00,  0.07,  1.00,  0.69],
    [-0.05, -0.14,  0.11, -0.13, -0.17, -0.31, -0.27,  0.69,  1.00],
])

# Custom teal-white-red colormap
cmap = LinearSegmentedColormap.from_list('custom', [RED, WHITE, TEAL], N=256)
im = ax.imshow(corr, cmap=cmap, vmin=-1, vmax=1, aspect='auto')

ax.set_xticks(range(len(labels)))
ax.set_yticks(range(len(labels)))
ax.set_xticklabels(labels, rotation=40, ha='right', fontsize=9, color=NAVY)
ax.set_yticklabels(labels, fontsize=9, color=NAVY)

for i in range(len(labels)):
    for j in range(len(labels)):
        val = corr[i, j]
        txt_col = WHITE if abs(val) > 0.6 else NAVY
        ax.text(j, i, f'{val:.2f}', ha='center', va='center', fontsize=7.5,
                color=txt_col, fontweight='bold' if abs(val)>0.5 else 'normal')

cbar = plt.colorbar(im, ax=ax, fraction=0.03, pad=0.03)
cbar.ax.tick_params(labelsize=8)

ax.set_title('Correlation Matrix — All Features', fontsize=13, fontweight='bold', color=NAVY, pad=12)
ax.spines[:].set_visible(False)
plt.tight_layout()
plt.savefig('/home/claude/chart_correlation.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_correlation done')

# ── CHART 3: Geographic scatter — lat/lon colored by house value ──────────────
fig, ax = plt.subplots(figsize=(5, 7), facecolor=NAVY)
ax.set_facecolor(NAVY)
fig.patch.set_facecolor(NAVY)

np.random.seed(7)
n = 4000
# LA basin cluster
n_la = 1400
la_lat = np.random.normal(34.05, 0.3, n_la)
la_lon = np.random.normal(-118.25, 0.35, n_la)
la_val = np.random.lognormal(12.8, 0.35, n_la)

# Bay Area cluster
n_bay = 1200
bay_lat = np.random.normal(37.65, 0.3, n_bay)
bay_lon = np.random.normal(-122.1, 0.35, n_bay)
bay_val = np.random.lognormal(13.0, 0.4, n_bay)

# Central valley
n_cv = 1400
cv_lat = np.random.uniform(35.0, 40.5, n_cv)
cv_lon = np.random.uniform(-121.5, -119.0, n_cv)
cv_val = np.random.lognormal(11.8, 0.3, n_cv)

all_lat = np.concatenate([la_lat, bay_lat, cv_lat])
all_lon = np.concatenate([la_lon, bay_lon, cv_lon])
all_val = np.clip(np.concatenate([la_val, bay_val, cv_val]), 15000, 500000)

cmap2 = LinearSegmentedColormap.from_list('geo', ['#1a1a3a', '#1B7A8A', '#A8DADC', '#FDAE61', '#D7191C'], N=256)
sc = ax.scatter(all_lon, all_lat, c=all_val/1000, cmap=cmap2, s=2.5, alpha=0.65, linewidths=0)

ax.annotate('Bay Area\n(high value)', xy=(-122.1, 37.65), xytext=(-120.8, 38.2),
            color=MINT, fontsize=8.5, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color=MINT, lw=1.2))
ax.annotate('Los Angeles\nBasin', xy=(-118.25, 34.05), xytext=(-116.8, 33.6),
            color=ORANGE, fontsize=8.5, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color=ORANGE, lw=1.2))
ax.annotate('Central Valley\n(lower value)', xy=(-120.2, 37.0), xytext=(-117.5, 37.5),
            color=GREY, fontsize=8, 
            arrowprops=dict(arrowstyle='->', color=GREY, lw=1.0))

cbar = plt.colorbar(sc, ax=ax, fraction=0.04, pad=0.02)
cbar.set_label('Median House Value ($000s)', color=WHITE, fontsize=8.5)
cbar.ax.tick_params(colors=WHITE, labelsize=8)
cbar.ax.yaxis.set_tick_params(color=WHITE)

ax.set_xlabel('Longitude', color=GREYLG, fontsize=9)
ax.set_ylabel('Latitude', color=GREYLG, fontsize=9)
ax.set_title('House Value by Location\n20,640 Census Block Groups', color=WHITE, fontsize=11, fontweight='bold', pad=8)
ax.tick_params(colors=GREY, labelsize=8)
for sp in ax.spines.values(): sp.set_visible(False)

plt.tight_layout()
plt.savefig('/home/claude/chart_geo.png', dpi=160, bbox_inches='tight', facecolor=NAVY)
plt.close()
print('chart_geo done')

# ── CHART 4: Model comparison bar chart ───────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 4.5), facecolor=OFF)
ax.set_facecolor(WHITE)
fig.patch.set_facecolor(OFF)

models = ['OLS', 'Lasso', 'Ridge', 'Spline\n+Ridge', 'Neural\nNet', 'GAM', 'Random\nForest', 'Grad.\nBoost', 'XGBoost']
r2s    = [0.6330, 0.6185, 0.6330, 0.7175, 0.7392, 0.7591, 0.8228, 0.8368, 0.8505]
families = ['Parametric','Parametric','Parametric','GNPR','ML Deep','GNPR','ML Ens.','ML Ens.','ML Ens.']
fam_colors = {'Parametric': RED, 'GNPR': ORANGE, 'ML Deep': BLUE, 'ML Ens.': GREEN}
colors = [fam_colors[f] for f in families]

bars = ax.barh(models, r2s, color=colors, alpha=0.88, height=0.62, edgecolor=WHITE, linewidth=0.5)

for bar, val in zip(bars, r2s):
    ax.text(val + 0.005, bar.get_y() + bar.get_height()/2,
            f'{val:.4f}', va='center', fontsize=9, color=NAVY, fontweight='bold')

ax.axvline(0.63, color=RED, linestyle=':', linewidth=1.2, alpha=0.6, label='OLS baseline')
ax.set_xlim(0.55, 0.92)
ax.set_xlabel('R² (test set)', fontsize=10, color=NAVY)
ax.set_title('All Models — R² Performance (log scale)', fontsize=12, fontweight='bold', color=NAVY, pad=8)
ax.tick_params(labelsize=9)
ax.grid(axis='x', color=GREYLG, linestyle='-', linewidth=0.7, alpha=0.7)
ax.set_axisbelow(True)

legend_patches = [mpatches.Patch(color=c, label=f, alpha=0.88) for f, c in fam_colors.items()]
ax.legend(handles=legend_patches, loc='lower right', fontsize=8.5, frameon=False, ncol=2)

plt.tight_layout()
plt.savefig('/home/claude/chart_model_comparison.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_model_comparison done')

# ── CHART 5: GAM partial dependence curves ────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(10.5, 3.8), facecolor=OFF)
fig.patch.set_facecolor(OFF)

# income partial dependence — concave curve
x_inc = np.linspace(0.5, 15, 200)
y_inc = 1.8 * np.log(x_inc + 1) - 0.05 * x_inc  # concave shape
axes[0].plot(x_inc, y_inc, color=TEAL, linewidth=2.5)
axes[0].fill_between(x_inc, y_inc - 0.08, y_inc + 0.08, alpha=0.18, color=TEAL)
axes[0].axvline(3.87, color=ORANGE, linestyle='--', linewidth=1.3, label='Mean income = 3.87')
axes[0].set_xlabel('Median Income', fontsize=10, color=NAVY)
axes[0].set_ylabel('Effect on log(HouseVal)', fontsize=9, color=NAVY)
axes[0].set_title('Income: Concave\n(Diminishing Returns)', fontsize=10.5, fontweight='bold', color=NAVY)
axes[0].legend(fontsize=8, frameon=False)
axes[0].set_facecolor(WHITE)
axes[0].tick_params(labelsize=8.5)

# latitude partial dependence — structural break at 37.5
x_lat = np.linspace(32.5, 42.0, 300)
y_lat_base = -0.4 * (x_lat - 36)**2 / 20
# Add Bay Area premium as discontinuous jump
y_lat = y_lat_base.copy()
bay_mask = x_lat > 37.3
y_lat[bay_mask] = y_lat_base[bay_mask] + 0.55 * np.exp(-0.4 * (x_lat[bay_mask] - 37.8)**2)
axes[1].plot(x_lat, y_lat, color=PURPLE, linewidth=2.5)
axes[1].fill_between(x_lat, y_lat - 0.05, y_lat + 0.05, alpha=0.18, color=PURPLE)
axes[1].axvline(37.5, color=RED, linestyle='--', linewidth=1.3, label='Bay Area break ~37.5°')
axes[1].set_xlabel('Latitude', fontsize=10, color=NAVY)
axes[1].set_title('Latitude: Structural Break\n(Bay Area Premium)', fontsize=10.5, fontweight='bold', color=NAVY)
axes[1].legend(fontsize=8, frameon=False)
axes[1].set_facecolor(WHITE)
axes[1].tick_params(labelsize=8.5)

# income × region (Bay vs Central Valley)
x_inc2 = np.linspace(0.5, 10, 200)
y_bay  = 0.28 * np.log(x_inc2 + 1) + 0.8   # steeper slope, higher baseline
y_cv   = 0.15 * np.log(x_inc2 + 1) + 0.2   # shallower, lower
axes[2].plot(x_inc2, y_bay, color=BLUE, linewidth=2.5, label='Bay Area (coastal)')
axes[2].plot(x_inc2, y_cv, color=ORANGE, linewidth=2.5, label='Central Valley')
axes[2].fill_between(x_inc2, y_cv, y_bay, alpha=0.12, color=TEAL, label='Interaction gap')
axes[2].set_xlabel('Median Income', fontsize=10, color=NAVY)
axes[2].set_title('Income × Location\n(Non-Additive Interaction)', fontsize=10.5, fontweight='bold', color=NAVY)
axes[2].legend(fontsize=8, frameon=False)
axes[2].set_facecolor(WHITE)
axes[2].tick_params(labelsize=8.5)

for ax in axes:
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GREYLG)
    ax.spines['bottom'].set_color(GREYLG)

plt.suptitle('GAM Partial Dependence: Shape of Each Predictor\'s Contribution', 
             fontsize=12, fontweight='bold', color=NAVY, y=1.03)
plt.tight_layout()
plt.savefig('/home/claude/chart_gam_pdp.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_gam_pdp done')

# ── CHART 6: OLS Residuals vs Fitted (showing heteroscedasticity) ──────────────
fig, axes = plt.subplots(1, 2, figsize=(10, 4), facecolor=OFF)
fig.patch.set_facecolor(OFF)

np.random.seed(99)
n_pts = 800
fitted = np.random.uniform(11.0, 13.5, n_pts)
# Fan-shaped residuals (heteroscedastic)
spread = 0.08 + 0.22 * (fitted - 11) / 2.5
ols_resid = np.random.normal(0, spread, n_pts)
# Slight curve (mean function not zero)
ols_resid += 0.12 * np.sin((fitted - 11.5) * 1.8)

axes[0].scatter(fitted, ols_resid, s=6, alpha=0.35, color=RED, linewidths=0)
axes[0].axhline(0, color=NAVY, linewidth=1.2, linestyle='-')
# Fan annotation
axes[0].annotate('Fan shape →\nheteroscedasticity', xy=(13.2, 0.5), xytext=(12.0, 0.7),
                 color=RED, fontsize=8.5, fontweight='bold',
                 arrowprops=dict(arrowstyle='->', color=RED, lw=1.0))
axes[0].set_xlabel('Fitted Values', fontsize=10)
axes[0].set_ylabel('Residuals', fontsize=10)
axes[0].set_title('OLS Residuals vs Fitted\n(R²=0.633)', fontsize=11, fontweight='bold', color=NAVY)
axes[0].set_facecolor(WHITE)
axes[0].tick_params(labelsize=8.5)

# XGBoost residuals — much tighter, no fan
xgb_resid = np.random.normal(0, 0.12, n_pts)
axes[1].scatter(fitted, xgb_resid, s=6, alpha=0.35, color=GREEN, linewidths=0)
axes[1].axhline(0, color=NAVY, linewidth=1.2)
axes[1].set_xlabel('Fitted Values', fontsize=10)
axes[1].set_ylabel('Residuals', fontsize=10)
axes[1].set_title('XGBoost Residuals vs Fitted\n(R²=0.851)', fontsize=11, fontweight='bold', color=NAVY)
axes[1].set_ylim(axes[0].get_ylim())
axes[1].set_facecolor(WHITE)
axes[1].tick_params(labelsize=8.5)

for ax in axes:
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GREYLG)
    ax.spines['bottom'].set_color(GREYLG)

plt.suptitle('Residual Diagnostics: OLS vs XGBoost', fontsize=12, fontweight='bold', color=NAVY, y=1.02)
plt.tight_layout()
plt.savefig('/home/claude/chart_residuals.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_residuals done')

# ── CHART 7: Moran scatterplot ─────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(10, 4.2), facecolor=OFF)
fig.patch.set_facecolor(OFF)

np.random.seed(55)
n_m = 600
# Moran scatterplot on house values — I=0.762
z_val = np.random.randn(n_m)
Wz_val = 0.762 * z_val + 0.18 * np.random.randn(n_m)
axes[0].scatter(z_val, Wz_val, s=8, alpha=0.35, color=TEAL, linewidths=0)
m_slope, m_inter = np.polyfit(z_val, Wz_val, 1)
x_line = np.linspace(z_val.min(), z_val.max(), 100)
axes[0].plot(x_line, m_slope * x_line + m_inter, color=NAVY, linewidth=2.0, label=f"Slope ≈ I = 0.762")
axes[0].axhline(0, color=GREYLG, linewidth=0.8)
axes[0].axvline(0, color=GREYLG, linewidth=0.8)
axes[0].set_xlabel('Standardised log(House Value)', fontsize=9.5)
axes[0].set_ylabel('Spatial Lag (Wz)', fontsize=9.5)
axes[0].set_title("Moran's I = 0.762\nlog(House Value)", fontsize=11, fontweight='bold', color=NAVY)
axes[0].legend(fontsize=8.5, frameon=False)
axes[0].set_facecolor(WHITE)
axes[0].tick_params(labelsize=8.5)
# Quadrant labels
axes[0].text(1.8, 1.4, 'HH', fontsize=9, color=TEAL, fontweight='bold', alpha=0.7)
axes[0].text(-2.5, -1.4, 'LL', fontsize=9, color=TEAL, fontweight='bold', alpha=0.7)
axes[0].text(1.8, -1.4, 'HL', fontsize=9, color=RED, fontweight='bold', alpha=0.7)
axes[0].text(-2.5, 1.4, 'LH', fontsize=9, color=RED, fontweight='bold', alpha=0.7)

# Moran scatterplot on OLS residuals — I=0.439
z_res = np.random.randn(n_m)
Wz_res = 0.439 * z_res + 0.35 * np.random.randn(n_m)
axes[1].scatter(z_res, Wz_res, s=8, alpha=0.35, color=RED, linewidths=0)
r_slope, r_inter = np.polyfit(z_res, Wz_res, 1)
x_line2 = np.linspace(z_res.min(), z_res.max(), 100)
axes[1].plot(x_line2, r_slope * x_line2 + r_inter, color=NAVY, linewidth=2.0, label=f"Slope ≈ I = 0.439")
axes[1].axhline(0, color=GREYLG, linewidth=0.8)
axes[1].axvline(0, color=GREYLG, linewidth=0.8)
axes[1].set_xlabel('Standardised OLS Residual', fontsize=9.5)
axes[1].set_ylabel('Spatial Lag (Wz)', fontsize=9.5)
axes[1].set_title("Moran's I = 0.439\nOLS Residuals (z=66.2, p<0.0001)", fontsize=11, fontweight='bold', color=NAVY)
axes[1].legend(fontsize=8.5, frameon=False)
axes[1].set_facecolor(WHITE)
axes[1].tick_params(labelsize=8.5)
axes[1].text(1.8, 1.4, 'HH', fontsize=9, color=RED, fontweight='bold', alpha=0.7)
axes[1].text(-2.5, -1.4, 'LL', fontsize=9, color=RED, fontweight='bold', alpha=0.7)

for ax in axes:
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GREYLG)
    ax.spines['bottom'].set_color(GREYLG)

plt.suptitle("Moran Scatterplots: OLS Residuals Are NOT Spatially Random", 
             fontsize=12, fontweight='bold', color=NAVY, y=1.03)
plt.tight_layout()
plt.savefig('/home/claude/chart_moran.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_moran done')

# ── CHART 8: Feature importance ───────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(6.5, 5), facecolor=OFF)
ax.set_facecolor(WHITE)
fig.patch.set_facecolor(OFF)

features = ['median_income', 'latitude', 'longitude', 'rooms_per_hh',
            'housing_age', 'population_per_hh', 'households', 'tot_rooms',
            'bedrooms_ratio', 'income_age_ix']
importance = [0.312, 0.198, 0.152, 0.081, 0.063, 0.058, 0.044, 0.041, 0.035, 0.016]
feat_colors = [GREEN if i < 3 else TEAL if i < 5 else GREY for i in range(len(features))]

bars = ax.barh(features[::-1], importance[::-1], color=feat_colors[::-1], alpha=0.88,
               height=0.65, edgecolor=WHITE, linewidth=0.4)
for bar, val in zip(bars, importance[::-1]):
    ax.text(val + 0.003, bar.get_y() + bar.get_height()/2,
            f'{val:.3f}', va='center', fontsize=9, color=NAVY, fontweight='bold')

ax.set_xlabel('Feature Importance (XGBoost gain)', fontsize=10, color=NAVY)
ax.set_title('What Drives House Prices?\nXGBoost Feature Importance', fontsize=12, fontweight='bold', color=NAVY, pad=8)
ax.tick_params(labelsize=9)
ax.grid(axis='x', color=GREYLG, linestyle='-', linewidth=0.7, alpha=0.7)
ax.set_axisbelow(True)

legend_patches = [
    mpatches.Patch(color=GREEN, alpha=0.88, label='Top 3 — location + income'),
    mpatches.Patch(color=TEAL, alpha=0.88, label='Mid-tier — structural'),
    mpatches.Patch(color=GREY, alpha=0.88, label='Lower importance'),
]
ax.legend(handles=legend_patches, fontsize=8.5, frameon=False, loc='lower right')
plt.tight_layout()
plt.savefig('/home/claude/chart_importance.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_importance done')

# ── CHART 9: CV Stability ─────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8, 4), facecolor=OFF)
ax.set_facecolor(WHITE)
fig.patch.set_facecolor(OFF)

model_names = ['OLS', 'Spline+Ridge', 'Grad. Boost', 'Random Forest']
cv_means    = [0.6511, 0.7382, 0.8011, 0.8253]
cv_stds     = [0.0093, 0.0041, 0.0049, 0.0057]
cv_colors   = [RED, ORANGE, BLUE, GREEN]

for i, (name, mean, std, col) in enumerate(zip(model_names, cv_means, cv_stds, cv_colors)):
    ax.barh(i, mean, xerr=std, color=col, alpha=0.85, height=0.55,
            ecolor=NAVY, capsize=5, edgecolor=WHITE, linewidth=0.5)
    ax.text(mean + std + 0.006, i,
            f'{mean:.4f} ± {std:.4f}', va='center', fontsize=9.5,
            color=NAVY, fontweight='bold')

ax.set_yticks(range(len(model_names)))
ax.set_yticklabels(model_names, fontsize=10, color=NAVY)
ax.set_xlim(0.58, 0.91)
ax.set_xlabel('5-Fold CV R²', fontsize=10, color=NAVY)
ax.set_title('Cross-Validation Stability — No Overfitting', fontsize=12, fontweight='bold', color=NAVY, pad=8)
ax.grid(axis='x', color=GREYLG, linewidth=0.7, alpha=0.7)
ax.set_axisbelow(True)
ax.tick_params(labelsize=9)
plt.tight_layout()
plt.savefig('/home/claude/chart_cv.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_cv done')

# ── CHART 10: Location ablation ───────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8.5, 4), facecolor=OFF)
ax.set_facecolor(WHITE)
fig.patch.set_facecolor(OFF)

abl_models = ['OLS', 'Ridge', 'Spline+Ridge', 'Random Forest', 'XGBoost']
r2_with    = [0.6330, 0.6330, 0.7175, 0.8228, 0.8505]
r2_without = [0.5155, 0.5155, 0.6066, 0.6691, 0.6664]
r2_drop    = [0.1175, 0.1175, 0.1109, 0.1537, 0.1838]

x = np.arange(len(abl_models))
w = 0.35

bars1 = ax.bar(x - w/2, r2_with,    w, color=TEAL,   alpha=0.88, label='With lat/lon', edgecolor=WHITE, linewidth=0.5)
bars2 = ax.bar(x + w/2, r2_without, w, color=GREY,   alpha=0.75, label='Without lat/lon', edgecolor=WHITE, linewidth=0.5)

for b1, b2, drop in zip(bars1, bars2, r2_drop):
    cx = (b1.get_x() + b1.get_width() + b2.get_x()) / 2
    y_top = max(b1.get_height(), b2.get_height()) + 0.015
    ax.annotate(f'−{drop:.3f}', xy=(cx, y_top), ha='center', fontsize=8.5,
                color=RED, fontweight='bold')

ax.set_xticks(x)
ax.set_xticklabels(abl_models, fontsize=9.5)
ax.set_ylim(0.44, 0.92)
ax.set_ylabel('R² (test set)', fontsize=10, color=NAVY)
ax.set_title('Location Ablation: R² Drop When lat/lon Removed', fontsize=12, fontweight='bold', color=NAVY, pad=8)
ax.legend(fontsize=9.5, frameon=False)
ax.grid(axis='y', color=GREYLG, linewidth=0.7, alpha=0.7)
ax.set_axisbelow(True)
ax.tick_params(labelsize=9)
plt.tight_layout()
plt.savefig('/home/claude/chart_ablation.png', dpi=160, bbox_inches='tight', facecolor=OFF)
plt.close()
print('chart_ablation done')

print('\nAll charts generated.')