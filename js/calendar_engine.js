/* js/calendar_engine.js
   Движок рабочих календарей для разных локаций.
   Источники данных (приоритет): кастомный → кэш API → fallback хардкод.
   API: https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}
   ---------------------------------------------------------------- */

/* ── Поддерживаемые локации ─────────────────────────────────── */
const SUPPORTED_LOCATIONS = {
  BY: { id:'BY', name:'Беларусь',       flag:'🇧🇾', timezone:'Europe/Minsk',    apiCode:'BY' },
  PL: { id:'PL', name:'Польша',         flag:'🇵🇱', timezone:'Europe/Warsaw',   apiCode:'PL' },
  DE: { id:'DE', name:'Германия / EU',  flag:'🇩🇪', timezone:'Europe/Berlin',   apiCode:'DE' },
  US: { id:'US', name:'США',            flag:'🇺🇸', timezone:'America/New_York',apiCode:'US' },
};

/* ── Константы ──────────────────────────────────────────────── */
const CACHE_KEY   = 'bchs_calendar_cache';
const CUSTOM_KEY  = 'bchs_custom_calendars';
const CACHE_TTL   = 30 * 24 * 60 * 60 * 1000; // 30 дней
const API_TIMEOUT = 5000;                       // 5 сек
const API_BASE    = 'https://date.nager.at/api/v3/PublicHolidays';

const MONTHS_RU_CAL = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];

