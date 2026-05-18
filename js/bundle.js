/* ============================================
   Portfolio BCHS — Complete Application Bundle
   v5 — Full 15-field client model + auto-calc
   ============================================ */

/* ======== CONSTANTS ======== */
const SIGNALS = {
  team_scope_request:    { label: 'Запрос расширения команды/скоупа',     weight: +5,  group: 'pos_lead' },
  new_services_interest: { label: 'Интерес к новым услугам',              weight: +3,  group: 'pos_lead' },
  strategic_sessions:    { label: 'Стратегические сессии',                weight: +7,  group: 'pos_lead' },
  fast_responses:        { label: 'Быстрые ответы / высокая вовлечённость',weight: +2,  group: 'pos_lead' },
  internal_events:       { label: 'Приглашение на внутренние события',    weight: +3,  group: 'pos_lead' },
  shared_business_plans: { label: 'Совместное планирование / бизнес-планы',weight: +3,  group: 'pos_lead' },
  contract_renewal:      { label: 'Продление контракта',                   weight: +24, group: 'pos_lag'  },
  upsell:                { label: 'Апселл',                                weight: +16, group: 'pos_lag'  },
  cross_sell:            { label: 'Кросс-селл',                            weight: +13, group: 'pos_lag'  },
  positive_feedback:     { label: 'Положительная обратная связь / NPS',   weight: +5,  group: 'pos_lag'  },
  slow_responses:        { label: 'Медленные ответы / снижение активности',weight: -2,  group: 'neg_lead' },
  missed_meetings:       { label: 'Пропуск встреч',                        weight: -3,  group: 'neg_lead' },
  no_planning:           { label: 'Отказ от планирования',                 weight: -3,  group: 'neg_lead' },
  detailed_report_request:{ label: 'Запрос детальной отчётности (недоверие)', weight: -2, group: 'neg_lead' },
  scope_reduction:       { label: 'Сокращение скоупа',                     weight: -4,  group: 'neg_lead' },
  competitor_mentions:   { label: 'Упоминание конкурентов',                weight: -5,  group: 'neg_lead' },
  new_decision_maker:    { label: 'Новый ЛПР / смена контакта',            weight: -3,  group: 'neg_lead' },
  exit_questions:        { label: 'Вопросы об условиях расторжения',       weight: -8,  group: 'neg_lead' },
  reduced_frequency:     { label: 'Снижение частоты взаимодействий',       weight: -2,  group: 'neg_lead' },
  no_growth_response:    { label: 'Нет реакции на предложения роста',      weight: -2,  group: 'neg_lead' },
  complaint:             { label: 'Жалоба / эскалация недовольства',       weight: -3,  group: 'neg_lag'  },
  payment_delay_10_30:   { label: 'Задержка оплаты 10–30 дней',            weight: -4,  group: 'neg_lag'  },
  specialist_replacement:{ label: 'Замена специалиста по инициативе клиента', weight: -5, group: 'neg_lag' },
  escalation:            { label: 'Эскалация до топ-менеджмента',          weight: -10, group: 'neg_lag'  },
  payment_delay_30plus:  { label: 'Задержка оплаты 30+ дней',              weight: -8,  group: 'neg_lag'  },
  churn:                 { label: 'Отток / завершение контракта',           weight: -25, group: 'neg_lag'  },
};

const SIGNAL_GROUPS = {
  pos_lead: { label: 'Позитивные лидирующие',     icon: '✦' },
  pos_lag:  { label: 'Позитивные результирующие', icon: '✔' },
  neg_lead: { label: 'Негативные лидирующие',     icon: '◆' },
  neg_lag:  { label: 'Негативные результирующие', icon: '✘' },
};

const PC_CRITERIA = {
  people_count:        { label: 'Размер команды',   hint: '1=мало · 5=очень много'        },
  project_complexity:  { label: 'Сложность проекта',        hint: '1=простой · 5=очень сложный'   },
  reporting:           { label: 'Объём отчётности',         hint: '1=минимум · 5=очень много'     },
  risk_probability:    { label: 'Вероятность рисков',       hint: '1=низкая · 5=очень высокая'    },
  risk_consequences:   { label: 'Последствия рисков',       hint: '1=незначит. · 5=критичные'     },
  face_role:           { label: 'Роль лица компании',       hint: '1=фоновая · 5=ключевая'        },
  emotional_load:      { label: 'Эмоциональная нагрузка',   hint: '1=низкая · 5=очень высокая'    },
};

const BCG_LABELS = {
  KEY:    '⭐ KEY',
  STABLE: '🐄 STABLE',
  GROWTH: '💎 GROWTH',
  GROWTH_EARLY: '🌱 GROWTH',
  TAIL:   '📦 TAIL',
};

const MONTHS_RU    = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];

/* ======== CLIENT CALC ENGINE ======== */
const ClientCalc = {
  financialValue(mr) {
    const v = +mr || 0;
    if (v >= 25000) return 'HIGH';
    if (v >= 6000)  return 'MEDIUM';
    return 'LOW';
  },
  strategicSum(c) {
    let sum = 0;
    sum += { Strategic:3, Standard:2, Basic:1 }[c.tech_value] || 0;
    sum += { Top:3, Recognizable:2, Unknown:1    }[c.brand_value] || 0;
    sum += { Yes:2, No:1                         }[c.growth_potential] || 0;
    sum += { 'C-level':3, 'Tech Lead':2, 'Gatekeeper':1 }[c.decision_maker_level] || 0;
    sum += { 'Yes':2, 'Partial':1, 'No':0        }[c.managed_services_potential] || 0;
    if (c.client_type !== 'Direct') {
  sum += { 'Strategic Partner':3, 'Potential':2, 'Blocks':1 }[c.access_to_end_client] || 0;
}
    return sum;
  },
  strategicValue(c) {
    const sum = this.strategicSum(c);
    if (c.client_type !== 'Direct') {
  if (sum >= 13) return 'HIGH';
  if (sum >= 9)  return 'MEDIUM';
  return 'LOW';
}
    if (sum >= 10) return 'HIGH';
    if (sum >= 7)  return 'MEDIUM';
    return 'LOW';
  },
  stability(c) {
    const ct = c.contract_length, ms = c.managed_services_potential;
    if (ct === 'Stable (6+)') return 'HIGH';
    if (ct === 'Medium (3-6)' && ms === 'Yes') return 'HIGH';
    if (ct === 'Medium (3-6)') return 'MEDIUM';
    if (ct === 'Short (1-3)' && ms === 'Yes') return 'MEDIUM';
    return 'LOW';
  },
  complexity(c) {
    const diff = c.client_difficulty, eng = c.client_engagement;
    const op = c.operational_difficulty, phase = c.phase, mat = c.team_maturity;
    const high = (diff==='Conflict' && eng==='Reactive') ||
                 (diff==='Conflict' && op==='Hard') ||
                 (eng==='Reactive' && op==='Hard') ||
                 (phase==='SLA' && mat==='Junior');
    if (high) return 'HIGH';
    const med = diff==='Conflict' || eng==='Reactive' || op==='Hard' ||
                (phase==='SLA' && mat==='Standard');
    if (med) return 'MEDIUM';
    return 'LOW';
  },
  bcgCategory(c, fin, strat, stab, compl) {
  const gr   = c.growth_potential === 'Yes';
  const ct   = c.contract_length;
  const type = c.client_type;
  const eng  = c.client_engagement;
  const acc  = c.access_to_end_client;

  // 1. Body-shop → TAIL
  if (type === 'Body-shop') return 'TAIL';

  // 2. Нет роста + короткий контракт → TAIL
  if (!gr && ct === 'Short (1-3)') return 'TAIL';

  // 3. HIGH + HIGH + Growth → KEY
  if (fin === 'HIGH' && stab === 'HIGH' && gr)
    return compl === 'HIGH' ? 'KEY_ALERT' : 'KEY';

  // 4. HIGH + HIGH (без роста) → STABLE
  if (fin === 'HIGH' && stab === 'HIGH') return 'STABLE';

  // 5. HIGH + Growth → GROWTH
  if (fin === 'HIGH' && gr) return 'GROWTH';

  // 6. HIGH (остаток) → STABLE
  if (fin === 'HIGH') return 'STABLE';

  // 7. MEDIUM + HIGH strategic + Growth → GROWTH
  if (fin === 'MEDIUM' && strat === 'HIGH' && gr) return 'GROWTH';

  // 8. MEDIUM + MEDIUM strategic + Growth → GROWTH_EARLY
  if (fin === 'MEDIUM' && strat === 'MEDIUM' && gr) return 'GROWTH_EARLY';

  // 9. LOW + HIGH stab + Growth + есть доступ → GROWTH
  if (fin === 'LOW' && stab === 'HIGH' && gr && acc !== 'N/A') return 'GROWTH';

  // 10. LOW + HIGH stab + Growth → GROWTH_EARLY
  if (fin === 'LOW' && stab === 'HIGH' && gr) return 'GROWTH_EARLY';

  // 11. LOW + MEDIUM stab + Growth + активный клиент → GROWTH_EARLY
  if (fin === 'LOW' && stab === 'MEDIUM' && gr &&
      (eng === 'Proactive' || eng === 'Active')) return 'GROWTH_EARLY';

  // 12. MEDIUM + HIGH/MEDIUM strategic + есть доступ → STABLE
  if (fin === 'MEDIUM' && (strat === 'HIGH' || strat === 'MEDIUM') &&
      acc !== 'N/A') return 'STABLE';

  // 13. Всё остальное → TAIL
  return 'TAIL';
},

  priorityScore(fin, strat, stab, eng, compl) {
    const fv  = {HIGH:3,MEDIUM:2,LOW:1}[fin]  || 1;
    const sv  = {HIGH:3,MEDIUM:2,LOW:1}[strat]|| 1;
    const stv = {HIGH:3,MEDIUM:2,LOW:1}[stab] || 1;
    const ev  = {Proactive:3,Active:2,Reactive:1}[eng] || 2;
    const cv  = {HIGH:1,MEDIUM:2,LOW:3}[compl]|| 2;
    return Math.round((fv*0.25 + sv*0.25 + stv*0.25 + ev*0.15 + cv*0.10) * 100) / 100;
  },
  keyAccountPriority(bcg, score, c) {
    const phase = c.phase, gr = c.growth_potential === 'Yes';
    if (phase === 'Winding Down') return gr ? 'NURTURE' : 'MINIMAL';
    if (phase === 'Discovery')    return 'INVEST';
    const raw = bcg.replace('_ALERT','');
    if (raw === 'KEY') {
      if (score >= 2.5) return 'PROTECT';
      if (score >= 2.0) return 'STRENGTHEN';
      return 'RESCUE';
    }
    if (raw === 'STABLE') {
      if (score >= 2.5) return 'MAINTAIN';
      if (score >= 2.0) return 'MONITOR';
      return 'REVIEW';
    }
    if (raw === 'GROWTH' || raw === 'GROWTH_EARLY') {
      if (score >= 2.5) return 'INVEST';
      if (score >= 2.0) return 'NURTURE';
      return 'EVALUATE';
    }
    if (score >= 2.0) return 'RECONSIDER';
    return 'MINIMAL';
  },
  csmAssignment(bcg, priority, compl, phase) {
    const raw = bcg.replace('_ALERT','');
    if (phase === 'Discovery' || phase === 'Winding Down') return '—';
    if (phase === 'SLA') {
      if (compl==='HIGH'||compl==='MEDIUM') return 'Lead';
      return 'Coordinator';
    }
    if (phase === 'Ongoing') {
      if (raw === 'KEY') {
        if (compl==='HIGH') return 'Lead';
        return 'Coordinator';
      }
      if (raw === 'STABLE') {
        if (compl==='HIGH') return 'Coordinator';
        if (compl==='MEDIUM') return 'Setup';
        return 'Support';
      }
      if (raw === 'GROWTH' || raw === 'GROWTH_EARLY') {
        if (priority === 'INVEST') {
          if (compl==='HIGH') return 'Coordinator';
          return 'Setup';
        }
        if (priority === 'NURTURE') return 'Setup';
        if (priority === 'EVALUATE') return 'Watch';
      }
      if (raw === 'TAIL') {
        if (priority === 'RECONSIDER') return 'Check';
        return '—';
      }
    }
    return '—';
  },
  hours(csm, mat) {
    const matMult = {Junior:1.25, Standard:1.0, Senior:0.8}[mat] || 1.0;
    const csmBase = {Lead:2.5, Coordinator:2.0, Setup:1.75, Support:1.25, Watch:0.75, Check:0.25, '—':0.5}[csm] || 0.5;
    return Math.round(csmBase * matMult * 100) / 100;
  },
  compute(c) {
    const fin   = this.financialValue(c.monthly_revenue);
    const strat = this.strategicValue(c);
    const stab  = this.stability(c);
    const compl = this.complexity(c);
    const bcg   = this.bcgCategory(c, fin, strat, stab, compl);
    const score = this.priorityScore(fin, strat, stab, c.client_engagement||'Active', compl);
    const kap   = this.keyAccountPriority(bcg, score, c);
    const csm   = this.csmAssignment(bcg, kap, compl, c.phase||'Ongoing');
    const hrs   = this.hours(csm, c.team_maturity||'Standard');
    const capPct= Math.round(hrs / 14 * 100 * 10) / 10;
    const bcgStored = bcg === 'KEY_ALERT' ? 'KEY' : bcg;
    return {
      financial_value:      fin,
      strategic_value:      strat,
      stability:            stab,
      complexity:           compl,
      bcg_category:         bcgStored,
      bcg_alert:            bcg === 'KEY_ALERT',
      priority_score:       score,
      key_account_priority: kap,
      csm_assignment:       csm,
      total_hours:          hrs,
      capacity_pct:         capPct,
    };
  },
};

/* ======== bCHS + SCORING CALC ======== */
const Calc = {

  computeBCHS(entry) {
    if (!entry) return null;
    let score = 0, anyTrue = false;
    for (const [key, def] of Object.entries(SIGNALS)) {
      if (entry[key] == true) { score += def.weight; anyTrue = true; }
    }
    return anyTrue ? score : null;
  },

  // Нормализация bCHS из [-81, +81] в [0%, 100%]
  loyaltyPct(bchs) {
    if (bchs === null || bchs === undefined) return null;
    return Math.round((bchs + 81) / 162 * 100);
  },

  bchsCategory(bchs) {
    if (bchs === null || bchs === undefined) return { label:'—', key:'none' };
    if (bchs >= 50)  return { label:'Champions',  key:'champions'  };
    if (bchs >= 20)  return { label:'Promoters',  key:'promoters'  };
    if (bchs >= -19) return { label:'Passives',   key:'passives'   };
    if (bchs >= -49) return { label:'At Risk',    key:'at_risk'    };
    return                  { label:'Detractors', key:'detractors' };
  },

  // Веса для PC SUMPRODUCT (как в Excel)
  PC_WEIGHTS: {
    people_count:       0.14,
    project_complexity: 0.14,
    reporting:          0.15,
    risk_probability:   0.14,
    risk_consequences:  0.14,
    face_role:          0.15,
    emotional_load:     0.14,
  },

  // SUMPRODUCT с весами — не простое среднее
  computePC(entry) {
    if (!entry) return null;
    const keys = Object.keys(this.PC_WEIGHTS);
    const vals = keys.map(k => entry[k]);
    const filled = vals.filter(v => v !== null && v !== undefined && v >= 1 && v <= 5);
    if (filled.length < keys.length) return null;
    let score = 0;
    for (const key of keys) {
      score += (entry[key] || 0) * this.PC_WEIGHTS[key];
    }
    return Math.round(score * 10) / 10;
  },

  // Final Score 0-100: bCHS нормализованный (60%) + PC нормализованный (40%)
  finalScore(bchs, pc) {
    if (bchs === null || bchs === undefined) return null;
    if (pc   === null || pc   === undefined) return null;
    return Math.round(( ((bchs + 81) / 162) * 60 + (pc / 5) * 40 ) * 10) / 10;
  },

  // Здоровье считается от сырого bCHS, не от finalScore
  healthSignal(bchs) {
    if (bchs === null || bchs === undefined) return { label:'—', key:'none', cls:'no-data' };
    if (bchs >= 20)  return { label:'🟢 Здоров',     key:'Healthy', cls:'health-healthy' };
    if (bchs >= -10) return { label:'😐 Нейтрально', key:'Neutral', cls:'health-neutral' };
    if (bchs >= -30) return { label:'⚠️ Осторожно',  key:'Caution', cls:'health-caution' };
    return                  { label:'🔴 Риск',        key:'AtRisk',  cls:'health-risk'    };
  },

  loadSignal(pcScore) {
    if (pcScore === null || pcScore === undefined) return { label:'—', key:'none' };
    if (pcScore >= 3.5) return { label:'🔴 High Load', key:'High'    };
    if (pcScore >= 2.5) return { label:'🟡 Med Load',  key:'Med'     };
    if (pcScore >= 1.5) return { label:'🟢 Low Load',  key:'Low'     };
    return                    { label:'⚪ Minimal',    key:'Minimal' };
  },

  actionBadge(priority, healthKey, status) {
    if (status === 'Paused') return { label:'⏸ ПАУЗА', cls:'badge-autopilot' };
    if (!healthKey || healthKey === 'none') return { label:'— —', cls:'badge-autopilot' };
    const atRisk = healthKey === 'Caution' || healthKey === 'AtRisk';
    switch (priority) {
      case 'PROTECT':
        if (atRisk) return { label:'🔴 PROTECT — критично', cls:'badge-protect-crit' };
        return             { label:'🟡 PROTECT — держать',  cls:'badge-protect'      };
      case 'STRENGTHEN':
        if (atRisk) return { label:'🚨 INTERVENE — срочно', cls:'badge-intervene' };
        return             { label:'🟡 STRENGTHEN',         cls:'badge-protect'   };
      case 'RESCUE':
        return { label:'🚨 RESCUE — срочно', cls:'badge-intervene' };
      case 'MAINTAIN':
        return { label:'🟢 MAINTAIN', cls:'badge-invest' };
      case 'MONITOR':
        return { label:'🔵 MONITOR',  cls:'badge-monitor' };
      case 'REVIEW':
        return { label:'🔄 REVIEW',   cls:'badge-reconsider' };
      case 'INVEST':
        if (healthKey === 'Healthy') return { label:'📈 INVEST — развивать',  cls:'badge-invest'  };
        return                               { label:'🔵 MONITOR — наблюдать', cls:'badge-monitor' };
      case 'NURTURE':
        if (atRisk) return               { label:'🚨 INTERVENE — срочно',  cls:'badge-intervene' };
        if (healthKey === 'Healthy')return{ label:'🔵 NURTURE — развивать', cls:'badge-nurture'   };
        return                           { label:'🔵 MONITOR — наблюдать',  cls:'badge-monitor'   };
      case 'EVALUATE':
        if (healthKey === 'Healthy') return { label:'🔍 EVALUATE — активно',   cls:'badge-evaluate' };
        return                               { label:'🔍 EVALUATE — осторожно', cls:'badge-evaluate' };
      case 'RECONSIDER':
        return { label:'🔄 RECONSIDER — пересмотреть', cls:'badge-reconsider' };
      case 'MINIMAL':
        if (atRisk) return { label:'⚠️ MINIMAL — но есть сигналы', cls:'badge-minimal-alert' };
        return             { label:'⚪ AUTOPILOT — минимум',        cls:'badge-autopilot'     };
      default:
        return { label:'— —', cls:'badge-autopilot' };
    }
  },

  dashSection(priority, healthKey, status) {
    if (status === 'Paused') return 'auto';
    if (!healthKey || healthKey === 'none') return 'auto';
    const atRisk = healthKey === 'Caution' || healthKey === 'AtRisk';
    if (priority === 'RESCUE')                return 'alert';
    if (atRisk && priority === 'PROTECT')     return 'alert';
    if (atRisk && priority === 'NURTURE')     return 'alert';
    if (atRisk && priority === 'STRENGTHEN')  return 'alert';
    if (priority === 'MINIMAL')               return 'auto';
    if (priority === 'RECONSIDER')            return 'auto';
    if (priority === 'EVALUATE' && atRisk)    return 'auto';
    return 'work';
  },

  focusText(client, bchs, health, compl) {
    const { key_account_priority: priority, status, phase } = client;
    const h = health.key;
    if (!priority) return 'Данные не заполнены → добавьте параметры клиента';
    if (status === 'Paused') {
      if (priority === 'INVEST') return 'Инвестиция заморожена: проект на паузе → зафиксировать метрику возобновления';
      return 'Проект на паузе → подтвердить статус и следующий шаг';
    }
    if (phase === 'Discovery')    return 'Фаза открытия: выявить потребности → провести квалификацию за 30 дней';
    if (phase === 'Winding Down') return client.growth_potential === 'Yes'
      ? 'Завершение + потенциал: удержать отношения → предложить новый формат работы'
      : 'Завершение проекта → зафиксировать итоги и закрыть корректно';
    switch (priority) {
      case 'PROTECT':
        if (h === 'AtRisk')   return 'Ключевой клиент под угрозой → экстренная встреча с ЛПР, стабилизация';
        if (h === 'Caution')  return 'Ключевой клиент в зоне риска → усилить ритм касаний, проверить триггеры';
        if (h === 'Healthy')  return 'Защита устойчива: клиент здоров → закрепить присутствие и искать точки углубления';
        return 'Ключевой клиент стабилен → держать ритм и мониторить вовлечённость';
      case 'STRENGTHEN':
        if (h === 'AtRisk' || h === 'Caution') return 'Укрепление под угрозой → устранить риск до попытки роста';
        return 'Укрепление позиций: хорошие условия → углублять диалог, выходить на C-level';
      case 'RESCUE':
        return 'Критическая ситуация: срочное вмешательство → эскалировать до топ-менеджмента';
      case 'MAINTAIN':
        if (compl === 'HIGH') return 'STABLE с высокой нагрузкой → оптимизировать процессы, снизить операционный риск';
        return 'Стабильный клиент → держать SLA, минимум изменений, ежеквартальный QBR';
      case 'MONITOR':
        if (h === 'AtRisk' || h === 'Caution') return 'Наблюдение с тревогой: ситуация ухудшается → усилить контакт';
        return 'Мониторинг: клиент в норме → отслеживать изменения, реагировать на сигналы';
      case 'REVIEW':
        return 'Пересмотр STABLE → проверить актуальность условий, оценить продление';
      case 'INVEST':
        if (h === 'Healthy') return 'Момент для роста: клиент в хорошей зоне → расширять скоуп и закреплять партнёрство';
        if (h === 'Neutral') return 'Инвестиция под вопросом: лояльность не подтверждает готовность → сначала выстроить доверие';
        return 'Инвестиция под угрозой: тревожные сигналы → сначала устранить риск';
      case 'NURTURE':
        if (h === 'AtRisk' || h === 'Caution') return 'Взращивание под угрозой: тревожные сигналы → сначала устранить риск';
        if (h === 'Healthy') return 'Взращивание активно: клиент готов → углублять диалог и искать следующий шаг';
        return 'Взращивание в ожидании: нет чётких сигналов → спровоцировать реакцию, проверить интерес';
      case 'EVALUATE':
        if (h === 'Healthy') return 'Оценка: хорошие сигналы → зафиксировать критерий инвестиции';
        if (h === 'Neutral') return 'Оценка: сигналов недостаточно → установить дедлайн решения';
        return 'Оценка под вопросом: тревожные сигналы → закрыть EVALUATE, пересмотреть категорию';
      case 'RECONSIDER':
        return 'Пересмотр категории: параметры не подтверждают стратегию → аудит до конца квартала';
      case 'MINIMAL':
        if (h === 'AtRisk' || h === 'Caution') return 'Автопилот с сигналом: тревожные признаки → оценить стоит ли реагировать';
        return 'Автопилот: клиент стабилен → минимум касаний, SLA в приоритете';
      default:
        return 'Данные не заполнены → добавьте параметры клиента';
    }
  },

  potentialIdeal(bcgCategory) {
    if (bcgCategory === 'KEY' || bcgCategory === 'KEY_ALERT') return 88;
    if (bcgCategory === 'GROWTH')       return 80;
    if (bcgCategory === 'GROWTH_EARLY') return 74;
    return 72;
  },

  // % потенциала = finalScore / ideal * 100
  potentialPct(finalScore, bcgCategory) {
    if (finalScore === null || finalScore === undefined) return null;
    const ideal = this.potentialIdeal(bcgCategory);
    return Math.round(finalScore / ideal * 100);
  },

  // Тренд: oldest vs latest из последних 3 месяцев с данными
  trend3m(monthly) {
    if (!monthly || monthly.length < 2) return null;
    const withData = monthly.filter(d => d.bchs !== null);
    if (withData.length < 2) return null;
    const last3 = withData.slice(-3);
    const oldest = last3[0].bchs;
    const latest = last3[last3.length - 1].bchs;
    if (oldest === 0 && latest === 0) return null;
    const d = latest - oldest;
    if (d > 5)  return { label:`↗️ +${d}`, cls:'trend-up',   delta: d };
    if (d < -5) return { label:`↘️ ${d}`,  cls:'trend-down', delta: d };
    return             { label:'→ 0',      cls:'trend-flat', delta: d };
  },

  computeClient(client, allBCHS, allPC, fteEntries = []) {
    const bArr = Array.isArray(allBCHS)    ? allBCHS    : [];
    const pArr = Array.isArray(allPC)      ? allPC      : [];
    const fArr = Array.isArray(fteEntries) ? fteEntries : [];

    const sortedB = bArr
      .filter(e => e && String(e.client_id) === String(client.id))
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

    const sortedP = pArr
      .filter(e => e && String(e.client_id) === String(client.id))
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

    // Актуальный месяц = последний где есть и bCHS и PC
    // Если PC нет вообще — берём последнюю bCHS запись
    let lb = null, lp = null;
    for (let i = sortedB.length - 1; i >= 0; i--) {
      const be = sortedB[i];
      const pe = sortedP.find(
        p => Number(p.month) === Number(be.month) && Number(p.year) === Number(be.year)
      );
      if (pe) { lb = be; lp = pe; break; }
    }
    if (!lb && sortedB.length > 0) lb = sortedB[sortedB.length - 1];
    // Fallback для RoleRadar: если pc_entry не совпала по месяцу с bCHS — берём последнюю pc_entry
    if (!lp && sortedP.length > 0) lp = sortedP[sortedP.length - 1];

    const bchs    = this.computeBCHS(lb);
    const pcScore = this.computePC(lp);
    const loyalty = this.loyaltyPct(bchs);

    // Revenue Efficiency из последней FTE-записи клиента
    let revenueEfficiency = null;
    {
      const clientFte = fArr
        .filter(e => String(e.client_id) === String(client.id))
        .sort((a, b) => (a.month||'').localeCompare(b.month||''));
      if (clientFte.length > 0) {
        const last = clientFte[clientFte.length - 1];
        const members = Array.isArray(last.members) ? last.members : [];
        let tp=0, we=0;
        for (const m of members) {
          let planned;
          if (m.planned_hours !== null && m.planned_hours !== undefined && m.planned_hours !== '') {
            planned = Number(m.planned_hours);
          } else if (window.CalendarEngine) {
            planned = CalendarEngine.getPlannedHours(m.location||'BY', last.month, m.allocation||1.0);
          } else {
            planned = Math.round(168*(m.allocation||1.0));
          }
          const eff = planned > 0 ? (m.actual_hours||0)/planned : 0;
          tp += planned; we += eff*planned;
        }
        if (tp > 0) revenueEfficiency = we/tp;
      }
    }

    const rawFinal = this.finalScore(bchs, pcScore);
    const final    = (rawFinal !== null && revenueEfficiency !== null && revenueEfficiency < 0.8)
      ? Math.round(rawFinal * 0.95 * 10) / 10
      : rawFinal;
    // Здоровье от сырого bCHS
    const health  = this.healthSignal(bchs);
    const load    = this.loadSignal(pcScore);
    const potentialIdeal = this.potentialIdeal(client.bcg_category);
    // % потенциала от finalScore
    const potential = this.potentialPct(final, client.bcg_category);
    const priority  = client.key_account_priority || 'MINIMAL';
    const compl     = client.complexity || 'LOW';
    const badge     = this.actionBadge(priority, health.key, client.status);
    const focus     = this.focusText(client, bchs, health, compl);
    const section   = this.dashSection(priority, health.key, client.status);

    const monthly = sortedB.map(e => ({
      month:   e.month,
      year:    e.year,
      bchs:    this.computeBCHS(e),
      loyalty: this.loyaltyPct(this.computeBCHS(e)),
      label:   `${MONTHS_SHORT[e.month - 1]} ${e.year}`,
    }));

    const trend = this.trend3m(monthly);

    // ── Риск выручки (D6) ──────────────────────────────────────────
    const phase       = client.phase || '';
    const mr          = Number(client.monthly_revenue) || 0;
    const eng         = client.client_engagement || 'Active';
    const compl2      = client.complexity         || 'LOW';
    const stab2       = client.stability          || 'MEDIUM';
    const ms          = client.managed_services_potential || 'No';
    let riskRate = 0;
    let revenueAtRisk = 0;
    let isWD = (phase === 'Winding Down');
    if (isWD) {
      riskRate      = 0.5;
      revenueAtRisk = Math.round(mr * 0.5);
    } else {
      const engRisk   = eng === 'Reactive'  ? 0.30 : eng === 'Active'    ? 0.10 : 0.03;
      const complRisk = compl2 === 'HIGH'   ? 0.15 : compl2 === 'MEDIUM' ? 0.05 : 0;
      const stabRisk  = stab2  === 'LOW'    ? 0.10 : stab2  === 'MEDIUM' ? 0.04 : 0;
      const msRisk    = ms     === 'No'     ? 0.05 : ms     === 'Partial' ? 0.02 : 0;
      riskRate        = engRisk + complRisk + stabRisk + msRisk;
      revenueAtRisk   = Math.round(mr * riskRate);
    }
    const riskPct  = Math.round(riskRate * 100);
    const riskCls  = isWD ? 'neutral' : riskRate >= 0.30 ? 'danger' : riskRate >= 0.15 ? 'warning' : 'positive';
    const riskColor= isWD ? '#6B7280'  : riskRate >= 0.30 ? '#EF4444' : riskRate >= 0.15 ? '#F59E0B' : '#10B981';

    // ── Стоимость часа (D7) ────────────────────────────────────────
    const totalHrs = Number(client.total_hours) || 0;
    let revenuePerHour = null;  // null = N/A
    let rphWD = false;
    if (isWD) {
      rphWD = true;
    } else if (totalHrs > 0) {
      revenuePerHour = Math.round(mr / totalHrs / 4.33);
    }
    const rphColor = rphWD || revenuePerHour === null ? '#6B7280'
                   : revenuePerHour >= 500 ? '#10B981'
                   : revenuePerHour >= 200 ? '#F59E0B'
                   : '#EF4444';
    const rphCls   = rphWD || revenuePerHour === null ? 'neutral'
                   : revenuePerHour >= 500 ? 'positive'
                   : revenuePerHour >= 200 ? 'warning'
                   : 'danger';

    return {
      bchs, pcScore, loyalty, final, revenueEfficiency,
      health, load,
      monthly, trend, badge, focus, section,
      potential, potentialIdeal,
      bchsHistory: sortedB,
      pcHistory:   sortedP,
      curBCHSEntry: lb,
      curPCEntry:   lp,
      // Риск выручки
      riskRate, riskPct, revenueAtRisk, riskCls, riskColor, isWD,
      // Стоимость часа
      revenuePerHour, rphWD, rphColor, rphCls,
    };
  },
};

/* ======== SEED / MIGRATION ======== */
const SEED = {
  async run() {
    // Инициализируем все 9 таблиц — GenSpark создаёт их при первом GET-запросе
    const tables = [
      'clients', 'bchs_entries', 'pc_entries', 'status_entries', 'mc_configs',
      'account_strategies', 'portfolio_strategies', 'fte_entries', 'my_activities',
    ];
    await Promise.all(tables.map(t => fetch(`tables/${t}?limit=1`).catch(() => {})));
    console.log('[SEED] All 9 tables initialized.');
  },
};



/* ======== BACKUP / RESTORE ======== */
const Backup = {

  async download() {
    try {
      App.toast('⏳ Собираем данные...', '');
      const fetchTable = (name, limit=2000) =>
        fetch(`tables/${name}?limit=${limit}`)
          .then(r => r.json())
          .then(j => Array.isArray(j.data) ? j.data : Array.isArray(j) ? j : [])
          .catch(() => []);

      const [clients, bchs, pc, status, mc, accountStrats, portfolioStrats, fteEntries, myActivities] = await Promise.all([
        API.getClients(),
        API.getAllBCHS(),
        API.getAllPC(),
        API.getAllStatusEntries(),
        fetchTable('mc_configs'),
        fetchTable('account_strategies'),
        fetchTable('portfolio_strategies'),
        fetchTable('fte_entries'),
        fetchTable('my_activities'),
      ]);
      const backup = {
        version: 4,
        ts: new Date().toISOString(),
        clients,
        bchs,
        pc,
        status,
        mc,
        account_strategies: accountStrats,
        portfolio_strategies: portfolioStrats,
        fte_entries: fteEntries,
        my_activities: myActivities,
      };
      const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `bchs_backup_v4_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      App.toast('✅ Бэкап скачан! (v4 — 9 таблиц)', 'success');
    } catch(e) {
      App.toast('❌ Ошибка бэкапа: ' + e.message, 'error');
    }
  },

  async restore(file) {
    try {
      const text   = await file.text();
      const backup = JSON.parse(text);

      if (!backup.clients || !backup.bchs || !backup.pc) {
        App.toast('❌ Неверный формат файла', 'error');
        return;
      }

      const STRIP = ['gs_project_id','gs_table_name','created_at','updated_at'];

      const total = backup.clients.length + backup.bchs.length +
                    backup.pc.length + (backup.status||[]).length +
                    (backup.mc||[]).length + (backup.account_strategies||[]).length +
                    (backup.portfolio_strategies||[]).length +
                    (backup.fte_entries||[]).length + (backup.my_activities||[]).length;
      let done = 0;

      const updProgress = () => {
        const pct = total > 0 ? Math.round((done / total) * 100) : 100;
        const elText = document.getElementById('restore-progress');
        const elBar  = document.getElementById('restore-bar');
        const elWrap = document.getElementById('restore-bar-wrap');
        if (elWrap) elWrap.style.display = 'block';
        if (elText) elText.textContent = `Восстанавливаем... ${done} / ${total}`;
        if (elBar)  elBar.style.width  = pct + '%';
      };

      const postBatch = async (url, items) => {
        for (const item of (items || [])) {
          const payload = { ...item };
          STRIP.forEach(k => delete payload[k]);
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => {});
          done++;
          updProgress();
        }
      };

      updProgress(); // показать прогресс-бар сразу

      await postBatch('tables/clients',             backup.clients);
      await postBatch('tables/bchs_entries',         backup.bchs);
      await postBatch('tables/pc_entries',           backup.pc);
      await postBatch('tables/status_entries',       backup.status);
      await postBatch('tables/mc_configs',           backup.mc);
      await postBatch('tables/account_strategies',   backup.account_strategies);
      await postBatch('tables/portfolio_strategies', backup.portfolio_strategies);
      await postBatch('tables/fte_entries',          backup.fte_entries);
      await postBatch('tables/my_activities',        backup.my_activities);

      API.clearCache();
      App.closeModal();
      App.toast('✅ Данные восстановлены! (9 таблиц)', 'success');
      await DashboardPage.load();

    } catch(e) {
      App.toast('❌ Ошибка восстановления: ' + e.message, 'error');
    }
  },

  openModal() {
    App.openModal(`
      <div style="padding:4px 0 16px">
        <div style="font-size:16px;font-weight:600;margin-bottom:4px">💾 Бэкап данных</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">
          Сохрани бэкап <strong>перед каждым деплоем</strong> — после публикации БД очищается
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;
          padding:8px 12px;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.18);
          border-radius:8px;line-height:1.7">
          📦 <strong>Бэкап v4 включает 9 таблиц:</strong><br>
          clients · bchs_entries · pc_entries · status_entries · mc_configs · account_strategies · portfolio_strategies · fte_entries · my_activities
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
        <button class="btn btn-primary" id="backup-download-btn">
          ⬇️ Скачать бэкап
        </button>
      </div>

      <div style="border-top:1px solid var(--border);padding-top:16px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
          text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">
          Восстановить из файла
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;
          padding:8px 12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);
          border-radius:8px;line-height:1.5">
          ⚠️ Данные добавятся поверх существующих. Если БД чистая после деплоя — всё ок.
          Если нет — сначала очисти таблицы вручную.
        </div>
        <input type="file" id="backup-file-input" accept=".json"
          style="display:none" />
        <button class="btn btn-secondary" id="backup-file-btn">
          📂 Выбрать файл бэкапа
        </button>
        <div id="backup-file-name"
          style="font-size:12px;color:var(--text-muted);margin-top:8px"></div>
        <div id="restore-bar-wrap" style="display:none;margin-top:10px">
          <div style="height:6px;background:var(--border);border-radius:4px;overflow:hidden;margin-bottom:6px">
            <div id="restore-bar" style="height:100%;width:0%;background:#10B981;transition:width 0.2s;border-radius:4px"></div>
          </div>
          <div id="restore-progress" style="font-size:12px;color:var(--text-muted)"></div>
        </div>
        <button class="btn btn-primary" id="backup-restore-btn"
          style="margin-top:12px;display:none">
          ⬆️ Восстановить данные
        </button>
      </div>

      <div style="border-top:1px solid var(--border);padding-top:16px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
          text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">
          Импорт из CSV / JSON
        </div>

        <div style="margin-bottom:10px">
          <label class="form-label">Таблица</label>
          <div style="display:flex;gap:8px;align-items:center">
            <select class="form-select" id="import-table" style="flex:1">
              <option value="clients">clients</option>
              <option value="bchs_entries">bchs_entries</option>
              <option value="pc_entries">pc_entries</option>
              <option value="status_entries">status_entries</option>
              <option value="mc_configs">mc_configs</option>
              <option value="account_strategies">account_strategies</option>
              <option value="portfolio_strategies">portfolio_strategies</option>
              <option value="fte_entries">fte_entries</option>
              <option value="my_activities">my_activities</option>
            </select>
            <button class="btn btn-secondary btn-sm" id="import-tpl-btn">⬇️ Шаблон</button>
          </div>
        </div>

        <div style="display:flex;gap:16px;margin-bottom:6px;font-size:13px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="import-fmt" value="csv" checked /> CSV
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="import-fmt" value="json" /> JSON
          </label>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;line-height:1.6;
          padding:6px 10px;background:rgba(99,102,241,0.05);border-radius:6px;border:1px solid rgba(99,102,241,0.12)">
          💡 <strong>CSV-советы:</strong> разделитель — запятая, точка с запятой или таб.<br>
          Числа: <code>57224</code> или <code>57224.00</code> — ок. <strong>Избегай</strong> <code>57,224.00</code> (запятая-тысячный разделитель сбивает колонки).<br>
          Если число содержит запятую — оборачивай в кавычки: <code>"57,224.00"</code>
        </div>

        <div id="import-dropzone" style="border:2px dashed var(--border);border-radius:8px;
          padding:20px;text-align:center;cursor:pointer;font-size:13px;
          color:var(--text-muted);margin-bottom:10px;transition:border-color 0.2s">
          📂 Перетащите файл или нажмите для выбора
        </div>
        <input type="file" id="import-file-input" accept=".csv,.json" style="display:none" />
        <div id="import-file-name" style="font-size:12px;color:var(--text-muted);margin-bottom:8px"></div>

        <div id="import-preview" style="display:none;margin-bottom:10px;overflow-x:auto;
          max-height:160px;font-size:11px;border:1px solid var(--border);border-radius:6px"></div>

        <div id="import-validation" style="font-size:12px;margin-bottom:10px"></div>

        <div id="import-bar-wrap" style="display:none;margin-bottom:10px">
          <div style="height:6px;background:var(--border);border-radius:4px;overflow:hidden;margin-bottom:6px">
            <div id="import-bar" style="height:100%;width:0%;background:#3B82F6;
              transition:width 0.2s;border-radius:4px"></div>
          </div>
          <div id="import-progress" style="font-size:12px;color:var(--text-muted)"></div>
        </div>

        <button class="btn btn-primary" id="import-run-btn" style="display:none">
          💾 Импортировать
        </button>
        <div id="import-result" style="font-size:12px;margin-top:8px"></div>
      </div>

      <div style="display:flex;justify-content:flex-end">
        <button class="btn btn-secondary btn-sm" id="backup-cancel-btn">Закрыть</button>
      </div>
    `);

    let selectedFile = null;

    document.getElementById('backup-cancel-btn')
      .addEventListener('click', () => App.closeModal());

    document.getElementById('backup-download-btn')
      .addEventListener('click', () => Backup.download());

    document.getElementById('backup-file-btn').addEventListener('click', () => {
      document.getElementById('backup-file-input').click();
    });

    document.getElementById('backup-file-input').addEventListener('change', e => {
      selectedFile = e.target.files[0];
      if (selectedFile) {
        document.getElementById('backup-file-name').textContent =
          `📄 ${selectedFile.name}`;
        document.getElementById('backup-restore-btn').style.display = 'block';
      }
    });

    document.getElementById('backup-restore-btn').addEventListener('click', async () => {
      if (!selectedFile) return;
      const confirmed = confirm(
        '⚠️ Восстановить данные из файла?\n\nДанные добавятся поверх существующих.'
      );
      if (!confirmed) return;
      const btn = document.getElementById('backup-restore-btn');
      btn.disabled = true;
      btn.textContent = '⏳ Восстанавливаем...';
      await Backup.restore(selectedFile);
      btn.disabled = false;
      btn.textContent = '⬆️ Восстановить данные';
    });

    // ── IMPORT LOGIC ──────────────────────────────────────────
    const REQUIRED_COLUMNS = {
      // ── 32 поля (актуально с v6.8: +coordinator, account_manager, dach_region) ──
      clients: ['name','status','monthly_revenue','client_type',
        'managed_services_potential','tech_value','brand_value','growth_potential',
        'access_to_end_client','contract_length','decision_maker_level',
        'client_difficulty','client_engagement','operational_difficulty',
        'team_maturity','phase','sales_owner',
        'coordinator','account_manager','dach_region'],
      // ── 30 полей ──
      bchs_entries: ['client_id','month','year',
        'team_scope_request','new_services_interest','strategic_sessions',
        'fast_responses','internal_events','shared_business_plans',
        'contract_renewal','upsell','cross_sell','positive_feedback',
        'slow_responses','missed_meetings','no_planning','detailed_report_request',
        'scope_reduction','competitor_mentions','new_decision_maker','exit_questions',
        'reduced_frequency','no_growth_response','complaint','payment_delay_10_30',
        'specialist_replacement','escalation','payment_delay_30plus','churn'],
      // ── 16 полей (актуально с v6: +role_account_manager..role_csm) ──
      pc_entries: ['client_id','month','year','people_count','project_complexity',
        'reporting','risk_probability','risk_consequences','face_role','emotional_load',
        'role_account_manager','role_coordinator','role_sales','role_delivery','role_csm'],
      // ── 9 полей ──
      status_entries: ['client_id','entry_date','day','month','year',
        'status_note','signals_json','pc_json'],
      // ── 20 полей ──
      mc_configs: ['client_id','drift','volatility','mean_reversion','equilibrium',
        'p_strategic_meeting','impact_strategic_meeting','p_upsell','impact_upsell_mr',
        'p_fast_response','impact_fast_response','p_escalation','impact_escalation',
        'p_complaint','impact_complaint','p_churn','p_mr_downgrade',
        'impact_mr_downgrade','monthly_revenue'],
      // ── 9 полей ──
      account_strategies: ['client_id','goal','actions','success_metric','deadline','status','mc_snapshot','ai_generated'],
      // ── 8 полей ──
      portfolio_strategies: ['horizon','title','goal','actions','success_metric','deadline','ai_generated'],
      // ── 6 полей ──
      fte_entries: ['client_id','month','members'],
      // ── 7 полей ──
      my_activities: ['client_id','date','type','duration_minutes','note','billable'],
    };

    const FLOAT_COLS = new Set(['monthly_revenue','month','year','drift','volatility',
      'mean_reversion','equilibrium','people_count','project_complexity','reporting',
      'risk_probability','risk_consequences','face_role','emotional_load',
      'role_account_manager','role_coordinator','role_sales','role_delivery','role_csm',
      'total_hours','capacity_pct','p_strategic_meeting','impact_strategic_meeting',
      'p_upsell','impact_upsell_mr','p_fast_response','impact_fast_response',
      'p_escalation','impact_escalation','p_complaint','impact_complaint',
      'p_churn','p_mr_downgrade','impact_mr_downgrade','priority_score',
      'duration_minutes','day']);

    const BOOL_COLS = new Set(['team_scope_request','new_services_interest',
      'strategic_sessions','fast_responses','internal_events','shared_business_plans',
      'contract_renewal','upsell','cross_sell','positive_feedback','slow_responses',
      'missed_meetings','no_planning','detailed_report_request','scope_reduction',
      'competitor_mentions','new_decision_maker','exit_questions','reduced_frequency',
      'no_growth_response','complaint','payment_delay_10_30','specialist_replacement',
      'escalation','payment_delay_30plus','churn','ai_generated','billable']);

    // RFC 4180-совместимый парсер: корректно обрабатывает "57,224.00", переносы строк в кавычках, ;-разделители
    function parseCSV(text) {
      // Автоопределение разделителя: таб > ; > ,
      const firstLine = text.slice(0, text.indexOf('\n') || text.length);
      const delim = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';

      // Токенизатор поля с поддержкой quoted fields (RFC 4180)
      function tokenizeLine(line) {
        const fields = [];
        let i = 0;
        while (i <= line.length) {
          if (line[i] === '"') {
            // Quoted field
            let val = '';
            i++; // skip opening quote
            while (i < line.length) {
              if (line[i] === '"' && line[i+1] === '"') { val += '"'; i += 2; } // escaped quote
              else if (line[i] === '"') { i++; break; } // closing quote
              else { val += line[i++]; }
            }
            fields.push(val);
            if (line[i] === delim) i++; // skip delimiter after closing quote
          } else {
            // Unquoted field
            const end = line.indexOf(delim, i);
            if (end === -1) { fields.push(line.slice(i).trim()); break; }
            fields.push(line.slice(i, end).trim());
            i = end + 1;
          }
        }
        return fields;
      }

      const lines = text.trim().split('\n').map(l => l.replace(/\r$/, ''));
      const headers = tokenizeLine(lines[0]).map(h => h.trim());
      return lines.slice(1).filter(l => l.trim()).map(line => {
        const values = tokenizeLine(line);
        return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? '').trim()]));
      });
    }

    function coerce(row) {
      const out = { ...row };
      for (const [k, v] of Object.entries(out)) {
        if (FLOAT_COLS.has(k)) {
          // Удаляем разделители тысяч (1,234.56 → 1234.56 | 1.234,56 → 1234.56)
          const clean = String(v).replace(/\s/g,'')
            .replace(/^([\d.,]+)$/, s => {
              // Если последний разделитель — запятая и после неё 2 цифры → европейский формат
              const m = s.match(/^[\d.]+,(\d{1,2})$/);
              if (m) return s.replace(/\./g,'').replace(',','.');
              return s.replace(/,/g,''); // иначе запятая = тысячный разделитель
            });
          out[k] = parseFloat(clean) || 0;
        }
        else if (BOOL_COLS.has(k)) out[k] = (v==='true'||v==='1'||v===true) ? 1 : 0;
      }
      if (!out.id) out.id = (crypto.randomUUID ? crypto.randomUUID()
        : Math.random().toString(36).slice(2));
      return out;
    }

    function downloadTemplate(tableName) {
      const cols = REQUIRED_COLUMNS[tableName] || [];
      const csv  = cols.join(',') + '\n' + cols.map(()=>'').join(',');
      const blob = new Blob([csv], { type:'text/csv' });
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = `template_${tableName}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    function showPreview(rows) {
      const preview = document.getElementById('import-preview');
      if (!preview || !rows.length) return;
      const cols = Object.keys(rows[0]);
      const head = `<tr>${cols.map(c=>`<th style="padding:4px 8px;white-space:nowrap;
        background:var(--bg);position:sticky;top:0">${c}</th>`).join('')}</tr>`;
      const body = rows.slice(0,5).map(r =>
        `<tr>${cols.map(c=>`<td style="padding:3px 8px;border-top:1px solid var(--border);
          white-space:nowrap">${r[c]??''}</td>`).join('')}</tr>`
      ).join('');
      preview.innerHTML = `<table style="border-collapse:collapse;width:100%">
        <thead>${head}</thead><tbody>${body}</tbody></table>`;
      preview.style.display = 'block';
    }

    function validateRows(rows, tableName) {
      const required = REQUIRED_COLUMNS[tableName] || [];
      const cols = Object.keys(rows[0] || {});
      const missing = required.filter(c => !cols.includes(c));
      const el = document.getElementById('import-validation');
      if (!el) return false;
      if (missing.length) {
        el.innerHTML = `<span style="color:#EF4444">❌ Не найдены колонки:
          <strong>${missing.join(', ')}</strong></span>`;
        return false;
      }
      el.innerHTML = `<span style="color:#10B981">✅ Структура совпадает &middot;
        ${rows.length} строк</span>`;
      return true;
    }

    let importRows = [];

    function handleImportFile(file) {
      if (!file) return;
      document.getElementById('import-file-name').textContent = `📄 ${file.name}`;
      const fmt = document.querySelector('input[name="import-fmt"]:checked')?.value || 'csv';
      const reader = new FileReader();
      reader.onload = e => {
        try {
          importRows = fmt === 'csv'
            ? parseCSV(e.target.result)
            : JSON.parse(e.target.result);
          if (!Array.isArray(importRows)) importRows = [importRows];
          showPreview(importRows);
          const table = document.getElementById('import-table').value;
          const valid = validateRows(importRows, table);
          document.getElementById('import-run-btn').style.display = valid ? 'block' : 'none';
        } catch(err) {
          const v = document.getElementById('import-validation');
          if (v) v.innerHTML =
            `<span style="color:#EF4444">❌ Ошибка парсинга: ${err.message}</span>`;
        }
      };
      reader.readAsText(file);
    }

    const importDropzone  = document.getElementById('import-dropzone');
    const importFileInput = document.getElementById('import-file-input');

    importDropzone.addEventListener('click', () => importFileInput.click());
    importDropzone.addEventListener('dragover', e => {
      e.preventDefault();
      importDropzone.style.borderColor = '#3B82F6';
      importDropzone.style.background  = 'rgba(59,130,246,0.04)';
    });
    importDropzone.addEventListener('dragleave', () => {
      importDropzone.style.borderColor = '';
      importDropzone.style.background  = '';
    });
    importDropzone.addEventListener('drop', e => {
      e.preventDefault();
      importDropzone.style.borderColor = '';
      importDropzone.style.background  = '';
      const file = e.dataTransfer.files[0];
      if (file) handleImportFile(file);
    });
    importFileInput.addEventListener('change', e => {
      if (e.target.files[0]) handleImportFile(e.target.files[0]);
    });

    document.getElementById('import-tpl-btn')
      .addEventListener('click', () => {
        downloadTemplate(document.getElementById('import-table').value);
      });

    document.getElementById('import-table')
      .addEventListener('change', () => {
        if (importRows.length) {
          const table = document.getElementById('import-table').value;
          const valid = validateRows(importRows, table);
          document.getElementById('import-run-btn').style.display = valid ? 'block' : 'none';
        }
      });

    document.getElementById('import-run-btn')
      .addEventListener('click', async () => {
        const table   = document.getElementById('import-table').value;
        const btn     = document.getElementById('import-run-btn');
        const barWrap = document.getElementById('import-bar-wrap');
        const bar     = document.getElementById('import-bar');
        const prog    = document.getElementById('import-progress');
        const result  = document.getElementById('import-result');

        btn.disabled          = true;
        btn.textContent       = '⏳ Импортируем...';
        barWrap.style.display = 'block';
        result.textContent    = '';
        bar.style.width       = '0%';

        let created = 0, updated = 0, errors = 0;
        const total = importRows.length;

        for (let i = 0; i < total; i += 10) {
          const batch = importRows.slice(i, i + 10);
          await Promise.all(batch.map(async raw => {
            const row = coerce(raw);
            const url = `tables/${table}`;
            try {
              const exists = row.id
                ? await fetch(`${url}/${row.id}`).then(r => r.ok).catch(() => false)
                : false;
              if (exists) {
                await fetch(`${url}/${row.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(row),
                });
                updated++;
              } else {
                await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(row),
                });
                created++;
              }
            } catch { errors++; }
          }));

          const done = Math.min(i + 10, total);
          bar.style.width  = Math.round(done / total * 100) + '%';
          prog.textContent = `${done} / ${total}`;
        }

        // После импорта clients — пересчитать формулы
        if (table === 'clients') {
          prog.textContent = 'Пересчитываем формулы...';
          try {
            const allClients = await API.getClients();
            const allBCHS    = await API.getAllBCHS();
            const allPC      = await API.getAllPC();
            for (const c of (allClients || [])) {
              try {
                const comp = Calc.computeClient(c, allBCHS, allPC);
                await fetch(`tables/clients/${c.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...c, ...comp }),
                });
              } catch {}
            }
          } catch {}
        }

        API.clearCache();
        result.innerHTML = `<span style="color:#10B981">
          ✅ Создано: ${created} &middot; Обновлено: ${updated}
          ${errors ? `&middot; <span style="color:#EF4444">Ошибок: ${errors}</span>` : ''}
        </span>`;
        btn.disabled    = false;
        btn.textContent = '💾 Импортировать';

        if (table === 'clients') {
          await ClientsPage._load().catch(() => {});
          await DashboardPage.load().catch(() => {});
        }
      });
  },
};



/* ======== API LAYER ======== */
const API = {
  async _get(url) {
    try {
      const r = await fetch(url);
      if (!r.ok) { console.warn('[API GET]', r.status, url); return null; }
      const j = await r.json();
      if (Array.isArray(j))      return j;
      if (Array.isArray(j.data)) return j.data;
      if (j && j.id)             return j;
      return null;
    } catch(e) { console.error('[API GET]', e.message, url); return null; }
  },
  async _post(url, body) {
    try {
      const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      if (!r.ok) { const t = await r.text(); console.warn('[API POST]', r.status, url, t); return null; }
      return await r.json();
    } catch(e) { console.error('[API POST]', e.message); return null; }
  },
  async _put(url, body) {
    try {
      const r = await fetch(url, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      if (!r.ok) { const t = await r.text(); console.warn('[API PUT]', r.status, url, t); return null; }
      return await r.json();
    } catch(e) { console.error('[API PUT]', e.message); return null; }
  },
  async _delete(url) {
    try { await fetch(url, { method:'DELETE' }); } catch(e) {}
  },
  async getClients()  { return (await this._get('tables/clients?limit=500')) || []; },
  async getClient(id) { return await this._get(`tables/clients/${id}`); },
  async createClient(d) {
    const computed = ClientCalc.compute(d);
    const p = { ...d, ...computed }; delete p.id; delete p.bcg_alert;
    return await this._post('tables/clients', p);
  },
  async updateClient(id, d) {
    const computed = ClientCalc.compute(d);
    const p = { ...d, ...computed };
    ['id','gs_project_id','gs_table_name','created_at','updated_at','bcg_alert'].forEach(k => delete p[k]);
    return await this._put(`tables/clients/${id}`, p);
  },
  async deleteClient(id) { await this._delete(`tables/clients/${id}`); },

  _bchsCache: null, _pcCache: null,
    clearCache() { this._bchsCache = null; this._pcCache = null; this._statusCache = null; },

  async getAllBCHS() {
    if (!this._bchsCache) this._bchsCache = (await this._get('tables/bchs_entries?limit=2000')) || [];
    return this._bchsCache;
  },
  async getAllPC() {
    if (!this._pcCache) this._pcCache = (await this._get('tables/pc_entries?limit=2000')) || [];
    return this._pcCache;
  },
  async getBCHSFor(cid) { return (await this.getAllBCHS()).filter(e => String(e.client_id) === String(cid)); },
  async getPCFor(cid)   { return (await this.getAllPC()).filter(e => String(e.client_id) === String(cid)); },
  async getBCHSEntry(cid, m, y) { return (await this.getBCHSFor(cid)).find(e => +e.month===m && +e.year===y)||null; },
  async getPCEntry(cid, m, y)   { return (await this.getPCFor(cid)).find(e => +e.month===m && +e.year===y)||null; },

  async saveBCHSEntry(cid, m, y, signals) {
    this._bchsCache = null;
    const existing = await this.getBCHSEntry(cid, m, y);
    const payload  = { client_id:cid, month:m, year:y };
    for (const k of Object.keys(SIGNALS)) payload[k] = signals[k] == true ? 1 : 0;
    return existing
      ? await this._put(`tables/bchs_entries/${existing.id}`, payload)
      : await this._post('tables/bchs_entries', payload);
  },
  async savePCEntry(cid, m, y, criteria) {
    this._pcCache = null;
    const existing = await this.getPCEntry(cid, m, y);
    const payload  = { client_id:cid, month:m, year:y };
    for (const k of Object.keys(PC_CRITERIA)) {
      const v = criteria[k];
      payload[k] = (v !== null && v !== undefined) ? +v : 1;
    }
    return existing
      ? await this._put(`tables/pc_entries/${existing.id}`, payload)
      : await this._post('tables/pc_entries', payload);
  },
    /* ---- Status Entries ---- */
  _statusCache: null,

  async getAllStatusEntries() {
    if (!this._statusCache)
      this._statusCache = (await this._get('tables/status_entries?limit=5000')) || [];
    return this._statusCache;
  },

  async getStatusEntriesFor(clientId) {
    const all = await this.getAllStatusEntries();
    return all.filter(e => String(e.client_id) === String(clientId));
  },

  async saveStatusEntry(clientId, entryDate, statusText, parsedSignals, parsedPC) {
    this._statusCache = null;
    const [year, month, day] = entryDate.split('-').map(Number);
    const payload = {
      client_id:    clientId,
      entry_date:   entryDate,
      day, month, year,
      status_note:  statusText || '',
      signals_json: JSON.stringify(parsedSignals || {}),
      pc_json:      JSON.stringify(parsedPC || {}),
    };
    return await this._post('tables/status_entries', payload);
  },

  async deleteStatusEntry(id) {
    this._statusCache = null;
    await this._delete(`tables/status_entries/${id}`);
  },

  /* ---- Portfolio Strategies ---- */
  async getPortfolioStrategies() {
    return (await this._get('tables/portfolio_strategies?limit=100')) || [];
  },
  async upsertPortfolioStrategy(horizon, data) {
    const all = await this.getPortfolioStrategies();
    const existing = all.find(r => r.horizon === horizon);
    const payload = { horizon, ...data };
    ['id','gs_project_id','gs_table_name','created_at','updated_at'].forEach(k => delete payload[k]);
    return existing
      ? await this._put(`tables/portfolio_strategies/${existing.id}`, payload)
      : await this._post('tables/portfolio_strategies', payload);
  },

  /* ---- Account Strategies ---- */
  async getAccountStrategies() {
    return (await this._get('tables/account_strategies?limit=500')) || [];
  },
  async getAccountStrategyFor(clientId) {
    const all = await this.getAccountStrategies();
    return all.filter(r => String(r.client_id) === String(clientId) && r.status !== 'Done').sort((a,b) => b.created_at - a.created_at)[0] || null;
  },
  async saveAccountStrategy(clientId, data) {
    const existing = await this.getAccountStrategyFor(clientId);
    const payload = { client_id: clientId, ...data };
    ['id','gs_project_id','gs_table_name','created_at','updated_at'].forEach(k => delete payload[k]);
    return existing
      ? await this._put(`tables/account_strategies/${existing.id}`, payload)
      : await this._post('tables/account_strategies', payload);
  },
};

/* ======== DASHBOARD PAGE ======== */
const DashboardPage = {
  computed: [],
  expandedId: null,
  filterBCG: '', filterHealth: '', searchQ: '',
  pinnedIds: JSON.parse(localStorage.getItem('bchs_pinned')||'[]'),
  _overdueShown: false,

  async render() {
    const isWorker = Role.isWorker();
    const wName    = Role.workerName;
    document.getElementById('main-content').innerHTML = `
      <div class="dash-topbar">
        <div>
          <div class="page-title">${isWorker ? '👤 ' + (wName||'Мои клиенты') : 'Дашборд'}</div>
          <div class="page-subtitle">${isWorker ? 'только ваши клиенты' : 'весь портфель'} · <span id="dash-updated">загрузка…</span></div>
        </div>
        <div class="dash-topbar-actions">
          ${isWorker ? '' : '<button class="btn btn-primary btn-sm" id="dash-add">+ Клиент</button>'}
          <button class="btn btn-secondary btn-sm" id="dash-refresh" title="Обновить">↻</button>
        </div>
      </div>
      <div id="dash-overdue"></div>
      <div id="dash-highlights"></div>
      <div id="dash-tracker-widget" class="trk-dash-widget" style="display:none"></div>
      <div id="dash-sticky" class="sticky-summary" style="display:none"></div>
      <div class="filters-bar">
        <input type="text" class="search-input" id="dash-search" placeholder="🔍 Поиск по имени…" value="${this.searchQ}" />
        <select class="filter-select" id="filter-bcg">
          <option value="">Все BCG</option>
          <option value="KEY"          ${this.filterBCG==='KEY'?'selected':''}>⭐ KEY</option>
          <option value="STABLE"       ${this.filterBCG==='STABLE'?'selected':''}>🐄 STABLE</option>
          <option value="GROWTH"       ${this.filterBCG==='GROWTH'?'selected':''}>💎 GROWTH</option>
          <option value="GROWTH_EARLY" ${this.filterBCG==='GROWTH_EARLY'?'selected':''}>🌱 GROWTH</option>
          <option value="TAIL"         ${this.filterBCG==='TAIL'?'selected':''}>📦 TAIL</option>
        </select>
        <select class="filter-select" id="filter-health">
          <option value="">Все статусы</option>
          <option value="Healthy">🟢 Здоров</option>
          <option value="Neutral">😐 Нейтрально</option>
          <option value="Caution">⚠️ Осторожно</option>
          <option value="AtRisk">🔴 Критично</option>
          <option value="none">— Нет данных</option>
        </select>
      </div>
      <div id="dash-body"><div class="dash-loading">⏳ Загрузка…</div></div>
    `;
    document.getElementById('dash-search').addEventListener('input',  e => { this.searchQ=e.target.value.toLowerCase(); this.renderList(); });
    document.getElementById('filter-bcg').addEventListener('change',  e => { this.filterBCG=e.target.value; this.renderList(); });
    document.getElementById('filter-health').addEventListener('change',e => { this.filterHealth=e.target.value; this.renderList(); });
    document.getElementById('dash-refresh').addEventListener('click', () => this.load());
    const addBtn = document.getElementById('dash-add');
    if (addBtn) addBtn.addEventListener('click', () => App.navigate('clients'));
    this._overdueShown = false;
    await this.load();
  },

  async load() {
    API.clearCache();
    try {
      const [clients, allBCHS, allPC] = await Promise.all([
        API.getClients(), API.getAllBCHS(), API.getAllPC()
      ]);
      this.computed = (clients||[]).map(c => ({ client:c, ...Calc.computeClient(c, allBCHS, allPC) }));
      this.computed.forEach(r => {
        const cid = r.client.id;
        const entries = (allBCHS||[]).filter(e => String(e.client_id) === String(cid));
        if (entries.length) {
          entries.sort((a,b) => a.year!==b.year ? b.year-a.year : b.month-a.month);
          const le = entries[0];
          const d = new Date(le.year, le.month-1, 1);
          r._lastEntryMs = d.getTime();
          r._daysSince = Math.floor((Date.now() - d.getTime()) / 86400000);
        } else {
          r._lastEntryMs = null;
          r._daysSince = null;
        }
      });
      const el = document.getElementById('dash-updated');
      if (el) el.textContent = new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
      this._renderHighlights();
      this._renderOverdueBanner();
      this._renderTrackerWidget();
      this._renderStickyBar();
      this._updateSidebarBadges();
      this.renderList();
    } catch(err) {
      console.error(err);
      const el = document.getElementById('dash-body');
      if (el) el.innerHTML = `<div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Ошибка загрузки</div>
        <div class="empty-state-text">${err.message}</div>
        <button class="btn btn-primary" onclick="DashboardPage.load()">Повторить</button>
      </div>`;
    }
  },

  async _renderTrackerWidget() {
    const el = document.getElementById('dash-tracker-widget');
    if (!el) return;
    const role = localStorage.getItem('bchs_role') || '';
    if (!['service_delivery','csm_analyst'].includes(role)) { el.style.display='none'; return; }
    el.style.display = '';
    el.innerHTML = `<div class="trk-dash-inner">
      <span class="trk-dash-icon">⏱</span>
      <span class="trk-dash-text" id="trk-widget-text">загрузка…</span>
      <button class="trk-dash-add" id="trk-widget-add">＋ Добавить</button>
      <a href="#" class="trk-dash-link" id="trk-widget-link">Открыть трекер →</a>
    </div>`;
    document.getElementById('trk-widget-link')?.addEventListener('click', e => { e.preventDefault(); App.navigate('tracker'); });
    document.getElementById('trk-widget-add')?.addEventListener('click', () => this._openTrackerQuickModal());
    try {
      const [todayRows, monthRows] = await Promise.all([
        TrackerAPI.getToday(), TrackerAPI.getThisMonth()
      ]);
      const td = TrackerAPI.fmtHours(TrackerAPI.sumMinutes(todayRows));
      const mo = TrackerAPI.fmtHours(TrackerAPI.sumMinutes(monthRows));
      const txt = document.getElementById('trk-widget-text');
      if (txt) txt.textContent = `Сегодня: ${td}ч  |  Месяц: ${mo}ч`;
    } catch(e) {
      const txt = document.getElementById('trk-widget-text');
      if (txt) txt.textContent = 'Нет данных';
    }
  },

  _openTrackerQuickModal() {
    // Быстрый модал добавления активности прямо с дашборда
    const mc = document.getElementById('main-content');
    const clients = DashboardPage.computed.map(r => r.client) || [];
    const opts = clients.map(c => `<option value="${c.id}">${c.name||c.id}</option>`).join('');
    const durOpts = [15,30,45,60,90,120].map(m => `<option value="${m}" ${m===30?'selected':''}>${m<60?m+'м':(m/60)+'ч'}</option>`).join('');
    App.openModal(`
      <div style="padding:4px">
        <h3 style="margin:0 0 14px;font-size:15px">⏱ Быстрое добавление</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          <input type="date" id="qm-date" style="padding:7px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)" value="${new Date().toISOString().slice(0,10)}" />
          <select id="qm-client" style="padding:7px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)">
            <option value="">— Клиент —</option>${opts}
          </select>
          <div style="display:flex;gap:8px">
            <select id="qm-type" style="flex:1;padding:7px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)">
              ${Object.entries(_TRK_TYPES||{'call':'📞 Звонок','meeting':'🤝 Встреча','analysis':'🔍 Анализ','report':'📄 Отчёт','other':'🗂 Другое'}).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
            </select>
            <select id="qm-dur" style="width:80px;padding:7px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)">${durOpts}</select>
          </div>
          <input type="text" id="qm-note" placeholder="Заметка..." style="padding:7px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)" maxlength="200" />
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
            <input type="checkbox" id="qm-billable" checked /> Billable
          </label>
          <div id="qm-fb" style="font-size:12px;min-height:16px"></div>
          <button id="qm-save" style="padding:9px;border-radius:8px;background:var(--blue);color:#fff;border:none;cursor:pointer;font-weight:600">💾 Сохранить</button>
        </div>
      </div>
    `);
    document.getElementById('qm-save')?.addEventListener('click', async () => {
      const cid  = document.getElementById('qm-client')?.value;
      const dt   = document.getElementById('qm-date')?.value;
      const tp   = document.getElementById('qm-type')?.value;
      const dur  = parseInt(document.getElementById('qm-dur')?.value)||30;
      const nt   = document.getElementById('qm-note')?.value||'';
      const bl   = document.getElementById('qm-billable')?.checked??true;
      const fb   = document.getElementById('qm-fb');
      const btn  = document.getElementById('qm-save');
      if(!cid){if(fb)fb.textContent='⚠️ Выберите клиента';return;}
      btn.disabled=true;btn.textContent='⏳...';
      try {
        await TrackerAPI.create({client_id:cid,date:dt,type:tp,duration_minutes:dur,note:nt,billable:bl});
        App.closeModal();
        App.toast('✅ Активность добавлена','success');
        DashboardPage._renderTrackerWidget();
      } catch(e){
        if(fb)fb.textContent='❌ '+e.message;
        btn.disabled=false;btn.textContent='💾 Сохранить';
      }
    });
  },

  _renderOverdueBanner() {
    const el = document.getElementById('dash-overdue');
    if (!el) return;
    if (this._overdueShown) return;
    const now = new Date();
    const curMonth = now.getMonth() + 1;
    const src = this._applyWorkerFilter(this.computed);
    const overdue = src.filter(r => r._daysSince === null || r._daysSince > 35);
    if (!overdue.length) { el.innerHTML = ''; return; }
    this._overdueShown = true;
    const items = overdue.slice(0, 6).map(r =>
      `<span class="overdue-banner-item" data-id="${r.client.id}">${r.client.name}</span>`
    ).join('');
    const more = overdue.length > 6 ? `<span style="font-size:11px;color:#92400e;align-self:center">+${overdue.length-6} ещё</span>` : '';
    el.innerHTML = `
      <div class="overdue-banner">
        <span class="overdue-banner-icon">⏰</span>
        <div class="overdue-banner-body">
          <div class="overdue-banner-title">${overdue.length} клиент${overdue.length===1?'':overdue.length<5?'а':'ов'} без данных за ${MONTHS_RU[curMonth-1]}</div>
          <div class="overdue-banner-list">${items}${more}</div>
        </div>
        <button class="overdue-banner-close" id="overdue-close" title="Закрыть">✕</button>
      </div>`;
    el.querySelectorAll('.overdue-banner-item').forEach(b =>
      b.addEventListener('click', () => App.navigate('entry', b.dataset.id)));
    const closeBtn = document.getElementById('overdue-close');
    if (closeBtn) closeBtn.addEventListener('click', () => { el.innerHTML = ''; });
  },

  _renderStickyBar() {
    // ФИКС 4 — sticky bar скрыт по умолчанию, показывается только при скролле
    const el = document.getElementById('dash-sticky');
    if (!el) return;
    const src = this._applyWorkerFilter(this.computed);
    if (!src.length) { el.style.display = 'none'; return; }
    const atRisk  = src.filter(r => r.health.key === 'AtRisk').length;
    const caution = src.filter(r => r.health.key === 'Caution').length;
    const healthy = src.filter(r => r.health.key === 'Healthy').length;
    const overdue = src.filter(r => r._daysSince === null || r._daysSince > 35).length;
    const mrTotal = src.reduce((s,r) => s + (+r.client.monthly_revenue||0), 0);
    const chips = [];
    if (atRisk)  chips.push(`<span class="sticky-sum-chip red">🔴 ${atRisk} Критично</span>`);
    if (caution) chips.push(`<span class="sticky-sum-chip yellow">⚠️ ${caution} Осторожно</span>`);
    if (healthy) chips.push(`<span class="sticky-sum-chip green">🟢 ${healthy} Здоровых</span>`);
    if (overdue) chips.push(`<span class="sticky-sum-chip yellow">⏰ ${overdue} просрочено</span>`);
    if (mrTotal) chips.push(`<span class="sticky-sum-chip">💰 ${mrTotal>=1000?(mrTotal/1000).toFixed(0)+'K':mrTotal} MR</span>`);
    chips.push(`<span class="sticky-sum-chip">📋 ${src.length} клиентов</span>`);
    el.innerHTML = chips.join('');
    // Показываем sticky только когда highlights-bar ушёл за верхний край
    el.style.display = 'none';
    const highlightsEl = document.getElementById('dash-highlights');
    const mc = document.getElementById('main-content');
    if (mc && highlightsEl) {
      const onScroll = () => {
        const hlBottom = highlightsEl.getBoundingClientRect().bottom;
        el.style.display = hlBottom < 0 ? 'flex' : 'none';
      };
      mc.removeEventListener('scroll', mc._stickyHandler);
      mc._stickyHandler = onScroll;
      mc.addEventListener('scroll', onScroll, { passive: true });
    }
  },

  _updateSidebarBadges() {
    const src = this._applyWorkerFilter(this.computed);
    const atRisk = src.filter(r => r.health.key === 'AtRisk').length;
    const overdue = src.filter(r => r._daysSince === null || r._daysSince > 35).length;
    const dashNav = document.querySelector('.nav-item[data-page="dashboard"]');
    if (dashNav) {
      let badge = dashNav.querySelector('.nav-badge');
      if (atRisk > 0) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'nav-badge'; dashNav.appendChild(badge); }
        badge.textContent = atRisk;
      } else if (badge) badge.remove();
    }
    const entryNav = document.querySelector('.nav-item[data-page="entry"]');
    if (entryNav) {
      let badge = entryNav.querySelector('.nav-badge');
      if (overdue > 0) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'nav-badge nav-badge-blue'; entryNav.appendChild(badge); }
        badge.textContent = overdue;
      } else if (badge) badge.remove();
    }
    const bnDash = document.querySelector('.bottom-nav-btn[data-page="dashboard"] .bn-badge');
    if (bnDash) { bnDash.textContent = atRisk; bnDash.style.display = atRisk ? 'flex' : 'none'; }
    const bnEntry = document.querySelector('.bottom-nav-btn[data-page="entry"] .bn-badge');
    if (bnEntry) { bnEntry.textContent = overdue; bnEntry.style.display = overdue ? 'flex' : 'none'; }
  },

  _renderHighlights() {
    const el = document.getElementById('dash-highlights');
    if (!el) return;
    const src    = this._applyWorkerFilter(this.computed);
    const total  = src.length;
    const atRisk = src.filter(r => r.health.key === 'AtRisk').length;
    const caution= src.filter(r => r.health.key === 'Caution').length;
    const noData = src.filter(r => r.bchs === null).length;
    const rescue = src.filter(r => r.client.key_account_priority === 'RESCUE').length;
    const healthy= src.filter(r => r.health.key === 'Healthy').length;
    const newClients = src.filter(r => {
      const age = Date.now() - (r.client.created_at||0);
      return age < 30 * 24 * 3600 * 1000;
    }).length;
    const mrTotal = src.reduce((s,r) => s + (+r.client.monthly_revenue||0), 0);
    const chips = [];
    if (rescue > 0)  chips.push(`<div class="hl-chip hl-red">🚨 RESCUE: ${rescue}</div>`);
    if (atRisk > 0)  chips.push(`<div class="hl-chip hl-red">🔴 Критично: ${atRisk}</div>`);
    if (caution > 0) chips.push(`<div class="hl-chip hl-yellow">⚠️ Осторожно: ${caution}</div>`);
    if (healthy > 0) chips.push(`<div class="hl-chip hl-green">🟢 Здоровых: ${healthy}</div>`);
    if (noData > 0)  chips.push(`<div class="hl-chip hl-gray">📭 Нет данных: ${noData}</div>`);
    if (newClients > 0) chips.push(`<div class="hl-chip hl-blue">✨ Новых за 30д: ${newClients}</div>`);
    if (mrTotal > 0) chips.push(`<div class="hl-chip hl-gray">💰 MR: ${mrTotal >= 1000 ? (mrTotal/1000).toFixed(0)+'K' : mrTotal}</div>`);
    chips.push(`<div class="hl-chip hl-gray">📋 Всего: ${total}</div>`);
    el.innerHTML = chips.length ? `<div class="dash-highlights-bar">${chips.join('')}</div>` : '';
  },

  _applyWorkerFilter(rows) {
    if (!Role.isWorker()) return rows;
    const wn = (Role.workerName||'').trim().toLowerCase();
    if (!wn) return rows;
    return rows.filter(r => {
      const owner = (r.client.sales_owner||'').trim().toLowerCase();
      return owner === wn || owner.includes(wn) || wn.includes(owner);
    });
  },

  filtered() {
    let rows = this._applyWorkerFilter(this.computed);
    if (this.searchQ)     rows = rows.filter(r => r.client.name.toLowerCase().includes(this.searchQ));
    if (this.filterBCG)   rows = rows.filter(r => r.client.bcg_category === this.filterBCG);
    if (this.filterHealth) rows = rows.filter(r => r.health.key === this.filterHealth);
    return rows;
  },

  renderList() {
    const rows   = this.filtered();
    const pinned = rows.filter(r => this.pinnedIds.includes(r.client.id));
    const rest   = rows.filter(r => !this.pinnedIds.includes(r.client.id));
    const alert  = rest.filter(r => r.section==='alert');
    const work   = rest.filter(r => r.section==='work');
    const auto   = rest.filter(r => r.section==='auto');
    let html = '';
    if (!rows.length) {
      const isW = Role.isWorker();
      html = `<div class="empty-state-v2">
        <div class="es-art">${isW ? '👤' : '📋'}</div>
        <div class="es-title">${isW ? 'Нет ваших клиентов' : 'Клиенты не найдены'}</div>
        <div class="es-sub">${isW
          ? `Клиенты с полем «Менеджер» = <strong>${Role.workerName}</strong> не найдены.`
          : 'Попробуйте изменить фильтры или добавьте первого клиента.'
        }</div>
        <div class="es-actions">
          ${isW
            ? `<button class="btn btn-secondary" onclick="document.getElementById('role-toggle-btn').click()">⇄ Сменить вид</button>`
            : `<button class="btn btn-primary" onclick="App.navigate('clients')">+ Добавить клиента</button>`
          }
        </div>
      </div>`;
    } else {
      if (pinned.length) html += this._section('📌 Закреплённые', pinned, 'section-pinned');
      if (alert.length)  html += this._section('🚨 Требуют внимания', alert, 'section-alert');
      if (work.length)   html += this._section('⚡ В работе',          work,  'section-work');
      if (auto.length)   html += this._section('⚪ Автопилот',         auto,  'section-auto');
    }
    const el = document.getElementById('dash-body');
    if (el) { el.innerHTML = html; this._bindRows(); }
  },

  _section(title, rows, cls) {
    return `<div class="dash-section ${cls}">
      <div class="section-header">${title}<span class="section-count">${rows.length}</span></div>
      ${rows.map(r => this._row(r)).join('')}
    </div>`;
  },

  _row(r) {
    const c      = r.client;
    const exp    = this.expandedId === c.id;
    const pinned = this.pinnedIds.includes(c.id);
    const bcg    = BCG_LABELS[c.bcg_category] || c.bcg_category || '—';
    const ly     = r.loyalty !== null ? r.loyalty+'%' : '—';
    const pot    = r.potential !== null ? r.potential+'%' : '—';
    const owner  = c.sales_owner ? `<span class="row-owner">👤 ${c.sales_owner}</span>` : '';
    let lastActChip = '';
    if (r._daysSince === null) {
      lastActChip = `<span class="last-act-chip last-act-none" title="Нет данных">—</span>`;
    } else if (r._daysSince <= 35) {
      lastActChip = `<span class="last-act-chip last-act-ok" title="Последние данные ${r._daysSince}д назад">${r._daysSince}д</span>`;
    } else if (r._daysSince <= 60) {
      lastActChip = `<span class="last-act-chip last-act-warn" title="Давно нет данных">${r._daysSince}д</span>`;
    } else {
      lastActChip = `<span class="last-act-chip last-act-overdue" title="Просрочено">${r._daysSince}д ⚠</span>`;
    }
    return `
      <div class="client-row${exp?' expanded':''}${pinned?' pinned':''}" data-id="${c.id}" data-bcg="${c.bcg_category||''}">
        <div class="row-main">
          <button class="pin-btn${pinned?' pinned':''}" data-action="pin" data-id="${c.id}" title="${pinned?'Открепить':'Закрепить вверху'}">📌</button>
          <span class="client-name" title="${c.name}">${c.name}</span>
          <span class="badge ${r.badge.cls}">${r.badge.label}</span>
          ${owner}
          <span class="focus-text">${r.focus}</span>
        </div>
        <div class="row-metrics">
          ${lastActChip}
          <span class="bcg-chip">${bcg}</span>
          <span class="health-chip ${r.health.cls}">${r.health.label}</span>
          <span class="metric-chip metric-chip--${r.loyalty===null?'neutral':r.loyalty>=60?'positive':r.loyalty>=40?'warning':'danger'}" title="Лояльность">${ly}</span>
          <span class="metric-chip metric-chip--${r.potential===null?'neutral':r.potential>=85?'positive':r.potential>=65?'warning':'danger'}" title="Реализация потенциала">${pot}</span>
          <span class="metric-chip metric-chip--${r.riskCls}" title="Риск выручки">${r.riskPct}%💰</span>
          <span class="metric-chip metric-chip--${r.rphCls}" title="Стоимость часа">${r.rphWD?'WD':r.revenuePerHour!==null?'$'+r.revenuePerHour+'/ч':'N/A'}</span>
        </div>
      </div>
      ${exp ? this._expanded(r) : ''}`;
  },

  _togglePin(id) {
    const idx = this.pinnedIds.indexOf(id);
    if (idx >= 0) this.pinnedIds.splice(idx, 1);
    else this.pinnedIds.unshift(id);
    localStorage.setItem('bchs_pinned', JSON.stringify(this.pinnedIds));
    this.renderList();
  },

  _expanded(r) {
    const c   = r.client;
    const bcg = BCG_LABELS[c.bcg_category] || '—';
    return `<div class="row-detail" data-detail-id="${c.id}">
      <div class="row-detail-grid">
        <div class="detail-stat">
          <span class="detail-stat-label">BCG / Приоритет</span>
          <span class="detail-stat-value" style="font-size:13px">${bcg}</span>
          <span class="detail-stat-sub">${c.key_account_priority||'—'}</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-label">bCHS · Лояльность</span>
          <span class="detail-stat-value">${r.bchs!==null?r.bchs:'—'}</span>
          <span class="detail-stat-sub">${r.loyalty!==null?r.loyalty+'%':'нет данных'}</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-label">PC · Нагрузка</span>
          <span class="detail-stat-value">${r.pcScore!==null?r.pcScore.toFixed(1):'—'}</span>
          <span class="detail-stat-sub">${r.load.label}</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-label">Final · Здоровье</span>
          <span class="detail-stat-value">${r.final!==null?r.final.toFixed(0):'—'}</span>
          <span class="detail-stat-sub">${r.health.label}</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-label">⚖️ Реализация потенциала</span>
          <span class="detail-stat-value">${r.potential!==null?r.potential+'%':'—'}</span>
          <span class="detail-stat-sub">${r.potential!==null?'от цели '+r.potentialIdeal+' балла':'нет данных'}</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-label">💰 Риск выручки</span>
          <span class="detail-stat-value" style="color:${r.riskColor}">${r.isWD?'WD':r.riskPct+'%'}</span>
          <span class="detail-stat-sub">$${r.revenueAtRisk.toLocaleString('ru-RU')}</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-label">⏱ Стоимость часа</span>
          <span class="detail-stat-value" style="color:${r.rphColor}">${r.rphWD?'WD':r.revenuePerHour!==null?'$'+r.revenuePerHour+'/ч':'N/A'}</span>
          <span class="detail-stat-sub">$${Number(r.client?.monthly_revenue||0).toLocaleString('ru-RU')}/мес</span>
        </div>
        <div class="detail-stat">
          <span class="detail-stat-label">CSM · Часы</span>
          <span class="detail-stat-value" style="font-size:13px">${c.csm_assignment||'—'}</span>
          <span class="detail-stat-sub">${c.total_hours||0}ч/нед</span>
        </div>
      </div>
      <div class="detail-actions">
  <button class="btn btn-primary btn-sm"   data-action="go-detail" data-id="${c.id}">📊 Карточка</button>
  <button class="btn btn-secondary btn-sm" data-action="go-entry"  data-id="${c.id}">✎ Данные</button>
  <button class="btn btn-secondary btn-sm" data-action="go-edit"   data-id="${c.id}">⚙ Профиль</button>
  <button class="btn btn-secondary btn-sm" data-action="open-status" data-id="${c.id}" data-name="${c.name}">📝 Статус</button>
</div>
    </div>`;
  },

   _bindRows() {
    document.querySelectorAll('.client-row').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        const id = el.dataset.id;
        this.expandedId = this.expandedId === id ? null : id;
        this.renderList();
      });
    });
    document.querySelectorAll('[data-action="pin"]').forEach(b =>
      b.addEventListener('click', e => { e.stopPropagation(); this._togglePin(b.dataset.id); }));
    document.querySelectorAll('[data-action="go-detail"]').forEach(b =>
      b.addEventListener('click', e => { e.stopPropagation(); App.navigate('detail', b.dataset.id); }));
    document.querySelectorAll('[data-action="go-entry"]').forEach(b =>
      b.addEventListener('click', e => { e.stopPropagation(); App.navigate('entry', b.dataset.id); }));
    document.querySelectorAll('[data-action="go-edit"]').forEach(b =>
      b.addEventListener('click', e => { e.stopPropagation(); App.navigate('clients', b.dataset.id); }));
    document.querySelectorAll('[data-action="open-status"]').forEach(b =>
      b.addEventListener('click', e => { e.stopPropagation(); DashboardPage.openStatusModal(b.dataset.id, b.dataset.name); }));
  },

    openStatusModal(clientId, clientName) {
    const now   = new Date();
    const today = now.toISOString().split('T')[0];

    App.openModal(`
      <div style="padding:4px 0 12px">
        <div style="font-size:16px;font-weight:600;margin-bottom:4px">📝 Статус клиента</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">${clientName}</div>
      </div>
      <div style="margin-bottom:14px">
        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700">Дата записи</label>
        <input type="date" id="status-date" value="${today}"
          style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--border);
                 background:var(--surface);color:var(--text-primary);font-size:14px;box-sizing:border-box" />
      </div>
      <div style="margin-bottom:14px">
        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700">Что происходило</label>
        <textarea id="status-text" rows="5"
          placeholder="Опишите что происходило с клиентом..."
          style="width:100%;resize:vertical;min-height:100px;padding:8px 12px;border-radius:8px;
                 border:1px solid var(--border);background:var(--surface);color:var(--text-primary);
                 font-size:13px;box-sizing:border-box;font-family:inherit"></textarea>
      </div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" id="status-ai-btn">🤖 Распознать сигналы</button>
        <span id="status-ai-status" style="font-size:12px;color:var(--text-muted)"></span>
      </div>
      <div id="status-ai-result" class="hidden"
        style="margin-bottom:14px;padding:10px 14px;background:rgba(16,185,129,0.08);
               border:1px solid rgba(16,185,129,0.2);border-radius:8px;
               font-size:12px;color:var(--text-secondary);line-height:1.6"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary btn-sm" id="status-cancel-btn">Отмена</button>
        <button class="btn btn-primary btn-sm"   id="status-save-btn">💾 Сохранить запись</button>
      </div>
    `);

    document.getElementById('status-cancel-btn').addEventListener('click', () => App.closeModal());

    document.getElementById('status-ai-btn').addEventListener('click', async () => {
  const text = (document.getElementById('status-text')?.value || '').trim();
  if (!text) { App.toast('Введите текст статуса', 'error'); return; }
  const apiKey = localStorage.getItem('bchs_deepseek_key') || '';
  if (!apiKey) { App.toast('Нет DeepSeek ключа — сохраните в разделе MC', 'error'); return; }
  const btn    = document.getElementById('status-ai-btn');
  const status = document.getElementById('status-ai-status');
  const result = document.getElementById('status-ai-result');
  btn.disabled = true; btn.textContent = '⏳ Анализирую...';
  status.textContent = 'Отправляю запрос...';
  const signalLines = Object.entries(SIGNALS).map(([k,d]) =>
    `"${k}": "${d.label}" (${d.weight>0?'+':''}${d.weight})`).join('\n');
  const pcLines = Object.entries(PC_CRITERIA).map(([k,d]) =>
    `"${k}": "${d.label}" — ${d.hint}`).join('\n');
  const prompt = `Аналитик клиентского портфеля. Проанализируй текст:\n"${text}"\n\nСИГНАЛЫ bCHS:\n${signalLines}\n\nКРИТЕРИИ PC:\n${pcLines}\n\nВерни ТОЛЬКО JSON:\n{"signals":{${Object.keys(SIGNALS).map(k=>`"${k}":false`).join(',')}},"pc":{${Object.keys(PC_CRITERIA).map(k=>`"${k}":2`).join(',')}},"explanation":"..."}`;
  try {
    const resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat', temperature: 0.2, max_tokens: 800,
        messages: [
          { role: 'system', content: 'Отвечай ТОЛЬКО валидным JSON без markdown.' },
          { role: 'user',   content: prompt }
        ]
      })
    });
    if (!resp.ok) throw new Error(`API error ${resp.status}`);
    const data    = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    const match   = content.match(/\{[\s\S]*\}/);
    const parsed  = JSON.parse(match ? match[0] : content);
    document.getElementById('status-save-btn').dataset.parsed = JSON.stringify(parsed);
    const activeCount = Object.values(parsed.signals || {}).filter(Boolean).length;

    result.classList.remove('hidden');

    const signalChips = Object.entries(parsed.signals || {})
      .filter(([,v]) => v)
      .map(([k]) => {
        const s = SIGNALS[k];
        if (!s) return '';
        const col = s.weight > 0 ? '#059669' : '#dc2626';
        const bg  = s.weight > 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';
        return `<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;
          border-radius:6px;background:${bg};border:1px solid ${col}22;
          margin-bottom:4px;cursor:pointer;user-select:none">
          <input type="checkbox" class="ai-sig-check" data-key="${k}" checked
            style="width:14px;height:14px;accent-color:${col};cursor:pointer;flex-shrink:0"/>
          <span style="font-size:11.5px;color:var(--text-primary);flex:1">${s.label}</span>
          <span style="font-size:11px;font-weight:700;color:${col}">${s.weight > 0 ? '+' : ''}${s.weight}</span>
        </label>`;
      }).join('');

    const pcRows = Object.entries(parsed.pc || {})
      .filter(([k,v]) => PC_CRITERIA[k] && v >= 1 && v <= 5)
      .map(([k,v]) => {
        const dots = [1,2,3,4,5].map(n =>
          `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;
            background:${n <= v ? '#3b82f6' : 'var(--border)'};margin-right:2px"></span>`
        ).join('');
        return `<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;
          border-radius:6px;background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.12);
          margin-bottom:4px;cursor:pointer;user-select:none">
          <input type="checkbox" class="ai-pc-check" data-key="${k}" checked
            style="width:14px;height:14px;accent-color:#3b82f6;cursor:pointer;flex-shrink:0"/>
          <span style="font-size:11.5px;color:var(--text-primary);flex:1">${PC_CRITERIA[k].label}</span>
          <span style="display:flex;align-items:center;gap:2px">${dots}</span>
          <strong style="font-size:12px;color:var(--text-primary);min-width:12px;text-align:right">${v}</strong>
        </label>`;
      }).join('');

    result.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">
        <span style="font-size:13px;font-weight:700;color:var(--text-primary)">
          ${activeCount > 0 ? `✅ ${activeCount} сигнал${activeCount===1?'':'а'}` : '😐 Сигналов нет'}
        </span>
        ${activeCount > 0 ? `<span style="font-size:11px;color:var(--text-muted)">bCHS ${Object.entries(parsed.signals||{}).filter(([,v])=>v).reduce((s,[k])=>s+(SIGNALS[k]?.weight||0),0)}</span>` : ''}
      </div>

      ${signalChips ? `
        <div style="margin-bottom:12px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
            color:var(--text-muted);margin-bottom:6px">Сигналы — отметь что применить</div>
          ${signalChips}
        </div>` : ''}

      ${pcRows ? `
        <div style="margin-bottom:10px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
            color:var(--text-muted);margin-bottom:6px">PC Score — отметь что применить</div>
          ${pcRows}
        </div>` : ''}

      ${parsed.explanation ? `
        <div style="font-size:11.5px;color:var(--text-muted);line-height:1.5;
          padding:6px 10px;background:var(--bg);border-radius:6px;border-left:2px solid var(--border)">
          ${parsed.explanation}
        </div>` : ''}
    `;

    status.textContent = `✅ ${activeCount} сигналов`;
    App.toast(`🤖 AI нашёл ${activeCount} сигналов`, 'success');
  } catch(e) {
    console.error('[StatusModal AI]', e);
    status.textContent = '❌ Ошибка';
    App.toast('Ошибка AI: ' + e.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = '🤖 Распознать сигналы';
  }
});


    document.getElementById('status-save-btn').addEventListener('click', async () => {
  const date    = document.getElementById('status-date').value;
  const text    = (document.getElementById('status-text')?.value || '').trim();
  const rawData = document.getElementById('status-save-btn').dataset.parsed;
  const parsed  = rawData ? JSON.parse(rawData) : null;
  if (!date) { App.toast('Укажите дату', 'error'); return; }
  const saveBtn = document.getElementById('status-save-btn');
  saveBtn.disabled = true; saveBtn.textContent = '⏳ Сохраняем...';
  try {
    // 1. Всегда сохраняем дневную запись в status_entries
    await API.saveStatusEntry(clientId, date, text, parsed?.signals, parsed?.pc);

    // 2. Мёрджим с существующими месячными данными — только одобренные чекбоксами
    if (parsed) {
      const [year, month] = date.split('-').map(Number);

      // Читаем одобренные сигналы
      const approvedSignals = {};
      document.querySelectorAll('.ai-sig-check').forEach(cb => {
        approvedSignals[cb.dataset.key] = cb.checked;
      });

      // Читаем одобренные PC
      const approvedPC = {};
      document.querySelectorAll('.ai-pc-check').forEach(cb => {
        if (cb.checked) approvedPC[cb.dataset.key] = parsed?.pc?.[cb.dataset.key];
      });

      const hasSignals = Object.values(approvedSignals).some(Boolean);
      const hasPC = Object.values(approvedPC).some(v => v >= 1 && v <= 5);

      if (hasSignals) {
        const existing = await API.getBCHSEntry(clientId, month, year);
        const base = {};
        for (const key of Object.keys(SIGNALS)) {
          base[key] = existing ? !!(existing[key]) : false;
        }
        for (const key of Object.keys(SIGNALS)) {
          if (approvedSignals[key] === true) base[key] = true;
        }
        if (text) base.status_note = text;
        await API.saveBCHSEntry(clientId, month, year, base);
      }

      if (hasPC) {
        const existingPC = await API.getPCEntry(clientId, month, year);
        const basePC = {};
        for (const key of Object.keys(PC_CRITERIA)) {
          const oldVal = existingPC?.[key];
          basePC[key] = (oldVal >= 1 && oldVal <= 5) ? oldVal : null;
        }
        for (const key of Object.keys(PC_CRITERIA)) {
          if (approvedPC[key] >= 1 && approvedPC[key] <= 5) basePC[key] = approvedPC[key];
        }
        await API.savePCEntry(clientId, month, year, basePC);
      }
    }

    API.clearCache();
    App.closeModal();
    App.toast('✅ Статус сохранён!', 'success');
    await DashboardPage.load();
  } catch(err) {
    console.error(err);
    App.toast('❌ Ошибка сохранения', 'error');
  } finally {
    saveBtn.disabled = false; saveBtn.textContent = '💾 Сохранить запись';
  }
});
  },

};


const EntryPage = {
  clients: [], selClient: null, selMonth: null, selYear: null,
  signals: {}, pc: {},
  _pendingMonth: null, _pendingYear: null,
  _wizardStep: 1,
  _autosaveTimer: null,
  _allBCHS: [],

  async render(preselId) {
    const now = new Date();
    this.selMonth = this._pendingMonth || (now.getMonth()+1);
    this.selYear  = this._pendingYear  || now.getFullYear();
    this._pendingMonth = null; this._pendingYear = null;
    this.signals = {}; this.pc = {};
    this._wizardStep = 1;
    document.getElementById('main-content').innerHTML =
      `<div class="page-header"><div class="page-title">Внести данные</div></div>
       <div style="text-align:center;padding:40px;color:var(--text-muted)">⏳ Загрузка...</div>`;
    [this.clients, this._allBCHS] = await Promise.all([API.getClients(), API.getAllBCHS()]);
    this.selClient = preselId || (this.clients[0]?.id || null);
    this._tryRestoreAutosave();
    this._buildForm();
  },

  _autosaveKey() { return `bchs_as_${this.selClient}_${this.selYear}_${this.selMonth}`; },
  _autosave() {
    if (!this.selClient) return;
    localStorage.setItem(this._autosaveKey(), JSON.stringify({ signals: this.signals, pc: this.pc }));
    const ind = document.getElementById('autosave-ind');
    if (ind) { ind.textContent = '✓ Автосохранено'; ind.className = 'autosave-indicator saved'; }
  },
  _tryRestoreAutosave() {
    if (!this.selClient) return;
    const saved = localStorage.getItem(this._autosaveKey());
    if (!saved) return;
    try {
      const d = JSON.parse(saved);
      if (d.signals) this.signals = d.signals;
      if (d.pc)      this.pc = d.pc;
    } catch(e) {}
  },
  _clearAutosave() {
    if (this.selClient) localStorage.removeItem(this._autosaveKey());
  },

  _lastEntryDays(cid) {
    const entries = (this._allBCHS||[]).filter(e => String(e.client_id) === String(cid));
    if (!entries.length) return null;
    entries.sort((a,b) => a.year!==b.year ? b.year-a.year : b.month-a.month);
    const le = entries[0];
    const d = new Date(le.year, le.month-1, 1);
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  },

  _buildForm() {
    const main = document.getElementById('main-content');
    if (!this.clients.length) {
      main.innerHTML = `
        <nav class="breadcrumbs"><a class="breadcrumb-item" href="#" onclick="App.navigate('dashboard');return false">◉ Дашборд</a><span class="breadcrumb-sep">›</span><span class="breadcrumb-current">Внести данные</span></nav>
        <div class="empty-state-v2">
          <div class="es-art">📭</div>
          <div class="es-title">Нет клиентов</div>
          <div class="es-sub">Сначала добавьте хотя бы одного клиента.</div>
          <div class="es-actions">
            <!-- ФИКС 2 — открываем модал создания клиента, не уходим со страницы -->
            <button class="btn btn-primary" id="ep-add-client-btn">+ Добавить клиента</button>
          </div>
        </div>`;
      document.getElementById('ep-add-client-btn')?.addEventListener('click', () => EntryPage._openNewClientModal());
      return;
    }
    const now = new Date(), cm = now.getMonth()+1, cy = now.getFullYear();
    const unfilled = this.clients.filter(c => {
      const hasMonth = (this._allBCHS||[]).some(e => String(e.client_id)===String(c.id) && +e.month===cm && +e.year===cy);
      return !hasMonth;
    });
    const cOpts = this.clients.map(c => `<option value="${c.id}" ${c.id===this.selClient?'selected':''}>${c.name}</option>`).join('');
    const mOpts = MONTHS_RU.map((m,i) => `<option value="${i+1}" ${i+1===this.selMonth?'selected':''}>${m}</option>`).join('');
    const yOpts = [cy-1,cy,cy+1].map(y => `<option value="${y}" ${y===this.selYear?'selected':''}>${y}</option>`).join('');

    main.innerHTML = `
      <nav class="breadcrumbs">
        <a class="breadcrumb-item" href="#" id="ep-bc">◉ Дашборд</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">Внести данные</span>
      </nav>
      <div class="page-header">
        <div class="page-title">Внести данные</div>
        <div class="page-subtitle">bCHS + PC Score · <span class="autosave-indicator" id="autosave-ind">черновик в браузере</span></div>
      </div>
      ${unfilled.length > 0 ? `
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:6px">⏰ Не заполнено за ${MONTHS_RU[cm-1]} (${unfilled.length})</div>
          <div class="unfilled-list">
            ${unfilled.slice(0,5).map(c => {
              const days = this._lastEntryDays(c.id);
              return `<div class="unfilled-item" data-id="${c.id}">
                <span class="unfilled-item-name">${c.name}</span>
                <span class="unfilled-item-days">${days===null?'нет данных':days+'д назад'}</span>
              </div>`;
            }).join('')}
            ${unfilled.length > 5 ? `<div style="font-size:11.5px;color:var(--text-muted);padding:4px 10px">+${unfilled.length-5} ещё</div>` : ''}
          </div>
        </div>
      ` : `<div class="ctx-banner ctx-banner-ok" style="margin-bottom:16px">✅ Все клиенты заполнены за ${MONTHS_RU[cm-1]}</div>`}

      <div class="wizard-steps" id="wizard-steps">
        <div class="wizard-step ${this._wizardStep>=1?(this._wizardStep>1?'done':'active'):''}" id="ws-1">
          <div class="wizard-step-dot">${this._wizardStep>1?'✓':'1'}</div>
          <div class="wizard-step-lbl">Клиент / Период</div>
        </div>
        <div class="wizard-step ${this._wizardStep>=2?(this._wizardStep>2?'done':'active'):''}" id="ws-2">
          <div class="wizard-step-dot">${this._wizardStep>2?'✓':'2'}</div>
          <div class="wizard-step-lbl">bCHS Сигналы</div>
        </div>
        <div class="wizard-step ${this._wizardStep>=3?(this._wizardStep>3?'done':'active'):''}" id="ws-3">
          <div class="wizard-step-dot">${this._wizardStep>3?'✓':'3'}</div>
          <div class="wizard-step-lbl">PC Score</div>
        </div>
        <div class="wizard-step ${this._wizardStep>=4?'active':''}" id="ws-4">
          <div class="wizard-step-dot">4</div>
          <div class="wizard-step-lbl">Результат</div>
        </div>
      </div>

      <div id="wz-pane-1" class="wizard-pane ${this._wizardStep!==1?'hidden':''}">
        <div class="form-section">
          <div class="form-section-title">📅 Клиент и период</div>
          <div class="month-selector">
            <select class="form-select" id="ec">${cOpts}</select>
            <select class="form-select" id="em">${mOpts}</select>
            <select class="form-select" id="ey">${yOpts}</select>
            <button class="btn btn-secondary btn-sm" id="eload" title="Загрузить сохранённые данные">📂 Загрузить</button>
          </div>
          <div id="existing-note" class="hidden" style="margin-top:10px;padding:9px 14px;background:var(--yellow-soft);border:1px solid var(--yellow-border);border-radius:var(--radius-sm);font-size:12.5px;color:#92400e;">
            ⚠️ Данные за этот период уже есть — при сохранении перезапишутся.
          </div>
        </div>
        <div class="wizard-nav">
          <button class="btn btn-secondary btn-sm" onclick="App.navigate('dashboard')">← Назад</button>
          <div class="wizard-nav-spacer"></div>
          <button class="btn btn-primary" id="wz-next-1">Далее: сигналы →</button>
        </div>
      </div>

      <div id="wz-pane-2" class="wizard-pane hidden">
        <div class="score-preview" id="entry-preview">
          <div class="score-block"><span class="score-label">bCHS</span><span class="score-value" id="lv-bchs">—</span><span class="score-sub" id="lv-cat">нет данных</span></div>
          <div class="score-block"><span class="score-label">Лояльность</span><span class="score-value" id="lv-loy">—</span><span class="score-sub">0–100%</span></div>
          <div class="score-block"><span class="score-label">PC Score</span><span class="score-value" id="lv-pc">—</span><span class="score-sub" id="lv-load">—</span></div>
          <div class="score-block"><span class="score-label">Final Score</span><span class="score-value" id="lv-final">—</span><span class="score-sub" id="lv-health">—</span></div>
          <div class="score-block"><span class="score-label">⚖️ Потенциал реализован на</span><span class="score-value" id="lv-pot">—</span><span class="score-sub" id="lv-pot-ideal"></span></div>
        </div>
        ${this._signalHTML()}
        <div class="wizard-nav">
          <button class="btn btn-secondary btn-sm" id="wz-back-2">← Назад</button>
          <div class="wizard-nav-spacer"></div>
          <button class="btn btn-primary" id="wz-next-2">Далее: PC Score →</button>
        </div>
      </div>

      <div id="wz-pane-3" class="wizard-pane hidden">
        ${this._pcHTML()}
        <div class="wizard-nav">
          <button class="btn btn-secondary btn-sm" id="wz-back-3">← Назад</button>
          <div class="wizard-nav-spacer"></div>
          <button class="btn btn-primary" id="wz-next-3">Далее: итог →</button>
        </div>
      </div>

      <div id="wz-pane-4" class="wizard-pane hidden">
        <div class="form-section">
          <div class="form-section-title">✅ Итог и сохранение</div>
          <div class="score-preview" id="entry-preview-final">
            <div class="score-block"><span class="score-label">bCHS</span><span class="score-value" id="lv-bchs-f">—</span><span class="score-sub" id="lv-cat-f">нет данных</span></div>
            <div class="score-block"><span class="score-label">Лояльность</span><span class="score-value" id="lv-loy-f">—</span><span class="score-sub">0–100%</span></div>
            <div class="score-block"><span class="score-label">PC Score</span><span class="score-value" id="lv-pc-f">—</span><span class="score-sub" id="lv-load-f">—</span></div>
            <div class="score-block"><span class="score-label">Final Score</span><span class="score-value" id="lv-final-f">—</span><span class="score-sub" id="lv-health-f">—</span></div>
            <div class="score-block"><span class="score-label">⚖️ Потенциал реализован на</span><span class="score-value" id="lv-pot-f">—</span><span class="score-sub" id="lv-pot-ideal-f"></span></div>
          </div>
          <div id="wz-client-name" style="font-size:13px;color:var(--text-secondary);margin-bottom:12px"></div>
        </div>
        <div class="wizard-nav">
          <button class="btn btn-secondary btn-sm" id="wz-back-4">← Назад</button>
          <button class="btn btn-secondary btn-sm" id="ereset">↺ Сброс</button>
          <div class="wizard-nav-spacer"></div>
          <button class="btn btn-primary" id="esave">💾 Сохранить</button>
        </div>
      </div>
    `;

    document.getElementById('ep-bc').addEventListener('click', e => { e.preventDefault(); App.navigate('dashboard'); });
    document.querySelectorAll('.unfilled-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selClient = item.dataset.id;
        const sel = document.getElementById('ec');
        if (sel) sel.value = this.selClient;
        this.signals = {}; this.pc = {};
        this._tryRestoreAutosave();
        this._checkExisting();
        this._updatePreview();
        this._goWizardStep(1);
        App.toast(`Выбран: ${this.clients.find(c=>c.id===item.dataset.id)?.name||''}`, '');
      });
    });

    document.getElementById('ec').addEventListener('change', e => {
      this.selClient=e.target.value; this.signals={}; this.pc={};
      this._tryRestoreAutosave(); this._checkExisting(); this._updatePreview();
    });
    document.getElementById('em').addEventListener('change', e => { this.selMonth=+e.target.value; this._checkExisting(); });
    document.getElementById('ey').addEventListener('change', e => { this.selYear=+e.target.value; this._checkExisting(); });
    document.getElementById('eload').addEventListener('click', () => this._loadExisting());
    document.getElementById('wz-next-1').addEventListener('click', () => { this._checkExisting(); this._goWizardStep(2); });
    document.getElementById('wz-back-2').addEventListener('click', () => this._goWizardStep(1));
    document.getElementById('wz-next-2').addEventListener('click', () => this._goWizardStep(3));
    document.getElementById('wz-back-3').addEventListener('click', () => this._goWizardStep(2));
    document.getElementById('wz-next-3').addEventListener('click', () => { this._syncFinalPreview(); this._goWizardStep(4); });
    document.getElementById('wz-back-4').addEventListener('click', () => this._goWizardStep(3));
    document.getElementById('esave').addEventListener('click', () => this._save());
    document.getElementById('ereset').addEventListener('click', () => this._reset());

    document.querySelectorAll('.sig-cb').forEach(cb => {
      cb.addEventListener('change', e => {
        const k = e.target.dataset.key;
        this.signals[k] = e.target.checked;
        const item = document.getElementById(`si-${k}`);
        if (item) {
          item.classList.remove('checked-pos','checked-neg');
          if (e.target.checked) item.classList.add(SIGNALS[k].weight>0?'checked-pos':'checked-neg');
        }
        this._updatePreview();
        this._scheduleAutosave();
      });
    });

    document.querySelectorAll('.pc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.key, v = +btn.dataset.val;
        this.pc[k] = v;
        document.querySelectorAll(`.pc-btn[data-key="${k}"]`).forEach(b => b.classList.toggle('active', +b.dataset.val===v));
        const badge = document.getElementById(`pv-${k}`);
        if (badge) badge.textContent = v;
        this._updatePreview();
        this._scheduleAutosave();
      });
    });

    this._checkExisting();
    this._updatePreview();
    this._restoreSignalUI();
    this._restorePCUI();
  },

  _goWizardStep(n) {
    this._wizardStep = n;
    [1,2,3,4].forEach(i => {
      const pane = document.getElementById(`wz-pane-${i}`);
      if (pane) pane.classList.toggle('hidden', i!==n);
      const ws = document.getElementById(`ws-${i}`);
      if (ws) {
        ws.className = `wizard-step ${i<n?'done':i===n?'active':''}`;
        ws.querySelector('.wizard-step-dot').textContent = i<n?'✓':i;
      }
    });
    if (n===4) this._syncFinalPreview();
    window.scrollTo({top:0,behavior:'smooth'});
  },

  _scheduleAutosave() {
    clearTimeout(this._autosaveTimer);
    const ind = document.getElementById('autosave-ind');
    if (ind) { ind.textContent = '...'; ind.className = 'autosave-indicator saving'; }
    this._autosaveTimer = setTimeout(() => this._autosave(), 1200);
  },

  _restoreSignalUI() {
    for (const k of Object.keys(this.signals)) {
      if (!this.signals[k]) continue;
      const cb = document.querySelector(`.sig-cb[data-key="${k}"]`);
      if (cb) cb.checked = true;
      const item = document.getElementById(`si-${k}`);
      if (item) item.classList.add(SIGNALS[k]?.weight>0?'checked-pos':'checked-neg');
    }
  },
  _restorePCUI() {
    for (const [k,v] of Object.entries(this.pc)) {
      document.querySelectorAll(`.pc-btn[data-key="${k}"]`).forEach(b => b.classList.toggle('active', +b.dataset.val===v));
      const badge = document.getElementById(`pv-${k}`);
      if (badge) badge.textContent = v;
    }
  },

  _syncFinalPreview() {
    const c = this.clients.find(c => c.id===this.selClient);
    const nameEl = document.getElementById('wz-client-name');
    if (nameEl && c) nameEl.textContent = `Клиент: ${c.name} · Период: ${MONTHS_RU[this.selMonth-1]} ${this.selYear}`;
    const $ = id => document.getElementById(id);
    const sigs = {}; for (const k of Object.keys(SIGNALS)) sigs[k] = !!this.signals[k];
    const pcVals = {}; for (const k of Object.keys(PC_CRITERIA)) pcVals[k] = this.pc[k] || 1;
    const bchs    = Calc.computeBCHS(sigs);
    const loy     = Calc.loyaltyPct(bchs);
    const pcScore = Calc.computePC(pcVals);
    const final   = Calc.finalScore(bchs, pcScore);
    const health  = Calc.healthSignal(bchs);
    const load    = Calc.loadSignal(pcScore);
    const pot     = c ? Calc.potentialPct(pcScore, c.bcg_category) : null;
    const ideal   = c ? Calc.potentialIdeal(c.bcg_category) : 72;
    const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };
    set('lv-bchs-f',      bchs!==null?bchs:'—');
    set('lv-cat-f',       bchs!==null?Calc.bchsCategory(bchs).label:'нет данных');
    set('lv-loy-f',       loy!==null?loy+'%':'—');
    set('lv-pc-f',        pcScore!==null?pcScore.toFixed(1):'—');
    set('lv-load-f',      load.label);
    set('lv-final-f',     final!==null?final.toFixed(1):'—');
    set('lv-health-f',    health.label);
    set('lv-pot-f',       pot!==null?pot+'%':'—');
    set('lv-pot-ideal-f', `от идеала ${ideal}%`);
  },

  _signalHTML() {
    const SIGNAL_HINTS = {
      team_scope_request:   'Клиент сам инициирует расширение — сильный сигнал доверия',
      new_services_interest:'Интерес к расширению — точка для развития диалога',
      strategic_sessions:   'Самый весомый позитивный сигнал (+7): совместное стратегирование',
      contract_renewal:     'Продление — самый значимый сигнал лояльности (+24)',
      upsell:               'Апселл фиксирует реальный рост доверия (+16)',
      escalation:           'Эскалация до топ-менеджмента — критичный сигнал (-10)',
      churn:                'Отток: самый тяжёлый сигнал (-25). Используйте только при реальном уходе',
      exit_questions:       'Вопросы о расторжении — сигнал высокой тревожности (-8)',
      payment_delay_30plus: 'Задержка 30+ дней критична для отношений (-8)',
    };
    let h = '';
    for (const [gk, gd] of Object.entries(SIGNAL_GROUPS)) {
      const sigs = Object.entries(SIGNALS).filter(([,d]) => d.group===gk);
      h += `<div class="form-section"><div class="form-section-title">${gd.icon} ${gd.label}</div><div class="signals-group">`;
      for (const [k, d] of sigs) {
        const hint = SIGNAL_HINTS[k] || '';
        h += `<label class="signal-item" id="si-${k}">
          <input type="checkbox" class="sig-cb" data-key="${k}" ${this.signals[k]?'checked':''} />
          <span class="signal-label">${d.label}</span>
          <span class="signal-weight ${d.weight>0?'weight-pos':'weight-neg'}">${d.weight>0?'+':''}${d.weight}</span>
          ${hint ? `<span class="signal-hint">${hint}</span>` : ''}
        </label>`;
      }
      h += `</div></div>`;
    }
    return h;
  },

  _pcHTML() {
    let h = `<div class="form-section"><div class="form-section-title">📊 PC Score — Нагрузка</div><div class="pc-sliders">`;
    for (const [k, d] of Object.entries(PC_CRITERIA)) {
      h += `<div class="pc-item">
        <div class="pc-item-header">
          <span class="pc-label">${d.label}</span>
          <span class="pc-value-badge" id="pv-${k}">${this.pc[k]||'—'}</span>
        </div>
        <div class="pc-btn-group">
          ${[1,2,3,4,5].map(n=>`<button class="pc-btn${this.pc[k]===n?' active':''}" data-key="${k}" data-val="${n}">${n}</button>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${d.hint}</div>
      </div>`;
    }
    h += `</div></div>`;
    return h;
  },

  async _checkExisting() {
    if (!this.selClient) return;
    const [b,p] = await Promise.all([
      API.getBCHSEntry(this.selClient,this.selMonth,this.selYear),
      API.getPCEntry(this.selClient,this.selMonth,this.selYear),
    ]);
    const note = document.getElementById('existing-note');
    if (note) note.classList.toggle('hidden', !b && !p);
  },

  async _loadExisting() {
    if (!this.selClient) return;
    const [b,p] = await Promise.all([
      API.getBCHSEntry(this.selClient,this.selMonth,this.selYear),
      API.getPCEntry(this.selClient,this.selMonth,this.selYear),
    ]);
    let changed = false;
    if (b) {
      for (const k of Object.keys(SIGNALS)) {
        const v = !!b[k]; this.signals[k] = v;
        const cb = document.querySelector(`.sig-cb[data-key="${k}"]`);
        if (cb) cb.checked = v;
        const item = document.getElementById(`si-${k}`);
        if (item) { item.classList.remove('checked-pos','checked-neg'); if (v) item.classList.add(SIGNALS[k].weight>0?'checked-pos':'checked-neg'); }
      }
      changed = true;
    }
    if (p) {
      for (const k of Object.keys(PC_CRITERIA)) {
        const v = p[k]; if (v) {
          this.pc[k] = +v;
          document.querySelectorAll(`.pc-btn[data-key="${k}"]`).forEach(btn => btn.classList.toggle('active', +btn.dataset.val===+v));
          const badge = document.getElementById(`pv-${k}`); if (badge) badge.textContent = v;
        }
      }
      changed = true;
    }
    this._updatePreview();
    App.toast(changed ? 'Данные загружены' : 'Нет данных за этот период', changed ? 'success' : '');
  },

  _updatePreview() {
    const entry = {};
    for (const k of Object.keys(SIGNALS)) entry[k] = !!this.signals[k];
    const anyTrue = Object.values(entry).some(Boolean);
    const bchs    = anyTrue ? Calc.computeBCHS(entry) : null;
    const loy     = Calc.loyaltyPct(bchs);
    const cat     = Calc.bchsCategory(bchs);
    const pcEnt   = {};
    for (const k of Object.keys(PC_CRITERIA)) pcEnt[k] = this.pc[k] || null;
    const pcScore = Calc.computePC(pcEnt);
    const load    = Calc.loadSignal(pcScore);
    const final   = Calc.finalScore(bchs, pcScore);
    const health  = Calc.healthSignal(bchs);
    const $ = id => document.getElementById(id);
    if ($('lv-bchs')) {
      $('lv-bchs').textContent = bchs!==null ? bchs : '—';
      const col = bchs===null?'var(--text-muted)':bchs>=50?'var(--green)':bchs>=20?'#059669':bchs>=-19?'var(--text-primary)':bchs>=-49?'var(--yellow)':'var(--red)';
      $('lv-bchs').style.color = col;
    }
    if ($('lv-cat'))    $('lv-cat').textContent    = anyTrue ? cat.label : '—';
    if ($('lv-loy'))    $('lv-loy').textContent    = loy!==null ? `${loy}%` : '—';
    if ($('lv-pc'))     $('lv-pc').textContent     = pcScore!==null ? pcScore.toFixed(1) : '—';
    if ($('lv-load'))   $('lv-load').textContent   = load.label;
    if ($('lv-final'))  $('lv-final').textContent  = final!==null ? final.toFixed(1) : '—';
    if ($('lv-health')) $('lv-health').textContent = health.label;
    const selC = this.clients.find(c => c.id === this.selClient);
    const pot = selC ? Calc.potentialPct(pcScore, selC.bcg_category) : null;
    const ideal = selC ? Calc.potentialIdeal(selC.bcg_category) : 72;
    if ($('lv-pot')) { $('lv-pot').textContent = pot !== null ? pot + '%' : '—'; $('lv-pot').style.color = pot===null?'var(--text-muted)':pot>=90?'var(--green)':pot>=70?'#059669':pot>=50?'var(--yellow)':'var(--red)'; }
    if ($('lv-pot-ideal')) $('lv-pot-ideal').textContent = selC ? `от идеала ${ideal}%` : 'от идеала';
  },

  async _save() {
    if (!this.selClient) { App.toast('Выберите клиента','error'); this._goWizardStep(1); return; }
    const btn = document.getElementById('esave');
    if (btn) { btn.textContent = '⏳...'; btn.disabled = true; }
    try {
      const sigs = {}; for (const k of Object.keys(SIGNALS)) sigs[k] = !!this.signals[k];
      const pcData = {}; for (const k of Object.keys(PC_CRITERIA)) pcData[k] = this.pc[k] || 1;
      await Promise.all([
        API.saveBCHSEntry(this.selClient,this.selMonth,this.selYear,sigs),
        API.savePCEntry(this.selClient,this.selMonth,this.selYear,pcData),
      ]);
      API.clearCache();
      this._clearAutosave();
      App.toast('✅ Данные сохранены!','success');
      const preview = document.getElementById('entry-preview-final') || document.getElementById('entry-preview');
      if (preview) { preview.classList.add('save-flash'); setTimeout(()=>preview.classList.remove('save-flash'),700); }
      // ФИКС 3 — редирект на страницу Detail через 1500мс
      const savedClient = this.selClient;
      setTimeout(() => App.navigate('detail', savedClient), 1500);
    } catch(e) { App.toast('❌ Ошибка сохранения','error'); console.error(e); }
    finally { if (btn) { btn.textContent = '💾 Сохранить'; btn.disabled = false; } }
  },

  // ФИКС 2 — модал быстрого создания клиента прямо на странице Внести данные
  _openNewClientModal() {
    const sel = (field, opts, def='') => opts.map(o =>
      `<option value="${o}" ${o===def?'selected':''}>${o}</option>`).join('');
    App.openModal(`
      <div style="max-width:480px">
        <h3 style="margin:0 0 16px;font-size:15px">➕ Новый клиент</h3>
        <div class="form-group" style="margin-bottom:10px">
          <label class="form-label">Название *</label>
          <input class="form-input" id="ncm-name" placeholder="Название компании" />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div class="form-group" style="margin:0">
            <label class="form-label">Статус</label>
            <select class="form-select" id="ncm-status"><option value="Active" selected>Active</option><option value="Paused">Paused</option><option value="Self-managed">Self-managed</option></select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">MR (₽/мес)</label>
            <input class="form-input" id="ncm-mr" type="number" value="5000" min="0" />
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div class="form-group" style="margin:0">
            <label class="form-label">Тип</label>
            <select class="form-select" id="ncm-type"><option value="Direct" selected>Direct</option><option value="Partner">Partner</option><option value="Body-shop">Body-shop</option></select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Фаза</label>
            <select class="form-select" id="ncm-phase"><option value="Discovery">Discovery</option><option value="Ongoing" selected>Ongoing</option><option value="SLA">SLA</option><option value="Winding Down">Winding Down</option></select>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:14px">
          <label class="form-label">Ответственный</label>
          <input class="form-input" id="ncm-owner" placeholder="Имя менеджера" />
        </div>
        <div id="ncm-fb" style="font-size:12px;min-height:16px;margin-bottom:8px;color:var(--red)"></div>
        <button class="btn btn-primary" id="ncm-save" style="width:100%">💾 Создать клиента</button>
      </div>
    `);
    document.getElementById('ncm-save')?.addEventListener('click', async () => {
      const name = document.getElementById('ncm-name')?.value.trim();
      const fb   = document.getElementById('ncm-fb');
      const btn  = document.getElementById('ncm-save');
      if (!name) { if(fb) fb.textContent = '⚠️ Введите название'; return; }
      btn.disabled = true; btn.textContent = '⏳...';
      try {
        const data = {
          name,
          status:          document.getElementById('ncm-status')?.value || 'Active',
          monthly_revenue: parseFloat(document.getElementById('ncm-mr')?.value) || 0,
          client_type:     document.getElementById('ncm-type')?.value || 'Direct',
          phase:           document.getElementById('ncm-phase')?.value || 'Ongoing',
          sales_owner:     document.getElementById('ncm-owner')?.value.trim() || '',
          tech_value:'Standard', brand_value:'Recognizable', growth_potential:'Yes',
          managed_services_potential:'Partial', access_to_end_client:'N/A',
          decision_maker_level:'Tech Lead', contract_length:'Medium (3-6)',
          client_difficulty:'Normal', client_engagement:'Active',
          operational_difficulty:'Normal', team_maturity:'Standard',
        };
        const created = await API.createClient(data);
        App.toast(`✅ Клиент «${name}» создан`, 'success');
        App.closeModal();
        // Перезагрузить EntryPage и автовыбрать нового клиента
        await EntryPage.render(created?.id || null);
      } catch(e) {
        if(fb) fb.textContent = '❌ Ошибка: ' + e.message;
        btn.disabled = false; btn.textContent = '💾 Создать клиента';
      }
    });
  },

  _reset() {
    this.signals = {}; this.pc = {};
    this._clearAutosave();
    document.querySelectorAll('.sig-cb').forEach(cb => {
      cb.checked = false;
      const item = document.getElementById(`si-${cb.dataset.key}`);
      if (item) item.classList.remove('checked-pos','checked-neg');
    });
    document.querySelectorAll('.pc-btn').forEach(b => b.classList.remove('active'));
    Object.keys(PC_CRITERIA).forEach(k => { const el = document.getElementById(`pv-${k}`); if (el) el.textContent='—'; });
    this._updatePreview();
    App.toast('Форма сброшена','');
  },
};

/* ======== MONTE CARLO ENGINE ======== */
const MCEngine = {
  DEFAULTS: {
    drift:1.2,volatility:4.5,mean_reversion:0.15,equilibrium:50.0,
    p_strategic_meeting:0.35,impact_strategic_meeting:8.0,
    p_upsell:0.08,impact_upsell_mr:2500.0,
    p_fast_response:0.45,impact_fast_response:3.0,
    p_escalation:0.12,impact_escalation:-10.0,
    p_complaint:0.18,impact_complaint:-6.0,
    p_churn:0.025,p_mr_downgrade:0.06,impact_mr_downgrade:-1200.0,
    monthly_revenue:5000.0,
  },
  CATEGORIES:[
    {key:'champion',label:'🏆 Champion',min:70,color:'#059669'},
    {key:'promoter',label:'⭐ Promoter',min:50,color:'#10b981'},
    {key:'passive', label:'😐 Passive', min:30,color:'#6b7280'},
    {key:'at_risk', label:'⚠️ At Risk', min:15,color:'#f59e0b'},
    {key:'detractor',label:'🔴 Detractor',min:0.01,color:'#ef4444'},
    {key:'churned', label:'💀 Churned', min:-1,color:'#111827'},
  ],
  _randn(){let u,v;do{u=Math.random();}while(u===0);do{v=Math.random();}while(v===0);return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);},
  _classify(b,c){if(c)return'churned';if(b>=70)return'champion';if(b>=50)return'promoter';if(b>=30)return'passive';if(b>=15)return'at_risk';return'detractor';},
  _runBatch(N,months,iB,iM,cfg){
    const es=new Array(N);
    const paths=Array.from({length:months+1},()=>new Float32Array(N));
    for(let s=0;s<N;s++)paths[0][s]=iB;
    for(let s=0;s<N;s++){
      let b=iB,m=iM,ch=false;
      for(let mo=0;mo<months;mo++){
        if(ch){paths[mo+1][s]=0;continue;}
        let d=cfg.drift+cfg.mean_reversion*(cfg.equilibrium-b)+this._randn()*cfg.volatility;
        if(Math.random()<cfg.p_strategic_meeting)d+=cfg.impact_strategic_meeting;
        if(Math.random()<cfg.p_fast_response)d+=cfg.impact_fast_response;
        if(Math.random()<cfg.p_escalation)d+=cfg.impact_escalation;
        if(Math.random()<cfg.p_complaint)d+=cfg.impact_complaint;
        if(Math.random()<cfg.p_upsell)m+=cfg.impact_upsell_mr;
        if(Math.random()<cfg.p_mr_downgrade)m+=cfg.impact_mr_downgrade;
        if(Math.random()<cfg.p_churn){m=0;b=0;ch=true;paths[mo+1][s]=0;continue;}
        b=Math.max(0,Math.min(100,b+d));m=Math.max(0,m);paths[mo+1][s]=b;
      }
      es[s]={bchs:b,mr:m,churned:ch};
    }
    return{endStates:es,paths};
  },
  _pct(s,p){return s[Math.min(Math.floor(p/100*s.length),s.length-1)];},
  _summarise(es,iM){
    const N=es.length;
    const ba=es.map(s=>s.bchs).sort((a,b)=>a-b);
    const ma=es.map(s=>s.mr).sort((a,b)=>a-b);
    const cc=es.filter(s=>s.churned).length;
    const cats={champion:0,promoter:0,passive:0,at_risk:0,detractor:0,churned:0};
    for(const s of es)cats[this._classify(s.bchs,s.churned)]++;
    const cp={};for(const k of Object.keys(cats))cp[k]=Math.round(cats[k]/N*1000)/10;
    return{
      bchs:{p10:Math.round(this._pct(ba,10)*10)/10,p25:Math.round(this._pct(ba,25)*10)/10,median:Math.round(this._pct(ba,50)*10)/10,p75:Math.round(this._pct(ba,75)*10)/10,p90:Math.round(this._pct(ba,90)*10)/10,mean:Math.round(ba.reduce((a,b)=>a+b,0)/N*10)/10},
      mr:{p10:Math.round(this._pct(ma,10)),p25:Math.round(this._pct(ma,25)),median:Math.round(this._pct(ma,50)),p75:Math.round(this._pct(ma,75)),p90:Math.round(this._pct(ma,90)),mean:Math.round(ma.reduce((a,b)=>a+b,0)/N)},
      churn_rate:Math.round(cc/N*1000)/10,churn_count:cc,categories:cp,n:N,
    };
  },
  _fanPath(paths,off){
    return paths.map((col,m)=>{const s=Array.from(col).sort((a,b)=>a-b);return{month:off+m,p10:Math.round(this._pct(s,10)*10)/10,p25:Math.round(this._pct(s,25)*10)/10,median:Math.round(this._pct(s,50)*10)/10,p75:Math.round(this._pct(s,75)*10)/10,p90:Math.round(this._pct(s,90)*10)/10};});
  },
  run(rawBCHS,cfg){
    const N=5000,c=Object.assign({},this.DEFAULTS,cfg||{});
    const iB = rawBCHS != null ? Math.round((rawBCHS + 81) / 162 * 100 * 10) / 10 : 50;
    const iM=c.monthly_revenue||this.DEFAULTS.monthly_revenue;
    const r3=this._runBatch(N,3,iB,iM,c),s3=this._summarise(r3.endStates,iM),f3=this._fanPath(r3.paths,0);
    const r6=this._runBatch(N,3,s3.bchs.median,s3.mr.median,c),s6=this._summarise(r6.endStates,s3.mr.median),f6=this._fanPath(r6.paths,3);
    const r12=this._runBatch(N,6,s6.bchs.median,s6.mr.median,c),s12=this._summarise(r12.endStates,s6.mr.median),f12=this._fanPath(r12.paths,6);
    return{current_bchs_scaled:iB,current_mr:iM,n_scenarios:N,horizons:{'3m':s3,'6m':s6,'12m':s12},fan_chart:[...f3,...f6.slice(1),...f12.slice(1)]};
  },
};

const DetailPage = {
  client: null, computed: null, chart: null,

  async render(id) {
    document.getElementById('main-content').innerHTML =
      `<div style="padding:40px;text-align:center;color:var(--text-muted)">⏳ Загрузка клиента...</div>`;
    try {
      API.clearCache();
      const [client, allBCHS, allPC, fteEntries] = await Promise.all([
        API.getClient(id), API.getAllBCHS(), API.getAllPC(),
        window.FteAPI ? FteAPI.getByClient(id) : Promise.resolve([]),
      ]);
      if (!client) throw new Error('Клиент не найден');
      this.client   = client;
      this.computed = Calc.computeClient(client, allBCHS, allPC, fteEntries);
      this._draw();
    } catch(e) {
      console.error(e);
      document.getElementById('main-content').innerHTML =
        `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Ошибка загрузки</div><div class="empty-state-text">${e.message}</div></div>`;
    }
  },

  _draw() {
    const c = this.client, r = this.computed;
    const bcg = BCG_LABELS[c.bcg_category] || c.bcg_category || '—';
    const now = new Date(), cm = now.getMonth()+1, cy = now.getFullYear();
    const hKey = r.bchs !== null ? r.health.key : 'none';
    const m = document.getElementById('main-content');
    const declineAlert = this._checkDecline(r.monthly);
    const hasThisMonth = r.bchsHistory.some(e => +e.month===cm && +e.year===cy);

    m.innerHTML = `
      <nav class="breadcrumbs">
        <a class="breadcrumb-item" href="#" id="dbk-bc">◉ Дашборд</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current">${c.name}</span>
      </nav>
      <div class="detail-hero" data-health="${hKey}">
        <div class="detail-hero-top">
          <div>
            <div class="detail-hero-name">${c.name}</div>
            <div class="detail-badges" style="margin-top:6px">
              <span class="badge ${r.badge.cls}">${r.badge.label}</span>
              <span class="bcg-badge">${bcg}</span>
              <span class="bcg-badge">📌 ${c.status}</span>
              <span class="bcg-badge">${c.phase||'—'}</span>
            </div>
            <div class="detail-hero-meta" style="margin-top:6px">
              👤 ${c.sales_owner||'—'} · CSM: ${c.csm_assignment||'—'} · ${c.total_hours||0}ч/нед
            </div>
          </div>
          <div class="detail-hero-stats">
            <div class="metric-chip metric-chip--${r.bchs===null?'neutral':r.bchs>=20?'positive':r.bchs>=-10?'neutral':r.bchs>=-30?'warning':'danger'}">
              <span class="chip-status">${r.bchs===null?'➖':r.bchs>=20?'🟢 Healthy':r.bchs>=-10?'😐 Neutral':r.bchs>=-30?'⚠️ Caution':'🔴 At Risk'}</span>
              <span class="chip-dot">·</span>
              <span class="chip-value">${r.loyalty!==null?r.loyalty+'%':'—'}</span>
            </div>
            <div class="metric-chip metric-chip--${r.potential===null?'neutral':r.potential>=85?'positive':r.potential>=65?'warning':'danger'}">
              <span class="chip-status">${r.potential===null?'➖':r.potential>=85?'✅':r.potential>=65?'⚠️':'🚨'} потенциал</span>
              <span class="chip-dot">·</span>
              <span class="chip-value">${r.potential!==null?r.potential+'%':'—'}</span>
            </div>
            <div class="metric-chip metric-chip--${r.riskCls}">
              <span class="chip-status">${r.riskPct}% риск</span>
              <span class="chip-dot">·</span>
              <span class="chip-value">$${r.revenueAtRisk.toLocaleString('ru-RU')}</span>
            </div>
            <div class="metric-chip metric-chip--${r.trend?r.trend.cls==='trend-up'?'positive':r.trend.cls==='trend-down'?'danger':'neutral':'neutral'}">
              <span class="chip-status">${r.trend?r.trend.label:'—'}</span>
            </div>
          </div>
        </div>
        <div class="focus-box" style="margin-bottom:0">
          <div class="focus-box-label">◉ Фокус сейчас</div>
          <div class="focus-box-text">${r.focus}</div>
        </div>
      </div>
      ${declineAlert ? `<div class="decline-alert">📉 <strong>3+ месяца снижения:</strong> bCHS падает последовательно. Рекомендована экстренная встреча с ЛПР.</div>` : ''}
      ${!hasThisMonth ? `<div class="ctx-banner ctx-banner-warn">⚠️ <span>Данных за <strong>${MONTHS_RU[cm-1]} ${cy}</strong> нет</span><button class="btn btn-primary btn-sm ctx-banner-action" id="ctx-add-data">✎ Внести сейчас</button></div>` : ''}
      ${r.health.key === 'AtRisk' ? `<div class="ctx-banner ctx-banner-risk">🚨 <span>Клиент в зоне критического риска — Final Score ${r.final!==null?r.final.toFixed(0):'н/д'}/100</span></div>` : ''}
      ${r.monthly.length > 0 ? this._timelineHTML(r) : ''}
      <button class="inline-entry-toggle" id="detail-inline-toggle">✎ Внести данные прямо здесь <span style="margin-left:auto;font-size:10px;color:var(--text-muted)">без перехода</span></button>
      <div id="detail-inline-entry" class="hidden"></div>
      <div class="detail-tabs" id="detail-tabs">
        <button class="detail-tab active" data-tab="overview">📈 Обзор</button>
        <button class="detail-tab" data-tab="history">📋 История</button>
        <button class="detail-tab" data-tab="status-log">📝 Записи</button>
        <button class="detail-tab" data-tab="mc">🎲 MC</button>
      </div>
      <div id="tab-overview">
        <div class="overview-layout">
        <div class="overview-main">
        <div class="kpi-grid">
          ${this._kpi('ЗДОРОВЬЕ ОТНОШЕНИЙ',
            r.bchs!==null ? (r.bchs>=20?'🟢 Healthy':r.bchs>=-10?'😐 Neutral':r.bchs>=-30?'⚠️ Caution':'🔴 At Risk') : '—',
            '',
            r.bchs!==null ? (r.bchs>=20?'#10B981':r.bchs>=-10?'#F59E0B':r.bchs>=-30?'#F59E0B':'#EF4444') : '#6B7280'
          )}
          ${this._kpi('ЛОЯЛЬНОСТЬ',
            r.loyalty!==null ? r.loyalty+'%' : '—',
            '',
            r.loyalty===null?'#6B7280':r.loyalty>=60?'#10B981':r.loyalty>=40?'#F59E0B':'#EF4444'
          )}
          ${this._kpi('НАГРУЗКА НА КОМАНДУ',
            r.load.key!=='none' ? (r.load.key==='High'?'🔴 Высокая':r.load.key==='Med'?'🟡 Средняя':r.load.key==='Low'?'🟢 Низкая':'⚪ Минимум') : '—',
            '',
            r.load.key==='High'?'#EF4444':r.load.key==='Med'?'#F59E0B':r.load.key==='Low'?'#10B981':r.load.key==='Minimal'?'#6B7280':'#6B7280'
          )}
          ${this._kpi('РЕАЛИЗАЦИЯ ПОТЕНЦИАЛА',
            r.potential!==null ? r.potential+'%' : '—',
            '',
            r.potential===null?'#6B7280':r.potential>=85?'#10B981':r.potential>=65?'#F59E0B':'#EF4444'
          )}
          ${this._kpi('ДИНАМИКА (3М)',
            r.trend ? r.trend.label : '—',
            '',
            r.trend ? this._tcolor(r.trend.cls) : '#6B7280'
          )}
          ${this._kpiRisk(r)}
          ${this._kpiRPH(r)}
          ${this._kpi('💰 REVENUE EFF.',
            r.revenueEfficiency !== null ? Math.round(r.revenueEfficiency*100)+'%' : '—',
            r.revenueEfficiency !== null
              ? (r.revenueEfficiency>=0.95?'✅ Отлично':r.revenueEfficiency>=0.80?'⚠️ Внимание':'🔴 Критично')
              : 'нет FTE данных',
            r.revenueEfficiency !== null
              ? (r.revenueEfficiency>=0.95?'#10B981':r.revenueEfficiency>=0.80?'#F59E0B':'#EF4444')
              : '#6B7280'
          )}
        </div>
        <div class="chart-container">
          <div class="chart-title">История bCHS</div>
          <div style="height:200px;position:relative"><canvas id="lchart"></canvas></div>
          ${r.monthly.length===0?`<div class="empty-state-v2" style="padding:24px"><div class="es-art" style="font-size:36px">📭</div><div class="es-title" style="font-size:14px">Данных пока нет</div><div class="es-sub" style="font-size:12px">Внесите первую запись</div><div class="es-actions"><button class="btn btn-primary btn-sm" onclick="App.navigate('entry','${c.id}')">✎ Внести данные</button></div></div>`:''}
        </div>
        <div id="trk-my-time-block" class="trk-my-time-block">
          <div class="trk-my-time-inner">
            <span class="trk-my-time-icon">⏱</span>
            <span class="trk-my-time-text" id="trk-my-time-text">загрузка…</span>
            <button class="trk-my-time-btn" id="trk-my-time-link">Все записи →</button>
          </div>
        </div>
        </div>
        ${window.RoleRadar ? `<div class="overview-sidebar">${RoleRadar.render(c.id, r.curPCEntry)}</div>` : ''}
        </div>
      </div>
      <div id="tab-history" class="hidden">
        <div class="form-section"><div class="form-section-title">История по месяцам</div>${this._histTable()}</div>
      </div>
      <div id="tab-status-log" class="hidden">
        <div id="status-log-content">
          <div style="text-align:center;padding:20px;color:var(--text-muted)">⏳ Загрузка записей...</div>
        </div>
      </div>
      <div id="tab-mc" class="hidden"><div id="mc-tab-content"></div></div>
    `;

    document.getElementById('dbk-bc').addEventListener('click', e => { e.preventDefault(); App.navigate('dashboard'); });
    const ctxAdd = document.getElementById('ctx-add-data');
    if (ctxAdd) ctxAdd.addEventListener('click', () => App.navigate('entry', c.id));

    m.querySelectorAll('[data-action="dadd"]').forEach(b => b.addEventListener('click', () => App.navigate('entry', c.id)));
    document.querySelectorAll('[data-action="em"]').forEach(b =>
      b.addEventListener('click', () => App.navigateEntryMonthYear(c.id, +b.dataset.month, +b.dataset.year)));
    m.querySelectorAll('.timeline-node').forEach(node => {
      node.addEventListener('click', () => App.navigateEntryMonthYear(c.id, +node.dataset.month, +node.dataset.year));
    });

    const inlineToggle = document.getElementById('detail-inline-toggle');
    const inlineEntry  = document.getElementById('detail-inline-entry');
    if (inlineToggle && inlineEntry) {
      inlineToggle.addEventListener('click', () => {
        const open = !inlineEntry.classList.contains('hidden');
        if (open) {
          inlineEntry.classList.add('hidden');
          inlineToggle.textContent = '✎ Внести данные прямо здесь ';
        } else {
          inlineEntry.classList.remove('hidden');
          inlineEntry.innerHTML = `<div class="inline-entry-card">
            <div class="inline-entry-title">
              <span>✎ Быстрый ввод → <a href="#" onclick="App.navigate('entry','${c.id}');return false;" style="font-size:12px;color:var(--blue)">открыть полную форму</a></span>
              <button class="btn btn-secondary btn-sm" id="inline-close">✕</button>
            </div>
            <div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:10px">Для полного ввода используйте страницу «Внести данные»</div>
            <button class="btn btn-primary" onclick="App.navigate('entry','${c.id}')">→ Перейти к вводу данных</button>
          </div>`;
          document.getElementById('inline-close').addEventListener('click', () => {
            inlineEntry.classList.add('hidden');
            inlineEntry.innerHTML = '';
          });
        }
      });
    }

    const TABS = ['overview','history','status-log','mc'];
    document.querySelectorAll('.detail-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.detail-tab').forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
        TABS.forEach(t => { const p=document.getElementById(`tab-${t}`); if(p) p.classList.toggle('hidden',t!==tab); });
        if (tab==='mc') MCPage.mount(c, r.bchs);
        if (tab==='status-log') DetailPage._loadStatusLog();
        if (tab==='overview' && r.monthly.length>0) {
          if (this.chart) { try{this.chart.destroy();}catch(e){} this.chart=null; }
          this._drawChart();
        }
        if (tab==='overview' && window.RoleRadar) RoleRadar.bindEvents();
      });
    });
    if (r.monthly.length > 0) this._drawChart();
    if (window.RoleRadar) RoleRadar.bindEvents();
    this._loadMyTime(c.id);
  },

  async _loadMyTime(clientId) {
    const block = document.getElementById('trk-my-time-block');
    if (!block) return;
    // Показываем только для service_delivery и csm_analyst
    const role = localStorage.getItem('bchs_role') || '';
    if (!['service_delivery','csm_analyst'].includes(role)) { block.style.display='none'; return; }
    try {
      const all = await TrackerAPI.getAll();
      const ym  = new Date().toISOString().slice(0,7);
      const moRows  = all.filter(r => String(r.client_id)===String(clientId) && String(r.date||'').slice(0,7)===ym);
      const allRows = all.filter(r => String(r.client_id)===String(clientId));
      const moMin   = TrackerAPI.sumMinutes(moRows);
      const totMin  = TrackerAPI.sumMinutes(allRows);
      const txt = document.getElementById('trk-my-time-text');
      if (txt) txt.textContent = `Этот месяц: ${TrackerAPI.fmtHours(moMin)}ч  |  Всего: ${TrackerAPI.fmtHours(totMin)}ч`;
    } catch(e) {
      const txt = document.getElementById('trk-my-time-text');
      if (txt) txt.textContent = 'нет данных';
    }
    const btn = document.getElementById('trk-my-time-link');
    if (btn) {
      btn.addEventListener('click', () => App.navigate('tracker', clientId));
    }
  },

  async _loadStatusLog() {
    const container = document.getElementById('status-log-content');
    if (!container) return;
    try {
      const entries = await API.getStatusEntriesFor(this.client.id);
      if (!entries.length) {
        container.innerHTML = `
          <div style="text-align:center;padding:40px;color:var(--text-muted)">
            <div style="font-size:32px;margin-bottom:8px">📭</div>
            <div style="font-size:14px;font-weight:600;margin-bottom:4px">Нет записей статуса</div>
            <div style="font-size:12px">Нажмите «📝 Статус» в карточке клиента на дашборде</div>
          </div>`;
        return;
      }
      const sorted = [...entries].sort((a,b) => b.entry_date.localeCompare(a.entry_date));
      const rows = sorted.map(e => {
        const signals = (() => { try { return JSON.parse(e.signals_json || '{}'); } catch{ return {}; } })();
        const pc      = (() => { try { return JSON.parse(e.pc_json || '{}'); } catch{ return {}; } })();
        const activeSignals = Object.entries(signals).filter(([,v]) => v).map(([k]) => SIGNALS[k]?.label || k);
        const pcVals  = Object.values(pc).filter(v => v >= 1 && v <= 5);
        const pcAvg   = pcVals.length ? (pcVals.reduce((a,b)=>a+b,0) / pcVals.length).toFixed(1) : null;
        const d = new Date(e.entry_date);
        const dateLabel = d.toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' });
        return `
          <div style="padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius);
                      margin-bottom:10px;background:var(--surface)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:8px">
              <div style="font-size:13px;font-weight:600;color:var(--text-primary)">📅 ${dateLabel}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${activeSignals.length ? `<span style="font-size:11px;background:rgba(16,185,129,0.1);color:#059669;padding:2px 8px;border-radius:20px;border:1px solid rgba(16,185,129,0.2)">${activeSignals.length} сигналов</span>` : ''}
                ${pcAvg ? `<span style="font-size:11px;background:rgba(59,130,246,0.1);color:var(--blue);padding:2px 8px;border-radius:20px;border:1px solid rgba(59,130,246,0.2)">PC ${pcAvg}</span>` : ''}
              </div>
            </div>
            ${e.status_note ? `<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:8px">${e.status_note}</div>` : ''}
            ${activeSignals.length ? `
              <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
                <strong style="color:var(--text-secondary)">Сигналы:</strong> ${activeSignals.join(' · ')}
              </div>` : ''}
            <div style="display:flex;justify-content:flex-end;margin-top:8px">
              <button class="btn btn-danger btn-sm" data-del-id="${e.id}" style="font-size:11px;padding:3px 10px">✕ Удалить</button>
            </div>
          </div>`;
      }).join('');
      container.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="font-size:13px;font-weight:600">Всего записей: ${entries.length}</div>
          <button class="btn btn-primary btn-sm" id="status-log-add">+ Добавить запись</button>
        </div>
        ${rows}`;
      document.getElementById('status-log-add')?.addEventListener('click', () => {
        App.closeModal();
        DashboardPage.openStatusModal(this.client.id, this.client.name);
      });
      container.querySelectorAll('[data-del-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Удалить эту запись?')) return;
          await API.deleteStatusEntry(btn.dataset.delId);
          App.toast('Запись удалена', '');
          DetailPage._loadStatusLog();
        });
      });
    } catch(e) {
      console.error(e);
      container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--red)">❌ Ошибка загрузки записей</div>`;
    }
  },

  _checkDecline(monthly) {
    if (!monthly || monthly.length < 3) return false;
    const last3 = monthly.slice(-3).map(x => x.bchs);
    if (last3.some(v => v === null)) return false;
    return last3[0] > last3[1] && last3[1] > last3[2];
  },

  _timelineHTML(r) {
    const nodes = [...r.monthly].slice(-12);
    if (!nodes.length) return '';
    const dotCls = (h) => {
      if (!h) return 'timeline-dot-nodata';
      switch(h.key) {
        case 'Healthy': return 'timeline-dot-healthy';
        case 'Neutral': return 'timeline-dot-neutral';
        case 'Caution': return 'timeline-dot-caution';
        case 'AtRisk':  return 'timeline-dot-risk';
        default:        return 'timeline-dot-nodata';
      }
    };
    const items = nodes.map(pt => {
      const fs = Calc.finalScore(pt.bchs, null);
      const h  = pt.bchs !== null ? Calc.healthSignal(pt.bchs) : null;
      return `<div class="timeline-node" data-month="${pt.month}" data-year="${pt.year}" title="${MONTHS_SHORT[pt.month-1]} ${pt.year}: bCHS ${pt.bchs!==null?pt.bchs:'—'}">
        <div class="timeline-dot ${dotCls(h)}"></div>
        <div class="timeline-label">${MONTHS_SHORT[pt.month-1]}<br>${pt.year}</div>
        <div class="timeline-val">${pt.bchs!==null?pt.bchs:'—'}</div>
      </div>`;
    }).join('');
    return `<div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:6px">Таймлайн bCHS</div>
      <div class="timeline-scroll"><div class="timeline-track">${items}</div></div>
    </div>`;
  },

  _kpi(label, val, sub, color) {
    return `<div class="kpi-card">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value" style="color:${color||'var(--text-primary)'}">${val}</div>
      <div class="kpi-sub">${sub}</div>
    </div>`;
  },
  _bcolor(b) { return b>=50?'var(--green)':b>=20?'#059669':b>=-19?'var(--text-primary)':b>=-49?'var(--yellow)':'var(--red)'; },
  _tcolor(cls) { return cls==='trend-up'?'var(--green)':cls==='trend-down'?'var(--red)':'var(--text-muted)'; },

  // Карточка 6 — Риск выручки
  _kpiRisk(r) {
    if (r.isWD) {
      return `<div class="kpi-card">
        <div class="kpi-label">РИСК ВЫРУЧКИ</div>
        <div class="kpi-value" style="color:#6B7280">WD</div>
        <div class="kpi-sub" style="color:#6B7280">Winding Down</div>
      </div>`;
    }
    const color = r.riskColor;
    const sub   = `$${r.revenueAtRisk.toLocaleString('ru-RU')}`;
    return `<div class="kpi-card">
      <div class="kpi-label">РИСК ВЫРУЧКИ</div>
      <div class="kpi-value" style="color:${color}">${r.riskPct}%</div>
      <div class="kpi-sub">${sub}</div>
    </div>`;
  },

  // Карточка 7 — Стоимость часа
  _kpiRPH(r) {
    const color = r.rphColor;
    const val   = r.rphWD ? 'WD' : r.revenuePerHour !== null ? `$${r.revenuePerHour}/ч` : 'N/A';
    return `<div class="kpi-card">
      <div class="kpi-label">СТОИМОСТЬ ЧАСА</div>
      <div class="kpi-value" style="color:${color}">${val}</div>
      <div class="kpi-sub"></div>
    </div>`;
  },

  _histTable() {
    const r = this.computed;
    if (!r.bchsHistory.length) return `<div style="text-align:center;padding:20px;color:var(--text-muted)">Нет данных</div>`;
    const rows = [...r.bchsHistory].reverse().map(be => {
      const bchs = Calc.computeBCHS(be);
      const loy  = Calc.loyaltyPct(bchs);
      const pe   = r.pcHistory.find(p => +p.month===+be.month && +p.year===+be.year);
      const pc   = pe ? Calc.computePC(pe) : null;
      const fs   = Calc.finalScore(bchs, pc);
      const hlth = Calc.healthSignal(bchs);
      return `<tr>
        <td><strong>${MONTHS_SHORT[be.month-1]} ${be.year}</strong></td>
        <td><strong>${bchs!==null?bchs:'—'}</strong></td>
        <td>${loy!==null?loy+'%':'—'}</td>
        <td>${hlth.label}</td>
        <td>${pc!==null?pc.toFixed(1):'—'}</td>
        <td>${fs!==null?fs.toFixed(1):'—'}</td>
        <td><button class="btn btn-secondary btn-sm" data-action="em" data-month="${be.month}" data-year="${be.year}">✎</button></td>
      </tr>`;
    }).join('');
    return `<div style="overflow-x:auto"><table class="data-table">
      <thead><tr><th>Период</th><th>bCHS</th><th>Лояльность</th><th>Здоровье</th><th>PC</th><th>Final</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  },

  _drawChart() {
    const ctx = document.getElementById('lchart');
    if (!ctx || typeof Chart === 'undefined') return;
    if (this.chart) this.chart.destroy();
    const d = this.computed.monthly;
    const pts = d.map(x => {
      const v = x.bchs;
      if (v===null) return '#9ca3af';
      return v>=50?'#059669':v>=20?'#10b981':v>=-19?'#6b7280':v>=-49?'#f59e0b':'#ef4444';
    });
    this.chart = new Chart(ctx, {
      type:'line',
      data:{
        labels: d.map(x=>x.label),
        datasets:[
          {label:'bCHS',data:d.map(x=>x.bchs),borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,0.07)',borderWidth:2,pointBackgroundColor:pts,pointRadius:5,tension:0.3,fill:true,yAxisID:'y'},
          {label:'Лояльность %',data:d.map(x=>x.loyalty),borderColor:'#10b981',borderWidth:1.5,borderDash:[4,3],pointRadius:3,tension:0.3,yAxisID:'y2'},
        ],
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{legend:{labels:{font:{family:'Roboto',size:11},boxWidth:12}}},
        scales:{
          y:{position:'left',min:-89,max:81,grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{family:'Roboto',size:10}}},
          y2:{position:'right',min:0,max:100,grid:{drawOnChartArea:false},ticks:{font:{family:'Roboto',size:10},callback:v=>v+'%'}},
          x:{ticks:{font:{family:'Roboto',size:10}},grid:{display:false}},
        },
      },
    });
  },
};


/* ======== MONTE CARLO PAGE ======== */
const MCPage = {
  _cfgCache: {},

  async getConfig(cid) {
    if (this._cfgCache[cid]) return this._cfgCache[cid];
    try {
      const r = await fetch('tables/mc_configs?limit=500');
      if (!r.ok) return null;
      const j = await r.json();
      const rows = Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
      const found = rows.find(x => x.client_id === cid);
      if (found) this._cfgCache[cid] = found;
      return found || null;
    } catch(e) { return null; }
  },

  async saveConfig(cid, data) {
    delete this._cfgCache[cid];
    const existing = await this.getConfig(cid);
    const payload = { client_id: cid, ...data };
    ['id','gs_project_id','gs_table_name','created_at','updated_at'].forEach(k => delete payload[k]);
    try {
      if (existing) {
        const r = await fetch(`tables/mc_configs/${existing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const saved = await r.json(); this._cfgCache[cid] = saved; return saved;
      } else {
        const r = await fetch('tables/mc_configs', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const saved = await r.json(); this._cfgCache[cid] = saved; return saved;
      }
    } catch(e) { console.error('[MC]', e); return null; }
  },

  _aiKey()      { return localStorage.getItem('bchs_deepseek_key') || ''; },
  _saveAiKey(k) { localStorage.setItem('bchs_deepseek_key', k.trim()); },

  _aiComment: '',
  _aiRecommendation: '',
  _aiGapAnalysis: '',

  _buildPrompt(client, bchsHistory, pcHistory) {
    const name   = client.name             ?? 'Неизвестно';
    const mr     = client.monthly_revenue  ?? client.mr ?? 0;
    const bcg    = client.bcg_category     ?? '—';
    const kap    = client.key_account_priority ?? '—';
    const diff   = client.client_difficulty    ?? '—';
    const eng    = client.client_engagement    ?? '—';
    const phase  = client.phase                ?? '—';
    const ct     = client.contract_length      ?? '—';
    const type   = client.client_type          ?? '—';
    const tech   = client.tech_value           ?? '—';
    const brand  = client.brand_value          ?? '—';
    const growth = client.growth_potential     ?? '—';
    const ms     = client.managed_services_potential ?? '—';
    const dm     = client.decision_maker_level ?? '—';
    const mat    = client.team_maturity        ?? '—';
    const op     = client.operational_difficulty ?? '—';
    const strat  = client.strategic_value      ?? '—';
    const fin    = client.financial_value      ?? '—';
    const stab   = client.stability            ?? '—';
    const compl  = client.complexity           ?? '—';
    const pscore = client.priority_score       ?? '—';

    const finalScore = (client.final   != null) ? Number(client.final).toFixed(1)   : null;
    const pcScore    = (client.pcScore != null) ? Number(client.pcScore).toFixed(2) : null;
    const potential  = (client.potential != null) ? client.potential : null;

    const IDEAL_MAP = { 'KEY':74,'KEY_ALERT':74,'STABLE':78,'GROWTH':76,'GROWTH_EARLY':72,'TAIL':68 };
    const bcgKey   = String(bcg).replace(/[^A-Z_]/g,'');
    const idealVal = IDEAL_MAP[bcgKey] ?? 75;
    const gap      = finalScore != null ? (Number(finalScore) - idealVal).toFixed(1) : null;
    const gapText  = gap != null
      ? (Number(gap) >= 0 ? `✅ +${gap} пунктов ВЫШЕ идеала (${idealVal})` : `⚠️ ${gap} пунктов НИЖЕ идеала (${idealVal})`)
      : 'нет данных';

    const SIGNAL_WEIGHTS = {
      team_scope_request:+5,new_services:+3,strategic_sessions:+7,fast_responses:+2,events:+3,business_plans:+3,
      renewal:+24,upsell:+16,cross_sell:+13,praise:+5,
      slow_responses:-2,missed_meetings:-3,no_planning:-3,detailed_report:-2,scope_reduction:-4,
      competitor_mentions:-5,new_decision_maker:-3,exit_questions:-8,frequency_reduction:-2,
      no_growth_response:-2,complaint:-3,payment_delay_10_30:-4,specialist_replacement:-5,
      escalation:-10,payment_delay_30_plus:-8,churn:-25
    };
    const NEG_CRITICAL = ['exit_questions','escalation','churn','payment_delay_30_plus','specialist_replacement','competitor_mentions','scope_reduction'];
    const POS_KEY      = ['renewal','upsell','cross_sell','strategic_sessions','team_scope_request'];

    const last6 = [...(bchsHistory || [])]
      .sort((a,b) => new Date(a.period||a.month||0) - new Date(b.period||b.month||0))
      .slice(-6);

    const histLines = last6.map((e, i) => {
      const period = e.period || e.month || `Месяц ${i+1}`;
      const score  = e.bchs_score ?? e.score ?? 0;
      const activeCritical = NEG_CRITICAL.filter(k => e[k] === true || e[k] === 'True');
      const activePos      = POS_KEY.filter(k => e[k] === true || e[k] === 'True');
      const otherNeg       = Object.keys(SIGNAL_WEIGHTS).filter(k => SIGNAL_WEIGHTS[k] < 0 && !NEG_CRITICAL.includes(k) && (e[k] === true || e[k] === 'True'));
      const otherPos       = Object.keys(SIGNAL_WEIGHTS).filter(k => SIGNAL_WEIGHTS[k] > 0 && !POS_KEY.includes(k) && (e[k] === true || e[k] === 'True'));
      return [
        `  [${period}] Score=${score}`,
        activeCritical.length && `    🚨 КРИТИЧНЫЕ: ${activeCritical.map(k=>`${k}(${SIGNAL_WEIGHTS[k]})`).join(', ')}`,
        activePos.length      && `    ✅ КЛЮЧЕВЫЕ+: ${activePos.map(k=>`${k}(+${SIGNAL_WEIGHTS[k]})`).join(', ')}`,
        otherNeg.length       && `    ⚠️ Прочие−: ${otherNeg.join(', ')}`,
        otherPos.length       && `    ➕ Прочие+: ${otherPos.join(', ')}`,
      ].filter(Boolean).join('\n');
    }).join('\n');

    let trendText = 'нет данных — новый клиент', trendType = 'unknown';
    if (last6.length >= 2) {
      const scores = last6.map(e => e.bchs_score ?? e.score ?? 0);
      const deltas = scores.slice(1).map((v,i) => v - scores[i]);
      const avgD   = deltas.reduce((s,d)=>s+d,0) / deltas.length;
      const maxSwing = Math.max(...deltas.map(Math.abs));
      if      (avgD >  3) { trendType='rising';   trendText=`↗ Рост (avg Δ=${avgD.toFixed(1)}/мес)`; }
      else if (avgD < -3) { trendType='falling';  trendText=`↘ Падение (avg Δ=${avgD.toFixed(1)}/мес)`; }
      else if (maxSwing>10){ trendType='volatile'; trendText=`⚡ Волатильный (max swing=${maxSwing})`; }
      else                 { trendType='stable';   trendText=`→ Стабильный (avg Δ=${avgD.toFixed(1)})`; }
      trendText += ` | Баллы: [${scores.join(' → ')}]`;
    }

    const freqMap = {};
    if (last6.length > 0) {
      Object.keys(SIGNAL_WEIGHTS).forEach(k => {
        const cnt = last6.filter(e => e[k] === true || e[k] === 'True').length;
        if (cnt > 0) freqMap[k] = cnt;
      });
    }
    const freqLines = Object.entries(freqMap)
      .sort((a,b) => b[1]-a[1])
      .map(([k,v]) => {
        const w = SIGNAL_WEIGHTS[k];
        const icon = w > 0 ? '✅' : (NEG_CRITICAL.includes(k) ? '🚨' : '⚠️');
        return `    ${icon} ${k}: ${v}/${last6.length} мес (вес ${w>0?'+':''}${w})`;
      }).join('\n');

    const latestPC = pcHistory && pcHistory.length > 0
      ? [...pcHistory].sort((a,b)=>new Date(a.period||0)-new Date(b.period||0)).slice(-1)[0]
      : null;
    const pcDetailBlock = latestPC
      ? `PC Score детализация (последний период):
    Кол-во людей:      ${latestPC.people_count       ?? '?'}/5
    Сложность проекта: ${latestPC.project_complexity  ?? '?'}/5
    Репортинг:         ${latestPC.reporting            ?? '?'}/5
    Возможность риска: ${latestPC.risk_probability     ?? '?'}/5
    Последствия риска: ${latestPC.risk_consequences    ?? '?'}/5
    Лицо:              ${latestPC.face_role             ?? '?'}/5
    Эмоц. нагрузка:    ${latestPC.emotional_load        ?? '?'}/5
    → Итог PC Score:   ${pcScore ?? '—'}/5.0`
      : `PC Score: нет данных (критерии не заполнены)`;

    const newClientGuide = last6.length === 0 ? `
⚠️ НОВЫЙ КЛИЕНТ — история отсутствует.
Используй ТОЛЬКО профиль для подбора параметров.
Рекомендуемые диапазоны для нового клиента:
  • volatility: 5–7, drift: −0.5…+1.0, equilibrium: 45–60
  • p_churn: 0.02–0.05, p_escalation: 0.05–0.10
` : '';

    return `Ты — аналитик клиентского портфеля. Проведи пошаговый анализ клиента и верни ТОЛЬКО валидный JSON без markdown-обёртки.

═══════════════════════════════════════
ПРОФИЛЬ КЛИЕНТА: ${name}
═══════════════════════════════════════
Тип: ${type} | BCG: ${bcg} | Приоритет: ${kap} | MR: ${mr}
Financial: ${fin} | Strategic: ${strat} | Stability: ${stab} | Complexity: ${compl} | Score: ${pscore}
Контракт: ${ct} | Фаза: ${phase} | Сложность: ${diff} | Вовлечённость: ${eng}
Операц.сложность: ${op} | Зрелость: ${mat} | DM: ${dm} | MS: ${ms}
Tech: ${tech} | Brand: ${brand} | Growth: ${growth}

═══════════════════════════════════════
ЗДОРОВЬЕ И ПОТЕНЦИАЛ
═══════════════════════════════════════
Final Score: ${finalScore != null ? finalScore : 'нет данных'}
Идеал для ${bcg}: ${idealVal} | Разрыв: ${gapText}
% потенциала: ${potential != null ? potential + '% от идеала' : 'нет данных'}
${pcDetailBlock}

═══════════════════════════════════════
ИСТОРИЯ bCHS (последние ${last6.length} мес)
═══════════════════════════════════════
${last6.length > 0 ? histLines : 'История отсутствует — новый клиент.'}
Тренд: ${trendText}

ЧАСТОТА СИГНАЛОВ:
${freqLines || '  Нет активных сигналов'}
${newClientGuide}

Верни СТРОГО валидный JSON:
{
  "drift": <число -5..+5>,
  "volatility": <число 2..9>,
  "mean_reversion": <число 0.10..0.20>,
  "equilibrium": <число 0..100>,
  "monthly_revenue": ${mr},
  "p_strategic_meeting": <число 0..1>,
  "impact_strategic_meeting": <число 5..12>,
  "p_fast_response": <число 0..1>,
  "impact_fast_response": <число 2..5>,
  "p_upsell": <число 0..1>,
  "impact_upsell_mr": <число 500..5000>,
  "p_escalation": <число 0..1>,
  "impact_escalation": <число -20..-5>,
  "p_complaint": <число 0..1>,
  "impact_complaint": <число -12..-2>,
  "p_churn": <число 0..1>,
  "p_mr_downgrade": <число 0..1>,
  "impact_mr_downgrade": <число -3000..-200>,
  "gap_analysis": "<1 предложение>",
  "ai_comment": "<2–3 предложения>",
  "ai_recommendation": "<1–2 предложения>"
}`;
  },

  async _askAI() {
    const key = this._aiKey();
    if (!key) { alert('Введите DeepSeek API ключ и сохраните его'); return; }
    const btn = document.getElementById('mc-ai-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Анализирую...'; }
    try {
      const client = MCPage.client;
      if (!client) throw new Error('Клиент не задан');
      const [bchsHistory, pcHistory] = await Promise.all([
        API.getBCHSFor(client.id).catch(() => []),
        API.getPCFor(client.id).catch(() => [])
      ]);
      const allBCHS  = await API.getAllBCHS().catch(() => []);
      const allPC    = await API.getAllPC().catch(() => []);
      const computed = Calc.computeClient(client, allBCHS, allPC);
      const enriched = { ...client, ...computed };
      const prompt   = MCPage._buildPrompt(enriched, bchsHistory, pcHistory);
      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: 'deepseek-chat', temperature: 0.3, max_tokens: 1000,
          messages: [
            { role: 'system', content: 'Ты аналитик клиентского портфеля. Отвечай ТОЛЬКО валидным JSON без markdown-обёртки.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      if (!resp.ok) { const t = await resp.text().catch(() => resp.status); throw new Error(`DeepSeek API error ${resp.status}: ${t}`); }
      const data    = await resp.json();
      const content = data?.choices?.[0]?.message?.content ?? '';
      if (!content) throw new Error('DeepSeek вернул пустой ответ');
      let parsed;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch(e) { throw new Error('AI вернул невалидный JSON: ' + content.slice(0, 300)); }
      MCPage._aiComment        = parsed.ai_comment       ?? '';
      MCPage._aiRecommendation = parsed.ai_recommendation ?? '';
      MCPage._aiGapAnalysis    = parsed.gap_analysis      ?? '';
      delete parsed.ai_comment; delete parsed.ai_recommendation; delete parsed.gap_analysis;
      Object.assign(MCPage.cfg, parsed);
      MCPage._fillFormFromCfg();
      await MCPage._runAndRender();
      const toast = document.createElement('div');
      toast.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:#1a1a2e;color:#e0e0ff;padding:14px 20px;border-radius:10px;border-left:4px solid #7c6af7;font-size:13px;max-width:360px;box-shadow:0 4px 20px rgba(0,0,0,0.4);`;
      toast.innerHTML = `<div style="font-weight:600;margin-bottom:6px">🤖 AI параметры применены</div><div style="opacity:0.85;font-size:12px">${MCPage._aiComment.slice(0,120)}${MCPage._aiComment.length>120?'…':''}</div>`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    } catch(e) {
      console.error('[AI]', e);
      alert('Ошибка AI: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🤖 AI параметры'; }
    }
  },

  _renderAIComment() {
    const container = document.getElementById('mc-output');
    if (!container) return;
    const old = container.querySelector('.ai-analysis-block');
    if (old) old.remove();
    const comment   = MCPage._aiComment      ?? '';
    const recommend = MCPage._aiRecommendation ?? '';
    const gap       = MCPage._aiGapAnalysis   ?? '';
    if (!comment && !gap) return;
    const block = document.createElement('div');
    block.className = 'ai-analysis-block';
    block.style.cssText = `background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #7c6af7;border-radius:12px;padding:18px 20px;margin:16px 0;font-size:13px;color:#e0e0ff;`;
    block.innerHTML = `
      <div style="font-size:15px;font-weight:700;margin-bottom:12px;color:#a78bfa">🤖 AI Анализ</div>
      ${gap ? `<div style="background:rgba(124,106,247,0.12);border-radius:8px;padding:10px 14px;margin-bottom:12px;border-left:3px solid #f59e0b;"><span style="color:#fbbf24;font-weight:600;font-size:12px">📊 РАЗРЫВ С ИДЕАЛОМ</span><div style="margin-top:6px;opacity:0.9;line-height:1.5">${gap}</div></div>` : ''}
      ${comment ? `<div style="background:rgba(124,106,247,0.08);border-radius:8px;padding:10px 14px;margin-bottom:12px;"><span style="color:#a78bfa;font-weight:600;font-size:12px">💡 АНАЛИЗ</span><div style="margin-top:6px;opacity:0.9;line-height:1.5">${comment}</div></div>` : ''}
      ${recommend ? `<div style="background:rgba(16,185,129,0.10);border-radius:8px;padding:10px 14px;border-left:3px solid #10b981;"><span style="color:#34d399;font-weight:600;font-size:12px">🎯 РЕКОМЕНДАЦИЯ</span><div style="margin-top:6px;opacity:0.9;line-height:1.5">${recommend}</div></div>` : ''}
    `;
    container.insertBefore(block, container.firstChild);
  },

  _renderAIRecommendation(container, defaultCls, defaultIcon, defaultTitle, defaultText) {
    if (MCPage._aiRecommendation) {
      const rec = MCPage._aiRecommendation.toLowerCase();
      const cr  = MCPage.result?.horizons?.[MCPage.activeHorizon]?.churn_rate || 0;
      let cls, icon;
      if (cr > 20 || rec.includes('срочно') || rec.includes('критич') || rec.includes('немедленно')) { cls='mc-rec-red'; icon='🔴'; }
      else if (cr > 10 || rec.includes('риск') || rec.includes('осторожно') || rec.includes('внимани')) { cls='mc-rec-yellow'; icon='⚠️'; }
      else if (rec.includes('рост') || rec.includes('расширить') || rec.includes('развить') || rec.includes('потенциал') || rec.includes('партнёр')) { cls='mc-rec-green'; icon='🚀'; }
      else { cls='mc-rec-gray'; icon='📋'; }
      container.innerHTML += `<div class="mc-recommendation ${cls}"><div class="mc-rec-icon">${icon}</div><div class="mc-rec-body"><div class="mc-rec-title">🤖 Рекомендация AI · ${{ '3m':'3 мес','6m':'6 мес','12m':'12 мес' }[MCPage.activeHorizon]}</div><div class="mc-rec-text">${MCPage._aiRecommendation}</div></div></div>`;
    } else {
      container.innerHTML += `<div class="mc-recommendation ${defaultCls}"><div class="mc-rec-icon">${defaultIcon}</div><div class="mc-rec-body"><div class="mc-rec-title">${defaultTitle}</div><div class="mc-rec-text">${defaultText}</div></div></div>`;
    }
  },

  client: null, bchs_raw: null, cfg: null, result: null,
  activeHorizon: '3m', configOpen: false, fanChart: null,

  async mount(client, bchs_raw) {
    this.client   = client;
    this.bchs_raw = bchs_raw;
    this.result   = null;
    this.activeHorizon = '3m';
    this.configOpen    = false;
    this._aiComment        = '';
    this._aiRecommendation = '';
    this._aiGapAnalysis    = '';
    if (this.fanChart) { try { this.fanChart.destroy(); } catch(e) {} this.fanChart = null; }
    const container = document.getElementById('mc-tab-content');
    if (!container) return;
    const stored = await this.getConfig(client.id);
    this.cfg = Object.assign({}, MCEngine.DEFAULTS, { monthly_revenue: client.monthly_revenue || 5000 }, stored || {});
    this._renderShell(container);
    await this._runAndRender();
  },

  _renderShell(container) {
    container.innerHTML = `
      <div class="mc-header">
        <div>
          <div class="mc-title">🎲 Monte Carlo Прогноз</div>
          <div class="mc-subtitle">5 000 сценариев · 3М→6М→12М</div>
        </div>
        <div class="mc-header-actions">
          <button class="btn btn-primary btn-sm" id="mc-run">↻ Пересчитать</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-toggle">⚙ Параметры</button>
        </div>
      </div>
      <div class="mc-baseline">
        <span>bCHS: <strong id="mc-bl-bchs">—</strong></span>
        <span>MR: <strong id="mc-bl-mr">—</strong></span>
      </div>
      <div id="mc-config-panel" class="mc-config-panel hidden">${this._configPanelHTML()}</div>
      <div id="mc-results">
        <div class="mc-loading hidden" id="mc-loading"><div class="mc-spinner"></div><div class="mc-loading-text">5 000 сценариев...</div></div>
        <div id="mc-output" class="hidden"></div>
      </div>`;
    document.getElementById('mc-run').addEventListener('click', () => MCPage._runAndRender());
    document.getElementById('mc-cfg-toggle').addEventListener('click', () => MCPage._toggleConfig());
    const scaled = this.bchs_raw != null ? Math.round((this.bchs_raw + 81) / 162 * 100 * 10) / 10 : 50;
    const blB = document.getElementById('mc-bl-bchs');
    const blM = document.getElementById('mc-bl-mr');
    if (blB) blB.textContent = `${scaled}`;
    if (blM) blM.textContent = this._fmtMR(this.cfg.monthly_revenue);
  },

  _configPanelHTML() {
    const c = this.cfg;
    const f = (key, label, step, min, max) => `
      <div class="mc-cfg-field">
        <label class="mc-cfg-label">${label}</label>
        <input type="number" class="mc-cfg-input" id="mcc-${key}"
          value="${c[key] !== undefined ? c[key] : MCEngine.DEFAULTS[key]}"
          step="${step}" min="${min}" max="${max}"/>
      </div>`;
    const savedKey = this._aiKey();
    return `<div class="mc-config-inner">
      <div class="mc-config-title">⚙ Параметры</div>
      <div style="margin-bottom:14px;padding:10px 14px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:8px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:6px">🤖 DeepSeek AI</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input type="password" id="mc-ai-key-input" class="mc-cfg-input" style="flex:1;min-width:160px" placeholder="sk-..." value="${savedKey}" />
          <button class="btn btn-secondary btn-sm" id="mc-ai-key-save">💾 Ключ</button>
          <button class="btn btn-primary btn-sm"   id="mc-ai-btn">🤖 AI параметры</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Ключ из platform.deepseek.com · хранится только в браузере</div>
      </div>
      <div class="mc-config-grid">
        <div class="mc-config-col">
          <div class="mc-config-group-title">Динамика bCHS</div>
          ${f('drift','Дрейф','0.1','-10','10')}
          ${f('volatility','Волатильность (σ)','0.1','0','20')}
          ${f('mean_reversion','Возврат к норме','0.01','0','1')}
          ${f('equilibrium','Равновесие (0–100)','1','0','100')}
          ${f('monthly_revenue','MR ₽/мес','100','0','9999999')}
        </div>
        <div class="mc-config-col">
          <div class="mc-config-group-title">Вероятности событий</div>
          ${f('p_strategic_meeting','P(стратег. встреча)','0.01','0','1')}
          ${f('p_fast_response','P(быстрый ответ)','0.01','0','1')}
          ${f('p_upsell','P(апселл)','0.01','0','1')}
          ${f('p_escalation','P(эскалация)','0.01','0','1')}
          ${f('p_complaint','P(жалоба)','0.01','0','1')}
          ${f('p_churn','P(отток/мес)','0.005','0','0.5')}
        </div>
      </div>
      <div class="mc-config-actions">
        <button class="btn btn-primary btn-sm"   id="mc-cfg-save">💾 Сохранить</button>
        <button class="btn btn-secondary btn-sm" id="mc-cfg-reset">↺ Сброс</button>
        <button class="btn btn-secondary btn-sm" id="mc-cfg-close">✕</button>
      </div>
    </div>`;
  },

  _toggleConfig() {
    const p = document.getElementById('mc-config-panel');
    if (!p) return;
    MCPage.configOpen = !MCPage.configOpen;
    p.classList.toggle('hidden', !MCPage.configOpen);
    if (MCPage.configOpen) { MCPage._bindConfigEvents(); p.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
  },

  _bindConfigEvents() {
    const s = document.getElementById('mc-cfg-save');
    const r = document.getElementById('mc-cfg-reset');
    const cl = document.getElementById('mc-cfg-close');
    const aiBtn   = document.getElementById('mc-ai-btn');
    const aiKSave = document.getElementById('mc-ai-key-save');
    if (aiKSave && !aiKSave._b) {
      aiKSave._b = true;
      aiKSave.addEventListener('click', () => {
        const k = (document.getElementById('mc-ai-key-input')?.value || '').trim();
        if (!k) { App.toast('Введите ключ', 'error'); return; }
        MCPage._saveAiKey(k); App.toast('✅ Ключ сохранён', 'success');
      });
    }
    if (aiBtn && !aiBtn._b) {
      aiBtn._b = true;
      aiBtn.addEventListener('click', () => {
        const k = (document.getElementById('mc-ai-key-input')?.value || '').trim();
        if (k) MCPage._saveAiKey(k);
        MCPage._askAI(aiBtn);
      });
    }
    if (s && !s._b) {
      s._b = true;
      s.addEventListener('click', async () => {
        MCPage._readConfigFromForm();
        s.textContent = '⏳...'; s.disabled = true;
        await MCPage.saveConfig(MCPage.client.id, MCPage.cfg);
        s.textContent = '💾 Сохранить'; s.disabled = false;
        App.toast('✅ Параметры сохранены', 'success');
        await MCPage._runAndRender();
      });
    }
    if (r && !r._b) {
      r._b = true;
      r.addEventListener('click', () => {
        MCPage.cfg = Object.assign({}, MCEngine.DEFAULTS);
        MCPage._aiComment = ''; MCPage._aiRecommendation = ''; MCPage._aiGapAnalysis = '';
        const p = document.getElementById('mc-config-panel');
        if (p) { p.innerHTML = MCPage._configPanelHTML(); MCPage._bindConfigEvents(); }
        App.toast('Параметры сброшены', '');
      });
    }
    if (cl && !cl._b) {
      cl._b = true;
      cl.addEventListener('click', () => {
        MCPage.configOpen = false;
        const p = document.getElementById('mc-config-panel');
        if (p) p.classList.add('hidden');
      });
    }
  },

  _readConfigFromForm() {
    for (const k of Object.keys(MCEngine.DEFAULTS)) {
      const el = document.getElementById(`mcc-${k}`);
      if (el) MCPage.cfg[k] = parseFloat(el.value) || MCEngine.DEFAULTS[k];
    }
  },

  _fillFormFromCfg() {
    for (const k of Object.keys(MCEngine.DEFAULTS)) {
      const el = document.getElementById(`mcc-${k}`);
      if (el && MCPage.cfg[k] !== undefined) el.value = MCPage.cfg[k];
    }
  },

  async _runAndRender() {
    const ld  = document.getElementById('mc-loading');
    const out = document.getElementById('mc-output');
    if (ld)  ld.classList.remove('hidden');
    if (out) out.classList.add('hidden');
    await new Promise(r => setTimeout(r, 30));
    try {
      MCPage.result = MCEngine.run(MCPage.bchs_raw, MCPage.cfg);
      if (ld)  ld.classList.add('hidden');
      if (out) { out.classList.remove('hidden'); MCPage._renderOutput(out); }
    } catch(e) {
      console.error('[MC]', e);
      if (ld)  ld.classList.add('hidden');
      if (out) { out.classList.remove('hidden'); out.innerHTML = `<div class="empty-state"><div>⚠️ ${e.message}</div></div>`; }
    }
  },

  _renderOutput(container) {
    const res = MCPage.result;
    container.innerHTML = `
      <div class="mc-horizons" id="mc-horizons">
        ${MCPage._horizonCard('3m',  res.horizons['3m'])}
        ${MCPage._horizonCard('6m',  res.horizons['6m'])}
        ${MCPage._horizonCard('12m', res.horizons['12m'])}
      </div>
      <div class="mc-chart-container">
        <div class="mc-chart-title">Веер прогнозов bCHS</div>
        <div style="height:220px;position:relative"><canvas id="mc-fan-chart"></canvas></div>
      </div>
      <div id="mc-horizon-detail"></div>`;
    MCPage._bindHorizonCards();
    MCPage._drawFanChart();
    MCPage._renderHorizonDetail();
    MCPage._renderAIComment();
  },

  _horizonCard(key, stats) {
    const labels = { '3m':'3М', '6m':'6М', '12m':'12М' };
    const active = key === MCPage.activeHorizon;
    const cr     = stats.churn_rate;
    const crCls  = cr < 7 ? 'mc-churn-green' : cr < 15 ? 'mc-churn-yellow' : 'mc-churn-red';
    return `<div class="mc-horizon-card${active ? ' mc-horizon-active' : ''}" data-horizon="${key}">
      <div class="mc-horizon-label">${labels[key]}</div>
      <div class="mc-horizon-bchs">${stats.bchs.median.toFixed(1)}</div>
      <div class="mc-horizon-meta">bCHS медиана</div>
      <div class="mc-horizon-mr">${MCPage._fmtMR(stats.mr.median)}</div>
      <div class="mc-horizon-meta">MR медиана</div>
      <div class="mc-churn-badge ${crCls}">${cr.toFixed(1)}% отток</div>
    </div>`;
  },

  _bindHorizonCards() {
    document.querySelectorAll('.mc-horizon-card').forEach(card => {
      card.addEventListener('click', () => {
        MCPage.activeHorizon = card.dataset.horizon;
        document.querySelectorAll('.mc-horizon-card').forEach(c =>
          c.classList.toggle('mc-horizon-active', c.dataset.horizon === MCPage.activeHorizon));
        MCPage._renderHorizonDetail();
        MCPage._renderAIComment();
      });
    });
  },

  _drawFanChart() {
    const ctx = document.getElementById('mc-fan-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    if (MCPage.fanChart) { try { MCPage.fanChart.destroy(); } catch(e) {} MCPage.fanChart = null; }
    const fan    = MCPage.result.fan_chart;
    const kp     = fan.filter(p => [0, 3, 6, 12].includes(p.month));
    const labels = kp.map(p => p.month === 0 ? 'Старт' : `${p.month}М`);
    const mk     = k => kp.map(p => p[k]);
    MCPage.fanChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [
        { label:'P90',     data:mk('p90'),    borderColor:'rgba(59,130,246,0.4)', borderWidth:1,   borderDash:[3,3], pointRadius:0, fill:'+1', backgroundColor:'rgba(59,130,246,0.06)', tension:0.4 },
        { label:'P75',     data:mk('p75'),    borderColor:'rgba(59,130,246,0.3)', borderWidth:0,   pointRadius:0,   fill:'+1', backgroundColor:'rgba(59,130,246,0.10)', tension:0.4 },
        { label:'Медиана', data:mk('median'), borderColor:'#3b82f6',              borderWidth:2.5, pointBackgroundColor:'#3b82f6', pointRadius:5, fill:'+1', backgroundColor:'rgba(59,130,246,0.10)', tension:0.4 },
        { label:'P25',     data:mk('p25'),    borderColor:'rgba(59,130,246,0.3)', borderWidth:0,   pointRadius:0,   fill:'+1', backgroundColor:'rgba(59,130,246,0.06)', tension:0.4 },
        { label:'P10',     data:mk('p10'),    borderColor:'rgba(59,130,246,0.4)', borderWidth:1,   borderDash:[3,3], pointRadius:0, fill:false, tension:0.4 },
        { label:'Текущий', data:[MCPage.result.current_bchs_scaled,null,null,null], borderColor:'#f59e0b', backgroundColor:'#f59e0b', pointRadius:[7,0,0,0], pointStyle:'star', borderWidth:0, fill:false },
      ]},
      options: {
        responsive:true, maintainAspectRatio:false,
        interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ display:false } },
        scales:{
          y:{ min:0, max:100, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ font:{ family:'Inter', size:10 } } },
          x:{ grid:{ display:false }, ticks:{ font:{ family:'Inter', size:11 } } },
        },
      },
    });
  },

  _renderHorizonDetail() {
    const container = document.getElementById('mc-horizon-detail');
    if (!container) return;
    const stats = MCPage.result.horizons[MCPage.activeHorizon];
    const hL    = { '3m':'3 мес', '6m':'6 мес', '12m':'12 мес' };
    const cr    = stats.churn_rate;
    const cats  = stats.categories;
    const pos   = (cats.champion || 0) + (cats.promoter || 0);
    const neg   = (cats.at_risk  || 0) + (cats.detractor || 0) + (cats.churned || 0);
    let cls, icon, title, text;
    if (cr > 20)       { cls='mc-rec-red';    icon='🔴'; title='Критический риск оттока';     text=`${cr.toFixed(1)}% симуляций — отток. Нужно немедленное вмешательство.`; }
    else if (cr > 10)  { cls='mc-rec-yellow'; icon='⚠️'; title='Повышенный риск';             text=`${cr.toFixed(1)}% — отток. Усилить ритм касаний, провести QBR.`; }
    else if (pos > 50) { cls='mc-rec-green';  icon='🚀'; title='Потенциал роста подтверждён'; text=`${pos.toFixed(1)}% сценариев — Champion/Promoter. Расширять партнёрство.`; }
    else if (neg > 40) { cls='mc-rec-yellow'; icon='📋'; title='Нестабильная зона';           text=`${neg.toFixed(1)}% — At Risk/Detractor. Разработать план восстановления.`; }
    else               { cls='mc-rec-gray';   icon='😐'; title='Нейтральный прогноз';         text='Держать текущий ритм, отслеживать bCHS ежемесячно.'; }
    const b  = stats.bchs;
    const mr = stats.mr;
    const pct    = Math.min(cr / 50 * 100, 100);
    const radius = 38, cx = 50, cy = 50;
    const circ   = 2 * Math.PI * radius;
    const off    = circ * (1 - pct / 100);
    const col    = cr < 7 ? '#10b981' : cr < 15 ? '#f59e0b' : '#ef4444';
    container.innerHTML = `
      <div class="mc-stats-grid">
        <div class="mc-stats-card">
          <div class="mc-stats-card-title">📊 bCHS прогноз (0–100)</div>
          <table class="mc-pct-table">
            <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${b.p10.toFixed(1)}</td></tr>
            <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${b.p25.toFixed(1)}</td></tr>
            <tr class="mc-pct-highlight"><td class="mc-pct-label">Медиана</td><td class="mc-pct-val"><strong>${b.median.toFixed(1)}</strong></td></tr>
            <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${b.p75.toFixed(1)}</td></tr>
            <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${b.p90.toFixed(1)}</td></tr>
          </table>
        </div>
        <div class="mc-stats-card">
          <div class="mc-stats-card-title">💰 MR прогноз</div>
          <table class="mc-pct-table">
            <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${MCPage._fmtMR(mr.p10)}</td></tr>
            <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${MCPage._fmtMR(mr.p25)}</td></tr>
            <tr class="mc-pct-highlight"><td class="mc-pct-label">Медиана</td><td class="mc-pct-val"><strong>${MCPage._fmtMR(mr.median)}</strong></td></tr>
            <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${MCPage._fmtMR(mr.p75)}</td></tr>
            <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${MCPage._fmtMR(mr.p90)}</td></tr>
          </table>
        </div>
        <div class="mc-stats-card">
          <div class="mc-stats-card-title">⚡ Риск оттока</div>
          <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0;gap:6px">
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="var(--border)" stroke-width="8"/>
              <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${col}" stroke-width="8"
                stroke-dasharray="${circ}" stroke-dashoffset="${off}"
                stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
              <text x="${cx}" y="${cy+2}" text-anchor="middle" dominant-baseline="middle"
                font-size="16" font-weight="700" fill="${col}" font-family="Inter">${cr.toFixed(1)}%</text>
            </svg>
            <div style="font-size:11px;color:var(--text-muted);text-align:center">${stats.churn_count.toLocaleString('ru-RU')} из ${stats.n.toLocaleString('ru-RU')}</div>
          </div>
        </div>
      </div>
      <div class="mc-section">
        <div class="mc-section-title">Распределение · ${hL[MCPage.activeHorizon]}</div>
        <div class="mc-categories">
          ${MCEngine.CATEGORIES.map(cat => {
            const pct = stats.categories[cat.key] || 0;
            const cnt = Math.round(pct / 100 * stats.n);
            const w   = Math.max(pct, 0.3);
            return `<div class="mc-cat-row">
              <div class="mc-cat-name">${cat.label}</div>
              <div class="mc-cat-bar-wrap"><div class="mc-cat-bar" style="width:${w}%;background:${cat.color}"></div></div>
              <div class="mc-cat-pct">${pct.toFixed(1)}%</div>
              <div class="mc-cat-cnt">${cnt.toLocaleString('ru-RU')}</div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    MCPage._renderAIRecommendation(container, cls, icon, title, text);
  },

  _fmtMR(v) {
    if (v === null || v === undefined) return '—';
    if (Math.abs(v) >= 1e6)  return (v / 1e6).toFixed(2) + ' М';
    if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1) + ' К';
    return Math.round(v).toLocaleString('ru-RU');
  },
};

/* ======== PORTFOLIO PAGE ======== */
const PortfolioPage = {
  _activeTab: 'portfolio',
  _portfolioData: { short: null, mid: null, long: null },
  _accountStrategies: [],
  _mcCache: {},

  _coverageFilters: { region: '', am: '', status: '', search: '' },

  async render() {
    document.getElementById('main-content').innerHTML = `
      <div class="page-header">
        <div class="page-title">🗂️ Управление портфелем</div>
        <div class="page-subtitle">Стратегия на трёх горизонтах · Аккаунт-планы · Покрытие</div>
      </div>
      <div class="detail-tabs" id="pf-tabs" style="margin-bottom:0">
        <button class="detail-tab active" data-pftab="portfolio">📊 Стратегия портфеля</button>
        <button class="detail-tab" data-pftab="accounts">👤 Стратегия по аккаунтам</button>
        <button class="detail-tab" data-pftab="coverage">🗺 Покрытие</button>
      </div>
      <div id="pf-tab-portfolio"></div>
      <div id="pf-tab-accounts" class="hidden"></div>
      <div id="pf-tab-coverage" class="hidden"></div>
    `;
    document.querySelectorAll('[data-pftab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.pftab;
        this._activeTab = tab;
        document.querySelectorAll('[data-pftab]').forEach(b => b.classList.toggle('active', b.dataset.pftab === tab));
        document.getElementById('pf-tab-portfolio').classList.toggle('hidden', tab !== 'portfolio');
        document.getElementById('pf-tab-accounts').classList.toggle('hidden', tab !== 'accounts');
        document.getElementById('pf-tab-coverage').classList.toggle('hidden', tab !== 'coverage');
        if (tab === 'accounts') this._renderAccountsTab();
        if (tab === 'coverage') this._renderCoverageTab();
      });
    });
    await this._renderPortfolioTab();
  },

  /* ─────────────── ТАБ 1 — СТРАТЕГИЯ ПОРТФЕЛЯ ─────────────── */
  async _renderPortfolioTab() {
    const el = document.getElementById('pf-tab-portfolio');
    el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted)">⏳ Загрузка...</div>`;
    try {
      const [clients, allBCHS, allPC, savedStrats] = await Promise.all([
        API.getClients(), API.getAllBCHS(), API.getAllPC(), API.getPortfolioStrategies()
      ]);
      const computed = clients.map(c => ({ client: c, ...Calc.computeClient(c, allBCHS, allPC) }));
      const summary  = this._buildSummary(computed);
      this._portfolioData = { short: null, mid: null, long: null };
      savedStrats.forEach(s => {
        if (s.horizon === 'short') this._portfolioData.short = s;
        if (s.horizon === 'mid')   this._portfolioData.mid   = s;
        if (s.horizon === 'long')  this._portfolioData.long  = s;
      });

      el.innerHTML = `
        ${this._summaryHTML(summary, computed)}
        <div class="form-section" style="margin-top:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px">
            <div class="form-section-title" style="margin:0">Стратегические горизонты</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-primary btn-sm" id="pf-save-btn">💾 Сохранить всё</button>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">
            ${this._horizonFormHTML('short', '🔴 Краткосрочная', '1 месяц',         this._portfolioData.short)}
            ${this._horizonFormHTML('mid',   '🟡 Среднесрочная', '1–2 квартала',    this._portfolioData.mid)}
            ${this._horizonFormHTML('long',  '🟢 Долгосрочная',  '4 квартала',      this._portfolioData.long)}
          </div>
        </div>
      `;

      document.getElementById('pf-save-btn').addEventListener('click', () => this._savePortfolioStrats());
      // ФИКС 7а — per-horizon AI listeners
      ['short','mid','long'].forEach(key => {
        document.getElementById(`pf-ai-btn-${key}`)?.addEventListener('click', () => this._aiHorizon(key, summary));
      });
    } catch(e) {
      console.error(e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--md-red)">❌ Ошибка: ${e.message}</div>`;
    }
  },

  _buildSummary(computed) {
    const total = computed.length;
    // ФИКС 5 — считаем среднюю лояльность по портфелю
    const withLoyalty = computed.filter(r => r.loyalty !== null);
    const avgLoyalty = withLoyalty.length
      ? Math.round(withLoyalty.reduce((s, r) => s + r.loyalty, 0) / withLoyalty.length)
      : null;
    const withBCHS = computed.filter(r => r.bchs !== null);
    const avgBchs = withBCHS.length
      ? Math.round(withBCHS.reduce((s, r) => s + r.bchs, 0) / withBCHS.length)
      : null;
    const totalRisk = computed.reduce((s, r) => s + (r.revenueAtRisk || 0), 0);
    const bcgCount = { KEY: 0, STABLE: 0, GROWTH: 0, GROWTH_EARLY: 0, TAIL: 0 };
    computed.forEach(r => {
      const k = r.client.bcg_category;
      if (k in bcgCount) bcgCount[k]++;
    });
    const top3Risk = [...computed]
      .filter(r => r.revenueAtRisk > 0)
      .sort((a, b) => b.revenueAtRisk - a.revenueAtRisk)
      .slice(0, 3)
      .map(r => ({ name: r.client.name, risk: r.revenueAtRisk, pct: r.riskPct }));
    const withPotential = computed.filter(r => r.potential !== null);
    const avgPotential = withPotential.length
      ? Math.round(withPotential.reduce((s, r) => s + r.potential, 0) / withPotential.length)
      : null;
    return { total, avgBchs, avgLoyalty, totalRisk, bcgCount, top3Risk, avgPotential };
  },

  _summaryHTML(s, computed) {
    // ФИКС 5 — цвет лояльности
    const loyaltyColor = s.avgLoyalty === null ? '#6B7280'
      : s.avgLoyalty >= 70 ? '#10B981' : s.avgLoyalty >= 50 ? '#F59E0B' : '#EF4444';
    const bchsColor = s.avgBchs === null ? '#6B7280'
      : s.avgBchs >= 20 ? '#10B981' : s.avgBchs >= -10 ? '#F59E0B' : '#EF4444';
    const potColor = s.avgPotential === null ? '#6B7280'
      : s.avgPotential >= 85 ? '#10B981' : s.avgPotential >= 65 ? '#F59E0B' : '#EF4444';
    const riskColor = s.totalRisk === 0 ? '#10B981'
      : s.totalRisk > 50000 ? '#EF4444' : '#F59E0B';
    const top3html = s.top3Risk.length
      ? s.top3Risk.map(r => `<div style="font-size:11px;display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid var(--border)"><span style="color:var(--text-primary);font-weight:500">${r.name}</span><span style="color:#EF4444;font-weight:600">$${r.risk.toLocaleString('ru-RU')} · ${r.pct}%</span></div>`).join('')
      : '<div style="font-size:11px;color:var(--text-muted)">Нет рисков</div>';
    return `
      <div class="form-section">
        <div class="form-section-title">📊 Аналитическая сводка портфеля</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">
          <div class="kpi-card"><div class="kpi-label">ВСЕГО КЛИЕНТОВ</div><div class="kpi-value">${s.total}</div></div>
          <!-- ФИКС 5 — ЛОЯЛЬНОСТЬ вместо СРЕДНИЙ bCHS -->
          <div class="kpi-card"><div class="kpi-label">ЛОЯЛЬНОСТЬ</div><div class="kpi-value" style="color:${loyaltyColor}">${s.avgLoyalty !== null ? s.avgLoyalty + '%' : '—'}</div></div>
          <div class="kpi-card"><div class="kpi-label">REVENUE AT RISK</div><div class="kpi-value" style="color:${riskColor}">$${s.totalRisk.toLocaleString('ru-RU')}</div></div>
          <div class="kpi-card"><div class="kpi-label">РЕАЛИЗАЦИЯ</div><div class="kpi-value" style="color:${potColor}">${s.avgPotential !== null ? s.avgPotential + '%' : '—'}</div></div>
          <div class="kpi-card">
            <div class="kpi-label">BCG РАСПРЕДЕЛЕНИЕ</div>
            <div style="font-size:11px;line-height:1.7;margin-top:4px">
              <div>⭐ KEY: <strong>${s.bcgCount.KEY}</strong></div>
              <div>🐄 STABLE: <strong>${s.bcgCount.STABLE}</strong></div>
              <div>💎 GROWTH: <strong>${s.bcgCount.GROWTH}</strong></div>
              <div>🌱 GROWTH Early: <strong>${s.bcgCount.GROWTH_EARLY}</strong></div>
              <div>📦 TAIL: <strong>${s.bcgCount.TAIL}</strong></div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">ТОП-3 РИСКА</div>
            <div style="margin-top:6px">${top3html}</div>
          </div>
        </div>
      </div>`;
  },

  _horizonFormHTML(key, label, period, saved) {
    const v = f => saved ? (saved[f] || '') : '';
    return `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div style="font-size:13px;font-weight:700">${label} <span style="font-size:11px;color:var(--text-muted);font-weight:400">${period}</span></div>
          <button id="pf-ai-btn-${key}" class="btn btn-secondary btn-sm" style="padding:3px 8px;font-size:13px;line-height:1" title="🤖 AI стратегия для этого горизонта">🤖</button>
        </div>
        <div class="form-group" style="margin-bottom:8px">
          <label class="form-label">Название</label>
          <input class="form-input" id="pf-${key}-title" value="${v('title')}" placeholder="Например: Операционная чистота" />
        </div>
        <div class="form-group" style="margin-bottom:8px">
          <label class="form-label">Цель</label>
          <textarea class="form-textarea" id="pf-${key}-goal" style="min-height:72px" placeholder="Что хотим достичь...">${v('goal')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:8px">
          <label class="form-label">Действия</label>
          <textarea class="form-textarea" id="pf-${key}-actions" style="min-height:72px" placeholder="Конкретные шаги...">${v('actions')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:8px">
          <label class="form-label">Метрика успеха</label>
          <input class="form-input" id="pf-${key}-metric" value="${v('success_metric')}" placeholder="Как измерим результат" />
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Дедлайн</label>
          <input class="form-input" type="date" id="pf-${key}-deadline" value="${v('deadline')}" />
        </div>
      </div>`;
  },

  _readHorizon(key) {
    const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    return {
      title:          g(`pf-${key}-title`),
      goal:           g(`pf-${key}-goal`),
      actions:        g(`pf-${key}-actions`),
      success_metric: g(`pf-${key}-metric`),
      deadline:       g(`pf-${key}-deadline`),
    };
  },

  async _savePortfolioStrats() {
    const btn = document.getElementById('pf-save-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳...'; }
    try {
      await Promise.all([
        API.upsertPortfolioStrategy('short', this._readHorizon('short')),
        API.upsertPortfolioStrategy('mid',   this._readHorizon('mid')),
        API.upsertPortfolioStrategy('long',  this._readHorizon('long')),
      ]);
      App.toast('✅ Стратегия сохранена', 'success');
    } catch(e) { App.toast('❌ Ошибка сохранения', 'error'); }
    finally { if (btn) { btn.disabled = false; btn.textContent = '💾 Сохранить всё'; } }
  },

  async _aiPortfolio(summary) {
    const key = localStorage.getItem('bchs_deepseek_key') || '';
    if (!key) { alert('Введите DeepSeek API ключ в настройках MC'); return; }
    const btn = document.getElementById('pf-ai-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Анализирую...'; }
    try {
      const top3text = summary.top3Risk.map(r => `${r.name} ($${r.risk.toLocaleString('ru-RU')}, ${r.pct}%)`).join('; ') || 'нет';
      const prompt = `Ты стратегический аналитик CSM-портфеля.\nПроанализируй данные портфеля и предложи стратегию по трём горизонтам.\n\nДАННЫЕ ПОРТФЕЛЯ:\n- Всего клиентов: ${summary.total}\n- Средний bCHS: ${summary.avgBchs !== null ? summary.avgBchs : 'нет данных'}\n- Revenue at Risk: $${summary.totalRisk.toLocaleString('ru-RU')}\n- BCG: KEY=${summary.bcgCount.KEY}, STABLE=${summary.bcgCount.STABLE}, GROWTH=${summary.bcgCount.GROWTH + summary.bcgCount.GROWTH_EARLY}, TAIL=${summary.bcgCount.TAIL}\n- Топ-3 риска: ${top3text}\n- Средняя реализация потенциала: ${summary.avgPotential !== null ? summary.avgPotential + '%' : 'нет данных'}\n\nВерни СТРОГО валидный JSON без markdown:\n{\n  "short": { "title": "...", "goal": "...", "actions": "...", "success_metric": "...", "deadline": "YYYY-MM-DD" },\n  "mid":   { "title": "...", "goal": "...", "actions": "...", "success_metric": "...", "deadline": "YYYY-MM-DD" },\n  "long":  { "title": "...", "goal": "...", "actions": "...", "success_metric": "...", "deadline": "YYYY-MM-DD" }\n}`;
      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.3, max_tokens: 1200,
          messages: [
            { role: 'system', content: 'Ты аналитик CSM-портфеля. Отвечай ТОЛЬКО валидным JSON без markdown.' },
            { role: 'user',   content: prompt }
          ]
        })
      });
      if (!resp.ok) throw new Error(`DeepSeek ${resp.status}`);
      const data    = await resp.json();
      const content = data?.choices?.[0]?.message?.content ?? '';
      const match   = content.match(/\{[\s\S]*\}/);
      const parsed  = JSON.parse(match ? match[0] : content);
      ['short', 'mid', 'long'].forEach(k => {
        if (!parsed[k]) return;
        const s = parsed[k];
        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
        setVal(`pf-${k}-title`,    s.title);
        setVal(`pf-${k}-goal`,     s.goal);
        setVal(`pf-${k}-actions`,  s.actions);
        setVal(`pf-${k}-metric`,   s.success_metric);
        setVal(`pf-${k}-deadline`, s.deadline);
      });
      App.toast('🤖 AI стратегия заполнена — проверьте и сохраните', 'success');
    } catch(e) {
      console.error('[AI Portfolio]', e);
      alert('Ошибка AI: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🤖 AI: сгенерировать стратегию'; }
    }
  },

  /* ─────────────── ФИКС 7а — AI по одному горизонту ─────────────── */
  async _aiHorizon(key, summary) {
    const apiKey = localStorage.getItem('bchs_deepseek_key') || '';
    if (!apiKey) { alert('Введите DeepSeek API ключ в настройках MC'); return; }
    const btn = document.getElementById(`pf-ai-btn-${key}`);
    if (btn) { btn.disabled = true; btn.textContent = '⏳'; }
    const horizonLabels = {
      short: 'краткосрочная (1 месяц)',
      mid:   'среднесрочная (1–2 квартала)',
      long:  'долгосрочная (4 квартала)',
    };
    try {
      const top3text = summary.top3Risk.map(r =>
        `${r.name} ($${r.risk.toLocaleString('ru-RU')}, ${r.pct}%)`
      ).join('; ') || 'нет';
      const prompt = `Ты стратегический аналитик CSM-портфеля. Предложи стратегию для горизонта: ${horizonLabels[key]}.\n\nДАННЫЕ ПОРТФЕЛЯ:\n- Всего клиентов: ${summary.total}\n- Лояльность: ${summary.avgLoyalty !== null ? summary.avgLoyalty + '%' : 'нет данных'}\n- Revenue at Risk: $${summary.totalRisk.toLocaleString('ru-RU')}\n- BCG: KEY=${summary.bcgCount.KEY}, STABLE=${summary.bcgCount.STABLE}, GROWTH=${summary.bcgCount.GROWTH}, GROWTH_EARLY=${summary.bcgCount.GROWTH_EARLY}, TAIL=${summary.bcgCount.TAIL}\n- Топ-3 риска: ${top3text}\n- Средняя реализация потенциала: ${summary.avgPotential !== null ? summary.avgPotential + '%' : 'нет данных'}\n\nВерни СТРОГО валидный JSON без markdown:\n{"title":"...","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"}`;
      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'deepseek-chat', temperature: 0.3, max_tokens: 600,
          messages: [
            { role: 'system', content: 'Ты аналитик CSM-портфеля. Отвечай ТОЛЬКО валидным JSON без markdown.' },
            { role: 'user',   content: prompt }
          ]
        })
      });
      if (!resp.ok) throw new Error(`DeepSeek ${resp.status}`);
      const data    = await resp.json();
      const content = data?.choices?.[0]?.message?.content ?? '';
      const match   = content.match(/\{[\s\S]*\}/);
      const parsed  = JSON.parse(match ? match[0] : content);
      const setVal  = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
      setVal(`pf-${key}-title`,   parsed.title);
      setVal(`pf-${key}-goal`,    parsed.goal);
      setVal(`pf-${key}-actions`, parsed.actions);
      setVal(`pf-${key}-metric`,  parsed.success_metric);
      setVal(`pf-${key}-deadline`, parsed.deadline);
      App.toast(`🤖 AI стратегия для горизонта «${horizonLabels[key]}» заполнена`, 'success');
    } catch(e) {
      console.error('[AI Horizon]', e);
      alert('Ошибка AI: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🤖'; }
    }
  },

  /* ─────────────── ТАБ 2 — СТРАТЕГИЯ ПО АККАУНТАМ ─────────────── */
  async _renderAccountsTab() {
    const el = document.getElementById('pf-tab-accounts');
    el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted)">⏳ Загрузка аккаунтов...</div>`;
    try {
      const [clients, allBCHS, allPC, mcConfigs, accountStrats] = await Promise.all([
        API.getClients(), API.getAllBCHS(), API.getAllPC(),
        fetch('tables/mc_configs?limit=500').then(r => r.json()).then(j => Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : [])).catch(() => []),
        API.getAccountStrategies(),
      ]);
      this._accountStrategies = accountStrats;
      const computed = clients.map(c => ({ client: c, ...Calc.computeClient(c, allBCHS, allPC) }));

      // Запускаем MC для каждого клиента (с кешем)
      const mcResults = {};
      for (const row of computed) {
        const cid = row.client.id;
        if (this._mcCache[cid]) { mcResults[cid] = this._mcCache[cid]; continue; }
        const cfg = mcConfigs.find(x => x.client_id === cid);
        try {
          const mcCfg = Object.assign({}, MCEngine.DEFAULTS, { monthly_revenue: row.client.monthly_revenue || 5000 }, cfg || {});
          const res = MCEngine.run(row.bchs, mcCfg);
          this._mcCache[cid] = res;
          mcResults[cid] = res;
        } catch(e) { mcResults[cid] = null; }
      }

      const rows = computed.map(row => {
        const c      = row.client;
        const mc     = mcResults[c.id];
        const mc3m   = mc ? mc.horizons['3m'].bchs.median.toFixed(1) : '—';
        const churn  = mc ? mc.horizons['3m'].churn_rate : null;
        const churnCls = churn === null ? '' : churn < 7 ? 'color:#10B981' : churn < 15 ? 'color:#F59E0B' : 'color:#EF4444';
        const strat  = accountStrats.find(s => String(s.client_id) === String(c.id) && s.status !== 'Done');
        const stratText = strat ? (strat.goal || '').slice(0, 60) + ((strat.goal || '').length > 60 ? '…' : '') : null;
        const bcg    = BCG_LABELS[c.bcg_category] || c.bcg_category || '—';
        return `<tr>
          <td><strong>${c.name}</strong></td>
          <td><span class="bcg-chip" style="font-size:11px">${bcg}</span></td>
          <td style="font-size:11px">${c.key_account_priority || '—'}</td>
          <td style="color:${row.bchs !== null ? (row.bchs >= 20 ? '#10B981' : row.bchs >= -10 ? '#F59E0B' : '#EF4444') : '#6B7280'};font-weight:600">${row.bchs !== null ? row.bchs : '—'}</td>
          <td style="font-weight:600">${mc3m}</td>
          <td style="${churnCls};font-weight:600">${churn !== null ? churn.toFixed(1) + '%' : '—'}</td>
          <td style="font-size:11px;color:${stratText ? 'var(--text-secondary)' : 'var(--text-muted)'}">${stratText || 'Не задана'}</td>
          <td><button class="btn btn-secondary btn-sm" data-action="open-strat" data-cid="${c.id}" style="font-size:11px">✎ Открыть</button></td>
        </tr>`;
      }).join('');

      el.innerHTML = `
        <div class="form-section" style="margin-top:16px">
          <div class="form-section-title">Аккаунт-стратегии</div>
          <div style="overflow-x:auto">
            <table class="data-table">
              <thead><tr>
                <th>Клиент</th><th>BCG</th><th>Приоритет</th>
                <th>bCHS</th><th>MC 3М</th><th>Риск оттока</th>
                <th>Стратегия</th><th></th>
              </tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`;

      el.querySelectorAll('[data-action="open-strat"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cid  = btn.dataset.cid;
          const row  = computed.find(r => r.client.id === cid);
          const mc   = mcResults[cid];
          const strat = accountStrats.find(s => String(s.client_id) === String(cid) && s.status !== 'Done') || null;
          this._openAccountStratModal(row, mc, strat);
        });
      });
    } catch(e) {
      console.error(e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--md-red)">❌ Ошибка: ${e.message}</div>`;
    }
  },

  _openAccountStratModal(row, mc, strat) {
    const c      = row.client;
    const bcg    = BCG_LABELS[c.bcg_category] || c.bcg_category || '—';
    const mc3m   = mc ? mc.horizons['3m'].bchs.median.toFixed(1) : '—';
    const mc12m  = mc ? mc.horizons['12m'].bchs.median.toFixed(1) : '—';
    const churn3 = mc ? mc.horizons['3m'].churn_rate.toFixed(1)  + '%' : '—';
    const trendLabel = row.trend ? row.trend.label : '—';
    const churnColor = mc
      ? (mc.horizons['3m'].churn_rate < 7 ? '#10B981' : mc.horizons['3m'].churn_rate < 15 ? '#F59E0B' : '#EF4444')
      : '#6B7280';
    const v = f => strat ? (strat[f] || '') : '';
    const statuses = ['Active','Done','Paused'].map(s =>
      `<option value="${s}" ${v('status') === s || (!v('status') && s === 'Active') ? 'selected' : ''}>${s}</option>`
    ).join('');

    App.openModal(`
      <div style="max-width:560px">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;flex-wrap:wrap">
          <div>
            <div style="font-size:16px;font-weight:700">${c.name}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${bcg} · ${c.key_account_priority || '—'} · $${Number(c.monthly_revenue || 0).toLocaleString('ru-RU')}/мес</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
          <div class="kpi-card" style="padding:8px 10px">
            <div class="kpi-label">bCHS</div>
            <div class="kpi-value" style="font-size:18px;color:${row.bchs !== null ? (row.bchs >= 20 ? '#10B981' : row.bchs >= -10 ? '#F59E0B' : '#EF4444') : '#6B7280'}">${row.bchs !== null ? row.bchs : '—'}</div>
          </div>
          <div class="kpi-card" style="padding:8px 10px">
            <div class="kpi-label">MC 3М</div>
            <div class="kpi-value" style="font-size:18px">${mc3m}</div>
          </div>
          <div class="kpi-card" style="padding:8px 10px">
            <div class="kpi-label">ОТТОК 3М</div>
            <div class="kpi-value" style="font-size:18px;color:${churnColor}">${churn3}</div>
          </div>
          <div class="kpi-card" style="padding:8px 10px">
            <div class="kpi-label">ТРЕНД</div>
            <div class="kpi-value" style="font-size:16px">${trendLabel}</div>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:10px">
          <label class="form-label">Цель</label>
          <textarea class="form-textarea" id="as-goal" style="min-height:80px" placeholder="Что хотим достичь с этим клиентом...">${v('goal')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:10px">
          <label class="form-label">Действия</label>
          <textarea class="form-textarea" id="as-actions" style="min-height:80px" placeholder="Конкретные шаги...">${v('actions')}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
          <div class="form-group" style="margin:0">
            <label class="form-label">Метрика успеха</label>
            <input class="form-input" id="as-metric" value="${v('success_metric')}" placeholder="Как измерим" />
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Дедлайн</label>
            <input class="form-input" type="date" id="as-deadline" value="${v('deadline')}" />
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Статус</label>
            <select class="form-select" id="as-status">${statuses}</select>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" id="as-ai-btn">🤖 AI предложить</button>
          <button class="btn btn-primary btn-sm"   id="as-save-btn">💾 Сохранить</button>
          <button class="btn btn-secondary btn-sm" onclick="App.closeModal()">✕ Закрыть</button>
        </div>
      </div>
    `);

    document.getElementById('as-save-btn').addEventListener('click', async () => {
      const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
      const snapshot = mc ? JSON.stringify({
        bchs_current:  row.bchs,
        mc_3m_median:  mc.horizons['3m'].bchs.median,
        mc_3m_churn:   mc.horizons['3m'].churn_rate,
        mc_12m_median: mc.horizons['12m'].bchs.median,
        mc_12m_churn:  mc.horizons['12m'].churn_rate,
        saved_at:      new Date().toISOString(),
      }) : null;
      const saveBtn = document.getElementById('as-save-btn');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳...'; }
      try {
        await API.saveAccountStrategy(c.id, {
          goal:           g('as-goal'),
          actions:        g('as-actions'),
          success_metric: g('as-metric'),
          deadline:       g('as-deadline'),
          status:         g('as-status'),
          mc_snapshot:    snapshot,
          ai_generated:   false,
        });
        App.toast('✅ Стратегия сохранена', 'success');
        App.closeModal();
        // Обновляем таб аккаунтов
        this._renderAccountsTab();
      } catch(e) {
        App.toast('❌ Ошибка сохранения', 'error');
      } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 Сохранить'; }
      }
    });

    document.getElementById('as-ai-btn').addEventListener('click', async () => {
      const aiKey = localStorage.getItem('bchs_deepseek_key') || '';
      if (!aiKey) { alert('Введите DeepSeek API ключ в настройках MC'); return; }
      const aiBtn = document.getElementById('as-ai-btn');
      if (aiBtn) { aiBtn.disabled = true; aiBtn.textContent = '⏳...'; }
      try {
        const prompt = `Ты CSM-аналитик. Предложи стратегию работы с клиентом.\n\nПРОФИЛЬ: ${c.name} · BCG: ${bcg} · Приоритет: ${c.key_account_priority || '—'} · MR: $${Number(c.monthly_revenue || 0).toLocaleString('ru-RU')}\nbCHS текущий: ${row.bchs !== null ? row.bchs : 'нет данных'} · Тренд: ${trendLabel}\nMC прогноз 3М: bCHS медиана ${mc3m} · Риск оттока ${churn3}\nMC прогноз 12М: bCHS медиана ${mc12m} · Риск оттока ${mc ? mc.horizons['12m'].churn_rate.toFixed(1) + '%' : '—'}\nEngagement: ${c.client_engagement || '—'} · Phase: ${c.phase || '—'}\nRevenue at Risk: $${(row.revenueAtRisk || 0).toLocaleString('ru-RU')}\n\nВерни СТРОГО валидный JSON без markdown:\n{\n  "goal": "...",\n  "actions": "...",\n  "success_metric": "...",\n  "deadline": "YYYY-MM-DD"\n}`;
        const resp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aiKey}` },
          body: JSON.stringify({ model: 'deepseek-chat', temperature: 0.3, max_tokens: 600,
            messages: [
              { role: 'system', content: 'Ты CSM-аналитик. Отвечай ТОЛЬКО валидным JSON без markdown.' },
              { role: 'user',   content: prompt }
            ]
          })
        });
        if (!resp.ok) throw new Error(`DeepSeek ${resp.status}`);
        const data    = await resp.json();
        const content = data?.choices?.[0]?.message?.content ?? '';
        const match   = content.match(/\{[\s\S]*\}/);
        const parsed  = JSON.parse(match ? match[0] : content);
        const setVal  = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
        setVal('as-goal',     parsed.goal);
        setVal('as-actions',  parsed.actions);
        setVal('as-metric',   parsed.success_metric);
        setVal('as-deadline', parsed.deadline);
        App.toast('🤖 AI предложение заполнено — проверьте и сохраните', 'success');
      } catch(e) {
        console.error('[AI Account]', e);
        alert('Ошибка AI: ' + e.message);
      } finally {
        if (aiBtn) { aiBtn.disabled = false; aiBtn.textContent = '🤖 AI предложить'; }
      }
    });
  },

  /* ─────────────── ТАБ 3 — ПОКРЫТИЕ ПОРТФЕЛЯ ─────────────── */
  async _renderCoverageTab() {
    const el = document.getElementById('pf-tab-coverage');
    if (!el) return;
    el.innerHTML = `<div class="cov-loading">⏳ Загружаю данные покрытия...</div>`;
    try {
      const [clients, allPC] = await Promise.all([
        API.getClients(),
        API.getAllPC(),
      ]);
      this._allClientsForCoverage = clients;
      this._allPCForCoverage = allPC;
      this._renderCoverageContent(clients, allPC);
    } catch(e) {
      el.innerHTML = `<div class="cov-loading" style="color:var(--red)">❌ Ошибка: ${e.message}</div>`;
    }
  },

  _renderCoverageContent(clients, allPC) {
    const el = document.getElementById('pf-tab-coverage');
    if (!el) return;
    if (!allPC) allPC = this._allPCForCoverage || [];

    const f = this._coverageFilters;

    // Списки уникальных значений для фильтров
    const regions = [...new Set(clients.map(c => c.dach_region).filter(Boolean))].sort();
    const ams     = [...new Set(clients.map(c => c.account_manager).filter(Boolean))].sort();

    // ── Логика покрытия по ролям из последней pc_entry ──────────
    // full    = CSM>0 И AM>0 И Coordinator>0
    // overlap = CSM>0 И хотя бы одна другая роль > 0
    // partial = есть хоть одна роль > 0, но не дотягивает до full
    // none    = все роли = 0 (или нет pc_entry)
    const withCov = clients.map(c => {
      const pcEntries = allPC
        .filter(e => String(e.client_id) === String(c.id))
        .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
      const pc = pcEntries.length > 0 ? pcEntries[pcEntries.length - 1] : null;

      const csm   = pc ? (Number(pc.role_csm)             || 0) : 0;
      const am    = pc ? (Number(pc.role_account_manager)  || 0) : 0;
      const coord = pc ? (Number(pc.role_coordinator)      || 0) : 0;
      const sales = pc ? (Number(pc.role_sales)            || 0) : 0;
      const deliv = pc ? (Number(pc.role_delivery)         || 0) : 0;

      const hasCSM   = csm   > 0;
      const hasAM    = am    > 0;
      const hasCoord = coord > 0;
      const hasSales = sales > 0;
      const hasDeliv = deliv > 0;
      const hasOther = hasAM || hasCoord || hasSales || hasDeliv;
      const hasAny   = hasCSM || hasOther;

      let covStatus;
      if      (hasCSM && hasAM && hasCoord) covStatus = 'full';
      else if (hasCSM && hasOther)          covStatus = 'overlap';
      else if (hasAny)                      covStatus = 'partial';
      else                                  covStatus = 'none';

      return { ...c, csm, am, coord, sales, deliv,
               hasCSM, hasAM, hasCoord, hasSales, hasDeliv, covStatus };
    });

    // Статистика
    const total     = withCov.length;
    const fullCov   = withCov.filter(c => c.covStatus === 'full').length;
    const noCov     = withCov.filter(c => c.covStatus === 'none').length;
    const bothRoles = withCov.filter(c => c.covStatus === 'overlap').length;

    // Фильтрация
    let filtered = withCov;
    if (f.region)  filtered = filtered.filter(c => c.dach_region === f.region);
    if (f.am)      filtered = filtered.filter(c => c.account_manager === f.am);
    if (f.status)  filtered = filtered.filter(c =>
      f.status === 'overlap' ? c.covStatus === 'overlap'
      : f.status === 'full'    ? c.covStatus === 'full'
      : f.status === 'partial' ? (c.covStatus === 'partial')
      : f.status === 'none'    ? c.covStatus === 'none'
      : true
    );
    if (f.search)  filtered = filtered.filter(c => (c.name||'').toLowerCase().includes(f.search.toLowerCase()));

    const regionOpts = regions.map(r => `<option value="${r}" ${f.region===r?'selected':''}>${r}</option>`).join('');
    const amOpts     = ams.map(a => `<option value="${a}" ${f.am===a?'selected':''}>${a}</option>`).join('');

    const tableRows = filtered.map(c => {
      const covIcon = c.covStatus === 'full'
        ? `<span class="cov-badge cov-badge--full">🟢 Покрыт</span>`
        : c.covStatus === 'overlap'
          ? `<span class="cov-badge cov-badge--partial">🔵 Пересечение</span>`
          : c.covStatus === 'partial'
            ? `<span class="cov-badge cov-badge--partial">🟡 Частично</span>`
            : `<span class="cov-badge cov-badge--none">🔴 Не покрыт</span>`;
      const mr = c.monthly_revenue ? `$${Number(c.monthly_revenue).toLocaleString('ru-RU')}` : '—';
      const rolePip = (active, label) =>
        `<span title="${label}" style="display:inline-flex;align-items:center;justify-content:center;
          width:28px;height:18px;border-radius:4px;font-size:9px;font-weight:700;
          background:${active ? 'rgba(99,102,241,0.12)' : 'rgba(0,0,0,0.04)'};
          color:${active ? '#6366f1' : '#9ca3af'};
          border:1px solid ${active ? 'rgba(99,102,241,0.25)' : 'rgba(0,0,0,0.08)'}">${label}</span>`;
      const rolePips =
        rolePip(c.hasCSM,   'CSM') +
        rolePip(c.hasAM,    'AM')  +
        rolePip(c.hasCoord, 'DC')  +
        rolePip(c.hasSales, 'SLS') +
        rolePip(c.hasDeliv, 'DLV');
      return `<tr data-cid="${c.id}">
        <td class="cov-td-name"><strong>${c.name||'—'}</strong></td>
        <td class="cov-td-region">${c.dach_region||'—'}</td>
        <td class="cov-td-am">${c.account_manager||'<span class="cov-empty">не назначен</span>'}</td>
        <td class="cov-td-coord">
          <div class="cov-coord-cell">
            <span class="cov-coord-name" data-cid="${c.id}">${c.coordinator||'<span class="cov-empty">не назначен</span>'}</span>
            <button class="cov-assign-btn" data-cid="${c.id}" title="Назначить координатора">✎</button>
          </div>
        </td>
        <td class="cov-td-rev">${mr}</td>
        <td style="white-space:nowrap">${rolePips}</td>
        <td class="cov-td-cov">${covIcon}</td>
      </tr>`;
    }).join('');

    el.innerHTML = `
    <div class="cov-page">
      <!-- Фильтры -->
      <div class="cov-filters">
        <select class="cov-filter-select" id="cov-f-region">
          <option value="">🌍 Все регионы</option>${regionOpts}
        </select>
        <select class="cov-filter-select" id="cov-f-am">
          <option value="">👤 Все AM</option>${amOpts}
        </select>
        <select class="cov-filter-select" id="cov-f-status">
          <option value="">🔍 Все статусы покрытия</option>
          <option value="full"    ${f.status==='full'   ?'selected':''}>🟢 Полностью покрыт</option>
          <option value="overlap" ${f.status==='overlap'?'selected':''}>🔵 Пересечение (CSM+др.)</option>
          <option value="partial" ${f.status==='partial'?'selected':''}>🟡 Частично</option>
          <option value="none"    ${f.status==='none'   ?'selected':''}>🔴 Не покрыт</option>
        </select>
        <input class="cov-filter-input" id="cov-f-search" placeholder="🔍 Поиск клиента..." value="${f.search}" />
        <button class="btn btn-secondary btn-sm" id="cov-reset-btn">✕ Сбросить</button>
        <button class="btn btn-secondary btn-sm" id="cov-export-btn">📥 Экспорт CSV</button>
      </div>

      <!-- Статистика -->
      <div class="cov-stats">
        <div class="cov-stat-card">
          <div class="cov-stat-val">${total}</div>
          <div class="cov-stat-lbl">Всего клиентов</div>
        </div>
        <div class="cov-stat-card cov-stat-card--green">
          <div class="cov-stat-val">${fullCov}</div>
          <div class="cov-stat-lbl">Полностью покрыто <span class="cov-stat-pct">${total?Math.round(fullCov/total*100):0}%</span></div>
        </div>
        <div class="cov-stat-card cov-stat-card--red">
          <div class="cov-stat-val">${noCov}</div>
          <div class="cov-stat-lbl">Без покрытия <span class="cov-stat-pct">${total?Math.round(noCov/total*100):0}%</span></div>
        </div>
        <div class="cov-stat-card cov-stat-card--blue">
          <div class="cov-stat-val">${bothRoles}</div>
          <div class="cov-stat-lbl">Пересечение <span style="font-size:10px;display:block;opacity:0.8">(CSM + др. роль)</span></div>
        </div>
      </div>

      <!-- Таблица -->
      <div class="cov-table-wrap">
        <table class="cov-table">
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Регион</th>
              <th>Аккаунт-менеджер</th>
              <th>Координатор</th>
              <th>Revenue</th>
              <th>Роли</th>
              <th>Покрытие</th>
            </tr>
          </thead>
          <tbody id="cov-tbody">
            ${tableRows || '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-muted)">Нет клиентов по фильтру</td></tr>'}
          </tbody>
        </table>
        <div class="cov-table-footer">Показано: ${filtered.length} из ${total}</div>
      </div>

      <!-- Inline dropdown для назначения координатора -->
      <div class="cov-inline-dropdown hidden" id="cov-inline-dropdown">
        <div class="cov-inline-header">
          <span class="cov-inline-title">Назначить координатора</span>
          <button class="cov-inline-close" id="cov-dd-close">✕</button>
        </div>
        <input class="cov-inline-input" id="cov-dd-input" placeholder="Имя координатора..." />
        <div class="cov-inline-suggestions" id="cov-dd-suggestions"></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary btn-sm" id="cov-dd-save">💾 Сохранить</button>
          <button class="btn btn-secondary btn-sm" id="cov-dd-clear">✕ Снять</button>
        </div>
      </div>
    </div>`;

    this._bindCoverageEvents(withCov);
  },

  _bindCoverageEvents(withCov) {
    // Фильтры
    const applyFilter = () => {
      const f = this._coverageFilters;
      f.region = document.getElementById('cov-f-region')?.value || '';
      f.am     = document.getElementById('cov-f-am')?.value || '';
      f.status = document.getElementById('cov-f-status')?.value || '';
      f.search = document.getElementById('cov-f-search')?.value || '';
      this._renderCoverageContent(this._allClientsForCoverage || []);
    };

    ['cov-f-region','cov-f-am','cov-f-status'].forEach(id =>
      document.getElementById(id)?.addEventListener('change', applyFilter));
    document.getElementById('cov-f-search')?.addEventListener('input', applyFilter);

    document.getElementById('cov-reset-btn')?.addEventListener('click', () => {
      this._coverageFilters = { region:'', am:'', status:'', search:'' };
      this._renderCoverageContent(this._allClientsForCoverage || []);
    });

    // Экспорт CSV
    document.getElementById('cov-export-btn')?.addEventListener('click', () => {
      this._exportCoverageCSV(withCov);
    });

    // Inline назначение координатора
    let _ddTargetCid = null;
    const dd  = document.getElementById('cov-inline-dropdown');
    const inp = document.getElementById('cov-dd-input');
    const sug = document.getElementById('cov-dd-suggestions');

    const allCoords = [...new Set((this._allClientsForCoverage||[])
      .map(c=>c.coordinator).filter(Boolean))].sort();

    document.querySelectorAll('.cov-assign-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        _ddTargetCid = btn.dataset.cid;
        const c = (this._allClientsForCoverage||[]).find(x=>x.id===_ddTargetCid);
        if (inp) inp.value = c?.coordinator || '';
        // Позиционируем рядом с кнопкой
        const rect = btn.getBoundingClientRect();
        const mc   = document.getElementById('main-content');
        const mcR  = mc.getBoundingClientRect();
        dd.style.top  = (rect.bottom - mcR.top + mc.scrollTop + 6) + 'px';
        dd.style.left = Math.min(rect.left - mcR.left, mcR.width - 280) + 'px';
        dd.classList.remove('hidden');
        inp?.focus();
        this._updateSuggestions(inp?.value||'', allCoords, sug, inp);
      });
    });

    if (inp) {
      inp.addEventListener('input', () => {
        this._updateSuggestions(inp.value, allCoords, sug, inp);
      });
    }

    document.getElementById('cov-dd-close')?.addEventListener('click', () => {
      dd?.classList.add('hidden');
    });

    document.getElementById('cov-dd-save')?.addEventListener('click', async () => {
      if (!_ddTargetCid || !inp) return;
      const val = inp.value.trim();
      await this._saveCoordinator(_ddTargetCid, val);
      dd?.classList.add('hidden');
    });

    document.getElementById('cov-dd-clear')?.addEventListener('click', async () => {
      if (!_ddTargetCid) return;
      await this._saveCoordinator(_ddTargetCid, '');
      dd?.classList.add('hidden');
    });

    // Закрыть по клику вне
    document.addEventListener('click', e => {
      if (dd && !dd.contains(e.target) && !e.target.classList.contains('cov-assign-btn')) {
        dd.classList.add('hidden');
      }
    }, { once: true });
  },

  _updateSuggestions(query, all, container, input) {
    if (!container) return;
    const q = query.toLowerCase().trim();
    const matches = q ? all.filter(s => s.toLowerCase().includes(q)) : all.slice(0, 8);
    if (!matches.length) { container.innerHTML = ''; return; }
    container.innerHTML = matches.map(s =>
      `<div class="cov-sug-item" data-val="${s}">${s}</div>`
    ).join('');
    container.querySelectorAll('.cov-sug-item').forEach(item => {
      item.addEventListener('click', () => {
        if (input) input.value = item.dataset.val;
        container.innerHTML = '';
      });
    });
  },

  async _saveCoordinator(clientId, name) {
    const btn = document.getElementById('cov-dd-save');
    if (btn) { btn.disabled = true; btn.textContent = '⏳...'; }
    try {
      const c = (this._allClientsForCoverage||[]).find(x => x.id === clientId);
      if (!c) return;
      await fetch(`tables/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinator: name }),
      });
      // Обновить кеш
      c.coordinator = name;
      if (window.API) API._clientsCache = null;
      App.toast(name ? `✅ Координатор «${name}» назначен` : '✅ Координатор снят', 'success');
      // Hot-update ячейки
      const cell = document.querySelector(`.cov-coord-name[data-cid="${clientId}"]`);
      if (cell) cell.innerHTML = name || '<span class="cov-empty">не назначен</span>';
      // Пересчитать статистику и перерисовать
      this._renderCoverageContent(this._allClientsForCoverage || []);
    } catch(e) {
      App.toast('❌ Ошибка: ' + e.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '💾 Сохранить'; }
    }
  },

  _exportCoverageCSV(rows) {
    const f = this._coverageFilters;
    let filtered = rows;
    if (f.region) filtered = filtered.filter(c => c.dach_region === f.region);
    if (f.am)     filtered = filtered.filter(c => c.account_manager === f.am);
    if (f.status) filtered = filtered.filter(c => c.covStatus === f.status);
    if (f.search) filtered = filtered.filter(c => (c.name||'').toLowerCase().includes(f.search.toLowerCase()));

    const headers = ['Клиент','Регион','Аккаунт-менеджер','Координатор','Revenue','Статус клиента','Покрытие'];
    const covLabel = { full:'Покрыт', partial:'Частично', none:'Не покрыт' };
    const lines = [
      headers.join(';'),
      ...filtered.map(c => [
        `"${(c.name||'').replace(/"/g,'""')}"`,
        c.dach_region||'',
        `"${(c.account_manager||'').replace(/"/g,'""')}"`,
        `"${(c.coordinator||'').replace(/"/g,'""')}"`,
        c.monthly_revenue||0,
        c.status||'',
        covLabel[c.covStatus]||'',
      ].join(';'))
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url, download: `coverage_${new Date().toISOString().slice(0,10)}.csv`
    });
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    App.toast('📥 CSV экспортирован', 'success');
  },

};

/* ======== CLIENTS PAGE ======== */
const ClientsPage = {
  clients: [], editingId: null, highlightId: null,

  async render(highlightId) {
    this.highlightId = highlightId || null;
    document.getElementById('main-content').innerHTML = `
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
          <div><div class="page-title">Клиенты</div><div class="page-subtitle">Профили и параметры</div></div>
          <button class="btn btn-primary" id="btn-add">+ Добавить</button>
        </div>
      </div>
      <div id="cl-list"><div style="text-align:center;padding:40px;color:var(--text-muted)">⏳ Загрузка...</div></div>
      <div id="cl-form" class="hidden"></div>
    `;
    document.getElementById('btn-add').addEventListener('click', () => { this.editingId=null; this._showForm(null); });
    await this._load();
    if (highlightId) {
      const c = this.clients.find(c=>c.id===highlightId);
      if (c) { this.editingId=highlightId; this._showForm(c); }
    }
  },

  async _load() { this.clients = await API.getClients(); this._renderList(); },

  _renderList() {
    const el = document.getElementById('cl-list');
    if (!el) return;
    if (!this.clients.length) {
      el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👤</div><div class="empty-state-title">Нет клиентов</div><div class="empty-state-text">Нажмите «+ Добавить» чтобы создать первого</div></div>`;
      return;
    }
    const grp = s => this.clients.filter(c=>c.status===s);
    const active=grp('Active'), paused=grp('Paused'), self=grp('Self-managed');
    let h = '';
    if (active.length) h += this._grp('Активные', active);
    if (paused.length) h += this._grp('На паузе',  paused);
    if (self.length)   h += this._grp('Самоуправление', self);
    el.innerHTML = h;
    document.querySelectorAll('[data-a="detail"]').forEach(b => b.addEventListener('click', ()=>App.navigate('detail',b.dataset.id)));
    document.querySelectorAll('[data-a="edit"]').forEach(b => b.addEventListener('click', ()=>{
      const c=this.clients.find(c=>c.id===b.dataset.id); if(c){this.editingId=c.id;this._showForm(c);}
    }));
    document.querySelectorAll('[data-a="del"]').forEach(b => b.addEventListener('click', async ()=>{
      const c=this.clients.find(c=>c.id===b.dataset.id);
      if(!c||!confirm(`Удалить «${c.name}»?`)) return;
      await API.deleteClient(b.dataset.id); App.toast(`«${c.name}» удалён`,''); await this._load();
    }));
  },

  _grp(title, list) {
    return `<div style="margin-bottom:20px">
      <div class="section-header">${title}<span class="section-count">${list.length}</span></div>
      ${list.map(c=>{
        const bcg=BCG_LABELS[c.bcg_category]||'—', hl=this.highlightId===c.id;
        return `<div class="client-card${hl?' expanded':''}" style="${hl?'border-color:var(--blue)':''}" data-id="${c.id}">
          <div class="client-card-info">
            <div class="client-card-name">${c.name}</div>
            <div class="client-card-meta">
              <span class="bcg-badge">${bcg}</span>
              <span>${c.key_account_priority||'—'}</span>
              <span>👤 ${c.sales_owner||'—'}</span>
              <span style="color:var(--text-muted)">${c.phase||'—'}</span>
            </div>
          </div>
          <div class="client-card-actions">
            <button class="btn btn-secondary btn-sm" data-a="detail" data-id="${c.id}">📊</button>
            <button class="btn btn-secondary btn-sm" data-a="edit"   data-id="${c.id}">✎</button>
            <button class="btn btn-danger    btn-sm" data-a="del"    data-id="${c.id}">✕</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },

  _showForm(c) {
    const form = document.getElementById('cl-form');
    if (!form) return;
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior:'smooth', block:'nearest' });
    const v = (field, def='') => c ? (c[field]||def) : def;
    const sel = (field, opts, def='') => opts.map(o =>
      `<option value="${o}" ${(c?c[field]:def)===o?'selected':''}>${o}</option>`).join('');

    form.innerHTML = `
      <div class="form-section">
        <div class="form-section-title">${this.editingId ? '✎ Редактировать клиента' : '+ Новый клиент'}</div>
        <div class="form-grid">
          <div class="form-group full">
            <label class="form-label">Название компании *</label>
            <input class="form-input" id="cf-name" value="${v('name')}" placeholder="ООО Пример" />
          </div>
          <div class="form-group">
            <label class="form-label">Статус</label>
            <select class="form-select" id="cf-status">${sel('status',['Active','Paused','Self-managed'],'Active')}</select>
          </div>
          <div class="form-group">
            <label class="form-label">MR (₽/мес)</label>
            <input class="form-input" id="cf-mr" type="number" value="${v('monthly_revenue',5000)}" min="0" />
          </div>
          <div class="form-group">
            <label class="form-label">Тип клиента</label>
            <select class="form-select" id="cf-type">${sel('client_type',['Direct','Partner','Body-shop'],'Direct')}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Фаза</label>
            <select class="form-select" id="cf-phase">${sel('phase',['Discovery','Ongoing','SLA','Winding Down'],'Ongoing')}</select>
          </div>
        </div>
        <div style="margin:14px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Стратегическая ценность</div>
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Технологическая ценность</label><select class="form-select" id="cf-tech">${sel('tech_value',['Strategic','Standard','Basic'],'Standard')}</select></div>
          <div class="form-group"><label class="form-label">Брендовая ценность</label><select class="form-select" id="cf-brand">${sel('brand_value',['Top','Recognizable','Unknown'],'Recognizable')}</select></div>
          <div class="form-group"><label class="form-label">Потенциал роста</label><select class="form-select" id="cf-growth">${sel('growth_potential',['Yes','No'],'Yes')}</select></div>
          <div class="form-group"><label class="form-label">Managed Services потенциал</label><select class="form-select" id="cf-ms">${sel('managed_services_potential',['Yes','Partial','No'],'Partial')}</select></div>
          <div class="form-group"><label class="form-label">Доступ к конечному клиенту</label><select class="form-select" id="cf-access">${sel('access_to_end_client',['Strategic Partner','Potential','Blocks','N/A'],'N/A')}</select></div>
          <div class="form-group"><label class="form-label">Уровень ЛПР</label><select class="form-select" id="cf-dm">${sel('decision_maker_level',['C-level','Tech Lead','Gatekeeper'],'Tech Lead')}</select></div>
        </div>
        <div style="margin:14px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">Операционный профиль</div>
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Длительность контракта</label><select class="form-select" id="cf-contract">${sel('contract_length',['Stable (6+)','Medium (3-6)','Short (1-3)'],'Medium (3-6)')}</select></div>
          <div class="form-group"><label class="form-label">Сложность клиента</label><select class="form-select" id="cf-diff">${sel('client_difficulty',['Easy','Normal','Conflict'],'Normal')}</select></div>
          <div class="form-group"><label class="form-label">Вовлечённость клиента</label><select class="form-select" id="cf-eng">${sel('client_engagement',['Proactive','Active','Reactive'],'Active')}</select></div>
          <div class="form-group"><label class="form-label">Операционная сложность</label><select class="form-select" id="cf-op">${sel('operational_difficulty',['Easy','Normal','Hard'],'Normal')}</select></div>
          <div class="form-group"><label class="form-label">Зрелость команды</label><select class="form-select" id="cf-mat">${sel('team_maturity',['Senior','Standard','Junior'],'Standard')}</select></div>
          <div class="form-group"><label class="form-label">Ответственный</label><input class="form-input" id="cf-owner" value="${v('sales_owner')}" placeholder="Имя менеджера" /></div>
        </div>
        <div style="margin:14px 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted)">🗺️ Покрытие и назначения</div>
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Аккаунт-менеджер</label><input class="form-input" id="cf-am" value="${v('account_manager')}" placeholder="Имя AM" /></div>
          <div class="form-group"><label class="form-label">Координатор</label><input class="form-input" id="cf-coord" value="${v('coordinator')}" placeholder="Имя координатора" /></div>
          <div class="form-group"><label class="form-label">DACH-регион</label><select class="form-select" id="cf-dach"><option value="">— не выбран —</option>${['DACH1','DACH2','DACH3','DACH4'].map(r=>`<option value="${r}" ${v('dach_region')===r?'selected':''}>${r}</option>`).join('')}</select></div>
        </div>
        <div class="form-group full" style="margin-top:14px">
          <label class="form-label">Заметки о стратегии</label>
          <textarea class="form-textarea" id="cf-notes">${v('strategy_notes')}</textarea>
        </div>
        <div id="cf-computed" style="margin-top:16px;padding:14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:10px">Результаты расчёта</div>
          <div id="cf-calc-grid" class="form-grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">BCG</div><div id="cc-bcg" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Приоритет</div><div id="cc-kap" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Score</div><div id="cc-score" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">CSM</div><div id="cc-csm" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Часы/нед</div><div id="cc-hrs" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Ёмкость</div><div id="cc-cap" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Financial</div><div id="cc-fin" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Strategic</div><div id="cc-str" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Stability</div><div id="cc-stab" style="font-size:15px;font-weight:700">—</div></div>
            <div><div style="font-size:10.5px;color:var(--text-muted);font-weight:600;text-transform:uppercase">Complexity</div><div id="cc-compl" style="font-size:15px;font-weight:700">—</div></div>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
          <button class="btn btn-primary" id="cf-save">💾 Сохранить</button>
          <button class="btn btn-secondary" id="cf-cancel">Отмена</button>
        </div>
      </div>
    `;

    const updatePreview = () => {
      const d = this._readForm();
      const comp = ClientCalc.compute(d);
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('cc-bcg',   BCG_LABELS[comp.bcg_category]||comp.bcg_category);
      set('cc-kap',   comp.key_account_priority);
      set('cc-score', comp.priority_score);
      set('cc-csm',   comp.csm_assignment);
      set('cc-hrs',   comp.total_hours + 'ч');
      set('cc-cap',   comp.capacity_pct + '%');
      set('cc-fin',   comp.financial_value);
      set('cc-str',   comp.strategic_value);
      set('cc-stab',  comp.stability);
      set('cc-compl', comp.complexity);
    };

    ['cf-mr','cf-type','cf-phase','cf-tech','cf-brand','cf-growth','cf-ms','cf-access','cf-dm','cf-contract','cf-diff','cf-eng','cf-op','cf-mat'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', updatePreview);
    });
    document.getElementById('cf-mr').addEventListener('input', updatePreview);
    updatePreview();

    document.getElementById('cf-save').addEventListener('click', async () => {
      const nameEl = document.getElementById('cf-name');
      if (!nameEl.value.trim()) { App.toast('Введите название','error'); nameEl.focus(); return; }
      const btn = document.getElementById('cf-save');
      btn.textContent = '⏳...'; btn.disabled = true;
      try {
        const data = this._readForm();
        if (this.editingId) {
          await API.updateClient(this.editingId, {...(this.clients.find(c=>c.id===this.editingId)||{}), ...data});
          App.toast('✅ Клиент обновлён','success');
        } else {
          await API.createClient(data);
          App.toast('✅ Клиент добавлен','success');
        }
        form.classList.add('hidden'); this.editingId = null;
        await this._load();
      } catch(e) { App.toast('❌ Ошибка сохранения','error'); console.error(e); }
      finally { btn.textContent = '💾 Сохранить'; btn.disabled = false; }
    });

    document.getElementById('cf-cancel').addEventListener('click', () => {
      form.classList.add('hidden'); this.editingId = null;
    });
  },

  _readForm() {
    const g = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    return {
      name:                       g('cf-name').trim(),
      status:                     g('cf-status'),
      monthly_revenue:            parseFloat(g('cf-mr')) || 0,
      client_type:                g('cf-type'),
      managed_services_potential: g('cf-ms'),
      tech_value:                 g('cf-tech'),
      brand_value:                g('cf-brand'),
      growth_potential:           g('cf-growth'),
      access_to_end_client:       g('cf-access'),
      contract_length:            g('cf-contract'),
      decision_maker_level:       g('cf-dm'),
      client_difficulty:          g('cf-diff'),
      client_engagement:          g('cf-eng'),
      operational_difficulty:     g('cf-op'),
      team_maturity:              g('cf-mat'),
      phase:                      g('cf-phase'),
      sales_owner:                g('cf-owner').trim(),
      account_manager:            g('cf-am').trim(),
      coordinator:                g('cf-coord').trim(),
      dach_region:                g('cf-dach'),
      strategy_notes:             g('cf-notes').trim(),
    };
  },
};

/* ======== ROLE SYSTEM ======== */
const Role = {
  _key: 'bchs_role',
  _nameKey: 'bchs_worker_name',
  get mode()       { return localStorage.getItem(this._key) || 'admin'; },
  get workerName() { return localStorage.getItem(this._nameKey) || ''; },
  setAdmin()  { localStorage.setItem(this._key, 'admin'); localStorage.removeItem(this._nameKey); this._updateUI(); DashboardPage.render(); },
  setWorker(name) { localStorage.setItem(this._key, 'worker'); localStorage.setItem(this._nameKey, name.trim()); this._updateUI(); DashboardPage.render(); },
  setAdminSilent()  { localStorage.setItem(this._key, 'admin'); localStorage.removeItem(this._nameKey); },
  setWorkerSilent(name) { localStorage.setItem(this._key, 'worker'); localStorage.setItem(this._nameKey, name.trim()); },
  isAdmin()  { return this.mode === 'admin'; },
  isWorker() { return this.mode === 'worker'; },
  ownerList(clients) {
    const s = new Set();
    (clients||[]).forEach(c => { if (c.sales_owner) s.add(c.sales_owner.trim()); });
    return [...s].sort();
  },
  _updateUI() {
    const banner = document.getElementById('role-banner');
    if (!banner) return;
    if (this.isWorker()) {
      banner.className = 'role-banner role-worker';
      banner.innerHTML = `<span class="role-icon">👤</span><span class="role-name">${this.workerName || 'Работник'}</span><span class="role-tag">Мои клиенты</span>`;
    } else {
      banner.className = 'role-banner role-admin';
      banner.innerHTML = `<span class="role-icon">🔑</span><span class="role-name">Админ</span><span class="role-tag">Все клиенты</span>`;
    }
  },
  openModal(clients) {
    const owners = this.ownerList(clients);
    const ownerOpts = owners.map(o => `<option value="${o}" ${this.workerName===o?'selected':''}>${o}</option>`).join('');
    App.openModal(`
      <div class="role-modal">
        <div class="role-modal-title">🔒 Вид рабочего пространства</div>
        <p class="role-modal-desc">Выберите, как вы хотите работать с приложением:</p>
        <div class="role-options">
          <button class="role-opt ${this.isAdmin()?'active':''}" id="rm-admin">
            <span class="role-opt-icon">🔑</span>
            <div class="role-opt-body"><strong>Администратор</strong><span>Вижу всех клиентов портфеля</span></div>
          </button>
          <button class="role-opt ${this.isWorker()?'active':''}" id="rm-worker">
            <span class="role-opt-icon">👤</span>
            <div class="role-opt-body"><strong>Работник</strong><span>Вижу только своих клиентов</span></div>
          </button>
        </div>
        <div id="rm-worker-config" class="role-worker-config ${this.isWorker()?'':'hidden'}">
          <label class="form-label">Ваше имя (Менеджер)</label>
          ${owners.length > 0
            ? `<select class="form-select" id="rm-name"><option value="">— выберите —</option>${ownerOpts}<option value="__custom">Ввести вручную...</option></select>`
            : `<input class="form-input" id="rm-name" type="text" placeholder="Например: Марина Волкова" value="${this.workerName}" />`
          }
          <input class="form-input hidden" id="rm-name-custom" type="text" placeholder="Введите имя" />
        </div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-primary" id="rm-save">✅ Применить</button>
          <button class="btn btn-secondary" id="rm-cancel">Отмена</button>
        </div>
      </div>
    `);
    let picked = this.mode;
    const wConf = document.getElementById('rm-worker-config');
    document.getElementById('rm-admin').addEventListener('click', () => {
      picked = 'admin';
      document.getElementById('rm-admin').classList.add('active');
      document.getElementById('rm-worker').classList.remove('active');
      wConf.classList.add('hidden');
    });
    document.getElementById('rm-worker').addEventListener('click', () => {
      picked = 'worker';
      document.getElementById('rm-worker').classList.add('active');
      document.getElementById('rm-admin').classList.remove('active');
      wConf.classList.remove('hidden');
    });
    const nameEl = document.getElementById('rm-name');
    const customEl = document.getElementById('rm-name-custom');
    if (nameEl && nameEl.tagName === 'SELECT') {
      nameEl.addEventListener('change', () => { customEl.classList.toggle('hidden', nameEl.value !== '__custom'); });
    }
    document.getElementById('rm-save').addEventListener('click', () => {
      if (picked === 'admin') { this.setAdmin(); App.closeModal(); return; }
      let name = '';
      if (nameEl) name = nameEl.tagName === 'SELECT'
        ? (nameEl.value === '__custom' ? customEl.value.trim() : nameEl.value)
        : nameEl.value.trim();
      if (!name) { App.toast('Введите имя', 'error'); return; }
      this.setWorker(name); App.closeModal();
    });
    document.getElementById('rm-cancel').addEventListener('click', () => App.closeModal());
  },
};

/* ======== ROLE CONFIG (встроен из js/role_config.js) ======== */
const ROLE_CONFIG = {
  service_delivery: {
    label: 'Service Delivery', icon: '🎯',
    modules: {
      dashboard: true, portfolio: true, detail_overview: true,
      detail_history: true, detail_status_log: true, detail_delivery: true,
      detail_monte_carlo: false, clients: true, entry: true,
      monte_carlo_page: false, ai_strategies: false, bcg_analysis: false,
    },
    dashboard_focus: ['utilization', 'escalations', 'replacements'],
    welcome_message: 'Твой фокус — команда и операции. Начни с Dashboard чтобы увидеть кто требует внимания.',
  },
  account_manager: {
    label: 'Account Manager', icon: '🤝',
    modules: {
      dashboard: true, portfolio: true, detail_overview: true,
      detail_history: true, detail_status_log: true, detail_delivery: false,
      detail_monte_carlo: false, clients: true, entry: true,
      monte_carlo_page: false, ai_strategies: false, bcg_analysis: false,
    },
    dashboard_focus: ['revenue', 'health', 'activities'],
    welcome_message: 'Твой фокус — отношения и revenue. Начни с Portfolio чтобы увидеть общую картину.',
  },
  csm_analyst: {
    label: 'CSM / Analyst', icon: '📊',
    modules: {
      dashboard: true, portfolio: true, detail_overview: true,
      detail_history: true, detail_status_log: true, detail_delivery: true,
      detail_monte_carlo: true, clients: true, entry: true,
      monte_carlo_page: true, ai_strategies: true, bcg_analysis: true,
    },
    dashboard_focus: ['health', 'revenue', 'risk', 'utilization'],
    welcome_message: 'Полный доступ активирован. Все модули доступны.',
  },
};

function getRoleConfig() {
  try { const r = localStorage.getItem('bchs_role'); return ROLE_CONFIG[r] || ROLE_CONFIG.csm_analyst; } catch { return ROLE_CONFIG.csm_analyst; }
}
function getCurrentRole() {
  try { return localStorage.getItem('bchs_role') || 'csm_analyst'; } catch { return 'csm_analyst'; }
}
function setCurrentRole(roleId) {
  try { if (ROLE_CONFIG[roleId]) localStorage.setItem('bchs_role', roleId); } catch {}
}
function canAccess(moduleKey) { return getRoleConfig().modules[moduleKey] !== false; }
function applyRoleToNav() {
  // ФИКС 1 — порядок пунктов меню зависит от роли
  const cfg  = getRoleConfig();
  const role = getCurrentRole ? getCurrentRole() : (localStorage.getItem('bchs_role') || '');

  // Порядок page-ключей для каждой роли (скрытые — просто не включаются)
  const NAV_ORDER = {
    service_delivery: ['dashboard', 'tracker', 'calendars', 'portfolio', 'entry', 'clients'],
    account_manager:  ['dashboard', 'portfolio', 'clients', 'entry', 'calendars'],
    csm_analyst:      ['dashboard', 'portfolio', 'entry', 'clients', 'calendars', 'tracker'],
  };
  const order = NAV_ORDER[role] || NAV_ORDER['csm_analyst'];

  // Перестроить sidebar ul.nav-links
  const navUl = document.querySelector('#sidebar .nav-links');
  if (navUl) {
    // Собираем все li с data-page (включая #nav-tracker-li)
    const allLi = Array.from(navUl.querySelectorAll('li[id], li:has(a[data-page])'));
    const liMap = {};
    allLi.forEach(li => {
      const a = li.querySelector('a[data-page]');
      if (a) liMap[a.dataset.page] = li;
    });
    // Удаляем все nav-li из DOM, затем вставляем в нужном порядке
    allLi.forEach(li => li.remove());
    order.forEach(page => {
      const li = liMap[page];
      if (li) { li.style.display = ''; navUl.appendChild(li); }
    });
    // Скрытые для account_manager: tracker, delivery
    if (role === 'account_manager') {
      ['tracker'].forEach(page => {
        const li = liMap[page];
        if (li) { li.style.display = 'none'; navUl.appendChild(li); }
      });
    }
  }

  // Применить видимость по cfg.modules (существующая логика)
  const NAV_MAP = { dashboard:'dashboard', portfolio:'portfolio', entry:'entry', clients:'clients' };
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    const key = NAV_MAP[el.dataset.page];
    if (key && cfg.modules[key] === false) el.closest('li')?.style.setProperty('display','none');
  });
  document.querySelectorAll('.bottom-nav-btn[data-page]').forEach(el => {
    const key = NAV_MAP[el.dataset.page];
    el.style.display = (key && cfg.modules[key] === false) ? 'none' : '';
  });

  // Трекер: видим только для service_delivery и csm_analyst
  const showTracker = ['service_delivery', 'csm_analyst'].includes(role);
  const navLi = document.getElementById('nav-tracker-li');
  const bnBtn = document.getElementById('bn-tracker');
  if (navLi && role !== 'account_manager') navLi.style.display = showTracker ? '' : 'none';
  if (bnBtn) bnBtn.style.display = showTracker ? '' : 'none';
}

/* ======== ROLE ONBOARDING (встроен из js/onboarding.js) ======== */
const RoleOnboarding = {
  _ROLE_KEY: 'bchs_role',
  _ROLES: [
    { id:'service_delivery', icon:'🎯', label:'Service Delivery',
      description:'Операционное управление командой. Утилизация, аллокация, замены, эскалации.',
      tags:['FTE & часы','Замены','Эскалации','Команда'] },
    { id:'account_manager', icon:'🤝', label:'Account Manager',
      description:'Управление отношениями с клиентом. Revenue, здоровье аккаунта, активности.',
      tags:['Revenue','bCHS','Статусы','Активности'] },
    { id:'csm_analyst', icon:'📊', label:'CSM / Analyst',
      description:'Полный доступ. Стратегии, прогнозы, Monte Carlo, BCG-анализ.',
      tags:['Полный доступ','Monte Carlo','BCG','AI-стратегии'] },
  ],
  isNeeded() {
    try { const r = localStorage.getItem(this._ROLE_KEY); return !r || !ROLE_CONFIG[r]; } catch { return false; }
  },
  show(onDone) {
    this._onDone = onDone || (() => {});
    const overlay = this._buildOverlay();
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.classList.add('rob-visible');
      overlay.querySelectorAll('.rob-card').forEach((c,i) => setTimeout(() => c.classList.add('rob-card-visible'), i * 110));
    });
  },
  _buildOverlay() {
    const el = document.createElement('div');
    el.id = 'role-onboarding-overlay';
    el.className = 'rob-overlay';
    const cards = this._ROLES.map((r,i) => `
      <div class="rob-card" data-role="${r.id}" style="animation-delay:${i*100}ms">
        <div class="rob-card-icon">${r.icon}</div>
        <div class="rob-card-label">${r.label}</div>
        <div class="rob-card-desc">${r.description}</div>
        <div class="rob-tags">${r.tags.map(t=>`<span class="rob-tag">${t}</span>`).join('')}</div>
      </div>`).join('');
    el.innerHTML = `
      <div class="rob-box">
        <div class="rob-header">
          <div class="rob-logo">▣</div>
          <h1 class="rob-title">Добро пожаловать в BCHS</h1>
          <p class="rob-subtitle">Выбери свою роль — платформа настроится под тебя.<br>Это можно изменить позже в настройках.</p>
        </div>
        <div class="rob-cards" id="rob-cards">${cards}</div>
        <div class="rob-footer">
          <button class="btn btn-primary rob-start-btn" id="rob-start-btn" disabled>Начать работу</button>
          <div class="rob-hint" id="rob-hint">Выберите роль чтобы продолжить</div>
        </div>
      </div>`;
    let selected = null;
    el.addEventListener('click', e => {
      const card = e.target.closest('.rob-card');
      if (!card) return;
      el.querySelectorAll('.rob-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selected = card.dataset.role;
      const btn = el.querySelector('#rob-start-btn');
      const hint = el.querySelector('#rob-hint');
      btn.disabled = false;
      const cfg = ROLE_CONFIG[selected];
      if (hint && cfg) hint.textContent = cfg.welcome_message;
    });
    el.querySelector('#rob-start-btn').addEventListener('click', () => {
      if (!selected) return;
      try { localStorage.setItem(this._ROLE_KEY, selected); } catch {}
      applyRoleToNav();
      el.classList.add('rob-hiding');
      setTimeout(() => {
        el.remove();
        const cfg = ROLE_CONFIG[selected];
        if (cfg && typeof App !== 'undefined') App.toast(`${cfg.icon} ${cfg.welcome_message}`, 'success');
        this._onDone(selected);
      }, 380);
    });
    return el;
  },
};

/* ======== ROLE SELECTOR (смена роли в настройках) ======== */
/** Обновляет баннер роли в сайдбаре по текущей роли из ROLE_CONFIG */
function _updateRoleBanner() {
  const banner = document.getElementById('role-banner');
  if (!banner) return;
  try {
    const roleId = localStorage.getItem('bchs_role');
    const cfg    = ROLE_CONFIG[roleId];
    if (!cfg) {
      // Роль не выбрана — показываем дефолт
      banner.className = 'role-banner role-admin';
      banner.innerHTML = `<span class="role-icon">🔑</span><span class="role-name">Полный доступ</span><span class="role-tag">Все модули</span>`;
      return;
    }
    // Маппинг id роли → CSS-класс баннера
    const clsMap = {
      service_delivery: 'role-sd',
      account_manager:  'role-am',
      csm_analyst:      'role-admin',
    };
    banner.className = `role-banner ${clsMap[roleId] || 'role-admin'}`;
    banner.innerHTML = `<span class="role-icon">${cfg.icon}</span><span class="role-name">${cfg.label}</span><span class="role-tag">Portfolio BCHS</span>`;
  } catch {
    // Молча падаем — не критично
  }
}

const RoleSelector = {
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const current = getCurrentRole();
    const cards = Object.entries(ROLE_CONFIG).map(([id, cfg]) => `
      <div class="rs-card ${id===current?'rs-card-active':''}" data-role="${id}">
        <span class="rs-icon">${cfg.icon}</span>
        <span class="rs-label">${cfg.label}</span>
        ${id===current?'<span class="rs-current-badge">текущая</span>':''}
      </div>`).join('');
    el.innerHTML = `
      <div class="rs-wrap">
        <div class="form-section-title" style="margin-bottom:12px">🔖 Моя роль</div>
        <div class="rs-cards">${cards}</div>
        <div class="rs-msg" id="rs-msg" style="display:none"></div>
      </div>`;
    el.querySelectorAll('.rs-card').forEach(card => {
      card.addEventListener('click', () => {
        const picked = card.dataset.role;
        el.querySelectorAll('.rs-card').forEach(c => c.classList.remove('rs-card-active'));
        card.classList.add('rs-card-active');
        setCurrentRole(picked);
        applyRoleToNav();
        _updateRoleBanner();
        const msg = el.querySelector('#rs-msg');
        if (msg) { msg.textContent = `✅ Роль изменена на «${ROLE_CONFIG[picked]?.label}»`; msg.style.display='block'; }
        if (typeof App !== 'undefined') App.toast(`Роль: ${ROLE_CONFIG[picked]?.label}`, 'success');
      });
    });
  },
};

/* ======== FLOW MANAGER (встроен из js/flow_manager.js) ======== */
const FlowManager = {
  _mode: null, _queue: [], _queueIndex: 0, _dismissed: new Set(), _panelOpen: false,

  init() { this._restoreSession(); this._mountPanel(); },

  _restoreSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem('bchs_flow') || 'null');
      if (!s) return;
      this._mode = s.mode||null; this._queue = s.queue||[]; this._queueIndex = s.queueIndex||0;
      this._dismissed = new Set(s.dismissed||[]);
    } catch {}
  },

  _saveSession() {
    try {
      sessionStorage.setItem('bchs_flow', JSON.stringify({
        mode: this._mode, queue: this._queue, queueIndex: this._queueIndex,
        dismissed: [...this._dismissed],
      }));
    } catch {}
  },

  _mountPanel() {
    if (document.getElementById('flow-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'flow-panel'; panel.className = 'fp-wrap';
    panel.innerHTML = `
      <div class="fp-menu" id="fp-menu" style="display:none">
        <div class="fp-menu-item" id="fp-mode-tour"><span class="fp-mode-icon">🗺️</span><div><div class="fp-mode-label">Обойти портфель</div><div class="fp-mode-desc">Клиенты требующие внимания</div></div></div>
        <div class="fp-menu-item" id="fp-mode-client"><span class="fp-mode-icon">🔍</span><div><div class="fp-mode-label">Работа с клиентом</div><div class="fp-mode-desc">Умные подсказки по аккаунту</div></div></div>
        <div class="fp-menu-item" id="fp-mode-entry"><span class="fp-mode-icon">✍️</span><div><div class="fp-mode-label">Быстрый ввод</div><div class="fp-mode-desc">Шорткат к внесению данных</div></div></div>
      </div>
      <button class="fp-btn" id="fp-toggle-btn" title="Режим работы"><span class="fp-btn-icon">⚡</span></button>`;
    document.body.appendChild(panel);
    const btn = panel.querySelector('#fp-toggle-btn');
    const menu = panel.querySelector('#fp-menu');
    btn.addEventListener('click', () => {
      this._panelOpen = !this._panelOpen;
      menu.style.display = this._panelOpen ? 'flex' : 'none';
      btn.classList.toggle('fp-btn-open', this._panelOpen);
    });
    panel.querySelector('#fp-mode-tour').addEventListener('click', () => { this._closeMenu(); this._startTour(); });
    panel.querySelector('#fp-mode-client').addEventListener('click', () => { this._closeMenu(); this._startClientMode(); });
    panel.querySelector('#fp-mode-entry').addEventListener('click', () => { this._closeMenu(); this._startQuickEntry(); });
    document.addEventListener('click', e => { if (!panel.contains(e.target)) this._closeMenu(); });
  },

  _closeMenu() {
    this._panelOpen = false;
    const m = document.getElementById('fp-menu'); if (m) m.style.display = 'none';
    document.getElementById('fp-toggle-btn')?.classList.remove('fp-btn-open');
  },

  async _startTour() {
    const computed = DashboardPage.computed || [];
    if (!computed.length) { await DashboardPage.load(); }
    this._queue = this._buildTourQueue(DashboardPage.computed || []);
    this._queueIndex = 0; this._mode = 'tour'; this._saveSession();
    if (!this._queue.length) { App.toast('✅ Портфель в порядке — нет клиентов требующих внимания', 'success'); return; }
    App.toast(`🗺️ Обход: ${this._queue.length} клиентов требуют внимания`, '');
    this._tourNext();
  },

  _buildTourQueue(computed) {
    const curM = new Date().getMonth()+1, curY = new Date().getFullYear();
    return computed.map(r => {
      let s = 0;
      const noEntry = !r._lastEntryMs || (() => { const d=new Date(r._lastEntryMs); return !(d.getMonth()+1===curM&&d.getFullYear()===curY); })();
      if (noEntry)                                   s += 40;
      if (r.health?.key === 'AtRisk')                s += 30;
      else if (r.health?.key === 'Caution')          s += 20;
      if (r._daysSince != null && r._daysSince > 30) s += 15;
      if ((r.trend3m ?? 0) < 0)                      s += 10;
      return { id: r.client.id, score: s };
    }).filter(r => r.score > 0).sort((a,b) => b.score - a.score).map(r => r.id);
  },

  _tourNext() {
    if (this._queueIndex >= this._queue.length) { this._endTour(); return; }
    const clientId = this._queue[this._queueIndex];
    App.navigate('detail', clientId);
    setTimeout(() => this._renderTourBar(), 300);
  },

  _renderTourBar() {
    if (document.getElementById('flow-tour-bar')) return;
    const total = this._queue.length, current = this._queueIndex + 1;
    const bar = document.createElement('div');
    bar.id = 'flow-tour-bar'; bar.className = 'ftb-wrap';
    bar.innerHTML = `
      <div class="ftb-track"><div class="ftb-fill" style="width:${Math.round(current/total*100)}%"></div></div>
      <div class="ftb-meta">
        <span class="ftb-label">🗺️ Обход портфеля: <strong>${current} / ${total}</strong></span>
        <div class="ftb-actions">
          <button class="btn btn-secondary btn-sm" id="ftb-skip">Пропустить</button>
          <button class="btn btn-primary btn-sm" id="ftb-next">Следующий →</button>
          <button class="btn btn-sm" style="color:var(--md-on-surf-d)" id="ftb-end">Завершить</button>
        </div>
      </div>`;
    document.getElementById('main-content')?.insertAdjacentElement('afterbegin', bar);
    document.getElementById('ftb-next').addEventListener('click', () => { this._queueIndex++; this._saveSession(); this._tourNext(); });
    document.getElementById('ftb-skip').addEventListener('click', () => { this._queueIndex++; this._saveSession(); this._tourNext(); });
    document.getElementById('ftb-end').addEventListener('click', () => this._endTour());
  },

  _endTour() {
    this._mode = null; this._queue = []; this._queueIndex = 0; this._saveSession();
    document.getElementById('flow-tour-bar')?.remove();
    App.toast('✅ Обход завершён', 'success'); App.navigate('dashboard');
  },

  _startClientMode() {
    const computed = DashboardPage.computed || [];
    if (!computed.length) { App.toast('Нет клиентов в портфеле', ''); return; }
    const opts = computed.map(r => `<option value="${r.client.id}">${r.client.name}</option>`).join('');
    App.openModal(`
      <div style="padding:4px 0 16px">
        <div style="font-size:16px;font-weight:600;margin-bottom:4px">🔍 Работа с клиентом</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Выберите клиента — платформа покажет умные подсказки</div>
      </div>
      <div style="margin-bottom:16px"><label class="form-label">Клиент</label>
        <select class="form-select" id="fcp-client-sel"><option value="">— выберите —</option>${opts}</select>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px">
        <button class="btn btn-secondary" id="fcp-cancel">Отмена</button>
        <button class="btn btn-primary" id="fcp-go">Открыть →</button>
      </div>`);
    document.getElementById('fcp-cancel').addEventListener('click', () => App.closeModal());
    document.getElementById('fcp-go').addEventListener('click', () => {
      const sel = document.getElementById('fcp-client-sel');
      if (!sel?.value) { App.toast('Выберите клиента', ''); return; }
      this._mode = 'client'; this._saveSession(); App.closeModal();
      App.navigate('detail', sel.value);
      setTimeout(() => this._renderClientHints(sel.value), 400);
    });
  },

  async _renderClientHints(clientId) {
    const row = (DashboardPage.computed||[]).find(r => String(r.client.id) === String(clientId));
    if (!row) return;
    const hints = await this._buildHints(row);
    if (!hints.length) return;
    const wrap = document.createElement('div');
    wrap.id = 'flow-hints-wrap'; wrap.className = 'fh-wrap';
    wrap.innerHTML = hints.slice(0,2).map(h => `
      <div class="fh-card" data-hint="${h.id}">
        <span class="fh-icon">${h.icon}</span>
        <div class="fh-body">
          <div class="fh-text">${h.text}</div>
          ${h.action ? `<button class="btn btn-sm btn-tonal fh-action" data-action="${h.action}" data-client="${clientId}">${h.actionLabel}</button>` : ''}
        </div>
        <button class="fh-close" title="Закрыть">✕</button>
      </div>`).join('');
    wrap.querySelectorAll('.fh-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const hintId = btn.closest('.fh-card').dataset.hint;
        this._dismissed.add(hintId); this._saveSession();
        btn.closest('.fh-card').remove();
        if (!wrap.querySelector('.fh-card')) wrap.remove();
      });
    });
    wrap.querySelectorAll('.fh-action').forEach(btn => {
      btn.addEventListener('click', () => this._handleHintAction(btn.dataset.action, btn.dataset.client));
    });
    const hero = document.querySelector('.detail-hero') || document.querySelector('.detail-header');
    if (hero) hero.insertAdjacentElement('afterend', wrap);
  },

  async _buildHints(row) {
    const hints = [], cid = row.client.id;
    const curM = new Date().getMonth()+1, curY = new Date().getFullYear();
    if (row.health?.key==='AtRisk' && !this._dismissed.has(`atrisk_${cid}`))
      hints.push({ id:`atrisk_${cid}`, icon:'⚠️', text:'Клиент в зоне риска — внести эскалацию?', action:`entry_${cid}`, actionLabel:'Внести', priority:100 });
    const noEntry = !row._lastEntryMs || (() => { const d=new Date(row._lastEntryMs); return !(d.getMonth()+1===curM&&d.getFullYear()===curY); })();
    if (noEntry && !this._dismissed.has(`noentry_${cid}`))
      hints.push({ id:`noentry_${cid}`, icon:'📝', text:'Нет данных за этот месяц — занести статус?', action:`entry_${cid}`, actionLabel:'Занести', priority:90 });
    if ((row.trend3m??0)<-10 && !this._dismissed.has(`trend_${cid}`))
      hints.push({ id:`trend_${cid}`, icon:'📉', text:'Негативный тренд 3 месяца — проверить историю?', action:`history_${cid}`, actionLabel:'История', priority:70 });
    try {
      const res = await fetch('tables/status_entries?limit=500');
      const json = await res.json();
      const rows = Array.isArray(json.data)?json.data:Array.isArray(json)?json:[];
      const mine = rows.filter(r=>String(r.client_id)===String(cid));
      const noStatus = !mine.length || (Date.now()-(mine.sort((a,b)=>(b.created_at||0)-(a.created_at||0))[0].created_at||0))>14*86400*1000;
      if (noStatus && !this._dismissed.has(`nostatus_${cid}`))
        hints.push({ id:`nostatus_${cid}`, icon:'💬', text:'Давно не было статус-встречи — занести?', action:`status_${cid}`, actionLabel:'Занести', priority:60 });
    } catch {}
    return hints.sort((a,b)=>b.priority-a.priority);
  },

  _handleHintAction(action, clientId) {
    if (action.startsWith('entry_'))   { App.navigate('entry', action.replace('entry_','')); }
    else if (action.startsWith('history_')) { App.navigate('detail',clientId); setTimeout(()=>document.querySelector('[data-tab="history"]')?.click(),400); }
    else if (action.startsWith('status_')) { App.navigate('detail',clientId); setTimeout(()=>document.querySelector('[data-tab="status-log"]')?.click(),400); }
  },

  _startQuickEntry() { this._mode='quick_entry'; this._saveSession(); App.navigate('entry'); },

  reset() {
    this._mode=null; this._queue=[]; this._queueIndex=0; this._saveSession();
    document.getElementById('flow-tour-bar')?.remove();
    document.getElementById('flow-hints-wrap')?.remove();
  },
};

/* ======== ONBOARDING (legacy, оставлен для совместимости) ======== */
const Onboarding = {
  _key: 'bchs_onboarded',
  isDone()   { return !!localStorage.getItem(this._key); },
  markDone() { localStorage.setItem(this._key, '1'); },
  show(clients) {
    const overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    this._render(overlay, clients);
  },
  _render(overlay, clients) {
    const owners = Role.ownerList(clients||[]);
    const ownerOpts = owners.map(o => `<option value="${o}">${o}</option>`).join('');
    overlay.innerHTML = `
      <div class="onboard-box">
        <div class="onboard-logo">▣</div>
        <div class="onboard-title">Portfolio BCHS</div>
        <div class="onboard-sub">Система управления здоровьем клиентского портфеля.<br>Настроим ваше рабочее пространство за 30 секунд.</div>
        <div class="onboard-dots">
          <div class="onboard-dot active" id="ob-dot-1"></div>
          <div class="onboard-dot" id="ob-dot-2"></div>
          <div class="onboard-dot" id="ob-dot-3"></div>
        </div>
        <div id="ob-step-1" class="onboard-step">
          <div class="onboard-step-label">Шаг 1 из 3 — Ваша роль</div>
          <div class="onboard-role-btns">
            <button class="onboard-role-btn active" id="ob-role-admin"><span class="ob-icon">🔑</span><span class="ob-name">Администратор</span><span class="ob-desc">Вижу весь портфель</span></button>
            <button class="onboard-role-btn" id="ob-role-worker"><span class="ob-icon">👤</span><span class="ob-name">Менеджер</span><span class="ob-desc">Только мои клиенты</span></button>
          </div>
          <div id="ob-name-wrap" class="hidden" style="margin-top:8px">
            <label class="form-label">Ваше имя (для фильтрации клиентов)</label>
            ${owners.length > 0
              ? `<select class="form-select" id="ob-name-sel"><option value="">— выберите —</option>${ownerOpts}<option value="__custom">Ввести вручную...</option></select><input class="form-input hidden" id="ob-name-custom" style="margin-top:6px" placeholder="Введите имя" />`
              : `<input class="form-input" id="ob-name-input" placeholder="Например: Марина Волкова" />`
            }
          </div>
          <button class="btn btn-primary" id="ob-next-1" style="margin-top:16px;width:100%">Далее →</button>
        </div>
        <div id="ob-step-2" class="onboard-step hidden">
          <div class="onboard-step-label">Шаг 2 из 3 — Что умеет система</div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
            <div style="display:flex;align-items:flex-start;gap:10px"><span style="font-size:20px">📊</span><div><strong style="font-size:13px">bCHS Score</strong><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Индекс здоровья клиента по 25 сигналам лояльности</div></div></div>
            <div style="display:flex;align-items:flex-start;gap:10px"><span style="font-size:20px">🎲</span><div><strong style="font-size:13px">Monte Carlo прогноз</strong><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">5 000 сценариев на 3, 6 и 12 месяцев вперёд</div></div></div>
            <div style="display:flex;align-items:flex-start;gap:10px"><span style="font-size:20px">⚖️</span><div><strong style="font-size:13px">% реализации потенциала</strong><div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Насколько клиент загружен относительно своего BCG-идеала</div></div></div>
          </div>
          <div style="display:flex;gap:8px"><button class="btn btn-secondary" id="ob-back-2" style="flex:1">← Назад</button><button class="btn btn-primary" id="ob-next-2" style="flex:2">Далее →</button></div>
        </div>
        <div id="ob-step-3" class="onboard-step hidden">
          <div class="onboard-step-label">Шаг 3 из 3 — Готово!</div>
          <div style="text-align:center;padding:16px 0">
            <div style="font-size:48px;margin-bottom:12px">🚀</div>
            <div style="font-size:15px;font-weight:700;margin-bottom:8px">Всё настроено</div>
            <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:20px">Совет: нажмите <kbd>N</kbd> — добавить данные<br><kbd>Esc</kbd> — назад · <kbd>R</kbd> — обновить дашборд</div>
          </div>
          <div style="display:flex;gap:8px"><button class="btn btn-secondary" id="ob-back-3" style="flex:1">← Назад</button><button class="btn btn-primary" id="ob-done" style="flex:2">🚀 Начать работу</button></div>
        </div>
      </div>`;

    let pickedRole = 'admin';
    const goToStep = (n) => {
      [1,2,3].forEach(i => {
        document.getElementById(`ob-step-${i}`).classList.toggle('hidden', i!==n);
        document.getElementById(`ob-dot-${i}`).classList.toggle('active', i===n);
      });
    };
    overlay.querySelector('#ob-role-admin').addEventListener('click', () => {
      pickedRole = 'admin';
      overlay.querySelector('#ob-role-admin').classList.add('active');
      overlay.querySelector('#ob-role-worker').classList.remove('active');
      document.getElementById('ob-name-wrap').classList.add('hidden');
    });
    overlay.querySelector('#ob-role-worker').addEventListener('click', () => {
      pickedRole = 'worker';
      overlay.querySelector('#ob-role-worker').classList.add('active');
      overlay.querySelector('#ob-role-admin').classList.remove('active');
      document.getElementById('ob-name-wrap').classList.remove('hidden');
    });
    const nameSel = document.getElementById('ob-name-sel');
    if (nameSel) nameSel.addEventListener('change', () => { const c = document.getElementById('ob-name-custom'); if (c) c.classList.toggle('hidden', nameSel.value !== '__custom'); });
    overlay.querySelector('#ob-next-1').addEventListener('click', () => {
      if (pickedRole === 'worker') {
        let name = '';
        const sel = document.getElementById('ob-name-sel');
        const inp = document.getElementById('ob-name-input');
        const cust = document.getElementById('ob-name-custom');
        if (sel) name = sel.value === '__custom' ? (cust?.value||'').trim() : sel.value;
        else if (inp) name = inp.value.trim();
        if (!name) { App.toast('Введите имя менеджера', 'error'); return; }
        Role.setWorkerSilent(name);
      } else { Role.setAdminSilent(); }
      goToStep(2);
    });
    overlay.querySelector('#ob-back-2').addEventListener('click', () => goToStep(1));
    overlay.querySelector('#ob-next-2').addEventListener('click', () => goToStep(3));
    overlay.querySelector('#ob-back-3').addEventListener('click', () => goToStep(2));
    overlay.querySelector('#ob-done').addEventListener('click', () => {
      this.markDone();
      overlay.classList.add('hidden');
      Role._updateUI();
      DashboardPage.render();
    });
  },
};

/* ======== APP ======== */
const App = {
  async init() {
    document.querySelectorAll('.nav-item').forEach(l => l.addEventListener('click', e => {
      e.preventDefault(); this.navigate(l.dataset.page);
      document.getElementById('sidebar').classList.remove('open');
    }));
    document.getElementById('menu-toggle').addEventListener('click', () =>
      document.getElementById('sidebar').classList.toggle('open'));
    document.getElementById('topbar-add').addEventListener('click', () => this.navigate('entry'));
    document.addEventListener('click', e => {
      const sb = document.getElementById('sidebar');
      if (sb.classList.contains('open') && !sb.contains(e.target) && e.target.id!=='menu-toggle')
        sb.classList.remove('open');
    });
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) this.closeModal();
    });
    const roleBtn = document.getElementById('role-toggle-btn');
    if (roleBtn) roleBtn.addEventListener('click', () => {
      // Открываем модал смены роли (новая система: Service Delivery / AM / CSM)
      const html = `
        <div style="min-width:340px">
          <h2 class="modal-title" style="margin-bottom:4px">🔖 Моя роль</h2>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:18px">
            Выберите роль — это изменит видимость модулей в навигации
          </p>
          <div id="role-selector-container"></div>
          <div class="modal-actions" style="margin-top:20px">
            <button class="btn btn-ghost" onclick="App.closeModal()">Закрыть</button>
          </div>
        </div>`;
      App.openModal(html);
      RoleSelector.render('role-selector-container');
      // После смены роли — обновляем баннер и перерисовываем дашборд
      const orig = setCurrentRole;
      const observer = new MutationObserver(() => {
        _updateRoleBanner();
      });
      observer.observe(
        document.getElementById('role-selector-container'),
        { subtree: true, attributes: true, attributeFilter: ['class'] }
      );
    });
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page) this.navigate(page);
        document.getElementById('sidebar').classList.remove('open');
      });
    });
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (document.getElementById('modal-overlay') && !document.getElementById('modal-overlay').classList.contains('hidden')) {
        if (e.key === 'Escape') this.closeModal();
        return;
      }
      switch(e.key) {
        case 'n': case 'N': this.navigate('entry');     break;
        case 'Escape':      this.navigate('dashboard'); break;
        case 'r': case 'R': DashboardPage.load();       break;
      }
    });
    Role._updateUI();
    _updateRoleBanner(); // синхронизируем баннер с новой системой ролей
    try { await SEED.run(); } catch(e) { console.warn('[Seed]', e.message); }

    const backupBtn = document.getElementById('backup-btn');
    if (backupBtn) {
      backupBtn.addEventListener('click', () => Backup.openModal());
    }

    // ── Calendar Engine — фоновая инициализация (кэш) ──────────
    if (window.CalendarEngine) CalendarEngine.init();

    // ── Применяем роль к навигации ─────────────────────────────
    applyRoleToNav();

    // ── Flow Manager — плавающая панель режимов ────────────────
    FlowManager.init();

    // ── Выбор роли при первом запуске ──────────────────────────
    if (RoleOnboarding.isNeeded()) {
      // Сначала рендерим дашборд (фон), потом показываем онбординг
      await this.navigate('dashboard');
      RoleOnboarding.show(async (roleId) => {
        // После выбора роли — перезагружаем дашборд с правильными модулями
        applyRoleToNav();
        await this.navigate('dashboard');
      });
    } else if (!Onboarding.isDone()) {
      // Legacy onboarding (выбор Admin/Worker) если роль уже есть
      await this.navigate('dashboard');
      const clients = await API.getClients();
      Onboarding.show(clients||[]);
    } else {
      await this.navigate('dashboard');
    }
  },


  async navigate(page, param) {
    document.querySelectorAll('.nav-item').forEach(l =>
      l.classList.toggle('active', l.dataset.page===page || (page==='detail'&&l.dataset.page==='dashboard')));
    document.querySelectorAll('.bottom-nav-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.page===page || (page==='detail'&&b.dataset.page==='dashboard')));
    window.scrollTo({top:0,behavior:'smooth'});
    switch(page) {
      case 'dashboard': await DashboardPage.render(); break;
      case 'entry':     await EntryPage.render(param||null); break;
      case 'detail':    param ? await DetailPage.render(param) : await DashboardPage.render(); break;
      case 'clients':   await ClientsPage.render(param||null); break;
      case 'portfolio': await PortfolioPage.render(); break;
      case 'calendars': await CalendarsPage.render(); break;
      case 'tracker':   await TrackerPage.render(param ? {clientId: param} : {}); break;
      default:          await DashboardPage.render();
    }
  },

  navigateEntryMonthYear(cid, month, year) {
    EntryPage._pendingMonth = month; EntryPage._pendingYear = year;
    this.navigate('entry', cid);
  },

  openModal(html) {
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },
  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-content').innerHTML = '';
  },

  toast(msg, type) {
    const c = document.createElement('div');
    c.className = `toast${type?' '+type:''}`;
    c.textContent = msg;
    document.getElementById('toast-container').appendChild(c);
    setTimeout(() => { c.style.opacity='0'; c.style.transition='opacity .3s'; setTimeout(()=>c.remove(),300); }, 2800);
  },
};

/* ══════════════════════════════════════════════════════════════
   CALENDAR ENGINE — встроенный модуль
   ══════════════════════════════════════════════════════════════ */

/* ── Поддерживаемые локации ──────────────────────────────────── */
const SUPPORTED_LOCATIONS = {
  BY: { id:'BY', name:'Беларусь',       flag:'🇧🇾', timezone:'Europe/Minsk',    apiCode:'BY' },
  PL: { id:'PL', name:'Польша',         flag:'🇵🇱', timezone:'Europe/Warsaw',   apiCode:'PL' },
  DE: { id:'DE', name:'Германия / EU',  flag:'🇩🇪', timezone:'Europe/Berlin',   apiCode:'DE' },
  US: { id:'US', name:'США',            flag:'🇺🇸', timezone:'America/New_York',apiCode:'US' },
};

/* ── Константы кэша ──────────────────────────────────────────── */
const CE_CACHE_KEY   = 'bchs_calendar_cache';
const CE_CUSTOM_KEY  = 'bchs_custom_calendars';
const CE_CACHE_TTL   = 30 * 24 * 60 * 60 * 1000;
const CE_API_TIMEOUT = 5000;
const CE_API_BASE    = 'https://date.nager.at/api/v3/PublicHolidays';

const CE_MONTHS_RU = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];

/* ── FALLBACK хардкод ────────────────────────────────────────── */
const CE_FALLBACK = {
  BY: {
    '2025-01':{ workdays:23, hours:184, holidays:['2025-01-01','2025-01-07'] },
    '2025-02':{ workdays:20, hours:160, holidays:[] },
    '2025-03':{ workdays:20, hours:160, holidays:['2025-03-08'] },
    '2025-04':{ workdays:22, hours:176, holidays:[] },
    '2025-05':{ workdays:20, hours:160, holidays:['2025-05-01','2025-05-09'] },
    '2025-06':{ workdays:20, hours:160, holidays:[] },
    '2025-07':{ workdays:23, hours:184, holidays:['2025-07-03'] },
    '2025-08':{ workdays:21, hours:168, holidays:[] },
    '2025-09':{ workdays:22, hours:176, holidays:[] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:19, hours:152, holidays:['2025-11-07'] },
    '2025-12':{ workdays:22, hours:176, holidays:['2025-12-25'] },
    '2026-01':{ workdays:20, hours:160, holidays:['2026-01-01','2026-01-07'] },
    '2026-02':{ workdays:20, hours:160, holidays:[] },
    '2026-03':{ workdays:20, hours:160, holidays:['2026-03-08'] },
    '2026-04':{ workdays:22, hours:176, holidays:[] },
    '2026-05':{ workdays:19, hours:152, holidays:['2026-05-01','2026-05-09'] },
    '2026-06':{ workdays:21, hours:168, holidays:[] },
    '2026-07':{ workdays:23, hours:184, holidays:['2026-07-03'] },
    '2026-08':{ workdays:20, hours:160, holidays:[] },
    '2026-09':{ workdays:22, hours:176, holidays:[] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:20, hours:160, holidays:['2026-11-07'] },
    '2026-12':{ workdays:22, hours:176, holidays:['2026-12-25'] },
  },
  PL: {
    '2025-01':{ workdays:23, hours:184, holidays:['2025-01-01','2025-01-06'] },
    '2025-02':{ workdays:20, hours:160, holidays:[] },
    '2025-03':{ workdays:20, hours:160, holidays:[] },
    '2025-04':{ workdays:21, hours:168, holidays:['2025-04-18','2025-04-21'] },
    '2025-05':{ workdays:19, hours:152, holidays:['2025-05-01','2025-05-03'] },
    '2025-06':{ workdays:20, hours:160, holidays:['2025-06-19'] },
    '2025-07':{ workdays:23, hours:184, holidays:[] },
    '2025-08':{ workdays:20, hours:160, holidays:['2025-08-15'] },
    '2025-09':{ workdays:22, hours:176, holidays:[] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:18, hours:144, holidays:['2025-11-01','2025-11-11'] },
    '2025-12':{ workdays:21, hours:168, holidays:['2025-12-25','2025-12-26'] },
    '2026-01':{ workdays:22, hours:176, holidays:['2026-01-01','2026-01-06'] },
    '2026-02':{ workdays:20, hours:160, holidays:[] },
    '2026-03':{ workdays:21, hours:168, holidays:[] },
    '2026-04':{ workdays:21, hours:168, holidays:['2026-04-03','2026-04-06'] },
    '2026-05':{ workdays:18, hours:144, holidays:['2026-05-01','2026-05-03'] },
    '2026-06':{ workdays:21, hours:168, holidays:['2026-06-04'] },
    '2026-07':{ workdays:23, hours:184, holidays:[] },
    '2026-08':{ workdays:20, hours:160, holidays:['2026-08-15'] },
    '2026-09':{ workdays:22, hours:176, holidays:[] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:19, hours:152, holidays:['2026-11-01','2026-11-11'] },
    '2026-12':{ workdays:21, hours:168, holidays:['2026-12-25','2026-12-26'] },
  },
  DE: {
    '2025-01':{ workdays:23, hours:184, holidays:['2025-01-01'] },
    '2025-02':{ workdays:20, hours:160, holidays:[] },
    '2025-03':{ workdays:20, hours:160, holidays:[] },
    '2025-04':{ workdays:21, hours:168, holidays:['2025-04-18','2025-04-21'] },
    '2025-05':{ workdays:20, hours:160, holidays:['2025-05-01'] },
    '2025-06':{ workdays:20, hours:160, holidays:[] },
    '2025-07':{ workdays:23, hours:184, holidays:[] },
    '2025-08':{ workdays:21, hours:168, holidays:[] },
    '2025-09':{ workdays:22, hours:176, holidays:[] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:20, hours:160, holidays:[] },
    '2025-12':{ workdays:21, hours:168, holidays:['2025-12-25','2025-12-26'] },
    '2026-01':{ workdays:22, hours:176, holidays:['2026-01-01'] },
    '2026-02':{ workdays:20, hours:160, holidays:[] },
    '2026-03':{ workdays:21, hours:168, holidays:[] },
    '2026-04':{ workdays:21, hours:168, holidays:['2026-04-03','2026-04-06'] },
    '2026-05':{ workdays:20, hours:160, holidays:['2026-05-01'] },
    '2026-06':{ workdays:21, hours:168, holidays:[] },
    '2026-07':{ workdays:23, hours:184, holidays:[] },
    '2026-08':{ workdays:20, hours:160, holidays:[] },
    '2026-09':{ workdays:22, hours:176, holidays:[] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:20, hours:160, holidays:[] },
    '2026-12':{ workdays:21, hours:168, holidays:['2026-12-25','2026-12-26'] },
  },
  US: {
    '2025-01':{ workdays:22, hours:176, holidays:['2025-01-01','2025-01-20'] },
    '2025-02':{ workdays:19, hours:152, holidays:['2025-02-17'] },
    '2025-03':{ workdays:21, hours:168, holidays:[] },
    '2025-04':{ workdays:22, hours:176, holidays:[] },
    '2025-05':{ workdays:21, hours:168, holidays:['2025-05-26'] },
    '2025-06':{ workdays:20, hours:160, holidays:['2025-06-19'] },
    '2025-07':{ workdays:22, hours:176, holidays:['2025-07-04'] },
    '2025-08':{ workdays:21, hours:168, holidays:[] },
    '2025-09':{ workdays:21, hours:168, holidays:['2025-09-01'] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:19, hours:152, holidays:['2025-11-11','2025-11-27'] },
    '2025-12':{ workdays:22, hours:176, holidays:['2025-12-25'] },
    '2026-01':{ workdays:21, hours:168, holidays:['2026-01-01','2026-01-19'] },
    '2026-02':{ workdays:19, hours:152, holidays:['2026-02-16'] },
    '2026-03':{ workdays:21, hours:168, holidays:[] },
    '2026-04':{ workdays:22, hours:176, holidays:[] },
    '2026-05':{ workdays:20, hours:160, holidays:['2026-05-25'] },
    '2026-06':{ workdays:21, hours:168, holidays:['2026-06-19'] },
    '2026-07':{ workdays:22, hours:176, holidays:['2026-07-04'] },
    '2026-08':{ workdays:20, hours:160, holidays:[] },
    '2026-09':{ workdays:21, hours:168, holidays:['2026-09-07'] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:19, hours:152, holidays:['2026-11-11','2026-11-26'] },
    '2026-12':{ workdays:22, hours:176, holidays:['2026-12-25'] },
  },
};

/* ── CE утилиты ──────────────────────────────────────────────── */
function _ceLsGet(key) { try { return JSON.parse(localStorage.getItem(key)||'null'); } catch { return null; } }
function _ceLsSet(key,val) { try { localStorage.setItem(key,JSON.stringify(val)); } catch {} }
function _ceCacheKey(locId,year) { return `${locId}_${year}`; }
function _ceToISO(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function _ceCalcWorkdays(year,month,holidayDates) {
  const hs = new Set(holidayDates); let wd=0;
  const dim = new Date(year,month,0).getDate();
  for (let d=1;d<=dim;d++) {
    const dt=new Date(year,month-1,d), dow=dt.getDay();
    if (dow===0||dow===6) continue;
    if (hs.has(_ceToISO(dt))) continue;
    wd++;
  }
  return wd;
}
function _ceParseAPIResponse(apiArray,year) {
  const byM={};
  for (const item of apiArray) {
    const [y,m]=item.date.split('-'); if(Number(y)!==year) continue;
    const k=`${y}-${m}`; if(!byM[k]) byM[k]=[];
    byM[k].push(item.date);
  }
  const months={};
  for (let m=1;m<=12;m++) {
    const k=`${year}-${String(m).padStart(2,'0')}`;
    const hs=byM[k]||[];
    const wd=_ceCalcWorkdays(year,m,hs);
    months[k]={workdays:wd,hours:wd*8,holidays:hs};
  }
  return months;
}
function _ceSaveToCache(locId,year,data) {
  const cache=_ceLsGet(CE_CACHE_KEY)||{};
  cache[_ceCacheKey(locId,year)]={data,cachedAt:Date.now(),ttl:CE_CACHE_TTL};
  _ceLsSet(CE_CACHE_KEY,cache);
}
function _ceGetFromCache(locId,year) {
  const cache=_ceLsGet(CE_CACHE_KEY)||{};
  const e=cache[_ceCacheKey(locId,year)];
  if(!e) return null;
  if(Date.now()-e.cachedAt>e.ttl) return null;
  return e.data;
}
function _ceGetCacheMeta(locId,year) {
  const cache=_ceLsGet(CE_CACHE_KEY)||{};
  return cache[_ceCacheKey(locId,year)]||null;
}
async function _ceFetchFromAPI(locId,year) {
  const loc=SUPPORTED_LOCATIONS[locId]; if(!loc) return null;
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),CE_API_TIMEOUT);
  try {
    const res=await fetch(`${CE_API_BASE}/${year}/${loc.apiCode}`,{signal:ctrl.signal});
    clearTimeout(timer);
    if(!res.ok) return null;
    const arr=await res.json();
    if(!Array.isArray(arr)) return null;
    return _ceParseAPIResponse(arr,year);
  } catch { clearTimeout(timer); return null; }
}

/* ── CalendarEngine объект ───────────────────────────────────── */
const CalendarEngine = {
  async init() {
    const cy=new Date().getFullYear(), ny=cy+1;
    const locs=Object.keys(SUPPORTED_LOCATIONS);
    (async()=>{
      for (const l of locs) for (const y of [cy,ny]) {
        if(_ceGetFromCache(l,y)) continue;
        const d=await _ceFetchFromAPI(l,y);
        if(d) _ceSaveToCache(l,y,d);
      }
    })();
  },
  getMonthData(locId,ym) {
    const custom=_ceLsGet(CE_CUSTOM_KEY)||{};
    if(custom[locId]?.[ym]) return {...custom[locId][ym],source:'custom'};
    const year=Number(ym.split('-')[0]);
    const cached=_ceGetFromCache(locId,year);
    if(cached?.[ym]) return {...cached[ym],source:'api'};
    const fb=CE_FALLBACK[locId]?.[ym];
    if(fb) return {...fb,source:'fallback'};
    const [y,m]=ym.split('-').map(Number);
    const wd=_ceCalcWorkdays(y,m,[]);
    return {workdays:wd,hours:wd*8,holidays:[],source:'fallback'};
  },
  getPlannedHours(locId,ym,allocation) {
    const d=this.getMonthData(locId,ym);
    return Math.round(d.hours*(allocation||1));
  },
  getDelta(plannedHours,actualHours,ratePerHour) {
    const rate=ratePerHour||0;
    const dh=actualHours-plannedHours;
    const dm=Math.round(dh*rate);
    const eff=plannedHours>0?actualHours/plannedHours:0;
    let status,status_label;
    if(eff>=0.95){status='ok';status_label='В норме';}
    else if(eff>=0.80){status='warning';status_label='Внимание';}
    else{status='critical';status_label='Критично';}
    return{delta_hours:dh,delta_money:dm,efficiency:eff,status,status_label};
  },
  getLocations() {
    const builtin=Object.values(SUPPORTED_LOCATIONS).map(l=>({...l,source:'builtin'}));
    const custom=_ceLsGet(CE_CUSTOM_KEY)||{};
    const customLocs=Object.values(custom)
      .filter(c=>!SUPPORTED_LOCATIONS[c.id])
      .map(c=>({id:c.id,name:c.name,flag:c.flag||'🌍',source:'custom'}));
    return [...builtin,...customLocs];
  },
  getMonthName(ym) {
    const [year,month]=ym.split('-').map(Number);
    return `${CE_MONTHS_RU[month-1]} ${year}`;
  },
  currentYearMonth() {
    const now=new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  },
  nextYearMonth(ym) {
    const [y,m]=ym.split('-').map(Number);
    if(m===12) return `${y+1}-01`;
    return `${y}-${String(m+1).padStart(2,'0')}`;
  },
  async refreshCache(locId,year) {
    const d=await _ceFetchFromAPI(locId,year);
    if(d){_ceSaveToCache(locId,year,d);return{success:true,source:'api'};}
    return{success:false,source:'fallback'};
  },
  getCacheStatus(locId,year) {
    const meta=_ceGetCacheMeta(locId,year);
    if(!meta) return 'fallback';
    const age=Date.now()-meta.cachedAt;
    if(age<CE_CACHE_TTL-7*24*60*60*1000) return 'api';
    if(age<CE_CACHE_TTL) return 'stale';
    return 'fallback';
  },
  importFromJSON(jsonString) {
    let parsed;
    try{parsed=JSON.parse(jsonString);}catch{return{success:false,error:'Невалидный JSON'};}
    if(!parsed.id) return{success:false,error:'Отсутствует поле id'};
    if(!parsed.name) return{success:false,error:'Отсутствует поле name'};
    if(!parsed.months||typeof parsed.months!=='object') return{success:false,error:'Отсутствует поле months'};
    const keys=Object.keys(parsed.months);
    if(!keys.length) return{success:false,error:'months пустой'};
    const custom=_ceLsGet(CE_CUSTOM_KEY)||{};
    custom[parsed.id]={id:parsed.id,name:parsed.name,flag:parsed.flag||'🌍',months:parsed.months};
    _ceLsSet(CE_CUSTOM_KEY,custom);
    return{success:true,monthsCount:keys.length};
  },
  removeCustomLocation(locId) {
    if(SUPPORTED_LOCATIONS[locId]) return;
    const custom=_ceLsGet(CE_CUSTOM_KEY)||{};
    delete custom[locId];
    _ceLsSet(CE_CUSTOM_KEY,custom);
  },
  exportLocationJSON(locId) {
    const loc=this.getLocations().find(l=>l.id===locId);
    const cy=new Date().getFullYear(), ny=cy+1;
    let months={};
    for(let m=1;m<=12;m++){const ym=`${cy}-${String(m).padStart(2,'0')}`;months[ym]=this.getMonthData(locId,ym);}
    for(let m=1;m<=12;m++){const ym=`${ny}-${String(m).padStart(2,'0')}`;months[ym]=this.getMonthData(locId,ym);}
    Object.values(months).forEach(d=>delete d.source);
    const payload={id:locId,name:loc?.name||locId,flag:loc?.flag||'🌍',months,exportedAt:new Date().toISOString()};
    this._downloadJSON(payload,`calendar_${locId}_${cy}-${ny}.json`);
  },
  exportTemplate() {
    const t={id:'XX',name:'Название страны',flag:'🌍',months:{
      '2026-01':{workdays:21,hours:168,holidays:['2026-01-01']},
      '2026-02':{workdays:20,hours:160,holidays:[]},
      '2026-03':{workdays:21,hours:168,holidays:[]},
    },_instructions:{id:'Уникальный код',name:'Название',flag:'Эмодзи',workdays:'Раб. дней',hours:'workdays*8',holidays:'["YYYY-MM-DD"]'}};
    this._downloadJSON(t,'calendar_template.json');
  },
  _downloadJSON(obj,filename) {
    const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download=filename; a.click();
    URL.revokeObjectURL(a.href);
  },
};

window.CalendarEngine      = CalendarEngine;
window.SUPPORTED_LOCATIONS = SUPPORTED_LOCATIONS;

/* ══════════════════════════════════════════════════════════════
   CALENDARS PAGE
   ══════════════════════════════════════════════════════════════ */

const CalendarsPage = {
  _fmtCacheDate(locId,year) {
    try {
      const cache=JSON.parse(localStorage.getItem('bchs_calendar_cache')||'null')||{};
      const e=cache[`${locId}_${year}`];
      if(!e) return null;
      return new Date(e.cachedAt).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'});
    } catch { return null; }
  },
  _statusLabel(s){return{api:'API',stale:'Устаревает',fallback:'Встроенные',custom:'Кастом'}[s]||'?';},
  _statusIcon(s){return{api:'🟢',stale:'🟡',fallback:'🔴',custom:'🔵'}[s]||'⚪';},
  _getMonths(count=6){
    const CE=window.CalendarEngine; const months=[];
    let cur=CE.currentYearMonth();
    for(let i=0;i<count;i++){months.push(cur);cur=CE.nextYearMonth(cur);}
    return months;
  },
  _renderStatusSection(){
    const CE=window.CalendarEngine;
    const year=new Date().getFullYear();
    const locs=Object.keys(SUPPORTED_LOCATIONS);
    const badges=locs.map(locId=>{
      const loc=SUPPORTED_LOCATIONS[locId];
      const status=CE.getCacheStatus(locId,year);
      const label=this._statusLabel(status);
      const icon=this._statusIcon(status);
      const date=this._fmtCacheDate(locId,year);
      const dateTip=date?`Обновлено: ${date}`:'Данные встроены';
      return `<div class="cal-status-badge cal-status-${status}" title="${dateTip}">`+
        `<span class="cal-status-icon">${icon}</span>`+
        `<span class="cal-status-flag">${loc.flag}</span>`+
        `<span class="cal-status-name">${loc.id}</span>`+
        `<span class="cal-status-label">${label}</span></div>`;
    }).join('');
    const hasStale=locs.some(l=>CE.getCacheStatus(l,year)==='stale');
    const hasFallback=locs.some(l=>CE.getCacheStatus(l,year)==='fallback');
    const tip=hasFallback?'Часть данных — встроенные. Подключитесь к интернету для обновления.'
      :hasStale?'Часть данных скоро устареет. Обновление произойдёт автоматически.'
      :'Все данные актуальны из API.';
    return `<section class="cal-section cal-status-section">`+
      `<div class="cal-section-header">`+
      `<h3 class="cal-section-title">Источники данных</h3>`+
      `<button class="btn btn-sm btn-ghost" id="cal-refresh-btn" title="Обновить кэш">↺ Обновить</button>`+
      `</div><div class="cal-status-row">${badges}</div>`+
      `<p class="cal-status-tip">${tip}</p></section>`;
  },
  _renderLocationCards(){
    const CE=window.CalendarEngine;
    const curYM=CE.currentYearMonth(), nextYM=CE.nextYearMonth(curYM);
    const locs=Object.values(SUPPORTED_LOCATIONS);
    const cards=locs.map(loc=>{
      const cur=CE.getMonthData(loc.id,curYM), next=CE.getMonthData(loc.id,nextYM);
      const curName=CE.getMonthName(curYM), nextName=CE.getMonthName(nextYM);
      const srcBadge=`<span class="cal-src-badge cal-src-${cur.source}">${this._statusLabel(cur.source)}</span>`;
      const holidayList=cur.holidays.length
        ?cur.holidays.map(h=>{const d=new Date(h+'T00:00:00');return`<span class="cal-holiday-chip">${d.toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}</span>`;}).join('')
        :`<span class="cal-no-holidays">нет праздников</span>`;
      return `<article class="cal-card" data-loc="${loc.id}">`+
        `<header class="cal-card-header">`+
        `<span class="cal-card-flag">${loc.flag}</span>`+
        `<div class="cal-card-title-group"><h4 class="cal-card-name">${loc.name}</h4>`+
        `<span class="cal-card-tz">${loc.timezone}</span></div>${srcBadge}</header>`+
        `<div class="cal-card-months">`+
        `<div class="cal-month-block cal-month-current">`+
        `<div class="cal-month-label">${curName}</div>`+
        `<div class="cal-month-stats">`+
        `<div class="cal-stat"><span class="cal-stat-val">${cur.workdays}</span><span class="cal-stat-name">дней</span></div>`+
        `<div class="cal-stat"><span class="cal-stat-val">${cur.hours}</span><span class="cal-stat-name">часов</span></div>`+
        `</div><div class="cal-holidays-row">${holidayList}</div></div>`+
        `<div class="cal-month-divider"></div>`+
        `<div class="cal-month-block cal-month-next">`+
        `<div class="cal-month-label">${nextName}</div>`+
        `<div class="cal-month-stats">`+
        `<div class="cal-stat"><span class="cal-stat-val">${next.workdays}</span><span class="cal-stat-name">дней</span></div>`+
        `<div class="cal-stat"><span class="cal-stat-val">${next.hours}</span><span class="cal-stat-name">часов</span></div>`+
        `</div></div></div>`+
        `<footer class="cal-card-footer">`+
        `<button class="btn btn-ghost btn-xs cal-export-btn" data-loc="${loc.id}">↓ Экспорт</button>`+
        `<button class="btn btn-ghost btn-xs cal-refresh-loc-btn" data-loc="${loc.id}">↺ Обновить</button>`+
        `</footer></article>`;
    }).join('');
    return `<section class="cal-section"><div class="cal-section-header">`+
      `<h3 class="cal-section-title">Локации</h3></div>`+
      `<div class="cal-cards-grid">${cards}</div></section>`;
  },
  _renderMyCalendars(){
    const CE=window.CalendarEngine;
    const locs=CE.getLocations().filter(l=>l.source==='custom');
    const emptyState=locs.length===0
      ?`<div class="cal-custom-empty"><span class="cal-custom-empty-icon">🌍</span>`+
        `<p>Нет кастомных календарей</p>`+
        `<p class="text-muted">Загрузите JSON с данными о рабочих днях</p></div>`
      :'';
    const customCards=locs.map(loc=>{
      const curYM=CE.currentYearMonth(), cur=CE.getMonthData(loc.id,curYM);
      return `<div class="cal-custom-card">`+
        `<span class="cal-card-flag">${loc.flag}</span>`+
        `<div class="cal-custom-card-info"><strong>${loc.name}</strong><span class="text-muted">${loc.id}</span></div>`+
        `<div class="cal-custom-card-stats"><span>${cur.workdays} дн.</span><span>${cur.hours} ч.</span></div>`+
        `<div class="cal-custom-card-actions">`+
        `<button class="btn btn-ghost btn-xs cal-export-btn" data-loc="${loc.id}">↓</button>`+
        `<button class="btn btn-danger btn-xs cal-remove-custom-btn" data-loc="${loc.id}">✕</button>`+
        `</div></div>`;
    }).join('');
    return `<section class="cal-section"><div class="cal-section-header">`+
      `<h3 class="cal-section-title">Мои календари</h3>`+
      `<button class="btn btn-primary btn-sm" id="cal-import-btn">+ Импорт JSON</button>`+
      `</div>${emptyState}<div class="cal-custom-list">${customCards}</div></section>`;
  },
  _renderComparisonTable(){
    const CE=window.CalendarEngine;
    const months=this._getMonths(6);
    const locs=Object.values(SUPPORTED_LOCATIONS);
    const allWd=[], data={};
    for(const loc of locs){
      data[loc.id]={};
      for(const ym of months){const d=CE.getMonthData(loc.id,ym);data[loc.id][ym]=d;allWd.push(d.workdays);}
    }
    const minWd=Math.min(...allWd), maxWd=Math.max(...allWd);
    const mHeaders=months.map(ym=>`<th class="cmp-th-month">${CE.getMonthName(ym)}</th>`).join('');
    const rows=locs.map(loc=>{
      const cells=months.map(ym=>{
        const d=data[loc.id][ym], wd=d.workdays;
        let cls='';
        if(wd===minWd) cls='cmp-min';
        if(wd===maxWd) cls='cmp-max';
        const srcDot=`<span class="cmp-src-dot cmp-src-${d.source}" title="${this._statusLabel(d.source)}"></span>`;
        return `<td class="cmp-td ${cls}"><span class="cmp-wd">${wd}</span><span class="cmp-h">${d.hours}ч</span>${srcDot}</td>`;
      }).join('');
      return `<tr class="cmp-row"><td class="cmp-td-loc">`+
        `<span class="cal-card-flag">${loc.flag}</span>`+
        `<span class="cmp-loc-name">${loc.name}</span></td>${cells}</tr>`;
    }).join('');
    return `<section class="cal-section"><div class="cal-section-header">`+
      `<h3 class="cal-section-title">Сравнение по месяцам</h3>`+
      `<div class="cmp-legend">`+
      `<span class="cmp-legend-item cmp-max">▲ максимум</span>`+
      `<span class="cmp-legend-item cmp-min">▼ минимум</span></div></div>`+
      `<div class="cal-table-scroll">`+
      `<table class="cal-comparison-table"><thead><tr>`+
      `<th class="cmp-th-loc">Локация</th>${mHeaders}</tr></thead>`+
      `<tbody>${rows}</tbody></table></div>`+
      `<p class="cal-table-note">* Числа = рабочие дни. `+
      `<span class="cmp-src-dot cmp-src-api"></span> API `+
      `<span class="cmp-src-dot cmp-src-stale"></span> Устаревает `+
      `<span class="cmp-src-dot cmp-src-fallback"></span> Встроенные</p></section>`;
  },
  _openImportModal(){
    const html=`<div class="cal-import-modal">`+
      `<h2 class="modal-title">Импорт календаря</h2>`+
      `<p class="text-muted" style="margin-bottom:16px">Загрузите JSON-файл с рабочими календарями для вашей локации</p>`+
      `<div class="cal-import-tabs">`+
      `<button class="cal-import-tab active" data-tab="file">📁 Файл</button>`+
      `<button class="cal-import-tab" data-tab="template">📋 Шаблон</button></div>`+
      `<div class="cal-import-tab-panel" data-panel="file">`+
      `<div class="cal-dropzone" id="cal-dropzone">`+
      `<div class="cal-dropzone-icon">📂</div>`+
      `<div class="cal-dropzone-text">Перетащите JSON или <label class="cal-dropzone-link" for="cal-file-input">выберите файл</label></div>`+
      `<input type="file" id="cal-file-input" accept=".json" style="display:none" /></div>`+
      `<div id="cal-import-preview" class="cal-import-preview hidden"></div>`+
      `<div id="cal-import-status" class="cal-import-status"></div>`+
      `<div class="modal-actions" style="margin-top:16px">`+
      `<button class="btn btn-primary" id="cal-import-confirm-btn" disabled>✓ Импортировать</button>`+
      `<button class="btn btn-ghost" onclick="App.closeModal()">Отмена</button></div></div>`+
      `<div class="cal-import-tab-panel hidden" data-panel="template">`+
      `<p>Скачайте шаблон и заполните данными для вашей страны/региона.</p>`+
      `<pre class="cal-code-block">{\n  "id": "KZ",\n  "name": "Казахстан",\n  "flag": "🇰🇿",\n  "months": {\n    "2026-01": { "workdays": 21, "hours": 168, "holidays": ["2026-01-01"] }\n  }\n}</pre>`+
      `<div class="modal-actions" style="margin-top:16px">`+
      `<button class="btn btn-primary" id="cal-template-download-btn">↓ Скачать шаблон</button>`+
      `<button class="btn btn-ghost" onclick="App.closeModal()">Закрыть</button></div></div></div>`;
    App.openModal(html);
    this._bindImportModal();
  },
  _bindImportModal(){
    let parsedData=null;
    document.querySelectorAll('.cal-import-tab').forEach(tab=>{
      tab.addEventListener('click',()=>{
        document.querySelectorAll('.cal-import-tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.cal-import-tab-panel').forEach(p=>p.classList.add('hidden'));
        tab.classList.add('active');
        document.querySelector(`.cal-import-tab-panel[data-panel="${tab.dataset.tab}"]`).classList.remove('hidden');
      });
    });
    const tmplBtn=document.getElementById('cal-template-download-btn');
    if(tmplBtn) tmplBtn.addEventListener('click',()=>window.CalendarEngine.exportTemplate());
    const dropzone=document.getElementById('cal-dropzone');
    const fileInput=document.getElementById('cal-file-input');
    if(dropzone){
      dropzone.addEventListener('click',()=>fileInput.click());
      dropzone.addEventListener('dragover',e=>{e.preventDefault();dropzone.classList.add('cal-dropzone-active');});
      dropzone.addEventListener('dragleave',()=>dropzone.classList.remove('cal-dropzone-active'));
      dropzone.addEventListener('drop',e=>{
        e.preventDefault();dropzone.classList.remove('cal-dropzone-active');
        const file=e.dataTransfer.files[0];
        if(file) this._readImportFile(file,r=>{parsedData=r;});
      });
    }
    if(fileInput) fileInput.addEventListener('change',()=>{
      const file=fileInput.files[0];
      if(file) this._readImportFile(file,r=>{parsedData=r;});
    });
    const confirmBtn=document.getElementById('cal-import-confirm-btn');
    if(confirmBtn) confirmBtn.addEventListener('click',async()=>{
      if(!parsedData) return;
      confirmBtn.disabled=true; confirmBtn.textContent='⏳ Импортирую...';
      const result=window.CalendarEngine.importFromJSON(JSON.stringify(parsedData));
      if(result.success){
        App.closeModal();
        App.toast(`Импортировано: ${parsedData.name} (${result.monthsCount} месяцев)`,'success');
        await CalendarsPage.render();
      } else {
        confirmBtn.disabled=false; confirmBtn.textContent='✓ Импортировать';
        document.getElementById('cal-import-status').innerHTML=`<div class="cal-validation-error">❌ ${result.error}</div>`;
      }
    });
  },
  _readImportFile(file,onSuccess){
    const reader=new FileReader();
    reader.onload=e=>{
      const statusEl=document.getElementById('cal-import-status');
      const previewEl=document.getElementById('cal-import-preview');
      const confirmBtn=document.getElementById('cal-import-confirm-btn');
      let parsed;
      try{parsed=JSON.parse(e.target.result);}catch{
        if(statusEl) statusEl.innerHTML='<div class="cal-validation-error">❌ Невалидный JSON</div>';
        if(previewEl) previewEl.classList.add('hidden');
        if(confirmBtn) confirmBtn.disabled=true;
        return;
      }
      const errors=[];
      if(!parsed.id) errors.push('Отсутствует поле id');
      if(!parsed.name) errors.push('Отсутствует поле name');
      if(!parsed.months||typeof parsed.months!=='object') errors.push('Отсутствует поле months');
      if(errors.length){
        if(statusEl) statusEl.innerHTML=`<div class="cal-validation-error">❌ ${errors.join('; ')}</div>`;
        if(previewEl) previewEl.classList.add('hidden');
        if(confirmBtn) confirmBtn.disabled=true;
        return;
      }
      const keys=Object.keys(parsed.months);
      const previewRows=keys.slice(0,5).map(ym=>{
        const d=parsed.months[ym]; const hc=Array.isArray(d.holidays)?d.holidays.length:'?';
        return `<tr><td>${ym}</td><td>${d.workdays??'—'}</td><td>${d.hours??'—'}</td><td>${hc}</td></tr>`;
      }).join('');
      const more=keys.length>5?`<tr><td colspan="4" class="cal-preview-more">…ещё ${keys.length-5} месяцев</td></tr>`:''; 
      if(previewEl){
        previewEl.classList.remove('hidden');
        previewEl.innerHTML=`<div class="cal-validation-ok">✅ ${parsed.flag||'🌍'} <strong>${parsed.name}</strong> (${parsed.id}) — ${keys.length} месяцев</div>`+
          `<table class="cal-preview-table"><thead><tr><th>Месяц</th><th>Раб. дни</th><th>Часы</th><th>Праздники</th></tr></thead>`+
          `<tbody>${previewRows}${more}</tbody></table>`;
      }
      if(statusEl) statusEl.innerHTML='';
      if(confirmBtn) confirmBtn.disabled=false;
      onSuccess(parsed);
    };
    reader.readAsText(file);
  },
  _bindPageEvents(){
    const CE=window.CalendarEngine;
    const refreshBtn=document.getElementById('cal-refresh-btn');
    if(refreshBtn) refreshBtn.addEventListener('click',async()=>{
      refreshBtn.disabled=true; refreshBtn.textContent='⏳ Обновление...';
      const year=new Date().getFullYear();
      const locs=Object.keys(SUPPORTED_LOCATIONS);
      let updated=0;
      for(const locId of locs){const res=await CE.refreshCache(locId,year);if(res.success)updated++;}
      App.toast(`Обновлено: ${updated}/${locs.length} локаций`,updated>0?'success':'');
      await CalendarsPage.render();
    });
    document.querySelectorAll('.cal-refresh-loc-btn').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const locId=btn.dataset.loc; btn.disabled=true; btn.textContent='⏳';
        const year=new Date().getFullYear();
        const res=await CE.refreshCache(locId,year);
        App.toast(res.success?`${locId}: кэш обновлён`:`${locId}: API недоступен`,res.success?'success':'');
        await CalendarsPage.render();
      });
    });
    document.querySelectorAll('.cal-export-btn').forEach(btn=>{
      btn.addEventListener('click',()=>CE.exportLocationJSON(btn.dataset.loc));
    });
    const importBtn=document.getElementById('cal-import-btn');
    if(importBtn) importBtn.addEventListener('click',()=>this._openImportModal());
    document.querySelectorAll('.cal-remove-custom-btn').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const locId=btn.dataset.loc;
        if(!confirm(`Удалить кастомный календарь «${locId}»?`)) return;
        CE.removeCustomLocation(locId);
        App.toast(`Календарь ${locId} удалён`,'');
        await CalendarsPage.render();
      });
    });
  },
  async render(){
    const main=document.getElementById('main-content');
    if(!main) return;
    if(!window.CalendarEngine){
      main.innerHTML=`<div class="empty-state"><div class="empty-state-icon">⚠️</div>`+
        `<div class="empty-state-title">CalendarEngine не загружен</div></div>`;
      return;
    }
    main.innerHTML=`<div class="page-header"><div class="page-header-left">`+
      `<h1 class="page-title">📅 Рабочие календари</h1>`+
      `<p class="page-subtitle">Рабочие дни, праздники и часы по локациям</p>`+
      `</div></div><div class="cal-page" id="cal-page-root">`+
      this._renderStatusSection()+
      this._renderLocationCards()+
      this._renderMyCalendars()+
      this._renderComparisonTable()+
      `</div>`;
    this._bindPageEvents();
  },
};

window.CalendarsPage = CalendarsPage;

/* ══════════════════════════════════════════════════════════════
   FTE DYNAMICS — constants
   ══════════════════════════════════════════════════════════════ */
const FTE_CURRENCIES         = ['USD', 'EUR', 'PLN', 'GBP'];
const FTE_ALLOCATION_OPTIONS = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 1.0];
const FTE_DEFAULT_LOCATION   = 'BY';

/* ══════════════════════════════════════════════════════════════
   FTE DYNAMICS — расчётные функции
   ══════════════════════════════════════════════════════════════ */

function _fteMemberPlanned(member, month) {
  if (member.planned_hours !== null && member.planned_hours !== undefined && member.planned_hours !== '') {
    return Number(member.planned_hours);
  }
  if (window.CalendarEngine) {
    return CalendarEngine.getPlannedHours(member.location || 'BY', month, member.allocation || 1.0);
  }
  return Math.round(168 * (member.allocation || 1.0));
}

function _fteMemberPlannedRev(member, month) {
  return _fteMemberPlanned(member, month) * (member.rate_per_hour || 0);
}

function _fteMemberActualRev(member) {
  return (member.actual_hours || 0) * (member.rate_per_hour || 0);
}

function _fteMemberDelta(member, month) {
  const planned = _fteMemberPlanned(member, month);
  const actual  = member.actual_hours || 0;
  const rate    = member.rate_per_hour || 0;
  if (window.CalendarEngine) return CalendarEngine.getDelta(planned, actual, rate);
  const dh = actual - planned, dm = Math.round(dh * rate);
  const eff = planned > 0 ? actual / planned : 0;
  let status, status_label;
  if (eff >= 0.95)      { status='ok';       status_label='В норме'; }
  else if (eff >= 0.80) { status='warning';  status_label='Внимание'; }
  else                  { status='critical'; status_label='Критично'; }
  return { delta_hours: dh, delta_money: dm, efficiency: eff, status, status_label };
}

function _fteTotalPlanned(entry)       { return entry.members.reduce((s,m)=>s+_fteMemberPlanned(m,entry.month),0); }
function _fteTotalActual(entry)        { return entry.members.reduce((s,m)=>s+(m.actual_hours||0),0); }
function _fteTotalPlannedRev(entry)    { return entry.members.reduce((s,m)=>s+_fteMemberPlannedRev(m,entry.month),0); }
function _fteTotalActualRev(entry)     { return entry.members.reduce((s,m)=>s+_fteMemberActualRev(m),0); }
function _fteTotalDeltaHours(entry)    { return _fteTotalActual(entry) - _fteTotalPlanned(entry); }
function _fteTotalDeltaMoney(entry)    { return Math.round(_fteTotalActualRev(entry) - _fteTotalPlannedRev(entry)); }

function _fteAvgEfficiency(entry) {
  let tp=0, we=0;
  for (const m of entry.members) {
    const p = _fteMemberPlanned(m, entry.month);
    const d = _fteMemberDelta(m, entry.month);
    tp += p; we += d.efficiency * p;
  }
  return tp > 0 ? we / tp : 0;
}

function _fteEntryStatus(entry) {
  const ss = entry.members.map(m => _fteMemberDelta(m, entry.month).status);
  if (ss.includes('critical')) return 'critical';
  if (ss.includes('warning'))  return 'warning';
  return 'ok';
}

/* ── Утилиты форматирования ──────────────────────────────── */
function _fteFmtMoney(amount, currency) {
  const sym = { USD:'$', EUR:'€', PLN:'zł', GBP:'£' }[currency] || '$';
  const abs  = Math.abs(Math.round(amount));
  const sign = amount < 0 ? '-' : (amount > 0 ? '+' : '');
  return `${sign}${sym}${abs.toLocaleString('ru-RU')}`;
}
function _fteFmtDH(h) { return h === 0 ? '±0ч' : `${h>0?'+':''}${h}ч`; }
function _fteLocFlag(locId) { return {BY:'🇧🇾',PL:'🇵🇱',DE:'🇩🇪',US:'🇺🇸'}[locId]||'🌍'; }
function _fteParseMembers(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}
function _fteSerializeMembers(arr) { return JSON.stringify(arr||[]); }
function _fteGenMemberId() { return 'mbr_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function _fteFmtYM(ym) {
  if (!ym) return '';
  const [y,m] = ym.split('-').map(Number);
  const names = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  return `${names[m-1]} ${y}`;
}
function _fteCurrentYM() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
}
function _fteShiftYM(ym, delta) {
  const [y,m] = ym.split('-').map(Number);
  const d = new Date(y, m-1+delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

/* ══════════════════════════════════════════════════════════════
   FteAPI — CRUD для fte_entries
   ══════════════════════════════════════════════════════════════ */
const FteAPI = {
  async getByClient(clientId) {
    try {
      const res  = await fetch('tables/fte_entries?limit=200');
      const json = await res.json();
      const rows = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      return rows.filter(r=>r.client_id===clientId).map(r=>({...r, members:_fteParseMembers(r.members)}));
    } catch(e) { console.error('[FteAPI]',e); return []; }
  },
  async getByMonth(clientId, month) {
    const all = await this.getByClient(clientId);
    return all.find(r=>r.month===month)||null;
  },
  async create(payload) {
    const body = {...payload, members:_fteSerializeMembers(payload.members)};
    const res  = await fetch('tables/fte_entries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const row  = await res.json();
    return {...row, members:_fteParseMembers(row.members)};
  },
  async update(id, payload) {
    const body = {...payload, members:_fteSerializeMembers(payload.members)};
    const res  = await fetch(`tables/fte_entries/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const row  = await res.json();
    return {...row, members:_fteParseMembers(row.members)};
  },
  async remove(id) {
    await fetch(`tables/fte_entries/${id}`,{method:'DELETE'});
  },
};

/* ══════════════════════════════════════════════════════════════
   DeliveryTab — таб Delivery в карточке клиента
   ══════════════════════════════════════════════════════════════ */
const DeliveryTab = {
  clientId:    null,
  activeMonth: null,
  entry:       null,
  allEntries:  [],

  async init(clientId) {
    this.clientId    = clientId;
    this.activeMonth = this.activeMonth || _fteCurrentYM();
    await this._loadData();
    this._render();
  },

  async _loadData() {
    try {
      this.allEntries = await FteAPI.getByClient(this.clientId);
      this.entry      = this.allEntries.find(e=>e.month===this.activeMonth)||null;
    } catch(e) { console.error('[DeliveryTab._loadData]',e); this.allEntries=[]; this.entry=null; }
  },

  async render(clientId) {
    this.clientId    = clientId;
    this.activeMonth = this.activeMonth || _fteCurrentYM();
    await this._loadData();
    return this._buildHTML();
  },

  _render() {
    const el = document.getElementById('delivery-tab-root');
    if (!el) return;
    el.innerHTML = this._buildHTML();
    this._bindEvents();
  },

  _buildHTML() {
    return `<div class="dtab-wrap" id="delivery-tab-root">`+
      this._renderMonthNav()+
      (this.entry ? this._renderContent() : this._renderEmpty())+
      `</div>`;
  },

  _renderMonthNav() {
    const months = [-2,-1,0,1,2].map(d=>_fteShiftYM(this.activeMonth,d));
    const prev   = _fteShiftYM(this.activeMonth,-1);
    const next   = _fteShiftYM(this.activeMonth,+1);
    const items  = months.map(ym=>{
      const isActive = ym===this.activeMonth;
      const hasData  = this.allEntries.some(e=>e.month===ym);
      return `<button class="dtab-month-btn${isActive?' active':''}${hasData?' has-data':''}" data-ym="${ym}" title="${hasData?'Есть данные':'Нет данных'}">`+
        `${_fteFmtYM(ym)}${hasData?'<span class="dtab-month-dot"></span>':''}</button>`;
    }).join('');
    return `<nav class="dtab-month-nav">`+
      `<button class="dtab-nav-arrow" data-ym="${prev}">◀</button>`+
      `<div class="dtab-month-list">${items}</div>`+
      `<button class="dtab-nav-arrow" data-ym="${next}">▶</button></nav>`;
  },

  _renderEmpty() {
    return `<div class="dtab-empty">`+
      `<div class="dtab-empty-icon">👥</div>`+
      `<div class="dtab-empty-title">Нет данных за ${_fteFmtYM(this.activeMonth)}</div>`+
      `<p class="dtab-empty-text">Добавьте команду проекта<br>чтобы отслеживать утилизацию</p>`+
      `<button class="btn btn-primary" id="dtab-btn-add-team">+ Добавить команду</button></div>`;
  },

  _renderKPI() {
    const e       = this.entry;
    const fte     = e.members.reduce((s,m)=>s+(m.allocation||1),0);
    const planned = _fteTotalPlanned(e);
    const actual  = _fteTotalActual(e);
    const planRev = _fteTotalPlannedRev(e);
    const actRev  = _fteTotalActualRev(e);
    const avgEff  = _fteAvgEfficiency(e);
    const status  = _fteEntryStatus(e);
    const effPct  = Math.round(avgEff*100);
    const stMap   = {ok:{icon:'🟢',label:'В норме'},warning:{icon:'🟡',label:'Внимание'},critical:{icon:'🔴',label:'Критично'}};
    const st      = stMap[status]||stMap.ok;
    const cur     = e.members[0]?.currency||'USD';
    return `<div class="dtab-kpi-row">`+
      `<div class="dtab-kpi-card"><div class="dtab-kpi-icon">👥</div><div class="dtab-kpi-val">${fte.toFixed(1)}</div><div class="dtab-kpi-label">FTE человек</div></div>`+
      `<div class="dtab-kpi-card"><div class="dtab-kpi-icon">⏱</div><div class="dtab-kpi-val">${actual} <span class="dtab-kpi-sub">/ ${planned}</span></div><div class="dtab-kpi-label">факт / план ч</div></div>`+
      `<div class="dtab-kpi-card"><div class="dtab-kpi-icon">💰</div><div class="dtab-kpi-val">${_fteFmtMoney(actRev,cur).replace(/^\+/,'')}</div><div class="dtab-kpi-label">факт / ${_fteFmtMoney(planRev,cur).replace(/^\+/,'')}</div></div>`+
      `<div class="dtab-kpi-card dtab-kpi-card--${status}"><div class="dtab-kpi-icon">📊</div><div class="dtab-kpi-val">${effPct}%</div><div class="dtab-kpi-label">${st.icon} ${st.label}</div></div>`+
      `</div>`;
  },

  _renderMemberRow(m, idx) {
    const planned = _fteMemberPlanned(m, this.entry.month);
    const delta   = _fteMemberDelta(m, this.entry.month);
    const planRev = _fteMemberPlannedRev(m, this.entry.month);
    const actRev  = _fteMemberActualRev(m);
    const dMoney  = actRev - planRev;
    const allPct  = Math.round((m.allocation||1)*100)+'%';
    const sIcon   = {ok:'🟢',warning:'🟡',critical:'🔴'}[delta.status]||'⚪';
    const noteAttr = m.note ? `title="${m.note.replace(/"/g,'&quot;')}"` : '';
    return `<tr class="dtab-row dtab-row--${delta.status}" data-idx="${idx}" ${noteAttr}>`+
      `<td class="dtab-td dtab-td--name"><button class="dtab-name-btn" data-action="edit-member" data-idx="${idx}">${m.name||'—'}</button>${m.note?`<span class="dtab-note-icon" title="${m.note}">📝</span>`:''}</td>`+
      `<td class="dtab-td">${m.role||'—'}</td>`+
      `<td class="dtab-td"><span class="dtab-loc-chip">${_fteLocFlag(m.location)} ${m.location||'—'}</span></td>`+
      `<td class="dtab-td dtab-td--num">${allPct}</td>`+
      `<td class="dtab-td dtab-td--num">${planned}ч</td>`+
      `<td class="dtab-td dtab-td--num">${m.actual_hours||0}ч</td>`+
      `<td class="dtab-td dtab-td--num dtab-delta ${delta.delta_hours<0?'dtab-delta--neg':delta.delta_hours>0?'dtab-delta--pos':''}">${_fteFmtDH(delta.delta_hours)}</td>`+
      `<td class="dtab-td dtab-td--num dtab-delta ${dMoney<0?'dtab-delta--neg':dMoney>0?'dtab-delta--pos':''}">${_fteFmtMoney(dMoney,m.currency)}</td>`+
      `<td class="dtab-td dtab-td--center"><span class="dtab-status-icon" title="${delta.status_label}">${sIcon}</span></td>`+
      `<td class="dtab-td dtab-td--actions"><button class="btn btn-ghost btn-xs" data-action="delete-member" data-idx="${idx}" title="Удалить">✕</button></td>`+
      `</tr>`;
  },

  _renderTotalsRow() {
    const e      = this.entry;
    const fte    = e.members.reduce((s,m)=>s+(m.allocation||1),0).toFixed(1);
    const plan   = _fteTotalPlanned(e);
    const act    = _fteTotalActual(e);
    const dH     = _fteTotalDeltaHours(e);
    const dM     = _fteTotalDeltaMoney(e);
    const status = _fteEntryStatus(e);
    const cur    = e.members[0]?.currency||'USD';
    const sIcon  = {ok:'🟢',warning:'🟡',critical:'🔴'}[status];
    return `<tr class="dtab-totals-row">`+
      `<td class="dtab-td dtab-td--totals" colspan="3">ИТОГО</td>`+
      `<td class="dtab-td dtab-td--num dtab-td--totals">${fte} FTE</td>`+
      `<td class="dtab-td dtab-td--num dtab-td--totals">${plan}ч</td>`+
      `<td class="dtab-td dtab-td--num dtab-td--totals">${act}ч</td>`+
      `<td class="dtab-td dtab-td--num dtab-td--totals dtab-delta ${dH<0?'dtab-delta--neg':dH>0?'dtab-delta--pos':''}">${_fteFmtDH(dH)}</td>`+
      `<td class="dtab-td dtab-td--num dtab-td--totals dtab-delta ${dM<0?'dtab-delta--neg':dM>0?'dtab-delta--pos':''}">${_fteFmtMoney(dM,cur)}</td>`+
      `<td class="dtab-td dtab-td--center dtab-td--totals">${sIcon}</td>`+
      `<td class="dtab-td dtab-td--totals"></td></tr>`;
  },

  _renderTable() {
    const rows = this.entry.members.map((m,i)=>this._renderMemberRow(m,i)).join('');
    return `<div class="dtab-table-wrap"><div style="overflow-x:auto">`+
      `<table class="dtab-table"><thead><tr>`+
      `<th class="dtab-th">Сотрудник</th><th class="dtab-th">Роль</th><th class="dtab-th">Локация</th>`+
      `<th class="dtab-th dtab-th--num">Аллокация</th><th class="dtab-th dtab-th--num">План ч</th>`+
      `<th class="dtab-th dtab-th--num">Факт ч</th><th class="dtab-th dtab-th--num">Δ часов</th>`+
      `<th class="dtab-th dtab-th--num">Δ деньги</th><th class="dtab-th dtab-th--center">Статус</th>`+
      `<th class="dtab-th"></th></tr></thead>`+
      `<tbody>${rows}</tbody><tfoot>${this._renderTotalsRow()}</tfoot></table></div></div>`;
  },

  _renderActions() {
    return `<div class="dtab-actions">`+
      `<button class="btn btn-primary btn-sm" id="dtab-btn-add-member">+ Добавить сотрудника</button>`+
      `<button class="btn btn-secondary btn-sm" id="dtab-btn-edit-entry">✏️ Редактировать</button>`+
      `<button class="btn btn-danger btn-sm" id="dtab-btn-delete-entry">🗑 Удалить месяц</button></div>`;
  },

  _renderContent() {
    return this._renderKPI() + this._renderTable() + this._renderChart() + this._renderActions();
  },

  /* ── События ─────────────────────────────────────────────── */
  _bindEvents() {
    document.querySelectorAll('.dtab-month-btn, .dtab-nav-arrow').forEach(btn=>{
      btn.addEventListener('click', async()=>{
        const ym=btn.dataset.ym; if(!ym) return;
        this.activeMonth=ym; await this._loadData(); this._render();
      });
    });
    document.getElementById('dtab-btn-add-team')?.addEventListener('click',()=>this._openModal(null,false));
    document.getElementById('dtab-btn-add-member')?.addEventListener('click',()=>this._openModal(null,false));
    document.getElementById('dtab-btn-edit-entry')?.addEventListener('click',()=>this._openModal(this.entry,true));
    document.getElementById('dtab-btn-delete-entry')?.addEventListener('click',()=>this._deleteEntry());
    document.querySelectorAll('[data-action="edit-member"]').forEach(btn=>{
      btn.addEventListener('click',()=>this._openMemberEditRow(parseInt(btn.dataset.idx)));
    });
    document.querySelectorAll('[data-action="delete-member"]').forEach(btn=>{
      btn.addEventListener('click',async()=>this._deleteMember(parseInt(btn.dataset.idx)));
    });
    this._bindChartEvents();
  },

  /* ── Инлайн-редактирование строки ────────────────────────── */
  _buildLocOpts(sel) {
    const locs = window.CalendarEngine ? CalendarEngine.getLocations()
      : [{id:'BY',name:'Беларусь',flag:'🇧🇾'},{id:'PL',name:'Польша',flag:'🇵🇱'},{id:'DE',name:'Германия',flag:'🇩🇪'},{id:'US',name:'США',flag:'🇺🇸'}];
    return locs.map(l=>`<option value="${l.id}" ${l.id===sel?'selected':''}>${l.flag} ${l.name} (${l.id})</option>`).join('');
  },
  _buildAllocOpts(sel) {
    const opts=[{v:0.1,l:'10%'},{v:0.2,l:'20%'},{v:0.25,l:'25%'},{v:0.3,l:'30%'},{v:0.4,l:'40%'},{v:0.5,l:'50%'},{v:0.6,l:'60%'},{v:0.75,l:'75%'},{v:0.8,l:'80%'},{v:1.0,l:'100%'}];
    const s=sel!==undefined?sel:1.0;
    return opts.map(o=>`<option value="${o.v}" ${o.v===s?'selected':''}>${o.l}</option>`).join('');
  },
  _buildCurrOpts(sel) {
    return FTE_CURRENCIES.map(c=>`<option value="${c}" ${c===(sel||'USD')?'selected':''}>${c}</option>`).join('');
  },

  _openMemberEditRow(idx) {
    const m = this.entry.members[idx]; if(!m) return;
    const row = document.querySelector(`tr.dtab-row[data-idx="${idx}"]`); if(!row) return;
    document.getElementById('dtab-inline-form')?.remove();
    const form = document.createElement('tr');
    form.id    = 'dtab-inline-form';
    form.innerHTML = `<td colspan="10" class="dtab-inline-td"><div class="dtab-inline-form"><div class="dtab-inline-grid">`+
      `<div class="dtab-fg"><label class="dtab-flabel">Имя</label><input class="form-input dtab-fi" id="dif-name" value="${m.name||''}" placeholder="Иван Петров" required /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Роль</label><input class="form-input dtab-fi" id="dif-role" value="${m.role||''}" placeholder="Developer" /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Локация</label><select class="form-select dtab-fi" id="dif-location">${this._buildLocOpts(m.location)}</select></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Аллокация</label><select class="form-select dtab-fi" id="dif-allocation">${this._buildAllocOpts(m.allocation)}</select></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Рейт/ч</label><input class="form-input dtab-fi" id="dif-rate" type="number" min="0" value="${m.rate_per_hour||''}" placeholder="45" /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Валюта</label><select class="form-select dtab-fi" id="dif-currency">${this._buildCurrOpts(m.currency)}</select></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">План ч</label><input class="form-input dtab-fi" id="dif-planned" type="number" min="0" value="${m.planned_hours!==null&&m.planned_hours!==undefined?m.planned_hours:''}" placeholder="Авто" /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Факт ч <span class="dtab-req">*</span></label><input class="form-input dtab-fi" id="dif-actual" type="number" min="0" value="${m.actual_hours||''}" placeholder="152" required /></div>`+
      `<div class="dtab-fg dtab-fg--wide"><label class="dtab-flabel">Заметка</label><input class="form-input dtab-fi" id="dif-note" value="${m.note||''}" placeholder="Был в отпуске 3 дня" /></div>`+
      `</div><div class="dtab-inline-actions">`+
      `<button class="btn btn-primary btn-sm" id="dif-save-btn">✓ Сохранить</button>`+
      `<button class="btn btn-ghost btn-sm" id="dif-cancel-btn">Отмена</button></div></div></td>`;
    row.insertAdjacentElement('afterend', form);
    document.getElementById('dif-cancel-btn').addEventListener('click',()=>form.remove());
    document.getElementById('dif-save-btn').addEventListener('click',async()=>{
      const name   = document.getElementById('dif-name')?.value?.trim();
      const actual = parseFloat(document.getElementById('dif-actual')?.value);
      if (!name)         { App.toast('⚠️ Укажите имя','error'); return; }
      if (isNaN(actual)) { App.toast('⚠️ Укажите фактические часы','error'); return; }
      const pRaw = document.getElementById('dif-planned')?.value;
      const planned = pRaw!==''&&!isNaN(parseFloat(pRaw)) ? parseFloat(pRaw) : null;
      this.entry.members[idx] = { ...this.entry.members[idx], name,
        role:          document.getElementById('dif-role')?.value?.trim()||'',
        location:      document.getElementById('dif-location')?.value||'BY',
        allocation:    parseFloat(document.getElementById('dif-allocation')?.value)||1.0,
        rate_per_hour: parseFloat(document.getElementById('dif-rate')?.value)||0,
        currency:      document.getElementById('dif-currency')?.value||'USD',
        planned_hours: planned, actual_hours: actual,
        note:          document.getElementById('dif-note')?.value?.trim()||'',
      };
      await this._saveEntry();
    });
  },

  /* ── Модальная форма ────────────────────────────────────── */
  _buildMemberBlock(idx, m) {
    const locs  = this._buildLocOpts(m?.location);
    const alloc = this._buildAllocOpts(m?.allocation);
    const curr  = this._buildCurrOpts(m?.currency);
    return `<div class="dtab-member-block" data-block-idx="${idx}">`+
      `<div class="dtab-member-block-header"><span class="dtab-member-num">👤 Сотрудник ${idx+1}</span>`+
      `${idx>0?`<button class="btn btn-ghost btn-xs dtab-remove-block" data-block-idx="${idx}">✕</button>`:''}</div>`+
      `<div class="dtab-modal-grid">`+
      `<div class="dtab-fg"><label class="dtab-flabel">Имя <span class="dtab-req">*</span></label><input class="form-input" name="m_name" value="${m?.name||''}" placeholder="Иван Петров" required /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Роль</label><input class="form-input" name="m_role" value="${m?.role||''}" placeholder="Developer, PM, QA..." /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Локация</label><select class="form-select" name="m_location">${locs}</select></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Аллокация</label><select class="form-select" name="m_allocation">${alloc}</select></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Рейт в час</label><input class="form-input" name="m_rate" type="number" min="0" value="${m?.rate_per_hour||''}" placeholder="45" /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Валюта</label><select class="form-select" name="m_currency">${curr}</select></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Плановые ч <span class="dtab-flabel-hint">(авто)</span></label><input class="form-input" name="m_planned" type="number" min="0" value="${m?.planned_hours!==null&&m?.planned_hours!==undefined?m.planned_hours:''}" placeholder="Авто" /></div>`+
      `<div class="dtab-fg"><label class="dtab-flabel">Фактические ч <span class="dtab-req">*</span></label><input class="form-input" name="m_actual" type="number" min="0" value="${m?.actual_hours||''}" placeholder="152" required /></div>`+
      `<div class="dtab-fg dtab-fg--wide"><label class="dtab-flabel">Заметка</label><input class="form-input" name="m_note" value="${m?.note||''}" placeholder="Был в отпуске 3 дня" /></div>`+
      `</div></div>`;
  },

  _openModal(existingEntry, showExisting) {
    const monthName = _fteFmtYM(this.activeMonth);
    const members   = (showExisting&&existingEntry) ? existingEntry.members : [];
    const html = `<div class="dtab-modal-wrap">`+
      `<h2 class="modal-title">👥 Команда проекта — ${monthName}</h2>`+
      `<div id="dtab-members-container">`+
      (members.length>0 ? members.map((m,i)=>this._buildMemberBlock(i,m)).join('') : this._buildMemberBlock(0,null))+
      `</div><button class="btn btn-ghost btn-sm" id="dtab-modal-add-more" style="margin-top:8px">+ Добавить ещё одного</button>`+
      `<div class="modal-actions" style="margin-top:20px">`+
      `<button class="btn btn-primary" id="dtab-modal-save-btn">💾 Сохранить</button>`+
      `<button class="btn btn-ghost" onclick="App.closeModal()">Отмена</button></div></div>`;
    App.openModal(html);
    let bc = document.querySelectorAll('.dtab-member-block').length;
    document.getElementById('dtab-modal-add-more')?.addEventListener('click',()=>{
      const cont = document.getElementById('dtab-members-container');
      const div  = document.createElement('div');
      div.innerHTML = this._buildMemberBlock(bc, null);
      cont.appendChild(div.firstElementChild);
      div.firstElementChild?.querySelector('.dtab-remove-block')?.addEventListener('click',e=>e.target.closest('.dtab-member-block').remove());
      bc++;
    });
    document.querySelectorAll('.dtab-remove-block').forEach(btn=>btn.addEventListener('click',e=>e.target.closest('.dtab-member-block').remove()));
    document.getElementById('dtab-modal-save-btn')?.addEventListener('click',async()=>this._saveFromModal(existingEntry));
  },

  async _saveFromModal(existingEntry) {
    const blocks  = document.querySelectorAll('.dtab-member-block');
    const members = []; let hasError = false;
    blocks.forEach((block,i)=>{
      const get  = n=>block.querySelector(`[name="${n}"]`)?.value?.trim()||'';
      const name = get('m_name');
      const actual = parseFloat(block.querySelector('[name="m_actual"]')?.value);
      if (!name)         { App.toast(`⚠️ Сотрудник ${i+1}: укажите имя`,'error'); hasError=true; return; }
      if (isNaN(actual)) { App.toast(`⚠️ ${name}: укажите фактические часы`,'error'); hasError=true; return; }
      const pRaw   = block.querySelector('[name="m_planned"]')?.value;
      const planned = pRaw!==''&&!isNaN(parseFloat(pRaw)) ? parseFloat(pRaw) : null;
      const existM  = existingEntry?.members?.[i];
      members.push({ id:existM?.id||_fteGenMemberId(), name,
        role:          get('m_role'),
        location:      get('m_location')||'BY',
        allocation:    parseFloat(block.querySelector('[name="m_allocation"]')?.value)||1.0,
        rate_per_hour: parseFloat(block.querySelector('[name="m_rate"]')?.value)||0,
        currency:      get('m_currency')||'USD',
        planned_hours: planned, actual_hours: actual, note: get('m_note'),
      });
    });
    if (hasError||members.length===0) return;
    const saveBtn = document.getElementById('dtab-modal-save-btn');
    if (saveBtn) { saveBtn.disabled=true; saveBtn.textContent='⏳ Сохраняю...'; }
    try {
      const today = new Date().toISOString().slice(0,10);
      if (existingEntry) {
        this.entry = await FteAPI.update(existingEntry.id, {...existingEntry, members, updated_at:today});
      } else {
        this.entry = await FteAPI.create({client_id:this.clientId, month:this.activeMonth, members, created_at:today, updated_at:today});
        this.allEntries.push(this.entry);
      }
      App.closeModal();
      App.toast('✅ Команда сохранена','success');
      this._render();
    } catch(e) {
      console.error('[DeliveryTab._saveFromModal]',e);
      App.toast('❌ Ошибка сохранения','error');
      if (saveBtn) { saveBtn.disabled=false; saveBtn.textContent='💾 Сохранить'; }
    }
  },

  async _saveEntry() {
    try {
      this.entry = await FteAPI.update(this.entry.id, {...this.entry, updated_at:new Date().toISOString().slice(0,10)});
      App.toast('✅ Сохранено','success');
      this._render();
    } catch(e) { console.error('[DeliveryTab._saveEntry]',e); App.toast('❌ Ошибка сохранения','error'); }
  },

  async _deleteMember(idx) {
    const name = this.entry.members[idx]?.name;
    if (!confirm(`Удалить сотрудника «${name}»?`)) return;
    this.entry.members.splice(idx,1);
    if (this.entry.members.length===0) {
      const eid = this.entry.id;
      await FteAPI.remove(eid);
      this.allEntries = this.allEntries.filter(e=>e.id!==eid);
      this.entry = null;
      App.toast(`🗑 Запись удалена`,'');
      this._render();
    } else {
      await this._saveEntry();
    }
  },

  async _deleteEntry() {
    const mn = _fteFmtYM(this.activeMonth);
    if (!confirm(`Удалить все данные команды за ${mn}?`)) return;
    try {
      await FteAPI.remove(this.entry.id);
      this.allEntries = this.allEntries.filter(e=>e.id!==this.entry.id);
      this.entry = null;
      App.toast(`🗑 Данные за ${mn} удалены`,'');
      this._render();
    } catch { App.toast('❌ Ошибка удаления','error'); }
  },

  /* ══════════════════════════════════════════════════════════
     ИСТОРИЧЕСКИЙ АГРЕГАТ
     ══════════════════════════════════════════════════════════ */
  async getHistory(clientId) {
    const entries = await FteAPI.getByClient(clientId);
    const result  = [];
    const now     = new Date();
    for (let i = 11; i >= 0; i--) {
      const d  = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const entry = entries.find(e => e.month === ym);
      if (!entry || entry.members.length === 0) {
        result.push({ month: ym, fte: 0, avg_rate: 0, efficiency: null, delta_hours: 0, delta_money: 0 });
        continue;
      }
      const fte = entry.members.reduce((s,m) => s + (m.allocation||1), 0);
      let totalAlloc=0, weightedRate=0, totalPlanned=0, totalActual=0, totalPlannedRev=0, totalActualRev=0, weightedEff=0;
      for (const m of entry.members) {
        const alloc   = m.allocation||1;
        const planned = _fteMemberPlanned(m, ym);
        const actual  = m.actual_hours||0;
        const rate    = m.rate_per_hour||0;
        const eff     = planned > 0 ? actual/planned : 0;
        totalAlloc    += alloc;
        weightedRate  += rate * alloc;
        totalPlanned  += planned;
        totalActual   += actual;
        totalPlannedRev += planned * rate;
        totalActualRev  += actual  * rate;
        weightedEff   += eff * planned;
      }
      const avg_rate   = totalAlloc > 0 ? weightedRate/totalAlloc : 0;
      const efficiency = totalPlanned > 0 ? weightedEff/totalPlanned : null;
      result.push({ month: ym, fte, avg_rate: Math.round(avg_rate*100)/100, efficiency, delta_hours: totalActual-totalPlanned, delta_money: Math.round(totalActualRev-totalPlannedRev) });
    }
    return result;
  },

  /* ══════════════════════════════════════════════════════════
     SVG DUAL-AXIS ГРАФИК
     ══════════════════════════════════════════════════════════ */
  _renderChart() {
    const now = new Date();
    const months6 = [];
    for (let i = 5; i >= 0; i--) {
      const d  = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const entry = this.allEntries.find(e => e.month === ym);
      let fte=0, avg_rate=0, efficiency=null;
      if (entry && entry.members.length > 0) {
        fte = entry.members.reduce((s,m) => s+(m.allocation||1), 0);
        let totalAlloc=0, weightedRate=0, totalPlanned=0, weightedEff=0;
        for (const m of entry.members) {
          const alloc   = m.allocation||1;
          const planned = _fteMemberPlanned(m, ym);
          const actual  = m.actual_hours||0;
          const eff     = planned > 0 ? actual/planned : 0;
          totalAlloc   += alloc;
          weightedRate += (m.rate_per_hour||0)*alloc;
          totalPlanned += planned;
          weightedEff  += eff*planned;
        }
        avg_rate   = totalAlloc > 0 ? weightedRate/totalAlloc : 0;
        efficiency = totalPlanned > 0 ? weightedEff/totalPlanned : null;
      }
      months6.push({ ym, fte, avg_rate, efficiency, label: _fteFmtYM(ym) });
    }
    const hasAnyData = months6.some(d => d.fte > 0 || d.avg_rate > 0);
    if (!hasAnyData) return `<div class="dtab-chart-wrap"><div class="dtab-chart-title">📊 Динамика FTE и среднего рейта</div><div class="dtab-chart-empty">Нет данных за последние 6 месяцев</div></div>`;

    const W=660, H=260, PL=52, PR=52, PT=24, PB=44;
    const CW=W-PL-PR, CH=H-PT-PB, N=months6.length, step=CW/(N-1||1);
    const fteVals=months6.map(d=>d.fte), fteMax=Math.max(...fteVals,1), fteRange=fteMax||1;
    const rateVals=months6.map(d=>d.avg_rate), rateMax=Math.max(...rateVals,1), rateRange=rateMax||1;
    const ftePts  = months6.map((d,i)=>({ x:PL+i*step, y:PT+CH-(d.fte/fteRange)*CH, val:d.fte, ym:d.ym, label:d.label }));
    const ratePts = months6.map((d,i)=>({ x:PL+i*step, y:PT+CH-(d.avg_rate/rateRange)*CH, val:d.avg_rate, ym:d.ym, label:d.label }));
    const polyFTE  = ftePts.map(p=>`${p.x},${p.y}`).join(' ');
    const polyRate = ratePts.map(p=>`${p.x},${p.y}`).join(' ');
    const areaFTE  = `${PL},${PT+CH} `+ftePts.map(p=>`${p.x},${p.y}`).join(' ')+` ${PL+CW},${PT+CH}`;
    const grid = [0.25,0.5,0.75,1].map(t=>{
      const y=PT+CH*(1-t);
      return `<line x1="${PL}" y1="${y}" x2="${PL+CW}" y2="${y}" class="dtab-chart-grid"/>`+
        `<text x="${PL-6}" y="${y+4}" class="dtab-chart-axis-label dtab-chart-axis-left">${(fteRange*t).toFixed(1)}</text>`+
        `<text x="${PL+CW+6}" y="${y+4}" class="dtab-chart-axis-label dtab-chart-axis-right">$${(rateRange*t).toFixed(0)}</text>`;
    }).join('');
    const xLabels = months6.map((d,i)=>{
      const p=d.label.split(' ');
      const s=p[0].slice(0,3)+(p[1]?" '"+String(p[1]).slice(2):'');
      return `<text x="${PL+i*step}" y="${H-8}" class="dtab-chart-x-label">${s}</text>`;
    }).join('');
    const fteCircles = ftePts.map((p,i)=>{
      const eff=months6[i].efficiency; const es=eff!==null?Math.round(eff*100)+'%':'—';
      return `<circle cx="${p.x}" cy="${p.y}" r="5" class="dtab-chart-dot dtab-chart-dot--fte" data-ym="${p.ym}" data-label="${p.label}" data-fte="${p.val.toFixed(1)}" data-rate="${ratePts[i].val.toFixed(1)}" data-eff="${es}" tabindex="0" role="button"/>`;
    }).join('');
    const rateCircles = ratePts.map((p,i)=>{
      const eff=months6[i].efficiency; const es=eff!==null?Math.round(eff*100)+'%':'—';
      return `<circle cx="${p.x}" cy="${p.y}" r="5" class="dtab-chart-dot dtab-chart-dot--rate" data-ym="${p.ym}" data-label="${p.label}" data-fte="${ftePts[i].val.toFixed(1)}" data-rate="${p.val.toFixed(1)}" data-eff="${es}" tabindex="0" role="button"/>`;
    }).join('');

    return `<div class="dtab-chart-wrap">`+
      `<div class="dtab-chart-title">📊 Динамика FTE и среднего рейта — последние 6 месяцев</div>`+
      `<div class="dtab-chart-inner" style="position:relative">`+
      `<svg viewBox="0 0 ${W} ${H}" class="dtab-chart-svg">`+
      `<defs><linearGradient id="fte-area-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"/></linearGradient></defs>`+
      `<line x1="${PL}" y1="${PT+CH}" x2="${PL+CW}" y2="${PT+CH}" class="dtab-chart-axis"/>`+
      grid+xLabels+
      `<polygon points="${areaFTE}" fill="url(#fte-area-grad)"/>`+
      `<polyline points="${polyFTE}" class="dtab-chart-line dtab-chart-line--fte" fill="none"/>`+
      `<polyline points="${polyRate}" class="dtab-chart-line dtab-chart-line--rate" fill="none"/>`+
      rateCircles+fteCircles+
      `<text x="${PL-8}" y="${PT-8}" class="dtab-chart-axis-title dtab-chart-axis-title--left">FTE</text>`+
      `<text x="${PL+CW+PR-4}" y="${PT-8}" class="dtab-chart-axis-title dtab-chart-axis-title--right">$/ч</text>`+
      `</svg>`+
      `<div class="dtab-chart-tooltip" id="dtab-svg-tooltip"></div>`+
      `</div>`+
      `<div class="dtab-chart-legend">`+
      `<span class="dtab-chart-legend-item"><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#3b82f6" stroke-width="2.5"/><circle cx="9" cy="5" r="4" fill="#3b82f6"/></svg> FTE (левая ось)</span>`+
      `<span class="dtab-chart-legend-item"><svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,2"/><circle cx="9" cy="5" r="4" fill="#f59e0b"/></svg> Средний рейт $ (правая ось)</span>`+
      `</div></div>`;
  },

  _bindChartEvents() {
    const tooltip = document.getElementById('dtab-svg-tooltip');
    if (!tooltip) return;
    document.querySelectorAll('.dtab-chart-dot').forEach(dot => {
      const show = () => {
        tooltip.innerHTML = `<div class="dtab-tt-month">${dot.dataset.label}</div>`+
          `<div class="dtab-tt-row"><span class="dtab-tt-key">FTE</span><span class="dtab-tt-val">${dot.dataset.fte}</span></div>`+
          `<div class="dtab-tt-row"><span class="dtab-tt-key">Рейт</span><span class="dtab-tt-val">$${parseFloat(dot.dataset.rate).toFixed(1)}/ч</span></div>`+
          `<div class="dtab-tt-row"><span class="dtab-tt-key">Эффективность</span><span class="dtab-tt-val">${dot.dataset.eff}</span></div>`;
        const svg = dot.closest('svg');
        if (svg) {
          const sr = svg.getBoundingClientRect(), dr = dot.getBoundingClientRect();
          tooltip.style.left    = `${dr.left - sr.left + dr.width/2}px`;
          tooltip.style.top     = `${dr.top  - sr.top  - 8}px`;
          tooltip.style.display = 'block';
        }
      };
      const hide = () => { tooltip.style.display = 'none'; };
      dot.addEventListener('mouseenter', show);
      dot.addEventListener('focus',      show);
      dot.addEventListener('mouseleave', hide);
      dot.addEventListener('blur',       hide);
      dot.addEventListener('click',      show);
    });
  },
};

window.DeliveryTab = DeliveryTab;
window.FteAPI      = FteAPI;

/* ══════════════════════════════════════════════════════════════
   ROLE RADAR — радарная диаграмма покрытия ролями
   ══════════════════════════════════════════════════════════════ */

const _RADAR_AXES = [
  { key: 'role_account_manager', label: 'Account\nManager', short: 'AM'       },
  { key: 'role_coordinator',     label: 'Coordinator\n/ DC', short: 'DC'      },
  { key: 'role_sales',           label: 'Sales',             short: 'Sales'   },
  { key: 'role_delivery',        label: 'Delivery\n/ PM',    short: 'Delivery'},
  { key: 'role_csm',             label: 'CSM',               short: 'CSM'     },
];
const _RADAR_MAX   = 5;
const _RADAR_RINGS = 5;
const _RADAR_HINTS = { 0:'Не вовлечён', 1:'Минимальное участие', 2:'Минимальное участие', 3:'Активное участие', 4:'Активное участие', 5:'Ключевая роль' };

function _radarPt(cx, cy, r, a) { return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) }; }

function _buildRadarSVG(values, size=280) {
  // Лейблы рендерятся СТРОГО внутри SVG-холста.
  // Холст разбит на padding (место для текста) + внутренняя область для пятиугольника.
  const PAD  = size * 0.22;   // отступ по каждому краю под лейблы
  const N    = _RADAR_AXES.length;
  const cx   = size / 2;
  const cy   = size / 2;
  // Пятиугольник вписан во внутреннюю область (cx ± (size/2 - PAD))
  const R    = size / 2 - PAD;
  const step = (2 * Math.PI) / N;
  const LH   = 12;  // line-height лейбла

  // Сетка
  const rings = Array.from({length:_RADAR_RINGS},(_,ri)=>{
    const r=(ri+1)/_RADAR_RINGS*R;
    const pts=Array.from({length:N},(_,i)=>{const p=_radarPt(cx,cy,r,i*step);return`${p.x},${p.y}`;}).join(' ');
    return `<polygon points="${pts}" class="radar-ring"/>`;
  }).join('');

  // Оси
  const spokes = Array.from({length:N},(_,i)=>{
    const p=_radarPt(cx,cy,R,i*step);
    return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" class="radar-spoke"/>`;
  }).join('');

  // Полигон данных
  const dataPts = values.map((v,i)=>{
    const r=(v/_RADAR_MAX)*R; const p=_radarPt(cx,cy,r,i*step);
    return `${p.x},${p.y}`;
  }).join(' ');

  // Точки
  const dots = values.map((v,i)=>{
    const r=(v/_RADAR_MAX)*R; const p=_radarPt(cx,cy,r,i*step);
    const lbl=_RADAR_AXES[i].label.replace('\n',' ');
    return `<circle cx="${p.x}" cy="${p.y}" r="5" class="radar-dot" data-label="${lbl}" data-value="${v}" data-hint="${_RADAR_HINTS[v]||''}" tabindex="0" role="button" aria-label="${lbl}: ${v}/${_RADAR_MAX}"/>`;
  }).join('');

  // Лейблы: строго у каждой вершины, внутри холста
  const labels = _RADAR_AXES.map((ax,i)=>{
    const angle = i * step;          // 0 = верх, по часовой
    const sinA  = Math.sin(angle);
    const cosA  = Math.cos(angle);

    // Вершина пятиугольника
    const vx = cx + R * sinA;
    const vy = cy - R * cosA;

    // Лейбл смещаем ОТ вершины наружу — в направлении от центра
    const GAP = 8;  // px между вершиной и ближайшей строкой текста
    const lines = ax.label.split('\n');

    // Горизонтальный якорь по знаку sinA
    const anchor = Math.abs(sinA) < 0.2 ? 'middle'
                 : sinA > 0             ? 'start'
                 :                        'end';

    // X лейбла: вершина + GAP в сторону от центра по горизонтали
    const tx = vx + (Math.abs(sinA) < 0.2 ? 0 : sinA > 0 ? GAP : -GAP);

    // Y лейбла: вершина + GAP вертикально от центра
    // cosA > 0 → вершина ВЫШЕ центра → текст ВЫШЕ вершины → базовая линия первой строки - GAP сверху
    // cosA < 0 → вершина НИЖЕ центра → текст НИЖЕ вершины → базовая линия первой строки + GAP снизу
    // cosA ≈ 0 → боковые вершины → центрируем по Y
    let ty;
    if (cosA > 0.2) {
      // Верхние вершины: текст СВЕРХУ от вершины, последняя строка у вершины
      ty = vy - GAP - LH * (lines.length - 1);
    } else if (cosA < -0.2) {
      // Нижние вершины: текст СНИЗУ от вершины, первая строка у вершины
      ty = vy + GAP + LH;
    } else {
      // Боковые: вертикально центрируем относительно вершины
      ty = vy + LH * 0.5 - LH * (lines.length - 1) * 0.5;
    }

    const tspans = lines.map((ln,li)=>
      `<tspan x="${tx}" y="${ty + li * LH}">${ln}</tspan>`
    ).join('');

    return `<text class="radar-label" text-anchor="${anchor}" dominant-baseline="auto">${tspans}</text>`;
  }).join('');

  // Метки шкалы вдоль верхней оси (справа от спицы)
  const ticks = [1,2,3,4,5].map(v=>{
    const r=(v/_RADAR_MAX)*R; const p=_radarPt(cx,cy,r,0);
    return `<text x="${p.x+4}" y="${p.y+4}" class="radar-tick">${v}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${size} ${size}" class="radar-svg" width="${size}" height="${size}" aria-label="Радар покрытия ролями" style="overflow:hidden">`+
    rings+spokes+
    `<polygon points="${dataPts}" class="radar-poly"/>`+
    labels+ticks+dots+
    `<circle cx="${cx}" cy="${cy}" r="3" class="radar-center"/>`+
    `</svg>`;
}

function _radarValuesFromEntry(entry) {
  if (!entry) return _RADAR_AXES.map(()=>0);
  return _RADAR_AXES.map(ax=>Math.min(_RADAR_MAX,Math.max(0,Number(entry[ax.key])||0)));
}

function _radarCoverage(values) {
  const sum=values.reduce((s,v)=>s+v,0);
  return { sum, pct: Math.round(sum/(_RADAR_AXES.length*_RADAR_MAX)*100) };
}

const RoleRadar = {
  _clientId:  null,
  _pcEntryId: null,
  _values:    [0,0,0,0,0],
  _pcMonth:   null,
  _pcYear:    null,

  init(clientId, curPCEntry) {
    this._clientId  = clientId;
    this._pcEntryId = curPCEntry?.id    || null;
    this._pcMonth   = curPCEntry?.month || null;
    this._pcYear    = curPCEntry?.year  || null;
    this._values    = _radarValuesFromEntry(curPCEntry);
  },

  render(clientId, curPCEntry) {
    this.init(clientId, curPCEntry);
    return this._buildHTML();
  },

  _buildHTML() {
    const { sum, pct } = _radarCoverage(this._values);
    const covColor = pct>=80?'var(--green)':pct>=50?'var(--yellow)':'var(--red)';
    const warn = sum<10 ? `<div class="radar-warning">⚠️ Низкое покрытие ролями — риск для аккаунта</div>` : '';
    const valRow = _RADAR_AXES.map((ax,i)=>`
      <span class="radar-val-item" title="${_RADAR_HINTS[this._values[i]]||''}">
        <span class="radar-val-label">${ax.short}</span>
        <span class="radar-val-num" style="color:${this._values[i]>=4?'var(--green)':this._values[i]>=2?'var(--text-primary)':'var(--text-muted)'}">${this._values[i]}</span>
      </span>`).join('');
    return `<div class="radar-block" id="radar-block">`+
      `<div class="radar-header"><div class="radar-title">🎯 Покрытие ролями</div>`+
      `<button class="btn btn-ghost btn-xs" id="radar-edit-btn" title="Изменить">✏️ Изменить</button></div>`+
      `<div class="radar-canvas-wrap" id="radar-canvas-wrap">${_buildRadarSVG(this._values)}<div class="radar-tooltip" id="radar-tooltip" role="tooltip"></div></div>`+
      `<div class="radar-vals">${valRow}</div>`+
      `<div class="radar-coverage"><span class="radar-cov-label">Покрытие:</span><span class="radar-cov-pct" style="color:${covColor}">${pct}%</span></div>`+
      warn+`</div>`;
  },

  bindEvents() {
    this._bindTooltips();
    document.getElementById('radar-edit-btn')?.addEventListener('click',()=>this._openModal());
  },

  _bindTooltips() {
    const tt = document.getElementById('radar-tooltip');
    if (!tt) return;
    document.querySelectorAll('.radar-dot').forEach(dot=>{
      const show=()=>{
        tt.innerHTML=`<div class="radar-tt-label">${dot.dataset.label}</div>`+
          `<div class="radar-tt-val">${dot.dataset.value} / ${_RADAR_MAX}</div>`+
          `<div class="radar-tt-hint">${dot.dataset.hint}</div>`;
        tt.style.display='block';
        const wrap=document.getElementById('radar-canvas-wrap');
        if(wrap){const wr=wrap.getBoundingClientRect(),dr=dot.getBoundingClientRect();
          tt.style.left=`${dr.left-wr.left+dr.width/2}px`;
          tt.style.top=`${dr.top-wr.top-8}px`;}
      };
      const hide=()=>{tt.style.display='none';};
      dot.addEventListener('mouseenter',show);dot.addEventListener('focus',show);
      dot.addEventListener('mouseleave',hide);dot.addEventListener('blur',hide);
      dot.addEventListener('click',show);
    });
  },

  _openModal() {
    const sliders=_RADAR_AXES.map((ax,i)=>{
      const v=this._values[i];
      return `<div class="radar-slider-group">`+
        `<div class="radar-slider-header"><label class="radar-slider-label" for="rsl-${i}">${ax.label.replace('\n',' / ')}</label><span class="radar-slider-cur" id="rsl-cur-${i}">${v}</span></div>`+
        `<input type="range" id="rsl-${i}" class="radar-slider" min="0" max="5" step="1" value="${v}" data-idx="${i}" aria-label="${ax.label.replace('\n',' ')}"/>`+
        `<div class="radar-slider-hint" id="rsl-hint-${i}">${_RADAR_HINTS[v]||''}</div></div>`;
    }).join('');
    App.openModal(`<div class="radar-modal-wrap">`+
      `<h2 class="modal-title">🎯 Покрытие ролями</h2>`+
      `<p class="radar-modal-sub">Укажите уровень вовлечённости каждой роли в аккаунт</p>`+
      `<div class="radar-sliders">${sliders}</div>`+
      `<div class="radar-modal-preview" id="radar-modal-preview">${_buildRadarSVG([...this._values],200)}</div>`+
      `<div class="modal-actions"><button class="btn btn-ghost" onclick="App.closeModal()">Отмена</button><button class="btn btn-primary" id="radar-save-btn">💾 Сохранить</button></div>`+
      `</div>`);
    this._bindModalEvents();
  },

  _bindModalEvents() {
    document.querySelectorAll('.radar-slider').forEach(sl=>{
      const upd=()=>{
        const i=parseInt(sl.dataset.idx), v=parseInt(sl.value);
        const cur=document.getElementById(`rsl-cur-${i}`);
        const ht=document.getElementById(`rsl-hint-${i}`);
        if(cur) cur.textContent=v;
        if(ht)  ht.textContent=_RADAR_HINTS[v]||'';
        const tmp=_RADAR_AXES.map((_,j)=>{const s=document.getElementById(`rsl-${j}`);return s?parseInt(s.value):this._values[j];});
        const prev=document.getElementById('radar-modal-preview');
        if(prev) prev.innerHTML=_buildRadarSVG(tmp,200);
      };
      sl.addEventListener('input',upd); sl.addEventListener('change',upd);
    });
    document.getElementById('radar-save-btn')?.addEventListener('click',async()=>this._save());
  },

  async _save() {
    const btn=document.getElementById('radar-save-btn');
    if(btn){btn.disabled=true;btn.textContent='⏳...';}
    const nv=_RADAR_AXES.map((_,i)=>{const s=document.getElementById(`rsl-${i}`);return s?Math.min(5,Math.max(0,parseInt(s.value)||0)):this._values[i];});
    try {
      const rp={}; _RADAR_AXES.forEach((ax,i)=>{rp[ax.key]=nv[i];});
      if(this._pcEntryId){
        const existing=await fetch(`tables/pc_entries/${this._pcEntryId}`).then(r=>r.json());
const full={...existing,...rp};delete full.id;delete full.created_at;delete full.updated_at;
await fetch(`tables/pc_entries/${this._pcEntryId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(full)});

      } else {
        const now=new Date();
        const payload={client_id:this._clientId,month:this._pcMonth||(now.getMonth()+1),year:this._pcYear||now.getFullYear(),...rp};
        const crit=window.PC_CRITERIA||{};
        for(const k of Object.keys(crit)){if(!(k in payload))payload[k]=1;}
        const cr=await fetch('tables/pc_entries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(r=>r.json());
        this._pcEntryId=cr?.id||null;
      }
      if(window.API) API._pcCache=null;
      this._values=nv;
      App.closeModal();
      App.toast('✅ Покрытие ролями обновлено','success');
      const block=document.getElementById('radar-block');
      if(block){block.outerHTML=this._buildHTML();this.bindEvents();}
    } catch(e){
      console.error('[RoleRadar._save]',e);
      App.toast('❌ Ошибка сохранения','error');
      if(btn){btn.disabled=false;btn.textContent='💾 Сохранить';}
    }
  },
};

window.RoleRadar=RoleRadar;

/* ══════════════════════════════════════════════════════════════
   TRACKER — TrackerAPI + TrackerPage (inline v1.0)
   Доступ: service_delivery, csm_analyst
   Таблица: my_activities
   ══════════════════════════════════════════════════════════════ */

const TrackerAPI = {
  _cache: null, _cacheTs: 0, TTL: 30000,
  async getAll(force=false) {
    const now=Date.now();
    if(!force&&this._cache&&(now-this._cacheTs)<this.TTL) return this._cache;
    const res=await fetch('tables/my_activities?limit=1000&sort=date');
    const json=await res.json();
    const rows=(json.data||[]).map(r=>({...r,duration_minutes:Number(r.duration_minutes)||0,billable:r.billable===true||r.billable==='true'}));
    this._cache=rows; this._cacheTs=now; return rows;
  },
  async getByClient(cid){const a=await this.getAll();return a.filter(r=>String(r.client_id)===String(cid));},
  async getToday(){const a=await this.getAll();const t=new Date().toISOString().slice(0,10);return a.filter(r=>r.date===t);},
  async getThisMonth(){const a=await this.getAll();const ym=new Date().toISOString().slice(0,7);return a.filter(r=>String(r.date||'').slice(0,7)===ym);},
  async create(data){
    const res=await fetch('tables/my_activities',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    this._cache=null; return await res.json();
  },
  async update(id,data){
    const res=await fetch(`tables/my_activities/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    this._cache=null; return await res.json();
  },
  async delete(id){await fetch(`tables/my_activities/${id}`,{method:'DELETE'});this._cache=null;},
  sumMinutes(rows){return rows.reduce((s,r)=>s+(Number(r.duration_minutes)||0),0);},
  fmtDuration(m){if(!m)return'0м';const h=Math.floor(m/60),mn=m%60;if(h===0)return`${mn}м`;if(mn===0)return`${h}ч`;return`${h}ч ${mn}м`;},
  fmtHours(m){return(m/60).toFixed(1);},
};

const _TRK_TYPES = {
  call:'📞 Звонок', meeting:'🤝 Встреча', analysis:'🔍 Анализ',
  report:'📄 Отчёт', onboarding:'🚀 Онбординг', support:'🛠 Поддержка', other:'🗂 Другое',
};
const _TRK_DURATIONS = [15,30,45,60,90,120,180,240];

const TrackerPage = {
  _clients: [], _filterClientId: null, _editId: null,

  async render(params={}) {
    this._filterClientId = params.clientId || null;
    const el = document.getElementById('main-content');
    if(!el) return;
    const role = localStorage.getItem('bchs_role')||'';
    if(role && !['service_delivery','csm_analyst'].includes(role)){
      el.innerHTML=`<div class="trk-page"><div class="trk-access-denied"><div class="trk-denied-icon">🔒</div><h2>Нет доступа</h2><p>Трекер доступен для <strong>Service Delivery</strong> и <strong>CSM Analyst</strong>.</p></div></div>`;
      return;
    }
    el.innerHTML=`<div class="trk-page"><div class="trk-loading">⏳ Загружаю данные...</div></div>`;
    try {
      const [clientsRes,allActivities]=await Promise.all([
        fetch('tables/clients?limit=200&sort=name').then(r=>r.json()),
        TrackerAPI.getAll(true),
      ]);
      this._clients=clientsRes.data||[];
      const today=new Date().toISOString().slice(0,10);
      const ym=today.slice(0,7);
      const todayRows=allActivities.filter(r=>r.date===today);
      const monthRows=allActivities.filter(r=>String(r.date||'').slice(0,7)===ym);
      el.innerHTML=this._buildHTML(todayRows,monthRows,allActivities);
      this._bindEvents();
    } catch(e){
      el.innerHTML=`<div class="trk-page"><div class="trk-error">Ошибка загрузки: ${e.message}</div></div>`;
    }
  },

  _buildHTML(todayRows,monthRows,allRows){
    const todayMin=TrackerAPI.sumMinutes(todayRows);
    const monthMin=TrackerAPI.sumMinutes(monthRows);
    const totalMin=TrackerAPI.sumMinutes(allRows);
    return `
<div class="trk-page">
  <header class="trk-header">
    <div class="trk-header-left">
      <h1 class="trk-title">⏱ Мой трекер</h1>
      <p class="trk-subtitle">Личные billable часы по клиентам</p>
    </div>
    <div class="trk-header-stats">
      <div class="trk-hstat"><span class="trk-hstat-val">${TrackerAPI.fmtHours(todayMin)}ч</span><span class="trk-hstat-lbl">Сегодня</span></div>
      <div class="trk-hstat trk-hstat--accent"><span class="trk-hstat-val">${TrackerAPI.fmtHours(monthMin)}ч</span><span class="trk-hstat-lbl">Этот месяц</span></div>
      <div class="trk-hstat"><span class="trk-hstat-val">${TrackerAPI.fmtHours(totalMin)}ч</span><span class="trk-hstat-lbl">Всего</span></div>
    </div>
  </header>
  <section class="trk-section trk-quick" id="trk-quick-section">
    <h2 class="trk-section-title">➕ Добавить активность</h2>
    <form class="trk-quick-form" id="trk-quick-form">
      <input type="date" id="trk-date" class="trk-input trk-input--date" value="${new Date().toISOString().slice(0,10)}" />
      <select id="trk-client" class="trk-input trk-input--select">
        <option value="">— Клиент —</option>
        ${this._clients.map(c=>`<option value="${c.id}" ${String(c.id)===String(this._filterClientId)?'selected':''}>${c.name||c.company||c.id}</option>`).join('')}
      </select>
      <select id="trk-type" class="trk-input trk-input--select">
        ${Object.entries(_TRK_TYPES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
      </select>
      <select id="trk-duration" class="trk-input trk-input--select trk-input--narrow">
        ${_TRK_DURATIONS.map(m=>`<option value="${m}" ${m===30?'selected':''}>${m<60?m+'м':(m/60)+'ч'}</option>`).join('')}
      </select>
      <input type="text" id="trk-note" class="trk-input trk-input--note" placeholder="Заметка..." maxlength="200" />
      <label class="trk-billable-label"><input type="checkbox" id="trk-billable" checked /><span class="trk-billable-txt">Billable</span></label>
      <button type="submit" class="trk-btn trk-btn--primary" id="trk-submit-btn">＋ Добавить</button>
    </form>
    <div class="trk-form-feedback" id="trk-form-feedback"></div>
  </section>
  <section class="trk-section" id="trk-today-section">
    <div class="trk-section-header">
      <h2 class="trk-section-title">📅 Сегодня</h2>
      <span class="trk-section-badge">${TrackerAPI.fmtDuration(todayMin)}</span>
    </div>
    <div id="trk-today-list">${this._renderTodayList(todayRows)}</div>
  </section>
  <section class="trk-section" id="trk-month-section">
    <div class="trk-section-header">
      <h2 class="trk-section-title">📊 Этот месяц</h2>
      <span class="trk-section-badge">${TrackerAPI.fmtDuration(monthMin)}</span>
    </div>
    ${this._renderMonthTable(monthRows)}
  </section>
  <section class="trk-section" id="trk-insights-section">
    <h2 class="trk-section-title">💡 Инсайты</h2>
    <div class="trk-insights-grid">${this._renderInsights(allRows,monthRows)}</div>
  </section>
</div>`;
  },

  _renderTodayList(rows){
    if(!rows.length) return `<div class="trk-empty">Пока ничего. Самое время залогировать первую активность 😊</div>`;
    return `<div class="trk-activity-list">${rows.map(r=>this._actRow(r)).join('')}</div>`;
  },

  _actRow(r){
    const cn=this._cn(r.client_id);
    const tl=_TRK_TYPES[r.type]||r.type||'—';
    const bt=r.billable?`<span class="trk-tag trk-tag--billable">💰 Billable</span>`:`<span class="trk-tag trk-tag--nb">Non-bill</span>`;
    return `<div class="trk-activity-row" data-id="${r.id}">
      <div class="trk-act-type">${tl}</div>
      <div class="trk-act-client">${cn}</div>
      <div class="trk-act-dur">${TrackerAPI.fmtDuration(r.duration_minutes)}</div>
      <div class="trk-act-note">${r.note||''}</div>
      <div class="trk-act-meta">${bt}</div>
      <div class="trk-act-actions">
        <button class="trk-act-btn trk-act-edit" data-id="${r.id}" title="Редактировать">✏️</button>
        <button class="trk-act-btn trk-act-del" data-id="${r.id}" title="Удалить">🗑</button>
      </div>
    </div>`;
  },

  _renderMonthTable(rows){
    if(!rows.length) return `<div class="trk-empty">Активностей за этот месяц нет.</div>`;
    const byC={};
    for(const r of rows){const cid=r.client_id||'__none__';if(!byC[cid])byC[cid]={minutes:0,rows:[],types:{}};byC[cid].minutes+=r.duration_minutes;byC[cid].rows.push(r);byC[cid].types[r.type]=(byC[cid].types[r.type]||0)+r.duration_minutes;}
    const tot=TrackerAPI.sumMinutes(rows);
    const sc=Object.entries(byC).sort((a,b)=>b[1].minutes-a[1].minutes);
    return `<div class="trk-month-table-wrap"><table class="trk-month-table">
      <thead><tr><th>Клиент</th><th>Часов</th><th>%</th><th>Топ тип</th><th>Billable</th></tr></thead>
      <tbody>${sc.map(([cid,d])=>{
        const pct=tot>0?Math.round(d.minutes/tot*100):0;
        const top=Object.entries(d.types).sort((a,b)=>b[1]-a[1])[0];
        const tl=top?(_TRK_TYPES[top[0]]||top[0]):'—';
        const bm=d.rows.filter(r=>r.billable).reduce((s,r)=>s+r.duration_minutes,0);
        return `<tr><td class="trk-mt-client">${this._cn(cid)}</td><td class="trk-mt-hours">${TrackerAPI.fmtHours(d.minutes)}ч</td><td class="trk-mt-pct"><div class="trk-pct-bar" style="--pct:${pct}%">${pct}%</div></td><td class="trk-mt-type">${tl}</td><td class="trk-mt-bill">${TrackerAPI.fmtHours(bm)}ч</td></tr>`;
      }).join('')}</tbody>
      <tfoot><tr><td><strong>Итого</strong></td><td><strong>${TrackerAPI.fmtHours(tot)}ч</strong></td><td>${sc.length} кл.</td><td>—</td><td><strong>${TrackerAPI.fmtHours(rows.filter(r=>r.billable).reduce((s,r)=>s+r.duration_minutes,0))}ч</strong></td></tr></tfoot>
    </table></div>`;
  },

  _renderInsights(allRows,monthRows){
    const mMin=TrackerAPI.sumMinutes(monthRows);
    const bMin=monthRows.filter(r=>r.billable).reduce((s,r)=>s+r.duration_minutes,0);
    const bR=mMin>0?Math.round(bMin/mMin*100):0;
    const byC={};for(const r of allRows){const cid=r.client_id||'__none__';byC[cid]=(byC[cid]||0)+r.duration_minutes;}
    const topC=Object.entries(byC).sort((a,b)=>b[1]-a[1])[0];
    const topCN=topC?this._cn(topC[0]):'—';
    const topCH=topC?TrackerAPI.fmtHours(topC[1]):'0';
    const byT={};for(const r of monthRows){byT[r.type]=(byT[r.type]||0)+r.duration_minutes;}
    const topT=Object.entries(byT).sort((a,b)=>b[1]-a[1])[0];
    const topTL=topT?(_TRK_TYPES[topT[0]]||topT[0]):'—';
    const topTH=topT?TrackerAPI.fmtHours(topT[1]):'0';
    const dom=new Date().getDate();
    const avg=dom>0?(mMin/dom).toFixed(0):0;
    return `
    <div class="trk-insight-card">
      <div class="trk-insight-icon">💰</div>
      <div class="trk-insight-body">
        <div class="trk-insight-val">${bR}%</div>
        <div class="trk-insight-lbl">Billable этот месяц</div>
        <div class="trk-insight-sub">${TrackerAPI.fmtHours(bMin)}ч из ${TrackerAPI.fmtHours(mMin)}ч</div>
      </div>
      <div class="trk-insight-bar-wrap"><div class="trk-insight-bar" style="--val:${bR}%;--color:var(--green)"></div></div>
    </div>
    <div class="trk-insight-card">
      <div class="trk-insight-icon">🏆</div>
      <div class="trk-insight-body">
        <div class="trk-insight-val">${topCN}</div>
        <div class="trk-insight-lbl">Топ клиент (всего)</div>
        <div class="trk-insight-sub">${topCH}ч зафиксировано</div>
      </div>
    </div>
    <div class="trk-insight-card">
      <div class="trk-insight-icon">📌</div>
      <div class="trk-insight-body">
        <div class="trk-insight-val">${topTL}</div>
        <div class="trk-insight-lbl">Топ активность (месяц)</div>
        <div class="trk-insight-sub">${topTH}ч · ${avg}м/день в среднем</div>
      </div>
    </div>`;
  },

  _cn(cid){
    if(!cid||cid==='__none__') return '— без клиента —';
    const c=this._clients.find(x=>String(x.id)===String(cid));
    return c?(c.name||c.company||cid):cid;
  },

  _bindEvents(){
    const form=document.getElementById('trk-quick-form');
    if(form) form.addEventListener('submit',e=>this._handleSubmit(e));
    document.getElementById('main-content')?.addEventListener('click',e=>{
      if(e.target.classList.contains('trk-act-edit')) this._openEdit(e.target.dataset.id);
      if(e.target.classList.contains('trk-act-del'))  this._confirmDel(e.target.dataset.id);
    });
  },

  async _handleSubmit(e){
    e.preventDefault();
    const btn=document.getElementById('trk-submit-btn');
    const fb=document.getElementById('trk-form-feedback');
    const cid=document.getElementById('trk-client')?.value;
    const dt=document.getElementById('trk-date')?.value;
    const tp=document.getElementById('trk-type')?.value;
    const dur=parseInt(document.getElementById('trk-duration')?.value)||30;
    const nt=document.getElementById('trk-note')?.value||'';
    const bl=document.getElementById('trk-billable')?.checked??true;
    if(!cid){fb.textContent='⚠️ Выберите клиента';fb.className='trk-form-feedback trk-form-feedback--err';return;}
    btn.disabled=true;btn.textContent='⏳ Сохраняю...';
    try{
      if(this._editId){
        await TrackerAPI.update(this._editId,{client_id:cid,date:dt,type:tp,duration_minutes:dur,note:nt,billable:bl});
        this._editId=null;btn.textContent='＋ Добавить';
      } else {
        await TrackerAPI.create({client_id:cid,date:dt,type:tp,duration_minutes:dur,note:nt,billable:bl});
      }
      fb.textContent='✅ Сохранено!';fb.className='trk-form-feedback trk-form-feedback--ok';
      document.getElementById('trk-note').value='';
      await this._refreshToday();
      await this._refreshMonth();
      setTimeout(()=>{if(fb)fb.textContent='';},2500);
    }catch(err){
      fb.textContent='❌ Ошибка: '+err.message;fb.className='trk-form-feedback trk-form-feedback--err';
    }finally{btn.disabled=false;}
  },

  async _refreshToday(){
    const today=new Date().toISOString().slice(0,10);
    const all=await TrackerAPI.getAll(true);
    const rows=all.filter(r=>r.date===today);
    const min=TrackerAPI.sumMinutes(rows);
    const le=document.getElementById('trk-today-list');
    const ba=document.querySelector('#trk-today-section .trk-section-badge');
    if(le) le.innerHTML=this._renderTodayList(rows);
    if(ba) ba.textContent=TrackerAPI.fmtDuration(min);
  },

  async _refreshMonth(){
    const ym=new Date().toISOString().slice(0,7);
    const all=await TrackerAPI.getAll();
    const rows=all.filter(r=>String(r.date||'').slice(0,7)===ym);
    const min=TrackerAPI.sumMinutes(rows);
    const sec=document.getElementById('trk-month-section');
    if(!sec) return;
    const ba=sec.querySelector('.trk-section-badge');
    if(ba) ba.textContent=TrackerAPI.fmtDuration(min);
    const old=sec.querySelector('.trk-month-table-wrap,.trk-empty');
    if(old) old.outerHTML=this._renderMonthTable(rows);
  },

  async _openEdit(id){
    const all=await TrackerAPI.getAll();
    const r=all.find(x=>x.id===id);
    if(!r) return;
    this._editId=id;
    const d=document.getElementById('trk-date');
    const c=document.getElementById('trk-client');
    const t=document.getElementById('trk-type');
    const dur=document.getElementById('trk-duration');
    const n=document.getElementById('trk-note');
    const b=document.getElementById('trk-billable');
    const btn=document.getElementById('trk-submit-btn');
    if(d)d.value=r.date||'';if(c)c.value=r.client_id||'';if(t)t.value=r.type||'call';
    if(n)n.value=r.note||'';if(b)b.checked=r.billable;if(btn)btn.textContent='💾 Сохранить';
    if(dur){const cl=_TRK_DURATIONS.reduce((p,cu)=>Math.abs(cu-r.duration_minutes)<Math.abs(p-r.duration_minutes)?cu:p);dur.value=cl;}
    document.getElementById('trk-quick-section')?.scrollIntoView({behavior:'smooth'});
    const fb=document.getElementById('trk-form-feedback');
    if(fb){fb.textContent='✏️ Редактирование записи…';fb.className='trk-form-feedback trk-form-feedback--info';}
  },

  async _confirmDel(id){
    if(!confirm('Удалить эту запись?')) return;
    try{await TrackerAPI.delete(id);await this._refreshToday();await this._refreshMonth();}
    catch(e){alert('Ошибка удаления: '+e.message);}
  },
};

window.TrackerAPI  = TrackerAPI;
window.TrackerPage = TrackerPage;

document.addEventListener('DOMContentLoaded', () => App.init().catch(e => {
  console.error('[App init]', e);
  document.getElementById('main-content').innerHTML =
    `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Ошибка запуска</div><div class="empty-state-text">${e.message}</div></div>`;
    
}));
