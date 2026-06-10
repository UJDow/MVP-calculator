/* ============================================
   js/mc_page.js — Monte Carlo Forecast Page (ES Module)
   Portfolio BCHS v7.0
   Tab inside Client Detail — backend-powered
   ============================================ */

import { MCEngine } from './mc_engine.js';

const BASE_URL = 'https://bchs-api.lexsnitko.workers.dev';

export const MCPage = {

  /* ── API helpers for mc_configs ─────────────────────────────── */
  _cfgCache: {},

  async getConfig(clientId) {
    if (this._cfgCache[clientId]) return this._cfgCache[clientId];
    try {
      const r = await fetch(`${BASE_URL}/tables/mc_configs?limit=500`);
      if (!r.ok) return null;
      const j    = await r.json();
      const rows = Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
      const found = rows.find(x => String(x.client_id) === String(clientId));
      if (found) this._cfgCache[clientId] = found;
      return found ?? null;
    } catch { return null; }
  },

  async saveConfig(clientId, data) {
    delete this._cfgCache[clientId];
    const existing = await this.getConfig(clientId);
    const payload  = { client_id: clientId, ...data };
    ['id','gs_project_id','gs_table_name','created_at','updated_at']
      .forEach(k => delete payload[k]);
    try {
      const url    = existing
        ? `${BASE_URL}/tables/mc_configs/${existing.id}`
        : `${BASE_URL}/tables/mc_configs`;
      const method = existing ? 'PUT' : 'POST';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const saved = await r.json();
      this._cfgCache[clientId] = saved;
      return saved;
    } catch (e) {
      console.error('[MCPage.saveConfig]', e);
      return null;
    }
  },

  /* ── State ──────────────────────────────────────────────────── */
  client:        null,
  bchs_raw:      null,
  cfg:           null,
  result:        null,
  advice:        null,
  activeHorizon: '3m',
  configOpen:    false,
  fanChart:      null,

  /* ── Entry point ─────────────────────────────────────────────── */
  async mount(client, bchs_raw) {
    this.client        = client;
    this.bchs_raw      = bchs_raw;
    this.result        = null;
    this.advice        = null;
    this.activeHorizon = '3m';
    this.configOpen    = false;

    if (this.fanChart) {
      this.fanChart.destroy();
      this.fanChart = null;
    }

    const container = document.getElementById('mc-tab-content');
    if (!container) return;

    const stored = await this.getConfig(client.id);
    this.cfg = Object.assign({}, MCEngine.DEFAULTS,
      { monthly_revenue: client.monthly_revenue || 5000 },
      stored || {}
    );

    this._renderShell(container);

    // Пробуем загрузить сохранённый снапшот — покажем мгновенно
    const cached = await this._loadSnapshot();
    if (cached) {
      this.result = { horizons: cached.horizons, fan_chart: null };
      this.advice = cached.advice;
      this._lastSnapshot = cached;
      const output = document.getElementById('mc-output');
      const nodata = document.getElementById('mc-nodata');
      if (output) { output.classList.remove('hidden'); this._renderOutput(output); }
      setTimeout(() => { const chip=document.querySelector('.mc-advice-risk-chip'); if(chip){const l={low:'Низкий риск',medium:'Средний риск',high:'Высокий риск',critical:'Критический'};const r=this._riskForHorizon(this.activeHorizon||'3m');chip.textContent=l[r];chip.className='mc-advice-risk-chip '+r;}}, 150);
      if (nodata) nodata.classList.add('hidden');

      // Показываем метку что данные кешированы
      const blSigs = document.getElementById('mc-bl-signals');
      if (blSigs && cached.ts) {
        const d = new Date(cached.ts);
        blSigs.textContent = 'Кеш от ' + d.toLocaleDateString('ru-RU') +
          ' · Нажмите ↻ для обновления';
        blSigs.style.color = '#9ca3af';
      }
    } else {
      await this._runAndRender();
    }
  },

  async _loadSnapshot() {
    /* 1. Память — та же сессия */
    if (this._lastSnapshot?.horizons) return this._lastSnapshot;
    if (!this.client?.id) return null;
    /* 2. БД — таблица mc_snapshots */
    try {
      const r = await fetch(`${BASE_URL}/mc/snapshot?client_id=${this.client.id}`);
      if (!r.ok) return null;
      const j = await r.json();
      if (j.data?.horizons) return j.data;
      return null;
    } catch { return null; }
  },

  /* ── Shell ───────────────────────────────────────────────────── */
  _renderShell(container) {
    container.innerHTML = `
      <div class="mc-header">
        <div>
          <div class="mc-title">Monte Carlo Прогноз</div>
          <div class="mc-subtitle">5 000 сценариев · Каскад 3М → 6М → 12М · AI-советы</div>
        </div>
        <div class="mc-header-actions">
          <button class="btn btn-primary btn-sm"   id="mc-run">↻ Пересчитать</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-toggle">Параметры</button>
        </div>
      </div>

      <div class="mc-baseline" id="mc-baseline">
        <span>Текущий bCHS: <strong id="mc-bl-bchs">—</strong></span>
        <span>Базовый MR: <strong id="mc-bl-mr">—</strong></span>
        <span id="mc-bl-signals" style="font-size:11px;color:var(--text-muted)"></span>
      </div>

      <div id="mc-config-panel" class="mc-config-panel hidden">
        ${this._configPanelHTML()}
      </div>

      <div id="mc-results">
        <div class="mc-loading hidden" id="mc-loading">
          <div class="mc-spinner"></div>
          <div class="mc-loading-text">Анализируем контекст и запускаем сценарии...</div>
        </div>
        <div id="mc-output" class="hidden"></div>
        <div id="mc-nodata" class="mc-nodata hidden">
          <div class="mc-nodata-icon"></div>
          <div class="mc-nodata-title">Прогноз ещё не запущен</div>
          <button class="btn btn-primary" id="mc-first-run">▶ Запустить прогноз</button>
        </div>
      </div>
    `;

    document.getElementById('mc-run')
      ?.addEventListener('click', () => this._runAndRender());
    document.getElementById('mc-cfg-toggle')
      ?.addEventListener('click', () => this._toggleConfig());
    document.getElementById('mc-first-run')
      ?.addEventListener('click', () => this._runAndRender());

    const blBchs = document.getElementById('mc-bl-bchs');
    const blMr   = document.getElementById('mc-bl-mr');
    if (blBchs) blBchs.textContent = this.bchs_raw !== null ? String(this.bchs_raw) : '—';
    if (blMr)   blMr.textContent   = this._fmtMR(this.cfg.monthly_revenue);
  },

  /* ── Config panel ────────────────────────────────────────────── */
  _configPanelHTML() {
    const c = this.cfg;
    const f = (key, label, step, min, max) => `
      <div class="mc-cfg-field">
        <label class="mc-cfg-label">${label}</label>
        <input type="number" class="mc-cfg-input" id="mcc-${key}"
               value="${c[key] !== undefined ? c[key] : MCEngine.DEFAULTS[key]}"
               step="${step}" min="${min}" max="${max}" />
      </div>`;

    return `
      <div class="mc-config-inner">
        <div class="mc-config-title">Параметры симуляции</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
          Параметры автоматически корректируются под сигналы клиента.
          Здесь можно задать базовые значения.
        </div>
        <div class="mc-config-grid">
          <div class="mc-config-col">
            <div class="mc-config-group-title">Динамика bCHS</div>
            ${f('drift',           'Дрейф (ежемес.)',         '0.1',  '-10',    '10')}
            ${f('volatility',      'Волатильность (σ)',        '0.1',  '0',      '20')}
            ${f('mean_reversion',  'Сила возврата к норме',    '0.01', '0',      '1')}
            ${f('equilibrium',     'Норма равновесия (0–100)', '1',    '0',      '100')}
            ${f('monthly_revenue', 'Базовый MR ($/мес)',       '100',  '0',      '9999999')}
          </div>
          <div class="mc-config-col">
            <div class="mc-config-group-title">Вероятности событий</div>
            ${f('p_strategic_meeting',      'P(стратег. встреча)',     '0.01', '0', '1')}
            ${f('impact_strategic_meeting', 'Эффект стратег. встречи', '0.5',  '-20','20')}
            ${f('p_fast_response',          'P(быстрый ответ)',        '0.01', '0', '1')}
            ${f('impact_fast_response',     'Эффект быстрого ответа',  '0.5',  '-10','10')}
            ${f('p_upsell',                 'P(апселл)',               '0.01', '0', '1')}
            ${f('impact_upsell_mr',         'Эффект апселла (MR)',     '100',  '-9999','9999')}
            ${f('p_escalation',             'P(эскалация)',            '0.01', '0', '1')}
            ${f('impact_escalation',        'Эффект эскалации',        '0.5',  '-30','0')}
            ${f('p_complaint',              'P(жалоба)',               '0.01', '0', '1')}
            ${f('impact_complaint',         'Эффект жалобы',           '0.5',  '-20','0')}
            ${f('p_mr_downgrade',           'P(снижение MR)',          '0.01', '0', '1')}
            ${f('impact_mr_downgrade',      'Эффект снижения MR',     '100',  '-9999','0')}
            ${f('p_churn',                  'P(отток / мес)',          '0.005','0', '0.5')}
          </div>
        </div>
        <div class="mc-config-actions">
          <button class="btn btn-primary btn-sm"   id="mc-cfg-save">Сохранить и пересчитать</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-reset">Сброс к умолчаниям</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-close">✕ Закрыть</button>
        </div>
      </div>`;
  },

  _toggleConfig() {
    const panel = document.getElementById('mc-config-panel');
    if (!panel) return;
    this.configOpen = !this.configOpen;
    panel.classList.toggle('hidden', !this.configOpen);
    if (this.configOpen) {
      this._bindConfigEvents();
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  _bindConfigEvents() {
    const saveBtn  = document.getElementById('mc-cfg-save');
    const resetBtn = document.getElementById('mc-cfg-reset');
    const closeBtn = document.getElementById('mc-cfg-close');

    if (saveBtn && !saveBtn._bound) {
      saveBtn._bound = true;
      saveBtn.addEventListener('click', async () => {
        this._readConfigFromForm();
        saveBtn.textContent = '⏳ Сохраняем...';
        saveBtn.disabled    = true;
        await this.saveConfig(this.client.id, this.cfg);
        saveBtn.textContent = 'Сохранить и пересчитать';
        saveBtn.disabled    = false;
        const blMr = document.getElementById('mc-bl-mr');
        if (blMr) blMr.textContent = this._fmtMR(this.cfg.monthly_revenue);
        window.App.toast('✅ Параметры сохранены', 'success');
        await this._runAndRender();
      });
    }

    if (resetBtn && !resetBtn._bound) {
      resetBtn._bound = true;
      resetBtn.addEventListener('click', () => {
        this.cfg = Object.assign({}, MCEngine.DEFAULTS,
          { monthly_revenue: this.client?.monthly_revenue || 5000 });
        const panel = document.getElementById('mc-config-panel');
        if (panel) panel.innerHTML = this._configPanelHTML();
        this._bindConfigEvents();
        window.App.toast('Параметры сброшены к умолчаниям', '');
      });
    }

    if (closeBtn && !closeBtn._bound) {
      closeBtn._bound = true;
      closeBtn.addEventListener('click', () => {
        this.configOpen = false;
        document.getElementById('mc-config-panel')?.classList.add('hidden');
      });
    }
  },

  _readConfigFromForm() {
    for (const k of Object.keys(MCEngine.DEFAULTS)) {
      const el = document.getElementById(`mcc-${k}`);
      if (el) this.cfg[k] = parseFloat(el.value) || MCEngine.DEFAULTS[k];
    }
  },

  /* ── Run — гибрид: воркер даёт cfg+advice, клиент гоняет MCEngine ── */
  async _runAndRender() {
    const loading = document.getElementById('mc-loading');
    const output  = document.getElementById('mc-output');
    const nodata  = document.getElementById('mc-nodata');

    loading?.classList.remove('hidden');
    output?.classList.add('hidden');
    nodata?.classList.add('hidden');

    try {
      /* ── Шаг 1: получаем обогащённый cfg и AI-советы с воркера ─ */
      const ctxResp = await fetch(`${BASE_URL}/mc/context`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ client_id: this.client.id }),
      });

      let serverCtx = null;
      if (ctxResp.ok) {
        const ctxData = await ctxResp.json();
        if (!ctxData.error) serverCtx = ctxData;
      }

      /* ── Шаг 2: мёрджим cfg (приоритет: сохранённый > серверный > defaults) ─ */
      const baseCfg = Object.assign(
        {},
        MCEngine.DEFAULTS,
        serverCtx?.suggested_cfg || {},
        this.cfg || {}
      );
      if (this.client.monthly_revenue) baseCfg.monthly_revenue = this.client.monthly_revenue;

      /* ── Шаг 3: клиент гоняет 5000 сценариев локально ─────── */
      const currentBCHS = serverCtx?.current_bchs ?? this.bchs_raw ?? null;
      const mcResult    = MCEngine.run(currentBCHS, baseCfg);

      /* ── Сохраняем ────────────────────────────────────────── */
      this.result = mcResult;
      this.advice = serverCtx?.advice || null;
      this.serverCtx = serverCtx;

      this._lastSnapshot = {
        ts:       new Date().toISOString(),
        current_bchs: serverCtx?.current_bchs ?? null,
        horizons: mcResult.horizons,
        advice:   this.advice,
        signals:  serverCtx?.active_signals || [],
        cfg:      baseCfg,
      };
      this._saveSnapshotToStrategy().catch(() => {});

      /* ── Baseline ─────────────────────────────────────────── */
      const blBchs = document.getElementById('mc-bl-bchs');
      const blMr   = document.getElementById('mc-bl-mr');
      const blSigs = document.getElementById('mc-bl-signals');
      if (blBchs) blBchs.textContent = currentBCHS !== null ? String(Math.round(currentBCHS * 10)/10) : '—';
      if (blMr)   blMr.textContent   = this._fmtMR(baseCfg.monthly_revenue);
      if (blSigs && serverCtx?.active_signals?.length) {
        blSigs.innerHTML =
          '<span class="mc-signal-badge">' + serverCtx.active_signals.length +
          ' сигналов учтено</span>';
      }

      loading?.classList.add('hidden');
      if (output) {
        output.classList.remove('hidden');
        this._renderOutput(output);
      }

    } catch (e) {
      console.error('[MCPage._runAndRender]', e);
      loading?.classList.add('hidden');
      if (output) {
        output.classList.remove('hidden');
        output.innerHTML = `<div class="mc-error-state">
          <div class="mc-error-icon">!</div>
          <div class="mc-error-title">Ошибка прогноза</div>
          <div class="mc-error-text">${e.message}</div>
        </div>`;
      }
    }
  },

  /* ── Output rendering ────────────────────────────────────────── */
  _renderOutput(container) {
    const res = this.result;
    container.innerHTML = `
      <div class="mc-horizons" id="mc-horizons">
        ${this._horizonCard('3m',  res.horizons['3m'])}
        ${this._horizonCard('6m',  res.horizons['6m'])}
        ${this._horizonCard('12m', res.horizons['12m'])}
      </div>

      <div id="mc-horizon-detail"></div>

      ${this.advice ? this._renderAdvice(this.advice) : ''}
    `;

    this._bindHorizonCards();
    this._renderHorizonDetail();
    this._updateRiskChip();
  },

  /* ── AI Советы ───────────────────────────────────────────────── */
  /* ── Пороги оттока по горизонту (best practice SaaS) ────────── */
  _churnThreshold(horizonKey) {
    return {
      '3m':  { low: 5,  medium: 15 },
      '6m':  { low: 10, medium: 25 },
      '12m': { low: 20, medium: 40 },
    }[horizonKey] ?? { low: 8, medium: 20 };
  },

  _churnClass(churn, horizonKey) {
    const t = this._churnThreshold(horizonKey);
    if (churn < t.low)    return 'low';
    if (churn < t.medium) return 'medium';
    return 'high';
  },

  /* ── Риск по горизонту ─────────────────────────────────────── */
  _riskForHorizon(horizonKey) {
    const h = this.result?.horizons?.[horizonKey];
    if (!h) return 'medium';
    const churn = h.churn_rate ?? 0;
    const t = this._churnThreshold(horizonKey);
    if (churn >= t.medium * 2) return 'critical';
    if (churn >= t.medium)     return 'high';
    if (churn >= t.low)        return 'medium';
    return 'low';
  },

  _updateRiskChip() {
    const chip = document.getElementById('mc-risk-chip');
    if (!chip) return;
    const labels = {low:'Низкий риск',medium:'Средний риск',high:'Высокий риск',critical:'Критический'};
    const rl = this._riskForHorizon(this.activeHorizon || '3m');
    chip.textContent = labels[rl];
    chip.className   = 'mc-advice-risk-chip ' + rl;
  },

  _renderAdvice(advice) {
    const riskLabels = {
      low:      'Низкий риск',
      medium:   'Средний риск',
      high:     'Высокий риск',
      critical: 'Критический',
    };
    /* Риск считаем из данных симуляции по активному горизонту */
    const riskLevel = this._riskForHorizon(this.activeHorizon || '3m');
    const riskLabel = riskLabels[riskLevel];
    const riskClass = riskLevel;

    const adviceRows = (advice.advice || []).map(a => `
      <div class="mc-advice-row">
        <div class="mc-advice-dot ${a.priority ?? 'medium'}"></div>
        <div class="mc-advice-content">
          <div class="mc-advice-action">${a.action}</div>
          <div class="mc-advice-impact">${a.impact}</div>
        </div>
        <div class="mc-advice-horizon-tag">${a.horizon}</div>
      </div>
    `).join('');

    const hasFooter = advice.signals_impact || advice.upside_scenario;

    return `
      <div class="mc-advice-block">
        <div class="mc-advice-header">
          <div class="mc-advice-title">AI-анализ</div>
          <div class="mc-advice-risk-chip" id="mc-risk-chip"></div>
        </div>

        ${advice.key_insight ? `
          <div class="mc-advice-insight">
            ${advice.key_insight}
          </div>` : ''}

        ${advice.summary ? `
          <div class="mc-advice-summary">${advice.summary}</div>` : ''}

        ${adviceRows ? `
          <div class="mc-advice-list">
            <div class="mc-advice-list-title">Рекомендации</div>
            ${adviceRows}
          </div>` : ''}

        ${hasFooter ? `
          <div class="mc-advice-footer">
            ${advice.signals_impact ? `
              <div class="mc-advice-signals-row">
                <span class="mc-footer-label">Сигналы</span>
                <span>${advice.signals_impact}</span>
              </div>` : ''}
            ${advice.upside_scenario ? `
              <div class="mc-advice-upside-row">
                <span class="mc-footer-label">Upside</span>
                <span>${advice.upside_scenario}</span>
              </div>` : ''}
          </div>` : ''}
      </div>`;
  },

  /* ── Horizon cards ───────────────────────────────────────────── */
  _horizonCard(key, stats) {
    const labels = { '3m': '3 Месяца', '6m': '6 Месяцев', '12m': '12 Месяцев' };
    const active = key === this.activeHorizon;
    const cr     = stats.churn_rate;
    const _ct=this._churnThreshold(key); const crCls=cr<_ct.low?'mc-churn-green':cr<_ct.medium?'mc-churn-yellow':'mc-churn-red';
    return `
      <div class="mc-horizon-card${active ? ' mc-horizon-active' : ''}"
           data-horizon="${key}">
        <div class="mc-horizon-label">${labels[key]}</div>
        <div class="mc-horizon-bchs">${stats.bchs.median.toFixed(1)}</div>
        <div class="mc-horizon-meta">bCHS медиана</div>
        <div class="mc-horizon-mr">${this._fmtMR(stats.mr.median)}</div>
        <div class="mc-horizon-meta">MR медиана</div>
        <div class="mc-churn-badge ${crCls}">${cr.toFixed(1)}% отток</div>
      </div>`;
  },

  _bindHorizonCards() {
    document.querySelectorAll('.mc-horizon-card').forEach(card => {
      card.addEventListener('click', () => {
        this.activeHorizon = card.dataset.horizon;
        document.querySelectorAll('.mc-horizon-card').forEach(c =>
          c.classList.toggle('mc-horizon-active', c.dataset.horizon === this.activeHorizon)
        );
        this._renderHorizonDetail();
        this._updateRiskChip();
      });
    });
  },

  /* ── Horizon detail ──────────────────────────────────────────── */
  _renderHorizonDetail() {
    const container = document.getElementById('mc-horizon-detail');
    if (!container) return;
    const stats   = this.result.horizons[this.activeHorizon];
    const hLabels = { '3m': '3 месяца', '6m': '6 месяцев', '12m': '12 месяцев' };

    // Анимация смены
    container.style.opacity = '0';
    container.style.transform = 'translateY(6px)';
    container.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    setTimeout(() => {
      container.innerHTML = `
        <div class="mc-stats-grid">
          ${this._bchsStatsCard(stats)}
          ${this._mrStatsCard(stats)}
          ${this._churnGaugeCard(stats, this.activeHorizon)}
        </div>
        <div class="mc-section">
          <div class="mc-section-title">
            Прогноз · ${hLabels[this.activeHorizon]}
            <span style="font-weight:400;font-size:11px;color:#9ca3af">
              из ${stats.n.toLocaleString('ru-RU')} симуляций
            </span>
          </div>
          <div class="mc-scenario-bars">
            ${this._scenarioBars(stats)}
          </div>
        </div>
      `;
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 120);
  },

  _scenarioBars(stats) {
    const b = stats.bchs;
    const ranges = [
      { label: 'P10 → P25',  from: b.p10,    to: b.p25,    color: '#fee2e2', text: '#ef4444' },
      { label: 'P25 → Медиана', from: b.p25, to: b.median,  color: '#fef9c3', text: '#d97706' },
      { label: 'Медиана',    from: b.median,  to: b.median,  color: '#e0e7ff', text: '#6366f1' },
      { label: 'Медиана → P75', from: b.median, to: b.p75,  color: '#dcfce7', text: '#10b981' },
      { label: 'P75 → P90',  from: b.p75,    to: b.p90,    color: '#d1fae5', text: '#059669' },
    ];
    return ranges.map(r => {
      const mid = r.from === r.to ? r.from : ((r.from + r.to) / 2);
      const w   = Math.max(mid, 2);
      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:100px;font-size:11px;color:#9ca3af;flex-shrink:0">${r.label}</div>
          <div style="flex:1;background:#f4f4f8;border-radius:20px;height:8px;overflow:hidden">
            <div style="width:${w}%;background:${r.color};height:100%;border-radius:20px;
                        border:1px solid ${r.text}22;transition:width 0.4s ease"></div>
          </div>
          <div style="width:36px;text-align:right;font-size:12px;font-weight:600;color:${r.text}">
            ${r.to.toFixed(1)}
          </div>
        </div>`;
    }).join('');
  },

  _bchsStatsCard(stats) {
    const b = stats.bchs;
    return `
      <div class="mc-stats-card">
        <div class="mc-stats-card-title">Прогноз bCHS (0–100)</div>
        <table class="mc-pct-table">
          <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${b.p10.toFixed(1)}</td></tr>
          <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${b.p25.toFixed(1)}</td></tr>
          <tr class="mc-pct-highlight">
            <td class="mc-pct-label">Медиана</td>
            <td class="mc-pct-val"><strong>${b.median.toFixed(1)}</strong></td>
          </tr>
          <tr><td class="mc-pct-label">Среднее</td><td class="mc-pct-val">${b.mean.toFixed(1)}</td></tr>
          <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${b.p75.toFixed(1)}</td></tr>
          <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${b.p90.toFixed(1)}</td></tr>
        </table>
      </div>`;
  },

  _mrStatsCard(stats) {
    const m = stats.mr;
    return `
      <div class="mc-stats-card">
        <div class="mc-stats-card-title">Прогноз MR</div>
        <table class="mc-pct-table">
          <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${this._fmtMR(m.p10)}</td></tr>
          <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${this._fmtMR(m.p25)}</td></tr>
          <tr class="mc-pct-highlight">
            <td class="mc-pct-label">Медиана</td>
            <td class="mc-pct-val"><strong>${this._fmtMR(m.median)}</strong></td>
          </tr>
          <tr><td class="mc-pct-label">Среднее</td><td class="mc-pct-val">${this._fmtMR(m.mean)}</td></tr>
          <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${this._fmtMR(m.p75)}</td></tr>
          <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${this._fmtMR(m.p90)}</td></tr>
        </table>
      </div>`;
  },

  _churnGaugeCard(stats, horizonKey="3m") {
    const cr   = stats.churn_rate;
    const _gt = this._churnThreshold(horizonKey);
    const cls  = cr < _gt.low ? '#10b981' : cr < _gt.medium ? '#f59e0b' : '#ef4444';
    const desc = cr < _gt.low
      ? 'Риск оттока низкий — сценарий устойчив'
      : cr < _gt.medium
        ? 'Умеренный риск — держать под контролем'
        : 'Высокий риск оттока — требует вмешательства';

    const r = 38, cx = 50, cy = 50;
    const circ   = 2 * Math.PI * r;
    const pct    = Math.min(cr / 50 * 100, 100);
    const offset = circ * (1 - pct / 100);

    return `
      <div class="mc-stats-card">
        <div class="mc-stats-card-title">Риск оттока</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px 0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="${cx}" cy="${cy}" r="${r}"
                    fill="none" stroke="var(--border)" stroke-width="8"/>
            <circle cx="${cx}" cy="${cy}" r="${r}"
                    fill="none" stroke="${cls}" stroke-width="8"
                    stroke-dasharray="${circ.toFixed(2)}"
                    stroke-dashoffset="${offset.toFixed(2)}"
                    stroke-linecap="round"
                    transform="rotate(-90 ${cx} ${cy})" />
            <text x="${cx}" y="${cy + 2}"
                  text-anchor="middle" dominant-baseline="middle"
                  font-size="16" font-weight="700"
                  fill="${cls}" font-family="Inter">${cr.toFixed(1)}%</text>
          </svg>
          <div style="text-align:center;font-size:11.5px;color:var(--text-secondary);line-height:1.4">${desc}</div>
          <div style="font-size:11px;color:var(--text-muted)">
            ${stats.churn_count.toLocaleString('ru-RU')} из ${stats.n.toLocaleString('ru-RU')} сценариев
          </div>
        </div>
      </div>`;
  },

  /* ── Snapshot persistence ───────────────────────────────────── */
  async _saveSnapshotToStrategy() {
    if (!this.client?.id || !this._lastSnapshot) return;
    /* Сохраняем в таблицу mc_snapshots */
    try {
      await fetch(`${BASE_URL}/mc/snapshot`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          client_id: this.client.id,
          snapshot:  this._lastSnapshot,
        }),
      });
    } catch { /* silent */ }
  },

  /* ── Format helpers ──────────────────────────────────────────── */
  _fmtMR(v) {
    if (v === null || v === undefined) return '—';
    if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + ' М';
    if (Math.abs(v) >= 1_000)     return (v / 1_000).toFixed(1) + ' К';
    return Math.round(v).toLocaleString('ru-RU');
  },
};

/* ── Expose globally ─────────────────────────────────────────────── */
window.MCPage = MCPage;
