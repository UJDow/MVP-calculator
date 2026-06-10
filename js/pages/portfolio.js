/* ============================================
   js/pages/portfolio.js — Portfolio Page (ES Module)
   Portfolio BCHS v7.0
   ============================================ */

import { API }  from '../api.js';
import { Calc } from '../calc.js';
import { BCG_CATEGORIES } from '../constants.js';

/* ── SVG иконки ── */
const ic = {
  save:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  ai:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/><path d="M12 8v4l3 3"/></svg>`,
  edit:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  export:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  close:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  reset:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>`,
  chevron: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  trend:   `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  risk:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  users:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  chart:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  map:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
};

/* ── BCG конфиг без эмодзи ── */
const BCG_CFG = {
  KEY:          { label: 'KEY',          color: '#f59e0b', bg: '#fffbeb' },
  STABLE:       { label: 'STABLE',       color: '#6b7280', bg: '#f9fafb' },
  GROWTH:       { label: 'GROWTH',       color: '#6366f1', bg: '#eef2ff' },
  GROWTH_EARLY: { label: 'GROWTH Early', color: '#8b5cf6', bg: '#f5f3ff' },
  TAIL:         { label: 'TAIL',         color: '#9ca3af', bg: '#f3f4f6' },
};

const bcgTag = key => {
  const c = BCG_CFG[key] ?? { label: key, color: '#9ca3af', bg: '#f3f4f6' };
  return `<span style="font-size:10px;font-weight:600;color:${c.color};
    background:${c.bg};border-radius:5px;padding:2px 7px;
    white-space:nowrap;letter-spacing:.02em">${c.label}</span>`;
};

/* ── Inline стили один раз ── */
const PF_STYLES = `
  .pf-tabs { display:flex; gap:2px; border-bottom:1px solid var(--border);
    margin-bottom:0; padding:0 0 0; }
  .pf-tab {
    padding:10px 18px; font-size:13px; font-weight:500;
    color:var(--text-muted); background:none; border:none;
    border-bottom:2px solid transparent; cursor:pointer;
    display:flex; align-items:center; gap:7px;
    transition:color .15s, border-color .15s; margin-bottom:-1px;
  }
  .pf-tab:hover { color:var(--text-primary); }
  .pf-tab.active { color:#6366f1; border-bottom-color:#6366f1; font-weight:600; }
  .pf-tab svg { opacity:.7; }
  .pf-tab.active svg { opacity:1; }

  .pf-kpi-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
    gap:1px; background:var(--border); border-radius:12px; overflow:hidden;
    margin-bottom:24px; border:1px solid var(--border);
  }
  .pf-kpi-cell {
    background:var(--surface); padding:16px 18px;
  }
  .pf-kpi-label {
    font-size:10px; font-weight:700; text-transform:uppercase;
    letter-spacing:.06em; color:var(--text-muted); margin-bottom:6px;
  }
  .pf-kpi-val {
    font-size:22px; font-weight:700; color:var(--text-primary);
    letter-spacing:-.02em; line-height:1;
  }
  .pf-kpi-sub {
    font-size:11px; color:var(--text-muted); margin-top:4px;
  }

  .pf-horizon {
    border:1px solid var(--border); border-radius:12px;
    overflow:hidden; margin-bottom:12px;
  }
  .pf-horizon-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 18px; background:var(--surface);
    border-bottom:1px solid var(--border);
  }
  .pf-horizon-dot {
    width:8px; height:8px; border-radius:50%; flex-shrink:0;
  }
  .pf-horizon-title {
    font-size:13px; font-weight:700; color:var(--text-primary);
    display:flex; align-items:center; gap:8px;
  }
  .pf-horizon-period {
    font-size:11px; color:var(--text-muted); font-weight:400;
  }
  .pf-horizon-body {
    padding:18px; display:grid;
    grid-template-columns:1fr 1fr; gap:14px; background:#fff;
  }
  .pf-horizon-body .pf-full { grid-column:1/-1; }
  .pf-field label {
    display:block; font-size:10px; font-weight:700; text-transform:uppercase;
    letter-spacing:.06em; color:var(--text-muted); margin-bottom:6px;
  }
  .pf-field input, .pf-field textarea {
    width:100%; box-sizing:border-box;
    border:1.5px solid var(--border); border-radius:8px;
    padding:9px 12px; font-size:13px; font-family:inherit;
    background:#fafafa; color:var(--text-primary);
    transition:border-color .15s, background .15s;
    resize:vertical;
  }
  .pf-field input:focus, .pf-field textarea:focus {
    border-color:#6366f1; outline:none; background:#fff;
    box-shadow:0 0 0 3px #e0e7ff;
  }
  .pf-field textarea { min-height:72px; }

  .pf-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 14px; border-radius:8px; font-size:12px;
    font-weight:600; cursor:pointer; border:1px solid transparent;
    transition:all .15s; white-space:nowrap;
  }
  .pf-btn-primary {
    background:#6366f1; color:#fff; border-color:#6366f1;
  }
  .pf-btn-primary:hover { background:#4f46e5; border-color:#4f46e5; }
  .pf-btn-secondary {
    background:var(--surface); color:var(--text-secondary);
    border-color:var(--border);
  }
  .pf-btn-secondary:hover {
    background:var(--surface-hover); color:var(--text-primary);
  }
  .pf-btn-ghost {
    background:none; color:var(--text-muted); border-color:transparent;
    padding:6px 10px;
  }
  .pf-btn-ghost:hover { background:var(--surface); color:var(--text-primary); }
  .pf-btn:disabled { opacity:.5; cursor:not-allowed; }

  .pf-section-head {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:16px;
  }
  .pf-section-title {
    font-size:14px; font-weight:700; color:var(--text-primary);
    letter-spacing:-.01em;
  }

  /* Таблица */
  .pf-table { width:100%; border-collapse:collapse; font-size:13px; }
  .pf-table th {
    text-align:left; font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:.06em;
    color:var(--text-muted); padding:8px 12px;
    border-bottom:1px solid var(--border);
    white-space:nowrap;
  }
  .pf-table td {
    padding:10px 12px; border-bottom:1px solid var(--border);
    color:var(--text-primary); vertical-align:middle;
  }
  .pf-table tr:last-child td { border-bottom:none; }
  .pf-table tr:hover td { background:#fafafa; }
  .pf-table-wrap {
    border:1px solid var(--border); border-radius:12px; overflow:hidden;
  }

  /* Coverage */
  .pf-cov-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:1px; background:var(--border);
    border:1px solid var(--border); border-radius:12px;
    overflow:hidden; margin-bottom:20px;
  }
  .pf-cov-stat {
    background:var(--surface); padding:14px 16px;
  }
  .pf-cov-stat-val {
    font-size:24px; font-weight:700; letter-spacing:-.02em;
    color:var(--text-primary);
  }
  .pf-cov-stat-lbl {
    font-size:11px; color:var(--text-muted); margin-top:3px;
  }

  .pf-status-dot {
    display:inline-flex; align-items:center; gap:5px;
    font-size:11px; font-weight:600;
  }
  .pf-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }

  .pf-filters {
    display:flex; gap:8px; flex-wrap:wrap;
    align-items:center; margin-bottom:16px;
  }
  .pf-filter-select, .pf-filter-input {
    height:32px; padding:0 10px; border:1px solid var(--border);
    border-radius:8px; font-size:12px; font-family:inherit;
    background:var(--surface); color:var(--text-primary);
    transition:border-color .15s;
  }
  .pf-filter-select:focus, .pf-filter-input:focus {
    outline:none; border-color:#6366f1;
  }

  .pf-variant-card {
    padding:14px 16px; border:1.5px solid var(--border);
    border-radius:10px; cursor:pointer; margin-bottom:8px;
    transition:all .15s;
  }
  .pf-variant-card:hover {
    border-color:#6366f1; background:#f8f7ff;
  }
  .pf-variant-label {
    font-size:12px; font-weight:700; color:#6366f1; margin-bottom:5px;
  }
  .pf-variant-goal {
    font-size:12px; color:var(--text-secondary); margin-bottom:3px;
  }
  .pf-variant-meta {
    font-size:11px; color:var(--text-muted);
    display:flex; gap:12px;
  }

  .pf-dir-card {
    border:1.5px solid var(--border); border-radius:12px;
    padding:16px; cursor:pointer; transition:all .18s;
  }
  .pf-dir-card:hover { border-color:#6366f1; background:#f8f7ff; }
  .pf-dir-card.selected { border-color:#6366f1; background:#f8f7ff; }
  .pf-dir-icon { font-size:20px; margin-bottom:8px; }
  .pf-dir-label { font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:3px; }
  .pf-dir-hint { font-size:12px; color:var(--text-muted); line-height:1.4; }

  .pf-modal-head {
    font-size:16px; font-weight:700; color:var(--text-primary);
    margin-bottom:4px;
  }
  .pf-modal-sub {
    font-size:12px; color:var(--text-muted); margin-bottom:20px;
  }
`;

