/**
 * tracker.js — Personal Time Tracker (Standalone Reference, v1.0)
 * Встроен inline в bundle.js; этот файл — читаемая копия.
 *
 * Доступен только для ролей: service_delivery, csm_analyst
 * Таблица: my_activities { id, client_id, date, type, duration_minutes, note, billable }
 */

// ─── TrackerAPI ────────────────────────────────────────────────────────────────
const TrackerAPI = {
  _cache: null,
  _cacheTs: 0,
  TTL: 30000, // 30s

  async getAll(force = false) {
    const now = Date.now();
    if (!force && this._cache && (now - this._cacheTs) < this.TTL) return this._cache;
    const res = await fetch('tables/my_activities?limit=1000&sort=date');
    const json = await res.json();
    const rows = (json.data || []).map(r => ({
      ...r,
      duration_minutes: Number(r.duration_minutes) || 0,
      billable: r.billable === true || r.billable === 'true',
    }));
    this._cache = rows;
    this._cacheTs = now;
    return rows;
  },

  async getByClient(clientId) {
    const all = await this.getAll();
    return all.filter(r => String(r.client_id) === String(clientId));
  },

  async getToday() {
    const all = await this.getAll();
    const today = new Date().toISOString().slice(0, 10);
    return all.filter(r => r.date === today);
  },

  async getThisMonth() {
    const all = await this.getAll();
    const ym = new Date().toISOString().slice(0, 7);
    return all.filter(r => String(r.date || '').slice(0, 7) === ym);
  },

  async create(data) {
    const res = await fetch('tables/my_activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    this._cache = null;
    return await res.json();
  },

  async update(id, data) {
    const res = await fetch(`tables/my_activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    this._cache = null;
    return await res.json();
  },

  async delete(id) {
    await fetch(`tables/my_activities/${id}`, { method: 'DELETE' });
    this._cache = null;
  },

  /** Суммарные минуты из массива записей */
  sumMinutes(rows) {
    return rows.reduce((s, r) => s + (Number(r.duration_minutes) || 0), 0);
  },

  /** Минуты → "2ч 30м" */
  fmtDuration(minutes) {
    if (!minutes) return '0м';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}м`;
    if (m === 0) return `${h}ч`;
    return `${h}ч ${m}м`;
  },

  /** Минуты → "2.5" (десятичные часы) */
  fmtHours(minutes) {
    return (minutes / 60).toFixed(1);
  },
};

// ─── TrackerPage ───────────────────────────────────────────────────────────────
const TrackerPage = {
  _clients: [],
  _filterClientId: null, // URL-параметр: prefill клиента
  _editId: null,         // ID редактируемой записи

  TYPE_LABELS: {
    call:       '📞 Звонок',
    meeting:    '🤝 Встреча',
    analysis:   '🔍 Анализ',
    report:     '📄 Отчёт',
    onboarding: '🚀 Онбординг',
    support:    '🛠 Поддержка',
    other:      '🗂 Другое',
  },

  DURATION_OPTIONS: [15, 30, 45, 60, 90, 120, 180, 240],

  // ── Точка входа ──────────────────────────────────────────────────────────────
  async render(params = {}) {
    this._filterClientId = params.clientId || null;
    const el = document.getElementById('app');
    if (!el) return;

    // Роль-гард
    const role = window.CurrentRole || localStorage.getItem('user_role');
    if (role && !['service_delivery', 'csm_analyst'].includes(role)) {
      el.innerHTML = `
        <div class="trk-page">
          <div class="trk-access-denied">
            <div class="trk-denied-icon">🔒</div>
            <h2>Нет доступа</h2>
            <p>Трекер времени доступен только для ролей<br>
            <strong>Service Delivery</strong> и <strong>CSM Analyst</strong>.</p>
          </div>
        </div>`;
      return;
    }

    el.innerHTML = `<div class="trk-page"><div class="trk-loading">⏳ Загружаю данные...</div></div>`;

    try {
      // Параллельная загрузка
      const [clientsRes, allActivities] = await Promise.all([
        fetch('tables/clients?limit=200&sort=name').then(r => r.json()),
        TrackerAPI.getAll(true),
      ]);
      this._clients = clientsRes.data || [];

      const today = new Date().toISOString().slice(0, 10);
      const ym    = today.slice(0, 7);

      const todayRows = allActivities.filter(r => r.date === today);
      const monthRows = allActivities.filter(r => String(r.date || '').slice(0, 7) === ym);

      el.innerHTML = this._buildHTML(todayRows, monthRows, allActivities);
      this._bindEvents();
    } catch (e) {
      el.innerHTML = `<div class="trk-page"><div class="trk-error">Ошибка загрузки: ${e.message}</div></div>`;
    }
  },

  // ── Главный HTML ─────────────────────────────────────────────────────────────
  _buildHTML(todayRows, monthRows, allRows) {
    const todayMin  = TrackerAPI.sumMinutes(todayRows);
    const monthMin  = TrackerAPI.sumMinutes(monthRows);
    const totalMin  = TrackerAPI.sumMinutes(allRows);

    return `
<div class="trk-page">
  <!-- Шапка -->
  <header class="trk-header">
    <div class="trk-header-left">
      <h1 class="trk-title">⏱ Мой трекер</h1>
      <p class="trk-subtitle">Личные billable часы по клиентам</p>
    </div>
    <div class="trk-header-stats">
      <div class="trk-hstat">
        <span class="trk-hstat-val">${TrackerAPI.fmtHours(todayMin)}ч</span>
        <span class="trk-hstat-lbl">Сегодня</span>
      </div>
      <div class="trk-hstat trk-hstat--accent">
        <span class="trk-hstat-val">${TrackerAPI.fmtHours(monthMin)}ч</span>
        <span class="trk-hstat-lbl">Этот месяц</span>
      </div>
      <div class="trk-hstat">
        <span class="trk-hstat-val">${TrackerAPI.fmtHours(totalMin)}ч</span>
        <span class="trk-hstat-lbl">Всего</span>
      </div>
    </div>
  </header>

  <!-- Секция 1: Быстрый ввод -->
  <section class="trk-section trk-quick" id="trk-quick-section">
    <h2 class="trk-section-title">➕ Добавить активность</h2>
    <form class="trk-quick-form" id="trk-quick-form">
      <input type="date" id="trk-date" class="trk-input trk-input--date" value="${new Date().toISOString().slice(0,10)}" />
      <select id="trk-client" class="trk-input trk-input--select">
        <option value="">— Клиент —</option>
        ${this._clients.map(c =>
          `<option value="${c.id}" ${String(c.id) === String(this._filterClientId) ? 'selected' : ''}>${c.name || c.company || c.id}</option>`
        ).join('')}
      </select>
      <select id="trk-type" class="trk-input trk-input--select">
        ${Object.entries(this.TYPE_LABELS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}
      </select>
      <select id="trk-duration" class="trk-input trk-input--select trk-input--narrow">
        ${this.DURATION_OPTIONS.map(m =>
          `<option value="${m}" ${m === 30 ? 'selected' : ''}>${m < 60 ? m + 'м' : (m/60) + 'ч'}</option>`
        ).join('')}
      </select>
      <input type="text" id="trk-note" class="trk-input trk-input--note" placeholder="Заметка..." maxlength="200" />
      <label class="trk-billable-label">
        <input type="checkbox" id="trk-billable" checked />
        <span class="trk-billable-txt">Billable</span>
      </label>
      <button type="submit" class="trk-btn trk-btn--primary" id="trk-submit-btn">＋ Добавить</button>
    </form>
    <div class="trk-form-feedback" id="trk-form-feedback"></div>
  </section>

  <!-- Секция 2: Сегодня -->
  <section class="trk-section" id="trk-today-section">
    <div class="trk-section-header">
      <h2 class="trk-section-title">📅 Сегодня</h2>
      <span class="trk-section-badge">${TrackerAPI.fmtDuration(todayMin)}</span>
    </div>
    <div id="trk-today-list">
      ${this._renderTodayList(todayRows)}
    </div>
  </section>

  <!-- Секция 3: Этот месяц -->
  <section class="trk-section" id="trk-month-section">
    <div class="trk-section-header">
      <h2 class="trk-section-title">📊 Этот месяц</h2>
      <span class="trk-section-badge">${TrackerAPI.fmtDuration(monthMin)}</span>
    </div>
    ${this._renderMonthTable(monthRows)}
  </section>

  <!-- Секция 4: Инсайты -->
  <section class="trk-section" id="trk-insights-section">
    <h2 class="trk-section-title">💡 Инсайты</h2>
    <div class="trk-insights-grid">
      ${this._renderInsights(allRows, monthRows)}
    </div>
  </section>
</div>`;
  },

  // ── Сегодня: список записей ──────────────────────────────────────────────────
  _renderTodayList(rows) {
    if (rows.length === 0) {
      return `<div class="trk-empty">Пока ничего. Самое время залогировать первую активность 😊</div>`;
    }
    return `<div class="trk-activity-list">
      ${rows.map(r => this._renderActivityRow(r)).join('')}
    </div>`;
  },

  _renderActivityRow(r) {
    const clientName = this._getClientName(r.client_id);
    const typeLabel  = this.TYPE_LABELS[r.type] || r.type || '—';
    const billTag    = r.billable
      ? `<span class="trk-tag trk-tag--billable">💰 Billable</span>`
      : `<span class="trk-tag trk-tag--nb">Non-bill</span>`;
    return `
    <div class="trk-activity-row" data-id="${r.id}">
      <div class="trk-act-type">${typeLabel}</div>
      <div class="trk-act-client">${clientName}</div>
      <div class="trk-act-dur">${TrackerAPI.fmtDuration(r.duration_minutes)}</div>
      <div class="trk-act-note">${r.note || ''}</div>
      <div class="trk-act-meta">${billTag}</div>
      <div class="trk-act-actions">
        <button class="trk-act-btn trk-act-edit" data-id="${r.id}" title="Редактировать">✏️</button>
        <button class="trk-act-btn trk-act-del" data-id="${r.id}" title="Удалить">🗑</button>
      </div>
    </div>`;
  },

  // ── Месяц: таблица по клиентам ───────────────────────────────────────────────
  _renderMonthTable(rows) {
    if (rows.length === 0) {
      return `<div class="trk-empty">Активностей за этот месяц нет.</div>`;
    }

    // Группировка по клиенту
    const byClient = {};
    for (const r of rows) {
      const cid = r.client_id || '__none__';
      if (!byClient[cid]) byClient[cid] = { minutes: 0, rows: [], types: {} };
      byClient[cid].minutes += r.duration_minutes;
      byClient[cid].rows.push(r);
      byClient[cid].types[r.type] = (byClient[cid].types[r.type] || 0) + r.duration_minutes;
    }

    const totalMin = TrackerAPI.sumMinutes(rows);

    const sortedClients = Object.entries(byClient)
      .sort((a, b) => b[1].minutes - a[1].minutes);

    return `
    <div class="trk-month-table-wrap">
      <table class="trk-month-table">
        <thead>
          <tr>
            <th>Клиент</th>
            <th>Часов</th>
            <th>%</th>
            <th>Топ тип</th>
            <th>Billable</th>
          </tr>
        </thead>
        <tbody>
          ${sortedClients.map(([cid, data]) => {
            const pct = totalMin > 0 ? Math.round(data.minutes / totalMin * 100) : 0;
            const topType = Object.entries(data.types).sort((a,b) => b[1]-a[1])[0];
            const topLabel = topType ? (this.TYPE_LABELS[topType[0]] || topType[0]) : '—';
            const billMin = data.rows.filter(r => r.billable).reduce((s, r) => s + r.duration_minutes, 0);
            return `
            <tr>
              <td class="trk-mt-client">${this._getClientName(cid)}</td>
              <td class="trk-mt-hours">${TrackerAPI.fmtHours(data.minutes)}ч</td>
              <td class="trk-mt-pct">
                <div class="trk-pct-bar" style="--pct:${pct}%">${pct}%</div>
              </td>
              <td class="trk-mt-type">${topLabel}</td>
              <td class="trk-mt-bill">${TrackerAPI.fmtHours(billMin)}ч</td>
            </tr>`;
          }).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Итого</strong></td>
            <td><strong>${TrackerAPI.fmtHours(totalMin)}ч</strong></td>
            <td>${sortedClients.length} кл.</td>
            <td>—</td>
            <td><strong>${TrackerAPI.fmtHours(rows.filter(r=>r.billable).reduce((s,r)=>s+r.duration_minutes,0))}ч</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>`;
  },

  // ── Инсайты: 3 карточки ──────────────────────────────────────────────────────
  _renderInsights(allRows, monthRows) {
    const monthMin  = TrackerAPI.sumMinutes(monthRows);
    const billMin   = monthRows.filter(r => r.billable).reduce((s,r) => s + r.duration_minutes, 0);
    const billRatio = monthMin > 0 ? Math.round(billMin / monthMin * 100) : 0;

    // Топ клиент за все время
    const byClient = {};
    for (const r of allRows) {
      const cid = r.client_id || '__none__';
      byClient[cid] = (byClient[cid] || 0) + r.duration_minutes;
    }
    const topClientEntry = Object.entries(byClient).sort((a,b) => b[1]-a[1])[0];
    const topClientName  = topClientEntry ? this._getClientName(topClientEntry[0]) : '—';
    const topClientHours = topClientEntry ? TrackerAPI.fmtHours(topClientEntry[1]) : '0';

    // Топ тип за месяц
    const byType = {};
    for (const r of monthRows) {
      byType[r.type] = (byType[r.type] || 0) + r.duration_minutes;
    }
    const topTypeEntry = Object.entries(byType).sort((a,b) => b[1]-a[1])[0];
    const topTypeLabel = topTypeEntry ? (this.TYPE_LABELS[topTypeEntry[0]] || topTypeEntry[0]) : '—';
    const topTypeHours = topTypeEntry ? TrackerAPI.fmtHours(topTypeEntry[1]) : '0';

    // Средняя активность в день (этот месяц)
    const dayOfMonth = new Date().getDate();
    const avgPerDay  = dayOfMonth > 0 ? (monthMin / dayOfMonth).toFixed(0) : 0;

    return `
    <div class="trk-insight-card">
      <div class="trk-insight-icon">💰</div>
      <div class="trk-insight-body">
        <div class="trk-insight-val">${billRatio}%</div>
        <div class="trk-insight-lbl">Billable этот месяц</div>
        <div class="trk-insight-sub">${TrackerAPI.fmtHours(billMin)}ч из ${TrackerAPI.fmtHours(monthMin)}ч</div>
      </div>
      <div class="trk-insight-bar-wrap">
        <div class="trk-insight-bar" style="--val:${billRatio}%; --color: var(--green)"></div>
      </div>
    </div>

    <div class="trk-insight-card">
      <div class="trk-insight-icon">🏆</div>
      <div class="trk-insight-body">
        <div class="trk-insight-val">${topClientName}</div>
        <div class="trk-insight-lbl">Топ клиент (всего)</div>
        <div class="trk-insight-sub">${topClientHours}ч зафиксировано</div>
      </div>
    </div>

    <div class="trk-insight-card">
      <div class="trk-insight-icon">📌</div>
      <div class="trk-insight-body">
        <div class="trk-insight-val">${topTypeLabel}</div>
        <div class="trk-insight-lbl">Топ активность (месяц)</div>
        <div class="trk-insight-sub">${topTypeHours}ч · ${avgPerDay}м/день в среднем</div>
      </div>
    </div>`;
  },

  // ── Хелпер: имя клиента ──────────────────────────────────────────────────────
  _getClientName(clientId) {
    if (!clientId || clientId === '__none__') return '— без клиента —';
    const c = this._clients.find(x => String(x.id) === String(clientId));
    return c ? (c.name || c.company || clientId) : clientId;
  },

  // ── Bind Events ──────────────────────────────────────────────────────────────
  _bindEvents() {
    const form = document.getElementById('trk-quick-form');
    if (form) form.addEventListener('submit', e => this._handleSubmit(e));

    // Делегирование для edit/delete
    document.addEventListener('click', e => {
      if (e.target.classList.contains('trk-act-edit')) {
        this._openEditModal(e.target.dataset.id);
      }
      if (e.target.classList.contains('trk-act-del')) {
        this._confirmDelete(e.target.dataset.id);
      }
    });
  },

  // ── Сабмит формы ─────────────────────────────────────────────────────────────
  async _handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('trk-submit-btn');
    const fb  = document.getElementById('trk-form-feedback');

    const clientId = document.getElementById('trk-client')?.value;
    const date     = document.getElementById('trk-date')?.value;
    const type     = document.getElementById('trk-type')?.value;
    const duration = parseInt(document.getElementById('trk-duration')?.value) || 30;
    const note     = document.getElementById('trk-note')?.value || '';
    const billable = document.getElementById('trk-billable')?.checked ?? true;

    if (!clientId) {
      fb.textContent = '⚠️ Выберите клиента';
      fb.className = 'trk-form-feedback trk-form-feedback--err';
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Сохраняю...';

    try {
      if (this._editId) {
        await TrackerAPI.update(this._editId, { client_id: clientId, date, type, duration_minutes: duration, note, billable });
        this._editId = null;
        btn.textContent = '＋ Добавить';
      } else {
        await TrackerAPI.create({ client_id: clientId, date, type, duration_minutes: duration, note, billable });
      }

      fb.textContent = '✅ Сохранено!';
      fb.className = 'trk-form-feedback trk-form-feedback--ok';
      document.getElementById('trk-note').value = '';

      // Обновить секцию "Сегодня" без полного ре-рендера
      await this._refreshToday();
      await this._refreshMonthSection();

      setTimeout(() => { fb.textContent = ''; }, 2500);
    } catch (err) {
      fb.textContent = '❌ Ошибка: ' + err.message;
      fb.className = 'trk-form-feedback trk-form-feedback--err';
    } finally {
      btn.disabled = false;
      if (!this._editId) btn.textContent = '＋ Добавить';
    }
  },

  // ── Обновление секций без полного ре-рендера ─────────────────────────────────
  async _refreshToday() {
    const today = new Date().toISOString().slice(0, 10);
    const all   = await TrackerAPI.getAll(true);
    const rows  = all.filter(r => r.date === today);
    const min   = TrackerAPI.sumMinutes(rows);

    const listEl  = document.getElementById('trk-today-list');
    const badgeEl = document.querySelector('#trk-today-section .trk-section-badge');
    if (listEl)  listEl.innerHTML  = this._renderTodayList(rows);
    if (badgeEl) badgeEl.textContent = TrackerAPI.fmtDuration(min);
  },

  async _refreshMonthSection() {
    const ym  = new Date().toISOString().slice(0, 7);
    const all = await TrackerAPI.getAll();
    const rows = all.filter(r => String(r.date || '').slice(0, 7) === ym);
    const min  = TrackerAPI.sumMinutes(rows);

    const secEl   = document.getElementById('trk-month-section');
    const badgeEl = secEl?.querySelector('.trk-section-badge');
    const tableEl = secEl?.querySelector('.trk-month-table-wrap') || secEl?.querySelector('.trk-empty');
    if (badgeEl) badgeEl.textContent = TrackerAPI.fmtDuration(min);
    if (secEl) {
      const existingTable = secEl.querySelector('.trk-month-table-wrap, .trk-empty');
      if (existingTable) existingTable.outerHTML = this._renderMonthTable(rows);
    }
  },

  // ── Редактирование ────────────────────────────────────────────────────────────
  async _openEditModal(id) {
    const all = await TrackerAPI.getAll();
    const r   = all.find(x => x.id === id);
    if (!r) return;

    this._editId = id;

    // Заполнить форму значениями
    const d = document.getElementById('trk-date');
    const c = document.getElementById('trk-client');
    const t = document.getElementById('trk-type');
    const dur = document.getElementById('trk-duration');
    const n = document.getElementById('trk-note');
    const b = document.getElementById('trk-billable');
    const btn = document.getElementById('trk-submit-btn');

    if (d) d.value = r.date || '';
    if (c) c.value = r.client_id || '';
    if (t) t.value = r.type || 'call';
    if (n) n.value = r.note || '';
    if (b) b.checked = r.billable;
    if (btn) btn.textContent = '💾 Сохранить';

    // Ближайшая опция длительности
    if (dur) {
      const closest = this.DURATION_OPTIONS.reduce((prev, cur) =>
        Math.abs(cur - r.duration_minutes) < Math.abs(prev - r.duration_minutes) ? cur : prev
      );
      dur.value = closest;
    }

    // Scroll to form
    document.getElementById('trk-quick-section')?.scrollIntoView({ behavior: 'smooth' });

    const fb = document.getElementById('trk-form-feedback');
    if (fb) {
      fb.textContent = `✏️ Редактирование записи…`;
      fb.className = 'trk-form-feedback trk-form-feedback--info';
    }
  },

  // ── Удаление ──────────────────────────────────────────────────────────────────
  async _confirmDelete(id) {
    if (!confirm('Удалить эту запись?')) return;
    try {
      await TrackerAPI.delete(id);
      await this._refreshToday();
      await this._refreshMonthSection();
    } catch (e) {
      alert('Ошибка удаления: ' + e.message);
    }
  },
};

window.TrackerAPI  = TrackerAPI;
window.TrackerPage = TrackerPage;
