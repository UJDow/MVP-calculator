/* ============================================
   Portfolio BCHS — Calculation Engine
   All scoring, health, load, focus text logic
   ============================================ */

const Calc = {

  /* ---- bCHS ---- */
  computeBCHS(entry) {
    if (!entry) return null;
    let score = 0;
    let anyTrue = false;
    for (const [key, def] of Object.entries(SIGNALS)) {
      if (entry[key] == true) {
        score += def.weight;
        anyTrue = true;
      }
    }
    if (!anyTrue) return null;
    return score;
  },

  /* ---- Loyalty % ---- */
  loyaltyPct(bchs) {
    if (bchs === null || bchs === undefined) return null;
    return Math.round((bchs + 81) / 162 * 100);
  },

  /* ---- PC Score (weighted SUMPRODUCT как в Excel) ---- */
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
    const vals = keys.map(k => entry[k]);
    const filled = vals.filter(v => v !== null && v !== undefined && v >= 1 && v <= 5);
    if (filled.length < keys.length) return null;
    let score = 0;
    for (const key of keys) {
      score += (entry[key] || 0) * this.PC_WEIGHTS[key];
    }
    return Math.round(score * 10) / 10;
  },

  /* ---- Final Score (0–100) ---- */
  finalScore(bchs, pcScore) {
    if (bchs === null || bchs === undefined) return null;
    if (pcScore === null || pcScore === undefined) return null;
    const val = ((bchs + 81) / 162) * 60 + (pcScore / 5) * 40;
    return Math.round(val * 10) / 10;
  },

  /* ---- Ideal Final Score по BCG ---- */
  idealScore(bcgCategory) {
    return (BCG_CATEGORIES[bcgCategory] || BCG_CATEGORIES.TAIL).ideal_final;
  },

  /* ---- % of Potential ---- */
  pctPotential(finalScore, bcgCategory) {
    if (finalScore === null || finalScore === undefined) return null;
    const ideal = this.idealScore(bcgCategory);
    return Math.round(finalScore / ideal * 100);
  },

  /* ---- Health Signal ---- */
  healthSignal(bchs) {
    if (bchs === null || bchs === undefined) return { label: '—', key: 'none', cls: 'no-data' };
    if (bchs >= 20)  return { label: '🟢 Здоров',     key: 'Healthy', cls: 'health-healthy' };
    if (bchs >= -10) return { label: '😐 Нейтрально', key: 'Neutral', cls: 'health-neutral' };
    if (bchs >= -30) return { label: '⚠️ Осторожно',  key: 'Caution', cls: 'health-caution' };
    return                  { label: '🔴 Риск',        key: 'AtRisk',  cls: 'health-risk'    };
  },

  /* ---- Load Signal ---- */
  loadSignal(pcScore) {
    if (pcScore === null || pcScore === undefined) return { label: '—', key: 'none' };
    if (pcScore >= 3.5) return { label: '🔴 High Load', key: 'High'    };
    if (pcScore >= 2.5) return { label: '🟡 Med Load',  key: 'Med'     };
    if (pcScore >= 1.5) return { label: '🟢 Low Load',  key: 'Low'     };
    return                    { label: '⚪ Minimal',    key: 'Minimal' };
  },

  /* ---- Action Badge ---- */
  actionBadge(priority, healthKey, status) {
    if (status === 'Paused') return { label: '⏸ ПАУЗА', cls: 'badge-autopilot' };
    if (!healthKey || healthKey === 'none') return { label: '— —', cls: 'badge-autopilot' };

    const atRisk = healthKey === 'Caution' || healthKey === 'AtRisk';

    switch (priority) {
      case 'PROTECT':
        if (atRisk) return { label: '🔴 PROTECT — критично', cls: 'badge-protect-crit' };
        return             { label: '🟡 PROTECT — держать',  cls: 'badge-protect'      };

      case 'STRENGTHEN':
      case 'RESCUE':
        return { label: '🚨 INTERVENE — срочно', cls: 'badge-intervene' };

      case 'INVEST':
        if (healthKey === 'Healthy') return { label: '📈 INVEST — развивать',  cls: 'badge-invest'  };
        return                               { label: '🔵 MONITOR — наблюдать', cls: 'badge-monitor' };

      case 'NURTURE':
        if (atRisk)                  return { label: '🚨 INTERVENE — срочно',  cls: 'badge-intervene' };
        if (healthKey === 'Healthy') return { label: '🔵 NURTURE — развивать', cls: 'badge-nurture'   };
        return                               { label: '🔵 MONITOR — наблюдать', cls: 'badge-monitor'   };

      case 'EVALUATE':
        if (healthKey === 'Healthy') return { label: '🔍 EVALUATE — активно',   cls: 'badge-evaluate' };
        return                               { label: '🔍 EVALUATE — осторожно', cls: 'badge-evaluate' };

      case 'RECONSIDER':
        return { label: '🔄 RECONSIDER — пересмотреть', cls: 'badge-reconsider' };

      case 'MAINTAIN':
      case 'MONITOR':
      case 'REVIEW':
        return { label: '🔵 MONITOR — наблюдать', cls: 'badge-monitor' };

      case 'MINIMAL':
        if (atRisk) return { label: '⚠️ MINIMAL — но есть сигналы', cls: 'badge-minimal-alert' };
        return             { label: '⚪ AUTOPILOT — минимум',        cls: 'badge-autopilot'     };

      default:
        return { label: '— —', cls: 'badge-autopilot' };
    }
  },

  /* ---- Dashboard Section ---- */
  dashSection(priority, healthKey, status) {
    if (status === 'Paused') return 'auto';
    if (!healthKey || healthKey === 'none') return 'auto';

    const atRisk = healthKey === 'Caution' || healthKey === 'AtRisk';

    if (priority === 'RESCUE')                        return 'alert';
    if (atRisk && priority === 'PROTECT')             return 'alert';
    if (atRisk && priority === 'NURTURE')             return 'alert';
    if (atRisk && priority === 'STRENGTHEN')          return 'alert';

    if (priority === 'MINIMAL')                       return 'auto';
    if (priority === 'RECONSIDER')                    return 'auto';
    if (priority === 'EVALUATE' && atRisk)            return 'auto';

    return 'work';
  },

  /* ---- Focus Text ---- */
  focusText(client, bchs, healthSignal, deviation) {
    const priority = client.key_account_priority;
    const status   = client.status;
    const health   = healthSignal.key;

    if (bchs === null && health === 'none') {
      return 'Серая зона: данные не заполнены → определить статус';
    }

    if (status === 'Paused') {
      if (priority === 'INVEST') {
        return 'Инвестиция заморожена: проект на паузе → зафиксировать метрику возобновления';
      }
      return 'Проект на паузе → подтвердить статус и следующий шаг';
    }

    const dev = deviation || 0;

    switch (priority) {
      case 'PROTECT':
        if (health === 'Caution' || health === 'AtRisk' || (health === 'Neutral' && dev < -20)) {
          return 'Защита под угрозой: лояльность ниже нормы → стабилизировать отношения, не давить на рост';
        }
        if (health === 'Neutral' && dev >= -20) {
          return 'Защита в норме: клиент стабилен → держать ритм и мониторить вовлечённость';
        }
        if (health === 'Healthy') {
          return 'Защита устойчива: клиент здоров → закрепить присутствие и искать точки углубления';
        }
        return 'Защита в норме: клиент стабилен → держать ритм и мониторить вовлечённость';

      case 'STRENGTHEN':
        if (health === 'Caution' || health === 'AtRisk') {
          return 'Укрепление под угрозой: тревожные сигналы → немедленно стабилизировать отношения';
        }
        return 'Укрепление позиций: работать над доступом к ЛПР и углублением вовлечённости';

      case 'RESCUE':
        return 'Критическая ситуация: срочное вмешательство → эскалировать до топ-менеджмента';

      case 'INVEST':
        if (health === 'Healthy') {
          return 'Момент для роста: клиент в хорошей зоне → расширять скоуп и закреплять партнёрство';
        }
        if (health === 'Neutral') {
          return 'Инвестиция под вопросом: лояльность не подтверждает готовность → сначала выстроить доверие';
        }
        return 'Инвестиция под угрозой: тревожные сигналы → сначала устранить риск';

      case 'NURTURE':
        if (health === 'Caution' || health === 'AtRisk') {
          return 'Взращивание под угрозой: тревожные сигналы → сначала устранить риск';
        }
        if (health === 'Healthy') {
          return 'Взращивание активно: клиент готов → углублять диалог и искать следующий шаг';
        }
        return 'Взращивание в ожидании: нет чётких сигналов → спровоцировать реакцию, проверить интерес';

      case 'EVALUATE':
        if (health === 'Healthy') {
          return 'Оценка: хорошие сигналы → зафиксировать критерий инвестиции';
        }
        if (health === 'Neutral') {
          return 'Оценка: сигналов недостаточно → установить дедлайн решения';
        }
        return 'Оценка под вопросом: тревожные сигналы → закрыть EVALUATE, пересмотреть категорию';

      case 'MAINTAIN':
        if (health === 'Caution' || health === 'AtRisk') {
          return 'Стабильность под угрозой: тревожные сигналы → устранить риск деградации';
        }
        return 'Поддержание уровня: клиент стабилен → держать ритм, не переинвестировать';

      case 'MONITOR':
        if (health === 'Caution' || health === 'AtRisk') {
          return 'Наблюдение с тревогой: ситуация ухудшается → усилить контакт, выяснить причины';
        }
        return 'Мониторинг: держать под контролем → реагировать на изменения';

      case 'REVIEW':
        return 'Требует пересмотра: текущие параметры изменились → обновить оценку клиента';

      case 'RECONSIDER':
        return 'Пересмотр категории: параметры не подтверждают стратегию → аудит до конца квартала';

      case 'MINIMAL':
        if (health === 'Caution' || health === 'AtRisk') {
          return 'Автопилот с сигналом: тревожные признаки → оценить стоит ли реагировать';
        }
        return 'Автопилот: клиент стабилен → минимум касаний, SLA в приоритете';

      default:
        return 'Серая зона: данные не заполнены → определить статус';
    }
  },

  /* ---- 3-month trend ---- */
  // Сравнивает самую старую и самую новую точку из последних 3 месяцев с данными
  trend3m(oldestBCHS, latestBCHS) {
    if (oldestBCHS === null || latestBCHS === null) return null;
    if (oldestBCHS === 0 && latestBCHS === 0) return null;
    const diff = latestBCHS - oldestBCHS;
    if (diff > 5)  return { label: `↗️ +${diff}`, cls: 'trend-up',   delta: diff };
    if (diff < -5) return { label: `↘️ ${diff}`,  cls: 'trend-down', delta: diff };
    return               { label: '→ 0',          cls: 'trend-flat', delta: diff };
  },

  /* ---- Full client computed state ---- */
  computeClient(client, bchsEntries, pcEntries, fteEntries = []) {
    if (!Array.isArray(bchsEntries)) bchsEntries = [];
    if (!Array.isArray(pcEntries))   pcEntries   = [];
    if (!Array.isArray(fteEntries))  fteEntries  = [];

    const clientBCHS = bchsEntries
      .filter(e => String(e.client_id) === String(client.id))
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

    const clientPC = pcEntries
      .filter(e => String(e.client_id) === String(client.id))
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);

    // Актуальный месяц = последний у которого есть и bCHS и PC запись
    // Если PC нет вообще — берём последнюю bCHS запись
    let curBCHSEntry = null;
    let curPCEntry   = null;

    for (let i = clientBCHS.length - 1; i >= 0; i--) {
      const be = clientBCHS[i];
      const pe = clientPC.find(
        p => Number(p.month) === Number(be.month) && Number(p.year) === Number(be.year)
      );
      if (pe) {
        curBCHSEntry = be;
        curPCEntry   = pe;
        break;
      }
    }

    // Fallback: есть bCHS но нет ни одной PC записи
    if (!curBCHSEntry && clientBCHS.length > 0) {
      curBCHSEntry = clientBCHS[clientBCHS.length - 1];
    }

    const bchs  = this.computeBCHS(curBCHSEntry);
    const curPC = this.computePC(curPCEntry);

    const loyalty = this.loyaltyPct(bchs);

    // Revenue Efficiency из последней записи fteEntries (для этого клиента)
    // Берём запись с максимальным month (лексикографически YYYY-MM)
    let revenueEfficiency = null;
    {
      const clientFte = fteEntries
        .filter(e => String(e.client_id) === String(client.id))
        .sort((a, b) => (a.month || '').localeCompare(b.month || ''));
      if (clientFte.length > 0) {
        const lastEntry = clientFte[clientFte.length - 1];
        // Вычисляем взвешенную эффективность (аналог getAvgEfficiency)
        let totalPlanned = 0, weightedEff = 0;
        const members = Array.isArray(lastEntry.members) ? lastEntry.members : [];
        for (const m of members) {
          let planned;
          if (m.planned_hours !== null && m.planned_hours !== undefined && m.planned_hours !== '') {
            planned = Number(m.planned_hours);
          } else if (window.CalendarEngine) {
            planned = CalendarEngine.getPlannedHours(m.location || 'BY', lastEntry.month, m.allocation || 1.0);
          } else {
            planned = Math.round(168 * (m.allocation || 1.0));
          }
          const actual = m.actual_hours || 0;
          const eff    = planned > 0 ? actual / planned : 0;
          totalPlanned  += planned;
          weightedEff   += eff * planned;
        }
        if (totalPlanned > 0) revenueEfficiency = weightedEff / totalPlanned;
      }
    }

    // Final Score с поправкой: если revenueEfficiency < 0.8 → ×0.95
    const rawFinal = this.finalScore(bchs, curPC);
    const final    = (rawFinal !== null && revenueEfficiency !== null && revenueEfficiency < 0.8)
      ? Math.round(rawFinal * 0.95 * 10) / 10
      : rawFinal;
    const pctPot    = this.pctPotential(final, client.bcg_category);
    const health    = this.healthSignal(bchs);
    const load      = this.loadSignal(curPC);
    const ideal     = this.idealScore(client.bcg_category);
    const deviation = final !== null ? Math.round(final - ideal) : null;

    // История для графика — все месяцы
    const monthlyData = clientBCHS.map(e => ({
      month:   e.month,
      year:    e.year,
      bchs:    this.computeBCHS(e),
      loyalty: this.loyaltyPct(this.computeBCHS(e)),
      label:   `${MONTHS_SHORT[e.month - 1]} ${e.year}`,
    }));

    // Тренд: oldest vs latest из последних 3 месяцев с ненулевыми данными
    let trendOldest = null;
    let trendLatest = null;

    const last3 = monthlyData.slice(-3);
    const last3WithData = last3.filter(d => d.bchs !== null);

    if (last3WithData.length >= 2) {
      trendOldest = last3WithData[0].bchs;
      trendLatest = last3WithData[last3WithData.length - 1].bchs;
    } else if (last3WithData.length === 1 && monthlyData.length >= 2) {
      // В последних 3 только 1 точка — ищем предыдущую доступную
      const older = [...monthlyData]
        .slice(0, monthlyData.length - last3.length)
        .reverse()
        .find(d => d.bchs !== null);
      if (older) {
        trendOldest = older.bchs;
        trendLatest = last3WithData[0].bchs;
      }
    }

    const trend   = this.trend3m(trendOldest, trendLatest);
    const badge   = this.actionBadge(client.key_account_priority, health.key, client.status);
    const focus   = this.focusText(client, bchs, health, deviation);
    const section = this.dashSection(client.key_account_priority, health.key, client.status);

    return {
      bchs,
      pcScore: curPC,
      curPC,
      loyalty,
      final,
      revenueEfficiency,   // null | 0..1
      pctPot,
      health,
      load,
      ideal,
      deviation,
      monthlyData,
      trend,
      trendOldest,
      trendLatest,
      badge,
      focus,
      section,
      curBCHSEntry,
      curPCEntry,
      bchsHistory: clientBCHS,
      pcHistory:   clientPC,
    };
  },
};
