# Portfolio BCHS — v7.0

> **Система управления здоровьем клиентского портфеля**  
> Ванильный JS SPA · RESTful Table API · Monte Carlo · 10-шаговый ClientCalc engine  
> **UI:** Material Design 3 · Roboto · минимализм · elevation вместо границ

---

## 🎯 v7.0 — RoleRadar fallback fix

### Проблема
`RoleRadar` в DetailPage показывал нули при возврате на страницу клиента.

### Причина
`Calc.computeClient()` устанавливал `curPCEntry = lp` только если находил pc_entry **с совпадающим месяцем/годом** с bCHS-записью. Если клиент имеет role_* данные в pc_entry за один месяц, а bCHS-запись — за другой, `lp` оставался `null` → `_radarValuesFromEntry(null)` → все нули.

### Фикс (1 строка, `js/bundle.js` ~498)
```javascript
// Fallback для RoleRadar: если pc_entry не совпала по месяцу с bCHS — берём последнюю pc_entry
if (!lp && sortedP.length > 0) lp = sortedP[sortedP.length - 1];
```

Ничего больше не изменено. Логика bCHS, pcScore, coverageLogic — не затронуты.

---

## 🎯 v6.9 — Backup v4 + Import полный аудит (9 таблиц)

### Проблема (было v3 — 7 таблиц)
Бэкап и восстановление не включали `fte_entries` и `my_activities`.  
В импорте не было `status_entries`, `fte_entries`, `my_activities`.  
В `REQUIRED_COLUMNS` отсутствовали новые поля.

### Изменения в `js/bundle.js`

#### `Backup.download()` — v4 (9 таблиц)
| Таблица | Было | Стало |
|---|---|---|
| `clients` | ✅ | ✅ +`coordinator`, `account_manager`, `dach_region` в шаблоне |
| `bchs_entries` | ✅ | ✅ |
| `pc_entries` | ✅ | ✅ +`role_account_manager..role_csm` в шаблоне |
| `status_entries` | ✅ | ✅ (в импорт-select не было — добавлен) |
| `mc_configs` | ✅ | ✅ |
| `account_strategies` | ✅ | ✅ +`mc_snapshot`, `ai_generated` |
| `portfolio_strategies` | ✅ | ✅ +`ai_generated` |
| `fte_entries` | ❌ | ✅ |
| `my_activities` | ❌ | ✅ |

#### Обновлённые константы
- **`REQUIRED_COLUMNS`** — полный audit всех 9 таблиц с актуальными полями
- **`FLOAT_COLS`** — добавлены `role_account_manager`, `role_coordinator`, `role_sales`, `role_delivery`, `role_csm`, `duration_minutes`, `day`
- **`BOOL_COLS`** — добавлены `ai_generated`, `billable`
- **`SEED.run()`** — теперь инициализирует все 9 таблиц (было 5)
- **Файл бэкапа** — `bchs_backup_v4_YYYY-MM-DD.json` (было v3)
- **Прогресс-бар** при восстановлении учитывает все 9 таблиц

#### Шаблоны CSV (кнопка «⬇️ Шаблон»)
| Таблица | Колонки в шаблоне |
|---|---|
| `clients` | 20 user-полей (без вычисляемых) |
| `pc_entries` | 15 полей (было 10, +5 role_*) |
| `status_entries` | 8 полей |
| `fte_entries` | 3 поля (`client_id`, `month`, `members`) |
| `my_activities` | 6 полей |

---

## 🎯 v6.8 — Coverage Map (Покрытие портфеля координаторами и AM)

### Новые поля в схеме `clients` (+3 поля, итого 32)
| Поле | Тип | Описание |
|---|---|---|
| `coordinator` | text | Имя координатора, ответственного за клиента |
| `account_manager` | text | Имя аккаунт-менеджера клиента |
| `dach_region` | text | DACH-регион: DACH1 / DACH2 / DACH3 / DACH4 |

