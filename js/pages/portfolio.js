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
        ${this._summaryHTML(summary)}

        <div class="pf-section-head" style="margin-top:28px">
          <div class="pf-section-title">Стратегические горизонты</div>
          <button class="pf-btn pf-btn-primary" id="pf-save-btn">
            ${ic.save} Сохранить всё
          </button>
        </div>

        ${this._horizonFormHTML('short', 'Краткосрочная', '1 месяц',      '#ef4444', this._portfolioData.short)}
        ${this._horizonFormHTML('mid',   'Среднесрочная', '1–2 квартала', '#f59e0b', this._portfolioData.mid)}
        ${this._horizonFormHTML('long',  'Долгосрочная',  '4 квартала',   '#10b981', this._portfolioData.long)}
      `;

      document.getElementById('pf-save-btn')
        ?.addEventListener('click', () => this._savePortfolioStrats());

      ['short', 'mid', 'long'].forEach(key => {
        document.getElementById(`pf-ai-btn-${key}`)
          ?.addEventListener('click', () => this._aiHorizon(key, summary, computed));
      });

    } catch (e) {
      console.error('[PortfolioPage._renderPortfolioTab]', e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:#ef4444;font-size:13px">
        Ошибка: ${e.message}</div>`;
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

  _summaryHTML(s) {
    const loyaltyColor = s.avgLoyalty === null ? 'var(--text-primary)'
      : s.avgLoyalty >= 70 ? '#10b981'
      : s.avgLoyalty >= 50 ? '#f59e0b' : '#ef4444';
    const riskColor = s.totalRisk === 0 ? '#10b981'
      : s.totalRisk > 50000 ? '#ef4444' : '#f59e0b';
    const potColor = s.avgPotential === null ? 'var(--text-primary)'
      : s.avgPotential >= 85 ? '#10b981'
      : s.avgPotential >= 65 ? '#f59e0b' : '#ef4444';

    const bcgRows = Object.entries(s.bcgCount).map(([key, count]) => {
      const c = BCG_CFG[key];
      return `<div style="display:flex;align-items:center;justify-content:space-between;
                          margin-bottom:3px">
        <span style="font-size:11px;color:${c.color};font-weight:600">${c.label}</span>
        <span style="font-size:12px;font-weight:700;color:var(--text-primary)">${count}</span>
      </div>`;
    }).join('');

    const top3rows = s.top3Risk.length
      ? s.top3Risk.map(r => `
          <div style="display:flex;justify-content:space-between;
                      align-items:center;margin-bottom:4px">
            <span style="font-size:12px;color:var(--text-primary);
                         font-weight:500">${r.name}</span>
            <span style="font-size:11px;color:#ef4444;font-weight:600">

              $${r.risk.toLocaleString('ru-RU')} · ${r.pct}%
            </span>
          </div>`).join('')
      : `<div style="font-size:12px;color:var(--text-muted)">Нет рисков</div>`;

    return `
      <div>
        <div class="pf-section-title" style="margin-bottom:14px">
          Аналитическая сводка
        </div>
        <div class="pf-kpi-grid">
          <div class="pf-kpi-cell">
            <div class="pf-kpi-label">Клиентов</div>
            <div class="pf-kpi-val">${s.total}</div>
          </div>
          <div class="pf-kpi-cell">
            <div class="pf-kpi-label">Лояльность</div>
            <div class="pf-kpi-val" style="color:${loyaltyColor}">
              ${s.avgLoyalty !== null ? s.avgLoyalty + '%' : '—'}
            </div>
            <div class="pf-kpi-sub">средняя по портфелю</div>
          </div>
          <div class="pf-kpi-cell">
            <div class="pf-kpi-label">Revenue at Risk</div>
            <div class="pf-kpi-val" style="color:${riskColor}">

              $${s.totalRisk.toLocaleString('ru-RU')}
            </div>
            <div class="pf-kpi-sub">суммарно</div>
          </div>
          <div class="pf-kpi-cell">
            <div class="pf-kpi-label">Реализация</div>
            <div class="pf-kpi-val" style="color:${potColor}">
              ${s.avgPotential !== null ? s.avgPotential + '%' : '—'}
            </div>
            <div class="pf-kpi-sub">от потенциала</div>
          </div>
          <div class="pf-kpi-cell">
            <div class="pf-kpi-label">BCG распределение</div>
            <div style="margin-top:6px">${bcgRows}</div>
          </div>
          <div class="pf-kpi-cell">
            <div class="pf-kpi-label">Топ-3 риска</div>
            <div style="margin-top:6px">${top3rows}</div>
          </div>
        </div>
      </div>`;
  },

  _horizonFormHTML(key, label, period, dotColor, saved) {
    const v = f => saved ? (saved[f] || '') : '';
    return `
      <div class="pf-horizon">
        <div class="pf-horizon-head">
          <div class="pf-horizon-title">
            <div class="pf-horizon-dot" style="background:${dotColor}"></div>
            ${label}
            <span class="pf-horizon-period">${period}</span>
          </div>
          <button id="pf-ai-btn-${key}" class="pf-btn pf-btn-ghost">
            ${ic.ai} AI варианты
          </button>
        </div>
        <div class="pf-horizon-body">
          <div class="pf-field pf-full">
            <label>Название</label>
            <input id="pf-${key}-title" value="${v('title')}"
                   placeholder="Например: Операционная чистота" />
          </div>
          <div class="pf-field pf-full">
            <label>Цель</label>
            <textarea id="pf-${key}-goal"
                      placeholder="Что хотим достичь...">${v('goal')}</textarea>
          </div>
          <div class="pf-field pf-full">
            <label>Действия</label>
            <textarea id="pf-${key}-actions" style="min-height:90px"
                      placeholder="Конкретные шаги...">${v('actions')}</textarea>
          </div>
          <div class="pf-field">
            <label>Метрика успеха</label>
            <textarea id="pf-${key}-metric"
                      placeholder="Как измерим результат">${v('success_metric')}</textarea>
          </div>
          <div class="pf-field">
            <label>Дедлайн</label>
            <input type="date" id="pf-${key}-deadline" value="${v('deadline')}" />
          </div>
        </div>
      </div>`;
  },

  _readHorizon(key) {
    const g = id => document.getElementById(id)?.value.trim() ?? '';
    return {
      title:          g(`pf-${key}-title`),
      goal:           g(`pf-${key}-goal`),
      actions:        g(`pf-${key}-actions`),
      success_metric: g(`pf-${key}-metric`),
      deadline:       g(`pf-${key}-deadline`),
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

  /* ── AI horizon ── */
  async _aiHorizon(key, summary, computed) {
    const btn = document.getElementById(`pf-ai-btn-${key}`);
    if (btn) { btn.disabled = true; btn.innerHTML = `${ic.ai} Генерирую...`; }

    const horizonLabels = {
      short: 'Краткосрочная (1 месяц)',
      mid:   'Среднесрочная (1–2 квартала)',
      long:  'Долгосрочная (4 квартала)',
    };

    const direction = await this._askDirection();
    if (direction === null) {
      if (btn) { btn.disabled = false; btn.innerHTML = `${ic.ai} AI варианты`; }
      return;
    }

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

      this._showVariantPicker(key, variants, horizonLabels[key]);

    } catch (e) {
      window.App.toast('Ошибка AI: ' + e.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = `${ic.ai} AI варианты`; }
    }
  },

  /* ── Direction picker ── */
  _askDirection() {
    return new Promise(resolve => {
      const opts = [
        { id: 'retention',    icon: '🛡', label: 'Удержание',  hint: 'Снизить риски оттока, укрепить отношения' },
        { id: 'growth',       icon: '↗',  label: 'Рост',       hint: 'Апсейл, расширение услуг, новые возможности' },
        { id: 'optimization', icon: '⚡', label: 'Оптимизация',hint: 'Эффективность команды и процессов' },
        { id: 'custom',       icon: '✎',  label: 'Своё',       hint: 'Опиши направление самостоятельно' },
      ];

      const hints  = { retention:'Снизить риски оттока, укрепить отношения', growth:'Апсейл, расширение услуг', optimization:'Эффективность команды и процессов', custom:'' };
      const labels = { retention:'Удержание', growth:'Рост', optimization:'Оптимизация', custom:'Своё' };

      window.App.openModal(`
        <div style="padding:24px;max-width:460px;width:100%;box-sizing:border-box">
          <div class="pf-modal-head">Выбери направление стратегии</div>
          <div class="pf-modal-sub">AI сгенерирует 3 варианта под выбранное направление</div>

          <div id="dir-cards" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;
                                     margin-bottom:16px">
            ${opts.map(o => `
              <div class="pf-dir-card" data-id="${o.id}">
                <div class="pf-dir-icon">${o.icon}</div>
                <div class="pf-dir-label">${o.label}</div>
                <div class="pf-dir-hint">${o.hint}</div>
              </div>`).join('')}
          </div>

          <div id="dir-text-wrap" style="display:none">
            <div id="dir-selected-label"
                 style="font-size:13px;font-weight:700;color:#6366f1;
                        margin-bottom:10px"></div>
            <textarea id="dir-custom-input"
                      style="width:100%;box-sizing:border-box;min-height:100px;
                             border:1.5px solid #6366f1;border-radius:8px;
                             padding:10px 12px;font-size:13px;font-family:inherit;
                             resize:vertical;background:#fafafa"
                      placeholder="Уточни или измени направление..."></textarea>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button id="dir-confirm" class="pf-btn pf-btn-primary" style="flex:1">
                Генерировать
              </button>
              <button id="dir-back" class="pf-btn pf-btn-secondary">Назад</button>
              <button id="dir-cancel" class="pf-btn pf-btn-secondary">${ic.close}</button>
            </div>
          </div>
        </div>`);

      document.querySelectorAll('.pf-dir-card').forEach(card => {
        card.addEventListener('click', () => {
          const id    = card.dataset.id;
          const wrap  = document.getElementById('dir-text-wrap');
          const lbl   = document.getElementById('dir-selected-label');
          const input = document.getElementById('dir-custom-input');
          document.getElementById('dir-cards').style.display = 'none';
          lbl.textContent = labels[id];
          input.value     = id === 'custom' ? '' : hints[id];
          wrap.style.display = 'block';
          input.focus();

          document.getElementById('dir-back').onclick = () => {
            wrap.style.display = 'none';
            document.getElementById('dir-cards').style.display = 'grid';
          };
          document.getElementById('dir-confirm').onclick = () => {
            const val = input.value.trim();
            window.App.closeModal?.();
            resolve(val || hints[id] || id);
          };
          document.getElementById('dir-cancel').onclick = () => {
            window.App.closeModal?.();
            resolve(null);
          };
        });
      });
    });
  },

  /* ── Variant picker ── */
  _showVariantPicker(variants, onSelect) {
  // Удаляем старый picker если есть
  document.getElementById('pf-variant-picker')?.remove();

  const items = variants.map((v, i) => `
    <label class="variant-toggle-row" for="vt-${i}">
      <div class="variant-toggle-content">
        <div class="variant-toggle-title">${v.name || v.title || `Вариант ${i+1}`}</div>
        <div class="variant-toggle-text">${v.goal || v.text || ''}</div>
      </div>
      <div class="toggle-switch">
        <input type="radio" name="variant-pick" id="vt-${i}" value="${i}" ${i===0?'checked':''}>
        <span class="toggle-track"></span>
      </div>
    </label>
  `).join('');

  const el = document.createElement('div');
  el.id = 'pf-variant-picker';
  el.innerHTML = `
    <div class="variant-picker-backdrop"></div>
    <div class="variant-picker-panel">
      <div class="variant-picker-header">
        <span>AI варианты</span>
        <button class="variant-picker-close" onclick="document.getElementById('pf-variant-picker').remove()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="variant-picker-list">${items}</div>
      <div class="variant-picker-footer">
        <button class="variant-apply-btn" id="variant-apply-btn">Применить</button>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  // Анимация появления
  requestAnimationFrame(() => el.querySelector('.variant-picker-panel').classList.add('visible'));

  document.getElementById('variant-apply-btn').onclick = () => {
    const checked = el.querySelector('input[name="variant-pick"]:checked');
    if (checked) onSelect(variants[+checked.value]);
    el.remove();
  };
  el.querySelector('.variant-picker-backdrop').onclick = () => el.remove();
},


  /* ══════════════════════════════════════════
     ТАБ 2 — СТРАТЕГИЯ ПО АККАУНТАМ
  ══════════════════════════════════════════ */
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
          ? (strat.goal || '').slice(0, 55) + ((strat.goal || '').length > 55 ? '…' : '')
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
