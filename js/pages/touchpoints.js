/* ============================================
   js/pages/touchpoints.js — Touch Points Page
   Portfolio BCHS v7.0
   ============================================ */

import { API }  from '../api.js';
import { Calc } from '../calc.js';

/* Частоты касаний по BCG (дней) */
const BCG_FREQUENCY = {
  KEY:          14,
  GROWTH:       21,
  GROWTH_EARLY: 14,
  STABLE:       30,
  TAIL:         60,
};

const TYPE_LABELS = {
  checkin:  { icon: '💬', label: 'Check-in'  },
  call:     { icon: '📞', label: 'Звонок'    },
  meeting:  { icon: '🤝', label: 'Встреча'   },
  qbr:      { icon: '📊', label: 'QBR'       },
  email:    { icon: '📧', label: 'Email'      },
};

export const TouchPointsPage = {

  async render() {
    document.getElementById('main-content').innerHTML = `
      <div class="page-header">
        <div class="page-title">📍 Точки касания</div>
        <div class="page-subtitle">Кого и когда контактировать — авто и ручные напоминания</div>
      </div>
      <div id="tp-content">
        <div style="padding:32px;text-align:center;color:var(--text-muted)">⏳ Загрузка...</div>
      </div>`;

    await this._load();
  },

  async _load() {
    const el = document.getElementById('tp-content');
    try {
      const [clients, allBCHS, allPC, touchPoints] = await Promise.all([
        API.getClients(),
        API.getAllBCHS(),
        API.getAllPC(),
        API.getTouchPoints(),
      ]);

      const computed = clients.map(c => ({
        client: c,
        ...Calc.computeClient(c, allBCHS, allPC),
      }));

      /* Считаем рекомендации */
      const recommendations = this._buildRecommendations(computed, touchPoints);
      const overdue  = recommendations.filter(r => r.urgency === 'overdue');
      const due      = recommendations.filter(r => r.urgency === 'due');
      const upcoming = recommendations.filter(r => r.urgency === 'upcoming');

      el.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
          ${this._statCard('🔴 Просрочено',  overdue.length,  '#EF4444')}
          ${this._statCard('🟡 Сегодня',     due.length,      '#F59E0B')}
          ${this._statCard('🔵 На неделе',   upcoming.length, '#6366f1')}
        </div>

        <div class="form-section">
          <div style="display:flex;align-items:center;justify-content:space-between;
                      margin-bottom:14px;flex-wrap:wrap;gap:8px">
            <div class="form-section-title" style="margin:0">
              Рекомендованные касания
            </div>
            <button class="btn btn-primary btn-sm" id="tp-add-btn">
              + Добавить касание
            </button>
          </div>

          ${overdue.length ? `
            <div style="font-size:11px;font-weight:700;color:#EF4444;
                        text-transform:uppercase;letter-spacing:.5px;
                        margin-bottom:8px">🔴 Просрочено</div>
            ${overdue.map(r => this._rowHTML(r)).join('')}
            <div style="height:16px"></div>` : ''}

          ${due.length ? `
            <div style="font-size:11px;font-weight:700;color:#F59E0B;
                        text-transform:uppercase;letter-spacing:.5px;
                        margin-bottom:8px">🟡 Нужно сегодня</div>
            ${due.map(r => this._rowHTML(r)).join('')}
            <div style="height:16px"></div>` : ''}

          ${upcoming.length ? `
            <div style="font-size:11px;font-weight:700;color:#6366f1;
                        text-transform:uppercase;letter-spacing:.5px;
                        margin-bottom:8px">🔵 Ближайшая неделя</div>
            ${upcoming.map(r => this._rowHTML(r)).join('')}` : ''}

          ${!overdue.length && !due.length && !upcoming.length ? `
            <div style="text-align:center;padding:40px;color:var(--text-muted)">
              ✅ Все клиенты покрыты касаниями — хорошая работа!
            </div>` : ''}
        </div>

        ${this._historySection(touchPoints, clients)}
      `;

      this._bindEvents(computed, touchPoints);

    } catch (e) {
      console.error('[TouchPoints]', e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--md-red)">
        ❌ Ошибка: ${e.message}</div>`;
    }
  },

  _buildRecommendations(computed, touchPoints) {
    const now  = new Date();
    const recs = [];

    for (const row of computed) {
      const c   = row.client;
      const cid = String(c.id);

      /* Последнее касание */
      const clientTPs = touchPoints
        .filter(tp => String(tp.client_id) === cid && tp.completed_at)
        .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
      const lastTP = clientTPs[0] ?? null;
      const lastDate = lastTP ? new Date(lastTP.completed_at) : null;

      /* Базовая частота по BCG */
      const freq = BCG_FREQUENCY[c.bcg_category] ?? 30;

      /* Следующий плановый контакт */
      const nextDate = lastDate
        ? new Date(lastDate.getTime() + freq * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() - 1); /* никогда не касались → просрочено */

      const diffDays = Math.round((nextDate - now) / (24 * 60 * 60 * 1000));

      /* Повышаем приоритет при плохом тренде или падающем bCHS */
      const boosted = (row.trend?.direction === 'down' && row.bchs !== null && row.bchs < 0)
        || (row.bchs !== null && row.bchs < -20);

      let urgency;
      if (diffDays < 0)       urgency = 'overdue';
      else if (diffDays <= 3) urgency = 'due';
      else if (diffDays <= 7) urgency = 'upcoming';
      else continue; /* не показываем если рано */

      recs.push({
        client:    c,
        row,
        lastDate,
        nextDate,
        diffDays,
        urgency,
        boosted,
        freq,
        lastNote: lastTP?.notes ?? '',
        lastType: lastTP?.type  ?? 'checkin',
      });
    }

    /* Сортировка: просроченные сначала, внутри — по bCHS */
    return recs.sort((a, b) => {
      const uOrder = { overdue: 0, due: 1, upcoming: 2 };
      if (uOrder[a.urgency] !== uOrder[b.urgency])
        return uOrder[a.urgency] - uOrder[b.urgency];
      return (a.row.bchs ?? 999) - (b.row.bchs ?? 999);
    });
  },

  _rowHTML(r) {
    const c       = r.client;
    const bcgIcon = { KEY:'⭐',STABLE:'🐄',GROWTH:'💎',GROWTH_EARLY:'🌱',TAIL:'📦' };
    const icon    = bcgIcon[c.bcg_category] ?? '•';

    const lastStr = r.lastDate
      ? this._daysAgo(r.lastDate)
      : 'никогда';

    const urgColor = r.urgency === 'overdue' ? '#EF4444'
                   : r.urgency === 'due'     ? '#F59E0B' : '#6366f1';

    const boostBadge = r.boosted
      ? `<span style="font-size:10px;background:#fef2f2;color:#EF4444;
                      border-radius:4px;padding:2px 5px;margin-left:4px">
           ⚠ bCHS падает</span>`
      : '';

    const typeOpts = Object.entries(TYPE_LABELS).map(([k, v]) =>
      `<option value="${k}">${v.icon} ${v.label}</option>`
    ).join('');

    return `
      <div class="tp-row" data-cid="${c.id}"
           style="display:flex;align-items:center;gap:10px;
                  padding:10px 12px;border-radius:8px;margin-bottom:6px;
                  background:var(--surface);border:1px solid var(--border);
                  flex-wrap:wrap">
        <div style="min-width:0;flex:1">
          <div style="font-weight:600;font-size:13px;white-space:nowrap;
                      overflow:hidden;text-overflow:ellipsis">
            ${icon} ${c.name}${boostBadge}
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
            Последний контакт: <strong>${lastStr}</strong>
            · каждые ${r.freq} дней
            · bCHS ${r.row.bchs ?? '—'}
          </div>
        </div>
        <div style="font-size:12px;font-weight:700;color:${urgColor};
                    white-space:nowrap;min-width:80px;text-align:right">
          ${r.urgency === 'overdue'
            ? `${Math.abs(r.diffDays)}д просрочено`
            : r.urgency === 'due'
            ? 'сегодня'
            : `через ${r.diffDays}д`}
        </div>
        <select class="form-select tp-type-select" data-cid="${c.id}"
                style="width:130px;font-size:12px;padding:4px 8px">
          ${typeOpts}
        </select>
        <button class="btn btn-primary btn-sm tp-done-btn"
                data-cid="${c.id}" data-name="${c.name}"
                style="white-space:nowrap;font-size:12px">
          ✓ Отметить
        </button>
      </div>`;
  },

  _historySection(touchPoints, clients) {
    const completed = [...touchPoints]
      .filter(tp => tp.completed_at)
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      .slice(0, 20);

    if (!completed.length) return '';

    const clientMap = Object.fromEntries(clients.map(c => [String(c.id), c.name]));

    const rows = completed.map(tp => {
      const t    = TYPE_LABELS[tp.type] ?? { icon: '•', label: tp.type };
      const name = clientMap[String(tp.client_id)] ?? tp.client_id;
      const date = new Date(tp.completed_at).toLocaleDateString('ru-RU',
        { day:'numeric', month:'short' });
      return `<tr>
        <td style="font-size:12px;font-weight:600">${name}</td>
        <td style="font-size:12px">${t.icon} ${t.label}</td>
        <td style="font-size:12px;color:var(--text-muted)">${date}</td>
        <td style="font-size:12px;color:var(--text-secondary);max-width:220px">
  ${this._formatNotePreview(tp.notes)}
</td>
        <td>
          <button class="btn btn-secondary btn-sm tp-del-btn"
                  data-id="${tp.id}" style="font-size:11px;padding:2px 7px">
            ✕
          </button>
        </td>
      </tr>`;
    }).join('');

    return `
      <div class="form-section" style="margin-top:16px">
        <div class="form-section-title">📋 История последних касаний</div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr>
              <th>Клиент</th><th>Тип</th><th>Дата</th><th>Заметка</th><th></th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  },

  _bindEvents(computed, touchPoints) {
    /* Кнопка "Отметить" */
    document.querySelectorAll('.tp-done-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid  = btn.dataset.cid;
        const name = btn.dataset.name;
        const type = document.querySelector(
          `.tp-type-select[data-cid="${cid}"]`
        )?.value ?? 'checkin';
        this._openDoneModal(cid, name, type);
      });
    });

    /* Кнопка "Добавить касание" */
    document.getElementById('tp-add-btn')?.addEventListener('click', () => {
      this._openAddModal(computed);
    });

    /* Кнопка удалить историческое */
    document.querySelectorAll('.tp-del-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        await API.deleteTouchPoint(btn.dataset.id);
        window.App.toast('Удалено', 'success');
        this._load();
      });
    });
  },

  _openDoneModal(clientId, clientName, type) {
    window.App.openModal(`
      <div style="max-width:400px">
        <div style="font-size:15px;font-weight:700;margin-bottom:4px">
          ✓ Отметить касание
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px">
          ${clientName}
        </div>
        <div class="form-group">
          <label class="form-label">Заметка (необязательно)</label>
          <textarea class="form-textarea" id="tp-note-input"
                    style="min-height:80px;resize:vertical"
                    placeholder="Что обсудили, о чём договорились..."></textarea>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="tp-done-confirm" style="flex:1">
            ✓ Сохранить
          </button>
          <button class="btn btn-secondary"
                  onclick="window.App.closeModal()">Отмена</button>
        </div>
      </div>`);

    document.getElementById('tp-done-confirm')?.addEventListener('click', async () => {
      const notes = document.getElementById('tp-note-input')?.value.trim() ?? '';
      try {
        await API.saveTouchPoint({
          client_id:    clientId,
          type,
          completed_at: new Date().toISOString(),
          notes,
        });
        window.App.closeModal();
        window.App.toast(`✅ Касание с ${clientName} отмечено`, 'success');
        this._load();
      } catch (e) {
        window.App.toast('❌ Ошибка: ' + e.message, 'error');
      }
    });
  },

  _openAddModal(computed) {
    const clientOpts = computed
      .sort((a, b) => a.client.name.localeCompare(b.client.name))
      .map(r => `<option value="${r.client.id}">${r.client.name}</option>`)
      .join('');

    const typeOpts = Object.entries(TYPE_LABELS).map(([k, v]) =>
      `<option value="${k}">${v.icon} ${v.label}</option>`
    ).join('');

    window.App.openModal(`
      <div style="max-width:400px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">
          + Добавить касание
        </div>
        <div class="form-group">
          <label class="form-label">Клиент</label>
          <select class="form-select" id="tp-add-client">${clientOpts}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Тип</label>
          <select class="form-select" id="tp-add-type">${typeOpts}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Дата (оставь пустым = сегодня)</label>
          <input class="form-input" type="date" id="tp-add-date"
                 value="${new Date().toISOString().slice(0,10)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Заметка</label>
          <textarea class="form-textarea" id="tp-add-note"
                    style="min-height:70px;resize:vertical"
                    placeholder="Что обсудили..."></textarea>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="tp-add-confirm" style="flex:1">
            Сохранить
          </button>
          <button class="btn btn-secondary"
                  onclick="window.App.closeModal()">Отмена</button>
        </div>
      </div>`);

    document.getElementById('tp-add-confirm')?.addEventListener('click', async () => {
      const clientId = document.getElementById('tp-add-client')?.value;
      const type     = document.getElementById('tp-add-type')?.value ?? 'checkin';
      const date     = document.getElementById('tp-add-date')?.value;
      const notes    = document.getElementById('tp-add-note')?.value.trim() ?? '';
      try {
        await API.saveTouchPoint({
          client_id:    clientId,
          type,
          completed_at: date
            ? new Date(date).toISOString()
            : new Date().toISOString(),
          notes,
        });
        window.App.closeModal();
        window.App.toast('✅ Касание добавлено', 'success');
        this._load();
      } catch (e) {
        window.App.toast('❌ Ошибка: ' + e.message, 'error');
      }
    });
  },

  /* ── Helpers ── */
  _statCard(label, val, color) {
    return `
      <div class="kpi-card" style="text-align:center">
        <div class="kpi-value" style="color:${color}">${val}</div>
        <div class="kpi-label">${label}</div>
      </div>`;
  },

  _daysAgo(date) {
    const days = Math.round((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
    if (days === 0) return 'сегодня';
    if (days === 1) return 'вчера';
    if (days < 7)  return `${days} дн. назад`;
    if (days < 30) return `${Math.round(days / 7)} нед. назад`;
    return `${Math.round(days / 30)} мес. назад`;
  },

  _formatNotePreview(notes) {
    if (!notes) return '<span style="color:var(--text-muted)">—</span>';

    const contextMatch = notes.match(/📋 Контекст:\n([\s\S]*?)(?:\n\n|$)/);
    const tasksMatch   = notes.match(/✅ Задачи:\n([\s\S]*?)(?:\n\n|$)/);
    const nextMatch    = notes.match(/👣 Дальнейшие шаги:\n([\s\S]*?)(?:\n\n|$)/);

    if (contextMatch || tasksMatch || nextMatch) {
      const parts = [];
      if (contextMatch) parts.push(`<span style="color:var(--text-muted);font-size:10px">📋</span> ${contextMatch[1].trim().slice(0,60)}${contextMatch[1].trim().length > 60 ? '…' : ''}`);
      if (tasksMatch)   parts.push(`<span style="color:var(--text-muted);font-size:10px">✅</span> ${tasksMatch[1].trim().slice(0,60)}${tasksMatch[1].trim().length > 60 ? '…' : ''}`);
      if (nextMatch)    parts.push(`<span style="color:var(--text-muted);font-size:10px">👣</span> ${nextMatch[1].trim().slice(0,60)}${nextMatch[1].trim().length > 60 ? '…' : ''}`);
      return parts.map(p => `<div style="line-height:1.5">${p}</div>`).join('');
    }

    const short = notes.slice(0, 80);
    return `<span>${short}${notes.length > 80 ? '…' : ''}</span>`;
  },
};
