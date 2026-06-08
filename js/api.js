/* ============================================
   js/api.js — API Layer (ES Module)
   Portfolio BCHS v7.0
   ============================================ */

import { SIGNALS, PC_CRITERIA } from './constants.js';

const BASE_URL = 'https://bchs-api.lexsnitko.workers.dev';

export const API = {

  /* ── Внутренний хелпер ──────────────────────────────────────── */
  async _safeJson(r) {
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      console.warn(`[API] ${r.status} ${r.url}`, text);
      return null;
    }
    return r.json().catch(() => null);
  },

  /* ── Универсальные CRUD-хелперы (используются в mc_page, delivery) ── */
  async _get(path) {
    const r = await fetch(`${BASE_URL}/${path}`);
    return this._safeJson(r);
  },
  async _post(path, body) {
    const r = await fetch(`${BASE_URL}/${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    return this._safeJson(r);
  },
  async _put(path, body) {
    const r = await fetch(`${BASE_URL}/${path}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    return this._safeJson(r);
  },
  async _patch(path, body) {
    const r = await fetch(`${BASE_URL}/${path}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    return this._safeJson(r);
  },
  async _delete(path) {
    await fetch(`${BASE_URL}/${path}`, { method: 'DELETE' });
  },

  /* ── Кеши ───────────────────────────────────────────────────── */
  _bchsCache:     null,
  _pcCache:       null,
  _statusCache:   null,
  _clientsCache:  null,   // используется в delivery.js / portfolio.js

  clearCache() {
    this._bchsCache    = null;
    this._pcCache      = null;
    this._statusCache  = null;
    this._clientsCache = null;
  },

  /* ── Внутренний fetchAll ─────────────────────────────────────── */
  async _fetchAll(table) {
    const r = await fetch(`${BASE_URL}/tables/${table}?limit=2000`);
    const j = await this._safeJson(r);
    if (!j) return [];
    return Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
  },

  /* ══════════════════════════════════════════
     CLIENTS
  ══════════════════════════════════════════ */
  async getClients() {
    if (this._clientsCache) return this._clientsCache;
    const r = await fetch(`${BASE_URL}/tables/clients?limit=500`);
    const j = await this._safeJson(r);
    if (!j) return [];
    const list = Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
    this._clientsCache = list;
    return list;
  },

  async getClient(id) {
    const r = await fetch(`${BASE_URL}/tables/clients/${id}`);
    return this._safeJson(r);
  },

  async createClient(data) {
    this._clientsCache = null;
    const payload = { ...data };
    if (!payload.id) delete payload.id;
    const r = await fetch(`${BASE_URL}/tables/clients`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    return this._safeJson(r);
  },

  async updateClient(id, data) {
    this._clientsCache = null;
    const payload = { ...data };
    ['id','gs_project_id','gs_table_name','created_at','updated_at','bcg_alert']
      .forEach(k => delete payload[k]);
    const r = await fetch(`${BASE_URL}/tables/clients/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    return this._safeJson(r);
  },

  async deleteClient(id) {
    this._clientsCache = null;
    await fetch(`${BASE_URL}/tables/clients/${id}`, { method: 'DELETE' });
  },

  /* ══════════════════════════════════════════
     bCHS ENTRIES
  ══════════════════════════════════════════ */
  async getAllBCHS() {
    if (!this._bchsCache)
      this._bchsCache = await this._fetchAll('bchs_entries');
    return this._bchsCache;
  },

  /* Алиас для обратной совместимости */
  async getAllBCHSEntries() { return this.getAllBCHS(); },

  async getBCHSFor(clientId) {
    const all = await this.getAllBCHS();
    return all.filter(e => String(e.client_id) === String(clientId));
  },

  /* Алиас */
  async getBCHSEntries(clientId) { return this.getBCHSFor(clientId); },

  async getBCHSEntry(clientId, month, year) {
    const all = await this.getBCHSFor(clientId);
    return all.find(
      e => Number(e.month) === month && Number(e.year) === year
    ) ?? null;
  },

  async saveBCHSEntry(clientId, month, year, signals) {
    this._bchsCache = null;
    const existing  = await this.getBCHSEntry(clientId, month, year);
    const payload   = { client_id: clientId, month, year };

    for (const key of Object.keys(SIGNALS)) {
      payload[key] = signals[key] === true ? 1 : 0;
    }

    if (existing) {
      return this._put(`tables/bchs_entries/${existing.id}`, payload);
    } else {
      return this._post('tables/bchs_entries', payload);
    }
  },

  /* ══════════════════════════════════════════
     PC ENTRIES
  ══════════════════════════════════════════ */
  async getAllPC() {
    if (!this._pcCache)
      this._pcCache = await this._fetchAll('pc_entries');
    return this._pcCache;
  },

  /* Алиас */
  async getAllPCEntries() { return this.getAllPC(); },

  async getPCFor(clientId) {
    const all = await this.getAllPC();
    return all.filter(e => String(e.client_id) === String(clientId));
  },

  /* Алиас */
  async getPCEntries(clientId) { return this.getPCFor(clientId); },

  async getPCEntry(clientId, month, year) {
    const all = await this.getPCFor(clientId);
    return all.find(
      e => Number(e.month) === month && Number(e.year) === year
    ) ?? null;
  },

  async savePCEntry(clientId, month, year, criteria) {
    this._pcCache = null;
    const existing = await this.getPCEntry(clientId, month, year);
    const payload  = { client_id: clientId, month, year };

    for (const key of Object.keys(PC_CRITERIA)) {
      const v = criteria[key];
      payload[key] = (v !== null && v !== undefined) ? Number(v) : null;
    }

    if (existing) {
      return this._put(`tables/pc_entries/${existing.id}`, payload);
    } else {
      return this._post('tables/pc_entries', payload);
    }
  },

  /* ══════════════════════════════════════════
     STATUS ENTRIES
  ══════════════════════════════════════════ */
  async getAllStatusEntries() {
    if (!this._statusCache)
      this._statusCache = await this._fetchAll('status_entries');
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
      pc_json:      JSON.stringify(parsedPC      || {}),
      updated_at:   new Date().toISOString(),
    };
    return this._post('tables/status_entries', payload);
  },

  async deleteStatusEntry(id) {
    this._statusCache = null;
    await this._delete(`tables/status_entries/${id}`);
  },

  /* ── AI proxy ───────────────────────────────────────────────── */
async callAI(messages, options = {}) {
  const r = await fetch(`${BASE_URL}/ai/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:       options.model       ?? 'deepseek-chat',
      temperature: options.temperature ?? 0.3,
      max_tokens:  options.max_tokens  ?? 1000,
      messages,
    }),
  });
  if (!r.ok) throw new Error(`AI proxy error: ${r.status}`);
  return r.json();
},


  /* ══════════════════════════════════════════
     PORTFOLIO STRATEGIES
  ══════════════════════════════════════════ */
  async getPortfolioStrategies() {
    return (await this._get('tables/portfolio_strategies?limit=100')) || [];
  },

  async upsertPortfolioStrategy(horizon, data) {
    const all      = await this.getPortfolioStrategies();
    const existing = all.find(r => r.horizon === horizon);
    const payload  = { horizon, ...data };
    ['id','gs_project_id','gs_table_name','created_at','updated_at']
      .forEach(k => delete payload[k]);
    return existing
      ? this._put(`tables/portfolio_strategies/${existing.id}`, payload)
      : this._post('tables/portfolio_strategies', payload);
  },

  /* ══════════════════════════════════════════
     ACCOUNT STRATEGIES
  ══════════════════════════════════════════ */
  async getAccountStrategies() {
    return (await this._get('tables/account_strategies?limit=500')) || [];
  },

  async getAccountStrategyFor(clientId) {
    const all = await this.getAccountStrategies();
    return all
      .filter(r => String(r.client_id) === String(clientId) && r.status !== 'Done')
      .sort((a, b) => b.created_at - a.created_at)[0] ?? null;
  },

  async saveAccountStrategy(clientId, data) {
    const existing = await this.getAccountStrategyFor(clientId);
    const payload  = { client_id: clientId, ...data };
    ['id','gs_project_id','gs_table_name','created_at','updated_at']
      .forEach(k => delete payload[k]);
    return existing
      ? this._put(`tables/account_strategies/${existing.id}`, payload)
      : this._post('tables/account_strategies', payload);
  },
};