/* ── FALLBACK хардкод ───────────────────────────────────────── */
const FALLBACK_DATA = {
  BY: {
    '2025-01':{ workdays:23, hours:184, holidays:['2025-01-01','2025-01-07'] },
    '2025-02':{ workdays:20, hours:160, holidays:[] },
    '2025-03':{ workdays:20, hours:160, holidays:['2025-03-08'] },
    '2025-04':{ workdays:22, hours:176, holidays:[] },
    '2025-05':{ workdays:20, hours:160, holidays:['2025-05-01','2025-05-09'] },
    '2025-06':{ workdays:20, hours:160, holidays:[] },
    '2025-07':{ workdays:23, hours:184, holidays:['2025-07-03'] },
    '2025-08':{ workdays:21, hours:168, holidays:[] },
    '2025-09':{ workdays:22, hours:176, holidays:[] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:19, hours:152, holidays:['2025-11-07'] },
    '2025-12':{ workdays:22, hours:176, holidays:['2025-12-25'] },
    '2026-01':{ workdays:20, hours:160, holidays:['2026-01-01','2026-01-07'] },
    '2026-02':{ workdays:20, hours:160, holidays:[] },
    '2026-03':{ workdays:20, hours:160, holidays:['2026-03-08'] },
    '2026-04':{ workdays:22, hours:176, holidays:[] },
    '2026-05':{ workdays:19, hours:152, holidays:['2026-05-01','2026-05-09'] },
    '2026-06':{ workdays:21, hours:168, holidays:[] },
    '2026-07':{ workdays:23, hours:184, holidays:['2026-07-03'] },
    '2026-08':{ workdays:20, hours:160, holidays:[] },
    '2026-09':{ workdays:22, hours:176, holidays:[] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:20, hours:160, holidays:['2026-11-07'] },
    '2026-12':{ workdays:22, hours:176, holidays:['2026-12-25'] },
  },
  PL: {
    '2025-01':{ workdays:23, hours:184, holidays:['2025-01-01','2025-01-06'] },
    '2025-02':{ workdays:20, hours:160, holidays:[] },
    '2025-03':{ workdays:20, hours:160, holidays:[] },
    '2025-04':{ workdays:21, hours:168, holidays:['2025-04-18','2025-04-21'] },
    '2025-05':{ workdays:19, hours:152, holidays:['2025-05-01','2025-05-03'] },
    '2025-06':{ workdays:20, hours:160, holidays:['2025-06-19'] },
    '2025-07':{ workdays:23, hours:184, holidays:[] },
    '2025-08':{ workdays:20, hours:160, holidays:['2025-08-15'] },
    '2025-09':{ workdays:22, hours:176, holidays:[] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:18, hours:144, holidays:['2025-11-01','2025-11-11'] },
    '2025-12':{ workdays:21, hours:168, holidays:['2025-12-25','2025-12-26'] },
    '2026-01':{ workdays:22, hours:176, holidays:['2026-01-01','2026-01-06'] },
    '2026-02':{ workdays:20, hours:160, holidays:[] },
    '2026-03':{ workdays:21, hours:168, holidays:[] },
    '2026-04':{ workdays:21, hours:168, holidays:['2026-04-03','2026-04-06'] },
    '2026-05':{ workdays:18, hours:144, holidays:['2026-05-01','2026-05-03'] },
    '2026-06':{ workdays:21, hours:168, holidays:['2026-06-04'] },
    '2026-07':{ workdays:23, hours:184, holidays:[] },
    '2026-08':{ workdays:20, hours:160, holidays:['2026-08-15'] },
    '2026-09':{ workdays:22, hours:176, holidays:[] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:19, hours:152, holidays:['2026-11-01','2026-11-11'] },
    '2026-12':{ workdays:21, hours:168, holidays:['2026-12-25','2026-12-26'] },
  },
  DE: {
    '2025-01':{ workdays:23, hours:184, holidays:['2025-01-01'] },
    '2025-02':{ workdays:20, hours:160, holidays:[] },
    '2025-03':{ workdays:20, hours:160, holidays:[] },
    '2025-04':{ workdays:21, hours:168, holidays:['2025-04-18','2025-04-21'] },
    '2025-05':{ workdays:20, hours:160, holidays:['2025-05-01'] },
    '2025-06':{ workdays:20, hours:160, holidays:[] },
    '2025-07':{ workdays:23, hours:184, holidays:[] },
    '2025-08':{ workdays:21, hours:168, holidays:[] },
    '2025-09':{ workdays:22, hours:176, holidays:[] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:20, hours:160, holidays:[] },
    '2025-12':{ workdays:21, hours:168, holidays:['2025-12-25','2025-12-26'] },
    '2026-01':{ workdays:22, hours:176, holidays:['2026-01-01'] },
    '2026-02':{ workdays:20, hours:160, holidays:[] },
    '2026-03':{ workdays:21, hours:168, holidays:[] },
    '2026-04':{ workdays:21, hours:168, holidays:['2026-04-03','2026-04-06'] },
    '2026-05':{ workdays:20, hours:160, holidays:['2026-05-01'] },
    '2026-06':{ workdays:21, hours:168, holidays:[] },
    '2026-07':{ workdays:23, hours:184, holidays:[] },
    '2026-08':{ workdays:20, hours:160, holidays:[] },
    '2026-09':{ workdays:22, hours:176, holidays:[] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:20, hours:160, holidays:[] },
    '2026-12':{ workdays:21, hours:168, holidays:['2026-12-25','2026-12-26'] },
  },
  US: {
    '2025-01':{ workdays:22, hours:176, holidays:['2025-01-01','2025-01-20'] },
    '2025-02':{ workdays:19, hours:152, holidays:['2025-02-17'] },
    '2025-03':{ workdays:21, hours:168, holidays:[] },
    '2025-04':{ workdays:22, hours:176, holidays:[] },
    '2025-05':{ workdays:21, hours:168, holidays:['2025-05-26'] },
    '2025-06':{ workdays:20, hours:160, holidays:['2025-06-19'] },
    '2025-07':{ workdays:22, hours:176, holidays:['2025-07-04'] },
    '2025-08':{ workdays:21, hours:168, holidays:[] },
    '2025-09':{ workdays:21, hours:168, holidays:['2025-09-01'] },
    '2025-10':{ workdays:23, hours:184, holidays:[] },
    '2025-11':{ workdays:19, hours:152, holidays:['2025-11-11','2025-11-27'] },
    '2025-12':{ workdays:22, hours:176, holidays:['2025-12-25'] },
    '2026-01':{ workdays:21, hours:168, holidays:['2026-01-01','2026-01-19'] },
    '2026-02':{ workdays:19, hours:152, holidays:['2026-02-16'] },
    '2026-03':{ workdays:21, hours:168, holidays:[] },
    '2026-04':{ workdays:22, hours:176, holidays:[] },
    '2026-05':{ workdays:20, hours:160, holidays:['2026-05-25'] },
    '2026-06':{ workdays:21, hours:168, holidays:['2026-06-19'] },
    '2026-07':{ workdays:22, hours:176, holidays:['2026-07-04'] },
    '2026-08':{ workdays:20, hours:160, holidays:[] },
    '2026-09':{ workdays:21, hours:168, holidays:['2026-09-07'] },
    '2026-10':{ workdays:22, hours:176, holidays:[] },
    '2026-11':{ workdays:19, hours:152, holidays:['2026-11-11','2026-11-26'] },
    '2026-12':{ workdays:22, hours:176, holidays:['2026-12-25'] },
  },
};