### Изменения в bundle.js — PortfolioPage
- **3-й таб `🗺 Покрытие`** добавлен в `PortfolioPage.render()` рядом с «Стратегия портфеля» и «Стратегия по аккаунтам»
- **`_coverageFilters`** — объект состояния фильтров: `{ region, am, status, search }`
- **`_renderCoverageTab()`** — загружает clients, вызывает `_renderCoverageContent()`
- **`_renderCoverageContent(clients)`** — строит весь HTML таба:
  - Фильтры: Регион / AM / Статус покрытия / Поиск
  - Stat-карточки: Всего / Полностью покрыто % / Без покрытия % / Пересечение ролей
  - Таблица: Клиент / Регион / AM / Координатор / Revenue / Статус / Покрытие
  - Логика покрытия: `full` (есть и AM и координатор) / `partial` (один) / `none` (никого)
- **`_bindCoverageEvents()`** — события: filter-change, reset, export CSV, inline-assign
- **`_updateSuggestions()`** — autocomplete для поля координатора из существующих значений
- **`_saveCoordinator(clientId, name)`** — PATCH `tables/clients/{id}` с `{coordinator}`, hot-update ячейки, инвалидация `API._clientsCache`
- **`_exportCoverageCSV(rows)`** — генерирует CSV с BOM, скачивает файл `coverage_YYYY-MM-DD.csv`

### Изменения в bundle.js — ClientsPage
- Новая секция формы **«🗺️ Покрытие и назначения»**:
  - `#cf-am` — поле `account_manager`
  - `#cf-coord` — поле `coordinator`
  - `#cf-dach` — select `dach_region` (DACH1–DACH4)
- **`_readForm()`** расширен: `account_manager`, `coordinator`, `dach_region`

### Изменения в css/style.css (+~200 строк)
- **`.cov-page`** — flex-контейнер таба
- **`.cov-filters`** / **`.cov-filter-select`** / **`.cov-filter-input`** — строка фильтров
- **`.cov-stats`** / **`.cov-stat-card--green/red/blue`** — 4 stat-карточки
- **`.cov-table`** / **`.cov-table-wrap`** — sticky-thead таблица
- **`.cov-badge--full/partial/none`** — цветные бейджи покрытия
- **`.cov-coord-cell`** / **`.cov-assign-btn`** — ячейка координатора с hover-кнопкой ✎
- **`.cov-inline-dropdown`** / **`.cov-sug-item`** — positioned dropdown с autocomplete
- Полный responsive (768px / 480px breakpoints)

---

## 🎯 v6.7 — Time Tracker (Личный трекер billable часов)

### Новая таблица `my_activities`
| Поле | Тип | Описание |
|---|---|---|
| `id` | text | UUID |
| `client_id` | text | Ссылка на clients |
| `date` | text | YYYY-MM-DD |
| `type` | text | call / meeting / analysis / report / onboarding / support / other |
| `duration_minutes` | number | Длительность в минутах |
| `note` | text | Заметка (≤200 символов) |
| `billable` | bool | Billable / Non-billable |

### Новые файлы
- **`js/pages/tracker.js`** (standalone, 23KB) — читаемая копия TrackerPage:
  - **Секция 1**: форма быстрого ввода (дата, клиент, тип, длительность, заметка, billable)
  - **Секция 2**: "Сегодня" — список с edit/delete, итого в шапке
  - **Секция 3**: "Этот месяц" — таблица клиент/часы/% /топ тип/billable + прогресс-бар
  - **Секция 4**: "Инсайты" — 3 карточки: Billable%, Топ клиент, Топ активность
  - Роль-гард: только `service_delivery`, `csm_analyst`
  - Поддержка URL-параметра `clientId` → prefill клиента в форме

### Изменения в bundle.js
- **`TrackerAPI`** (inline) — CRUD для my_activities + cache TTL=30s, `fmtDuration()`, `fmtHours()`, `sumMinutes()`
- **`TrackerPage`** (inline) — полный рендер, `_refreshToday()`, `_refreshMonth()`, edit/delete без полного ре-рендера
- **`case 'tracker':`** добавлен в `App.navigate()`
- **`applyRoleToNav()`** — расширен: показывает `#nav-tracker-li` и `#bn-tracker` для `service_delivery` / `csm_analyst`
- **`DashboardPage._renderTrackerWidget()`** — виджет `"⏱ Сегодня: 2.5ч | Месяц: 34ч | + Добавить"` в шапку дашборда
- **`DashboardPage._openTrackerQuickModal()`** — быстрый модал добавления активности прямо с дашборда
- **`DetailPage._loadMyTime(clientId)`** — новый метод, загружает кол-во часов за месяц и всего
- **`DetailPage._draw()`** — блок "Моё время" в tab-overview под графиком

