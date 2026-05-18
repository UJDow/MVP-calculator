/* ============================================
   Portfolio BCHS — Monte Carlo Engine
   Pure client-side simulation, 5000 scenarios
   Cascade: 3M → 6M → 12M
   ============================================ */

const MCEngine = {

  /* Default config — all fields */
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

  /* Category thresholds (0–100 scale) */
  CATEGORIES: [
    { key: 'champion',  label: '🏆 Champion',  min: 70,  color: '#059669' },
    { key: 'promoter',  label: '⭐ Promoter',   min: 50,  color: '#10b981' },
    { key: 'passive',   label: '😐 Passive',    min: 30,  color: '#6b7280' },
    { key: 'at_risk',   label: '⚠️ At Risk',    min: 15,  color: '#f59e0b' },
    { key: 'detractor', label: '🔴 Detractor',  min: 0.01,color: '#ef4444' },
    { key: 'churned',   label: '💀 Churned',    min: -1,  color: '#111827' },
  ],

  /* Box-Muller normal random */
  _randn() {
    let u, v;
    do { u = Math.random(); } while (u === 0);
    do { v = Math.random(); } while (v === 0);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  },

  /* Classify final bCHS into category */
  _classify(bchs, churned) {
    if (churned)    return 'churned';
    if (bchs >= 70) return 'champion';
    if (bchs >= 50) return 'promoter';
    if (bchs >= 30) return 'passive';
    if (bchs >= 15) return 'at_risk';
    return 'detractor';
  },

  /* Run N scenarios for M months starting from initialBCHS/initialMR
     Returns array of { bchs, mr, churned } end-states per scenario
     Also returns monthly_paths[scenario][month] for fan chart building */
  _runBatch(N, months, initialBCHS, initialMR, cfg) {
    const endStates = new Array(N);
    // We only need the PATH at each month-boundary for percentile calc
    // Store as flat typed arrays for performance: paths[month][scenario]
    const paths = Array.from({ length: months + 1 }, () => new Float32Array(N));

    for (let s = 0; s < N; s++) {
      paths[0][s] = initialBCHS;
    }

    for (let s = 0; s < N; s++) {
      let bCHS = initialBCHS;
      let mr   = initialMR;
      let churned = false;

      for (let m = 0; m < months; m++) {
        if (churned) {
          paths[m + 1][s] = 0;
          continue;
        }

        // Core: mean reversion + drift + Gaussian noise
        const reversion = cfg.mean_reversion * (cfg.equilibrium - bCHS);
        const shock      = this._randn() * cfg.volatility;
        let delta = cfg.drift + reversion + shock;

        // Bernoulli events
        if (Math.random() < cfg.p_strategic_meeting) delta += cfg.impact_strategic_meeting;
        if (Math.random() < cfg.p_fast_response)     delta += cfg.impact_fast_response;
        if (Math.random() < cfg.p_escalation)        delta += cfg.impact_escalation;
        if (Math.random() < cfg.p_complaint)         delta += cfg.impact_complaint;
        if (Math.random() < cfg.p_upsell)            mr    += cfg.impact_upsell_mr;
        if (Math.random() < cfg.p_mr_downgrade)      mr    += cfg.impact_mr_downgrade;

        // Churn event — terminates scenario
        if (Math.random() < cfg.p_churn) {
          mr      = 0;
          bCHS    = 0;
          churned = true;
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

  /* Percentile from sorted array */
  _pct(sorted, p) {
    const idx = Math.min(Math.floor(p / 100 * sorted.length), sorted.length - 1);
    return sorted[idx];
  },

  /* Summarise end-states into stats object */
  _summarise(endStates, initialMR) {
    const N = endStates.length;
    const bchsArr   = endStates.map(s => s.bchs).sort((a, b) => a - b);
    const mrArr     = endStates.map(s => s.mr).sort((a, b) => a - b);
    const churnCnt  = endStates.filter(s => s.churned).length;
    const churnRate = churnCnt / N * 100;

    const bchsMean  = bchsArr.reduce((a, b) => a + b, 0) / N;
    const mrMean    = mrArr.reduce((a, b) => a + b, 0) / N;

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
        mean:   Math.round(bchsMean               * 10) / 10,
      },
      mr: {
        p10:    Math.round(this._pct(mrArr, 10)),
        p25:    Math.round(this._pct(mrArr, 25)),
        median: Math.round(this._pct(mrArr, 50)),
        p75:    Math.round(this._pct(mrArr, 75)),
        p90:    Math.round(this._pct(mrArr, 90)),
        mean:   Math.round(mrMean),
      },
      churn_rate:  Math.round(churnRate * 10) / 10,
      churn_count: churnCnt,
      categories:  catPct,
      n:           N,
    };
  },

  /* Extract fan-chart percentile path across months
     Returns [{month, p10, p25, median, p75, p90}, ...] */
  _fanPath(paths, offsetMonth) {
    const points = [];
    for (let m = 0; m < paths.length; m++) {
      const col    = Array.from(paths[m]).sort((a, b) => a - b);
      points.push({
        month:  offsetMonth + m,
        p10:    Math.round(this._pct(col, 10)  * 10) / 10,
        p25:    Math.round(this._pct(col, 25)  * 10) / 10,
        median: Math.round(this._pct(col, 50)  * 10) / 10,
        p75:    Math.round(this._pct(col, 75)  * 10) / 10,
        p90:    Math.round(this._pct(col, 90)  * 10) / 10,
      });
    }
    return points;
  },

  /* ---- MAIN ENTRY POINT ---- */
  /* currentBCHSRaw: raw bCHS score (-81..+81) or null → use 50 as neutral
     cfg: mc_config object (merged with DEFAULTS)
     Returns full result object */
  run(currentBCHSRaw, cfg) {
    const N = 5000;

    // Merge with defaults
    const c = Object.assign({}, this.DEFAULTS, cfg || {});

    // Scale raw bCHS (-81..+81) → 0..100
    const initBCHS = currentBCHSRaw !== null && currentBCHSRaw !== undefined
      ? Math.round((currentBCHSRaw + 81) / 162 * 100 * 10) / 10
      : 50;

    const initMR = c.monthly_revenue || this.DEFAULTS.monthly_revenue;

    /* ---- Cascade Step 1: 3M ---- */
    const r3 = this._runBatch(N, 3, initBCHS, initMR, c);
    const s3 = this._summarise(r3.endStates, initMR);
    const fan3 = this._fanPath(r3.paths, 0);

    /* ---- Cascade Step 2: 3M → 6M (start from 3M median states) ---- */
    // Use median bCHS at 3M as starting point for next cascade
    const med3BCHS = s3.bchs.median;
    const med3MR   = s3.mr.median;
    const r6 = this._runBatch(N, 3, med3BCHS, med3MR, c);
    const s6raw = this._summarise(r6.endStates, med3MR);
    const fan6  = this._fanPath(r6.paths, 3);
    // 6M summary = stats at month 6 (end of second batch)
    const s6 = s6raw;

    /* ---- Cascade Step 3: 6M → 12M (start from 6M median) ---- */
    const med6BCHS = s6.bchs.median;
    const med6MR   = s6.mr.median;
    const r12 = this._runBatch(N, 6, med6BCHS, med6MR, c);
    const s12raw = this._summarise(r12.endStates, med6MR);
    const fan12  = this._fanPath(r12.paths, 6);
    const s12 = s12raw;

    /* ---- Merge fan chart into single timeline 0..12 ---- */
    // fan3: months 0-3, fan6: months 3-6, fan12: months 6-12
    // Deduplicate join points
    const fanFull = [
      ...fan3,
      ...fan6.slice(1),   // skip month 3 (already in fan3)
      ...fan12.slice(1),  // skip month 6 (already in fan6)
    ];

    return {
      current_bchs_scaled: initBCHS,
      current_mr:          initMR,
      n_scenarios:         N,
      horizons: {
        '3m':  s3,
        '6m':  s6,
        '12m': s12,
      },
      fan_chart: fanFull,   // [{month, p10, p25, median, p75, p90}, ...]
    };
  },
};
