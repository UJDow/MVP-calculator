/* ============================================
   Portfolio BCHS — Monthly Entry Page (Page 2)
   bCHS signals + PC criteria + live preview
   + AI-парсинг свободного текста статуса
   ============================================ */

const EntryPage = {
  clients: [],
  selectedClientId: null,
  selectedMonth: null,
  selectedYear: null,
  signals: {},
  pcValues: {},
  existingBCHS: null,
  existingPC: null,

  async render(preselectedClientId) {
    const now = new Date();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedYear  = now.getFullYear();
    this.signals  = {};
    this.pcValues = {};

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div class="page-header">
        <div class="page-title">Внести данные</div>
        <div class="page-subtitle">Ежемесячная запись bCHS и PC Score</div>
      </div>
      <div id="entry-loader" style="text-align:center;padding:40px;color:var(--text-muted)">Загрузка клиентов...</div>
    `;
    this.clients = await API.getClients();
    this.selectedClientId = preselectedClientId || (this.clients[0] ? this.clients[0].id : null);
    this.buildForm();
  },

  buildForm() {
    const main = document.getElementById('main-content');
    if (this.clients.length === 0) {
      main.innerHTML = `
        <div class="page-header"><div class="page-title">Внести данные</div></div>
        <div class="empty-state">
          <div class="empty-state-icon">👤</div>
          <div class="empty-state-title">Нет клиентов</div>
          <div class="empty-state-text">Сначала добавьте клиента на странице «Клиенты»</div>
        </div>`;
      return;
    }

    const clientOpts = this.clients.map(c =>
      `<option value="${c.id}" ${c.id === this.selectedClientId ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    const monthOpts = MONTHS_RU.map((m, i) =>
      `<option value="${i + 1}" ${i + 1 === this.selectedMonth ? 'selected' : ''}>${m}</option>`
    ).join('');

    const yearOpts = [this.selectedYear - 1, this.selectedYear, this.selectedYear + 1].map(y =>
      `<option value="${y}" ${y === this.selectedYear ? 'selected' : ''}>${y}</option>`
    ).join('');

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title">Внести данные</div>
        <div class="page-subtitle">Ежемесячная запись bCHS и PC Score</div>
      </div>

      <div class="month-selector">
        <select class="form-select" id="entry-client">${clientOpts}</select>
        <select class="form-select" id="entry-month">${monthOpts}</select>
        <select class="form-select" id="entry-year">${yearOpts}</select>
        <button class="btn btn-secondary btn-sm" id="entry-load-existing">Загрузить сохранённые</button>
      </div>

      <div id="entry-existing-note" class="hidden" style="margin-bottom:12px;padding:9px 14px;background:var(--yellow-soft);border:1px solid var(--yellow-border);border-radius:var(--radius-sm);font-size:12.5px;color:#92400e;">
        ⚠️ Данные за этот период уже существуют. При сохранении они будут перезаписаны.
      </div>

      <!-- AI STATUS PARSER -->
      <div class="form-section" style="background:linear-gradient(135deg,rgba(124,106,247,0.06),rgba(59,130,246,0.04));border:1px solid rgba(124,106,247,0.2);border-radius:12px;padding:16px;margin-bottom:16px">
        <div class="form-section-title" style="color:#7c6af7">🤖 AI-разбор статуса клиента</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          Опишите своими словами что происходило с клиентом в этом месяце — AI расставит сигналы и оценит нагрузку
        </div>
        <textarea id="ai-status-input" class="form-textarea" rows="4"
          placeholder="Например: Клиент попросил расширить команду, провели стратегическую сессию. Но была задержка оплаты на 2 недели и клиент упомянул что смотрит на конкурентов. Проект сложный, много неопределённости, клиент периодически создаёт стрессовые ситуации..."
          style="font-size:13px;resize:vertical;min-height:90px"></textarea>
        <div style="display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" id="ai-parse-btn">🤖 Распознать сигналы</button>
          <div id="ai-parse-status" style="font-size:12px;color:var(--text-muted)"></div>
        </div>
        <div id="ai-parse-result" class="hidden" style="margin-top:12px;padding:10px 14px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:8px;font-size:12px;color:var(--text-secondary);line-height:1.6"></div>
      </div>

      <!-- Live Score Preview -->
      <div class="score-preview" id="score-preview">
        <div class="score-block">
          <span class="score-label">bCHS</span>
          <span class="score-value" id="live-bchs">0</span>
          <span class="score-sub" id="live-health">—</span>
        </div>
        <div class="score-block">
          <span class="score-label">Лояльность</span>
          <span class="score-value" id="live-loyalty">—</span>
          <span class="score-sub">от -81 до +81</span>
        </div>
        <div class="score-block">
          <span class="score-label">PC Score</span>
          <span class="score-value" id="live-pc">—</span>
          <span class="score-sub" id="live-load">—</span>
        </div>
        <div class="score-block">
          <span class="score-label">Final Score</span>
          <span class="score-value" id="live-final">—</span>
          <span class="score-sub" id="live-potential">—</span>
        </div>
      </div>

      <!-- Main entry grid -->
      <div class="entry-layout">
        <div>${this.renderSignalGroups()}</div>
        <div>${this.renderPCSection()}</div>
      </div>

      <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap">
        <button class="btn btn-primary" id="entry-save">💾 Сохранить данные</button>
        <button class="btn btn-secondary" id="entry-reset">↺ Сбросить</button>
      </div>
    `;

    this.bindEntryEvents();
    this.updatePreview();
    this.checkExisting();
  },

  renderSignalGroups() {
    let html = '';
    for (const [groupKey, groupDef] of Object.entries(SIGNAL_GROUPS)) {
      const groupSignals = Object.entries(SIGNALS).filter(([, def]) => def.group === groupKey);
      html += `
        <div class="form-section">
          <div class="form-section-title">${groupDef.icon} ${groupDef.label}</div>
          <div class="signals-group">
            ${groupSignals.map(([key, def]) => `
              <label class="signal-item" id="signal-item-${key}" data-key="${key}">
                <input type="checkbox" id="sig-${key}" data-key="${key}" />
                <span class="signal-label">${def.label}</span>
                <span class="signal-weight ${def.weight > 0 ? 'weight-pos' : 'weight-neg'}">
                  ${def.weight > 0 ? '+' : ''}${def.weight}
                </span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }
    return html;
  },

  renderPCSection() {
    const criteriaHtml = Object.entries(PC_CRITERIA).map(([key, def]) => `
      <div class="pc-item">
        <div class="pc-item-header">
          <span class="pc-label">${def.label}</span>
          <span class="pc-value-badge" id="pc-val-${key}">${this.pcValues[key] || '—'}</span>
        </div>
        <div class="pc-btn-group">
          ${[1,2,3,4,5].map(n => `
            <button class="pc-btn ${this.pcValues[key] === n ? 'active' : ''}"
              data-key="${key}" data-val="${n}">${n}</button>
          `).join('')}
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${def.hint}</div>
      </div>
    `).join('');

    return `
      <div class="form-section">
        <div class="form-section-title">📊 PC Score — Нагрузка проекта</div>
        <div class="pc-sliders">${criteriaHtml}</div>
      </div>
    `;
  },

  bindEntryEvents() {
    document.getElementById('entry-client').addEventListener('change', e => {
      this.selectedClientId = e.target.value;
      this.checkExisting();
    });
    document.getElementById('entry-month').addEventListener('change', e => {
      this.selectedMonth = parseInt(e.target.value);
      this.checkExisting();
    });
    document.getElementById('entry-year').addEventListener('change', e => {
      this.selectedYear = parseInt(e.target.value);
      this.checkExisting();
    });
    document.getElementById('entry-load-existing').addEventListener('click', () => {
      this.loadExistingData();
    });

    // AI parse button
    document.getElementById('ai-parse-btn').addEventListener('click', () => {
      this.parseStatusWithAI();
    });

    // Signal checkboxes
    document.querySelectorAll('.signal-item input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', e => {
        const key = e.target.dataset.key;
        this.signals[key] = e.target.checked;
        const item = document.getElementById(`signal-item-${key}`);
        const def = SIGNALS[key];
        item.classList.remove('checked-pos', 'checked-neg');
        if (e.target.checked) {
          item.classList.add(def.weight > 0 ? 'checked-pos' : 'checked-neg');
        }
        this.updatePreview();
      });
    });

    // PC buttons
    document.querySelectorAll('.pc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const val = parseInt(btn.dataset.val);
        this.pcValues[key] = val;
        document.querySelectorAll(`.pc-btn[data-key="${key}"]`).forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.val) === val);
        });
        document.getElementById(`pc-val-${key}`).textContent = val;
        this.updatePreview();
      });
    });

    document.getElementById('entry-save').addEventListener('click', () => this.save());
    document.getElementById('entry-reset').addEventListener('click', () => this.resetForm());
  },

  // ─── AI PARSER ────────────────────────────────────────────────
  async parseStatusWithAI() {
    const text = (document.getElementById('ai-status-input')?.value || '').trim();
    if (!text) { App.toast('Введите текст статуса', 'error'); return; }

    const apiKey = localStorage.getItem('bchs_deepseek_key') || '';
    if (!apiKey) {
      App.toast('Нет DeepSeek ключа — сохраните его в разделе MC', 'error');
      return;
    }

    const btn    = document.getElementById('ai-parse-btn');
    const status = document.getElementById('ai-parse-status');
    const result = document.getElementById('ai-parse-result');

    btn.disabled    = true;
    btn.textContent = '⏳ Анализирую...';
    if (status) status.textContent = 'Отправляю запрос к AI...';
    if (result) result.classList.add('hidden');

    const signalDescriptions = Object.entries(SIGNALS).map(([key, def]) =>
      `  "${key}": "${def.label}" (вес ${def.weight > 0 ? '+' : ''}${def.weight})`
    ).join('\n');

    const pcDescriptions = Object.entries(PC_CRITERIA).map(([key, def]) =>
      `  "${key}": "${def.label}" — ${def.hint}`
    ).join('\n');

    const prompt = `Ты — аналитик клиентского портфеля. Проанализируй текст статуса клиента и определи:
1. Какие сигналы bCHS активны
2. Оценки PC Score по каждому критерию (1-5)

ТЕКСТ СТАТУСА:
"${text}"

ДОСТУПНЫЕ СИГНАЛЫ bCHS (key: описание):
${signalDescriptions}

КРИТЕРИИ PC SCORE (key: описание — шкала):
${pcDescriptions}

ПРАВИЛА:
- Для сигналов: включай только те которые явно упоминаются или явно подразумеваются из текста
- Для PC: оцени каждый критерий от 1 до 5 на основе контекста. Если информации нет — ставь 2 (нейтральное)
- Будь консервативен: лучше не включить сомнительный сигнал чем включить лишний

Верни ТОЛЬКО валидный JSON без markdown:
{
  "signals": {
    "team_scope_request": true/false,
    "new_services_interest": true/false,
    "strategic_sessions": true/false,
    "fast_responses": true/false,
    "internal_events": true/false,
    "shared_business_plans": true/false,
    "contract_renewal": true/false,
    "upsell": true/false,
    "cross_sell": true/false,
    "positive_feedback": true/false,
    "slow_responses": true/false,
    "missed_meetings": true/false,
    "no_planning": true/false,
    "detailed_report_request": true/false,
    "scope_reduction": true/false,
    "competitor_mentions": true/false,
    "new_decision_maker": true/false,
    "exit_questions": true/false,
    "reduced_frequency": true/false,
    "no_growth_response": true/false,
    "complaint": true/false,
    "payment_delay_10_30": true/false,
    "specialist_replacement": true/false,
    "escalation": true/false,
    "payment_delay_30plus": true/false,
    "churn": true/false
  },
  "pc": {
    "people_count": <1-5>,
    "project_complexity": <1-5>,
    "reporting": <1-5>,
    "risk_probability": <1-5>,
    "risk_consequences": <1-5>,
    "face_role": <1-5>,
    "emotional_load": <1-5>
  },
  "explanation": "<2-3 предложения: что AI обнаружил и почему расставил именно эти сигналы>"
}`;

    try {
      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          temperature: 0.2,
          max_tokens: 800,
          messages: [
            { role: 'system', content: 'Ты аналитик клиентского портфеля. Отвечай ТОЛЬКО валидным JSON без markdown.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!resp.ok) throw new Error(`API error ${resp.status}`);

      const data    = await resp.json();
      const content = data?.choices?.[0]?.message?.content ?? '';
      if (!content) throw new Error('Пустой ответ от AI');

      let parsed;
      try {
        const match = content.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(match ? match[0] : content);
      } catch(e) {
        throw new Error('AI вернул невалидный JSON');
      }

      // Применяем сигналы
      const activatedSignals = [];
      if (parsed.signals) {
        for (const [key, val] of Object.entries(parsed.signals)) {
          if (!SIGNALS[key]) continue;
          this.signals[key] = !!val;
          const cb = document.getElementById(`sig-${key}`);
          if (cb) cb.checked = !!val;
          const item = document.getElementById(`signal-item-${key}`);
          if (item) {
            item.classList.remove('checked-pos', 'checked-neg');
            if (val) {
              item.classList.add(SIGNALS[key].weight > 0 ? 'checked-pos' : 'checked-neg');
              activatedSignals.push(`${SIGNALS[key].label} (${SIGNALS[key].weight > 0 ? '+' : ''}${SIGNALS[key].weight})`);
            }
          }
        }
      }

      // Применяем PC значения
      if (parsed.pc) {
        for (const [key, val] of Object.entries(parsed.pc)) {
          if (!PC_CRITERIA[key]) continue;
          const v = parseInt(val);
          if (v >= 1 && v <= 5) {
            this.pcValues[key] = v;
            document.querySelectorAll(`.pc-btn[data-key="${key}"]`).forEach(b => {
              b.classList.toggle('active', parseInt(b.dataset.val) === v);
            });
            const badge = document.getElementById(`pc-val-${key}`);
            if (badge) badge.textContent = v;
          }
        }
      }

      this.updatePreview();

      // Показываем результат
      if (result) {
        result.classList.remove('hidden');
        const signalSummary = activatedSignals.length > 0
          ? `<div style="margin-bottom:6px"><strong>✅ Активированы сигналы (${activatedSignals.length}):</strong><br>${activatedSignals.join(' · ')}</div>`
          : `<div style="margin-bottom:6px">⚪ Значимых сигналов не обнаружено</div>`;
        result.innerHTML = `
          ${signalSummary}
          ${parsed.explanation ? `<div style="color:var(--text-muted);font-style:italic">💡 ${parsed.explanation}</div>` : ''}
          <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">⚠️ Проверьте и скорректируйте результаты вручную перед сохранением</div>
        `;
      }

      if (status) status.textContent = `✅ Готово · ${activatedSignals.length} сигналов`;
      App.toast(`🤖 AI расставил ${activatedSignals.length} сигналов`, 'success');

    } catch(e) {
      console.error('[AI Parse]', e);
      if (status) status.textContent = '❌ Ошибка';
      App.toast('Ошибка AI: ' + e.message, 'error');
    } finally {
      btn.disabled    = false;
      btn.textContent = '🤖 Распознать сигналы';
    }
  },
  // ──────────────────────────────────────────────────────────────

  async checkExisting() {
    if (!this.selectedClientId) return;
    try {
      const [bEntry, pEntry] = await Promise.all([
        API.getBCHSEntry(this.selectedClientId, this.selectedMonth, this.selectedYear),
        API.getPCEntry(this.selectedClientId, this.selectedMonth, this.selectedYear),
      ]);
      this.existingBCHS = bEntry;
      this.existingPC   = pEntry;
      const note = document.getElementById('entry-existing-note');
      if ((bEntry || pEntry) && note) note.classList.remove('hidden');
      else if (note) note.classList.add('hidden');
    } catch(e) { console.error(e); }
  },

  async loadExistingData() {
    if (!this.selectedClientId) return;
    await this.checkExisting();
    let changed = false;

    if (this.existingBCHS) {
      for (const key of Object.keys(SIGNALS)) {
        const val = this.existingBCHS[key];
        if (val !== undefined && val !== null) {
          this.signals[key] = !!val;
          const cb = document.getElementById(`sig-${key}`);
          if (cb) cb.checked = !!val;
          const item = document.getElementById(`signal-item-${key}`);
          if (item) {
            item.classList.remove('checked-pos', 'checked-neg');
            if (val) item.classList.add(SIGNALS[key].weight > 0 ? 'checked-pos' : 'checked-neg');
          }
        }
      }
      changed = true;
    }

    if (this.existingPC) {
      for (const key of Object.keys(PC_CRITERIA)) {
        const val = this.existingPC[key];
        if (val !== undefined && val !== null) {
          this.pcValues[key] = val;
          document.querySelectorAll(`.pc-btn[data-key="${key}"]`).forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.val) === val);
          });
          const badge = document.getElementById(`pc-val-${key}`);
          if (badge) badge.textContent = val;
        }
      }
      changed = true;
    }

    if (changed) { this.updatePreview(); App.toast('Данные загружены', 'success'); }
    else App.toast('Нет сохранённых данных за этот период', '');
  },

  updatePreview() {
    const bchsEntry = {};
    for (const key of Object.keys(SIGNALS)) bchsEntry[key] = !!this.signals[key];
    const anyTrue = Object.values(bchsEntry).some(Boolean);
    const bchs    = anyTrue ? Calc.computeBCHS(bchsEntry) : null;
    const loyalty = Calc.loyaltyPct(bchs);
    const health  = Calc.healthSignal(bchs);

    const pcEntry = {};
    for (const key of Object.keys(PC_CRITERIA)) pcEntry[key] = this.pcValues[key] || null;
    const pcScore = Calc.computePC(pcEntry);
    const load    = Calc.loadSignal(pcScore);

    const client  = this.clients.find(c => c.id === this.selectedClientId);
    const final   = Calc.finalScore(bchs, pcScore);
    const pctPot  = client ? Calc.potentialPct(final, client.bcg_category) : null;

    const lbchs = document.getElementById('live-bchs');
    if (lbchs) {
      lbchs.textContent = bchs !== null ? bchs : '0';
      lbchs.style.color = bchs === null ? 'var(--text-muted)' :
        bchs >= 20 ? 'var(--green)' : bchs >= -10 ? 'var(--text-primary)' :
        bchs >= -30 ? 'var(--yellow)' : 'var(--red)';
    }
    const lhealth = document.getElementById('live-health');
    if (lhealth) lhealth.textContent = anyTrue ? health.label : '— нет данных';
    const lloy = document.getElementById('live-loyalty');
    if (lloy) lloy.textContent = loyalty !== null ? `${loyalty}%` : '—';
    const lpc = document.getElementById('live-pc');
    if (lpc) lpc.textContent = pcScore !== null ? pcScore.toFixed(1) : '—';
    const lload = document.getElementById('live-load');
    if (lload) lload.textContent = load.label;
    const lfin = document.getElementById('live-final');
    if (lfin) lfin.textContent = final !== null ? final.toFixed(1) : '—';
    const lpot = document.getElementById('live-potential');
    if (lpot) lpot.textContent = pctPot !== null ? `${pctPot}% от идеала` : '—';
  },

  async save() {
    if (!this.selectedClientId) { App.toast('Выберите клиента', 'error'); return; }
    const btn = document.getElementById('entry-save');
    btn.textContent = '⏳ Сохраняем...';
    btn.disabled = true;
    try {
      const signalData = {};
      for (const key of Object.keys(SIGNALS)) signalData[key] = !!this.signals[key];
      const pcData = {};
      for (const key of Object.keys(PC_CRITERIA)) pcData[key] = this.pcValues[key] || null;
      await Promise.all([
        API.saveBCHSEntry(this.selectedClientId, this.selectedMonth, this.selectedYear, signalData),
        API.savePCEntry(this.selectedClientId, this.selectedMonth, this.selectedYear, pcData),
      ]);
      API.clearCache();
      App.toast('✅ Данные сохранены успешно!', 'success');
      this.checkExisting();
    } catch(err) {
      console.error(err);
      App.toast('❌ Ошибка сохранения', 'error');
    } finally {
      btn.textContent = '💾 Сохранить данные';
      btn.disabled = false;
    }
  },

  resetForm() {
    this.signals  = {};
    this.pcValues = {};
    document.querySelectorAll('.signal-item input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      const item = document.getElementById(`signal-item-${cb.dataset.key}`);
      if (item) item.classList.remove('checked-pos', 'checked-neg');
    });
    document.querySelectorAll('.pc-btn').forEach(btn => btn.classList.remove('active'));
    Object.keys(PC_CRITERIA).forEach(key => {
      const badge = document.getElementById(`pc-val-${key}`);
      if (badge) badge.textContent = '—';
    });
    const result = document.getElementById('ai-parse-result');
    if (result) { result.classList.add('hidden'); result.innerHTML = ''; }
    const status = document.getElementById('ai-parse-status');
    if (status) status.textContent = '';
    const input = document.getElementById('ai-status-input');
    if (input) input.value = '';
    this.updatePreview();
    App.toast('Форма сброшена', '');
  },
};
