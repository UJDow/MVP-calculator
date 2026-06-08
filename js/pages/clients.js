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
  const isEdit = !!client;
  const v = (f, def = '') => client ? this._esc(String(client[f] ?? def)) : def;

  const sel = (id, opts, val) => opts.map(o =>
    `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`
  ).join('');

  const bcgOpts = Object.entries(BCG_CATEGORIES).map(([k, vv]) =>
    `<option value="${k}" ${(client?.bcg_category ?? 'KEY') === k ? 'selected' : ''}>${vv.label}</option>`
  ).join('');

  const priorityOpts = PRIORITIES.map(p =>
    `<option value="${p}" ${(client?.key_account_priority ?? 'PROTECT') === p ? 'selected' : ''}>${p}</option>`
  ).join('');

  const statusOpts = STATUSES.map(s =>
    `<option value="${s}" ${(client?.status ?? 'Active') === s ? 'selected' : ''}>${s}</option>`
  ).join('');

  window.App.openModal(`
    <div style="padding:4px 0 8px">
      <div style="font-size:16px;font-weight:700;margin-bottom:16px">
        ${isEdit ? `✎ ${this._esc(client.name)}` : '+ Новый клиент'}
      </div>

      <!-- Название -->
      <div class="form-group">
        <label class="form-label">Название компании *</label>
        <input class="form-input" id="cf-name" value="${v('name')}" placeholder="ООО Пример"/>
      </div>

      <!-- Строка 1 -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:10px">
        <div class="form-group" style="margin:0">
          <label class="form-label">Статус</label>
          <select class="form-select" id="cf-status">${statusOpts}</select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">MR (₽/мес)</label>
          <input class="form-input" id="cf-mr" type="number"
                 value="${v('monthly_revenue','5000')}" placeholder="5000"/>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Тип клиента</label>
          <select class="form-select" id="cf-type">
            ${sel('cf-type',['Direct','Partner','Body-shop'], client?.client_type ?? 'Direct')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Фаза</label>
          <select class="form-select" id="cf-phase">
            ${sel('cf-phase',['Discovery','Ongoing','SLA','Winding Down'], client?.phase ?? 'Ongoing')}
          </select>
        </div>
      </div>

      <!-- Стратегическая ценность -->
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);
                  text-transform:uppercase;letter-spacing:.5px;
                  margin:14px 0 8px">Стратегическая ценность</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:10px">
        <div class="form-group" style="margin:0">
          <label class="form-label">Технологическая</label>
          <select class="form-select" id="cf-tech">
            ${sel('', ['Strategic','Standard','Basic'], client?.tech_value ?? 'Standard')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Брендовая</label>
          <select class="form-select" id="cf-brand">
            ${sel('', ['Top','Recognizable','Unknown'], client?.brand_value ?? 'Recognizable')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Потенциал роста</label>
          <select class="form-select" id="cf-growth">
            ${sel('', ['Yes','No'], client?.growth_potential ?? 'Yes')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Managed Services</label>
          <select class="form-select" id="cf-ms">
            ${sel('', ['Yes','Partial','No'], client?.managed_services_potential ?? 'Partial')}
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <div class="form-group" style="margin:0">
          <label class="form-label">Доступ к конечному клиенту</label>
          <select class="form-select" id="cf-access">
            ${sel('', ['Strategic Partner','Potential','Blocks','N/A'], client?.access_to_end_client ?? 'N/A')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Уровень ЛПР</label>
          <select class="form-select" id="cf-dm">
            ${sel('', ['C-level','Tech Lead','Gatekeeper'], client?.decision_maker_level ?? 'Tech Lead')}
          </select>
        </div>
      </div>

      <!-- Операционный профиль -->
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);
                  text-transform:uppercase;letter-spacing:.5px;
                  margin:14px 0 8px">Операционный профиль</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:10px">
        <div class="form-group" style="margin:0">
          <label class="form-label">Длительность контракта</label>
          <select class="form-select" id="cf-contract">
            ${sel('', ['Stable (6+)','Medium (3-6)','Short (1-3)'], client?.contract_length ?? 'Medium (3-6)')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Сложность клиента</label>
          <select class="form-select" id="cf-difficulty">
            ${sel('', ['Normal','Conflict'], client?.client_difficulty ?? 'Normal')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Вовлечённость</label>
          <select class="form-select" id="cf-engagement">
            ${sel('', ['Proactive','Active','Reactive'], client?.client_engagement ?? 'Active')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Операц. сложность</label>
          <select class="form-select" id="cf-opdiff">
            ${sel('', ['Normal','Hard'], client?.operational_difficulty ?? 'Normal')}
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
        <div class="form-group" style="margin:0">
          <label class="form-label">Зрелость команды</label>
          <select class="form-select" id="cf-maturity">
            ${sel('', ['Junior','Standard','Senior'], client?.team_maturity ?? 'Standard')}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Ответственный</label>
          <input class="form-input" id="cf-owner"
                 value="${v('sales_owner')}" placeholder="Имя менеджера"/>
        </div>
      </div>

      <!-- Покрытие -->
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);
                  text-transform:uppercase;letter-spacing:.5px;
                  margin:14px 0 8px">🗺 Покрытие и назначения</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px">
        <div class="form-group" style="margin:0">
          <label class="form-label">Аккаунт-менеджер</label>
          <input class="form-input" id="cf-am"
                 value="${v('account_manager')}" placeholder="Имя АМ"/>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Координатор</label>
          <input class="form-input" id="cf-coord"
                 value="${v('coordinator')}" placeholder="Имя координатора"/>
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">DACH-регион</label>
          <select class="form-select" id="cf-region">
            ${sel('', ['— не выбран —','DE','AT','CH','Other'],
              client?.dach_region ?? '— не выбран —')}
          </select>
        </div>
      </div>

      <!-- Заметки -->
      <div class="form-group">
        <label class="form-label">Заметки о стратегии</label>
        <textarea class="form-textarea" id="cf-notes"
                  style="min-height:70px;resize:vertical">${v('strategy_notes')}</textarea>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px">
        <button class="btn btn-secondary" onclick="window.App.closeModal()">Отмена</button>
        <button class="btn btn-primary" id="cf-save">
          ${isEdit ? '💾 Сохранить' : '✚ Создать клиента'}
        </button>
      </div>
    </div>
  `);

  document.getElementById('cf-save')
    .addEventListener('click', () => this._saveForm());
},

