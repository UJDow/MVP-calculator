/* js/pages/delivery.js
   Таб "Delivery" в карточке клиента.
   FTE Dynamics: команда проекта, аллокация, плановые/фактические часы, дельта.
   Хранение: таблица fte_entries через RESTful Table API.
   members сериализуются в JSON-строку при сохранении, парсятся при чтении.
   ---------------------------------------------------------------- */

/* ══════════════════════════════════════════════════════════════
   РАСЧЁТНЫЕ ФУНКЦИИ
   ══════════════════════════════════════════════════════════════ */

/**
 * Возвращает плановые часы участника.
 * Если member.planned_hours задан — использует его.
 * Иначе — запрашивает у CalendarEngine по локации и аллокации.
 */
function getMemberPlanned(member, month) {
  if (member.planned_hours !== null && member.planned_hours !== undefined && member.planned_hours !== '') {
    return Number(member.planned_hours);
  }
  if (window.CalendarEngine) {
    return CalendarEngine.getPlannedHours(
      member.location || 'BY',
      month,
      member.allocation || 1.0
    );
  }
  // Fallback: 168 часов * аллокация
  return Math.round(168 * (member.allocation || 1.0));
}

/**
 * Плановый revenue участника за месяц.
 * planned_hours * rate_per_hour
 */
function getMemberPlannedRevenue(member, month) {
  return getMemberPlanned(member, month) * (member.rate_per_hour || 0);
}

/**
 * Фактический revenue участника.
 * actual_hours * rate_per_hour
 */
function getMemberActualRevenue(member) {
  return (member.actual_hours || 0) * (member.rate_per_hour || 0);
}

/**
 * Дельта для участника через CalendarEngine.getDelta().
 * Возвращает { delta_hours, delta_money, efficiency, status, status_label }
 */
function getMemberDelta(member, month) {
  const planned = getMemberPlanned(member, month);
  const actual  = member.actual_hours || 0;
  const rate    = member.rate_per_hour || 0;

  if (window.CalendarEngine) {
    return CalendarEngine.getDelta(planned, actual, rate);
  }

  // Fallback-расчёт без движка
  const delta_h  = actual - planned;
  const delta_m  = Math.round(delta_h * rate);
  const eff      = planned > 0 ? actual / planned : 0;
  let status, status_label;
  if (eff >= 0.95)      { status = 'ok';       status_label = 'В норме'; }
  else if (eff >= 0.80) { status = 'warning';  status_label = 'Внимание'; }
  else                  { status = 'critical'; status_label = 'Критично'; }
  return { delta_hours: delta_h, delta_money: delta_m, efficiency: eff, status, status_label };
}

/* ── Агрегаты по всей записи ──────────────────────────────── */

/** Суммарные плановые часы по всем участникам */
function getTotalPlanned(entry) {
  return entry.members.reduce((s, m) => s + getMemberPlanned(m, entry.month), 0);
}

/** Суммарные фактические часы */
function getTotalActual(entry) {
  return entry.members.reduce((s, m) => s + (m.actual_hours || 0), 0);
}

/** Суммарный плановый revenue */
function getTotalPlannedRevenue(entry) {
  return entry.members.reduce((s, m) => s + getMemberPlannedRevenue(m, entry.month), 0);
}

/** Суммарный фактический revenue */
function getTotalActualRevenue(entry) {
  return entry.members.reduce((s, m) => s + getMemberActualRevenue(m), 0);
}

/** Суммарная дельта часов */
function getTotalDeltaHours(entry) {
  return getTotalActual(entry) - getTotalPlanned(entry);
}

/** Суммарная дельта денег */
function getTotalDeltaMoney(entry) {
  return Math.round(getTotalActualRevenue(entry) - getTotalPlannedRevenue(entry));
}

/**
 * Средняя эффективность, взвешенная по плановым часам.
 */
function getAvgEfficiency(entry) {
  let totalPlanned = 0, weightedEff = 0;
  for (const m of entry.members) {
    const p = getMemberPlanned(m, entry.month);
    const d = getMemberDelta(m, entry.month);
    totalPlanned  += p;
    weightedEff   += d.efficiency * p;
  }
  return totalPlanned > 0 ? weightedEff / totalPlanned : 0;
}

/**
 * Итоговый статус записи.
 * critical если хотя бы один critical, warning если хотя бы один warning.
 */
function getEntryStatus(entry) {
  const statuses = entry.members.map(m => getMemberDelta(m, entry.month).status);
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('warning'))  return 'warning';
  return 'ok';
}

/* ── Вспомогательные утилиты ──────────────────────────────── */

/** Форматирует число с разделителями и символом валюты */
function fmtMoney(amount, currency) {
  const sym = { USD: '$', EUR: '€', PLN: 'zł', GBP: '£' }[currency] || '$';
  const abs  = Math.abs(Math.round(amount));
  const sign = amount < 0 ? '-' : (amount > 0 ? '+' : '');
  return `${sign}${sym}${abs.toLocaleString('ru-RU')}`;
}

/** Форматирует дельту часов */
function fmtDeltaH(h) {
  if (h === 0) return '±0ч';
  return `${h > 0 ? '+' : ''}${h}ч`;
}

/** Возвращает эмодзи-иконку флага локации */
function locFlag(locId) {
  const flags = { BY: '🇧🇾', PL: '🇵🇱', DE: '🇩🇪', US: '🇺🇸' };
  return flags[locId] || '🌍';
}

