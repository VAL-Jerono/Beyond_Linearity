const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Beyond Linearity";
pres.author = "Assumpta Mwikali · Olive Mideva Muloma · Trevor Anjeyo Vuhyah · Valerie Jerono";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  navy:      "0D1B2A",
  teal:      "1B7A8A",
  tealLight: "28A5B5",
  mint:      "A8DADC",
  white:     "FFFFFF",
  offWhite:  "F4F8FA",
  grey:      "64748B",
  greyLight: "E2EAF0",
  red:       "D7191C",
  orange:    "FDAE61",
  blue:      "2C7BB6",
  green:     "1A9641",
  purple:    "7B2D8B",
  brown:     "993300",
};

// ── CHART IMAGE HELPER ───────────────────────────────────────────────────────
function chartImg(filename) {
  const fpath = `/home/claude/${filename}`;
  if (!fs.existsSync(fpath)) { console.warn(`MISSING: ${fpath}`); return null; }
  const data = fs.readFileSync(fpath);
  return "image/png;base64," + data.toString("base64");
}

// ── SHARED HELPERS ────────────────────────────────────────────────────────────
const makeShadow = () => ({ type:"outer", blur:8, offset:3, angle:135, color:"000000", opacity:0.12 });

function addCard(slide, x, y, w, h, opts={}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.white },
    line: { color: opts.border || C.greyLight, width: 1 },
    shadow: makeShadow(),
  });
}

function sectionTag(slide, label, color=C.teal) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.4, y:0.18, w:1.7, h:0.28,
    fill:{color:color}, line:{color:color, width:0},
  });
  slide.addText(label.toUpperCase(), {
    x:0.4, y:0.18, w:1.7, h:0.28,
    fontSize:7.5, bold:true, color:C.white, align:"center", valign:"middle", margin:0,
  });
}

function slideTitle(slide, title, sub=null) {
  slide.addText(title, {
    x:0.4, y:0.55, w:9.2, h:0.55,
    fontSize:26, bold:true, color:C.navy, fontFace:"Calibri",
  });
  if (sub) {
    slide.addText(sub, {
      x:0.4, y:1.1, w:9.2, h:0.3,
      fontSize:11.5, color:C.grey, fontFace:"Calibri", italic:true,
    });
  }
}

