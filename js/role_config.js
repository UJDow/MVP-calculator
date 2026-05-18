/* js/role_config.js
   Конфигурация ролей — какие модули видны и что акцентировать.
   Читается в App.init(), DashboardPage, DetailPage.
   ---------------------------------------------------------------- */

const ROLE_CONFIG = {

  /* ── Service Delivery ─────────────────────────────────────────── */
  service_delivery: {
    label: 'Service Delivery',
    icon:  '🎯',
    modules: {
      dashboard:           true,
      portfolio:           true,
      detail_overview:     true,
      detail_history:      true,
      detail_status_log:   true,
      detail_delivery:     true,   // новый таб (Задача 3+)
      detail_monte_carlo:  false,
      clients:             true,
      entry:               true,
      monte_carlo_page:    false,
      ai_strategies:       false,
      bcg_analysis:        false,
    },
    // Метрики highlights bar на дашборде
    dashboard_focus: ['utilization', 'escalations', 'replacements'],
    welcome_message: 'Твой фокус — команда и операции. Начни с Dashboard чтобы увидеть кто требует внимания.',
  },

  /* ── Account Manager ──────────────────────────────────────────── */
  account_manager: {
    label: 'Account Manager',
    icon:  '🤝',
    modules: {
      dashboard:           true,
      portfolio:           true,
      detail_overview:     true,
      detail_history:      true,
      detail_status_log:   true,
      detail_delivery:     false,
      detail_monte_carlo:  false,
      clients:             true,
      entry:               true,
      monte_carlo_page:    false,
      ai_strategies:       false,
      bcg_analysis:        false,
    },
    dashboard_focus: ['revenue', 'health', 'activities'],
    welcome_message: 'Твой фокус — отношения и revenue. Начни с Portfolio чтобы увидеть общую картину.',
  },

  /* ── CSM / Analyst ────────────────────────────────────────────── */
  csm_analyst: {
    label: 'CSM / Analyst',
    icon:  '📊',
    modules: {
      dashboard:           true,
      portfolio:           true,
      detail_overview:     true,
      detail_history:      true,
      detail_status_log:   true,
      detail_delivery:     true,
      detail_monte_carlo:  true,
      clients:             true,
      entry:               true,
      monte_carlo_page:    true,
      ai_strategies:       true,
      bcg_analysis:        true,
    },
    dashboard_focus: ['health', 'revenue', 'risk', 'utilization'],
    welcome_message: 'Полный доступ активирован. Все модули доступны.',
  },
};

/* ── Вспомогательные функции ────────────────────────────────────── */

/**
 * Возвращает конфиг текущей роли из localStorage.
 * Если роль не найдена — возвращает csm_analyst (максимальный доступ).
 */
function getRoleConfig() {
  try {
    const role = localStorage.getItem('bchs_role');
    return ROLE_CONFIG[role] || ROLE_CONFIG.csm_analyst;
  } catch {
    return ROLE_CONFIG.csm_analyst;
  }
}

/**
 * Возвращает строковый id текущей роли.
 */
function getCurrentRole() {
  try {
    return localStorage.getItem('bchs_role') || 'csm_analyst';
  } catch {
    return 'csm_analyst';
  }
}

/**
 * Сохраняет роль в localStorage.
 * @param {string} roleId — ключ из ROLE_CONFIG
 */
function setCurrentRole(roleId) {
  try {
    if (!ROLE_CONFIG[roleId]) return;
    localStorage.setItem('bchs_role', roleId);
  } catch (e) {
    console.warn('[RoleConfig] localStorage недоступен:', e.message);
  }
}

/**
 * Проверяет, доступен ли модуль для текущей роли.
 * @param {string} moduleKey — ключ из modules
 */
function canAccess(moduleKey) {
  const cfg = getRoleConfig();
  return cfg.modules[moduleKey] !== false;
}

/**
 * Применяет конфиг к навигации — скрывает/показывает пункты меню.
 * Вызывается из App.init() после определения роли.
 */
function applyRoleToNav() {
  const cfg = getRoleConfig();

  // Карта: data-page → module key
  const NAV_MAP = {
    dashboard: 'dashboard',
    portfolio: 'portfolio',
    entry:     'entry',
    clients:   'clients',
  };

  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    const page = el.dataset.page;
    const key  = NAV_MAP[page];
    if (key && cfg.modules[key] === false) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  });

  document.querySelectorAll('.bottom-nav-btn[data-page]').forEach(el => {
    const page = el.dataset.page;
    const key  = NAV_MAP[page];
    if (key && cfg.modules[key] === false) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  });
}

// Экспортируем в window для доступа из других модулей
window.ROLE_CONFIG     = ROLE_CONFIG;
window.getRoleConfig   = getRoleConfig;
window.getCurrentRole  = getCurrentRole;
window.setCurrentRole  = setCurrentRole;
window.canAccess       = canAccess;
window.applyRoleToNav  = applyRoleToNav;