export const PortfolioPage = {
  _activeTab:             'portfolio',
  _portfolioData:         { short: null, mid: null, long: null },
  _accountStrategies:     [],
  _mcCache:               {},
  _coverageFilters:       { region: '', am: '', status: '', search: '' },
  _allClientsForCoverage: [],
  _allPCForCoverage:      [],

  _injectStyles() {
    if (document.getElementById('pf-styles')) return;
    const s = document.createElement('style');
    s.id = 'pf-styles';
    s.textContent = PF_STYLES;
    document.head.appendChild(s);
  },

  /* ══════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════ */
  async render() {
    this._injectStyles();

    document.getElementById('main-content').innerHTML = `
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:8px;background:#eef2ff;
                      display:flex;align-items:center;justify-content:center;color:#6366f1">
            ${ic.map}
          </div>
          <div>
            <div class="page-title" style="font-size:18px;font-weight:700;
                                           letter-spacing:-.02em">
              Управление портфелем
            </div>
            <div class="page-subtitle">
          
            </div>
          </div>
        </div>
      </div>

      <div class="pf-tabs" id="pf-tabs">
        <button class="pf-tab active" data-pftab="portfolio">
          Стратегия портфеля
        </button>
        <button class="pf-tab" data-pftab="accounts">
          Стратегия по аккаунтам
        </button>
        <button class="pf-tab" data-pftab="coverage">
          Покрытие
        </button>
      </div>

      <div style="padding-top:24px">
        <div id="pf-tab-portfolio"></div>
        <div id="pf-tab-accounts"  class="hidden"></div>
        <div id="pf-tab-coverage"  class="hidden"></div>
      </div>
    `;

    document.querySelectorAll('[data-pftab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.pftab;
        this._activeTab = tab;
        document.querySelectorAll('[data-pftab]').forEach(b =>
          b.classList.toggle('active', b.dataset.pftab === tab)
        );
        ['portfolio', 'accounts', 'coverage'].forEach(t =>
          document.getElementById(`pf-tab-${t}`)?.classList.toggle('hidden', t !== tab)
        );
        if (tab === 'accounts') this._renderAccountsTab();
        if (tab === 'coverage') this._renderCoverageTab();
      });
    });

    await this._renderPortfolioTab();
  },

  /* ══════════════════════════════════════════
     ТАБ 1 — СТРАТЕГИЯ ПОРТФЕЛЯ
  ══════════════════════════════════════════ */
  async _renderPortfolioTab() {
    const el = document.getElementById('pf-tab-portfolio');
    el.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);
                                font-size:13px">Загрузка...</div>`;
    try {
      const [clients, allBCHS, allPC, savedStrats] = await Promise.all([
        API.getClients(),
        API.getAllBCHS(),
        API.getAllPC(),
        API.getPortfolioStrategies(),
      ]);

      const computed = clients.map(c => ({
        client: c,
        ...Calc.computeClient(c, allBCHS, allPC),
      }));
      const summary = this._buildSummary(computed);

      this._portfolioData = { short: null, mid: null, long: null };
      savedStrats.forEach(s => {
        if (s.horizon === 'short') this._portfolioData.short = s;
        if (s.horizon === 'mid')   this._portfolioData.mid   = s;
        if (s.horizon === 'long')  this._portfolioData.long  = s;
      });

      el.innerHTML = `
  ${this._summaryHTML(summary, computed)}

  <div class="pf-section-head" style="margin-top:28px">
    <div class="pf-section-title">Стратегические горизонты</div>
    <label class="pf-ai-mode-toggle">
      <input type="checkbox" id="pf-ai-mode-sw">
      <span class="pf-ai-mode-track">
        <span class="pf-ai-mode-thumb"></span>
      </span>
      <span class="pf-ai-mode-label">AI режим</span>
    </label>
  </div>

  ${this._horizonFormHTML('short', 'Краткосрочная', '1 месяц',      '#ef4444', this._portfolioData.short)}
  ${this._horizonFormHTML('mid',   'Среднесрочная', '1–2 квартала', '#f59e0b', this._portfolioData.mid)}
  ${this._horizonFormHTML('long',  'Долгосрочная',  '4 квартала',   '#10b981', this._portfolioData.long)}

  <div id="pf-manual-save-bar" class="pf-manual-save-bar" style="display:none">
    <span class="pf-save-hint">Есть несохранённые изменения</span>
    <button class="pf-btn pf-btn-primary" id="pf-save-btn">
      ${ic.save} Сохранить
    </button>
  </div>

  <!-- Аналитика портфеля -->
  <div style="margin-top:32px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:15px;font-weight:700;color:var(--text-primary)">Аналитика портфеля</div>
      <button id="pf-ai-analyze-btn"
              style="display:flex;align-items:center;gap:6px;padding:7px 14px;
                     border:1px solid #6366f1;border-radius:8px;background:#fff;
                     color:#6366f1;font-size:12px;font-weight:600;cursor:pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        AI-анализ портфеля
      </button>
    </div>

    <!-- AI инсайт панель -->
    <div id="pf-ai-insight-panel" style="display:none;background:#f8f7ff;border:1px solid #e0e7ff;
         border-radius:12px;padding:16px;margin-bottom:20px;position:relative">
      <div style="font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;
                  letter-spacing:.06em;margin-bottom:8px">AI · Анализ портфеля</div>
      <div id="pf-ai-insight-text" style="font-size:13px;color:var(--text-primary);
           line-height:1.6;white-space:pre-wrap"></div>
    </div>

    <!-- Графики: 2 колонки -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

      <!-- Клиенты по BCG -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Распределение по BCG
        </div>
        <div id="pf-chart-bcg" style="display:flex;align-items:center;gap:20px"></div>
      </div>

      <!-- Лояльность -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Лояльность клиентов
        </div>
        <div id="pf-chart-loyalty" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>

      <!-- Revenue at Risk -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Revenue at Risk (топ клиенты)
        </div>
        <div id="pf-chart-risk" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>

      <!-- Реализация потенциала -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Реализация потенциала
        </div>
        <div id="pf-chart-potential" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>

    </div>
  </div>
`;


      document.getElementById('pf-save-btn')
        ?.addEventListener('click', () => this._savePortfolioStrats());

      // Рендерим графики
      this._renderPortfolioCharts(computed);

      // AI анализ портфеля
      document.getElementById('pf-ai-analyze-btn')?.addEventListener('click', async () => {
        const btn = document.getElementById('pf-ai-analyze-btn');
        const panel = document.getElementById('pf-ai-insight-panel');
        const text  = document.getElementById('pf-ai-insight-text');
        btn.disabled = true;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> Анализирую...';
        panel.style.display = 'block';
        text.textContent = 'Запрашиваю данные Monte Carlo и анализирую портфель...';
        try {
          const snap = computed.slice(0, 15).map(r => ({
            name:  r.client.name,
            bcg:   r.client.bcg_category,
            bchs:  r.bchs ?? null,
            mr:    r.client.monthly_revenue ?? 0,
            trend: r.trend?.direction ?? '—',
            risk:  r.riskAmt ?? 0,
            churn: null,
          }));
          const result = await API.callAI({
            type: 'horizon',
            horizon: 'short',
            summary,
            clients_snapshot: snap,
            direction: 'Дай общий анализ состояния портфеля: риски, сильные стороны, приоритеты на ближайший месяц',
          });
          const content = result?.choices?.[0]?.message?.content ?? result?.content ?? '';
          // Парсим JSON или показываем текст
          let display = content;
          try {
            const parsed = JSON.parse(content);
            // Если вернулся JSON со стратегиями — форматируем
            if (parsed.short || parsed.outcome || parsed.strategies) {
              const parts = [];
              if (parsed.outcome)     parts.push('Итог: ' + parsed.outcome);
              if (parsed.actions)     parts.push('Действия:\n' + (Array.isArray(parsed.actions) ? parsed.actions.map(a => '  - ' + a).join('\n') : parsed.actions));
              if (parsed.risks)       parts.push('Риски:\n' + (Array.isArray(parsed.risks) ? parsed.risks.map(r => '  - ' + r).join('\n') : parsed.risks));
              if (parsed.priorities)  parts.push('Приоритеты:\n' + (Array.isArray(parsed.priorities) ? parsed.priorities.map(p => '  - ' + p).join('\n') : parsed.priorities));
              display = parts.join('\n\n') || JSON.stringify(parsed, null, 2);
            }
          } catch (_) { /* не JSON — показываем как текст */ }
          text.textContent = display || 'Анализ завершён, но ответ пуст.';
        } catch (e) {
          text.textContent = 'Ошибка: ' + e.message;
        } finally {
          btn.disabled = false;
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> AI-анализ портфеля';
        }
      });

      // KPI expandable cards — clean expand panel
      {
        const kpiGrid = document.querySelector('.pf-kpi-grid-new');
        if (kpiGrid) {
          // Запоминаем оригинальный порядок карточек один раз
          const originalOrder = [...kpiGrid.querySelectorAll('.pf-kpi-card')].map(c => c.dataset.card);
          const collapse = () => {
            kpiGrid.classList.remove('has-active');
            kpiGrid.querySelectorAll('.pf-kpi-card').forEach(c => {
              c.classList.remove('pf-kpi-active', 'pf-kpi-dimmed');
            });
            // Возвращаем карточки из сайдбара в оригинальном порядке
            const sidebar = kpiGrid.querySelector('.pf-kpi-sidebar');
            if (sidebar) {
              [...sidebar.querySelectorAll('.pf-kpi-card')].forEach(c => kpiGrid.appendChild(c));
              sidebar.remove();
            }
            // Восстанавливаем оригинальный порядок
            originalOrder.forEach(id => {
              const c = kpiGrid.querySelector('.pf-kpi-card[data-card="' + id + '"]');
              if (c) kpiGrid.appendChild(c);
            });
          };

          // Закрытие по клику вне грида
          document.addEventListener('click', e => {
            if (!kpiGrid.contains(e.target)) collapse();
          });

          // Один обработчик на весь грид — ловим любую карточку
          kpiGrid.addEventListener('click', async e => {
            e.stopPropagation();
            // go-detail — переход на клиента, не закрываем карточку
            const goBtn = e.target.closest('[data-action="go-detail"]');
            if (goBtn) {
              window.App.navigate('detail', goBtn.dataset.id);
              return;
            }
            const card = e.target.closest('.pf-kpi-card');
            if (!card) return;
            if (e.target.closest('.pf-kpi-card-close')) { collapse(); return; }
            // Клик внутри активной карточки по интерактивным элементам — не сворачиваем
            if (card.classList.contains('pf-kpi-active')) {
              const isInteractive = e.target.closest('.sc-filter-pill, button, a, input, select, [data-action]');
              if (isInteractive) return;
              collapse();
              return;
            }

            // Сначала сбрасываем предыдущее состояние (если было)
            collapse();

            // Активируем выбранную карточку
            kpiGrid.querySelectorAll('.pf-kpi-card').forEach(c => {
              c.classList.remove('pf-kpi-active');
              c.classList.add('pf-kpi-dimmed');
            });
            card.classList.remove('pf-kpi-dimmed');
            card.classList.add('pf-kpi-active');

            const sidebar = document.createElement('div');
            sidebar.className = 'pf-kpi-sidebar';
            originalOrder
              .filter(id => id !== card.dataset.card)
              .forEach(id => {
                const c = kpiGrid.querySelector('.pf-kpi-card[data-card="' + id + '"]');
                if (c) sidebar.appendChild(c);
              });
            kpiGrid.appendChild(sidebar);
            kpiGrid.classList.add('has-active');

            // AI анализ при раскрытии карточки clients
            if (card.dataset.card === 'clients') {
              const insightEl = document.getElementById('bcg-ai-insight');
              if (insightEl && !insightEl.dataset.loaded) {
                insightEl.dataset.loaded = '1';
                insightEl.innerHTML = `<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  Анализирую портфель...
                </div>`;
                try {
                  console.log('[BCG AI] summary:', summary);
                  console.log('[BCG AI] computed length:', computed?.length);
                  const snap = computed.slice(0, 16).map(r => ({
                    name:    r.client.name,
                    bcg:     r.client.bcg_category,
                    loyalty: r.loyalty ?? null,
                    bchs:    r.bchs ?? null,
                    mr:      r.client.monthly_revenue ?? 0,
                    risk:    r.riskAmt ?? 0,
                    trend:   r.trend?.direction ?? null,
                  }));
                  const result = await API.callAI({
                    type: 'portfolio_analysis',
                    summary,
                    clients_snapshot: snap,
                  });
                  const content = result?.choices?.[0]?.message?.content ?? result?.content ?? '';
                  let bcgText = '';
                  try {
                    const parsed = JSON.parse(content);
                    bcgText = parsed.bcg ?? parsed.insight ?? content;
                  } catch (_) { bcgText = content; }
                  insightEl.innerHTML = `<div style="font-size:12px;color:#374151;line-height:1.7">${bcgText}</div>`;
                } catch (e) {
                  insightEl.innerHTML = `<div style="font-size:11px;color:#ef4444">Ошибка: ${e.message}</div>`;
                }
              }
            }

            // AI анализ при раскрытии карточки priority_revenue
            if (card.dataset.card === 'priority_revenue') {
              setTimeout(async () => {
                const svg = document.getElementById('ps-svg');
                if (!svg) return;
                const allDots = [...svg.querySelectorAll('.ps-dot')];

                // Tooltip
                let tip = document.getElementById('sc-tooltip');
                if (!tip) {
                  tip = document.createElement('div');
                  tip.id = 'sc-tooltip';
                  tip.style.cssText = 'position:fixed;display:none;background:#1e293b;color:#f8fafc;'
                    + 'font-size:11px;padding:6px 10px;border-radius:8px;pointer-events:none;'
                    + 'z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.18);line-height:1.5;white-space:nowrap';
                  document.body.appendChild(tip);
                }

                allDots.forEach(dot => {
                  dot.addEventListener('mouseenter', () => {
                    allDots.forEach(d => { if (d !== dot) d.style.opacity = '0.2'; });
                    dot.setAttribute('r', String(Number(dot.getAttribute('r')) + 2));
                    tip.innerHTML = '<b>' + dot.dataset.name + '</b><br>'
                      + 'Priority: ' + dot.dataset.ps + ' &nbsp;·&nbsp; $' + Number(dot.dataset.mr).toLocaleString('ru-RU');
                    tip.style.display = 'block';
                  });
                  dot.addEventListener('mousemove', e => {
                    tip.style.left = (e.clientX + 12) + 'px';
                    tip.style.top  = (e.clientY - 30) + 'px';
                  });
                  dot.addEventListener('mouseleave', () => {
                    allDots.forEach(d => { d.style.opacity = '.85'; });
                    dot.setAttribute('r', String(Number(dot.getAttribute('r')) - 2));
                    tip.style.display = 'none';
                  });
                });

                // AI инсайт
                const insightEl = document.getElementById('ps-ai-insight');
                if (insightEl && !insightEl.dataset.loaded) {
                  insightEl.dataset.loaded = '1';
                  insightEl.innerHTML = '<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">'
                    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>'
                    + 'AI анализирует...</div>';
                  try {
                    const snap = computed.slice(0,16).map(r => ({
                      name: r.client.name, bcg: r.client.bcg_category,
                      priority: Math.round((r.priority||0)*100)/100,
                      mr: r.client.monthly_revenue||0,
                      loyalty: r.loyalty, bchs: r.bchs,
                    }));
                    const result = await API.callAI({ type: 'portfolio_analysis', summary, clients_snapshot: snap });
                    const content = result?.choices?.[0]?.message?.content ?? result?.content ?? '';
                    let display = content;
                    try {
                      const parsed = JSON.parse(content);
                      display = parsed.priority || parsed.insight || parsed.bcg || JSON.stringify(parsed, null, 2);
                    } catch(_) {}
                    insightEl.style.cssText = 'font-size:12px;color:#374151;line-height:1.7;white-space:pre-wrap';
                    insightEl.textContent = display || 'Анализ завершён.';
                  } catch(e) {
                    insightEl.style.color = '#ef4444';
                    insightEl.textContent = 'Ошибка: ' + e.message;
                  }
                }
              }, 80);
            }

            // AI анализ при раскрытии карточки hours_revenue
            if (card.dataset.card === 'hours_revenue') {
              // --- scatter интерактивность ---
              setTimeout(() => {
                const svg      = document.getElementById('scatter-svg');
                const counter  = document.getElementById('sc-counter');
                if (!svg) return;
                const allDots  = [...svg.querySelectorAll('.sc-dot')];
                const allLabels = [...svg.querySelectorAll('.sc-lbl')];
                const total    = allDots.length;
                let activeBcgs = new Set(['ALL']);

                // Tooltip
                let tip = document.getElementById('sc-tooltip');
                if (!tip) {
                  tip = document.createElement('div');
                  tip.id = 'sc-tooltip';
                  tip.style.cssText = 'position:fixed;display:none;background:#1e293b;color:#f8fafc;'
                    + 'font-size:11px;padding:6px 10px;border-radius:8px;pointer-events:none;'
                    + 'z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.18);line-height:1.5;white-space:nowrap';
                  document.body.appendChild(tip);
                }

                // Обновить видимость точек
                function applyFilter() {
                  const showAll = activeBcgs.has('ALL');
                  let visible = 0;
                  allDots.forEach(dot => {
                    const show = showAll || activeBcgs.has(dot.dataset.bcg);
                    dot.style.opacity = show ? '.85' : '0';
                    dot.style.pointerEvents = show ? 'auto' : 'none';
                    if (show) visible++;
                  });
                  // Подписи: всегда для top3 если видимых <= 10, иначе скрыть
                  allLabels.forEach(lbl => {
                    const dotId = lbl.className.baseVal.replace('sc-lbl sc-lbl-','');
                    const dot = svg.querySelector('.sc-dot[data-id="' + dotId + '"]');
                    const isVisible = dot && dot.style.opacity !== '0';
                    if (!isVisible) { lbl.setAttribute('opacity','0'); return; }
                    // top3 — определяем по r=7
                    const isTop = dot && dot.getAttribute('r') === '7';
                    lbl.setAttribute('opacity', (visible <= 10 || isTop) ? '1' : '0');
                  });
                  if (counter) counter.textContent = 'Показано ' + visible + ' из ' + total;
                }

                // Пилюли
                const pillContainer = svg.closest('div').querySelector('.sc-filter-all')?.parentElement;
                if (pillContainer) {
                  pillContainer.addEventListener('click', e => {
                    const pill = e.target.closest('.sc-filter-pill');
                    if (!pill) return;
                    const bcg = pill.dataset.bcg;
                    if (bcg === 'ALL') {
                      activeBcgs = new Set(['ALL']);
                      pillContainer.querySelectorAll('.sc-filter-pill').forEach(p => {
                        const isAll = p.dataset.bcg === 'ALL';
                        p.style.background = isAll ? '#6366f1' : 'transparent';
                        p.style.color = isAll ? '#fff' : (p.style.borderColor || '#6b7280');
                      });
                    } else {
                      activeBcgs.delete('ALL');
                      pillContainer.querySelector('[data-bcg="ALL"]').style.background = 'transparent';
                      pillContainer.querySelector('[data-bcg="ALL"]').style.color = '#6366f1';
                      if (activeBcgs.has(bcg)) {
                        activeBcgs.delete(bcg);
                        pill.style.background = 'transparent';
                        pill.style.color = pill.style.borderColor;
                      } else {
                        activeBcgs.add(bcg);
                        pill.style.background = pill.style.borderColor;
                        pill.style.color = '#fff';
                      }
                      if (activeBcgs.size === 0) {
                        activeBcgs.add('ALL');
                        pillContainer.querySelector('[data-bcg="ALL"]').style.background = '#6366f1';
                        pillContainer.querySelector('[data-bcg="ALL"]').style.color = '#fff';
                      }
                    }
                    applyFilter();
                  });
                }

                // Hover — highlight + tooltip
                allDots.forEach(dot => {
                  dot.addEventListener('mouseenter', e => {
                    allDots.forEach(d => {
                      if (d !== dot) { d.style.opacity = '0.2'; }
                    });
                    dot.setAttribute('r', String(Number(dot.getAttribute('r')) + 2));
                    tip.innerHTML = '<b>' + dot.dataset.name + '</b><br>'
                      + dot.dataset.hrs + 'h / нед &nbsp;·&nbsp; $' + Number(dot.dataset.mr).toLocaleString('ru-RU');
                    tip.style.display = 'block';
                  });
                  dot.addEventListener('mousemove', e => {
                    tip.style.left = (e.clientX + 12) + 'px';
                    tip.style.top  = (e.clientY - 30) + 'px';
                  });
                  dot.addEventListener('mouseleave', () => {
                    applyFilter(); // восстанавливает opacity
                    dot.setAttribute('r', String(Number(dot.getAttribute('r')) - 2));
                    tip.style.display = 'none';
                  });
                });

                applyFilter();
              }, 80);
              const insightEl = document.getElementById('hours-rev-ai-insight');
              if (insightEl && !insightEl.dataset.loaded) {
                insightEl.dataset.loaded = '1';
                insightEl.innerHTML = `<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  AI анализирует...
                </div>`;
                try {
                  const snap = computed.slice(0, 16).map(r => ({
                    name:    r.client.name,
                    bcg:     r.client.bcg_category,
                    hours:   r.total_hours ?? 0,
                    mr:      r.client.monthly_revenue ?? 0,
                    loyalty: r.loyalty ?? null,
                    bchs:    r.bchs ?? null,
                    risk:    r.riskAmt ?? 0,
                    trend:   r.trend?.direction ?? null,
                  }));
                  const result = await API.callAI({
                    type: 'portfolio_analysis',
                    summary,
                    clients_snapshot: snap,
                  });
                  const content = result?.choices?.[0]?.message?.content ?? result?.content ?? '';
                  let text = '';
                  try {
                    const parsed = JSON.parse(content);
                    text = parsed.hours ?? parsed.efficiency ?? parsed.bcg ?? parsed.insight ?? content;
                  } catch (_) { text = content; }
                  insightEl.innerHTML = `<div style="font-size:12px;color:#374151;line-height:1.7">${text}</div>`;
                } catch (e) {
                  insightEl.innerHTML = `<div style="font-size:11px;color:#ef4444">Ошибка: ${e.message}</div>`;
                }
              }
            }

            // AI анализ при раскрытии карточки revenue_bcg
            if (card.dataset.card === 'revenue_bcg') {
              const insightEl = document.getElementById('revenue-bcg-ai-insight');
              if (insightEl && !insightEl.dataset.loaded) {
                insightEl.dataset.loaded = '1';
                insightEl.innerHTML = `<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  AI анализирует...
                </div>`;
                try {
                  const snap = computed.slice(0, 16).map(r => ({
                    name:    r.client.name,
                    bcg:     r.client.bcg_category,
                    loyalty: r.loyalty ?? null,
                    bchs:    r.bchs ?? null,
                    mr:      r.client.monthly_revenue ?? 0,
                    risk:    r.riskAmt ?? 0,
                    trend:   r.trend?.direction ?? null,
                  }));
                  const result = await API.callAI({
                    type: 'portfolio_analysis',
                    summary,
                    clients_snapshot: snap,
                  });
                  const content = result?.choices?.[0]?.message?.content ?? result?.content ?? '';
                  let revenueText = '';
                  try {
                    const parsed = JSON.parse(content);
                    revenueText = parsed.revenue ?? parsed.insight ?? content;
                  } catch (_) { revenueText = content; }
                  insightEl.innerHTML = `<div style="font-size:12px;color:#374151;line-height:1.7">${revenueText}</div>`;
                } catch (e) {
                  insightEl.innerHTML = `<div style="font-size:11px;color:#ef4444">Ошибка: ${e.message}</div>`;
                }
              }
            }
          });
        }
      }

      // Горизонты — toggle collapse и edit режим
      ['short', 'mid', 'long'].forEach(key => {
        const head    = document.querySelector(`[data-toggle="${key}"]`);
        const body    = document.getElementById(`pf-hz-body-${key}`);
        const chevron = document.getElementById(`pf-hz-chevron-${key}`);
        const view    = document.getElementById(`pf-hz-view-${key}`);
        const edit    = document.getElementById(`pf-hz-edit-${key}`);
        const editBtn = document.querySelector(`[data-editkey="${key}"]`);
        const cancelBtn = document.querySelector(`[data-cancelkey="${key}"]`);

        // По умолчанию — все свёрнуты
        if (body) {
          body.style.display = 'none';
          if (chevron) chevron.style.transform = 'rotate(-90deg)';
        }

        // Toggle по клику на заголовок
        head?.addEventListener('click', e => {
          if (e.target.closest('.pf-hz-edit-btn') ||
              e.target.closest('.pf-hz-save-btn') ||
              e.target.closest('.pf-hz-cancel-btn') ||
              e.target.closest('.pf-hz-actions')) return;

          const isOpen = body?.style.display !== 'none';
          if (body) body.style.display = isOpen ? 'none' : 'block';
          if (chevron) chevron.style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0deg)';
        });

        // Кнопка редактирования
        editBtn?.addEventListener('click', e => {
          e.stopPropagation();
          if (body) body.style.display = 'block';
          if (chevron) chevron.style.transform = 'rotate(0deg)';
          if (view) view.style.display = 'none';
          if (edit) edit.style.display = 'block';
          document.getElementById(`pf-${key}-focus`)?.focus();
        });

        // Отмена редактирования
        cancelBtn?.addEventListener('click', e => {
          e.stopPropagation();
          if (view) view.style.display = 'block';
          if (edit) edit.style.display = 'none';
        });
      });

      // Перемещаем AI кнопки в pf-hz-actions
      const moveAiBtn = (key) => {
        const existing = document.getElementById(`pf-ai-gen-btn-${key}`);
        if (existing) {
          const actions = document.getElementById(`pf-hz-actions-${key}`);
          if (actions) actions.appendChild(existing);
        }
      };

      // AI режим тогл
