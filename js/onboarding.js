/* ============================================
   js/onboarding.js — Role Onboarding (ES Module)
   Portfolio BCHS v7.0
   Fullscreen экран выбора роли при первом запуске.
   ============================================ */

import {
  ROLE_CONFIG,
  getCurrentRole,
  setCurrentRole,
  applyRoleToNav,
} from './role_config.js';

/* ══════════════════════════════════════════════
   RoleOnboarding — полноэкранный выбор роли
══════════════════════════════════════════════ */
export const RoleOnboarding = {

  _ROLE_KEY: 'bchs_role',
  _onDone:   null,

  _ROLES: [
    {
      id:          'service_delivery',
      icon:        '🎯',
      label:       'Service Delivery',
      description: 'Операционное управление командой. Утилизация, аллокация, замены, эскалации.',
      tags:        ['FTE & часы', 'Замены', 'Эскалации', 'Команда'],
    },
    {
      id:          'account_manager',
      icon:        '🤝',
      label:       'Account Manager',
      description: 'Управление отношениями с клиентом. Revenue, здоровье аккаунта, активности.',
      tags:        ['Revenue', 'bCHS', 'Статусы', 'Активности'],
    },
    {
      id:          'csm_analyst',
      icon:        '📊',
      label:       'CSM / Analyst',
      description: 'Полный доступ. Стратегии, прогнозы, Monte Carlo, BCG-анализ.',
      tags:        ['Полный доступ', 'Monte Carlo', 'BCG', 'AI-стратегии'],
    },
  ],

  /* ── Публичный API ────────────────────────────────────────── */

  /**
   * Нужно ли показывать онбординг?
   * Возвращает true если роль не выбрана или не существует в конфиге.
   */
  isNeeded() {
    try {
      const role = localStorage.getItem(this._ROLE_KEY);
      return !role || !ROLE_CONFIG[role];
    } catch {
      return false; // localStorage недоступен — пропускаем онбординг
    }
  },

  /**
   * Показать онбординг поверх интерфейса.
   * @param {Function} onDone — callback(roleId) после выбора роли
   */
  show(onDone) {
    this._onDone = onDone ?? (() => {});
    const overlay = this._buildOverlay();
    document.body.appendChild(overlay);

    /* Анимация появления — ждём следующий кадр */
    requestAnimationFrame(() => {
      overlay.classList.add('rob-visible');
      this._animateCards(overlay);
    });
  },

  /* ── Построение DOM ─────────────────────────────────────── */

  _buildOverlay() {
    const el = document.createElement('div');
    el.id        = 'role-onboarding-overlay';
    el.className = 'rob-overlay';
    el.innerHTML = this._html();
    this._attachEvents(el);
    return el;
  },

  _html() {
    const cards = this._ROLES.map((r, i) => this._cardHTML(r, i)).join('');
    return `
      <div class="rob-box">
        <div class="rob-header">
          <div class="rob-logo">▣</div>
          <h1 class="rob-title">Добро пожаловать в BCHS</h1>
          <p class="rob-subtitle">
            Выбери свою роль — платформа настроится под тебя.<br>
            Это можно изменить позже в настройках.
          </p>
        </div>
        <div class="rob-cards" id="rob-cards">
          ${cards}
        </div>
        <div class="rob-footer">
          <button class="btn btn-primary rob-start-btn"
                  id="rob-start-btn" disabled>
            Начать работу
          </button>
          <div class="rob-hint" id="rob-hint">Выберите роль чтобы продолжить</div>
        </div>
      </div>`;
  },

  _cardHTML(role, index) {
    const tags = role.tags.map(t => `<span class="rob-tag">${t}</span>`).join('');
    return `
      <div class="rob-card" data-role="${role.id}"
           style="animation-delay:${index * 100}ms">
        <div class="rob-card-icon">${role.icon}</div>
        <div class="rob-card-label">${role.label}</div>
        <div class="rob-card-desc">${role.description}</div>
        <div class="rob-tags">${tags}</div>
      </div>`;
  },

  /* ── Анимация карточек ───────────────────────────────────── */

  _animateCards(overlay) {
    overlay.querySelectorAll('.rob-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('rob-card-visible'), i * 110);
    });
  },

  /* ── События ────────────────────────────────────────────── */

  _attachEvents(overlay) {
    let selected = null;

    /* Клик по карточке роли */
    overlay.addEventListener('click', e => {
      const card = e.target.closest('.rob-card');
      if (!card) return;

      overlay.querySelectorAll('.rob-card')
        .forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selected = card.dataset.role;

      const btn  = overlay.querySelector('#rob-start-btn');
      const hint = overlay.querySelector('#rob-hint');
      if (btn) btn.disabled = false;

      /* Показываем welcome_message из ROLE_CONFIG */
      const cfg = ROLE_CONFIG[selected];
      if (hint && cfg) hint.textContent = cfg.welcome_message;
    });

    /* Кнопка «Начать работу» */
    overlay.querySelector('#rob-start-btn')
      ?.addEventListener('click', () => {
        if (!selected) return;
        this._save(selected, overlay);
      });
  },

  /* ── Сохранение и завершение ─────────────────────────────── */

  _save(roleId, overlay) {
    try {
      localStorage.setItem(this._ROLE_KEY, roleId);
    } catch (e) {
      console.warn('[RoleOnboarding] localStorage недоступен:', e.message);
    }

    /* Применяем роль к навигации немедленно */
    applyRoleToNav();

    /* Анимация закрытия */
    overlay.classList.add('rob-hiding');
    setTimeout(() => {
      overlay.remove();
      this._showWelcome(roleId);
      this._onDone?.(roleId);
    }, 380);
  },

  _showWelcome(roleId) {
    const cfg = ROLE_CONFIG[roleId];
    if (!cfg) return;
    /* window.App доступен т.к. app.js уже выполнился к этому моменту */
    window.App?.toast(`${cfg.icon || '✅'} ${cfg.welcome_message}`, 'success');
  },
};

