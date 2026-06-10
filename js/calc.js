/* ============================================
   Portfolio BCHS — Calc Engine v7.0
   ClientCalc (BCG/Priority) + Calc (bCHS/PC/Final)
   ============================================ */

import { SIGNALS, PC_CRITERIA, MONTHS_SHORT } from './constants.js';

/* ======== CLIENT CALC ENGINE ======== */
export const ClientCalc = {
  financialValue(mr) {
    const v = +mr || 0;
    if (v >= 25000) return 'HIGH';
    if (v >= 6000)  return 'MEDIUM';
    return 'LOW';
  },

  strategicSum(c) {
    let sum = 0;
    sum += { Strategic:3, Standard:2, Basic:1 }[c.tech_value]              || 0;
    sum += { Top:3, Recognizable:2, Unknown:1 }[c.brand_value]             || 0;
    sum += { Yes:2, No:1 }[c.growth_potential]                             || 0;
    sum += { 'C-level':3, 'Tech Lead':2, 'Gatekeeper':1 }[c.decision_maker_level] || 0;
    sum += { 'Yes':2, 'Partial':1, 'No':0 }[c.managed_services_potential] || 0;
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
    if (ct === 'Stable (6+)')                            return 'HIGH';
    if (ct === 'Medium (3-6)' && ms === 'Yes')           return 'HIGH';
    if (ct === 'Medium (3-6)')                           return 'MEDIUM';
    if (ct === 'Short (1-3)'  && ms === 'Yes')           return 'MEDIUM';
    return 'LOW';
  },

  complexity(c) {
    const diff = c.client_difficulty, eng = c.client_engagement;
    const op = c.operational_difficulty, phase = c.phase, mat = c.team_maturity;
    const high =
      (diff === 'Conflict' && eng  === 'Reactive') ||
      (diff === 'Conflict' && op   === 'Hard')     ||
      (eng  === 'Reactive' && op   === 'Hard')     ||
      (phase === 'SLA'     && mat  === 'Junior');
    if (high) return 'HIGH';
    const med =
      diff  === 'Conflict' || eng === 'Reactive' || op === 'Hard' ||
      (phase === 'SLA' && mat === 'Standard');
    if (med) return 'MEDIUM';
    return 'LOW';
  },

  bcgCategory(c, fin, strat, stab, compl) {
    const gr  = c.growth_potential === 'Yes';
    const ct  = c.contract_length;
    const eng = c.client_engagement;
    const acc = c.access_to_end_client;

    if (c.client_type === 'Body-shop')    return 'TAIL';
    if (!gr && ct === 'Short (1-3)')      return 'TAIL';

    if (fin === 'HIGH' && stab === 'HIGH' && gr)
      return compl === 'HIGH' ? 'KEY_ALERT' : 'KEY';
    if (fin === 'HIGH' && stab === 'HIGH')                              return 'STABLE';
    if (fin === 'HIGH' && gr)                                           return 'GROWTH';
    if (fin === 'HIGH')                                                 return 'STABLE';
    if (fin === 'MEDIUM' && strat === 'HIGH'   && gr)                  return 'GROWTH';
    if (fin === 'MEDIUM' && strat === 'MEDIUM' && gr)                  return 'GROWTH_EARLY';
    if (fin === 'LOW'    && stab  === 'HIGH'   && gr && acc !== 'N/A') return 'GROWTH';
    if (fin === 'LOW'    && stab  === 'HIGH'   && gr)                  return 'GROWTH_EARLY';
    if (fin === 'LOW'    && stab  === 'MEDIUM' && gr &&
        (eng === 'Proactive' || eng === 'Active'))                      return 'GROWTH_EARLY';
    if (fin === 'MEDIUM' && (strat === 'HIGH' || strat === 'MEDIUM') &&
        acc !== 'N/A')                                                  return 'STABLE';
    return 'TAIL';
  },

  priorityScore(fin, strat, stab, eng, compl) {
    const fv  = { HIGH:3, MEDIUM:2, LOW:1 }[fin]              || 1;
    const sv  = { HIGH:3, MEDIUM:2, LOW:1 }[strat]            || 1;
    const stv = { HIGH:3, MEDIUM:2, LOW:1 }[stab]             || 1;
    const ev  = { Proactive:3, Active:2, Reactive:1 }[eng]    || 2;
    const cv  = { HIGH:1, MEDIUM:2, LOW:3 }[compl]            || 2;
    return Math.round((fv*0.25 + sv*0.25 + stv*0.25 + ev*0.15 + cv*0.10) * 100) / 100;
  },

  keyAccountPriority(bcg, score, c) {
    const phase = c.phase, gr = c.growth_potential === 'Yes';
    if (phase === 'Winding Down') return gr ? 'NURTURE' : 'MINIMAL';
    if (phase === 'Discovery')    return 'INVEST';
    const raw = bcg.replace('_ALERT', '');
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
    const raw = bcg.replace('_ALERT', '');
    if (phase === 'Discovery' || phase === 'Winding Down') return '—';
    if (phase === 'SLA') {
      return (compl === 'HIGH' || compl === 'MEDIUM') ? 'Lead' : 'Coordinator';
    }
    if (phase === 'Ongoing') {
      if (raw === 'KEY')    return compl === 'HIGH' ? 'Lead' : 'Coordinator';
      if (raw === 'STABLE') {
        if (compl === 'HIGH')   return 'Coordinator';
        if (compl === 'MEDIUM') return 'Setup';
        return 'Support';
      }
      if (raw === 'GROWTH' || raw === 'GROWTH_EARLY') {
        if (priority === 'INVEST')    return compl === 'HIGH' ? 'Coordinator' : 'Setup';
        if (priority === 'NURTURE')   return 'Setup';
        if (priority === 'EVALUATE')  return 'Watch';
      }
      if (raw === 'TAIL') return priority === 'RECONSIDER' ? 'Check' : '—';
    }
    return '—';
  },

  hours(csm, mat) {
    const matMult = { Junior:1.25, Standard:1.0, Senior:0.8 }[mat] || 1.0;
    const csmBase = {
      Lead:2.5, Coordinator:2.0, Setup:1.75,
      Support:1.25, Watch:0.75, Check:0.25, '—':0.5,
    }[csm] || 0.5;
    return Math.round(csmBase * matMult * 100) / 100;
  },

  compute(c) {
    const fin   = this.financialValue(c.monthly_revenue);
    const strat = this.strategicValue(c);
    const stab  = this.stability(c);
    const compl = this.complexity(c);
    const bcg   = this.bcgCategory(c, fin, strat, stab, compl);
    const score = this.priorityScore(fin, strat, stab, c.client_engagement || 'Active', compl);
    const kap   = this.keyAccountPriority(bcg, score, c);
    const csm   = this.csmAssignment(bcg, kap, compl, c.phase || 'Ongoing');
    const hrs   = this.hours(csm, c.team_maturity || 'Standard');
    const capPct = Math.round(hrs / 14 * 100 * 10) / 10;
    return {
      financial_value:      fin,
      strategic_value:      strat,
      stability:            stab,
      complexity:           compl,
      bcg_category:         bcg === 'KEY_ALERT' ? 'KEY' : bcg,
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
export const Calc = {

  computeBCHS(entry) {
    if (!entry) return null;
    let score = 0, anyTrue = false;
    for (const [key, def] of Object.entries(SIGNALS)) {
      if (entry[key] == true) { score += def.weight; anyTrue = true; }
    }
    return anyTrue ? score : null;
  },

  loyaltyPct(bchs) {
    if (bchs === null || bchs === undefined) return null;
    return Math.round((bchs + 81) / 162 * 100);
  },

  bchsCategory(bchs) {
    if (bchs === null || bchs === undefined) return { label: '—', key: 'none' };
    if (bchs >= 50)  return { label: 'Champions',  key: 'champions'  };
    if (bchs >= 20)  return { label: 'Promoters',  key: 'promoters'  };
    if (bchs >= -19) return { label: 'Passives',   key: 'passives'   };
    if (bchs >= -49) return { label: 'At Risk',    key: 'at_risk'    };
    return               { label: 'Detractors', key: 'detractors' };
  },

  PC_WEIGHTS: {
    people_count:       0.14,
    project_complexity: 0.14,
    reporting:          0.15,
    risk_probability:   0.14,
    risk_consequences:  0.14,
    face_role:          0.15,
    emotional_load:     0.14,
  },

  computePC(entry) {
    if (!entry) return null;
    const keys = Object.keys(this.PC_WEIGHTS);
    const filled = keys.filter(k => entry[k] !== null && entry[k] !== undefined && entry[k] >= 1 && entry[k] <= 5);
    if (filled.length < keys.length) return null;
    let score = 0;
    for (const key of keys) score += (entry[key] || 0) * this.PC_WEIGHTS[key];
    return Math.round(score * 10) / 10;
  },

  finalScore(bchs, pc) {
    if (bchs === null || bchs === undefined) return null;
    if (pc   === null || pc   === undefined) return null;
    return Math.round((((bchs + 81) / 162) * 60 + (pc / 5) * 40) * 10) / 10;
  },

  healthSignal(bchs) {
    if (bchs === null || bchs === undefined) return { label: '—',             key: 'none',    cls: 'no-data'       };
    if (bchs >= 20)  return { label: 'Здоров',      key: 'Healthy', cls: 'health-healthy' };
    if (bchs >= -10) return { label: 'Нейтрально',  key: 'Neutral', cls: 'health-neutral' };
    if (bchs >= -30) return { label: 'Осторожно',   key: 'Caution', cls: 'health-caution' };
    return               { label: 'Риск',         key: 'AtRisk',  cls: 'health-risk'    };
  },

  loadSignal(pcScore) {
    if (pcScore === null || pcScore === undefined) return { label: '—',            key: 'none'    };
    if (pcScore >= 3.5) return { label: 'High Load', key: 'High'    };
    if (pcScore >= 2.5) return { label: '🟡 Med Load',  key: 'Med'     };
    if (pcScore >= 1.5) return { label: 'Low Load',  key: 'Low'     };
    return                  { label: '⚪ Minimal',    key: 'Minimal' };
  },

  actionBadge(priority, healthKey, status) {
    if (status === 'Paused') return { label: '⏸ ПАУЗА', cls: 'badge-autopilot' };
    if (!healthKey || healthKey === 'none') return { label: '— —', cls: 'badge-autopilot' };
    const atRisk = healthKey === 'Caution' || healthKey === 'AtRisk';
    switch (priority) {
      case 'PROTECT':    return atRisk
        ? { label: 'PROTECT — критично', cls: 'badge-protect-crit' }
        : { label: '🟡 PROTECT — держать',  cls: 'badge-protect'      };
      case 'STRENGTHEN': return atRisk
        ? { label: '🚨 INTERVENE — срочно', cls: 'badge-intervene' }
        : { label: '🟡 STRENGTHEN',         cls: 'badge-protect'   };
      case 'RESCUE':     return { label: '🚨 RESCUE — срочно',  cls: 'badge-intervene' };
      case 'MAINTAIN':   return { label: 'MAINTAIN',          cls: 'badge-invest'    };
      case 'MONITOR':    return { label: '🔵 MONITOR',           cls: 'badge-monitor'   };
      case 'REVIEW':     return { label: '🔄 REVIEW',            cls: 'badge-reconsider'};
      case 'INVEST':     return healthKey === 'Healthy'
        ? { label: '📈 INVEST — развивать',  cls: 'badge-invest'  }
        : { label: '🔵 MONITOR — наблюдать', cls: 'badge-monitor' };
      case 'NURTURE':    return atRisk
        ? { label: '🚨 INTERVENE — срочно',  cls: 'badge-intervene' }
        : healthKey === 'Healthy'
          ? { label: '🔵 NURTURE — развивать', cls: 'badge-nurture' }
          : { label: '🔵 MONITOR — наблюдать', cls: 'badge-monitor' };
      case 'EVALUATE':   return healthKey === 'Healthy'
        ? { label: '🔍 EVALUATE — активно',   cls: 'badge-evaluate' }
        : { label: '🔍 EVALUATE — осторожно', cls: 'badge-evaluate' };
      case 'RECONSIDER': return { label: '🔄 RECONSIDER — пересмотреть', cls: 'badge-reconsider' };
      case 'MINIMAL':    return atRisk
        ? { label: '️ MINIMAL — но есть сигналы', cls: 'badge-minimal-alert' }
        : { label: '⚪ AUTOPILOT — минимум',        cls: 'badge-autopilot'     };
      default:           return { label: '— —', cls: 'badge-autopilot' };
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

  potentialIdeal(bcgCategory) {
    if (bcgCategory === 'KEY' || bcgCategory === 'KEY_ALERT') return 88;
    if (bcgCategory === 'GROWTH')       return 80;
    if (bcgCategory === 'GROWTH_EARLY') return 74;
    return 72;
  },

  potentialPct(finalScore, bcgCategory) {
    if (finalScore === null || finalScore === undefined) return null;
    return Math.round(finalScore / this.potentialIdeal(bcgCategory) * 100);
  },

  trend3m(monthly) {
    if (!monthly || monthly.length < 2) return null;
    const withData = monthly.filter(d => d.bchs !== null);
    if (withData.length < 2) return null;
    const last3  = withData.slice(-3);
    const oldest = last3[0].bchs;
    const latest = last3[last3.length - 1].bchs;
    if (oldest === 0 && latest === 0) return null;
    const d = latest - oldest;
    if (d > 5)  return { label: `↗️ +${d}`, cls: 'trend-up',   delta: d };
    if (d < -5) return { label: `↘️ ${d}`,  cls: 'trend-down', delta: d };
    return          { label: '→ 0',      cls: 'trend-flat', delta: d };
  },

  focusText(client, bchs, health, compl) {
    const { key_account_priority: priority, status, phase } = client;
    const h = health.key;
    if (!priority) return 'Данные не заполнены → добавьте параметры клиента';
    if (status === 'Paused') {
      return priority === 'INVEST'
        ? 'Инвестиция заморожена: проект на паузе → зафиксировать метрику возобновления'
        : 'Проект на паузе → подтвердить статус и следующий шаг';
    }
    if (phase === 'Discovery')    return 'Фаза открытия: выявить потребности → провести квалификацию за 30 дней';
    if (phase === 'Winding Down') return client.growth_potential === 'Yes'
      ? 'Завершение + потенциал: удержать отношения → предложить новый формат работы'
      : 'Завершение проекта → зафиксировать итоги и закрыть корректно';
    switch (priority) {
      case 'PROTECT':    return h === 'AtRisk'  ? 'Ключевой клиент под угрозой → экстренная встреча с ЛПР, стабилизация'
                              : h === 'Caution' ? 'Ключевой клиент в зоне риска → усилить ритм касаний, проверить триггеры'
                              : h === 'Healthy' ? 'Защита устойчива: клиент здоров → закрепить присутствие и искать точки углубления'
                              : 'Ключевой клиент стабилен → держать ритм и мониторить вовлечённость';
      case 'STRENGTHEN': return (h === 'AtRisk' || h === 'Caution')
                              ? 'Укрепление под угрозой → устранить риск до попытки роста'
                              : 'Укрепление позиций: хорошие условия → углублять диалог, выходить на C-level';
      case 'RESCUE':     return 'Критическая ситуация: срочное вмешательство → эскалировать до топ-менеджмента';
      case 'MAINTAIN':   return compl === 'HIGH'
                              ? 'STABLE с высокой нагрузкой → оптимизировать процессы, снизить операционный риск'
                              : 'Стабильный клиент → держать SLA, минимум изменений, ежеквартальный QBR';
      case 'MONITOR':    return (h === 'AtRisk' || h === 'Caution')
                              ? 'Наблюдение с тревогой: ситуация ухудшается → усилить контакт'
                              : 'Мониторинг: клиент в норме → отслеживать изменения, реагировать на сигналы';
      case 'REVIEW':     return 'Пересмотр STABLE → проверить актуальность условий, оценить продление';
      case 'INVEST':     return h === 'Healthy' ? 'Момент для роста: клиент в хорошей зоне → расширять скоуп и закреплять партнёрство'
                              : h === 'Neutral' ? 'Инвестиция под вопросом: лояльность не подтверждает готовность → сначала выстроить доверие'
                              : 'Инвестиция под угрозой: тревожные сигналы → сначала устранить риск';
      case 'NURTURE':    return (h === 'AtRisk' || h === 'Caution') ? 'Взращивание под угрозой: тревожные сигналы → сначала устранить риск'
                              : h === 'Healthy' ? 'Взращивание активно: клиент готов → углублять диалог и искать следующий шаг'
                              : 'Взращивание в ожидании: нет чётких сигналов → спровоцировать реакцию, проверить интерес';
      case 'EVALUATE':   return h === 'Healthy' ? 'Оценка: хорошие сигналы → зафиксировать критерий инвестиции'
                              : h === 'Neutral' ? 'Оценка: сигналов недостаточно → установить дедлайн решения'
                              : 'Оценка под вопросом: тревожные сигналы → закрыть EVALUATE, пересмотреть категорию';
      case 'RECONSIDER': return 'Пересмотр категории: параметры не подтверждают стратегию → аудит до конца квартала';
      case 'MINIMAL':    return (h === 'AtRisk' || h === 'Caution')
                              ? 'Автопилот с сигналом: тревожные признаки → оценить стоит ли реагировать'
                              : 'Автопилот: клиент стабилен → минимум касаний, SLA в приоритете';
      default:           return 'Данные не заполнены → добавьте параметры клиента';
    }
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

    let lb = null, lp = null;
    for (let i = sortedB.length - 1; i >= 0; i--) {
      const be = sortedB[i];
      const pe = sortedP.find(
        p => Number(p.month) === Number(be.month) && Number(p.year) === Number(be.year)
      );
      if (pe) { lb = be; lp = pe; break; }
    }
    if (!lb && sortedB.length > 0) lb = sortedB[sortedB.length - 1];
    if (!lp && sortedP.length > 0) lp = sortedP[sortedP.length - 1];

    const bchs    = this.computeBCHS(lb);
    const pcScore = this.computePC(lp);
    const loyalty = this.loyaltyPct(bchs);

    let revenueEfficiency = null;
    const clientFte = fArr
      .filter(e => String(e.client_id) === String(client.id))
      .sort((a, b) => (a.month || '').localeCompare(b.month || ''));
    if (clientFte.length > 0) {
      const last    = clientFte[clientFte.length - 1];
      const members = Array.isArray(last.members) ? last.members : [];
      let tp = 0, we = 0;
      for (const m of members) {
        const planned = (m.planned_hours !== null && m.planned_hours !== undefined && m.planned_hours !== '')
          ? Number(m.planned_hours)
          : window.CalendarEngine
            ? window.CalendarEngine.getPlannedHours(m.location || 'BY', last.month, m.allocation || 1.0)
            : Math.round(168 * (m.allocation || 1.0));
        const eff = planned > 0 ? (m.actual_hours || 0) / planned : 0;
        tp += planned;
        we += eff * planned;
      }
      if (tp > 0) revenueEfficiency = we / tp;
    }

    const rawFinal = this.finalScore(bchs, pcScore);
    const final    = (rawFinal !== null && revenueEfficiency !== null && revenueEfficiency < 0.8)
      ? Math.round(rawFinal * 0.95 * 10) / 10
      : rawFinal;

    const health  = this.healthSignal(bchs);
    const load    = this.loadSignal(pcScore);
    const ideal   = this.potentialIdeal(client.bcg_category);
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

    const monthlyData   = monthly;
    const bchsHistory   = sortedB;
    const pcHistory     = sortedP;
    const curBCHSEntry  = lb;
    const curPCEntry    = lp;
    const trend         = this.trend3m(monthly);
    const pctPot        = potential;

    const phase  = client.phase || '';
    const mr     = Number(client.monthly_revenue) || 0;
    const eng    = client.client_engagement || 'Active';
    const stab2  = client.stability || 'MEDIUM';
    const ms     = client.managed_services_potential || 'No';
    let riskRate = 0, revenueAtRisk = 0;
    const isWD   = phase === 'Winding Down';
    if (isWD) {
      riskRate = 0.5; revenueAtRisk = Math.round(mr * 0.5);
    } else {
      const engRisk   = eng   === 'Reactive' ? 0.30 : eng   === 'Active' ? 0.10 : 0.03;
      const complRisk = compl === 'HIGH'     ? 0.15 : compl === 'MEDIUM' ? 0.05 : 0;
      const stabRisk  = stab2 === 'LOW'      ? 0.10 : stab2 === 'MEDIUM' ? 0.04 : 0;
      const msRisk    = ms    === 'No'       ? 0.05 : ms    === 'Partial' ? 0.02 : 0;
      riskRate = engRisk + complRisk + stabRisk + msRisk;
      revenueAtRisk = Math.round(mr * riskRate);
    }
    const riskPct   = Math.round(riskRate * 100);
    const riskCls   = isWD ? 'neutral' : riskRate >= 0.30 ? 'danger' : riskRate >= 0.15 ? 'warning' : 'positive';
    const riskColor = isWD ? '#6B7280' : riskRate >= 0.30 ? '#EF4444' : riskRate >= 0.15 ? '#F59E0B' : '#10B981';

    const totalHrs = Number(client.total_hours) || 0;
    const rphWD    = isWD;
    const revenuePerHour = (!rphWD && totalHrs > 0)
      ? Math.round(mr / totalHrs / 4.33) : null;
    const rphColor = (rphWD || revenuePerHour === null) ? '#6B7280'
      : revenuePerHour >= 500 ? '#10B981'
      : revenuePerHour >= 200 ? '#F59E0B' : '#EF4444';
    const rphCls   = (rphWD || revenuePerHour === null) ? 'neutral'
      : revenuePerHour >= 500 ? 'positive'
      : revenuePerHour >= 200 ? 'warning' : 'danger';

    // Считаем total_hours по BCG категории напрямую
    const BCG_HOURS = { KEY: 2.5, GROWTH: 2.0, GROWTH_EARLY: 1.75, STABLE: 1.25, TAIL: 0.75 };
    const matMult   = { Junior: 1.25, Standard: 1.0, Senior: 0.8 }[client.team_maturity || 'Standard'] || 1.0;
    const total_hours = Math.round((BCG_HOURS[client.bcg_category] || 0.5) * matMult * 100) / 100;

    // Priority score — вычисляем inline как в Calc.compute
    const _fin   = Number(client.financial_value  || 0);
    const _strat = Number(client.strategic_value  || 0);
    const _stab  = Number(client.stability        || 0);
    const _compl = client.complexity || 'MEDIUM';
    const _eng   = client.client_engagement || 'Active';
    const priority_score = ClientCalc.priorityScore(_fin, _strat, _stab, _eng, _compl);

    return {
      bchs, pcScore, loyalty, final, revenueEfficiency,
      health, load, monthly, monthlyData, trend, badge, focus, section,
      potential, potentialIdeal: ideal, pctPot, ideal,
      bchsHistory, pcHistory, curBCHSEntry, curPCEntry,
      riskRate, riskPct, revenueAtRisk, riskCls, riskColor, isWD,
      revenuePerHour, rphWD, rphColor, rphCls,
      total_hours, priority_score,
    };
  },
};