### Изменения в index.html
- `#nav-tracker-li` — новый li в sidebar (`style="display:none"`, управляется `applyRoleToNav`)
- `#bn-tracker` — новая кнопка в bottom-nav (аналогично)
- Версия обновлена до v6.7

### Изменения в css/style.css
- **`.trk-page`** — контейнер страницы трекера (max-width 860px)
- **`.trk-header`** / **`.trk-hstat`** — шапка с 3 stat-карточками
- **`.trk-section`** / **`.trk-section-badge`** — секционный контейнер
- **`.trk-quick-form`** / **`.trk-input`** — форма ввода активности
- **`.trk-activity-row`** — grid-строка для списка активностей
- **`.trk-tag--billable`** / **`.trk-tag--nb`** — теги billable
- **`.trk-month-table`** / **`.trk-pct-bar`** — таблица месяца с прогресс-баром
- **`.trk-insights-grid`** / **`.trk-insight-card`** — 3-колоночная сетка инсайтов
- **`.trk-dash-widget`** / **`.trk-dash-inner`** — виджет на дашборде
- **`.trk-my-time-block`** / **`.trk-my-time-inner`** — блок "Моё время" в detail overview
- Полный responsive для mobile (< 640px)

---

## 🎯 v6.6 — Role Radar (Покрытие ролями)

### Новые файлы
- **`js/role_radar.js`** — standalone компонент радарной диаграммы:
  - `RADAR_AXES` — 5 осей: Account Manager / Coordinator DC / Sales / Delivery PM / CSM
  - `buildRadarSVG(values, size)` — чистый SVG, 5 колец сетки, подписи осей, poly данных, точки
  - `radarValuesFromEntry(pcEntry)` — извлекает `role_*` поля из pc_entries
  - `radarCoverage(values)` → `{ sum, pct }` — % покрытия (sum / 25 × 100)
  - `RoleRadar` — компонент: `init()`, `render()`, `bindEvents()`, модал со слайдерами

### Изменения в pc_entries (схема)
| Новое поле | Тип | Описание |
|---|---|---|
| `role_account_manager` | number | Вовлечённость AM: 0-5 |
| `role_coordinator` | number | Вовлечённость Coordinator/DC: 0-5 |
| `role_sales` | number | Вовлечённость Sales: 0-5 |
| `role_delivery` | number | Вовлечённость Delivery/PM: 0-5 |
| `role_csm` | number | Вовлечённость CSM: 0-5 |

### Изменения в detail.js
- `_renderOverview()` — двухколоночный layout: график слева, радар справа
- `_renderActiveTab()` → `case 'overview'` → `RoleRadar.bindEvents()`

### Изменения в bundle.js
- Inline `_RADAR_AXES`, `_buildRadarSVG()`, `_radarPt()`, `_radarValuesFromEntry()`, `_radarCoverage()`
- Inline `RoleRadar` объект (полная копия)
- `window.RoleRadar` экспорт
- Inline `DetailPage._draw()` — `overview-layout` с радаром в правой колонке
- `RoleRadar.bindEvents()` после `_drawChart()` и при переключении на overview-таб

### Изменения в css/style.css
- `.overview-layout` / `.overview-main` / `.overview-sidebar` — двухколоночный grid (1fr 300px)
- `.radar-block` — контейнер с glassmorphism
- `.radar-svg`, `.radar-ring`, `.radar-spoke`, `.radar-poly` — SVG-стили
- `.radar-dot` с hover r:5→8
- `.radar-tooltip` — позиционированный popup
- `.radar-vals` — строка AM/DC/Sales/Delivery/CSM под радаром
- `.radar-coverage` / `.radar-warning` — индикатор и предупреждение
- `.radar-slider`, `.radar-slider-group` — стили модала с слайдерами

