/* ============================================================
   js/role_radar.js — Radar chart component (ES Module)
   Portfolio BCHS v7.0
   ============================================================ */

import { PC_CRITERIA } from './constants.js';

/* ══════════════════════════════════════════════════════════════
   КОНФИГУРАЦИЯ ОСЕЙ
   ══════════════════════════════════════════════════════════════ */

export const RADAR_AXES = [
  { key: 'role_account_manager', label: 'Account\nManager',  short: 'AM'       },
  { key: 'role_coordinator',     label: 'Coordinator\n/ DC', short: 'DC'       },
  { key: 'role_sales',           label: 'Sales',             short: 'Sales'    },
  { key: 'role_delivery',        label: 'Delivery\n/ PM',    short: 'Delivery' },
  { key: 'role_csm',             label: 'CSM',               short: 'CSM'      },
];

export const RADAR_MAX   = 5;
export const RADAR_RINGS = 5;

const RADAR_HINTS = {
  0: 'Не вовлечён',
  1: 'Минимальное участие',
  2: 'Минимальное участие',
  3: 'Активное участие',
  4: 'Активное участие',
  5: 'Ключевая роль',
};

/* ══════════════════════════════════════════════════════════════
   РАСЧЁТНЫЕ УТИЛИТЫ
   ══════════════════════════════════════════════════════════════ */

export function radarValuesFromEntry(entry) {
  if (!entry) return RADAR_AXES.map(() => 0);
  return RADAR_AXES.map(ax => Math.min(RADAR_MAX, Math.max(0, Number(entry[ax.key]) || 0)));
}

export function radarCoverage(values) {
  const sum = values.reduce((s, v) => s + v, 0);
  return { sum, pct: Math.round(sum / (RADAR_AXES.length * RADAR_MAX) * 100) };
}

export function radarPoint(cx, cy, r, angle) {
  return {
    x: cx + r * Math.sin(angle),
    y: cy - r * Math.cos(angle),
  };
}

/* ══════════════════════════════════════════════════════════════
   SVG BUILDER
   ══════════════════════════════════════════════════════════════ */

export function buildRadarSVG(values, size = 280) {
  const N    = RADAR_AXES.length;
  const cx   = size / 2;
  const cy   = size / 2;
  const R    = size * 0.36;
  const RL   = size * 0.44;
  const step = (2 * Math.PI) / N;

  /* Кольца */
  const rings = [];
  for (let ring = 1; ring <= RADAR_RINGS; ring++) {
    const r   = (ring / RADAR_RINGS) * R;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const p = radarPoint(cx, cy, r, i * step);
      pts.push(`${p.x},${p.y}`);
    }
    rings.push(`<polygon points="${pts.join(' ')}" class="radar-ring"/>`);
  }

  /* Оси */
  const spokes = [];
  for (let i = 0; i < N; i++) {
    const p = radarPoint(cx, cy, R, i * step);
    spokes.push(`<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" class="radar-spoke"/>`);
  }

  /* Полигон данных */
  const dataPts = values.map((v, i) => {
    const r = (v / RADAR_MAX) * R;
    const p = radarPoint(cx, cy, r, i * step);
    return `${p.x},${p.y}`;
  });
  const dataPolygon = `<polygon points="${dataPts.join(' ')}" class="radar-poly"/>`;

  /* Точки */
  const dots = values.map((v, i) => {
    const r     = (v / RADAR_MAX) * R;
    const p     = radarPoint(cx, cy, r, i * step);
    const hint  = RADAR_HINTS[v] || '';
    const label = RADAR_AXES[i].label.replace('\n', ' ');
    return `<circle
      cx="${p.x}" cy="${p.y}" r="5"
      class="radar-dot"
      data-label="${label}"
      data-value="${v}"
      data-hint="${hint}"
      tabindex="0"
      role="button"
      aria-label="${label}: ${v} из ${RADAR_MAX} — ${hint}"/>`;
  }).join('');

  const center = `<circle cx="${cx}" cy="${cy}" r="3" class="radar-center"/>`;

  /* Метки осей */
  const labels = RADAR_AXES.map((ax, i) => {
    const p      = radarPoint(cx, cy, RL, i * step);
    const lines  = ax.label.split('\n');
    const dx     = p.x - cx;
    const anchor = Math.abs(dx) < R * 0.15 ? 'middle' : dx > 0 ? 'start' : 'end';
    const dyBase = lines.length > 1 ? -6 : 0;
    const tspans = lines.map((line, li) =>
      `<tspan x="${p.x}" dy="${li === 0 ? dyBase : 14}">${line}</tspan>`
    ).join('');
    return `<text class="radar-label" text-anchor="${anchor}">${tspans}</text>`;
  }).join('');

  /* Tick-метки */
  const ticks = [1, 2, 3, 4, 5].map(v => {
    const r = (v / RADAR_MAX) * R;
    const p = radarPoint(cx, cy, r, 0);
    return `<text x="${p.x + 5}" y="${p.y + 4}" class="radar-tick">${v}</text>`;
  }).join('');

  return `
    <svg viewBox="0 0 ${size} ${size}" class="radar-svg" width="${size}" height="${size}"
         aria-label="Радар покрытия ролями">
      ${rings.join('')}
      ${spokes.join('')}
      ${dataPolygon}
      ${labels}
      ${ticks}
      ${dots}
      ${center}
    </svg>`;
}

