/* ============================================
   js/pages/detail.js — Client Detail Page (ES Module)
   Portfolio BCHS v7.0
   Система табов: Overview / History / Notes / Delivery
   ============================================ */

import { BCG_CATEGORIES, MONTHS_RU, MONTHS_SHORT } from '../constants.js';
import { Calc }      from '../calc.js';
import { API }       from '../api.js';
import { RoleRadar } from '../role_radar.js';

/* ══════════════════════════════════════════════════════════════
   DETAIL PAGE
   ══════════════════════════════════════════════════════════════ */

export const DetailPage = {
  client:        null,
  computed:      null,
  chartInstance: null,
  activeTab:     'overview',

  /* ─── MAIN RENDER ─────────────────────────────────────────── */
  async render(clientId) {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--text-muted)">
        Загрузка клиента...
      </div>`;

    try {
      const [client, allBCHS, allPC, fteEntries] = await Promise.all([
        API.getClient(clientId),
        API.getBCHSFor(clientId),
        API.getPCFor(clientId),
        window.FteAPI
          ? window.FteAPI.getByClient(clientId)
          : Promise.resolve([]),
      ]);

      this.client    = client;
      this.computed  = Calc.computeClient(client, allBCHS, allPC, fteEntries);
      this.activeTab = 'overview';

      /* Сбрасываем активный месяц DeliveryTab при смене клиента */
      if (window.DeliveryTab) window.DeliveryTab.activeMonth = null;

      this._renderDetail();
    } catch (err) {
      console.error('[DetailPage.render]', err);
      main.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"></div>
          <div class="empty-state-title">Ошибка загрузки</div>
        </div>`;
    }
  },

  /* ─── TABS CONFIG ─────────────────────────────────────────── */
  _buildTabs() {
  const tabs = [
    { id: 'overview',  label: 'Обзор',    always: true },
    { id: 'history',   label: 'История',  always: true },
    { id: 'touches',   label: 'Касания',  always: true },
    { id: 'notes',     label: 'Заметки',  always: true },
    { id: 'delivery',  label: 'Delivery', module: 'detail_delivery' },
    { id: 'mc',        label: 'Monte Carlo', module: 'detail_monte_carlo' },
  ];
  // Возвращаем только overview — остальные доступны через панель действий
  return [tabs[0]];

    // фильтрация перенесена выше
  },

  /* ─── PAGE SHELL ──────────────────────────────────────────── */
  _renderDetail() {
    const c   = this.client;
    const r   = this.computed;
    const bcg = BCG_CATEGORIES[c.bcg_category];
    const now = new Date();
    const cm  = now.getMonth() + 1;
    const cy  = now.getFullYear();
    const cmLabel = MONTHS_RU[cm - 1];

    const curMonth = r.curBCHSEntry
      ? MONTHS_RU[(r.curBCHSEntry.month || cm) - 1]
      : cmLabel;

    const tabs     = this._buildTabs();
    const tabsHTML = tabs.map(t => `
      <button class="detail-tab-btn${t.id === this.activeTab ? ' active' : ''}"
              data-tab="${t.id}">${t.label}</button>
    `).join('');

    const main = document.getElementById('main-content');
    // Инжект стилей шапки
    if (!document.getElementById('cd-styles')) {
      const st = document.createElement('style');
      st.id = 'cd-styles';
      st.textContent = `
/* ── Client Detail Header ── */
.cd-header {
  display:flex;align-items:flex-start;gap:12px;
  padding:16px 20px;background:#fff;
  border:1px solid var(--border);border-radius:12px;
  margin-bottom:16px;
}
.cd-back {
  width:32px;height:32px;border-radius:8px;flex-shrink:0;margin-top:2px;
  border:1px solid var(--border);background:var(--surface);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--text-muted);transition:all .15s;
}
.cd-back:hover { background:var(--surface-hover);color:var(--text-primary); }
.cd-header-main { flex:1;min-width:0; }
.cd-header-top {
  display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px;
}
.cd-name {
  font-size:18px;font-weight:700;color:var(--text-primary);
  letter-spacing:-.02em;line-height:1;
}
.cd-badges { display:flex;gap:5px;flex-wrap:wrap;align-items:center; }
.cd-badge {
  font-size:11px;font-weight:600;padding:2px 8px;border-radius:5px;
  background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;
}
.cd-focus {
  font-size:13px;color:var(--text-secondary);margin-bottom:4px;
  line-height:1.4;
}
.cd-meta { font-size:12px;color:var(--text-muted); }
.cd-actions-btn {
  display:flex;align-items:center;gap:6px;
  padding:8px 14px;border-radius:8px;flex-shrink:0;
  border:1px solid var(--border);background:var(--surface);
  font-size:13px;font-weight:600;color:var(--text-secondary);
  cursor:pointer;transition:all .15s;white-space:nowrap;margin-top:2px;
}
.cd-actions-btn:hover {
  border-color:#6366f1;color:#6366f1;background:#f8f7ff;
}
`;
      document.head.appendChild(st);
    }

    main.innerHTML = `
      <div class="cd-header">
        <button class="cd-back" id="btn-back-dash">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="cd-header-main">
          <div class="cd-header-top">
            <span class="cd-name">${c.name}</span>
            <div class="cd-badges">
              <span class="cd-badge cd-badge--health ${r.badge.cls}">${r.badge.label}</span>
              <span class="cd-badge">${bcg ? bcg.label : c.bcg_category}</span>
              <span class="cd-badge">${c.key_account_priority}</span>
              <span class="cd-badge">${c.status}</span>
            </div>
          </div>
          <div class="cd-focus">${r.focus}</div>
          <div class="cd-meta">Ответственный: <strong>${c.sales_owner || '—'}</strong></div>
        </div>
        <button class="cd-actions-btn" id="btn-actions-panel">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
          Действия
        </button>
      </div>

      <!-- KPI карточки -->
      <div class="pf-kpi-grid-new" id="cd-kpi-grid">
        ${this._renderKPICards(r, curMonth)}
      </div>

            <div id="detail-tab-content"></div>
    `;

    this._bindDetailEvents();
    this._renderActiveTab();
  },

  /* ─── RENDER ACTIVE TAB ───────────────────────────────────── */
  _renderActiveTab() {
    const contentEl = document.getElementById('detail-tab-content');
    if (!contentEl) return;

    switch (this.activeTab) {
      case 'overview':
        contentEl.innerHTML = this._renderOverview();
        if (this.computed.monthlyData.length > 0) this._renderChart();
        RoleRadar.bindEvents();
        break;

      case 'history':
        contentEl.innerHTML = this._renderHistorySection();
        break;

      case 'touches':
  contentEl.innerHTML = '<div style="padding:32px;text-align:center;color:var(--text-muted)">⏳ Загрузка...</div>';
  this._loadTouches();
  break;

case 'notes':
  contentEl.innerHTML = this._renderNotesSection();
  this._bindNotesEvents();
  break;

      case 'delivery':
        contentEl.innerHTML = `
          <div class="dtab-wrap" id="delivery-tab-root">
            <div style="padding:40px;text-align:center;color:var(--text-muted)">
              Загрузка...
            </div>
          </div>`;
        if (window.DeliveryTab) {
          window.DeliveryTab.init(this.client.id);
        } else {
          document.getElementById('delivery-tab-root').innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon"></div>
              <div class="empty-state-title">DeliveryTab не загружен</div>
            </div>`;
        }
        break;

      case 'mc':
        contentEl.innerHTML = `<div id="mc-tab-content"></div>`;
        if (window.MCPage) {
          window.MCPage.mount(
            this.client,
            this.computed?.bchs ?? null,
          );
          // передаём monthly_revenue клиента в cfg
          if (window.MCPage && this.client.monthly_revenue) {
            window.MCPage.cfg = Object.assign(
              window.MCPage.cfg || {},
              { monthly_revenue: this.client.monthly_revenue }
            );
          }
        } else {
          contentEl.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon"></div>
              <div class="empty-state-title">MCPage не загружен</div>
            </div>`;
        }
        break;

      default:
        contentEl.innerHTML = this._renderOverview();
    }
  },

  /* ─── OVERVIEW TAB ────────────────────────────────────────── */
  _renderOverview() {
    const r        = this.computed;
    const radarHTML = RoleRadar.render(this.client.id, r.curPCEntry);

    return `
      <div class="overview-layout">
        <div class="overview-main">
          <div class="chart-container">
            <div class="chart-title">История лояльности (bCHS)</div>
            <div style="height:200px;position:relative">
              <canvas id="loyalty-chart"></canvas>
            </div>
            ${r.monthlyData.length === 0
              ? `<div class="no-data"
                      style="text-align:center;padding:20px">
                   Нет исторических данных
                 </div>`
              : ''}
          </div>
          <div class="form-section" style="margin-top:16px">
            <div class="form-section-title"> Последние 3 месяца</div>
            ${this._renderHistoryTable(3)}
          </div>
        </div>
        ${radarHTML
          ? `<div class="overview-sidebar">${radarHTML}</div>`
          : ''}
      </div>`;
  },

  /* ─── HISTORY TAB ─────────────────────────────────────────── */
  _renderHistorySection() {
    return `
      <div class="form-section">
        <div class="form-section-title">История по месяцам</div>
        ${this._renderHistoryTable()}
      </div>`;
  },

  /* ─── NOTES TAB ───────────────────────────────────────────── */
  _renderNotesSection() {
    return `
      <div class="form-section">
        <div class="form-section-title">Заметки о стратегии</div>
        <textarea class="form-textarea" id="strategy-notes"
                  style="min-height:160px">${this.client.strategy_notes || ''}</textarea>
        <div style="margin-top:8px">
          <button class="btn btn-primary btn-sm" id="btn-save-notes">
             Сохранить заметки
          </button>
        </div>
      </div>`;
  },

  _bindNotesEvents() {
    document.getElementById('btn-save-notes')
      ?.addEventListener('click', async () => {
        const notes = document.getElementById('strategy-notes').value;
        try {
          await API.updateClient(this.client.id, {
            ...this.client,
            strategy_notes: notes,
          });
          this.client.strategy_notes = notes;
          window.App.toast(' Заметки сохранены', 'success');
        } catch {
          window.App.toast(' Ошибка сохранения', 'error');
        }
      });
  },

  /* ─── KPI CARD ────────────────────────────────────────────── */
  _renderKPI(label, value, sub, color) {
    return `
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:var(--radius);padding:12px 14px">
        <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.5px;
                    color:var(--text-muted);font-weight:700;margin-bottom:4px">
          ${label}
        </div>
        <div style="font-size:22px;font-weight:700;
                    color:${color || 'var(--text-primary)'}">
          ${value}
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">
          ${sub}
        </div>
      </div>`;
  },

  _bchsColor(bchs) {
    if (bchs >= 20)  return 'var(--green)';
    if (bchs >= -10) return 'var(--text-primary)';
    if (bchs >= -30) return 'var(--yellow)';
    return 'var(--red)';
  },

  _trendColor(cls) {
    if (cls === 'trend-up')   return 'var(--green)';
    if (cls === 'trend-down') return 'var(--red)';
    return 'var(--text-muted)';
  },

  /* ─── HISTORY TABLE ───────────────────────────────────────── */
  _renderHistoryTable(limit) {
    const r = this.computed;

    if (!r.bchsHistory || r.bchsHistory.length === 0) {
      return `
        <div class="no-data" style="text-align:center;padding:20px">
          Нет данных
        </div>`;
    }

    let rows = r.bchsHistory.map(be => {
      const bchs    = Calc.computeBCHS(be);
      const loyalty = Calc.loyaltyPct(bchs);
      const health  = Calc.healthSignal(bchs);
      const pe      = r.pcHistory.find(
        p => p.month === be.month && p.year === be.year
      );
      const pcScore  = pe ? Calc.computePC(pe) : null;
      const load     = Calc.loadSignal(pcScore);
      const finalS   = Calc.finalScore(bchs, pcScore);
      const isCurrent = r.curBCHSEntry
        && Number(be.month) === Number(r.curBCHSEntry.month)
        && Number(be.year)  === Number(r.curBCHSEntry.year);

      return { be, bchs, loyalty, health, pe, pcScore, load, finalS, isCurrent };
    }).reverse();

    if (limit) rows = rows.slice(0, limit);

    return `
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Период</th>
              <th>bCHS</th>
              <th>Лояльность</th>
              <th>Здоровье</th>
              <th>PC Score</th>
              <th>Нагрузка</th>
              <th>Final Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr${row.isCurrent
                ? ' style="background:rgba(59,130,246,0.06)"'
                : ''}>
                <td>
                  <strong>
                    ${MONTHS_SHORT[row.be.month - 1]} ${row.be.year}
                  </strong>
                  ${row.isCurrent
                    ? `<span style="font-size:10px;color:var(--blue);
                                   font-weight:600"> актуальный</span>`
                    : ''}
                </td>
                <td><strong>${row.bchs !== null ? row.bchs : '—'}</strong></td>
                <td>${row.loyalty !== null ? row.loyalty + '%' : '—'}</td>
                <td>${row.health.label}</td>
                <td>${row.pcScore !== null ? row.pcScore.toFixed(1) : '—'}</td>
                <td>${row.load.label}</td>
                <td>${row.finalS !== null ? row.finalS.toFixed(1) : '—'}</td>
                <td>
                  <button class="btn btn-secondary btn-sm"
                          data-action="edit-month"
                          data-month="${row.be.month}"
                          data-year="${row.be.year}"></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  },

  /* ─── CHART ───────────────────────────────────────────────── */
  _renderChart() {
    const r = this.computed;
    if (r.monthlyData.length === 0) return;

    if (typeof Chart === 'undefined') {
      const script  = document.createElement('script');
      script.src    = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.onload = () => this._drawChart();
      document.head.appendChild(script);
    } else {
      this._drawChart();
    }
  },

  _drawChart() {
    const r   = this.computed;
    const ctx = document.getElementById('loyalty-chart');
    if (!ctx) return;

    if (this.chartInstance) this.chartInstance.destroy();

    const labels      = r.monthlyData.map(d => d.label);
    const bchsData    = r.monthlyData.map(d => d.bchs);
    const loyaltyData = r.monthlyData.map(d => d.loyalty);

    const pointColors = bchsData.map(v => {
      if (v === null) return '#9ca3af';
      if (v >= 20)   return '#10b981';
      if (v >= -10)  return '#6b7280';
      if (v >= -30)  return '#f59e0b';
      return '#ef4444';
    });

    const pointRadius = r.monthlyData.map(d => {
      if (!r.curBCHSEntry) return 5;
      return (
        d.month === Number(r.curBCHSEntry.month) &&
        d.year  === Number(r.curBCHSEntry.year)
      ) ? 8 : 5;
    });

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label:              'bCHS',
            data:               bchsData,
            borderColor:        '#3b82f6',
            backgroundColor:    'rgba(59,130,246,0.08)',
            borderWidth:        2,
            pointBackgroundColor: pointColors,
            pointRadius,
            tension:            0.3,
            fill:               true,
            yAxisID:            'y',
          },
          {
            label:       'Лояльность %',
            data:        loyaltyData,
            borderColor: '#10b981',
            borderWidth: 1.5,
            borderDash:  [4, 3],
            pointRadius: 3,
            tension:     0.3,
            fill:        false,
            yAxisID:     'y2',
          },
        ],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { font: { family: 'Inter', size: 11 }, boxWidth: 12 },
          },
          tooltip: {
            callbacks: {
              label: ctx => ctx.datasetIndex === 0
                ? ` bCHS: ${ctx.raw}`
                : ` Лояльность: ${ctx.raw}%`,
            },
          },
        },
        scales: {
          y: {
            position: 'left',
            min: -81, max: 81,
            grid:  { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { family: 'Inter', size: 10 } },
          },
          y2: {
            position: 'right',
            min: 0, max: 100,
            grid:  { drawOnChartArea: false },
            ticks: {
              font:     { family: 'Inter', size: 10 },
              callback: v => v + '%',
            },
          },
          x: {
            ticks: { font: { family: 'Inter', size: 10 } },
            grid:  { display: false },
          },
        },
      },
    });
  },

  /* ─── TOUCHES TAB ─────────────────────────────────────────── */