/* ── Вспомогательные функции ────────────────────────────────── */

/** Безопасное чтение из localStorage */
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}

/** Безопасная запись в localStorage */
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/** Ключ кэша вида "BY_2026" */
function cacheKey(locationId, year) { return `${locationId}_${year}`; }

/** Форматирует Date в 'YYYY-MM-DD' */
function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/** Считает рабочие дни месяца с учётом праздников */
function calcWorkdays(year, month, holidayDates) {
  const holidaySet = new Set(holidayDates);
  let workdays = 0;
  const daysInMonth = new Date(year, month, 0).getDate(); // month уже 1-based
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dow  = date.getDay(); // 0=вс, 6=сб
    if (dow === 0 || dow === 6) continue;
    const iso = toISO(date);
    if (holidaySet.has(iso)) continue;
    workdays++;
  }
  return workdays;
}

/** Превращает массив праздников от API в monthsData за год */
function parseAPIResponse(apiArray, year) {
  // apiArray: [{ date: "2026-01-01", ... }, ...]
  const byMonth = {};
  for (const item of apiArray) {
    const [y, m] = item.date.split('-');
    if (Number(y) !== year) continue;
    const key = `${y}-${m}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(item.date);
  }
  const months = {};
  for (let m = 1; m <= 12; m++) {
    const key      = `${year}-${String(m).padStart(2,'0')}`;
    const holidays = byMonth[key] || [];
    const wd       = calcWorkdays(year, m, holidays);
    months[key]    = { workdays: wd, hours: wd * 8, holidays };
  }
  return months;
}

/* ── Кэш ────────────────────────────────────────────────────── */

function saveToCache(locationId, year, monthsData) {
  const cache = lsGet(CACHE_KEY) || {};
  cache[cacheKey(locationId, year)] = {
    data:     monthsData,
    cachedAt: Date.now(),
    ttl:      CACHE_TTL,
  };
  lsSet(CACHE_KEY, cache);
}

function getFromCache(locationId, year) {
  const cache = lsGet(CACHE_KEY) || {};
  const entry = cache[cacheKey(locationId, year)];
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > entry.ttl) return null; // TTL истёк
  return entry.data;
}

/** Возвращает метаинформацию кэша (для отображения статуса) */
function getCacheMeta(locationId, year) {
  const cache = lsGet(CACHE_KEY) || {};
  return cache[cacheKey(locationId, year)] || null;
}

/* ── Загрузка с API ─────────────────────────────────────────── */

async function fetchHolidaysFromAPI(locationId, year) {
  const loc = SUPPORTED_LOCATIONS[locationId];
  if (!loc) return null;

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const url = `${API_BASE}/${year}/${loc.apiCode}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const apiArray = await res.json();
    if (!Array.isArray(apiArray)) return null;
    return parseAPIResponse(apiArray, year);
  } catch {
    clearTimeout(timer);
    return null; // сеть недоступна, таймаут, любая ошибка
  }
}

/* ── Публичный объект CalendarEngine ────────────────────────── */

