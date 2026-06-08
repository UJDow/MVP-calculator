/* ============================================
   js/pages/dashboard.js — Dashboard Page (ES Module)
   Portfolio BCHS v7.0
   ============================================ */

import { SIGNALS, PC_CRITERIA, MONTHS_RU, BCG_CATEGORIES } from '../constants.js';
import { Calc } from '../calc.js';
import { API } from '../api.js';

/* ══════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════════════════════════════════════ */

export const DashboardPage = {
  allClients: [],
  allBCHS:    [],
  allPC:      [],
  computed:   [],
  expandedId: null,
  filterBCG:    '',
  filterAction: '',
  filterHealth: '',
  searchQ:      '',

  /* ─── RENDER ──────────────────────────────────────────────── */
  async render() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-header">
        <div class="page-title">Дашборд</div>
        <div class="page-subtitle">
          Сводка по всем клиентам ·
          <span id="dash-updated">загрузка...</span>
        </div>
      </div>

      <div class="filters-bar">
        <input type="text" class="search-input" id="dash-search"
               placeholder="🔍 Поиск по клиенту..." />

        <select class="filter-select" id="filter-bcg">
          <option value="">Все BCG</option>
          <option value="KEY">⭐ KEY</option>
          <option value="GROWTH">💎 GROWTH</option>
          <option value="GROWTH_EARLY">🌱 GROWTH (early)</option>
          <option value="TAIL">📦 TAIL</option>
        </select>

        <select class="filter-select" id="filter-action">
          <option value="">Все действия</option>
          <option value="badge-intervene">🚨 INTERVENE</option>
          <option value="badge-protect-crit">🔴 PROTECT — критично</option>
          <option value="badge-protect">🟡 PROTECT — держать</option>
          <option value="badge-invest">📈 INVEST</option>
          <option value="badge-monitor">🔵 MONITOR</option>
          <option value="badge-nurture">🔵 NURTURE</option>
          <option value="badge-evaluate">🔍 EVALUATE</option>
          <option value="badge-reconsider">🔄 RECONSIDER</option>
          <option value="badge-minimal-alert">⚠️ MINIMAL — сигналы</option>
          <option value="badge-autopilot">⚪ AUTOPILOT</option>
        </select>

        <select class="filter-select" id="filter-health">
          <option value="">Все здоровье</option>
          <option value="Healthy">🟢 Здоров</option>
          <option value="Neutral">😐 Нейтрально</option>
          <option value="Caution">⚠️ Осторожно</option>
          <option value="AtRisk">🔴 Риск</option>
          <option value="none">— Нет данных</option>
        </select>
      </div>

      <div id="dash-body">
        <div class="empty-state">
          <div class="empty-state-icon">⏳</div>
          <div class="empty-state-title">Загружаем данные...</div>
        </div>
      </div>
    `;

    this.bindFilters();
    await this.load();
  },

  /* ─── FILTERS ─────────────────────────────────────────────── */
  bindFilters() {
    document.getElementById('dash-search')
      .addEventListener('input', e => {
        this.searchQ = e.target.value.toLowerCase();
        this.renderList();
      });
    document.getElementById('filter-bcg')
      .addEventListener('change', e => {
        this.filterBCG = e.target.value;
        this.renderList();
      });
    document.getElementById('filter-action')
      .addEventListener('change', e => {
        this.filterAction = e.target.value;
        this.renderList();
      });
    document.getElementById('filter-health')
      .addEventListener('change', e => {
        this.filterHealth = e.target.value;
        this.renderList();
      });
  },

  /* ─── LOAD DATA ───────────────────────────────────────────── */
  async load() {
    try {
      [this.allClients, this.allBCHS, this.allPC] = await Promise.all([
        API.getClients(),
        API.getAllBCHSEntries(),
        API.getAllPCEntries(),
      ]);

      this.computed = this.allClients.map(c => ({
        client: c,
        ...Calc.computeClient(c, this.allBCHS, this.allPC),
      }));

      const upd = document.getElementById('dash-updated');
      if (upd) {
        upd.textContent = `обновлено ${new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit', minute: '2-digit',
        })}`;
      }

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

  /* ─── FILTERING ───────────────────────────────────────────── */
  filtered() {
    return this.computed.filter(row => {
      const c = row.client;
      if (this.searchQ    && !c.name.toLowerCase().includes(this.searchQ)) return false;
      if (this.filterBCG  && c.bcg_category      !== this.filterBCG)       return false;
      if (this.filterAction && row.badge.cls      !== this.filterAction)    return false;
      if (this.filterHealth && row.health.key     !== this.filterHealth)    return false;
      return true;
    });
  },

  /* ─── RENDER LIST ─────────────────────────────────────────── */
  renderList() {
    const rows  = this.filtered();
    const alert = rows.filter(r => r.section === 'alert');
    const work  = rows.filter(r => r.section === 'work');
    const auto  = rows.filter(r => r.section === 'auto');

    let html = '';

    if (rows.length === 0) {
      html = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">Клиенты не найдены</div>
          <div class="empty-state-text">Попробуйте изменить фильтры</div>
        </div>`;
    } else {
      if (alert.length) html += this._renderSection('🔴 Требуют внимания', alert, 'section-alert');
      if (work.length)  html += this._renderSection('🟡 В работе',         work,  'section-work');
      if (auto.length)  html += this._renderSection('⚪ Автопилот / Пауза', auto,  'section-auto');
    }

    document.getElementById('dash-body').innerHTML = html;
    this._bindRowClicks();
  },

  /* ─── SECTION BLOCK ───────────────────────────────────────── */
  _renderSection(title, rows, cls) {
    return `
      <div class="dash-section ${cls}">
        <div class="section-header">
          ${title}
          <span class="section-count">${rows.length}</span>
        </div>
        ${rows.map(r => this._renderRow(r)).join('')}
      </div>`;
  },

  /* ─── ROW ─────────────────────────────────────────────────── */
  _renderRow(row) {
    const c            = row.client;
    const loyaltyStr   = row.loyalty !== null ? `${row.loyalty}%` : '—';
    const potentialStr = row.pctPot  !== null ? `${row.pctPot}%`  : '—';
    const expanded     = this.expandedId === c.id;

    return `
      <div class="client-row${expanded ? ' expanded' : ''}" data-id="${c.id}">
        <div class="row-main">
          <span class="client-name" title="${c.name}">${c.name}</span>
          <span class="badge ${row.badge.cls}">${row.badge.label}</span>
          <span class="focus-text" title="${row.focus}">${row.focus}</span>
        </div>
        <div class="row-metrics">
          <span class="health-chip"  title="Здоровье">${row.health.label}</span>
          <span class="metric-chip"  title="Лояльность %">${loyaltyStr}</span>
          <span class="metric-chip text-muted" title="% от идеала">
            ${potentialStr !== '—' ? potentialStr + ' ид.' : '—'}
          </span>
        </div>
      </div>
      ${expanded ? this._renderExpanded(row) : ''}`;
  },

  /* ─── EXPANDED ROW ────────────────────────────────────────── */
  _renderExpanded(row) {
    const c   = row.client;
    const bcg = BCG_CATEGORIES[c.bcg_category];

    const mayData = row.monthlyData?.find(d => d.month === 5 && d.year === 2026);
    const junData = row.monthlyData?.find(d => d.month === 6 && d.year === 2026);
    const julData = row.monthlyData?.find(d => d.month === 7 && d.year === 2026);

    const fmtLoyalty = d => (d && d.loyalty !== null) ? `${d.loyalty}%` : '—';

    return `
      <div class="row-detail" data-detail-id="${c.id}">
        <div class="row-detail-grid">

          <div class="detail-stat">
            <span class="detail-stat-label">BCG / Приоритет</span>
            <span class="detail-stat-value">${bcg ? bcg.label : '—'}</span>
            <span class="detail-stat-sub">Приоритет: ${c.key_account_priority}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">bCHS · Лояльность</span>
            <span class="detail-stat-value">${row.bchs !== null ? row.bchs : '—'}</span>
            <span class="detail-stat-sub">${row.loyalty !== null ? row.loyalty + '%' : '—'}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">PC · Нагрузка</span>
            <span class="detail-stat-value">${row.pcScore !== null ? row.pcScore.toFixed(1) : '—'}</span>
            <span class="detail-stat-sub">${row.load.label}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Final · Здоровье</span>
            <span class="detail-stat-value">${row.final !== null ? row.final.toFixed(1) : '—'}</span>
            <span class="detail-stat-sub">${row.health.label}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Потенциал</span>
            <span class="detail-stat-value">${row.pctPot !== null ? row.pctPot + '%' : '—'}</span>
            <span class="detail-stat-sub">от идеала ${row.ideal}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Тренд 3М</span>
            <span class="detail-stat-value ${row.trend ? row.trend.cls : ''}">
              ${row.trend ? row.trend.label : '—'}
            </span>
            <span class="detail-stat-sub">Май→Актуальный</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Лояльность по месяцам</span>
            <span class="detail-stat-value" style="font-size:13px">
              Май: ${fmtLoyalty(mayData)} · Июн: ${fmtLoyalty(junData)} · Июл: ${fmtLoyalty(julData)}
            </span>
            <span class="detail-stat-sub">история</span>
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
        </div>
      </div>`;
  },

  /* ─── ROW CLICK EVENTS ────────────────────────────────────── */
  _bindRowClicks() {
    document.querySelectorAll('.client-row').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        const id = el.dataset.id;
        this.expandedId = this.expandedId === id ? null : id;
        this.renderList();
        /* восстанавливаем значения фильтров после перерисовки */
        document.getElementById('dash-search').value   = this.searchQ;
        document.getElementById('filter-bcg').value    = this.filterBCG;
        document.getElementById('filter-action').value = this.filterAction;
        document.getElementById('filter-health').value = this.filterHealth;
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
  },

  /* ═══════════════════════════════════════════════════════════
     STATUS MODAL
     ═══════════════════════════════════════════════════════════ */
  openStatusModal(clientId, clientName) {
    const now = new Date();

    const monthOpts = MONTHS_RU.map((m, i) =>
      `<option value="${i + 1}" ${i + 1 === now.getMonth() + 1 ? 'selected' : ''}>${m}</option>`
    ).join('');

    const yearOpts = [
      now.getFullYear() - 1,
      now.getFullYear(),
      now.getFullYear() + 1,
    ].map(y =>
      `<option value="${y}" ${y === now.getFullYear() ? 'selected' : ''}>${y}</option>`
    ).join('');

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
        style="width:100%;resize:vertical;min-height:100px;margin-bottom:10px">
      </textarea>

      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" id="status-ai-btn">🤖 Распознать сигналы</button>
        <span id="status-ai-status" style="font-size:12px;color:var(--text-muted)"></span>
      </div>

      <div id="status-ai-result" class="hidden"
           style="margin-bottom:14px;padding:10px 14px;
                  background:rgba(16,185,129,0.08);
                  border:1px solid rgba(16,185,129,0.2);
                  border-radius:8px;font-size:12px;
                  color:var(--text-secondary);line-height:1.6">
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary btn-sm" id="status-cancel-btn">Отмена</button>
        <button class="btn btn-primary btn-sm"   id="status-save-btn">💾 Сохранить</button>
      </div>
    `);

    document.getElementById('status-cancel-btn')
      .addEventListener('click', () => window.App.closeModal());

    document.getElementById('status-ai-btn')
      .addEventListener('click', () => this._runStatusAI(clientId));

    document.getElementById('status-save-btn')
      .addEventListener('click', () => this._saveStatus(clientId));
  },

 async _runStatusAI() {
  const text = (document.getElementById('status-text')?.value || '').trim();
  if (!text) { window.App.toast('Введите текст статуса', 'error'); return; }

  const btn    = document.getElementById('status-ai-btn');
  const status = document.getElementById('status-ai-status');
  const result = document.getElementById('status-ai-result');

  btn.disabled       = true;
  btn.textContent    = '⏳ Анализирую...';
  status.textContent = 'Отправляю запрос...';

  try {
    const data = await API.callAI(null, {
      type: 'status',
      text,
    });

    const content = data?.choices?.[0]?.message?.content ?? '';
    const match   = content.match(/\{[\s\S]*\}/);
    const parsed  = JSON.parse(match ? match[0] : content);

    document.getElementById('status-save-btn').dataset.parsed = JSON.stringify(parsed);

    const activeCount = Object.values(parsed.signals || {}).filter(Boolean).length;

    result.classList.remove('hidden');
    result.innerHTML = `
      <div style="margin-bottom:6px">
        <strong>✅ Активных сигналов: ${activeCount}</strong>
      </div>
      ${parsed.explanation
        ? `<div style="color:var(--text-muted);font-style:italic">💡 ${parsed.explanation}</div>`
        : ''}
      <div style="margin-top:6px;font-size:11px;color:var(--text-muted)">
        ⚠️ Нажмите «Сохранить» чтобы применить
      </div>`;

    status.textContent = `✅ ${activeCount} сигналов`;
    window.App.toast(`🤖 AI нашёл ${activeCount} сигналов`, 'success');

  } catch (e) {
    console.error('[StatusModal AI]', e);
    status.textContent = '❌ Ошибка';
    window.App.toast('Ошибка AI: ' + e.message, 'error');
  } finally {
    btn.disabled    = false;
    btn.textContent = '🤖 Распознать сигналы';
  }
},



  /* ─── SAVE STATUS ─────────────────────────────────────────── */
  async _saveStatus(clientId) {
    const month   = parseInt(document.getElementById('status-month').value);
    const year    = parseInt(document.getElementById('status-year').value);
    const text    = (document.getElementById('status-text')?.value || '').trim();
    const rawData = document.getElementById('status-save-btn').dataset.parsed;
    const parsed  = rawData ? JSON.parse(rawData) : null;

    const saveBtn = document.getElementById('status-save-btn');
    saveBtn.disabled    = true;
    saveBtn.textContent = '⏳ Сохраняем...';

    try {
      const signalData = {};
      for (const key of Object.keys(SIGNALS)) {
        signalData[key] = !!(parsed?.signals?.[key]);
      }
      if (text) signalData.status_note = text;

      const pcData = {};
      for (const key of Object.keys(PC_CRITERIA)) {
        const val  = parsed?.pc?.[key];
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
      console.error('[DashboardPage._saveStatus]', err);
      window.App.toast('❌ Ошибка сохранения', 'error');
    } finally {
      saveBtn.disabled    = false;
      saveBtn.textContent = '💾 Сохранить';
    }
  },
};
