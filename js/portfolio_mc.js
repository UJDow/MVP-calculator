/**
 * Portfolio Monte Carlo — проксирует на воркер /portfolio/mc/scenario
 * Вся бизнес-логика на bchs-api/src/index.js
 */
import { API } from './api.js';

/**
 * @param {Array}  computed  — массив клиентов из portfolio.js (нужен только для fallback)
 * @param {object} scenario  — { loyaltyDelta, loyaltySegment, reduceRisk, reduceRiskSegment, newClients, newClientMR }
 * @returns {object}         — { totalClients, horizons, topChanged }
 */
export async function runPortfolioScenario(computed, scenario) {
  const res = await API._post('portfolio/mc/scenario', {
    loyaltyDelta:      scenario.loyaltyDelta      ?? 0,
    loyaltySegment:    scenario.loyaltySegment     ?? 'ALL',
    reduceRisk:        scenario.reduceRisk         ?? false,
    reduceRiskSegment: scenario.reduceRiskSegment  ?? 'ALL',
    newClients:        scenario.newClients         ?? 0,
    newClientMR:       scenario.newClientMR        ?? 5000,
  });
  if (res?.error) throw new Error(res.error);
  return res;
}