### Логика работы
```
Покрытие: сумма(5 значений) / 25 × 100%
≥ 80% → зелёный · ≥ 50% → жёлтый · < 50% → красный
сумма < 10 → предупреждение "⚠️ Низкое покрытие ролями"
Сохранение: PATCH pc_entries/{id} с role_* полями
Если pc_entries не существует → POST с нулевыми PC критериями
```

---

## 📊 v6.5 — Visualization + Integration (Заход 3а)

### SVG Dual-Axis Chart в Delivery
- `DeliveryTab._renderChart()` — 6 месяцев, FTE (синяя/левая) + avg_rate (жёлтый пунктир/правая)
- `DeliveryTab._bindChartEvents()` — tooltip: label, FTE, рейт, эффективность
- `DeliveryTab.getHistory(clientId)` → 12 месяцев `[{month, fte, avg_rate, efficiency, delta_hours, delta_money}]`

### Revenue Efficiency в calc.js
- `Calc.computeClient(client, bchsEntries, pcEntries, fteEntries = [])` — новый параметр
- `revenueEfficiency: null | 0..1` — из последней FTE-записи клиента
- Final Score × 0.95 если `revenueEfficiency < 0.8`

### 8-я KPI карточка в detail.js
- "💰 Revenue Efficiency" — зелёный ≥95%, жёлтый ≥80%, красный <80%

---

## 👥 v6.4 — FTE Dynamics (Delivery Tab)

### Новые файлы
- **`js/pages/delivery.js`** (42KB) — standalone версия DeliveryTab
  - Расчётные функции: `getMemberPlanned`, `getMemberDelta`, `getAvgEfficiency`, `getEntryStatus` и др.
  - `FteAPI` — CRUD для таблицы `fte_entries` (members как JSON-строка)
  - `DeliveryTab` — полный таб с навигацией по месяцам, KPI, таблицей, формами

### Изменения в detail.js
- Полная переработка: добавлена система табов (`.detail-tab-btn`)
- Табы: 📋 Обзор / 📈 История / 📝 Заметки / 👥 Delivery
- Таб Delivery скрыт для `account_manager` (`detail_delivery: false`)
- `DeliveryTab.init(clientId)` вызывается при переключении на таб
- `DeliveryTab.activeMonth` сбрасывается при смене клиента

### Встроено в bundle.js
- Константы: `FTE_CURRENCIES`, `FTE_ALLOCATION_OPTIONS`, `FTE_DEFAULT_LOCATION`
- Расчётные функции `_fte*` (без конфликтов имён)
- `FteAPI` — CRUD с сериализацией members
- `DeliveryTab` — полный рендер и логика
- `window.DeliveryTab`, `window.FteAPI`

### Изменения в constants.js
- `FTE_CURRENCIES = ['USD', 'EUR', 'PLN', 'GBP']`
- `FTE_ALLOCATION_OPTIONS = [0.1 ... 1.0]`
- `FTE_DEFAULT_LOCATION = 'BY'`

### Изменения в style.css
- `.detail-tabs-nav`, `.detail-tab-btn` — система табов
- `.dtab-*` — все стили таба Delivery:
  - Навигация по месяцам с dot-индикаторами наличия данных
  - KPI 4×1 (адаптив 2×2 на мобайле)
  - Таблица с цветным левым бордером (warning=жёлтый, critical=красный)
  - Строка итогов с жирным текстом
  - Инлайн-форма редактирования строки
  - Модал с мультидобавлением блоков участников

### Таблица fte_entries (схема)
| Поле | Тип | Описание |
|------|-----|----------|
| client_id | text | FK к clients |
| month | text | YYYY-MM |
| members | text | JSON-строка массива участников |

---

## 📅 v6.3 — Calendar Engine (Заход 2, полная реализация)

### Новые файлы
- **`js/calendar_engine.js`** (22KB) — движок рабочих календарей:
  - `SUPPORTED_LOCATIONS` — 4 локации: BY / PL / DE / US
  - `FALLBACK_DATA` — встроенные данные 2025–2026 для всех 4 локаций (полный хардкод)
  - Кэш в `localStorage` (`bchs_calendar_cache`, TTL 30 дней)
  - API `https://date.nager.at/api/v3/PublicHolidays/{year}/{code}` с AbortController (5s timeout)
  - `CalendarEngine` — публичный объект с 12 методами