async _saveForm() {
  const g  = id => document.getElementById(id)?.value.trim() ?? '';
  const name = g('cf-name');
  if (!name) { window.App.toast('Введите название клиента', 'error'); return; }

  const data = {
    name,
    status:                     g('cf-status'),
    monthly_revenue:            Number(g('cf-mr')) || 0,
    client_type:                g('cf-type'),
    phase:                      g('cf-phase'),
    tech_value:                 g('cf-tech'),
    brand_value:                g('cf-brand'),
    growth_potential:           g('cf-growth'),
    managed_services_potential: g('cf-ms'),
    access_to_end_client:       g('cf-access'),
    decision_maker_level:       g('cf-dm'),
    contract_length:            g('cf-contract'),
    client_difficulty:          g('cf-difficulty'),
    client_engagement:          g('cf-engagement'),
    operational_difficulty:     g('cf-opdiff'),
    team_maturity:              g('cf-maturity'),
    sales_owner:                g('cf-owner'),
    account_manager:            g('cf-am'),
    coordinator:                g('cf-coord'),
    dach_region:                g('cf-region') === '— не выбран —' ? '' : g('cf-region'),
    strategy_notes:             g('cf-notes'),
  };

  const btn = document.getElementById('cf-save');
  btn.disabled = true; btn.textContent = '⏳ Сохраняем...';

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
    window.App.closeModal();
    await this.loadAndRender();
  } catch (err) {
    console.error('[ClientsPage._saveForm]', err);
    window.App.toast('❌ Ошибка сохранения', 'error');
    btn.disabled = false;
    btn.textContent = this.editingId ? '💾 Сохранить' : '✚ Создать клиента';
  }
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
