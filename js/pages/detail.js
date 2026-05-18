/* js/pages/detail.js
   Карточка клиента — обзор, история, таб Delivery и др.
   Версия с системой табов: Overview / History / Delivery
   ============================================ */

const DetailPage = {
  client:        null,
  computed:      null,
  chartInstance: null,
  activeTab:     'overview',  // текущий активный таб

  /* ── Главный рендер (загрузка данных) ────────────────────── */
  async render(clientId) {
    const main = document.getElementById('main-content');
    main.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Загрузка клиента...</div>`;

    try {
      const [client, allBCHS, allPC, fteEntries] = await Promise.all([
        API.getClient(clientId),
        API.getBCHSEntries(clientId),
        API.getPCEntries(clientId),
        window.FteAPI ? FteAPI.getByClient(clientId) : Promise.resolve([]),
      ]);

      this.client   = client;
      this.computed = Calc.computeClient(client, allBCHS, allPC, fteEntries);
      this.activeTab = 'overview';
      // Сбрасываем активный месяц DeliveryTab при смене клиента
      if (window.DeliveryTab) DeliveryTab.activeMonth = null;
      this.renderDetail();
    } catch (err) {
      console.error('[DetailPage.render]', err);
      main.innerHTML = `<div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Ошибка загрузки</div>
      </div>`;
    }
  },

  /* ── Определяем доступные табы по роли ──────────────────── */
  _buildTabs() {
    const tabs = [
      { id: 'overview',  label: '📋 Обзор',    always: true },
      { id: 'history',   label: '📈 История',  always: true },
      { id: 'notes',     label: '📝 Заметки',  always: true },
      { id: 'delivery',  label: '👥 Delivery', module: 'detail_delivery' },
    ];

    return tabs.filter(t => {
      if (t.always) return true;
      // Проверяем доступ через canAccess() если функция есть
      if (window.canAccess) return canAccess(t.module);
      // Fallback — показываем всем
      return true;
    });
  },

  /* ── Рендер страницы клиента ─────────────────────────────── */
  renderDetail() {
    const c   = this.client;
    const r   = this.computed;
    const bcg = BCG_CATEGORIES[c.bcg_category];
    const now = new Date();
    const cm  = now.getMonth() + 1;
    const cy  = now.getFullYear();
    const cmLabel = MONTHS_RU[cm - 1];

    const curMonth = r.curBCHSEntry
      ? MONTHS_RU[(r.curBCHSEntry.month || cm) - 1]
      : cmLabel;

    const tabs     = this._buildTabs();
    const tabsHTML = tabs.map(t => `
      <button class="detail-tab-btn${t.id === this.activeTab ? ' active' : ''}"
        data-tab="${t.id}">${t.label}</button>
    `).join('');

    const main = document.getElementById('main-content');
    main.innerHTML = `
      <div style="margin-bottom:16px">
        <button class="btn btn-secondary btn-sm" id="btn-back-dash">← Назад</button>
      </div>

      <div class="detail-header">
        <div class="detail-header-top">
          <div>
            <div class="detail-client-name">${c.name}</div>
            <div class="detail-badges">
              <span class="badge ${r.badge.cls}">${r.badge.label}</span>
              <span class="bcg-badge">${bcg ? bcg.label : c.bcg_category}</span>
              <span class="bcg-badge">🎯 ${c.key_account_priority}</span>
              <span class="bcg-badge">📌 ${c.status}</span>
            </div>
            <div class="detail-meta">Ответственный: <strong>${c.sales_owner || '—'}</strong></div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-primary btn-sm" id="btn-add-data">✎ Данные за ${cmLabel} ${cy}</button>
            <button class="btn btn-secondary btn-sm" id="btn-edit-client">⚙ Редактировать</button>
          </div>
        </div>
      </div>

      <div class="focus-box">
        <div class="focus-box-label">◉ Фокус сейчас</div>
        <div class="focus-box-text">${r.focus}</div>
      </div>

      <!-- KPI строка -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:16px">
        ${this.renderKPI('bCHS (' + curMonth + ')', r.bchs !== null ? r.bchs : '—', r.health.label, r.bchs !== null ? this.bchsColor(r.bchs) : 'var(--text-muted)')}
        ${this.renderKPI('Лояльность', r.loyalty !== null ? r.loyalty + '%' : '—', 'нормализация [-81,+81]')}
        ${this.renderKPI('PC Score', r.pcScore !== null ? r.pcScore.toFixed(1) : '—', r.load.label)}
        ${this.renderKPI('Final Score', r.final !== null ? r.final.toFixed(1) : '—', `Идеал: ${r.ideal}`)}
        ${this.renderKPI('% Потенциала', r.pctPot !== null ? r.pctPot + '%' : '—',
          r.pctPot !== null ? (r.pctPot >= 100 ? '🚀 Выше идеала' : 'от идеала') : '—')}
        ${this.renderKPI('Тренд 3М', r.trend ? r.trend.label : '—',
          r.trend ? `Δ ${r.trend.delta > 0 ? '+' : ''}${r.trend.delta}` : 'нет данных',
          r.trend ? this.trendColor(r.trend.cls) : 'var(--text-muted)')}
        ${this.renderKPI('💰 Revenue Efficiency',
          r.revenueEfficiency !== null ? Math.round(r.revenueEfficiency * 100) + '%' : '—',
          r.revenueEfficiency !== null
            ? (r.revenueEfficiency >= 0.95 ? '✅ Отлично' : r.revenueEfficiency >= 0.80 ? '⚠️ Внимание' : '🔴 Критично')
            : 'нет FTE данных',
          r.revenueEfficiency !== null
            ? (r.revenueEfficiency >= 0.95 ? 'var(--green)' : r.revenueEfficiency >= 0.80 ? 'var(--yellow)' : 'var(--red)')
            : 'var(--text-muted)')}
      </div>

      <!-- Табы -->
      <div class="detail-tabs-nav">${tabsHTML}</div>
      <div class="detail-tab-content" id="detail-tab-content">
        <!-- контент таба рендерится ниже -->
      </div>
    `;

    this.bindDetailEvents();
    this._renderActiveTab();
  },

  /* ── Переключение табов ──────────────────────────────────── */
  _renderActiveTab() {
    const contentEl = document.getElementById('detail-tab-content');
    if (!contentEl) return;

    switch (this.activeTab) {
      case 'overview':
        contentEl.innerHTML = this._renderOverview();
        if (this.computed.monthlyData.length > 0) this.renderChart();
        if (window.RoleRadar) RoleRadar.bindEvents();
        break;

      case 'history':
        contentEl.innerHTML = this._renderHistorySection();
        break;

      case 'notes':
        contentEl.innerHTML = this._renderNotesSection();
        this._bindNotesEvents();
        break;

      case 'delivery':
        // Рендерим корневой контейнер, затем инициализируем DeliveryTab
        contentEl.innerHTML = `<div class="dtab-wrap" id="delivery-tab-root">
          <div style="padding:40px;text-align:center;color:var(--text-muted)">Загрузка...</div>
        </div>`;
        if (window.DeliveryTab) {
          DeliveryTab.init(this.client.id);
        } else {
          document.getElementById('delivery-tab-root').innerHTML =
            `<div class="empty-state">
              <div class="empty-state-icon">⚠️</div>
              <div class="empty-state-title">DeliveryTab не загружен</div>
            </div>`;
        }
        break;

      default:
        contentEl.innerHTML = this._renderOverview();
    }
  },

  /* ── Контент: Обзор ──────────────────────────────────────── */
  _renderOverview() {
    const r = this.computed;

    /* Радар покрытия ролями — правая колонка */
    const radarHTML = window.RoleRadar
      ? RoleRadar.render(this.client.id, r.curPCEntry)
      : '';

    return `
      <div class="overview-layout">
        <div class="overview-main">
          <div class="chart-container">
            <div class="chart-title">📈 История лояльности (bCHS)</div>
            <div style="height:200px;position:relative">
              <canvas id="loyalty-chart"></canvas>
            </div>
            ${r.monthlyData.length === 0
              ? '<div class="no-data" style="text-align:center;padding:20px">Нет исторических данных</div>'
              : ''}
          </div>
          <div class="form-section" style="margin-top:16px">
            <div class="form-section-title">📋 Последние 3 месяца</div>
            ${this.renderHistoryTable(3)}
          </div>
        </div>
        ${radarHTML ? `<div class="overview-sidebar">${radarHTML}</div>` : ''}
      </div>`;
  },

  /* ── Контент: История ────────────────────────────────────── */
  _renderHistorySection() {
    return `
      <div class="form-section">
        <div class="form-section-title">📋 История по месяцам</div>
        ${this.renderHistoryTable()}
      </div>`;
  },

  /* ── Контент: Заметки ────────────────────────────────────── */
  _renderNotesSection() {
    const c = this.client;
    return `
      <div class="form-section">
        <div class="form-section-title">📝 Заметки о стратегии</div>
        <textarea class="form-textarea" id="strategy-notes" style="min-height:160px">${c.strategy_notes || ''}</textarea>
        <div style="margin-top:8px">
          <button class="btn btn-primary btn-sm" id="btn-save-notes">💾 Сохранить заметки</button>
        </div>
      </div>`;
  },

  /* ── Привязка событий заметок ────────────────────────────── */
  _bindNotesEvents() {
    document.getElementById('btn-save-notes')?.addEventListener('click', async () => {
      const notes = document.getElementById('strategy-notes').value;
      try {
        await API.updateClient(this.client.id, { ...this.client, strategy_notes: notes });
        this.client.strategy_notes = notes;
        App.toast('✅ Заметки сохранены', 'success');
      } catch {
        App.toast('❌ Ошибка сохранения', 'error');
      }
    });
  },

  /* ── KPI-карточка ────────────────────────────────────────── */
  renderKPI(label, value, sub, color) {
    return `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px">
        <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);font-weight:700;margin-bottom:4px">${label}</div>
        <div style="font-size:22px;font-weight:700;color:${color || 'var(--text-primary)'};">${value}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${sub}</div>
      </div>`;
  },

  bchsColor(bchs) {
    if (bchs >= 20)  return 'var(--green)';
    if (bchs >= -10) return 'var(--text-primary)';
    if (bchs >= -30) return 'var(--yellow)';
    return 'var(--red)';
  },

  trendColor(cls) {
    if (cls === 'trend-up')   return 'var(--green)';
    if (cls === 'trend-down') return 'var(--red)';
    return 'var(--text-muted)';
  },

  /* ── Таблица истории ─────────────────────────────────────── */
  renderHistoryTable(limit) {
    const r = this.computed;
    if (!r.bchsHistory || r.bchsHistory.length === 0) {
      return `<div class="no-data" style="text-align:center;padding:20px">Нет данных</div>`;
    }

    let rows = r.bchsHistory.map(be => {
      const bchs    = Calc.computeBCHS(be);
      const loyalty = Calc.loyaltyPct(bchs);
      const health  = Calc.healthSignal(bchs);
      const pe      = r.pcHistory.find(p => p.month === be.month && p.year === be.year);
      const pcScore = pe ? Calc.computePC(pe) : null;
      const load    = Calc.loadSignal(pcScore);
      const finalS  = Calc.finalScore(bchs, pcScore);
      const isCurrent = r.curBCHSEntry &&
        Number(be.month) === Number(r.curBCHSEntry.month) &&
        Number(be.year)  === Number(r.curBCHSEntry.year);
      return { be, bchs, loyalty, health, pe, pcScore, load, finalS, isCurrent };
    }).reverse();

    if (limit) rows = rows.slice(0, limit);

    return `
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Период</th><th>bCHS</th><th>Лояльность</th>
              <th>Здоровье</th><th>PC Score</th><th>Нагрузка</th>
              <th>Final Score</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr${row.isCurrent ? ' style="background:rgba(59,130,246,0.06)"' : ''}>
                <td>
                  <strong>${MONTHS_SHORT[row.be.month - 1]} ${row.be.year}</strong>
                  ${row.isCurrent ? '<span style="font-size:10px;color:var(--blue);font-weight:600"> актуальный</span>' : ''}
                </td>
                <td><strong>${row.bchs !== null ? row.bchs : '—'}</strong></td>
                <td>${row.loyalty !== null ? row.loyalty + '%' : '—'}</td>
                <td>${row.health.label}</td>
                <td>${row.pcScore !== null ? row.pcScore.toFixed(1) : '—'}</td>
                <td>${row.load.label}</td>
                <td>${row.finalS !== null ? row.finalS.toFixed(1) : '—'}</td>
                <td>
                  <button class="btn btn-secondary btn-sm"
                    data-action="edit-month"
                    data-month="${row.be.month}"
                    data-year="${row.be.year}">✎</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  },

  /* ── График ──────────────────────────────────────────────── */
  renderChart() {
    const r = this.computed;
    if (r.monthlyData.length === 0) return;

    if (typeof Chart === 'undefined') {
      const script  = document.createElement('script');
      script.src    = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.onload = () => this.drawChart();
      document.head.appendChild(script);
    } else {
      this.drawChart();
    }
  },

  drawChart() {
    const r   = this.computed;
    const ctx = document.getElementById('loyalty-chart');
    if (!ctx) return;

    if (this.chartInstance) this.chartInstance.destroy();

    const labels      = r.monthlyData.map(d => d.label);
    const bchsData    = r.monthlyData.map(d => d.bchs);
    const loyaltyData = r.monthlyData.map(d => d.loyalty);

    const pointColors = bchsData.map(v => {
      if (v === null) return '#9ca3af';
      if (v >= 20)   return '#10b981';
      if (v >= -10)  return '#6b7280';
      if (v >= -30)  return '#f59e0b';
      return '#ef4444';
    });

    const pointRadius = r.monthlyData.map(d => {
      if (!r.curBCHSEntry) return 5;
      return (d.month === Number(r.curBCHSEntry.month) && d.year === Number(r.curBCHSEntry.year)) ? 8 : 5;
    });

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'bCHS',
            data: bchsData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            borderWidth: 2,
            pointBackgroundColor: pointColors,
            pointRadius,
            tension: 0.3,
            fill: true,
            yAxisID: 'y',
          },
          {
            label: 'Лояльность %',
            data: loyaltyData,
            borderColor: '#10b981',
            borderWidth: 1.5,
            borderDash: [4, 3],
            pointRadius: 3,
            tension: 0.3,
            fill: false,
            yAxisID: 'y2',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { font: { family: 'Inter', size: 11 }, boxWidth: 12 } },
          tooltip: {
            callbacks: {
              label: (ctx) => ctx.datasetIndex === 0
                ? ` bCHS: ${ctx.raw}`
                : ` Лояльность: ${ctx.raw}%`,
            },
          },
        },
        scales: {
          y:  { position: 'left',  min: -81, max: 81,
                grid: { color: 'rgba(0,0,0,0.04)' },
                ticks: { font: { family: 'Inter', size: 10 } } },
          y2: { position: 'right', min: 0,   max: 100,
                grid: { drawOnChartArea: false },
                ticks: { font: { family: 'Inter', size: 10 }, callback: v => v + '%' } },
          x:  { ticks: { font: { family: 'Inter', size: 10 } }, grid: { display: false } },
        },
      },
    });
  },

  /* ── Привязка глобальных событий страницы ────────────────── */
  bindDetailEvents() {
    document.getElementById('btn-back-dash')?.addEventListener('click', () => {
      App.navigate('dashboard');
    });

    document.getElementById('btn-add-data')?.addEventListener('click', () => {
      App.navigate('entry', this.client.id);
    });

    document.getElementById('btn-edit-client')?.addEventListener('click', () => {
      App.navigate('clients', this.client.id);
    });

    // Переключение табов
    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Уничтожаем старый chart перед сменой таба
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
        this._renderActiveTab();
      });
    });

    // Кнопки редактирования периода (делегирование — могут быть в любом табе)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="edit-month"]');
      if (!btn) return;
      const month = parseInt(btn.dataset.month);
      const year  = parseInt(btn.dataset.year);
      App.navigateEntryMonthYear(this.client.id, month, year);
    });
  },

  /* Навигация по странице клиента из внешнего кода */
  navigate(tab) {
    this.activeTab = tab;
    const btn = document.querySelector(`.detail-tab-btn[data-tab="${tab}"]`);
    if (btn) {
      document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this._renderActiveTab();
    }
  },
};