/* ══════════════════════════════════════════════
   RoleSelector — инлайн-виджет смены роли
   Используется в ClientsPage или Settings.
══════════════════════════════════════════════ */
export const RoleSelector = {

  /**
   * Рендерит блок выбора роли в переданный контейнер.
   * @param {string} containerId — id DOM-элемента
   */
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const current = getCurrentRole();
    el.innerHTML = this._html(current);
    this._attachEvents(el, current);
  },

  _html(current) {
    const cards = Object.entries(ROLE_CONFIG).map(([id, cfg]) => {
      const isActive = id === current;
      return `
        <div class="rs-card${isActive ? ' rs-card-active' : ''}"
             data-role="${id}">
          <span class="rs-icon">${cfg.icon || '●'}</span>
          <span class="rs-label">${cfg.label}</span>
          ${isActive
            ? '<span class="rs-current-badge">текущая</span>'
            : ''}
        </div>`;
    }).join('');

    return `
      <div class="rs-wrap">
        <div class="form-section-title" style="margin-bottom:12px">🔖 Моя роль</div>
        <div class="rs-cards">${cards}</div>
        <div class="rs-msg" id="rs-msg" style="display:none"></div>
      </div>`;
  },

  _attachEvents(el, current) {
    let picked = current;

    el.querySelectorAll('.rs-card').forEach(card => {
      card.addEventListener('click', () => {
        el.querySelectorAll('.rs-card')
          .forEach(c => c.classList.remove('rs-card-active'));
        card.classList.add('rs-card-active');
        picked = card.dataset.role;

        if (picked === current) return;   // роль не изменилась

        /* Сохраняем и применяем */
        setCurrentRole(picked);
        applyRoleToNav();

        /* Сообщение в контейнере */
        const msg = el.querySelector('#rs-msg');
        if (msg) {
          const cfg = ROLE_CONFIG[picked];
          msg.textContent  = `✅ Роль изменена на «${cfg?.label ?? picked}»`;
          msg.style.display = 'block';
        }

        /* Toast через window.App */
        const cfg = ROLE_CONFIG[picked];
        window.App?.toast(
          `Роль изменена на «${cfg?.label ?? picked}»`,
          'success'
        );
      });
    });
  },
};

/* ── Expose globals для обратной совместимости ── */
window.RoleOnboarding = RoleOnboarding;
window.RoleSelector   = RoleSelector;
