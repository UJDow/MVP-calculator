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
                  data-action="open-status"
                  data-id="${c.id}" data-name="${c.name}">
            📝 Статус
          </button>
          <button class="btn btn-secondary btn-sm"
                  data-action="touch"
                  data-id="${c.id}" data-name="${c.name}">
            📍 Касание
          </button>
        </div>
      </div>`;
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

    document.querySelectorAll('[data-action="open-status"]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this.openStatusModal(btn.dataset.id, btn.dataset.name);
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
        width:100%;box-sizing:border-box;resize:vertical;
        font-size:13px;line-height:1.6;
        border:1.5px solid #e2e8f0;border-radius:8px;
        padding:10px 12px;background:#fff;
        transition:border-color .15s;font-family:inherit
      }
      .tw-textarea:focus { border-color:#6366f1;outline:none;box-shadow:0 0 0 3px #e0e7ff }
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
          rows="10"
          placeholder="Вставь транскрипт Bluedot, заметки после звонка или просто опиши своими словами что произошло...

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
          <textarea id="touch-context" class="tw-textarea" rows="4"
            placeholder="Что обсудили, общая ситуация по клиенту...">${_saved('touch-context')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">✅ Задачи</label>
          <textarea id="touch-tasks" class="tw-textarea" rows="4"
            placeholder="Что нужно сделать по итогам встречи...">${_saved('touch-tasks')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">👣 Дальнейшие шаги</label>
          <textarea id="touch-next" class="tw-textarea" rows="4"
            placeholder="Следующие действия и договорённости...">${_saved('touch-next')}</textarea>
        </div>

      </div>`;

    if (currentStep === 2) return `
      <div style="display:flex;flex-direction:column;gap:18px">

        <div class="tw-field">
          <label class="tw-label">🎯 Стратегия</label>
          <textarea id="touch-strategy" class="tw-textarea" rows="4"
            placeholder="Стратегические заметки по этому клиенту...">${_saved('touch-strategy')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">🏁 Ожидаемый результат</label>
          <textarea id="touch-outcome" class="tw-textarea" rows="4"
            placeholder="Чего ожидаем достичь в ближайшее время...">${_saved('touch-outcome')}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label">🚧 Блокеры</label>
          <textarea id="touch-blockers" class="tw-textarea" rows="4"
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

      <div style="margin-bottom:20px">
        <div style="font-size:15px;font-weight:600;color:#0f172a">${steps[currentStep].title}</div>
        <div style="font-size:12px;color:#94a3b8;margin-top:2px">${steps[currentStep].hint}</div>
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
        // На шаге 0 — можно идти дальше только если есть контент
        if (currentStep === 0) {
          const hasTranscript = (saved['touch-ai-input'] ?? '').trim().length > 0;
          const hasContent    = parsedAI !== null;
          if (!hasTranscript) {
            window.App.toast?.('Вставь транскрипт или заметки', 'error');
            return;
          }
          // Если не разобрали — предупреждаем но не блокируем
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

        // Сохраняем в кэш сразу
        if (parsedAI.context)  saved['touch-context']  = parsedAI.context;
        if (parsedAI.tasks)    saved['touch-tasks']     = parsedAI.tasks;
        if (parsedAI.next)     saved['touch-next']      = parsedAI.next;
        if (parsedAI.strategy) saved['touch-strategy']  = parsedAI.strategy;
        if (parsedAI.outcome)  saved['touch-outcome']   = parsedAI.outcome;
        if (parsedAI.blockers) saved['touch-blockers']  = parsedAI.blockers;

        const signalCount = Object.values(parsedAI.signals || {}).filter(Boolean).length;
        aiRes.classList.remove('hidden');
        aiRes.innerHTML = `
          <strong>✅ Структура заполнена · ${signalCount} сигналов</strong>
          ${parsedAI.explanation
            ? `<div style="margin-top:5px;color:var(--text-muted);font-style:italic">
                 💡 ${parsedAI.explanation}
               </div>`
            : ''}
          <div style="margin-top:6px;font-size:11px;color:var(--text-muted)">
            На следующем шаге проверь и дополни
          </div>`;
        aiSt.textContent = '✅ готово';

      } catch (e) {
        aiSt.textContent = '❌ Ошибка';
        window.App.toast?.('Ошибка AI: ' + e.message, 'error');
      } finally {
        btn.disabled = false; btn.textContent = '🤖 Разобрать';
      }
    });
  };

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
        const signalData = {};
        for (const key of Object.keys(SIGNALS)) {
          signalData[key] = !!(parsedAI.signals[key]);
        }
        signalData.status_note = notes;
        const pcData = {};
        for (const key of Object.keys(PC_CRITERIA)) {
          const val = parsedAI?.pc?.[key];
          pcData[key] = (val >= 1 && val <= 5) ? val : null;
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