function statBox(slide, x, y, w, h, value, label, color=C.teal) {
  addCard(slide, x, y, w, h, {fill:C.white});
  slide.addShape(pres.shapes.RECTANGLE,{x,y,w,h:0.06,fill:{color},line:{color,width:0}});
  slide.addText(value, {x,y:y+0.1,w,h:h*0.55,fontSize:28,bold:true,color,align:"center",valign:"middle",fontFace:"Calibri"});
  slide.addText(label, {x,y:y+h*0.65,w,h:h*0.3,fontSize:9.5,color:C.grey,align:"center",valign:"middle",fontFace:"Calibri"});
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 1: TITLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {x:0,y:0,w:0.35,h:5.625,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addShape(pres.shapes.RECTANGLE, {x:9.65,y:0,w:0.35,h:5.625,fill:{color:C.tealLight,transparency:60},line:{color:C.tealLight,width:0}});

  s.addText("BEYOND LINEARITY", {
    x:0.6,y:0.9,w:8.8,h:1.1,
    fontSize:48,bold:true,color:C.white,fontFace:"Calibri",align:"left",charSpacing:3,
  });
  s.addText("A Nonlinear Inquiry into California Housing Prices", {
    x:0.6,y:2.1,w:8.8,h:0.5,
    fontSize:18,color:C.mint,fontFace:"Calibri",italic:true,
  });

  s.addShape(pres.shapes.RECTANGLE,{x:0.6,y:2.75,w:4.0,h:0.04,fill:{color:C.teal},line:{color:C.teal,width:0}});

  s.addText("California Housing Dataset  ·  20,640 Census Block Groups  ·  1990 U.S. Census", {
    x:0.6,y:2.95,w:8.8,h:0.3, fontSize:11,color:C.mint,fontFace:"Calibri",
  });

  s.addText([
    {text:"Assumpta Mwikali  134022    ·    Olive Mideva Muloma  135792",options:{breakLine:true}},
    {text:"Trevor Anjeyo Vuhyah  224038    ·    Valerie Jerono  222331"},
  ], {x:0.6,y:3.5,w:8.8,h:0.6,fontSize:10.5,color:"CADCFC",fontFace:"Calibri"});

  // Four acts timeline
  const acts = [
    {n:"I",  t:"Foundation",           sub:"EDA · Feature Eng · OLS Baseline"},
    {n:"II", t:"Nonlinear Models",     sub:"Splines · GAM · RF · XGBoost"},
    {n:"III",t:"Spatial Diagnostics",  sub:"Moran's I · Residual Mapping"},
    {n:"IV", t:"Spatial Econometrics", sub:"SLM · SEM · GWR · Final Compare"},
  ];
  acts.forEach((act, i) => {
    const x = 0.6 + i * 2.2;
    s.addShape(pres.shapes.RECTANGLE,{x,y:4.45,w:2.0,h:0.08,fill:{color:C.teal},line:{color:C.teal,width:0}});
    s.addText(`Act ${act.n}`, {x,y:4.57,w:2.0,h:0.25,fontSize:9,bold:true,color:C.tealLight,align:"center"});
    s.addText(act.t, {x,y:4.82,w:2.0,h:0.22,fontSize:9.5,bold:true,color:C.white,align:"center"});
    s.addText(act.sub, {x,y:5.05,w:2.0,h:0.25,fontSize:7.5,color:"CADCFC",align:"center",italic:true});
  });

  s.addShape(pres.shapes.RECTANGLE,{x:0.6,y:4.42,w:2.6,h:0.3,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addText("DSA 8301 · Statistical Inference for Big Data", {
    x:0.6,y:4.42,w:2.6,h:0.3,fontSize:8.5,bold:true,color:C.white,align:"center",valign:"middle",margin:0,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 2: RESEARCH QUESTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Overview");
  slideTitle(s,"Three Questions That Drive Everything");

  const rqs = [
    {num:"RQ 1",q:"Can ensemble nonlinear models outperform linear regression in predicting California house prices?",answer:"Yes — R² 0.633→0.851",ac:C.green},
    {num:"RQ 2",q:"What are the most important nonlinear interactions between location and income?",answer:"Income×location is non-additive",ac:C.blue},
    {num:"RQ 3",q:"Which model family — GNPR, Parametric, or Machine Learning — provides the best predictive accuracy?",answer:"Purpose-dependent hierarchy",ac:C.purple},
  ];

  rqs.forEach((rq,i) => {
    const x = 0.4 + i*3.1;
    addCard(s,x,1.55,2.9,3.6,{fill:C.white});
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.55,w:2.9,h:0.55,fill:{color:C.teal},line:{color:C.teal,width:0}});
    s.addText(rq.num,{x,y:1.55,w:2.9,h:0.55,fontSize:16,bold:true,color:C.white,align:"center",valign:"middle",margin:0});
    s.addText(rq.q,{x:x+0.15,y:2.2,w:2.6,h:2.0,fontSize:11,color:C.navy,align:"center",valign:"top",fontFace:"Calibri",wrap:true});
    s.addShape(pres.shapes.RECTANGLE,{x:x+0.1,y:4.07,w:2.7,h:0.03,fill:{color:rq.ac},line:{color:rq.ac,width:0}});
    s.addText(rq.answer,{x:x+0.1,y:4.13,w:2.7,h:0.8,fontSize:10,bold:true,color:rq.ac,align:"center",valign:"middle",wrap:true});
  });

  s.addText("The journey unfolds in four acts: Foundation → Nonlinear Models → Spatial Diagnostics → Spatial Econometrics",{
    x:0.4,y:5.28,w:9.2,h:0.27,fontSize:9.5,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 3: DATASET & EDA — Summary Statistics + Geographic Map
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"EDA · Data");
  slideTitle(s,"The Dataset: 20,640 Census Block Groups, California 1990","Each row = one block group, typically 600–3,000 people. Target: median_house_value (log-transformed).");

  statBox(s,0.4, 1.5,2.0,1.1,"20,640","Observations",C.teal);
  statBox(s,2.55,1.5,2.0,1.1,"9","Variables",C.teal);
  statBox(s,4.7, 1.5,2.0,1.1,"$206,856","Mean House Value",C.orange);
  statBox(s,6.85,1.5,2.0,1.1,"$500,001","Ceiling (965 obs)",C.red);

  const rows = [
    [{text:"Variable",options:{bold:true,color:C.white}},{text:"Mean",options:{bold:true,color:C.white,align:"center"}},{text:"Std",options:{bold:true,color:C.white,align:"center"}},{text:"Key Note",options:{bold:true,color:C.white}}],
    ["median_house_value",{text:"$206,856",options:{align:"center"}},{text:"$115,396",options:{align:"center"}},"Target — log-transformed; right-skewed with ceiling at $500,001"],
    ["median_income",{text:"3.87",options:{align:"center"}},{text:"1.90",options:{align:"center"}},"Strongest predictor (r=0.69 with log target); units = $10,000s"],
    ["longitude / latitude",{text:"−119.6 / 35.6",options:{align:"center"}},{text:"2.0 / 2.1",options:{align:"center"}},"Geographic coordinates — structural determinants of value"],
    ["housing_median_age",{text:"28.6 yrs",options:{align:"center"}},{text:"12.6",options:{align:"center"}},"Median housing age per block group"],
    ["rooms_per_household*",{text:"5.43",options:{align:"center"}},{text:"2.47",options:{align:"center"}},"Engineered ratio — more informative than raw room counts"],
  ];
  s.addTable(rows,{
    x:0.4,y:2.75,w:9.2,h:2.65,
    colW:[2.5,1.6,1.0,4.1],
    fill:{color:C.white}, border:{pt:0.5,color:C.greyLight},
    fontFace:"Calibri", fontSize:10, rowH:0.4,
    firstRowFill:C.navy, color:C.navy,
  });

  s.addText("* Feature-engineered — not in the original 1990 Census file. Section 3 adds rooms_per_household, bedrooms_per_room, population_per_household, income_age_interaction.", {
    x:0.4,y:5.47,w:9.2,h:0.22,fontSize:8.5,color:C.grey,italic:true,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 4: DISTRIBUTION ANALYSIS (chart)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"EDA · Distributions");
  slideTitle(s,"Target Variable: Why We Log-Transform","The raw distribution is right-skewed with a hard ceiling at $500,001 — a structural artefact appearing 965 times (4.7% of data).");

  const img = chartImg("chart_distribution.png");
  if (img) s.addImage({data:img, x:0.4, y:1.48, w:6.2, h:3.0});

  addCard(s,6.75,1.48,2.85,3.0,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:6.75,y:1.48,w:2.85,h:0.08,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addText("Why Log?",{x:6.75,y:1.6,w:2.85,h:0.3,fontSize:11,bold:true,color:C.navy,align:"center"});

  const logReasons = [
    ["Right skew",        "Mean ($206K) ≫ Median ($180K) — log pulls outliers closer."],
    ["Ceiling artefact",  "965 obs at $500,001 distort OLS. Log compresses the spike."],
    ["Multiplicative effects", "A $10K income rise in Beverly Hills ≠ same in Fresno. Log makes effects proportional."],
    ["Normality of errors", "Log(y) residuals are closer to normal — OLS assumptions better satisfied."],
  ];
  logReasons.forEach(([title,desc],i) => {
    s.addShape(pres.shapes.RECTANGLE,{x:6.9,y:2.04+i*0.62,w:0.05,h:0.42,fill:{color:C.teal},line:{color:C.teal,width:0}});
    s.addText(title,{x:7.05,y:2.04+i*0.62,w:2.4,h:0.22,fontSize:9.5,bold:true,color:C.navy});
    s.addText(desc,{x:7.05,y:2.26+i*0.62,w:2.4,h:0.28,fontSize:8.5,color:C.grey,wrap:true});
  });

  addCard(s,0.4,4.6,9.2,0.72,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:4.6,w:9.2,h:0.06,fill:{color:C.orange},line:{color:C.orange,width:0}});
  s.addText("Practical implication for modelling: all model outputs are in log($) — predictions must be back-transformed via exp() to return to dollar scale. The RMSE values reported throughout this analysis are in log units; multiply by ~$100K to get a rough dollar magnitude.",{
    x:0.55,y:4.73,w:8.9,h:0.52,fontSize:9.5,color:C.navy,wrap:true,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 5: GEOGRAPHIC MAP + CORRELATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"EDA · Geography");
  slideTitle(s,"Geography Is Not a Covariate — It Is a Structural Determinant","High-value properties cluster on the coast. The Central Valley is systematically low. No linear model without spatial structure can fully capture this.");

  const geoImg = chartImg("chart_geo.png");
  if (geoImg) s.addImage({data:geoImg, x:0.4, y:1.45, w:3.2, h:4.05});

  const corrImg = chartImg("chart_correlation.png");
  if (corrImg) s.addImage({data:corrImg, x:3.8, y:1.45, w:5.8, h:4.05});

  s.addText("Moran's I = 0.762 on log(House Value) — extremely strong spatial autocorrelation (z=115, p<0.0001). Nearby block groups share similar values. Any non-spatial model leaves this signal partially captured.",{
    x:0.4,y:5.57,w:9.2,h:0.27,fontSize:9.5,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 6: FEATURE ENGINEERING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Feature Eng.");
  slideTitle(s,"Four Engineered Features: Compressing Economic Geometry","Raw counts are ambiguous. Ratios encode the density and quality signal that drives value — a 10,000-room block group is unremarkable if it holds 3,000 households.");

  const feats = [
    {name:"rooms_per_household",formula:"total_rooms ÷ households",mean:"5.43",std:"2.47",insight:"Proxy for living space per unit. Large values signal luxury or low-occupancy stock. Appears in top 5 XGBoost features.",color:C.teal},
    {name:"bedrooms_per_room",formula:"total_bedrooms ÷ total_rooms",mean:"0.213",std:"0.058",insight:"Low ratio = more living/common space per bedroom → higher quality. Negative GAM effect confirms: fewer bedrooms relative to rooms → more valuable.",color:C.blue},
    {name:"population_per_household",formula:"population ÷ households",mean:"3.07",std:"10.39",insight:"Crowding proxy. High values indicate dense, lower-income block groups. SLM coefficient is significantly negative (β=−0.001, z=−8.2).",color:C.orange},
    {name:"income_age_interaction",formula:"median_income × housing_median_age",mean:"108.0",std:"74.4",insight:"Captures the joint signal: high income AND old stock = established wealth district. Negative SLM coefficient (β=−0.0004) suggests age discounts high-income value.",color:C.purple},
  ];

  feats.forEach((f,i) => {
    const col = i % 2;
    const row = Math.floor(i/2);
    const x = 0.4 + col*4.85;
    const y = 1.5 + row*1.95;
    addCard(s,x,y,4.5,1.78,{fill:C.white});
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:4.5,h:0.06,fill:{color:f.color},line:{color:f.color,width:0}});
    s.addText(f.name,{x:x+0.1,y:y+0.1,w:4.3,h:0.28,fontSize:11,bold:true,color:f.color});
    s.addText(`= ${f.formula}`,{x:x+0.1,y:y+0.4,w:4.3,h:0.25,fontSize:10,color:C.grey,italic:true,fontFace:"Consolas"});
    s.addText(`Mean: ${f.mean}   Std: ${f.std}`,{x:x+0.1,y:y+0.68,w:4.3,h:0.2,fontSize:9,color:C.grey});
    s.addText(f.insight,{x:x+0.1,y:y+0.92,w:4.3,h:0.75,fontSize:9.5,color:C.navy,wrap:true});
  });

  s.addText("Train/test split: 80/20, random_state=42. Target: log(median_house_value). Scaling applied for linear models & MLP; tree-based models receive unscaled features.",{
    x:0.4,y:5.5,w:9.2,h:0.22,fontSize:8.5,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 7: OLS BASELINE + RESIDUALS CHART
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Baseline · OLS");
  slideTitle(s,"OLS Baseline: What Linearity Can and Cannot See","R²=0.633 on log scale. Not a bad model — but its residuals reveal exactly where the nonlinear story begins.");

  addCard(s,0.4,1.5,2.2,3.6,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:1.5,w:2.2,h:0.08,fill:{color:C.red},line:{color:C.red,width:0}});
  s.addText("OLS Performance",{x:0.4,y:1.62,w:2.2,h:0.3,fontSize:11,bold:true,color:C.navy,align:"center"});
  const olsM = [["R²","0.6330",C.red],["RMSE","0.3451",C.red],["MAE","0.2577",C.red],["Adj. R²","0.6423","647E9E"]];
  olsM.forEach(([lbl,val,col],i) => {
    s.addText(lbl,{x:0.55,y:2.08+i*0.72,w:0.9,h:0.42,fontSize:11.5,color:C.grey,valign:"middle"});
    s.addText(val,{x:1.5,y:2.08+i*0.72,w:0.95,h:0.42,fontSize:20,bold:true,color:col,align:"right",valign:"middle"});
  });

  const resImg = chartImg("chart_residuals.png");
  if (resImg) s.addImage({data:resImg, x:2.8, y:1.48, w:6.8, h:3.0});

  addCard(s,0.4,5.1,9.2,0.72,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:5.1,w:9.2,h:0.06,fill:{color:C.navy},line:{color:C.navy,width:0}});
  const misses = ["Fan-shaped residuals → heteroscedasticity (OLS assumes constant variance)",
                  "Curved residual band → concave income effect OLS cannot model",
                  "Coastal clusters of positive residuals → geographic signal unabsorbed"];
  s.addText(misses.join("   ·   "),{
    x:0.55,y:5.2,w:8.9,h:0.55,fontSize:9.5,color:C.navy,wrap:true,align:"center",valign:"middle",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 8: MODEL FAMILY OVERVIEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Models");
  slideTitle(s,"Three Families, Three Epistemological Stances");

  const families = [
    {label:"Parametric",color:C.red,models:"OLS · Ridge · Lasso",what:"Produces coefficients — legible, falsifiable, policy-relevant statements about each predictor. Assumes linearity. Best R²: 0.633.",tradeoff:"Interpretability ✓   Accuracy ✗"},
    {label:"GNPR",color:C.orange,models:"Splines · GAM",what:"Relaxes linearity while preserving additive interpretability. Each predictor gets a smooth curve f(x). Asks: what is the shape of each relationship? Best R²: 0.759.",tradeoff:"Interpretability ✓   Accuracy ~"},
    {label:"ML Ensemble",color:C.blue,models:"RF · GradBoost · XGBoost",what:"Function approximators. Interactions are discovered, not declared. Maximum accuracy at cost of opacity. Explainability via SHAP/PDP. Best R²: 0.851.",tradeoff:"Interpretability ✗   Accuracy ✓"},
  ];

  families.forEach((fam,i) => {
    const x = 0.4 + i*3.2;
    addCard(s,x,1.5,3.0,3.8,{fill:C.white});
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.5,w:3.0,h:0.55,fill:{color:fam.color},line:{color:fam.color,width:0}});
    s.addText(fam.label,{x,y:1.5,w:3.0,h:0.55,fontSize:15,bold:true,color:C.white,align:"center",valign:"middle",margin:0});
    s.addText(fam.models,{x:x+0.1,y:2.18,w:2.8,h:0.28,fontSize:10,color:C.grey,align:"center",italic:true});
    s.addText(fam.what,{x:x+0.15,y:2.55,w:2.7,h:2.0,fontSize:10,color:C.navy,wrap:true,valign:"top"});
    s.addShape(pres.shapes.RECTANGLE,{x:x+0.1,y:4.95,w:2.8,h:0.03,fill:{color:fam.color},line:{color:fam.color,width:0}});
    s.addText(fam.tradeoff,{x:x+0.1,y:5.02,w:2.8,h:0.25,fontSize:9.5,bold:true,color:fam.color,align:"center"});
  });

  addCard(s,0.4,5.32,9.2,0.3,{fill:C.navy});
  s.addText("Plus: Spatial Econometrics (SLM, SEM, GWR) — explicitly modelling the geographic dependence structure all three families partially ignore.",{
    x:0.4,y:5.32,w:9.2,h:0.3,fontSize:9.5,color:C.mint,align:"center",valign:"middle",margin:0,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 9: GAM PARTIAL DEPENDENCE (chart + commentary)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"GNPR · GAM");
  slideTitle(s,"GAM Partial Dependence: The Shape of Every Relationship","R²=0.759  ·  AIC=3,777.6  ·  RMSE=0.280  —  Each curve = marginal contribution of one predictor holding all others equal");

  const pdpImg = chartImg("chart_gam_pdp.png");
  if (pdpImg) s.addImage({data:pdpImg, x:0.4, y:1.48, w:9.2, h:3.1});

  addCard(s,0.4,4.65,9.2,0.95,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:4.65,w:9.2,h:0.06,fill:{color:C.orange},line:{color:C.orange,width:0}});

  const gamFindings = [
    {col:C.orange,t:"Income",d:"Concave: marginal returns diminish above ~$38K. OLS forces a straight line through this curve — systematically under-predicting low-income and over-predicting high-income blocks."},
    {col:C.purple,t:"Latitude",d:"Sharp structural break at 37.5° N — the Bay Area premium is a discontinuity, not a smooth gradient. Confirms a distinct housing market boundary."},
    {col:C.blue,t:"Income×Location",d:"The income slope is steeper in coastal regions (Bay Area > Central Valley by ~0.13 per unit income). No additive model can represent this without an explicit interaction term."},
  ];
  gamFindings.forEach((f,i) => {
    s.addText(`${f.t}: `,{x:0.55+i*3.1,y:4.77,w:0.8,h:0.2,fontSize:9.5,bold:true,color:f.col});
    s.addText(f.d,{x:0.55+i*3.1+0.75,y:4.77,w:2.25,h:0.75,fontSize:8.5,color:C.navy,wrap:true});
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 10: FEATURE IMPORTANCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"ML · Feature Importance");
  slideTitle(s,"What Drives House Prices? XGBoost Feature Importance","median_income (31%), latitude (20%), longitude (15%) together account for 66% of the model's predictive gain.");

  const impImg = chartImg("chart_importance.png");
  if (impImg) s.addImage({data:impImg, x:0.4, y:1.45, w:5.6, h:4.05});

  addCard(s,6.2,1.45,3.4,4.05,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:6.2,y:1.45,w:3.4,h:0.08,fill:{color:C.navy},line:{color:C.navy,width:0}});
  s.addText("What This Tells Us",{x:6.2,y:1.57,w:3.4,h:0.3,fontSize:11,bold:true,color:C.navy,align:"center"});

  const insights = [
    {c:C.green,  t:"Income dominates",d:"31% of gain — the single strongest predictor. But it is concave (GAM) and location-modulated (GWR), not linear."},
    {c:C.green,  t:"Coordinates top-3",d:"latitude+longitude together = 35% of gain. Geography is not noise — it is signal. Confirms the case for spatial models."},
    {c:C.teal,   t:"rooms_per_hh: 8%",d:"Engineered feature ranks 4th. Raw room counts rank lower — the ratio compresses the informative signal."},
    {c:C.teal,   t:"housing_age: 6%",d:"Older housing stock correlates with established, high-value neighbourhoods — but effect reverses in some regions (GWR)."},
    {c:C.grey,   t:"Raw counts low",d:"total_rooms, total_bedrooms rank near bottom. Volume without context (# of households) is weak signal."},
  ];
  insights.forEach((ins,i) => {
    s.addShape(pres.shapes.OVAL,{x:6.35,y:2.04+i*0.67,w:0.18,h:0.18,fill:{color:ins.c},line:{color:ins.c,width:0}});
    s.addText(ins.t,{x:6.63,y:2.0+i*0.67,w:2.82,h:0.22,fontSize:10,bold:true,color:C.navy});
    s.addText(ins.d,{x:6.63,y:2.22+i*0.67,w:2.82,h:0.35,fontSize:9,color:C.grey,wrap:true});
  });

  s.addText("Importance = average gain in loss function per split. High importance ≠ linear effect; it means the model splits on this feature frequently and gains prediction accuracy each time.",{
    x:0.4,y:5.57,w:9.2,h:0.27,fontSize:8.5,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 11: MODEL COMPARISON CHART
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Model Comparison");
  slideTitle(s,"All Non-Spatial Models: Ranked by Performance","XGBoost leads with R²=0.851. Every step away from linearity improves accuracy — confirming RQ1 decisively.");

  const cmpImg = chartImg("chart_model_comparison.png");
  if (cmpImg) s.addImage({data:cmpImg, x:0.4, y:1.48, w:6.6, h:3.4});

  addCard(s,7.15,1.48,2.45,3.4,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:7.15,y:1.48,w:2.45,h:0.08,fill:{color:C.navy},line:{color:C.navy,width:0}});
  s.addText("Key Gaps",{x:7.15,y:1.6,w:2.45,h:0.3,fontSize:11,bold:true,color:C.navy,align:"center"});

  const gaps = [
    {from:"OLS→GAM",     delta:"+0.126",desc:"Adding smoothness\n(GNPR advantage)",color:C.orange},
    {from:"GAM→XGBoost", delta:"+0.091",desc:"Adding interactions\n(ML advantage)",color:C.blue},
    {from:"OLS→XGBoost", delta:"+0.218",desc:"Total nonlinearity\ngain over baseline",color:C.green},
  ];
  gaps.forEach((g,i) => {
    addCard(s,7.25,2.0+i*0.93,2.25,0.82,{fill:C.offWhite});
    s.addText(g.from,{x:7.3,y:2.05+i*0.93,w:2.15,h:0.22,fontSize:8.5,color:C.grey,align:"center"});
    s.addText(g.delta,{x:7.3,y:2.27+i*0.93,w:2.15,h:0.3,fontSize:20,bold:true,color:g.color,align:"center"});
    s.addText(g.desc,{x:7.3,y:2.59+i*0.93,w:2.15,h:0.28,fontSize:7.5,color:C.grey,align:"center",italic:true});
  });

  // Summary table bottom
  const tRows = [
    [{text:"Family",options:{bold:true,color:C.white}},{text:"Best R²",options:{bold:true,color:C.white,align:"center"}},{text:"Best RMSE",options:{bold:true,color:C.white,align:"center"}}],
    ["Parametric",{text:"0.633",options:{align:"center"}},{text:"0.345",options:{align:"center"}}],
    ["GNPR",      {text:"0.759",options:{align:"center",color:C.orange,bold:true}},{text:"0.280",options:{align:"center"}}],
    ["ML Ensemble",{text:"0.851",options:{align:"center",color:C.green,bold:true}},{text:"0.220",options:{align:"center",color:C.green,bold:true}}],
    ["ML Deep (MLP)",{text:"0.739",options:{align:"center"}},{text:"0.291",options:{align:"center"}}],
  ];
  s.addTable(tRows,{
    x:0.4,y:4.98,w:6.6,h:0.9,
    colW:[3.2,1.8,1.6],
    fill:{color:C.white},border:{pt:0.5,color:C.greyLight},
    fontFace:"Calibri",fontSize:10,rowH:0.18,
    firstRowFill:C.navy,color:C.navy,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 12: CV STABILITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Cross-Validation");
  slideTitle(s,"5-Fold Cross-Validation: The Results Are Not Lucky","CV stability confirms that ensemble gains are real, not a consequence of a favourable train/test split. Low σ means the model generalises.");

  const cvImg = chartImg("chart_cv.png");
  if (cvImg) s.addImage({data:cvImg, x:0.4, y:1.48, w:7.0, h:3.2});

  addCard(s,7.6,1.48,2.0,3.2,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:7.6,y:1.48,w:2.0,h:0.08,fill:{color:C.navy},line:{color:C.navy,width:0}});
  s.addText("CV Verdict",{x:7.6,y:1.6,w:2.0,h:0.3,fontSize:11,bold:true,color:C.navy,align:"center"});

  const verdicts = [
    {col:C.red,   t:"OLS",    d:"σ=0.009 — stable but low ceiling. Linearity limits performance consistently."},
    {col:C.orange,t:"Spline", d:"σ=0.004 — very stable. GNPR models generalise smoothly."},
    {col:C.blue,  t:"GBM",    d:"σ=0.005 — high accuracy, low variance. No overfitting signal."},
    {col:C.green, t:"RF",     d:"σ=0.006 — highest CV R². Confirms RQ1: ensembles win decisively."},
  ];
  verdicts.forEach((v,i) => {
    s.addShape(pres.shapes.OVAL,{x:7.72,y:2.04+i*0.65,w:0.16,h:0.16,fill:{color:v.col},line:{color:v.col,width:0}});
    s.addText(v.t,{x:7.98,y:2.0+i*0.65,w:1.5,h:0.2,fontSize:9.5,bold:true,color:v.col});
    s.addText(v.d,{x:7.98,y:2.2+i*0.65,w:1.5,h:0.38,fontSize:8,color:C.grey,wrap:true});
  });

  addCard(s,0.4,4.78,9.2,0.92,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:4.78,w:9.2,h:0.06,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addText([
    {text:"Why CV matters: ",options:{bold:true,color:C.teal}},
    {text:"A single test split could be lucky or unlucky. 5-fold CV trains on 80% of data five different ways and tests on the remaining 20% each time. If mean R² is high and σ is low, the model is genuinely learning the data-generating process — not memorising one partition."},
  ],{x:0.55,y:4.9,w:8.9,h:0.73,fontSize:9.5,color:C.navy,wrap:true});
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 13: MORAN'S I (chart + formal results)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Spatial Diagnostics");
  slideTitle(s,"Moran's I: Formally Proving What the Map Suggested","Test: are OLS residuals spatially random? z=66.2, p<0.0001. They are not. Classical regression assumptions are violated.");

  const mImg = chartImg("chart_moran.png");
  if (mImg) s.addImage({data:mImg, x:0.4, y:1.48, w:6.6, h:3.1});

  addCard(s,7.15,1.48,2.45,3.1,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:7.15,y:1.48,w:2.45,h:0.08,fill:{color:C.navy},line:{color:C.navy,width:0}});
  s.addText("Results",{x:7.15,y:1.6,w:2.45,h:0.3,fontSize:11,bold:true,color:C.navy,align:"center"});

  const moranRes = [
    {label:"I (house values)",  val:"0.762",  col:C.red},
    {label:"z-score",           val:"115.0",  col:C.red},
    {label:"I (OLS residuals)", val:"0.439",  col:C.orange},
    {label:"z-score (resid.)",  val:"66.2",   col:C.orange},
    {label:"p-value",           val:"<0.0001",col:C.navy},
    {label:"K-NN neighbours",   val:"8",      col:C.grey},
    {label:"Sample (subsample)","val":"5,000",col:C.grey},
  ];
  moranRes.forEach((r,i) => {
    s.addText(r.label,{x:7.2,y:2.07+i*0.35,w:1.5,h:0.28,fontSize:8.5,color:C.grey});
    s.addText(r.val,{x:8.7,y:2.07+i*0.35,w:0.8,h:0.28,fontSize:11,bold:true,color:r.col,align:"right"});
  });

  addCard(s,0.4,4.66,9.2,0.95,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:4.66,w:9.2,h:0.06,fill:{color:C.red},line:{color:C.red,width:0}});
  s.addText([
    {text:"What this means: ",options:{bold:true,color:C.red}},
    {text:"OLS assumes residuals are independent (ε ~ N(0,σ²I)). Moran's I=0.439 with z=66.2 shatters that assumption. Nearby block groups share unexplained variance — OLS coefficient estimates are biased and standard errors are wrong. The appropriate response is not more features. It is to model spatial dependence explicitly. That is precisely what the Spatial Lag and Spatial Error models do."},
  ],{x:0.55,y:4.77,w:8.9,h:0.75,fontSize:9.5,color:C.navy,wrap:true});
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 14: SPATIAL LAG + ERROR MODEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Spatial Models · SLM/SEM");
  slideTitle(s,"Spatial Lag & Spatial Error: Acting on Moran's Signal");

  const cards = [
    {
      name:"Spatial Lag Model (SLM / SAR)", color:C.purple,
      eq:"y = ρWy + Xβ + ε",
      param:"ρ = 0.6863  ***  (z = 69.6)",
      meaning:"68.6% of a block group's price (beyond its own features) is explained by its neighbours' prices. This is the mathematical encoding of neighbourhood spillover effects — luxury developments pull up adjacent properties.",
      aic:"AIC: 492 vs OLS 3,477 → improvement of 2,985",
      moranAfter:"Moran's I on residuals: 0.030 (reduced from 0.439)",
      when:"Use when: spatial dependence is substantive — neighbours' outcomes genuinely influence yours.",
      r2:"R² = 0.817",
    },
    {
      name:"Spatial Error Model (SEM)", color:C.brown,
      eq:"y = Xβ + u,   u = λWu + ε",
      param:"λ = 0.8236  ***",
      meaning:"82% of the residual error is spatially structured. Interpretation: omitted variables (school quality, crime index, zoning, microclimate) cluster geographically and drive this pattern. λ absorbs that clustering.",
      aic:"AIC: 407 vs OLS 3,477 → further improvement",
      moranAfter:"Moran's I on residuals: 0.651 (less effective for this dataset)",
      when:"Use when: spatial dependence reflects omitted variables, not true spillovers.",
      r2:"R² = 0.577",
    },
  ];

  cards.forEach((card,i) => {
    const x = 0.4+i*4.85;
    addCard(s,x,1.48,4.5,4.12,{fill:C.white});
    s.addShape(pres.shapes.RECTANGLE,{x,y:1.48,w:4.5,h:0.5,fill:{color:card.color},line:{color:card.color,width:0}});
    s.addText(card.name,{x,y:1.48,w:4.5,h:0.5,fontSize:12,bold:true,color:C.white,align:"center",valign:"middle",margin:0});
    s.addText(card.eq,{x:x+0.1,y:2.05,w:4.3,h:0.3,fontSize:12.5,color:card.color,align:"center",fontFace:"Consolas"});
    s.addText(card.param,{x:x+0.1,y:2.42,w:4.3,h:0.28,fontSize:10.5,bold:true,color:card.color,align:"center"});
    s.addText(card.r2,{x:x+0.1,y:2.72,w:4.3,h:0.25,fontSize:10,color:C.grey,align:"center"});
    s.addText(card.meaning,{x:x+0.15,y:3.02,w:4.2,h:1.05,fontSize:9.5,color:C.navy,wrap:true});
    s.addShape(pres.shapes.RECTANGLE,{x:x+0.15,y:4.1,w:4.2,h:0.03,fill:{color:card.color},line:{color:card.color,width:0}});
    s.addText(card.aic,{x:x+0.15,y:4.17,w:4.2,h:0.25,fontSize:9,bold:true,color:card.color});
    s.addText(card.moranAfter,{x:x+0.15,y:4.45,w:4.2,h:0.22,fontSize:9,color:C.grey,italic:true});
    s.addText(card.when,{x:x+0.15,y:4.72,w:4.2,h:0.25,fontSize:8.5,color:C.grey,italic:true});
  });

  s.addText("Verdict: SLM clearly outperforms SEM for this dataset (lower Moran's I on residuals, higher R²). Neighbourhood spillovers are a substantive process here, not merely an omitted-variable artefact.",{
    x:0.4,y:5.67,w:9.2,h:0.22,fontSize:9,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 15: GWR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"GWR");
  slideTitle(s,"Geographically Weighted Regression: Where Coefficients Live on a Map","Global R²=0.888 on subsample  ·  Bandwidth: 57 neighbours  ·  AICc=−15.83  ·  n=1,500");

  // Left card - theory
  addCard(s,0.4,1.48,4.4,3.85,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:1.48,w:4.4,h:0.08,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addText("How GWR Works",{x:0.4,y:1.6,w:4.4,h:0.3,fontSize:11.5,bold:true,color:C.navy,align:"center"});
  s.addText("yᵢ = β₀(uᵢ,vᵢ) + Σₖ βₖ(uᵢ,vᵢ) xᵢₖ + εᵢ",{
    x:0.55,y:2.0,w:4.1,h:0.35,fontSize:11,color:C.teal,align:"center",fontFace:"Consolas",
  });

  const gwrPts = [
    ["Local regression",   "A separate regression at each location, weighting nearby obs via an adaptive bisquare kernel."],
    ["Bandwidth = 57 nn",  "Each local model uses its 57 nearest neighbours. Smaller bandwidth = more local variation allowed."],
    ["Local income coeff", "Mean β(income)=0.243, range [−0.228, 0.763] — the income effect is not global. Bay Area is at the high end."],
    ["Local R² range",     "Some regions fit well (coastal), others fit poorly (inland) — revealing where omitted variables matter most."],
  ];
  gwrPts.forEach(([t,d],i) => {
    s.addShape(pres.shapes.RECTANGLE,{x:0.55,y:2.55+i*0.7,w:0.06,h:0.45,fill:{color:C.teal},line:{color:C.teal,width:0}});
    s.addText(t,{x:0.72,y:2.55+i*0.7,w:3.9,h:0.25,fontSize:10.5,bold:true,color:C.navy});
    s.addText(d,{x:0.72,y:2.8+i*0.7,w:3.9,h:0.28,fontSize:9.5,color:C.grey,wrap:true});
  });

  // Right card - coefficient table
  addCard(s,5.0,1.48,4.6,3.85,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:5.0,y:1.48,w:4.6,h:0.08,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addText("Local Coefficient Summary",{x:5.0,y:1.6,w:4.6,h:0.3,fontSize:11.5,bold:true,color:C.navy,align:"center"});

  const gwrTable = [
    [{text:"Feature",options:{bold:true,color:C.white}},{text:"Mean β",options:{bold:true,color:C.white,align:"center"}},{text:"Range",options:{bold:true,color:C.white,align:"center"}}],
    ["median_income",{text:"0.243",options:{align:"center",color:C.teal,bold:true}},{text:"[−0.23, 0.76]",options:{align:"center"}}],
    ["housing_age",{text:"0.001",options:{align:"center"}},{text:"[−0.35, 0.30]",options:{align:"center"}}],
    ["rooms_per_hh",{text:"0.052",options:{align:"center"}},{text:"[−0.64, 0.74]",options:{align:"center"}}],
    ["pop_per_hh",{text:"−0.120",options:{align:"center",color:C.red}},{text:"[−0.37, 0.24]",options:{align:"center"}}],
  ];
  s.addTable(gwrTable,{
    x:5.1,y:2.0,w:4.4,h:1.7,
    colW:[2.1,1.15,1.15],
    fill:{color:C.white},border:{pt:0.5,color:C.greyLight},
    fontFace:"Calibri",fontSize:10,rowH:0.33,
    firstRowFill:C.navy,color:C.navy,
  });

  s.addText("Key insight from the range: the income coefficient spans from −0.23 to +0.76 across California. A single global coefficient (OLS β≈0.09) is a crude average hiding enormous local heterogeneity. GWR reveals that income's power is geographically contingent — strongest in coastal high-demand zones, attenuated or even reversed in parts of the Central Valley.",{
    x:5.1,y:3.78,w:4.4,h:1.42,fontSize:9.5,color:C.navy,wrap:true,
  });

  s.addText("GWR: the only model that answers not just 'does income matter?' but 'where does it matter and how much?'",{
    x:0.4,y:5.4,w:9.2,h:0.22,fontSize:9.5,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 16: LOCATION ABLATION (chart)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Ablation");
  slideTitle(s,"What If We Remove Location Coordinates?","Controlled experiment quantifying how much lat/lon contribute. XGBoost loses 0.184 R² — the largest absolute drop of any model.");

  const ablImg = chartImg("chart_ablation.png");
  if (ablImg) s.addImage({data:ablImg, x:0.4, y:1.48, w:6.6, h:3.1});

  addCard(s,7.15,1.48,2.45,3.1,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:7.15,y:1.48,w:2.45,h:0.08,fill:{color:C.navy},line:{color:C.navy,width:0}});
  s.addText("Reading the Gap",{x:7.15,y:1.6,w:2.45,h:0.3,fontSize:11,bold:true,color:C.navy,align:"center"});

  const ablInts = [
    {col:C.red,    t:"Linear models",d:"Drop 0.117 — coordinates were OLS's only proxy for the coastal premium. Remove them: gone."},
    {col:C.green,  t:"Ensembles",    d:"Drop 0.154–0.184 — they already learned spatial patterns implicitly. Partial recovery from income + density."},
    {col:C.purple, t:"Spatial models",d:"This ablation doesn't apply. Their spatial structure lives in W (who is adjacent), not lat/lon coordinates."},
    {col:C.teal,   t:"Residual gap", d:"What ensembles still miss: amenities, school districts, zoning — the omitted-variable component λ in SEM."},
  ];
  ablInts.forEach((a,i) => {
    s.addShape(pres.shapes.OVAL,{x:7.28,y:2.07+i*0.65,w:0.15,h:0.15,fill:{color:a.col},line:{color:a.col,width:0}});
    s.addText(a.t,{x:7.53,y:2.03+i*0.65,w:1.97,h:0.22,fontSize:9.5,bold:true,color:a.col});
    s.addText(a.d,{x:7.53,y:2.25+i*0.65,w:1.97,h:0.35,fontSize:8,color:C.grey,wrap:true});
  });

  addCard(s,0.4,4.66,9.2,0.95,{fill:C.white});
  s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:4.66,w:9.2,h:0.06,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addText("Practical implication: In a privacy-constrained deployment (coordinates unavailable), XGBoost retains R²≈0.666 — substantial predictive power, but measurably degraded. For spatial models, the ablation is irrelevant: W encodes adjacency structure independently of the feature matrix X, which is precisely what makes spatial econometrics epistemologically distinct from 'just adding lat/lon as features.'",{
    x:0.55,y:4.77,w:8.9,h:0.77,fontSize:9.5,color:C.navy,wrap:true,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 17: FINAL COMPARISON (full table)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Final Comparison");
  slideTitle(s,"Complete Model Hierarchy: All Families on One Table","⚠ Spatial models fit on subsample (n≈1,500–5,000) — R² not directly comparable to full-dataset non-spatial models.");

  const rows = [
    [{text:"Model",options:{bold:true,color:C.white}},{text:"Family",options:{bold:true,color:C.white}},{text:"R²",options:{bold:true,color:C.white,align:"center"}},{text:"RMSE",options:{bold:true,color:C.white,align:"center"}},{text:"Dataset",options:{bold:true,color:C.white,align:"center"}},{text:"Key Strength",options:{bold:true,color:C.white}}],
    [{text:"GWR",options:{color:C.teal,bold:true}},"Spatially Varying",{text:"0.888",options:{align:"center",color:C.teal,bold:true}},{text:"—",options:{align:"center"}},"Subsample","Where coefficients vary spatially"],
    [{text:"XGBoost",options:{color:C.green,bold:true}},"ML Ensemble",{text:"0.851",options:{align:"center",color:C.green,bold:true}},{text:"0.220",options:{align:"center",color:C.green,bold:true}},"Full","Pure prediction accuracy"],
    ["Grad. Boosting","ML Ensemble",{text:"0.837",options:{align:"center"}},{text:"0.230",options:{align:"center"}},"Full","Accurate + faster than XGBoost"],
    ["Random Forest","ML Ensemble",{text:"0.823",options:{align:"center"}},{text:"0.240",options:{align:"center"}},"Full","Robust, CV R²=0.825±0.006"],
    [{text:"SLM",options:{color:C.purple,bold:true}},"Spatial Econometric",{text:"0.817",options:{align:"center",color:C.purple,bold:true}},{text:"—",options:{align:"center"}},"Subsample","Neighbourhood spillover (ρ=0.687)"],
    ["GAM","GNPR",{text:"0.759",options:{align:"center"}},{text:"0.280",options:{align:"center"}},"Full","Interpretable smooth curves"],
    ["Neural Net (MLP)","ML Deep",{text:"0.739",options:{align:"center"}},{text:"0.291",options:{align:"center"}},"Full","Nonlinear but expensive"],
    ["Spline+Ridge","GNPR",{text:"0.718",options:{align:"center"}},{text:"0.303",options:{align:"center"}},"Full","Transparent middle ground"],
    ["Ridge / OLS","Parametric",{text:"0.633",options:{align:"center",color:C.red}},{text:"0.345",options:{align:"center",color:C.red}},"Full","Interpretable baseline"],
    [{text:"SEM",options:{color:C.brown,bold:true}},"Spatial Econometric",{text:"0.577",options:{align:"center"}},{text:"—",options:{align:"center"}},"Subsample","Omitted variable correction"],
  ];

  s.addTable(rows,{
    x:0.4,y:1.5,w:9.2,h:3.65,
    colW:[2.0,2.1,0.7,0.7,1.1,2.6],
    fill:{color:C.white},border:{pt:0.5,color:C.greyLight},
    fontFace:"Calibri",fontSize:9.5,rowH:0.3,
    firstRowFill:C.navy,color:C.navy,
  });

  s.addText("The verdict is not a single winner. It is a hierarchy of purposes. Choose by what you need to know — not just which R² is highest.",{
    x:0.4,y:5.22,w:9.2,h:0.3,fontSize:10.5,color:C.navy,bold:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 18: CONCLUSIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Conclusions");
  slideTitle(s,"What We Found — and How We Know It");

  const rq_answers = [
    {rq:"RQ 1",short:"Yes — decisively.",detail:"OLS R²=0.633 → XGBoost R²=0.851. A 0.218 gap stable across 5-fold CV (RF: 0.825±0.006). OLS residuals show curvature, heteroscedasticity, spatial clustering. The case for linearity in this dataset is empirically refuted.",c:C.blue},
    {rq:"RQ 2",short:"Income × location is non-additive.",detail:"GAM: income effect is concave and latitude shows a structural break at 37.5°. GWR: income coefficient ranges [−0.23, +0.76] across California — no global model captures this. The Bay Area income slope is 0.13 steeper per income unit than the Central Valley.",c:C.teal},
    {rq:"RQ 3",short:"The answer depends on purpose.",detail:"ML ensembles lead on accuracy. GAM leads on interpretability. SLM (ρ=0.687) leads on spatial spillover estimation. GWR (R²=0.888) leads on geographic heterogeneity. No single model wins on all dimensions simultaneously.",c:C.purple},
  ];

  rq_answers.forEach((rq,i) => {
    addCard(s,0.4,1.5+i*1.28,9.2,1.12,{fill:C.white});
    s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:1.5+i*1.28,w:0.6,h:1.12,fill:{color:rq.c},line:{color:rq.c,width:0}});
    s.addText(rq.rq,{x:0.4,y:1.5+i*1.28,w:0.6,h:1.12,fontSize:10,bold:true,color:C.white,align:"center",valign:"middle",margin:0});
    s.addText(rq.short,{x:1.15,y:1.57+i*1.28,w:8.2,h:0.3,fontSize:12,bold:true,color:rq.c});
    s.addText(rq.detail,{x:1.15,y:1.87+i*1.28,w:8.2,h:0.6,fontSize:9.5,color:C.navy,wrap:true});
  });

  addCard(s,0.4,5.36,9.2,0.28,{fill:C.navy});
  s.addText("The arc: Observed (EDA) → Confirmed (OLS limitations) → Proved (Moran's I) → Modelled (SLM/SEM/GWR) → Compared honestly. That arc distinguishes analysis from a collection of model outputs.",{
    x:0.55,y:5.36,w:8.9,h:0.28,fontSize:9.5,color:C.mint,align:"center",valign:"middle",margin:0,
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 19: DEPLOYMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Deployment");
  slideTitle(s,"From Notebook to Production","Four deployment paths — each optimised for a different user and purpose");

  const options = [
    {title:"REST API",sub:"Real-Time Valuation",model:"XGBoost",for:"Proptech · Mortgage calculators · Portals",color:C.blue,note:"1ms inference · joblib serialisation · quarterly retraining · always return exp(pred)"},
    {title:"Batch Pipeline",sub:"Portfolio Scoring",model:"XGBoost + Conformal PI",for:"Banks · Insurance · Investment funds",color:C.teal,note:"Airflow scheduling · prediction intervals essential for risk-weighted capital"},
    {title:"Dashboard",sub:"Spatial Insight Tool",model:"GAM + GWR",for:"City planners · Researchers · Policy",color:C.green,note:"Streamlit + Folium maps · GWR coefficient maps · GAM partial dependence curves"},
    {title:"AVM Ensemble",sub:"Automated Valuation",model:"XGB 50% + RF 30% + GAM 20%",for:"Appraisers · Underwriting systems",color:C.purple,note:"Blended score — robustness at distribution edges · retrain every 6–12 months"},
  ];

  options.forEach((opt,i) => {
    const col = i%2;
    const row = Math.floor(i/2);
    const x = 0.4+col*4.85;
    const y = 1.5+row*2.05;
    addCard(s,x,y,4.5,1.85,{fill:C.white});
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:4.5,h:0.45,fill:{color:opt.color},line:{color:opt.color,width:0}});
    s.addText(`${opt.title}  ·  ${opt.sub}`,{x,y,w:4.5,h:0.45,fontSize:11,bold:true,color:C.white,align:"center",valign:"middle",margin:0});
    s.addText(`Model: ${opt.model}`,{x:x+0.1,y:y+0.52,w:4.3,h:0.25,fontSize:10,bold:true,color:opt.color});
    s.addText(`For: ${opt.for}`,{x:x+0.1,y:y+0.78,w:4.3,h:0.25,fontSize:9.5,color:C.navy});
    s.addText(opt.note,{x:x+0.1,y:y+1.05,w:4.3,h:0.65,fontSize:9,color:C.grey,italic:true,wrap:true});
  });

  s.addText("Recommended path: REST API → add prediction intervals → build dashboard. Retrain every 6–12 months. Model drift in housing markets is real.",{
    x:0.4,y:5.5,w:9.2,h:0.23,fontSize:9.5,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 20: FUTURE WORK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.offWhite };
  sectionTag(s,"Future Work");
  slideTitle(s,"Open Questions — Better Than the Ones We Answered");

  const items = [
    {n:"01",title:"Spatial Cross-Regressive (SLX)",desc:"y = Xβ + WXγ + ε. Adds spatially lagged independent variables: neighbours' income and density influence your price — without SLM's endogeneity problem. Natural next step from SEM.",c:C.teal},
    {n:"02",title:"Geographically Weighted RF",desc:"Combine GWR's spatial localisation with ensemble nonlinearity. Locally-weighted RF at each location — closing the gap between spatial econometrics and ML. GWpy library available.",c:C.blue},
    {n:"03",title:"Moran's I on ML Residuals",desc:"We tested OLS. Does XGBoost fully absorb the spatial signal? If Moran's I remains significant on ensemble residuals, it quantifies the motivation for GWRF directly.",c:C.orange},
    {n:"04",title:"Temporal Panel Analysis",desc:"Track block groups across Census years. Do spatial autoregressive coefficients increase with gentrification? Does income-location interaction shift over time?",c:C.green},
    {n:"05",title:"Uncertainty Quantification",desc:"Every prediction here is a point estimate. Conformal prediction or quantile regression forests provide distribution-free intervals — essential for any financial deployment.",c:C.red},
    {n:"06",title:"Causal Inference Extension",desc:"All models here are predictive, not causal. Instrumental variables (historical zoning) or regression discontinuity (school district boundaries) yield policy-relevant causal claims.",c:C.purple},
  ];

  items.forEach((item,i) => {
    const col = i%3;
    const row = Math.floor(i/3);
    const x = 0.4+col*3.2;
    const y = 1.5+row*2.05;
    addCard(s,x,y,3.0,1.85,{fill:C.white});
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:3.0,h:0.08,fill:{color:item.c},line:{color:item.c,width:0}});
    s.addText(item.n,{x,y:y+0.08,w:0.5,h:1.77,fontSize:22,bold:true,color:item.c,align:"center",valign:"top"});
    s.addText(item.title,{x:x+0.55,y:y+0.12,w:2.35,h:0.4,fontSize:9.5,bold:true,color:C.navy,wrap:true});
    s.addText(item.desc,{x:x+0.55,y:y+0.55,w:2.35,h:1.2,fontSize:9,color:C.grey,wrap:true});
  });

  s.addText('"The best analyses leave the reader with better questions than they arrived with."',{
    x:0.4,y:5.48,w:9.2,h:0.25,fontSize:10,color:C.grey,italic:true,align:"center",
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SLIDE 21: CLOSING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.35,h:5.625,fill:{color:C.teal},line:{color:C.teal,width:0}});

  s.addText("California housing is a nonlinear,\nspatially structured world.", {
    x:0.6,y:0.7,w:8.8,h:1.8,
    fontSize:32,bold:true,color:C.white,fontFace:"Calibri",valign:"middle",
  });

  s.addShape(pres.shapes.RECTANGLE,{x:0.6,y:2.6,w:3.5,h:0.04,fill:{color:C.teal},line:{color:C.teal,width:0}});

  s.addText("We have mapped its contours, measured its gradients, and modelled the forces that shape it.", {
    x:0.6,y:2.75,w:8.8,h:0.6,fontSize:15,color:C.mint,italic:true,
  });

  const closing_stats = [
    ["0.851","Best R²\n(XGBoost, full)"],
    ["0.687","Spatial ρ\n(Neighbourhood\nspillovers)"],
    ["2,985","AIC improvement\nSLM over OLS"],
    ["0.762","Moran's I\n(house values)"],
  ];
  closing_stats.forEach(([val,lbl],i) => {
    s.addText(val,{x:0.6+i*2.35,y:3.55,w:2.2,h:0.65,fontSize:28,bold:true,color:C.teal,align:"center"});
    s.addText(lbl,{x:0.6+i*2.35,y:4.2,w:2.2,h:0.55,fontSize:8.5,color:"CADCFC",align:"center"});
  });

  s.addText("Assumpta Mwikali  ·  Olive Mideva Muloma  ·  Trevor Anjeyo Vuhyah  ·  Valerie Jerono",{
    x:0.6,y:5.08,w:8.8,h:0.3,fontSize:10,color:"CADCFC",
  });
}

pres.writeFile({ fileName: "/home/claude/Beyond_Linearity_Enhanced.pptx" })
  .then(() => console.log("Done: Beyond_Linearity_Enhanced.pptx"))
  .catch(e => console.error(e));
