/* ============================================
   Portfolio BCHS — API Layer (unified)
   ============================================ */

const API = {

  /* ---- safe JSON helper ---- */
  async _safeJson(r) {
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      console.warn(`[API] ${r.status} ${r.url}`, text);
      return null;
    }
    return r.json().catch(() => null);
  },

  /* ---- Cache ---- */
  _bchsCache: null,
  _pcCache: null,
  _statusCache: null,

  clearCache() {
    this._bchsCache   = null;
    this._pcCache     = null;
    this._statusCache = null;
  },

  /* ---- Generic fetch ---- */
  async _fetchAll(table) {
    const r = await fetch(`tables/${table}?limit=2000`);
    const j = await this._safeJson(r);
    if (!j) return [];
    return Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
  },

  /* ---- Clients ---- */
  async getClients() {
    const r = await fetch('tables/clients?limit=500');
    const j = await this._safeJson(r);
    if (!j) return [];
    return Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
  },

  async getClient(id) {
    const r = await fetch(`tables/clients/${id}`);
    return await this._safeJson(r);
  },

  async createClient(data) {
    const payload = { ...data };
    if (!payload.id) delete payload.id;
    // Attach computed fields
    const computed = ClientCalc.compute(data);
    Object.assign(payload, computed);
    delete payload.bcg_alert;
    const r = await fetch('tables/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await this._safeJson(r);
  },

  async updateClient(id, data) {
    const payload = { ...data };
    const computed = ClientCalc.compute(data);
    Object.assign(payload, computed);
    ['id','gs_project_id','gs_table_name','created_at','updated_at','bcg_alert']
      .forEach(k => delete payload[k]);
    const r = await fetch(`tables/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await this._safeJson(r);
  },

  async deleteClient(id) {
    await fetch(`tables/clients/${id}`, { method: 'DELETE' });
  },

  /* ---- bCHS Entries ---- */
  async getAllBCHS() {
    if (!this._bchsCache)
      this._bchsCache = await this._fetchAll('bchs_entries');
    return this._bchsCache;
  },

  // alias for backward compat
  async getAllBCHSEntries() { return this.getAllBCHS(); },

  async getBCHSFor(clientId) {
    const all = await this.getAllBCHS();
    return all.filter(e => String(e.client_id) === String(clientId));
  },

  // alias
  async getBCHSEntries(clientId) { return this.getBCHSFor(clientId); },

  async getBCHSEntry(clientId, month, year) {
    const all = await this.getBCHSFor(clientId);
    return all.find(e => Number(e.month) === month && Number(e.year) === year) || null;
  },

  async saveBCHSEntry(clientId, month, year, signals) {
    this._bchsCache = null;
    const existing = await this.getBCHSEntry(clientId, month, year);
    const payload  = { client_id: clientId, month, year };
    for (const key of Object.keys(SIGNALS)) {
      payload[key] = signals[key] === true ? 1 : 0;
    }
    if (existing) {
      const r = await fetch(`tables/bchs_entries/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await this._safeJson(r);
    } else {
      const r = await fetch('tables/bchs_entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await this._safeJson(r);
    }
  },

  /* ---- PC Entries ---- */
  async getAllPC() {
    if (!this._pcCache)
      this._pcCache = await this._fetchAll('pc_entries');
    return this._pcCache;
  },

  // alias
  async getAllPCEntries() { return this.getAllPC(); },

  async getPCFor(clientId) {
    const all = await this.getAllPC();
    return all.filter(e => String(e.client_id) === String(clientId));
  },

  // alias
  async getPCEntries(clientId) { return this.getPCFor(clientId); },

  async getPCEntry(clientId, month, year) {
    const all = await this.getPCFor(clientId);
    return all.find(e => Number(e.month) === month && Number(e.year) === year) || null;
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
      const r = await fetch(`tables/pc_entries/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await this._safeJson(r);
    } else {
      const r = await fetch('tables/pc_entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await this._safeJson(r);
    }
  },

  /* ---- Status Entries ---- */
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
    const now = new Date().toISOString();
    const payload = {
      client_id:    clientId,
      entry_date:   entryDate,
      day, month, year,
      status_note:  statusText || '',
      signals_json: JSON.stringify(parsedSignals || {}),
      pc_json:      JSON.stringify(parsedPC     || {}),
      updated_at:   now,
    };
    const r = await fetch('tables/status_entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await this._safeJson(r);
  },

  async deleteStatusEntry(id) {
    this._statusCache = null;
    await fetch(`tables/status_entries/${id}`, { method: 'DELETE' });
  },
};
