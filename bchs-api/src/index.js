const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

/* ── Monte Carlo Engine ── */
const MCEngine = {
  DEFAULTS: {
    drift: 1.2, volatility: 4.5, mean_reversion: 0.15, equilibrium: 50.0,
    p_strategic_meeting: 0.35, impact_strategic_meeting: 8.0,
    p_upsell: 0.08, impact_upsell_mr: 2500.0,
    p_fast_response: 0.45, impact_fast_response: 3.0,
    p_escalation: 0.12, impact_escalation: -10.0,
    p_complaint: 0.18, impact_complaint: -6.0,
    p_churn: 0.025, p_mr_downgrade: 0.06, impact_mr_downgrade: -1200.0,
    monthly_revenue: 5000.0,
  },
  _randn() {
    let u, v;
    do { u = Math.random(); } while (u === 0);
    do { v = Math.random(); } while (v === 0);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  },
  _runBatch(N, months, initialBCHS, initialMR, cfg) {
    const endStates = new Array(N);
    for (let s = 0; s < N; s++) {
      let bCHS = initialBCHS, mr = initialMR, churned = false;
      for (let m = 0; m < months; m++) {
        if (churned) continue;
        const reversion = cfg.mean_reversion * (cfg.equilibrium - bCHS);
        const shock     = this._randn() * cfg.volatility;
        let delta       = cfg.drift + reversion + shock;
        if (Math.random() < cfg.p_strategic_meeting) delta += cfg.impact_strategic_meeting;
        if (Math.random() < cfg.p_fast_response)     delta += cfg.impact_fast_response;
        if (Math.random() < cfg.p_escalation)        delta += cfg.impact_escalation;
        if (Math.random() < cfg.p_complaint)         delta += cfg.impact_complaint;
        if (Math.random() < cfg.p_upsell)            mr    += cfg.impact_upsell_mr;
        if (Math.random() < cfg.p_mr_downgrade)      mr    += cfg.impact_mr_downgrade;
        if (Math.random() < cfg.p_churn) { mr = 0; bCHS = 0; churned = true; continue; }
        bCHS = Math.max(0, Math.min(100, bCHS + delta));
        mr   = Math.max(0, mr);
      }
      endStates[s] = { bchs: bCHS, mr, churned };
    }
    return endStates;
  },
  _pct(sorted, p) {
    return sorted[Math.min(Math.floor(p / 100 * sorted.length), sorted.length - 1)];
  },
  _summarise(endStates, initialMR) {
    const N        = endStates.length;
    const bchsArr  = endStates.map(s => s.bchs).sort((a, b) => a - b);
    const mrArr    = endStates.map(s => s.mr).sort((a, b) => a - b);
    const churnCnt = endStates.filter(s => s.churned).length;
    const bchsMean = bchsArr.reduce((a, b) => a + b, 0) / N;
    const mrMean   = mrArr.reduce((a, b) => a + b, 0) / N;
    return {
      bchs: {
        p10:    Math.round(this._pct(bchsArr, 10)  * 10) / 10,
        p25:    Math.round(this._pct(bchsArr, 25)  * 10) / 10,
        median: Math.round(this._pct(bchsArr, 50)  * 10) / 10,
        p75:    Math.round(this._pct(bchsArr, 75)  * 10) / 10,
        p90:    Math.round(this._pct(bchsArr, 90)  * 10) / 10,
        mean:   Math.round(bchsMean * 10) / 10,
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
      n: N,
    };
  },
  run(currentBCHS, cfg) {
    const N = 2000;
    const c = Object.assign({}, this.DEFAULTS, cfg || {});
    const initBCHS = (currentBCHS !== null && currentBCHS !== undefined)
      ? Math.max(0, Math.min(100, Math.round(currentBCHS * 10) / 10))
      : 50;
    const initMR = c.monthly_revenue || this.DEFAULTS.monthly_revenue;
    const r3  = this._runBatch(N, 3,  initBCHS,       initMR,        c);
    const s3  = this._summarise(r3, initMR);
    const r6  = this._runBatch(N, 3,  s3.bchs.median, s3.mr.median,  c);
    const s6  = this._summarise(r6, s3.mr.median);
    const r12 = this._runBatch(N, 6,  s6.bchs.median, s6.mr.median,  c);
    const s12 = this._summarise(r12, s6.mr.median);
    return { horizons: { '3m': s3, '6m': s6, '12m': s12 } };
  },
};

/* ── Автокоррекция параметров MC под сигналы клиента ── */
function adjustCfgBySignals(baseCfg, latestEntry) {
  const cfg = Object.assign({}, baseCfg);
  if (!latestEntry) return cfg;

  // Негативные сигналы — повышаем риски
  if (latestEntry.churn)                cfg.p_churn           = Math.min(cfg.p_churn * 3.5, 0.25);
  if (latestEntry.escalation)           cfg.p_escalation      = Math.min(cfg.p_escalation * 2.0, 0.35);
  if (latestEntry.competitor_mentions)  cfg.p_churn           = Math.min(cfg.p_churn * 2.0, 0.20);
  if (latestEntry.exit_questions)       cfg.p_churn           = Math.min(cfg.p_churn * 2.5, 0.22);
  if (latestEntry.scope_reduction)      cfg.p_mr_downgrade    = Math.min(cfg.p_mr_downgrade * 2.0, 0.15);
  if (latestEntry.payment_delay_30plus) cfg.p_churn           = Math.min(cfg.p_churn * 2.0, 0.18);
  if (latestEntry.payment_delay_10_30)  cfg.p_mr_downgrade    = Math.min(cfg.p_mr_downgrade * 1.5, 0.12);
  if (latestEntry.complaint)            cfg.p_complaint       = Math.min(cfg.p_complaint * 1.8, 0.40);
  if (latestEntry.missed_meetings)      cfg.p_escalation      = Math.min(cfg.p_escalation * 1.5, 0.25);
  if (latestEntry.no_planning)          cfg.drift             = Math.min(cfg.drift - 0.5, 0.3);
  if (latestEntry.reduced_frequency)    cfg.p_churn           = Math.min(cfg.p_churn * 1.5, 0.15);
  if (latestEntry.slow_responses)       cfg.p_fast_response   = Math.max(cfg.p_fast_response * 0.4, 0.05);

  // Позитивные сигналы — снижаем риски, повышаем апсайд
  if (latestEntry.upsell)               cfg.p_upsell          = Math.min(cfg.p_upsell * 2.5, 0.25);
  if (latestEntry.contract_renewal)     cfg.p_churn           = Math.max(cfg.p_churn * 0.4, 0.005);
  if (latestEntry.strategic_sessions)   cfg.p_strategic_meeting = Math.min(cfg.p_strategic_meeting * 1.6, 0.65);
  if (latestEntry.fast_responses)       cfg.p_fast_response   = Math.min(cfg.p_fast_response * 1.5, 0.75);
  if (latestEntry.positive_feedback)    cfg.drift             = cfg.drift + 0.4;
  if (latestEntry.new_services_interest) cfg.p_upsell         = Math.min(cfg.p_upsell * 1.8, 0.20);
  if (latestEntry.shared_business_plans) cfg.p_churn          = Math.max(cfg.p_churn * 0.6, 0.008);
  if (latestEntry.cross_sell)           cfg.p_upsell          = Math.min(cfg.p_upsell * 1.5, 0.18);
  if (latestEntry.internal_events)      cfg.p_strategic_meeting = Math.min(cfg.p_strategic_meeting * 1.3, 0.55);

  return cfg;
}

/* ── Вычисление bCHS из сигналов (зеркало js/constants.js + js/calc.js) ── */
const SIGNAL_WEIGHTS = {
  team_scope_request:      +5,
  new_services_interest:   +3,
  strategic_sessions:      +7,
  fast_responses:          +2,
  internal_events:         +3,
  shared_business_plans:   +3,
  contract_renewal:        +24,
  upsell:                  +16,
  cross_sell:              +13,
  positive_feedback:       +5,
  slow_responses:          -2,
  missed_meetings:         -3,
  no_planning:             -3,
  detailed_report_request: -2,
  scope_reduction:         -4,
  competitor_mentions:     -5,
  new_decision_maker:      -3,
  exit_questions:          -8,
  reduced_frequency:       -2,
  no_growth_response:      -2,
  complaint:               -3,
  payment_delay_10_30:     -4,
  specialist_replacement:  -5,
  escalation:              -10,
  payment_delay_30plus:    -8,
  churn:                   -25,
};

/* raw (-81..+81) */
function bchsRaw(entry) {
  if (!entry) return null;
  let score = 0, any = false;
  for (const [k, w] of Object.entries(SIGNAL_WEIGHTS)) {
    if (entry[k] == 1 || entry[k] === true) { score += w; any = true; }
  }
  return any ? score : null;
}

/* нормализованный 0-100 */
function bchsNorm(entry) {
  const r = bchsRaw(entry);
  if (r === null) return null;
  return Math.round((r + 81) / 162 * 100 * 10) / 10;
}

/* ── MC агрегация по портфелю ── */
async function buildPortfolioMC(env) {
  try {
    const [{ results: clients }, { results: mcConfigs }, { results: bchsEntries }] = await Promise.all([
      env.DB.prepare('SELECT * FROM clients LIMIT 500').all(),
      env.DB.prepare('SELECT * FROM mc_configs LIMIT 500').all(),
      env.DB.prepare('SELECT * FROM bchs_entries ORDER BY year DESC, month DESC LIMIT 2000').all(),
    ]);

    const latestBchs = {};
    for (const b of bchsEntries) {
      const cid = String(b.client_id);
      if (!latestBchs[cid]) latestBchs[cid] = b;
    }

    const results = [];
    for (const client of clients) {
      const cid   = String(client.id);
      const entry = latestBchs[cid];
      const bchs  = bchsNorm(entry);
      const cfg   = mcConfigs.find(x => String(x.client_id) === cid);
      let mcCfg   = Object.assign({}, MCEngine.DEFAULTS,
        { monthly_revenue: client.monthly_revenue || 5000 }, cfg || {});
      mcCfg = adjustCfgBySignals(mcCfg, entry);
      try {
        const mc = MCEngine.run(bchs, mcCfg);
        results.push({ client, bchs, mc });
      } catch { /* skip */ }
    }

    if (!results.length) return null;

    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const churn3   = avg(results.map(r => r.mc.horizons['3m'].churn_rate));
    const churn12  = avg(results.map(r => r.mc.horizons['12m'].churn_rate));
    const bchs3    = avg(results.map(r => r.mc.horizons['3m'].bchs.median));
    const bchs12   = avg(results.map(r => r.mc.horizons['12m'].bchs.median));
    const atRisk   = results.filter(r => r.mc.horizons['3m'].churn_rate >= 15);
    const mrAtRisk = atRisk.reduce((s, r) => s + (r.client.monthly_revenue || 0), 0);
    const top3churn = [...results]
      .sort((a, b) => b.mc.horizons['3m'].churn_rate - a.mc.horizons['3m'].churn_rate)
      .slice(0, 3)
      .map(r =>
        r.client.name + ' (отток ' + r.mc.horizons['3m'].churn_rate.toFixed(1) +
        '%, bCHS→' + r.mc.horizons['3m'].bchs.median.toFixed(0) + ')'
      ).join('; ');

    return {
      avg_churn_3m:    churn3.toFixed(1)  + '%',
      avg_churn_12m:   churn12.toFixed(1) + '%',
      avg_bchs_3m:     bchs3.toFixed(1),
      avg_bchs_12m:    bchs12.toFixed(1),
      clients_at_risk: atRisk.length,
      mr_at_risk:      '$' + mrAtRisk.toLocaleString('en-US'),
      top3_churn_risk: top3churn,
    };
  } catch { return null; }
}

/* ── Rolling Summary ── */
async function getRollingSummary(env) {
  const period = new Date().toISOString().slice(0, 7);
  try {
    const existing = await env.DB.prepare(
      'SELECT snapshot, mc_agg FROM portfolio_summary WHERE period = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(period).first();

    if (existing) {
      return {
        snapshot: JSON.parse(existing.snapshot || '{}'),
        mc_agg:   JSON.parse(existing.mc_agg   || 'null'),
      };
    }

    const [
      { results: clients },
      { results: bchsEntries },
      { results: touchPoints },
      { results: portStrats },
      { results: accStrats },
    ] = await Promise.all([
      env.DB.prepare('SELECT * FROM clients LIMIT 500').all(),
      env.DB.prepare('SELECT * FROM bchs_entries ORDER BY year DESC, month DESC LIMIT 2000').all(),
      env.DB.prepare('SELECT * FROM touch_points ORDER BY created_at DESC LIMIT 200').all(),
      env.DB.prepare('SELECT * FROM portfolio_strategies LIMIT 10').all(),
      env.DB.prepare("SELECT * FROM account_strategies WHERE status != 'done' LIMIT 100").all(),
    ]);

    const latestBchs = {};
    for (const b of bchsEntries) {
      const cid = String(b.client_id);
      if (!latestBchs[cid]) latestBchs[cid] = b;
    }

    const clientSummaries = clients.map(c => {
      const cid         = String(c.id);
      const bchs        = latestBchs[cid];
      const strat       = accStrats.find(s => String(s.client_id) === cid);
      const recentTouch = touchPoints.find(t => String(t.client_id) === cid);
      return {
        id:         cid,
        name:       c.name,
        bcg:        c.bcg_category,
        mr:         c.monthly_revenue || 0,
        bchs:       bchs?.bchs ?? null,
        focus:      strat?.focus   || null,
        outcome:    strat?.outcome || null,
        last_touch: recentTouch?.completed_at?.slice(0, 10) || null,
        ai_summary: recentTouch?.ai_summary
          ? (JSON.parse(recentTouch.ai_summary)?.context || null)
          : null,
      };
    });

    const portStratsSummary = {};
    for (const s of portStrats) {
      portStratsSummary[s.horizon] = {
        focus: s.focus, outcome: s.outcome, risk: s.risk,
        status: s.status, deadline: s.deadline,
      };
    }

    const snapshot = {
      period,
      total_clients:    clients.length,
      portfolio_strats: portStratsSummary,
      clients:          clientSummaries,
    };

    const mcAgg = await buildPortfolioMC(env);
    const summaryId = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO portfolio_summary (id, period, snapshot, mc_agg) VALUES (?, ?, ?, ?)'
    ).bind(summaryId, period, JSON.stringify(snapshot), JSON.stringify(mcAgg)).run();

    return { snapshot, mc_agg: mcAgg };
  } catch (e) {
    console.error('getRollingSummary error:', e.message);
    return { snapshot: {}, mc_agg: null };
  }
}

/* ── Промпты ── */
async function buildMessages(body, env) {
  const type = body.type ?? 'raw';

  if (type === 'status') {
    const text = body.text ?? '';
    return [
      {
        role: 'system',
        content: 'Ты CSM-аналитик. Разбираешь транскрипт встречи или звонка с клиентом. ' +
          'Выставляй сигнал true если есть хотя бы косвенное упоминание или намёк — ' +
          'лучше выставить лишний сигнал чем пропустить важный. ' +
          'Отвечай ТОЛЬКО валидным JSON без markdown и без пояснений.',
      },
      {
        role: 'user',
        content: 'Проанализируй текст статуса клиента и верни JSON:\n' +
          '{"signals":{"sig1":true,"sig2":false,...},"pc":{"key1":3,"key2":4,...},"explanation":"..."}\n\n' +
          'Текст статуса:\n' + text,
      },
    ];
  }

  if (type === 'horizon') {
    const h     = body.horizon             ?? 'short';
    const s     = body.summary             ?? {};
    const dir   = body.direction           ?? null;
    const exist = body.existing_strategies ?? {};
    const snap  = body.clients_snapshot    ?? [];

    const labels = {
      short: 'краткосрочная (1 месяц)',
      mid:   'среднесрочная (1–2 квартала)',
      long:  'долгосрочная (4 квартала)',
    };

    const rolling = env ? await getRollingSummary(env) : { snapshot: {}, mc_agg: null };
    const mcAgg   = rolling.mc_agg;

    const mcText = mcAgg
      ? '\nМОНТЕ-КАРЛО ПОРТФЕЛЯ:\n' +
        '- Средний риск оттока 3М: ' + mcAgg.avg_churn_3m + '\n' +
        '- Средний риск оттока 12М: ' + mcAgg.avg_churn_12m + '\n' +
        '- Прогноз bCHS 3М: ' + mcAgg.avg_bchs_3m + '\n' +
        '- Прогноз bCHS 12М: ' + mcAgg.avg_bchs_12m + '\n' +
        '- Клиентов в зоне риска (отток ≥15%): ' + mcAgg.clients_at_risk + '\n' +
        '- MR под угрозой: ' + mcAgg.mr_at_risk + '\n' +
        '- Топ-3 по оттоку: ' + mcAgg.top3_churn_risk + '\n'
      : '';

    const dirText = dir
      ? '\nНАПРАВЛЕНИЕ от менеджера: "' + dir + '"\nОбязательно учитывай это направление как главный приоритет.\n'
      : '';

    const existText = Object.entries(exist)
      .filter(([, v]) => v?.outcome)
      .map(([k, v]) => '- ' + (labels[k] ?? k) + ': ' + v.outcome)
      .join('\n') || 'не заданы';

    const snapText = snap.length
      ? snap.map(c =>
          '  • ' + c.name + ' [' + c.bcg + '] bCHS:' + (c.bchs ?? '—') +
          ' тренд:' + (c.trend ?? '—') + ' MR:$' + (c.mr ?? 0) +
          ' отток:' + (c.churn ?? '—') + '% риск:$' + (c.risk ?? 0)
        ).join('\n')
      : 'нет данных';

    return [
      {
        role: 'system',
        content: 'Ты стратегический аналитик CSM-портфеля с опытом 10+ лет. ' +
          'Генерируй конкретные, реалистичные стратегии на основе данных. ' +
          'Отвечай ТОЛЬКО валидным JSON без markdown.',
      },
      {
        role: 'user',
        content:
          'Предложи 3 ВАРИАНТА стратегии для горизонта: ' + (labels[h] ?? h) + '.' +
          dirText + '\n' +
          'СВОДКА ПОРТФЕЛЯ:\n' +
          '- Всего клиентов: ' + (s.total ?? '—') + '\n' +
          '- Средняя лояльность: ' + (s.avgLoyalty != null ? s.avgLoyalty + '%' : 'нет данных') + '\n' +
          '- Revenue at Risk: $' + ((s.totalRisk ?? 0).toLocaleString('en-US')) + '\n' +
          '- BCG: KEY=' + (s.bcgCount?.KEY ?? 0) + ', STABLE=' + (s.bcgCount?.STABLE ?? 0) +
          ', GROWTH=' + (s.bcgCount?.GROWTH ?? 0) + ', GROWTH_EARLY=' + (s.bcgCount?.GROWTH_EARLY ?? 0) +
          ', TAIL=' + (s.bcgCount?.TAIL ?? 0) + '\n' +
          '- Топ-3 риска: ' + (s.top3Risk ?? 'нет') + '\n' +
          '- Средняя реализация потенциала: ' + (s.avgPotential != null ? s.avgPotential + '%' : 'нет данных') + '\n' +
          mcText + '\n' +
          'КЛИЕНТЫ ПОРТФЕЛЯ (топ по риску):\n' + snapText + '\n\n' +
          'УЖЕ НАПИСАННЫЕ СТРАТЕГИИ (не повторяй, развивай логику):\n' + existText + '\n\n' +
          'Верни СТРОГО валидный JSON с 3 вариантами:\n' +
          '{"variants":[' +
          '{"label":"Вариант 1: название","focus":"краткий фокус до 60 символов","outcome":"измеримый результат с цифрами","risk":"главное препятствие","deadline":"YYYY-MM-DD"},' +
          '{"label":"Вариант 2: название","focus":"...","outcome":"...","risk":"...","deadline":"YYYY-MM-DD"},' +
          '{"label":"Вариант 3: название","focus":"...","outcome":"...","risk":"...","deadline":"YYYY-MM-DD"}' +
          ']}',
      },
    ];
  }

  if (type === 'account') {
    const c    = body.client              ?? {};
    const m    = body.metrics             ?? {};
    const dir  = body.direction           ?? null;
    const hist = body.bchs_history        ?? [];
    const sigs = body.active_signals      ?? [];
    const pc   = body.pc_components       ?? {};
    const prev = body.previous_strategies ?? [];

    const dirText = dir
      ? '\nНАПРАВЛЕНИЕ от менеджера: "' + dir + '"\nЭто главный приоритет стратегии.\n'
      : '';

    const histText = hist.length
      ? hist.map(h => h.month + '/' + h.year + ': bCHS=' + (h.bchs ?? '—') + ' лояльность=' + (h.loyalty ?? '—') + '%').join(', ')
      : 'нет истории';

    const sigsText = sigs.length ? sigs.join(', ') : 'активных сигналов нет';
    const pcText   = Object.keys(pc).length
      ? Object.entries(pc).map(([k, v]) => k + ':' + v).join(', ')
      : 'нет данных';

    const prevText = prev.length
      ? prev.map(p => '- ' + (p.goal?.slice(0, 80) ?? '—') + ' [' + (p.status ?? '—') + ', ' + (p.created_at?.slice(0, 10) ?? '—') + ']').join('\n')
      : 'предыдущих стратегий нет';

    return [
      {
        role: 'system',
        content: 'Ты опытный CSM-аналитик. Предлагай конкретные действия, ' +
          'учитывай историю и контекст клиента. ' +
          'Отвечай ТОЛЬКО валидным JSON без markdown.',
      },
      {
        role: 'user',
        content:
          'Предложи 3 ВАРИАНТА стратегии работы с клиентом.' +
          dirText + '\n' +
          'ПРОФИЛЬ: ' + (c.name ?? '—') + ' · BCG: ' + (c.bcg ?? '—') + ' · ' +
          'Приоритет: ' + (c.priority ?? '—') + ' · MR: $' + Number(c.monthly_revenue ?? 0).toLocaleString('en-US') + '\n' +
          'Engagement: ' + (c.engagement ?? '—') + ' · Phase: ' + (c.phase ?? '—') + '\n\n' +
          'МЕТРИКИ:\n' +
          '- bCHS текущий: ' + (m.bchs_current ?? '—') + ' · Тренд: ' + (m.trend ?? '—') + '\n' +
          '- MC 3М: медиана ' + (m.mc_3m_median ?? '—') + ' · отток ' + (m.mc_3m_churn ?? '—') + '\n' +
          '- MC 12М: медиана ' + (m.mc_12m_median ?? '—') + ' · отток ' + (m.mc_12m_churn ?? '—') + '\n' +
          '- Revenue at Risk: $' + Number(c.revenue_at_risk ?? 0).toLocaleString('en-US') + '\n\n' +
          'ИСТОРИЯ bCHS (последние месяцы): ' + histText + '\n\n' +
          'АКТИВНЫЕ СИГНАЛЫ: ' + sigsText + '\n\n' +
          'PC КОМПОНЕНТЫ: ' + pcText + '\n\n' +
          'ПРЕДЫДУЩИЕ СТРАТЕГИИ:\n' + prevText + '\n\n' +
          'Верни СТРОГО валидный JSON с 3 вариантами:\n' +
          '{"variants":[' +
          '{"label":"Вариант 1: название","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"},' +
          '{"label":"Вариант 2: название","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"},' +
          '{"label":"Вариант 3: название","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"}' +
          ']}',
      },
    ];
  }

  if (type === 'touch') {
    const transcript = body.transcript ?? '';
    const clientName = body.client_name ?? 'клиент';
    return [
      {
        role: 'system',
        content: 'Ты CSM-аналитик. Разбираешь транскрипт встречи или звонка с клиентом. ' +
          'Извлекай только то, что явно упомянуто. ' +
          'Отвечай ТОЛЬКО валидным JSON без markdown и без пояснений.',
      },
      {
        role: 'user',
        content:
          'Клиент: ' + clientName + '\n\n' +
          'Транскрипт встречи:\n' + transcript + '\n\n' +
          'Разбери транскрипт и верни СТРОГО валидный JSON:\n' +
          '{\n' +
          '  "context":     "краткий контекст встречи (1-2 предложения)",\n' +
          '  "tasks":       "список задач bullet-points, или null",\n' +
          '  "next":        "следующие шаги bullet-points, или null",\n' +
          '  "strategy":    "стратегические наблюдения, или null",\n' +
          '  "outcome":     "ожидаемый результат, или null",\n' +
          '  "blockers":    "блокеры и риски, или null",\n' +
          '  "signals": {\n' +
          '    "team_scope_request":false,"new_services_interest":false,"strategic_sessions":false,\n' +
          '    "fast_responses":false,"internal_events":false,"shared_business_plans":false,\n' +
          '    "contract_renewal":false,"upsell":false,"cross_sell":false,"positive_feedback":false,\n' +
          '    "slow_responses":false,"missed_meetings":false,"no_planning":false,\n' +
          '    "detailed_report_request":false,"scope_reduction":false,"competitor_mentions":false,\n' +
          '    "new_decision_maker":false,"exit_questions":false,"reduced_frequency":false,\n' +
          '    "no_growth_response":false,"complaint":false,"payment_delay_10_30":false,\n' +
          '    "specialist_replacement":false,"escalation":false,"payment_delay_30plus":false,"churn":false\n' +
          '  },\n' +
          '  "pc": {\n' +
          '    "people_count":null,"project_complexity":null,"reporting":null,\n' +
          '    "risk_probability":null,"risk_consequences":null,"face_role":null,"emotional_load":null\n' +
          '  },\n' +
          '  "explanation": "1-2 предложения почему выставлены эти сигналы"\n' +
          '}',
      },
    ];
  }

  return body.messages ?? [];
}

/* ── Fetch Handler ── */
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    /* ── AI Proxy ── */
    if (path === '/ai/chat' && method === 'POST') {
      try {
        const body     = await request.json();
        const messages = await buildMessages(body, env);
        if (!messages.length) return json({ error: 'No messages provided' }, 400);

        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}` },
          body: JSON.stringify({
            model:       body.model       ?? 'deepseek-chat',
            temperature: body.temperature ?? 0.3,
            max_tokens:  body.max_tokens  ?? 1000,
            messages,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          return json({ error: `DeepSeek error: ${response.status}`, detail: text }, 502);
        }
        return json(await response.json());
      } catch (e) { return json({ error: e.message }, 500); }
    }

    /* ── MC Forecast (контекстный прогноз по клиенту) ── */
    /* ── MC Snapshot ── */
    if (path === '/mc/snapshot' && method === 'GET') {
      const clientId = url.searchParams.get('client_id');
      if (!clientId) return json({ error: 'client_id required' }, 400);
      try {
        const row = await env.DB.prepare(
          'SELECT snapshot, updated_at FROM mc_snapshots WHERE client_id = ?'
        ).bind(clientId).first();
        if (!row) return json({ data: null });
        const snap = JSON.parse(row.snapshot);
        if (snap?.ts) {
          const age = Date.now() - new Date(snap.ts).getTime();
          if (age > 24 * 60 * 60 * 1000) return json({ data: null });
        }
        return json({ data: snap });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    if (path === '/mc/snapshot' && method === 'POST') {
      try {
        const body     = await request.json();
        const clientId = body.client_id;
        const snapshot = body.snapshot;
        if (!clientId || !snapshot) return json({ error: 'client_id and snapshot required' }, 400);
        const existing = await env.DB.prepare(
          'SELECT id FROM mc_snapshots WHERE client_id = ?'
        ).bind(clientId).first();
        if (existing) {
          await env.DB.prepare(
            'UPDATE mc_snapshots SET snapshot = ?, updated_at = ? WHERE client_id = ?'
          ).bind(JSON.stringify(snapshot), new Date().toISOString(), clientId).run();
        } else {
          await env.DB.prepare(
            'INSERT INTO mc_snapshots (id, client_id, snapshot, updated_at) VALUES (?, ?, ?, ?)'
          ).bind(crypto.randomUUID(), clientId, JSON.stringify(snapshot), new Date().toISOString()).run();
        }
        return json({ success: true });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    /* ── MC Context — cfg + AI без симуляции (клиент гоняет MCEngine) ── */
    if (path === '/mc/context' && method === 'POST') {
      try {
        const body     = await request.json();
        const clientId = body.client_id;
        if (!clientId) return json({ error: 'client_id required' }, 400);

        const [
          client,
          { results: bchsEntries },
          { results: touchPoints },
          { results: accStrats },
          mcConfigRow,
        ] = await Promise.all([
          env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first(),
          env.DB.prepare('SELECT * FROM bchs_entries WHERE client_id = ? ORDER BY year DESC, month DESC LIMIT 12').bind(clientId).all(),
          env.DB.prepare('SELECT * FROM touch_points WHERE client_id = ? ORDER BY created_at DESC LIMIT 5').bind(clientId).all(),
          env.DB.prepare("SELECT * FROM account_strategies WHERE client_id = ? AND status != 'done' ORDER BY created_at DESC LIMIT 3").bind(clientId).all(),
          env.DB.prepare('SELECT * FROM mc_configs WHERE client_id = ?').bind(clientId).first(),
        ]);

        if (!client) return json({ error: 'Client not found' }, 404);

        const latestEntry = bchsEntries[0] ?? null;

        /* bCHS вычисляется из сигналов — поля bchs в БД нет */
        const currentBCHS = bchsNorm(latestEntry);

        /* тренд */
        let trend = null;
        if (bchsEntries.length >= 2) {
          const n0 = bchsNorm(bchsEntries[0]);
          const n1 = bchsNorm(bchsEntries[1]);
          if (n0 !== null && n1 !== null)
            trend = Math.round((n0 - n1) * 10) / 10;
        }

        /* cfg: defaults → client MR → сигналы → сохранённый конфиг */
        let cfg = Object.assign(
          {},
          MCEngine.DEFAULTS,
          { monthly_revenue: Number(client.monthly_revenue) || 5000 },
        );
        cfg = adjustCfgBySignals(cfg, latestEntry);
        /* сохранённый конфиг клиента перезаписывает только явно заданные поля */
        if (mcConfigRow) {
          const saved = Object.assign({}, mcConfigRow);
          delete saved.id; delete saved.client_id; delete saved.created_at; delete saved.updated_at;
          for (const [k, v] of Object.entries(saved)) {
            if (v !== null && v !== undefined && v !== '') cfg[k] = v;
          }
        }

        /* активные сигналы */
        const SIGNAL_KEYS = [
          'team_scope_request','new_services_interest','strategic_sessions','fast_responses',
          'internal_events','shared_business_plans','contract_renewal','upsell','cross_sell',
          'positive_feedback','slow_responses','missed_meetings','no_planning',
          'detail_report_request','scope_reduction','competitor_mentions','new_decision_maker',
          'exit_questions','reduced_frequency','no_growth_response','complaint',
          'payment_delay_10_30','specialist_replacement','escalation','payment_delay_30plus','churn',
        ];
        const activeSignals = latestEntry
          ? SIGNAL_KEYS.filter(k => latestEntry[k])
          : [];

        /* история bCHS для промпта */
        const bchsHistory = bchsEntries.slice(0, 6).map(e => ({
          month: e.month, year: e.year,
          bchs: bchsNorm(e),
        }));

        /* касания */
        const recentTouchSummaries = touchPoints
          .map(t => { try { return JSON.parse(t.ai_summary || 'null')?.context || null; } catch { return null; } })
          .filter(Boolean).slice(0, 3);

        const currentStrat = accStrats[0] ?? null;

        /* AI советы */
        const advicePrompt = [
          {
            role: 'system',
            content: 'Ты старший CSM-аналитик. Анализируешь клиентский аккаунт и даёшь конкретные советы. ' +
              'Отвечай ТОЛЬКО валидным JSON без markdown и пояснений.',
          },
          {
            role: 'user',
            content:
              'Клиент: ' + client.name + ' | Сегмент: ' + (client.bcg_category ?? '—') +
              ' | MR: $' + Number(client.monthly_revenue || 0).toLocaleString('en-US') + '\n' +
              'bCHS (0-100): ' + (currentBCHS ?? 'нет данных') +
              ' | Тренд: ' + (trend !== null ? (trend > 0 ? '+' : '') + trend : '—') + '\n' +
              'История bCHS: ' + (bchsHistory.length
                ? bchsHistory.map(h => h.month + '/' + h.year + ':' + h.bchs).join(', ')
                : 'нет истории') + '\n\n' +
              'Параметры симуляции (клиент сам гоняет Monte Carlo):\n' +
              '  drift=' + cfg.drift + ', volatility=' + cfg.volatility +
              ', p_churn=' + cfg.p_churn + ', p_escalation=' + cfg.p_escalation +
              ', p_upsell=' + cfg.p_upsell + ', monthly_revenue=' + cfg.monthly_revenue + '\n\n' +
              'АКТИВНЫЕ СИГНАЛЫ: ' + (activeSignals.length ? activeSignals.join(', ') : 'нет') + '\n\n' +
              'ПОСЛЕДНИЕ КАСАНИЯ:\n' +
              (recentTouchSummaries.length ? recentTouchSummaries.map(s => '- ' + s).join('\n') : 'нет данных') + '\n\n' +
              'ТЕКУЩАЯ СТРАТЕГИЯ: ' + (currentStrat ? (currentStrat.focus || currentStrat.goal || '—') : 'не задана') + '\n\n' +
              'Верни JSON:\n' +
              '{\n' +
              '  "risk_level": "low|medium|high|critical",\n' +
              '  "summary": "2-3 предложения оценки без эмодзи",\n' +
              '  "key_insight": "главный вывод одним предложением без эмодзи",\n' +
              '  "advice": [\n' +
              '    {"priority":"high","action":"конкретное действие","impact":"ожидаемый эффект","horizon":"3m"},\n' +
              '    {"priority":"high","action":"...","impact":"...","horizon":"3m"},\n' +
              '    {"priority":"medium","action":"...","impact":"...","horizon":"6m"},\n' +
              '    {"priority":"medium","action":"...","impact":"...","horizon":"12m"}\n' +
              '  ],\n' +
              '  "signals_impact": "как сигналы повлияли на параметры без эмодзи",\n' +
              '  "upside_scenario": "что сделать для p90 сценария без эмодзи"\n' +
              '}',
          },
        ];

        const aiResp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}` },
          body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.3, max_tokens: 1000, messages: advicePrompt }),
        });

        let advice = null;
        if (aiResp.ok) {
          const aiData  = await aiResp.json();
          const content = aiData?.choices?.[0]?.message?.content ?? '';
          const match   = content.match(/\{[\s\S]*\}/);
          try { advice = JSON.parse(match ? match[0] : content); } catch { advice = null; }
        }

        return json({
          success:       true,
          client_id:     clientId,
          current_bchs:  currentBCHS,
          trend,
          active_signals: activeSignals,
          suggested_cfg: cfg,
          cfg_adjustments: {
            p_churn:      cfg.p_churn,
            p_escalation: cfg.p_escalation,
            p_upsell:     cfg.p_upsell,
            volatility:   cfg.volatility,
            monthly_revenue: cfg.monthly_revenue,
          },
          advice,
        });

      } catch (e) { return json({ error: e.message }, 500); }
    }


    if (path === '/mc/forecast' && method === 'POST') {
      try {
        const body     = await request.json();
        const clientId = body.client_id;
        if (!clientId) return json({ error: 'client_id required' }, 400);

        // Читаем все данные клиента из БД
        const [
          client,
          { results: bchsEntries },
          { results: touchPoints },
          { results: accStrats },
          mcConfigRow,
        ] = await Promise.all([
          env.DB.prepare('SELECT * FROM clients WHERE id = ?').bind(clientId).first(),
          env.DB.prepare('SELECT * FROM bchs_entries WHERE client_id = ? ORDER BY year DESC, month DESC LIMIT 12').bind(clientId).all(),
          env.DB.prepare('SELECT * FROM touch_points WHERE client_id = ? ORDER BY created_at DESC LIMIT 5').bind(clientId).all(),
          env.DB.prepare("SELECT * FROM account_strategies WHERE client_id = ? AND status != 'done' ORDER BY created_at DESC LIMIT 3").bind(clientId).all(),
          env.DB.prepare('SELECT * FROM mc_configs WHERE client_id = ?').bind(clientId).first(),
        ]);

        if (!client) return json({ error: 'Client not found' }, 404);

        // Последняя запись bCHS
        const latestEntry = bchsEntries[0] ?? null;
        const currentBCHS = latestEntry?.bchs ?? null;

        // Тренд — разница последних двух записей
        let trend = null;
        if (bchsEntries.length >= 2) {
          trend = Math.round((bchsEntries[0].bchs - bchsEntries[1].bchs) * 10) / 10;
        }

        // Базовый конфиг + автокоррекция под сигналы
        let cfg = Object.assign({}, MCEngine.DEFAULTS,
          { monthly_revenue: client.monthly_revenue || 5000 },
          mcConfigRow || {}
        );
        cfg = adjustCfgBySignals(cfg, latestEntry);

        // Запускаем симуляцию
        const mcResult = MCEngine.run(currentBCHS, cfg);

        // Собираем активные сигналы для контекста
        const SIGNAL_KEYS = [
          'team_scope_request','new_services_interest','strategic_sessions','fast_responses',
          'internal_events','shared_business_plans','contract_renewal','upsell','cross_sell',
          'positive_feedback','slow_responses','missed_meetings','no_planning',
          'detailed_report_request','scope_reduction','competitor_mentions','new_decision_maker',
          'exit_questions','reduced_frequency','no_growth_response','complaint',
          'payment_delay_10_30','specialist_replacement','escalation','payment_delay_30plus','churn',
        ];
        const activeSignals = latestEntry
          ? SIGNAL_KEYS.filter(k => latestEntry[k])
          : [];

        // Последние касания для контекста
        const recentTouchSummaries = touchPoints
          .map(t => {
            try { return JSON.parse(t.ai_summary || 'null')?.context || null; } catch { return null; }
          })
          .filter(Boolean)
          .slice(0, 3);

        // Текущая стратегия
        const currentStrat = accStrats[0] ?? null;

        // История bCHS
        const bchsHistory = bchsEntries.slice(0, 6).map(e => ({
          month: e.month, year: e.year, bchs: e.bchs,
        }));

        // Вызываем DeepSeek за советами
        const h3  = mcResult.horizons['3m'];
        const h12 = mcResult.horizons['12m'];

        const advicePrompt = [
          {
            role: 'system',
            content: 'Ты старший CSM-аналитик. Даёшь конкретные, actionable советы на основе данных. ' +
              'Отвечай ТОЛЬКО валидным JSON без markdown.',
          },
          {
            role: 'user',
            content:
              'Клиент: ' + client.name + ' · BCG: ' + (client.bcg_category ?? '—') +
              ' · MR: $' + Number(client.monthly_revenue || 0).toLocaleString('en-US') + '\n' +
              'bCHS текущий: ' + (currentBCHS ?? '—') + ' · Тренд: ' + (trend !== null ? (trend > 0 ? '+' : '') + trend : '—') + '\n' +
              'История bCHS: ' + bchsHistory.map(h => h.month + '/' + h.year + ':' + h.bchs).join(', ') + '\n\n' +
              'МОНТЕ-КАРЛО ПРОГНОЗ:\n' +
              '- 3М: bCHS медиана=' + h3.bchs.median + ' (p10=' + h3.bchs.p10 + ', p90=' + h3.bchs.p90 + ')' +
              ' · отток=' + h3.churn_rate + '% · MR медиана=$' + h3.mr.median + '\n' +
              '- 12М: bCHS медиана=' + h12.bchs.median + ' (p10=' + h12.bchs.p10 + ', p90=' + h12.bchs.p90 + ')' +
              ' · отток=' + h12.churn_rate + '% · MR медиана=$' + h12.mr.median + '\n\n' +
              'АКТИВНЫЕ СИГНАЛЫ: ' + (activeSignals.length ? activeSignals.join(', ') : 'нет') + '\n\n' +
              'ПОСЛЕДНИЕ КАСАНИЯ:\n' + (recentTouchSummaries.length ? recentTouchSummaries.map(s => '- ' + s).join('\n') : 'нет данных') + '\n\n' +
              'ТЕКУЩАЯ СТРАТЕГИЯ: ' + (currentStrat ? (currentStrat.focus || currentStrat.goal || '—') : 'не задана') + '\n\n' +
              'Верни JSON:\n' +
              '{\n' +
              '  "risk_level": "low|medium|high|critical",\n' +
              '  "summary": "2-3 предложения общей оценки ситуации",\n' +
              '  "key_insight": "главный вывод из прогноза одним предложением",\n' +
              '  "advice": [\n' +
              '    {"priority":"high","action":"конкретное действие","impact":"ожидаемый эффект","horizon":"3m"},\n' +
              '    {"priority":"high","action":"...","impact":"...","horizon":"3m"},\n' +
              '    {"priority":"medium","action":"...","impact":"...","horizon":"6m"},\n' +
              '    {"priority":"medium","action":"...","impact":"...","horizon":"12m"}\n' +
              '  ],\n' +
              '  "signals_impact": "как активные сигналы повлияли на прогноз",\n' +
              '  "upside_scenario": "что нужно сделать для достижения p90 сценария"\n' +
              '}',
          },
        ];

        const aiResp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}` },
          body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.3, max_tokens: 1200, messages: advicePrompt }),
        });

        let advice = null;
        if (aiResp.ok) {
          const aiData  = await aiResp.json();
          const content = aiData?.choices?.[0]?.message?.content ?? '';
          const match   = content.match(/\{[\s\S]*\}/);
          try { advice = JSON.parse(match ? match[0] : content); } catch { advice = null; }
        }

        return json({
          success:       true,
          client_id:     clientId,
          current_bchs:  currentBCHS,
          trend,
          horizons:      mcResult.horizons,
          active_signals: activeSignals,
          cfg_adjustments: {
            p_churn:    cfg.p_churn,
            p_escalation: cfg.p_escalation,
            p_upsell:   cfg.p_upsell,
            volatility: cfg.volatility,
          },
          advice,
        });

      } catch (e) { return json({ error: e.message }, 500); }
    }

    /* ── Touch Save (AI + persist) ── */
    if (path === '/touch/save' && method === 'POST') {
      try {
        const body       = await request.json();
        const clientId   = body.client_id;
        const clientName = body.client_name ?? 'клиент';
        const transcript = body.transcript  ?? '';
        const type       = body.type        ?? 'checkin';
        const month      = body.month;
        const year       = body.year;

        if (!clientId) return json({ error: 'client_id required' }, 400);

        let parsed = body.parsed ?? null;

        if (!parsed && transcript) {
          const msgs = await buildMessages({ type: 'touch', client_name: clientName, transcript }, env);
          const aiResp = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}` },
            body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.3, max_tokens: 1400, messages: msgs }),
          });
          if (aiResp.ok) {
            const aiData  = await aiResp.json();
            const content = aiData?.choices?.[0]?.message?.content ?? '';
            const match   = content.match(/\{[\s\S]*\}/);
            try { parsed = JSON.parse(match ? match[0] : content); } catch { parsed = null; }
          }
        }

        const parts = [
          parsed?.context  && 'Контекст:\n'            + parsed.context,
          parsed?.tasks    && 'Задачи:\n'               + parsed.tasks,
          parsed?.next     && 'Дальнейшие шаги:\n'     + parsed.next,
          parsed?.strategy && 'Стратегия:\n'            + parsed.strategy,
          parsed?.outcome  && 'Ожидаемый результат:\n' + parsed.outcome,
          parsed?.blockers && 'Блокеры:\n'              + parsed.blockers,
        ].filter(Boolean);

        const notes     = body.notes || parts.join('\n\n') || '';
        const aiSummary = parsed ? JSON.stringify({
          context: parsed.context || null, tasks: parsed.tasks || null,
          next: parsed.next || null, strategy: parsed.strategy || null,
          outcome: parsed.outcome || null, blockers: parsed.blockers || null,
        }) : null;

        const touchId = crypto.randomUUID();
        await env.DB.prepare(
          'INSERT INTO touch_points (id, client_id, type, completed_at, notes, ai_summary) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(touchId, clientId, type, new Date().toISOString(), notes, aiSummary).run();

        const SIGNAL_KEYS = [
          'team_scope_request','new_services_interest','strategic_sessions','fast_responses',
          'internal_events','shared_business_plans','contract_renewal','upsell','cross_sell',
          'positive_feedback','slow_responses','missed_meetings','no_planning',
          'detailed_report_request','scope_reduction','competitor_mentions','new_decision_maker',
          'exit_questions','reduced_frequency','no_growth_response','complaint',
          'payment_delay_10_30','specialist_replacement','escalation','payment_delay_30plus','churn',
        ];

        if (parsed?.signals && month && year) {
          const sigVals = SIGNAL_KEYS.map(k => parsed.signals[k] ? 1 : 0);
          const existing = await env.DB.prepare(
            'SELECT id FROM bchs_entries WHERE client_id = ? AND month = ? AND year = ?'
          ).bind(clientId, month, year).first();

          if (existing) {
            const setClause = SIGNAL_KEYS.map(k => k + ' = ?').join(', ') + ', status_note = ?, updated_at = ?';
            await env.DB.prepare('UPDATE bchs_entries SET ' + setClause + ' WHERE client_id = ? AND month = ? AND year = ?')
              .bind(...sigVals, notes, new Date().toISOString(), clientId, month, year).run();
          } else {
            const cols = ['id', 'client_id', 'month', 'year', ...SIGNAL_KEYS, 'status_note'];
            const vals = [crypto.randomUUID(), clientId, month, year, ...sigVals, notes];
            await env.DB.prepare('INSERT INTO bchs_entries (' + cols.join(', ') + ') VALUES (' + cols.map(() => '?').join(', ') + ')')
              .bind(...vals).run();
          }
        }

        const PC_KEYS = ['people_count','project_complexity','reporting','risk_probability','risk_consequences','face_role','emotional_load'];
        if (parsed?.pc && month && year) {
          const pcVals = PC_KEYS.map(k => { const v = parsed.pc[k]; return (v >= 1 && v <= 5) ? v : null; });
          const existingPc = await env.DB.prepare(
            'SELECT id FROM pc_entries WHERE client_id = ? AND month = ? AND year = ?'
          ).bind(clientId, month, year).first();

          if (existingPc) {
            const setClause = PC_KEYS.map(k => k + ' = ?').join(', ') + ', updated_at = ?';
            await env.DB.prepare('UPDATE pc_entries SET ' + setClause + ' WHERE client_id = ? AND month = ? AND year = ?')
              .bind(...pcVals, new Date().toISOString(), clientId, month, year).run();
          } else {
            const cols = ['id', 'client_id', 'month', 'year', ...PC_KEYS];
            const vals = [crypto.randomUUID(), clientId, month, year, ...pcVals];
            await env.DB.prepare('INSERT INTO pc_entries (' + cols.join(', ') + ') VALUES (' + cols.map(() => '?').join(', ') + ')')
              .bind(...vals).run();
          }
        }

        return json({ success: true, touch_id: touchId, parsed });
      } catch (e) { return json({ error: e.message }, 500); }
    }

    /* ── Tables CRUD ── */
    const match = path.match(/^\/tables\/([a-z_]+)(\/(.+))?$/);
    if (!match) return json({ error: 'Not found' }, 404);

    const table = match[1];
    const id    = match[3] || null;

    try {
      if (method === 'GET' && !id) {
        const limit = url.searchParams.get('limit') || 500;
        const sort  = url.searchParams.get('sort')  || null;
        let query   = `SELECT * FROM ${table} LIMIT ${limit}`;
        if (sort) query += ` ORDER BY ${sort} DESC`;
        const { results } = await env.DB.prepare(query).all();
        return json({ data: results });
      }
      if (method === 'GET' && id) {
        const { results } = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).all();
        return json(results[0] || null);
      }
      if (method === 'POST') {
        const body         = await request.json();
        const keys         = Object.keys(body);
        const placeholders = keys.map(() => '?').join(', ');
        const values       = keys.map(k => body[k]);
        const result       = await env.DB.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`).bind(...values).run();
        return json({ success: true, meta: result.meta });
      }
      if (method === 'PUT' && id) {
        const body      = await request.json();
        const keys      = Object.keys(body);
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values    = [...keys.map(k => body[k]), id];
        const result    = await env.DB.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`).bind(...values).run();
        return json({ success: true, meta: result.meta });
      }
      if (method === 'DELETE' && id) {
        await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
        return json({ success: true });
      }
      return json({ error: 'Method not allowed' }, 405);
    } catch (e) { return json({ error: e.message }, 500); }
  },
};
