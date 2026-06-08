/* ============================================
   js/pages/clients.js — Client Management Page (ES Module)
   Portfolio BCHS v7.0
   ============================================ */

import { BCG_CATEGORIES, PRIORITIES, STATUSES } from '../constants.js';
import { API } from '../api.js';

/* ══════════════════════════════════════════════════════════════
   CLIENTS PAGE
   ══════════════════════════════════════════════════════════════ */

export const ClientsPage = {
  clients:     [],
  editingId:   null,
  highlightId: null,

  /* ─── RENDER ──────────────────────────────────────────────── */
  async render(highlightId) {
    this.highlightId = highlightId || null;
    const main = document.getElementById('main-content');

    main.innerHTML = `
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;
                    flex-wrap:wrap;gap:10px">
          <div>
            <div class="page-title">Клиенты</div>
            <div class="page-subtitle">Управление портфелем клиентов</div>
          </div>
          <button class="btn btn-primary" id="btn-add-client">+ Добавить клиента</button>
        </div>
      </div>

      <div id="clients-list-container">
        <div style="padding:40px;text-align:center;color:var(--text-muted)">
          Загрузка...
        </div>
      </div>

      <div id="client-form-container" class="hidden"></div>
    `;

    document.getElementById('btn-add-client').addEventListener('click', () => {
      this.editingId = null;
      this.showForm(null);
    });

    await this.loadAndRender();

    if (highlightId) {
      this.editingId = highlightId;
      const client = this.clients.find(c => c.id === highlightId);
      if (client) this.showForm(client);
    }
  },

  /* ─── LOAD ────────────────────────────────────────────────── */
  async loadAndRender() {
    this.clients = await API.getClients();
    this.renderList();
  },

  /* ─── LIST ────────────────────────────────────────────────── */
  renderList() {
    const container = document.getElementById('clients-list-container');
    if (!container) return;

    if (this.clients.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👤</div>
          <div class="empty-state-title">Нет клиентов</div>
          <div class="empty-state-text">
            Добавьте первого клиента, чтобы начать работу
          </div>
        </div>`;
      return;
    }

    const active  = this.clients.filter(c => c.status === 'Active');
    const paused  = this.clients.filter(c => c.status === 'Paused');
    const selfmgd = this.clients.filter(c => c.status === 'Self-managed');

    let html = '';
    if (active.length)  html += this._renderGroup('✅ Активные',       active);
    if (paused.length)  html += this._renderGroup('⏸ На паузе',       paused);
    if (selfmgd.length) html += this._renderGroup('🔧 Самоуправление', selfmgd);

    container.innerHTML = html;
    this._bindListEvents();
  },

  /* ─── GROUP ───────────────────────────────────────────────── */
  _renderGroup(title, clients) {
    return `
      <div style="margin-bottom:20px">
        <div class="section-header">
          ${title}
          <span class="section-count">${clients.length}</span>
        </div>
        ${clients.map(c => this._renderClientCard(c)).join('')}
      </div>`;
  },

  /* ─── CARD ────────────────────────────────────────────────── */
  _renderClientCard(c) {
    const bcg           = BCG_CATEGORIES[c.bcg_category];
    const isHighlighted = this.highlightId === c.id;

    return `
      <div class="client-card${isHighlighted ? ' expanded' : ''}"
           data-id="${c.id}"
           style="${isHighlighted
             ? 'border-color:var(--blue);box-shadow:0 0 0 1px var(--blue-border)'
             : ''}">
        <div class="client-card-info">
          <div class="client-card-name">${c.name}</div>
          <div class="client-card-meta">
            <span class="bcg-badge">${bcg ? bcg.label : c.bcg_category}</span>
            <span>🎯 ${c.key_account_priority}</span>
            <span>👤 ${c.sales_owner || '—'}</span>
          </div>
        </div>
        <div class="client-card-actions">
          <button class="btn btn-secondary btn-sm"
                  data-action="detail" data-id="${c.id}">📊 Детали</button>
          <button class="btn btn-secondary btn-sm"
                  data-action="edit"   data-id="${c.id}">✎ Изменить</button>
          <button class="btn btn-danger btn-sm"
                  data-action="delete" data-id="${c.id}">✕</button>
        </div>
      </div>`;
  },

  /* ─── LIST EVENTS ─────────────────────────────────────────── */
  _bindListEvents() {
    document.querySelectorAll('[data-action="detail"]').forEach(btn => {
      btn.addEventListener('click', () =>
        window.App.navigate('detail', btn.dataset.id)
      );
    });

    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const client = this.clients.find(c => c.id === btn.dataset.id);
        if (client) {
          this.editingId = client.id;
          this.showForm(client);
        }
      });
    });

    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const client = this.clients.find(c => c.id === btn.dataset.id);
        if (!client) return;
        if (!confirm(
          `Удалить клиента «${client.name}»?\nВсе данные bCHS и PC будут недоступны.`
        )) return;

        await API.deleteClient(btn.dataset.id);
        window.App.toast(`«${client.name}» удалён`, '');
        await this.loadAndRender();
      });
    });
  },

  /* ═══════════════════════════════════════════════════════════
     FORM
     ═══════════════════════════════════════════════════════════ */
  showForm(client) {
    const isEdit    = !!client;
    const container = document.getElementById('client-form-container');
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const bcgOpts = Object.entries(BCG_CATEGORIES).map(([k, v]) =>
      `<option value="${k}" ${client?.bcg_category === k ? 'selected' : ''}>
        ${v.label}
      </option>`
    ).join('');

    const priorityOpts = PRIORITIES.map(p =>
      `<option value="${p}" ${client?.key_account_priority === p ? 'selected' : ''}>
        ${p}
      </option>`
    ).join('');

    const statusOpts = STATUSES.map(s =>
      `<option value="${s}"
        ${client
          ? client.status === s ? 'selected' : ''
          : s === 'Active'     ? 'selected' : ''}>
        ${s}
      </option>`
    ).join('');

    container.innerHTML = `
      <hr class="divider" />
      <div class="form-section">
        <div class="form-section-title">
          ${isEdit ? `✎ Редактировать: ${client.name}` : '+ Новый клиент'}
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Название клиента *</label>
            <input type="text" class="form-input" id="cf-name"
                   value="${client ? this._esc(client.name) : ''}"
                   placeholder="ООО Пример" />
          </div>

          <div class="form-group">
            <label class="form-label">Статус</label>
            <select class="form-select" id="cf-status">${statusOpts}</select>
          </div>

          <div class="form-group">
            <label class="form-label">BCG категория</label>
            <select class="form-select" id="cf-bcg">${bcgOpts}</select>
          </div>

          <div class="form-group">
            <label class="form-label">Приоритет (Key Account)</label>
            <select class="form-select" id="cf-priority">${priorityOpts}</select>
          </div>

          <div class="form-group">
            <label class="form-label">Ответственный менеджер</label>
            <input type="text" class="form-input" id="cf-owner"
                   value="${client ? this._esc(client.sales_owner || '') : ''}"
                   placeholder="Имя менеджера" />
          </div>
        </div>

        <div class="form-group full" style="margin-top:14px">
          <label class="form-label">Стратегические заметки</label>
          <textarea class="form-textarea" id="cf-notes" rows="4">${
            client ? this._esc(client.strategy_notes || '') : ''
          }</textarea>
        </div>

        <!-- BCG Quick Reference -->
        <div style="margin-top:16px;padding:12px;background:var(--bg);
                    border-radius:var(--radius-sm);border:1px solid var(--border-light)">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);
                      text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">
            📋 Справка: BCG × Приоритет
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
                      gap:8px;font-size:11.5px;color:var(--text-secondary)">
            <div>⭐ KEY — крупнейшие клиенты, max ресурс</div>
            <div>💎 GROWTH — потенциал роста, инвестиции</div>
            <div>🌱 GROWTH (early) — молодые, в развитии</div>
            <div>📦 TAIL — зрелые/стабильные, минимум усилий</div>
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
          <button class="btn btn-primary" id="cf-save">
            ${isEdit ? '💾 Сохранить изменения' : '✚ Создать клиента'}
          </button>
          <button class="btn btn-secondary" id="cf-cancel">Отмена</button>
        </div>
      </div>
    `;

    document.getElementById('cf-save')
      .addEventListener('click', () => this._saveForm());

    document.getElementById('cf-cancel').addEventListener('click', () => {
      container.classList.add('hidden');
      container.innerHTML  = '';
      this.editingId       = null;
      this.highlightId     = null;
    });
  },

  /* ─── SAVE ────────────────────────────────────────────────── */
  async _saveForm() {
    const name = document.getElementById('cf-name').value.trim();
    if (!name) {
      window.App.toast('Введите название клиента', 'error');
      return;
    }

    const data = {
      name,
      status:               document.getElementById('cf-status').value,
      bcg_category:         document.getElementById('cf-bcg').value,
      key_account_priority: document.getElementById('cf-priority').value,
      sales_owner:          document.getElementById('cf-owner').value.trim(),
      strategy_notes:       document.getElementById('cf-notes').value.trim(),
    };

    const btn = document.getElementById('cf-save');
    btn.textContent = '⏳ Сохраняем...';
    btn.disabled    = true;

    try {
      if (this.editingId) {
        await API.updateClient(this.editingId, data);
        window.App.toast('✅ Клиент обновлён', 'success');
      } else {
        await API.createClient(data);
        window.App.toast('✅ Клиент создан', 'success');
      }

      this.editingId   = null;
      this.highlightId = null;

      const container = document.getElementById('client-form-container');
      container.classList.add('hidden');
      container.innerHTML = '';

      await this.loadAndRender();

    } catch (err) {
      console.error('[ClientsPage._saveForm]', err);
      window.App.toast('❌ Ошибка сохранения', 'error');
      btn.textContent = this.editingId
        ? '💾 Сохранить изменения'
        : '✚ Создать клиента';
      btn.disabled = false;
    }
  },

  /* ─── UTILS ───────────────────────────────────────────────── */
  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },
};