async _loadTouches() {
  try {
    const touchPoints = await API.getTouchPoints();
    const clientTPs = touchPoints
      .filter(tp => String(tp.client_id) === String(this.client.id) && tp.completed_at)
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

    const contentEl = document.getElementById('detail-tab-content');
    if (!contentEl) return;
    contentEl.innerHTML = this._renderTouchesTab(clientTPs);
    this._bindTouchesEvents(clientTPs);
  } catch (e) {
    const contentEl = document.getElementById('detail-tab-content');
    if (contentEl) contentEl.innerHTML = `<div style="padding:32px;text-align:center;color:var(--md-red)"> ${e.message}</div>`;
  }
},

_renderTouchesTab(touchPoints) {
  const TYPE_LABELS = {
    checkin:  { icon: '', label: 'Check-in'  },
    call:     { icon: '', label: 'Звонок'    },
    meeting:  { icon: '', label: 'Встреча'   },
    qbr:      { icon: '', label: 'QBR'       },
    email:    { icon: '', label: 'Email'      },
  };

  // Группировка по месяцам
  const groups = {};
  for (const tp of touchPoints) {
    const d = new Date(tp.completed_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
    if (!groups[key]) groups[key] = { year: d.getFullYear(), month: d.getMonth(), items: [] };
    groups[key].items.push(tp);
  }

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;

  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                      'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

  const groupsHTML = Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, g], idx) => {
      const isCurrentMonth = key === currentKey;
      const isPrevMonth    = idx === 1;
      const isCollapsed    = !isCurrentMonth && !isPrevMonth;
      const count          = g.items.length;
      const label          = `${monthNames[g.month]} ${g.year}`;

      const itemsHTML = g.items.map(tp => {
        const t       = TYPE_LABELS[tp.type] ?? { icon: '•', label: tp.type };
        const date    = new Date(tp.completed_at);
        const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        const daysAgo = Math.round((Date.now() - date.getTime()) / 86400000);
        const agoStr  = daysAgo === 0 ? 'сегодня' : daysAgo === 1 ? 'вчера' : `${daysAgo} дн. назад`;

        const notes = tp.notes || '';
        const contextMatch = notes.match(/ Контекст:\n([\s\S]*?)(?:\n\n|$)/);
        const tasksMatch   = notes.match(/ Задачи:\n([\s\S]*?)(?:\n\n|$)/);
        const nextMatch    = notes.match(/ Дальнейшие шаги:\n([\s\S]*?)(?:\n\n|$)/);

        const isStructured = contextMatch || tasksMatch || nextMatch;

        const notesPreview = isStructured ? `
          <div style="margin-top:6px;display:flex;flex-direction:column;gap:3px">
            ${contextMatch ? `<div style="font-size:12px;color:var(--text-secondary)"><span style="opacity:.6"></span> ${contextMatch[1].trim().slice(0,80)}${contextMatch[1].trim().length > 80 ? '…' : ''}</div>` : ''}
            ${tasksMatch   ? `<div style="font-size:12px;color:var(--text-secondary)"><span style="opacity:.6"></span> ${tasksMatch[1].trim().slice(0,80)}${tasksMatch[1].trim().length > 80 ? '…' : ''}</div>` : ''}
            ${nextMatch    ? `<div style="font-size:12px;color:var(--text-secondary)"><span style="opacity:.6"></span> ${nextMatch[1].trim().slice(0,80)}${nextMatch[1].trim().length > 80 ? '…' : ''}</div>` : ''}
          </div>` : notes ? `
          <div style="font-size:12px;color:var(--text-secondary);margin-top:5px">
            ${notes.slice(0,120)}${notes.length > 120 ? '…' : ''}
          </div>` : '';

        return `
          <div class="tp-detail-card" data-id="${tp.id}"
               style="background:var(--surface);border:1px solid var(--border);
                      border-radius:10px;padding:12px 14px;margin-bottom:8px;
                      cursor:pointer;transition:box-shadow .15s"
               onmouseover="this.style.boxShadow='var(--shadow-md)'"
               onmouseout="this.style.boxShadow='none'">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:16px">${t.icon}</span>
                <span style="font-size:13px;font-weight:600;color:var(--text-primary)">${t.label}</span>
                <span style="font-size:11px;color:var(--text-muted)">· ${dateStr} · ${agoStr}</span>
              </div>
              <button class="tp-del-detail btn btn-secondary btn-xs"
                      data-id="${tp.id}"
                      style="opacity:0;transition:opacity .15s"
                      onmouseover="this.style.opacity='1'"
                      onmouseout="this.style.opacity='0'"></button>
            </div>
            ${notesPreview}
          </div>`;
      }).join('');

      return `
        <div class="tp-month-group" data-key="${key}" style="margin-bottom:4px">
          <div class="tp-month-header"
               style="display:flex;align-items:center;justify-content:space-between;
                      padding:8px 4px;cursor:pointer;user-select:none"
               data-toggle="${key}">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:12px;font-weight:700;color:var(--text-primary);
                           text-transform:uppercase;letter-spacing:.5px">${label}</span>
              <span style="font-size:11px;background:var(--surface);border:1px solid var(--border);
                           border-radius:20px;padding:1px 8px;color:var(--text-muted)">
                ${count} ${count === 1 ? 'касание' : count < 5 ? 'касания' : 'касаний'}
              </span>
              ${isCurrentMonth ? '<span style="font-size:10px;background:#e0f2fe;color:#0284c7;border-radius:20px;padding:1px 8px;font-weight:600">текущий</span>' : ''}
            </div>
            <span style="font-size:12px;color:var(--text-muted)">${isCollapsed ? '▶' : '▼'}</span>
          </div>
          <div class="tp-month-body" data-body="${key}"
               style="${isCollapsed ? 'display:none' : ''}">
            ${isCollapsed && count > 0 ? `
              <div style="padding:6px 4px 10px">
                ${itemsHTML}
              </div>` : `
              <div style="padding:0 4px 10px">
                ${itemsHTML}
              </div>`}
          </div>
        </div>`;
    }).join('');

  return `
    <div class="form-section">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div class="form-section-title" style="margin:0"> История касаний</div>
        <button class="btn btn-primary btn-sm" id="btn-new-touch">+ Касание</button>
      </div>
      ${touchPoints.length === 0 ? `
        <div style="text-align:center;padding:40px;color:var(--text-muted)">
          Касаний пока нет — нажми "+ Касание" чтобы добавить первое
        </div>` : groupsHTML}
    </div>`;
},

