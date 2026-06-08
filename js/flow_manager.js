/* ============================================
   js/flow_manager.js — Flow Manager (ES Module)
   Portfolio BCHS v7.0
   Floating action panel — три режима работы.
   Состояние хранится в sessionStorage.
   ============================================ */

export const FlowManager = {

  /* ── Состояние ──────────────────────────────────────────────── */
  _mode:        null,    // 'tour' | 'client' | 'quick_entry' | null
  _queue:       [],      // очередь клиентов для режима «Обойти»
  _queueIndex:  0,
  _dismissed:   null,    // Set — инициализируется в init()
  _panelOpen:   false,

  /* ── Инициализация ──────────────────────────────────────────── */
  init() {
    this._dismissed = new Set();
    this._restoreSession();
    this._mountPanel();
  },

  _restoreSession() {
    try {
      const raw = sessionStorage.getItem('bchs_flow');
      if (!raw) return;
      const s          = JSON.parse(raw);
      this._mode       = s.mode       ?? null;
      this._queue      = s.queue      ?? [];
      this._queueIndex = s.queueIndex ?? 0;
      this._dismissed  = new Set(s.dismissed ?? []);
    } catch { /* тихо пропускаем */ }
  },

  _saveSession() {
    try {
      sessionStorage.setItem('bchs_flow', JSON.stringify({
        mode:       this._mode,
        queue:      this._queue,
        queueIndex: this._queueIndex,
        dismissed:  [...this._dismissed],
      }));
    } catch { /* тихо пропускаем */ }
  },

  /* ── Плавающая панель ───────────────────────────────────────── */
  _mountPanel() {
    if (document.getElementById('flow-panel')) return;
    const panel = document.createElement('div');
    panel.id        = 'flow-panel';
    panel.className = 'fp-wrap';
    panel.innerHTML = this._panelHTML();
    document.body.appendChild(panel);
    this._attachPanelEvents(panel);
  },

  _panelHTML() {
    return `
      <div class="fp-menu" id="fp-menu" style="display:none">
        <div class="fp-menu-item" id="fp-mode-tour">
          <span class="fp-mode-icon">🗺️</span>
          <div>
            <div class="fp-mode-label">Обойти портфель</div>
            <div class="fp-mode-desc">Клиенты требующие внимания</div>
          </div>
        </div>
        <div class="fp-menu-item" id="fp-mode-client">
          <span class="fp-mode-icon">🔍</span>
          <div>
            <div class="fp-mode-label">Работа с клиентом</div>
            <div class="fp-mode-desc">Умные подсказки по аккаунту</div>
          </div>
        </div>
        <div class="fp-menu-item" id="fp-mode-entry">
          <span class="fp-mode-icon">✍️</span>
          <div>
            <div class="fp-mode-label">Быстрый ввод</div>
            <div class="fp-mode-desc">Шорткат к внесению данных</div>
          </div>
        </div>
      </div>
      <button class="fp-btn" id="fp-toggle-btn" title="Режим работы">
        <span class="fp-btn-icon" id="fp-btn-icon">⚡</span>
      </button>`;
  },

  _attachPanelEvents(panel) {
    const btn  = panel.querySelector('#fp-toggle-btn');
    const menu = panel.querySelector('#fp-menu');

    btn.addEventListener('click', () => {
      this._panelOpen = !this._panelOpen;
      menu.style.display = this._panelOpen ? 'flex' : 'none';
      btn.classList.toggle('fp-btn-open', this._panelOpen);
    });

    panel.querySelector('#fp-mode-tour')
      .addEventListener('click', () => { this._closeMenu(); this._startTour(); });
    panel.querySelector('#fp-mode-client')
      .addEventListener('click', () => { this._closeMenu(); this._startClientMode(); });
    panel.querySelector('#fp-mode-entry')
      .addEventListener('click', () => { this._closeMenu(); this._startQuickEntry(); });

    /* Закрыть меню при клике вне панели */
    document.addEventListener('click', e => {
      if (!panel.contains(e.target)) this._closeMenu();
    });
  },

  _closeMenu() {
    this._panelOpen = false;
    document.getElementById('fp-menu')?.style.setProperty('display', 'none');
    document.getElementById('fp-toggle-btn')?.classList.remove('fp-btn-open');
  },

  /* ══════════════════════════════════════════
     РЕЖИМ 1 — Обойти портфель
  ══════════════════════════════════════════ */
  async _startTour() {
    /* DashboardPage.computed доступен через window после инициализации */
    const computed   = window.DashboardPage?.computed ?? [];
    this._queue      = this._buildTourQueue(computed);
    this._queueIndex = 0;
    this._mode       = 'tour';
    this._saveSession();

    if (!this._queue.length) {
      window.App.toast('✅ Портфель в порядке — нет клиентов требующих внимания', 'success');
      return;
    }

    window.App.toast(
      `🗺️ Обход: ${this._queue.length} клиент${this._pluralize(this._queue.length)} требуют внимания`,
      ''
    );
    this._tourNext();
  },

  _buildTourQueue(computed) {
    const curMonth = new Date().getMonth() + 1;
    const curYear  = new Date().getFullYear();

    return computed
      .map(r => {
        let score = 0;

        const noEntry = !r._lastEntryMs || (() => {
          const d = new Date(r._lastEntryMs);
          return !(d.getMonth() + 1 === curMonth && d.getFullYear() === curYear);
        })();
        if (noEntry)                                    score += 40;
        if (r.health?.key === 'AtRisk')                 score += 30;
        else if (r.health?.key === 'Caution')           score += 20;
        if (r._daysSince != null && r._daysSince > 30)  score += 15;
        if ((r.trend3m ?? 0) < 0)                       score += 10;

        return { id: r.client.id, name: r.client.name, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.id);
  },

  _tourNext() {
    if (this._queueIndex >= this._queue.length) {
      this._endTour();
      return;
    }
    const clientId = this._queue[this._queueIndex];
    window.App.navigate('detail', clientId);
    setTimeout(() => this._renderTourBar(), 300);
  },

  _renderTourBar() {
    const main = document.getElementById('main-content');
    if (!main) return;
    if (document.getElementById('flow-tour-bar')) return;

    const total   = this._queue.length;
    const current = this._queueIndex + 1;
    const pct     = Math.round((current / total) * 100);

    const bar = document.createElement('div');
    bar.id        = 'flow-tour-bar';
    bar.className = 'ftb-wrap';
    bar.innerHTML = `
      <div class="ftb-track">
        <div class="ftb-fill" style="width:${pct}%"></div>
      </div>
      <div class="ftb-meta">
        <span class="ftb-label">
          🗺️ Обход портфеля: <strong>${current} / ${total}</strong>
        </span>
        <div class="ftb-actions">
          <button class="btn btn-secondary btn-sm" id="ftb-skip">Пропустить</button>
          <button class="btn btn-primary btn-sm"   id="ftb-next">Следующий →</button>
          <button class="btn btn-sm" style="color:var(--md-on-surf-d)"
                  id="ftb-end">Завершить</button>
        </div>
      </div>`;
    main.insertAdjacentElement('afterbegin', bar);

    document.getElementById('ftb-next').addEventListener('click', () => {
      this._queueIndex++;
      this._saveSession();
      this._tourNext();
    });
    document.getElementById('ftb-skip').addEventListener('click', () => {
      this._queueIndex++;
      this._saveSession();
      this._tourNext();
    });
    document.getElementById('ftb-end')
      .addEventListener('click', () => this._endTour());
  },

  _endTour() {
    this._mode       = null;
    this._queue      = [];
    this._queueIndex = 0;
    this._saveSession();
    document.getElementById('flow-tour-bar')?.remove();
    window.App.toast('✅ Обход завершён', 'success');
    window.App.navigate('dashboard');
  },

  /* ══════════════════════════════════════════
     РЕЖИМ 2 — Работа с клиентом
  ══════════════════════════════════════════ */
  _startClientMode() {
    const computed = window.DashboardPage?.computed ?? [];
    if (!computed.length) {
      window.App.toast('Нет клиентов в портфеле', '');
      return;
    }
    this._showClientPicker(computed);
  },

  _showClientPicker(computed) {
    const opts = computed
      .map(r => `<option value="${r.client.id}">${r.client.name}</option>`)
      .join('');

    window.App.openModal(`
      <div style="padding:4px 0 16px">
        <div style="font-size:16px;font-weight:600;margin-bottom:4px">
          🔍 Работа с клиентом
        </div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">
          Выберите клиента — платформа покажет умные подсказки
        </div>
      </div>
      <div style="margin-bottom:16px">
        <label class="form-label">Клиент</label>
        <select class="form-select" id="fcp-client-sel">
          <option value="">— выберите клиента —</option>
          ${opts}
        </select>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px">
        <button class="btn btn-secondary" id="fcp-cancel">Отмена</button>
        <button class="btn btn-primary"   id="fcp-go">Открыть →</button>
      </div>
    `);

    document.getElementById('fcp-cancel')
      .addEventListener('click', () => window.App.closeModal());

    document.getElementById('fcp-go').addEventListener('click', () => {
      const sel = document.getElementById('fcp-client-sel');
      if (!sel?.value) { window.App.toast('Выберите клиента', ''); return; }
      this._mode = 'client';
      this._saveSession();
      window.App.closeModal();
      window.App.navigate('detail', sel.value);
      setTimeout(() => this._renderClientHints(sel.value), 400);
    });
  },

  async _renderClientHints(clientId) {
    const computed = window.DashboardPage?.computed ?? [];
    const row = computed.find(r => String(r.client.id) === String(clientId));
    if (!row) return;

    const hints = await this._buildHints(row);
    if (!hints.length) return;

    const top2 = hints.slice(0, 2);
    const wrap = document.createElement('div');
    wrap.id        = 'flow-hints-wrap';
    wrap.className = 'fh-wrap';
    wrap.innerHTML = top2.map(h => this._hintHTML(h)).join('');

    wrap.querySelectorAll('.fh-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const hintId = btn.closest('.fh-card').dataset.hint;
        this._dismissed.add(hintId);
        this._saveSession();
        btn.closest('.fh-card').remove();
        if (!wrap.querySelector('.fh-card')) wrap.remove();
      });
    });

    wrap.querySelectorAll('.fh-action').forEach(btn => {
      btn.addEventListener('click', () => {
        this._handleHintAction(btn.dataset.action, clientId);
      });
    });

    const hero = document.querySelector('.detail-hero')
                ?? document.querySelector('.detail-header');
    if (hero) hero.insertAdjacentElement('afterend', wrap);
  },

  _hintHTML(h) {
    return `
      <div class="fh-card" data-hint="${h.id}">
        <span class="fh-icon">${h.icon}</span>
        <div class="fh-body">
          <div class="fh-text">${h.text}</div>
          ${h.action
            ? `<button class="btn btn-sm btn-tonal fh-action"
                       data-action="${h.action}">${h.actionLabel}</button>`
            : ''}
        </div>
        <button class="fh-close" title="Закрыть">✕</button>
      </div>`;
  },

  async _buildHints(row) {
    const hints = [];
    const cid   = row.client.id;

    if (row.health?.key === 'AtRisk' && !this._dismissed.has(`atrisk_${cid}`)) {
      hints.push({
        id:          `atrisk_${cid}`,
        icon:        '⚠️',
        text:        'Клиент в зоне риска — внести эскалацию?',
        action:      `entry_${cid}`,
        actionLabel: 'Внести',
        priority:    100,
      });
    }

    const curMonth = new Date().getMonth() + 1;
    const curYear  = new Date().getFullYear();
    const noEntry  = !row._lastEntryMs || (() => {
      const d = new Date(row._lastEntryMs);
      return !(d.getMonth() + 1 === curMonth && d.getFullYear() === curYear);
    })();
    if (noEntry && !this._dismissed.has(`noentry_${cid}`)) {
      hints.push({
        id:          `noentry_${cid}`,
        icon:        '📝',
        text:        'Нет данных за этот месяц — занести статус?',
        action:      `entry_${cid}`,
        actionLabel: 'Занести',
        priority:    90,
      });
    }

    if ((row.trend3m ?? 0) < -10 && !this._dismissed.has(`trend_${cid}`)) {
      hints.push({
        id:          `trend_${cid}`,
        icon:        '📉',
        text:        'Негативный тренд 3 месяца — проверить историю?',
        action:      `history_${cid}`,
        actionLabel: 'История',
        priority:    70,
      });
    }

    const noStatus = await this._checkNoStatus(cid);
    if (noStatus && !this._dismissed.has(`nostatus_${cid}`)) {
      hints.push({
        id:          `nostatus_${cid}`,
        icon:        '💬',
        text:        'Давно не было статус-встречи — занести?',
        action:      `status_${cid}`,
        actionLabel: 'Занести',
        priority:    60,
      });
    }

    return hints.sort((a, b) => b.priority - a.priority);
  },

  async _checkNoStatus(clientId) {
    try {
      const res  = await fetch(`${BASE_URL}/tables/status_entries?limit=500`);
      const json = await res.json();
      const rows = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      const mine = rows.filter(r => String(r.client_id) === String(clientId));
      if (!mine.length) return true;
      mine.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
      return (Date.now() - mine[0].created_at) > 14 * 86400 * 1000;
    } catch {
      return false;
    }
  },

  _handleHintAction(action, clientId) {
    if (action.startsWith('entry_')) {
      window.App.navigate('entry', action.replace('entry_', ''));
    } else if (action.startsWith('history_')) {
      window.App.navigate('detail', clientId);
      setTimeout(() => {
        document.querySelector('[data-tab="history"]')?.click();
      }, 400);
    } else if (action.startsWith('status_')) {
      window.App.navigate('detail', clientId);
      setTimeout(() => {
        document.querySelector('[data-tab="status-log"]')?.click();
      }, 400);
    }
  },

  /* ══════════════════════════════════════════
     РЕЖИМ 3 — Быстрый ввод
  ══════════════════════════════════════════ */
  _startQuickEntry() {
    this._mode = 'quick_entry';
    this._saveSession();
    window.App.navigate('entry');
  },

  /* ── Утилиты ────────────────────────────────────────────────── */
  _pluralize(n) {
    if (n === 1)              return '';
    if (n >= 2 && n <= 4)    return 'а';
    return 'ов';
  },

  reset() {
    this._mode       = null;
    this._queue      = [];
    this._queueIndex = 0;
    this._saveSession();
    document.getElementById('flow-tour-bar')?.remove();
    document.getElementById('flow-hints-wrap')?.remove();
  },
};

/* ── Expose globally ─────────────────────────────────────────── */
window.FlowManager = FlowManager;