const CalendarEngine = {

  /* ── Инициализация (фоновая, не блокирует UI) ─────────────── */
  async init() {
    const curYear  = new Date().getFullYear();
    const nextYear = curYear + 1;
    const locs     = Object.keys(SUPPORTED_LOCATIONS);

    // Запускаем обновление в фоне — не awaiting
    (async () => {
      for (const locId of locs) {
        for (const year of [curYear, nextYear]) {
          const cached = getFromCache(locId, year);
          if (cached) continue; // актуальный кэш есть — пропускаем
          const data = await fetchHolidaysFromAPI(locId, year);
          if (data) saveToCache(locId, year, data);
        }
      }
    })();
  },

  /* ── Получить данные месяца ─────────────────────────────────
     Приоритет: кастомный → кэш API → fallback
     Возвращает { workdays, hours, holidays, source }          */
  getMonthData(locationId, yearMonth) {
    // 1. Кастомный календарь
    const custom = lsGet(CUSTOM_KEY) || {};
    if (custom[locationId]?.[yearMonth]) {
      return { ...custom[locationId][yearMonth], source: 'custom' };
    }

    // 2. Кэш API
    const year   = Number(yearMonth.split('-')[0]);
    const cached = getFromCache(locationId, year);
    if (cached?.[yearMonth]) {
      return { ...cached[yearMonth], source: 'api' };
    }

    // 3. Fallback хардкод
    const fb = FALLBACK_DATA[locationId]?.[yearMonth];
    if (fb) return { ...fb, source: 'fallback' };

    // 4. Вычисляем на лету если нет ничего
    const [y, m] = yearMonth.split('-').map(Number);
    const wd = calcWorkdays(y, m, []);
    return { workdays: wd, hours: wd * 8, holidays: [], source: 'fallback' };
  },

  /* ── Плановые часы с аллокацией ────────────────────────────── */
  getPlannedHours(locationId, yearMonth, allocation) {
    const data = this.getMonthData(locationId, yearMonth);
    return Math.round(data.hours * (allocation || 1));
  },

  /* ── Дельта план vs факт ────────────────────────────────────── */
  getDelta(plannedHours, actualHours, ratePerHour) {
    const rate       = ratePerHour || 0;
    const delta_h    = actualHours - plannedHours;
    const delta_m    = Math.round(delta_h * rate);
    const efficiency = plannedHours > 0 ? actualHours / plannedHours : 0;
    let status, status_label;
    if (efficiency >= 0.95)      { status = 'ok';       status_label = 'В норме'; }
    else if (efficiency >= 0.80) { status = 'warning';  status_label = 'Внимание'; }
    else                         { status = 'critical'; status_label = 'Критично'; }
    return { delta_hours: delta_h, delta_money: delta_m, efficiency, status, status_label };
  },

  /* ── Список всех локаций (встроенные + кастомные) ────────────── */
  getLocations() {
    const builtin = Object.values(SUPPORTED_LOCATIONS).map(l => ({ ...l, source: 'builtin' }));
    const custom  = lsGet(CUSTOM_KEY) || {};
    const customLocs = Object.values(custom)
      .filter(c => !SUPPORTED_LOCATIONS[c.id])
      .map(c => ({ id: c.id, name: c.name, flag: c.flag || '🌍', source: 'custom' }));
    return [...builtin, ...customLocs];
  },

  /* ── Название месяца на русском ─────────────────────────────── */
  getMonthName(yearMonth) {
    const [year, month] = yearMonth.split('-').map(Number);
    return `${MONTHS_RU_CAL[month - 1]} ${year}`;
  },

  /* ── Текущий yearMonth ──────────────────────────────────────── */
  currentYearMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  },

  /* ── Следующий yearMonth ────────────────────────────────────── */
  nextYearMonth(yearMonth) {
    const [y, m] = yearMonth.split('-').map(Number);
    if (m === 12) return `${y+1}-01`;
    return `${y}-${String(m+1).padStart(2,'0')}`;
  },

  /* ── Принудительно обновить кэш ─────────────────────────────── */
  async refreshCache(locationId, year) {
    const data = await fetchHolidaysFromAPI(locationId, year);
    if (data) {
      saveToCache(locationId, year, data);
      return { success: true, source: 'api' };
    }
    return { success: false, source: 'fallback' };
  },

  /* ── Статус кэша для локации и года ─────────────────────────── */
  getCacheStatus(locationId, year) {
    const meta = getCacheMeta(locationId, year);
    if (!meta) return 'fallback';
    const age = Date.now() - meta.cachedAt;
    if (age < CACHE_TTL - 7 * 24 * 60 * 60 * 1000) return 'api';  // свежий
    if (age < CACHE_TTL)                             return 'stale'; // скоро устареет
    return 'fallback';
  },

  /* ── Импорт кастомного календаря из JSON ─────────────────────── */
  importFromJSON(jsonString) {
    let parsed;
    try { parsed = JSON.parse(jsonString); } catch { return { success: false, error: 'Невалидный JSON' }; }

    if (!parsed.id)      return { success: false, error: 'Отсутствует поле id' };
    if (!parsed.name)    return { success: false, error: 'Отсутствует поле name' };
    if (!parsed.months || typeof parsed.months !== 'object')
      return { success: false, error: 'Отсутствует поле months' };

    // Проверяем хотя бы одну запись months
    const keys = Object.keys(parsed.months);
    if (!keys.length) return { success: false, error: 'months пустой' };

    const custom = lsGet(CUSTOM_KEY) || {};
    custom[parsed.id] = {
      id:     parsed.id,
      name:   parsed.name,
      flag:   parsed.flag || '🌍',
      months: parsed.months,
    };
    lsSet(CUSTOM_KEY, custom);

    return { success: true, monthsCount: keys.length };
  },

  /* ── Удалить кастомную локацию ──────────────────────────────── */
  removeCustomLocation(locationId) {
    if (SUPPORTED_LOCATIONS[locationId]) return; // встроенные нельзя удалять
    const custom = lsGet(CUSTOM_KEY) || {};
    delete custom[locationId];
    lsSet(CUSTOM_KEY, custom);
  },

  /* ── Скачать данные локации как JSON ────────────────────────── */
  exportLocationJSON(locationId) {
    const loc    = this.getLocations().find(l => l.id === locationId);
    const custom = lsGet(CUSTOM_KEY) || {};
    const curYear  = new Date().getFullYear();
    const nextYear = curYear + 1;

    let months = {};
    // Собираем данные из всех источников
    for (let m = 1; m <= 12; m++) {
      const ym = `${curYear}-${String(m).padStart(2,'0')}`;
      months[ym] = this.getMonthData(locationId, ym);
    }
    for (let m = 1; m <= 12; m++) {
      const ym = `${nextYear}-${String(m).padStart(2,'0')}`;
      months[ym] = this.getMonthData(locationId, ym);
    }
    // Убираем поле source из экспорта
    Object.values(months).forEach(d => delete d.source);

    const payload = {
      id: locationId, name: loc?.name || locationId,
      flag: loc?.flag || '🌍', months,
      exportedAt: new Date().toISOString(),
    };
    this._downloadJSON(payload, `calendar_${locationId}_${curYear}-${nextYear}.json`);
  },

  /* ── Скачать шаблон ─────────────────────────────────────────── */
  exportTemplate() {
    const template = {
      id:   'XX',
      name: 'Название страны',
      flag: '🌍',
      months: {
        '2026-01': { workdays: 21, hours: 168, holidays: ['2026-01-01'] },
        '2026-02': { workdays: 20, hours: 160, holidays: [] },
        '2026-03': { workdays: 21, hours: 168, holidays: [] },
      },
      _instructions: {
        id:       'Уникальный код локации, например "KZ"',
        name:     'Название страны/региона',
        flag:     'Эмодзи флага (опционально)',
        workdays: 'Количество рабочих дней в месяце',
        hours:    'Рабочие часы = workdays * 8',
        holidays: 'Массив дат праздников в формате YYYY-MM-DD',
      },
    };
    this._downloadJSON(template, 'calendar_template.json');
  },

  /* ── Внутренний хелпер: скачать JSON ───────────────────────── */
  _downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  },
};

/* ── Экспорт ─────────────────────────────────────────────────── */
window.CalendarEngine      = CalendarEngine;
window.SUPPORTED_LOCATIONS = SUPPORTED_LOCATIONS;
window.FALLBACK_DATA       = FALLBACK_DATA;
