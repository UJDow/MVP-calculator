/* ============================================
   js/role_config.js — Role Configuration (ES Module)
   Portfolio BCHS v7.0
   Читается в App.init(), DashboardPage, DetailPage.
   ============================================ */

/* ── Role definitions ───────────────────────────────────────────── */

export const ROLE_CONFIG = {

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
      detail_delivery:     true,
      detail_monte_carlo:  false,
      clients:             true,
      entry:               true,
      monte_carlo_page:    false,
      ai_strategies:       false,
      bcg_analysis:        false,
    },
    dashboard_focus:  ['utilization', 'escalations', 'replacements'],
    welcome_message:  'Твой фокус — команда и операции. Начни с Dashboard чтобы увидеть кто требует внимания.',
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
    dashboard_focus:  ['revenue', 'health', 'activities'],
    welcome_message:  'Твой фокус — отношения и revenue. Начни с Portfolio чтобы увидеть общую картину.',
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
    dashboard_focus:  ['health', 'revenue', 'risk', 'utilization'],
    welcome_message:  'Полный доступ активирован. Все модули доступны.',
  },
};

/* ── Helper: get role config for current user ───────────────────── */

/**
 * Возвращает конфиг текущей роли из localStorage.
 * Если роль не найдена — возвращает csm_analyst (максимальный доступ).
 * @returns {object}
 */
export function getRoleConfig() {
  try {
    const role = localStorage.getItem('bchs_role');
    return ROLE_CONFIG[role] ?? ROLE_CONFIG.csm_analyst;
  } catch {
    return ROLE_CONFIG.csm_analyst;
  }
}

/**
 * Возвращает строковый id текущей роли.
 * @returns {string}
 */
export function getCurrentRole() {
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
export function setCurrentRole(roleId) {
  try {
    if (!ROLE_CONFIG[roleId]) {
      console.warn(`[RoleConfig] Неизвестная роль: "${roleId}"`);
      return;
    }
    localStorage.setItem('bchs_role', roleId);
  } catch (e) {
    console.warn('[RoleConfig] localStorage недоступен:', e.message);
  }
}

/**
 * Проверяет, доступен ли модуль для текущей роли.
 * @param {string} moduleKey — ключ из modules
 * @returns {boolean}
 */
export function canAccess(moduleKey) {
  const cfg = getRoleConfig();
  return cfg.modules[moduleKey] !== false;
}

/**
 * Применяет конфиг к навигации — скрывает/показывает пункты меню.
 * Вызывается из App.init() после определения роли.
 */
export function applyRoleToNav() {
  const cfg = getRoleConfig();

  /* Карта: data-page → module key */
  const NAV_MAP = {
    dashboard: 'dashboard',
    portfolio: 'portfolio',
    entry:     'entry',
    clients:   'clients',
  };

  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    const key = NAV_MAP[el.dataset.page];
    el.style.display = (key && cfg.modules[key] === false) ? 'none' : '';
  });

  document.querySelectorAll('.bottom-nav-btn[data-page]').forEach(el => {
    const key = NAV_MAP[el.dataset.page];
    el.style.display = (key && cfg.modules[key] === false) ? 'none' : '';
  });
}

/* ── Expose globals for legacy non-module scripts (если нужно) ──── */
window.ROLE_CONFIG    = ROLE_CONFIG;
window.getRoleConfig  = getRoleConfig;
window.getCurrentRole = getCurrentRole;
window.setCurrentRole = setCurrentRole;
window.canAccess      = canAccess;
window.applyRoleToNav = applyRoleToNav;
