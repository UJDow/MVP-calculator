/* ============================================
   js/pages/calendars.js — Calendars Page (ES Module)
   Portfolio BCHS v7.0
   4 секции: статус / карточки / мои календари / таблица сравнения
   ============================================ */

import { CalendarEngine, SUPPORTED_LOCATIONS } from '../calendar_engine.js';

/* ══════════════════════════════════════════════════════════════
   CALENDARS PAGE
   ══════════════════════════════════════════════════════════════ */

export const CalendarsPage = {

  /* ─── HELPERS ─────────────────────────────────────────────── */

  _fmtCacheDate(locationId, year) {
    try {
      const cache = JSON.parse(
        localStorage.getItem('bchs_calendar_cache') || 'null'
      ) || {};
      const entry = cache[`${locationId}_${year}`];
      if (!entry) return null;
      return new Date(entry.cachedAt).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
    } catch { return null; }
  },

  _statusLabel(status) {
    return {
      api:      'API',
      stale:    'Устаревает',
      fallback: 'Встроенные',
    }[status] || 'Неизвестно';
  },

  _statusIcon(status) {
    return { api: '🟢', stale: '🟡', fallback: '🔴' }[status] || '⚪';
  },

  _getMonths(count = 6) {
    const months = [];
    let cur = CalendarEngine.currentYearMonth();
    for (let i = 0; i < count; i++) {
      months.push(cur);
      cur = CalendarEngine.nextYearMonth(cur);
    }
    return months;
  },

  /* ─── SECTION 1: DATA STATUS ──────────────────────────────── */
  _renderStatusSection() {
    const year = new Date().getFullYear();
    const locs = Object.keys(SUPPORTED_LOCATIONS);

    const badges = locs.map(locId => {
      const loc     = SUPPORTED_LOCATIONS[locId];
      const status  = CalendarEngine.getCacheStatus(locId, year);
      const label   = this._statusLabel(status);
      const icon    = this._statusIcon(status);
      const date    = this._fmtCacheDate(locId, year);
      const dateTip = date ? `Обновлено: ${date}` : 'Данные встроены';
      return `
        <div class="cal-status-badge cal-status-${status}"
             title="${dateTip}">
          <span class="cal-status-icon">${icon}</span>
          <span class="cal-status-flag">${loc.flag}</span>
          <span class="cal-status-name">${loc.id}</span>
          <span class="cal-status-label">${label}</span>
        </div>`;
    }).join('');

    const hasStale    = locs.some(l =>
      CalendarEngine.getCacheStatus(l, year) === 'stale'
    );
    const hasFallback = locs.some(l =>
      CalendarEngine.getCacheStatus(l, year) === 'fallback'
    );
    const tip = hasFallback
      ? 'Часть данных — встроенные. Подключитесь к интернету для обновления.'
      : hasStale
        ? 'Часть данных скоро устареет. Обновление произойдёт автоматически.'
        : 'Все данные актуальны из API.';

    return `
      <section class="cal-section cal-status-section">
        <div class="cal-section-header">
          <h3 class="cal-section-title">Источники данных</h3>
          <button class="btn btn-sm btn-ghost" id="cal-refresh-btn"
                  title="Обновить кэш из API">↺ Обновить</button>
        </div>
        <div class="cal-status-row">${badges}</div>
        <p class="cal-status-tip">${tip}</p>
      </section>`;
  },

  /* ─── SECTION 2: LOCATION CARDS ──────────────────────────── */
  _renderLocationCards() {
    const curYM  = CalendarEngine.currentYearMonth();
    const nextYM = CalendarEngine.nextYearMonth(curYM);
    const locs   = Object.values(SUPPORTED_LOCATIONS);

    const cards = locs.map(loc => {
      const cur      = CalendarEngine.getMonthData(loc.id, curYM);
      const next     = CalendarEngine.getMonthData(loc.id, nextYM);
      const curName  = CalendarEngine.getMonthName(curYM);
      const nextName = CalendarEngine.getMonthName(nextYM);

      const srcBadge = `
        <span class="cal-src-badge cal-src-${cur.source}">
          ${this._statusLabel(cur.source)}
        </span>`;

      const holidayList = cur.holidays.length
        ? cur.holidays.map(h => {
            const d = new Date(h + 'T00:00:00');
            return `<span class="cal-holiday-chip">
              ${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
            </span>`;
          }).join('')
        : `<span class="cal-no-holidays">нет праздников</span>`;

      return `
        <article class="cal-card" data-loc="${loc.id}">
          <header class="cal-card-header">
            <span class="cal-card-flag">${loc.flag}</span>
            <div class="cal-card-title-group">
              <h4 class="cal-card-name">${loc.name}</h4>
              <span class="cal-card-tz">${loc.timezone}</span>
            </div>
            ${srcBadge}
          </header>

          <div class="cal-card-months">
            <div class="cal-month-block cal-month-current">
              <div class="cal-month-label">${curName}</div>
              <div class="cal-month-stats">
                <div class="cal-stat">
                  <span class="cal-stat-val">${cur.workdays}</span>
                  <span class="cal-stat-name">дней</span>
                </div>
                <div class="cal-stat">
                  <span class="cal-stat-val">${cur.hours}</span>
                  <span class="cal-stat-name">часов</span>
                </div>
              </div>
              <div class="cal-holidays-row">${holidayList}</div>
            </div>

            <div class="cal-month-divider"></div>

            <div class="cal-month-block cal-month-next">
              <div class="cal-month-label">${nextName}</div>
              <div class="cal-month-stats">
                <div class="cal-stat">
                  <span class="cal-stat-val">${next.workdays}</span>
                  <span class="cal-stat-name">дней</span>
                </div>
                <div class="cal-stat">
                  <span class="cal-stat-val">${next.hours}</span>
                  <span class="cal-stat-name">часов</span>
                </div>
              </div>
            </div>
          </div>

          <footer class="cal-card-footer">
            <button class="btn btn-ghost btn-xs cal-export-btn"
                    data-loc="${loc.id}"
                    title="Скачать JSON">↓ Экспорт</button>
            <button class="btn btn-ghost btn-xs cal-refresh-loc-btn"
                    data-loc="${loc.id}"
                    title="Обновить регион из API">↺ Обновить</button>
          </footer>
        </article>`;
    }).join('');

    return `
      <section class="cal-section">
        <div class="cal-section-header">
          <h3 class="cal-section-title">Локации</h3>
        </div>
        <div class="cal-cards-grid">${cards}</div>
      </section>`;
  },

  /* ─── SECTION 3: MY CALENDARS ─────────────────────────────── */
  _renderMyCalendars() {
    const locs = CalendarEngine.getLocations().filter(l => l.source === 'custom');

    const emptyState = locs.length === 0
      ? `<div class="cal-custom-empty">
           <span class="cal-custom-empty-icon">🌍</span>
           <p>Нет кастомных календарей</p>
           <p class="text-muted">Загрузите JSON с данными о рабочих днях</p>
         </div>`
      : '';

    const customCards = locs.map(loc => {
      const cur = CalendarEngine.getMonthData(loc.id, CalendarEngine.currentYearMonth());
      return `
        <div class="cal-custom-card">
          <span class="cal-card-flag">${loc.flag}</span>
          <div class="cal-custom-card-info">
            <strong>${loc.name}</strong>
            <span class="text-muted">${loc.id}</span>
          </div>
          <div class="cal-custom-card-stats">
            <span>${cur.workdays} дн.</span>
            <span>${cur.hours} ч.</span>
          </div>
          <div class="cal-custom-card-actions">
            <button class="btn btn-ghost btn-xs cal-export-btn"
                    data-loc="${loc.id}" title="Скачать JSON">↓</button>
            <button class="btn btn-danger btn-xs cal-remove-custom-btn"
                    data-loc="${loc.id}" title="Удалить">✕</button>
          </div>
        </div>`;
    }).join('');

    return `
      <section class="cal-section">
        <div class="cal-section-header">
          <h3 class="cal-section-title">Мои календари</h3>
          <button class="btn btn-primary btn-sm" id="cal-import-btn">
            + Импорт JSON
          </button>
        </div>
        ${emptyState}
        <div class="cal-custom-list">${customCards}</div>
      </section>`;
  },

  /* ─── SECTION 4: COMPARISON TABLE ────────────────────────── */
  _renderComparisonTable() {
    const months = this._getMonths(6);
    const locs   = Object.values(SUPPORTED_LOCATIONS);

    const allWorkdays = [];
    const data        = {};

    for (const loc of locs) {
      data[loc.id] = {};
      for (const ym of months) {
        const d = CalendarEngine.getMonthData(loc.id, ym);
        data[loc.id][ym] = d;
        allWorkdays.push(d.workdays);
      }
    }

    const minWd = Math.min(...allWorkdays);
    const maxWd = Math.max(...allWorkdays);

    const monthHeaders = months.map(ym =>
      `<th class="cmp-th-month">${CalendarEngine.getMonthName(ym)}</th>`
    ).join('');

    const rows = locs.map(loc => {
      const cells = months.map(ym => {
        const d   = data[loc.id][ym];
        const wd  = d.workdays;
        let cls   = '';
        if (wd === minWd) cls = 'cmp-min';
        if (wd === maxWd) cls = 'cmp-max';
        const srcDot = `
          <span class="cmp-src-dot cmp-src-${d.source}"
                title="${this._statusLabel(d.source)}"></span>`;
        return `
          <td class="cmp-td ${cls}">
            <span class="cmp-wd">${wd}</span>
            <span class="cmp-h">${d.hours}ч</span>
            ${srcDot}
          </td>`;
      }).join('');

      return `
        <tr class="cmp-row">
          <td class="cmp-td-loc">
            <span class="cal-card-flag">${loc.flag}</span>
            <span class="cmp-loc-name">${loc.name}</span>
          </td>
          ${cells}
        </tr>`;
    }).join('');

    return `
      <section class="cal-section">
        <div class="cal-section-header">
          <h3 class="cal-section-title">Сравнение по месяцам</h3>
          <div class="cmp-legend">
            <span class="cmp-legend-item cmp-max">▲ максимум</span>
            <span class="cmp-legend-item cmp-min">▼ минимум</span>
          </div>
        </div>
        <div class="cal-table-scroll">
          <table class="cal-comparison-table">
            <thead>
              <tr>
                <th class="cmp-th-loc">Локация</th>
                ${monthHeaders}
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <p class="cal-table-note">
          * Числа = рабочие дни.
          <span class="cmp-src-dot cmp-src-api"></span> API&nbsp;
          <span class="cmp-src-dot cmp-src-stale"></span> Устаревает&nbsp;
          <span class="cmp-src-dot cmp-src-fallback"></span> Встроенные
        </p>
      </section>`;
  },

  /* ─── IMPORT MODAL ────────────────────────────────────────── */
  _openImportModal() {
    window.App.openModal(`
      <div class="cal-import-modal">
        <h2 class="modal-title">Импорт календаря</h2>
        <p class="text-muted" style="margin-bottom:16px">
          Загрузите JSON-файл с рабочими календарями для вашей локации
        </p>

        <!-- Табы -->
        <div class="cal-import-tabs">
          <button class="cal-import-tab active" data-tab="file">📁 Файл</button>
          <button class="cal-import-tab"         data-tab="template">📋 Шаблон</button>
        </div>

        <!-- Таб: файл -->
        <div class="cal-import-tab-panel" data-panel="file">
          <div class="cal-dropzone" id="cal-dropzone">
            <div class="cal-dropzone-icon">📂</div>
            <div class="cal-dropzone-text">
              Перетащите JSON-файл или
              <label class="cal-dropzone-link" for="cal-file-input">
                выберите файл
              </label>
            </div>
            <input type="file" id="cal-file-input"
                   accept=".json" style="display:none" />
          </div>
          <div id="cal-import-preview" class="cal-import-preview hidden"></div>
          <div id="cal-import-status"  class="cal-import-status"></div>
          <div class="modal-actions" style="margin-top:16px">
            <button class="btn btn-primary" id="cal-import-confirm-btn" disabled>
              ✓ Импортировать
            </button>
            <button class="btn btn-ghost"
                    onclick="window.App.closeModal()">Отмена</button>
          </div>
        </div>

        <!-- Таб: шаблон -->
        <div class="cal-import-tab-panel hidden" data-panel="template">
          <p>Скачайте шаблон и заполните данными для вашей страны/региона.</p>
          <div class="cal-template-schema">
            <pre class="cal-code-block">{
  "id": "KZ",
  "name": "Казахстан",
  "flag": "🇰🇿",
  "months": {
    "2026-01": { "workdays": 21, "hours": 168, "holidays": ["2026-01-01", "2026-01-02"] },
    "2026-02": { "workdays": 20, "hours": 160, "holidays": [] }
  }
}</pre>
          </div>
          <div class="cal-template-fields">
            <div class="cal-field-row">
              <span class="cal-field-name">id</span>
              <span class="cal-field-desc">
                Уникальный код локации (2–5 символов, например «KZ», «RU-MSK»)
              </span>
            </div>
            <div class="cal-field-row">
              <span class="cal-field-name">name</span>
              <span class="cal-field-desc">Полное название страны/региона</span>
            </div>
            <div class="cal-field-row">
              <span class="cal-field-name">flag</span>
              <span class="cal-field-desc">Эмодзи-флаг (опционально)</span>
            </div>
            <div class="cal-field-row">
              <span class="cal-field-name">months</span>
              <span class="cal-field-desc">
                Объект: ключи «YYYY-MM», значения workdays / hours / holidays[]
              </span>
            </div>
          </div>
          <div class="modal-actions" style="margin-top:16px">
            <button class="btn btn-primary" id="cal-template-download-btn">
              ↓ Скачать шаблон
            </button>
            <button class="btn btn-ghost"
                    onclick="window.App.closeModal()">Закрыть</button>
          </div>
        </div>
      </div>`);

    this._bindImportModal();
  },

  _bindImportModal() {
    let parsedData = null;

    /* Переключение табов */
    document.querySelectorAll('.cal-import-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cal-import-tab')
          .forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cal-import-tab-panel')
          .forEach(p => p.classList.add('hidden'));
        tab.classList.add('active');
        document.querySelector(
          `.cal-import-tab-panel[data-panel="${tab.dataset.tab}"]`
        ).classList.remove('hidden');
      });
    });

    /* Скачать шаблон */
    document.getElementById('cal-template-download-btn')
      ?.addEventListener('click', () => CalendarEngine.exportTemplate());

    /* Dropzone */
    const dropzone  = document.getElementById('cal-dropzone');
    const fileInput = document.getElementById('cal-file-input');

    dropzone?.addEventListener('click', () => fileInput?.click());

    dropzone?.addEventListener('dragover', e => {
      e.preventDefault();
      dropzone.classList.add('cal-dropzone-active');
    });
    dropzone?.addEventListener('dragleave', () => {
      dropzone.classList.remove('cal-dropzone-active');
    });
    dropzone?.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('cal-dropzone-active');
      const file = e.dataTransfer.files[0];
      if (file) this._readImportFile(file, result => { parsedData = result; });
    });

    fileInput?.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) this._readImportFile(file, result => { parsedData = result; });
    });

    /* Подтвердить импорт */
    document.getElementById('cal-import-confirm-btn')
      ?.addEventListener('click', async () => {
        if (!parsedData) return;
        const btn = document.getElementById('cal-import-confirm-btn');
        btn.disabled    = true;
        btn.textContent = '⏳ Импортирую...';

        const result = CalendarEngine.importFromJSON(JSON.stringify(parsedData));
        if (result.success) {
          window.App.closeModal();
          window.App.toast(
            `Импортировано: ${parsedData.name} (${result.monthsCount} месяцев)`,
            'success'
          );
          await this.render();
        } else {
          btn.disabled    = false;
          btn.textContent = '✓ Импортировать';
          document.getElementById('cal-import-status').innerHTML =
            `<div class="cal-validation-error">❌ ${result.error}</div>`;
        }
      });
  },

  /* ─── FILE READER + PREVIEW ───────────────────────────────── */
  _readImportFile(file, onSuccess) {
    const reader     = new FileReader();
    const statusEl   = document.getElementById('cal-import-status');
    const previewEl  = document.getElementById('cal-import-preview');
    const confirmBtn = document.getElementById('cal-import-confirm-btn');

    reader.onload = e => {
      let parsed;
      try {
        parsed = JSON.parse(e.target.result);
      } catch {
        statusEl.innerHTML = '<div class="cal-validation-error">❌ Невалидный JSON</div>';
        previewEl.classList.add('hidden');
        if (confirmBtn) confirmBtn.disabled = true;
        return;
      }

      const errors = [];
      if (!parsed.id)   errors.push('Отсутствует поле id');
      if (!parsed.name) errors.push('Отсутствует поле name');
      if (!parsed.months || typeof parsed.months !== 'object')
        errors.push('Отсутствует или неверное поле months');

      if (errors.length) {
        statusEl.innerHTML =
          `<div class="cal-validation-error">❌ ${errors.join('; ')}</div>`;
        previewEl.classList.add('hidden');
        if (confirmBtn) confirmBtn.disabled = true;
        return;
      }

      const monthKeys   = Object.keys(parsed.months);
      const previewRows = monthKeys.slice(0, 5).map(ym => {
        const d            = parsed.months[ym];
        const holidayCount = Array.isArray(d.holidays) ? d.holidays.length : '?';
        return `<tr>
          <td>${ym}</td>
          <td>${d.workdays ?? '—'}</td>
          <td>${d.hours ?? '—'}</td>
          <td>${holidayCount}</td>
        </tr>`;
      }).join('');

      const more = monthKeys.length > 5
        ? `<tr>
             <td colspan="4" class="cal-preview-more">
               …ещё ${monthKeys.length - 5} месяцев
             </td>
           </tr>`
        : '';

      previewEl.classList.remove('hidden');
      previewEl.innerHTML = `
        <div class="cal-validation-ok">
          ✅ ${parsed.flag || '🌍'} <strong>${parsed.name}</strong>
          (${parsed.id}) — ${monthKeys.length} месяцев
        </div>
        <table class="cal-preview-table">
          <thead>
            <tr>
              <th>Месяц</th>
              <th>Раб. дни</th>
              <th>Часы</th>
              <th>Праздники</th>
            </tr>
          </thead>
          <tbody>${previewRows}${more}</tbody>
        </table>`;

      statusEl.innerHTML = '';
      if (confirmBtn) confirmBtn.disabled = false;
      onSuccess(parsed);
    };

    reader.readAsText(file);
  },

  /* ─── PAGE EVENTS ─────────────────────────────────────────── */
  _bindPageEvents() {
    /* Глобальный refresh */
    document.getElementById('cal-refresh-btn')
      ?.addEventListener('click', async () => {
        const btn  = document.getElementById('cal-refresh-btn');
        btn.disabled    = true;
        btn.textContent = '⏳ Обновление...';

        const year  = new Date().getFullYear();
        const locs  = Object.keys(SUPPORTED_LOCATIONS);
        let updated = 0;

        for (const locId of locs) {
          const res = await CalendarEngine.refreshCache(locId, year);
          if (res.success) updated++;
        }

        window.App.toast(
          `Обновлено: ${updated}/${locs.length} локаций`,
          updated > 0 ? 'success' : ''
        );
        await this.render();
      });

    /* Refresh по локации */
    document.querySelectorAll('.cal-refresh-loc-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const locId     = btn.dataset.loc;
        btn.disabled    = true;
        btn.textContent = '⏳';

        const res = await CalendarEngine.refreshCache(locId, new Date().getFullYear());
        window.App.toast(
          res.success
            ? `${locId}: кэш обновлён`
            : `${locId}: API недоступен, данные не изменились`,
          res.success ? 'success' : ''
        );
        await this.render();
      });
    });

    /* Экспорт JSON */
    document.querySelectorAll('.cal-export-btn').forEach(btn => {
      btn.addEventListener('click', () =>
        CalendarEngine.exportLocationJSON(btn.dataset.loc)
      );
    });

    /* Открыть импорт */
    document.getElementById('cal-import-btn')
      ?.addEventListener('click', () => this._openImportModal());

    /* Удалить кастомный календарь */
    document.querySelectorAll('.cal-remove-custom-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const locId = btn.dataset.loc;
        if (!confirm(`Удалить кастомный календарь «${locId}»?`)) return;
        CalendarEngine.removeCustomLocation(locId);
        window.App.toast(`Календарь ${locId} удалён`, '');
        await this.render();
      });
    });
  },

  /* ─── MAIN RENDER ─────────────────────────────────────────── */
  async render() {
    const main = document.getElementById('main-content');
    if (!main) return;

    if (!CalendarEngine) {
      main.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-title">CalendarEngine не загружен</div>
          <div class="empty-state-text">
            Добавьте &lt;script src="js/calendar_engine.js"&gt; в index.html
          </div>
        </div>`;
      return;
    }

    main.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1 class="page-title">📅 Рабочие календари</h1>
          <p class="page-subtitle">
            Рабочие дни, праздники и часы по локациям
          </p>
        </div>
      </div>
      <div class="cal-page" id="cal-page-root">
        ${this._renderStatusSection()}
        ${this._renderLocationCards()}
        ${this._renderMyCalendars()}
        ${this._renderComparisonTable()}
      </div>`;

    this._bindPageEvents();
  },
};
