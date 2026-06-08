/* ============================================
   js/mc_engine.js — Monte Carlo Engine (ES Module)
   Portfolio BCHS v7.0
   Pure client-side simulation, 5000 scenarios
   Cascade: 3M → 6M → 12M
   ============================================ */

export const MCEngine = {

  DEFAULTS: {
    drift:                    1.2,
    volatility:               4.5,
    mean_reversion:           0.15,
    equilibrium:              50.0,
    p_strategic_meeting:      0.35,
    impact_strategic_meeting: 8.0,
    p_upsell:                 0.08,
    impact_upsell_mr:         2500.0,
    p_fast_response:          0.45,
    impact_fast_response:     3.0,
    p_escalation:             0.12,
    impact_escalation:        -10.0,
    p_complaint:              0.18,
    impact_complaint:         -6.0,
    p_churn:                  0.025,
    p_mr_downgrade:           0.06,
    impact_mr_downgrade:      -1200.0,
    monthly_revenue:          5000.0,
  },

  CATEGORIES: [
    { key: 'champion',  label: '🏆 Champion',  min: 70,   color: '#059669' },
    { key: 'promoter',  label: '⭐ Promoter',   min: 50,   color: '#10b981' },
    { key: 'passive',   label: '😐 Passive',    min: 30,   color: '#6b7280' },
    { key: 'at_risk',   label: '⚠️ At Risk',    min: 15,   color: '#f59e0b' },
    { key: 'detractor', label: '🔴 Detractor',  min: 0.01, color: '#ef4444' },
    { key: 'churned',   label: '💀 Churned',    min: -1,   color: '#111827' },
  ],

  _randn() {
    let u, v;
    do { u = Math.random(); } while (u === 0);
    do { v = Math.random(); } while (v === 0);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  },

  _classify(bchs, churned) {
    if (churned)    return 'churned';
    if (bchs >= 70) return 'champion';
    if (bchs >= 50) return 'promoter';
    if (bchs >= 30) return 'passive';
    if (bchs >= 15) return 'at_risk';
    return 'detractor';
  },

  _runBatch(N, months, initialBCHS, initialMR, cfg) {
    const endStates = new Array(N);
    const paths = Array.from({ length: months + 1 }, () => new Float32Array(N));

    for (let s = 0; s < N; s++) paths[0][s] = initialBCHS;

    for (let s = 0; s < N; s++) {
      let bCHS    = initialBCHS;
      let mr      = initialMR;
      let churned = false;

      for (let m = 0; m < months; m++) {
        if (churned) { paths[m + 1][s] = 0; continue; }

        const reversion = cfg.mean_reversion * (cfg.equilibrium - bCHS);
        const shock     = this._randn() * cfg.volatility;
        let delta       = cfg.drift + reversion + shock;

        if (Math.random() < cfg.p_strategic_meeting) delta += cfg.impact_strategic_meeting;
        if (Math.random() < cfg.p_fast_response)     delta += cfg.impact_fast_response;
        if (Math.random() < cfg.p_escalation)        delta += cfg.impact_escalation;
        if (Math.random() < cfg.p_complaint)         delta += cfg.impact_complaint;
        if (Math.random() < cfg.p_upsell)            mr    += cfg.impact_upsell_mr;
        if (Math.random() < cfg.p_mr_downgrade)      mr    += cfg.impact_mr_downgrade;

        if (Math.random() < cfg.p_churn) {
          mr = 0; bCHS = 0; churned = true;
          paths[m + 1][s] = 0;
          continue;
        }

        bCHS = Math.max(0, Math.min(100, bCHS + delta));
        mr   = Math.max(0, mr);
        paths[m + 1][s] = bCHS;
      }

      endStates[s] = { bchs: bCHS, mr, churned };
    }

    return { endStates, paths };
  },

  _pct(sorted, p) {
    const idx = Math.min(Math.floor(p / 100 * sorted.length), sorted.length - 1);
    return sorted[idx];
  },

  _summarise(endStates, initialMR) {
    const N        = endStates.length;
    const bchsArr  = endStates.map(s => s.bchs).sort((a, b) => a - b);
    const mrArr    = endStates.map(s => s.mr).sort((a, b) => a - b);
    const churnCnt = endStates.filter(s => s.churned).length;

    const bchsMean = bchsArr.reduce((a, b) => a + b, 0) / N;
    const mrMean   = mrArr.reduce((a, b) => a + b, 0) / N;

    const cats = { champion:0, promoter:0, passive:0, at_risk:0, detractor:0, churned:0 };
    for (const s of endStates) cats[this._classify(s.bchs, s.churned)]++;

    const catPct = {};
    for (const k of Object.keys(cats)) catPct[k] = Math.round(cats[k] / N * 1000) / 10;

    return {
      bchs: {
        p10:    Math.round(this._pct(bchsArr, 10)  * 10) / 10,
        p25:    Math.round(this._pct(bchsArr, 25)  * 10) / 10,
        median: Math.round(this._pct(bchsArr, 50)  * 10) / 10,
        p75:    Math.round(this._pct(bchsArr, 75)  * 10) / 10,
        p90:    Math.round(this._pct(bchsArr, 90)  * 10) / 10,
        mean:   Math.round(bchsMean                * 10) / 10,
      },
      mr: {
        p10:    Math.round(this._pct(mrArr, 10)),
        p25:    Math.round(this._pct(mrArr, 25)),
        median: Math.round(this._pct(mrArr, 50)),
        p75:    Math.round(this._pct(mrArr, 75)),
        p90:    Math.round(this._pct(mrArr, 90)),
        mean:   Math.round(mrMean),
      },
      churn_rate:  Math.round(churnCnt / N * 1000) / 10,
      churn_count: churnCnt,
      categories:  catPct,
      n:           N,
    };
  },

  _fanPath(paths, offsetMonth) {
    return paths.map((col, m) => {
      const sorted = Array.from(col).sort((a, b) => a - b);
      return {
        month:  offsetMonth + m,
        p10:    Math.round(this._pct(sorted, 10)  * 10) / 10,
        p25:    Math.round(this._pct(sorted, 25)  * 10) / 10,
        median: Math.round(this._pct(sorted, 50)  * 10) / 10,
        p75:    Math.round(this._pct(sorted, 75)  * 10) / 10,
        p90:    Math.round(this._pct(sorted, 90)  * 10) / 10,
      };
    });
  },

  run(currentBCHSRaw, cfg) {
    const N = 5000;
    const c = Object.assign({}, this.DEFAULTS, cfg || {});

    const initBCHS = (currentBCHSRaw !== null && currentBCHSRaw !== undefined)
      ? Math.round((currentBCHSRaw + 81) / 162 * 100 * 10) / 10
      : 50;
    const initMR = c.monthly_revenue || this.DEFAULTS.monthly_revenue;

    const r3  = this._runBatch(N, 3, initBCHS,        initMR,        c);
    const s3  = this._summarise(r3.endStates, initMR);
    const fan3 = this._fanPath(r3.paths, 0);

    const r6  = this._runBatch(N, 3, s3.bchs.median,  s3.mr.median,  c);
    const s6  = this._summarise(r6.endStates, s3.mr.median);
    const fan6 = this._fanPath(r6.paths, 3);

    const r12  = this._runBatch(N, 6, s6.bchs.median, s6.mr.median,  c);
    const s12  = this._summarise(r12.endStates, s6.mr.median);
    const fan12 = this._fanPath(r12.paths, 6);

    return {
      current_bchs_scaled: initBCHS,
      current_mr:          initMR,
      n_scenarios:         N,
      horizons: {
        '3m':  s3,
        '6m':  s6,
        '12m': s12,
      },
      fan_chart: [
        ...fan3,
        ...fan6.slice(1),
        ...fan12.slice(1),
      ],
    };
  },
};

/* ── Expose globally для portfolio.js и mc_page.js ── */
window.MCEngine = MCEngine;