- **`js/pages/calendars.js`** (26KB) — страница «Рабочие календари»:
  - Секция 1: статус-бейджи по локациям (API 🟢 / Устаревает 🟡 / Встроенные 🔴)
  - Секция 2: карточки локаций 2×2 — текущий + следующий месяц + праздники
  - Секция 3: Мои календари — кастомные + импорт JSON через модал с 2 табами
  - Секция 4: таблица сравнения 6 месяцев — min подсвечен красным, max зелёным

### Изменения в bundle.js
- Встроен `CalendarEngine` + `CalendarsPage` (инлайн, после `App`)
- `App.init()` → `CalendarEngine.init()` (фоновое обновление кэша)
- `App.navigate()` → `case 'calendars': await CalendarsPage.render()`

### Изменения в index.html
- Sidebar: `📅 Календари` в `<ul class="nav-links">`
- Bottom-nav: кнопка `📅 Календари`

### Изменения в css/style.css
- ~220 новых строк: `.cal-*`, `.cmp-*`, `.cal-import-*`, `.cal-dropzone`, `.cal-validation-*`
- Стили: статус-бейджи, карточки локаций, праздники-чипы, таблица сравнения с min/max, модал с табами, dropzone, preview-таблица, code block

### Приоритет источников данных
```
кастомный localStorage → кэш API (TTL 30д) → FALLBACK_DATA (встроенный) → on-the-fly calc
```

---

## 🎨 v6.1 — Material Design редизайн

- **CSS полностью переписан** (~2100 строк) под Material Design 3
- **Шрифт:** Roboto 300/400/500/700 (вместо Inter) + Roboto Mono
- **Токены:** `--md-*` переменные для цветов, форм, elevation
- **Форма:** скруглённые pill-кнопки (`border-radius: 28px`), MD-радиусы (`--r-xs/sm/md/lg/xl`)
- **Elevation:** 3 уровня тени вместо плоских границ (`.elev-1/2/3`)
- **Цвета:** Material 3 семантика — `--md-primary`, `--md-on-surf`, статус-цвета без жёсткого hex
- **Алиасы совместимости:** старые `--bg`, `--blue`, `--red` и т.д. → алиасы новых токенов (JS не сломан)
- **Табы:** MD-стиль — нет фона, только нижняя линия активного таба
- **Навигация:** pill-shape nav items в боковой панели
- **Кнопки:** `.btn-tonal` добавлен (Material "tonal" filled)
- **Анимации:** `mdDialogIn`, `mdFadeIn`, `mdSlideDown` — MD-motion spec

---

## 🚀 Что нового в v6

### Phase 1 — Ориентация и контекст
- **Onboarding wizard** — первый запуск: роль → имя менеджера → краткий тур. Флаг `bchs_onboarded` в localStorage.
- **BCG border accent** — цветная левая граница строки: KEY=золото, STABLE=серый, GROWTH=зелёный, TAIL=светло-серый
- **Last activity chip** — `47д` красный/жёлтый/зелёный в каждой строке дашборда
- **Overdue notification banner** — при загрузке: «3 клиента без данных за Май» с кликабельными именами
- **Sidebar badge counts** — красный счётчик AtRisk на «Дашборд», синий просрочено на «Внести данные»
- **Bottom nav (mobile)** — фиксированная нижняя панель навигации с бейджами

### Phase 2 — Формы и страницы
- **Breadcrumbs** — «◉ Дашборд › Клиент» в DetailPage и EntryPage
- **EntryPage wizard** — 4 шага: Клиент/Период → bCHS сигналы → PC Score → Итог+Сохранение
- **Smart unfilled list** — список клиентов без данных за текущий месяц
- **Autosave** — черновик в localStorage каждые 1.2с (ключ `bchs_as_{clientId}_{year}_{month}`)
- **Signal hints** — tooltip с объяснением на 9 ключевых сигналах
- **DetailPage hero** — большой блок: name + status + bCHS/Final/Лояльность/Потенциал над fold
- **Horizontal timeline** — последние 12 месяцев в виде точек с цветом здоровья
- **Decline alert** — баннер при 3+ месяцах последовательного снижения bCHS
- **Contextual banners** — «Нет данных за Май → Внести сейчас», «AtRisk» баннер
- **Inline entry toggle** — кнопка «Внести прямо здесь» без перехода на новую страницу

