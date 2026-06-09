/* ============================================
   js/pages/dashboard.js — Dashboard Page (ES Module)
   Portfolio BCHS v7.0
   ============================================ */

import { SIGNALS, PC_CRITERIA, MONTHS_RU, BCG_CATEGORIES } from '../constants.js';
import { Calc } from '../calc.js';
import { API } from '../api.js';

export const DashboardPage = {
  allClients:  [],
  allBCHS:     [],
  allPC:       [],
  computed:    [],
  touchPoints: [],
  expandedId:  null,
  activeTab:   'all',  /* all | urgent | touch */
  searchQ:     '',

  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Дашборд</div>
          <div class="page-subtitle" id="dash-summary">загрузка...</div>
        </div>
      </div>

      <div style="display:flex;gap:8px;align-items:center;
                  flex-wrap:wrap;margin-bottom:16px">
        <input type="text" class="search-input" id="dash-search"
               placeholder="🔍 Поиск..." style="flex:1;min-width:160px"/>
        <div style="display:flex;gap:6px" id="dash-tabs"></div>
      </div>

      <div id="dash-body">
        <div class="empty-state">
          <div class="empty-state-icon">⏳</div>
          <div class="empty-state-title">Загружаем данные...</div>
        </div>
      </div>`;

    document.getElementById('dash-search')
      .addEventListener('input', e => {
        this.searchQ = e.target.value.toLowerCase();
        this.renderList();
      });

    await this.load();
  },

  async load() {
    try {
      [this.allClients, this.allBCHS, this.allPC, this.touchPoints] = await Promise.all([
        API.getClients(),
        API.getAllBCHSEntries(),
        API.getAllPCEntries(),
        API.getTouchPoints().catch(() => []),
      ]);

      this.computed = this.allClients.map(c => ({
        client: c,
        ...Calc.computeClient(c, this.allBCHS, this.allPC),
      }));

      this._renderTabs();
      this.renderList();

    } catch (err) {
      console.error('[DashboardPage.load]', err);
      document.getElementById('dash-body').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-title">Ошибка загрузки данных</div>
        </div>`;
    }
  },

  /* ── Считаем срочность касания ── */
  _touchUrgency(clientId, bcgCategory, row) {
    const BCG_FREQUENCY = { KEY:14, GROWTH:21, GROWTH_EARLY:14, STABLE:42, TAIL:90 };
    const freq = BCG_FREQUENCY[bcgCategory] ?? 30;

    const last = (this.touchPoints || [])
      .filter(tp => String(tp.client_id) === String(clientId) && tp.completed_at)
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0];

    const daysSinceLast = last
      ? Math.round((Date.now() - new Date(last.completed_at).getTime()) / 86400000)
      : null;

    const bchs      = row?.bchs ?? null;
    const trendDown = row?.trend?.direction === 'down';
    const riskPct   = row?.riskPct ?? 0;

    /* Событийные триггеры — важнее расписания */
    if (bchs !== null && bchs < -10)             return 'immediate';
    if (trendDown && bchs !== null && bchs < 0)  return 'immediate';
    if (riskPct > 30)                            return 'immediate';
    if (trendDown && bchs !== null && bchs < 20) return 'overdue';
    if (riskPct > 15)                            return 'overdue';

    /* Плановые — только если уже было касание */
    if (daysSinceLast === null) return 'ok';
    if (daysSinceLast >= freq)        return 'overdue';
    if (daysSinceLast >= freq * 0.75) return 'due';
    return 'ok';
  },

  _touchBadgeHTML(clientId, bcgCategory, row) {
    const urgency = this._touchUrgency(clientId, bcgCategory, row);
    if (urgency === 'ok') return '';
    const cfg = {
      immediate: { bg:'#fef2f2', color:'#ef4444', border:'#fecaca', text:'📍 срочно'    },
      overdue:   { bg:'#fef2f2', color:'#ef4444', border:'#fecaca', text:'📍 просрочено'},
      due:       { bg:'#fffbeb', color:'#f59e0b', border:'#fde68a', text:'📍 скоро'     },
    }[urgency];
    return `<span style="font-size:10px;background:${cfg.bg};color:${cfg.color};
      border:1px solid ${cfg.border};border-radius:4px;padding:1px 6px;
      white-space:nowrap;vertical-align:middle">${cfg.text}</span>`;
  },

  /* ── Человекочитаемое действие ── */
  _actionText(badge) {
    const map = {
      'badge-intervene':     '⚠️ Нужно вмешаться',
      'badge-protect-crit':  '🔴 Под угрозой — защитить',
      'badge-protect':       '🛡️ Держать и защищать',
      'badge-invest':        '📈 Развивать',
      'badge-monitor':       '🔵 Наблюдать',
      'badge-nurture':       '🌱 Взращивать',
      'badge-evaluate':      '🔍 Оценить',
      'badge-reconsider':    '🔄 Пересмотреть',
      'badge-minimal-alert': '⚠️ Есть сигналы',
      'badge-autopilot':     '⚪ Автопилот',
    };
    return map[badge.cls] ?? badge.label;
  },

  /* ── Следующее конкретное действие ── */
  _nextAction(row) {
    const { health, badge, client: c, trend, riskPct, loyalty } = row;
    const h = health.key;
    const p = c.key_account_priority;

    if (badge.cls === 'badge-intervene')    return 'Экстренная встреча с ЛПР';
    if (badge.cls === 'badge-protect-crit') return 'Звонок сегодня — выяснить причину';
    if (riskPct > 30)                       return 'Проверить риск оттока — позвонить';
    if (trend?.direction === 'down')        return 'Тренд падает — назначить check-in';
    if (h === 'Caution')                    return 'Усилить ритм касаний';
    if (p === 'INVEST' && h === 'Healthy')  return 'Предложить расширение скоупа';
    if (p === 'MAINTAIN')                   return 'Провести QBR этот квартал';
    if (p === 'EVALUATE')                   return 'Установить дедлайн решения';
    if (loyalty !== null && loyalty < 40)   return 'Лояльность низкая — срочный контакт';
    return null;
  },

  /* ── Табы ── */
  _renderTabs() {
    const urgent = this.computed.filter(r => {
      const u = this._touchUrgency(r.client.id, r.client.bcg_category, r);
      return u === 'immediate' || r.section === 'alert';
    }).length;

    const needTouch = this.computed.filter(r => {
      const u = this._touchUrgency(r.client.id, r.client.bcg_category, r);
      return u === 'immediate' || u === 'overdue' || u === 'due';
    }).length;

    const total = this.computed.length;

    /* summary */
    const sum = document.getElementById('dash-summary');
    if (sum) {
      sum.textContent = urgent > 0
        ? `${urgent} клиент${urgent > 1 ? 'а' : ''} требуют внимания · обновлено ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}`
        : `Всё под контролем · обновлено ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}`;
      sum.style.color = urgent > 0 ? '#ef4444' : '';
    }

    const tabs = [
      { key: 'all',    label: `Все`,          count: total   },
      { key: 'urgent', label: `🔴 Внимание`,  count: urgent  },
      { key: 'touch',  label: `📍 Касания`,   count: needTouch },
    ];

    document.getElementById('dash-tabs').innerHTML = tabs.map(t => `
      <button class="dash-tab${this.activeTab === t.key ? ' active' : ''}"
              data-tab="${t.key}"
              style="padding:6px 14px;border-radius:20px;font-size:13px;font-weight:500;
                     border:1.5px solid ${this.activeTab === t.key ? '#6366f1' : 'var(--border)'};
                     background:${this.activeTab === t.key ? '#6366f1' : 'var(--surface)'};
                     color:${this.activeTab === t.key ? '#fff' : 'var(--text-secondary)'};
                     cursor:pointer;transition:all .15s">
        ${t.label} <span style="opacity:0.75;font-size:11px">${t.count}</span>
      </button>`).join('');

    document.querySelectorAll('.dash-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        this._renderTabs();
        this.renderList();
      });
    });
  },

  /* ── Фильтрация ── */
  filtered() {
    let rows = this.computed;

    if (this.searchQ) {
      rows = rows.filter(r =>
        r.client.name.toLowerCase().includes(this.searchQ)
      );
    }

    if (this.activeTab === 'urgent') {
      rows = rows.filter(r => {
        const u = this._touchUrgency(r.client.id, r.client.bcg_category, r);
        return u === 'immediate' || r.section === 'alert';
      });
    }

    if (this.activeTab === 'touch') {
      rows = rows.filter(r => {
        const u = this._touchUrgency(r.client.id, r.client.bcg_category, r);
        return u === 'immediate' || u === 'overdue' || u === 'due';
      });
    }

    return rows;
  },

  /* ── Рендер списка ── */
  renderList() {
    const rows = this.filtered();

    if (rows.length === 0) {
      document.getElementById('dash-body').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">✅</div>
          <div class="empty-state-title">
            ${this.activeTab === 'urgent' ? 'Нет срочных клиентов' :
              this.activeTab === 'touch'  ? 'Все касания в порядке' :
              'Клиенты не найдены'}
          </div>
        </div>`;
      return;
    }

    /* Сортировка: alert → work → auto, внутри по riskPct */
    const sorted = [...rows].sort((a, b) => {
      const sOrder = { alert:0, work:1, auto:2 };
      if (sOrder[a.section] !== sOrder[b.section])
        return sOrder[a.section] - sOrder[b.section];
      return (b.riskPct ?? 0) - (a.riskPct ?? 0);
    });

    const sections = [
      { key: 'alert', title: '🔴 Действуй сейчас' },
      { key: 'work',  title: '🟡 Держи под контролем' },
      { key: 'auto',  title: '⚪ Стабильные' },
    ];

    let html = '';
    for (const sec of sections) {
      const secRows = sorted.filter(r => r.section === sec.key);
      if (!secRows.length) continue;
      html += `
        <div style="margin-bottom:20px">
          <div class="section-header">
            ${sec.title}
            <span class="section-count">${secRows.length}</span>
          </div>
          ${secRows.map(r => this._renderRow(r)).join('')}
        </div>`;
    }

    /* Клиенты без данных */
    const noData = sorted.filter(r => r.bchs === null && !rows.find(x => x !== r && x.section));
    if (noData.length && this.activeTab === 'all') {
      html += `
        <div style="margin-bottom:20px">
          <div class="section-header" style="color:var(--text-muted)">
            ○ Нет данных
            <span class="section-count">${noData.length}</span>
          </div>
          ${noData.map(r => this._renderRow(r)).join('')}
        </div>`;
    }

    document.getElementById('dash-body').innerHTML = html;
    this._bindRowClicks();
  },

  /* ── Карточка клиента ── */
  _renderRow(row) {
    const c        = row.client;
    const expanded = this.expandedId === c.id;

    /* Цвет полоски слева */
    const stripColor = {
      alert: '#ef4444',
      work:  '#f59e0b',
      auto:  '#9ca3af',
    }[row.section] ?? '#9ca3af';

    const loyaltyStr = row.loyalty !== null
      ? `${row.loyalty}%${row.trend ? ' ' + (row.trend.delta > 0 ? '↗' : row.trend.delta < 0 ? '↘' : '→') : ''}`
      : '—';

    const riskStr = row.revenueAtRisk > 0
      ? `$${row.revenueAtRisk.toLocaleString('ru-RU')} риск`
      : '';

    const actionText = this._actionText(row.badge);
    const nextAction = this._nextAction(row);
    const touchBadge = this._touchBadgeHTML(c.id, c.bcg_category, row);

    const loyaltyColor = row.loyalty === null ? '#6b7280'
      : row.loyalty >= 60 ? '#10b981'
      : row.loyalty >= 40 ? '#f59e0b' : '#ef4444';

    return `
      <div class="client-row${expanded ? ' expanded' : ''}" data-id="${c.id}"
           style="border-left:3px solid ${stripColor};padding-left:12px">
        <div class="row-main" style="flex-direction:column;align-items:flex-start;gap:4px">

          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;width:100%">
            <span class="client-name" style="font-size:14px;font-weight:600">${c.name}</span>
            ${touchBadge}
            <span style="flex:1"></span>
            <span style="font-size:13px;font-weight:600;color:${loyaltyColor}">
              ${loyaltyStr}
            </span>
            ${riskStr ? `<span style="font-size:12px;color:#ef4444">${riskStr}</span>` : ''}
          </div>

          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-size:12px;font-weight:600;color:var(--text-secondary)">
              ${actionText}
            </span>
            ${nextAction ? `
              <span style="font-size:11px;color:var(--text-muted)">·</span>
              <span style="font-size:11px;color:var(--text-muted)">${nextAction}</span>
            ` : ''}
          </div>

        </div>
      </div>
      ${expanded ? this._renderExpanded(row) : ''}`;
  },

  /* ── Раскрытая карточка ── */
  _renderExpanded(row) {
    const c   = row.client;
    const bcg = BCG_CATEGORIES[c.bcg_category];

    const lastTP = (this.touchPoints || [])
      .filter(tp => String(tp.client_id) === String(c.id) && tp.completed_at)
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0];
    const lastTouchStr = lastTP
      ? this._daysAgo(new Date(lastTP.completed_at))
      : 'никогда';

    return `
      <div class="row-detail" data-detail-id="${c.id}">
        <div class="row-detail-grid">

          <div class="detail-stat">
            <span class="detail-stat-label">Лояльность</span>
            <span class="detail-stat-value">
              ${row.loyalty !== null ? row.loyalty + '%' : '—'}
            </span>
            <span class="detail-stat-sub">
              ${row.trend ? row.trend.label : 'нет тренда'}
            </span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">bCHS · Здоровье</span>
            <span class="detail-stat-value">${row.bchs !== null ? row.bchs : '—'}</span>
            <span class="detail-stat-sub">${row.health.label}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Риск выручки</span>
            <span class="detail-stat-value" style="color:${row.riskColor}">

              $${(row.revenueAtRisk || 0).toLocaleString('ru-RU')}
            </span>
            <span class="detail-stat-sub">${row.riskPct}% от MR</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Потенциал</span>
            <span class="detail-stat-value">
              ${row.pctPot !== null ? row.pctPot + '%' : '—'}
            </span>
            <span class="detail-stat-sub">от идеала ${row.ideal}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">BCG · Приоритет</span>
            <span class="detail-stat-value" style="font-size:13px">
              ${bcg ? bcg.label : '—'}
            </span>
            <span class="detail-stat-sub">${c.key_account_priority}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Последнее касание</span>
            <span class="detail-stat-value" style="font-size:13px">${lastTouchStr}</span>
            <span class="detail-stat-sub">
              план: каждые ${{KEY:14,GROWTH:21,GROWTH_EARLY:14,STABLE:42,TAIL:90}[c.bcg_category]??30}д
            </span>
          </div>

        </div>

        <div class="detail-actions">
  <button class="btn btn-primary btn-sm"
          data-action="go-detail" data-id="${c.id}">
    📊 Карточка
  </button>
  <button class="btn btn-secondary btn-sm"
          data-action="go-entry" data-id="${c.id}">
    ✎ Данные
  </button>
  <button class="btn btn-secondary btn-sm"
          data-action="touch"
          data-id="${c.id}" data-name="${c.name}">
    📍 Касание
  </button>
</div>
      </div>`;
  },

  _renderToday() {
  const now = new Date();

  const svg = {
    phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .93h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
    alert: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`,
    trendDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`,
    arrow: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    touch: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    card: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    call: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .93h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
    meet: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
    mail: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    chat: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
    chart: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  };

  const typeIcon = {
    call:    `<span style="color:#6366f1">${svg.call}</span>`,
    meeting: `<span style="color:#8b5cf6">${svg.meet}</span>`,
    qbr:     `<span style="color:#0ea5e9">${svg.chart}</span>`,
    email:   `<span style="color:#64748b">${svg.mail}</span>`,
    checkin: `<span style="color:#10b981">${svg.chat}</span>`,
  };

  // ── Блок 1: Позвони сегодня ──
  const callNow = this.computed
    .filter(r => {
      const u = this._touchUrgency(r.client.id, r.client.bcg_category, r);
      return u === 'immediate' || u === 'overdue';
    })
    .sort((a, b) => {
      const sOrder = { alert:0, work:1, auto:2 };
      if (sOrder[a.section] !== sOrder[b.section])
        return sOrder[a.section] - sOrder[b.section];
      return (b.riskPct ?? 0) - (a.riskPct ?? 0);
    })
    .slice(0, 3);

  // ── Блок 2: В риске ──
  const atRisk = this.computed
    .filter(r =>
      r.riskPct > 15 ||
      (r.trend?.direction === 'down' && r.bchs !== null && r.bchs < 20)
    )
    .filter(r => !callNow.find(x => x.client.id === r.client.id))
    .sort((a, b) => (b.riskPct ?? 0) - (a.riskPct ?? 0))
    .slice(0, 4);

  // ── Блок 3: Что изменилось ──
  const cutoff = Date.now() - 48 * 3600000;
  const recentTouches = (this.touchPoints || [])
    .filter(tp => tp.completed_at && new Date(tp.completed_at).getTime() > cutoff)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .slice(0, 5);

  const recentRows = recentTouches.map(tp => {
    const row = this.computed.find(r => String(r.client.id) === String(tp.client_id));
    if (!row) return '';
    const icon = typeIcon[tp.type] ?? `<span style="color:#94a3b8">${svg.touch}</span>`;
    const mins = Math.round((Date.now() - new Date(tp.completed_at)) / 60000);
    const timeStr = mins < 60
      ? `${mins} мин. назад`
      : mins < 1440
        ? `${Math.round(mins/60)} ч. назад`
        : `${Math.round(mins/1440)} дн. назад`;

    const firstLine = (tp.notes || '')
      .split('\n')
      .map(l => l.replace(/^[📋✅👣🎯🏁🚧]\s[\w\s]+:\n?/, '').trim())
      .find(l => l.length > 3) ?? '';
    const preview = firstLine.slice(0, 72) + (firstLine.length > 72 ? '…' : '');

    return `
      <div style="display:flex;align-items:flex-start;gap:12px;
                  padding:11px 14px;border-radius:10px;
                  background:var(--surface);border:1px solid var(--border);
                  margin-bottom:7px;cursor:pointer;transition:background .12s"
           onmouseover="this.style.background='#f8fafc'"
           onmouseout="this.style.background='var(--surface)'"
           data-action="go-detail" data-id="${row.client.id}">
        <div style="width:32px;height:32px;border-radius:8px;background:#f1f5f9;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${icon}
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;justify-content:space-between;
                      align-items:center;gap:8px">
            <span style="font-size:13px;font-weight:600;
                         color:var(--text-primary)">${row.client.name}</span>
            <span style="font-size:11px;color:var(--text-muted);
                         white-space:nowrap;flex-shrink:0">${timeStr}</span>
          </div>
          ${preview ? `
            <div style="font-size:12px;color:var(--text-muted);margin-top:3px;
                        overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              ${preview}
            </div>` : ''}
        </div>
        <div style="color:#cbd5e1;flex-shrink:0;margin-top:2px">${svg.arrow}</div>
      </div>`;
  }).join('');

  // ── Карточка приоритета ──
  const quickCard = (row, rank) => {
    const c = row.client;
    const urgency = this._touchUrgency(c.id, c.bcg_category, row);
    const isPrimary = urgency === 'immediate';

    const accentColor  = isPrimary ? '#f87171' : '#fbbf24';
    const bgColor      = isPrimary ? '#fff1f2' : '#fffbeb';
    const borderColor  = isPrimary ? '#fecaca' : '#fde68a';
    const badgeColor   = isPrimary ? '#fca5a5' : '#fcd34d';
    const badgeText    = isPrimary ? 'срочно'  : 'скоро';

    const nextAct = this._nextAction(row) ?? 'Записать касание';
    const loyaltyStr = row.loyalty !== null ? `${row.loyalty}%` : '—';
    const loyaltyColor = row.loyalty === null ? '#94a3b8'
      : row.loyalty >= 60 ? '#4ade80'
      : row.loyalty >= 40 ? '#fbbf24' : '#f87171';

    return `
      <div style="background:${bgColor};border:1px solid ${borderColor};
                  border-radius:14px;padding:16px 18px;margin-bottom:10px;
                  position:relative">
        <div style="display:flex;align-items:flex-start;
                    justify-content:space-between;gap:12px;margin-bottom:10px">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span style="font-size:11px;font-weight:600;
                           color:${accentColor};background:${badgeColor}40;
                           border-radius:6px;padding:2px 8px;letter-spacing:.03em">
                #${rank} · ${badgeText}
              </span>
            </div>
            <div style="font-size:15px;font-weight:700;
                        color:#0f172a;line-height:1.3">${c.name}</div>
            <div style="font-size:12px;color:#64748b;margin-top:3px">${nextAct}</div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:16px;font-weight:700;color:${loyaltyColor}">
              ${loyaltyStr}
            </div>
            <div style="font-size:10px;color:#94a3b8;margin-top:1px">лояльность</div>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm"
                  data-action="touch"
                  data-id="${c.id}" data-name="${c.name}"
                  style="display:flex;align-items:center;gap:6px;
                         background:${accentColor};border:none;color:#fff;
                         border-radius:8px;padding:7px 14px;font-size:12px;
                         font-weight:600;cursor:pointer;transition:opacity .15s"
                  onmouseover="this.style.opacity='.85'"
                  onmouseout="this.style.opacity='1'">
            ${svg.touch} Касание
          </button>
          <button class="btn btn-sm"
                  data-action="go-detail" data-id="${c.id}"
                  style="display:flex;align-items:center;gap:6px;
                         background:#fff;border:1px solid ${borderColor};
                         color:#475569;border-radius:8px;padding:7px 14px;
                         font-size:12px;font-weight:500;cursor:pointer;
                         transition:background .12s"
                  onmouseover="this.style.background='#f8fafc'"
                  onmouseout="this.style.background='#fff'">
            ${svg.card} Карточка
          </button>
        </div>
      </div>`;
  };

  // ── Карточка риска ──
  const riskCard = (row) => {
    const c = row.client;
    const isHigh = row.riskPct > 30;
    const accentColor = isHigh ? '#f87171' : '#fbbf24';
    const bgColor     = isHigh ? '#fff1f2' : '#fffbeb';
    const borderColor = isHigh ? '#fecaca' : '#fde68a';

    return `
      <div style="display:flex;align-items:center;gap:12px;
                  padding:12px 14px;border-radius:10px;
                  background:${bgColor};border:1px solid ${borderColor};
                  margin-bottom:8px">
        <div style="width:34px;height:34px;border-radius:9px;
                    background:${accentColor}25;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;
                    color:${accentColor}">
          ${svg.alert}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:#0f172a">${c.name}</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px">
            ${row.riskPct}% риск выручки
            ${row.trend?.direction === 'down'
              ? `<span style="color:#f87171;margin-left:6px;
                              display:inline-flex;align-items:center;gap:3px;
                              vertical-align:middle">
                   ${svg.trendDown} тренд падает
                 </span>`
              : ''}
          </div>
        </div>
        <button class="btn btn-sm"
                data-action="touch"
                data-id="${c.id}" data-name="${c.name}"
                style="display:flex;align-items:center;gap:6px;
                       background:#fff;border:1px solid ${borderColor};
                       color:#475569;border-radius:8px;padding:7px 12px;
                       font-size:12px;font-weight:500;cursor:pointer;
                       white-space:nowrap;flex-shrink:0;transition:background .12s"
                onmouseover="this.style.background='#f8fafc'"
                onmouseout="this.style.background='#fff'">
          ${svg.touch} Касание
        </button>
      </div>`;
  };

  const greetHour = now.getHours();
  const greet = greetHour < 12 ? 'Доброе утро'
    : greetHour < 17 ? 'Добрый день'
    : 'Добрый вечер';
  const dateStr = now.toLocaleDateString('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  document.getElementById('dash-body').innerHTML = `

    <div style="margin-bottom:24px">
      <div style="font-size:20px;font-weight:700;
                  color:var(--text-primary);letter-spacing:-.02em">${greet}</div>
      <div style="font-size:13px;color:var(--text-muted);
                  margin-top:3px;text-transform:capitalize">${dateStr}</div>
    </div>

    <div style="margin-bottom:28px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <div style="width:28px;height:28px;border-radius:8px;background:#ede9fe;
                    display:flex;align-items:center;justify-content:center;
                    color:#7c3aed">
          ${svg.phone}
        </div>
        <span style="font-size:13px;font-weight:700;
                     color:var(--text-primary);letter-spacing:-.01em">
          Позвони сегодня
        </span>
        <span style="font-size:11px;color:#94a3b8;
                     background:#f1f5f9;border-radius:10px;
                     padding:1px 8px">${callNow.length}</span>
      </div>
      ${callNow.length
        ? callNow.map((r, i) => quickCard(r, i + 1)).join('')
        : `<div style="padding:20px;text-align:center;color:#94a3b8;
                        font-size:13px;background:#f8fafc;border-radius:10px;
                        border:1px dashed #e2e8f0;
                        display:flex;align-items:center;justify-content:center;gap:8px">
             <span style="color:#86efac">${svg.check}</span>
             Срочных нет — всё под контролем
           </div>`}
    </div>

    ${atRisk.length ? `
      <div style="margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
          <div style="width:28px;height:28px;border-radius:8px;background:#fef3c7;
                      display:flex;align-items:center;justify-content:center;
                      color:#d97706">
            ${svg.alert}
          </div>
          <span style="font-size:13px;font-weight:700;
                       color:var(--text-primary);letter-spacing:-.01em">
            В риске
          </span>
          <span style="font-size:11px;color:#94a3b8;
                       background:#f1f5f9;border-radius:10px;
                       padding:1px 8px">${atRisk.length}</span>
        </div>
        ${atRisk.map(r => riskCard(r)).join('')}
      </div>` : ''}

    ${recentTouches.length ? `
      <div style="margin-bottom:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
          <div style="width:28px;height:28px;border-radius:8px;background:#e0f2fe;
                      display:flex;align-items:center;justify-content:center;
                      color:#0284c7">
            ${svg.refresh}
          </div>
          <span style="font-size:13px;font-weight:700;
                       color:var(--text-primary);letter-spacing:-.01em">
            Что изменилось
          </span>
          <span style="font-size:11px;color:#94a3b8;
                       background:#f1f5f9;border-radius:10px;
                       padding:1px 8px">${recentTouches.length}</span>
        </div>
        ${recentRows}
      </div>` : ''}

    ${!callNow.length && !atRisk.length && !recentTouches.length ? `
      <div style="text-align:center;padding:56px 20px">
        <div style="width:56px;height:56px;border-radius:16px;background:#f0fdf4;
                    display:flex;align-items:center;justify-content:center;
                    margin:0 auto 16px;color:#4ade80">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div style="font-size:16px;font-weight:700;
                    color:var(--text-primary);margin-bottom:6px">
          Всё под контролем
        </div>
        <div style="font-size:13px;color:#94a3b8;line-height:1.6">
          Нет срочных задач · Портфель в хорошем состоянии
        </div>
      </div>` : ''}`;

  this._bindRowClicks();
},

  _daysAgo(date) {
    const days = Math.round((Date.now() - date.getTime()) / 86400000);
    if (days === 0) return 'сегодня';
    if (days === 1) return 'вчера';
    if (days < 7)   return `${days} дн. назад`;
    if (days < 30)  return `${Math.round(days/7)} нед. назад`;
    return `${Math.round(days/30)} мес. назад`;
  },

  _bindRowClicks() {
    document.querySelectorAll('.client-row').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        const id = el.dataset.id;
        this.expandedId = this.expandedId === id ? null : id;
        this.renderList();
        document.getElementById('dash-search').value = this.searchQ;
      });
    });

    document.querySelectorAll('[data-action="go-detail"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        window.App.navigate('detail', btn.dataset.id);
      });
    });

    document.querySelectorAll('[data-action="go-entry"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        window.App.navigate('entry', btn.dataset.id);
      });
    });

    document.querySelectorAll('[data-action="touch"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this._openTouchModal(btn.dataset.id, btn.dataset.name);
      });
    });
  },

  /* ══ STATUS MODAL ══ */
  openStatusModal(clientId, clientName) {
    const now = new Date();
    const monthOpts = MONTHS_RU.map((m, i) =>
      `<option value="${i+1}" ${i+1 === now.getMonth()+1 ? 'selected' : ''}>${m}</option>`
    ).join('');
    const yearOpts = [now.getFullYear()-1, now.getFullYear(), now.getFullYear()+1]
      .map(y => `<option value="${y}" ${y === now.getFullYear() ? 'selected' : ''}>${y}</option>`)
      .join('');

    window.App.openModal(`
      <div style="padding:4px 0 16px">
        <div style="font-size:16px;font-weight:600;margin-bottom:4px">📝 Статус клиента</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">${clientName}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <select class="form-select" id="status-month" style="flex:1">${monthOpts}</select>
        <select class="form-select" id="status-year"  style="flex:1">${yearOpts}</select>
      </div>
      <textarea id="status-text" class="form-textarea" rows="5"
        placeholder="Опишите что происходило с клиентом в этом месяце..."
        style="width:100%;resize:vertical;min-height:100px;margin-bottom:10px"></textarea>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" id="status-ai-btn">🤖 Распознать сигналы</button>
        <span id="status-ai-status" style="font-size:12px;color:var(--text-muted)"></span>
      </div>
      <div id="status-ai-result" class="hidden"
           style="margin-bottom:14px;padding:10px 14px;background:rgba(16,185,129,0.08);
                  border:1px solid rgba(16,185,129,0.2);border-radius:8px;font-size:12px;
                  color:var(--text-secondary);line-height:1.6"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary btn-sm" id="status-cancel-btn">Отмена</button>
        <button class="btn btn-primary btn-sm"   id="status-save-btn">💾 Сохранить</button>
      </div>`);

    document.getElementById('status-cancel-btn')
      .addEventListener('click', () => window.App.closeModal());
    document.getElementById('status-ai-btn')
      .addEventListener('click', () => this._runStatusAI());
    document.getElementById('status-save-btn')
      .addEventListener('click', () => this._saveStatus(clientId));
  },

  async _runStatusAI() {
    const text = (document.getElementById('status-text')?.value || '').trim();
    if (!text) { window.App.toast('Введите текст статуса', 'error'); return; }
    const btn    = document.getElementById('status-ai-btn');
    const status = document.getElementById('status-ai-status');
    const result = document.getElementById('status-ai-result');
    btn.disabled = true; btn.textContent = '⏳ Анализирую...';
    status.textContent = 'Отправляю запрос...';
    try {
      const data = await API.callAI({ type: 'status', text });
      const content = data?.choices?.[0]?.message?.content ?? '';
      const match   = content.match(/\{[\s\S]*\}/);
      const parsed  = JSON.parse(match ? match[0] : content);
      document.getElementById('status-save-btn').dataset.parsed = JSON.stringify(parsed);
      const count = Object.values(parsed.signals || {}).filter(Boolean).length;
      result.classList.remove('hidden');
      result.innerHTML = `
        <strong>✅ Найдено сигналов: ${count}</strong>
        ${parsed.explanation
          ? `<div style="margin-top:4px;color:var(--text-muted);font-style:italic">💡 ${parsed.explanation}</div>`
          : ''}
        <div style="margin-top:4px;font-size:11px;color:var(--text-muted)">
          Нажмите «Сохранить» чтобы применить
        </div>`;
      status.textContent = `✅ ${count} сигналов`;
      window.App.toast(`🤖 AI нашёл ${count} сигналов`, 'success');
    } catch (e) {
      status.textContent = '❌ Ошибка';
      window.App.toast('Ошибка AI: ' + e.message, 'error');
    } finally {
      btn.disabled = false; btn.textContent = '🤖 Распознать сигналы';
    }
  },

  async _saveStatus(clientId) {
    const month   = parseInt(document.getElementById('status-month').value);
    const year    = parseInt(document.getElementById('status-year').value);
    const text    = (document.getElementById('status-text')?.value || '').trim();
    const rawData = document.getElementById('status-save-btn').dataset.parsed;
    const parsed  = rawData ? JSON.parse(rawData) : null;
    const saveBtn = document.getElementById('status-save-btn');
    saveBtn.disabled = true; saveBtn.textContent = '⏳ Сохраняем...';
    try {
      const signalData = {};
      for (const key of Object.keys(SIGNALS)) {
        signalData[key] = !!(parsed?.signals?.[key]);
      }
      if (text) signalData.status_note = text;
      const pcData = {};
      for (const key of Object.keys(PC_CRITERIA)) {
        const val = parsed?.pc?.[key];
        pcData[key] = (val >= 1 && val <= 5) ? val : null;
      }
      await Promise.all([
        API.saveBCHSEntry(clientId, month, year, signalData),
        API.savePCEntry(clientId, month, year, pcData),
      ]);
      API.clearCache();
      window.App.closeModal();
      window.App.toast('✅ Статус сохранён!', 'success');
      await this.load();
    } catch (err) {
      window.App.toast('❌ Ошибка сохранения', 'error');
    } finally {
      saveBtn.disabled = false; saveBtn.textContent = '💾 Сохранить';
    }
  },

  /* ══ TOUCH MODAL ══ */
  _openTouchModal(clientId, clientName) {
  const now = new Date();
  const monthOpts = MONTHS_RU.map((m, i) =>
    `<option value="${i+1}" ${i+1 === now.getMonth()+1 ? 'selected':''}>${m}</option>`
  ).join('');
  const yearOpts = [now.getFullYear()-1, now.getFullYear(), now.getFullYear()+1]
    .map(y => `<option value="${y}" ${y===now.getFullYear()?'selected':''}>${y}</option>`)
    .join('');
  const typeOpts = [
    ['call','📞 Звонок'],['meeting','🤝 Встреча'],
    ['qbr','📊 QBR'],['email','📧 Email'],['checkin','💬 Check-in'],
  ].map(([k,v]) => `<option value="${k}">${v}</option>`).join('');

  // ── состояние wizard ──
  let currentStep = 0;
  let parsedAI    = null;

  const steps = [
    { emoji:'📋', title:'Транскрипт',  hint:'Вставь запись звонка или заметки — AI заполнит всё сам' },
    { emoji:'📝', title:'Основное',    hint:'Проверь и дополни главное'                               },
    { emoji:'🎯', title:'Детали',      hint:'Стратегия, результат, блокеры — если нужно'              },
  ];

  // ── инжектим стили один раз ──
  if (!document.getElementById('touch-wiz-styles')) {
    const s = document.createElement('style');
    s.id = 'touch-wiz-styles';
    s.textContent = `
      .tw-label {
        font-size:11px;font-weight:700;color:#94a3b8;
        text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;display:block
      }
      .tw-field { display:flex;flex-direction:column }
            .tw-textarea {
  width:100%;box-sizing:border-box;
  resize:none;overflow-y:auto;
  font-size:13px;line-height:1.6;
  border:1.5px solid #e2e8f0;border-radius:10px;
  padding:12px 14px;background:#f8fafc;
  transition:border-color .15s, background .15s;
  font-family:inherit;
  min-height:80px;
  max-height:220px;
}
.tw-textarea:focus {
  border-color:#6366f1;outline:none;
  background:#fff;box-shadow:0 0 0 3px #e0e7ff
}
    `;
    document.head.appendChild(s);
  }

  // ── прогресс-бар ──
  const progressHTML = () => steps.map((s, i) => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">
      <div style="
        width:36px;height:36px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:15px;transition:all .2s;
        ${i < currentStep
          ? 'background:#22c55e;color:#fff;box-shadow:0 2px 8px #86efac'
          : i === currentStep
            ? 'background:#6366f1;color:#fff;box-shadow:0 2px 10px #c7d2fe'
            : 'background:#f1f5f9;color:#94a3b8'}
      ">${i < currentStep ? '✓' : s.emoji}</div>
      <div style="font-size:10px;font-weight:${i===currentStep?'700':'500'};
        color:${i===currentStep?'#6366f1':i<currentStep?'#22c55e':'#94a3b8'}">
        ${s.title}
      </div>
    </div>
    ${i < steps.length-1 ? `
      <div style="flex:1;height:2px;margin-top:18px;max-width:48px;border-radius:2px;
        background:${i < currentStep ? '#86efac' : '#e2e8f0'}"></div>
    ` : ''}
  `).join('');

  // ── тело каждого шага ──
  const stepBody = () => {
    if (currentStep === 0) return `

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">
        <div class="tw-field">
          <label class="tw-label">Тип</label>
          <select class="form-select" id="touch-type">${typeOpts}</select>
        </div>
        <div class="tw-field">
          <label class="tw-label">Месяц</label>
          <select class="form-select" id="touch-month">${monthOpts}</select>
        </div>
        <div class="tw-field">
          <label class="tw-label">Год</label>
          <select class="form-select" id="touch-year">${yearOpts}</select>
        </div>
      </div>

      <div class="tw-field">
        <label class="tw-label">Транскрипт или заметки</label>
                <textarea id="touch-ai-input" class="tw-textarea"
          style="min-height:120px;max-height:320px"
          placeholder="Вставь транскрипт Bluedot..."></textarea>

AI сам разберёт структуру, выделит задачи, шаги и сигналы по клиенту."></textarea>
      </div>

      <div style="display:flex;gap:10px;align-items:center;margin-top:14px">
        <button id="touch-ai-btn" class="btn btn-primary"
                style="background:#6366f1;border-color:#6366f1;min-width:130px">
          🤖 Разобрать
        </button>
        <span id="touch-ai-status" style="font-size:12px;color:var(--text-muted)"></span>
      </div>

      <div id="touch-ai-result" class="hidden"
           style="margin-top:14px;padding:12px 14px;
                  background:rgba(16,185,129,0.08);
                  border:1px solid rgba(16,185,129,0.2);
                  border-radius:8px;font-size:13px;
                  color:var(--text-secondary);line-height:1.6"></div>`;

    if (currentStep === 1) return `
      <div style="display:flex;flex-direction:column;gap:18px">

        <div class="tw-field">
          <label class="tw-label">📋 Контекст</label>
          <textarea id="touch-context" class="tw-textarea"
            placeholder="Что обсудили, общая ситуация по клиенту...">${_saved('touch-context')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">✅ Задачи</label>
          <textarea id="touch-tasks" class="tw-textarea"
            placeholder="Что нужно сделать по итогам встречи...">${_saved('touch-tasks')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">👣 Дальнейшие шаги</label>
          <textarea id="touch-next" class="tw-textarea"
            placeholder="Следующие действия и договорённости...">${_saved('touch-next')}</textarea>
        </div>

      </div>`;

    if (currentStep === 2) return `
      <div style="display:flex;flex-direction:column;gap:18px">

        <div class="tw-field">
          <label class="tw-label">🎯 Стратегия</label>
          <textarea id="touch-strategy" class="tw-textarea"
            placeholder="Стратегические заметки по этому клиенту...">${_saved('touch-strategy')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">🏁 Ожидаемый результат</label>
          <textarea id="touch-outcome" class="tw-textarea"
            placeholder="Чего ожидаем достичь в ближайшее время...">${_saved('touch-outcome')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">🚧 Блокеры</label>
          <textarea id="touch-blockers" class="tw-textarea"
            placeholder="Что может помешать или замедлить работу...">${_saved('touch-blockers')}</textarea>
        </div>

      </div>`;

    return '';
  };

  // ── кэш значений между шагами ──
  const saved = {};
  const _save = () => {
    ['touch-context','touch-tasks','touch-next',
     'touch-strategy','touch-outcome','touch-blockers',
     'touch-type','touch-month','touch-year','touch-ai-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) saved[id] = el.value;
    });
  };
  const _saved = id => saved[id] ?? '';

    // ── рендер чекбоксов сигналов ──
  const _buildSignalCheckboxes = (parsed) => {
    const activeSigs = Object.entries(parsed.signals || {})
      .filter(([, v]) => v);
    const activePc = Object.entries(parsed.pc || {})
      .filter(([, v]) => v >= 1 && v <= 5);

    if (!activeSigs.length && !activePc.length) return '';

    const sigRows = activeSigs.map(([key]) => {
      const def = SIGNALS[key];
      if (!def) return '';
      const weight = def.weight ?? 0;
      const color  = weight > 0 ? '#10b981' : '#ef4444';
      const sign   = weight > 0 ? '+' : '';
      return `
        <label style="display:flex;align-items:center;gap:10px;padding:7px 10px;
                       border-radius:8px;cursor:pointer;transition:background .12s;
                       border:1px solid transparent"
               onmouseover="this.style.background='#f8fafc'"
               onmouseout="this.style.background='transparent'">
          <input type="checkbox" class="ai-sig-cb" data-key="${key}"
                 checked style="width:15px;height:15px;accent-color:#6366f1;cursor:pointer">
          <span style="flex:1;font-size:13px;color:var(--text-primary)">${def.label ?? key}</span>
          <span style="font-size:12px;font-weight:700;color:${color};min-width:32px;text-align:right">
            ${sign}${weight}
          </span>
        </label>`;
    }).join('');

    const pcRows = activePc.map(([key, val]) => {
      const def = PC_CRITERIA[key];
      if (!def) return '';
      return `
        <label style="display:flex;align-items:center;gap:10px;padding:7px 10px;
                       border-radius:8px;cursor:pointer;transition:background .12s;
                       border:1px solid transparent"
               onmouseover="this.style.background='#f8fafc'"
               onmouseout="this.style.background='transparent'">
          <input type="checkbox" class="ai-pc-cb" data-key="${key}"
                 checked style="width:15px;height:15px;accent-color:#6366f1;cursor:pointer">
          <span style="flex:1;font-size:13px;color:var(--text-primary)">${def.label ?? key}</span>
          <span style="font-size:12px;font-weight:700;color:#6366f1;min-width:32px;text-align:right">
            ${val}/5
          </span>
        </label>`;
    }).join('');

    return `
      <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
        ${sigRows ? `
          <div style="padding:8px 10px 4px;background:#f8fafc;border-bottom:1px solid #e2e8f0">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;
                          letter-spacing:.06em;color:#94a3b8">bCHS сигналы</span>
          </div>
          <div style="padding:4px 0">${sigRows}</div>` : ''}
        ${activePc.length ? `
          <div style="padding:8px 10px 4px;background:#f8fafc;
                       border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;
                          letter-spacing:.06em;color:#94a3b8">PC Score</span>
          </div>
          <div style="padding:4px 0">${pcRows}</div>` : ''}
      </div>`;
  };

  // ── шаблон модалки ──
  const buildHTML = () => `
    <div style="padding:24px 28px;width:100%;max-width:520px;box-sizing:border-box">

      <div style="margin-bottom:6px">
        <div style="font-size:17px;font-weight:700;color:#0f172a">📍 Касание</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:2px">${clientName}</div>
      </div>

      <div style="display:flex;align-items:center;margin:20px 0">
        ${progressHTML()}
      </div>

      <div style="border-top:1px solid #f1f5f9;padding-top:20px" id="touch-step-body">
        ${stepBody()}
      </div>

      <div style="display:flex;gap:10px;margin-top:24px;align-items:center;
                  border-top:1px solid #f1f5f9;padding-top:16px">
        ${currentStep > 0
          ? `<button id="tw-back" class="btn btn-secondary" style="min-width:90px">← Назад</button>`
          : ''}
        <div style="flex:1"></div>
        <button id="tw-cancel" class="btn btn-secondary">Отмена</button>
        ${currentStep < steps.length-1
          ? `<button id="tw-next" class="btn btn-primary" style="min-width:110px">Далее →</button>`
          : `<button id="tw-save" class="btn btn-primary" style="min-width:150px">✓ Сохранить касание</button>`
        }
      </div>

    </div>`;

  // ── перерисовка ──
  const rerender = () => {
    const wrap = document.querySelector('#modal-overlay > div, .modal-inner, .modal-content');
    if (wrap) wrap.innerHTML = buildHTML();
    bindStep();
  };

  // ── биндинг шага ──
  const bindStep = () => {
    document.getElementById('tw-cancel')
      ?.addEventListener('click', () => window.App.closeModal?.());

    document.getElementById('tw-back')
      ?.addEventListener('click', () => { _save(); currentStep--; rerender(); });

    document.getElementById('tw-next')
      ?.addEventListener('click', () => {
        _save();
        if (currentStep === 0) {
          const hasTranscript = (saved['touch-ai-input'] ?? '').trim().length > 0;
          const hasContent    = parsedAI !== null;
          if (!hasTranscript) {
            window.App.toast?.('Вставь транскрипт или заметки', 'error');
            return;
          }
          if (!hasContent) {
            window.App.toast?.('Рекомендуем нажать "Разобрать" — AI заполнит поля автоматически', '');
          }
        }
        currentStep++;
        rerender();
      });

    document.getElementById('tw-save')
      ?.addEventListener('click', () => { _save(); _doSave(); });

    // AI кнопка на шаге 0
    document.getElementById('touch-ai-btn')?.addEventListener('click', async () => {
      const text = (document.getElementById('touch-ai-input')?.value ?? '').trim();
      if (!text) { window.App.toast?.('Вставь транскрипт', 'error'); return; }

      const btn   = document.getElementById('touch-ai-btn');
      const aiSt  = document.getElementById('touch-ai-status');
      const aiRes = document.getElementById('touch-ai-result');
      btn.disabled = true; btn.textContent = '⏳ Анализирую...';
      aiSt.textContent = 'Отправляю запрос...';

      try {
        const data = await API.callAI({
          type:        'touch',
          client_name: clientName,
          transcript:  text,
          max_tokens:  1400,
        });

        const content = data?.choices?.[0]?.message?.content ?? '';
        const match   = content.match(/\{[\s\S]*\}/);
        parsedAI      = JSON.parse(match ? match[0] : content);

        if (parsedAI.context)  saved['touch-context']  = parsedAI.context;
        if (parsedAI.tasks)    saved['touch-tasks']     = parsedAI.tasks;
        if (parsedAI.next)     saved['touch-next']      = parsedAI.next;
        if (parsedAI.strategy) saved['touch-strategy']  = parsedAI.strategy;
        if (parsedAI.outcome)  saved['touch-outcome']   = parsedAI.outcome;
        if (parsedAI.blockers) saved['touch-blockers']  = parsedAI.blockers;

                const signalCount = Object.values(parsedAI.signals || {}).filter(Boolean).length;
        aiRes.classList.remove('hidden');
        aiRes.innerHTML = `
          <div style="margin-bottom:10px">
            <strong>✅ Структура заполнена · ${signalCount} сигналов</strong>
            ${parsedAI.explanation
              ? `<div style="margin-top:4px;color:var(--text-muted);font-style:italic;font-size:12px">
                   💡 ${parsedAI.explanation}
                 </div>`
              : ''}
          </div>
          ${_buildSignalCheckboxes(parsedAI)}
          <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">
            Сними галочку если AI ошибся — остальные сохранятся
          </div>`;
        aiSt.textContent = '✅ готово';

      } catch (e) {
        aiSt.textContent = '❌ Ошибка';
        window.App.toast?.('Ошибка AI: ' + e.message, 'error');
      } finally {
        btn.disabled = false; btn.textContent = '🤖 Разобрать';
      }
    });

        // ── авторесайз — всегда после рендера ──
        document.querySelectorAll('.tw-textarea').forEach(el => {
      const resize = () => {
        el.style.height = 'auto';
        const max = 220;
        const next = Math.min(el.scrollHeight, max);
        el.style.height = next + 'px';
        el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
      };
      resize();
      el.addEventListener('input', resize);
    });
  };  // конец bindStep

  // ── финальное сохранение ──
  const _doSave = async () => {
    const g    = id => (saved[id] ?? '').trim();
    const type  = g('touch-type') || 'checkin';
    const month = parseInt(saved['touch-month'] ?? now.getMonth()+1);
    const year  = parseInt(saved['touch-year']  ?? now.getFullYear());

    const parts = [
      g('touch-context')  && `📋 Контекст:\n${g('touch-context')}`,
      g('touch-tasks')    && `✅ Задачи:\n${g('touch-tasks')}`,
      g('touch-next')     && `👣 Дальнейшие шаги:\n${g('touch-next')}`,
      g('touch-strategy') && `🎯 Стратегия:\n${g('touch-strategy')}`,
      g('touch-outcome')  && `🏁 Ожидаемый результат:\n${g('touch-outcome')}`,
      g('touch-blockers') && `🚧 Блокеры:\n${g('touch-blockers')}`,
    ].filter(Boolean);

    if (!parts.length) {
      window.App.toast?.('Заполни хотя бы контекст на шаге 2', 'error');
      currentStep = 1; rerender(); return;
    }

    const notes   = parts.join('\n\n');
    const saveBtn = document.getElementById('tw-save');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳ Сохраняем...'; }

    try {
      await API.saveTouchPoint({
        client_id: clientId, type,
        completed_at: new Date().toISOString(), notes,
      });

            if (parsedAI?.signals) {
        // Берём только отмеченные чекбоксы — пользователь мог снять лишние
        const checkedSigs = new Set(
          [...document.querySelectorAll('.ai-sig-cb:checked')].map(el => el.dataset.key)
        );
        const checkedPc = new Set(
          [...document.querySelectorAll('.ai-pc-cb:checked')].map(el => el.dataset.key)
        );
        const signalData = {};
        for (const key of Object.keys(SIGNALS)) {
          signalData[key] = !!(parsedAI.signals[key]) && checkedSigs.has(key);
        }
        signalData.status_note = notes;
                const pcData = {};
        for (const key of Object.keys(PC_CRITERIA)) {
          const val = parsedAI?.pc?.[key];
          pcData[key] = (val >= 1 && val <= 5) && checkedPc.has(key) ? val : null;
        }
        await Promise.all([
          API.saveBCHSEntry(clientId, month, year, signalData),
          API.savePCEntry(clientId,   month, year, pcData),
        ]);
        API.clearCache();
      }

      this.touchPoints.push({
        client_id: clientId, type,
        completed_at: new Date().toISOString(), notes,
      });

      window.App.closeModal?.();
      window.App.toast(
        parsedAI?.signals ? '✅ Касание сохранено, сигналы записаны' : '✅ Касание сохранено',
        'success'
      );
      await this.load();

    } catch (e) {
      window.App.toast?.('❌ Ошибка: ' + e.message, 'error');
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '✓ Сохранить касание'; }
    }
  };

  window.App.openModal(buildHTML(), { hideClose: false });
  bindStep();
},
};