_bindTouchesEvents(touchPoints) {
  // Кнопка новое касание
    document.getElementById('btn-new-touch')?.addEventListener('click', () => {
    import('./dashboard.js').then(m => {
      m.DashboardPage._openTouchModal(this.client.id, this.client.name);
    });
  });


  // Сворачивание/разворачивание месяцев
  document.querySelectorAll('[data-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const key  = header.dataset.toggle;
      const body = document.querySelector(`[data-body="${key}"]`);
      const arrow = header.querySelector('span:last-child');
      if (!body) return;
      const isHidden = body.style.display === 'none';
      body.style.display = isHidden ? '' : 'none';
      if (arrow) arrow.textContent = isHidden ? '▼' : '▶';
    });
  });

  // Удаление касания
    // Удаление касания
  document.querySelectorAll('.tp-del-detail').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      await API.deleteTouchPoint(btn.dataset.id);
      window.App.toast('Удалено', 'success');
      this._loadTouches();
    });
  });

  // Раскрытие карточки касания по клику
  document.querySelectorAll('.tp-detail-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.tp-del-detail')) return;
      const id = card.dataset.id;
      const existing = card.querySelector('.tp-detail-expanded');
      if (existing) { existing.remove(); return; }

      const tp = touchPoints.find(t => String(t.id) === String(id));
      if (!tp?.notes) return;

      const notes = tp.notes;
      const blocks = [
        { re: / Контекст:\n([\s\S]*?)(?:\n\n|$)/,          icon: '', label: 'Контекст' },
        { re: / Задачи:\n([\s\S]*?)(?:\n\n|$)/,             icon: '', label: 'Задачи' },
        { re: / Дальнейшие шаги:\n([\s\S]*?)(?:\n\n|$)/,   icon: '', label: 'Дальнейшие шаги' },
        { re: / Стратегия:\n([\s\S]*?)(?:\n\n|$)/,          icon: '', label: 'Стратегия' },
        { re: / Ожидаемый результат:\n([\s\S]*?)(?:\n\n|$)/,icon: '', label: 'Результат' },
        { re: / Блокеры:\n([\s\S]*?)(?:\n\n|$)/,            icon: '', label: 'Блокеры' },
      ];

      const isStructured = blocks.some(b => b.re.test(notes));

      const expanded = document.createElement('div');
      expanded.className = 'tp-detail-expanded';
      expanded.style.cssText = 'margin-top:10px;padding-top:10px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px';

      if (isStructured) {
        expanded.innerHTML = blocks.map(b => {
          const m = notes.match(b.re);
          if (!m) return '';
          return `<div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                        letter-spacing:.5px;color:var(--text-muted);margin-bottom:3px">
              ${b.icon} ${b.label}
            </div>
            <div style="font-size:13px;color:var(--text-primary);line-height:1.5;
                        white-space:pre-wrap">${m[1].trim()}</div>
          </div>`;
        }).join('');
      } else {
        expanded.innerHTML = `<div style="font-size:13px;color:var(--text-primary);
                                          line-height:1.5;white-space:pre-wrap">${notes}</div>`;
      }

      card.appendChild(expanded);
    });
  });
},

  /* ─── KPI CARDS ──────────────────────────────────────────── */
  _renderKPICards(r, curMonth) {
    const bchsColor = r.bchs !== null ? this._bchsColor(r.bchs) : 'var(--text-muted)';
    const trendColor = r.trend ? this._trendColor(r.trend.cls) : 'var(--text-muted)';
    const loyaltyColor = r.loyalty === null ? '#6b7280'
      : r.loyalty >= 70 ? '#10b981'
      : r.loyalty >= 50 ? '#f59e0b' : '#ef4444';
    const revColor = r.revenueEfficiency === null ? '#6b7280'
      : r.revenueEfficiency >= 0.95 ? '#10b981'
      : r.revenueEfficiency >= 0.80 ? '#f59e0b' : '#ef4444';

    const cards = [
      {
        id: 'bchs',
        label: 'Лояльность · ' + curMonth,
        value: r.loyalty !== null ? r.loyalty + '%' : '—',
        hint: r.health.label.replace(/[^\w\s%А-яЁё—+\-.,:()/]/gu, '').trim(),
        valueColor: loyaltyColor,
        detail: `
          <div class="kpi-det-title">Здоровье аккаунта</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Лояльность</span>
            <span class="kpi-det-risk" style="color:${loyaltyColor}">${r.loyalty !== null ? r.loyalty + '%' : '—'}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">bCHS (сырой балл)</span>
            <span class="kpi-det-risk" style="color:${bchsColor}">${r.bchs !== null ? r.bchs + ' из 81' : '—'}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Шкала</span>
            <span class="kpi-det-risk" style="color:#9ca3af">−81 ... +81 → 0–100%</span>
          </div>`,
      },
      {
        id: 'score',
        label: '% Потенциала',
        value: r.pctPot !== null ? r.pctPot + '%' : '—',
        hint: r.final !== null ? r.final.toFixed(1) + ' из ' + r.ideal : 'нет данных',
        valueColor: r.pctPot === null ? '#6b7280' : r.pctPot >= 85 ? '#10b981' : r.pctPot >= 65 ? '#f59e0b' : '#ef4444',
        detail: `
          <div class="kpi-det-title">Реализация потенциала</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Реализовано</span>
            <span class="kpi-det-risk">${r.pctPot !== null ? r.pctPot + '%' : '—'}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Final Score</span>
            <span class="kpi-det-risk">${r.final !== null ? r.final.toFixed(1) : '—'}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Идеал для ${r.client?.bcg_category ?? 'сегмента'}</span>
            <span class="kpi-det-risk">${r.ideal} (100%)</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">PC Score / нагрузка</span>
            <span class="kpi-det-risk">${r.pcScore !== null ? r.pcScore.toFixed(1) : '—'} · ${r.load.label.replace(/[^\w\s%А-яЁё—+\-.,:()/]/gu, '').trim()}</span>
          </div>`,
      },

      {
        id: 'trend',
        label: 'Тренд 3М',
        value: r.trend ? r.trend.label : '—',
        hint: r.trend ? 'Δ ' + (r.trend.delta > 0 ? '+' : '') + r.trend.delta : 'нет данных',
        valueColor: trendColor,
        detail: `
          <div class="kpi-det-title">Динамика bCHS</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Направление</span>
            <span class="kpi-det-risk" style="color:${trendColor}">${r.trend ? r.trend.label : '—'}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Изменение</span>
            <span class="kpi-det-risk">${r.trend ? (r.trend.delta > 0 ? '+' : '') + r.trend.delta : '—'}</span>
          </div>`,
      },
      {
        id: 'revenue',
        label: 'Revenue Efficiency',
        value: r.revenueEfficiency !== null ? Math.round(r.revenueEfficiency * 100) + '%' : '—',
        hint: r.revenueEfficiency !== null
          ? (r.revenueEfficiency >= 0.95 ? 'Отлично' : r.revenueEfficiency >= 0.80 ? 'Внимание' : 'Критично')
          : 'нет FTE данных',
        valueColor: revColor,
        detail: `
          <div class="kpi-det-title">Эффективность дохода</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Показатель</span>
            <span class="kpi-det-risk" style="color:${revColor}">${r.revenueEfficiency !== null ? Math.round(r.revenueEfficiency * 100) + '%' : '—'}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Статус</span>
            <span class="kpi-det-risk">${r.revenueEfficiency !== null
              ? (r.revenueEfficiency >= 0.95 ? 'Отлично' : r.revenueEfficiency >= 0.80 ? 'Внимание' : 'Критично')
              : 'нет FTE данных'}</span>
          </div>`,
      },
    ];

    return cards.map(c => `
      <div class="pf-kpi-card" data-card="${c.id}">
        <div class="pf-kpi-card-collapsed">
          <div class="pf-kpi-card-label">${c.label}</div>
          <div class="pf-kpi-card-value" style="color:${c.valueColor}">${c.value}</div>
          <div class="pf-kpi-card-hint">${c.hint}</div>
        </div>
        <div class="pf-kpi-card-detail" style="display:none">${c.detail}</div>
      </div>`).join('');
  },

  /* ─── ACTIONS PANEL ──────────────────────────────────────── */
  _openActionsPanel() {
    const c = this.client;
    document.getElementById('detail-actions-panel')?.remove();
    if (!document.getElementById('dap-styles')) {
      const st = document.createElement('style');
      st.id = 'dap-styles';
      st.textContent = `
        .dap-action-btn {
          display:flex;align-items:center;gap:12px;
          padding:12px 14px;border-radius:10px;
          border:1.5px solid #f0f0f5;background:#fff;
          cursor:pointer;text-align:left;width:100%;
          transition:all .15s;
        }
        .dap-action-btn:hover { border-color:#6366f1;background:#f8f7ff; }
        .dap-action-icon {
          width:36px;height:36px;border-radius:8px;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        .dap-action-title { font-size:13px;font-weight:600;color:#111827;margin-bottom:2px; }
        .dap-action-sub   { font-size:11px;color:#9ca3af; }
      `;
      document.head.appendChild(st);
    }

    const el = document.createElement('div');
    el.id = 'detail-actions-panel';
    el.innerHTML = `
      <div class="variant-picker-backdrop" id="dap-backdrop"></div>
      <div class="variant-picker-panel" id="dap-panel">
        <div class="variant-picker-header">
          <span style="font-size:14px;font-weight:700">${c.name}</span>
          <button class="variant-picker-close" id="dap-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="variant-picker-body" style="padding:16px;display:flex;flex-direction:column;gap:8px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                      letter-spacing:.06em;color:#9ca3af;margin-bottom:4px">
            Быстрые действия
          </div>
          <button class="dap-action-btn" id="dap-add-data">
            <div class="dap-action-icon" style="background:#eef2ff;color:#6366f1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Добавить данные</div>
              <div class="dap-action-sub">Текущий период</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-edit-client">
            <div class="dap-action-icon" style="background:#f0fdf4;color:#10b981">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Редактировать клиента</div>
              <div class="dap-action-sub">Профиль и настройки</div>
            </div>
          </button>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                      letter-spacing:.06em;color:#9ca3af;margin:8px 0 4px">
            Разделы
          </div>
          <button class="dap-action-btn" id="dap-history">
            <div class="dap-action-icon" style="background:#eff6ff;color:#3b82f6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">История</div>
              <div class="dap-action-sub">bCHS по месяцам</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-touches">
            <div class="dap-action-icon" style="background:#fff7ed;color:#f97316">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Касания</div>
              <div class="dap-action-sub">История встреч</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-notes">
            <div class="dap-action-icon" style="background:#fefce8;color:#ca8a04">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Заметки</div>
              <div class="dap-action-sub">Стратегия и комментарии</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-delivery">
            <div class="dap-action-icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Delivery</div>
              <div class="dap-action-sub">Команда и роли</div>
            </div>
          </button>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                      letter-spacing:.06em;color:#9ca3af;margin:8px 0 4px">
            Аналитика
          </div>
          <button class="dap-action-btn" id="dap-mc">
            <div class="dap-action-icon" style="background:#f5f3ff;color:#8b5cf6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Monte Carlo</div>
              <div class="dap-action-sub">Прогноз 3–12 месяцев</div>
            </div>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() =>
      document.getElementById('dap-panel')?.classList.add('visible')
    );

    const close = () => {
      document.getElementById('dap-panel')?.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    };

    document.getElementById('dap-backdrop')?.addEventListener('click', close);
    document.getElementById('dap-close')?.addEventListener('click', close);
    document.getElementById('dap-add-data')?.addEventListener('click', () => {
      close(); window.App.navigate('entry', this.client.id);
    });
    document.getElementById('dap-edit-client')?.addEventListener('click', () => {
      close(); window.App.navigate('clients', this.client.id);
    });
    const goTab = (tab) => {
      close();
      this.activeTab = tab;
      document.querySelectorAll('.detail-tab-btn')
        .forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      this._renderActiveTab();
    };
    document.getElementById('dap-history')?.addEventListener('click',  () => goTab('history'));
    document.getElementById('dap-touches')?.addEventListener('click',  () => goTab('touches'));
    document.getElementById('dap-notes')?.addEventListener('click',    () => goTab('notes'));
    document.getElementById('dap-delivery')?.addEventListener('click', () => goTab('delivery'));
    document.getElementById('dap-mc')?.addEventListener('click',       () => goTab('mc'));
  },

  /* ─── PAGE EVENTS  ─────────────────────────────────────────── */
  _bindDetailEvents() {
    // KPI карточки — раскрытие как в портфеле
    const kpiGrid = document.getElementById('cd-kpi-grid');
    if (kpiGrid) {
      const collapseKpi = () => {
        kpiGrid.querySelectorAll('.pf-kpi-card').forEach(c => {
          c.classList.remove('pf-kpi-active', 'pf-kpi-dimmed');
          const det = c.querySelector('.pf-kpi-card-detail');
          if (det) det.style.display = 'none';
        });
      };
      document.addEventListener('click', e => {
        if (!kpiGrid.contains(e.target)) collapseKpi();
      });
      kpiGrid.addEventListener('click', e => {
        e.stopPropagation();
        const card = e.target.closest('.pf-kpi-card');
        if (!card) return;
        if (e.target.closest('.pf-kpi-card-close')) { collapseKpi(); return; }
        if (card.classList.contains('pf-kpi-active')) { collapseKpi(); return; }
        kpiGrid.querySelectorAll('.pf-kpi-card').forEach(c => {
          c.classList.remove('pf-kpi-active');
          c.classList.add('pf-kpi-dimmed');
          const det = c.querySelector('.pf-kpi-card-detail');
          if (det) det.style.display = 'none';
        });
        card.classList.remove('pf-kpi-dimmed');
        card.classList.add('pf-kpi-active');
        const det = card.querySelector('.pf-kpi-card-detail');
        if (det) det.style.display = 'block';
      });
    }

    document.getElementById('btn-actions-panel')
      ?.addEventListener('click', () => this._openActionsPanel());

    document.getElementById('btn-back-dash')
      ?.addEventListener('click', () => window.App.navigate('dashboard'));

    document.getElementById('btn-add-data')
      ?.addEventListener('click', () =>
        window.App.navigate('entry', this.client.id)
      );

    document.getElementById('btn-edit-client')
      ?.addEventListener('click', () =>
        window.App.navigate('clients', this.client.id)
      );

    /* Переключение табов */
    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        document.querySelectorAll('.detail-tab-btn')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
        this._renderActiveTab();
      });
    });

    /* Редактирование периода — делегирование на document */
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="edit-month"]');
      if (!btn) return;
      window.App.navigateEntryMonthYear(
        this.client.id,
        parseInt(btn.dataset.month),
        parseInt(btn.dataset.year)
      );
    });
  },

  /* ─── PUBLIC: переход на таб из внешнего кода ────────────── */
  navigate(tab) {
    this.activeTab = tab;
    const btn = document.querySelector(`.detail-tab-btn[data-tab="${tab}"]`);
    if (btn) {
      document.querySelectorAll('.detail-tab-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this._renderActiveTab();
    }
  },
};