/** Парсит members из JSON-строки (API хранит как строку) */
function parseMembers(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

/** Сериализует members в JSON-строку для API */
function serializeMembers(arr) {
  return JSON.stringify(arr || []);
}

/** Генерирует id для нового участника */
function genMemberId() {
  return 'mbr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Форматирует YYYY-MM в читаемое название месяца */
function fmtYearMonth(ym) {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  const names  = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                   'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  return `${names[m - 1]} ${y}`;
}

/** Возвращает текущий YYYY-MM */
function currentYM() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Сдвигает YYYY-MM на delta месяцев */
function shiftYM(ym, delta) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/* ══════════════════════════════════════════════════════════════
   API — CRUD для fte_entries
   ══════════════════════════════════════════════════════════════ */

const FteAPI = {

  /** Получить все записи клиента (распарсить members) */
  async getByClient(clientId) {
    try {
      const res  = await fetch(`tables/fte_entries?limit=200`);
      const json = await res.json();
      const rows = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      return rows
        .filter(r => r.client_id === clientId)
        .map(r => ({ ...r, members: parseMembers(r.members) }));
    } catch (e) {
      console.error('[FteAPI.getByClient]', e);
      return [];
    }
  },

  /** Получить запись за конкретный month */
  async getByMonth(clientId, month) {
    const all = await this.getByClient(clientId);
    return all.find(r => r.month === month) || null;
  },

  /** Создать новую запись */
  async create(payload) {
    const body = { ...payload, members: serializeMembers(payload.members) };
    const res  = await fetch('tables/fte_entries', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const row = await res.json();
    return { ...row, members: parseMembers(row.members) };
  },

  /** Обновить запись */
  async update(id, payload) {
    const body = { ...payload, members: serializeMembers(payload.members) };
    const res  = await fetch(`tables/fte_entries/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const row = await res.json();
    return { ...row, members: parseMembers(row.members) };
  },

  /** Удалить запись */
  async remove(id) {
    await fetch(`tables/fte_entries/${id}`, { method: 'DELETE' });
  },
};

/* ══════════════════════════════════════════════════════════════
   DeliveryTab — публичный объект таба
   ══════════════════════════════════════════════════════════════ */

const DeliveryTab = {

  /* ── Состояние ────────────────────────────────────────────── */
  clientId:     null,
  activeMonth:  null,   // YYYY-MM текущего выбранного месяца
  entry:        null,   // текущая запись fte_entries или null
  allEntries:   [],     // все записи клиента

  /* ── Инициализация ────────────────────────────────────────── */
  async init(clientId) {
    this.clientId    = clientId;
    this.activeMonth = this.activeMonth || currentYM();
    await this._loadData();
    this._render();
  },

  /** Загружает данные из API */
  async _loadData() {
    try {
      this.allEntries = await FteAPI.getByClient(this.clientId);
      this.entry      = this.allEntries.find(e => e.month === this.activeMonth) || null;
    } catch (e) {
      console.error('[DeliveryTab._loadData]', e);
      this.allEntries = [];
      this.entry      = null;
    }
  },

  /* ── Основной рендер таба ────────────────────────────────── */
  async render(clientId) {
    this.clientId    = clientId;
    this.activeMonth = this.activeMonth || currentYM();
    await this._loadData();
    return this._buildHTML();
  },

  /** Перестраивает HTML и привязывает события */
  _render() {
    const container = document.getElementById('delivery-tab-root');
    if (!container) return;
    container.innerHTML = this._buildHTML();
    this._bindEvents();
  },

  /** Строит всё HTML содержимое таба */
  _buildHTML() {
    const html = `
      <div class="dtab-wrap" id="delivery-tab-root">
        ${this._renderMonthNav()}
        ${this.entry ? this._renderContent() : this._renderEmpty()}
      </div>`;
    // При первом вызове из render() — возвращаем строку,
    // при вызове из _render() — пишем в DOM
    return html;
  },

  /* ── Навигация по месяцам ────────────────────────────────── */
  _renderMonthNav() {
    const prev = shiftYM(this.activeMonth, -1);
    const next = shiftYM(this.activeMonth, +1);
    // Формируем ряд из 5 месяцев: -2, -1, current, +1, +2
    const months = [-2, -1, 0, 1, 2].map(d => shiftYM(this.activeMonth, d));

    const items = months.map(ym => {
      const isActive  = ym === this.activeMonth;
      const hasData   = this.allEntries.some(e => e.month === ym);
      return `<button
        class="dtab-month-btn${isActive ? ' active' : ''}${hasData ? ' has-data' : ''}"
        data-ym="${ym}"
        title="${hasData ? 'Есть данные' : 'Нет данных'}">
        ${fmtYearMonth(ym)}
        ${hasData ? '<span class="dtab-month-dot"></span>' : ''}
      </button>`;
    }).join('');

    return `
      <nav class="dtab-month-nav" aria-label="Навигация по месяцам">
        <button class="dtab-nav-arrow" data-ym="${prev}" title="Предыдущий месяц">◀</button>
        <div class="dtab-month-list">${items}</div>
        <button class="dtab-nav-arrow" data-ym="${next}" title="Следующий месяц">▶</button>
      </nav>`;
  },

  /* ── Пустое состояние ────────────────────────────────────── */
  _renderEmpty() {
    const monthName = fmtYearMonth(this.activeMonth);
    return `
      <div class="dtab-empty">
        <div class="dtab-empty-icon">👥</div>
        <div class="dtab-empty-title">Нет данных за ${monthName}</div>
        <p class="dtab-empty-text">Добавьте команду проекта<br>чтобы отслеживать утилизацию</p>
        <button class="btn btn-primary" id="dtab-btn-add-team">+ Добавить команду</button>
      </div>`;
  },

  /* ── KPI строка ──────────────────────────────────────────── */
  _renderKPI() {
    const e        = this.entry;
    const fte      = e.members.reduce((s, m) => s + (m.allocation || 1), 0);
    const planned  = getTotalPlanned(e);
    const actual   = getTotalActual(e);
    const planRev  = getTotalPlannedRevenue(e);
    const actRev   = getTotalActualRevenue(e);
    const avgEff   = getAvgEfficiency(e);
    const status   = getEntryStatus(e);
    const effPct   = Math.round(avgEff * 100);

    const statusMap = {
      ok:       { icon: '🟢', label: 'В норме' },
      warning:  { icon: '🟡', label: 'Внимание' },
      critical: { icon: '🔴', label: 'Критично' },
    };
    const st = statusMap[status] || statusMap.ok;

    // Основная валюта (берём из первого member)
    const currency = e.members[0]?.currency || 'USD';

    return `
      <div class="dtab-kpi-row">
        <div class="dtab-kpi-card">
          <div class="dtab-kpi-icon">👥</div>
          <div class="dtab-kpi-val">${fte.toFixed(1)}</div>
          <div class="dtab-kpi-label">FTE человек</div>
        </div>
        <div class="dtab-kpi-card">
          <div class="dtab-kpi-icon">⏱</div>
          <div class="dtab-kpi-val">${actual} <span class="dtab-kpi-sub">/ ${planned}</span></div>
          <div class="dtab-kpi-label">факт / план ч</div>
        </div>
        <div class="dtab-kpi-card">
          <div class="dtab-kpi-icon">💰</div>
          <div class="dtab-kpi-val">${fmtMoney(actRev, currency).replace(/^[+]/, '')}</div>
          <div class="dtab-kpi-label">факт / ${fmtMoney(planRev, currency).replace(/^[+]/, '')}</div>
        </div>
        <div class="dtab-kpi-card dtab-kpi-card--${status}">
          <div class="dtab-kpi-icon">📊</div>
          <div class="dtab-kpi-val">${effPct}%</div>
          <div class="dtab-kpi-label">${st.icon} ${st.label}</div>
        </div>
      </div>`;
  },

  /* ── Таблица участников ──────────────────────────────────── */
  _renderTable() {
    const e      = this.entry;
    const rows   = e.members.map((m, idx) => this._renderMemberRow(m, idx)).join('');
    const totals = this._renderTotalsRow();

    return `
      <div class="dtab-table-wrap">
        <div style="overflow-x:auto">
          <table class="dtab-table">
            <thead>
              <tr>
                <th class="dtab-th">Сотрудник</th>
                <th class="dtab-th">Роль</th>
                <th class="dtab-th">Локация</th>
                <th class="dtab-th dtab-th--num">Аллокация</th>
                <th class="dtab-th dtab-th--num">План ч</th>
                <th class="dtab-th dtab-th--num">Факт ч</th>
                <th class="dtab-th dtab-th--num">Δ часов</th>
                <th class="dtab-th dtab-th--num">Δ деньги</th>
                <th class="dtab-th dtab-th--center">Статус</th>
                <th class="dtab-th"></th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
            <tfoot>
              ${totals}
            </tfoot>
          </table>
        </div>
      </div>`;
  },

  /** Одна строка таблицы с данными участника */
  _renderMemberRow(member, idx) {
    const planned = getMemberPlanned(member, this.entry.month);
    const delta   = getMemberDelta(member, this.entry.month);
    const planRev = getMemberPlannedRevenue(member, this.entry.month);
    const actRev  = getMemberActualRevenue(member);
    const dMoney  = actRev - planRev;
    const allPct  = Math.round((member.allocation || 1) * 100) + '%';

    const statusMap = { ok: '🟢', warning: '🟡', critical: '🔴' };
    const statusIcon = statusMap[delta.status] || '⚪';

    const noteAttr = member.note
      ? `title="${member.note.replace(/"/g, '&quot;')}"`
      : '';

    return `
      <tr class="dtab-row dtab-row--${delta.status}" data-idx="${idx}" ${noteAttr}>
        <td class="dtab-td dtab-td--name">
          <button class="dtab-name-btn" data-action="edit-member" data-idx="${idx}">
            ${member.name || '—'}
          </button>
          ${member.note ? `<span class="dtab-note-icon" title="${member.note}">📝</span>` : ''}
        </td>
        <td class="dtab-td">${member.role || '—'}</td>
        <td class="dtab-td">
          <span class="dtab-loc-chip">${locFlag(member.location)} ${member.location || '—'}</span>
        </td>
        <td class="dtab-td dtab-td--num">${allPct}</td>
        <td class="dtab-td dtab-td--num">${planned}ч</td>
        <td class="dtab-td dtab-td--num">${member.actual_hours || 0}ч</td>
        <td class="dtab-td dtab-td--num dtab-delta ${delta.delta_hours < 0 ? 'dtab-delta--neg' : delta.delta_hours > 0 ? 'dtab-delta--pos' : ''}">
          ${fmtDeltaH(delta.delta_hours)}
        </td>
        <td class="dtab-td dtab-td--num dtab-delta ${dMoney < 0 ? 'dtab-delta--neg' : dMoney > 0 ? 'dtab-delta--pos' : ''}">
          ${fmtMoney(dMoney, member.currency)}
        </td>
        <td class="dtab-td dtab-td--center">
          <span class="dtab-status-icon" title="${delta.status_label}">${statusIcon}</span>
        </td>
        <td class="dtab-td dtab-td--actions">
          <button class="btn btn-ghost btn-xs" data-action="delete-member" data-idx="${idx}" title="Удалить">✕</button>
        </td>
      </tr>`;
  },

  /** Строка итогов */
  _renderTotalsRow() {
    const e        = this.entry;
    const fte      = e.members.reduce((s, m) => s + (m.allocation || 1), 0).toFixed(1);
    const planned  = getTotalPlanned(e);
    const actual   = getTotalActual(e);
    const planRev  = getTotalPlannedRevenue(e);
    const actRev   = getTotalActualRevenue(e);
    const dH       = getTotalDeltaHours(e);
    const dM       = getTotalDeltaMoney(e);
    const status   = getEntryStatus(e);
    const statusMap = { ok: '🟢', warning: '🟡', critical: '🔴' };
    const currency = e.members[0]?.currency || 'USD';

    return `
      <tr class="dtab-totals-row">
        <td class="dtab-td dtab-td--totals" colspan="3">ИТОГО</td>
        <td class="dtab-td dtab-td--num dtab-td--totals">${fte} FTE</td>
        <td class="dtab-td dtab-td--num dtab-td--totals">${planned}ч</td>
        <td class="dtab-td dtab-td--num dtab-td--totals">${actual}ч</td>
        <td class="dtab-td dtab-td--num dtab-td--totals dtab-delta ${dH < 0 ? 'dtab-delta--neg' : dH > 0 ? 'dtab-delta--pos' : ''}">
          ${fmtDeltaH(dH)}
        </td>
        <td class="dtab-td dtab-td--num dtab-td--totals dtab-delta ${dM < 0 ? 'dtab-delta--neg' : dM > 0 ? 'dtab-delta--pos' : ''}">
          ${fmtMoney(dM, currency)}
        </td>
        <td class="dtab-td dtab-td--center dtab-td--totals">${statusMap[status]}</td>
        <td class="dtab-td dtab-td--totals"></td>
      </tr>`;
  },

  /* ══════════════════════════════════════════════════════════
     ИСТОРИЧЕСКИЙ АГРЕГАТ
     ══════════════════════════════════════════════════════════ */

  /**
   * Возвращает массив последних 12 месяцев для клиента.
   * Каждый элемент: { month, fte, avg_rate, efficiency, delta_hours, delta_money }
   * month = YYYY-MM строка.
   * Месяцы без данных заполняются нулями.
   */
  async getHistory(clientId) {
    const entries = await FteAPI.getByClient(clientId);

    // Строим набор последних 12 месяцев от текущего назад
    const result = [];
    const now    = new Date();
    for (let i = 11; i >= 0; i--) {
      const d  = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const entry = entries.find(e => e.month === ym);

      if (!entry || entry.members.length === 0) {
        result.push({ month: ym, fte: 0, avg_rate: 0, efficiency: null, delta_hours: 0, delta_money: 0 });
        continue;
      }

      // FTE = сумма allocation
      const fte = entry.members.reduce((s, m) => s + (m.allocation || 1), 0);

      // Средний взвешенный рейт (вес = allocation)
      let totalAlloc = 0, weightedRate = 0;
      for (const m of entry.members) {
        const alloc = m.allocation || 1;
        totalAlloc   += alloc;
        weightedRate += (m.rate_per_hour || 0) * alloc;
      }
      const avg_rate = totalAlloc > 0 ? weightedRate / totalAlloc : 0;

      // Эффективность, дельта часов и денег
      let totalPlanned  = 0, totalActual = 0, totalPlannedRev = 0, totalActualRev = 0;
      let weightedEff   = 0;
      for (const m of entry.members) {
        const planned = getMemberPlanned(m, ym);
        const actual  = m.actual_hours || 0;
        const rate    = m.rate_per_hour || 0;
        const eff     = planned > 0 ? actual / planned : 0;
        totalPlanned    += planned;
        totalActual     += actual;
        totalPlannedRev += planned * rate;
        totalActualRev  += actual  * rate;
        weightedEff     += eff * planned;
      }
      const efficiency  = totalPlanned > 0 ? weightedEff / totalPlanned : null;
      const delta_hours = totalActual - totalPlanned;
      const delta_money = Math.round(totalActualRev - totalPlannedRev);

      result.push({ month: ym, fte, avg_rate: Math.round(avg_rate * 100) / 100, efficiency, delta_hours, delta_money });
    }

    return result;
  },

  /* ══════════════════════════════════════════════════════════
     SVG DUAL-AXIS ГРАФИК
     ══════════════════════════════════════════════════════════ */

  /**
   * Строит SVG dual-axis chart: левая ось FTE, правая ось avg_rate.
   * Использует this.allEntries (уже загруженные данные клиента).
   * Последние 6 месяцев.
   */
  _renderChart() {
    // Собираем последние 6 месяцев
    const now = new Date();
    const months6 = [];
    for (let i = 5; i >= 0; i--) {
      const d  = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const entry = this.allEntries.find(e => e.month === ym);

      let fte = 0, avg_rate = 0, efficiency = null;
      if (entry && entry.members.length > 0) {
        fte = entry.members.reduce((s, m) => s + (m.allocation || 1), 0);
        let totalAlloc = 0, weightedRate = 0, totalPlanned = 0, weightedEff = 0;
        for (const m of entry.members) {
          const alloc   = m.allocation || 1;
          const planned = getMemberPlanned(m, ym);
          const actual  = m.actual_hours || 0;
          const eff     = planned > 0 ? actual / planned : 0;
          totalAlloc   += alloc;
          weightedRate += (m.rate_per_hour || 0) * alloc;
          totalPlanned  += planned;
          weightedEff   += eff * planned;
        }
        avg_rate   = totalAlloc > 0 ? weightedRate / totalAlloc : 0;
        efficiency = totalPlanned > 0 ? weightedEff / totalPlanned : null;
      }
      const label = fmtYearMonth(ym).replace(/\s(\d{4})/, " '$1").replace(/ '20/, " '20");
      months6.push({ ym, fte, avg_rate, efficiency, label: fmtYearMonth(ym) });
    }

    const hasAnyData = months6.some(d => d.fte > 0 || d.avg_rate > 0);
    if (!hasAnyData) {
      return `<div class="dtab-chart-wrap">
        <div class="dtab-chart-title">📊 Динамика FTE и среднего рейта</div>
        <div class="dtab-chart-empty">Нет данных за последние 6 месяцев</div>
      </div>`;
    }

    /* === SVG layout === */
    const W = 660, H = 260;
    const PAD_L = 52, PAD_R = 52, PAD_T = 24, PAD_B = 44;
    const chartW = W - PAD_L - PAD_R;
    const chartH = H - PAD_T - PAD_B;
    const N = months6.length;
    const step = chartW / (N - 1 || 1);

    // FTE ось (левая)
    const fteVals  = months6.map(d => d.fte);
    const fteMax   = Math.max(...fteVals, 1);
    const fteMin   = 0;
    const fteRange = fteMax - fteMin || 1;

    // Rate ось (правая)
    const rateVals  = months6.map(d => d.avg_rate);
    const rateMax   = Math.max(...rateVals, 1);
    const rateMin   = 0;
    const rateRange = rateMax - rateMin || 1;

    // Координаты точек
    const ftePoints  = months6.map((d, i) => ({
      x: PAD_L + i * step,
      y: PAD_T + chartH - ((d.fte - fteMin) / fteRange) * chartH,
      val: d.fte, ym: d.ym, label: d.label,
    }));
    const ratePoints = months6.map((d, i) => ({
      x: PAD_L + i * step,
      y: PAD_T + chartH - ((d.avg_rate - rateMin) / rateRange) * chartH,
      val: d.avg_rate, ym: d.ym, label: d.label,
    }));

    // Polyline paths
    const polyFTE  = ftePoints.map(p => `${p.x},${p.y}`).join(' ');
    const polyRate = ratePoints.map(p => `${p.x},${p.y}`).join(' ');

    // Area под FTE
    const areaFTE = `${PAD_L},${PAD_T + chartH} ` + ftePoints.map(p => `${p.x},${p.y}`).join(' ') + ` ${PAD_L + chartW},${PAD_T + chartH}`;

    // Сетка — 4 горизонтальных линии
    const gridLines = [0.25, 0.5, 0.75, 1].map(t => {
      const y = PAD_T + chartH * (1 - t);
      const fteLabel  = (fteMin  + fteRange  * t).toFixed(1);
      const rateLabel = (rateMin + rateRange * t).toFixed(0);
      return `
        <line x1="${PAD_L}" y1="${y}" x2="${PAD_L + chartW}" y2="${y}" class="dtab-chart-grid"/>
        <text x="${PAD_L - 6}" y="${y + 4}" class="dtab-chart-axis-label dtab-chart-axis-left">${fteLabel}</text>
        <text x="${PAD_L + chartW + 6}" y="${y + 4}" class="dtab-chart-axis-label dtab-chart-axis-right">$${rateLabel}</text>`;
    }).join('');

    // Метки по оси X
    const xLabels = months6.map((d, i) => {
      const x = PAD_L + i * step;
      // Короткий формат: "Янв '25"
      const parts = d.label.split(' ');
      const short = parts[0].slice(0, 3) + (parts[1] ? " '" + String(parts[1]).slice(2) : '');
      return `<text x="${x}" y="${H - 8}" class="dtab-chart-x-label">${short}</text>`;
    }).join('');

    // Tooltip данные (data-атрибуты на circle)
    const fteCircles  = ftePoints.map((p, i) => {
      const eff = months6[i].efficiency;
      const effStr = eff !== null ? Math.round(eff * 100) + '%' : '—';
      return `<circle cx="${p.x}" cy="${p.y}" r="5" class="dtab-chart-dot dtab-chart-dot--fte"
        data-ym="${p.ym}" data-label="${p.label}"
        data-fte="${p.val.toFixed(1)}" data-rate="${ratePoints[i].val.toFixed(1)}"
        data-eff="${effStr}"
        tabindex="0" role="button" aria-label="${p.label}: FTE ${p.val.toFixed(1)}"/>`;
    }).join('');

    const rateCircles = ratePoints.map((p, i) => {
      const eff = months6[i].efficiency;
      const effStr = eff !== null ? Math.round(eff * 100) + '%' : '—';
      return `<circle cx="${p.x}" cy="${p.y}" r="5" class="dtab-chart-dot dtab-chart-dot--rate"
        data-ym="${p.ym}" data-label="${p.label}"
        data-fte="${ftePoints[i].val.toFixed(1)}" data-rate="${p.val.toFixed(1)}"
        data-eff="${effStr}"
        tabindex="0" role="button" aria-label="${p.label}: Рейт $${p.val.toFixed(0)}"/>`;
    }).join('');

    // Легенда
    const legend = `
      <div class="dtab-chart-legend">
        <span class="dtab-chart-legend-item dtab-chart-legend-item--fte">
          <svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#3b82f6" stroke-width="2.5"/>
          <circle cx="9" cy="5" r="4" fill="#3b82f6"/></svg>
          FTE (левая ось)
        </span>
        <span class="dtab-chart-legend-item dtab-chart-legend-item--rate">
          <svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,2"/>
          <circle cx="9" cy="5" r="4" fill="#f59e0b"/></svg>
          Средний рейт $ (правая ось)
        </span>
      </div>`;

    // Tooltip элемент (скрытый)
    const tooltip = `<div class="dtab-chart-tooltip" id="dtab-svg-tooltip" role="tooltip" aria-live="polite"></div>`;

    return `
      <div class="dtab-chart-wrap">
        <div class="dtab-chart-title">📊 Динамика FTE и среднего рейта — последние 6 месяцев</div>
        <div class="dtab-chart-inner" style="position:relative">
          <svg viewBox="0 0 ${W} ${H}" class="dtab-chart-svg" aria-label="Dual-axis chart: FTE и средний рейт">
            <defs>
              <linearGradient id="fte-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#3b82f6" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"/>
              </linearGradient>
            </defs>

            <!-- Ось X baseline -->
            <line x1="${PAD_L}" y1="${PAD_T + chartH}" x2="${PAD_L + chartW}" y2="${PAD_T + chartH}" class="dtab-chart-axis"/>

            <!-- Сетка -->
            ${gridLines}

            <!-- Подписи оси X -->
            ${xLabels}

            <!-- Area под FTE -->
            <polygon points="${areaFTE}" fill="url(#fte-area-grad)"/>

            <!-- FTE линия -->
            <polyline points="${polyFTE}" class="dtab-chart-line dtab-chart-line--fte" fill="none"/>

            <!-- Rate линия (пунктир) -->
            <polyline points="${polyRate}" class="dtab-chart-line dtab-chart-line--rate" fill="none"/>

            <!-- Точки Rate (под FTE точками для z-order) -->
            ${rateCircles}

            <!-- Точки FTE -->
            ${fteCircles}

            <!-- Подписи осей -->
            <text x="${PAD_L - 8}" y="${PAD_T - 8}" class="dtab-chart-axis-title dtab-chart-axis-title--left">FTE</text>
            <text x="${PAD_L + chartW + PAD_R - 4}" y="${PAD_T - 8}" class="dtab-chart-axis-title dtab-chart-axis-title--right">$/ч</text>
          </svg>
          ${tooltip}
        </div>
        ${legend}
      </div>`;
  },

  /** Привязывает события tooltip для SVG точек */
  _bindChartEvents() {
    const tooltip = document.getElementById('dtab-svg-tooltip');
    if (!tooltip) return;

    document.querySelectorAll('.dtab-chart-dot').forEach(dot => {
      const show = (e) => {
        const lbl  = dot.dataset.label;
        const fte  = dot.dataset.fte;
        const rate = dot.dataset.rate;
        const eff  = dot.dataset.eff;
        tooltip.innerHTML = `
          <div class="dtab-tt-month">${lbl}</div>
          <div class="dtab-tt-row"><span class="dtab-tt-key">FTE</span><span class="dtab-tt-val">${fte}</span></div>
          <div class="dtab-tt-row"><span class="dtab-tt-key">Рейт</span><span class="dtab-tt-val">$${parseFloat(rate).toFixed(1)}/ч</span></div>
          <div class="dtab-tt-row"><span class="dtab-tt-key">Эффективность</span><span class="dtab-tt-val">${eff}</span></div>`;

        // Позиционируем tooltip
        const svgRect = dot.closest('svg')?.getBoundingClientRect();
        const dotRect = dot.getBoundingClientRect();
        if (svgRect) {
          const relX = dotRect.left - svgRect.left + dotRect.width / 2;
          const relY = dotRect.top  - svgRect.top;
          tooltip.style.left    = `${relX}px`;
          tooltip.style.top     = `${relY - 8}px`;
          tooltip.style.display = 'block';
        }
      };

      const hide = () => { tooltip.style.display = 'none'; };

      dot.addEventListener('mouseenter', show);
      dot.addEventListener('focus',      show);
      dot.addEventListener('mouseleave', hide);
      dot.addEventListener('blur',       hide);
      dot.addEventListener('click',      show); // для тач-устройств
    });
  },

  /* ── Кнопки действий ─────────────────────────────────────── */
  _renderActions() {
    return `
      <div class="dtab-actions">
        <button class="btn btn-primary btn-sm" id="dtab-btn-add-member">
          + Добавить сотрудника
        </button>
        <button class="btn btn-secondary btn-sm" id="dtab-btn-edit-entry">
          ✏️ Редактировать
        </button>
        <button class="btn btn-danger btn-sm" id="dtab-btn-delete-entry">
          🗑 Удалить месяц
        </button>
      </div>`;
  },

  /* ── Основной контент (если запись есть) ─────────────────── */
  _renderContent() {
    return `
      ${this._renderKPI()}
      ${this._renderTable()}
      ${this._renderChart()}
      ${this._renderActions()}`;
  },

  /* ══════════════════════════════════════════════════════════
     СОБЫТИЯ
     ══════════════════════════════════════════════════════════ */

  /** Привязывает все события после рендера */
  _bindEvents() {
    this._bindMonthNav();
    this._bindActions();
    this._bindTableActions();
    this._bindChartEvents();
  },

  /** Навигация по месяцам */
  _bindMonthNav() {
    document.querySelectorAll('.dtab-month-btn, .dtab-nav-arrow').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ym = btn.dataset.ym;
        if (!ym) return;
        this.activeMonth = ym;
        await this._loadData();
        this._render();
      });
    });
  },

  /** Кнопки основных действий */
  _bindActions() {
    const addTeam   = document.getElementById('dtab-btn-add-team');
    const addMember = document.getElementById('dtab-btn-add-member');
    const edit      = document.getElementById('dtab-btn-edit-entry');
    const del       = document.getElementById('dtab-btn-delete-entry');

    if (addTeam)   addTeam.addEventListener('click', () => this._openModal(null, true));
    if (addMember) addMember.addEventListener('click', () => this._openModal(null, false));
    if (edit)      edit.addEventListener('click', () => this._openModal(this.entry, true));
    if (del)       del.addEventListener('click', () => this._deleteEntry());
  },

  /** Действия в строках таблицы */
  _bindTableActions() {
    document.querySelectorAll('[data-action="edit-member"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        this._openMemberEditRow(idx);
      });
    });

    document.querySelectorAll('[data-action="delete-member"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.idx);
        await this._deleteMember(idx);
      });
    });
  },

  /* ══════════════════════════════════════════════════════════
     ИНЛАЙН-РЕДАКТИРОВАНИЕ СТРОКИ
     ══════════════════════════════════════════════════════════ */

  /** Открывает форму редактирования инлайн в строке таблицы */
  _openMemberEditRow(idx) {
    const member = this.entry.members[idx];
    if (!member) return;

    const row = document.querySelector(`tr.dtab-row[data-idx="${idx}"]`);
    if (!row) return;

    // Если уже открыта форма — закрываем
    const existing = document.getElementById('dtab-inline-form');
    if (existing) existing.remove();

    const locs    = this._buildLocOptions(member.location);
    const allocOpts = this._buildAllocOptions(member.allocation);
    const currOpts  = this._buildCurrOptions(member.currency);

    const form = document.createElement('tr');
    form.id    = 'dtab-inline-form';
    form.innerHTML = `
      <td colspan="10" class="dtab-inline-td">
        <div class="dtab-inline-form">
          <div class="dtab-inline-grid">
            <div class="dtab-fg">
              <label class="dtab-flabel">Имя</label>
              <input class="form-input dtab-fi" id="dif-name" value="${member.name || ''}" placeholder="Иван Петров" required />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Роль</label>
              <input class="form-input dtab-fi" id="dif-role" value="${member.role || ''}" placeholder="Developer" />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Локация</label>
              <select class="form-select dtab-fi" id="dif-location">${locs}</select>
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Аллокация</label>
              <select class="form-select dtab-fi" id="dif-allocation">${allocOpts}</select>
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Рейт/ч</label>
              <input class="form-input dtab-fi" id="dif-rate" type="number" min="0" value="${member.rate_per_hour || ''}" placeholder="45" />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Валюта</label>
              <select class="form-select dtab-fi" id="dif-currency">${currOpts}</select>
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">План ч <span class="dtab-flabel-hint">(авто)</span></label>
              <input class="form-input dtab-fi" id="dif-planned" type="number" min="0"
                value="${member.planned_hours !== null && member.planned_hours !== undefined ? member.planned_hours : ''}"
                placeholder="Авто" />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Факт ч <span class="dtab-req">*</span></label>
              <input class="form-input dtab-fi" id="dif-actual" type="number" min="0"
                value="${member.actual_hours || ''}" placeholder="152" required />
            </div>
            <div class="dtab-fg dtab-fg--wide">
              <label class="dtab-flabel">Заметка</label>
              <input class="form-input dtab-fi" id="dif-note" value="${member.note || ''}" placeholder="Был в отпуске 3 дня" />
            </div>
          </div>
          <div class="dtab-inline-actions">
            <button class="btn btn-primary btn-sm" id="dif-save-btn">✓ Сохранить</button>
            <button class="btn btn-ghost btn-sm" id="dif-cancel-btn">Отмена</button>
          </div>
        </div>
      </td>`;

    row.insertAdjacentElement('afterend', form);

    document.getElementById('dif-cancel-btn').addEventListener('click', () => form.remove());
    document.getElementById('dif-save-btn').addEventListener('click', async () => {
      await this._saveMemberFromInline(idx);
    });
  },

  /** Собирает данные из инлайн-формы и сохраняет */
  async _saveMemberFromInline(idx) {
    const name   = document.getElementById('dif-name')?.value?.trim();
    const actual = parseFloat(document.getElementById('dif-actual')?.value);

    if (!name)         { App.toast('⚠️ Укажите имя', 'error'); return; }
    if (isNaN(actual)) { App.toast('⚠️ Укажите фактические часы', 'error'); return; }

    const plannedRaw = document.getElementById('dif-planned')?.value;
    const planned    = plannedRaw !== '' && !isNaN(parseFloat(plannedRaw))
      ? parseFloat(plannedRaw) : null;

    this.entry.members[idx] = {
      ...this.entry.members[idx],
      name,
      role:          document.getElementById('dif-role')?.value?.trim() || '',
      location:      document.getElementById('dif-location')?.value || 'BY',
      allocation:    parseFloat(document.getElementById('dif-allocation')?.value) || 1.0,
      rate_per_hour: parseFloat(document.getElementById('dif-rate')?.value) || 0,
      currency:      document.getElementById('dif-currency')?.value || 'USD',
      planned_hours: planned,
      actual_hours:  actual,
      note:          document.getElementById('dif-note')?.value?.trim() || '',
    };

    await this._saveEntry();
  },

  /* ══════════════════════════════════════════════════════════
     МОДАЛЬНАЯ ФОРМА
     ══════════════════════════════════════════════════════════ */

  /** Открывает модал добавления/редактирования команды */
  _openModal(existingEntry, showExisting) {
    const month     = this.activeMonth;
    const monthName = fmtYearMonth(month);
    const members   = (showExisting && existingEntry) ? existingEntry.members : [];

    const modalHTML = `
      <div class="dtab-modal-wrap">
        <h2 class="modal-title">👥 Команда проекта — ${monthName}</h2>
        <div id="dtab-members-container">
          ${members.length > 0
            ? members.map((m, i) => this._buildMemberBlock(i, m)).join('')
            : this._buildMemberBlock(0, null)}
        </div>
        <button class="btn btn-ghost btn-sm" id="dtab-modal-add-more" style="margin-top:8px">
          + Добавить ещё одного
        </button>
        <div class="modal-actions" style="margin-top:20px">
          <button class="btn btn-primary" id="dtab-modal-save-btn">💾 Сохранить</button>
          <button class="btn btn-ghost" onclick="App.closeModal()">Отмена</button>
        </div>
      </div>`;

    App.openModal(modalHTML);
    this._bindModal(existingEntry);
  },

  /** Строит один блок формы для участника */
  _buildMemberBlock(idx, member) {
    const locs     = this._buildLocOptions(member?.location);
    const allocOpts = this._buildAllocOptions(member?.allocation);
    const currOpts  = this._buildCurrOptions(member?.currency);

    return `
      <div class="dtab-member-block" data-block-idx="${idx}">
        <div class="dtab-member-block-header">
          <span class="dtab-member-num">👤 Сотрудник ${idx + 1}</span>
          ${idx > 0 ? `<button class="btn btn-ghost btn-xs dtab-remove-block" data-block-idx="${idx}" title="Убрать">✕</button>` : ''}
        </div>
        <div class="dtab-modal-grid">
          <div class="dtab-fg">
            <label class="dtab-flabel">Имя <span class="dtab-req">*</span></label>
            <input class="form-input" name="m_name" value="${member?.name || ''}" placeholder="Иван Петров" required />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Роль</label>
            <input class="form-input" name="m_role" value="${member?.role || ''}" placeholder="Developer, PM, QA..." />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Локация</label>
            <select class="form-select" name="m_location">${locs}</select>
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Аллокация</label>
            <select class="form-select" name="m_allocation">${allocOpts}</select>
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Рейт в час</label>
            <input class="form-input" name="m_rate" type="number" min="0"
              value="${member?.rate_per_hour || ''}" placeholder="45" />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Валюта</label>
            <select class="form-select" name="m_currency">${currOpts}</select>
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Плановые ч <span class="dtab-flabel-hint">(авто)</span></label>
            <input class="form-input" name="m_planned" type="number" min="0"
              value="${member?.planned_hours !== null && member?.planned_hours !== undefined ? member.planned_hours : ''}"
              placeholder="Авто (из календаря)" />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Фактические ч <span class="dtab-req">*</span></label>
            <input class="form-input" name="m_actual" type="number" min="0"
              value="${member?.actual_hours || ''}" placeholder="152" required />
          </div>
          <div class="dtab-fg dtab-fg--wide">
            <label class="dtab-flabel">Заметка</label>
            <input class="form-input" name="m_note" value="${member?.note || ''}"
              placeholder="Был в отпуске 3 дня" />
          </div>
        </div>
      </div>`;
  },

  /** Привязывает события модала */
  _bindModal(existingEntry) {
    let blockCount = document.querySelectorAll('.dtab-member-block').length;

    // Добавить ещё одного участника
    document.getElementById('dtab-modal-add-more')?.addEventListener('click', () => {
      const container = document.getElementById('dtab-members-container');
      const div       = document.createElement('div');
      div.innerHTML   = this._buildMemberBlock(blockCount, null);
      container.appendChild(div.firstElementChild);
      blockCount++;

      // Привязываем кнопку удаления нового блока
      div.firstElementChild.querySelector('.dtab-remove-block')
        ?.addEventListener('click', (e) => {
          e.target.closest('.dtab-member-block').remove();
        });
    });

    // Кнопки удаления существующих блоков
    document.querySelectorAll('.dtab-remove-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.dtab-member-block').remove();
      });
    });

    // Сохранение
    document.getElementById('dtab-modal-save-btn')?.addEventListener('click', async () => {
      await this._saveFromModal(existingEntry);
    });
  },

  /** Собирает данные из модала и сохраняет */
  async _saveFromModal(existingEntry) {
    const blocks  = document.querySelectorAll('.dtab-member-block');
    const members = [];
    let hasError  = false;

    blocks.forEach((block, i) => {
      const get   = name => block.querySelector(`[name="${name}"]`)?.value?.trim() || '';
      const getN  = name => parseFloat(block.querySelector(`[name="${name}"]`)?.value) || 0;
      const name  = get('m_name');
      const actual = parseFloat(block.querySelector('[name="m_actual"]')?.value);

      if (!name) { App.toast(`⚠️ Сотрудник ${i + 1}: укажите имя`, 'error'); hasError = true; return; }
      if (isNaN(actual)) { App.toast(`⚠️ ${name}: укажите фактические часы`, 'error'); hasError = true; return; }

      const plannedRaw = block.querySelector('[name="m_planned"]')?.value;
      const planned    = plannedRaw !== '' && !isNaN(parseFloat(plannedRaw))
        ? parseFloat(plannedRaw) : null;

      // Сохраняем id если редактируем существующего
      const existMbr = existingEntry?.members?.[i];

      members.push({
        id:            existMbr?.id || genMemberId(),
        name,
        role:          get('m_role'),
        location:      get('m_location') || 'BY',
        allocation:    parseFloat(block.querySelector('[name="m_allocation"]')?.value) || 1.0,
        rate_per_hour: getN('m_rate'),
        currency:      get('m_currency') || 'USD',
        planned_hours: planned,
        actual_hours:  actual,
        note:          get('m_note'),
      });
    });

    if (hasError || members.length === 0) return;

    const saveBtn = document.getElementById('dtab-modal-save-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳ Сохраняю...'; }

    try {
      if (existingEntry) {
        this.entry = await FteAPI.update(existingEntry.id, {
          ...existingEntry, members, updated_at: new Date().toISOString().slice(0, 10),
        });
      } else {
        this.entry = await FteAPI.create({
          client_id:  this.clientId,
          month:      this.activeMonth,
          members,
          created_at: new Date().toISOString().slice(0, 10),
          updated_at: new Date().toISOString().slice(0, 10),
        });
        this.allEntries.push(this.entry);
      }
      App.closeModal();
      App.toast('✅ Команда сохранена', 'success');
      this._render();
    } catch (e) {
      console.error('[DeliveryTab._saveFromModal]', e);
      App.toast('❌ Ошибка сохранения', 'error');
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 Сохранить'; }
    }
  },

  /* ── Сохранение текущей записи (после инлайн-редакт.) ───── */
  async _saveEntry() {
    try {
      this.entry = await FteAPI.update(this.entry.id, {
        ...this.entry,
        updated_at: new Date().toISOString().slice(0, 10),
      });
      App.toast('✅ Сохранено', 'success');
      this._render();
    } catch (e) {
      console.error('[DeliveryTab._saveEntry]', e);
      App.toast('❌ Ошибка сохранения', 'error');
    }
  },

  /** Удаляет члена команды по индексу */
  async _deleteMember(idx) {
    if (!confirm(`Удалить сотрудника «${this.entry.members[idx]?.name}»?`)) return;
    this.entry.members.splice(idx, 1);
    if (this.entry.members.length === 0) {
      await FteAPI.remove(this.entry.id);
      this.entry      = null;
      this.allEntries = this.allEntries.filter(e => e.id !== this.entry?.id);
    } else {
      await this._saveEntry();
      return; // _saveEntry уже вызывает _render
    }
    this._render();
  },

  /** Удаляет всю запись за месяц */
  async _deleteEntry() {
    const monthName = fmtYearMonth(this.activeMonth);
    if (!confirm(`Удалить все данные команды за ${monthName}?`)) return;
    try {
      await FteAPI.remove(this.entry.id);
      this.allEntries = this.allEntries.filter(e => e.id !== this.entry.id);
      this.entry      = null;
      App.toast(`🗑 Данные за ${monthName} удалены`, '');
      this._render();
    } catch (e) {
      App.toast('❌ Ошибка удаления', 'error');
    }
  },

  /* ── Построители опций select ─────────────────────────────── */

  _buildLocOptions(selected) {
    const locs = window.CalendarEngine
      ? CalendarEngine.getLocations()
      : [
          { id: 'BY', name: 'Беларусь', flag: '🇧🇾' },
          { id: 'PL', name: 'Польша',   flag: '🇵🇱' },
          { id: 'DE', name: 'Германия', flag: '🇩🇪' },
          { id: 'US', name: 'США',      flag: '🇺🇸' },
        ];
    return locs.map(l =>
      `<option value="${l.id}" ${l.id === selected ? 'selected' : ''}>${l.flag} ${l.name} (${l.id})</option>`
    ).join('');
  },

  _buildAllocOptions(selected) {
    const opts = [
      { val: 0.1,  label: '10%' }, { val: 0.2,  label: '20%' },
      { val: 0.25, label: '25%' }, { val: 0.3,  label: '30%' },
      { val: 0.4,  label: '40%' }, { val: 0.5,  label: '50%' },
      { val: 0.6,  label: '60%' }, { val: 0.75, label: '75%' },
      { val: 0.8,  label: '80%' }, { val: 1.0,  label: '100%' },
    ];
    const sel = selected !== undefined ? selected : 1.0;
    return opts.map(o =>
      `<option value="${o.val}" ${o.val === sel ? 'selected' : ''}>${o.label}</option>`
    ).join('');
  },

  _buildCurrOptions(selected) {
    const currencies = ['USD', 'EUR', 'PLN', 'GBP'];
    const sel        = selected || 'USD';
    return currencies.map(c =>
      `<option value="${c}" ${c === sel ? 'selected' : ''}>${c}</option>`
    ).join('');
  },
};

/* ── Экспорт ─────────────────────────────────────────────────── */
window.DeliveryTab = DeliveryTab;
window.FteAPI      = FteAPI;
