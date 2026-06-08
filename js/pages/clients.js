/* ============================================
   js/pages/clients.js — Client Management Page (ES Module)
   Portfolio BCHS v7.0
   ============================================ */

import { BCG_CATEGORIES, PRIORITIES, STATUSES } from '../constants.js';
import { API } from '../api.js';

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
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
          <div>
            <div class="page-title">Клиенты</div>
            <div class="page-subtitle">Управление портфелем клиентов</div>
          </div>
          <button class="btn btn-primary" id="btn-add-client">+ Добавить клиента</button>
        </div>
      </div>
      <div id="clients-list-container">
        <div style="padding:40px;text-align:center;color:var(--text-muted)">Загрузка...</div>
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
          <div class="empty-state-text">Добавьте первого клиента, чтобы начать работу</div>
        </div>`;
      return;
    }

    const active  = this.clients.filter(c => c.status === 'Active');
    const paused  = this.clients.filter(c => c.status === 'Paused');
    const selfmgd = this.clients.filter(c => c.status === 'Self-managed');

    let html = '';
    if (active.length)  html += this._renderGroup('✅ Активные',       active);
    if (paused.length)  html += this._renderGroup('⏸ На паузе',        paused);
    if (selfmgd.length) html += this._renderGroup('🔧 Самоуправление', selfmgd);

    container.innerHTML = html;
    this._bindListEvents();
  },

  /* ─── GROUP ───────────────────────────────────────────────── */
  _renderGroup(title, clients) {
    return `
      <div style="margin-bottom:20px">
        <div class="section-header">
          ${title}<span class="section-count">${clients.length}</span>
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
           style="${isHighlighted ? 'border-color:var(--blue);box-shadow:0 0 0 1px var(--blue-border)' : ''}">
        <div class="client-card-info">
          <div class="client-card-name">${c.name}</div>
          <div class="client-card-meta">
            <span class="bcg-badge">${bcg ? bcg.label : c.bcg_category}</span>
            <span>🎯 ${c.key_account_priority}</span>
            <span>👤 ${c.sales_owner || '—'}</span>
          </div>
        </div>
        <div class="client-card-actions">
          <button class="btn btn-secondary btn-sm" data-action="detail" data-id="${c.id}">📊 Детали</button>
          <button class="btn btn-secondary btn-sm" data-action="edit"   data-id="${c.id}">✎ Изменить</button>
          <button class="btn btn-danger btn-sm"    data-action="delete" data-id="${c.id}">✕</button>
        </div>
      </div>`;
  },

  /* ─── LIST EVENTS ─────────────────────────────────────────── */
  _bindListEvents() {
    document.querySelectorAll('[data-action="detail"]').forEach(btn =>
      btn.addEventListener('click', () => window.App.navigate('detail', btn.dataset.id))
    );

    document.querySelectorAll('[data-action="edit"]').forEach(btn =>
      btn.addEventListener('click', () => {
        const client = this.clients.find(c => c.id === btn.dataset.id);
        if (client) { this.editingId = client.id; this.showForm(client); }
      })
    );

    document.querySelectorAll('[data-action="delete"]').forEach(btn =>
      btn.addEventListener('click', async () => {
        const client = this.clients.find(c => c.id === btn.dataset.id);
        if (!client) return;
        if (!confirm(`Удалить клиента «${client.name}»?\nВсе данные bCHS и PC будут недоступны.`)) return;
        await API.deleteClient(btn.dataset.id);
        window.App.toast(`«${client.name}» удалён`, '');
        await this.loadAndRender();
      })
    );
  },

  /* ═══════════════════════════════════════════════════════════
     WIZARD FORM — 3 шага
     ═══════════════════════════════════════════════════════════ */
  showForm(client) {
    const isEdit = !!client;
    const v   = (f, def = '') => client ? this._esc(String(client[f] ?? def)) : def;
    const sel = (opts, val)   => opts.map(o =>
      `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`
    ).join('');

    const statusOpts = STATUSES.map(s =>
      `<option value="${s}" ${(client?.status ?? 'Active') === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    // ── определяем шаги ──
    const steps = [
      {
        emoji: '🏢',
        title: 'Основное',
        hint:  'Название, статус и тип клиента',
        html: () => `
          <div class="wiz-field">
            <label class="wiz-label">Название компании <span style="color:#ef4444">*</span></label>
            <input class="form-input" id="cf-name" placeholder="ООО Пример"
                   value="${v('name')}" style="font-size:16px;padding:12px" autofocus/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
            <div class="wiz-field">
              <label class="wiz-label">Статус</label>
              <select class="form-select" id="cf-status">${statusOpts}</select>
            </div>
            <div class="wiz-field">
              <label class="wiz-label">MR (₽/мес)</label>
              <input class="form-input" id="cf-mr" type="number"
                     value="${v('monthly_revenue','5000')}" placeholder="5000"/>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
            <div class="wiz-field">
              <label class="wiz-label">Тип клиента</label>
              <select class="form-select" id="cf-type">
                ${sel(['Direct','Partner','Body-shop'], client?.client_type ?? 'Direct')}
              </select>
            </div>
            <div class="wiz-field">
              <label class="wiz-label">Фаза</label>
              <select class="form-select" id="cf-phase">
                ${sel(['Discovery','Ongoing','SLA','Winding Down'], client?.phase ?? 'Ongoing')}
              </select>
            </div>
          </div>
          <!-- Только для Partner -->
          <div id="cf-access-wrap" style="display:none;margin-top:12px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div class="wiz-field">
                <label class="wiz-label">Доступ к конечному клиенту</label>
                <select class="form-select" id="cf-access">
                  ${sel(['Strategic Partner','Potential','Blocks','N/A'], client?.access_to_end_client ?? 'N/A')}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Уровень ЛПР</label>
                <select class="form-select" id="cf-dm">
                  ${sel(['C-level','Tech Lead','Gatekeeper'], client?.decision_maker_level ?? 'Tech Lead')}
                </select>
              </div>
            </div>
          </div>`
      },
      {
        emoji: '📊',
        title: 'Профиль',
        hint:  'Стратегическая и операционная ценность',
        html: () => `
          <div style="background:#f8fafc;border-radius:10px;padding:14px;margin-bottom:12px">
            <div style="font-size:11px;font-weight:700;color:#64748b;letter-spacing:.06em;margin-bottom:10px">
              🎯 СТРАТЕГИЧЕСКАЯ ЦЕННОСТЬ
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div class="wiz-field">
                <label class="wiz-label">Технологическая</label>
                <select class="form-select" id="cf-tech">
                  ${sel(['Strategic','Standard','Basic'], client?.tech_value ?? 'Standard')}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Брендовая</label>
                <select class="form-select" id="cf-brand">
                  ${sel(['Top','Recognizable','Unknown'], client?.brand_value ?? 'Recognizable')}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Потенциал роста</label>
                <select class="form-select" id="cf-growth">
                  ${sel(['Yes','No'], client?.growth_potential ?? 'Yes')}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Managed Services</label>
                <select class="form-select" id="cf-ms">
                  ${sel(['Yes','Partial','No'], client?.managed_services_potential ?? 'Partial')}
                </select>
              </div>
            </div>
          </div>
          <div style="background:#f8fafc;border-radius:10px;padding:14px">
            <div style="font-size:11px;font-weight:700;color:#64748b;letter-spacing:.06em;margin-bottom:10px">
              ⚙️ ОПЕРАЦИОННЫЙ ПРОФИЛЬ
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div class="wiz-field">
                <label class="wiz-label">Длительность контракта</label>
                <select class="form-select" id="cf-contract">
                  ${sel(['Stable (6+)','Medium (3-6)','Short (1-3)'], client?.contract_length ?? 'Medium (3-6)')}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Сложность клиента</label>
                <select class="form-select" id="cf-difficulty">
                  ${sel(['Normal','Conflict'], client?.client_difficulty ?? 'Normal')}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Вовлечённость</label>
                <select class="form-select" id="cf-engagement">
                  ${sel(['Proactive','Active','Reactive'], client?.client_engagement ?? 'Active')}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Операц. сложность</label>
                <select class="form-select" id="cf-opdiff">
                  ${sel(['Normal','Hard'], client?.operational_difficulty ?? 'Normal')}
                </select>
              </div>
            </div>
          </div>`
      },
      {
        emoji: '👥',
        title: 'Команда',
        hint:  'Кто работает с клиентом',
        html: () => `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="wiz-field">
              <label class="wiz-label">Зрелость команды</label>
              <select class="form-select" id="cf-maturity">
                ${sel(['Junior','Standard','Senior'], client?.team_maturity ?? 'Standard')}
              </select>
            </div>
            <div class="wiz-field">
              <label class="wiz-label">Ответственный</label>
              <input class="form-input" id="cf-owner"
                     value="${v('sales_owner')}" placeholder="Имя менеджера"/>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
            <div class="wiz-field">
              <label class="wiz-label">Аккаунт-менеджер</label>
              <input class="form-input" id="cf-am"
                     value="${v('account_manager')}" placeholder="Имя АМ"/>
            </div>
            <div class="wiz-field">
              <label class="wiz-label">Координатор</label>
              <input class="form-input" id="cf-coord"
                     value="${v('coordinator')}" placeholder="Имя координатора"/>
            </div>
          </div>
          <div class="wiz-field" style="margin-top:12px">
            <label class="wiz-label">DACH-регион</label>
            <select class="form-select" id="cf-region">
              ${sel(['— не выбран —','DE','AT','CH','Other'], client?.dach_region ?? '— не выбран —')}
            </select>
          </div>
          <div class="wiz-field" style="margin-top:12px">
            <label class="wiz-label">Заметки о стратегии</label>
            <textarea class="form-textarea" id="cf-notes"
                      style="min-height:80px;resize:vertical"
                      placeholder="Любые важные детали...">${v('strategy_notes')}</textarea>
          </div>`
      }
    ];

    let currentStep = 0;

    // ── инжектим стили один раз ──
    if (!document.getElementById('wiz-styles')) {
      const s = document.createElement('style');
      s.id = 'wiz-styles';
      s.textContent = `
        .wiz-field { display:flex; flex-direction:column; gap:4px }
        .wiz-label { font-size:11px; font-weight:700; color:#6b7280;
                     letter-spacing:.05em; text-transform:uppercase }
      `;
      document.head.appendChild(s);
    }

    // ── прогресс-бар ──
    const progressHTML = () => steps.map((s, i) => `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">
        <div style="
          width:36px;height:36px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:16px;transition:all .2s;
          ${i < currentStep
            ? 'background:#22c55e;color:#fff'
            : i === currentStep
              ? 'background:#2563eb;color:#fff;box-shadow:0 0 0 3px #bfdbfe'
              : 'background:#e5e7eb;color:#9ca3af'}
        ">${i < currentStep ? '✓' : s.emoji}</div>
        <div style="font-size:10px;font-weight:${i === currentStep ? '700' : '400'};
                    color:${i === currentStep ? '#2563eb' : i < currentStep ? '#22c55e' : '#9ca3af'}">
          ${s.title}
        </div>
      </div>
      ${i < steps.length - 1
        ? `<div style="flex:1;height:2px;margin-top:18px;max-width:40px;
                       background:${i < currentStep ? '#22c55e' : '#e5e7eb'}"></div>`
        : ''}
    `).join('');

    // ── шаблон модалки ──
    const buildHTML = () => `
      <div style="padding:24px;width:100%;max-width:480px;box-sizing:border-box">

        <!-- прогресс -->
        <div style="display:flex;align-items:center;margin-bottom:24px">
          ${progressHTML()}
        </div>

        <!-- заголовок шага -->
        <div style="margin-bottom:16px">
          <div style="font-size:18px;font-weight:700;color:#111827">
            ${steps[currentStep].emoji} ${steps[currentStep].title}
          </div>
          <div style="font-size:13px;color:#6b7280;margin-top:2px">
            ${steps[currentStep].hint}
          </div>
        </div>

        <div style="border-top:1px solid #f3f4f6;margin-bottom:18px"></div>

        <!-- тело шага -->
        <div id="wiz-body">${steps[currentStep].html()}</div>

        <!-- кнопки -->
        <div style="display:flex;gap:10px;margin-top:20px;align-items:center">
          ${currentStep > 0
            ? `<button id="wiz-back" class="btn btn-secondary" style="min-width:80px">← Назад</button>`
            : ''}
          <div style="flex:1"></div>
          <button id="wiz-cancel" class="btn btn-secondary">Отмена</button>
          ${currentStep < steps.length - 1
            ? `<button id="wiz-next" class="btn btn-primary" style="min-width:100px">Далее →</button>`
            : `<button id="wiz-save" class="btn btn-primary" style="min-width:130px">
                 ${isEdit ? '💾 Сохранить' : '🚀 Создать клиента'}
               </button>`
          }
        </div>

      </div>`;

    // ── перерисовка ──
    const rerender = () => {
      const wrap = document.querySelector('#modal-overlay > div, .modal-inner, .modal-content');
      if (wrap) wrap.innerHTML = buildHTML();
      bindStep();
    };

    // ── биндинг кнопок и полей текущего шага ──
    const bindStep = () => {
      document.getElementById('wiz-cancel')
        ?.addEventListener('click', () => window.App.closeModal?.());

      document.getElementById('wiz-back')
        ?.addEventListener('click', () => { currentStep--; rerender(); });

      document.getElementById('wiz-next')
        ?.addEventListener('click', () => {
          if (currentStep === 0) {
            const name = document.getElementById('cf-name')?.value.trim();
            if (!name) {
              document.getElementById('cf-name')?.focus();
              window.App.toast?.('Введи название компании', 'error');
              return;
            }
          }
          currentStep++;
          rerender();
        });

      document.getElementById('wiz-save')
        ?.addEventListener('click', () => this._saveForm());

      // показываем поля Partner только на шаге 1
      if (currentStep === 0) {
        const typeSelect = document.getElementById('cf-type');
        const accessWrap = document.getElementById('cf-access-wrap');
        const toggle = () => {
          if (accessWrap) accessWrap.style.display =
            typeSelect?.value === 'Partner' ? 'block' : 'none';
        };
        typeSelect?.addEventListener('change', toggle);
        toggle();
      }
    };

    window.App.openModal(buildHTML(), { hideClose: false });
    bindStep();
  },

  /* ─── SAVE ────────────────────────────────────────────────── */
  async _saveForm() {
    const g         = id => document.getElementById(id)?.value.trim() ?? '';
    const name      = g('cf-name');
    if (!name) { window.App.toast('Введите название клиента', 'error'); return; }

    const isPartner = g('cf-type') === 'Partner';

    const data = {
      name,
      status:                     g('cf-status'),
      monthly_revenue:            Number(g('cf-mr')) || 0,
      client_type:                g('cf-type'),
      phase:                      g('cf-phase'),
      access_to_end_client:       isPartner ? g('cf-access') : null,
      decision_maker_level:       isPartner ? g('cf-dm')     : null,
      tech_value:                 g('cf-tech'),
      brand_value:                g('cf-brand'),
      growth_potential:           g('cf-growth'),
      managed_services_potential: g('cf-ms'),
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

    const btn = document.getElementById('wiz-save');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Сохраняем...'; }

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
      window.App.closeModal?.();
      await this.loadAndRender();
    } catch (err) {
      console.error('[ClientsPage._saveForm]', err);
      window.App.toast('❌ Ошибка сохранения', 'error');
      if (btn) {
        btn.disabled    = false;
        btn.textContent = this.editingId ? '💾 Сохранить' : '🚀 Создать клиента';
      }
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