### Phase 3 — Дашборд
- **Sticky summary bar** — закреплённая сводка: AtRisk / Caution / Healthy / просрочено / MR / всего
- **Pin to top** — 📌 кнопка на каждой строке, pinned → localStorage `bchs_pinned`
- **Illustrated empty states** — новый класс `.empty-state-v2` с иконкой + CTA кнопками

### Phase 4 — Клавиатура + анимации
- **Keyboard shortcuts** — `N` = Внести данные, `Esc` = Дашборд, `R` = Обновить
- **Micro-animations** — `popIn` на toast'ах, `saveFlash` на preview после сохранения
- **Onboarding dots** — анимированные индикаторы шагов

---

## 📐 Архитектура

```
index.html          — разметка, нижняя навигация, onboarding overlay
css/style.css       — ~2100 строк, Material Design 3 (v6.1)
js/bundle.js        — ~2400 строк, полный SPA без фреймворков
.tables/            — RESTful Table API (clients, bchs_entries, pc_entries, mc_configs)
```

---

## 🧮 Формулы (ClientCalc engine, 10 шагов)

| Метрика | Формула |
|---------|---------|
| bCHS | сумма весов выбранных сигналов (−89…+81) |
| Лояльность % | `(bCHS + 89) / 170 × 100` |
| PC Score | среднее 7 критериев (1–5) |
| Final Score | `((bCHS+89)/170)×60 + (PC/5)×40` диапазон 0–100 |
| ⚖️ Потенциал | `round((pcScore/5×100) / ideal × 100)` |
| Идеал % | KEY/KEY_ALERT=88%, GROWTH=80%, GROWTH_EARLY=74%, остальные=72% |

### Health signal (от Final Score)
- ≥65 → 🟢 Healthy
- ≥45 → 😐 Neutral  
- ≥30 → ⚠️ Caution
- <30  → 🔴 AtRisk

---

## 📊 BCG матрица

| Категория | Условие | Потенциал (ideal) |
|-----------|---------|-------------------|
| KEY | MR=HIGH + Strategic=HIGH | 88% |
| KEY_ALERT | KEY условия + плохое здоровье | 88% |
| STABLE | MR=HIGH/MEDIUM + не KEY | — |
| GROWTH 💎 | Strategic=HIGH + MR<HIGH | 80% |
| GROWTH 🌱 | Strategic=MEDIUM + MR=LOW | 74% |
| TAIL | всё остальное | 72% |

---

## 🗄️ Таблицы API

### `tables/clients` — 29 полей
```
id, name, status, monthly_revenue, client_type, phase,
tech_value, brand_value, growth_potential, managed_services_potential,
access_to_end_client, decision_maker_level,
contract_length, client_difficulty, client_engagement,
operational_difficulty, team_maturity,
sales_owner, strategy_notes,
// Computed (сохраняются при save):
bcg_category, key_account_priority, financial_value, strategic_value,
priority_score, csm_assignment, total_hours, capacity_pct, complexity
```

### `tables/bchs_entries` — сигналы лояльности
```
client_id, month, year + 25 сигнальных полей (bool)
```

### `tables/pc_entries` — PC Score
```
client_id, month, year + 7 критериев (1–5)
```

### `tables/mc_configs` — Monte Carlo параметры
```
client_id, drift, volatility, mean_reversion, equilibrium,
p_strategic_meeting, p_fast_response, p_upsell,
p_escalation, p_complaint, p_churn, p_mr_downgrade,
monthly_revenue, impact_*
```

---

## 🔗 Маршруты SPA

| Страница | Функция | Описание |
|----------|---------|----------|
| `dashboard` | `DashboardPage.render()` | Портфель, хайлайты, sticky bar, pin |
| `entry` | `EntryPage.render(clientId?)` | 4-шаговый wizard |
| `detail` | `DetailPage.render(clientId)` | Hero + timeline + tabs + MC |
| `clients` | `ClientsPage.render(highlightId?)` | Список + форма 15 полей |