document.getElementById('pf-ai-mode-sw')
  ?.addEventListener('change', (e) => {
    this._setAiMode(e.target.checked, summary, computed);
  });

// Сохранение по кнопке в каждом горизонте
['short', 'mid', 'long'].forEach(key => {
  document.getElementById(`pf-save-btn-${key}`)
    ?.addEventListener('click', async () => {
      await this._savePortfolioStrats();
      // После сохранения — обновляем view и переключаемся в него
      const view   = document.getElementById(`pf-hz-view-${key}`);
      const edit   = document.getElementById(`pf-hz-edit-${key}`);
      const subEl  = document.querySelector(`#pf-horizon-${key} .pf-hz-subtitle`);
      const titleVal = document.getElementById(`pf-${key}-focus`)?.value || '';
      if (subEl) subEl.textContent = titleVal.slice(0, 50) + (titleVal.length > 50 ? '…' : '');
      if (view) view.style.display = 'block';
      if (edit) edit.style.display = 'none';
    });
});


    } catch (e) {
      console.error('[PortfolioPage._renderPortfolioTab]', e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:#ef4444;font-size:13px">
        Ошибка: ${e.message}</div>`;
    }
  },

  _renderPortfolioCharts(computed) {

    // ── Donut: BCG распределение ──
    const bcgEl = document.getElementById('pf-chart-bcg');
    if (bcgEl) {
      const BCG_CFG = {
        KEY:          { label: 'KEY',          color: '#f59e0b' },
        GROWTH:       { label: 'GROWTH',       color: '#6366f1' },
        GROWTH_EARLY: { label: 'GROWTH Early', color: '#8b5cf6' },
        STABLE:       { label: 'STABLE',       color: '#6b7280' },
        TAIL:         { label: 'TAIL',         color: '#9ca3af' },
      };
      const counts = { KEY:0, GROWTH:0, GROWTH_EARLY:0, STABLE:0, TAIL:0 };
      computed.forEach(r => { if (counts[r.client.bcg_category] != null) counts[r.client.bcg_category]++; });
      const total = computed.length || 1;

      // SVG donut
      const cx = 52, cy = 52, R = 40, r2 = 24;
      let startAngle = -Math.PI / 2;
      let paths = '';
      Object.entries(counts).forEach(([key, cnt]) => {
        if (!cnt) return;
        const angle = (cnt / total) * 2 * Math.PI;
        const x1 = cx + R * Math.cos(startAngle);
        const y1 = cy + R * Math.sin(startAngle);
        const x2 = cx + R * Math.cos(startAngle + angle);
        const y2 = cy + R * Math.sin(startAngle + angle);
        const ix1 = cx + r2 * Math.cos(startAngle);
        const iy1 = cy + r2 * Math.sin(startAngle);
        const ix2 = cx + r2 * Math.cos(startAngle + angle);
        const iy2 = cy + r2 * Math.sin(startAngle + angle);
        const large = angle > Math.PI ? 1 : 0;
        const color = BCG_CFG[key]?.color ?? '#ccc';
        paths += `<path d="M${ix1},${iy1} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${r2},${r2} 0 ${large},0 ${ix1},${iy1}" fill="${color}" opacity=".9"/>`;
        startAngle += angle;
      });

      const donutSVG = `<svg width="104" height="104" viewBox="0 0 104 104">
        ${paths}
        <text x="52" y="56" text-anchor="middle" font-size="18" font-weight="700"
              fill="var(--text-primary)">${total}</text>
      </svg>`;

      const legend = Object.entries(counts)
        .filter(([,v]) => v > 0)
        .map(([key, cnt]) => `
          <div style="display:flex;align-items:center;gap:6px;cursor:pointer"
               onclick="window.App && window.App.navigate && null"
               title="${BCG_CFG[key]?.label}">
            <div style="width:10px;height:10px;border-radius:3px;
                        background:${BCG_CFG[key]?.color};flex-shrink:0"></div>
            <span style="font-size:12px;color:var(--text-muted)">${BCG_CFG[key]?.label}</span>
            <span style="font-size:12px;font-weight:600;color:var(--text-primary);margin-left:auto;padding-left:8px">${cnt}</span>
          </div>`).join('');

      bcgEl.innerHTML = donutSVG + `<div style="flex:1;display:flex;flex-direction:column;gap:7px">${legend}</div>`;
    }

    // ── Bars: Лояльность ──
    const loyaltyEl = document.getElementById('pf-chart-loyalty');
    if (loyaltyEl) {
      const sorted = [...computed]
        .filter(r => r.loyalty != null)
        .sort((a, b) => (b.loyalty ?? 0) - (a.loyalty ?? 0))
        .slice(0, 8);
      const maxVal = 100;

      loyaltyEl.innerHTML = sorted.map(r => {
        const pct   = Math.round(r.loyalty ?? 0);
        const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
        const w     = Math.max(4, Math.round((pct / maxVal) * 100));
        return `
          <div style="display:flex;align-items:center;gap:8px;cursor:pointer"
               data-action="go-detail" data-id="${r.client.id}">
            <div style="width:90px;font-size:11px;color:var(--text-primary);
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                        flex-shrink:0">${r.client.name}</div>
            <div style="flex:1;background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden">
              <div style="width:${w}%;height:100%;background:${color};border-radius:4px;
                          transition:width .4s"></div>
            </div>
            <div style="width:32px;text-align:right;font-size:11px;font-weight:600;
                        color:${color};flex-shrink:0">${pct}%</div>
          </div>`;
      }).join('') || '<div style="font-size:12px;color:#94a3b8">Нет данных</div>';

      loyaltyEl.querySelectorAll('[data-action="go-detail"]').forEach(el => {
        el.addEventListener('click', () => window.App.navigate('detail', el.dataset.id));
      });
    }

    // ── Bars: Revenue at Risk ──
    const riskEl = document.getElementById('pf-chart-risk');
    if (riskEl) {
      const sorted = [...computed]
        .filter(r => (r.riskAmt ?? 0) > 0)
        .sort((a, b) => (b.riskAmt ?? 0) - (a.riskAmt ?? 0))
        .slice(0, 8);
      const maxVal = sorted[0]?.riskAmt ?? 1;

      riskEl.innerHTML = sorted.map(r => {
        const amt   = r.riskAmt ?? 0;
        const pct   = r.riskPct ?? 0;
        const w     = Math.max(4, Math.round((amt / maxVal) * 100));
        const color = pct > 30 ? '#ef4444' : pct > 15 ? '#f59e0b' : '#6366f1';
        return `
          <div style="display:flex;align-items:center;gap:8px;cursor:pointer"
               data-action="go-detail" data-id="${r.client.id}">
            <div style="width:90px;font-size:11px;color:var(--text-primary);
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                        flex-shrink:0">${r.client.name}</div>
            <div style="flex:1;background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden">
              <div style="width:${w}%;height:100%;background:${color};border-radius:4px;
                          transition:width .4s"></div>
            </div>
            <div style="width:52px;text-align:right;font-size:11px;font-weight:600;
                        color:${color};flex-shrink:0">$${amt >= 1000 ? Math.round(amt/1000)+'k' : amt}</div>
          </div>`;
      }).join('') || '<div style="font-size:12px;color:#94a3b8">Рисков нет</div>';

      riskEl.querySelectorAll('[data-action="go-detail"]').forEach(el => {
        el.addEventListener('click', () => window.App.navigate('detail', el.dataset.id));
      });
    }

    // ── Bars: Реализация потенциала ──
    const potEl = document.getElementById('pf-chart-potential');
    if (potEl) {
      const sorted = [...computed]
        .filter(r => (r.potential ?? 0) > 0)
        .sort((a, b) => {
          const pa = (r => r.client.monthly_revenue / Math.max(1, r.potential ?? r.client.monthly_revenue))(a);
          const pb = (r => r.client.monthly_revenue / Math.max(1, r.potential ?? r.client.monthly_revenue))(b);
          return pa - pb; // снизу — самые недореализованные
        })
        .slice(0, 8);

      potEl.innerHTML = sorted.map(r => {
        const mr  = r.client.monthly_revenue ?? 0;
        const pot = r.potential ?? mr;
        const pct = pot > 0 ? Math.min(100, Math.round((mr / pot) * 100)) : 100;
        const w   = Math.max(4, pct);
        const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
        return `
          <div style="display:flex;align-items:center;gap:8px;cursor:pointer"
               data-action="go-detail" data-id="${r.client.id}">
            <div style="width:90px;font-size:11px;color:var(--text-primary);
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                        flex-shrink:0">${r.client.name}</div>
            <div style="flex:1;background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden">
              <div style="width:${w}%;height:100%;background:${color};border-radius:4px;
                          transition:width .4s"></div>
            </div>
            <div style="width:32px;text-align:right;font-size:11px;font-weight:600;
                        color:${color};flex-shrink:0">${pct}%</div>
          </div>`;
      }).join('') || '<div style="font-size:12px;color:#94a3b8">Нет данных</div>';

      potEl.querySelectorAll('[data-action="go-detail"]').forEach(el => {
        el.addEventListener('click', () => window.App.navigate('detail', el.dataset.id));
      });
    }
  },

  _buildSummary(computed) {
    const total       = computed.length;
    const withLoyalty = computed.filter(r => r.loyalty !== null);
    const avgLoyalty  = withLoyalty.length
      ? Math.round(withLoyalty.reduce((s, r) => s + r.loyalty, 0) / withLoyalty.length)
      : null;
    const withBCHS = computed.filter(r => r.bchs !== null);
    const avgBchs  = withBCHS.length
      ? Math.round(withBCHS.reduce((s, r) => s + r.bchs, 0) / withBCHS.length)
      : null;
    const totalRisk = computed.reduce((s, r) => s + (r.revenueAtRisk || 0), 0);
    const bcgCount  = { KEY: 0, STABLE: 0, GROWTH: 0, GROWTH_EARLY: 0, TAIL: 0 };
    computed.forEach(r => { const k = r.client.bcg_category; if (k in bcgCount) bcgCount[k]++; });
    const top3Risk = [...computed]
      .filter(r => r.revenueAtRisk > 0)
      .sort((a, b) => b.revenueAtRisk - a.revenueAtRisk)
      .slice(0, 3)
      .map(r => ({ name: r.client.name, risk: r.revenueAtRisk, pct: r.riskPct }));
    const withPotential = computed.filter(r => r.potential !== null);
    const avgPotential  = withPotential.length
      ? Math.round(withPotential.reduce((s, r) => s + r.potential, 0) / withPotential.length)
      : null;
    return { total, avgBchs, avgLoyalty, totalRisk, bcgCount, top3Risk, avgPotential };
  },

  _summaryHTML(s, computed = []) {
    const loyaltyColor = s.avgLoyalty === null ? '#6b7280'
      : s.avgLoyalty >= 70 ? '#10b981'
      : s.avgLoyalty >= 50 ? '#f59e0b' : '#ef4444';
    const riskColor = s.totalRisk === 0 ? '#10b981'
      : s.totalRisk > 50000 ? '#ef4444' : '#f59e0b';
    const potColor = s.avgPotential === null ? '#6b7280'
      : s.avgPotential >= 85 ? '#10b981'
      : s.avgPotential >= 65 ? '#f59e0b' : '#ef4444';

    const bcgTotal = Object.values(s.bcgCount).reduce((a,b) => a+b, 0) || 1;
    const bcgBars = Object.entries(s.bcgCount).map(([key, count]) => {
      const c = BCG_CFG[key];
      const w = Math.round(count / bcgTotal * 100);
      return `<div class="kpi-det-row">
        <span class="kpi-det-label" style="color:${c.color}">${c.label}</span>
        <div class="kpi-det-bar-wrap">
          <div class="kpi-det-bar" style="width:${w}%;background:${c.color};opacity:0.18;border-radius:3px;"></div>
        </div>
        <span class="kpi-det-count">${count}</span>
      </div>`;
    }).join('');

    const top3rows = s.top3Risk.length
      ? s.top3Risk.map((r, i) => `
        <div class="kpi-det-row">
          <span class="kpi-det-num">${i+1}</span>
          <span class="kpi-det-name">${r.name}</span>
          <span class="kpi-det-risk">$${r.risk.toLocaleString('ru-RU')}</span>
          <span class="kpi-det-pct">${r.pct}%</span>
        </div>`).join('')
      : `<div style="font-size:12px;color:var(--text-muted);padding:8px 0">Нет рисков</div>`;

    const cards = [
      {
        id: 'clients',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        label: 'Клиентов',
        value: s.total,
        hint: 'в портфеле',
        valueColor: 'var(--text-primary)',
        detail: (() => {
          const BCG_COLORS = { KEY:'#f59e0b', GROWTH:'#6366f1', GROWTH_EARLY:'#8b5cf6', STABLE:'#6b7280', TAIL:'#9ca3af' };
          const total = computed.length || 1;
          // Donut SVG
          const r = 36, cx = 44, cy = 44, stroke = 12;
          const circ = 2 * Math.PI * r;
          let offset = 0;
          const segments = Object.entries(s.bcgCount)
            .filter(([,cnt]) => cnt > 0)
            .map(([key, cnt]) => {
              const pct = cnt / total;
              const seg = `<circle cx="${cx}" cy="${cy}" r="${r}"
                fill="none" stroke="${BCG_COLORS[key]||'#9ca3af'}"
                stroke-width="${stroke}"
                stroke-dasharray="${pct*circ} ${circ}"
                stroke-dashoffset="${-offset*circ}"
                transform="rotate(-90 ${cx} ${cy})"/>`;
              offset += pct;
              return seg;
            }).join('');
          const donut = `<svg width="88" height="88" viewBox="0 0 88 88">${segments}
            <text x="${cx}" y="${cy+5}" text-anchor="middle"
                  font-size="14" font-weight="700" fill="#0f172a">${total}</text>
          </svg>`;
          const legend = Object.entries(s.bcgCount).filter(([,c])=>c>0).map(([key,cnt]) =>
            `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
              <div style="width:8px;height:8px;border-radius:2px;background:${BCG_COLORS[key]||'#9ca3af'};flex-shrink:0"></div>
              <span style="font-size:11px;color:#6b7280;flex:1">${key.replace('_',' ')}</span>
              <span style="font-size:11px;font-weight:700;color:#0f172a">${cnt}</span>
            </div>`).join('');
          const list = computed.map(r => `
            <div data-action="go-detail" data-id="${r.client.id}"
                 style="display:flex;align-items:center;gap:8px;padding:7px 0;
                        border-bottom:1px solid #f5f5f8;cursor:pointer"
                 onmouseover="this.style.background='#f8faff'"
                 onmouseout="this.style.background='transparent'">
              <div style="width:6px;height:6px;border-radius:2px;flex-shrink:0;
                          background:${BCG_COLORS[r.client.bcg_category]||'#9ca3af'}"></div>
              <span style="font-size:12px;font-weight:600;flex:1;color:#0f172a">${r.client.name}</span>
              <span style="font-size:11px;font-weight:600;color:#6366f1">$${Number(r.client.monthly_revenue||0).toLocaleString('ru-RU')}</span>
            </div>`).join('');
          const bcgInsightHTML = `
            <div id="bcg-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">
              <div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                AI анализирует портфель...
              </div>
            </div>`;
          return `
            <div style="display:flex;gap:16px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #f5f5f8">
              <div style="display:flex;gap:16px;align-items:center;flex-shrink:0">
                ${donut}
                <div>${legend}</div>
              </div>
              <div style="flex:1;padding-left:16px;border-left:1px solid #f1f5f9">
                ${bcgInsightHTML}
              </div>
            </div>
            <div class="kpi-det-title">Все клиенты</div>
            <div style="max-height:200px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent">${list}</div>`;
        })(),
      },
      {
        id: 'revenue_bcg',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        label: 'Revenue by BCG',
        value: '$' + Math.round(computed.reduce((sum, r) => sum + (r.client.monthly_revenue||0), 0) / 1000) + 'K',
        hint: 'суммарный MR',
        valueColor: 'var(--text-primary)',
        detail: (() => {
          const BCG_COLORS = { KEY:'#f59e0b', GROWTH:'#6366f1', GROWTH_EARLY:'#8b5cf6', STABLE:'#6b7280', TAIL:'#9ca3af' };
          const BCG_ORDER  = ['KEY','STABLE','GROWTH','GROWTH_EARLY','TAIL'];
          const mrByBcg = {};
          BCG_ORDER.forEach(k => { mrByBcg[k] = 0; });
          computed.forEach(r => {
            const k = r.client.bcg_category;
            if (mrByBcg[k] != null) mrByBcg[k] += (r.client.monthly_revenue||0);
          });
          const maxMR   = Math.max(...Object.values(mrByBcg), 1);
          const totalMR = Object.values(mrByBcg).reduce((a,b) => a+b, 0) || 1;
          const barW = 44, barGap = 14, chartH = 140, labelH = 28, topPad = 20;
          const svgW = BCG_ORDER.length * (barW + barGap);
          const bars = BCG_ORDER.map((key, i) => {
            const val = mrByBcg[key] || 0;
            const bh  = Math.round((val / maxMR) * chartH);
            const x   = i * (barW + barGap);
            const y   = topPad + (chartH - bh);
            const lbl = val >= 1000 ? '$' + Math.round(val/1000) + 'K' : '$' + val;
            return `
              <rect x="${x}" y="${y}" width="${barW}" height="${bh}"
                    fill="${BCG_COLORS[key]||'#9ca3af'}" rx="4" opacity=".9"/>
              <text x="${x + barW/2}" y="${y - 5}" text-anchor="middle"
                    font-size="9" font-weight="600" fill="#374151">${val > 0 ? lbl : ''}</text>
              <text x="${x + barW/2}" y="${topPad + chartH + 14}" text-anchor="middle"
                    font-size="9" fill="#6b7280">${key.replace('_EARLY',' E').replace('_',' ')}</text>`;
          }).join('');
          const chartSVG = `<svg width="${svgW}" height="${topPad + chartH + labelH}" viewBox="0 0 ${svgW} ${topPad + chartH + labelH}">
            <line x1="0" y1="${topPad + chartH}" x2="${svgW}" y2="${topPad + chartH}" stroke="#e2e8f0" stroke-width="1"/>
            ${bars}
          </svg>`;
          return `
            <div style="display:flex;gap:20px;align-items:flex-start">
              <div style="flex-shrink:0">${chartSVG}</div>
              <div style="flex:1;padding-left:16px;border-left:1px solid #f1f5f9">
                <div id="revenue-bcg-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">
                  <div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    AI анализирует...
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px">
              ${BCG_ORDER.filter(k => mrByBcg[k] > 0).map(k => `
                <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6b7280">
                  <div style="width:8px;height:8px;border-radius:2px;background:${BCG_COLORS[k]}"></div>
                  ${k.replace('_',' ')}:
                  <strong style="color:#0f172a">$${mrByBcg[k].toLocaleString('en-US')}</strong>
                  <span style="color:#94a3b8">(${Math.round(mrByBcg[k]/totalMR*100)}%)</span>
                </div>`).join('')}
            </div>`;
        })(),
      },
      {
        id: 'hours_revenue',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        label: 'Часы vs Revenue',
        value: (() => {
          const avgHrs = computed.length
            ? Math.round(computed.reduce((s,r) => s + (r.total_hours||0), 0) / computed.length * 10) / 10
            : 0;
          return avgHrs + 'h';
        })(),
        hint: 'среднее на клиента',
        valueColor: 'var(--text-primary)',
        detail: (() => {
          const BCG_COLORS = { KEY:'#f59e0b', GROWTH:'#6366f1', GROWTH_EARLY:'#8b5cf6', STABLE:'#6b7280', TAIL:'#9ca3af' };
          const maxHrs = Math.max(...computed.map(r => r.total_hours||0), 1);
          const maxMR  = Math.max(...computed.map(r => r.client.monthly_revenue||0), 1);
          const W = 340, H = 220, PAD = 46;
          const px = h  => Math.round(PAD + (h  / maxHrs) * (W - PAD*2));
          const py = mr => Math.round(H - PAD - (mr / maxMR) * (H - PAD*2));
          const sortedByMR = [...computed].sort((a,b) => (b.client.monthly_revenue||0) - (a.client.monthly_revenue||0));
          const top3ids = new Set(sortedByMR.slice(0,3).map(r => r.client.id));
          // dots с data-bcg для фильтрации
          const dots = computed.map(r => {
            const x     = px(r.total_hours||0);
            const y     = py(r.client.monthly_revenue||0);
            const c     = BCG_COLORS[r.client.bcg_category]||'#9ca3af';
            const isTop = top3ids.has(r.client.id);
            const name  = r.client.name.length > 10 ? r.client.name.slice(0,9) + '\u2026' : r.client.name;
            const lbl   = isTop
              ? '<text class="sc-lbl sc-lbl-' + r.client.id + '" x="' + (x+9) + '" y="' + (y+4) + '" font-size="9" font-weight="600" fill="#374151" pointer-events="none">' + name + '</text>'
              : '<text class="sc-lbl sc-lbl-' + r.client.id + '" x="' + (x+7) + '" y="' + (y+4) + '" font-size="9" fill="#64748b" pointer-events="none" opacity="0">' + name + '</text>';
            return '<circle class="sc-dot" cx="' + x + '" cy="' + y + '" r="' + (isTop ? 7 : 5) + '" fill="' + c + '" opacity=".85"'
              + ' data-action="go-detail" data-id="' + r.client.id + '" data-bcg="' + (r.client.bcg_category||'') + '"'
              + ' data-name="' + r.client.name + '" data-hrs="' + (r.total_hours||0) + '" data-mr="' + (r.client.monthly_revenue||0) + '"'
              + ' style="cursor:pointer;transition:opacity .2s,r .15s"/>'
              + lbl;
          }).join('');
          // Оси
          const axisX = '<line x1="' + PAD + '" y1="' + (H-PAD) + '" x2="' + (W-4) + '" y2="' + (H-PAD) + '" stroke="#e2e8f0" stroke-width="1"/>';
          const axisY = '<line x1="' + PAD + '" y1="4" x2="' + PAD + '" y2="' + (H-PAD) + '" stroke="#e2e8f0" stroke-width="1"/>';
          const labelX = '<text x="' + (W/2) + '" y="' + H + '" text-anchor="middle" font-size="9" fill="#94a3b8">Часы / нед</text>';
          const labelY = '<text x="8" y="' + (H/2) + '" text-anchor="middle" font-size="9" fill="#94a3b8" transform="rotate(-90 8 ' + (H/2) + ')">MR ($)</text>';
          const xTicks = [0, 0.25, 0.5, 0.75, 1].map(t => {
            const xv  = Math.round(maxHrs * t);
            const xpx = px(xv);
            return '<line x1="' + xpx + '" y1="' + (H-PAD) + '" x2="' + xpx + '" y2="' + (H-PAD+4) + '" stroke="#cbd5e1" stroke-width="1"/>'
              + '<text x="' + xpx + '" y="' + (H-PAD+13) + '" text-anchor="middle" font-size="8" fill="#94a3b8">' + xv + 'h</text>';
          }).join('');
          const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => {
            const yv  = Math.round(maxMR * t);
            const ypx = py(yv);
            const lbl = yv >= 1000 ? '$' + Math.round(yv/1000) + 'K' : '$' + yv;
            return '<line x1="' + (PAD-4) + '" y1="' + ypx + '" x2="' + PAD + '" y2="' + ypx + '" stroke="#cbd5e1" stroke-width="1"/>'
              + '<text x="' + (PAD-6) + '" y="' + (ypx+3) + '" text-anchor="end" font-size="8" fill="#94a3b8">' + lbl + '</text>';
          }).join('');
          const scatterSVG = '<svg id="scatter-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">'
            + axisX + axisY + labelX + labelY + xTicks + yTicks + dots
            + '</svg>';
          // Пилюли фильтра
          const allBcgs = [...new Set(computed.map(r => r.client.bcg_category).filter(Boolean))];
          const pills = allBcgs.map(k =>
            '<button class="sc-filter-pill" data-bcg="' + k + '" style="'
            + 'display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;'
            + 'font-size:10px;font-weight:600;cursor:pointer;border:1.5px solid ' + (BCG_COLORS[k]||'#9ca3af') + ';'
            + 'background:transparent;color:' + (BCG_COLORS[k]||'#9ca3af') + ';transition:all .18s">'
            + '<span style="width:6px;height:6px;border-radius:50%;background:' + (BCG_COLORS[k]||'#9ca3af') + ';display:inline-block"></span>'
            + k.replace('_EARLY',' E').replace('_',' ')
            + '</button>'
          ).join('');
          return '<div style="display:flex;gap:20px;align-items:flex-start">'
            + '<div style="flex-shrink:0">'
            + scatterSVG
            + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;align-items:center">'
            + '<button class="sc-filter-pill sc-filter-all sc-active" data-bcg="ALL" style="'
            + 'display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;'
            + 'font-size:10px;font-weight:600;cursor:pointer;border:1.5px solid #6366f1;'
            + 'background:#6366f1;color:#fff;transition:all .18s">Все</button>'
            + pills
            + '</div>'
            + '<div id="sc-counter" style="font-size:10px;color:#94a3b8;margin-top:5px">Показано ' + computed.length + ' из ' + computed.length + '</div>'
            + '</div>'
            + '<div style="flex:1;padding-left:16px;border-left:1px solid #f1f5f9">'
            + '<div id="hours-rev-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">'
            + '<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">'
            + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>'
            + 'AI анализирует...'
            + '</div></div></div></div>';
        })(),
      },
      {
        id: 'priority_revenue',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>',
        label: 'Приоритет vs MR',
        value: (() => {
          const top = [...computed].sort((a,b) => (b.priority||0) - (a.priority||0))[0];
          return top ? (Math.round((top.priority||0)*100)/100) + '' : '—';
        })(),
        hint: 'топ Priority Score',
        valueColor: '#6366f1',
        detail: (() => {
          const BCG_COLORS = { KEY:'#f59e0b', GROWTH:'#6366f1', GROWTH_EARLY:'#8b5cf6', STABLE:'#6b7280', TAIL:'#9ca3af' };
          const W = 340, H = 220, PAD = 46;
          const maxPS = Math.max(...computed.map(r => r.priority||0), 1);
          const maxMR = Math.max(...computed.map(r => r.client.monthly_revenue||0), 1);
          const px = v  => Math.round(PAD + (v  / maxPS) * (W - PAD*2));
          const py = mr => Math.round(H - PAD - (mr / maxMR) * (H - PAD*2));

          // Квадранты — фоновые зоны
          const midX = px(maxPS * 0.5);
          const midY = py(maxMR * 0.5);
          const zones =
            '<rect x="' + PAD + '" y="' + midY + '" width="' + (midX-PAD) + '" height="' + (H-PAD-midY) + '" fill="#fef3c7" opacity=".35"/>'
            + '<rect x="' + midX + '" y="' + PAD + '" width="' + (W-PAD-midX) + '" height="' + (midY-PAD) + '" fill="#dcfce7" opacity=".35"/>'
            + '<rect x="' + PAD + '" y="' + PAD + '" width="' + (midX-PAD) + '" height="' + (midY-PAD) + '" fill="#fee2e2" opacity=".25"/>'
            + '<rect x="' + midX + '" y="' + midY + '" width="' + (W-PAD-midX) + '" height="' + (H-PAD-midY) + '" fill="#f1f5f9" opacity=".5"/>';

          // Подписи квадрантов
          const qLabels =
            '<text x="' + (PAD+4) + '" y="' + (midY-6) + '" font-size="8" fill="#ef4444" opacity=".7">Опасно</text>'
            + '<text x="' + (midX+4) + '" y="' + (PAD+12) + '" font-size="8" fill="#10b981" opacity=".7">Идеально</text>'
            + '<text x="' + (PAD+4) + '" y="' + (H-PAD-6) + '" font-size="8" fill="#94a3b8" opacity=".7">Слабые</text>'
            + '<text x="' + (midX+4) + '" y="' + (H-PAD-6) + '" font-size="8" fill="#6366f1" opacity=".7">Потенциал</text>';

          // Оси
          const axisX = '<line x1="' + PAD + '" y1="' + (H-PAD) + '" x2="' + (W-4) + '" y2="' + (H-PAD) + '" stroke="#e2e8f0" stroke-width="1"/>';
          const axisY = '<line x1="' + PAD + '" y1="4" x2="' + PAD + '" y2="' + (H-PAD) + '" stroke="#e2e8f0" stroke-width="1"/>';
          const labelX = '<text x="' + (W/2) + '" y="' + H + '" text-anchor="middle" font-size="9" fill="#94a3b8">Priority Score</text>';
          const labelY = '<text x="8" y="' + (H/2) + '" text-anchor="middle" font-size="9" fill="#94a3b8" transform="rotate(-90 8 ' + (H/2) + ')">MR ($)</text>';

          // Засечки X
          const xTicks = [0,0.25,0.5,0.75,1].map(t => {
            const xv  = Math.round(maxPS * t * 100) / 100;
            const xpx = px(maxPS * t);
            return '<line x1="' + xpx + '" y1="' + (H-PAD) + '" x2="' + xpx + '" y2="' + (H-PAD+4) + '" stroke="#cbd5e1" stroke-width="1"/>'
              + '<text x="' + xpx + '" y="' + (H-PAD+13) + '" text-anchor="middle" font-size="8" fill="#94a3b8">' + xv + '</text>';
          }).join('');

          // Засечки Y
          const yTicks = [0,0.25,0.5,0.75,1].map(t => {
            const yv  = Math.round(maxMR * t);
            const ypx = py(yv);
            const lbl = yv >= 1000 ? '$' + Math.round(yv/1000) + 'K' : '$' + yv;
            return '<line x1="' + (PAD-4) + '" y1="' + ypx + '" x2="' + PAD + '" y2="' + ypx + '" stroke="#cbd5e1" stroke-width="1"/>'
              + '<text x="' + (PAD-6) + '" y="' + (ypx+3) + '" text-anchor="end" font-size="8" fill="#94a3b8">' + lbl + '</text>';
          }).join('');

          // Top-3 по MR для подписей
          const sortedByMR = [...computed].sort((a,b) => (b.client.monthly_revenue||0) - (a.client.monthly_revenue||0));
          const top3ids = new Set(sortedByMR.slice(0,3).map(r => r.client.id));

          // Точки
          const dots = computed.map(r => {
            const x     = px(r.priority||0);
            const y     = py(r.client.monthly_revenue||0);
            const c     = BCG_COLORS[r.client.bcg_category] || '#9ca3af';
            const isTop = top3ids.has(r.client.id);
            const name  = r.client.name.length > 10 ? r.client.name.slice(0,9) + '…' : r.client.name;
            const lbl   = isTop
              ? '<text x="' + (x+9) + '" y="' + (y+4) + '" font-size="9" font-weight="600" fill="#374151" pointer-events="none">' + name + '</text>'
              : '';
            return '<circle class="ps-dot" cx="' + x + '" cy="' + y + '" r="' + (isTop ? 8 : 6) + '" fill="' + c + '" opacity=".85"'
              + ' data-action="go-detail" data-id="' + r.client.id + '" data-bcg="' + (r.client.bcg_category||'') + '"'
              + ' data-name="' + r.client.name + '" data-ps="' + (Math.round((r.priority||0)*100)/100) + '" data-mr="' + (r.client.monthly_revenue||0) + '"'
              + ' style="cursor:pointer;transition:opacity .2s"/>'
              + lbl;
          }).join('');

          const svgHTML = '<svg id="ps-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">'
            + zones + qLabels + axisX + axisY + labelX + labelY + xTicks + yTicks + dots
            + '</svg>';

          // Легенда
          const legend = Object.entries(BCG_COLORS).map(([key, color]) =>
            '<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#6b7280">'
            + '<div style="width:8px;height:8px;border-radius:50%;background:' + color + '"></div>'
            + key.replace('_EARLY',' E') + '</div>'
          ).join('');

          return '<div style="display:flex;gap:20px;align-items:flex-start">'
            + '<div style="flex-shrink:0">'
            + svgHTML
            + '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">' + legend + '</div>'
            + '</div>'
            + '<div style="flex:1;padding-left:16px;border-left:1px solid #f1f5f9">'
            + '<div id="ps-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">'
            + '<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">'
            + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>'
            + 'AI анализирует...'
            + '</div></div></div></div>';
        })(),
      },
      {
        id: 'loyalty',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        label: 'Лояльность',
        value: s.avgLoyalty !== null ? s.avgLoyalty + '%' : '—',
        hint: 'средняя по портфелю',
        valueColor: loyaltyColor,
        detail: (() => {
          const sorted = [...computed].filter(r => r.loyalty !== null)
            .sort((a,b) => b.loyalty - a.loyalty);
          const barClr = v => v >= 60 ? '#10b981' : v >= 40 ? '#f59e0b' : '#ef4444';
          const rows = sorted.map(r => `
            <div data-action="go-detail" data-id="${r.client.id}"
                 style="display:flex;align-items:center;gap:8px;padding:6px 0;
                        border-bottom:1px solid #f5f5f8;cursor:pointer"
                 onmouseover="this.style.background='#f8faff'"
                 onmouseout="this.style.background='transparent'">
              <span style="font-size:11px;font-weight:600;width:80px;flex-shrink:0;
                           overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                           color:#0f172a">${r.client.name}</span>
              <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
                <div style="width:${r.loyalty}%;height:100%;
                            background:${barClr(r.loyalty)};border-radius:3px;
                            transition:width .3s"></div>
              </div>
              <span style="font-size:11px;font-weight:700;color:${barClr(r.loyalty)};
                           width:32px;text-align:right;flex-shrink:0">${r.loyalty}%</span>
            </div>`).join('');
          return `<div class="kpi-det-title">Лояльность клиентов</div>
            <div style="max-height:300px;overflow-y:auto;scrollbar-width:thin;
                        scrollbar-color:#e2e8f0 transparent">${rows}</div>`;
        })(),
      },
      {
        id: 'risk',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        label: 'Revenue at Risk',
        value: '$' + s.totalRisk.toLocaleString('ru-RU'),
        hint: 'суммарно',
        valueColor: riskColor,
        detail: (() => {
          const risky = [...computed].filter(r => r.revenueAtRisk > 0)
            .sort((a,b) => b.revenueAtRisk - a.revenueAtRisk).slice(0,8);
          const maxRisk = risky[0]?.revenueAtRisk || 1;
          const rClr = p => p >= 30 ? '#ef4444' : p >= 15 ? '#f59e0b' : '#10b981';
          const rows = risky.map((r,i) => `
            <div data-action="go-detail" data-id="${r.client.id}"
                 style="display:flex;align-items:center;gap:8px;padding:6px 0;
                        border-bottom:1px solid #f5f5f8;cursor:pointer"
                 onmouseover="this.style.background='#f8faff'"
                 onmouseout="this.style.background='transparent'">
              <span style="font-size:10px;color:#94a3b8;width:14px;flex-shrink:0">${i+1}</span>
              <span style="font-size:11px;font-weight:600;width:72px;flex-shrink:0;
                           overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                           color:#0f172a">${r.client.name}</span>
              <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
                <div style="width:${Math.round(r.revenueAtRisk/maxRisk*100)}%;height:100%;
                            background:${rClr(r.riskPct)};border-radius:3px"></div>
              </div>
              <span style="font-size:11px;font-weight:700;color:${rClr(r.riskPct)};
                           width:28px;text-align:right;flex-shrink:0">${r.riskPct}%</span>
            </div>`).join('');
          return `<div class="kpi-det-title">Revenue at Risk</div>
            <div style="max-height:300px;overflow-y:auto;scrollbar-width:thin;
                        scrollbar-color:#e2e8f0 transparent">
              ${risky.length ? rows : '<div style="font-size:12px;color:#94a3b8;padding:8px 0">Рисков нет</div>'}
            </div>`;
        })(),
      },
      {
        id: 'potential',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
        label: 'Реализация',
        value: s.avgPotential !== null ? s.avgPotential + '%' : '—',
        hint: 'от потенциала',
        valueColor: potColor,
        detail: (() => {
          const withPot = [...computed].filter(r => r.pctPot !== null && r.pctPot !== undefined)
            .sort((a,b) => b.pctPot - a.pctPot);
          const pClr = v => v >= 85 ? '#10b981' : v >= 65 ? '#f59e0b' : '#ef4444';
          const rows = withPot.map(r => `
            <div data-action="go-detail" data-id="${r.client.id}"
                 style="display:flex;align-items:center;gap:8px;padding:6px 0;
                        border-bottom:1px solid #f5f5f8;cursor:pointer"
                 onmouseover="this.style.background='#f8faff'"
                 onmouseout="this.style.background='transparent'">
              <span style="font-size:11px;font-weight:600;width:80px;flex-shrink:0;
                           overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                           color:#0f172a">${r.client.name}</span>
              <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
                <div style="width:${Math.min(r.pctPot,100)}%;height:100%;
                            background:${pClr(r.pctPot)};border-radius:3px;
                            transition:width .3s"></div>
              </div>
              <span style="font-size:11px;font-weight:700;color:${pClr(r.pctPot)};
                           width:32px;text-align:right;flex-shrink:0">${r.pctPot}%</span>
            </div>`).join('');
          return `<div class="kpi-det-title">Реализация потенциала</div>
            <div style="max-height:300px;overflow-y:auto;scrollbar-width:thin;
                        scrollbar-color:#e2e8f0 transparent">
              ${withPot.length ? rows : '<div style="font-size:12px;color:#94a3b8;padding:8px 0">Нет данных</div>'}
            </div>`;
        })(),
      },
    ];

    const cardsHTML = cards.map(c => `
      <div class="pf-kpi-card" data-card="${c.id}">
        <div class="pf-kpi-card-collapsed">
          <div class="pf-kpi-card-icon">${c.icon||''}</div>
          <div class="pf-kpi-card-label">${c.label}</div>
          <div class="pf-kpi-card-value" style="color:${c.valueColor}">${c.value}</div>
          <div class="pf-kpi-card-hint">${c.hint}</div>
        </div>
        <div class="pf-kpi-card-detail" style="display:none">${c.detail}</div>
      </div>`).join('');

    return `<div class="pf-kpi-grid-new">${cardsHTML}</div>`;
  },

  _horizonFormHTML(key, label, period, dotColor, saved) {
    const v = f => saved ? (saved[f] || '') : '';
    const hasData = !!(v('focus') || v('outcome'));
    const deadlineStr = v('deadline')
      ? new Date(v('deadline')).toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' })
      : null;

    return `
      <div class="pf-hz" id="pf-horizon-${key}">

        <!-- Заголовок — всегда виден -->
        <div class="pf-hz-head" data-toggle="${key}">
          <div class="pf-hz-left">
            <div class="pf-hz-icon-block">
              <span class="pf-hz-symbol">${{ short: '◔', mid: '◑', long: '◕' }[key]}</span>
              <span class="pf-hz-label">${label}</span>
            </div>
            <div class="pf-hz-meta">
              <span class="pf-hz-period">${period}</span>
              ${hasData && v('focus') ? `<div class="pf-hz-subtitle">${v('focus')}</div>` : ''}
            </div>
          </div>
          <div class="pf-hz-right">
            ${deadlineStr ? `<span class="pf-hz-deadline">${deadlineStr}</span>` : ''}
            ${hasData
              ? `<span class="pf-hz-status pf-hz-status--filled">Заполнено</span>`
              : `<span class="pf-hz-status pf-hz-status--empty">Не заполнено</span>`}
            <button class="pf-hz-edit-btn" data-editkey="${key}" title="Редактировать">
              ${ic.edit}
            </button>
            <div class="pf-hz-actions" id="pf-hz-actions-${key}"></div>
            <div class="pf-hz-chevron" id="pf-hz-chevron-${key}">${ic.chevron}</div>
          </div>
        </div>

        <!-- Тело — коллапсируется -->
        <div class="pf-hz-body" id="pf-hz-body-${key}">

          <!-- VIEW режим -->
          <div class="pf-hz-view" id="pf-hz-view-${key}">
            ${hasData ? `
              <div class="pf-hz-view-grid">
                ${v('focus') ? `
                  <div class="pf-hz-view-block">
                    <div class="pf-hz-view-label">Фокус</div>
                    <div class="pf-hz-view-text">${v('focus')}</div>
                  </div>` : ''}
                ${v('outcome') ? `
                  <div class="pf-hz-view-block">
                    <div class="pf-hz-view-label">Результат</div>
                    <div class="pf-hz-view-text">${v('outcome')}</div>
                  </div>` : ''}
                ${v('risk') ? `
                  <div class="pf-hz-view-block pf-hz-view-block--half">
                    <div class="pf-hz-view-label">Главный риск</div>
                    <div class="pf-hz-view-text">${v('risk')}</div>
                  </div>` : ''}
                ${deadlineStr ? `
                  <div class="pf-hz-view-block pf-hz-view-block--half">
                    <div class="pf-hz-view-label">Дедлайн</div>
                    <div class="pf-hz-view-text pf-hz-view-deadline">${deadlineStr}</div>
                  </div>` : ''}
              </div>
            ` : `
              <div class="pf-hz-empty">
                Стратегия не заполнена — нажмите ${ic.edit} чтобы добавить
              </div>
            `}
          </div>

          <!-- EDIT режим (скрыт по умолчанию) -->
          <div class="pf-hz-edit" id="pf-hz-edit-${key}" style="display:none">
            <div class="pf-hz-edit-grid">
              <div class="pf-field pf-hz-full">
                <label>Фокус</label>
                <input id="pf-${key}-focus" value="${v('focus')}"
                       placeholder="На чём сосредоточены в этом периоде..." />
              </div>
              <div class="pf-field pf-hz-full">
                <label>Результат</label>
                <textarea id="pf-${key}-outcome"
                          placeholder="Что конкретно изменится, с цифрами...">${v('outcome')}</textarea>
              </div>
              <div class="pf-field pf-hz-full">
                <label>Главный риск</label>
                <input id="pf-${key}-risk" value="${v('risk')}"
                       placeholder="Что может помешать..." />
              </div>
              <div class="pf-field">
                <label>Статус</label>
                <select id="pf-${key}-status">
                  <option value="on_track" ${v('status') === 'on_track' || !v('status') ? 'selected' : ''}>On Track</option>
                  <option value="at_risk"  ${v('status') === 'at_risk'  ? 'selected' : ''}>At Risk</option>
                  <option value="off_track"${v('status') === 'off_track' ? 'selected' : ''}>Off Track</option>
                </select>
              </div>
              <div class="pf-field">
                <label>Дедлайн</label>
                <input type="date" id="pf-${key}-deadline" value="${v('deadline')}" />
              </div>
            </div>
            <div class="pf-hz-edit-footer">
              <button class="pf-btn pf-btn-ghost pf-hz-cancel-btn" data-cancelkey="${key}">
                Отмена
              </button>
              <button class="pf-btn pf-btn-primary pf-hz-save-btn" id="pf-save-btn-${key}">
                ${ic.save} Сохранить
              </button>
            </div>
          </div>

        </div>
      </div>`;
  },

  _readHorizon(key) {
    const g = id => document.getElementById(id)?.value.trim() ?? '';
    return {
      focus:    g(`pf-${key}-focus`),
      outcome:  g(`pf-${key}-outcome`),
      risk:     g(`pf-${key}-risk`),
      status:   g(`pf-${key}-status`) || 'on_track',
      deadline: g(`pf-${key}-deadline`),
    };
  },

  async _savePortfolioStrats() {
    const btn = document.getElementById('pf-save-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = `${ic.save} Сохраняем...`; }
    try {
      await Promise.all([
        API.upsertPortfolioStrategy('short', this._readHorizon('short')),
        API.upsertPortfolioStrategy('mid',   this._readHorizon('mid')),
        API.upsertPortfolioStrategy('long',  this._readHorizon('long')),
      ]);
      window.App.toast('Стратегия сохранена', 'success');
    } catch {
      window.App.toast('Ошибка сохранения', 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = `${ic.save} Сохранить всё`; }
    }
  },


  /* ── Direction picker ── */

  _setAiMode(enabled, summary, computed) {
  ['short', 'mid', 'long'].forEach(key => {
    const existing = document.getElementById(`pf-ai-gen-btn-${key}`);
    if (enabled && !existing) {
      const actions = document.getElementById(`pf-hz-actions-${key}`);
      if (!actions) return;
      const btn = document.createElement('button');
      btn.id = `pf-ai-gen-btn-${key}`;
      btn.className = 'pf-ai-gen-btn';
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77
                   l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Сгенерировать
      `;
      btn.onclick = () => this._aiHorizon(key, summary, computed);
      actions.appendChild(btn);
    } else if (!enabled && existing) {
      existing.remove();
    }
  });
},

  async _aiHorizon(key, summary, computed) {
    const genBtn = document.getElementById(`pf-ai-gen-btn-${key}`);
    if (genBtn) { genBtn.disabled = true; genBtn.textContent = 'Генерирую...'; }

    document.getElementById('pf-variant-picker')?.remove();
    const el = document.createElement('div');
    el.id = 'pf-variant-picker';
    el.innerHTML = `
      <div class="variant-picker-backdrop"></div>
      <div class="variant-picker-panel">
        <div class="variant-picker-header">
          <span>AI варианты</span>
          <button class="variant-picker-close"
            onclick="document.getElementById('pf-variant-picker').remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="variant-picker-body" id="vp-body">
          <div class="vp-direction-label">Выбери направление</div>
          <div class="vp-dir-grid">
            <button class="vp-dir-btn vp-dir-retention" data-dir="retention">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Удержание
            </button>
            <button class="vp-dir-btn vp-dir-growth" data-dir="growth">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              Рост
            </button>
            <button class="vp-dir-btn vp-dir-optimization" data-dir="optimization">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Оптимизация
            </button>
            <button class="vp-dir-btn vp-dir-custom" data-dir="custom">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Своё
            </button>
          </div>
          <textarea id="vp-custom-text" class="vp-custom-textarea"
                    placeholder="Опиши направление..." style="display:none"></textarea>
          <button class="vp-generate-btn" id="vp-gen-btn" disabled>
            Сгенерировать варианты
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() =>
      el.querySelector('.variant-picker-panel').classList.add('visible')
    );

    const restoreGenBtn = () => {
      if (genBtn) {
        genBtn.disabled = false;
        genBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77
                     l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Сгенерировать`;
      }
    };

    el.querySelector('.variant-picker-backdrop').onclick = () => {
      el.remove();
      restoreGenBtn();
    };

    let selectedDir = null;
    el.querySelectorAll('.vp-dir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.vp-dir-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDir = btn.dataset.dir;
        const customArea = document.getElementById('vp-custom-text');
        if (selectedDir === 'custom') {
          customArea.style.display = 'block';
          customArea.focus();
        } else {
          customArea.style.display = 'none';
        }
        document.getElementById('vp-gen-btn').disabled = false;
      });
    });

    document.getElementById('vp-gen-btn').addEventListener('click', async () => {
      const direction = selectedDir === 'custom'
        ? (document.getElementById('vp-custom-text')?.value.trim() || 'custom')
        : selectedDir;

      const body = document.getElementById('vp-body');
      body.innerHTML = `
        <div class="vp-loading">
          <div class="vp-spinner"></div>
          <div class="vp-loading-text">Генерирую варианты...</div>
        </div>
      `;

      try {
        const clientsSnapshot = (computed || [])
          .filter(r => r.bchs !== null)
          .sort((a, b) => (b.revenueAtRisk || 0) - (a.revenueAtRisk || 0))
          .slice(0, 10)
          .map(r => ({
            name:  r.client.name,
            bcg:   r.client.bcg_category,
            bchs:  r.bchs,
            trend: r.trend?.label ?? '—',
            mr:    r.client.monthly_revenue || 0,
            risk:  r.revenueAtRisk || 0,
          }));

        const data = await API.callAI({
          type: 'horizon', horizon: key, direction, max_tokens: 1800,
          summary: {
            total:        summary.total,
            avgLoyalty:   summary.avgLoyalty,
            totalRisk:    summary.totalRisk,
            bcgCount:     summary.bcgCount,
            top3Risk:     summary.top3Risk.map(r =>
              `${r.name} ($${r.risk.toLocaleString('ru-RU')}, ${r.pct}%)`
            ).join('; ') || 'нет',
            avgPotential: summary.avgPotential,
          },
          clients_snapshot:    clientsSnapshot,
          existing_strategies: this._portfolioData,
        });

        const content  = data?.choices?.[0]?.message?.content ?? '';
        if (!content) throw new Error('Пустой ответ от AI');
        const match    = content.match(/\{[\s\S]*\}/);
        const parsed   = JSON.parse(match ? match[0] : content);
        const variants = parsed.variants ?? [];
        if (!variants.length) throw new Error('AI не вернул варианты');

        const items = variants.map((v, i) => `
          <label class="variant-toggle-row" for="vt-${i}">
            <div class="variant-toggle-content">
              <div class="variant-toggle-title">${v.label || v.name || 'Вариант ' + (i+1)}</div>
              <div class="variant-toggle-text">${v.focus || v.outcome || v.text || ''}</div>
            </div>
            <div class="toggle-switch">
              <input type="radio" name="variant-pick" id="vt-${i}"
                     value="${i}" ${i===0?'checked':''}>
              <span class="toggle-track"></span>
            </div>
          </label>
        `).join('');

        body.innerHTML = `
          <div class="variant-picker-list">${items}</div>
          <div class="variant-picker-footer">
            <button class="variant-apply-btn" id="variant-apply-btn">Применить</button>
          </div>
        `;

        document.getElementById('variant-apply-btn').onclick = () => {
          const checked = el.querySelector('input[name="variant-pick"]:checked');
          if (checked) {
            const chosen    = variants[+checked.value];
            const titleEl   = document.getElementById(`pf-${key}-focus`);
            const goalEl    = document.getElementById(`pf-${key}-outcome`);
            const riskEl    = document.getElementById(`pf-${key}-risk`);
            const deadlineEl = document.getElementById(`pf-${key}-deadline`);
            if (titleEl)    titleEl.value    = chosen.focus    || chosen.name || '';
            if (goalEl)     goalEl.value     = chosen.outcome  || '';
            if (riskEl)     riskEl.value     = chosen.risk     || '';
            if (deadlineEl && chosen.deadline) deadlineEl.value = chosen.deadline;
            const bar = document.getElementById('pf-manual-save-bar');
            if (bar) bar.style.display = 'flex';
          }
          el.remove();
          restoreGenBtn();
        };

      } catch(e) {
        body.innerHTML = `
          <div class="vp-error">
            <div class="vp-error-text">${e.message}</div>
            <button class="vp-retry-btn"
              onclick="document.getElementById('pf-variant-picker').remove()">
              Закрыть
            </button>
          </div>
        `;
        restoreGenBtn();
      }
    });

    restoreGenBtn();
  },

  async _renderAccountsTab() {

    const el = document.getElementById('pf-tab-accounts');
    el.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);
                                font-size:13px">Загрузка аккаунтов...</div>`;
    try {
      const [clients, allBCHS, allPC, accountStrats] = await Promise.all([
        API.getClients(),
        API.getAllBCHS(),
        API.getAllPC(),
        API.getAccountStrategies(),
      ]);
      this._accountStrategies = accountStrats;

      const computed = clients.map(c => ({
        client: c,
        ...Calc.computeClient(c, allBCHS, allPC),
      }));

      const MCEngine  = window.MCEngine ?? null;
      const mcResults = {};

      if (MCEngine) {
        let mcConfigs = [];
        try {
          const r = await API._get?.('tables/mc_configs?limit=500');
          mcConfigs = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
        } catch { /* skip */ }

        for (const row of computed) {
          const cid = String(row.client.id);
          if (this._mcCache[cid]) { mcResults[cid] = this._mcCache[cid]; continue; }
          const cfg = mcConfigs.find(x => String(x.client_id) === cid);
          try {
            const mcCfg = Object.assign(
              {}, MCEngine.DEFAULTS,
              { monthly_revenue: row.client.monthly_revenue || 5000 },
              cfg || {}
            );
            const res = MCEngine.run(row.bchs, mcCfg);
            this._mcCache[cid] = res;
            mcResults[cid]     = res;
          } catch { mcResults[cid] = null; }
        }
      }

      const statusDot = (bchs) => {
        const color = bchs === null ? '#9ca3af'
          : bchs >= 20 ? '#10b981'
          : bchs >= -10 ? '#f59e0b' : '#ef4444';
        return `<span style="display:inline-flex;align-items:center;gap:5px">
          <span style="width:6px;height:6px;border-radius:50%;
                       background:${color};flex-shrink:0"></span>
          <span style="font-weight:600;color:${color}">
            ${bchs !== null ? bchs : '—'}
          </span>
        </span>`;
      };

      const rows = computed.map(row => {
        const c  = row.client;
        const mc = mcResults[String(c.id)] ?? null;

        const mc3m     = mc ? mc.horizons['3m'].bchs.median.toFixed(1) : '—';
        const churn    = mc ? mc.horizons['3m'].churn_rate : null;
        const churnColor = churn === null ? '#6b7280'
          : churn < 7 ? '#10b981' : churn < 15 ? '#f59e0b' : '#ef4444';

        const strat     = accountStrats.find(
          s => String(s.client_id) === String(c.id) && s.status !== 'Done'
        );
        const stratText = strat
          ? (strat.outcome || '').slice(0, 55) + ((strat.outcome || '').length > 55 ? '…' : '')
          : null;

        const statusColor = { Active:'#10b981', Paused:'#f59e0b', Done:'#9ca3af' }[strat?.status] ?? '#9ca3af';

        return `<tr>
          <td style="font-weight:600">${c.name}</td>
          <td>${bcgTag(c.bcg_category)}</td>
          <td style="font-size:11px;color:var(--text-muted)">${c.key_account_priority || '—'}</td>
          <td>${statusDot(row.bchs)}</td>
          <td style="font-weight:600;color:var(--text-primary)">${mc3m}</td>
          <td style="font-weight:600;color:${churnColor}">
            ${churn !== null ? churn.toFixed(1) + '%' : '—'}
          </td>
          <td style="max-width:200px">
            ${stratText
              ? `<span style="font-size:12px;color:var(--text-secondary)">${stratText}</span>`
              : `<span style="font-size:12px;color:var(--text-muted)">Не задана</span>`}
            ${strat?.status
              ? `<span style="margin-left:6px;font-size:10px;font-weight:600;
                              color:${statusColor}">${strat.status}</span>`
              : ''}
          </td>
          <td>
            <button class="pf-btn pf-btn-secondary" style="padding:5px 10px;font-size:11px"
                    data-action="open-strat" data-cid="${c.id}">
              ${ic.edit} Открыть
            </button>
          </td>
        </tr>`;
      }).join('');

      el.innerHTML = `
        <div class="pf-section-head">
          <div class="pf-section-title">Аккаунт-стратегии</div>
        </div>
        <div class="pf-table-wrap">
          <table class="pf-table">
            <thead><tr>
              <th>Клиент</th>
              <th>BCG</th>
              <th>Приоритет</th>
              <th>bCHS</th>
              <th>MC 3М</th>
              <th>Риск оттока</th>
              <th>Стратегия</th>
              <th></th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;

      el.querySelectorAll('[data-action="open-strat"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cid  = btn.dataset.cid;
          const row  = computed.find(r => String(r.client.id) === cid);
          const mc   = mcResults[cid] ?? null;
          const strat = accountStrats.find(
            s => String(s.client_id) === cid && s.status !== 'Done'
          ) ?? null;
          this._openAccountStratModal(row, mc, strat);
        });
      });

    } catch (e) {
      console.error('[PortfolioPage._renderAccountsTab]', e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:#ef4444;font-size:13px">
        Ошибка: ${e.message}</div>`;
    }
  },

  /* ── Account strategy modal ── */
  _openAccountStratModal(row, mc, strat) {
    const c = row.client;

    const mc3m   = mc ? mc.horizons['3m'].bchs.median.toFixed(1)  : '—';
    const mc12m  = mc ? mc.horizons['12m'].bchs.median.toFixed(1) : '—';
    const churn3 = mc ? mc.horizons['3m'].churn_rate.toFixed(1) + '%' : '—';
    const churnColor = mc
      ? (mc.horizons['3m'].churn_rate < 7 ? '#10b981'
       : mc.horizons['3m'].churn_rate < 15 ? '#f59e0b' : '#ef4444')
      : '#6b7280';
    const bchsColor = row.bchs !== null
      ? (row.bchs >= 20 ? '#10b981' : row.bchs >= -10 ? '#f59e0b' : '#ef4444')
      : '#6b7280';

    const v = f => strat ? (strat[f] || '') : '';
    const statuses = ['Active', 'Done', 'Paused'].map(s =>
      `<option value="${s}" ${(v('status') || 'Active') === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    window.App.openModal(`
      <div style="padding:24px;max-width:540px;width:100%;box-sizing:border-box">

        <div style="margin-bottom:16px">
          <div style="font-size:16px;font-weight:700;color:var(--text-primary);
                      margin-bottom:3px">${c.name}</div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            ${bcgTag(c.bcg_category)}
            <span style="font-size:12px;color:var(--text-muted)">
              ${c.key_account_priority || '—'}
            </span>
            <span style="font-size:12px;color:var(--text-muted)">

              $${Number(c.monthly_revenue || 0).toLocaleString('ru-RU')}/мес
            </span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);
                    gap:1px;background:var(--border);
                    border:1px solid var(--border);border-radius:10px;
                    overflow:hidden;margin-bottom:18px">
          ${[
            ['bCHS', row.bchs !== null ? row.bchs : '—', bchsColor],
            ['MC 3М', mc3m, 'var(--text-primary)'],
            ['Отток 3М', churn3, churnColor],
            ['Тренд', row.trend?.label ?? '—', 'var(--text-primary)'],
          ].map(([l, v, c]) => `
            <div style="background:var(--surface);padding:12px 14px">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                          letter-spacing:.06em;color:var(--text-muted);
                          margin-bottom:4px">${l}</div>
              <div style="font-size:18px;font-weight:700;color:${c}">${v}</div>
            </div>`).join('')}
        </div>

        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="pf-field">
            <label>Цель</label>
            <textarea id="as-goal" style="min-height:72px"
                      placeholder="Что хотим достичь...">${v('goal')}</textarea>
          </div>
          <div class="pf-field">
            <label>Действия</label>
            <textarea id="as-actions" style="min-height:72px"
                      placeholder="Конкретные шаги...">${v('actions')}</textarea>
          </div>
          <div class="pf-field">
            <label>Метрика успеха</label>
            <textarea id="as-metric" style="min-height:60px"
                      placeholder="Как измерим результат">${v('success_metric')}</textarea>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="pf-field">
              <label>Дедлайн</label>
              <input type="date" id="as-deadline" value="${v('deadline')}" />
            </div>
            <div class="pf-field">
              <label>Статус</label>
              <select id="as-status"
                      style="width:100%;height:38px;padding:0 10px;
                             border:1.5px solid var(--border);border-radius:8px;
                             font-size:13px;font-family:inherit;background:#fafafa">
                ${statuses}
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:18px;flex-wrap:wrap">
          <button class="pf-btn pf-btn-ghost" id="as-ai-btn">
            ${ic.ai} AI предложить
          </button>
          <div style="flex:1"></div>
          <button class="pf-btn pf-btn-secondary" id="as-close-btn">
            ${ic.close} Закрыть
          </button>
          <button class="pf-btn pf-btn-primary" id="as-save-btn">
            ${ic.save} Сохранить
          </button>
        </div>
      </div>`);

    document.getElementById('as-close-btn')
      ?.addEventListener('click', () => window.App.closeModal());

    document.getElementById('as-save-btn')?.addEventListener('click', async () => {
      const g = id => document.getElementById(id)?.value.trim() ?? '';
      const snapshot = mc ? JSON.stringify({
        bchs_current:  row.bchs,
        mc_3m_median:  mc.horizons['3m'].bchs.median,
        mc_3m_churn:   mc.horizons['3m'].churn_rate,
        mc_12m_median: mc.horizons['12m'].bchs.median,
        mc_12m_churn:  mc.horizons['12m'].churn_rate,
        saved_at:      new Date().toISOString(),
      }) : null;

      const saveBtn = document.getElementById('as-save-btn');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = `${ic.save} Сохраняем...`; }
      try {
        await API.saveAccountStrategy(c.id, {
          goal:           g('as-goal'),
          actions:        g('as-actions'),
          success_metric: g('as-metric'),
          deadline:       g('as-deadline'),
          status:         g('as-status'),
          mc_snapshot:    snapshot,
          ai_generated:   false,
        });
        window.App.toast('Стратегия сохранена', 'success');
        window.App.closeModal();
        this._renderAccountsTab();
      } catch {
        window.App.toast('Ошибка сохранения', 'error');
      } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = `${ic.save} Сохранить`; }
      }
    });

    document.getElementById('as-ai-btn')?.addEventListener('click', async () => {
      const aiBtn = document.getElementById('as-ai-btn');
      if (aiBtn) { aiBtn.disabled = true; aiBtn.innerHTML = `${ic.ai} Генерирую...`; }
      try {
        const data = await API.callAI({
          type:   'account',
          client: {
            name:            c.name,
            bcg:             c.bcg_category,
            priority:        c.key_account_priority || '—',
            monthly_revenue: c.monthly_revenue || 0,
            engagement:      c.client_engagement || '—',
            phase:           c.phase || '—',
            revenue_at_risk: row.revenueAtRisk || 0,
          },
          metrics: {
            bchs_current:  row.bchs,
            trend:         row.trend?.label ?? '—',
            mc_3m_median:  mc3m,
            mc_3m_churn:   churn3,
            mc_12m_median: mc12m,
            mc_12m_churn:  mc ? mc.horizons['12m'].churn_rate.toFixed(1) + '%' : '—',
          },
        });

        const content = data?.choices?.[0]?.message?.content ?? '';
        if (!content) throw new Error('Пустой ответ от AI');
        const match    = content.match(/\{[\s\S]*\}/);
        const parsed   = JSON.parse(match ? match[0] : content);
        const variants = parsed.variants ?? [];

        if (variants.length) {
          this._showAccountVariantPicker(variants, row);
        } else {
          const s = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
          s('as-goal',    parsed.goal);
          s('as-actions', parsed.actions);
          s('as-metric',  parsed.success_metric);
          s('as-deadline',parsed.deadline);
          window.App.toast('AI предложение заполнено', 'success');
        }
      } catch (e) {
        window.App.toast('Ошибка AI: ' + e.message, 'error');
      } finally {
        if (aiBtn) { aiBtn.disabled = false; aiBtn.innerHTML = `${ic.ai} AI предложить`; }
      }
    });
  },

  _showAccountVariantPicker(variants, row) {
    window.App.openModal(`
      <div style="padding:24px;max-width:500px;width:100%;box-sizing:border-box">
        <div class="pf-modal-head">3 варианта стратегии</div>
        <div class="pf-modal-sub">${row.client.name} · Выбери — заполнится в форму</div>
        ${variants.map((v, i) => `
          <div class="pf-variant-card" data-idx="${i}">
            <div class="pf-variant-label">${v.label ?? `Вариант ${i + 1}`}</div>
            <div class="pf-variant-goal">${v.goal ?? '—'}</div>
            <div class="pf-variant-meta">
              <span>${v.deadline ?? '—'}</span>
              <span>${v.success_metric ?? '—'}</span>
            </div>
          </div>`).join('')}
        <button class="pf-btn pf-btn-secondary" id="variant-cancel"
                style="margin-top:4px">${ic.close} Отмена</button>
      </div>`);

    document.querySelectorAll('.pf-variant-card').forEach(card => {
      card.addEventListener('click', () => {
        const v = variants[parseInt(card.dataset.idx)];
        const s = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        s('as-goal',     v.goal     ?? '');
        s('as-actions',  v.actions  ?? '');
        s('as-metric',   v.success_metric ?? '');
        s('as-deadline', v.deadline ?? '');
        window.App.closeModal();
        window.App.toast('Вариант применён', 'success');
      });
    });

    document.getElementById('variant-cancel')
      ?.addEventListener('click', () => window.App.closeModal());
  },

  /* ══════════════════════════════════════════
     ТАБ 3 — ПОКРЫТИЕ
  ══════════════════════════════════════════ */
  async _renderCoverageTab() {
    const el = document.getElementById('pf-tab-coverage');
    if (!el) return;
    el.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted);
                                font-size:13px">Загрузка...</div>`;
    try {
      const [clients, allPC] = await Promise.all([
        API.getClients(),
        API.getAllPC(),
      ]);
      this._allClientsForCoverage = clients;
      this._allPCForCoverage      = allPC;
      this._renderCoverageContent(clients, allPC);
    } catch (e) {
      el.innerHTML = `<div style="padding:32px;text-align:center;color:#ef4444;
                                  font-size:13px">Ошибка: ${e.message}</div>`;
    }
  },

  _renderCoverageContent(clients, allPC) {
    const el = document.getElementById('pf-tab-coverage');
    if (!el) return;
    allPC = allPC ?? this._allPCForCoverage ?? [];

    const f = this._coverageFilters;
    const regions = [...new Set(clients.map(c => c.dach_region).filter(Boolean))].sort();
    const ams     = [...new Set(clients.map(c => c.account_manager).filter(Boolean))].sort();

    const withCov = clients.map(c => {
      const pcEntries = allPC
        .filter(e => String(e.client_id) === String(c.id))
        .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
      const pc = pcEntries.at(-1) ?? null;

      const csm   = Number(pc?.role_csm)            || 0;
      const am    = Number(pc?.role_account_manager) || 0;
      const coord = Number(pc?.role_coordinator)     || 0;
      const sales = Number(pc?.role_sales)           || 0;
      const deliv = Number(pc?.role_delivery)        || 0;

      const hasCSM = csm > 0, hasAM = am > 0, hasCoord = coord > 0;
      const hasSales = sales > 0, hasDeliv = deliv > 0;
      const hasOther = hasAM || hasCoord || hasSales || hasDeliv;
      const hasAny   = hasCSM || hasOther;

      const covStatus =
        hasCSM && hasAM && hasCoord ? 'full'
        : hasCSM && hasOther        ? 'overlap'
        : hasAny                    ? 'partial'
        : 'none';

      return { ...c, csm, am, coord, sales, deliv,
               hasCSM, hasAM, hasCoord, hasSales, hasDeliv, covStatus };
    });

    const total   = withCov.length;
    const fullCov = withCov.filter(c => c.covStatus === 'full').length;
    const noCov   = withCov.filter(c => c.covStatus === 'none').length;
    const overlap = withCov.filter(c => c.covStatus === 'overlap').length;

    let filtered = withCov;
    if (f.region) filtered = filtered.filter(c => c.dach_region === f.region);
    if (f.am)     filtered = filtered.filter(c => c.account_manager === f.am);
    if (f.status) filtered = filtered.filter(c => c.covStatus === f.status);
    if (f.search) filtered = filtered.filter(c =>
      (c.name || '').toLowerCase().includes(f.search.toLowerCase())
    );

    /* Статусные пилюли без эмодзи */
    const covPill = status => {
      const cfg = {
        full:    { color:'#10b981', bg:'#f0fdf4', label:'Покрыт'       },
        overlap: { color:'#6366f1', bg:'#eef2ff', label:'Пересечение'  },
        partial: { color:'#f59e0b', bg:'#fffbeb', label:'Частично'     },
        none:    { color:'#ef4444', bg:'#fef2f2', label:'Не покрыт'    },
      }[status] ?? { color:'#9ca3af', bg:'#f9fafb', label:'—' };
      return `<span style="font-size:10px;font-weight:600;
        color:${cfg.color};background:${cfg.bg};
        border-radius:5px;padding:2px 8px;white-space:nowrap">${cfg.label}</span>`;
    };

    const rolePip = (active, label) =>
      `<span title="${label}" style="
        display:inline-flex;align-items:center;justify-content:center;
        width:30px;height:18px;border-radius:4px;
        font-size:9px;font-weight:700;letter-spacing:.02em;
        background:${active ? '#eef2ff' : '#f9fafb'};
        color:${active ? '#6366f1' : '#d1d5db'};
        border:1px solid ${active ? '#c7d2fe' : '#e5e7eb'}">
        ${label}
      </span>`;

    const tableRows = filtered.map(c => {
      const mr = c.monthly_revenue
        ? `$${Number(c.monthly_revenue).toLocaleString('ru-RU')}` : '—';
      return `<tr>
        <td style="font-weight:600">${c.name || '—'}</td>
        <td style="font-size:12px;color:var(--text-muted)">${c.dach_region || '—'}</td>
        <td style="font-size:12px">${c.account_manager ||
          '<span style="color:var(--text-muted)">—</span>'}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="cov-coord-name" data-cid="${c.id}"
                  style="font-size:12px;color:${c.coordinator
                    ? 'var(--text-primary)' : 'var(--text-muted)'}">
              ${c.coordinator || '—'}
            </span>
            <button class="pf-btn pf-btn-ghost cov-assign-btn" data-cid="${c.id}"
                    style="padding:2px 6px;font-size:11px">${ic.edit}</button>
          </div>
        </td>
        <td style="font-size:12px;font-weight:600">${mr}</td>
        <td style="white-space:nowrap">
          <div style="display:flex;gap:3px">
            ${rolePip(c.hasCSM,   'CSM')}
            ${rolePip(c.hasAM,    'AM')}
            ${rolePip(c.hasCoord, 'DC')}
            ${rolePip(c.hasSales, 'SLS')}
            ${rolePip(c.hasDeliv, 'DLV')}
          </div>
        </td>
        <td>${covPill(c.covStatus)}</td>
      </tr>`;
    }).join('');

    el.innerHTML = `
      <div class="pf-cov-stats">
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val">${total}</div>
          <div class="pf-cov-stat-lbl">Всего клиентов</div>
        </div>
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val" style="color:#10b981">${fullCov}</div>
          <div class="pf-cov-stat-lbl">Полностью покрыто
            <span style="color:#10b981;font-weight:600;margin-left:4px">
              ${total ? Math.round(fullCov / total * 100) : 0}%
            </span>
          </div>
        </div>
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val" style="color:#ef4444">${noCov}</div>
          <div class="pf-cov-stat-lbl">Без покрытия
            <span style="color:#ef4444;font-weight:600;margin-left:4px">
              ${total ? Math.round(noCov / total * 100) : 0}%
            </span>
          </div>
        </div>
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val" style="color:#6366f1">${overlap}</div>
          <div class="pf-cov-stat-lbl">Пересечение ролей</div>
        </div>
      </div>

      <div class="pf-filters">
        <select class="pf-filter-select" id="cov-f-region">
          <option value="">Все регионы</option>
          ${regions.map(r => `<option value="${r}" ${f.region===r?'selected':''}>${r}</option>`).join('')}
        </select>
        <select class="pf-filter-select" id="cov-f-am">
          <option value="">Все AM</option>
          ${ams.map(a => `<option value="${a}" ${f.am===a?'selected':''}>${a}</option>`).join('')}
        </select>
        <select class="pf-filter-select" id="cov-f-status">
          <option value="">Все статусы</option>
          <option value="full"    ${f.status==='full'?'selected':''}>Покрыт</option>
          <option value="overlap" ${f.status==='overlap'?'selected':''}>Пересечение</option>
          <option value="partial" ${f.status==='partial'?'selected':''}>Частично</option>
          <option value="none"    ${f.status==='none'?'selected':''}>Не покрыт</option>
        </select>
        <input class="pf-filter-input" id="cov-f-search"
               placeholder="Поиск клиента..." value="${f.search}"
               style="flex:1;min-width:160px" />
        <button class="pf-btn pf-btn-secondary" id="cov-reset-btn">
          ${ic.reset} Сбросить
        </button>
        <button class="pf-btn pf-btn-secondary" id="cov-export-btn">
          ${ic.export} CSV
        </button>
      </div>

      <div class="pf-table-wrap" style="position:relative">
        <table class="pf-table">
          <thead><tr>
            <th>Клиент</th>
            <th>Регион</th>
            <th>AM</th>
            <th>Координатор</th>
            <th>Revenue</th>
            <th>Роли</th>
            <th>Покрытие</th>
          </tr></thead>
          <tbody>
            ${tableRows || `<tr><td colspan="7"
              style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px">
              Нет клиентов по фильтру</td></tr>`}
          </tbody>
        </table>
        <div style="padding:10px 14px;font-size:11px;color:var(--text-muted);
                    border-top:1px solid var(--border)">
          Показано: ${filtered.length} из ${total}
        </div>

        <div class="cov-inline-dropdown hidden" id="cov-inline-dropdown"
             style="position:absolute;z-index:100;background:var(--surface);
                    border:1px solid var(--border);border-radius:10px;
                    padding:14px;width:260px;box-shadow:0 8px 24px rgba(0,0,0,.1)">
          <div style="display:flex;align-items:center;justify-content:space-between;
                      margin-bottom:10px">
            <span style="font-size:12px;font-weight:700">Назначить координатора</span>
            <button class="pf-btn pf-btn-ghost" id="cov-dd-close"
                    style="padding:2px">${ic.close}</button>
          </div>
          <input class="pf-filter-input" id="cov-dd-input"
                 placeholder="Имя..." style="width:100%;box-sizing:border-box;
                 margin-bottom:8px" />
          <div id="cov-dd-suggestions"
               style="max-height:120px;overflow-y:auto;margin-bottom:8px"></div>
          <div style="display:flex;gap:6px">
            <button class="pf-btn pf-btn-primary" id="cov-dd-save"
                    style="flex:1;font-size:11px">Сохранить</button>
            <button class="pf-btn pf-btn-secondary" id="cov-dd-clear"
                    style="font-size:11px">Снять</button>
          </div>
        </div>
      </div>`;

    this._bindCoverageEvents(withCov);
  },

  _bindCoverageEvents(withCov) {
    const applyFilter = () => {
      this._coverageFilters.region = document.getElementById('cov-f-region')?.value || '';
      this._coverageFilters.am     = document.getElementById('cov-f-am')?.value     || '';
      this._coverageFilters.status = document.getElementById('cov-f-status')?.value || '';
      this._coverageFilters.search = document.getElementById('cov-f-search')?.value || '';
      this._renderCoverageContent(this._allClientsForCoverage);
    };

    ['cov-f-region','cov-f-am','cov-f-status'].forEach(id =>
      document.getElementById(id)?.addEventListener('change', applyFilter)
    );
    document.getElementById('cov-f-search')?.addEventListener('input', applyFilter);
    document.getElementById('cov-reset-btn')?.addEventListener('click', () => {
      this._coverageFilters = { region:'', am:'', status:'', search:'' };
      this._renderCoverageContent(this._allClientsForCoverage);
    });
    document.getElementById('cov-export-btn')?.addEventListener('click', () => {
      this._exportCoverageCSV(withCov);
    });

    let _ddTargetCid = null;
    const dd  = document.getElementById('cov-inline-dropdown');
    const inp = document.getElementById('cov-dd-input');
    const sug = document.getElementById('cov-dd-suggestions');

    const allCoords = [...new Set(
      (this._allClientsForCoverage || []).map(c => c.coordinator).filter(Boolean)
    )].sort();

    document.querySelectorAll('.cov-assign-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        _ddTargetCid = btn.dataset.cid;
        const c = this._allClientsForCoverage.find(x => String(x.id) === String(_ddTargetCid));
        if (inp) inp.value = c?.coordinator || '';

        const rect = btn.getBoundingClientRect();
        const mcEl = document.getElementById('main-content');
        const mcR  = mcEl.getBoundingClientRect();
        dd.style.top  = (rect.bottom - mcR.top + mcEl.scrollTop + 6) + 'px';
        dd.style.left = Math.min(rect.left - mcR.left, mcR.width - 280) + 'px';
        dd.classList.remove('hidden');
        inp?.focus();
        this._updateSuggestions(inp?.value || '', allCoords, sug, inp);
      });
    });

    inp?.addEventListener('input', () =>
      this._updateSuggestions(inp.value, allCoords, sug, inp)
    );
    document.getElementById('cov-dd-close')?.addEventListener('click', () =>
      dd?.classList.add('hidden')
    );
    document.getElementById('cov-dd-save')?.addEventListener('click', async () => {
      if (!_ddTargetCid || !inp) return;
      await this._saveCoordinator(_ddTargetCid, inp.value.trim());
      dd?.classList.add('hidden');
    });
    document.getElementById('cov-dd-clear')?.addEventListener('click', async () => {
      if (!_ddTargetCid) return;
      await this._saveCoordinator(_ddTargetCid, '');
      dd?.classList.add('hidden');
    });
    document.addEventListener('click', e => {
      if (dd && !dd.contains(e.target) && !e.target.closest('.cov-assign-btn'))
        dd.classList.add('hidden');
    }, { once: true });
  },

  _updateSuggestions(query, all, container, input) {
    if (!container) return;
    const q       = query.toLowerCase().trim();
    const matches = q ? all.filter(s => s.toLowerCase().includes(q)) : all.slice(0, 8);
    if (!matches.length) { container.innerHTML = ''; return; }
    container.innerHTML = matches.map(s => `
      <div style="padding:6px 8px;border-radius:6px;cursor:pointer;
                  font-size:12px;transition:background .1s"
           onmouseover="this.style.background='#f1f5f9'"
           onmouseout="this.style.background='transparent'"
           data-val="${s}">${s}</div>`).join('');
    container.querySelectorAll('[data-val]').forEach(item => {
      item.addEventListener('click', () => {
        if (input) input.value = item.dataset.val;
        container.innerHTML = '';
      });
    });
  },

  async _saveCoordinator(clientId, name) {
    try {
      const c = this._allClientsForCoverage.find(x => String(x.id) === String(clientId));
      if (!c) return;
      await API._put(`tables/clients/${clientId}`, { coordinator: name });
      if (API._clientsCache !== undefined) API._clientsCache = null;
      c.coordinator = name;
      window.App.toast(name ? `Координатор «${name}» назначен` : 'Координатор снят', 'success');
      const cell = document.querySelector(`.cov-coord-name[data-cid="${clientId}"]`);
      if (cell) {
        cell.textContent = name || '—';
        cell.style.color = name ? 'var(--text-primary)' : 'var(--text-muted)';
      }
      this._renderCoverageContent(this._allClientsForCoverage);
    } catch (e) {
      window.App.toast('Ошибка: ' + e.message, 'error');
    }
  },

  _exportCoverageCSV(rows) {
    const f = this._coverageFilters;
    let filtered = rows;
    if (f.region) filtered = filtered.filter(c => c.dach_region === f.region);
    if (f.am)     filtered = filtered.filter(c => c.account_manager === f.am);
    if (f.status) filtered = filtered.filter(c => c.covStatus === f.status);
    if (f.search) filtered = filtered.filter(c =>
      (c.name || '').toLowerCase().includes(f.search.toLowerCase())
    );
    const covLabel = { full:'Покрыт', partial:'Частично', overlap:'Пересечение', none:'Не покрыт' };
    const lines = [
      ['Клиент','Регион','AM','Координатор','Revenue','Покрытие'].join(';'),
      ...filtered.map(c => [
        `"${(c.name || '').replace(/"/g,'""')}"`,
        c.dach_region || '',
        `"${(c.account_manager || '').replace(/"/g,'""')}"`,
        `"${(c.coordinator || '').replace(/"/g,'""')}"`,
        c.monthly_revenue || 0,
        covLabel[c.covStatus] || '',
      ].join(';')),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type:'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url, download: `coverage_${new Date().toISOString().slice(0,10)}.csv`,
    });
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    window.App.toast('CSV экспортирован', 'success');
  },
};
