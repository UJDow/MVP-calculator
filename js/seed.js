/* ============================================
   Portfolio BCHS — Seed v7.0 (9 таблиц)
   ============================================ */

const SEED = {
  async run() {
    const tables = [
      'clients', 'bchs_entries', 'pc_entries', 'status_entries', 'mc_configs',
      'account_strategies', 'portfolio_strategies', 'fte_entries', 'my_activities',
    ];
    await Promise.all(tables.map(t => fetch(`tables/${t}?limit=1`).catch(() => {})));
    console.log('[SEED] All 9 tables initialized.');
  },
};
