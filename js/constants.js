/* ============================================
   Portfolio BCHS — Constants v7.0
   ============================================ */

const SIGNALS = {
  team_scope_request:     { label: 'Запрос расширения команды/скоупа',          weight: +5,  group: 'pos_lead' },
  new_services_interest:  { label: 'Интерес к новым услугам',                   weight: +3,  group: 'pos_lead' },
  strategic_sessions:     { label: 'Стратегические сессии',                     weight: +7,  group: 'pos_lead' },
  fast_responses:         { label: 'Быстрые ответы / высокая вовлечённость',    weight: +2,  group: 'pos_lead' },
  internal_events:        { label: 'Приглашение на внутренние события',         weight: +3,  group: 'pos_lead' },
  shared_business_plans:  { label: 'Совместное планирование / бизнес-планы',    weight: +3,  group: 'pos_lead' },
  contract_renewal:       { label: 'Продление контракта',                        weight: +24, group: 'pos_lag'  },
  upsell:                 { label: 'Апселл',                                     weight: +16, group: 'pos_lag'  },
  cross_sell:             { label: 'Кросс-селл',                                 weight: +13, group: 'pos_lag'  },
  positive_feedback:      { label: 'Положительная обратная связь / NPS',        weight: +5,  group: 'pos_lag'  },
  slow_responses:         { label: 'Медленные ответы / снижение активности',    weight: -2,  group: 'neg_lead' },
  missed_meetings:        { label: 'Пропуск встреч',                             weight: -3,  group: 'neg_lead' },
  no_planning:            { label: 'Отказ от планирования',                      weight: -3,  group: 'neg_lead' },
  detailed_report_request:{ label: 'Запрос детальной отчётности (недоверие)',   weight: -2,  group: 'neg_lead' },
  scope_reduction:        { label: 'Сокращение скоупа',                          weight: -4,  group: 'neg_lead' },
  competitor_mentions:    { label: 'Упоминание конкурентов',                     weight: -5,  group: 'neg_lead' },
  new_decision_maker:     { label: 'Новый ЛПР / смена контакта',                weight: -3,  group: 'neg_lead' },
  exit_questions:         { label: 'Вопросы об условиях расторжения',            weight: -8,  group: 'neg_lead' },
  reduced_frequency:      { label: 'Снижение частоты взаимодействий',           weight: -2,  group: 'neg_lead' },
  no_growth_response:     { label: 'Нет реакции на предложения роста',          weight: -2,  group: 'neg_lead' },
  complaint:              { label: 'Жалоба / эскалация недовольства',            weight: -3,  group: 'neg_lag'  },
  payment_delay_10_30:    { label: 'Задержка оплаты 10–30 дней',                weight: -4,  group: 'neg_lag'  },
  specialist_replacement: { label: 'Замена специалиста по инициативе клиента',  weight: -5,  group: 'neg_lag'  },
  escalation:             { label: 'Эскалация до топ-менеджмента',               weight: -10, group: 'neg_lag'  },
  payment_delay_30plus:   { label: 'Задержка оплаты 30+ дней',                  weight: -8,  group: 'neg_lag'  },
  churn:                  { label: 'Отток / завершение контракта',               weight: -25, group: 'neg_lag'  },
};

const SIGNAL_GROUPS = {
  pos_lead: { label: 'Позитивные лидирующие',     icon: '✦' },
  pos_lag:  { label: 'Позитивные результирующие', icon: '✔' },
  neg_lead: { label: 'Негативные лидирующие',     icon: '◆' },
  neg_lag:  { label: 'Негативные результирующие', icon: '✘' },
};

const PC_CRITERIA = {
  people_count:        { label: 'Размер команды',        hint: '1=мало · 5=очень много'       },
  project_complexity:  { label: 'Сложность проекта',     hint: '1=простой · 5=очень сложный'  },
  reporting:           { label: 'Объём отчётности',      hint: '1=минимум · 5=очень много'    },
  risk_probability:    { label: 'Вероятность рисков',    hint: '1=низкая · 5=очень высокая'   },
  risk_consequences:   { label: 'Последствия рисков',    hint: '1=незначит. · 5=критичные'    },
  face_role:           { label: 'Роль лица компании',    hint: '1=фоновая · 5=ключевая'       },
  emotional_load:      { label: 'Эмоциональная нагрузка',hint: '1=низкая · 5=очень высокая'  },
};

const BCG_LABELS = {
  KEY:          '⭐ KEY',
  STABLE:       '🐄 STABLE',
  GROWTH:       '💎 GROWTH',
  GROWTH_EARLY: '🌱 GROWTH',
  TAIL:         '📦 TAIL',
};

// Используется в ClientsPage и DashboardPage
const BCG_CATEGORIES = {
  KEY:          { label: '⭐ KEY' },
  STABLE:       { label: '🐄 STABLE' },
  GROWTH:       { label: '💎 GROWTH' },
  GROWTH_EARLY: { label: '🌱 GROWTH (early)' },
  TAIL:         { label: '📦 TAIL' },
};

const PRIORITIES = [
  'PROTECT','STRENGTHEN','RESCUE',
  'MAINTAIN','MONITOR','REVIEW',
  'INVEST','NURTURE','EVALUATE',
  'RECONSIDER','MINIMAL',
];

const STATUSES = ['Active', 'Paused', 'Self-managed'];

const MONTHS_RU = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];

const MONTHS_SHORT = [
  'Янв','Фев','Мар','Апр','Май','Июн',
  'Июл','Авг','Сен','Окт','Ноя','Дек',
];

// FTE константы (используются в delivery.js)
const FTE_CURRENCIES         = ['USD', 'EUR', 'PLN', 'GBP'];
const FTE_ALLOCATION_OPTIONS = [0.1, 0.25, 0.5, 0.75, 1.0];
const FTE_DEFAULT_LOCATION   = 'BY';
