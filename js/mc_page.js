/* ============================================
   Portfolio BCHS — Monte Carlo Forecast Page
   Tab inside Client Detail (Page 3)
   ============================================ */

const MCPage = {

  /* ---- API helpers for mc_configs ---- */
  _cfgCache: {},

  async getConfig(clientId) {
    if (this._cfgCache[clientId]) return this._cfgCache[clientId];
    try {
      const r = await fetch('tables/mc_configs?limit=500');
      if (!r.ok) return null;
      const j = await r.json();
      const rows = Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
      const found = rows.find(x => x.client_id === clientId);
      if (found) this._cfgCache[clientId] = found;
      return found || null;
    } catch (e) { return null; }
  },

  async saveConfig(clientId, data) {
    delete this._cfgCache[clientId];
    const existing = await this.getConfig(clientId);
    const payload  = { client_id: clientId, ...data };
    // strip system fields
    ['id','gs_project_id','gs_table_name','created_at','updated_at'].forEach(k => delete payload[k]);
    try {
      if (existing) {
        const r = await fetch(`tables/mc_configs/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const saved = await r.json();
        this._cfgCache[clientId] = saved;
        return saved;
      } else {
        const r = await fetch('tables/mc_configs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const saved = await r.json();
        this._cfgCache[clientId] = saved;
        return saved;
      }
    } catch (e) { console.error('[MC saveConfig]', e); return null; }
  },

  /* ---- State ---- */
  client:        null,
  bchs_raw:      null,
  cfg:           null,
  result:        null,
  activeHorizon: '3m',
  configOpen:    false,
  fanChart:      null,

  /* ---- Entry point called from DetailPage tab click ---- */
  async mount(client, bchs_raw) {
    this.client   = client;
    this.bchs_raw = bchs_raw;
    this.result   = null;
    this.activeHorizon = '3m';
    this.configOpen    = false;

    const container = document.getElementById('mc-tab-content');
    if (!container) return;

    // Load stored config
    const stored = await this.getConfig(client.id);
    this.cfg = Object.assign({}, MCEngine.DEFAULTS, stored || {});

    this._renderShell(container);
    await this._runAndRender();
  },

  /* ---- Render shell (header + placeholders) ---- */
  _renderShell(container) {
    container.innerHTML = `
      <!-- Header -->
      <div class="mc-header">
        <div>
          <div class="mc-title">🎲 Monte Carlo Прогноз</div>
          <div class="mc-subtitle">5 000 сценариев · Каскад 3М → 6М → 12М</div>
        </div>
        <div class="mc-header-actions">
          <button class="btn btn-primary btn-sm" id="mc-run">↻ Пересчитать</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-toggle">⚙ Параметры</button>
        </div>
      </div>

      <!-- Baseline row -->
      <div class="mc-baseline" id="mc-baseline">
        <span>📊 Текущий bCHS: <strong id="mc-bl-bchs">—</strong></span>
        <span>💰 Базовый MR: <strong id="mc-bl-mr">—</strong></span>
        <span class="text-muted" style="font-size:11px">Шкала bCHS приведена к 0–100</span>
      </div>

      <!-- Config panel (collapsible) -->
      <div id="mc-config-panel" class="mc-config-panel hidden">
        ${this._configPanelHTML()}
      </div>

      <!-- Main results area -->
      <div id="mc-results">
        <div class="mc-loading hidden" id="mc-loading">
          <div class="mc-spinner"></div>
          <div class="mc-loading-text">Запускаем 5 000 сценариев...</div>
        </div>
        <div id="mc-output" class="hidden"></div>
        <div id="mc-nodata" class="mc-nodata hidden">
          <div style="font-size:32px">🎲</div>
          <div class="mc-nodata-title">Прогноз ещё не запущен</div>
          <button class="btn btn-primary" id="mc-first-run">▶ Запустить прогноз</button>
        </div>
      </div>
    `;

    // Bind
    document.getElementById('mc-run').addEventListener('click', () => this._runAndRender());
    document.getElementById('mc-cfg-toggle').addEventListener('click', () => this._toggleConfig());
    const firstRun = document.getElementById('mc-first-run');
    if (firstRun) firstRun.addEventListener('click', () => this._runAndRender());

    // Update baseline display
    const scaled = this.bchs_raw !== null && this.bchs_raw !== undefined
      ? Math.round((this.bchs_raw + 81) / 162 * 100 * 10) / 10
      : 50;
    const blBchs = document.getElementById('mc-bl-bchs');
    const blMr   = document.getElementById('mc-bl-mr');
    if (blBchs) blBchs.textContent = `${scaled}`;
    if (blMr)   blMr.textContent   = this._fmtMR(this.cfg.monthly_revenue || MCEngine.DEFAULTS.monthly_revenue);
  },

  /* ---- Config panel HTML ---- */
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
        <div class="mc-config-title">⚙ Параметры симуляции</div>
        <div class="mc-config-grid">
          <div class="mc-config-col">
            <div class="mc-config-group-title">📈 Динамика bCHS</div>
            ${f('drift',           'Дрейф (ежемес.)',        '0.1', '-10', '10')}
            ${f('volatility',      'Волатильность (σ)',       '0.1', '0',   '20')}
            ${f('mean_reversion',  'Сила возврата к норме',   '0.01','0',   '1')}
            ${f('equilibrium',     'Норма равновесия (0–100)','1',   '0',   '100')}
            ${f('monthly_revenue', 'Базовый MR (₽/мес)',      '100', '0',   '9999999')}
          </div>
          <div class="mc-config-col">
            <div class="mc-config-group-title">🎲 Вероятности событий</div>
            ${f('p_strategic_meeting',      'P(стратег. встреча)',     '0.01','0','1')}
            ${f('impact_strategic_meeting', 'Эффект стратег. встречи', '0.5', '-20','20')}
            ${f('p_fast_response',          'P(быстрый ответ)',        '0.01','0','1')}
            ${f('impact_fast_response',     'Эффект быстрого ответа',  '0.5', '-10','10')}
            ${f('p_upsell',                 'P(апселл)',               '0.01','0','1')}
            ${f('impact_upsell_mr',         'Эффект апселла (MR)',     '100', '-9999','9999')}
            ${f('p_escalation',             'P(эскалация)',            '0.01','0','1')}
            ${f('impact_escalation',        'Эффект эскалации',        '0.5', '-30','0')}
            ${f('p_complaint',              'P(жалоба)',               '0.01','0','1')}
            ${f('impact_complaint',         'Эффект жалобы',           '0.5', '-20','0')}
            ${f('p_mr_downgrade',           'P(снижение MR)',          '0.01','0','1')}
            ${f('impact_mr_downgrade',      'Эффект снижения MR',     '100', '-9999','0')}
            ${f('p_churn',                  'P(отток / мес)',          '0.005','0','0.5')}
          </div>
        </div>
        <div class="mc-config-actions">
          <button class="btn btn-primary btn-sm" id="mc-cfg-save">💾 Сохранить и пересчитать</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-reset">↺ Сброс к умолчаниям</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-close">✕ Закрыть</button>
        </div>
      </div>
    `;
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
        saveBtn.disabled = true;
        await this.saveConfig(this.client.id, this.cfg);
        saveBtn.textContent = '💾 Сохранить и пересчитать';
        saveBtn.disabled = false;
        // Update baseline MR display
        const blMr = document.getElementById('mc-bl-mr');
        if (blMr) blMr.textContent = this._fmtMR(this.cfg.monthly_revenue);
        App.toast('✅ Параметры сохранены', 'success');
        await this._runAndRender();
      });
    }

    if (resetBtn && !resetBtn._bound) {
      resetBtn._bound = true;
      resetBtn.addEventListener('click', () => {
        this.cfg = Object.assign({}, MCEngine.DEFAULTS);
        const panel = document.getElementById('mc-config-panel');
        if (panel) panel.innerHTML = this._configPanelHTML();
        this._bindConfigEvents();
        App.toast('Параметры сброшены к умолчаниям', '');
      });
    }

    if (closeBtn && !closeBtn._bound) {
      closeBtn._bound = true;
      closeBtn.addEventListener('click', () => {
        this.configOpen = false;
        const panel = document.getElementById('mc-config-panel');
        if (panel) panel.classList.add('hidden');
      });
    }
  },

  _readConfigFromForm() {
    const keys = Object.keys(MCEngine.DEFAULTS);
    for (const k of keys) {
      const el = document.getElementById(`mcc-${k}`);
      if (el) this.cfg[k] = parseFloat(el.value) || MCEngine.DEFAULTS[k];
    }
  },

  /* ---- Run simulation + render results ---- */
  async _runAndRender() {
    const loading = document.getElementById('mc-loading');
    const output  = document.getElementById('mc-output');
    const nodata  = document.getElementById('mc-nodata');

    if (loading) loading.classList.remove('hidden');
    if (output)  output.classList.add('hidden');
    if (nodata)  nodata.classList.add('hidden');

    // Yield to browser to show spinner
    await new Promise(r => setTimeout(r, 30));

    try {
      this.result = MCEngine.run(this.bchs_raw, this.cfg);
      if (loading) loading.classList.add('hidden');
      if (output)  { output.classList.remove('hidden'); this._renderOutput(output); }
    } catch (e) {
      console.error('[MC run]', e);
      if (loading) loading.classList.add('hidden');
      if (output) { output.classList.remove('hidden'); output.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Ошибка симуляции</div><div class="empty-state-text">${e.message}</div></div>`; }
    }
  },

  /* ---- Render full output ---- */
  _renderOutput(container) {
    const res = this.result;
    container.innerHTML = `
      <!-- Horizon selector cards -->
      <div class="mc-horizons" id="mc-horizons">
        ${this._horizonCard('3m',  res.horizons['3m'])}
        ${this._horizonCard('6m',  res.horizons['6m'])}
        ${this._horizonCard('12m', res.horizons['12m'])}
      </div>

      <!-- Fan chart -->
      <div class="mc-chart-container">
        <div class="mc-chart-title">📉 Веер прогнозов bCHS (P10 · Медиана · P90)</div>
        <div style="height:240px;position:relative">
          <canvas id="mc-fan-chart"></canvas>
        </div>
        <div class="mc-chart-legend">
          <span class="mc-legend-item"><span class="mc-legend-dot" style="background:rgba(59,130,246,0.3)"></span>P10–P90</span>
          <span class="mc-legend-item"><span class="mc-legend-dot" style="background:rgba(59,130,246,0.15)"></span>P25–P75</span>
          <span class="mc-legend-item"><span class="mc-legend-dot" style="background:#3b82f6"></span>Медиана</span>
        </div>
      </div>

      <!-- Stats + categories for active horizon -->
      <div id="mc-horizon-detail"></div>
    `;

    this._bindHorizonCards();
    this._drawFanChart();
    this._renderHorizonDetail();
  },

  _horizonCard(key, stats) {
    const labels = { '3m':'3 Месяца', '6m':'6 Месяцев', '12m':'12 Месяцев' };
    const active = key === this.activeHorizon;
    const cr     = stats.churn_rate;
    const crCls  = cr < 7 ? 'mc-churn-green' : cr < 15 ? 'mc-churn-yellow' : 'mc-churn-red';
    return `
      <div class="mc-horizon-card${active?' mc-horizon-active':''}" data-horizon="${key}">
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
          c.classList.toggle('mc-horizon-active', c.dataset.horizon === this.activeHorizon));
        this._renderHorizonDetail();
      });
    });
  },

  /* ---- Fan chart ---- */
  _drawFanChart() {
    const ctx = document.getElementById('mc-fan-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    if (this.fanChart) { this.fanChart.destroy(); this.fanChart = null; }

    const fan    = this.result.fan_chart;
    // Show labels at 0, 3, 6, 12
    const keyPts = fan.filter(p => [0,3,6,12].includes(p.month));
    const labels = keyPts.map(p => p.month === 0 ? 'Старт' : `${p.month}М`);

    const mkData = (key) => keyPts.map(p => p[key]);

    this.fanChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          // P90 top boundary
          {
            label: 'P90',
            data: mkData('p90'),
            borderColor: 'rgba(59,130,246,0.4)',
            borderWidth: 1,
            borderDash: [3,3],
            pointRadius: 0,
            fill: '+1',   // fill down to p75
            backgroundColor: 'rgba(59,130,246,0.06)',
            tension: 0.4,
          },
          // P75
          {
            label: 'P75',
            data: mkData('p75'),
            borderColor: 'rgba(59,130,246,0.3)',
            borderWidth: 0,
            pointRadius: 0,
            fill: '+1',
            backgroundColor: 'rgba(59,130,246,0.10)',
            tension: 0.4,
          },
          // Median
          {
            label: 'Медиана',
            data: mkData('median'),
            borderColor: '#3b82f6',
            borderWidth: 2.5,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 5,
            fill: '+1',
            backgroundColor: 'rgba(59,130,246,0.10)',
            tension: 0.4,
          },
          // P25
          {
            label: 'P25',
            data: mkData('p25'),
            borderColor: 'rgba(59,130,246,0.3)',
            borderWidth: 0,
            pointRadius: 0,
            fill: '+1',
            backgroundColor: 'rgba(59,130,246,0.06)',
            tension: 0.4,
          },
          // P10 bottom boundary
          {
            label: 'P10',
            data: mkData('p10'),
            borderColor: 'rgba(59,130,246,0.4)',
            borderWidth: 1,
            borderDash: [3,3],
            pointRadius: 0,
            fill: false,
            tension: 0.4,
          },
          // Start baseline dot
          {
            label: 'Текущий bCHS',
            data: [this.result.current_bchs_scaled, null, null, null],
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            pointRadius: [7,0,0,0],
            pointStyle: 'star',
            borderWidth: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                if (ctx.dataset.label === 'Текущий bCHS' && ctx.dataIndex > 0) return null;
                const v = ctx.parsed.y;
                if (v === null) return null;
                return ` ${ctx.dataset.label}: ${v.toFixed(1)}`;
              },
            },
          },
        },
        scales: {
          y: {
            min: 0, max: 100,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { family: 'Inter', size: 10 }, callback: v => v },
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 11 } },
          },
        },
      },
    });
  },

  /* ---- Horizon detail: stats + categories + recommendation ---- */
  _renderHorizonDetail() {
    const container = document.getElementById('mc-horizon-detail');
    if (!container) return;
    const stats = this.result.horizons[this.activeHorizon];
    const hLabels = { '3m':'3 месяца', '6m':'6 месяцев', '12m':'12 месяцев' };

    container.innerHTML = `
      <!-- Stats grid: 3 cards -->
      <div class="mc-stats-grid">
        ${this._bchsStatsCard(stats)}
        ${this._mrStatsCard(stats)}
        ${this._churnGaugeCard(stats)}
      </div>

      <!-- Category distribution -->
      <div class="mc-section">
        <div class="mc-section-title">
          Распределение сценариев · ${hLabels[this.activeHorizon]}
          <span class="text-muted" style="font-weight:400;font-size:11px">из ${stats.n.toLocaleString('ru-RU')} симуляций</span>
        </div>
        <div class="mc-categories">
          ${this._categoryBars(stats)}
        </div>
      </div>

      <!-- Recommendation -->
      ${this._recommendation(stats)}
    `;
  },

  _bchsStatsCard(stats) {
    const b = stats.bchs;
    return `<div class="mc-stats-card">
      <div class="mc-stats-card-title">📊 Прогноз bCHS (0–100)</div>
      <table class="mc-pct-table">
        <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${b.p10.toFixed(1)}</td></tr>
        <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${b.p25.toFixed(1)}</td></tr>
        <tr class="mc-pct-highlight"><td class="mc-pct-label">Медиана</td><td class="mc-pct-val"><strong>${b.median.toFixed(1)}</strong></td></tr>
        <tr><td class="mc-pct-label">Среднее</td><td class="mc-pct-val">${b.mean.toFixed(1)}</td></tr>
        <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${b.p75.toFixed(1)}</td></tr>
        <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${b.p90.toFixed(1)}</td></tr>
      </table>
    </div>`;
  },

  _mrStatsCard(stats) {
    const m = stats.mr;
    return `<div class="mc-stats-card">
      <div class="mc-stats-card-title">💰 Прогноз MR</div>
      <table class="mc-pct-table">
        <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${this._fmtMR(m.p10)}</td></tr>
        <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${this._fmtMR(m.p25)}</td></tr>
        <tr class="mc-pct-highlight"><td class="mc-pct-label">Медиана</td><td class="mc-pct-val"><strong>${this._fmtMR(m.median)}</strong></td></tr>
        <tr><td class="mc-pct-label">Среднее</td><td class="mc-pct-val">${this._fmtMR(m.mean)}</td></tr>
        <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${this._fmtMR(m.p75)}</td></tr>
        <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${this._fmtMR(m.p90)}</td></tr>
      </table>
    </div>`;
  },

  _churnGaugeCard(stats) {
    const cr  = stats.churn_rate;
    const cls = cr < 7 ? '#10b981' : cr < 15 ? '#f59e0b' : '#ef4444';
    const desc = cr < 7
      ? 'Риск оттока низкий — сценарий устойчив'
      : cr < 15
      ? 'Умеренный риск — держать под контролем'
      : 'Высокий риск оттока — требует вмешательства';

    const pct = Math.min(cr / 50 * 100, 100);
    const r = 38, cx = 50, cy = 50;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - pct / 100);

    return `<div class="mc-stats-card">
      <div class="mc-stats-card-title">⚡ Риск оттока</div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px 0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="8"/>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cls}" stroke-width="8"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
            stroke-linecap="round"
            transform="rotate(-90 ${cx} ${cy})" />
          <text x="${cx}" y="${cy+2}" text-anchor="middle" dominant-baseline="middle"
            font-size="16" font-weight="700" fill="${cls}" font-family="Inter">${cr.toFixed(1)}%</text>
        </svg>
        <div style="text-align:center;font-size:11.5px;color:var(--text-secondary);line-height:1.4">${desc}</div>
        <div style="font-size:11px;color:var(--text-muted)">${stats.churn_count.toLocaleString('ru-RU')} из ${stats.n.toLocaleString('ru-RU')} сценариев</div>
      </div>
    </div>`;
  },

  _categoryBars(stats) {
    const cats = MCEngine.CATEGORIES;
    const total = stats.n;
    return cats.map(cat => {
      const pct   = stats.categories[cat.key] || 0;
      const count = Math.round(pct / 100 * total);
      const w     = Math.max(pct, 0.3);
      return `
        <div class="mc-cat-row">
          <div class="mc-cat-name">${cat.label}</div>
          <div class="mc-cat-bar-wrap">
            <div class="mc-cat-bar" style="width:${w}%;background:${cat.color}"></div>
          </div>
          <div class="mc-cat-pct">${pct.toFixed(1)}%</div>
          <div class="mc-cat-count">${count.toLocaleString('ru-RU')}</div>
        </div>`;
    }).join('');
  },

  /* ---- Recommendation ---- */
  _recommendation(stats) {
    const cr   = stats.churn_rate;
    const cats = stats.categories;
    const positivePct = (cats.champion || 0) + (cats.promoter || 0);
    const negativePct = (cats.at_risk  || 0) + (cats.detractor || 0) + (cats.churned || 0);

    let cls, icon, title, text;

    if (cr > 20) {
      cls   = 'mc-rec-red';
      icon  = '🔴';
      title = 'Критический риск оттока';
      text  = `${cr.toFixed(1)}% симуляций заканчиваются оттоком. Немедленное вмешательство: `
            + `антикризисная встреча, пересмотр условий, эскалация до топ-менеджмента. `
            + `Каждый месяц промедления увеличивает вероятность потери клиента.`;
    } else if (cr > 10) {
      cls   = 'mc-rec-yellow';
      icon  = '⚠️';
      title = 'Повышенный риск — требует мониторинга';
      text  = `${cr.toFixed(1)}% сценариев предполагают отток. `
            + `Усилить ритм касаний, провести QBR в ближайшие 4 недели. `
            + `Зафиксировать метрики-триггеры для быстрого реагирования.`;
    } else if (positivePct > 50) {
      cls   = 'mc-rec-green';
      icon  = '🚀';
      title = 'Потенциал роста подтверждён';
      text  = `${positivePct.toFixed(1)}% сценариев — Champion или Promoter. `
            + `Момент для инвестиции в расширение: стратегические сессии, `
            + `апселл-предложение, углубление партнёрства.`;
    } else if (negativePct > 40) {
      cls   = 'mc-rec-yellow';
      icon  = '📋';
      title = 'Нестабильная зона — нужен план';
      text  = `${negativePct.toFixed(1)}% сценариев в зоне At Risk / Detractor. `
            + `Разработать конкретный план восстановления лояльности. `
            + `Определить 2–3 ключевых действия на ближайший месяц.`;
    } else {
      cls   = 'mc-rec-gray';
      icon  = '😐';
      title = 'Нейтральный прогноз';
      text  = `Сценарии распределены без явного перевеса. `
            + `Держать текущий ритм работы, отслеживать bCHS ежемесячно. `
            + `При появлении негативных сигналов — немедленно пересчитать прогноз.`;
    }

    return `
      <div class="mc-recommendation ${cls}">
        <div class="mc-rec-icon">${icon}</div>
        <div class="mc-rec-body">
          <div class="mc-rec-title">${title}</div>
          <div class="mc-rec-text">${text}</div>
        </div>
      </div>`;
  },

  /* ---- Helpers ---- */
  _fmtMR(v) {
    if (v === null || v === undefined) return '—';
    if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + ' М';
    if (Math.abs(v) >= 1_000)     return (v / 1_000).toFixed(1) + ' К';
    return Math.round(v).toLocaleString('ru-RU');
  },
};
