/* ============================================
   js/pages/portfolio.js — Portfolio Page (ES Module)
   Portfolio BCHS v7.0
   Tabs: Стратегия портфеля · Аккаунт-планы · Покрытие
   ============================================ */

import { API }  from '../api.js';
import { Calc } from '../calc.js';
import { BCG_CATEGORIES } from '../constants.js';

/* BCG_LABELS используются только внутри этого файла */
const BCG_LABELS = {
  KEY:          '⭐ KEY',
  STABLE:       '🐄 STABLE',
  GROWTH:       '💎 GROWTH',
  GROWTH_EARLY: '🌱 GROWTH',
  TAIL:         '📦 TAIL',
};

export const PortfolioPage = {
  _activeTab:        'portfolio',
  _portfolioData:    { short: null, mid: null, long: null },
  _accountStrategies: [],
  _mcCache:          {},
  _coverageFilters:  { region: '', am: '', status: '', search: '' },
  _allClientsForCoverage: [],
  _allPCForCoverage:      [],

  /* ══════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════ */
  async render() {
    document.getElementById('main-content').innerHTML = `
      <div class="page-header">
        <div class="page-title">🗂️ Управление портфелем</div>
        <div class="page-subtitle">Стратегия на трёх горизонтах · Аккаунт-планы · Покрытие</div>
      </div>
      <div class="detail-tabs" id="pf-tabs" style="margin-bottom:0">
        <button class="detail-tab active" data-pftab="portfolio">📊 Стратегия портфеля</button>
        <button class="detail-tab"        data-pftab="accounts" >👤 Стратегия по аккаунтам</button>
        <button class="detail-tab"        data-pftab="coverage" >🗺 Покрытие</button>
      </div>
      <div id="pf-tab-portfolio"></div>
      <div id="pf-tab-accounts"  class="hidden"></div>
      <div id="pf-tab-coverage"  class="hidden"></div>
    `;

    document.querySelectorAll('[data-pftab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.pftab;
        this._activeTab = tab;
        document.querySelectorAll('[data-pftab]').forEach(b =>
          b.classList.toggle('active', b.dataset.pftab === tab)
        );
        ['portfolio', 'accounts', 'coverage'].forEach(t =>
          document.getElementById(`pf-tab-${t}`)?.classList.toggle('hidden', t !== tab)
        );
        if (tab === 'accounts') this._renderAccountsTab();
        if (tab === 'coverage') this._renderCoverageTab();
      });
    });

    await this._renderPortfolioTab();
  },

  /* ══════════════════════════════════════════
     ТАБ 1 — СТРАТЕГИЯ ПОРТФЕЛЯ
  ══════════════════════════════════════════ */
  async _renderPortfolioTab() {
    const el = document.getElementById('pf-tab-portfolio');
    el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted)">⏳ Загрузка...</div>`;
    try {
      const [clients, allBCHS, allPC, savedStrats] = await Promise.all([
        API.getClients(),
        API.getAllBCHS(),
        API.getAllPC(),
        API.getPortfolioStrategies(),
      ]);

      const computed = clients.map(c => ({
        client: c,
        ...Calc.computeClient(c, allBCHS, allPC),
      }));
      const summary = this._buildSummary(computed);

      /* Сохранённые стратегии по горизонтам */
      this._portfolioData = { short: null, mid: null, long: null };
      savedStrats.forEach(s => {
        if (s.horizon === 'short') this._portfolioData.short = s;
        if (s.horizon === 'mid')   this._portfolioData.mid   = s;
        if (s.horizon === 'long')  this._portfolioData.long  = s;
      });

      el.innerHTML = `
        ${this._summaryHTML(summary, computed)}
        <div class="form-section" style="margin-top:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;
                      flex-wrap:wrap;gap:10px;margin-bottom:16px">
            <div class="form-section-title" style="margin:0">Стратегические горизонты</div>
            <button class="btn btn-primary btn-sm" id="pf-save-btn">💾 Сохранить всё</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr;gap:16px">
            ${this._horizonFormHTML('short', '🔴 Краткосрочная', '1 месяц',      this._portfolioData.short)}
            ${this._horizonFormHTML('mid',   '🟡 Среднесрочная', '1–2 квартала', this._portfolioData.mid)}
            ${this._horizonFormHTML('long',  '🟢 Долгосрочная',  '4 квартала',   this._portfolioData.long)}
          </div>
        </div>`;

      document.getElementById('pf-save-btn')
        ?.addEventListener('click', () => this._savePortfolioStrats());

      ['short', 'mid', 'long'].forEach(key => {
  document.getElementById(`pf-ai-btn-${key}`)
    ?.addEventListener('click', () => this._aiHorizon(key, summary, computed));
});

    } catch (e) {
      console.error('[PortfolioPage._renderPortfolioTab]', e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--md-red)">
        ❌ Ошибка: ${e.message}</div>`;
    }
  },

  /* ── Summary calculation ── */
  _buildSummary(computed) {
    const total = computed.length;

    const withLoyalty = computed.filter(r => r.loyalty !== null);
    const avgLoyalty  = withLoyalty.length
      ? Math.round(withLoyalty.reduce((s, r) => s + r.loyalty, 0) / withLoyalty.length)
      : null;

    const withBCHS = computed.filter(r => r.bchs !== null);
    const avgBchs  = withBCHS.length
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
    const avgPotential  = withPotential.length
      ? Math.round(withPotential.reduce((s, r) => s + r.potential, 0) / withPotential.length)
      : null;

    return { total, avgBchs, avgLoyalty, totalRisk, bcgCount, top3Risk, avgPotential };
  },

  _summaryHTML(s) {
    const col = (val, hi, mid) =>
      val === null ? '#6B7280' : val >= hi ? '#10B981' : val >= mid ? '#F59E0B' : '#EF4444';

    const loyaltyColor = col(s.avgLoyalty,  70, 50);
    const potColor     = col(s.avgPotential, 85, 65);
    const riskColor    = s.totalRisk === 0 ? '#10B981'
                       : s.totalRisk > 50000 ? '#EF4444' : '#F59E0B';

    const top3html = s.top3Risk.length
      ? s.top3Risk.map(r => `
          <div style="font-size:11px;display:flex;justify-content:space-between;
                      padding:3px 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--text-primary);font-weight:500">${r.name}</span>
            <span style="color:#EF4444;font-weight:600">

              $${r.risk.toLocaleString('ru-RU')} · ${r.pct}%
            </span>
          </div>`).join('')
      : '<div style="font-size:11px;color:var(--text-muted)">Нет рисков</div>';

    return `
      <div class="form-section">
        <div class="form-section-title">📊 Аналитическая сводка портфеля</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">
          <div class="kpi-card">
            <div class="kpi-label">ВСЕГО КЛИЕНТОВ</div>
            <div class="kpi-value">${s.total}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">ЛОЯЛЬНОСТЬ</div>
            <div class="kpi-value" style="color:${loyaltyColor}">
              ${s.avgLoyalty !== null ? s.avgLoyalty + '%' : '—'}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">REVENUE AT RISK</div>
            <div class="kpi-value" style="color:${riskColor}">

              $${s.totalRisk.toLocaleString('ru-RU')}
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">РЕАЛИЗАЦИЯ</div>
            <div class="kpi-value" style="color:${potColor}">
              ${s.avgPotential !== null ? s.avgPotential + '%' : '—'}
            </div>
          </div>
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
    <div style="background:var(--surface);border:1px solid var(--border);
                border-radius:var(--radius);padding:20px;display:flex;
                flex-direction:column;gap:12px">
      <div style="display:flex;align-items:center;
                  justify-content:space-between">
        <div style="font-size:13px;font-weight:700">${label}
          <span style="font-size:11px;color:var(--text-muted);
                       font-weight:400;margin-left:4px">${period}</span>
        </div>
        <button id="pf-ai-btn-${key}" class="btn btn-secondary btn-sm"
                style="padding:4px 10px;font-size:12px;white-space:nowrap"
                title="🤖 AI предложит 3 варианта стратегии">
          🤖 AI варианты
        </button>
      </div>

      <div class="form-group" style="margin:0">
        <label class="form-label">Название</label>
        <input class="form-input" id="pf-${key}-title"
               value="${v('title')}"
               placeholder="Например: Операционная чистота" />
      </div>

      <div class="form-group" style="margin:0">
        <label class="form-label">Цель</label>
        <textarea class="form-textarea" id="pf-${key}-goal"
                  style="min-height:100px;resize:vertical"
                  placeholder="Что хотим достичь...">${v('goal')}</textarea>
      </div>

      <div class="form-group" style="margin:0">
        <label class="form-label">Действия</label>
        <textarea class="form-textarea" id="pf-${key}-actions"
                  style="min-height:120px;resize:vertical"
                  placeholder="Конкретные шаги...">${v('actions')}</textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="form-group" style="margin:0">
          <label class="form-label">Метрика успеха</label>
          <input class="form-input" id="pf-${key}-metric"
                 value="${v('success_metric')}"
                 placeholder="Как измерим результат" />
        </div>
        <div class="form-group" style="margin:0">
          <label class="form-label">Дедлайн</label>
          <input class="form-input" type="date"
                 id="pf-${key}-deadline"
                 value="${v('deadline')}" />
        </div>
      </div>
    </div>`;
},


  _readHorizon(key) {
    const g = id => document.getElementById(id)?.value.trim() ?? '';
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
      window.App.toast('✅ Стратегия сохранена', 'success');
    } catch (e) {
      window.App.toast('❌ Ошибка сохранения', 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '💾 Сохранить всё'; }
    }
  },

  async _aiHorizon(key, summary, computed) {
  const btn = document.getElementById(`pf-ai-btn-${key}`);
  if (btn) { btn.disabled = true; btn.textContent = '⏳'; }

  const horizonLabels = {
    short: 'краткосрочная (1 месяц)',
    mid:   'среднесрочная (1–2 квартала)',
    long:  'долгосрочная (4 квартала)',
  };

  /* Сначала спрашиваем направление */
  const direction = await this._askDirection([
    { id: 'retention',    label: '🛡️ Удержание',  hint: 'снизить риски, удержать клиентов' },
    { id: 'growth',       label: '🚀 Рост',        hint: 'апсейл, расширение, новые услуги' },
    { id: 'optimization', label: '⚡ Оптимизация', hint: 'эффективность команды и процессов' },
    { id: 'custom',       label: '✍️ Своё',        hint: 'введи направление вручную' },
  ]);

  if (direction === null) {
    if (btn) { btn.disabled = false; btn.textContent = '🤖'; }
    return;
  }

  if (btn) btn.textContent = '⏳ Генерирую...';

  try {
    /* Клиентский снапшот — топ-10 по риску */
    const clientsSnapshot = (computed || [])
      .filter(r => r.bchs !== null)
      .sort((a, b) => (b.revenueAtRisk || 0) - (a.revenueAtRisk || 0))
      .slice(0, 10)
      .map(r => ({
        name:  r.client.name,
        bcg:   r.client.bcg_category,
        bchs:  r.bchs,
        trend: r.trend?.label ?? '—',
        mr:    r.client.monthly_revenue || 0,
        churn: null,
        risk:  r.revenueAtRisk || 0,
      }));

    const data = await API.callAI(null, {
      type:      'horizon',
      horizon:   key,
      direction,
      max_tokens: 1800,
      summary: {
        total:        summary.total,
        avgLoyalty:   summary.avgLoyalty,
        totalRisk:    summary.totalRisk,
        bcgCount:     summary.bcgCount,
        top3Risk:     summary.top3Risk.map(r =>
          `${r.name} ($${r.risk.toLocaleString('ru-RU')}, ${r.pct}%)`
        ).join('; ') || 'нет',
        avgPotential: summary.avgPotential,
      },
      clients_snapshot:    clientsSnapshot,
      existing_strategies: {
        short: this._portfolioData.short,
        mid:   this._portfolioData.mid,
        long:  this._portfolioData.long,
      },
    });

    const content = data?.choices?.[0]?.message?.content ?? '';
    if (!content) throw new Error('Пустой ответ от AI');

    const match   = content.match(/\{[\s\S]*\}/);
    const parsed  = JSON.parse(match ? match[0] : content);
    const variants = parsed.variants ?? [];

    if (!variants.length) throw new Error('AI не вернул варианты');

    this._showVariantPicker(key, variants, horizonLabels[key]);

  } catch (e) {
    console.error('[AI Horizon]', e);
    window.App.toast('Ошибка AI: ' + e.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🤖'; }
  }
},

_askDirection(options) {
  return new Promise(resolve => {
    const html = `
      <div style="max-width:400px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">
          🎯 Выбери направление стратегии
        </div>
        <div style="display:grid;gap:8px;margin-bottom:16px">
          ${options.map(o => `
            <div class="dir-option" data-id="${o.id}"
                 style="padding:10px 14px;border:1px solid var(--border);
                        border-radius:var(--radius);cursor:pointer;transition:all 0.15s">
              <div style="font-weight:600">${o.label}</div>
              <div style="font-size:11px;color:var(--text-muted)">${o.hint}</div>
            </div>`).join('')}
        </div>
        <div id="custom-dir-wrap" style="display:none;margin-bottom:16px">
          <input class="form-input" id="custom-dir-input"
                 placeholder="Опиши направление..." />
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" id="dir-confirm" disabled>
            Генерировать →
          </button>
          <button class="btn btn-secondary btn-sm" id="dir-cancel">Отмена</button>
        </div>
      </div>`;

    window.App.openModal(html);
    let selected = null;

    document.querySelectorAll('.dir-option').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.dir-option').forEach(e => {
          e.style.background  = '';
          e.style.borderColor = 'var(--border)';
        });
        el.style.background  = 'rgba(99,102,241,0.08)';
        el.style.borderColor = '#6366f1';
        selected = el.dataset.id;
        document.getElementById('custom-dir-wrap').style.display =
          selected === 'custom' ? 'block' : 'none';
        if (selected === 'custom')
          document.getElementById('custom-dir-input').focus();
        document.getElementById('dir-confirm').disabled = false;
      });
    });

    document.getElementById('dir-confirm')?.addEventListener('click', () => {
      let result = selected;
      if (selected === 'custom')
        result = document.getElementById('custom-dir-input')?.value.trim() || 'custom';
      window.App.closeModal();
      resolve(result);
    });

    document.getElementById('dir-cancel')?.addEventListener('click', () => {
      window.App.closeModal();
      resolve(null);
    });
  });
},

_showVariantPicker(key, variants, horizonLabel) {
  const cards = variants.map((v, i) => `
    <div class="variant-card" data-idx="${i}"
         style="padding:14px;border:1px solid var(--border);border-radius:var(--radius);
                cursor:pointer;margin-bottom:10px;transition:all 0.15s">
      <div style="font-weight:700;margin-bottom:6px;color:#6366f1">
        ${v.label ?? `Вариант ${i + 1}`}
      </div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px">
        <strong>Цель:</strong> ${v.goal ?? '—'}
      </div>
      <div style="font-size:11px;color:var(--text-muted)">
        📅 ${v.deadline ?? '—'} · 🎯 ${v.success_metric ?? '—'}
      </div>
    </div>`).join('');

  window.App.openModal(`
    <div style="max-width:520px">
      <div style="font-size:15px;font-weight:700;margin-bottom:4px">
        🤖 3 варианта стратегии
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px">
        ${horizonLabel} · Выбери понравившийся — он заполнится в форму
      </div>
      <div id="variant-list">${cards}</div>
      <button class="btn btn-secondary btn-sm" id="variant-cancel"
              style="margin-top:4px">Отмена</button>
    </div>`);

  document.querySelectorAll('.variant-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.background  = 'rgba(99,102,241,0.06)';
      card.style.borderColor = '#6366f1';
    });
    card.addEventListener('mouseleave', () => {
      card.style.background  = '';
      card.style.borderColor = 'var(--border)';
    });
    card.addEventListener('click', () => {
      const v = variants[parseInt(card.dataset.idx)];
      const s = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      s(`pf-${key}-title`,    v.title    ?? v.label ?? '');
      s(`pf-${key}-goal`,     v.goal     ?? '');
      s(`pf-${key}-actions`,  v.actions  ?? '');
      s(`pf-${key}-metric`,   v.success_metric ?? '');
      s(`pf-${key}-deadline`, v.deadline ?? '');
      window.App.closeModal();
      window.App.toast(`✅ Вариант применён — проверьте и нажмите «Сохранить всё»`, 'success');
    });
  });

  document.getElementById('variant-cancel')?.addEventListener('click', () => {
    window.App.closeModal();
  });
},





  /* ══════════════════════════════════════════
     ТАБ 2 — СТРАТЕГИЯ ПО АККАУНТАМ
  ══════════════════════════════════════════ */
  async _renderAccountsTab() {
    const el = document.getElementById('pf-tab-accounts');
    el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted)">
      ⏳ Загрузка аккаунтов...</div>`;
    try {
      const [clients, allBCHS, allPC, accountStrats] = await Promise.all([
        API.getClients(),
        API.getAllBCHS(),
        API.getAllPC(),
        API.getAccountStrategies(),
      ]);
      this._accountStrategies = accountStrats;

      const computed = clients.map(c => ({
        client: c,
        ...Calc.computeClient(c, allBCHS, allPC),
      }));

      /* Monte Carlo — берём из window.MCEngine если доступен */
      const MCEngine = window.MCEngine ?? null;
      const mcResults = {};

      if (MCEngine) {
        /* MC-конфиги грузим напрямую через API base URL */
        let mcConfigs = [];
        try {
          const r = await API._get?.('tables/mc_configs?limit=500');
          mcConfigs = Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : []);
        } catch { /* тихо пропускаем */ }

        for (const row of computed) {
          const cid = String(row.client.id);
          if (this._mcCache[cid]) { mcResults[cid] = this._mcCache[cid]; continue; }
          const cfg = mcConfigs.find(x => String(x.client_id) === cid);
          try {
            const mcCfg = Object.assign(
              {},
              MCEngine.DEFAULTS,
              { monthly_revenue: row.client.monthly_revenue || 5000 },
              cfg || {}
            );
            const res = MCEngine.run(row.bchs, mcCfg);
            this._mcCache[cid] = res;
            mcResults[cid] = res;
          } catch { mcResults[cid] = null; }
        }
      }

      const rows = computed.map(row => {
        const c   = row.client;
        const mc  = mcResults[String(c.id)] ?? null;

        const mc3m     = mc ? mc.horizons['3m'].bchs.median.toFixed(1) : '—';
        const churn    = mc ? mc.horizons['3m'].churn_rate : null;
        const churnCls = churn === null ? '' :
          churn < 7 ? 'color:#10B981' : churn < 15 ? 'color:#F59E0B' : 'color:#EF4444';

        const strat     = accountStrats.find(
          s => String(s.client_id) === String(c.id) && s.status !== 'Done'
        );
        const stratText = strat
          ? (strat.goal || '').slice(0, 60) + ((strat.goal || '').length > 60 ? '…' : '')
          : null;

        const bcg = BCG_LABELS[c.bcg_category] || c.bcg_category || '—';

        return `<tr>
          <td><strong>${c.name}</strong></td>
          <td><span class="bcg-chip" style="font-size:11px">${bcg}</span></td>
          <td style="font-size:11px">${c.key_account_priority || '—'}</td>
          <td style="color:${
            row.bchs !== null
              ? (row.bchs >= 20 ? '#10B981' : row.bchs >= -10 ? '#F59E0B' : '#EF4444')
              : '#6B7280'};font-weight:600">${row.bchs !== null ? row.bchs : '—'}</td>
          <td style="font-weight:600">${mc3m}</td>
          <td style="${churnCls};font-weight:600">
            ${churn !== null ? churn.toFixed(1) + '%' : '—'}
          </td>
          <td style="font-size:11px;color:${
            stratText ? 'var(--text-secondary)' : 'var(--text-muted)'}">
            ${stratText || 'Не задана'}
          </td>
          <td>
            <button class="btn btn-secondary btn-sm"
                    data-action="open-strat"
                    data-cid="${c.id}"
                    style="font-size:11px">✎ Открыть</button>
          </td>
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
          const cid   = btn.dataset.cid;
          const row   = computed.find(r => String(r.client.id) === cid);
          const mc    = mcResults[cid] ?? null;
          const strat = accountStrats.find(
            s => String(s.client_id) === cid && s.status !== 'Done'
          ) ?? null;
          this._openAccountStratModal(row, mc, strat);
        });
      });

    } catch (e) {
      console.error('[PortfolioPage._renderAccountsTab]', e);
      el.innerHTML = `<div style="padding:32px;text-align:center;color:var(--md-red)">
        ❌ Ошибка: ${e.message}</div>`;
    }
  },

  _openAccountStratModal(row, mc, strat) {
    const c   = row.client;
    const bcg = BCG_LABELS[c.bcg_category] || c.bcg_category || '—';

    const mc3m   = mc ? mc.horizons['3m'].bchs.median.toFixed(1)  : '—';
    const mc12m  = mc ? mc.horizons['12m'].bchs.median.toFixed(1) : '—';
    const churn3 = mc ? mc.horizons['3m'].churn_rate.toFixed(1) + '%' : '—';
    const churnColor = mc
      ? (mc.horizons['3m'].churn_rate < 7 ? '#10B981'
         : mc.horizons['3m'].churn_rate < 15 ? '#F59E0B' : '#EF4444')
      : '#6B7280';

    const trendLabel = row.trend?.label ?? '—';
    const v = f => strat ? (strat[f] || '') : '';

    const bchsColor = row.bchs !== null
      ? (row.bchs >= 20 ? '#10B981' : row.bchs >= -10 ? '#F59E0B' : '#EF4444')
      : '#6B7280';

    const statuses = ['Active', 'Done', 'Paused'].map(s =>
      `<option value="${s}" ${(v('status') || 'Active') === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    window.App.openModal(`
      <div style="max-width:560px">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;flex-wrap:wrap">
          <div>
            <div style="font-size:16px;font-weight:700">${c.name}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px">
              ${bcg} · ${c.key_account_priority || '—'} ·

              $${Number(c.monthly_revenue || 0).toLocaleString('ru-RU')}/мес
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
          <div class="kpi-card" style="padding:8px 10px">
            <div class="kpi-label">bCHS</div>
            <div class="kpi-value" style="font-size:18px;color:${bchsColor}">
              ${row.bchs !== null ? row.bchs : '—'}
            </div>
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
          <textarea class="form-textarea" id="as-goal" style="min-height:80px"
                    placeholder="Что хотим достичь с этим клиентом...">${v('goal')}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:10px">
          <label class="form-label">Действия</label>
          <textarea class="form-textarea" id="as-actions" style="min-height:80px"
                    placeholder="Конкретные шаги...">${v('actions')}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
          <div class="form-group" style="margin:0">
            <label class="form-label">Метрика успеха</label>
            <input class="form-input" id="as-metric"
                   value="${v('success_metric')}" placeholder="Как измерим" />
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
          <button class="btn btn-secondary btn-sm"
                  onclick="window.App.closeModal()">✕ Закрыть</button>
        </div>
      </div>
    `);

    /* ── Save handler ── */
    document.getElementById('as-save-btn')?.addEventListener('click', async () => {
      const g = id => document.getElementById(id)?.value.trim() ?? '';
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
        window.App.toast('✅ Стратегия сохранена', 'success');
        window.App.closeModal();
        this._renderAccountsTab();
      } catch {
        window.App.toast('❌ Ошибка сохранения', 'error');
      } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 Сохранить'; }
      }
    });

    /* ── AI handler ── */
    document.getElementById('as-ai-btn')?.addEventListener('click', async () => {
  const aiBtn = document.getElementById('as-ai-btn');
  if (aiBtn) { aiBtn.disabled = true; aiBtn.textContent = '⏳...'; }

  try {
    const data = await API.callAI(null, {
      type:    'account',
      client: {
        name:               c.name,
        bcg:                bcg,
        priority:           c.key_account_priority || '—',
        monthly_revenue:    c.monthly_revenue || 0,
        engagement:         c.client_engagement || '—',
        phase:              c.phase || '—',
        revenue_at_risk:    row.revenueAtRisk || 0,
      },
      metrics: {
        bchs_current: row.bchs,
        trend:        trendLabel,
        mc_3m_median: mc3m,
        mc_3m_churn:  churn3,
        mc_12m_median: mc12m,
        mc_12m_churn:  mc
          ? mc.horizons['12m'].churn_rate.toFixed(1) + '%'
          : '—',
      },
    });

    const content = data?.choices?.[0]?.message?.content ?? '';
    if (!content) throw new Error('Пустой ответ от AI');

    const match  = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : content);

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };
    setVal('as-goal',     parsed.goal);
    setVal('as-actions',  parsed.actions);
    setVal('as-metric',   parsed.success_metric);
    setVal('as-deadline', parsed.deadline);

    window.App.toast('🤖 AI предложение заполнено — проверьте и сохраните', 'success');

  } catch (e) {
    console.error('[AI Account]', e);
    window.App.toast('Ошибка AI: ' + e.message, 'error');
  } finally {
    if (aiBtn) { aiBtn.disabled = false; aiBtn.textContent = '🤖 AI предложить'; }
  }
});

  },

  /* ══════════════════════════════════════════
     ТАБ 3 — ПОКРЫТИЕ ПОРТФЕЛЯ
  ══════════════════════════════════════════ */
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
      this._allPCForCoverage      = allPC;
      this._renderCoverageContent(clients, allPC);
    } catch (e) {
      el.innerHTML = `<div class="cov-loading" style="color:var(--red)">
        ❌ Ошибка: ${e.message}</div>`;
    }
  },

  _renderCoverageContent(clients, allPC) {
    const el = document.getElementById('pf-tab-coverage');
    if (!el) return;
    allPC = allPC ?? this._allPCForCoverage ?? [];

    const f = this._coverageFilters;

    const regions = [...new Set(clients.map(c => c.dach_region).filter(Boolean))].sort();
    const ams     = [...new Set(clients.map(c => c.account_manager).filter(Boolean))].sort();

    /* Рассчитываем покрытие по ролям */
    const withCov = clients.map(c => {
      const pcEntries = allPC
        .filter(e => String(e.client_id) === String(c.id))
        .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
      const pc = pcEntries.at(-1) ?? null;

      const csm   = Number(pc?.role_csm)              || 0;
      const am    = Number(pc?.role_account_manager)   || 0;
      const coord = Number(pc?.role_coordinator)       || 0;
      const sales = Number(pc?.role_sales)             || 0;
      const deliv = Number(pc?.role_delivery)          || 0;

      const hasCSM   = csm   > 0;
      const hasAM    = am    > 0;
      const hasCoord = coord > 0;
      const hasSales = sales > 0;
      const hasDeliv = deliv > 0;
      const hasOther = hasAM || hasCoord || hasSales || hasDeliv;
      const hasAny   = hasCSM || hasOther;

      const covStatus =
        hasCSM && hasAM && hasCoord ? 'full'
        : hasCSM && hasOther        ? 'overlap'
        : hasAny                    ? 'partial'
        : 'none';

      return { ...c, csm, am, coord, sales, deliv,
               hasCSM, hasAM, hasCoord, hasSales, hasDeliv, covStatus };
    });

    const total     = withCov.length;
    const fullCov   = withCov.filter(c => c.covStatus === 'full').length;
    const noCov     = withCov.filter(c => c.covStatus === 'none').length;
    const bothRoles = withCov.filter(c => c.covStatus === 'overlap').length;

    /* Фильтрация */
    let filtered = withCov;
    if (f.region) filtered = filtered.filter(c => c.dach_region === f.region);
    if (f.am)     filtered = filtered.filter(c => c.account_manager === f.am);
    if (f.status) filtered = filtered.filter(c => c.covStatus === f.status);
    if (f.search) filtered = filtered.filter(c =>
      (c.name || '').toLowerCase().includes(f.search.toLowerCase())
    );

    const regionOpts = regions.map(r =>
      `<option value="${r}" ${f.region === r ? 'selected' : ''}>${r}</option>`
    ).join('');
    const amOpts = ams.map(a =>
      `<option value="${a}" ${f.am === a ? 'selected' : ''}>${a}</option>`
    ).join('');

    /* Хелпер: пип роли */
    const rolePip = (active, label) =>
      `<span title="${label}" style="display:inline-flex;align-items:center;
        justify-content:center;width:28px;height:18px;border-radius:4px;
        font-size:9px;font-weight:700;
        background:${active ? 'rgba(99,102,241,0.12)' : 'rgba(0,0,0,0.04)'};
        color:${active ? '#6366f1' : '#9ca3af'};
        border:1px solid ${active ? 'rgba(99,102,241,0.25)' : 'rgba(0,0,0,0.08)'}">
        ${label}</span>`;

    const tableRows = filtered.map(c => {
      const covBadge =
        c.covStatus === 'full'    ? `<span class="cov-badge cov-badge--full">🟢 Покрыт</span>`
        : c.covStatus === 'overlap' ? `<span class="cov-badge cov-badge--partial">🔵 Пересечение</span>`
        : c.covStatus === 'partial' ? `<span class="cov-badge cov-badge--partial">🟡 Частично</span>`
        : `<span class="cov-badge cov-badge--none">🔴 Не покрыт</span>`;

      const mr = c.monthly_revenue
        ? `$${Number(c.monthly_revenue).toLocaleString('ru-RU')}` : '—';

      return `<tr data-cid="${c.id}">
        <td class="cov-td-name"><strong>${c.name || '—'}</strong></td>
        <td class="cov-td-region">${c.dach_region || '—'}</td>
        <td class="cov-td-am">${c.account_manager ||
          '<span class="cov-empty">не назначен</span>'}</td>
        <td class="cov-td-coord">
          <div class="cov-coord-cell">
            <span class="cov-coord-name" data-cid="${c.id}">${c.coordinator ||
              '<span class="cov-empty">не назначен</span>'}</span>
            <button class="cov-assign-btn" data-cid="${c.id}"
                    title="Назначить координатора">✎</button>
          </div>
        </td>
        <td class="cov-td-rev">${mr}</td>
        <td style="white-space:nowrap">
          ${rolePip(c.hasCSM,   'CSM')}
          ${rolePip(c.hasAM,    'AM')}
          ${rolePip(c.hasCoord, 'DC')}
          ${rolePip(c.hasSales, 'SLS')}
          ${rolePip(c.hasDeliv, 'DLV')}
        </td>
        <td class="cov-td-cov">${covBadge}</td>
      </tr>`;
    }).join('');

    el.innerHTML = `
    <div class="cov-page">
      <div class="cov-filters">
        <select class="cov-filter-select" id="cov-f-region">
          <option value="">🌍 Все регионы</option>${regionOpts}
        </select>
        <select class="cov-filter-select" id="cov-f-am">
          <option value="">👤 Все AM</option>${amOpts}
        </select>
        <select class="cov-filter-select" id="cov-f-status">
          <option value="">🔍 Все статусы покрытия</option>
          <option value="full"    ${f.status === 'full'    ? 'selected' : ''}>🟢 Полностью покрыт</option>
          <option value="overlap" ${f.status === 'overlap' ? 'selected' : ''}>🔵 Пересечение (CSM+др.)</option>
          <option value="partial" ${f.status === 'partial' ? 'selected' : ''}>🟡 Частично</option>
          <option value="none"    ${f.status === 'none'    ? 'selected' : ''}>🔴 Не покрыт</option>
        </select>
        <input class="cov-filter-input" id="cov-f-search"
               placeholder="🔍 Поиск клиента..." value="${f.search}" />
        <button class="btn btn-secondary btn-sm" id="cov-reset-btn">✕ Сбросить</button>
        <button class="btn btn-secondary btn-sm" id="cov-export-btn">📥 Экспорт CSV</button>
      </div>

      <div class="cov-stats">
        <div class="cov-stat-card">
          <div class="cov-stat-val">${total}</div>
          <div class="cov-stat-lbl">Всего клиентов</div>
        </div>
        <div class="cov-stat-card cov-stat-card--green">
          <div class="cov-stat-val">${fullCov}</div>
          <div class="cov-stat-lbl">Полностью покрыто
            <span class="cov-stat-pct">
              ${total ? Math.round(fullCov / total * 100) : 0}%
            </span>
          </div>
        </div>
        <div class="cov-stat-card cov-stat-card--red">
          <div class="cov-stat-val">${noCov}</div>
          <div class="cov-stat-lbl">Без покрытия
            <span class="cov-stat-pct">
              ${total ? Math.round(noCov / total * 100) : 0}%
            </span>
          </div>
        </div>
        <div class="cov-stat-card cov-stat-card--blue">
          <div class="cov-stat-val">${bothRoles}</div>
          <div class="cov-stat-lbl">Пересечение
            <span style="font-size:10px;display:block;opacity:0.8">(CSM + др. роль)</span>
          </div>
        </div>
      </div>

      <div class="cov-table-wrap">
        <table class="cov-table">
          <thead><tr>
            <th>Клиент</th><th>Регион</th><th>Аккаунт-менеджер</th>
            <th>Координатор</th><th>Revenue</th><th>Роли</th><th>Покрытие</th>
          </tr></thead>
          <tbody id="cov-tbody">
            ${tableRows || `<tr><td colspan="7"
              style="text-align:center;padding:24px;color:var(--text-muted)">
              Нет клиентов по фильтру</td></tr>`}
          </tbody>
        </table>
        <div class="cov-table-footer">Показано: ${filtered.length} из ${total}</div>
      </div>

      <!-- Inline dropdown для координатора -->
      <div class="cov-inline-dropdown hidden" id="cov-inline-dropdown">
        <div class="cov-inline-header">
          <span class="cov-inline-title">Назначить координатора</span>
          <button class="cov-inline-close" id="cov-dd-close">✕</button>
        </div>
        <input class="cov-inline-input" id="cov-dd-input"
               placeholder="Имя координатора..." />
        <div class="cov-inline-suggestions" id="cov-dd-suggestions"></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary btn-sm"   id="cov-dd-save">💾 Сохранить</button>
          <button class="btn btn-secondary btn-sm" id="cov-dd-clear">✕ Снять</button>
        </div>
      </div>
    </div>`;

    this._bindCoverageEvents(withCov);
  },

  _bindCoverageEvents(withCov) {
    const applyFilter = () => {
      this._coverageFilters.region = document.getElementById('cov-f-region')?.value || '';
      this._coverageFilters.am     = document.getElementById('cov-f-am')?.value     || '';
      this._coverageFilters.status = document.getElementById('cov-f-status')?.value || '';
      this._coverageFilters.search = document.getElementById('cov-f-search')?.value || '';
      this._renderCoverageContent(this._allClientsForCoverage);
    };

    ['cov-f-region', 'cov-f-am', 'cov-f-status'].forEach(id =>
      document.getElementById(id)?.addEventListener('change', applyFilter)
    );
    document.getElementById('cov-f-search')?.addEventListener('input', applyFilter);

    document.getElementById('cov-reset-btn')?.addEventListener('click', () => {
      this._coverageFilters = { region: '', am: '', status: '', search: '' };
      this._renderCoverageContent(this._allClientsForCoverage);
    });

    document.getElementById('cov-export-btn')?.addEventListener('click', () => {
      this._exportCoverageCSV(withCov);
    });

    /* ── Inline dropdown для координатора ── */
    let _ddTargetCid = null;
    const dd  = document.getElementById('cov-inline-dropdown');
    const inp = document.getElementById('cov-dd-input');
    const sug = document.getElementById('cov-dd-suggestions');

    const allCoords = [...new Set(
      (this._allClientsForCoverage || []).map(c => c.coordinator).filter(Boolean)
    )].sort();

    document.querySelectorAll('.cov-assign-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        _ddTargetCid  = btn.dataset.cid;
        const c       = this._allClientsForCoverage.find(x => x.id === _ddTargetCid);
        if (inp) inp.value = c?.coordinator || '';

        const rect  = btn.getBoundingClientRect();
        const mcEl  = document.getElementById('main-content');
        const mcR   = mcEl.getBoundingClientRect();
        dd.style.top  = (rect.bottom - mcR.top + mcEl.scrollTop + 6) + 'px';
        dd.style.left = Math.min(rect.left - mcR.left, mcR.width - 280) + 'px';
        dd.classList.remove('hidden');
        inp?.focus();
        this._updateSuggestions(inp?.value || '', allCoords, sug, inp);
      });
    });

    inp?.addEventListener('input', () => {
      this._updateSuggestions(inp.value, allCoords, sug, inp);
    });

    document.getElementById('cov-dd-close')?.addEventListener('click', () => {
      dd?.classList.add('hidden');
    });

    document.getElementById('cov-dd-save')?.addEventListener('click', async () => {
      if (!_ddTargetCid || !inp) return;
      await this._saveCoordinator(_ddTargetCid, inp.value.trim());
      dd?.classList.add('hidden');
    });

    document.getElementById('cov-dd-clear')?.addEventListener('click', async () => {
      if (!_ddTargetCid) return;
      await this._saveCoordinator(_ddTargetCid, '');
      dd?.classList.add('hidden');
    });

    document.addEventListener('click', e => {
      if (dd && !dd.contains(e.target) && !e.target.classList.contains('cov-assign-btn')) {
        dd.classList.add('hidden');
      }
    }, { once: true });
  },

  _updateSuggestions(query, all, container, input) {
    if (!container) return;
    const q       = query.toLowerCase().trim();
    const matches = q ? all.filter(s => s.toLowerCase().includes(q)) : all.slice(0, 8);
    if (!matches.length) { container.innerHTML = ''; return; }
    container.innerHTML = matches
      .map(s => `<div class="cov-sug-item" data-val="${s}">${s}</div>`)
      .join('');
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
      const c = this._allClientsForCoverage.find(x => x.id === clientId);
      if (!c) return;

      /* Используем API._put если доступен, иначе прямой fetch */
      if (typeof API._put === 'function') {
        await API._put(`tables/clients/${clientId}`, { coordinator: name });
      } else {
        await fetch(`tables/clients/${clientId}`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ coordinator: name }),
        });
      }

      /* Инвалидируем кеш клиентов */
      if (API._clientsCache !== undefined) API._clientsCache = null;

      c.coordinator = name;
      window.App.toast(
        name ? `✅ Координатор «${name}» назначен` : '✅ Координатор снят',
        'success'
      );

      /* Hot-update ячейки без полного перерендера */
      const cell = document.querySelector(`.cov-coord-name[data-cid="${clientId}"]`);
      if (cell) cell.innerHTML = name || '<span class="cov-empty">не назначен</span>';

      this._renderCoverageContent(this._allClientsForCoverage);
    } catch (e) {
      window.App.toast('❌ Ошибка: ' + e.message, 'error');
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
    if (f.search) filtered = filtered.filter(c =>
      (c.name || '').toLowerCase().includes(f.search.toLowerCase())
    );

    const covLabel = { full: 'Покрыт', partial: 'Частично', overlap: 'Пересечение', none: 'Не покрыт' };
    const headers  = ['Клиент','Регион','Аккаунт-менеджер','Координатор',
                      'Revenue','Статус клиента','Покрытие'];
    const lines = [
      headers.join(';'),
      ...filtered.map(c => [
        `"${(c.name             || '').replace(/"/g, '""')}"`,
        c.dach_region           || '',
        `"${(c.account_manager  || '').replace(/"/g, '""')}"`,
        `"${(c.coordinator      || '').replace(/"/g, '""')}"`,
        c.monthly_revenue       || 0,
        c.status                || '',
        covLabel[c.covStatus]   || '',
      ].join(';')),
    ];

    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `coverage_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
    window.App.toast('📥 CSV экспортирован', 'success');
  },
};
