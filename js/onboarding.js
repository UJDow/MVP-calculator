/* js/onboarding.js
   Fullscreen экран выбора роли при первом запуске.
   Показывается когда 'bchs_role' отсутствует в localStorage.
   После выбора скрывается, основной интерфейс становится виден.
   ---------------------------------------------------------------- */

const RoleOnboarding = {

  /* ── Ключ localStorage ─────────────────────────────────────── */
  _ROLE_KEY: 'bchs_role',

  /* Три роли с метаданными для карточек */
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

  /* ── Публичный API ─────────────────────────────────────────── */

  /** Нужно ли показывать онбординг? */
  isNeeded() {
    try {
      const role = localStorage.getItem(this._ROLE_KEY);
      return !role || !window.ROLE_CONFIG?.[role];
    } catch {
      return false; // localStorage недоступен — пропускаем
    }
  },

  /** Показать онбординг поверх интерфейса */
  show(onDone) {
    this._onDone = onDone || (() => {});
    const overlay = this._buildOverlay();
    document.body.appendChild(overlay);
    // Анимация появления карточек с задержкой
    requestAnimationFrame(() => {
      overlay.classList.add('rob-visible');
      this._animateCards(overlay);
    });
  },

  /* ── Построение DOM ─────────────────────────────────────────── */

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
          <button class="btn btn-primary rob-start-btn" id="rob-start-btn" disabled>
            Начать работу
          </button>
          <div class="rob-hint" id="rob-hint">Выберите роль чтобы продолжить</div>
        </div>
      </div>`;
  },

  _cardHTML(role, index) {
    const tags = role.tags.map(t => `<span class="rob-tag">${t}</span>`).join('');
    return `
      <div class="rob-card" data-role="${role.id}" style="animation-delay:${index * 100}ms">
        <div class="rob-card-icon">${role.icon}</div>
        <div class="rob-card-label">${role.label}</div>
        <div class="rob-card-desc">${role.description}</div>
        <div class="rob-tags">${tags}</div>
      </div>`;
  },

  /* ── Анимация карточек ──────────────────────────────────────── */

  _animateCards(overlay) {
    const cards = overlay.querySelectorAll('.rob-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('rob-card-visible'), i * 110);
    });
  },

  /* ── Логика событий ─────────────────────────────────────────── */

  _attachEvents(overlay) {
    let selected = null;

    // Клик по карточке
    overlay.addEventListener('click', e => {
      const card = e.target.closest('.rob-card');
      if (!card) return;

      overlay.querySelectorAll('.rob-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selected = card.dataset.role;

      // Активируем кнопку
      const btn  = overlay.querySelector('#rob-start-btn');
      const hint = overlay.querySelector('#rob-hint');
      btn.disabled = false;
      const cfg = window.ROLE_CONFIG?.[selected];
      if (hint && cfg) hint.textContent = cfg.welcome_message;
    });

    // Кнопка «Начать работу»
    overlay.querySelector('#rob-start-btn').addEventListener('click', () => {
      if (!selected) return;
      this._save(selected, overlay);
    });
  },

  /* ── Сохранение и финал ─────────────────────────────────────── */

  _save(roleId, overlay) {
    try {
      localStorage.setItem(this._ROLE_KEY, roleId);
    } catch (e) {
      console.warn('[RoleOnboarding] localStorage недоступен:', e.message);
    }

    // Применяем к навигации
    if (typeof applyRoleToNav === 'function') applyRoleToNav();

    // Анимация закрытия
    overlay.classList.add('rob-hiding');
    setTimeout(() => {
      overlay.remove();
      // Показываем welcome toast
      this._showWelcome(roleId);
      // Вызываем callback
      this._onDone(roleId);
    }, 380);
  },

  _showWelcome(roleId) {
    const cfg = window.ROLE_CONFIG?.[roleId];
    if (!cfg) return;
    // Используем App.toast если доступен, иначе простой div
    if (typeof App !== 'undefined' && App.toast) {
      App.toast(`${cfg.icon || '✅'} ${cfg.welcome_message}`, 'success');
    }
  },
};

/* ── Инлайн-виджет смены роли для страницы настроек ────────────
   Вызывается из ClientsPage или Settings.
   ---------------------------------------------------------------- */
const RoleSelector = {

  /** Рендерит блок выбора роли в переданный контейнер */
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const current = getCurrentRole?.() || 'csm_analyst';
    el.innerHTML = this._html(current);
    this._attachEvents(el, current);
  },

  _html(current) {
    const cards = Object.entries(window.ROLE_CONFIG || {}).map(([id, cfg]) => {
      const active = id === current ? 'rs-card-active' : '';
      const tags   = (cfg.modules ? [] : []).join('');
      return `
        <div class="rs-card ${active}" data-role="${id}">
          <span class="rs-icon">${cfg.icon || '●'}</span>
          <span class="rs-label">${cfg.label}</span>
          ${id === current ? '<span class="rs-current-badge">текущая</span>' : ''}
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
        el.querySelectorAll('.rs-card').forEach(c => c.classList.remove('rs-card-active'));
        card.classList.add('rs-card-active');
        picked = card.dataset.role;
        if (picked !== current) {
          if (typeof setCurrentRole === 'function') setCurrentRole(picked);
          if (typeof applyRoleToNav === 'function') applyRoleToNav();
          const msg = el.querySelector('#rs-msg');
          if (msg) {
            const cfg = window.ROLE_CONFIG?.[picked];
            msg.textContent = `✅ Роль изменена на «${cfg?.label}»`;
            msg.style.display = 'block';
          }
          if (typeof App !== 'undefined' && App.toast) {
            App.toast(`Роль изменена на «${window.ROLE_CONFIG?.[picked]?.label}»`, 'success');
          }
        }
      });
    });
  },
};

window.RoleOnboarding = RoleOnboarding;
window.RoleSelector   = RoleSelector;