/* ══════════════════════════════════════════════════════════════
   ПУБЛИЧНЫЙ КОМПОНЕНТ
   ══════════════════════════════════════════════════════════════ */

export const RoleRadar = {

  _clientId:  null,
  _pcEntryId: null,
  _values:    [0, 0, 0, 0, 0],
  _pcMonth:   null,
  _pcYear:    null,

  init(clientId, curPCEntry) {
    this._clientId  = clientId;
    this._pcEntryId = curPCEntry?.id    || null;
    this._pcMonth   = curPCEntry?.month || null;
    this._pcYear    = curPCEntry?.year  || null;
    this._values    = radarValuesFromEntry(curPCEntry);
  },

  render(clientId, curPCEntry) {
    this.init(clientId, curPCEntry);
    return this._buildHTML();
  },

  _buildHTML() {
    const svg              = buildRadarSVG(this._values);
    const { sum, pct }     = radarCoverage(this._values);
    const coverageColor    = pct >= 80 ? 'var(--green)'
                           : pct >= 50 ? 'var(--yellow)'
                           : 'var(--red)';
    const warning = sum < 10
      ? `<div class="radar-warning">⚠️ Низкое покрытие ролями — риск для аккаунта</div>`
      : '';

    const valRow = RADAR_AXES.map((ax, i) => `
      <span class="radar-val-item" title="${RADAR_HINTS[this._values[i]]}">
        <span class="radar-val-label">${ax.short}</span>
        <span class="radar-val-num" style="color:${
          this._values[i] >= 4 ? 'var(--green)'
        : this._values[i] >= 2 ? 'var(--text-primary)'
        : 'var(--text-muted)'}">
          ${this._values[i]}
        </span>
      </span>`).join('');

    return `
      <div class="radar-block" id="radar-block">
        <div class="radar-header">
          <div class="radar-title">🎯 Покрытие ролями</div>
          <button class="btn btn-ghost btn-xs" id="radar-edit-btn"
                  title="Изменить значения ролей">✏️ Изменить</button>
        </div>
        <div class="radar-canvas-wrap" id="radar-canvas-wrap">
          ${svg}
          <div class="radar-tooltip" id="radar-tooltip" role="tooltip"></div>
        </div>
        <div class="radar-vals">${valRow}</div>
        <div class="radar-coverage">
          <span class="radar-cov-label">Покрытие:</span>
          <span class="radar-cov-pct" style="color:${coverageColor}">${pct}%</span>
        </div>
        ${warning}
      </div>`;
  },

  bindEvents() {
    this._bindTooltips();
    document.getElementById('radar-edit-btn')
      ?.addEventListener('click', () => this._openModal());
  },

  _bindTooltips() {
    const tooltip = document.getElementById('radar-tooltip');
    if (!tooltip) return;
    document.querySelectorAll('.radar-dot').forEach(dot => {
      const show = () => {
        tooltip.innerHTML = `
          <div class="radar-tt-label">${dot.dataset.label}</div>
          <div class="radar-tt-val">${dot.dataset.value} / ${RADAR_MAX}</div>
          <div class="radar-tt-hint">${dot.dataset.hint}</div>`;
        tooltip.style.display = 'block';
        const wrap = document.getElementById('radar-canvas-wrap');
        if (wrap) {
          const wr   = wrap.getBoundingClientRect();
          const dr   = dot.getBoundingClientRect();
          tooltip.style.left = `${dr.left - wr.left + dr.width / 2}px`;
          tooltip.style.top  = `${dr.top  - wr.top  - 8}px`;
        }
      };
      const hide = () => { tooltip.style.display = 'none'; };
      dot.addEventListener('mouseenter', show);
      dot.addEventListener('focus',      show);
      dot.addEventListener('mouseleave', hide);
      dot.addEventListener('blur',       hide);
      dot.addEventListener('click',      show);
    });
  },

  _openModal() {
    /* импортируем App через динамический доступ, чтобы не было
       циклической зависимости role_radar ↔ app                  */
    const { App } = window;

    const sliders = RADAR_AXES.map((ax, i) => {
      const val  = this._values[i];
      return `
        <div class="radar-slider-group">
          <div class="radar-slider-header">
            <label class="radar-slider-label" for="rslider-${i}">
              ${ax.label.replace('\n', ' / ')}
            </label>
            <span class="radar-slider-cur" id="rslider-cur-${i}">${val}</span>
          </div>
          <input type="range" id="rslider-${i}" class="radar-slider"
                 min="0" max="5" step="1" value="${val}" data-idx="${i}"
                 aria-label="${ax.label.replace('\n', ' ')} — значение ${val} из 5"/>
          <div class="radar-slider-hint" id="rslider-hint-${i}">
            ${RADAR_HINTS[val] || ''}
          </div>
        </div>`;
    }).join('');

    App.openModal(`
      <div class="radar-modal-wrap">
        <h2 class="modal-title">🎯 Покрытие ролями</h2>
        <p class="radar-modal-sub">
          Укажите уровень вовлечённости каждой роли в аккаунт
        </p>
        <div class="radar-sliders">${sliders}</div>
        <div class="radar-modal-preview" id="radar-modal-preview">
          ${buildRadarSVG([...this._values], 220)}
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" onclick="window.App.closeModal()">Отмена</button>
          <button class="btn btn-primary" id="radar-save-btn">💾 Сохранить</button>
        </div>
      </div>`);

    this._bindModalEvents();
  },

  _bindModalEvents() {
    document.querySelectorAll('.radar-slider').forEach(slider => {
      const idx = parseInt(slider.dataset.idx);
      const upd = () => {
        const v   = parseInt(slider.value);
        const cur = document.getElementById(`rslider-cur-${idx}`);
        const ht  = document.getElementById(`rslider-hint-${idx}`);
        if (cur) cur.textContent = v;
        if (ht)  ht.textContent  = RADAR_HINTS[v] || '';
        const tmpVals = RADAR_AXES.map((_, i) => {
          const s = document.getElementById(`rslider-${i}`);
          return s ? parseInt(s.value) : this._values[i];
        });
        const preview = document.getElementById('radar-modal-preview');
        if (preview) preview.innerHTML = buildRadarSVG(tmpVals, 220);
      };
      slider.addEventListener('input',  upd);
      slider.addEventListener('change', upd);
    });

    document.getElementById('radar-save-btn')
      ?.addEventListener('click', () => this._save());
  },

  async _save() {
    const { App, API } = window;
    const saveBtn = document.getElementById('radar-save-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳...'; }

    const newValues = RADAR_AXES.map((_, i) => {
      const s = document.getElementById(`rslider-${i}`);
      return s ? Math.min(5, Math.max(0, parseInt(s.value) || 0)) : this._values[i];
    });

    const BASE_URL = 'https://bchs-api.lexsnitko.workers.dev';

    try {
      const rolePayload = {};
      RADAR_AXES.forEach((ax, i) => { rolePayload[ax.key] = newValues[i]; });

      if (this._pcEntryId) {
        await fetch(`${BASE_URL}/tables/pc_entries/${this._pcEntryId}`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(rolePayload),
        });
      } else {
        const now     = new Date();
        const month   = this._pcMonth || (now.getMonth() + 1);
        const year    = this._pcYear  || now.getFullYear();
        const payload = { client_id: this._clientId, month, year, ...rolePayload };
        for (const k of Object.keys(PC_CRITERIA)) {
          if (!(k in payload)) payload[k] = 1;
        }
        const created = await fetch(`${BASE_URL}/tables/pc_entries`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        }).then(r => r.json());
        this._pcEntryId = created?.id || null;
      }

      if (API) API._pcCache = null;
      this._values = newValues;
      App.closeModal();
      App.toast('✅ Покрытие ролями обновлено', 'success');
      this._refreshBlock();
    } catch (e) {
      console.error('[RoleRadar._save]', e);
      App.toast('❌ Ошибка сохранения', 'error');
      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 Сохранить'; }
    }
  },

  _refreshBlock() {
    const block = document.getElementById('radar-block');
    if (!block) return;
    block.outerHTML = this._buildHTML();
    this.bindEvents();
  },
};