---

## ⌨️ Keyboard Shortcuts

| Клавиша | Действие |
|---------|---------|
| `N` | Внести данные (EntryPage) |
| `Esc` | Дашборд |
| `R` | Обновить дашборд |

---

## 💾 LocalStorage Keys

| Ключ | Тип | Описание |
|------|-----|---------|
| `bchs_onboarded` | `"1"` | Онбординг пройден |
| `bchs_role` | `"admin"/"worker"` | Текущая роль |
| `bchs_worker_name` | `string` | Имя менеджера (Worker mode) |
| `bchs_pinned` | `JSON array` | Закреплённые ID клиентов |
| `bchs_as_{cid}_{year}_{month}` | `JSON` | Автосохранение черновика EntryPage |

---

## 🎨 Ключевые CSS классы (v6)

### Onboarding
`.onboard-box` `.onboard-role-btn` `.onboard-dot` `.onboard-dots`

### BCG borders
`.client-row[data-bcg="KEY"]` → gold border  
`.client-row[data-bcg="GROWTH"]` → green border

### Last activity
`.last-act-chip` `.last-act-ok` `.last-act-warn` `.last-act-overdue` `.last-act-none`

### Banners
`.overdue-banner` `.ctx-banner` `.ctx-banner-warn/risk/info/ok` `.decline-alert`

### Hero (DetailPage)
`.detail-hero` `.detail-hero[data-health]` `.hero-stat` `.hero-stat-val`

### Timeline
`.timeline-scroll` `.timeline-track` `.timeline-node` `.timeline-dot-healthy/neutral/caution/risk`

### Wizard (EntryPage)
`.wizard-steps` `.wizard-step.active/.done` `.wizard-pane` `.unfilled-list` `.autosave-indicator`

### Dashboard
`.sticky-summary` `.sticky-sum-chip` `.pin-btn` `.pin-btn.pinned` `.client-row.pinned`

### Navigation
`.nav-badge` `.breadcrumbs` `.breadcrumb-item` `#bottom-nav` `.bottom-nav-btn`

### Micro-animations
`@keyframes popIn` `@keyframes saveFlash` `.save-flash`

---

## ✅ Статус реализации v6

### Внедрено
- [x] Onboarding wizard (3 шага)
- [x] BCG левая граница строки
- [x] Last activity chip (зелёный/жёлтый/красный)
- [x] Overdue notification banner
- [x] Sidebar badge counts (atRisk + overdue)
- [x] Bottom navigation (mobile)
- [x] Sticky summary bar на дашборде
- [x] Pin to top с localStorage
- [x] Breadcrumbs в EntryPage и DetailPage
- [x] EntryPage wizard (4 шага)
- [x] Smart unfilled client list
- [x] Autosave в localStorage
- [x] Signal hints (tooltip на 9 сигналах)
- [x] DetailPage hero section с health data-атрибутом
- [x] Horizontal timeline (последние 12 месяцев)
- [x] Decline alert (3+ месяцев снижения)
- [x] Contextual banners (no data, AtRisk)
- [x] Inline entry toggle
- [x] Illustrated empty states (.empty-state-v2)
- [x] Keyboard shortcuts (N / Esc / R)
- [x] Micro-animations (popIn, saveFlash)

### Возможные улучшения v7
- [ ] Swipe-to-expand на мобиле (Touch API)
- [ ] Полная inline форма в DetailPage (без перехода)
- [ ] Export данных в CSV/Excel
- [ ] Push-уведомления (Web Push API)
- [ ] Тёмная тема

---

## 🔧 Технические заметки

- **Нет build-шага** — static site, файлы раздаются напрямую
- **Chart.js 4.4.0** через jsDelivr CDN
- **Inter** через Google Fonts
- **API** — относительные URL `tables/{name}`, без CORS-проблем
- **Worker filter** — гибкое `includes()` сравнение (поддерживает «Снитко» vs «Снитко Александр»)
- **DB issue** — клиенты созданные до v5 не имеют 15 полей → BCG/Priority могут быть неточными до пересохранения через форму
