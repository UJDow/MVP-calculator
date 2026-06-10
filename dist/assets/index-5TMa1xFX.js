var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n={team_scope_request:{label:`Запрос расширения команды/скоупа`,weight:5,group:`pos_lead`},new_services_interest:{label:`Интерес к новым услугам`,weight:3,group:`pos_lead`},strategic_sessions:{label:`Стратегические сессии`,weight:7,group:`pos_lead`},fast_responses:{label:`Быстрые ответы / высокая вовлечённость`,weight:2,group:`pos_lead`},internal_events:{label:`Приглашение на внутренние события`,weight:3,group:`pos_lead`},shared_business_plans:{label:`Совместное планирование / бизнес-планы`,weight:3,group:`pos_lead`},contract_renewal:{label:`Продление контракта`,weight:24,group:`pos_lag`},upsell:{label:`Апселл`,weight:16,group:`pos_lag`},cross_sell:{label:`Кросс-селл`,weight:13,group:`pos_lag`},positive_feedback:{label:`Положительная обратная связь / NPS`,weight:5,group:`pos_lag`},slow_responses:{label:`Медленные ответы / снижение активности`,weight:-2,group:`neg_lead`},missed_meetings:{label:`Пропуск встреч`,weight:-3,group:`neg_lead`},no_planning:{label:`Отказ от планирования`,weight:-3,group:`neg_lead`},detailed_report_request:{label:`Запрос детальной отчётности (недоверие)`,weight:-2,group:`neg_lead`},scope_reduction:{label:`Сокращение скоупа`,weight:-4,group:`neg_lead`},competitor_mentions:{label:`Упоминание конкурентов`,weight:-5,group:`neg_lead`},new_decision_maker:{label:`Новый ЛПР / смена контакта`,weight:-3,group:`neg_lead`},exit_questions:{label:`Вопросы об условиях расторжения`,weight:-8,group:`neg_lead`},reduced_frequency:{label:`Снижение частоты взаимодействий`,weight:-2,group:`neg_lead`},no_growth_response:{label:`Нет реакции на предложения роста`,weight:-2,group:`neg_lead`},complaint:{label:`Жалоба / эскалация недовольства`,weight:-3,group:`neg_lag`},payment_delay_10_30:{label:`Задержка оплаты 10–30 дней`,weight:-4,group:`neg_lag`},specialist_replacement:{label:`Замена специалиста по инициативе клиента`,weight:-5,group:`neg_lag`},escalation:{label:`Эскалация до топ-менеджмента`,weight:-10,group:`neg_lag`},payment_delay_30plus:{label:`Задержка оплаты 30+ дней`,weight:-8,group:`neg_lag`},churn:{label:`Отток / завершение контракта`,weight:-25,group:`neg_lag`}},r={pos_lead:{label:`Позитивные лидирующие`,icon:`✦`},pos_lag:{label:`Позитивные результирующие`,icon:`✔`},neg_lead:{label:`Негативные лидирующие`,icon:`◆`},neg_lag:{label:`Негативные результирующие`,icon:`✘`}},i={people_count:{label:`Размер команды`,hint:`1=мало · 5=очень много`},project_complexity:{label:`Сложность проекта`,hint:`1=простой · 5=очень сложный`},reporting:{label:`Объём отчётности`,hint:`1=минимум · 5=очень много`},risk_probability:{label:`Вероятность рисков`,hint:`1=низкая · 5=очень высокая`},risk_consequences:{label:`Последствия рисков`,hint:`1=незначит. · 5=критичные`},face_role:{label:`Роль лица компании`,hint:`1=фоновая · 5=ключевая`},emotional_load:{label:`Эмоциональная нагрузка`,hint:`1=низкая · 5=очень высокая`}},a={KEY:{label:`⭐ KEY`},STABLE:{label:`🐄 STABLE`},GROWTH:{label:`💎 GROWTH`},GROWTH_EARLY:{label:`🌱 GROWTH (early)`},TAIL:{label:`📦 TAIL`}},o=[`Active`,`Paused`,`Self-managed`],s=[`Январь`,`Февраль`,`Март`,`Апрель`,`Май`,`Июнь`,`Июль`,`Август`,`Сентябрь`,`Октябрь`,`Ноябрь`,`Декабрь`],c=[`Янв`,`Фев`,`Мар`,`Апр`,`Май`,`Июн`,`Июл`,`Авг`,`Сен`,`Окт`,`Ноя`,`Дек`],l=[`USD`,`EUR`,`PLN`,`GBP`],u=[.1,.25,.5,.75,1],d=`https://bchs-api.lexsnitko.workers.dev`,f={async _safeJson(e){if(!e.ok){let t=await e.text().catch(()=>``);return console.warn(`[API] ${e.status} ${e.url}`,t),null}return e.json().catch(()=>null)},async _get(e){let t=await fetch(`${d}/${e}`);return this._safeJson(t)},async _post(e,t){let n=await fetch(`${d}/${e}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});return this._safeJson(n)},async _put(e,t){let n=await fetch(`${d}/${e}`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});return this._safeJson(n)},async _patch(e,t){let n=await fetch(`${d}/${e}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});return this._safeJson(n)},async _delete(e){await fetch(`${d}/${e}`,{method:`DELETE`})},_bchsCache:null,_pcCache:null,_statusCache:null,_clientsCache:null,clearCache(){this._bchsCache=null,this._pcCache=null,this._statusCache=null,this._clientsCache=null},async _fetchAll(e){let t=await fetch(`${d}/tables/${e}?limit=2000`),n=await this._safeJson(t);return n?Array.isArray(n.data)?n.data:Array.isArray(n)?n:[]:[]},async getClients(){if(this._clientsCache)return this._clientsCache;let e=await fetch(`${d}/tables/clients?limit=500`),t=await this._safeJson(e);if(!t)return[];let n=Array.isArray(t.data)?t.data:Array.isArray(t)?t:[];return this._clientsCache=n,n},async getClient(e){let t=await fetch(`${d}/tables/clients/${e}`);return this._safeJson(t)},async createClient(e){this._clientsCache=null;let t={...e};t.id||delete t.id;let n=await fetch(`${d}/tables/clients`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});return this._safeJson(n)},async updateClient(e,t){this._clientsCache=null;let n={...t};[`id`,`gs_project_id`,`gs_table_name`,`created_at`,`updated_at`,`bcg_alert`].forEach(e=>delete n[e]);let r=await fetch(`${d}/tables/clients/${e}`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)});return this._safeJson(r)},async deleteClient(e){this._clientsCache=null,await fetch(`${d}/tables/clients/${e}`,{method:`DELETE`})},async getAllBCHS(){return this._bchsCache||=await this._fetchAll(`bchs_entries`),this._bchsCache},async getAllBCHSEntries(){return this.getAllBCHS()},async getBCHSFor(e){return(await this.getAllBCHS()).filter(t=>String(t.client_id)===String(e))},async getBCHSEntries(e){return this.getBCHSFor(e)},async getBCHSEntry(e,t,n){return(await this.getBCHSFor(e)).find(e=>Number(e.month)===t&&Number(e.year)===n)??null},async saveBCHSEntry(e,t,r,i){this._bchsCache=null;let a=await this.getBCHSEntry(e,t,r),o={client_id:e,month:t,year:r};for(let e of Object.keys(n))o[e]=+(i[e]===!0);return a?this._put(`tables/bchs_entries/${a.id}`,o):this._post(`tables/bchs_entries`,o)},async getAllPC(){return this._pcCache||=await this._fetchAll(`pc_entries`),this._pcCache},async getAllPCEntries(){return this.getAllPC()},async getPCFor(e){return(await this.getAllPC()).filter(t=>String(t.client_id)===String(e))},async getPCEntries(e){return this.getPCFor(e)},async getPCEntry(e,t,n){return(await this.getPCFor(e)).find(e=>Number(e.month)===t&&Number(e.year)===n)??null},async savePCEntry(e,t,n,r){this._pcCache=null;let a=await this.getPCEntry(e,t,n),o={client_id:e,month:t,year:n};for(let e of Object.keys(i)){let t=r[e];o[e]=t==null?null:Number(t)}return a?this._put(`tables/pc_entries/${a.id}`,o):this._post(`tables/pc_entries`,o)},async getAllStatusEntries(){return this._statusCache||=await this._fetchAll(`status_entries`),this._statusCache},async getStatusEntriesFor(e){return(await this.getAllStatusEntries()).filter(t=>String(t.client_id)===String(e))},async saveStatusEntry(e,t,n,r,i){this._statusCache=null;let[a,o,s]=t.split(`-`).map(Number),c={client_id:e,entry_date:t,day:s,month:o,year:a,status_note:n||``,signals_json:JSON.stringify(r||{}),pc_json:JSON.stringify(i||{}),updated_at:new Date().toISOString()};return this._post(`tables/status_entries`,c)},async deleteStatusEntry(e){this._statusCache=null,await this._delete(`tables/status_entries/${e}`)},async callAI(e={}){let t={model:e.model??`deepseek-chat`,temperature:e.temperature??.3,max_tokens:e.max_tokens??1e3,...e},n=await fetch(`${d}/ai/chat`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});if(!n.ok)throw Error(`AI proxy error: ${n.status}`);return n.json()},async getPortfolioStrategies(){let e=await this._get(`tables/portfolio_strategies?limit=100`);return Array.isArray(e)?e:Array.isArray(e?.data)?e.data:[]},async upsertPortfolioStrategy(e,t){let n=(await this.getPortfolioStrategies()).find(t=>t.horizon===e),r={...t,horizon:e,updated_at:new Date().toISOString()};return n?this._put(`tables/portfolio_strategies/${n.id}`,r):this._post(`tables/portfolio_strategies`,r)},async getAccountStrategies(){let e=await this._get(`tables/account_strategies?limit=500`);return Array.isArray(e)?e:Array.isArray(e?.data)?e.data:[]},async saveAccountStrategy(e,t){let n=(await this.getAccountStrategies()).find(t=>String(t.client_id)===String(e)&&t.status!==`Done`),r={...t,client_id:e,updated_at:new Date().toISOString()};return n?this._put(`tables/account_strategies/${n.id}`,r):this._post(`tables/account_strategies`,r)},async getAccountStrategyFor(e){return(await this.getAccountStrategies()).filter(t=>String(t.client_id)===String(e)&&t.status!==`Done`).sort((e,t)=>new Date(t.created_at)-new Date(e.created_at))[0]??null},async getTouchPoints(){let e=await this._get(`tables/touch_points?limit=2000`);return Array.isArray(e)?e:Array.isArray(e?.data)?e.data:[]},async saveTouchPoint(e){return e.id?this._put(`tables/touch_points/${e.id}`,e):this._post(`tables/touch_points`,e)},async saveTouchPointFull(e){return this._post(`touch/save`,e)},async completeTouchPoint(e,t=``){return this._put(`tables/touch_points/${e}`,{completed_at:new Date().toISOString(),notes:t,updated_at:new Date().toISOString()})},async deleteTouchPoint(e){return this._delete(`tables/touch_points/${e}`)}},p=`https://bchs-api.lexsnitko.workers.dev`,m={async run(){await Promise.all([`clients`,`bchs_entries`,`pc_entries`,`status_entries`,`mc_configs`,`account_strategies`,`portfolio_strategies`,`fte_entries`,`my_activities`].map(e=>fetch(`${p}/tables/${e}?limit=1`).catch(()=>{}))),console.log(`[SEED] All 9 tables initialized.`)}},h={BY:{id:`BY`,name:`Беларусь`,flag:`🇧🇾`,timezone:`Europe/Minsk`,apiCode:`BY`},PL:{id:`PL`,name:`Польша`,flag:`🇵🇱`,timezone:`Europe/Warsaw`,apiCode:`PL`},DE:{id:`DE`,name:`Германия / EU`,flag:`🇩🇪`,timezone:`Europe/Berlin`,apiCode:`DE`},US:{id:`US`,name:`США`,flag:`🇺🇸`,timezone:`America/New_York`,apiCode:`US`}},g=`bchs_calendar_cache`,_=`bchs_custom_calendars`,v=720*60*60*1e3,y=5e3,b=`https://date.nager.at/api/v3/PublicHolidays`,x=[`Январь`,`Февраль`,`Март`,`Апрель`,`Май`,`Июнь`,`Июль`,`Август`,`Сентябрь`,`Октябрь`,`Ноябрь`,`Декабрь`],S={BY:{"2025-01":{workdays:23,hours:184,holidays:[`2025-01-01`,`2025-01-07`]},"2025-02":{workdays:20,hours:160,holidays:[]},"2025-03":{workdays:20,hours:160,holidays:[`2025-03-08`]},"2025-04":{workdays:22,hours:176,holidays:[]},"2025-05":{workdays:20,hours:160,holidays:[`2025-05-01`,`2025-05-09`]},"2025-06":{workdays:20,hours:160,holidays:[]},"2025-07":{workdays:23,hours:184,holidays:[`2025-07-03`]},"2025-08":{workdays:21,hours:168,holidays:[]},"2025-09":{workdays:22,hours:176,holidays:[]},"2025-10":{workdays:23,hours:184,holidays:[]},"2025-11":{workdays:19,hours:152,holidays:[`2025-11-07`]},"2025-12":{workdays:22,hours:176,holidays:[`2025-12-25`]},"2026-01":{workdays:20,hours:160,holidays:[`2026-01-01`,`2026-01-07`]},"2026-02":{workdays:20,hours:160,holidays:[]},"2026-03":{workdays:20,hours:160,holidays:[`2026-03-08`]},"2026-04":{workdays:22,hours:176,holidays:[]},"2026-05":{workdays:19,hours:152,holidays:[`2026-05-01`,`2026-05-09`]},"2026-06":{workdays:21,hours:168,holidays:[]},"2026-07":{workdays:23,hours:184,holidays:[`2026-07-03`]},"2026-08":{workdays:20,hours:160,holidays:[]},"2026-09":{workdays:22,hours:176,holidays:[]},"2026-10":{workdays:22,hours:176,holidays:[]},"2026-11":{workdays:20,hours:160,holidays:[`2026-11-07`]},"2026-12":{workdays:22,hours:176,holidays:[`2026-12-25`]}},PL:{"2025-01":{workdays:23,hours:184,holidays:[`2025-01-01`,`2025-01-06`]},"2025-02":{workdays:20,hours:160,holidays:[]},"2025-03":{workdays:20,hours:160,holidays:[]},"2025-04":{workdays:21,hours:168,holidays:[`2025-04-18`,`2025-04-21`]},"2025-05":{workdays:19,hours:152,holidays:[`2025-05-01`,`2025-05-03`]},"2025-06":{workdays:20,hours:160,holidays:[`2025-06-19`]},"2025-07":{workdays:23,hours:184,holidays:[]},"2025-08":{workdays:20,hours:160,holidays:[`2025-08-15`]},"2025-09":{workdays:22,hours:176,holidays:[]},"2025-10":{workdays:23,hours:184,holidays:[]},"2025-11":{workdays:18,hours:144,holidays:[`2025-11-01`,`2025-11-11`]},"2025-12":{workdays:21,hours:168,holidays:[`2025-12-25`,`2025-12-26`]},"2026-01":{workdays:22,hours:176,holidays:[`2026-01-01`,`2026-01-06`]},"2026-02":{workdays:20,hours:160,holidays:[]},"2026-03":{workdays:21,hours:168,holidays:[]},"2026-04":{workdays:21,hours:168,holidays:[`2026-04-03`,`2026-04-06`]},"2026-05":{workdays:18,hours:144,holidays:[`2026-05-01`,`2026-05-03`]},"2026-06":{workdays:21,hours:168,holidays:[`2026-06-04`]},"2026-07":{workdays:23,hours:184,holidays:[]},"2026-08":{workdays:20,hours:160,holidays:[`2026-08-15`]},"2026-09":{workdays:22,hours:176,holidays:[]},"2026-10":{workdays:22,hours:176,holidays:[]},"2026-11":{workdays:19,hours:152,holidays:[`2026-11-01`,`2026-11-11`]},"2026-12":{workdays:21,hours:168,holidays:[`2026-12-25`,`2026-12-26`]}},DE:{"2025-01":{workdays:23,hours:184,holidays:[`2025-01-01`]},"2025-02":{workdays:20,hours:160,holidays:[]},"2025-03":{workdays:20,hours:160,holidays:[]},"2025-04":{workdays:21,hours:168,holidays:[`2025-04-18`,`2025-04-21`]},"2025-05":{workdays:20,hours:160,holidays:[`2025-05-01`]},"2025-06":{workdays:20,hours:160,holidays:[]},"2025-07":{workdays:23,hours:184,holidays:[]},"2025-08":{workdays:21,hours:168,holidays:[]},"2025-09":{workdays:22,hours:176,holidays:[]},"2025-10":{workdays:23,hours:184,holidays:[]},"2025-11":{workdays:20,hours:160,holidays:[]},"2025-12":{workdays:21,hours:168,holidays:[`2025-12-25`,`2025-12-26`]},"2026-01":{workdays:22,hours:176,holidays:[`2026-01-01`]},"2026-02":{workdays:20,hours:160,holidays:[]},"2026-03":{workdays:21,hours:168,holidays:[]},"2026-04":{workdays:21,hours:168,holidays:[`2026-04-03`,`2026-04-06`]},"2026-05":{workdays:20,hours:160,holidays:[`2026-05-01`]},"2026-06":{workdays:21,hours:168,holidays:[]},"2026-07":{workdays:23,hours:184,holidays:[]},"2026-08":{workdays:20,hours:160,holidays:[]},"2026-09":{workdays:22,hours:176,holidays:[]},"2026-10":{workdays:22,hours:176,holidays:[]},"2026-11":{workdays:20,hours:160,holidays:[]},"2026-12":{workdays:21,hours:168,holidays:[`2026-12-25`,`2026-12-26`]}},US:{"2025-01":{workdays:22,hours:176,holidays:[`2025-01-01`,`2025-01-20`]},"2025-02":{workdays:19,hours:152,holidays:[`2025-02-17`]},"2025-03":{workdays:21,hours:168,holidays:[]},"2025-04":{workdays:22,hours:176,holidays:[]},"2025-05":{workdays:21,hours:168,holidays:[`2025-05-26`]},"2025-06":{workdays:20,hours:160,holidays:[`2025-06-19`]},"2025-07":{workdays:22,hours:176,holidays:[`2025-07-04`]},"2025-08":{workdays:21,hours:168,holidays:[]},"2025-09":{workdays:21,hours:168,holidays:[`2025-09-01`]},"2025-10":{workdays:23,hours:184,holidays:[]},"2025-11":{workdays:19,hours:152,holidays:[`2025-11-11`,`2025-11-27`]},"2025-12":{workdays:22,hours:176,holidays:[`2025-12-25`]},"2026-01":{workdays:21,hours:168,holidays:[`2026-01-01`,`2026-01-19`]},"2026-02":{workdays:19,hours:152,holidays:[`2026-02-16`]},"2026-03":{workdays:21,hours:168,holidays:[]},"2026-04":{workdays:22,hours:176,holidays:[]},"2026-05":{workdays:20,hours:160,holidays:[`2026-05-25`]},"2026-06":{workdays:21,hours:168,holidays:[`2026-06-19`]},"2026-07":{workdays:22,hours:176,holidays:[`2026-07-04`]},"2026-08":{workdays:20,hours:160,holidays:[]},"2026-09":{workdays:21,hours:168,holidays:[`2026-09-07`]},"2026-10":{workdays:22,hours:176,holidays:[]},"2026-11":{workdays:19,hours:152,holidays:[`2026-11-11`,`2026-11-26`]},"2026-12":{workdays:22,hours:176,holidays:[`2026-12-25`]}}};function C(e){try{return JSON.parse(localStorage.getItem(e)||`null`)}catch{return null}}function w(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}function T(e,t){return`${e}_${t}`}function ee(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function te(e,t,n){let r=new Set(n),i=0,a=new Date(e,t,0).getDate();for(let n=1;n<=a;n++){let a=new Date(e,t-1,n),o=a.getDay();if(o===0||o===6)continue;let s=ee(a);r.has(s)||i++}return i}function E(e,t){let n={};for(let r of e){let[e,i]=r.date.split(`-`);if(Number(e)!==t)continue;let a=`${e}-${i}`;n[a]||(n[a]=[]),n[a].push(r.date)}let r={};for(let e=1;e<=12;e++){let i=`${t}-${String(e).padStart(2,`0`)}`,a=n[i]||[],o=te(t,e,a);r[i]={workdays:o,hours:o*8,holidays:a}}return r}function ne(e,t,n){let r=C(g)||{};r[T(e,t)]={data:n,cachedAt:Date.now(),ttl:v},w(g,r)}function re(e,t){let n=(C(g)||{})[T(e,t)];return!n||Date.now()-n.cachedAt>n.ttl?null:n.data}function ie(e,t){return(C(g)||{})[T(e,t)]||null}async function D(e,t){let n=h[e];if(!n)return null;let r=new AbortController,i=setTimeout(()=>r.abort(),y);try{let e=await fetch(`${b}/${t}/${n.apiCode}`,{signal:r.signal});if(clearTimeout(i),!e.ok)return null;let a=await e.json();return Array.isArray(a)?E(a,t):null}catch{return clearTimeout(i),null}}var O={async init(){let e=new Date().getFullYear(),t=e+1,n=Object.keys(h);(async()=>{for(let r of n)for(let n of[e,t]){if(re(r,n))continue;let e=await D(r,n);e&&ne(r,n,e)}})()},getMonthData(e,t){let n=C(_)||{};if(n[e]?.[t])return{...n[e][t],source:`custom`};let r=re(e,Number(t.split(`-`)[0]));if(r?.[t])return{...r[t],source:`api`};let i=S[e]?.[t];if(i)return{...i,source:`fallback`};let[a,o]=t.split(`-`).map(Number),s=te(a,o,[]);return{workdays:s,hours:s*8,holidays:[],source:`fallback`}},getPlannedHours(e,t,n){let r=this.getMonthData(e,t);return Math.round(r.hours*(n||1))},getDelta(e,t,n){let r=n||0,i=t-e,a=Math.round(i*r),o=e>0?t/e:0,s,c;return o>=.95?(s=`ok`,c=`В норме`):o>=.8?(s=`warning`,c=`Внимание`):(s=`critical`,c=`Критично`),{delta_hours:i,delta_money:a,efficiency:o,status:s,status_label:c}},getLocations(){let e=Object.values(h).map(e=>({...e,source:`builtin`})),t=C(_)||{},n=Object.values(t).filter(e=>!h[e.id]).map(e=>({id:e.id,name:e.name,flag:e.flag||`🌍`,source:`custom`}));return[...e,...n]},getMonthName(e){let[t,n]=e.split(`-`).map(Number);return`${x[n-1]} ${t}`},currentYearMonth(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}`},nextYearMonth(e){let[t,n]=e.split(`-`).map(Number);return n===12?`${t+1}-01`:`${t}-${String(n+1).padStart(2,`0`)}`},async refreshCache(e,t){let n=await D(e,t);return n?(ne(e,t,n),{success:!0,source:`api`}):{success:!1,source:`fallback`}},getCacheStatus(e,t){let n=ie(e,t);if(!n)return`fallback`;let r=Date.now()-n.cachedAt;return r<v-10080*60*1e3?`api`:r<v?`stale`:`fallback`},importFromJSON(e){let t;try{t=JSON.parse(e)}catch{return{success:!1,error:`Невалидный JSON`}}if(!t.id)return{success:!1,error:`Отсутствует поле id`};if(!t.name)return{success:!1,error:`Отсутствует поле name`};if(!t.months||typeof t.months!=`object`)return{success:!1,error:`Отсутствует поле months`};let n=Object.keys(t.months);if(!n.length)return{success:!1,error:`months пустой`};let r=C(_)||{};return r[t.id]={id:t.id,name:t.name,flag:t.flag||`🌍`,months:t.months},w(_,r),{success:!0,monthsCount:n.length}},removeCustomLocation(e){if(h[e])return;let t=C(_)||{};delete t[e],w(_,t)},exportLocationJSON(e){let t=this.getLocations().find(t=>t.id===e),n=new Date().getFullYear(),r=n+1,i={};for(let t=1;t<=12;t++){let r=`${n}-${String(t).padStart(2,`0`)}`;i[r]=this.getMonthData(e,r)}for(let t=1;t<=12;t++){let n=`${r}-${String(t).padStart(2,`0`)}`;i[n]=this.getMonthData(e,n)}Object.values(i).forEach(e=>delete e.source);let a={id:e,name:t?.name||e,flag:t?.flag||`🌍`,months:i,exportedAt:new Date().toISOString()};this._downloadJSON(a,`calendar_${e}_${n}-${r}.json`)},exportTemplate(){this._downloadJSON({id:`XX`,name:`Название страны`,flag:`🌍`,months:{"2026-01":{workdays:21,hours:168,holidays:[`2026-01-01`]},"2026-02":{workdays:20,hours:160,holidays:[]},"2026-03":{workdays:21,hours:168,holidays:[]}}},`calendar_template.json`)},_downloadJSON(e,t){let n=new Blob([JSON.stringify(e,null,2)],{type:`application/json`}),r=document.createElement(`a`);r.href=URL.createObjectURL(n),r.download=t,r.click(),URL.revokeObjectURL(r.href)}},ae={financialValue(e){let t=+e||0;return t>=25e3?`HIGH`:t>=6e3?`MEDIUM`:`LOW`},strategicSum(e){let t=0;return t+={Strategic:3,Standard:2,Basic:1}[e.tech_value]||0,t+={Top:3,Recognizable:2,Unknown:1}[e.brand_value]||0,t+={Yes:2,No:1}[e.growth_potential]||0,t+={"C-level":3,"Tech Lead":2,Gatekeeper:1}[e.decision_maker_level]||0,t+={Yes:2,Partial:1,No:0}[e.managed_services_potential]||0,e.client_type!==`Direct`&&(t+={"Strategic Partner":3,Potential:2,Blocks:1}[e.access_to_end_client]||0),t},strategicValue(e){let t=this.strategicSum(e);return e.client_type===`Direct`?t>=10?`HIGH`:t>=7?`MEDIUM`:`LOW`:t>=13?`HIGH`:t>=9?`MEDIUM`:`LOW`},stability(e){let t=e.contract_length,n=e.managed_services_potential;return t===`Stable (6+)`||t===`Medium (3-6)`&&n===`Yes`?`HIGH`:t===`Medium (3-6)`||t===`Short (1-3)`&&n===`Yes`?`MEDIUM`:`LOW`},complexity(e){let t=e.client_difficulty,n=e.client_engagement,r=e.operational_difficulty,i=e.phase,a=e.team_maturity;return t===`Conflict`&&n===`Reactive`||t===`Conflict`&&r===`Hard`||n===`Reactive`&&r===`Hard`||i===`SLA`&&a===`Junior`?`HIGH`:t===`Conflict`||n===`Reactive`||r===`Hard`||i===`SLA`&&a===`Standard`?`MEDIUM`:`LOW`},bcgCategory(e,t,n,r,i){let a=e.growth_potential===`Yes`,o=e.contract_length,s=e.client_engagement,c=e.access_to_end_client;return e.client_type===`Body-shop`||!a&&o===`Short (1-3)`?`TAIL`:t===`HIGH`&&r===`HIGH`&&a?i===`HIGH`?`KEY_ALERT`:`KEY`:t===`HIGH`&&r===`HIGH`?`STABLE`:t===`HIGH`&&a?`GROWTH`:t===`HIGH`?`STABLE`:t===`MEDIUM`&&n===`HIGH`&&a?`GROWTH`:t===`MEDIUM`&&n===`MEDIUM`&&a?`GROWTH_EARLY`:t===`LOW`&&r===`HIGH`&&a&&c!==`N/A`?`GROWTH`:t===`LOW`&&r===`HIGH`&&a||t===`LOW`&&r===`MEDIUM`&&a&&(s===`Proactive`||s===`Active`)?`GROWTH_EARLY`:t===`MEDIUM`&&(n===`HIGH`||n===`MEDIUM`)&&c!==`N/A`?`STABLE`:`TAIL`},priorityScore(e,t,n,r,i){let a={HIGH:3,MEDIUM:2,LOW:1}[e]||1,o={HIGH:3,MEDIUM:2,LOW:1}[t]||1,s={HIGH:3,MEDIUM:2,LOW:1}[n]||1,c={Proactive:3,Active:2,Reactive:1}[r]||2,l={HIGH:1,MEDIUM:2,LOW:3}[i]||2;return Math.round((a*.25+o*.25+s*.25+c*.15+l*.1)*100)/100},keyAccountPriority(e,t,n){let r=n.phase,i=n.growth_potential===`Yes`;if(r===`Winding Down`)return i?`NURTURE`:`MINIMAL`;if(r===`Discovery`)return`INVEST`;let a=e.replace(`_ALERT`,``);return a===`KEY`?t>=2.5?`PROTECT`:t>=2?`STRENGTHEN`:`RESCUE`:a===`STABLE`?t>=2.5?`MAINTAIN`:t>=2?`MONITOR`:`REVIEW`:a===`GROWTH`||a===`GROWTH_EARLY`?t>=2.5?`INVEST`:t>=2?`NURTURE`:`EVALUATE`:t>=2?`RECONSIDER`:`MINIMAL`},csmAssignment(e,t,n,r){let i=e.replace(`_ALERT`,``);if(r===`Discovery`||r===`Winding Down`)return`—`;if(r===`SLA`)return n===`HIGH`||n===`MEDIUM`?`Lead`:`Coordinator`;if(r===`Ongoing`){if(i===`KEY`)return n===`HIGH`?`Lead`:`Coordinator`;if(i===`STABLE`)return n===`HIGH`?`Coordinator`:n===`MEDIUM`?`Setup`:`Support`;if(i===`GROWTH`||i===`GROWTH_EARLY`){if(t===`INVEST`)return n===`HIGH`?`Coordinator`:`Setup`;if(t===`NURTURE`)return`Setup`;if(t===`EVALUATE`)return`Watch`}if(i===`TAIL`)return t===`RECONSIDER`?`Check`:`—`}return`—`},hours(e,t){let n={Junior:1.25,Standard:1,Senior:.8}[t]||1,r={Lead:2.5,Coordinator:2,Setup:1.75,Support:1.25,Watch:.75,Check:.25,"—":.5}[e]||.5;return Math.round(r*n*100)/100},compute(e){let t=this.financialValue(e.monthly_revenue),n=this.strategicValue(e),r=this.stability(e),i=this.complexity(e),a=this.bcgCategory(e,t,n,r,i),o=this.priorityScore(t,n,r,e.client_engagement||`Active`,i),s=this.keyAccountPriority(a,o,e),c=this.csmAssignment(a,s,i,e.phase||`Ongoing`),l=this.hours(c,e.team_maturity||`Standard`),u=Math.round(l/14*100*10)/10;return{financial_value:t,strategic_value:n,stability:r,complexity:i,bcg_category:a===`KEY_ALERT`?`KEY`:a,bcg_alert:a===`KEY_ALERT`,priority_score:o,key_account_priority:s,csm_assignment:c,total_hours:l,capacity_pct:u}}},k={computeBCHS(e){if(!e)return null;let t=0,r=!1;for(let[i,a]of Object.entries(n))e[i]==1&&(t+=a.weight,r=!0);return r?t:null},loyaltyPct(e){return e==null?null:Math.round((e+81)/162*100)},bchsCategory(e){return e==null?{label:`—`,key:`none`}:e>=50?{label:`Champions`,key:`champions`}:e>=20?{label:`Promoters`,key:`promoters`}:e>=-19?{label:`Passives`,key:`passives`}:e>=-49?{label:`At Risk`,key:`at_risk`}:{label:`Detractors`,key:`detractors`}},PC_WEIGHTS:{people_count:.14,project_complexity:.14,reporting:.15,risk_probability:.14,risk_consequences:.14,face_role:.15,emotional_load:.14},computePC(e){if(!e)return null;let t=Object.keys(this.PC_WEIGHTS);if(t.filter(t=>e[t]!==null&&e[t]!==void 0&&e[t]>=1&&e[t]<=5).length<t.length)return null;let n=0;for(let r of t)n+=(e[r]||0)*this.PC_WEIGHTS[r];return Math.round(n*10)/10},finalScore(e,t){return e==null||t==null?null:Math.round(((e+81)/162*60+t/5*40)*10)/10},healthSignal(e){return e==null?{label:`—`,key:`none`,cls:`no-data`}:e>=20?{label:`Здоров`,key:`Healthy`,cls:`health-healthy`}:e>=-10?{label:`Нейтрально`,key:`Neutral`,cls:`health-neutral`}:e>=-30?{label:`Осторожно`,key:`Caution`,cls:`health-caution`}:{label:`Риск`,key:`AtRisk`,cls:`health-risk`}},loadSignal(e){return e==null?{label:`—`,key:`none`}:e>=3.5?{label:`High Load`,key:`High`}:e>=2.5?{label:`🟡 Med Load`,key:`Med`}:e>=1.5?{label:`Low Load`,key:`Low`}:{label:`⚪ Minimal`,key:`Minimal`}},actionBadge(e,t,n){if(n===`Paused`)return{label:`⏸ ПАУЗА`,cls:`badge-autopilot`};if(!t||t===`none`)return{label:`— —`,cls:`badge-autopilot`};let r=t===`Caution`||t===`AtRisk`;switch(e){case`PROTECT`:return r?{label:`PROTECT — критично`,cls:`badge-protect-crit`}:{label:`🟡 PROTECT — держать`,cls:`badge-protect`};case`STRENGTHEN`:return r?{label:`🚨 INTERVENE — срочно`,cls:`badge-intervene`}:{label:`🟡 STRENGTHEN`,cls:`badge-protect`};case`RESCUE`:return{label:`🚨 RESCUE — срочно`,cls:`badge-intervene`};case`MAINTAIN`:return{label:`MAINTAIN`,cls:`badge-invest`};case`MONITOR`:return{label:`🔵 MONITOR`,cls:`badge-monitor`};case`REVIEW`:return{label:`🔄 REVIEW`,cls:`badge-reconsider`};case`INVEST`:return t===`Healthy`?{label:`📈 INVEST — развивать`,cls:`badge-invest`}:{label:`🔵 MONITOR — наблюдать`,cls:`badge-monitor`};case`NURTURE`:return r?{label:`🚨 INTERVENE — срочно`,cls:`badge-intervene`}:t===`Healthy`?{label:`🔵 NURTURE — развивать`,cls:`badge-nurture`}:{label:`🔵 MONITOR — наблюдать`,cls:`badge-monitor`};case`EVALUATE`:return t===`Healthy`?{label:`🔍 EVALUATE — активно`,cls:`badge-evaluate`}:{label:`🔍 EVALUATE — осторожно`,cls:`badge-evaluate`};case`RECONSIDER`:return{label:`🔄 RECONSIDER — пересмотреть`,cls:`badge-reconsider`};case`MINIMAL`:return r?{label:`️ MINIMAL — но есть сигналы`,cls:`badge-minimal-alert`}:{label:`⚪ AUTOPILOT — минимум`,cls:`badge-autopilot`};default:return{label:`— —`,cls:`badge-autopilot`}}},dashSection(e,t,n){if(n===`Paused`||!t||t===`none`)return`auto`;let r=t===`Caution`||t===`AtRisk`;return e===`RESCUE`||r&&e===`PROTECT`||r&&e===`NURTURE`||r&&e===`STRENGTHEN`?`alert`:e===`MINIMAL`||e===`RECONSIDER`||e===`EVALUATE`&&r?`auto`:`work`},potentialIdeal(e){return e===`KEY`||e===`KEY_ALERT`?88:e===`GROWTH`?80:e===`GROWTH_EARLY`?74:72},potentialPct(e,t){return e==null?null:Math.round(e/this.potentialIdeal(t)*100)},trend3m(e){if(!e||e.length<2)return null;let t=e.filter(e=>e.bchs!==null);if(t.length<2)return null;let n=t.slice(-3),r=n[0].bchs,i=n[n.length-1].bchs;if(r===0&&i===0)return null;let a=i-r;return a>5?{label:`↗️ +${a}`,cls:`trend-up`,delta:a}:a<-5?{label:`↘️ ${a}`,cls:`trend-down`,delta:a}:{label:`→ 0`,cls:`trend-flat`,delta:a}},focusText(e,t,n,r){let{key_account_priority:i,status:a,phase:o}=e,s=n.key;if(!i)return`Данные не заполнены → добавьте параметры клиента`;if(a===`Paused`)return i===`INVEST`?`Инвестиция заморожена: проект на паузе → зафиксировать метрику возобновления`:`Проект на паузе → подтвердить статус и следующий шаг`;if(o===`Discovery`)return`Фаза открытия: выявить потребности → провести квалификацию за 30 дней`;if(o===`Winding Down`)return e.growth_potential===`Yes`?`Завершение + потенциал: удержать отношения → предложить новый формат работы`:`Завершение проекта → зафиксировать итоги и закрыть корректно`;switch(i){case`PROTECT`:return s===`AtRisk`?`Ключевой клиент под угрозой → экстренная встреча с ЛПР, стабилизация`:s===`Caution`?`Ключевой клиент в зоне риска → усилить ритм касаний, проверить триггеры`:s===`Healthy`?`Защита устойчива: клиент здоров → закрепить присутствие и искать точки углубления`:`Ключевой клиент стабилен → держать ритм и мониторить вовлечённость`;case`STRENGTHEN`:return s===`AtRisk`||s===`Caution`?`Укрепление под угрозой → устранить риск до попытки роста`:`Укрепление позиций: хорошие условия → углублять диалог, выходить на C-level`;case`RESCUE`:return`Критическая ситуация: срочное вмешательство → эскалировать до топ-менеджмента`;case`MAINTAIN`:return r===`HIGH`?`STABLE с высокой нагрузкой → оптимизировать процессы, снизить операционный риск`:`Стабильный клиент → держать SLA, минимум изменений, ежеквартальный QBR`;case`MONITOR`:return s===`AtRisk`||s===`Caution`?`Наблюдение с тревогой: ситуация ухудшается → усилить контакт`:`Мониторинг: клиент в норме → отслеживать изменения, реагировать на сигналы`;case`REVIEW`:return`Пересмотр STABLE → проверить актуальность условий, оценить продление`;case`INVEST`:return s===`Healthy`?`Момент для роста: клиент в хорошей зоне → расширять скоуп и закреплять партнёрство`:s===`Neutral`?`Инвестиция под вопросом: лояльность не подтверждает готовность → сначала выстроить доверие`:`Инвестиция под угрозой: тревожные сигналы → сначала устранить риск`;case`NURTURE`:return s===`AtRisk`||s===`Caution`?`Взращивание под угрозой: тревожные сигналы → сначала устранить риск`:s===`Healthy`?`Взращивание активно: клиент готов → углублять диалог и искать следующий шаг`:`Взращивание в ожидании: нет чётких сигналов → спровоцировать реакцию, проверить интерес`;case`EVALUATE`:return s===`Healthy`?`Оценка: хорошие сигналы → зафиксировать критерий инвестиции`:s===`Neutral`?`Оценка: сигналов недостаточно → установить дедлайн решения`:`Оценка под вопросом: тревожные сигналы → закрыть EVALUATE, пересмотреть категорию`;case`RECONSIDER`:return`Пересмотр категории: параметры не подтверждают стратегию → аудит до конца квартала`;case`MINIMAL`:return s===`AtRisk`||s===`Caution`?`Автопилот с сигналом: тревожные признаки → оценить стоит ли реагировать`:`Автопилот: клиент стабилен → минимум касаний, SLA в приоритете`;default:return`Данные не заполнены → добавьте параметры клиента`}},computeClient(e,t,n,r=[]){let i=Array.isArray(t)?t:[],a=Array.isArray(n)?n:[],o=Array.isArray(r)?r:[],s=i.filter(t=>t&&String(t.client_id)===String(e.id)).sort((e,t)=>e.year===t.year?e.month-t.month:e.year-t.year),l=a.filter(t=>t&&String(t.client_id)===String(e.id)).sort((e,t)=>e.year===t.year?e.month-t.month:e.year-t.year),u=null,d=null;for(let e=s.length-1;e>=0;e--){let t=s[e],n=l.find(e=>Number(e.month)===Number(t.month)&&Number(e.year)===Number(t.year));if(n){u=t,d=n;break}}!u&&s.length>0&&(u=s[s.length-1]),!d&&l.length>0&&(d=l[l.length-1]);let f=this.computeBCHS(u),p=this.computePC(d),m=this.loyaltyPct(f),h=null,g=o.filter(t=>String(t.client_id)===String(e.id)).sort((e,t)=>(e.month||``).localeCompare(t.month||``));if(g.length>0){let e=g[g.length-1],t=Array.isArray(e.members)?e.members:[],n=0,r=0;for(let i of t){let t=i.planned_hours!==null&&i.planned_hours!==void 0&&i.planned_hours!==``?Number(i.planned_hours):window.CalendarEngine?window.CalendarEngine.getPlannedHours(i.location||`BY`,e.month,i.allocation||1):Math.round(168*(i.allocation||1)),a=t>0?(i.actual_hours||0)/t:0;n+=t,r+=a*t}n>0&&(h=r/n)}let _=this.finalScore(f,p),v=_!==null&&h!==null&&h<.8?Math.round(_*.95*10)/10:_,y=this.healthSignal(f),b=this.loadSignal(p),x=this.potentialIdeal(e.bcg_category),S=this.potentialPct(v,e.bcg_category),C=e.key_account_priority||`MINIMAL`,w=e.complexity||`LOW`,T=this.actionBadge(C,y.key,e.status),ee=this.focusText(e,f,y,w),te=this.dashSection(C,y.key,e.status),E=s.map(e=>({month:e.month,year:e.year,bchs:this.computeBCHS(e),loyalty:this.loyaltyPct(this.computeBCHS(e)),label:`${c[e.month-1]} ${e.year}`})),ne=E,re=s,ie=l,D=u,O=d,k=this.trend3m(E),oe=S,A=e.phase||``,j=Number(e.monthly_revenue)||0,M=e.client_engagement||`Active`,N=e.stability||`MEDIUM`,se=e.managed_services_potential||`No`,P=0,F=0,I=A===`Winding Down`;if(I)P=.5,F=Math.round(j*.5);else{let e=M===`Reactive`?.3:M===`Active`?.1:.03,t=w===`HIGH`?.15:w===`MEDIUM`?.05:0,n=N===`LOW`?.1:N===`MEDIUM`?.04:0,r=se===`No`?.05:se===`Partial`?.02:0;P=e+t+n+r,F=Math.round(j*P)}let ce=Math.round(P*100),le=I?`neutral`:P>=.3?`danger`:P>=.15?`warning`:`positive`,ue=I?`#6B7280`:P>=.3?`#EF4444`:P>=.15?`#F59E0B`:`#10B981`,L=Number(e.total_hours)||0,R=I,z=!R&&L>0?Math.round(j/L/4.33):null,de=R||z===null?`#6B7280`:z>=500?`#10B981`:z>=200?`#F59E0B`:`#EF4444`,fe=R||z===null?`neutral`:z>=500?`positive`:z>=200?`warning`:`danger`,B={KEY:2.5,GROWTH:2,GROWTH_EARLY:1.75,STABLE:1.25,TAIL:.75},V={Junior:1.25,Standard:1,Senior:.8}[e.team_maturity||`Standard`]||1,pe=Math.round((B[e.bcg_category]||.5)*V*100)/100,H=ae.compute(e).priority_score;return{bchs:f,pcScore:p,loyalty:m,final:v,revenueEfficiency:h,health:y,load:b,monthly:E,monthlyData:ne,trend:k,badge:T,focus:ee,section:te,potential:S,potentialIdeal:x,pctPot:oe,ideal:x,bchsHistory:re,pcHistory:ie,curBCHSEntry:D,curPCEntry:O,riskRate:P,riskPct:ce,revenueAtRisk:F,riskCls:le,riskColor:ue,isWD:I,revenuePerHour:z,rphWD:R,rphColor:de,rphCls:fe,total_hours:pe,priority_score:H}}},oe=t({DashboardPage:()=>A}),A={allClients:[],allBCHS:[],allPC:[],computed:[],touchPoints:[],expandedId:null,activeTab:`today`,searchQ:``,async render(){let e=document.getElementById(`main-content`);e.innerHTML=`
      <div class="page-header">
        <div>
          <div class="page-title">Дашборд</div>
          <div class="page-subtitle" id="dash-summary">загрузка...</div>
        </div>
      </div>

      <div style="display:flex;gap:8px;align-items:center;
                  flex-wrap:wrap;margin-bottom:16px">
        <input type="text" class="search-input" id="dash-search"
               placeholder=" Поиск..." style="flex:1;min-width:160px"/>
        <div style="display:flex;gap:6px" id="dash-tabs"></div>
      </div>

      <div id="dash-body">
        <div class="empty-state">
          <div class="empty-state-icon">⏳</div>
          <div class="empty-state-title">Загружаем данные...</div>
        </div>
      </div>`,document.getElementById(`dash-search`).addEventListener(`input`,e=>{this.searchQ=e.target.value.toLowerCase(),this.renderList()}),await this.load()},async load(){try{[this.allClients,this.allBCHS,this.allPC,this.touchPoints]=await Promise.all([f.getClients(),f.getAllBCHSEntries(),f.getAllPCEntries(),f.getTouchPoints().catch(()=>[])]),this.computed=this.allClients.map(e=>({client:e,...k.computeClient(e,this.allBCHS,this.allPC)})),this._renderTabs(),this.renderList()}catch(e){console.error(`[DashboardPage.load]`,e),document.getElementById(`dash-body`).innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon"></div>
          <div class="empty-state-title">Ошибка загрузки данных</div>
        </div>`}},_touchUrgency(e,t,n){let r={KEY:14,GROWTH:21,GROWTH_EARLY:14,STABLE:42,TAIL:90}[t]??30,i=(this.touchPoints||[]).filter(t=>String(t.client_id)===String(e)&&t.completed_at).sort((e,t)=>new Date(t.completed_at)-new Date(e.completed_at))[0],a=i?Math.round((Date.now()-new Date(i.completed_at).getTime())/864e5):null,o=n?.bchs??null,s=n?.trend?.direction===`down`,c=n?.riskPct??0;return o!==null&&o<-10||s&&o!==null&&o<0||c>30?`immediate`:s&&o!==null&&o<20||c>15?`overdue`:a===null?`ok`:a>=r?`overdue`:a>=r*.75?`due`:`ok`},_touchBadgeHTML(e,t,n){let r=this._touchUrgency(e,t,n);if(r===`ok`)return``;let i={immediate:{bg:`#fef2f2`,color:`#ef4444`,border:`#fecaca`,text:` срочно`},overdue:{bg:`#fef2f2`,color:`#ef4444`,border:`#fecaca`,text:` просрочено`},due:{bg:`#fffbeb`,color:`#f59e0b`,border:`#fde68a`,text:` скоро`}}[r];return`<span style="font-size:10px;background:${i.bg};color:${i.color};
      border:1px solid ${i.border};border-radius:4px;padding:1px 6px;
      white-space:nowrap;vertical-align:middle">${i.text}</span>`},_actionText(e){return{"badge-intervene":` Нужно вмешаться`,"badge-protect-crit":` Под угрозой — защитить`,"badge-protect":` Держать и защищать`,"badge-invest":` Развивать`,"badge-monitor":` Наблюдать`,"badge-nurture":` Взращивать`,"badge-evaluate":` Оценить`,"badge-reconsider":` Пересмотреть`,"badge-minimal-alert":` Есть сигналы`,"badge-autopilot":` Автопилот`}[e.cls]??e.label},_nextAction(e){let{health:t,badge:n,client:r,trend:i,riskPct:a,loyalty:o}=e,s=t.key,c=r.key_account_priority;return n.cls===`badge-intervene`?`Экстренная встреча с ЛПР`:n.cls===`badge-protect-crit`?`Звонок сегодня — выяснить причину`:a>30?`Проверить риск оттока — позвонить`:i?.direction===`down`?`Тренд падает — назначить check-in`:s===`Caution`?`Усилить ритм касаний`:c===`INVEST`&&s===`Healthy`?`Предложить расширение скоупа`:c===`MAINTAIN`?`Провести QBR этот квартал`:c===`EVALUATE`?`Установить дедлайн решения`:o!==null&&o<40?`Лояльность низкая — срочный контакт`:null},_renderTabs(){let e=this.computed.filter(e=>this._touchUrgency(e.client.id,e.client.bcg_category,e)===`immediate`||e.section===`alert`).length,t=this.computed.filter(e=>{let t=this._touchUrgency(e.client.id,e.client.bcg_category,e);return t===`immediate`||t===`overdue`||t===`due`}).length,n=this.computed.length,r=document.getElementById(`dash-summary`);r&&(r.textContent=e>0?`${e} клиент${e>1?`а`:``} требуют внимания · обновлено ${new Date().toLocaleTimeString(`ru-RU`,{hour:`2-digit`,minute:`2-digit`})}`:`Всё под контролем · обновлено ${new Date().toLocaleTimeString(`ru-RU`,{hour:`2-digit`,minute:`2-digit`})}`,r.style.color=e>0?`#ef4444`:``);let i=[{key:`today`,label:`Сегодня`,count:void 0},{key:`urgent`,label:`Внимание`,count:e},{key:`touch`,label:`Касания`,count:t},{key:`all`,label:`Портфель`,count:n}];document.getElementById(`dash-tabs`).innerHTML=i.map(e=>`
      <button class="dash-tab${this.activeTab===e.key?` active`:``}"
              data-tab="${e.key}"
              style="padding:6px 14px;border-radius:20px;font-size:13px;font-weight:500;
                     border:1.5px solid ${this.activeTab===e.key?`#6366f1`:`var(--border)`};
                     background:${this.activeTab===e.key?`#6366f1`:`var(--surface)`};
                     color:${this.activeTab===e.key?`#fff`:`var(--text-secondary)`};
                     cursor:pointer;transition:all .15s">
        ${e.label}${e.count==null?``:`<span style="opacity:0.75;font-size:11px;margin-left:4px">${e.count}</span>`}
      </button>`).join(``),document.querySelectorAll(`.dash-tab`).forEach(e=>{e.addEventListener(`click`,()=>{this.activeTab=e.dataset.tab,this._renderTabs(),this.renderList()})})},filtered(){let e=this.computed;return this.searchQ&&(e=e.filter(e=>e.client.name.toLowerCase().includes(this.searchQ))),this.activeTab===`urgent`&&(e=e.filter(e=>this._touchUrgency(e.client.id,e.client.bcg_category,e)===`immediate`||e.section===`alert`)),this.activeTab===`touch`&&(e=e.filter(e=>{let t=this._touchUrgency(e.client.id,e.client.bcg_category,e);return t===`immediate`||t===`overdue`||t===`due`})),e},renderList(){if(this.activeTab===`today`){this._renderToday();return}let e=this.filtered();if(e.length===0){document.getElementById(`dash-body`).innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon"></div>
          <div class="empty-state-title">
            ${this.activeTab===`urgent`?`Нет срочных клиентов`:this.activeTab===`touch`?`Все касания в порядке`:`Клиенты не найдены`}
          </div>
        </div>`;return}let t=[...e].sort((e,t)=>{let n={alert:0,work:1,auto:2};return n[e.section]===n[t.section]?(t.riskPct??0)-(e.riskPct??0):n[e.section]-n[t.section]}),n=[{key:`alert`,title:` Действуй сейчас`},{key:`work`,title:` Держи под контролем`},{key:`auto`,title:` Стабильные`}],r=``;for(let e of n){let n=t.filter(t=>t.section===e.key);n.length&&(r+=`
        <div style="margin-bottom:20px">
          <div class="section-header">
            ${e.title}
            <span class="section-count">${n.length}</span>
          </div>
          ${n.map(e=>this._renderRow(e)).join(``)}
        </div>`)}let i=t.filter(t=>t.bchs===null&&!e.find(e=>e!==t&&e.section));i.length&&this.activeTab===`all`&&(r+=`
        <div style="margin-bottom:20px">
          <div class="section-header" style="color:var(--text-muted)">
            ○ Нет данных
            <span class="section-count">${i.length}</span>
          </div>
          ${i.map(e=>this._renderRow(e)).join(``)}
        </div>`),document.getElementById(`dash-body`).innerHTML=r,this._bindRowClicks()},_renderRow(e){let t=e.client,n=this.expandedId===t.id,r=this._nextAction(e),i=this._touchBadgeHTML(t.id,t.bcg_category,e),a=e.loyalty,o=`var(--border)`,s=e.trend?e.trend.delta>0?` ↗`:e.trend.delta<0?` ↘`:``:``,c=`<span style="background:${a===null?`#f1f5f9`:a>=60?`#dcfce7`:a>=40?`#fef9c3`:`#fee2e2`};color:${a===null?`#94a3b8`:a>=60?`#15803d`:a>=40?`#b45309`:`#b91c1c`};
      border-radius:6px;padding:3px 10px;font-size:12px;font-weight:700;white-space:nowrap">
      ${a===null?`—`:a+`%`+s}
    </span>`,l=(e.health?.label??``).replace(/\p{Emoji}/gu,``).trim(),u=e.health?.key??``,d=l&&u!==`Healthy`&&u!==`Neutral`?`
      <span style="color:${u===`Healthy`?`#16a34a`:u===`Neutral`?`#94a3b8`:`#ea580c`};font-size:11px;font-weight:500;white-space:nowrap">
        ${l}
      </span>`:``,f=e.revenueAtRisk>0?`
      <span style="background:#fee2e2;color:#b91c1c;
        border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;white-space:nowrap">

        $${e.revenueAtRisk.toLocaleString(`ru-RU`)} риск
      </span>`:``,p={KEY:`KEY`,GROWTH:`GROWTH`,GROWTH_EARLY:`GROWTH early`,STABLE:`Stable`,TAIL:`Tail`}[t.bcg_category]??t.bcg_category??``,m=t.monthly_revenue?`$`+Number(t.monthly_revenue).toLocaleString(`ru-RU`)+`/мес`:``;return`
      <div class="client-row${n?` expanded`:``}" data-id="${t.id}"
           style="background:var(--surface);border:1px solid ${o};
                  border-radius:10px;margin-bottom:6px;overflow:hidden;
                  display:flex;align-items:stretch;position:relative">

        <!-- Левые 70% — инфо -->
        <div style="flex:1;padding:10px 14px;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <button data-action="go-detail" data-id="${t.id}"
                    onclick="event.stopPropagation()"
                    style="background:rgba(255,255,255,0.8);border:1px solid ${o};
                           border-radius:7px;padding:3px 10px;font-size:14px;font-weight:700;
                           color:#0f172a;cursor:pointer;transition:all .15s;
                           line-height:1.5;white-space:nowrap"
                    onmouseover="this.style.background='#fff'"
                    onmouseout="this.style.background='rgba(255,255,255,0.8)'">
              ${t.name}
            </button>
            ${p?`<span style="font-size:11px;color:#b0bac6">${p}</span>`:``}
            ${m?`<span style="font-size:11px;color:#94a3b8">${m}</span>`:``}
            ${i}
            ${c}
            ${d}
            ${f}
          </div>
          ${r?`
          <div style="font-size:11px;color:#94a3b8;margin-top:5px">${r}</div>
          `:``}
        </div>

        <!-- Правые 30% — зона касания, визуально часть карточки -->
        <button data-action="touch" data-id="${t.id}" data-name="${t.name}"
                onclick="event.stopPropagation()"
                style="width:28%;max-width:110px;flex-shrink:0;
                       background:transparent;border:none;
                       border-left:1px solid rgba(0,0,0,0.06);
                       cursor:pointer;display:flex;flex-direction:column;
                       align-items:center;justify-content:center;gap:5px;
                       color:#94a3b8;transition:all .2s;padding:8px"
                onmouseover="this.style.background='rgba(0,0,0,0.03)';this.style.color='#6366f1'"
                onmouseout="this.style.background='transparent';this.style.color='#94a3b8'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2"/>
      <path d="M14 10V5a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
      <path d="M10 9.5V4a2 2 0 00-2-2 2 2 0 00-2 2v8"/>
      <path d="M6 14v-3a2 2 0 00-2-2 2 2 0 00-2 2v3c0 4 3 7 8 7s8-3 8-7v-1a2 2 0 00-2-2 2 2 0 00-2 2"/>
    </svg>
        </button>

      </div>
      ${n?this._renderExpanded(e):``}`},_renderExpanded(e){let t=e.client,n=a[t.bcg_category],r=(this.touchPoints||[]).filter(e=>String(e.client_id)===String(t.id)&&e.completed_at).sort((e,t)=>new Date(t.completed_at)-new Date(e.completed_at))[0],i=r?this._daysAgo(new Date(r.completed_at)):`никогда`;return`
      <div class="row-detail" data-detail-id="${t.id}">
        <div class="row-detail-grid">

          <div class="detail-stat">
            <span class="detail-stat-label">Лояльность</span>
            <span class="detail-stat-value">
              ${e.loyalty===null?`—`:e.loyalty+`%`}
            </span>
            <span class="detail-stat-sub">
              ${e.trend?e.trend.label:`нет тренда`}
            </span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">bCHS · Здоровье</span>
            <span class="detail-stat-value">${e.bchs===null?`—`:e.bchs}</span>
            <span class="detail-stat-sub">${e.health.label}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Риск выручки</span>
            <span class="detail-stat-value" style="color:${e.riskColor}">

              $${(e.revenueAtRisk||0).toLocaleString(`ru-RU`)}
            </span>
            <span class="detail-stat-sub">${e.riskPct}% от MR</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Потенциал</span>
            <span class="detail-stat-value">
              ${e.pctPot===null?`—`:e.pctPot+`%`}
            </span>
            <span class="detail-stat-sub">от идеала ${e.ideal}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">BCG · Приоритет</span>
            <span class="detail-stat-value" style="font-size:13px">
              ${n?n.label:`—`}
            </span>
            <span class="detail-stat-sub">${t.key_account_priority}</span>
          </div>

          <div class="detail-stat">
            <span class="detail-stat-label">Последнее касание</span>
            <span class="detail-stat-value" style="font-size:13px">${i}</span>
            <span class="detail-stat-sub">
              план: каждые ${{KEY:14,GROWTH:21,GROWTH_EARLY:14,STABLE:42,TAIL:90}[t.bcg_category]??30}д
            </span>
          </div>

        </div>



      </div>`},_renderToday(){let e=new Date,t={phone:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .93h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,alert:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,refresh:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`,trendDown:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`,arrow:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,check:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,touch:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,card:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,call:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .93h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,meet:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,mail:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,chat:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,chart:`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`},n={call:`<span style="color:#6366f1">${t.call}</span>`,meeting:`<span style="color:#8b5cf6">${t.meet}</span>`,qbr:`<span style="color:#0ea5e9">${t.chart}</span>`,email:`<span style="color:#64748b">${t.mail}</span>`,checkin:`<span style="color:#10b981">${t.chat}</span>`},r=this.computed.filter(e=>{let t=this._touchUrgency(e.client.id,e.client.bcg_category,e);return t===`immediate`||t===`overdue`}).sort((e,t)=>{let n={alert:0,work:1,auto:2};return n[e.section]===n[t.section]?(t.riskPct??0)-(e.riskPct??0):n[e.section]-n[t.section]}).slice(0,3),i=this.computed.filter(e=>e.riskPct>15||e.trend?.direction===`down`&&e.bchs!==null&&e.bchs<20).filter(e=>!r.find(t=>t.client.id===e.client.id)).sort((e,t)=>(t.riskPct??0)-(e.riskPct??0)).slice(0,4),a=Date.now()-48*36e5,o=(this.touchPoints||[]).filter(e=>e.completed_at&&new Date(e.completed_at).getTime()>a).sort((e,t)=>new Date(t.completed_at)-new Date(e.completed_at)).slice(0,5);o.map(e=>{let r=this.computed.find(t=>String(t.client.id)===String(e.client_id));if(!r)return``;n[e.type]??`${t.touch}`;let i=Math.round((Date.now()-new Date(e.completed_at))/6e4),a=i<60?`${i} мин. назад`:i<1440?`${Math.round(i/60)} ч. назад`:`${Math.round(i/1440)} дн. назад`,o=(e.notes||``).split(`
`).map(e=>e.replace(/^[]\s[\w\s]+:\n?/,``).trim()).find(e=>e.length>3)??``,s=o.slice(0,72)+(o.length>72?`…`:``),c={KEY:`KEY`,GROWTH:`GROWTH`,GROWTH_EARLY:`GROWTH early`,STABLE:`Stable`,TAIL:`Tail`}[r.client.bcg_category]??r.client.bcg_category??``,l=r.client.monthly_revenue?`$`+Number(r.client.monthly_revenue).toLocaleString(`ru-RU`)+`/мес`:``,u=r.loyalty,d=u===null?``:`
      <span style="background:${u===null?`#f1f5f9`:u>=60?`#dcfce7`:u>=40?`#fef9c3`:`#fee2e2`};color:${u===null?`#94a3b8`:u>=60?`#15803d`:u>=40?`#b45309`:`#b91c1c`};
        border-radius:6px;padding:3px 10px;font-size:12px;font-weight:700">
        ${u}%
      </span>`;return`
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;margin-bottom:6px;overflow:hidden;
                  display:flex;align-items:stretch;min-height:56px">
        <div data-action="go-detail" data-id="${r.client.id}"
             style="flex:1;padding:10px 14px;min-width:0;cursor:pointer;
                    display:flex;flex-direction:column;justify-content:center;gap:5px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-size:14px;font-weight:700;color:#0f172a;line-height:1.5">
              ${r.client.name}
            </span>
            ${c?`<span style="font-size:11px;color:#b0bac6">${c}</span>`:``}
            ${l?`<span style="font-size:11px;color:#94a3b8">${l}</span>`:``}
            ${d}
            <span style="flex:1"></span>
            <span style="font-size:11px;color:#94a3b8">${a}</span>
          </div>
          ${s?`
          <div style="font-size:11px;color:#94a3b8;
                      overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            ${s}
          </div>`:``}
        </div>
        <button data-action="touch"
                data-id="${r.client.id}" data-name="${r.client.name}"
                style="width:28%;max-width:100px;flex-shrink:0;
                       background:#f8fafc;border:none;
                       border-left:1px solid var(--border);
                       cursor:pointer;display:flex;align-items:center;
                       justify-content:center;color:#94a3b8;transition:all .2s"
                onmouseover="this.style.background='#f1f5f9';this.style.color='#6366f1'"
                onmouseout="this.style.background='#f8fafc';this.style.color='#94a3b8'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2"/>
      <path d="M14 10V5a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
      <path d="M10 9.5V4a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
      <path d="M6 14v-3a2 2 0 00-2-2 2 2 0 00-2 2v3c0 4 3 7 8 7s8-3 8-7v-1a2 2 0 00-2-2 2 2 0 00-2 2"/>
    </svg>
        </button>
      </div>`}).join(``);let s=(e,t)=>{let n=e.client,r=this._touchUrgency(n.id,n.bcg_category,e)===`immediate`,i=r?`#e89090`:`#d4a843`,a=r?`#fdf4f4`:`#fdfaf0`,o=r?`#f0dada`:`#f0e8c0`,s=r?`#f5d5d5`:`#f5e8b0`,c=r?`срочно`:`скоро`,l=this._nextAction(e)??`Записать касание`;e.loyalty!==null&&`${e.loyalty}`,e.loyalty===null||e.loyalty>=60||e.loyalty;let u=e.loyalty===null?`#f1f5f9`:e.loyalty>=60?`#dcfce7`:e.loyalty>=40?`#fef9c3`:`#fee2e2`,d=e.loyalty===null?`#94a3b8`:e.loyalty>=60?`#15803d`:e.loyalty>=40?`#b45309`:`#b91c1c`,f=e.trend?e.trend.delta>0?` ↗`:e.trend.delta<0?` ↘`:``:``,p=`<span style="background:${u};color:${d};
      border-radius:6px;padding:3px 10px;font-size:12px;font-weight:700;white-space:nowrap">
      ${e.loyalty===null?`—`:e.loyalty+`%`+f}
    </span>`,m={KEY:`KEY`,GROWTH:`GROWTH`,GROWTH_EARLY:`GROWTH early`,STABLE:`Stable`,TAIL:`Tail`}[n.bcg_category]??n.bcg_category??``,h=n.monthly_revenue?`$`+Number(n.monthly_revenue).toLocaleString(`ru-RU`)+`/мес`:``;return`
      <div style="background:${a};border:1px solid ${o};
                  border-radius:12px;margin-bottom:8px;overflow:hidden;
                  display:flex;align-items:stretch">

        <!-- Левая часть — весь клик = карточка -->
        <div data-action="go-detail" data-id="${n.id}"
             style="flex:1;padding:12px 14px;min-width:0;cursor:pointer">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap">
            <span style="font-size:10px;font-weight:600;color:${i};
                         background:${s}60;border-radius:5px;
                         padding:2px 7px;letter-spacing:.03em">
              #${t} · ${c}
            </span>
            ${m?`<span style="font-size:11px;color:#b0bac6">${m}</span>`:``}
            ${h?`<span style="font-size:11px;color:#94a3b8">${h}</span>`:``}
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-size:14px;font-weight:700;color:#0f172a;line-height:1.5">
              ${n.name}
            </span>
            ${p}
          </div>
          ${l?`
          <div style="font-size:11px;color:#94a3b8;margin-top:5px">${l}</div>
          `:``}
        </div>

        <!-- Правая зона — касание -->
        <button data-action="touch" data-id="${n.id}" data-name="${n.name}"
                style="width:28%;max-width:100px;flex-shrink:0;background:${i}15;
                       border:none;border-left:1px solid ${o};
                       cursor:pointer;display:flex;flex-direction:column;
                       align-items:center;justify-content:center;
                       color:${i};transition:all .2s;padding:8px"
                onmouseover="this.style.background='${i}28'"
                onmouseout="this.style.background='${i}15'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2"/>
      <path d="M14 10V5a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
      <path d="M10 9.5V4a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
      <path d="M6 14v-3a2 2 0 00-2-2 2 2 0 00-2 2v3c0 4 3 7 8 7s8-3 8-7v-1a2 2 0 00-2-2 2 2 0 00-2 2"/>
    </svg>
        </button>

      </div>`},c=e=>{let t=e.client,n=e.riskPct>30,r=n?`#e07070`:`#d4a843`,i=n?`#fdf4f4`:`#fdfaf0`,a=n?`#f0dada`:`#f0e8c0`,o={KEY:`KEY`,GROWTH:`GROWTH`,GROWTH_EARLY:`GROWTH early`,STABLE:`Stable`,TAIL:`Tail`}[t.bcg_category]??t.bcg_category??``,s=t.monthly_revenue?`$`+Number(t.monthly_revenue).toLocaleString(`ru-RU`)+`/мес`:``,c=e.loyalty,l=c===null?`#f1f5f9`:c>=60?`#dcfce7`:c>=40?`#fef9c3`:`#fee2e2`,u=c===null?`#94a3b8`:c>=60?`#15803d`:c>=40?`#b45309`:`#b91c1c`;return`
      <div style="background:${i};border:1px solid ${a};
                  border-radius:12px;margin-bottom:6px;overflow:hidden;
                  display:flex;align-items:stretch;min-height:56px">

        <div data-action="go-detail" data-id="${t.id}"
             style="flex:1;padding:10px 14px;min-width:0;cursor:pointer;
                    display:flex;flex-direction:column;justify-content:center;gap:5px"
             onmouseover="this.style.opacity='.85'"
             onmouseout="this.style.opacity='1'">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-size:14px;font-weight:700;color:#0f172a">${t.name}</span>
            ${o?`<span style="font-size:11px;color:#b0bac6">${o}</span>`:``}
            ${s?`<span style="font-size:11px;color:#94a3b8">${s}</span>`:``}
            ${c===null?``:`
              <span style="background:${l};color:${u};
                border-radius:6px;padding:3px 10px;font-size:12px;font-weight:700">
                ${c}%
              </span>`}
            <span style="background:#fee2e2;color:#b91c1c;
              border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600">
              ${e.riskPct}% риск
            </span>
            ${e.trend?.direction===`down`?`<span style="font-size:11px;color:#f87171">тренд ↘</span>`:``}
          </div>
        </div>

        <button data-action="touch" data-id="${t.id}" data-name="${t.name}"
                style="width:28%;max-width:100px;flex-shrink:0;
                       background:${r}15;border:none;
                       border-left:1px solid ${a};
                       cursor:pointer;display:flex;align-items:center;
                       justify-content:center;color:${r};transition:all .2s"
                onmouseover="this.style.background='${r}28'"
                onmouseout="this.style.background='${r}15'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2"/>
      <path d="M14 10V5a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
      <path d="M10 9.5V4a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
      <path d="M6 14v-3a2 2 0 00-2-2 2 2 0 00-2 2v3c0 4 3 7 8 7s8-3 8-7v-1a2 2 0 00-2-2 2 2 0 00-2 2"/>
    </svg>
        </button>
      </div>`},l=e.getHours(),u=l<12?`Доброе утро`:l<17?`Добрый день`:`Добрый вечер`,d=e.toLocaleDateString(`ru-RU`,{weekday:`long`,day:`numeric`,month:`long`}),f=this.computed.filter(e=>{let t=this._touchUrgency(e.client.id,e.client.bcg_category,e);return t===`overdue`||t===`immediate`}).length,p=Date.now()-7*864e5,m=(this.touchPoints||[]).filter(e=>e.completed_at&&new Date(e.completed_at).getTime()>p).length,h=`
    <div class="pf-kpi-grid-new" id="dash-kpi-grid">
      ${[{id:`kpi-calls`,icon:t.phone,iconBg:`#ede9fe`,iconColor:`#7c3aed`,label:`Позвони сегодня`,value:r.length,valueColor:r.length>0?`#7c3aed`:`#10b981`,hint:r.length>0?`срочных касаний`:`всё под контролем`,detailTitle:`Срочные касания`,detail:r.length?r.map((e,t)=>s(e,t+1)).join(``):`<div style="font-size:12px;color:#94a3b8;padding:8px 0">Срочных нет</div>`},{id:`kpi-risk`,icon:t.alert,iconBg:`#fef3c7`,iconColor:`#d97706`,label:`В риске`,value:i.length,valueColor:i.length>0?`#ef4444`:`#10b981`,hint:i.length>0?`клиентов требуют внимания`:`рисков нет`,detailTitle:`Клиенты в риске`,detail:i.length?i.map(e=>c(e)).join(``):`<div style="font-size:12px;color:#94a3b8;padding:8px 0">Рисков нет</div>`},{id:`kpi-overdue`,icon:t.touch,iconBg:`#fff7ed`,iconColor:`#ea580c`,label:`Просрочено`,value:f,valueColor:f>0?`#ea580c`:`#10b981`,hint:f>0?`касаний просрочено`:`касания в порядке`,detailTitle:`Просроченные касания`,detail:(()=>{let e=this.computed.filter(e=>{let t=this._touchUrgency(e.client.id,e.client.bcg_category,e);return t===`overdue`||t===`immediate`}).slice(0,5);return e.length?e.map((e,t)=>s(e,t+1)).join(``):`<div style="font-size:12px;color:#94a3b8;padding:8px 0">Всё в порядке</div>`})()},{id:`kpi-touches`,icon:t.refresh,iconBg:`#e0f2fe`,iconColor:`#0284c7`,label:`Касания за 7 дней`,value:m,valueColor:m>0?`#0284c7`:`#94a3b8`,hint:o.length>0?`${o.length} за последние 48ч`:`активность низкая`,detailTitle:`Последние касания`,detail:o.length?o.slice(0,5).map(e=>{let t=this.computed.find(t=>String(t.client.id)===String(e.client_id));return t?c(t):``}).join(``):`<div style="font-size:12px;color:#94a3b8;padding:8px 0">Касаний не было</div>`}].map(e=>`
        <div class="pf-kpi-card" data-card="${e.id}">
          <div class="pf-kpi-card-collapsed">
            <div class="pf-kpi-card-icon">
              <div style="width:28px;height:28px;border-radius:8px;background:${e.iconBg};
                          display:flex;align-items:center;justify-content:center;
                          color:${e.iconColor};flex-shrink:0">${e.icon}</div>
            </div>
            <span class="pf-kpi-card-label">${e.label}</span>
            <div class="pf-kpi-card-value" style="color:${e.valueColor}">${e.value}</div>
            <div class="pf-kpi-card-hint">${e.hint}</div>
          </div>
          <div class="pf-kpi-card-detail"
               style="max-height:340px;overflow-y:auto;
                      scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent">
            <div class="kpi-det-title">${e.detailTitle}</div>
            ${e.detail}
          </div>
        </div>`).join(``)}
    </div>`;document.getElementById(`dash-body`).innerHTML=`

    <div style="margin-bottom:20px">
      <div style="font-size:20px;font-weight:700;
                  color:var(--text-primary);letter-spacing:-.02em">${u}</div>
      <div style="font-size:13px;color:var(--text-muted);
                  margin-top:3px;text-transform:capitalize">${d}</div>
    </div>

    ${h}`,this._bindRowClicks()},_daysAgo(e){let t=Math.round((Date.now()-e.getTime())/864e5);return t===0?`сегодня`:t===1?`вчера`:t<7?`${t} дн. назад`:t<30?`${Math.round(t/7)} нед. назад`:`${Math.round(t/30)} мес. назад`},_bindRowClicks(){let e=document.getElementById(`dash-kpi-grid`);if(e){let t=[...e.querySelectorAll(`.pf-kpi-card`)].map(e=>e.dataset.card);e.querySelectorAll(`.pf-kpi-card`).forEach(e=>{e.style.removeProperty(`border-right`),e.style.removeProperty(`padding`),e.style.removeProperty(`min-width`),e.style.removeProperty(`flex`)}),e.style.removeProperty(`border`),e.style.removeProperty(`border-radius`),e.style.removeProperty(`overflow`),e.style.removeProperty(`gap`);let n=()=>{let n=e.querySelector(`.pf-kpi-sidebar`);n&&([...n.querySelectorAll(`.pf-kpi-card`)].forEach(t=>e.appendChild(t)),n.remove()),e.classList.remove(`has-active`),t.forEach(t=>{let n=e.querySelector(`.pf-kpi-card[data-card="`+t+`"]`);n&&e.appendChild(n)}),e.querySelectorAll(`.pf-kpi-card`).forEach(e=>{e.classList.remove(`pf-kpi-active`,`pf-kpi-dimmed`)})};document.addEventListener(`click`,t=>{e.contains(t.target)||n()}),e.addEventListener(`click`,async r=>{r.stopPropagation();let i=r.target.closest(`[data-action="go-detail"]`);if(i){window.App.navigate(`detail`,i.dataset.id);return}let a=r.target.closest(`.pf-kpi-card`);if(!a)return;if(r.target.closest(`.pf-kpi-card-close`)){n();return}if(a.classList.contains(`pf-kpi-active`)){if(r.target.closest(`button, a, input, select, [data-action]`))return;n();return}n(),e.querySelectorAll(`.pf-kpi-card`).forEach(e=>{e.classList.remove(`pf-kpi-active`),e.classList.add(`pf-kpi-dimmed`)}),a.classList.remove(`pf-kpi-dimmed`),a.classList.add(`pf-kpi-active`);let o=document.createElement(`div`);o.className=`pf-kpi-sidebar`,t.filter(e=>e!==a.dataset.card).forEach(t=>{let n=e.querySelector(`.pf-kpi-card[data-card="`+t+`"]`);n&&o.appendChild(n)}),e.appendChild(o),e.classList.add(`has-active`)})}document.querySelectorAll(`.client-row`).forEach(e=>{e.addEventListener(`click`,t=>{if(t.target.closest(`[data-action]`))return;let n=e.dataset.id;this.expandedId=this.expandedId===n?null:n,this.renderList(),document.getElementById(`dash-search`).value=this.searchQ})}),document.querySelectorAll(`[data-action="go-detail"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),window.App.navigate(`detail`,e.dataset.id)})}),document.querySelectorAll(`[data-action="go-entry"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),window.App.navigate(`entry`,e.dataset.id)})}),document.querySelectorAll(`[data-action="touch"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),this._openTouchModal(e.dataset.id,e.dataset.name)})})},openStatusModal(e,t){let n=new Date,r=s.map((e,t)=>`<option value="${t+1}" ${t+1===n.getMonth()+1?`selected`:``}>${e}</option>`).join(``),i=[n.getFullYear()-1,n.getFullYear(),n.getFullYear()+1].map(e=>`<option value="${e}" ${e===n.getFullYear()?`selected`:``}>${e}</option>`).join(``);window.App.openModal(`
      <div style="padding:4px 0 16px">
        <div style="font-size:16px;font-weight:600;margin-bottom:4px"> Статус клиента</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">${t}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <select class="form-select" id="status-month" style="flex:1">${r}</select>
        <select class="form-select" id="status-year"  style="flex:1">${i}</select>
      </div>
      <textarea id="status-text" class="form-textarea" rows="5"
        placeholder="Опишите что происходило с клиентом в этом месяце..."
        style="width:100%;resize:vertical;min-height:100px;margin-bottom:10px"></textarea>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" id="status-ai-btn"> Распознать сигналы</button>
        <span id="status-ai-status" style="font-size:12px;color:var(--text-muted)"></span>
      </div>
      <div id="status-ai-result" class="hidden"
           style="margin-bottom:14px;padding:10px 14px;background:rgba(16,185,129,0.08);
                  border:1px solid rgba(16,185,129,0.2);border-radius:8px;font-size:12px;
                  color:var(--text-secondary);line-height:1.6"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary btn-sm" id="status-cancel-btn">Отмена</button>
        <button class="btn btn-primary btn-sm"   id="status-save-btn"> Сохранить</button>
      </div>`),document.getElementById(`status-cancel-btn`).addEventListener(`click`,()=>window.App.closeModal()),document.getElementById(`status-ai-btn`).addEventListener(`click`,()=>this._runStatusAI()),document.getElementById(`status-save-btn`).addEventListener(`click`,()=>this._saveStatus(e))},async _runStatusAI(){let e=(document.getElementById(`status-text`)?.value||``).trim();if(!e){window.App.toast(`Введите текст статуса`,`error`);return}let t=document.getElementById(`status-ai-btn`),n=document.getElementById(`status-ai-status`),r=document.getElementById(`status-ai-result`);t.disabled=!0,t.textContent=`⏳ Анализирую...`,n.textContent=`Отправляю запрос...`;try{let t=(await f.callAI({type:`status`,text:e}))?.choices?.[0]?.message?.content??``,i=t.match(/\{[\s\S]*\}/),a=JSON.parse(i?i[0]:t);document.getElementById(`status-save-btn`).dataset.parsed=JSON.stringify(a);let o=Object.values(a.signals||{}).filter(Boolean).length;r.classList.remove(`hidden`),r.innerHTML=`
        <strong> Найдено сигналов: ${o}</strong>
        ${a.explanation?`<div style="margin-top:4px;color:var(--text-muted);font-style:italic"> ${a.explanation}</div>`:``}
        <div style="margin-top:4px;font-size:11px;color:var(--text-muted)">
          Нажмите «Сохранить» чтобы применить
        </div>`,n.textContent=` ${o} сигналов`,window.App.toast(` AI нашёл ${o} сигналов`,`success`)}catch(e){n.textContent=` Ошибка`,window.App.toast(`Ошибка AI: `+e.message,`error`)}finally{t.disabled=!1,t.textContent=` Распознать сигналы`}},async _saveStatus(e){let t=parseInt(document.getElementById(`status-month`).value),r=parseInt(document.getElementById(`status-year`).value),a=(document.getElementById(`status-text`)?.value||``).trim(),o=document.getElementById(`status-save-btn`).dataset.parsed,s=o?JSON.parse(o):null,c=document.getElementById(`status-save-btn`);c.disabled=!0,c.textContent=`⏳ Сохраняем...`;try{let o={};for(let e of Object.keys(n))o[e]=!!s?.signals?.[e];a&&(o.status_note=a);let c={};for(let e of Object.keys(i)){let t=s?.pc?.[e];c[e]=t>=1&&t<=5?t:null}await Promise.all([f.saveBCHSEntry(e,t,r,o),f.savePCEntry(e,t,r,c)]),f.clearCache(),window.App.closeModal(),window.App.toast(` Статус сохранён!`,`success`),await this.load()}catch{window.App.toast(` Ошибка сохранения`,`error`)}finally{c.disabled=!1,c.textContent=` Сохранить`}},_openTouchModal(e,t){let r=new Date,a=s.map((e,t)=>`<option value="${t+1}" ${t+1===r.getMonth()+1?`selected`:``}>${e}</option>`).join(``),o=[r.getFullYear()-1,r.getFullYear(),r.getFullYear()+1].map(e=>`<option value="${e}" ${e===r.getFullYear()?`selected`:``}>${e}</option>`).join(``),c=[[`call`,` Звонок`],[`meeting`,` Встреча`],[`qbr`,` QBR`],[`email`,` Email`],[`checkin`,` Check-in`]].map(([e,t])=>`<option value="${e}">${t}</option>`).join(``),l=0,u=null,d=[{emoji:``,title:`Транскрипт`,hint:`Вставь запись звонка или заметки — AI заполнит всё сам`},{emoji:``,title:`Основное`,hint:`Проверь и дополни главное`},{emoji:``,title:`Детали`,hint:`Стратегия, результат, блокеры — если нужно`}];if(!document.getElementById(`touch-wiz-styles`)){let e=document.createElement(`style`);e.id=`touch-wiz-styles`,e.textContent=`
      .tw-label {
        font-size:11px;font-weight:700;color:#94a3b8;
        text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;display:block
      }
      .tw-field { display:flex;flex-direction:column }
            .tw-textarea {
  width:100%;box-sizing:border-box;
  resize:none;overflow-y:auto;
  font-size:13px;line-height:1.6;
  border:1.5px solid #e2e8f0;border-radius:10px;
  padding:12px 14px;background:#f8fafc;
  transition:border-color .15s, background .15s;
  font-family:inherit;
  min-height:80px;
  max-height:220px;
}
.tw-textarea:focus {
  border-color:#6366f1;outline:none;
  background:#fff;box-shadow:0 0 0 3px #e0e7ff
}
    `,document.head.appendChild(e)}let p=()=>d.map((e,t)=>`
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">
      <div style="
        width:36px;height:36px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:15px;transition:all .2s;
        ${t<l?`background:#22c55e;color:#fff;box-shadow:0 2px 8px #86efac`:t===l?`background:#6366f1;color:#fff;box-shadow:0 2px 10px #c7d2fe`:`background:#f1f5f9;color:#94a3b8`}
      ">${t<l?``:e.emoji}</div>
      <div style="font-size:10px;font-weight:${t===l?`700`:`500`};
        color:${t===l?`#6366f1`:t<l?`#22c55e`:`#94a3b8`}">
        ${e.title}
      </div>
    </div>
    ${t<d.length-1?`
      <div style="flex:1;height:2px;margin-top:18px;max-width:48px;border-radius:2px;
        background:${t<l?`#86efac`:`#e2e8f0`}"></div>
    `:``}
  `).join(``),m=()=>l===0?`

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">
        <div class="tw-field">
          <label class="tw-label">Тип</label>
          <select class="form-select" id="touch-type">${c}</select>
        </div>
        <div class="tw-field">
          <label class="tw-label">Месяц</label>
          <select class="form-select" id="touch-month">${a}</select>
        </div>
        <div class="tw-field">
          <label class="tw-label">Год</label>
          <select class="form-select" id="touch-year">${o}</select>
        </div>
      </div>

      <div class="tw-field">
        <label class="tw-label">Транскрипт или заметки</label>
                <textarea id="touch-ai-input" class="tw-textarea"
          style="min-height:120px;max-height:320px"
          placeholder="Вставь транскрипт Bluedot..."></textarea>

AI сам разберёт структуру, выделит задачи, шаги и сигналы по клиенту."></textarea>
      </div>

      <div style="display:flex;gap:10px;align-items:center;margin-top:14px">
        <button id="touch-ai-btn" class="btn btn-primary"
                style="background:#6366f1;border-color:#6366f1;min-width:130px">
           Разобрать
        </button>
        <span id="touch-ai-status" style="font-size:12px;color:var(--text-muted)"></span>
      </div>

      <div id="touch-ai-result" class="hidden"
           style="margin-top:14px;padding:12px 14px;
                  background:rgba(16,185,129,0.08);
                  border:1px solid rgba(16,185,129,0.2);
                  border-radius:8px;font-size:13px;
                  color:var(--text-secondary);line-height:1.6"></div>`:l===1?`
      <div style="display:flex;flex-direction:column;gap:18px">

        <div class="tw-field">
          <label class="tw-label"> Контекст</label>
          <textarea id="touch-context" class="tw-textarea"
            placeholder="Что обсудили, общая ситуация по клиенту...">${_(`touch-context`)}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label"> Задачи</label>
          <textarea id="touch-tasks" class="tw-textarea"
            placeholder="Что нужно сделать по итогам встречи...">${_(`touch-tasks`)}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label"> Дальнейшие шаги</label>
          <textarea id="touch-next" class="tw-textarea"
            placeholder="Следующие действия и договорённости...">${_(`touch-next`)}</textarea>
        </div>

      </div>`:l===2?`
      <div style="display:flex;flex-direction:column;gap:18px">

        <div class="tw-field">
          <label class="tw-label"> Стратегия</label>
          <textarea id="touch-strategy" class="tw-textarea"
            placeholder="Стратегические заметки по этому клиенту...">${_(`touch-strategy`)}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label"> Ожидаемый результат</label>
          <textarea id="touch-outcome" class="tw-textarea"
            placeholder="Чего ожидаем достичь в ближайшее время...">${_(`touch-outcome`)}</textarea>
        </div>

        <div class="tw-field">
          <label class="tw-label"> Блокеры</label>
          <textarea id="touch-blockers" class="tw-textarea"
            placeholder="Что может помешать или замедлить работу...">${_(`touch-blockers`)}</textarea>
        </div>

      </div>`:``,h={},g=()=>{[`touch-context`,`touch-tasks`,`touch-next`,`touch-strategy`,`touch-outcome`,`touch-blockers`,`touch-type`,`touch-month`,`touch-year`,`touch-ai-input`].forEach(e=>{let t=document.getElementById(e);t&&(h[e]=t.value)})},_=e=>h[e]??``,v=e=>{let t=Object.entries(e.signals||{}).filter(([,e])=>e),r=Object.entries(e.pc||{}).filter(([,e])=>e>=1&&e<=5);if(!t.length&&!r.length)return``;let a=t.map(([e])=>{let t=n[e];if(!t)return``;let r=t.weight??0,i=r>0?`#10b981`:`#ef4444`,a=r>0?`+`:``;return`
        <label style="display:flex;align-items:center;gap:10px;padding:7px 10px;
                       border-radius:8px;cursor:pointer;transition:background .12s;
                       border:1px solid transparent"
               onmouseover="this.style.background='#f8fafc'"
               onmouseout="this.style.background='transparent'">
          <input type="checkbox" class="ai-sig-cb" data-key="${e}"
                 checked style="width:15px;height:15px;accent-color:#6366f1;cursor:pointer">
          <span style="flex:1;font-size:13px;color:var(--text-primary)">${t.label??e}</span>
          <span style="font-size:12px;font-weight:700;color:${i};min-width:32px;text-align:right">
            ${a}${r}
          </span>
        </label>`}).join(``),o=r.map(([e,t])=>{let n=i[e];return n?`
        <label style="display:flex;align-items:center;gap:10px;padding:7px 10px;
                       border-radius:8px;cursor:pointer;transition:background .12s;
                       border:1px solid transparent"
               onmouseover="this.style.background='#f8fafc'"
               onmouseout="this.style.background='transparent'">
          <input type="checkbox" class="ai-pc-cb" data-key="${e}"
                 checked style="width:15px;height:15px;accent-color:#6366f1;cursor:pointer">
          <span style="flex:1;font-size:13px;color:var(--text-primary)">${n.label??e}</span>
          <span style="font-size:12px;font-weight:700;color:#6366f1;min-width:32px;text-align:right">
            ${t}/5
          </span>
        </label>`:``}).join(``);return`
      <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
        ${a?`
          <div style="padding:8px 10px 4px;background:#f8fafc;border-bottom:1px solid #e2e8f0">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;
                          letter-spacing:.06em;color:#94a3b8">bCHS сигналы</span>
          </div>
          <div style="padding:4px 0">${a}</div>`:``}
        ${r.length?`
          <div style="padding:8px 10px 4px;background:#f8fafc;
                       border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;
                          letter-spacing:.06em;color:#94a3b8">PC Score</span>
          </div>
          <div style="padding:4px 0">${o}</div>`:``}
      </div>`},y=()=>`
    <div style="padding:24px 28px;width:100%;max-width:520px;box-sizing:border-box">

      <div style="margin-bottom:6px">
        <div style="font-size:17px;font-weight:700;color:#0f172a">Касание</div>
        <div style="font-size:13px;color:var(--text-muted);margin-top:2px">${t}</div>
      </div>

      <div style="display:flex;align-items:center;margin:20px 0">
        ${p()}
      </div>

      <div style="border-top:1px solid #f1f5f9;padding-top:20px" id="touch-step-body">
        ${m()}
      </div>

      <div style="display:flex;gap:10px;margin-top:24px;align-items:center;
                  border-top:1px solid #f1f5f9;padding-top:16px">
        ${l>0?`<button id="tw-back" class="btn btn-secondary" style="min-width:90px">← Назад</button>`:``}
        <div style="flex:1"></div>
        <button id="tw-cancel" class="btn btn-secondary">Отмена</button>
        ${l<d.length-1?`<button id="tw-next" class="btn btn-primary" style="min-width:110px">Далее →</button>`:`<button id="tw-save" class="btn btn-primary" style="min-width:150px"> Сохранить касание</button>`}
      </div>

    </div>`,b=()=>{let e=document.querySelector(`#modal-overlay > div, .modal-inner, .modal-content`);e&&(e.innerHTML=y()),x()},x=()=>{document.getElementById(`tw-cancel`)?.addEventListener(`click`,()=>window.App.closeModal?.()),document.getElementById(`tw-back`)?.addEventListener(`click`,()=>{g(),l--,b()}),document.getElementById(`tw-next`)?.addEventListener(`click`,()=>{if(g(),l===0){let e=(h[`touch-ai-input`]??``).trim().length>0,t=u!==null;if(!e){window.App.toast?.(`Вставь транскрипт или заметки`,`error`);return}t||window.App.toast?.(`Рекомендуем нажать "Разобрать" — AI заполнит поля автоматически`,``)}l++,b()}),document.getElementById(`tw-save`)?.addEventListener(`click`,()=>{g(),S()}),document.getElementById(`touch-ai-btn`)?.addEventListener(`click`,async()=>{let e=(document.getElementById(`touch-ai-input`)?.value??``).trim();if(!e){window.App.toast?.(`Вставь транскрипт`,`error`);return}let n=document.getElementById(`touch-ai-btn`),i=document.getElementById(`touch-ai-status`),a=document.getElementById(`touch-ai-result`);n.disabled=!0,n.textContent=`⏳ Анализирую...`,i.textContent=`Отправляю запрос...`;try{parseInt(h[`touch-month`]??r.getMonth()+1),parseInt(h[`touch-year`]??r.getFullYear()),h[`touch-type`];let n=(await f.callAI({type:`touch`,client_name:t,transcript:e,max_tokens:1400}))?.choices?.[0]?.message?.content??``,o=n.match(/\{[\s\S]*\}/);u=JSON.parse(o?o[0]:n),u.context&&(h[`touch-context`]=u.context),u.tasks&&(h[`touch-tasks`]=u.tasks),u.next&&(h[`touch-next`]=u.next),u.strategy&&(h[`touch-strategy`]=u.strategy),u.outcome&&(h[`touch-outcome`]=u.outcome),u.blockers&&(h[`touch-blockers`]=u.blockers);let s=Object.values(u.signals||{}).filter(Boolean).length;a.classList.remove(`hidden`),a.innerHTML=`
          <div style="margin-bottom:10px">
            <strong> Структура заполнена · ${s} сигналов</strong>
            ${u.explanation?`<div style="margin-top:4px;color:var(--text-muted);font-style:italic;font-size:12px">
                    ${u.explanation}
                 </div>`:``}
          </div>
          ${v(u)}
          <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">
            Сними галочку если AI ошибся — остальные сохранятся
          </div>`,i.textContent=` готово`}catch(e){i.textContent=` Ошибка`,window.App.toast?.(`Ошибка: `+e.message,`error`)}finally{n.disabled=!1,n.textContent=` Разобрать`}}),document.querySelectorAll(`.tw-textarea`).forEach(e=>{let t=()=>{e.style.height=`auto`;let t=Math.min(e.scrollHeight,220);e.style.height=t+`px`,e.style.overflowY=e.scrollHeight>220?`auto`:`hidden`};t(),e.addEventListener(`input`,t)})},S=async()=>{let n=e=>(h[e]??``).trim(),i=n(`touch-type`)||`checkin`,a=parseInt(h[`touch-month`]??r.getMonth()+1),o=parseInt(h[`touch-year`]??r.getFullYear()),s=[n(`touch-context`)&&` Контекст:\n${n(`touch-context`)}`,n(`touch-tasks`)&&` Задачи:\n${n(`touch-tasks`)}`,n(`touch-next`)&&` Дальнейшие шаги:\n${n(`touch-next`)}`,n(`touch-strategy`)&&` Стратегия:\n${n(`touch-strategy`)}`,n(`touch-outcome`)&&` Ожидаемый результат:\n${n(`touch-outcome`)}`,n(`touch-blockers`)&&` Блокеры:\n${n(`touch-blockers`)}`].filter(Boolean);if(!s.length){window.App.toast?.(`Заполни хотя бы контекст на шаге 2`,`error`),l=1,b();return}let c=s.join(`

`),d=document.getElementById(`tw-save`);d&&(d.disabled=!0,d.textContent=`⏳ Сохраняем...`);try{if(u){let n=new Set([...document.querySelectorAll(`.ai-sig-cb:checked`)].map(e=>e.dataset.key)),r=new Set([...document.querySelectorAll(`.ai-pc-cb:checked`)].map(e=>e.dataset.key)),s={...u,signals:Object.fromEntries(Object.entries(u.signals||{}).map(([e,t])=>[e,t&&n.has(e)])),pc:Object.fromEntries(Object.entries(u.pc||{}).map(([e,t])=>[e,r.has(e)?t:null]))};await f.saveTouchPointFull({client_id:e,client_name:t,transcript:``,parsed:s,notes:c,type:i,month:a,year:o})}else await f.saveTouchPoint({client_id:e,type:i,completed_at:new Date().toISOString(),notes:c});this.touchPoints.push({client_id:e,type:i,completed_at:new Date().toISOString(),notes:c}),window.App.closeModal?.(),window.App.toast(u?.signals?` Касание сохранено, сигналы записаны`:` Касание сохранено`,`success`),f.clearCache(),await this.load()}catch(e){window.App.toast?.(` Ошибка: `+e.message,`error`),d&&(d.disabled=!1,d.textContent=` Сохранить касание`)}};window.App.openModal(y(),{hideClose:!1}),x()}},j={clients:[],selectedClientId:null,selectedMonth:null,selectedYear:null,signals:{},pcValues:{},existingBCHS:null,existingPC:null,async render(e){let t=new Date;this.selectedMonth=t.getMonth()+1,this.selectedYear=t.getFullYear(),this.signals={},this.pcValues={};let n=document.getElementById(`main-content`);n.innerHTML=`
      <div class="page-header">
        <div class="page-title">Внести данные</div>
        <div class="page-subtitle">Ежемесячная запись bCHS и PC Score</div>
      </div>
      <div id="entry-loader"
           style="text-align:center;padding:40px;color:var(--text-muted)">
        Загрузка клиентов...
      </div>`,this.clients=await f.getClients(),this.selectedClientId=e||(this.clients[0]?this.clients[0].id:null),this._buildForm()},_buildForm(){let e=document.getElementById(`main-content`);if(this.clients.length===0){e.innerHTML=`
        <div class="page-header">
          <div class="page-title">Внести данные</div>
        </div>
        <div class="empty-state">
          <div class="empty-state-icon">👤</div>
          <div class="empty-state-title">Нет клиентов</div>
          <div class="empty-state-text">
            Сначала добавьте клиента на странице «Клиенты»
          </div>
        </div>`;return}e.innerHTML=`
      <div class="page-header">
        <div class="page-title">Внести данные</div>
        <div class="page-subtitle">Ежемесячная запись bCHS и PC Score</div>
      </div>

      <div class="month-selector">
        <select class="form-select" id="entry-client">${this.clients.map(e=>`<option value="${e.id}"
        ${e.id===this.selectedClientId?`selected`:``}>
        ${e.name}
      </option>`).join(``)}</select>
        <select class="form-select" id="entry-month">${s.map((e,t)=>`<option value="${t+1}"
        ${t+1===this.selectedMonth?`selected`:``}>
        ${e}
      </option>`).join(``)}</select>
        <select class="form-select" id="entry-year">${[this.selectedYear-1,this.selectedYear,this.selectedYear+1].map(e=>`<option value="${e}" ${e===this.selectedYear?`selected`:``}>${e}</option>`).join(``)}</select>
        <button class="btn btn-secondary btn-sm" id="entry-load-existing">
          Загрузить сохранённые
        </button>
      </div>

      <div id="entry-existing-note" class="hidden"
           style="margin-bottom:12px;padding:9px 14px;
                  background:var(--yellow-soft);
                  border:1px solid var(--yellow-border);
                  border-radius:var(--radius-sm);
                  font-size:12.5px;color:#92400e;">
        ⚠️ Данные за этот период уже существуют.
        При сохранении они будут перезаписаны.
      </div>

      <!-- AI STATUS PARSER -->
      <div class="form-section"
           style="background:linear-gradient(135deg,rgba(124,106,247,0.06),rgba(59,130,246,0.04));
                  border:1px solid rgba(124,106,247,0.2);
                  border-radius:12px;padding:16px;margin-bottom:16px">
        <div class="form-section-title" style="color:#7c6af7">
          🤖 AI-разбор статуса клиента
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px">
          Опишите своими словами что происходило с клиентом в этом месяце —
          AI расставит сигналы и оценит нагрузку
        </div>
        <textarea id="ai-status-input" class="form-textarea" rows="4"
          placeholder="Например: Клиент попросил расширить команду, провели стратегическую сессию.
Но была задержка оплаты на 2 недели и клиент упомянул что смотрит на конкурентов.
Проект сложный, много неопределённости..."
          style="font-size:13px;resize:vertical;min-height:90px"></textarea>
        <div style="display:flex;gap:8px;margin-top:10px;
                    align-items:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" id="ai-parse-btn">
            🤖 Распознать сигналы
          </button>
          <div id="ai-parse-status"
               style="font-size:12px;color:var(--text-muted)"></div>
        </div>
        <div id="ai-parse-result" class="hidden"
             style="margin-top:12px;padding:10px 14px;
                    background:rgba(16,185,129,0.08);
                    border:1px solid rgba(16,185,129,0.2);
                    border-radius:8px;font-size:12px;
                    color:var(--text-secondary);line-height:1.6"></div>
      </div>

      <!-- Live Score Preview -->
      <div class="score-preview" id="score-preview">
        <div class="score-block">
          <span class="score-label">bCHS</span>
          <span class="score-value" id="live-bchs">0</span>
          <span class="score-sub"   id="live-health">—</span>
        </div>
        <div class="score-block">
          <span class="score-label">Лояльность</span>
          <span class="score-value" id="live-loyalty">—</span>
          <span class="score-sub">от -81 до +81</span>
        </div>
        <div class="score-block">
          <span class="score-label">PC Score</span>
          <span class="score-value" id="live-pc">—</span>
          <span class="score-sub"   id="live-load">—</span>
        </div>
        <div class="score-block">
          <span class="score-label">Final Score</span>
          <span class="score-value" id="live-final">—</span>
          <span class="score-sub"   id="live-potential">—</span>
        </div>
      </div>

      <!-- Main entry grid -->
      <div class="entry-layout">
        <div>${this._renderSignalGroups()}</div>
        <div>${this._renderPCSection()}</div>
      </div>

      <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap">
        <button class="btn btn-primary"   id="entry-save">💾 Сохранить данные</button>
        <button class="btn btn-secondary" id="entry-reset">↺ Сбросить</button>
      </div>
    `,this._bindEntryEvents(),this._updatePreview(),this.checkExisting()},_renderSignalGroups(){let e=``;for(let[t,i]of Object.entries(r)){let r=Object.entries(n).filter(([,e])=>e.group===t);e+=`
        <div class="form-section">
          <div class="form-section-title">
            ${i.icon} ${i.label}
          </div>
          <div class="signals-group">
            ${r.map(([e,t])=>`
              <label class="signal-item"
                     id="signal-item-${e}" data-key="${e}">
                <input type="checkbox" id="sig-${e}" data-key="${e}" />
                <span class="signal-label">${t.label}</span>
                <span class="signal-weight
                  ${t.weight>0?`weight-pos`:`weight-neg`}">
                  ${t.weight>0?`+`:``}${t.weight}
                </span>
              </label>`).join(``)}
          </div>
        </div>`}return e},_renderPCSection(){return`
      <div class="form-section">
        <div class="form-section-title">📊 PC Score — Нагрузка проекта</div>
        <div class="pc-sliders">${Object.entries(i).map(([e,t])=>`
      <div class="pc-item">
        <div class="pc-item-header">
          <span class="pc-label">${t.label}</span>
          <span class="pc-value-badge" id="pc-val-${e}">
            ${this.pcValues[e]||`—`}
          </span>
        </div>
        <div class="pc-btn-group">
          ${[1,2,3,4,5].map(t=>`
            <button class="pc-btn ${this.pcValues[e]===t?`active`:``}"
                    data-key="${e}" data-val="${t}">${t}</button>
          `).join(``)}
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
          ${t.hint}
        </div>
      </div>`).join(``)}</div>
      </div>`},_bindEntryEvents(){document.getElementById(`entry-client`).addEventListener(`change`,e=>{this.selectedClientId=e.target.value,this.checkExisting()}),document.getElementById(`entry-month`).addEventListener(`change`,e=>{this.selectedMonth=parseInt(e.target.value),this.checkExisting()}),document.getElementById(`entry-year`).addEventListener(`change`,e=>{this.selectedYear=parseInt(e.target.value),this.checkExisting()}),document.getElementById(`entry-load-existing`).addEventListener(`click`,()=>this._loadExistingData()),document.getElementById(`ai-parse-btn`).addEventListener(`click`,()=>this._parseStatusWithAI()),document.querySelectorAll(`.signal-item input[type="checkbox"]`).forEach(e=>{e.addEventListener(`change`,e=>{let t=e.target.dataset.key;this.signals[t]=e.target.checked;let r=document.getElementById(`signal-item-${t}`),i=n[t];r.classList.remove(`checked-pos`,`checked-neg`),e.target.checked&&r.classList.add(i.weight>0?`checked-pos`:`checked-neg`),this._updatePreview()})}),document.querySelectorAll(`.pc-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.key,n=parseInt(e.dataset.val);this.pcValues[t]=n,document.querySelectorAll(`.pc-btn[data-key="${t}"]`).forEach(e=>e.classList.toggle(`active`,parseInt(e.dataset.val)===n)),document.getElementById(`pc-val-${t}`).textContent=n,this._updatePreview()})}),document.getElementById(`entry-save`).addEventListener(`click`,()=>this._save()),document.getElementById(`entry-reset`).addEventListener(`click`,()=>this._resetForm())},async _parseStatusWithAI(){let e=(document.getElementById(`ai-status-input`)?.value||``).trim();if(!e){window.App.toast(`Введите текст статуса`,`error`);return}let t=document.getElementById(`ai-parse-btn`),r=document.getElementById(`ai-parse-status`),a=document.getElementById(`ai-parse-result`);t.disabled=!0,t.textContent=`⏳ Анализирую...`,r&&(r.textContent=`Отправляю запрос к AI...`),a&&a.classList.add(`hidden`);try{let t=(await f.callAI({type:`status`,text:e}))?.choices?.[0]?.message?.content??``;if(!t)throw Error(`Пустой ответ от AI`);let o;try{let e=t.match(/\{[\s\S]*\}/);o=JSON.parse(e?e[0]:t)}catch{throw Error(`AI вернул невалидный JSON`)}let s=[];if(o.signals)for(let[e,t]of Object.entries(o.signals)){if(!n[e])continue;this.signals[e]=!!t;let r=document.getElementById(`sig-${e}`);r&&(r.checked=!!t);let i=document.getElementById(`signal-item-${e}`);i&&(i.classList.remove(`checked-pos`,`checked-neg`),t&&(i.classList.add(n[e].weight>0?`checked-pos`:`checked-neg`),s.push(`${n[e].label} (${n[e].weight>0?`+`:``}${n[e].weight})`)))}if(o.pc)for(let[e,t]of Object.entries(o.pc)){if(!i[e])continue;let n=parseInt(t);if(n>=1&&n<=5){this.pcValues[e]=n,document.querySelectorAll(`.pc-btn[data-key="${e}"]`).forEach(e=>e.classList.toggle(`active`,parseInt(e.dataset.val)===n));let t=document.getElementById(`pc-val-${e}`);t&&(t.textContent=n)}}this._updatePreview(),a&&(a.classList.remove(`hidden`),a.innerHTML=`
        ${s.length>0?`<div style="margin-bottom:6px">
             <strong>✅ Активированы сигналы (${s.length}):</strong><br>
             ${s.join(` · `)}
           </div>`:`<div style="margin-bottom:6px">⚪ Значимых сигналов не обнаружено</div>`}
        ${o.explanation?`<div style="color:var(--text-muted);font-style:italic">
               💡 ${o.explanation}
             </div>`:``}
        <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">
          ⚠️ Проверьте и скорректируйте результаты вручную перед сохранением
        </div>`),r&&(r.textContent=`✅ Готово · ${s.length} сигналов`),window.App.toast(`🤖 AI расставил ${s.length} сигналов`,`success`)}catch(e){console.error(`[EntryPage AI Parse]`,e),r&&(r.textContent=`❌ Ошибка`),window.App.toast(`Ошибка AI: `+e.message,`error`)}finally{t.disabled=!1,t.textContent=`🤖 Распознать сигналы`}},async checkExisting(){if(this.selectedClientId)try{let[e,t]=await Promise.all([f.getBCHSEntry(this.selectedClientId,this.selectedMonth,this.selectedYear),f.getPCEntry(this.selectedClientId,this.selectedMonth,this.selectedYear)]);this.existingBCHS=e,this.existingPC=t;let n=document.getElementById(`entry-existing-note`);n&&n.classList.toggle(`hidden`,!(e||t))}catch(e){console.error(`[EntryPage.checkExisting]`,e)}},async _loadExistingData(){if(!this.selectedClientId)return;await this.checkExisting();let e=!1;if(this.existingBCHS){for(let e of Object.keys(n)){let t=this.existingBCHS[e];if(t==null)continue;this.signals[e]=!!t;let r=document.getElementById(`sig-${e}`);r&&(r.checked=!!t);let i=document.getElementById(`signal-item-${e}`);i&&(i.classList.remove(`checked-pos`,`checked-neg`),t&&i.classList.add(n[e].weight>0?`checked-pos`:`checked-neg`))}e=!0}if(this.existingPC){for(let e of Object.keys(i)){let t=this.existingPC[e];if(t==null)continue;this.pcValues[e]=t,document.querySelectorAll(`.pc-btn[data-key="${e}"]`).forEach(e=>e.classList.toggle(`active`,parseInt(e.dataset.val)===t));let n=document.getElementById(`pc-val-${e}`);n&&(n.textContent=t)}e=!0}e?(this._updatePreview(),window.App.toast(`Данные загружены`,`success`)):window.App.toast(`Нет сохранённых данных за этот период`,``)},_updatePreview(){let e={};for(let t of Object.keys(n))e[t]=!!this.signals[t];let t=Object.values(e).some(Boolean),r=t?k.computeBCHS(e):null,a=k.loyaltyPct(r),o=k.healthSignal(r),s={};for(let e of Object.keys(i))s[e]=this.pcValues[e]||null;let c=k.computePC(s),l=k.loadSignal(c),u=this.clients.find(e=>e.id===this.selectedClientId),d=k.finalScore(r,c),f=u?k.potentialPct(d,u.bcg_category):null,p=document.getElementById(`live-bchs`);p&&(p.textContent=r===null?`0`:r,p.style.color=r===null?`var(--text-muted)`:r>=20?`var(--green)`:r>=-10?`var(--text-primary)`:r>=-30?`var(--yellow)`:`var(--red)`);let m=document.getElementById(`live-health`);m&&(m.textContent=t?o.label:`— нет данных`);let h=document.getElementById(`live-loyalty`);h&&(h.textContent=a===null?`—`:`${a}%`);let g=document.getElementById(`live-pc`);g&&(g.textContent=c===null?`—`:c.toFixed(1));let _=document.getElementById(`live-load`);_&&(_.textContent=l.label);let v=document.getElementById(`live-final`);v&&(v.textContent=d===null?`—`:d.toFixed(1));let y=document.getElementById(`live-potential`);y&&(y.textContent=f===null?`—`:`${f}% от идеала`)},async _save(){if(!this.selectedClientId){window.App.toast(`Выберите клиента`,`error`);return}let e=document.getElementById(`entry-save`);e.textContent=`⏳ Сохраняем...`,e.disabled=!0;try{let e={};for(let t of Object.keys(n))e[t]=!!this.signals[t];let t={};for(let e of Object.keys(i))t[e]=this.pcValues[e]||null;await Promise.all([f.saveBCHSEntry(this.selectedClientId,this.selectedMonth,this.selectedYear,e),f.savePCEntry(this.selectedClientId,this.selectedMonth,this.selectedYear,t)]),f.clearCache(),window.App.toast(`✅ Данные сохранены успешно!`,`success`),this.checkExisting()}catch(e){console.error(`[EntryPage._save]`,e),window.App.toast(`❌ Ошибка сохранения`,`error`)}finally{e.textContent=`💾 Сохранить данные`,e.disabled=!1}},_resetForm(){this.signals={},this.pcValues={},document.querySelectorAll(`.signal-item input[type="checkbox"]`).forEach(e=>{e.checked=!1;let t=document.getElementById(`signal-item-${e.dataset.key}`);t&&t.classList.remove(`checked-pos`,`checked-neg`)}),document.querySelectorAll(`.pc-btn`).forEach(e=>{e.classList.remove(`active`)}),Object.keys(i).forEach(e=>{let t=document.getElementById(`pc-val-${e}`);t&&(t.textContent=`—`)});let e=document.getElementById(`ai-parse-result`);e&&(e.classList.add(`hidden`),e.innerHTML=``);let t=document.getElementById(`ai-parse-status`);t&&(t.textContent=``);let n=document.getElementById(`ai-status-input`);n&&(n.value=``),this._updatePreview(),window.App.toast(`Форма сброшена`,``)}},M=[{key:`role_account_manager`,label:`Account
Manager`,short:`AM`},{key:`role_coordinator`,label:`Coordinator
/ DC`,short:`DC`},{key:`role_sales`,label:`Sales`,short:`Sales`},{key:`role_delivery`,label:`Delivery
/ PM`,short:`Delivery`},{key:`role_csm`,label:`CSM`,short:`CSM`}],N={0:`Не вовлечён`,1:`Минимальное участие`,2:`Минимальное участие`,3:`Активное участие`,4:`Активное участие`,5:`Ключевая роль`};function se(e){return e?M.map(t=>Math.min(5,Math.max(0,Number(e[t.key])||0))):M.map(()=>0)}function P(e){let t=e.reduce((e,t)=>e+t,0);return{sum:t,pct:Math.round(t/(M.length*5)*100)}}function F(e,t,n,r){return{x:e+n*Math.sin(r),y:t-n*Math.cos(r)}}function I(e,t=280){let n=M.length,r=t/2,i=t/2,a=t*.36,o=t*.44,s=2*Math.PI/n,c=[];for(let e=1;e<=5;e++){let t=e/5*a,o=[];for(let e=0;e<n;e++){let n=F(r,i,t,e*s);o.push(`${n.x},${n.y}`)}c.push(`<polygon points="${o.join(` `)}" class="radar-ring"/>`)}let l=[];for(let e=0;e<n;e++){let t=F(r,i,a,e*s);l.push(`<line x1="${r}" y1="${i}" x2="${t.x}" y2="${t.y}" class="radar-spoke"/>`)}let u=`<polygon points="${e.map((e,t)=>{let n=F(r,i,e/5*a,t*s);return`${n.x},${n.y}`}).join(` `)}" class="radar-poly"/>`,d=e.map((e,t)=>{let n=F(r,i,e/5*a,t*s),o=N[e]||``,c=M[t].label.replace(`
`,` `);return`<circle
      cx="${n.x}" cy="${n.y}" r="5"
      class="radar-dot"
      data-label="${c}"
      data-value="${e}"
      data-hint="${o}"
      tabindex="0"
      role="button"
      aria-label="${c}: ${e} из 5 — ${o}"/>`}).join(``),f=`<circle cx="${r}" cy="${i}" r="3" class="radar-center"/>`,p=M.map((e,t)=>{let n=F(r,i,o,t*s),c=e.label.split(`
`),l=n.x-r,u=Math.abs(l)<a*.15?`middle`:l>0?`start`:`end`,d=c.length>1?-6:0;return`<text class="radar-label" text-anchor="${u}">${c.map((e,t)=>`<tspan x="${n.x}" dy="${t===0?d:14}">${e}</tspan>`).join(``)}</text>`}).join(``),m=[1,2,3,4,5].map(e=>{let t=F(r,i,e/5*a,0);return`<text x="${t.x+5}" y="${t.y+4}" class="radar-tick">${e}</text>`}).join(``);return`
    <svg viewBox="0 0 ${t} ${t}" class="radar-svg" width="${t}" height="${t}"
         aria-label="Радар покрытия ролями">
      ${c.join(``)}
      ${l.join(``)}
      ${u}
      ${p}
      ${m}
      ${d}
      ${f}
    </svg>`}var ce={_clientId:null,_pcEntryId:null,_values:[0,0,0,0,0],_pcMonth:null,_pcYear:null,init(e,t){this._clientId=e,this._pcEntryId=t?.id||null,this._pcMonth=t?.month||null,this._pcYear=t?.year||null,this._values=se(t)},render(e,t){return this.init(e,t),this._buildHTML()},_buildHTML(){let e=I(this._values),{sum:t,pct:n}=P(this._values),r=n>=80?`var(--green)`:n>=50?`var(--yellow)`:`var(--red)`,i=t<10?`<div class="radar-warning">⚠️ Низкое покрытие ролями — риск для аккаунта</div>`:``;return`
      <div class="radar-block" id="radar-block">
        <div class="radar-header">
          <div class="radar-title">🎯 Покрытие ролями</div>
          <button class="btn btn-ghost btn-xs" id="radar-edit-btn"
                  title="Изменить значения ролей">✏️ Изменить</button>
        </div>
        <div class="radar-canvas-wrap" id="radar-canvas-wrap">
          ${e}
          <div class="radar-tooltip" id="radar-tooltip" role="tooltip"></div>
        </div>
        <div class="radar-vals">${M.map((e,t)=>`
      <span class="radar-val-item" title="${N[this._values[t]]}">
        <span class="radar-val-label">${e.short}</span>
        <span class="radar-val-num" style="color:${this._values[t]>=4?`var(--green)`:this._values[t]>=2?`var(--text-primary)`:`var(--text-muted)`}">
          ${this._values[t]}
        </span>
      </span>`).join(``)}</div>
        <div class="radar-coverage">
          <span class="radar-cov-label">Покрытие:</span>
          <span class="radar-cov-pct" style="color:${r}">${n}%</span>
        </div>
        ${i}
      </div>`},bindEvents(){this._bindTooltips(),document.getElementById(`radar-edit-btn`)?.addEventListener(`click`,()=>this._openModal())},_bindTooltips(){let e=document.getElementById(`radar-tooltip`);e&&document.querySelectorAll(`.radar-dot`).forEach(t=>{let n=()=>{e.innerHTML=`
          <div class="radar-tt-label">${t.dataset.label}</div>
          <div class="radar-tt-val">${t.dataset.value} / 5</div>
          <div class="radar-tt-hint">${t.dataset.hint}</div>`,e.style.display=`block`;let n=document.getElementById(`radar-canvas-wrap`);if(n){let r=n.getBoundingClientRect(),i=t.getBoundingClientRect();e.style.left=`${i.left-r.left+i.width/2}px`,e.style.top=`${i.top-r.top-8}px`}},r=()=>{e.style.display=`none`};t.addEventListener(`mouseenter`,n),t.addEventListener(`focus`,n),t.addEventListener(`mouseleave`,r),t.addEventListener(`blur`,r),t.addEventListener(`click`,n)})},_openModal(){let{App:e}=window,t=M.map((e,t)=>{let n=this._values[t];return`
        <div class="radar-slider-group">
          <div class="radar-slider-header">
            <label class="radar-slider-label" for="rslider-${t}">
              ${e.label.replace(`
`,` / `)}
            </label>
            <span class="radar-slider-cur" id="rslider-cur-${t}">${n}</span>
          </div>
          <input type="range" id="rslider-${t}" class="radar-slider"
                 min="0" max="5" step="1" value="${n}" data-idx="${t}"
                 aria-label="${e.label.replace(`
`,` `)} — значение ${n} из 5"/>
          <div class="radar-slider-hint" id="rslider-hint-${t}">
            ${N[n]||``}
          </div>
        </div>`}).join(``);e.openModal(`
      <div class="radar-modal-wrap">
        <h2 class="modal-title">🎯 Покрытие ролями</h2>
        <p class="radar-modal-sub">
          Укажите уровень вовлечённости каждой роли в аккаунт
        </p>
        <div class="radar-sliders">${t}</div>
        <div class="radar-modal-preview" id="radar-modal-preview">
          ${I([...this._values],220)}
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" onclick="window.App.closeModal()">Отмена</button>
          <button class="btn btn-primary" id="radar-save-btn">💾 Сохранить</button>
        </div>
      </div>`),this._bindModalEvents()},_bindModalEvents(){document.querySelectorAll(`.radar-slider`).forEach(e=>{let t=parseInt(e.dataset.idx),n=()=>{let n=parseInt(e.value),r=document.getElementById(`rslider-cur-${t}`),i=document.getElementById(`rslider-hint-${t}`);r&&(r.textContent=n),i&&(i.textContent=N[n]||``);let a=M.map((e,t)=>{let n=document.getElementById(`rslider-${t}`);return n?parseInt(n.value):this._values[t]}),o=document.getElementById(`radar-modal-preview`);o&&(o.innerHTML=I(a,220))};e.addEventListener(`input`,n),e.addEventListener(`change`,n)}),document.getElementById(`radar-save-btn`)?.addEventListener(`click`,()=>this._save())},async _save(){let{App:e,API:t}=window,n=document.getElementById(`radar-save-btn`);n&&(n.disabled=!0,n.textContent=`⏳...`);let r=M.map((e,t)=>{let n=document.getElementById(`rslider-${t}`);return n?Math.min(5,Math.max(0,parseInt(n.value)||0)):this._values[t]}),a=`https://bchs-api.lexsnitko.workers.dev`;try{let n={};if(M.forEach((e,t)=>{n[e.key]=r[t]}),this._pcEntryId)await fetch(`${a}/tables/pc_entries/${this._pcEntryId}`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)});else{let e=new Date,t=this._pcMonth||e.getMonth()+1,r=this._pcYear||e.getFullYear(),o={client_id:this._clientId,month:t,year:r,...n};for(let e of Object.keys(i))e in o||(o[e]=1);let s=await fetch(`${a}/tables/pc_entries`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(o)}).then(e=>e.json());this._pcEntryId=s?.id||null}t&&(t._pcCache=null),this._values=r,e.closeModal(),e.toast(`✅ Покрытие ролями обновлено`,`success`),this._refreshBlock()}catch(t){console.error(`[RoleRadar._save]`,t),e.toast(`❌ Ошибка сохранения`,`error`),n&&(n.disabled=!1,n.textContent=`💾 Сохранить`)}},_refreshBlock(){let e=document.getElementById(`radar-block`);e&&(e.outerHTML=this._buildHTML(),this.bindEvents())}},le=`modulepreload`,ue=function(e){return`/`+e},L={},R=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=ue(t,n),t in L)return;L[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:le,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},z={client:null,computed:null,chartInstance:null,activeTab:`overview`,async render(e){let t=document.getElementById(`main-content`);t.innerHTML=`
      <div style="padding:40px;text-align:center;color:var(--text-muted)">
        Загрузка клиента...
      </div>`;try{let[t,n,r,i]=await Promise.all([f.getClient(e),f.getBCHSFor(e),f.getPCFor(e),window.FteAPI?window.FteAPI.getByClient(e):Promise.resolve([])]);this.client=t,this.computed=k.computeClient(t,n,r,i),this.activeTab=`overview`,window.DeliveryTab&&(window.DeliveryTab.activeMonth=null),this._renderDetail()}catch(e){console.error(`[DetailPage.render]`,e),t.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon"></div>
          <div class="empty-state-title">Ошибка загрузки</div>
        </div>`}},_buildTabs(){return[{id:`overview`,label:`Обзор`,always:!0}]},_renderDetail(){let e=this.client,t=this.computed,n=a[e.bcg_category],r=new Date,i=r.getMonth()+1;r.getFullYear();let o=s[i-1],c=t.curBCHSEntry?s[(t.curBCHSEntry.month||i)-1]:o;this._buildTabs().map(e=>`
      <button class="detail-tab-btn${e.id===this.activeTab?` active`:``}"
              data-tab="${e.id}">${e.label}</button>
    `).join(``);let l=document.getElementById(`main-content`);if(!document.getElementById(`cd-styles`)){let e=document.createElement(`style`);e.id=`cd-styles`,e.textContent=`
/* ── Client Detail Header ── */
.cd-header {
  display:flex;align-items:flex-start;gap:12px;
  padding:16px 20px;background:#fff;
  border:1px solid var(--border);border-radius:12px;
  margin-bottom:16px;
}
.cd-back {
  width:32px;height:32px;border-radius:8px;flex-shrink:0;margin-top:2px;
  border:1px solid var(--border);background:var(--surface);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--text-muted);transition:all .15s;
}
.cd-back:hover { background:var(--surface-hover);color:var(--text-primary); }
.cd-header-main { flex:1;min-width:0; }
.cd-header-top {
  display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px;
}
.cd-name {
  font-size:18px;font-weight:700;color:var(--text-primary);
  letter-spacing:-.02em;line-height:1;
}
.cd-badges { display:flex;gap:5px;flex-wrap:wrap;align-items:center; }
.cd-badge {
  font-size:11px;font-weight:600;padding:2px 8px;border-radius:5px;
  background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;
}
.cd-focus {
  font-size:13px;color:var(--text-secondary);margin-bottom:4px;
  line-height:1.4;
}
.cd-meta { font-size:12px;color:var(--text-muted); }
.cd-actions-btn {
  display:flex;align-items:center;gap:6px;
  padding:8px 14px;border-radius:8px;flex-shrink:0;
  border:1px solid var(--border);background:var(--surface);
  font-size:13px;font-weight:600;color:var(--text-secondary);
  cursor:pointer;transition:all .15s;white-space:nowrap;margin-top:2px;
}
.cd-actions-btn:hover {
  border-color:#6366f1;color:#6366f1;background:#f8f7ff;
}
`,document.head.appendChild(e)}l.innerHTML=`
      <div class="cd-header">
        <button class="cd-back" id="btn-back-dash">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="cd-header-main">
          <div class="cd-header-top">
            <span class="cd-name">${e.name}</span>
            <div class="cd-badges">
              <span class="cd-badge cd-badge--health ${t.badge.cls}">${t.badge.label}</span>
              <span class="cd-badge">${n?n.label:e.bcg_category}</span>
              <span class="cd-badge">${e.key_account_priority}</span>
              <span class="cd-badge">${e.status}</span>
            </div>
          </div>
          <div class="cd-focus">${t.focus}</div>
          <div class="cd-meta">Ответственный: <strong>${e.sales_owner||`—`}</strong></div>
        </div>
        <button class="cd-actions-btn" id="btn-actions-panel">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
          Действия
        </button>
      </div>

      <!-- KPI карточки -->
      <div class="pf-kpi-grid-new" id="cd-kpi-grid">
        ${this._renderKPICards(t,c)}
      </div>

            <div id="detail-tab-content"></div>
    `,this._bindDetailEvents(),this._renderActiveTab()},_renderActiveTab(){let e=document.getElementById(`detail-tab-content`);if(e)switch(this.activeTab){case`overview`:e.innerHTML=this._renderOverview(),this.computed.monthlyData.length>0&&this._renderChart(),ce.bindEvents();break;case`history`:e.innerHTML=this._renderHistorySection();break;case`touches`:e.innerHTML=`<div style="padding:32px;text-align:center;color:var(--text-muted)">⏳ Загрузка...</div>`,this._loadTouches();break;case`notes`:e.innerHTML=this._renderNotesSection(),this._bindNotesEvents();break;case`delivery`:e.innerHTML=`
          <div class="dtab-wrap" id="delivery-tab-root">
            <div style="padding:40px;text-align:center;color:var(--text-muted)">
              Загрузка...
            </div>
          </div>`,window.DeliveryTab?window.DeliveryTab.init(this.client.id):document.getElementById(`delivery-tab-root`).innerHTML=`
            <div class="empty-state">
              <div class="empty-state-icon"></div>
              <div class="empty-state-title">DeliveryTab не загружен</div>
            </div>`;break;case`mc`:e.innerHTML=`<div id="mc-tab-content"></div>`,window.MCPage?(window.MCPage.mount(this.client,this.computed?.bchs??null),window.MCPage&&this.client.monthly_revenue&&(window.MCPage.cfg=Object.assign(window.MCPage.cfg||{},{monthly_revenue:this.client.monthly_revenue}))):e.innerHTML=`
            <div class="empty-state">
              <div class="empty-state-icon"></div>
              <div class="empty-state-title">MCPage не загружен</div>
            </div>`;break;default:e.innerHTML=this._renderOverview()}},_renderOverview(){let e=this.computed,t=ce.render(this.client.id,e.curPCEntry);return`
      <div class="overview-layout">
        <div class="overview-main">
          <div class="chart-container">
            <div class="chart-title">История лояльности (bCHS)</div>
            <div style="height:200px;position:relative">
              <canvas id="loyalty-chart"></canvas>
            </div>
            ${e.monthlyData.length===0?`<div class="no-data"
                      style="text-align:center;padding:20px">
                   Нет исторических данных
                 </div>`:``}
          </div>
          <div class="form-section" style="margin-top:16px">
            <div class="form-section-title"> Последние 3 месяца</div>
            ${this._renderHistoryTable(3)}
          </div>
        </div>
        ${t?`<div class="overview-sidebar">${t}</div>`:``}
      </div>`},_renderHistorySection(){return`
      <div class="form-section">
        <div class="form-section-title">История по месяцам</div>
        ${this._renderHistoryTable()}
      </div>`},_renderNotesSection(){return`
      <div class="form-section">
        <div class="form-section-title">Заметки о стратегии</div>
        <textarea class="form-textarea" id="strategy-notes"
                  style="min-height:160px">${this.client.strategy_notes||``}</textarea>
        <div style="margin-top:8px">
          <button class="btn btn-primary btn-sm" id="btn-save-notes">
             Сохранить заметки
          </button>
        </div>
      </div>`},_bindNotesEvents(){document.getElementById(`btn-save-notes`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`strategy-notes`).value;try{await f.updateClient(this.client.id,{...this.client,strategy_notes:e}),this.client.strategy_notes=e,window.App.toast(` Заметки сохранены`,`success`)}catch{window.App.toast(` Ошибка сохранения`,`error`)}})},_renderKPI(e,t,n,r){return`
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:var(--radius);padding:12px 14px">
        <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:0.5px;
                    color:var(--text-muted);font-weight:700;margin-bottom:4px">
          ${e}
        </div>
        <div style="font-size:22px;font-weight:700;
                    color:${r||`var(--text-primary)`}">
          ${t}
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">
          ${n}
        </div>
      </div>`},_bchsColor(e){return e>=20?`var(--green)`:e>=-10?`var(--text-primary)`:e>=-30?`var(--yellow)`:`var(--red)`},_trendColor(e){return e===`trend-up`?`var(--green)`:e===`trend-down`?`var(--red)`:`var(--text-muted)`},_renderHistoryTable(e){let t=this.computed;if(!t.bchsHistory||t.bchsHistory.length===0)return`
        <div class="no-data" style="text-align:center;padding:20px">
          Нет данных
        </div>`;let n=t.bchsHistory.map(e=>{let n=k.computeBCHS(e),r=k.loyaltyPct(n),i=k.healthSignal(n),a=t.pcHistory.find(t=>t.month===e.month&&t.year===e.year),o=a?k.computePC(a):null;return{be:e,bchs:n,loyalty:r,health:i,pe:a,pcScore:o,load:k.loadSignal(o),finalS:k.finalScore(n,o),isCurrent:t.curBCHSEntry&&Number(e.month)===Number(t.curBCHSEntry.month)&&Number(e.year)===Number(t.curBCHSEntry.year)}}).reverse();return e&&(n=n.slice(0,e)),`
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Период</th>
              <th>bCHS</th>
              <th>Лояльность</th>
              <th>Здоровье</th>
              <th>PC Score</th>
              <th>Нагрузка</th>
              <th>Final Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${n.map(e=>`
              <tr${e.isCurrent?` style="background:rgba(59,130,246,0.06)"`:``}>
                <td>
                  <strong>
                    ${c[e.be.month-1]} ${e.be.year}
                  </strong>
                  ${e.isCurrent?`<span style="font-size:10px;color:var(--blue);
                                   font-weight:600"> актуальный</span>`:``}
                </td>
                <td><strong>${e.bchs===null?`—`:e.bchs}</strong></td>
                <td>${e.loyalty===null?`—`:e.loyalty+`%`}</td>
                <td>${e.health.label}</td>
                <td>${e.pcScore===null?`—`:e.pcScore.toFixed(1)}</td>
                <td>${e.load.label}</td>
                <td>${e.finalS===null?`—`:e.finalS.toFixed(1)}</td>
                <td>
                  <button class="btn btn-secondary btn-sm"
                          data-action="edit-month"
                          data-month="${e.be.month}"
                          data-year="${e.be.year}"></button>
                </td>
              </tr>`).join(``)}
          </tbody>
        </table>
      </div>`},_renderChart(){if(this.computed.monthlyData.length!==0)if(typeof Chart>`u`){let e=document.createElement(`script`);e.src=`https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`,e.onload=()=>this._drawChart(),document.head.appendChild(e)}else this._drawChart()},_drawChart(){let e=this.computed,t=document.getElementById(`loyalty-chart`);if(!t)return;this.chartInstance&&this.chartInstance.destroy();let n=e.monthlyData.map(e=>e.label),r=e.monthlyData.map(e=>e.bchs),i=e.monthlyData.map(e=>e.loyalty),a=r.map(e=>e===null?`#9ca3af`:e>=20?`#10b981`:e>=-10?`#6b7280`:e>=-30?`#f59e0b`:`#ef4444`),o=e.monthlyData.map(t=>e.curBCHSEntry&&t.month===Number(e.curBCHSEntry.month)&&t.year===Number(e.curBCHSEntry.year)?8:5);this.chartInstance=new Chart(t,{type:`line`,data:{labels:n,datasets:[{label:`bCHS`,data:r,borderColor:`#3b82f6`,backgroundColor:`rgba(59,130,246,0.08)`,borderWidth:2,pointBackgroundColor:a,pointRadius:o,tension:.3,fill:!0,yAxisID:`y`},{label:`Лояльность %`,data:i,borderColor:`#10b981`,borderWidth:1.5,borderDash:[4,3],pointRadius:3,tension:.3,fill:!1,yAxisID:`y2`}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{labels:{font:{family:`Inter`,size:11},boxWidth:12}},tooltip:{callbacks:{label:e=>e.datasetIndex===0?` bCHS: ${e.raw}`:` Лояльность: ${e.raw}%`}}},scales:{y:{position:`left`,min:-81,max:81,grid:{color:`rgba(0,0,0,0.04)`},ticks:{font:{family:`Inter`,size:10}}},y2:{position:`right`,min:0,max:100,grid:{drawOnChartArea:!1},ticks:{font:{family:`Inter`,size:10},callback:e=>e+`%`}},x:{ticks:{font:{family:`Inter`,size:10}},grid:{display:!1}}}}})},async _loadTouches(){try{let e=(await f.getTouchPoints()).filter(e=>String(e.client_id)===String(this.client.id)&&e.completed_at).sort((e,t)=>new Date(t.completed_at)-new Date(e.completed_at)),t=document.getElementById(`detail-tab-content`);if(!t)return;t.innerHTML=this._renderTouchesTab(e),this._bindTouchesEvents(e)}catch(e){let t=document.getElementById(`detail-tab-content`);t&&(t.innerHTML=`<div style="padding:32px;text-align:center;color:var(--md-red)"> ${e.message}</div>`)}},_renderTouchesTab(e){let t={checkin:{icon:``,label:`Check-in`},call:{icon:``,label:`Звонок`},meeting:{icon:``,label:`Встреча`},qbr:{icon:``,label:`QBR`},email:{icon:``,label:`Email`}},n={};for(let t of e){let e=new Date(t.completed_at),r=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}`;n[r]||(n[r]={year:e.getFullYear(),month:e.getMonth(),items:[]}),n[r].items.push(t)}let r=new Date,i=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,`0`)}`,a=[`Январь`,`Февраль`,`Март`,`Апрель`,`Май`,`Июнь`,`Июль`,`Август`,`Сентябрь`,`Октябрь`,`Ноябрь`,`Декабрь`],o=Object.entries(n).sort((e,t)=>t[0].localeCompare(e[0])).map(([e,n],r)=>{let o=e===i,s=!o&&r!==1,c=n.items.length,l=`${a[n.month]} ${n.year}`,u=n.items.map(e=>{let n=t[e.type]??{icon:`•`,label:e.type},r=new Date(e.completed_at),i=r.toLocaleDateString(`ru-RU`,{day:`numeric`,month:`short`}),a=Math.round((Date.now()-r.getTime())/864e5),o=a===0?`сегодня`:a===1?`вчера`:`${a} дн. назад`,s=e.notes||``,c=s.match(/ Контекст:\n([\s\S]*?)(?:\n\n|$)/),l=s.match(/ Задачи:\n([\s\S]*?)(?:\n\n|$)/),u=s.match(/ Дальнейшие шаги:\n([\s\S]*?)(?:\n\n|$)/),d=c||l||u?`
          <div style="margin-top:6px;display:flex;flex-direction:column;gap:3px">
            ${c?`<div style="font-size:12px;color:var(--text-secondary)"><span style="opacity:.6"></span> ${c[1].trim().slice(0,80)}${c[1].trim().length>80?`…`:``}</div>`:``}
            ${l?`<div style="font-size:12px;color:var(--text-secondary)"><span style="opacity:.6"></span> ${l[1].trim().slice(0,80)}${l[1].trim().length>80?`…`:``}</div>`:``}
            ${u?`<div style="font-size:12px;color:var(--text-secondary)"><span style="opacity:.6"></span> ${u[1].trim().slice(0,80)}${u[1].trim().length>80?`…`:``}</div>`:``}
          </div>`:s?`
          <div style="font-size:12px;color:var(--text-secondary);margin-top:5px">
            ${s.slice(0,120)}${s.length>120?`…`:``}
          </div>`:``;return`
          <div class="tp-detail-card" data-id="${e.id}"
               style="background:var(--surface);border:1px solid var(--border);
                      border-radius:10px;padding:12px 14px;margin-bottom:8px;
                      cursor:pointer;transition:box-shadow .15s"
               onmouseover="this.style.boxShadow='var(--shadow-md)'"
               onmouseout="this.style.boxShadow='none'">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:16px">${n.icon}</span>
                <span style="font-size:13px;font-weight:600;color:var(--text-primary)">${n.label}</span>
                <span style="font-size:11px;color:var(--text-muted)">· ${i} · ${o}</span>
              </div>
              <button class="tp-del-detail btn btn-secondary btn-xs"
                      data-id="${e.id}"
                      style="opacity:0;transition:opacity .15s"
                      onmouseover="this.style.opacity='1'"
                      onmouseout="this.style.opacity='0'"></button>
            </div>
            ${d}
          </div>`}).join(``);return`
        <div class="tp-month-group" data-key="${e}" style="margin-bottom:4px">
          <div class="tp-month-header"
               style="display:flex;align-items:center;justify-content:space-between;
                      padding:8px 4px;cursor:pointer;user-select:none"
               data-toggle="${e}">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:12px;font-weight:700;color:var(--text-primary);
                           text-transform:uppercase;letter-spacing:.5px">${l}</span>
              <span style="font-size:11px;background:var(--surface);border:1px solid var(--border);
                           border-radius:20px;padding:1px 8px;color:var(--text-muted)">
                ${c} ${c===1?`касание`:c<5?`касания`:`касаний`}
              </span>
              ${o?`<span style="font-size:10px;background:#e0f2fe;color:#0284c7;border-radius:20px;padding:1px 8px;font-weight:600">текущий</span>`:``}
            </div>
            <span style="font-size:12px;color:var(--text-muted)">${s?`▶`:`▼`}</span>
          </div>
          <div class="tp-month-body" data-body="${e}"
               style="${s?`display:none`:``}">
            ${s&&c>0?`
              <div style="padding:6px 4px 10px">
                ${u}
              </div>`:`
              <div style="padding:0 4px 10px">
                ${u}
              </div>`}
          </div>
        </div>`}).join(``);return`
    <div class="form-section">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div class="form-section-title" style="margin:0"> История касаний</div>
        <button class="btn btn-primary btn-sm" id="btn-new-touch">+ Касание</button>
      </div>
      ${e.length===0?`
        <div style="text-align:center;padding:40px;color:var(--text-muted)">
          Касаний пока нет — нажми "+ Касание" чтобы добавить первое
        </div>`:o}
    </div>`},_bindTouchesEvents(e){document.getElementById(`btn-new-touch`)?.addEventListener(`click`,()=>{R(()=>Promise.resolve().then(()=>oe).then(e=>{e.DashboardPage._openTouchModal(this.client.id,this.client.name)}),void 0)}),document.querySelectorAll(`[data-toggle]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.toggle,n=document.querySelector(`[data-body="${t}"]`),r=e.querySelector(`span:last-child`);if(!n)return;let i=n.style.display===`none`;n.style.display=i?``:`none`,r&&(r.textContent=i?`▼`:`▶`)})}),document.querySelectorAll(`.tp-del-detail`).forEach(e=>{e.addEventListener(`click`,async t=>{t.stopPropagation(),await f.deleteTouchPoint(e.dataset.id),window.App.toast(`Удалено`,`success`),this._loadTouches()})}),document.querySelectorAll(`.tp-detail-card`).forEach(t=>{t.addEventListener(`click`,n=>{if(n.target.closest(`.tp-del-detail`))return;let r=t.dataset.id,i=t.querySelector(`.tp-detail-expanded`);if(i){i.remove();return}let a=e.find(e=>String(e.id)===String(r));if(!a?.notes)return;let o=a.notes,s=[{re:/ Контекст:\n([\s\S]*?)(?:\n\n|$)/,icon:``,label:`Контекст`},{re:/ Задачи:\n([\s\S]*?)(?:\n\n|$)/,icon:``,label:`Задачи`},{re:/ Дальнейшие шаги:\n([\s\S]*?)(?:\n\n|$)/,icon:``,label:`Дальнейшие шаги`},{re:/ Стратегия:\n([\s\S]*?)(?:\n\n|$)/,icon:``,label:`Стратегия`},{re:/ Ожидаемый результат:\n([\s\S]*?)(?:\n\n|$)/,icon:``,label:`Результат`},{re:/ Блокеры:\n([\s\S]*?)(?:\n\n|$)/,icon:``,label:`Блокеры`}],c=s.some(e=>e.re.test(o)),l=document.createElement(`div`);l.className=`tp-detail-expanded`,l.style.cssText=`margin-top:10px;padding-top:10px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px`,c?l.innerHTML=s.map(e=>{let t=o.match(e.re);return t?`<div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                        letter-spacing:.5px;color:var(--text-muted);margin-bottom:3px">
              ${e.icon} ${e.label}
            </div>
            <div style="font-size:13px;color:var(--text-primary);line-height:1.5;
                        white-space:pre-wrap">${t[1].trim()}</div>
          </div>`:``}).join(``):l.innerHTML=`<div style="font-size:13px;color:var(--text-primary);
                                          line-height:1.5;white-space:pre-wrap">${o}</div>`,t.appendChild(l)})})},_renderKPICards(e,t){let n=e.bchs===null?`var(--text-muted)`:this._bchsColor(e.bchs),r=e.trend?this._trendColor(e.trend.cls):`var(--text-muted)`,i=e.loyalty===null?`#6b7280`:e.loyalty>=70?`#10b981`:e.loyalty>=50?`#f59e0b`:`#ef4444`,a=e.revenueEfficiency===null?`#6b7280`:e.revenueEfficiency>=.95?`#10b981`:e.revenueEfficiency>=.8?`#f59e0b`:`#ef4444`;return[{id:`bchs`,label:`Лояльность · `+t,value:e.loyalty===null?`—`:e.loyalty+`%`,hint:e.health.label.replace(/[^\w\s%А-яЁё—+\-.,:()/]/gu,``).trim(),valueColor:i,detail:`
          <div class="kpi-det-title">Здоровье аккаунта</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Лояльность</span>
            <span class="kpi-det-risk" style="color:${i}">${e.loyalty===null?`—`:e.loyalty+`%`}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">bCHS (сырой балл)</span>
            <span class="kpi-det-risk" style="color:${n}">${e.bchs===null?`—`:e.bchs+` из 81`}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Шкала</span>
            <span class="kpi-det-risk" style="color:#9ca3af">−81 ... +81 → 0–100%</span>
          </div>`},{id:`score`,label:`% Потенциала`,value:e.pctPot===null?`—`:e.pctPot+`%`,hint:e.final===null?`нет данных`:e.final.toFixed(1)+` из `+e.ideal,valueColor:e.pctPot===null?`#6b7280`:e.pctPot>=85?`#10b981`:e.pctPot>=65?`#f59e0b`:`#ef4444`,detail:`
          <div class="kpi-det-title">Реализация потенциала</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Реализовано</span>
            <span class="kpi-det-risk">${e.pctPot===null?`—`:e.pctPot+`%`}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Final Score</span>
            <span class="kpi-det-risk">${e.final===null?`—`:e.final.toFixed(1)}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Идеал для ${e.client?.bcg_category??`сегмента`}</span>
            <span class="kpi-det-risk">${e.ideal} (100%)</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">PC Score / нагрузка</span>
            <span class="kpi-det-risk">${e.pcScore===null?`—`:e.pcScore.toFixed(1)} · ${e.load.label.replace(/[^\w\s%А-яЁё—+\-.,:()/]/gu,``).trim()}</span>
          </div>`},{id:`trend`,label:`Тренд 3М`,value:e.trend?e.trend.label:`—`,hint:e.trend?`Δ `+(e.trend.delta>0?`+`:``)+e.trend.delta:`нет данных`,valueColor:r,detail:`
          <div class="kpi-det-title">Динамика bCHS</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Направление</span>
            <span class="kpi-det-risk" style="color:${r}">${e.trend?e.trend.label:`—`}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Изменение</span>
            <span class="kpi-det-risk">${e.trend?(e.trend.delta>0?`+`:``)+e.trend.delta:`—`}</span>
          </div>`},{id:`revenue`,label:`Revenue Efficiency`,value:e.revenueEfficiency===null?`—`:Math.round(e.revenueEfficiency*100)+`%`,hint:e.revenueEfficiency===null?`нет FTE данных`:e.revenueEfficiency>=.95?`Отлично`:e.revenueEfficiency>=.8?`Внимание`:`Критично`,valueColor:a,detail:`
          <div class="kpi-det-title">Эффективность дохода</div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Показатель</span>
            <span class="kpi-det-risk" style="color:${a}">${e.revenueEfficiency===null?`—`:Math.round(e.revenueEfficiency*100)+`%`}</span>
          </div>
          <div class="kpi-det-row">
            <span class="kpi-det-label">Статус</span>
            <span class="kpi-det-risk">${e.revenueEfficiency===null?`нет FTE данных`:e.revenueEfficiency>=.95?`Отлично`:e.revenueEfficiency>=.8?`Внимание`:`Критично`}</span>
          </div>`}].map(e=>`
      <div class="pf-kpi-card" data-card="${e.id}">
        <div class="pf-kpi-card-collapsed">
          <div class="pf-kpi-card-label">${e.label}</div>
          <div class="pf-kpi-card-value" style="color:${e.valueColor}">${e.value}</div>
          <div class="pf-kpi-card-hint">${e.hint}</div>
        </div>
        <div class="pf-kpi-card-detail" style="display:none">${e.detail}</div>
      </div>`).join(``)},_openActionsPanel(){let e=this.client;if(document.getElementById(`detail-actions-panel`)?.remove(),!document.getElementById(`dap-styles`)){let e=document.createElement(`style`);e.id=`dap-styles`,e.textContent=`
        .dap-action-btn {
          display:flex;align-items:center;gap:12px;
          padding:12px 14px;border-radius:10px;
          border:1.5px solid #f0f0f5;background:#fff;
          cursor:pointer;text-align:left;width:100%;
          transition:all .15s;
        }
        .dap-action-btn:hover { border-color:#6366f1;background:#f8f7ff; }
        .dap-action-icon {
          width:36px;height:36px;border-radius:8px;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        .dap-action-title { font-size:13px;font-weight:600;color:#111827;margin-bottom:2px; }
        .dap-action-sub   { font-size:11px;color:#9ca3af; }
      `,document.head.appendChild(e)}let t=document.createElement(`div`);t.id=`detail-actions-panel`,t.innerHTML=`
      <div class="variant-picker-backdrop" id="dap-backdrop"></div>
      <div class="variant-picker-panel" id="dap-panel">
        <div class="variant-picker-header">
          <span style="font-size:14px;font-weight:700">${e.name}</span>
          <button class="variant-picker-close" id="dap-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="variant-picker-body" style="padding:16px;display:flex;flex-direction:column;gap:8px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                      letter-spacing:.06em;color:#9ca3af;margin-bottom:4px">
            Быстрые действия
          </div>
          <button class="dap-action-btn" id="dap-add-data">
            <div class="dap-action-icon" style="background:#eef2ff;color:#6366f1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Добавить данные</div>
              <div class="dap-action-sub">Текущий период</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-edit-client">
            <div class="dap-action-icon" style="background:#f0fdf4;color:#10b981">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Редактировать клиента</div>
              <div class="dap-action-sub">Профиль и настройки</div>
            </div>
          </button>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                      letter-spacing:.06em;color:#9ca3af;margin:8px 0 4px">
            Разделы
          </div>
          <button class="dap-action-btn" id="dap-history">
            <div class="dap-action-icon" style="background:#eff6ff;color:#3b82f6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">История</div>
              <div class="dap-action-sub">bCHS по месяцам</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-touches">
            <div class="dap-action-icon" style="background:#fff7ed;color:#f97316">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Касания</div>
              <div class="dap-action-sub">История встреч</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-notes">
            <div class="dap-action-icon" style="background:#fefce8;color:#ca8a04">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Заметки</div>
              <div class="dap-action-sub">Стратегия и комментарии</div>
            </div>
          </button>
          <button class="dap-action-btn" id="dap-delivery">
            <div class="dap-action-icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Delivery</div>
              <div class="dap-action-sub">Команда и роли</div>
            </div>
          </button>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                      letter-spacing:.06em;color:#9ca3af;margin:8px 0 4px">
            Аналитика
          </div>
          <button class="dap-action-btn" id="dap-mc">
            <div class="dap-action-icon" style="background:#f5f3ff;color:#8b5cf6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div>
              <div class="dap-action-title">Monte Carlo</div>
              <div class="dap-action-sub">Прогноз 3–12 месяцев</div>
            </div>
          </button>
        </div>
      </div>
    `,document.body.appendChild(t),requestAnimationFrame(()=>document.getElementById(`dap-panel`)?.classList.add(`visible`));let n=()=>{document.getElementById(`dap-panel`)?.classList.remove(`visible`),setTimeout(()=>t.remove(),300)};document.getElementById(`dap-backdrop`)?.addEventListener(`click`,n),document.getElementById(`dap-close`)?.addEventListener(`click`,n),document.getElementById(`dap-add-data`)?.addEventListener(`click`,()=>{n(),window.App.navigate(`entry`,this.client.id)}),document.getElementById(`dap-edit-client`)?.addEventListener(`click`,()=>{n(),window.App.navigate(`clients`,this.client.id)});let r=e=>{n(),this.activeTab=e,document.querySelectorAll(`.detail-tab-btn`).forEach(t=>t.classList.toggle(`active`,t.dataset.tab===e)),this._renderActiveTab()};document.getElementById(`dap-history`)?.addEventListener(`click`,()=>r(`history`)),document.getElementById(`dap-touches`)?.addEventListener(`click`,()=>r(`touches`)),document.getElementById(`dap-notes`)?.addEventListener(`click`,()=>r(`notes`)),document.getElementById(`dap-delivery`)?.addEventListener(`click`,()=>r(`delivery`)),document.getElementById(`dap-mc`)?.addEventListener(`click`,()=>r(`mc`))},_bindDetailEvents(){let e=document.getElementById(`cd-kpi-grid`);if(e){let t=()=>{e.querySelectorAll(`.pf-kpi-card`).forEach(e=>{e.classList.remove(`pf-kpi-active`,`pf-kpi-dimmed`);let t=e.querySelector(`.pf-kpi-card-detail`);t&&(t.style.display=`none`)})};document.addEventListener(`click`,n=>{e.contains(n.target)||t()}),e.addEventListener(`click`,n=>{n.stopPropagation();let r=n.target.closest(`.pf-kpi-card`);if(!r)return;if(n.target.closest(`.pf-kpi-card-close`)){t();return}if(r.classList.contains(`pf-kpi-active`)){t();return}e.querySelectorAll(`.pf-kpi-card`).forEach(e=>{e.classList.remove(`pf-kpi-active`),e.classList.add(`pf-kpi-dimmed`);let t=e.querySelector(`.pf-kpi-card-detail`);t&&(t.style.display=`none`)}),r.classList.remove(`pf-kpi-dimmed`),r.classList.add(`pf-kpi-active`);let i=r.querySelector(`.pf-kpi-card-detail`);i&&(i.style.display=`block`)})}document.getElementById(`btn-actions-panel`)?.addEventListener(`click`,()=>this._openActionsPanel()),document.getElementById(`btn-back-dash`)?.addEventListener(`click`,()=>window.App.navigate(`dashboard`)),document.getElementById(`btn-add-data`)?.addEventListener(`click`,()=>window.App.navigate(`entry`,this.client.id)),document.getElementById(`btn-edit-client`)?.addEventListener(`click`,()=>window.App.navigate(`clients`,this.client.id)),document.querySelectorAll(`.detail-tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{this.activeTab=e.dataset.tab,document.querySelectorAll(`.detail-tab-btn`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),this.chartInstance&&=(this.chartInstance.destroy(),null),this._renderActiveTab()})}),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="edit-month"]`);t&&window.App.navigateEntryMonthYear(this.client.id,parseInt(t.dataset.month),parseInt(t.dataset.year))})},navigate(e){this.activeTab=e;let t=document.querySelector(`.detail-tab-btn[data-tab="${e}"]`);t&&(document.querySelectorAll(`.detail-tab-btn`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),this._renderActiveTab())}},de={clients:[],editingId:null,highlightId:null,async render(e){this.highlightId=e||null;let t=document.getElementById(`main-content`);if(t.innerHTML=`
      <div class="page-header">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
          <div>
            <div class="page-title">Клиенты</div>
            <div class="page-subtitle">Управление портфелем клиентов</div>
          </div>
          <button class="btn btn-primary" id="btn-add-client">+ Добавить клиента</button>
        </div>
      </div>
      <div id="clients-list-container">
        <div style="padding:40px;text-align:center;color:var(--text-muted)">Загрузка...</div>
      </div>
      <div id="client-form-container" class="hidden"></div>
    `,document.getElementById(`btn-add-client`).addEventListener(`click`,()=>{this.editingId=null,this.showForm(null)}),await this.loadAndRender(),e){this.editingId=e;let t=this.clients.find(t=>t.id===e);t&&this.showForm(t)}},async loadAndRender(){this.clients=await f.getClients(),this.renderList()},renderList(){let e=document.getElementById(`clients-list-container`);if(!e)return;if(this.clients.length===0){e.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon">👤</div>
          <div class="empty-state-title">Нет клиентов</div>
          <div class="empty-state-text">Добавьте первого клиента, чтобы начать работу</div>
        </div>`;return}let t=this.clients.filter(e=>e.status===`Active`),n=this.clients.filter(e=>e.status===`Paused`),r=this.clients.filter(e=>e.status===`Self-managed`),i=``;t.length&&(i+=this._renderGroup(`✅ Активные`,t)),n.length&&(i+=this._renderGroup(`⏸ На паузе`,n)),r.length&&(i+=this._renderGroup(`🔧 Самоуправление`,r)),e.innerHTML=i,this._bindListEvents()},_renderGroup(e,t){return`
      <div style="margin-bottom:20px">
        <div class="section-header">
          ${e}<span class="section-count">${t.length}</span>
        </div>
        ${t.map(e=>this._renderClientCard(e)).join(``)}
      </div>`},_renderClientCard(e){let t=a[e.bcg_category],n=this.highlightId===e.id;return`
      <div class="client-card${n?` expanded`:``}"
           data-id="${e.id}"
           style="${n?`border-color:var(--blue);box-shadow:0 0 0 1px var(--blue-border)`:``}">
        <div class="client-card-info">
          <div class="client-card-name">${e.name}</div>
          <div class="client-card-meta">
            <span class="bcg-badge">${t?t.label:e.bcg_category}</span>
            <span>🎯 ${e.key_account_priority}</span>
            <span>👤 ${e.sales_owner||`—`}</span>
          </div>
        </div>
        <div class="client-card-actions">
          <button class="btn btn-secondary btn-sm" data-action="detail" data-id="${e.id}">📊 Детали</button>
          <button class="btn btn-secondary btn-sm" data-action="edit"   data-id="${e.id}">✎ Изменить</button>
          <button class="btn btn-danger btn-sm"    data-action="delete" data-id="${e.id}">✕</button>
        </div>
      </div>`},_bindListEvents(){document.querySelectorAll(`[data-action="detail"]`).forEach(e=>e.addEventListener(`click`,()=>window.App.navigate(`detail`,e.dataset.id))),document.querySelectorAll(`[data-action="edit"]`).forEach(e=>e.addEventListener(`click`,()=>{let t=this.clients.find(t=>t.id===e.dataset.id);t&&(this.editingId=t.id,this.showForm(t))})),document.querySelectorAll(`[data-action="delete"]`).forEach(e=>e.addEventListener(`click`,async()=>{let t=this.clients.find(t=>t.id===e.dataset.id);t&&confirm(`Удалить клиента «${t.name}»?\nВсе данные bCHS и PC будут недоступны.`)&&(await f.deleteClient(e.dataset.id),window.App.toast(`«${t.name}» удалён`,``),await this.loadAndRender())}))},showForm(e){let t=!!e,n=(t,n=``)=>e?this._esc(String(e[t]??n)):n,r=(e,t)=>e.map(e=>`<option value="${e}" ${t===e?`selected`:``}>${e}</option>`).join(``),i=o.map(t=>`<option value="${t}" ${(e?.status??`Active`)===t?`selected`:``}>${t}</option>`).join(``);if(!document.getElementById(`wiz-styles`)){let e=document.createElement(`style`);e.id=`wiz-styles`,e.textContent=`
      .wiz-field { display:flex; flex-direction:column; gap:6px }
      .wiz-label {
        font-size:11px; font-weight:700; color:#94a3b8;
        letter-spacing:.08em; text-transform:uppercase
      }
      .wiz-divider {
        height:1px; background:#f1f5f9; margin:4px 0
      }
      .wiz-section-title {
        font-size:12px; font-weight:700; color:#475569;
        letter-spacing:.06em; text-transform:uppercase;
        padding:10px 0 6px; border-bottom:2px solid #e2e8f0;
        margin-bottom:12px
      }
      .form-select, .form-input {
        transition: border-color .15s;
      }
      .form-select:focus, .form-input:focus {
        border-color:#2563eb !important;
        outline:none;
        box-shadow:0 0 0 3px #dbeafe;
      }
    `,document.head.appendChild(e)}let a=[{emoji:`🏢`,title:`Основное`,hint:`Название, статус и тип`,html:()=>`
        <div class="wiz-field">
          <label class="wiz-label">Название компании <span style="color:#ef4444">*</span></label>
          <input class="form-input" id="cf-name" placeholder="ООО Пример"
                 value="${n(`name`)}"
                 style="font-size:15px;padding:12px 14px;font-weight:500" autofocus/>
        </div>

        <div class="wiz-divider" style="margin-top:16px"></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px">
          <div class="wiz-field">
            <label class="wiz-label">Статус</label>
            <select class="form-select" id="cf-status">${i}</select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">MR (₽/мес)</label>
            <input class="form-input" id="cf-mr" type="number"
                   value="${n(`monthly_revenue`,`5000`)}" placeholder="5000"/>
          </div>
        </div>

        <div class="wiz-divider" style="margin-top:16px"></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px">
          <div class="wiz-field">
            <label class="wiz-label">Тип клиента</label>
            <select class="form-select" id="cf-type">
              ${r([`Direct`,`Partner`,`Body-shop`],e?.client_type??`Direct`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Фаза</label>
            <select class="form-select" id="cf-phase">
              ${r([`Discovery`,`Ongoing`,`SLA`,`Winding Down`],e?.phase??`Ongoing`)}
            </select>
          </div>
        </div>

        <div id="cf-access-wrap" style="display:none">
          <div class="wiz-divider" style="margin-top:16px"></div>
          <div style="margin-top:12px;padding:12px 14px;background:#eff6ff;
                      border-radius:10px;border:1px solid #bfdbfe">
            <div style="font-size:11px;font-weight:700;color:#2563eb;
                        letter-spacing:.06em;margin-bottom:10px">
              🤝 ПАРТНЁРСКИЙ ДОСТУП
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div class="wiz-field">
                <label class="wiz-label">Доступ к конечному клиенту</label>
                <select class="form-select" id="cf-access">
                  ${r([`Strategic Partner`,`Potential`,`Blocks`,`N/A`],e?.access_to_end_client??`N/A`)}
                </select>
              </div>
              <div class="wiz-field">
                <label class="wiz-label">Уровень ЛПР</label>
                <select class="form-select" id="cf-dm">
                  ${r([`C-level`,`Tech Lead`,`Gatekeeper`],e?.decision_maker_level??`Tech Lead`)}
                </select>
              </div>
            </div>
          </div>
        </div>`},{emoji:`📊`,title:`Профиль`,hint:`Стратегическая и операционная ценность`,html:()=>`
        <div class="wiz-section-title">🎯 Стратегическая ценность</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
          <div class="wiz-field">
            <label class="wiz-label">Технологическая</label>
            <select class="form-select" id="cf-tech">
              ${r([`Strategic`,`Standard`,`Basic`],e?.tech_value??`Standard`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Брендовая</label>
            <select class="form-select" id="cf-brand">
              ${r([`Top`,`Recognizable`,`Unknown`],e?.brand_value??`Recognizable`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Потенциал роста</label>
            <select class="form-select" id="cf-growth">
              ${r([`Yes`,`No`],e?.growth_potential??`Yes`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Managed Services</label>
            <select class="form-select" id="cf-ms">
              ${r([`Yes`,`Partial`,`No`],e?.managed_services_potential??`Partial`)}
            </select>
          </div>
        </div>

        <div class="wiz-section-title">⚙️ Операционный профиль</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="wiz-field">
            <label class="wiz-label">Длительность контракта</label>
            <select class="form-select" id="cf-contract">
              ${r([`Stable (6+)`,`Medium (3-6)`,`Short (1-3)`],e?.contract_length??`Medium (3-6)`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Сложность клиента</label>
            <select class="form-select" id="cf-difficulty">
              ${r([`Normal`,`Conflict`],e?.client_difficulty??`Normal`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Вовлечённость</label>
            <select class="form-select" id="cf-engagement">
              ${r([`Proactive`,`Active`,`Reactive`],e?.client_engagement??`Active`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Операц. сложность</label>
            <select class="form-select" id="cf-opdiff">
              ${r([`Normal`,`Hard`],e?.operational_difficulty??`Normal`)}
            </select>
          </div>
        </div>`},{emoji:`👥`,title:`Команда`,hint:`Кто работает с клиентом`,html:()=>`
        <div class="wiz-section-title">👤 Ответственные</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
          <div class="wiz-field">
            <label class="wiz-label">Зрелость команды</label>
            <select class="form-select" id="cf-maturity">
              ${r([`Junior`,`Standard`,`Senior`],e?.team_maturity??`Standard`)}
            </select>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Ответственный</label>
            <input class="form-input" id="cf-owner"
                   value="${n(`sales_owner`)}" placeholder="Имя менеджера"/>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Аккаунт-менеджер</label>
            <input class="form-input" id="cf-am"
                   value="${n(`account_manager`)}" placeholder="Имя АМ"/>
          </div>
          <div class="wiz-field">
            <label class="wiz-label">Координатор</label>
            <input class="form-input" id="cf-coord"
                   value="${n(`coordinator`)}" placeholder="Имя координатора"/>
          </div>
        </div>

        <div class="wiz-section-title">🗺 Регион</div>
        <div class="wiz-field" style="margin-bottom:20px">
          <label class="wiz-label">DACH-регион</label>
          <select class="form-select" id="cf-region" style="max-width:200px">
            ${r([`— не выбран —`,`DE`,`AT`,`CH`,`Other`],e?.dach_region??`— не выбран —`)}
          </select>
        </div>

        <div class="wiz-section-title">📝 Заметки</div>
        <div class="wiz-field">
          <label class="wiz-label">Стратегические заметки</label>
          <textarea class="form-textarea" id="cf-notes"
                    style="min-height:90px;resize:vertical"
                    placeholder="Любые важные детали о клиенте...">${n(`strategy_notes`)}</textarea>
        </div>`}],s=0,c=()=>a.map((e,t)=>`
    <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1">
      <div style="
        width:38px;height:38px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:17px;transition:all .2s;
        ${t<s?`background:#22c55e;color:#fff;box-shadow:0 2px 8px #86efac`:t===s?`background:#2563eb;color:#fff;box-shadow:0 2px 12px #93c5fd`:`background:#f1f5f9;color:#94a3b8`}
      ">${t<s?`✓`:e.emoji}</div>
      <div style="
        font-size:11px;font-weight:${t===s?`700`:`500`};
        color:${t===s?`#2563eb`:t<s?`#22c55e`:`#94a3b8`}
      ">${e.title}</div>
    </div>
    ${t<a.length-1?`
      <div style="flex:1;height:2px;margin-top:19px;max-width:48px;border-radius:2px;
                  background:${t<s?`#86efac`:`#e2e8f0`}"></div>
    `:``}
  `).join(``),l=()=>`
    <div style="padding:24px 28px;width:100%;max-width:500px;box-sizing:border-box">

      <div style="display:flex;align-items:center;margin-bottom:28px">
        ${c()}
      </div>

      <div style="margin-bottom:20px">
        <div style="font-size:20px;font-weight:700;color:#0f172a;letter-spacing:-.3px">
          ${a[s].title}
        </div>
        <div style="font-size:13px;color:#94a3b8;margin-top:3px">
          ${a[s].hint}
        </div>
      </div>

      <div id="wiz-body">${a[s].html()}</div>

      <div style="display:flex;gap:10px;margin-top:24px;align-items:center;
                  border-top:1px solid #f1f5f9;padding-top:16px">
        ${s>0?`<button id="wiz-back" class="btn btn-secondary" style="min-width:90px">← Назад</button>`:``}
        <div style="flex:1"></div>
        <button id="wiz-cancel" class="btn btn-secondary">Отмена</button>
        ${s<a.length-1?`<button id="wiz-next" class="btn btn-primary" style="min-width:110px">Далее →</button>`:`<button id="wiz-save" class="btn btn-primary" style="min-width:140px">
               ${t?`💾 Сохранить`:`🚀 Создать клиента`}
             </button>`}
      </div>

    </div>`,u=()=>{let e=document.querySelector(`#modal-overlay > div, .modal-inner, .modal-content`);e&&(e.innerHTML=l()),d()},d=()=>{if(document.getElementById(`wiz-cancel`)?.addEventListener(`click`,()=>window.App.closeModal?.()),document.getElementById(`wiz-back`)?.addEventListener(`click`,()=>{s--,u()}),document.getElementById(`wiz-next`)?.addEventListener(`click`,()=>{if(s===0&&!document.getElementById(`cf-name`)?.value.trim()){document.getElementById(`cf-name`)?.focus(),window.App.toast?.(`Введи название компании`,`error`);return}s++,u()}),document.getElementById(`wiz-save`)?.addEventListener(`click`,()=>this._saveForm()),s===0){let e=document.getElementById(`cf-type`),t=document.getElementById(`cf-access-wrap`),n=()=>{t&&(t.style.display=e?.value===`Partner`?`block`:`none`)};e?.addEventListener(`change`,n),n()}};window.App.openModal(l(),{hideClose:!1}),d()},async _saveForm(){let e=e=>document.getElementById(e)?.value.trim()??``,t=e(`cf-name`);if(!t){window.App.toast(`Введите название клиента`,`error`);return}let n=e(`cf-type`)===`Partner`,r={name:t,status:e(`cf-status`),monthly_revenue:Number(e(`cf-mr`))||0,client_type:e(`cf-type`),phase:e(`cf-phase`),access_to_end_client:n?e(`cf-access`):null,decision_maker_level:n?e(`cf-dm`):null,tech_value:e(`cf-tech`),brand_value:e(`cf-brand`),growth_potential:e(`cf-growth`),managed_services_potential:e(`cf-ms`),contract_length:e(`cf-contract`),client_difficulty:e(`cf-difficulty`),client_engagement:e(`cf-engagement`),operational_difficulty:e(`cf-opdiff`),team_maturity:e(`cf-maturity`),sales_owner:e(`cf-owner`),account_manager:e(`cf-am`),coordinator:e(`cf-coord`),dach_region:e(`cf-region`)===`— не выбран —`?``:e(`cf-region`),strategy_notes:e(`cf-notes`)},i=document.getElementById(`wiz-save`);i&&(i.disabled=!0,i.textContent=`⏳ Сохраняем...`);try{this.editingId?(await f.updateClient(this.editingId,r),window.App.toast(`✅ Клиент обновлён`,`success`)):(await f.createClient(r),window.App.toast(`✅ Клиент создан`,`success`)),this.editingId=null,this.highlightId=null,window.App.closeModal?.(),await this.loadAndRender()}catch(e){console.error(`[ClientsPage._saveForm]`,e),window.App.toast(`❌ Ошибка сохранения`,`error`),i&&(i.disabled=!1,i.textContent=this.editingId?`💾 Сохранить`:`🚀 Создать клиента`)}},_esc(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}},fe={_fmtCacheDate(e,t){try{let n=(JSON.parse(localStorage.getItem(`bchs_calendar_cache`)||`null`)||{})[`${e}_${t}`];return n?new Date(n.cachedAt).toLocaleDateString(`ru-RU`,{day:`2-digit`,month:`2-digit`,year:`numeric`}):null}catch{return null}},_statusLabel(e){return{api:`API`,stale:`Устаревает`,fallback:`Встроенные`}[e]||`Неизвестно`},_statusIcon(e){return{api:`🟢`,stale:`🟡`,fallback:`🔴`}[e]||`⚪`},_getMonths(e=6){let t=[],n=O.currentYearMonth();for(let r=0;r<e;r++)t.push(n),n=O.nextYearMonth(n);return t},_renderStatusSection(){let e=new Date().getFullYear(),t=Object.keys(h),n=t.map(t=>{let n=h[t],r=O.getCacheStatus(t,e),i=this._statusLabel(r),a=this._statusIcon(r),o=this._fmtCacheDate(t,e);return`
        <div class="cal-status-badge cal-status-${r}"
             title="${o?`Обновлено: ${o}`:`Данные встроены`}">
          <span class="cal-status-icon">${a}</span>
          <span class="cal-status-flag">${n.flag}</span>
          <span class="cal-status-name">${n.id}</span>
          <span class="cal-status-label">${i}</span>
        </div>`}).join(``),r=t.some(t=>O.getCacheStatus(t,e)===`stale`);return`
      <section class="cal-section cal-status-section">
        <div class="cal-section-header">
          <h3 class="cal-section-title">Источники данных</h3>
          <button class="btn btn-sm btn-ghost" id="cal-refresh-btn"
                  title="Обновить кэш из API">↺ Обновить</button>
        </div>
        <div class="cal-status-row">${n}</div>
        <p class="cal-status-tip">${t.some(t=>O.getCacheStatus(t,e)===`fallback`)?`Часть данных — встроенные. Подключитесь к интернету для обновления.`:r?`Часть данных скоро устареет. Обновление произойдёт автоматически.`:`Все данные актуальны из API.`}</p>
      </section>`},_renderLocationCards(){let e=O.currentYearMonth(),t=O.nextYearMonth(e);return`
      <section class="cal-section">
        <div class="cal-section-header">
          <h3 class="cal-section-title">Локации</h3>
        </div>
        <div class="cal-cards-grid">${Object.values(h).map(n=>{let r=O.getMonthData(n.id,e),i=O.getMonthData(n.id,t),a=O.getMonthName(e),o=O.getMonthName(t),s=`
        <span class="cal-src-badge cal-src-${r.source}">
          ${this._statusLabel(r.source)}
        </span>`,c=r.holidays.length?r.holidays.map(e=>`<span class="cal-holiday-chip">
              ${new Date(e+`T00:00:00`).toLocaleDateString(`ru-RU`,{day:`numeric`,month:`short`})}
            </span>`).join(``):`<span class="cal-no-holidays">нет праздников</span>`;return`
        <article class="cal-card" data-loc="${n.id}">
          <header class="cal-card-header">
            <span class="cal-card-flag">${n.flag}</span>
            <div class="cal-card-title-group">
              <h4 class="cal-card-name">${n.name}</h4>
              <span class="cal-card-tz">${n.timezone}</span>
            </div>
            ${s}
          </header>

          <div class="cal-card-months">
            <div class="cal-month-block cal-month-current">
              <div class="cal-month-label">${a}</div>
              <div class="cal-month-stats">
                <div class="cal-stat">
                  <span class="cal-stat-val">${r.workdays}</span>
                  <span class="cal-stat-name">дней</span>
                </div>
                <div class="cal-stat">
                  <span class="cal-stat-val">${r.hours}</span>
                  <span class="cal-stat-name">часов</span>
                </div>
              </div>
              <div class="cal-holidays-row">${c}</div>
            </div>

            <div class="cal-month-divider"></div>

            <div class="cal-month-block cal-month-next">
              <div class="cal-month-label">${o}</div>
              <div class="cal-month-stats">
                <div class="cal-stat">
                  <span class="cal-stat-val">${i.workdays}</span>
                  <span class="cal-stat-name">дней</span>
                </div>
                <div class="cal-stat">
                  <span class="cal-stat-val">${i.hours}</span>
                  <span class="cal-stat-name">часов</span>
                </div>
              </div>
            </div>
          </div>

          <footer class="cal-card-footer">
            <button class="btn btn-ghost btn-xs cal-export-btn"
                    data-loc="${n.id}"
                    title="Скачать JSON">↓ Экспорт</button>
            <button class="btn btn-ghost btn-xs cal-refresh-loc-btn"
                    data-loc="${n.id}"
                    title="Обновить регион из API">↺ Обновить</button>
          </footer>
        </article>`}).join(``)}</div>
      </section>`},_renderMyCalendars(){let e=O.getLocations().filter(e=>e.source===`custom`);return`
      <section class="cal-section">
        <div class="cal-section-header">
          <h3 class="cal-section-title">Мои календари</h3>
          <button class="btn btn-primary btn-sm" id="cal-import-btn">
            + Импорт JSON
          </button>
        </div>
        ${e.length===0?`<div class="cal-custom-empty">
           <span class="cal-custom-empty-icon">🌍</span>
           <p>Нет кастомных календарей</p>
           <p class="text-muted">Загрузите JSON с данными о рабочих днях</p>
         </div>`:``}
        <div class="cal-custom-list">${e.map(e=>{let t=O.getMonthData(e.id,O.currentYearMonth());return`
        <div class="cal-custom-card">
          <span class="cal-card-flag">${e.flag}</span>
          <div class="cal-custom-card-info">
            <strong>${e.name}</strong>
            <span class="text-muted">${e.id}</span>
          </div>
          <div class="cal-custom-card-stats">
            <span>${t.workdays} дн.</span>
            <span>${t.hours} ч.</span>
          </div>
          <div class="cal-custom-card-actions">
            <button class="btn btn-ghost btn-xs cal-export-btn"
                    data-loc="${e.id}" title="Скачать JSON">↓</button>
            <button class="btn btn-danger btn-xs cal-remove-custom-btn"
                    data-loc="${e.id}" title="Удалить">✕</button>
          </div>
        </div>`}).join(``)}</div>
      </section>`},_renderComparisonTable(){let e=this._getMonths(6),t=Object.values(h),n=[],r={};for(let i of t){r[i.id]={};for(let t of e){let e=O.getMonthData(i.id,t);r[i.id][t]=e,n.push(e.workdays)}}let i=Math.min(...n),a=Math.max(...n);return`
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
                ${e.map(e=>`<th class="cmp-th-month">${O.getMonthName(e)}</th>`).join(``)}
              </tr>
            </thead>
            <tbody>${t.map(t=>{let n=e.map(e=>{let n=r[t.id][e],o=n.workdays,s=``;o===i&&(s=`cmp-min`),o===a&&(s=`cmp-max`);let c=`
          <span class="cmp-src-dot cmp-src-${n.source}"
                title="${this._statusLabel(n.source)}"></span>`;return`
          <td class="cmp-td ${s}">
            <span class="cmp-wd">${o}</span>
            <span class="cmp-h">${n.hours}ч</span>
            ${c}
          </td>`}).join(``);return`
        <tr class="cmp-row">
          <td class="cmp-td-loc">
            <span class="cal-card-flag">${t.flag}</span>
            <span class="cmp-loc-name">${t.name}</span>
          </td>
          ${n}
        </tr>`}).join(``)}</tbody>
          </table>
        </div>
        <p class="cal-table-note">
          * Числа = рабочие дни.
          <span class="cmp-src-dot cmp-src-api"></span> API&nbsp;
          <span class="cmp-src-dot cmp-src-stale"></span> Устаревает&nbsp;
          <span class="cmp-src-dot cmp-src-fallback"></span> Встроенные
        </p>
      </section>`},_openImportModal(){window.App.openModal(`
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
      </div>`),this._bindImportModal()},_bindImportModal(){let e=null;document.querySelectorAll(`.cal-import-tab`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.cal-import-tab`).forEach(e=>e.classList.remove(`active`)),document.querySelectorAll(`.cal-import-tab-panel`).forEach(e=>e.classList.add(`hidden`)),e.classList.add(`active`),document.querySelector(`.cal-import-tab-panel[data-panel="${e.dataset.tab}"]`).classList.remove(`hidden`)})}),document.getElementById(`cal-template-download-btn`)?.addEventListener(`click`,()=>O.exportTemplate());let t=document.getElementById(`cal-dropzone`),n=document.getElementById(`cal-file-input`);t?.addEventListener(`click`,()=>n?.click()),t?.addEventListener(`dragover`,e=>{e.preventDefault(),t.classList.add(`cal-dropzone-active`)}),t?.addEventListener(`dragleave`,()=>{t.classList.remove(`cal-dropzone-active`)}),t?.addEventListener(`drop`,n=>{n.preventDefault(),t.classList.remove(`cal-dropzone-active`);let r=n.dataTransfer.files[0];r&&this._readImportFile(r,t=>{e=t})}),n?.addEventListener(`change`,()=>{let t=n.files[0];t&&this._readImportFile(t,t=>{e=t})}),document.getElementById(`cal-import-confirm-btn`)?.addEventListener(`click`,async()=>{if(!e)return;let t=document.getElementById(`cal-import-confirm-btn`);t.disabled=!0,t.textContent=`⏳ Импортирую...`;let n=O.importFromJSON(JSON.stringify(e));n.success?(window.App.closeModal(),window.App.toast(`Импортировано: ${e.name} (${n.monthsCount} месяцев)`,`success`),await this.render()):(t.disabled=!1,t.textContent=`✓ Импортировать`,document.getElementById(`cal-import-status`).innerHTML=`<div class="cal-validation-error">❌ ${n.error}</div>`)})},_readImportFile(e,t){let n=new FileReader,r=document.getElementById(`cal-import-status`),i=document.getElementById(`cal-import-preview`),a=document.getElementById(`cal-import-confirm-btn`);n.onload=e=>{let n;try{n=JSON.parse(e.target.result)}catch{r.innerHTML=`<div class="cal-validation-error">❌ Невалидный JSON</div>`,i.classList.add(`hidden`),a&&(a.disabled=!0);return}let o=[];if(n.id||o.push(`Отсутствует поле id`),n.name||o.push(`Отсутствует поле name`),(!n.months||typeof n.months!=`object`)&&o.push(`Отсутствует или неверное поле months`),o.length){r.innerHTML=`<div class="cal-validation-error">❌ ${o.join(`; `)}</div>`,i.classList.add(`hidden`),a&&(a.disabled=!0);return}let s=Object.keys(n.months),c=s.slice(0,5).map(e=>{let t=n.months[e],r=Array.isArray(t.holidays)?t.holidays.length:`?`;return`<tr>
          <td>${e}</td>
          <td>${t.workdays??`—`}</td>
          <td>${t.hours??`—`}</td>
          <td>${r}</td>
        </tr>`}).join(``),l=s.length>5?`<tr>
             <td colspan="4" class="cal-preview-more">
               …ещё ${s.length-5} месяцев
             </td>
           </tr>`:``;i.classList.remove(`hidden`),i.innerHTML=`
        <div class="cal-validation-ok">
          ✅ ${n.flag||`🌍`} <strong>${n.name}</strong>
          (${n.id}) — ${s.length} месяцев
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
          <tbody>${c}${l}</tbody>
        </table>`,r.innerHTML=``,a&&(a.disabled=!1),t(n)},n.readAsText(e)},_bindPageEvents(){document.getElementById(`cal-refresh-btn`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`cal-refresh-btn`);e.disabled=!0,e.textContent=`⏳ Обновление...`;let t=new Date().getFullYear(),n=Object.keys(h),r=0;for(let e of n)(await O.refreshCache(e,t)).success&&r++;window.App.toast(`Обновлено: ${r}/${n.length} локаций`,r>0?`success`:``),await this.render()}),document.querySelectorAll(`.cal-refresh-loc-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.loc;e.disabled=!0,e.textContent=`⏳`;let n=await O.refreshCache(t,new Date().getFullYear());window.App.toast(n.success?`${t}: кэш обновлён`:`${t}: API недоступен, данные не изменились`,n.success?`success`:``),await this.render()})}),document.querySelectorAll(`.cal-export-btn`).forEach(e=>{e.addEventListener(`click`,()=>O.exportLocationJSON(e.dataset.loc))}),document.getElementById(`cal-import-btn`)?.addEventListener(`click`,()=>this._openImportModal()),document.querySelectorAll(`.cal-remove-custom-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.loc;confirm(`Удалить кастомный календарь «${t}»?`)&&(O.removeCustomLocation(t),window.App.toast(`Календарь ${t} удалён`,``),await this.render())})})},async render(){let e=document.getElementById(`main-content`);if(e){if(!O){e.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-title">CalendarEngine не загружен</div>
          <div class="empty-state-text">
            Добавьте &lt;script src="js/calendar_engine.js"&gt; в index.html
          </div>
        </div>`;return}e.innerHTML=`
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
      </div>`,this._bindPageEvents()}}},B=`https://bchs-api.lexsnitko.workers.dev`,V={_cache:null,_cacheTs:0,TTL:3e4,async getAll(e=!1){let t=Date.now();if(!e&&this._cache&&t-this._cacheTs<this.TTL)return this._cache;let n=((await(await fetch(`${B}/tables/my_activities?limit=1000&sort=date`)).json()).data||[]).map(e=>({...e,duration_minutes:Number(e.duration_minutes)||0,billable:e.billable===!0||e.billable===`true`}));return this._cache=n,this._cacheTs=t,n},async getByClient(e){return(await this.getAll()).filter(t=>String(t.client_id)===String(e))},async getToday(){let e=await this.getAll(),t=new Date().toISOString().slice(0,10);return e.filter(e=>e.date===t)},async getThisMonth(){let e=await this.getAll(),t=new Date().toISOString().slice(0,7);return e.filter(e=>String(e.date||``).slice(0,7)===t)},async create(e){let t=await fetch(`${B}/tables/my_activities`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e)});return this._cache=null,t.json()},async update(e,t){let n=await fetch(`${B}/tables/my_activities/${e}`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});return this._cache=null,n.json()},async delete(e){await fetch(`${B}/tables/my_activities/${e}`,{method:`DELETE`}),this._cache=null},sumMinutes(e){return e.reduce((e,t)=>e+(Number(t.duration_minutes)||0),0)},fmtDuration(e){if(!e)return`0м`;let t=Math.floor(e/60),n=e%60;return t===0?`${n}м`:n===0?`${t}ч`:`${t}ч ${n}м`},fmtHours(e){return(e/60).toFixed(1)}},pe={_clients:[],_filterClientId:null,_editId:null,TYPE_LABELS:{call:`📞 Звонок`,meeting:`🤝 Встреча`,analysis:`🔍 Анализ`,report:`📄 Отчёт`,onboarding:`🚀 Онбординг`,support:`🛠 Поддержка`,other:`🗂 Другое`},DURATION_OPTIONS:[15,30,45,60,90,120,180,240],async render(e={}){this._filterClientId=e?.clientId||null;let t=document.getElementById(`main-content`);if(!t)return;let n=window.CurrentRole||localStorage.getItem(`user_role`);if(n&&![`service_delivery`,`csm_analyst`].includes(n)){t.innerHTML=`
        <div class="trk-page">
          <div class="trk-access-denied">
            <div class="trk-denied-icon">🔒</div>
            <h2>Нет доступа</h2>
            <p>Трекер времени доступен только для ролей<br>
               <strong>Service Delivery</strong> и
               <strong>CSM Analyst</strong>.</p>
          </div>
        </div>`;return}t.innerHTML=`
      <div class="trk-page">
        <div class="trk-loading">⏳ Загружаю данные...</div>
      </div>`;try{let[e,n]=await Promise.all([fetch(`${B}/tables/clients?limit=200&sort=name`).then(e=>e.json()),V.getAll(!0)]);this._clients=e.data||[];let r=new Date().toISOString().slice(0,10),i=r.slice(0,7),a=n.filter(e=>e.date===r),o=n.filter(e=>String(e.date||``).slice(0,7)===i);t.innerHTML=this._buildHTML(a,o,n),this._bindEvents()}catch(e){t.innerHTML=`
        <div class="trk-page">
          <div class="trk-error">Ошибка загрузки: ${e.message}</div>
        </div>`}},_buildHTML(e,t,n){let r=V.sumMinutes(e),i=V.sumMinutes(t),a=V.sumMinutes(n),o=new Date().toISOString().slice(0,10),s=this._clients.map(e=>`<option value="${e.id}"
        ${String(e.id)===String(this._filterClientId)?`selected`:``}>
        ${e.name||e.company||e.id}
      </option>`).join(``),c=Object.entries(this.TYPE_LABELS).map(([e,t])=>`<option value="${e}">${t}</option>`).join(``),l=this.DURATION_OPTIONS.map(e=>`<option value="${e}" ${e===30?`selected`:``}>
        ${e<60?e+`м`:e/60+`ч`}
      </option>`).join(``);return`
      <div class="trk-page">

        <!-- Шапка -->
        <header class="trk-header">
          <div class="trk-header-left">
            <h1 class="trk-title">⏱ Мой трекер</h1>
            <p class="trk-subtitle">Личные billable часы по клиентам</p>
          </div>
          <div class="trk-header-stats">
            <div class="trk-hstat">
              <span class="trk-hstat-val">${V.fmtHours(r)}ч</span>
              <span class="trk-hstat-lbl">Сегодня</span>
            </div>
            <div class="trk-hstat trk-hstat--accent">
              <span class="trk-hstat-val">${V.fmtHours(i)}ч</span>
              <span class="trk-hstat-lbl">Этот месяц</span>
            </div>
            <div class="trk-hstat">
              <span class="trk-hstat-val">${V.fmtHours(a)}ч</span>
              <span class="trk-hstat-lbl">Всего</span>
            </div>
          </div>
        </header>

        <!-- Секция 1: Быстрый ввод -->
        <section class="trk-section trk-quick" id="trk-quick-section">
          <h2 class="trk-section-title">➕ Добавить активность</h2>
          <form class="trk-quick-form" id="trk-quick-form">
            <input type="date" id="trk-date"
                   class="trk-input trk-input--date"
                   value="${o}" />
            <select id="trk-client" class="trk-input trk-input--select">
              <option value="">— Клиент —</option>
              ${s}
            </select>
            <select id="trk-type" class="trk-input trk-input--select">
              ${c}
            </select>
            <select id="trk-duration"
                    class="trk-input trk-input--select trk-input--narrow">
              ${l}
            </select>
            <input type="text" id="trk-note"
                   class="trk-input trk-input--note"
                   placeholder="Заметка..." maxlength="200" />
            <label class="trk-billable-label">
              <input type="checkbox" id="trk-billable" checked />
              <span class="trk-billable-txt">Billable</span>
            </label>
            <button type="submit" class="trk-btn trk-btn--primary"
                    id="trk-submit-btn">＋ Добавить</button>
          </form>
          <div class="trk-form-feedback" id="trk-form-feedback"></div>
        </section>

        <!-- Секция 2: Сегодня -->
        <section class="trk-section" id="trk-today-section">
          <div class="trk-section-header">
            <h2 class="trk-section-title">📅 Сегодня</h2>
            <span class="trk-section-badge">
              ${V.fmtDuration(r)}
            </span>
          </div>
          <div id="trk-today-list">
            ${this._renderTodayList(e)}
          </div>
        </section>

        <!-- Секция 3: Этот месяц -->
        <section class="trk-section" id="trk-month-section">
          <div class="trk-section-header">
            <h2 class="trk-section-title">📊 Этот месяц</h2>
            <span class="trk-section-badge">
              ${V.fmtDuration(i)}
            </span>
          </div>
          ${this._renderMonthTable(t)}
        </section>

        <!-- Секция 4: Инсайты -->
        <section class="trk-section" id="trk-insights-section">
          <h2 class="trk-section-title">💡 Инсайты</h2>
          <div class="trk-insights-grid">
            ${this._renderInsights(n,t)}
          </div>
        </section>

      </div>`},_renderTodayList(e){return e.length===0?`
        <div class="trk-empty">
          Пока ничего. Самое время залогировать первую активность 😊
        </div>`:`
      <div class="trk-activity-list">
        ${e.map(e=>this._renderActivityRow(e)).join(``)}
      </div>`},_renderActivityRow(e){let t=this._getClientName(e.client_id),n=this.TYPE_LABELS[e.type]||e.type||`—`,r=e.billable?`<span class="trk-tag trk-tag--billable">💰 Billable</span>`:`<span class="trk-tag trk-tag--nb">Non-bill</span>`;return`
      <div class="trk-activity-row" data-id="${e.id}">
        <div class="trk-act-type">${n}</div>
        <div class="trk-act-client">${t}</div>
        <div class="trk-act-dur">${V.fmtDuration(e.duration_minutes)}</div>
        <div class="trk-act-note">${e.note||``}</div>
        <div class="trk-act-meta">${r}</div>
        <div class="trk-act-actions">
          <button class="trk-act-btn trk-act-edit"
                  data-id="${e.id}" title="Редактировать">✏️</button>
          <button class="trk-act-btn trk-act-del"
                  data-id="${e.id}" title="Удалить">🗑</button>
        </div>
      </div>`},_renderMonthTable(e){if(e.length===0)return`<div class="trk-empty">Активностей за этот месяц нет.</div>`;let t={};for(let n of e){let e=n.client_id||`__none__`;t[e]||(t[e]={minutes:0,rows:[],types:{}}),t[e].minutes+=n.duration_minutes,t[e].rows.push(n),t[e].types[n.type]=(t[e].types[n.type]||0)+n.duration_minutes}let n=V.sumMinutes(e),r=e.filter(e=>e.billable).reduce((e,t)=>e+t.duration_minutes,0),i=Object.entries(t).sort((e,t)=>t[1].minutes-e[1].minutes);return`
      <div class="trk-month-table-wrap">
        <table class="trk-month-table">
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Часов</th>
              <th>%</th>
              <th>Топ тип</th>
              <th>Billable</th>
            </tr>
          </thead>
          <tbody>
            ${i.map(([e,t])=>{let r=n>0?Math.round(t.minutes/n*100):0,i=Object.entries(t.types).sort((e,t)=>t[1]-e[1])[0],a=i?this.TYPE_LABELS[i[0]]||i[0]:`—`,o=t.rows.filter(e=>e.billable).reduce((e,t)=>e+t.duration_minutes,0);return`
                <tr>
                  <td class="trk-mt-client">
                    ${this._getClientName(e)}
                  </td>
                  <td class="trk-mt-hours">
                    ${V.fmtHours(t.minutes)}ч
                  </td>
                  <td class="trk-mt-pct">
                    <div class="trk-pct-bar" style="--pct:${r}%">${r}%</div>
                  </td>
                  <td class="trk-mt-type">${a}</td>
                  <td class="trk-mt-bill">
                    ${V.fmtHours(o)}ч
                  </td>
                </tr>`}).join(``)}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Итого</strong></td>
              <td><strong>${V.fmtHours(n)}ч</strong></td>
              <td>${i.length} кл.</td>
              <td>—</td>
              <td><strong>${V.fmtHours(r)}ч</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>`},_renderInsights(e,t){let n=V.sumMinutes(t),r=t.filter(e=>e.billable).reduce((e,t)=>e+t.duration_minutes,0),i=n>0?Math.round(r/n*100):0,a={};for(let t of e){let e=t.client_id||`__none__`;a[e]=(a[e]||0)+t.duration_minutes}let o=Object.entries(a).sort((e,t)=>t[1]-e[1])[0],s=o?this._getClientName(o[0]):`—`,c=o?V.fmtHours(o[1]):`0`,l={};for(let e of t)l[e.type]=(l[e.type]||0)+e.duration_minutes;let u=Object.entries(l).sort((e,t)=>t[1]-e[1])[0],d=u?this.TYPE_LABELS[u[0]]||u[0]:`—`,f=u?V.fmtHours(u[1]):`0`,p=new Date().getDate(),m=p>0?(n/p).toFixed(0):0;return`
      <div class="trk-insight-card">
        <div class="trk-insight-icon">💰</div>
        <div class="trk-insight-body">
          <div class="trk-insight-val">${i}%</div>
          <div class="trk-insight-lbl">Billable этот месяц</div>
          <div class="trk-insight-sub">
            ${V.fmtHours(r)}ч из
            ${V.fmtHours(n)}ч
          </div>
        </div>
        <div class="trk-insight-bar-wrap">
          <div class="trk-insight-bar"
               style="--val:${i}%; --color: var(--green)"></div>
        </div>
      </div>

      <div class="trk-insight-card">
        <div class="trk-insight-icon">🏆</div>
        <div class="trk-insight-body">
          <div class="trk-insight-val">${s}</div>
          <div class="trk-insight-lbl">Топ клиент (всего)</div>
          <div class="trk-insight-sub">${c}ч зафиксировано</div>
        </div>
      </div>

      <div class="trk-insight-card">
        <div class="trk-insight-icon">📌</div>
        <div class="trk-insight-body">
          <div class="trk-insight-val">${d}</div>
          <div class="trk-insight-lbl">Топ активность (месяц)</div>
          <div class="trk-insight-sub">
            ${f}ч · ${m}м/день в среднем
          </div>
        </div>
      </div>`},_getClientName(e){if(!e||e===`__none__`)return`— без клиента —`;let t=this._clients.find(t=>String(t.id)===String(e));return t&&(t.name||t.company)||e},_bindEvents(){document.getElementById(`trk-quick-form`)?.addEventListener(`submit`,e=>this._handleSubmit(e)),document.addEventListener(`click`,e=>{e.target.classList.contains(`trk-act-edit`)&&this._openEditModal(e.target.dataset.id),e.target.classList.contains(`trk-act-del`)&&this._confirmDelete(e.target.dataset.id)})},async _handleSubmit(e){e.preventDefault();let t=document.getElementById(`trk-submit-btn`),n=document.getElementById(`trk-form-feedback`),r=document.getElementById(`trk-client`)?.value,i=document.getElementById(`trk-date`)?.value,a=document.getElementById(`trk-type`)?.value,o=parseInt(document.getElementById(`trk-duration`)?.value)||30,s=document.getElementById(`trk-note`)?.value||``,c=document.getElementById(`trk-billable`)?.checked??!0;if(!r){n.textContent=`⚠️ Выберите клиента`,n.className=`trk-form-feedback trk-form-feedback--err`;return}t.disabled=!0,t.textContent=`⏳ Сохраняю...`;try{let e={client_id:r,date:i,type:a,duration_minutes:o,note:s,billable:c};this._editId?(await V.update(this._editId,e),this._editId=null,t.textContent=`＋ Добавить`):await V.create(e),n.textContent=`✅ Сохранено!`,n.className=`trk-form-feedback trk-form-feedback--ok`,document.getElementById(`trk-note`).value=``,await this._refreshToday(),await this._refreshMonthSection(),setTimeout(()=>{n.textContent=``},2500)}catch(e){n.textContent=`❌ Ошибка: `+e.message,n.className=`trk-form-feedback trk-form-feedback--err`}finally{t.disabled=!1,this._editId||(t.textContent=`＋ Добавить`)}},async _refreshToday(){let e=new Date().toISOString().slice(0,10),t=(await V.getAll(!0)).filter(t=>t.date===e),n=V.sumMinutes(t),r=document.getElementById(`trk-today-list`),i=document.querySelector(`#trk-today-section .trk-section-badge`);r&&(r.innerHTML=this._renderTodayList(t)),i&&(i.textContent=V.fmtDuration(n))},async _refreshMonthSection(){let e=new Date().toISOString().slice(0,7),t=(await V.getAll()).filter(t=>String(t.date||``).slice(0,7)===e),n=V.sumMinutes(t),r=document.getElementById(`trk-month-section`),i=r?.querySelector(`.trk-section-badge`);i&&(i.textContent=V.fmtDuration(n));let a=r?.querySelector(`.trk-month-table-wrap, .trk-empty`);a&&(a.outerHTML=this._renderMonthTable(t))},async _openEditModal(e){let t=(await V.getAll()).find(t=>t.id===e);if(!t)return;this._editId=e;let n=document.getElementById(`trk-date`),r=document.getElementById(`trk-client`),i=document.getElementById(`trk-type`),a=document.getElementById(`trk-duration`),o=document.getElementById(`trk-note`),s=document.getElementById(`trk-billable`),c=document.getElementById(`trk-submit-btn`);n&&(n.value=t.date||``),r&&(r.value=t.client_id||``),i&&(i.value=t.type||`call`),o&&(o.value=t.note||``),s&&(s.checked=t.billable),c&&(c.textContent=`💾 Сохранить`),a&&(a.value=this.DURATION_OPTIONS.reduce((e,n)=>Math.abs(n-t.duration_minutes)<Math.abs(e-t.duration_minutes)?n:e)),document.getElementById(`trk-quick-section`)?.scrollIntoView({behavior:`smooth`});let l=document.getElementById(`trk-form-feedback`);l&&(l.textContent=`✏️ Редактирование записи…`,l.className=`trk-form-feedback trk-form-feedback--info`)},async _confirmDelete(e){if(confirm(`Удалить эту запись?`))try{await V.delete(e),await this._refreshToday(),await this._refreshMonthSection()}catch(e){alert(`Ошибка удаления: `+e.message)}}};window.TrackerAPI=V,window.TrackerPage=pe;var H={save:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,ai:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/><path d="M12 8v4l3 3"/></svg>`,edit:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,export:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,close:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,reset:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>`,chevron:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,trend:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,risk:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,users:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,chart:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,map:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`},me={KEY:{label:`KEY`,color:`#f59e0b`,bg:`#fffbeb`},STABLE:{label:`STABLE`,color:`#6b7280`,bg:`#f9fafb`},GROWTH:{label:`GROWTH`,color:`#6366f1`,bg:`#eef2ff`},GROWTH_EARLY:{label:`GROWTH Early`,color:`#8b5cf6`,bg:`#f5f3ff`},TAIL:{label:`TAIL`,color:`#9ca3af`,bg:`#f3f4f6`}},he=e=>{let t=me[e]??{label:e,color:`#9ca3af`,bg:`#f3f4f6`};return`<span style="font-size:10px;font-weight:600;color:${t.color};
    background:${t.bg};border-radius:5px;padding:2px 7px;
    white-space:nowrap;letter-spacing:.02em">${t.label}</span>`},ge=`
  .pf-tabs { display:flex; gap:2px; border-bottom:1px solid var(--border);
    margin-bottom:0; padding:0 0 0; }
  .pf-tab {
    padding:10px 18px; font-size:13px; font-weight:500;
    color:var(--text-muted); background:none; border:none;
    border-bottom:2px solid transparent; cursor:pointer;
    display:flex; align-items:center; gap:7px;
    transition:color .15s, border-color .15s; margin-bottom:-1px;
  }
  .pf-tab:hover { color:var(--text-primary); }
  .pf-tab.active { color:#6366f1; border-bottom-color:#6366f1; font-weight:600; }
  .pf-tab svg { opacity:.7; }
  .pf-tab.active svg { opacity:1; }

  .pf-kpi-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
    gap:1px; background:var(--border); border-radius:12px; overflow:hidden;
    margin-bottom:24px; border:1px solid var(--border);
  }
  .pf-kpi-cell {
    background:var(--surface); padding:16px 18px;
  }
  .pf-kpi-label {
    font-size:10px; font-weight:700; text-transform:uppercase;
    letter-spacing:.06em; color:var(--text-muted); margin-bottom:6px;
  }
  .pf-kpi-val {
    font-size:22px; font-weight:700; color:var(--text-primary);
    letter-spacing:-.02em; line-height:1;
  }
  .pf-kpi-sub {
    font-size:11px; color:var(--text-muted); margin-top:4px;
  }

  .pf-horizon {
    border:1px solid var(--border); border-radius:12px;
    overflow:hidden; margin-bottom:12px;
  }
  .pf-horizon-head {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 18px; background:var(--surface);
    border-bottom:1px solid var(--border);
  }
  .pf-horizon-dot {
    width:8px; height:8px; border-radius:50%; flex-shrink:0;
  }
  .pf-horizon-title {
    font-size:13px; font-weight:700; color:var(--text-primary);
    display:flex; align-items:center; gap:8px;
  }
  .pf-horizon-period {
    font-size:11px; color:var(--text-muted); font-weight:400;
  }
  .pf-horizon-body {
    padding:18px; display:grid;
    grid-template-columns:1fr 1fr; gap:14px; background:#fff;
  }
  .pf-horizon-body .pf-full { grid-column:1/-1; }
  .pf-field label {
    display:block; font-size:10px; font-weight:700; text-transform:uppercase;
    letter-spacing:.06em; color:var(--text-muted); margin-bottom:6px;
  }
  .pf-field input, .pf-field textarea {
    width:100%; box-sizing:border-box;
    border:1.5px solid var(--border); border-radius:8px;
    padding:9px 12px; font-size:13px; font-family:inherit;
    background:#fafafa; color:var(--text-primary);
    transition:border-color .15s, background .15s;
    resize:vertical;
  }
  .pf-field input:focus, .pf-field textarea:focus {
    border-color:#6366f1; outline:none; background:#fff;
    box-shadow:0 0 0 3px #e0e7ff;
  }
  .pf-field textarea { min-height:72px; }

  .pf-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 14px; border-radius:8px; font-size:12px;
    font-weight:600; cursor:pointer; border:1px solid transparent;
    transition:all .15s; white-space:nowrap;
  }
  .pf-btn-primary {
    background:#6366f1; color:#fff; border-color:#6366f1;
  }
  .pf-btn-primary:hover { background:#4f46e5; border-color:#4f46e5; }
  .pf-btn-secondary {
    background:var(--surface); color:var(--text-secondary);
    border-color:var(--border);
  }
  .pf-btn-secondary:hover {
    background:var(--surface-hover); color:var(--text-primary);
  }
  .pf-btn-ghost {
    background:none; color:var(--text-muted); border-color:transparent;
    padding:6px 10px;
  }
  .pf-btn-ghost:hover { background:var(--surface); color:var(--text-primary); }
  .pf-btn:disabled { opacity:.5; cursor:not-allowed; }

  .pf-section-head {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:16px;
  }
  .pf-section-title {
    font-size:14px; font-weight:700; color:var(--text-primary);
    letter-spacing:-.01em;
  }

  /* Таблица */
  .pf-table { width:100%; border-collapse:collapse; font-size:13px; }
  .pf-table th {
    text-align:left; font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:.06em;
    color:var(--text-muted); padding:8px 12px;
    border-bottom:1px solid var(--border);
    white-space:nowrap;
  }
  .pf-table td {
    padding:10px 12px; border-bottom:1px solid var(--border);
    color:var(--text-primary); vertical-align:middle;
  }
  .pf-table tr:last-child td { border-bottom:none; }
  .pf-table tr:hover td { background:#fafafa; }
  .pf-table-wrap {
    border:1px solid var(--border); border-radius:12px; overflow:hidden;
  }

  /* Coverage */
  .pf-cov-stats {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:1px; background:var(--border);
    border:1px solid var(--border); border-radius:12px;
    overflow:hidden; margin-bottom:20px;
  }
  .pf-cov-stat {
    background:var(--surface); padding:14px 16px;
  }
  .pf-cov-stat-val {
    font-size:24px; font-weight:700; letter-spacing:-.02em;
    color:var(--text-primary);
  }
  .pf-cov-stat-lbl {
    font-size:11px; color:var(--text-muted); margin-top:3px;
  }

  .pf-status-dot {
    display:inline-flex; align-items:center; gap:5px;
    font-size:11px; font-weight:600;
  }
  .pf-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }

  .pf-filters {
    display:flex; gap:8px; flex-wrap:wrap;
    align-items:center; margin-bottom:16px;
  }
  .pf-filter-select, .pf-filter-input {
    height:32px; padding:0 10px; border:1px solid var(--border);
    border-radius:8px; font-size:12px; font-family:inherit;
    background:var(--surface); color:var(--text-primary);
    transition:border-color .15s;
  }
  .pf-filter-select:focus, .pf-filter-input:focus {
    outline:none; border-color:#6366f1;
  }

  .pf-variant-card {
    padding:14px 16px; border:1.5px solid var(--border);
    border-radius:10px; cursor:pointer; margin-bottom:8px;
    transition:all .15s;
  }
  .pf-variant-card:hover {
    border-color:#6366f1; background:#f8f7ff;
  }
  .pf-variant-label {
    font-size:12px; font-weight:700; color:#6366f1; margin-bottom:5px;
  }
  .pf-variant-goal {
    font-size:12px; color:var(--text-secondary); margin-bottom:3px;
  }
  .pf-variant-meta {
    font-size:11px; color:var(--text-muted);
    display:flex; gap:12px;
  }

  .pf-dir-card {
    border:1.5px solid var(--border); border-radius:12px;
    padding:16px; cursor:pointer; transition:all .18s;
  }
  .pf-dir-card:hover { border-color:#6366f1; background:#f8f7ff; }
  .pf-dir-card.selected { border-color:#6366f1; background:#f8f7ff; }
  .pf-dir-icon { font-size:20px; margin-bottom:8px; }
  .pf-dir-label { font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:3px; }
  .pf-dir-hint { font-size:12px; color:var(--text-muted); line-height:1.4; }

  .pf-modal-head {
    font-size:16px; font-weight:700; color:var(--text-primary);
    margin-bottom:4px;
  }
  .pf-modal-sub {
    font-size:12px; color:var(--text-muted); margin-bottom:20px;
  }
`,_e={_activeTab:`portfolio`,_portfolioData:{short:null,mid:null,long:null},_accountStrategies:[],_mcCache:{},_coverageFilters:{region:``,am:``,status:``,search:``},_allClientsForCoverage:[],_allPCForCoverage:[],_injectStyles(){if(document.getElementById(`pf-styles`))return;let e=document.createElement(`style`);e.id=`pf-styles`,e.textContent=ge,document.head.appendChild(e)},async render(){this._injectStyles(),document.getElementById(`main-content`).innerHTML=`
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:8px;background:#eef2ff;
                      display:flex;align-items:center;justify-content:center;color:#6366f1">
            ${H.map}
          </div>
          <div>
            <div class="page-title" style="font-size:18px;font-weight:700;
                                           letter-spacing:-.02em">
              Управление портфелем
            </div>
            <div class="page-subtitle">
          
            </div>
          </div>
        </div>
      </div>

      <div class="pf-tabs" id="pf-tabs">
        <button class="pf-tab active" data-pftab="portfolio">
          Стратегия портфеля
        </button>
        <button class="pf-tab" data-pftab="accounts">
          Стратегия по аккаунтам
        </button>
        <button class="pf-tab" data-pftab="coverage">
          Покрытие
        </button>
      </div>

      <div style="padding-top:24px">
        <div id="pf-tab-portfolio"></div>
        <div id="pf-tab-accounts"  class="hidden"></div>
        <div id="pf-tab-coverage"  class="hidden"></div>
      </div>
    `,document.querySelectorAll(`[data-pftab]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.pftab;this._activeTab=t,document.querySelectorAll(`[data-pftab]`).forEach(e=>e.classList.toggle(`active`,e.dataset.pftab===t)),[`portfolio`,`accounts`,`coverage`].forEach(e=>document.getElementById(`pf-tab-${e}`)?.classList.toggle(`hidden`,e!==t)),t===`accounts`&&this._renderAccountsTab(),t===`coverage`&&this._renderCoverageTab()})}),await this._renderPortfolioTab()},async _renderPortfolioTab(){let e=document.getElementById(`pf-tab-portfolio`);e.innerHTML=`<div style="padding:40px;text-align:center;color:var(--text-muted);
                                font-size:13px">Загрузка...</div>`;try{let[t,n,r,i]=await Promise.all([f.getClients(),f.getAllBCHS(),f.getAllPC(),f.getPortfolioStrategies()]),a=t.map(e=>({client:e,...k.computeClient(e,n,r)})),o=this._buildSummary(a);this._portfolioData={short:null,mid:null,long:null},i.forEach(e=>{e.horizon===`short`&&(this._portfolioData.short=e),e.horizon===`mid`&&(this._portfolioData.mid=e),e.horizon===`long`&&(this._portfolioData.long=e)}),e.innerHTML=`
  ${this._summaryHTML(o,a)}

  <div class="pf-section-head" style="margin-top:28px">
    <div class="pf-section-title">Стратегические горизонты</div>
    <label class="pf-ai-mode-toggle">
      <input type="checkbox" id="pf-ai-mode-sw">
      <span class="pf-ai-mode-track">
        <span class="pf-ai-mode-thumb"></span>
      </span>
      <span class="pf-ai-mode-label">AI режим</span>
    </label>
  </div>

  ${this._horizonFormHTML(`short`,`Краткосрочная`,`1 месяц`,`#ef4444`,this._portfolioData.short)}
  ${this._horizonFormHTML(`mid`,`Среднесрочная`,`1–2 квартала`,`#f59e0b`,this._portfolioData.mid)}
  ${this._horizonFormHTML(`long`,`Долгосрочная`,`4 квартала`,`#10b981`,this._portfolioData.long)}

  <div id="pf-manual-save-bar" class="pf-manual-save-bar" style="display:none">
    <span class="pf-save-hint">Есть несохранённые изменения</span>
    <button class="pf-btn pf-btn-primary" id="pf-save-btn">
      ${H.save} Сохранить
    </button>
  </div>

  <!-- Аналитика портфеля -->
  <div style="margin-top:32px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div style="font-size:15px;font-weight:700;color:var(--text-primary)">Аналитика портфеля</div>
      <button id="pf-ai-analyze-btn"
              style="display:flex;align-items:center;gap:6px;padding:7px 14px;
                     border:1px solid #6366f1;border-radius:8px;background:#fff;
                     color:#6366f1;font-size:12px;font-weight:600;cursor:pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        AI-анализ портфеля
      </button>
    </div>

    <!-- AI инсайт панель -->
    <div id="pf-ai-insight-panel" style="display:none;background:#f8f7ff;border:1px solid #e0e7ff;
         border-radius:12px;padding:16px;margin-bottom:20px;position:relative">
      <div style="font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;
                  letter-spacing:.06em;margin-bottom:8px">AI · Анализ портфеля</div>
      <div id="pf-ai-insight-text" style="font-size:13px;color:var(--text-primary);
           line-height:1.6;white-space:pre-wrap"></div>
    </div>

    <!-- Графики: 2 колонки -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

      <!-- Клиенты по BCG -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Распределение по BCG
        </div>
        <div id="pf-chart-bcg" style="display:flex;align-items:center;gap:20px"></div>
      </div>

      <!-- Лояльность -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Лояльность клиентов
        </div>
        <div id="pf-chart-loyalty" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>

      <!-- Revenue at Risk -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Revenue at Risk (топ клиенты)
        </div>
        <div id="pf-chart-risk" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>

      <!-- Реализация потенциала -->
      <div style="background:var(--surface);border:1px solid var(--border);
                  border-radius:12px;padding:16px">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px">
          Реализация потенциала
        </div>
        <div id="pf-chart-potential" style="display:flex;flex-direction:column;gap:6px"></div>
      </div>

    </div>
  </div>
`,document.getElementById(`pf-save-btn`)?.addEventListener(`click`,()=>this._savePortfolioStrats()),this._renderPortfolioCharts(a),document.getElementById(`pf-ai-analyze-btn`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`pf-ai-analyze-btn`),t=document.getElementById(`pf-ai-insight-panel`),n=document.getElementById(`pf-ai-insight-text`);e.disabled=!0,e.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> Анализирую...`,t.style.display=`block`,n.textContent=`Запрашиваю данные Monte Carlo и анализирую портфель...`;try{let e=a.slice(0,15).map(e=>({name:e.client.name,bcg:e.client.bcg_category,bchs:e.bchs??null,mr:e.client.monthly_revenue??0,trend:e.trend?.direction??`—`,risk:e.revenueAtRisk??0,churn:null})),t=await f.callAI({type:`horizon`,horizon:`short`,summary:o,clients_snapshot:e,direction:`Дай общий анализ состояния портфеля: риски, сильные стороны, приоритеты на ближайший месяц`}),r=t?.choices?.[0]?.message?.content??t?.content??``,i=r;try{let e=JSON.parse(r);if(e.short||e.outcome||e.strategies){let t=[];e.outcome&&t.push(`Итог: `+e.outcome),e.actions&&t.push(`Действия:
`+(Array.isArray(e.actions)?e.actions.map(e=>`  - `+e).join(`
`):e.actions)),e.risks&&t.push(`Риски:
`+(Array.isArray(e.risks)?e.risks.map(e=>`  - `+e).join(`
`):e.risks)),e.priorities&&t.push(`Приоритеты:
`+(Array.isArray(e.priorities)?e.priorities.map(e=>`  - `+e).join(`
`):e.priorities)),i=t.join(`

`)||JSON.stringify(e,null,2)}}catch{}n.textContent=i||`Анализ завершён, но ответ пуст.`}catch(e){n.textContent=`Ошибка: `+e.message}finally{e.disabled=!1,e.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> AI-анализ портфеля`}});{let e=document.querySelector(`.pf-kpi-grid-new`);if(e){let t=[...e.querySelectorAll(`.pf-kpi-card`)].map(e=>e.dataset.card),n=()=>{e.classList.remove(`has-active`),e.querySelectorAll(`.pf-kpi-card`).forEach(e=>{e.classList.remove(`pf-kpi-active`,`pf-kpi-dimmed`)});let n=e.querySelector(`.pf-kpi-sidebar`);n&&([...n.querySelectorAll(`.pf-kpi-card`)].forEach(t=>e.appendChild(t)),n.remove()),t.forEach(t=>{let n=e.querySelector(`.pf-kpi-card[data-card="`+t+`"]`);n&&e.appendChild(n)})};document.addEventListener(`click`,t=>{e.contains(t.target)||n()}),e.addEventListener(`click`,async r=>{r.stopPropagation();let i=r.target.closest(`[data-action="go-detail"]`);if(i){window.App.navigate(`detail`,i.dataset.id);return}let s=r.target.closest(`.pf-kpi-card`);if(!s)return;if(r.target.closest(`.pf-kpi-card-close`)){n();return}if(s.classList.contains(`pf-kpi-active`)){if(r.target.closest(`.sc-filter-pill, button, a, input, select, [data-action]`))return;n();return}n(),e.querySelectorAll(`.pf-kpi-card`).forEach(e=>{e.classList.remove(`pf-kpi-active`),e.classList.add(`pf-kpi-dimmed`)}),s.classList.remove(`pf-kpi-dimmed`),s.classList.add(`pf-kpi-active`);let c=document.createElement(`div`);if(c.className=`pf-kpi-sidebar`,t.filter(e=>e!==s.dataset.card).forEach(t=>{let n=e.querySelector(`.pf-kpi-card[data-card="`+t+`"]`);n&&c.appendChild(n)}),e.appendChild(c),e.classList.add(`has-active`),s.dataset.card===`clients`){let e=document.getElementById(`bcg-ai-insight`);if(e&&!e.dataset.loaded){e.dataset.loaded=`1`,e.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  Анализирую портфель...
                </div>`;try{console.log(`[BCG AI] summary:`,o),console.log(`[BCG AI] computed length:`,a?.length);let t=a.slice(0,16).map(e=>({name:e.client.name,bcg:e.client.bcg_category,loyalty:e.loyalty??null,bchs:e.bchs??null,mr:e.client.monthly_revenue??0,risk:e.revenueAtRisk??0,trend:e.trend?.direction??null})),n=await f.callAI({type:`portfolio_analysis`,summary:o,clients_snapshot:t}),r=n?.choices?.[0]?.message?.content??n?.content??``,i=``;try{let e=JSON.parse(r);i=e.bcg??e.insight??r}catch{i=r}e.innerHTML=`<div style="font-size:12px;color:#374151;line-height:1.7">${i}</div>`}catch(t){e.innerHTML=`<div style="font-size:11px;color:#ef4444">Ошибка: ${t.message}</div>`}}}if(s.dataset.card===`priority_revenue`&&setTimeout(async()=>{let e=document.getElementById(`ps-svg`);if(!e)return;let t=[...e.querySelectorAll(`.ps-dot`)],n=document.getElementById(`sc-tooltip`);n||(n=document.createElement(`div`),n.id=`sc-tooltip`,n.style.cssText=`position:fixed;display:none;background:#1e293b;color:#f8fafc;font-size:11px;padding:6px 10px;border-radius:8px;pointer-events:none;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.18);line-height:1.5;white-space:nowrap`,document.body.appendChild(n)),t.forEach(e=>{e.addEventListener(`mouseenter`,()=>{t.forEach(t=>{t!==e&&(t.style.opacity=`0.2`)}),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))+2)),n.innerHTML=`<b>`+e.dataset.name+`</b><br>Priority: `+e.dataset.ps+` &nbsp;·&nbsp; $`+Number(e.dataset.mr).toLocaleString(`ru-RU`),n.style.display=`block`}),e.addEventListener(`mousemove`,e=>{n.style.left=e.clientX+12+`px`,n.style.top=e.clientY-30+`px`}),e.addEventListener(`mouseleave`,()=>{t.forEach(e=>{e.style.opacity=`.85`}),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))-2)),n.style.display=`none`})});let r=document.getElementById(`ps-pills`),i=document.getElementById(`ps-counter`),s=t.length,c=new Set([`ALL`]),l=()=>{let e=0;t.forEach(t=>{let n=c.has(`ALL`)||c.has(t.dataset.bcg);t.style.display=n?``:`none`,n&&e++}),i&&(i.textContent=`Показано `+e+` из `+s)};r&&r.querySelectorAll(`.ps-pill`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.bcg;if(t===`ALL`)c=new Set([`ALL`]),r.querySelectorAll(`.ps-pill`).forEach(e=>{let t=e.dataset.bcg===`ALL`;e.classList.toggle(`sc-active`,t),e.style.background=t?`#6366f1`:`#fff`,e.style.color=t?`#fff`:`#374151`});else{c.delete(`ALL`);let e=r.querySelector(`[data-bcg="ALL"]`);e&&(e.classList.remove(`sc-active`),e.style.background=`#fff`,e.style.color=`#374151`),c.has(t)?(c.delete(t),c.size===0&&(c.add(`ALL`),e&&(e.classList.add(`sc-active`),e.style.background=`#6366f1`,e.style.color=`#fff`))):c.add(t),r.querySelectorAll(`.ps-pill:not([data-bcg="ALL"])`).forEach(e=>{let t=c.has(e.dataset.bcg);e.classList.toggle(`sc-active`,t);let n=e.querySelector(`span`)?e.querySelector(`span`).style.background:`#6366f1`;e.style.background=t?n:`#fff`,e.style.color=t?`#fff`:`#374151`})}l()})}),l();let u=document.getElementById(`ps-ai-insight`);if(u&&!u.dataset.loaded){u.dataset.loaded=`1`,u.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>AI анализирует...</div>`;try{let e=a.slice(0,16).map(e=>({name:e.client.name,bcg:e.client.bcg_category,priority:Math.round((e.priority||0)*100)/100,mr:e.client.monthly_revenue||0,loyalty:e.loyalty,bchs:e.bchs})),t=await f.callAI({type:`portfolio_analysis`,summary:o,clients_snapshot:e}),n=t?.choices?.[0]?.message?.content??t?.content??``,r=n;try{let e=JSON.parse(n);r=e.priority||e.insight||e.bcg||JSON.stringify(e,null,2)}catch{}u.style.cssText=`font-size:12px;color:#374151;line-height:1.7;white-space:pre-wrap`,u.textContent=r||`Анализ завершён.`}catch(e){u.style.color=`#ef4444`,u.textContent=`Ошибка: `+e.message}}},80),s.dataset.card===`hours_revenue`){setTimeout(()=>{let e=document.getElementById(`scatter-svg`),t=document.getElementById(`sc-counter`);if(!e)return;let n=[...e.querySelectorAll(`.sc-dot`)],r=[...e.querySelectorAll(`.sc-lbl`)],i=n.length,a=new Set([`ALL`]),o=document.getElementById(`sc-tooltip`);o||(o=document.createElement(`div`),o.id=`sc-tooltip`,o.style.cssText=`position:fixed;display:none;background:#1e293b;color:#f8fafc;font-size:11px;padding:6px 10px;border-radius:8px;pointer-events:none;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.18);line-height:1.5;white-space:nowrap`,document.body.appendChild(o));function s(){let o=a.has(`ALL`),s=0;n.forEach(e=>{let t=o||a.has(e.dataset.bcg);e.style.opacity=t?`.85`:`0`,e.style.pointerEvents=t?`auto`:`none`,t&&s++}),r.forEach(t=>{let n=t.className.baseVal.replace(`sc-lbl sc-lbl-`,``),r=e.querySelector(`.sc-dot[data-id="`+n+`"]`);if(!(r&&r.style.opacity!==`0`)){t.setAttribute(`opacity`,`0`);return}let i=r&&r.getAttribute(`r`)===`7`;t.setAttribute(`opacity`,s<=10||i?`1`:`0`)}),t&&(t.textContent=`Показано `+s+` из `+i)}let c=e.closest(`div`).querySelector(`.sc-filter-all`)?.parentElement;c&&c.addEventListener(`click`,e=>{let t=e.target.closest(`.sc-filter-pill`);if(!t)return;let n=t.dataset.bcg;n===`ALL`?(a=new Set([`ALL`]),c.querySelectorAll(`.sc-filter-pill`).forEach(e=>{let t=e.dataset.bcg===`ALL`;e.style.background=t?`#6366f1`:`transparent`,e.style.color=t?`#fff`:e.style.borderColor||`#6b7280`})):(a.delete(`ALL`),c.querySelector(`[data-bcg="ALL"]`).style.background=`transparent`,c.querySelector(`[data-bcg="ALL"]`).style.color=`#6366f1`,a.has(n)?(a.delete(n),t.style.background=`transparent`,t.style.color=t.style.borderColor):(a.add(n),t.style.background=t.style.borderColor,t.style.color=`#fff`),a.size===0&&(a.add(`ALL`),c.querySelector(`[data-bcg="ALL"]`).style.background=`#6366f1`,c.querySelector(`[data-bcg="ALL"]`).style.color=`#fff`)),s()}),n.forEach(e=>{e.addEventListener(`mouseenter`,t=>{n.forEach(t=>{t!==e&&(t.style.opacity=`0.2`)}),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))+2)),o.innerHTML=`<b>`+e.dataset.name+`</b><br>`+e.dataset.hrs+`h / нед &nbsp;·&nbsp; $`+Number(e.dataset.mr).toLocaleString(`ru-RU`),o.style.display=`block`}),e.addEventListener(`mousemove`,e=>{o.style.left=e.clientX+12+`px`,o.style.top=e.clientY-30+`px`}),e.addEventListener(`mouseleave`,()=>{s(),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))-2)),o.style.display=`none`})}),s()},80);let e=document.getElementById(`hours-rev-ai-insight`);if(e&&!e.dataset.loaded){e.dataset.loaded=`1`,e.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  AI анализирует...
                </div>`;try{let t=a.slice(0,16).map(e=>({name:e.client.name,bcg:e.client.bcg_category,hours:e.total_hours??0,mr:e.client.monthly_revenue??0,loyalty:e.loyalty??null,bchs:e.bchs??null,risk:e.revenueAtRisk??0,trend:e.trend?.direction??null})),n=await f.callAI({type:`portfolio_analysis`,summary:o,clients_snapshot:t}),r=n?.choices?.[0]?.message?.content??n?.content??``,i=``;try{let e=JSON.parse(r);i=e.hours??e.efficiency??e.bcg??e.insight??r}catch{i=r}e.innerHTML=`<div style="font-size:12px;color:#374151;line-height:1.7">${i}</div>`}catch(t){e.innerHTML=`<div style="font-size:11px;color:#ef4444">Ошибка: ${t.message}</div>`}}}if(s.dataset.card===`risk`){setTimeout(()=>{let e=document.getElementById(`risk-bubble-svg`);if(!e)return;let t=[...e.querySelectorAll(`.risk-bubble`)],n=document.getElementById(`risk-bubble-tip`);n||(n=document.createElement(`div`),n.id=`risk-bubble-tip`,n.style.cssText=`position:fixed;display:none;background:#1e293b;color:#f8fafc;font-size:11px;padding:6px 10px;border-radius:8px;pointer-events:none;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.18);line-height:1.5;white-space:nowrap`,document.body.appendChild(n)),t.forEach(e=>{e.addEventListener(`mouseenter`,()=>{t.forEach(t=>{t!==e&&(t.style.opacity=`0.2`)}),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))+3)),n.innerHTML=`<b>`+e.dataset.name+`</b><br>`+e.dataset.amt+` &nbsp;·&nbsp; `+e.dataset.riskpct+`% от MR &nbsp;·&nbsp; `+e.dataset.pfpct+`% портфеля`,n.style.display=`block`}),e.addEventListener(`mousemove`,e=>{n.style.left=e.clientX+12+`px`,n.style.top=e.clientY-30+`px`}),e.addEventListener(`mouseleave`,()=>{t.forEach(e=>{e.style.opacity=`.85`}),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))-3)),n.style.display=`none`}),e.addEventListener(`click`,()=>{window.App.navigate(`detail`,e.dataset.id)})});let r=document.querySelector(`.rb-filter-all`)?.parentElement;if(r){let e=new Set([`ALL`]),n=()=>{t.forEach(t=>{let n=e.has(`ALL`)||e.has(t.dataset.bcg);t.style.opacity=n?`.85`:`0`,t.style.pointerEvents=n?`auto`:`none`;let r=t.nextElementSibling;for(let e=0;e<2&&r;e++)r.style.opacity=n?`1`:`0`,r=r.nextElementSibling});let n=e.has(`ALL`)?t.length:t.filter(t=>e.has(t.dataset.bcg)).length,r=document.getElementById(`rb-counter`);r&&(r.textContent=`Показано `+n+` из `+t.length)};r.addEventListener(`click`,t=>{let i=t.target.closest(`.rb-filter-pill`);if(!i)return;let a=i.dataset.bcg;if(a===`ALL`)e=new Set([`ALL`]),r.querySelectorAll(`.rb-filter-pill`).forEach(e=>{let t=e.dataset.bcg===`ALL`;e.style.background=t?`#6366f1`:`transparent`,e.style.color=t?`#fff`:e.style.borderColor});else{e.delete(`ALL`);let t=r.querySelector(`[data-bcg="ALL"]`);t.style.background=`transparent`,t.style.color=`#6366f1`,e.has(a)?(e.delete(a),i.style.background=`transparent`,i.style.color=i.style.borderColor):(e.add(a),i.style.background=i.style.borderColor,i.style.color=`#fff`),e.size===0&&(e=new Set([`ALL`]),t.style.background=`#6366f1`,t.style.color=`#fff`)}n()})}},80);let e=document.getElementById(`risk-ai-insight`);if(e&&!e.dataset.loaded){e.dataset.loaded=`1`,e.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>AI анализирует риски...</div>`;try{let t=[...a].filter(e=>(e.revenueAtRisk??0)>0).sort((e,t)=>(t.revenueAtRisk??0)-(e.revenueAtRisk??0)).slice(0,16).map(e=>({name:e.client.name,bcg:e.client.bcg_category,loyalty:e.loyalty??null,bchs:e.bchs??null,mr:e.client.monthly_revenue??0,risk:e.revenueAtRisk??0,riskPct:e.riskPct??0,trend:e.trend?.direction??null})),n=await f.callAI({type:`portfolio_analysis`,summary:o,clients_snapshot:t}),r=n?.choices?.[0]?.message?.content??n?.content??``,i=``;try{let e=JSON.parse(r);i=e.risk??e.loyalty??e.insight??r}catch{i=r}e.innerHTML=`<div style="font-size:12px;color:#374151;line-height:1.7">`+i+`</div>`}catch(t){e.innerHTML=`<div style="font-size:11px;color:#ef4444">Ошибка: `+t.message+`</div>`}}}if(s.dataset.card===`potential`){setTimeout(()=>{let e=document.getElementById(`pot-bubble-svg`);if(!e)return;let t=[...e.querySelectorAll(`.pot-bubble`)],n=document.getElementById(`pot-bubble-tip`);n||(n=document.createElement(`div`),n.id=`pot-bubble-tip`,n.style.cssText=`position:fixed;display:none;background:#1e293b;color:#f8fafc;font-size:11px;padding:6px 10px;border-radius:8px;pointer-events:none;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.18);line-height:1.5;white-space:nowrap`,document.body.appendChild(n)),t.forEach(e=>{e.addEventListener(`mouseenter`,()=>{t.forEach(t=>{t!==e&&(t.style.opacity=`0.15`)}),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))+3)),n.innerHTML=`<b>`+e.dataset.name+`</b><br>Лояльность: `+e.dataset.loyalty+`% &nbsp;·&nbsp; Реализация: `+e.dataset.pct+`% &nbsp;·&nbsp; MR: `+e.dataset.mr,n.style.display=`block`}),e.addEventListener(`mousemove`,e=>{n.style.left=e.clientX+12+`px`,n.style.top=e.clientY-30+`px`}),e.addEventListener(`mouseleave`,()=>{t.forEach(e=>{e.style.opacity=`.82`}),e.setAttribute(`r`,String(Number(e.getAttribute(`r`))-3)),n.style.display=`none`}),e.addEventListener(`click`,()=>window.App.navigate(`detail`,e.dataset.id))});let r=document.querySelector(`.pot-filter-all`)?.parentElement;if(r){let e=new Set([`ALL`]),n=()=>{let n=0;t.forEach(t=>{let r=e.has(`ALL`)||e.has(t.dataset.bcg);t.style.opacity=r?`.82`:`0`,t.style.pointerEvents=r?`auto`:`none`;let i=t.nextElementSibling;for(let e=0;e<2&&i;e++)i.style.opacity=r?`1`:`0`,i=i.nextElementSibling;r&&n++});let r=document.getElementById(`pot-counter`);r&&(r.textContent=`Показано `+n+` из `+t.length)};r.addEventListener(`click`,t=>{let i=t.target.closest(`.pot-filter-pill`);if(!i)return;let a=i.dataset.bcg;if(a===`ALL`)e=new Set([`ALL`]),r.querySelectorAll(`.pot-filter-pill`).forEach(e=>{let t=e.dataset.bcg===`ALL`;e.style.background=t?`#6366f1`:`transparent`,e.style.color=t?`#fff`:e.style.borderColor});else{e.delete(`ALL`);let t=r.querySelector(`[data-bcg="ALL"]`);t.style.background=`transparent`,t.style.color=`#6366f1`,e.has(a)?(e.delete(a),i.style.background=`transparent`,i.style.color=i.style.borderColor):(e.add(a),i.style.background=i.style.borderColor,i.style.color=`#fff`),e.size===0&&(e=new Set([`ALL`]),t.style.background=`#6366f1`,t.style.color=`#fff`)}n()})}},80);let e=document.getElementById(`pot-ai-insight`);if(e&&!e.dataset.loaded){e.dataset.loaded=`1`,e.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>AI анализирует потенциал...</div>`;try{let t=a.filter(e=>e.potential>0).slice(0,16).map(e=>({name:e.client.name,bcg:e.client.bcg_category,mr:e.client.monthly_revenue??0,potential:e.potential??0,pctPot:e.pctPot??null,loyalty:e.loyalty??null,bchs:e.bchs??null,trend:e.trend?.direction??null})),n=await f.callAI({type:`portfolio_analysis`,summary:o,clients_snapshot:t}),r=n?.choices?.[0]?.message?.content??n?.content??``,i=``;try{let e=JSON.parse(r);i=e.potential??e.insight??r}catch{i=r}e.innerHTML=`<div style="font-size:12px;color:#374151;line-height:1.7">`+i+`</div>`}catch(t){e.innerHTML=`<div style="font-size:11px;color:#ef4444">Ошибка: `+t.message+`</div>`}}}if(s.dataset.card===`loyalty`){let e=document.getElementById(`loyalty-ai-insight`);if(e&&!e.dataset.loaded){e.dataset.loaded=`1`,e.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>AI анализирует лояльность...</div>`;try{let t=a.slice(0,16).map(e=>({name:e.client.name,bcg:e.client.bcg_category,loyalty:e.loyalty??null,bchs:e.bchs??null,mr:e.client.monthly_revenue??0,risk:e.revenueAtRisk??0,riskPct:e.riskPct??0,trend:e.trend?.direction??null})),n=await f.callAI({type:`portfolio_analysis`,summary:o,clients_snapshot:t}),r=n?.choices?.[0]?.message?.content??n?.content??``,i=``;try{let e=JSON.parse(r);i=e.loyalty??e.insight??r}catch{i=r}e.innerHTML=`<div style="font-size:12px;color:#374151;line-height:1.7">`+i+`</div>`}catch(t){e.innerHTML=`<div style="font-size:11px;color:#ef4444">Ошибка: `+t.message+`</div>`}}}if(s.dataset.card===`revenue_bcg`){let e=document.getElementById(`revenue-bcg-ai-insight`);if(e&&!e.dataset.loaded){e.dataset.loaded=`1`,e.innerHTML=`<div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  AI анализирует...
                </div>`;try{let t=a.slice(0,16).map(e=>({name:e.client.name,bcg:e.client.bcg_category,loyalty:e.loyalty??null,bchs:e.bchs??null,mr:e.client.monthly_revenue??0,risk:e.revenueAtRisk??0,trend:e.trend?.direction??null})),n=await f.callAI({type:`portfolio_analysis`,summary:o,clients_snapshot:t}),r=n?.choices?.[0]?.message?.content??n?.content??``,i=``;try{let e=JSON.parse(r);i=e.revenue??e.insight??r}catch{i=r}e.innerHTML=`<div style="font-size:12px;color:#374151;line-height:1.7">${i}</div>`}catch(t){e.innerHTML=`<div style="font-size:11px;color:#ef4444">Ошибка: ${t.message}</div>`}}}})}}[`short`,`mid`,`long`].forEach(e=>{let t=document.querySelector(`[data-toggle="${e}"]`),n=document.getElementById(`pf-hz-body-${e}`),r=document.getElementById(`pf-hz-chevron-${e}`),i=document.getElementById(`pf-hz-view-${e}`),a=document.getElementById(`pf-hz-edit-${e}`),o=document.querySelector(`[data-editkey="${e}"]`),s=document.querySelector(`[data-cancelkey="${e}"]`);n&&(n.style.display=`none`,r&&(r.style.transform=`rotate(-90deg)`)),t?.addEventListener(`click`,e=>{if(e.target.closest(`.pf-hz-edit-btn`)||e.target.closest(`.pf-hz-save-btn`)||e.target.closest(`.pf-hz-cancel-btn`)||e.target.closest(`.pf-hz-actions`))return;let t=n?.style.display!==`none`;n&&(n.style.display=t?`none`:`block`),r&&(r.style.transform=t?`rotate(-90deg)`:`rotate(0deg)`)}),o?.addEventListener(`click`,t=>{t.stopPropagation(),n&&(n.style.display=`block`),r&&(r.style.transform=`rotate(0deg)`),i&&(i.style.display=`none`),a&&(a.style.display=`block`),document.getElementById(`pf-${e}-focus`)?.focus()}),s?.addEventListener(`click`,e=>{e.stopPropagation(),i&&(i.style.display=`block`),a&&(a.style.display=`none`)})}),document.getElementById(`pf-ai-mode-sw`)?.addEventListener(`change`,e=>{this._setAiMode(e.target.checked,o,a)}),[`short`,`mid`,`long`].forEach(e=>{document.getElementById(`pf-save-btn-${e}`)?.addEventListener(`click`,async()=>{await this._savePortfolioStrats();let t=document.getElementById(`pf-hz-view-${e}`),n=document.getElementById(`pf-hz-edit-${e}`),r=document.querySelector(`#pf-horizon-${e} .pf-hz-subtitle`),i=document.getElementById(`pf-${e}-focus`)?.value||``;r&&(r.textContent=i.slice(0,50)+(i.length>50?`…`:``)),t&&(t.style.display=`block`),n&&(n.style.display=`none`)})})}catch(t){console.error(`[PortfolioPage._renderPortfolioTab]`,t),e.innerHTML=`<div style="padding:32px;text-align:center;color:#ef4444;font-size:13px">
        Ошибка: ${t.message}</div>`}},_renderPortfolioCharts(e){let t=document.getElementById(`pf-chart-bcg`);if(t){let n={KEY:{label:`KEY`,color:`#f59e0b`},GROWTH:{label:`GROWTH`,color:`#6366f1`},GROWTH_EARLY:{label:`GROWTH Early`,color:`#8b5cf6`},STABLE:{label:`STABLE`,color:`#6b7280`},TAIL:{label:`TAIL`,color:`#9ca3af`}},r={KEY:0,GROWTH:0,GROWTH_EARLY:0,STABLE:0,TAIL:0};e.forEach(e=>{r[e.client.bcg_category]!=null&&r[e.client.bcg_category]++});let i=e.length||1,a=-Math.PI/2,o=``;Object.entries(r).forEach(([e,t])=>{if(!t)return;let r=t/i*2*Math.PI,s=52+40*Math.cos(a),c=52+40*Math.sin(a),l=52+40*Math.cos(a+r),u=52+40*Math.sin(a+r),d=52+24*Math.cos(a),f=52+24*Math.sin(a),p=52+24*Math.cos(a+r),m=52+24*Math.sin(a+r),h=+(r>Math.PI),g=n[e]?.color??`#ccc`;o+=`<path d="M${d},${f} L${s},${c} A40,40 0 ${h},1 ${l},${u} L${p},${m} A24,24 0 ${h},0 ${d},${f}" fill="${g}" opacity=".9"/>`,a+=r}),t.innerHTML=`<svg width="104" height="104" viewBox="0 0 104 104">
        ${o}
        <text x="52" y="56" text-anchor="middle" font-size="18" font-weight="700"
              fill="var(--text-primary)">${i}</text>
      </svg><div style="flex:1;display:flex;flex-direction:column;gap:7px">${Object.entries(r).filter(([,e])=>e>0).map(([e,t])=>`
          <div style="display:flex;align-items:center;gap:6px;cursor:pointer"
               onclick="window.App && window.App.navigate && null"
               title="${n[e]?.label}">
            <div style="width:10px;height:10px;border-radius:3px;
                        background:${n[e]?.color};flex-shrink:0"></div>
            <span style="font-size:12px;color:var(--text-muted)">${n[e]?.label}</span>
            <span style="font-size:12px;font-weight:600;color:var(--text-primary);margin-left:auto;padding-left:8px">${t}</span>
          </div>`).join(``)}</div>`}let n=document.getElementById(`pf-chart-loyalty`);n&&(n.innerHTML=[...e].filter(e=>e.loyalty!=null).sort((e,t)=>(t.loyalty??0)-(e.loyalty??0)).slice(0,8).map(e=>{let t=Math.round(e.loyalty??0),n=t>=70?`#10b981`:t>=40?`#f59e0b`:`#ef4444`,r=Math.max(4,Math.round(t/100*100));return`
          <div style="display:flex;align-items:center;gap:8px;cursor:pointer"
               data-action="go-detail" data-id="${e.client.id}">
            <div style="width:90px;font-size:11px;color:var(--text-primary);
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                        flex-shrink:0">${e.client.name}</div>
            <div style="flex:1;background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden">
              <div style="width:${r}%;height:100%;background:${n};border-radius:4px;
                          transition:width .4s"></div>
            </div>
            <div style="width:32px;text-align:right;font-size:11px;font-weight:600;
                        color:${n};flex-shrink:0">${t}%</div>
          </div>`}).join(``)||`<div style="font-size:12px;color:#94a3b8">Нет данных</div>`,n.querySelectorAll(`[data-action="go-detail"]`).forEach(e=>{e.addEventListener(`click`,()=>window.App.navigate(`detail`,e.dataset.id))}));let r=document.getElementById(`pf-chart-risk`);if(r){let t=[...e].filter(e=>(e.revenueAtRisk??0)>0).sort((e,t)=>(t.revenueAtRisk??0)-(e.revenueAtRisk??0)).slice(0,8),n=t[0]?.revenueAtRisk??1;r.innerHTML=t.map(e=>{let t=e.revenueAtRisk??0,r=e.riskPct??0,i=Math.max(4,Math.round(t/n*100)),a=r>30?`#ef4444`:r>15?`#f59e0b`:`#6366f1`;return`
          <div style="display:flex;align-items:center;gap:8px;cursor:pointer"
               data-action="go-detail" data-id="${e.client.id}">
            <div style="width:90px;font-size:11px;color:var(--text-primary);
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                        flex-shrink:0">${e.client.name}</div>
            <div style="flex:1;background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden">
              <div style="width:${i}%;height:100%;background:${a};border-radius:4px;
                          transition:width .4s"></div>
            </div>
            <div style="width:52px;text-align:right;font-size:11px;font-weight:600;
                        color:${a};flex-shrink:0">$${t>=1e3?Math.round(t/1e3)+`k`:t}</div>
          </div>`}).join(``)||`<div style="font-size:12px;color:#94a3b8">Рисков нет</div>`,r.querySelectorAll(`[data-action="go-detail"]`).forEach(e=>{e.addEventListener(`click`,()=>window.App.navigate(`detail`,e.dataset.id))})}let i=document.getElementById(`pf-chart-potential`);i&&(i.innerHTML=[...e].filter(e=>(e.potential??0)>0).sort((e,t)=>(e=>e.client.monthly_revenue/Math.max(1,e.potential??e.client.monthly_revenue))(e)-(e=>e.client.monthly_revenue/Math.max(1,e.potential??e.client.monthly_revenue))(t)).slice(0,8).map(e=>{let t=e.client.monthly_revenue??0,n=e.potential??t,r=n>0?Math.min(100,Math.round(t/n*100)):100,i=Math.max(4,r),a=r>=80?`#10b981`:r>=50?`#f59e0b`:`#ef4444`;return`
          <div style="display:flex;align-items:center;gap:8px;cursor:pointer"
               data-action="go-detail" data-id="${e.client.id}">
            <div style="width:90px;font-size:11px;color:var(--text-primary);
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                        flex-shrink:0">${e.client.name}</div>
            <div style="flex:1;background:#f1f5f9;border-radius:4px;height:8px;overflow:hidden">
              <div style="width:${i}%;height:100%;background:${a};border-radius:4px;
                          transition:width .4s"></div>
            </div>
            <div style="width:32px;text-align:right;font-size:11px;font-weight:600;
                        color:${a};flex-shrink:0">${r}%</div>
          </div>`}).join(``)||`<div style="font-size:12px;color:#94a3b8">Нет данных</div>`,i.querySelectorAll(`[data-action="go-detail"]`).forEach(e=>{e.addEventListener(`click`,()=>window.App.navigate(`detail`,e.dataset.id))}))},_buildSummary(e){let t=e.length,n=e.filter(e=>e.loyalty!==null),r=n.length?Math.round(n.reduce((e,t)=>e+t.loyalty,0)/n.length):null,i=e.filter(e=>e.bchs!==null),a=i.length?Math.round(i.reduce((e,t)=>e+t.bchs,0)/i.length):null,o=e.reduce((e,t)=>e+(t.revenueAtRisk||0),0),s={KEY:0,STABLE:0,GROWTH:0,GROWTH_EARLY:0,TAIL:0};e.forEach(e=>{let t=e.client.bcg_category;t in s&&s[t]++});let c=[...e].filter(e=>e.revenueAtRisk>0).sort((e,t)=>t.revenueAtRisk-e.revenueAtRisk).slice(0,3).map(e=>({name:e.client.name,risk:e.revenueAtRisk,pct:e.riskPct})),l=e.filter(e=>e.potential!==null);return{total:t,avgBchs:a,avgLoyalty:r,totalRisk:o,bcgCount:s,top3Risk:c,avgPotential:l.length?Math.round(l.reduce((e,t)=>e+t.potential,0)/l.length):null}},_summaryHTML(e,t=[]){let n=e.avgLoyalty===null?`#6b7280`:e.avgLoyalty>=70?`#10b981`:e.avgLoyalty>=50?`#f59e0b`:`#ef4444`,r=e.totalRisk===0?`#10b981`:e.totalRisk>5e4?`#ef4444`:`#f59e0b`,i=e.avgPotential===null?`#6b7280`:e.avgPotential>=85?`#10b981`:e.avgPotential>=65?`#f59e0b`:`#ef4444`,a=Object.values(e.bcgCount).reduce((e,t)=>e+t,0)||1;return Object.entries(e.bcgCount).map(([e,t])=>{let n=me[e],r=Math.round(t/a*100);return`<div class="kpi-det-row">
        <span class="kpi-det-label" style="color:${n.color}">${n.label}</span>
        <div class="kpi-det-bar-wrap">
          <div class="kpi-det-bar" style="width:${r}%;background:${n.color};opacity:0.18;border-radius:3px;"></div>
        </div>
        <span class="kpi-det-count">${t}</span>
      </div>`}).join(``),e.top3Risk.length&&e.top3Risk.map((e,t)=>`
        <div class="kpi-det-row">
          <span class="kpi-det-num">${t+1}</span>
          <span class="kpi-det-name">${e.name}</span>
          <span class="kpi-det-risk">$${e.risk.toLocaleString(`ru-RU`)}</span>
          <span class="kpi-det-pct">${e.pct}%</span>
        </div>`).join(``),`<div class="pf-kpi-grid-new">${[{id:`clients`,icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,label:`Клиентов`,value:e.total,hint:`в портфеле`,valueColor:`var(--text-primary)`,detail:(()=>{let n={KEY:`#f59e0b`,GROWTH:`#6366f1`,GROWTH_EARLY:`#8b5cf6`,STABLE:`#6b7280`,TAIL:`#9ca3af`},r=t.length||1,i=2*Math.PI*36,a=0;return`
            <div style="display:flex;gap:16px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #f5f5f8">
              <div style="display:flex;gap:16px;align-items:center;flex-shrink:0">
                ${`<svg width="88" height="88" viewBox="0 0 88 88">${Object.entries(e.bcgCount).filter(([,e])=>e>0).map(([e,t])=>{let o=t/r,s=`<circle cx="44" cy="44" r="36"
                fill="none" stroke="${n[e]||`#9ca3af`}"
                stroke-width="12"
                stroke-dasharray="${o*i} ${i}"
                stroke-dashoffset="${-a*i}"
                transform="rotate(-90 44 44)"/>`;return a+=o,s}).join(``)}
            <text x="44" y="49" text-anchor="middle"
                  font-size="14" font-weight="700" fill="#0f172a">${r}</text>
          </svg>`}
                <div>${Object.entries(e.bcgCount).filter(([,e])=>e>0).map(([e,t])=>`<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
              <div style="width:8px;height:8px;border-radius:2px;background:${n[e]||`#9ca3af`};flex-shrink:0"></div>
              <span style="font-size:11px;color:#6b7280;flex:1">${e.replace(`_`,` `)}</span>
              <span style="font-size:11px;font-weight:700;color:#0f172a">${t}</span>
            </div>`).join(``)}</div>
              </div>
              <div style="flex:1;padding-left:16px;border-left:1px solid #f1f5f9">
                
            <div id="bcg-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">
              <div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                AI анализирует портфель...
              </div>
            </div>
              </div>
            </div>
            <div class="kpi-det-title">Все клиенты</div>
            <div style="max-height:200px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent">${t.map(e=>`
            <div data-action="go-detail" data-id="${e.client.id}"
                 style="display:flex;align-items:center;gap:8px;padding:7px 0;
                        border-bottom:1px solid #f5f5f8;cursor:pointer"
                 onmouseover="this.style.background='#f8faff'"
                 onmouseout="this.style.background='transparent'">
              <div style="width:6px;height:6px;border-radius:2px;flex-shrink:0;
                          background:${n[e.client.bcg_category]||`#9ca3af`}"></div>
              <span style="font-size:12px;font-weight:600;flex:1;color:#0f172a">${e.client.name}</span>
              <span style="font-size:11px;font-weight:600;color:#6366f1">$${Number(e.client.monthly_revenue||0).toLocaleString(`ru-RU`)}</span>
            </div>`).join(``)}</div>`})()},{id:`revenue_bcg`,icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,label:`Revenue by BCG`,value:`$`+Math.round(t.reduce((e,t)=>e+(t.client.monthly_revenue||0),0)/1e3)+`K`,hint:`суммарный MR`,valueColor:`var(--text-primary)`,detail:(()=>{let e={KEY:`#f59e0b`,GROWTH:`#6366f1`,GROWTH_EARLY:`#8b5cf6`,STABLE:`#6b7280`,TAIL:`#9ca3af`},n=[`KEY`,`STABLE`,`GROWTH`,`GROWTH_EARLY`,`TAIL`],r={};n.forEach(e=>{r[e]=0}),t.forEach(e=>{let t=e.client.bcg_category;r[t]!=null&&(r[t]+=e.client.monthly_revenue||0)});let i=Math.max(...Object.values(r),1),a=Object.values(r).reduce((e,t)=>e+t,0)||1,o=n.length*58;return`
            <div style="display:flex;gap:20px;align-items:flex-start">
              <div style="flex-shrink:0">${`<svg width="${o}" height="188" viewBox="0 0 ${o} 188">
            <line x1="0" y1="160" x2="${o}" y2="160" stroke="#e2e8f0" stroke-width="1"/>
            ${n.map((t,n)=>{let a=r[t]||0,o=Math.round(a/i*140),s=n*58,c=20+(140-o),l=a>=1e3?`$`+Math.round(a/1e3)+`K`:`$`+a;return`
              <rect x="${s}" y="${c}" width="44" height="${o}"
                    fill="${e[t]||`#9ca3af`}" rx="4" opacity=".9"/>
              <text x="${s+44/2}" y="${c-5}" text-anchor="middle"
                    font-size="9" font-weight="600" fill="#374151">${a>0?l:``}</text>
              <text x="${s+44/2}" y="174" text-anchor="middle"
                    font-size="9" fill="#6b7280">${t.replace(`_EARLY`,` E`).replace(`_`,` `)}</text>`}).join(``)}
          </svg>`}</div>
              <div style="flex:1;padding-left:16px;border-left:1px solid #f1f5f9">
                <div id="revenue-bcg-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">
                  <div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    AI анализирует...
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px">
              ${n.filter(e=>r[e]>0).map(t=>`
                <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6b7280">
                  <div style="width:8px;height:8px;border-radius:2px;background:${e[t]}"></div>
                  ${t.replace(`_`,` `)}:
                  <strong style="color:#0f172a">$${r[t].toLocaleString(`en-US`)}</strong>
                  <span style="color:#94a3b8">(${Math.round(r[t]/a*100)}%)</span>
                </div>`).join(``)}
            </div>`})()},{id:`hours_revenue`,icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,label:`Часы vs Revenue`,value:(t.length?Math.round(t.reduce((e,t)=>e+(t.total_hours||0),0)/t.length*10)/10:0)+`h`,hint:`среднее на клиента`,valueColor:`var(--text-primary)`,detail:(()=>{let e={KEY:`#f59e0b`,GROWTH:`#6366f1`,GROWTH_EARLY:`#8b5cf6`,STABLE:`#6b7280`,TAIL:`#9ca3af`},n=Math.max(...t.map(e=>e.total_hours||0),1),r=Math.max(...t.map(e=>e.client.monthly_revenue||0),1),i=e=>Math.round(54+e/n*612),a=e=>Math.round(266-e/r*212),o=[...t].sort((e,t)=>(t.client.monthly_revenue||0)-(e.client.monthly_revenue||0)),s=new Set(o.slice(0,3).map(e=>e.client.id)),c=t.map(t=>{let n=i(t.total_hours||0),r=a(t.client.monthly_revenue||0),o=e[t.client.bcg_category]||`#9ca3af`,c=s.has(t.client.id),l=t.client.name.length>10?t.client.name.slice(0,9)+`…`:t.client.name,u=c?`<text class="sc-lbl sc-lbl-`+t.client.id+`" x="`+(n+10)+`" y="`+(r+4)+`" font-size="11" font-weight="600" fill="#1e293b" pointer-events="none">`+l+`</text>`:`<text class="sc-lbl sc-lbl-`+t.client.id+`" x="`+(n+8)+`" y="`+(r+4)+`" font-size="11" fill="#64748b" pointer-events="none" opacity="0">`+l+`</text>`;return`<circle class="sc-dot" cx="`+n+`" cy="`+r+`" r="`+(c?7:5)+`" fill="`+o+`" opacity=".85" data-action="go-detail" data-id="`+t.client.id+`" data-bcg="`+(t.client.bcg_category||``)+`" data-name="`+t.client.name+`" data-hrs="`+(t.total_hours||0)+`" data-mr="`+(t.client.monthly_revenue||0)+`" style="cursor:pointer;transition:opacity .2s,r .15s"/>`+u}).join(``),l=[0,.25,.5,.75,1].map(e=>{let t=Math.round(n*e*10)/10,r=i(t);return`<line x1="`+r+`" y1="266" x2="`+r+`" y2="270" stroke="#cbd5e1" stroke-width="1"/><text x="`+r+`" y="281" text-anchor="middle" font-size="10" fill="#64748b">`+t+`h</text>`}).join(``),u=[0,.25,.5,.75,1].map(e=>{let t=Math.round(r*e),n=a(t),i=t>=1e3?`$`+Math.round(t/1e3)+`K`:`$`+t;return`<line x1="50" y1="`+n+`" x2="54" y2="`+n+`" stroke="#cbd5e1" stroke-width="1"/><text x="47" y="`+(n+4)+`" text-anchor="end" font-size="10" fill="#64748b">`+i+`</text>`}).join(``),d=`<svg id="scatter-svg" viewBox="0 0 720 320" width="100%" style="display:block;min-height:240px"><line x1="54" y1="266" x2="716" y2="266" stroke="#e2e8f0" stroke-width="1"/><line x1="54" y1="4" x2="54" y2="266" stroke="#e2e8f0" stroke-width="1"/><text x="360" y="322" text-anchor="middle" font-size="11" fill="#64748b">Часы / нед</text><text x="10" y="160" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 10 160)">MR ($)</text>`+l+u+c+`</svg>`,f=[...new Set(t.map(e=>e.client.bcg_category).filter(Boolean))].map(t=>`<button class="sc-filter-pill" data-bcg="`+t+`" style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;border:1.5px solid `+(e[t]||`#9ca3af`)+`;background:transparent;color:`+(e[t]||`#9ca3af`)+`;transition:all .18s"><span style="width:6px;height:6px;border-radius:50%;background:`+(e[t]||`#9ca3af`)+`;display:inline-block"></span>`+t.replace(`_EARLY`,` E`).replace(`_`,` `)+`</button>`).join(``);return`<div style="display:flex;flex-direction:column;gap:12px"><div>`+d+`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center"><button class="sc-filter-pill sc-filter-all sc-active" data-bcg="ALL" style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid #6366f1;background:#6366f1;color:#fff;transition:all .18s">Все</button>`+f+`</div><div id="sc-counter" style="font-size:11px;color:#94a3b8;margin-top:5px">Показано `+t.length+` из `+t.length+`</div></div><div style="padding-top:12px;border-top:1px solid #f1f5f9"><div style="font-size:11px;font-weight:700;color:#6366f1;letter-spacing:.05em;margin-bottom:6px">AI · ЧАСЫ VS REVENUE</div><div id="hours-rev-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6"><div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>AI анализирует...</div></div></div></div>`})()},{id:`priority_revenue`,icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>`,label:`Приоритет vs MR`,value:(()=>{let e=[...t].sort((e,t)=>(t.priority_score||0)-(e.priority_score||0))[0];return e?Math.round((e.priority_score||0)*100)/100+``:`—`})(),hint:`топ Priority Score`,valueColor:`#6366f1`,detail:(()=>{let e={KEY:`#f59e0b`,GROWTH:`#6366f1`,GROWTH_EARLY:`#8b5cf6`,STABLE:`#6b7280`,TAIL:`#9ca3af`},n=t.map(e=>e.priority_score||0),r=t.map(e=>e.client.monthly_revenue||0),i=Math.max(0,Math.min(...n)-.1),a=Math.max(...n,1)+.1,o=Math.max(...r,1),s=e=>Math.round(54+(e-i)/(a-i)*612),c=e=>Math.round(286-e/o*232),l=s(i+(a-i)*.5),u=c(o*.5),d=`<rect x="54" y="`+u+`" width="`+(l-54)+`" height="`+(286-u)+`" fill="#fef3c7" opacity=".35"/><rect x="`+l+`" y="54" width="`+(666-l)+`" height="`+(u-54)+`" fill="#dcfce7" opacity=".35"/><rect x="54" y="54" width="`+(l-54)+`" height="`+(u-54)+`" fill="#fee2e2" opacity=".25"/><rect x="`+l+`" y="`+u+`" width="`+(666-l)+`" height="`+(286-u)+`" fill="#f1f5f9" opacity=".5"/>`,f=`<text x="62" y="`+(u-8)+`" font-size="11" font-weight="600" fill="#ef4444" opacity=".8">Опасно</text><text x="`+(l+8)+`" y="72" font-size="11" font-weight="600" fill="#10b981" opacity=".8">Идеально</text><text x="62" y="278" font-size="11" font-weight="600" fill="#94a3b8" opacity=".8">Слабые</text><text x="`+(l+8)+`" y="278" font-size="11" font-weight="600" fill="#6366f1" opacity=".8">Потенциал</text>`,p=[0,.25,.5,.75,1].map(e=>{let t=Math.round((i+(a-i)*e)*100)/100,n=s(i+(a-i)*e);return`<line x1="`+n+`" y1="286" x2="`+n+`" y2="290" stroke="#cbd5e1" stroke-width="1"/><text x="`+n+`" y="299" text-anchor="middle" font-size="8" fill="#94a3b8">`+t+`</text>`}).join(``),m=[0,.25,.5,.75,1].map(e=>{let t=Math.round(o*e),n=c(t),r=t>=1e3?`$`+Math.round(t/1e3)+`K`:`$`+t;return`<line x1="50" y1="`+n+`" x2="54" y2="`+n+`" stroke="#cbd5e1" stroke-width="1"/><text x="48" y="`+(n+3)+`" text-anchor="end" font-size="8" fill="#94a3b8">`+r+`</text>`}).join(``),h=[...t].sort((e,t)=>(t.client.monthly_revenue||0)-(e.client.monthly_revenue||0)),g=new Set(h.slice(0,3).map(e=>e.client.id)),_=t.map(t=>{let n=s(t.priority_score||0),r=c(t.client.monthly_revenue||0),i=e[t.client.bcg_category]||`#9ca3af`,a=g.has(t.client.id),o=t.client.name.length>10?t.client.name.slice(0,9)+`…`:t.client.name,l=a?`<text x="`+(n+9)+`" y="`+(r+4)+`" font-size="9" font-weight="600" fill="#374151" pointer-events="none">`+o+`</text>`:``;return`<circle class="ps-dot" cx="`+n+`" cy="`+r+`" r="`+(a?8:6)+`" fill="`+i+`" opacity=".85" data-action="go-detail" data-id="`+t.client.id+`" data-bcg="`+(t.client.bcg_category||``)+`" data-name="`+t.client.name+`" data-ps="`+Math.round((t.priority_score||0)*100)/100+`" data-mr="`+(t.client.monthly_revenue||0)+`" style="cursor:pointer;transition:opacity .2s"/>`+l}).join(``),v=`<svg id="ps-svg" viewBox="0 0 720 340" width="100%" style="display:block;min-height:280px">`+d+f+`<line x1="54" y1="286" x2="716" y2="286" stroke="#e2e8f0" stroke-width="1"/><line x1="54" y1="4" x2="54" y2="286" stroke="#e2e8f0" stroke-width="1"/><text x="360" y="340" text-anchor="middle" font-size="9" fill="#94a3b8">Priority Score</text><text x="8" y="170" text-anchor="middle" font-size="9" fill="#94a3b8" transform="rotate(-90 8 170)">MR ($)</text>`+p+m+_+`</svg>`,y=Object.entries(e).map(([e,t])=>`<button class="sc-filter-pill ps-pill" data-bcg="`+e+`" style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;border:1.5px solid `+t+`;background:#fff;color:#374151;font-size:10px;font-weight:600;cursor:pointer;transition:all .15s"><span style="width:7px;height:7px;border-radius:50%;background:`+t+`;display:inline-block"></span>`+e.replace(`_EARLY`,` E`)+`</button>`).join(``);return`<div style="display:flex;flex-direction:column;gap:12px">`+v+`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><div id="ps-pills" style="display:flex;flex-wrap:wrap;gap:6px"><button class="sc-filter-pill ps-pill sc-active" data-bcg="ALL" style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;border:1.5px solid #6366f1;background:#6366f1;color:#fff;font-size:10px;font-weight:600;cursor:pointer;transition:all .15s">Все</button>`+y+`</div></div><div id="ps-counter" style="font-size:10px;color:#94a3b8">Показано `+t.length+` из `+t.length+`</div><div style="padding-top:12px;border-top:1px solid #f1f5f9"><div style="font-size:11px;font-weight:700;color:#6366f1;letter-spacing:.05em;margin-bottom:6px">AI · ПРИОРИТЕТ</div><div id="ps-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6"><div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>AI анализирует...</div></div></div></div>`})()},{id:`loyalty`,icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,label:`Лояльность`,value:e.avgLoyalty===null?`—`:e.avgLoyalty+`%`,hint:`средняя по портфелю`,valueColor:n,detail:(()=>{let e=[...t].filter(e=>e.loyalty!==null).sort((e,t)=>t.loyalty-e.loyalty),n=e=>e>=60?`#10b981`:e>=40?`#f59e0b`:`#ef4444`;return`
            <div style="display:flex;gap:20px;align-items:flex-start">
              <div style="flex:1;min-width:0">
                <div style="max-height:300px;overflow-y:auto;
                            scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent">
                  ${e.map(e=>`
            <div data-action="go-detail" data-id="${e.client.id}"
                 style="display:flex;align-items:center;gap:8px;padding:6px 0;
                        border-bottom:1px solid #f5f5f8;cursor:pointer"
                 onmouseover="this.style.background='#f8faff'"
                 onmouseout="this.style.background='transparent'">
              <span style="font-size:11px;font-weight:600;width:80px;flex-shrink:0;
                           overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                           color:#0f172a">${e.client.name}</span>
              <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
                <div style="width:${e.loyalty}%;height:100%;
                            background:${n(e.loyalty)};border-radius:3px;
                            transition:width .3s"></div>
              </div>
              <span style="font-size:11px;font-weight:700;color:${n(e.loyalty)};
                           width:32px;text-align:right;flex-shrink:0">${e.loyalty}%</span>
            </div>`).join(``)||`<div style="font-size:12px;color:#94a3b8;padding:8px 0">Нет данных</div>`}
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;
                            padding-top:10px;border-top:1px solid #f1f5f9">
                  <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6b7280">
                    <div style="width:8px;height:8px;border-radius:2px;background:#10b981"></div>
                    Высокая <strong style="color:#0f172a;margin-left:2px">60%+</strong>
                    <span style="color:#94a3b8">(${e.filter(e=>e.loyalty>=60).length})</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6b7280">
                    <div style="width:8px;height:8px;border-radius:2px;background:#f59e0b"></div>
                    Средняя <strong style="color:#0f172a;margin-left:2px">40-60%</strong>
                    <span style="color:#94a3b8">(${e.filter(e=>e.loyalty>=40&&e.loyalty<60).length})</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#6b7280">
                    <div style="width:8px;height:8px;border-radius:2px;background:#ef4444"></div>
                    Низкая <strong style="color:#0f172a;margin-left:2px">до 40%</strong>
                    <span style="color:#94a3b8">(${e.filter(e=>e.loyalty<40).length})</span>
                  </div>
                </div>
              </div>
              <div style="flex:1;padding-left:20px;border-left:1px solid #f1f5f9;min-width:0">
                <div id="loyalty-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">
                  <div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4l3 3"/>
                    </svg>
                    AI анализирует...
                  </div>
                </div>
              </div>
            </div>`})()},{id:`risk`,icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,label:`Revenue at Risk`,value:`$`+e.totalRisk.toLocaleString(`ru-RU`),hint:`суммарно`,valueColor:r,detail:(()=>{let e=[...t].filter(e=>e.revenueAtRisk>0).sort((e,t)=>t.revenueAtRisk-e.revenueAtRisk),n=e.reduce((e,t)=>e+t.revenueAtRisk,0)||1,r=e[0]?.revenueAtRisk||1,i={KEY:`#f59e0b`,GROWTH:`#6366f1`,GROWTH_EARLY:`#8b5cf6`,STABLE:`#6b7280`,TAIL:`#9ca3af`},a=e.map(e=>e.riskPct),o=e.map(e=>Math.round(e.revenueAtRisk/n*100)),s=Math.min(100,Math.ceil(Math.max(...a)*1.25/5)*5),c=Math.min(100,Math.ceil(Math.max(...o)*1.35/5)*5),l=r,u=e=>Math.round(58+e/s*684),d=e=>Math.round(362-e/c*304),f=e=>Math.max(8,Math.min(42,Math.round(Math.sqrt(e/l)*42))),p=u(s*.35),m=d(c*.35),h=`<rect x="58" y="`+m+`" width="`+(p-58)+`" height="`+(362-m)+`" fill="#f1f5f9" opacity=".4"/><rect x="`+p+`" y="58" width="`+(742-p)+`" height="`+(m-58)+`" fill="#fee2e2" opacity=".3"/><rect x="58" y="58" width="`+(p-58)+`" height="`+(m-58)+`" fill="#fef3c7" opacity=".3"/><rect x="`+p+`" y="`+m+`" width="`+(742-p)+`" height="`+(362-m)+`" fill="#fef3c7" opacity=".2"/>`,g=`<text x="`+(p+8)+`" y="76" font-size="11" font-weight="600" fill="#ef4444" opacity=".8">Критично</text><text x="66" y="76" font-size="11" font-weight="600" fill="#f59e0b" opacity=".8">Крупный, умеренный</text><text x="`+(p+8)+`" y="354" font-size="11" font-weight="600" fill="#f59e0b" opacity=".8">Малый, высокий риск</text><text x="66" y="354" font-size="11" font-weight="600" fill="#94a3b8" opacity=".8">Наблюдение</text>`,_=e=>{let t=e<=20?5:e<=50?10:25,n=[];for(let r=0;r<=e;r+=t)n.push(r);return n},v=_(s).map(e=>{let t=u(e);return`<line x1="`+t+`" y1="362" x2="`+t+`" y2="366" stroke="#cbd5e1" stroke-width="1"/><text x="`+t+`" y="376" text-anchor="middle" font-size="10" fill="#64748b">`+e+`%</text>`}).join(``),y=_(c).map(e=>{let t=d(e);return`<line x1="54" y1="`+t+`" x2="58" y2="`+t+`" stroke="#cbd5e1" stroke-width="1"/><text x="51" y="`+(t+4)+`" text-anchor="end" font-size="10" fill="#64748b">`+e+`%</text>`}).join(``),b=[],x=e.map(e=>{let t=Math.round(e.revenueAtRisk/n*100),r=u(e.riskPct),a=d(t),o=f(e.revenueAtRisk),s=i[e.client.bcg_category]||`#9ca3af`,c=e.revenueAtRisk>=1e3?`$`+Math.round(e.revenueAtRisk/1e3)+`k`:`$`+e.revenueAtRisk,l=e.client.name.length>10?e.client.name.slice(0,9)+`…`:e.client.name,p=r,m=a-o-6;for(let[e,t]of[[0,0],[0,-14],[14,0],[-14,0],[0,-28],[20,-10],[-20,-10]]){let n=r+e,i=a-o-6+t;if(!b.some(e=>Math.abs(e.x-n)<48&&Math.abs(e.y-i)<13)){p=n,m=i;break}}b.push({x:p,y:m});let h=Math.abs(p-r)>6||Math.abs(m-(a-o-6))>6?`<line x1="`+p+`" y1="`+(m+3)+`" x2="`+r+`" y2="`+(a-o)+`" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>`:``;return`<circle class="risk-bubble" cx="`+r+`" cy="`+a+`" r="`+o+`" fill="`+s+`" opacity=".85" style="cursor:pointer;transition:all .2s" data-action="go-detail" data-id="`+e.client.id+`" data-bcg="`+(e.client.bcg_category||``)+`" data-name="`+e.client.name+`" data-riskpct="`+e.riskPct+`" data-pfpct="`+t+`" data-amt="`+c+`"/>`+h+`<text x="`+p+`" y="`+m+`" text-anchor="middle" style="font-size:11px;font-weight:600;fill:#1e293b;pointer-events:none">`+l+`</text>`}).join(``);return`
            <div style="display:flex;flex-direction:column;gap:16px">

              <!-- График на всю ширину -->
              <div>
                ${`<svg id="risk-bubble-svg" viewBox="0 0 800 420" width="100%" style="display:block;min-height:280px">`+h+g+`<line x1="58" y1="362" x2="796" y2="362" stroke="#e2e8f0" stroke-width="1"/><line x1="58" y1="4" x2="58" y2="362" stroke="#e2e8f0" stroke-width="1"/><text x="400" y="420" text-anchor="middle" font-size="9" fill="#94a3b8">% риска от MR клиента</text><text x="8" y="210" text-anchor="middle" font-size="9" fill="#94a3b8" transform="rotate(-90 8 210)">% от портфеля</text>`+v+y+x+`</svg>`}
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center">
                  <button class="rb-filter-pill rb-filter-all rb-active" data-bcg="ALL" style="
                    display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;
                    font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid #6366f1;
                    background:#6366f1;color:#fff;transition:all .18s">Все</button>
                  ${Object.entries(i).filter(([t])=>e.some(e=>e.client.bcg_category===t)).map(([e,t])=>`<button class="rb-filter-pill" data-bcg="`+e+`" style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid `+t+`;background:transparent;color:`+t+`;transition:all .18s"><span style="width:6px;height:6px;border-radius:50%;background:`+t+`;display:inline-block"></span>`+e.replace(`_EARLY`,` E`).replace(`_`,` `)+`</button>`).join(``)}
                </div>
                <div id="rb-counter" style="font-size:11px;color:#94a3b8;margin-top:5px">Показано ${e.length} из ${e.length}</div>
              </div>

              <!-- AI инсайт под графиком -->
              <div style="padding-top:14px;border-top:1px solid #f1f5f9">
                <div style="font-size:11px;font-weight:600;color:#ef4444;
                            text-transform:uppercase;letter-spacing:.06em;
                            margin-bottom:8px">AI · Revenue at Risk</div>
                <div id="risk-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6">
                  <div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4l3 3"/>
                    </svg>
                    AI анализирует...
                  </div>
                </div>
              </div>

            </div>`})()},{id:`potential`,icon:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,label:`Реализация`,value:e.avgPotential===null?`—`:e.avgPotential+`%`,hint:`от потенциала`,valueColor:i,detail:(()=>{let e=[...t].filter(e=>e.pctPot!==null&&e.pctPot!==void 0&&e.potential>0&&e.loyalty!==null&&e.loyalty!==void 0);if(!e.length)return`<div style="font-size:12px;color:#94a3b8;padding:8px 0">Нет данных</div>`;let n={KEY:`#f59e0b`,GROWTH:`#6366f1`,GROWTH_EARLY:`#8b5cf6`,STABLE:`#6b7280`,TAIL:`#9ca3af`},r=e=>e>=85?`#10b981`:e>=65?`#f59e0b`:`#ef4444`,i=Math.max(...e.map(e=>e.client.monthly_revenue||0),1),a=e.map(e=>e.loyalty),o=Math.max(0,Math.floor(Math.min(...a)/5)*5-5),s=Math.min(100,Math.ceil(Math.max(...a)/5)*5+5),c=e=>Math.round(62+(e-o)/(s-o)*676),l=e=>Math.round(338-e/100*276),u=e=>Math.max(7,Math.min(40,Math.round(Math.sqrt(e/i)*40))),d=l(85),f=l(65),p=`<rect x="62" y="62" width="676" height="`+(d-62)+`" fill="#d1fae5" opacity=".2"/><rect x="62" y="`+d+`" width="676" height="`+(f-d)+`" fill="#fef3c7" opacity=".25"/><rect x="62" y="`+f+`" width="676" height="`+(338-f)+`" fill="#fee2e2" opacity=".2"/><line x1="62" y1="`+d+`" x2="738" y2="`+d+`" stroke="#10b981" stroke-width="1" stroke-dasharray="4,3" opacity=".4"/><line x1="62" y1="`+f+`" x2="738" y2="`+f+`" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4,3" opacity=".4"/><text x="742" y="`+(d+4)+`" font-size="9" fill="#10b981" opacity=".7">85%</text><text x="742" y="`+(f+4)+`" font-size="9" fill="#f59e0b" opacity=".7">65%</text>`,m=[0,.25,.5,.75,1].map(e=>{let t=Math.round(o+(s-o)*e),n=c(t);return`<line x1="`+n+`" y1="338" x2="`+n+`" y2="342" stroke="#cbd5e1" stroke-width="1"/><text x="`+n+`" y="353" text-anchor="middle" font-size="10" fill="#64748b">`+t+`%</text>`}).join(``),h=[0,25,50,65,85,100].map(e=>{let t=l(e);return`<line x1="58" y1="`+t+`" x2="62" y2="`+t+`" stroke="#cbd5e1" stroke-width="1"/><text x="55" y="`+(t+4)+`" text-anchor="end" font-size="10" fill="#64748b">`+e+`%</text>`}).join(``),g=[],_=e.map(e=>{let t=c(e.loyalty??50),n=l(e.pctPot),i=u(e.client.monthly_revenue||0),a=r(e.pctPot),o=e.client.name.length>10?e.client.name.slice(0,9)+`…`:e.client.name,s=e.client.monthly_revenue>=1e3?`$`+Math.round(e.client.monthly_revenue/1e3)+`k`:`$`+(e.client.monthly_revenue||0),d=t,f=n-i-8,p=[[0,0],[0,-16],[0,-30],[30,-8],[-30,-8],[30,8],[-30,8],[45,0],[-45,0],[0,i+20]];for(let[e,r]of p){let a=t+e,o=n-i-8+r;if(!g.some(e=>Math.abs(e.x-a)<60&&Math.abs(e.y-o)<16)){d=a,f=o;break}}g.push({x:d,y:f});let m=Math.abs(d-t)>6||Math.abs(f-(n-i-8))>6?`<line x1="`+d+`" y1="`+(f+3)+`" x2="`+t+`" y2="`+(n-i)+`" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>`:``;return`<circle class="pot-bubble" cx="`+t+`" cy="`+n+`" r="`+i+`" fill="`+a+`" opacity=".82" style="cursor:pointer;transition:all .2s" data-action="go-detail" data-id="`+e.client.id+`" data-bcg="`+(e.client.bcg_category||``)+`" data-name="`+e.client.name+`" data-pct="`+e.pctPot+`" data-loyalty="`+(e.loyalty??`—`)+`" data-mr="`+s+`"/>`+m+`<text x="`+d+`" y="`+f+`" text-anchor="middle" style="font-size:11px;font-weight:600;fill:#1e293b;pointer-events:none">`+o+`</text>`}).join(``),v=`<svg id="pot-bubble-svg" viewBox="0 0 800 400" width="100%" style="display:block;min-height:280px">`+p+`<line x1="62" y1="338" x2="796" y2="338" stroke="#e2e8f0" stroke-width="1"/><line x1="62" y1="4" x2="62" y2="338" stroke="#e2e8f0" stroke-width="1"/><text x="400" y="396" text-anchor="middle" font-size="11" fill="#64748b">Лояльность (%)</text><text x="10" y="200" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 10 200)">Реализация (%)</text>`+m+h+_+`</svg>`,y=[...new Set(e.map(e=>e.client.bcg_category).filter(Boolean))].map(e=>`<button class="pot-filter-pill" data-bcg="`+e+`" style="display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid `+(n[e]||`#9ca3af`)+`;background:transparent;color:`+(n[e]||`#9ca3af`)+`;transition:all .18s"><span style="width:6px;height:6px;border-radius:50%;background:`+(n[e]||`#9ca3af`)+`;display:inline-block"></span>`+e.replace(`_EARLY`,` E`).replace(`_`,` `)+`</button>`).join(``);return`<div style="display:flex;flex-direction:column;gap:12px"><div>`+v+`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center"><button class="pot-filter-pill pot-filter-all pot-active" data-bcg="ALL" style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid #6366f1;background:#6366f1;color:#fff;transition:all .18s">Все</button>`+y+`</div><div style="display:flex;gap:12px;margin-top:4px;flex-wrap:wrap"><div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#10b981"><div style="width:8px;height:8px;border-radius:2px;background:#10b981;opacity:.5"></div>≥85% отлично</div><div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#f59e0b"><div style="width:8px;height:8px;border-radius:2px;background:#f59e0b;opacity:.5"></div>65–84% норма</div><div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#ef4444"><div style="width:8px;height:8px;border-radius:2px;background:#ef4444;opacity:.5"></div><65% риск</div></div><div id="pot-counter" style="font-size:11px;color:#94a3b8;margin-top:4px">Показано `+e.length+` из `+e.length+`</div></div><div style="padding-top:12px;border-top:1px solid #f1f5f9"><div style="font-size:11px;font-weight:700;color:#6366f1;letter-spacing:.05em;margin-bottom:6px">AI · РЕАЛИЗАЦИЯ ПОТЕНЦИАЛА</div><div id="pot-ai-insight" style="font-size:12px;color:#6b7280;line-height:1.6"><div style="display:flex;align-items:center;gap:6px;color:#6366f1;font-size:11px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>AI анализирует...</div></div></div></div>`})()}].map(e=>`
      <div class="pf-kpi-card" data-card="${e.id}">
        <div class="pf-kpi-card-collapsed">
          <div class="pf-kpi-card-icon">${e.icon||``}</div>
          <div class="pf-kpi-card-label">${e.label}</div>
          <div class="pf-kpi-card-value" style="color:${e.valueColor}">${e.value}</div>
          <div class="pf-kpi-card-hint">${e.hint}</div>
        </div>
        <div class="pf-kpi-card-detail" style="display:none">${e.detail}</div>
      </div>`).join(``)}</div>`},_horizonFormHTML(e,t,n,r,i){let a=e=>i&&i[e]||``,o=!!(a(`focus`)||a(`outcome`)),s=a(`deadline`)?new Date(a(`deadline`)).toLocaleDateString(`ru-RU`,{day:`numeric`,month:`long`,year:`numeric`}):null;return`
      <div class="pf-hz" id="pf-horizon-${e}">

        <!-- Заголовок — всегда виден -->
        <div class="pf-hz-head" data-toggle="${e}">
          <div class="pf-hz-left">
            <div class="pf-hz-icon-block">
              <span class="pf-hz-symbol">${{short:`◔`,mid:`◑`,long:`◕`}[e]}</span>
              <span class="pf-hz-label">${t}</span>
            </div>
            <div class="pf-hz-meta">
              <span class="pf-hz-period">${n}</span>
              ${o&&a(`focus`)?`<div class="pf-hz-subtitle">${a(`focus`)}</div>`:``}
            </div>
          </div>
          <div class="pf-hz-right">
            ${s?`<span class="pf-hz-deadline">${s}</span>`:``}
            ${o?`<span class="pf-hz-status pf-hz-status--filled">Заполнено</span>`:`<span class="pf-hz-status pf-hz-status--empty">Не заполнено</span>`}
            <button class="pf-hz-edit-btn" data-editkey="${e}" title="Редактировать">
              ${H.edit}
            </button>
            <div class="pf-hz-actions" id="pf-hz-actions-${e}"></div>
            <div class="pf-hz-chevron" id="pf-hz-chevron-${e}">${H.chevron}</div>
          </div>
        </div>

        <!-- Тело — коллапсируется -->
        <div class="pf-hz-body" id="pf-hz-body-${e}">

          <!-- VIEW режим -->
          <div class="pf-hz-view" id="pf-hz-view-${e}">
            ${o?`
              <div class="pf-hz-view-grid">
                ${a(`focus`)?`
                  <div class="pf-hz-view-block">
                    <div class="pf-hz-view-label">Фокус</div>
                    <div class="pf-hz-view-text">${a(`focus`)}</div>
                  </div>`:``}
                ${a(`outcome`)?`
                  <div class="pf-hz-view-block">
                    <div class="pf-hz-view-label">Результат</div>
                    <div class="pf-hz-view-text">${a(`outcome`)}</div>
                  </div>`:``}
                ${a(`risk`)?`
                  <div class="pf-hz-view-block pf-hz-view-block--half">
                    <div class="pf-hz-view-label">Главный риск</div>
                    <div class="pf-hz-view-text">${a(`risk`)}</div>
                  </div>`:``}
                ${s?`
                  <div class="pf-hz-view-block pf-hz-view-block--half">
                    <div class="pf-hz-view-label">Дедлайн</div>
                    <div class="pf-hz-view-text pf-hz-view-deadline">${s}</div>
                  </div>`:``}
              </div>
            `:`
              <div class="pf-hz-empty">
                Стратегия не заполнена — нажмите ${H.edit} чтобы добавить
              </div>
            `}
          </div>

          <!-- EDIT режим (скрыт по умолчанию) -->
          <div class="pf-hz-edit" id="pf-hz-edit-${e}" style="display:none">
            <div class="pf-hz-edit-grid">
              <div class="pf-field pf-hz-full">
                <label>Фокус</label>
                <input id="pf-${e}-focus" value="${a(`focus`)}"
                       placeholder="На чём сосредоточены в этом периоде..." />
              </div>
              <div class="pf-field pf-hz-full">
                <label>Результат</label>
                <textarea id="pf-${e}-outcome"
                          placeholder="Что конкретно изменится, с цифрами...">${a(`outcome`)}</textarea>
              </div>
              <div class="pf-field pf-hz-full">
                <label>Главный риск</label>
                <input id="pf-${e}-risk" value="${a(`risk`)}"
                       placeholder="Что может помешать..." />
              </div>
              <div class="pf-field">
                <label>Статус</label>
                <select id="pf-${e}-status">
                  <option value="on_track" ${a(`status`)===`on_track`||!a(`status`)?`selected`:``}>On Track</option>
                  <option value="at_risk"  ${a(`status`)===`at_risk`?`selected`:``}>At Risk</option>
                  <option value="off_track"${a(`status`)===`off_track`?`selected`:``}>Off Track</option>
                </select>
              </div>
              <div class="pf-field">
                <label>Дедлайн</label>
                <input type="date" id="pf-${e}-deadline" value="${a(`deadline`)}" />
              </div>
            </div>
            <div class="pf-hz-edit-footer">
              <button class="pf-btn pf-btn-ghost pf-hz-cancel-btn" data-cancelkey="${e}">
                Отмена
              </button>
              <button class="pf-btn pf-btn-primary pf-hz-save-btn" id="pf-save-btn-${e}">
                ${H.save} Сохранить
              </button>
            </div>
          </div>

        </div>
      </div>`},_readHorizon(e){let t=e=>document.getElementById(e)?.value.trim()??``;return{focus:t(`pf-${e}-focus`),outcome:t(`pf-${e}-outcome`),risk:t(`pf-${e}-risk`),status:t(`pf-${e}-status`)||`on_track`,deadline:t(`pf-${e}-deadline`)}},async _savePortfolioStrats(){let e=document.getElementById(`pf-save-btn`);e&&(e.disabled=!0,e.innerHTML=`${H.save} Сохраняем...`);try{await Promise.all([f.upsertPortfolioStrategy(`short`,this._readHorizon(`short`)),f.upsertPortfolioStrategy(`mid`,this._readHorizon(`mid`)),f.upsertPortfolioStrategy(`long`,this._readHorizon(`long`))]),window.App.toast(`Стратегия сохранена`,`success`)}catch{window.App.toast(`Ошибка сохранения`,`error`)}finally{e&&(e.disabled=!1,e.innerHTML=`${H.save} Сохранить всё`)}},_setAiMode(e,t,n){[`short`,`mid`,`long`].forEach(r=>{let i=document.getElementById(`pf-ai-gen-btn-${r}`);if(e&&!i){let e=document.getElementById(`pf-hz-actions-${r}`);if(!e)return;let i=document.createElement(`button`);i.id=`pf-ai-gen-btn-${r}`,i.className=`pf-ai-gen-btn`,i.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77
                   l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Сгенерировать
      `,i.onclick=()=>this._aiHorizon(r,t,n),e.appendChild(i)}else !e&&i&&i.remove()})},async _aiHorizon(e,t,n){let r=document.getElementById(`pf-ai-gen-btn-${e}`);r&&(r.disabled=!0,r.textContent=`Генерирую...`),document.getElementById(`pf-variant-picker`)?.remove();let i=document.createElement(`div`);i.id=`pf-variant-picker`,i.innerHTML=`
      <div class="variant-picker-backdrop"></div>
      <div class="variant-picker-panel">
        <div class="variant-picker-header">
          <span>AI варианты</span>
          <button class="variant-picker-close"
            onclick="document.getElementById('pf-variant-picker').remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="variant-picker-body" id="vp-body">
          <div class="vp-direction-label">Выбери направление</div>
          <div class="vp-dir-grid">
            <button class="vp-dir-btn vp-dir-retention" data-dir="retention">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Удержание
            </button>
            <button class="vp-dir-btn vp-dir-growth" data-dir="growth">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              Рост
            </button>
            <button class="vp-dir-btn vp-dir-optimization" data-dir="optimization">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Оптимизация
            </button>
            <button class="vp-dir-btn vp-dir-custom" data-dir="custom">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Своё
            </button>
          </div>
          <textarea id="vp-custom-text" class="vp-custom-textarea"
                    placeholder="Опиши направление..." style="display:none"></textarea>
          <button class="vp-generate-btn" id="vp-gen-btn" disabled>
            Сгенерировать варианты
          </button>
        </div>
      </div>
    `,document.body.appendChild(i),requestAnimationFrame(()=>i.querySelector(`.variant-picker-panel`).classList.add(`visible`));let a=()=>{r&&(r.disabled=!1,r.innerHTML=`
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77
                     l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Сгенерировать`)};i.querySelector(`.variant-picker-backdrop`).onclick=()=>{i.remove(),a()};let o=null;i.querySelectorAll(`.vp-dir-btn`).forEach(e=>{e.addEventListener(`click`,()=>{i.querySelectorAll(`.vp-dir-btn`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),o=e.dataset.dir;let t=document.getElementById(`vp-custom-text`);o===`custom`?(t.style.display=`block`,t.focus()):t.style.display=`none`,document.getElementById(`vp-gen-btn`).disabled=!1})}),document.getElementById(`vp-gen-btn`).addEventListener(`click`,async()=>{let r=o===`custom`?document.getElementById(`vp-custom-text`)?.value.trim()||`custom`:o,s=document.getElementById(`vp-body`);s.innerHTML=`
        <div class="vp-loading">
          <div class="vp-spinner"></div>
          <div class="vp-loading-text">Генерирую варианты...</div>
        </div>
      `;try{let o=(n||[]).filter(e=>e.bchs!==null).sort((e,t)=>(t.revenueAtRisk||0)-(e.revenueAtRisk||0)).slice(0,10).map(e=>({name:e.client.name,bcg:e.client.bcg_category,bchs:e.bchs,trend:e.trend?.label??`—`,mr:e.client.monthly_revenue||0,risk:e.revenueAtRisk||0})),c=(await f.callAI({type:`horizon`,horizon:e,direction:r,max_tokens:1800,summary:{total:t.total,avgLoyalty:t.avgLoyalty,totalRisk:t.totalRisk,bcgCount:t.bcgCount,top3Risk:t.top3Risk.map(e=>`${e.name} ($${e.risk.toLocaleString(`ru-RU`)}, ${e.pct}%)`).join(`; `)||`нет`,avgPotential:t.avgPotential},clients_snapshot:o,existing_strategies:this._portfolioData}))?.choices?.[0]?.message?.content??``;if(!c)throw Error(`Пустой ответ от AI`);let l=c.match(/\{[\s\S]*\}/),u=JSON.parse(l?l[0]:c).variants??[];if(!u.length)throw Error(`AI не вернул варианты`);s.innerHTML=`
          <div class="variant-picker-list">${u.map((e,t)=>`
          <label class="variant-toggle-row" for="vt-${t}">
            <div class="variant-toggle-content">
              <div class="variant-toggle-title">${e.label||e.name||`Вариант `+(t+1)}</div>
              <div class="variant-toggle-text">${e.focus||e.outcome||e.text||``}</div>
            </div>
            <div class="toggle-switch">
              <input type="radio" name="variant-pick" id="vt-${t}"
                     value="${t}" ${t===0?`checked`:``}>
              <span class="toggle-track"></span>
            </div>
          </label>
        `).join(``)}</div>
          <div class="variant-picker-footer">
            <button class="variant-apply-btn" id="variant-apply-btn">Применить</button>
          </div>
        `,document.getElementById(`variant-apply-btn`).onclick=()=>{let t=i.querySelector(`input[name="variant-pick"]:checked`);if(t){let n=u[+t.value],r=document.getElementById(`pf-${e}-focus`),i=document.getElementById(`pf-${e}-outcome`),a=document.getElementById(`pf-${e}-risk`),o=document.getElementById(`pf-${e}-deadline`);r&&(r.value=n.focus||n.name||``),i&&(i.value=n.outcome||``),a&&(a.value=n.risk||``),o&&n.deadline&&(o.value=n.deadline);let s=document.getElementById(`pf-manual-save-bar`);s&&(s.style.display=`flex`)}i.remove(),a()}}catch(e){s.innerHTML=`
          <div class="vp-error">
            <div class="vp-error-text">${e.message}</div>
            <button class="vp-retry-btn"
              onclick="document.getElementById('pf-variant-picker').remove()">
              Закрыть
            </button>
          </div>
        `,a()}}),a()},async _renderAccountsTab(){let e=document.getElementById(`pf-tab-accounts`);e.innerHTML=`<div style="padding:40px;text-align:center;color:var(--text-muted);
                                font-size:13px">Загрузка аккаунтов...</div>`;try{let[t,n,r,i]=await Promise.all([f.getClients(),f.getAllBCHS(),f.getAllPC(),f.getAccountStrategies()]);this._accountStrategies=i;let a=t.map(e=>({client:e,...k.computeClient(e,n,r)})),o=window.MCEngine??null,s={};if(o){let e=[];try{let t=await f._get?.(`tables/mc_configs?limit=500`);e=Array.isArray(t)?t:Array.isArray(t?.data)?t.data:[]}catch{}for(let t of a){let n=String(t.client.id);if(this._mcCache[n]){s[n]=this._mcCache[n];continue}let r=e.find(e=>String(e.client_id)===n);try{let e=Object.assign({},o.DEFAULTS,{monthly_revenue:t.client.monthly_revenue||5e3},r||{}),i=o.run(t.bchs,e);this._mcCache[n]=i,s[n]=i}catch{s[n]=null}}}let c=e=>{let t=e===null?`#9ca3af`:e>=20?`#10b981`:e>=-10?`#f59e0b`:`#ef4444`;return`<span style="display:inline-flex;align-items:center;gap:5px">
          <span style="width:6px;height:6px;border-radius:50%;
                       background:${t};flex-shrink:0"></span>
          <span style="font-weight:600;color:${t}">
            ${e===null?`—`:e}
          </span>
        </span>`};e.innerHTML=`
        <div class="pf-section-head">
          <div class="pf-section-title">Аккаунт-стратегии</div>
        </div>
        <div class="pf-table-wrap">
          <table class="pf-table">
            <thead><tr>
              <th>Клиент</th>
              <th>BCG</th>
              <th>Приоритет</th>
              <th>bCHS</th>
              <th>MC 3М</th>
              <th>Риск оттока</th>
              <th>Стратегия</th>
              <th></th>
            </tr></thead>
            <tbody>${a.map(e=>{let t=e.client,n=s[String(t.id)]??null,r=n?n.horizons[`3m`].bchs.median.toFixed(1):`—`,a=n?n.horizons[`3m`].churn_rate:null,o=a===null?`#6b7280`:a<7?`#10b981`:a<15?`#f59e0b`:`#ef4444`,l=i.find(e=>String(e.client_id)===String(t.id)&&e.status!==`Done`),u=l?(l.outcome||``).slice(0,55)+((l.outcome||``).length>55?`…`:``):null,d={Active:`#10b981`,Paused:`#f59e0b`,Done:`#9ca3af`}[l?.status]??`#9ca3af`;return`<tr>
          <td style="font-weight:600">${t.name}</td>
          <td>${he(t.bcg_category)}</td>
          <td style="font-size:11px;color:var(--text-muted)">${t.key_account_priority||`—`}</td>
          <td>${c(e.bchs)}</td>
          <td style="font-weight:600;color:var(--text-primary)">${r}</td>
          <td style="font-weight:600;color:${o}">
            ${a===null?`—`:a.toFixed(1)+`%`}
          </td>
          <td style="max-width:200px">
            ${u?`<span style="font-size:12px;color:var(--text-secondary)">${u}</span>`:`<span style="font-size:12px;color:var(--text-muted)">Не задана</span>`}
            ${l?.status?`<span style="margin-left:6px;font-size:10px;font-weight:600;
                              color:${d}">${l.status}</span>`:``}
          </td>
          <td>
            <button class="pf-btn pf-btn-secondary" style="padding:5px 10px;font-size:11px"
                    data-action="open-strat" data-cid="${t.id}">
              ${H.edit} Открыть
            </button>
          </td>
        </tr>`}).join(``)}</tbody>
          </table>
        </div>`,e.querySelectorAll(`[data-action="open-strat"]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.cid,n=a.find(e=>String(e.client.id)===t),r=s[t]??null,o=i.find(e=>String(e.client_id)===t&&e.status!==`Done`)??null;this._openAccountStratModal(n,r,o)})})}catch(t){console.error(`[PortfolioPage._renderAccountsTab]`,t),e.innerHTML=`<div style="padding:32px;text-align:center;color:#ef4444;font-size:13px">
        Ошибка: ${t.message}</div>`}},_openAccountStratModal(e,t,n){let r=e.client,i=t?t.horizons[`3m`].bchs.median.toFixed(1):`—`,a=t?t.horizons[`12m`].bchs.median.toFixed(1):`—`,o=t?t.horizons[`3m`].churn_rate.toFixed(1)+`%`:`—`,s=t?t.horizons[`3m`].churn_rate<7?`#10b981`:t.horizons[`3m`].churn_rate<15?`#f59e0b`:`#ef4444`:`#6b7280`,c=e.bchs===null?`#6b7280`:e.bchs>=20?`#10b981`:e.bchs>=-10?`#f59e0b`:`#ef4444`,l=e=>n&&n[e]||``,u=[`Active`,`Done`,`Paused`].map(e=>`<option value="${e}" ${(l(`status`)||`Active`)===e?`selected`:``}>${e}</option>`).join(``);window.App.openModal(`
      <div style="padding:24px;max-width:540px;width:100%;box-sizing:border-box">

        <div style="margin-bottom:16px">
          <div style="font-size:16px;font-weight:700;color:var(--text-primary);
                      margin-bottom:3px">${r.name}</div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            ${he(r.bcg_category)}
            <span style="font-size:12px;color:var(--text-muted)">
              ${r.key_account_priority||`—`}
            </span>
            <span style="font-size:12px;color:var(--text-muted)">

              $${Number(r.monthly_revenue||0).toLocaleString(`ru-RU`)}/мес
            </span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);
                    gap:1px;background:var(--border);
                    border:1px solid var(--border);border-radius:10px;
                    overflow:hidden;margin-bottom:18px">
          ${[[`bCHS`,e.bchs===null?`—`:e.bchs,c],[`MC 3М`,i,`var(--text-primary)`],[`Отток 3М`,o,s],[`Тренд`,e.trend?.label??`—`,`var(--text-primary)`]].map(([e,t,n])=>`
            <div style="background:var(--surface);padding:12px 14px">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                          letter-spacing:.06em;color:var(--text-muted);
                          margin-bottom:4px">${e}</div>
              <div style="font-size:18px;font-weight:700;color:${n}">${t}</div>
            </div>`).join(``)}
        </div>

        <div style="display:flex;flex-direction:column;gap:12px">
          <div class="pf-field">
            <label>Цель</label>
            <textarea id="as-goal" style="min-height:72px"
                      placeholder="Что хотим достичь...">${l(`goal`)}</textarea>
          </div>
          <div class="pf-field">
            <label>Действия</label>
            <textarea id="as-actions" style="min-height:72px"
                      placeholder="Конкретные шаги...">${l(`actions`)}</textarea>
          </div>
          <div class="pf-field">
            <label>Метрика успеха</label>
            <textarea id="as-metric" style="min-height:60px"
                      placeholder="Как измерим результат">${l(`success_metric`)}</textarea>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="pf-field">
              <label>Дедлайн</label>
              <input type="date" id="as-deadline" value="${l(`deadline`)}" />
            </div>
            <div class="pf-field">
              <label>Статус</label>
              <select id="as-status"
                      style="width:100%;height:38px;padding:0 10px;
                             border:1.5px solid var(--border);border-radius:8px;
                             font-size:13px;font-family:inherit;background:#fafafa">
                ${u}
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:18px;flex-wrap:wrap">
          <button class="pf-btn pf-btn-ghost" id="as-ai-btn">
            ${H.ai} AI предложить
          </button>
          <div style="flex:1"></div>
          <button class="pf-btn pf-btn-secondary" id="as-close-btn">
            ${H.close} Закрыть
          </button>
          <button class="pf-btn pf-btn-primary" id="as-save-btn">
            ${H.save} Сохранить
          </button>
        </div>
      </div>`),document.getElementById(`as-close-btn`)?.addEventListener(`click`,()=>window.App.closeModal()),document.getElementById(`as-save-btn`)?.addEventListener(`click`,async()=>{let n=e=>document.getElementById(e)?.value.trim()??``,i=t?JSON.stringify({bchs_current:e.bchs,mc_3m_median:t.horizons[`3m`].bchs.median,mc_3m_churn:t.horizons[`3m`].churn_rate,mc_12m_median:t.horizons[`12m`].bchs.median,mc_12m_churn:t.horizons[`12m`].churn_rate,saved_at:new Date().toISOString()}):null,a=document.getElementById(`as-save-btn`);a&&(a.disabled=!0,a.innerHTML=`${H.save} Сохраняем...`);try{await f.saveAccountStrategy(r.id,{goal:n(`as-goal`),actions:n(`as-actions`),success_metric:n(`as-metric`),deadline:n(`as-deadline`),status:n(`as-status`),mc_snapshot:i,ai_generated:!1}),window.App.toast(`Стратегия сохранена`,`success`),window.App.closeModal(),this._renderAccountsTab()}catch{window.App.toast(`Ошибка сохранения`,`error`)}finally{a&&(a.disabled=!1,a.innerHTML=`${H.save} Сохранить`)}}),document.getElementById(`as-ai-btn`)?.addEventListener(`click`,async()=>{let n=document.getElementById(`as-ai-btn`);n&&(n.disabled=!0,n.innerHTML=`${H.ai} Генерирую...`);try{let n=(await f.callAI({type:`account`,client:{name:r.name,bcg:r.bcg_category,priority:r.key_account_priority||`—`,monthly_revenue:r.monthly_revenue||0,engagement:r.client_engagement||`—`,phase:r.phase||`—`,revenue_at_risk:e.revenueAtRisk||0},metrics:{bchs_current:e.bchs,trend:e.trend?.label??`—`,mc_3m_median:i,mc_3m_churn:o,mc_12m_median:a,mc_12m_churn:t?t.horizons[`12m`].churn_rate.toFixed(1)+`%`:`—`}}))?.choices?.[0]?.message?.content??``;if(!n)throw Error(`Пустой ответ от AI`);let s=n.match(/\{[\s\S]*\}/),c=JSON.parse(s?s[0]:n),l=c.variants??[];if(l.length)this._showAccountVariantPicker(l,e);else{let e=(e,t)=>{let n=document.getElementById(e);n&&(n.value=t||``)};e(`as-goal`,c.goal),e(`as-actions`,c.actions),e(`as-metric`,c.success_metric),e(`as-deadline`,c.deadline),window.App.toast(`AI предложение заполнено`,`success`)}}catch(e){window.App.toast(`Ошибка AI: `+e.message,`error`)}finally{n&&(n.disabled=!1,n.innerHTML=`${H.ai} AI предложить`)}})},_showAccountVariantPicker(e,t){window.App.openModal(`
      <div style="padding:24px;max-width:500px;width:100%;box-sizing:border-box">
        <div class="pf-modal-head">3 варианта стратегии</div>
        <div class="pf-modal-sub">${t.client.name} · Выбери — заполнится в форму</div>
        ${e.map((e,t)=>`
          <div class="pf-variant-card" data-idx="${t}">
            <div class="pf-variant-label">${e.label??`Вариант ${t+1}`}</div>
            <div class="pf-variant-goal">${e.goal??`—`}</div>
            <div class="pf-variant-meta">
              <span>${e.deadline??`—`}</span>
              <span>${e.success_metric??`—`}</span>
            </div>
          </div>`).join(``)}
        <button class="pf-btn pf-btn-secondary" id="variant-cancel"
                style="margin-top:4px">${H.close} Отмена</button>
      </div>`),document.querySelectorAll(`.pf-variant-card`).forEach(t=>{t.addEventListener(`click`,()=>{let n=e[parseInt(t.dataset.idx)],r=(e,t)=>{let n=document.getElementById(e);n&&(n.value=t||``)};r(`as-goal`,n.goal??``),r(`as-actions`,n.actions??``),r(`as-metric`,n.success_metric??``),r(`as-deadline`,n.deadline??``),window.App.closeModal(),window.App.toast(`Вариант применён`,`success`)})}),document.getElementById(`variant-cancel`)?.addEventListener(`click`,()=>window.App.closeModal())},async _renderCoverageTab(){let e=document.getElementById(`pf-tab-coverage`);if(e){e.innerHTML=`<div style="padding:40px;text-align:center;color:var(--text-muted);
                                font-size:13px">Загрузка...</div>`;try{let[e,t]=await Promise.all([f.getClients(),f.getAllPC()]);this._allClientsForCoverage=e,this._allPCForCoverage=t,this._renderCoverageContent(e,t)}catch(t){e.innerHTML=`<div style="padding:32px;text-align:center;color:#ef4444;
                                  font-size:13px">Ошибка: ${t.message}</div>`}}},_renderCoverageContent(e,t){let n=document.getElementById(`pf-tab-coverage`);if(!n)return;t=t??this._allPCForCoverage??[];let r=this._coverageFilters,i=[...new Set(e.map(e=>e.dach_region).filter(Boolean))].sort(),a=[...new Set(e.map(e=>e.account_manager).filter(Boolean))].sort(),o=e.map(e=>{let n=t.filter(t=>String(t.client_id)===String(e.id)).sort((e,t)=>e.year===t.year?e.month-t.month:e.year-t.year).at(-1)??null,r=Number(n?.role_csm)||0,i=Number(n?.role_account_manager)||0,a=Number(n?.role_coordinator)||0,o=Number(n?.role_sales)||0,s=Number(n?.role_delivery)||0,c=r>0,l=i>0,u=a>0,d=o>0,f=s>0,p=l||u||d||f,m=c&&l&&u?`full`:c&&p?`overlap`:c||p?`partial`:`none`;return{...e,csm:r,am:i,coord:a,sales:o,deliv:s,hasCSM:c,hasAM:l,hasCoord:u,hasSales:d,hasDeliv:f,covStatus:m}}),s=o.length,c=o.filter(e=>e.covStatus===`full`).length,l=o.filter(e=>e.covStatus===`none`).length,u=o.filter(e=>e.covStatus===`overlap`).length,d=o;r.region&&(d=d.filter(e=>e.dach_region===r.region)),r.am&&(d=d.filter(e=>e.account_manager===r.am)),r.status&&(d=d.filter(e=>e.covStatus===r.status)),r.search&&(d=d.filter(e=>(e.name||``).toLowerCase().includes(r.search.toLowerCase())));let f=e=>{let t={full:{color:`#10b981`,bg:`#f0fdf4`,label:`Покрыт`},overlap:{color:`#6366f1`,bg:`#eef2ff`,label:`Пересечение`},partial:{color:`#f59e0b`,bg:`#fffbeb`,label:`Частично`},none:{color:`#ef4444`,bg:`#fef2f2`,label:`Не покрыт`}}[e]??{color:`#9ca3af`,bg:`#f9fafb`,label:`—`};return`<span style="font-size:10px;font-weight:600;
        color:${t.color};background:${t.bg};
        border-radius:5px;padding:2px 8px;white-space:nowrap">${t.label}</span>`},p=(e,t)=>`<span title="${t}" style="
        display:inline-flex;align-items:center;justify-content:center;
        width:30px;height:18px;border-radius:4px;
        font-size:9px;font-weight:700;letter-spacing:.02em;
        background:${e?`#eef2ff`:`#f9fafb`};
        color:${e?`#6366f1`:`#d1d5db`};
        border:1px solid ${e?`#c7d2fe`:`#e5e7eb`}">
        ${t}
      </span>`,m=d.map(e=>{let t=e.monthly_revenue?`$${Number(e.monthly_revenue).toLocaleString(`ru-RU`)}`:`—`;return`<tr>
        <td style="font-weight:600">${e.name||`—`}</td>
        <td style="font-size:12px;color:var(--text-muted)">${e.dach_region||`—`}</td>
        <td style="font-size:12px">${e.account_manager||`<span style="color:var(--text-muted)">—</span>`}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="cov-coord-name" data-cid="${e.id}"
                  style="font-size:12px;color:${e.coordinator?`var(--text-primary)`:`var(--text-muted)`}">
              ${e.coordinator||`—`}
            </span>
            <button class="pf-btn pf-btn-ghost cov-assign-btn" data-cid="${e.id}"
                    style="padding:2px 6px;font-size:11px">${H.edit}</button>
          </div>
        </td>
        <td style="font-size:12px;font-weight:600">${t}</td>
        <td style="white-space:nowrap">
          <div style="display:flex;gap:3px">
            ${p(e.hasCSM,`CSM`)}
            ${p(e.hasAM,`AM`)}
            ${p(e.hasCoord,`DC`)}
            ${p(e.hasSales,`SLS`)}
            ${p(e.hasDeliv,`DLV`)}
          </div>
        </td>
        <td>${f(e.covStatus)}</td>
      </tr>`}).join(``);n.innerHTML=`
      <div class="pf-cov-stats">
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val">${s}</div>
          <div class="pf-cov-stat-lbl">Всего клиентов</div>
        </div>
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val" style="color:#10b981">${c}</div>
          <div class="pf-cov-stat-lbl">Полностью покрыто
            <span style="color:#10b981;font-weight:600;margin-left:4px">
              ${s?Math.round(c/s*100):0}%
            </span>
          </div>
        </div>
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val" style="color:#ef4444">${l}</div>
          <div class="pf-cov-stat-lbl">Без покрытия
            <span style="color:#ef4444;font-weight:600;margin-left:4px">
              ${s?Math.round(l/s*100):0}%
            </span>
          </div>
        </div>
        <div class="pf-cov-stat">
          <div class="pf-cov-stat-val" style="color:#6366f1">${u}</div>
          <div class="pf-cov-stat-lbl">Пересечение ролей</div>
        </div>
      </div>

      <div class="pf-filters">
        <select class="pf-filter-select" id="cov-f-region">
          <option value="">Все регионы</option>
          ${i.map(e=>`<option value="${e}" ${r.region===e?`selected`:``}>${e}</option>`).join(``)}
        </select>
        <select class="pf-filter-select" id="cov-f-am">
          <option value="">Все AM</option>
          ${a.map(e=>`<option value="${e}" ${r.am===e?`selected`:``}>${e}</option>`).join(``)}
        </select>
        <select class="pf-filter-select" id="cov-f-status">
          <option value="">Все статусы</option>
          <option value="full"    ${r.status===`full`?`selected`:``}>Покрыт</option>
          <option value="overlap" ${r.status===`overlap`?`selected`:``}>Пересечение</option>
          <option value="partial" ${r.status===`partial`?`selected`:``}>Частично</option>
          <option value="none"    ${r.status===`none`?`selected`:``}>Не покрыт</option>
        </select>
        <input class="pf-filter-input" id="cov-f-search"
               placeholder="Поиск клиента..." value="${r.search}"
               style="flex:1;min-width:160px" />
        <button class="pf-btn pf-btn-secondary" id="cov-reset-btn">
          ${H.reset} Сбросить
        </button>
        <button class="pf-btn pf-btn-secondary" id="cov-export-btn">
          ${H.export} CSV
        </button>
      </div>

      <div class="pf-table-wrap" style="position:relative">
        <table class="pf-table">
          <thead><tr>
            <th>Клиент</th>
            <th>Регион</th>
            <th>AM</th>
            <th>Координатор</th>
            <th>Revenue</th>
            <th>Роли</th>
            <th>Покрытие</th>
          </tr></thead>
          <tbody>
            ${m||`<tr><td colspan="7"
              style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px">
              Нет клиентов по фильтру</td></tr>`}
          </tbody>
        </table>
        <div style="padding:10px 14px;font-size:11px;color:var(--text-muted);
                    border-top:1px solid var(--border)">
          Показано: ${d.length} из ${s}
        </div>

        <div class="cov-inline-dropdown hidden" id="cov-inline-dropdown"
             style="position:absolute;z-index:100;background:var(--surface);
                    border:1px solid var(--border);border-radius:10px;
                    padding:14px;width:260px;box-shadow:0 8px 24px rgba(0,0,0,.1)">
          <div style="display:flex;align-items:center;justify-content:space-between;
                      margin-bottom:10px">
            <span style="font-size:12px;font-weight:700">Назначить координатора</span>
            <button class="pf-btn pf-btn-ghost" id="cov-dd-close"
                    style="padding:2px">${H.close}</button>
          </div>
          <input class="pf-filter-input" id="cov-dd-input"
                 placeholder="Имя..." style="width:100%;box-sizing:border-box;
                 margin-bottom:8px" />
          <div id="cov-dd-suggestions"
               style="max-height:120px;overflow-y:auto;margin-bottom:8px"></div>
          <div style="display:flex;gap:6px">
            <button class="pf-btn pf-btn-primary" id="cov-dd-save"
                    style="flex:1;font-size:11px">Сохранить</button>
            <button class="pf-btn pf-btn-secondary" id="cov-dd-clear"
                    style="font-size:11px">Снять</button>
          </div>
        </div>
      </div>`,this._bindCoverageEvents(o)},_bindCoverageEvents(e){let t=()=>{this._coverageFilters.region=document.getElementById(`cov-f-region`)?.value||``,this._coverageFilters.am=document.getElementById(`cov-f-am`)?.value||``,this._coverageFilters.status=document.getElementById(`cov-f-status`)?.value||``,this._coverageFilters.search=document.getElementById(`cov-f-search`)?.value||``,this._renderCoverageContent(this._allClientsForCoverage)};[`cov-f-region`,`cov-f-am`,`cov-f-status`].forEach(e=>document.getElementById(e)?.addEventListener(`change`,t)),document.getElementById(`cov-f-search`)?.addEventListener(`input`,t),document.getElementById(`cov-reset-btn`)?.addEventListener(`click`,()=>{this._coverageFilters={region:``,am:``,status:``,search:``},this._renderCoverageContent(this._allClientsForCoverage)}),document.getElementById(`cov-export-btn`)?.addEventListener(`click`,()=>{this._exportCoverageCSV(e)});let n=null,r=document.getElementById(`cov-inline-dropdown`),i=document.getElementById(`cov-dd-input`),a=document.getElementById(`cov-dd-suggestions`),o=[...new Set((this._allClientsForCoverage||[]).map(e=>e.coordinator).filter(Boolean))].sort();document.querySelectorAll(`.cov-assign-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),n=e.dataset.cid;let s=this._allClientsForCoverage.find(e=>String(e.id)===String(n));i&&(i.value=s?.coordinator||``);let c=e.getBoundingClientRect(),l=document.getElementById(`main-content`),u=l.getBoundingClientRect();r.style.top=c.bottom-u.top+l.scrollTop+6+`px`,r.style.left=Math.min(c.left-u.left,u.width-280)+`px`,r.classList.remove(`hidden`),i?.focus(),this._updateSuggestions(i?.value||``,o,a,i)})}),i?.addEventListener(`input`,()=>this._updateSuggestions(i.value,o,a,i)),document.getElementById(`cov-dd-close`)?.addEventListener(`click`,()=>r?.classList.add(`hidden`)),document.getElementById(`cov-dd-save`)?.addEventListener(`click`,async()=>{!n||!i||(await this._saveCoordinator(n,i.value.trim()),r?.classList.add(`hidden`))}),document.getElementById(`cov-dd-clear`)?.addEventListener(`click`,async()=>{n&&(await this._saveCoordinator(n,``),r?.classList.add(`hidden`))}),document.addEventListener(`click`,e=>{r&&!r.contains(e.target)&&!e.target.closest(`.cov-assign-btn`)&&r.classList.add(`hidden`)},{once:!0})},_updateSuggestions(e,t,n,r){if(!n)return;let i=e.toLowerCase().trim(),a=i?t.filter(e=>e.toLowerCase().includes(i)):t.slice(0,8);if(!a.length){n.innerHTML=``;return}n.innerHTML=a.map(e=>`
      <div style="padding:6px 8px;border-radius:6px;cursor:pointer;
                  font-size:12px;transition:background .1s"
           onmouseover="this.style.background='#f1f5f9'"
           onmouseout="this.style.background='transparent'"
           data-val="${e}">${e}</div>`).join(``),n.querySelectorAll(`[data-val]`).forEach(e=>{e.addEventListener(`click`,()=>{r&&(r.value=e.dataset.val),n.innerHTML=``})})},async _saveCoordinator(e,t){try{let n=this._allClientsForCoverage.find(t=>String(t.id)===String(e));if(!n)return;await f._put(`tables/clients/${e}`,{coordinator:t}),f._clientsCache!==void 0&&(f._clientsCache=null),n.coordinator=t,window.App.toast(t?`Координатор «${t}» назначен`:`Координатор снят`,`success`);let r=document.querySelector(`.cov-coord-name[data-cid="${e}"]`);r&&(r.textContent=t||`—`,r.style.color=t?`var(--text-primary)`:`var(--text-muted)`),this._renderCoverageContent(this._allClientsForCoverage)}catch(e){window.App.toast(`Ошибка: `+e.message,`error`)}},_exportCoverageCSV(e){let t=this._coverageFilters,n=e;t.region&&(n=n.filter(e=>e.dach_region===t.region)),t.am&&(n=n.filter(e=>e.account_manager===t.am)),t.status&&(n=n.filter(e=>e.covStatus===t.status)),t.search&&(n=n.filter(e=>(e.name||``).toLowerCase().includes(t.search.toLowerCase())));let r={full:`Покрыт`,partial:`Частично`,overlap:`Пересечение`,none:`Не покрыт`},i=[[`Клиент`,`Регион`,`AM`,`Координатор`,`Revenue`,`Покрытие`].join(`;`),...n.map(e=>[`"${(e.name||``).replace(/"/g,`""`)}"`,e.dach_region||``,`"${(e.account_manager||``).replace(/"/g,`""`)}"`,`"${(e.coordinator||``).replace(/"/g,`""`)}"`,e.monthly_revenue||0,r[e.covStatus]||``].join(`;`))],a=new Blob([`﻿`+i.join(`
`)],{type:`text/csv;charset=utf-8`}),o=URL.createObjectURL(a),s=Object.assign(document.createElement(`a`),{href:o,download:`coverage_${new Date().toISOString().slice(0,10)}.csv`});document.body.appendChild(s),s.click(),setTimeout(()=>{URL.revokeObjectURL(o),s.remove()},1e3),window.App.toast(`CSV экспортирован`,`success`)}},U=`https://bchs-api.lexsnitko.workers.dev`;function W(e,t){return e.planned_hours!==null&&e.planned_hours!==void 0&&e.planned_hours!==``?Number(e.planned_hours):window.CalendarEngine?window.CalendarEngine.getPlannedHours(e.location||`BY`,t,e.allocation||1):Math.round(168*(e.allocation||1))}function ve(e,t){return W(e,t)*(e.rate_per_hour||0)}function ye(e){return(e.actual_hours||0)*(e.rate_per_hour||0)}function be(e,t){let n=W(e,t),r=e.actual_hours||0,i=e.rate_per_hour||0;if(window.CalendarEngine)return window.CalendarEngine.getDelta(n,r,i);let a=r-n,o=Math.round(a*i),s=n>0?r/n:0,c,l;return s>=.95?(c=`ok`,l=`В норме`):s>=.8?(c=`warning`,l=`Внимание`):(c=`critical`,l=`Критично`),{delta_hours:a,delta_money:o,efficiency:s,status:c,status_label:l}}function xe(e){return e.members.reduce((t,n)=>t+W(n,e.month),0)}function Se(e){return e.members.reduce((e,t)=>e+(t.actual_hours||0),0)}function Ce(e){return e.members.reduce((t,n)=>t+ve(n,e.month),0)}function we(e){return e.members.reduce((e,t)=>e+ye(t),0)}function Te(e){return Se(e)-xe(e)}function Ee(e){return Math.round(we(e)-Ce(e))}function De(e){let t=0,n=0;for(let r of e.members){let i=W(r,e.month),a=be(r,e.month);t+=i,n+=a.efficiency*i}return t>0?n/t:0}function Oe(e){let t=e.members.map(t=>be(t,e.month).status);return t.includes(`critical`)?`critical`:t.includes(`warning`)?`warning`:`ok`}function G(e,t){let n={USD:`$`,EUR:`€`,PLN:`zł`,GBP:`£`}[t]||`$`;return`${e<0?`-`:e>0?`+`:``}${n}${Math.abs(Math.round(e)).toLocaleString(`ru-RU`)}`}function ke(e){return e===0?`±0ч`:`${e>0?`+`:``}${e}ч`}function Ae(e){return{BY:`🇧🇾`,PL:`🇵🇱`,DE:`🇩🇪`,US:`🇺🇸`}[e]||`🌍`}function je(e){if(Array.isArray(e))return e;if(!e)return[];try{return JSON.parse(e)}catch{return[]}}function Me(e){return JSON.stringify(e||[])}function Ne(){return`mbr_`+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function K(e){if(!e)return``;let[t,n]=e.split(`-`).map(Number);return`${[`Январь`,`Февраль`,`Март`,`Апрель`,`Май`,`Июнь`,`Июль`,`Август`,`Сентябрь`,`Октябрь`,`Ноябрь`,`Декабрь`][n-1]} ${t}`}function Pe(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}`}function Fe(e,t){let[n,r]=e.split(`-`).map(Number),i=new Date(n,r-1+t,1);return`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,`0`)}`}var q={async getByClient(e){try{let t=await(await fetch(`${U}/tables/fte_entries?limit=200`)).json();return(Array.isArray(t.data)?t.data:Array.isArray(t)?t:[]).filter(t=>t.client_id===e).map(e=>({...e,members:je(e.members)}))}catch(e){return console.error(`[FteAPI.getByClient]`,e),[]}},async getByMonth(e,t){return(await this.getByClient(e)).find(e=>e.month===t)||null},async create(e){let t={...e,members:Me(e.members)},n=await(await fetch(`${U}/tables/fte_entries`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)})).json();return{...n,members:je(n.members)}},async update(e,t){let n={...t,members:Me(t.members)},r=await(await fetch(`${U}/tables/fte_entries/${e}`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)})).json();return{...r,members:je(r.members)}},async remove(e){await fetch(`${U}/tables/fte_entries/${e}`,{method:`DELETE`})}};window.DeliveryTab={clientId:null,activeMonth:null,entry:null,allEntries:[],async init(e){this.clientId=e,this.activeMonth=this.activeMonth||Pe(),await this._loadData(),this._render()},async _loadData(){try{this.allEntries=await q.getByClient(this.clientId),this.entry=this.allEntries.find(e=>e.month===this.activeMonth)||null}catch(e){console.error(`[DeliveryTab._loadData]`,e),this.allEntries=[],this.entry=null}},_render(){let e=document.getElementById(`delivery-tab-root`);e&&(e.innerHTML=this._buildHTML(),this._bindEvents())},_buildHTML(){return`
      <div class="dtab-wrap" id="delivery-tab-root">
        ${this._renderMonthNav()}
        ${this.entry?this._renderContent():this._renderEmpty()}
      </div>`},_renderMonthNav(){let e=Fe(this.activeMonth,-1),t=Fe(this.activeMonth,1);return`
      <nav class="dtab-month-nav" aria-label="Навигация по месяцам">
        <button class="dtab-nav-arrow" data-ym="${e}" title="Предыдущий месяц">◀</button>
        <div class="dtab-month-list">${[-2,-1,0,1,2].map(e=>Fe(this.activeMonth,e)).map(e=>{let t=e===this.activeMonth,n=this.allEntries.some(t=>t.month===e);return`
        <button class="dtab-month-btn${t?` active`:``}${n?` has-data`:``}"
                data-ym="${e}"
                title="${n?`Есть данные`:`Нет данных`}">
          ${K(e)}
          ${n?`<span class="dtab-month-dot"></span>`:``}
        </button>`}).join(``)}</div>
        <button class="dtab-nav-arrow" data-ym="${t}" title="Следующий месяц">▶</button>
      </nav>`},_renderEmpty(){return`
      <div class="dtab-empty">
        <div class="dtab-empty-icon">👥</div>
        <div class="dtab-empty-title">Нет данных за ${K(this.activeMonth)}</div>
        <p class="dtab-empty-text">
          Добавьте команду проекта<br>чтобы отслеживать утилизацию
        </p>
        <button class="btn btn-primary" id="dtab-btn-add-team">+ Добавить команду</button>
      </div>`},_renderKPI(){let e=this.entry,t=e.members.reduce((e,t)=>e+(t.allocation||1),0),n=xe(e),r=Se(e),i=Ce(e),a=we(e),o=De(e),s=Oe(e),c=Math.round(o*100),l=e.members[0]?.currency||`USD`,u={ok:{icon:`🟢`,label:`В норме`},warning:{icon:`🟡`,label:`Внимание`},critical:{icon:`🔴`,label:`Критично`}},d=u[s]||u.ok;return`
      <div class="dtab-kpi-row">
        <div class="dtab-kpi-card">
          <div class="dtab-kpi-icon">👥</div>
          <div class="dtab-kpi-val">${t.toFixed(1)}</div>
          <div class="dtab-kpi-label">FTE человек</div>
        </div>
        <div class="dtab-kpi-card">
          <div class="dtab-kpi-icon">⏱</div>
          <div class="dtab-kpi-val">
            ${r} <span class="dtab-kpi-sub">/ ${n}</span>
          </div>
          <div class="dtab-kpi-label">факт / план ч</div>
        </div>
        <div class="dtab-kpi-card">
          <div class="dtab-kpi-icon">💰</div>
          <div class="dtab-kpi-val">
            ${G(a,l).replace(/^\+/,``)}
          </div>
          <div class="dtab-kpi-label">
            факт / ${G(i,l).replace(/^\+/,``)}
          </div>
        </div>
        <div class="dtab-kpi-card dtab-kpi-card--${s}">
          <div class="dtab-kpi-icon">📊</div>
          <div class="dtab-kpi-val">${c}%</div>
          <div class="dtab-kpi-label">${d.icon} ${d.label}</div>
        </div>
      </div>`},_renderTable(){return`
      <div class="dtab-table-wrap">
        <div style="overflow-x:auto">
          <table class="dtab-table">
            <thead>
              <tr>
                <th class="dtab-th">Сотрудник</th>
                <th class="dtab-th">Роль</th>
                <th class="dtab-th">Локация</th>
                <th class="dtab-th dtab-th--num">Аллокация</th>
                <th class="dtab-th dtab-th--num">План ч</th>
                <th class="dtab-th dtab-th--num">Факт ч</th>
                <th class="dtab-th dtab-th--num">Δ часов</th>
                <th class="dtab-th dtab-th--num">Δ деньги</th>
                <th class="dtab-th dtab-th--center">Статус</th>
                <th class="dtab-th"></th>
              </tr>
            </thead>
            <tbody>${this.entry.members.map((e,t)=>this._renderMemberRow(e,t)).join(``)}</tbody>
            <tfoot>${this._renderTotalsRow()}</tfoot>
          </table>
        </div>
      </div>`},_renderMemberRow(e,t){let n=W(e,this.entry.month),r=be(e,this.entry.month),i=ve(e,this.entry.month),a=ye(e)-i,o=Math.round((e.allocation||1)*100)+`%`,s={ok:`🟢`,warning:`🟡`,critical:`🔴`}[r.status]||`⚪`,c=e.note?`title="${e.note.replace(/"/g,`&quot;`)}"`:``;return`
      <tr class="dtab-row dtab-row--${r.status}" data-idx="${t}" ${c}>
        <td class="dtab-td dtab-td--name">
          <button class="dtab-name-btn"
                  data-action="edit-member" data-idx="${t}">
            ${e.name||`—`}
          </button>
          ${e.note?`<span class="dtab-note-icon" title="${e.note}">📝</span>`:``}
        </td>
        <td class="dtab-td">${e.role||`—`}</td>
        <td class="dtab-td">
          <span class="dtab-loc-chip">
            ${Ae(e.location)} ${e.location||`—`}
          </span>
        </td>
        <td class="dtab-td dtab-td--num">${o}</td>
        <td class="dtab-td dtab-td--num">${n}ч</td>
        <td class="dtab-td dtab-td--num">${e.actual_hours||0}ч</td>
        <td class="dtab-td dtab-td--num dtab-delta
            ${r.delta_hours<0?`dtab-delta--neg`:r.delta_hours>0?`dtab-delta--pos`:``}">
          ${ke(r.delta_hours)}
        </td>
        <td class="dtab-td dtab-td--num dtab-delta
            ${a<0?`dtab-delta--neg`:a>0?`dtab-delta--pos`:``}">
          ${G(a,e.currency)}
        </td>
        <td class="dtab-td dtab-td--center">
          <span class="dtab-status-icon"
                title="${r.status_label}">${s}</span>
        </td>
        <td class="dtab-td dtab-td--actions">
          <button class="btn btn-ghost btn-xs"
                  data-action="delete-member"
                  data-idx="${t}"
                  title="Удалить">✕</button>
        </td>
      </tr>`},_renderTotalsRow(){let e=this.entry,t=e.members.reduce((e,t)=>e+(t.allocation||1),0).toFixed(1),n=xe(e),r=Se(e),i=Te(e),a=Ee(e),o=Oe(e),s=e.members[0]?.currency||`USD`,c={ok:`🟢`,warning:`🟡`,critical:`🔴`}[o]||`⚪`;return`
      <tr class="dtab-totals-row">
        <td class="dtab-td dtab-td--totals" colspan="3">ИТОГО</td>
        <td class="dtab-td dtab-td--num dtab-td--totals">${t} FTE</td>
        <td class="dtab-td dtab-td--num dtab-td--totals">${n}ч</td>
        <td class="dtab-td dtab-td--num dtab-td--totals">${r}ч</td>
        <td class="dtab-td dtab-td--num dtab-td--totals dtab-delta
            ${i<0?`dtab-delta--neg`:i>0?`dtab-delta--pos`:``}">
          ${ke(i)}
        </td>
        <td class="dtab-td dtab-td--num dtab-td--totals dtab-delta
            ${a<0?`dtab-delta--neg`:a>0?`dtab-delta--pos`:``}">
          ${G(a,s)}
        </td>
        <td class="dtab-td dtab-td--center dtab-td--totals">${c}</td>
        <td class="dtab-td dtab-td--totals"></td>
      </tr>`},_renderChart(){let e=new Date,t=[];for(let n=5;n>=0;n--){let r=new Date(e.getFullYear(),e.getMonth()-n,1),i=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,`0`)}`,a=this.allEntries.find(e=>e.month===i),o=0,s=0,c=null;if(a&&a.members.length>0){o=a.members.reduce((e,t)=>e+(t.allocation||1),0);let e=0,t=0,n=0,r=0;for(let o of a.members){let a=o.allocation||1,s=W(o,i),c=o.actual_hours||0,l=s>0?c/s:0;e+=a,t+=(o.rate_per_hour||0)*a,n+=s,r+=l*s}s=e>0?t/e:0,c=n>0?r/n:null}t.push({ym:i,fte:o,avg_rate:s,efficiency:c,label:K(i)})}if(!t.some(e=>e.fte>0||e.avg_rate>0))return`
        <div class="dtab-chart-wrap">
          <div class="dtab-chart-title">📊 Динамика FTE и среднего рейта</div>
          <div class="dtab-chart-empty">Нет данных за последние 6 месяцев</div>
        </div>`;let n=556/(t.length-1||1),r=t.map(e=>e.fte),i=Math.max(...r,1)||1,a=t.map(e=>e.avg_rate),o=Math.max(...a,1)||1,s=t.map((e,t)=>({x:52+t*n,y:216-e.fte/i*192,val:e.fte,ym:e.ym,label:e.label})),c=t.map((e,t)=>({x:52+t*n,y:216-e.avg_rate/o*192,val:e.avg_rate,ym:e.ym,label:e.label})),l=s.map(e=>`${e.x},${e.y}`).join(` `),u=c.map(e=>`${e.x},${e.y}`).join(` `),d=`52,216 `+s.map(e=>`${e.x},${e.y}`).join(` `)+` 608,216`,f=[.25,.5,.75,1].map(e=>{let t=24+192*(1-e),n=(i*e).toFixed(1),r=(o*e).toFixed(0);return`
        <line x1="52" y1="${t}" x2="608" y2="${t}"
              class="dtab-chart-grid"/>
        <text x="46" y="${t+4}"
              class="dtab-chart-axis-label dtab-chart-axis-left">${n}</text>
        <text x="614" y="${t+4}"
              class="dtab-chart-axis-label dtab-chart-axis-right">$${r}</text>`}).join(``),p=t.map((e,t)=>{let r=52+t*n,i=e.label.split(` `);return`<text x="${r}" y="252"
                    class="dtab-chart-x-label">${i[0].slice(0,3)+(i[1]?` '`+String(i[1]).slice(2):``)}</text>`}).join(``),m=s.map((e,n)=>{let r=t[n].efficiency,i=r===null?`—`:Math.round(r*100)+`%`;return`<circle cx="${e.x}" cy="${e.y}" r="5"
        class="dtab-chart-dot dtab-chart-dot--fte"
        data-ym="${e.ym}" data-label="${e.label}"
        data-fte="${e.val.toFixed(1)}"
        data-rate="${c[n].val.toFixed(1)}"
        data-eff="${i}"
        tabindex="0" role="button"
        aria-label="${e.label}: FTE ${e.val.toFixed(1)}"/>`}).join(``);return`
      <div class="dtab-chart-wrap">
        <div class="dtab-chart-title">
          📊 Динамика FTE и среднего рейта — последние 6 месяцев
        </div>
        <div class="dtab-chart-inner" style="position:relative">
          <svg viewBox="0 0 660 260" class="dtab-chart-svg"
               aria-label="Dual-axis chart: FTE и средний рейт">
            <defs>
              <linearGradient id="fte-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#3b82f6" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <line x1="52" y1="216"
                  x2="608" y2="216"
                  class="dtab-chart-axis"/>
            ${f}
            ${p}
            <polygon points="${d}" fill="url(#fte-area-grad)"/>
            <polyline points="${l}"
                      class="dtab-chart-line dtab-chart-line--fte" fill="none"/>
            <polyline points="${u}"
                      class="dtab-chart-line dtab-chart-line--rate" fill="none"/>
            ${c.map((e,n)=>{let r=t[n].efficiency,i=r===null?`—`:Math.round(r*100)+`%`;return`<circle cx="${e.x}" cy="${e.y}" r="5"
        class="dtab-chart-dot dtab-chart-dot--rate"
        data-ym="${e.ym}" data-label="${e.label}"
        data-fte="${s[n].val.toFixed(1)}"
        data-rate="${e.val.toFixed(1)}"
        data-eff="${i}"
        tabindex="0" role="button"
        aria-label="${e.label}: Рейт $${e.val.toFixed(0)}"/>`}).join(``)}
            ${m}
            <text x="44" y="16"
                  class="dtab-chart-axis-title dtab-chart-axis-title--left">FTE</text>
            <text x="656" y="16"
                  class="dtab-chart-axis-title dtab-chart-axis-title--right">$/ч</text>
          </svg>
          <div class="dtab-chart-tooltip" id="dtab-svg-tooltip"
               role="tooltip" aria-live="polite"></div>
        </div>
        <div class="dtab-chart-legend">
          <span class="dtab-chart-legend-item dtab-chart-legend-item--fte">
            <svg width="18" height="10">
              <line x1="0" y1="5" x2="18" y2="5"
                    stroke="#3b82f6" stroke-width="2.5"/>
              <circle cx="9" cy="5" r="4" fill="#3b82f6"/>
            </svg>
            FTE (левая ось)
          </span>
          <span class="dtab-chart-legend-item dtab-chart-legend-item--rate">
            <svg width="18" height="10">
              <line x1="0" y1="5" x2="18" y2="5"
                    stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,2"/>
              <circle cx="9" cy="5" r="4" fill="#f59e0b"/>
            </svg>
            Средний рейт $ (правая ось)
          </span>
        </div>
      </div>`},_bindChartEvents(){let e=document.getElementById(`dtab-svg-tooltip`);e&&document.querySelectorAll(`.dtab-chart-dot`).forEach(t=>{let n=()=>{e.innerHTML=`
          <div class="dtab-tt-month">${t.dataset.label}</div>
          <div class="dtab-tt-row">
            <span class="dtab-tt-key">FTE</span>
            <span class="dtab-tt-val">${t.dataset.fte}</span>
          </div>
          <div class="dtab-tt-row">
            <span class="dtab-tt-key">Рейт</span>
            <span class="dtab-tt-val">$${parseFloat(t.dataset.rate).toFixed(1)}/ч</span>
          </div>
          <div class="dtab-tt-row">
            <span class="dtab-tt-key">Эффективность</span>
            <span class="dtab-tt-val">${t.dataset.eff}</span>
          </div>`;let n=t.closest(`svg`)?.getBoundingClientRect(),r=t.getBoundingClientRect();n&&(e.style.left=`${r.left-n.left+r.width/2}px`,e.style.top=`${r.top-n.top-8}px`,e.style.display=`block`)},r=()=>{e.style.display=`none`};t.addEventListener(`mouseenter`,n),t.addEventListener(`focus`,n),t.addEventListener(`mouseleave`,r),t.addEventListener(`blur`,r),t.addEventListener(`click`,n)})},_renderActions(){return`
      <div class="dtab-actions">
        <button class="btn btn-primary btn-sm" id="dtab-btn-add-member">
          + Добавить сотрудника
        </button>
        <button class="btn btn-secondary btn-sm" id="dtab-btn-edit-entry">
          ✏️ Редактировать
        </button>
        <button class="btn btn-danger btn-sm" id="dtab-btn-delete-entry">
          🗑 Удалить месяц
        </button>
      </div>`},_renderContent(){return`
      ${this._renderKPI()}
      ${this._renderTable()}
      ${this._renderChart()}
      ${this._renderActions()}`},_bindEvents(){this._bindMonthNav(),this._bindActions(),this._bindTableActions(),this._bindChartEvents()},_bindMonthNav(){document.querySelectorAll(`.dtab-month-btn, .dtab-nav-arrow`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.ym;t&&(this.activeMonth=t,await this._loadData(),this._render())})})},_bindActions(){document.getElementById(`dtab-btn-add-team`)?.addEventListener(`click`,()=>this._openModal(null,!0)),document.getElementById(`dtab-btn-add-member`)?.addEventListener(`click`,()=>this._openModal(null,!1)),document.getElementById(`dtab-btn-edit-entry`)?.addEventListener(`click`,()=>this._openModal(this.entry,!0)),document.getElementById(`dtab-btn-delete-entry`)?.addEventListener(`click`,()=>this._deleteEntry())},_bindTableActions(){document.querySelectorAll(`[data-action="edit-member"]`).forEach(e=>{e.addEventListener(`click`,()=>this._openMemberEditRow(parseInt(e.dataset.idx)))}),document.querySelectorAll(`[data-action="delete-member"]`).forEach(e=>{e.addEventListener(`click`,()=>this._deleteMember(parseInt(e.dataset.idx)))})},_openMemberEditRow(e){let t=this.entry.members[e];if(!t)return;let n=document.querySelector(`tr.dtab-row[data-idx="${e}"]`);if(!n)return;document.getElementById(`dtab-inline-form`)?.remove();let r=document.createElement(`tr`);r.id=`dtab-inline-form`,r.innerHTML=`
      <td colspan="10" class="dtab-inline-td">
        <div class="dtab-inline-form">
          <div class="dtab-inline-grid">
            <div class="dtab-fg">
              <label class="dtab-flabel">Имя</label>
              <input class="form-input dtab-fi" id="dif-name"
                     value="${t.name||``}" placeholder="Иван Петров" required />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Роль</label>
              <input class="form-input dtab-fi" id="dif-role"
                     value="${t.role||``}" placeholder="Developer" />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Локация</label>
              <select class="form-select dtab-fi" id="dif-location">
                ${this._buildLocOptions(t.location)}
              </select>
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Аллокация</label>
              <select class="form-select dtab-fi" id="dif-allocation">
                ${this._buildAllocOptions(t.allocation)}
              </select>
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Рейт/ч</label>
              <input class="form-input dtab-fi" id="dif-rate"
                     type="number" min="0"
                     value="${t.rate_per_hour||``}" placeholder="45" />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">Валюта</label>
              <select class="form-select dtab-fi" id="dif-currency">
                ${this._buildCurrOptions(t.currency)}
              </select>
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">
                План ч <span class="dtab-flabel-hint">(авто)</span>
              </label>
              <input class="form-input dtab-fi" id="dif-planned"
                     type="number" min="0"
                     value="${t.planned_hours==null?``:t.planned_hours}"
                     placeholder="Авто" />
            </div>
            <div class="dtab-fg">
              <label class="dtab-flabel">
                Факт ч <span class="dtab-req">*</span>
              </label>
              <input class="form-input dtab-fi" id="dif-actual"
                     type="number" min="0"
                     value="${t.actual_hours||``}" placeholder="152" required />
            </div>
            <div class="dtab-fg dtab-fg--wide">
              <label class="dtab-flabel">Заметка</label>
              <input class="form-input dtab-fi" id="dif-note"
                     value="${t.note||``}" placeholder="Был в отпуске 3 дня" />
            </div>
          </div>
          <div class="dtab-inline-actions">
            <button class="btn btn-primary btn-sm" id="dif-save-btn">✓ Сохранить</button>
            <button class="btn btn-ghost btn-sm"   id="dif-cancel-btn">Отмена</button>
          </div>
        </div>
      </td>`,n.insertAdjacentElement(`afterend`,r),document.getElementById(`dif-cancel-btn`).addEventListener(`click`,()=>r.remove()),document.getElementById(`dif-save-btn`).addEventListener(`click`,()=>this._saveMemberFromInline(e))},async _saveMemberFromInline(e){let t=document.getElementById(`dif-name`)?.value?.trim(),n=parseFloat(document.getElementById(`dif-actual`)?.value);if(!t){window.App.toast(`⚠️ Укажите имя`,`error`);return}if(isNaN(n)){window.App.toast(`⚠️ Укажите фактические часы`,`error`);return}let r=document.getElementById(`dif-planned`)?.value,i=r!==``&&!isNaN(parseFloat(r))?parseFloat(r):null;this.entry.members[e]={...this.entry.members[e],name:t,role:document.getElementById(`dif-role`)?.value?.trim()||``,location:document.getElementById(`dif-location`)?.value||`BY`,allocation:parseFloat(document.getElementById(`dif-allocation`)?.value)||1,rate_per_hour:parseFloat(document.getElementById(`dif-rate`)?.value)||0,currency:document.getElementById(`dif-currency`)?.value||`USD`,planned_hours:i,actual_hours:n,note:document.getElementById(`dif-note`)?.value?.trim()||``},await this._saveEntry()},_openModal(e,t){let n=K(this.activeMonth),r=t&&e?e.members:[];window.App.openModal(`
      <div class="dtab-modal-wrap">
        <h2 class="modal-title">👥 Команда проекта — ${n}</h2>
        <div id="dtab-members-container">
          ${r.length>0?r.map((e,t)=>this._buildMemberBlock(t,e)).join(``):this._buildMemberBlock(0,null)}
        </div>
        <button class="btn btn-ghost btn-sm"
                id="dtab-modal-add-more"
                style="margin-top:8px">
          + Добавить ещё одного
        </button>
        <div class="modal-actions" style="margin-top:20px">
          <button class="btn btn-primary" id="dtab-modal-save-btn">
            💾 Сохранить
          </button>
          <button class="btn btn-ghost"
                  onclick="window.App.closeModal()">Отмена</button>
        </div>
      </div>`),this._bindModal(e)},_buildMemberBlock(e,t){return`
      <div class="dtab-member-block" data-block-idx="${e}">
        <div class="dtab-member-block-header">
          <span class="dtab-member-num">👤 Сотрудник ${e+1}</span>
          ${e>0?`<button class="btn btn-ghost btn-xs dtab-remove-block"
                       data-block-idx="${e}" title="Убрать">✕</button>`:``}
        </div>
        <div class="dtab-modal-grid">
          <div class="dtab-fg">
            <label class="dtab-flabel">
              Имя <span class="dtab-req">*</span>
            </label>
            <input class="form-input" name="m_name"
                   value="${t?.name||``}" placeholder="Иван Петров" required />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Роль</label>
            <input class="form-input" name="m_role"
                   value="${t?.role||``}" placeholder="Developer, PM, QA..." />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Локация</label>
            <select class="form-select" name="m_location">
              ${this._buildLocOptions(t?.location)}
            </select>
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Аллокация</label>
            <select class="form-select" name="m_allocation">
              ${this._buildAllocOptions(t?.allocation)}
            </select>
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Рейт в час</label>
            <input class="form-input" name="m_rate" type="number" min="0"
                   value="${t?.rate_per_hour||``}" placeholder="45" />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">Валюта</label>
            <select class="form-select" name="m_currency">
              ${this._buildCurrOptions(t?.currency)}
            </select>
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">
              Плановые ч
              <span class="dtab-flabel-hint">(авто)</span>
            </label>
            <input class="form-input" name="m_planned" type="number" min="0"
                   value="${t?.planned_hours==null?``:t.planned_hours}"
                   placeholder="Авто (из календаря)" />
          </div>
          <div class="dtab-fg">
            <label class="dtab-flabel">
              Фактические ч <span class="dtab-req">*</span>
            </label>
            <input class="form-input" name="m_actual" type="number" min="0"
                   value="${t?.actual_hours||``}" placeholder="152" required />
          </div>
          <div class="dtab-fg dtab-fg--wide">
            <label class="dtab-flabel">Заметка</label>
            <input class="form-input" name="m_note"
                   value="${t?.note||``}"
                   placeholder="Был в отпуске 3 дня" />
          </div>
        </div>
      </div>`},_bindModal(e){let t=document.querySelectorAll(`.dtab-member-block`).length;document.getElementById(`dtab-modal-add-more`)?.addEventListener(`click`,()=>{let e=document.getElementById(`dtab-members-container`),n=document.createElement(`div`);n.innerHTML=this._buildMemberBlock(t,null),e.appendChild(n.firstElementChild),t++,n.firstElementChild?.querySelector(`.dtab-remove-block`)?.addEventListener(`click`,e=>e.target.closest(`.dtab-member-block`).remove())}),document.querySelectorAll(`.dtab-remove-block`).forEach(e=>{e.addEventListener(`click`,e=>e.target.closest(`.dtab-member-block`).remove())}),document.getElementById(`dtab-modal-save-btn`)?.addEventListener(`click`,()=>this._saveFromModal(e))},async _saveFromModal(e){let t=document.querySelectorAll(`.dtab-member-block`),n=[],r=!1;if(t.forEach((t,i)=>{let a=e=>t.querySelector(`[name="${e}"]`)?.value?.trim()||``,o=e=>parseFloat(t.querySelector(`[name="${e}"]`)?.value)||0,s=a(`m_name`),c=parseFloat(t.querySelector(`[name="m_actual"]`)?.value);if(!s){window.App.toast(`⚠️ Сотрудник ${i+1}: укажите имя`,`error`),r=!0;return}if(isNaN(c)){window.App.toast(`⚠️ ${s}: укажите фактические часы`,`error`),r=!0;return}let l=t.querySelector(`[name="m_planned"]`)?.value,u=l!==``&&!isNaN(parseFloat(l))?parseFloat(l):null,d=e?.members?.[i];n.push({id:d?.id||Ne(),name:s,role:a(`m_role`),location:a(`m_location`)||`BY`,allocation:parseFloat(t.querySelector(`[name="m_allocation"]`)?.value)||1,rate_per_hour:o(`m_rate`),currency:a(`m_currency`)||`USD`,planned_hours:u,actual_hours:c,note:a(`m_note`)})}),r||n.length===0)return;let i=document.getElementById(`dtab-modal-save-btn`);i&&(i.disabled=!0,i.textContent=`⏳ Сохраняю...`);try{let t=new Date().toISOString().slice(0,10);e?this.entry=await q.update(e.id,{...e,members:n,updated_at:t}):(this.entry=await q.create({client_id:this.clientId,month:this.activeMonth,members:n,created_at:t,updated_at:t}),this.allEntries.push(this.entry)),window.App.closeModal(),window.App.toast(`✅ Команда сохранена`,`success`),this._render()}catch(e){console.error(`[DeliveryTab._saveFromModal]`,e),window.App.toast(`❌ Ошибка сохранения`,`error`),i&&(i.disabled=!1,i.textContent=`💾 Сохранить`)}},async _saveEntry(){try{this.entry=await q.update(this.entry.id,{...this.entry,updated_at:new Date().toISOString().slice(0,10)}),window.App.toast(`✅ Сохранено`,`success`),this._render()}catch(e){console.error(`[DeliveryTab._saveEntry]`,e),window.App.toast(`❌ Ошибка сохранения`,`error`)}},async _deleteMember(e){let t=this.entry.members[e]?.name;if(confirm(`Удалить сотрудника «${t}»?`))if(this.entry.members.splice(e,1),this.entry.members.length===0){let e=this.entry.id;await q.remove(e),this.allEntries=this.allEntries.filter(t=>t.id!==e),this.entry=null,this._render()}else await this._saveEntry()},async _deleteEntry(){let e=K(this.activeMonth);if(confirm(`Удалить все данные команды за ${e}?`))try{let t=this.entry.id;await q.remove(t),this.allEntries=this.allEntries.filter(e=>e.id!==t),this.entry=null,window.App.toast(`🗑 Данные за ${e} удалены`,``),this._render()}catch{window.App.toast(`❌ Ошибка удаления`,`error`)}},_buildLocOptions(e){return(window.CalendarEngine?window.CalendarEngine.getLocations():[{id:`BY`,name:`Беларусь`,flag:`🇧🇾`},{id:`PL`,name:`Польша`,flag:`🇵🇱`},{id:`DE`,name:`Германия`,flag:`🇩🇪`},{id:`US`,name:`США`,flag:`🇺🇸`}]).map(t=>`<option value="${t.id}" ${t.id===e?`selected`:``}>
        ${t.flag} ${t.name} (${t.id})
      </option>`).join(``)},_buildAllocOptions(e){let t=e===void 0?1:e;return u.map(e=>`<option value="${e.val}" ${e.val===t?`selected`:``}>${e.label}</option>`).join(``)},_buildCurrOptions(e){let t=e||`USD`;return l.map(e=>`<option value="${e}" ${e===t?`selected`:``}>${e}</option>`).join(``)}},window.FteAPI=q;var J={DEFAULTS:{drift:1.2,volatility:4.5,mean_reversion:.15,equilibrium:50,p_strategic_meeting:.35,impact_strategic_meeting:8,p_upsell:.08,impact_upsell_mr:2500,p_fast_response:.45,impact_fast_response:3,p_escalation:.12,impact_escalation:-10,p_complaint:.18,impact_complaint:-6,p_churn:.025,p_mr_downgrade:.06,impact_mr_downgrade:-1200,monthly_revenue:5e3},CATEGORIES:[{key:`champion`,label:`🏆 Champion`,min:70,color:`#059669`},{key:`promoter`,label:`⭐ Promoter`,min:50,color:`#10b981`},{key:`passive`,label:`😐 Passive`,min:30,color:`#6b7280`},{key:`at_risk`,label:`⚠️ At Risk`,min:15,color:`#f59e0b`},{key:`detractor`,label:`🔴 Detractor`,min:.01,color:`#ef4444`},{key:`churned`,label:`💀 Churned`,min:-1,color:`#111827`}],_randn(){let e,t;do e=Math.random();while(e===0);do t=Math.random();while(t===0);return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*t)},_classify(e,t){return t?`churned`:e>=70?`champion`:e>=50?`promoter`:e>=30?`passive`:e>=15?`at_risk`:`detractor`},_runBatch(e,t,n,r,i){let a=Array(e),o=Array.from({length:t+1},()=>new Float32Array(e));for(let t=0;t<e;t++)o[0][t]=n;for(let s=0;s<e;s++){let e=n,c=r,l=!1;for(let n=0;n<t;n++){if(l){o[n+1][s]=0;continue}let t=i.mean_reversion*(i.equilibrium-e),r=this._randn()*i.volatility,a=i.drift+t+r;if(Math.random()<i.p_strategic_meeting&&(a+=i.impact_strategic_meeting),Math.random()<i.p_fast_response&&(a+=i.impact_fast_response),Math.random()<i.p_escalation&&(a+=i.impact_escalation),Math.random()<i.p_complaint&&(a+=i.impact_complaint),Math.random()<i.p_upsell&&(c+=i.impact_upsell_mr),Math.random()<i.p_mr_downgrade&&(c+=i.impact_mr_downgrade),Math.random()<i.p_churn){c=0,e=0,l=!0,o[n+1][s]=0;continue}e=Math.max(0,Math.min(100,e+a)),c=Math.max(0,c),o[n+1][s]=e}a[s]={bchs:e,mr:c,churned:l}}return{endStates:a,paths:o}},_pct(e,t){return e[Math.min(Math.floor(t/100*e.length),e.length-1)]},_summarise(e,t){let n=e.length,r=e.map(e=>e.bchs).sort((e,t)=>e-t),i=e.map(e=>e.mr).sort((e,t)=>e-t),a=e.filter(e=>e.churned).length,o=r.reduce((e,t)=>e+t,0)/n,s=i.reduce((e,t)=>e+t,0)/n,c={champion:0,promoter:0,passive:0,at_risk:0,detractor:0,churned:0};for(let t of e)c[this._classify(t.bchs,t.churned)]++;let l={};for(let e of Object.keys(c))l[e]=Math.round(c[e]/n*1e3)/10;return{bchs:{p10:Math.round(this._pct(r,10)*10)/10,p25:Math.round(this._pct(r,25)*10)/10,median:Math.round(this._pct(r,50)*10)/10,p75:Math.round(this._pct(r,75)*10)/10,p90:Math.round(this._pct(r,90)*10)/10,mean:Math.round(o*10)/10},mr:{p10:Math.round(this._pct(i,10)),p25:Math.round(this._pct(i,25)),median:Math.round(this._pct(i,50)),p75:Math.round(this._pct(i,75)),p90:Math.round(this._pct(i,90)),mean:Math.round(s)},churn_rate:Math.round(a/n*1e3)/10,churn_count:a,categories:l,n}},_fanPath(e,t){return e.map((e,n)=>{let r=Array.from(e).sort((e,t)=>e-t);return{month:t+n,p10:Math.round(this._pct(r,10)*10)/10,p25:Math.round(this._pct(r,25)*10)/10,median:Math.round(this._pct(r,50)*10)/10,p75:Math.round(this._pct(r,75)*10)/10,p90:Math.round(this._pct(r,90)*10)/10}})},run(e,t){let n=5e3,r=Object.assign({},this.DEFAULTS,t||{}),i=e==null?50:Math.max(0,Math.min(100,Math.round(e*10)/10)),a=r.monthly_revenue||this.DEFAULTS.monthly_revenue,o=this._runBatch(n,3,i,a,r),s=this._summarise(o.endStates,a),c=this._fanPath(o.paths,0),l=this._runBatch(n,3,s.bchs.median,s.mr.median,r),u=this._summarise(l.endStates,s.mr.median),d=this._fanPath(l.paths,3),f=this._runBatch(n,6,u.bchs.median,u.mr.median,r),p=this._summarise(f.endStates,u.mr.median),m=this._fanPath(f.paths,6);return{current_bchs_scaled:i,current_mr:a,n_scenarios:n,horizons:{"3m":s,"6m":u,"12m":p},fan_chart:[...c,...d.slice(1),...m.slice(1)]}}};window.MCEngine=J;var Y=`https://bchs-api.lexsnitko.workers.dev`;window.MCPage={_cfgCache:{},async getConfig(e){if(this._cfgCache[e])return this._cfgCache[e];try{let t=await fetch(`${Y}/tables/mc_configs?limit=500`);if(!t.ok)return null;let n=await t.json(),r=(Array.isArray(n.data)?n.data:Array.isArray(n)?n:[]).find(t=>String(t.client_id)===String(e));return r&&(this._cfgCache[e]=r),r??null}catch{return null}},async saveConfig(e,t){delete this._cfgCache[e];let n=await this.getConfig(e),r={client_id:e,...t};[`id`,`gs_project_id`,`gs_table_name`,`created_at`,`updated_at`].forEach(e=>delete r[e]);try{let t=n?`${Y}/tables/mc_configs/${n.id}`:`${Y}/tables/mc_configs`,i=await(await fetch(t,{method:n?`PUT`:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(r)})).json();return this._cfgCache[e]=i,i}catch(e){return console.error(`[MCPage.saveConfig]`,e),null}},client:null,bchs_raw:null,cfg:null,result:null,advice:null,activeHorizon:`3m`,configOpen:!1,fanChart:null,async mount(e,t){this.client=e,this.bchs_raw=t,this.result=null,this.advice=null,this.activeHorizon=`3m`,this.configOpen=!1,this.fanChart&&=(this.fanChart.destroy(),null);let n=document.getElementById(`mc-tab-content`);if(!n)return;let r=await this.getConfig(e.id);this.cfg=Object.assign({},J.DEFAULTS,{monthly_revenue:e.monthly_revenue||5e3},r||{}),this._renderShell(n);let i=await this._loadSnapshot();if(i){this.result={horizons:i.horizons,fan_chart:null},this.advice=i.advice,this._lastSnapshot=i;let e=document.getElementById(`mc-output`),t=document.getElementById(`mc-nodata`);e&&(e.classList.remove(`hidden`),this._renderOutput(e)),setTimeout(()=>{let e=document.querySelector(`.mc-advice-risk-chip`);if(e){let t={low:`Низкий риск`,medium:`Средний риск`,high:`Высокий риск`,critical:`Критический`},n=this._riskForHorizon(this.activeHorizon||`3m`);e.textContent=t[n],e.className=`mc-advice-risk-chip `+n}},150),t&&t.classList.add(`hidden`);let n=document.getElementById(`mc-bl-signals`);n&&i.ts&&(n.textContent=`Кеш от `+new Date(i.ts).toLocaleDateString(`ru-RU`)+` · Нажмите ↻ для обновления`,n.style.color=`#9ca3af`)}else await this._runAndRender()},async _loadSnapshot(){if(this._lastSnapshot?.horizons)return this._lastSnapshot;if(!this.client?.id)return null;try{let e=await fetch(`${Y}/mc/snapshot?client_id=${this.client.id}`);if(!e.ok)return null;let t=await e.json();return t.data?.horizons?t.data:null}catch{return null}},_renderShell(e){e.innerHTML=`
      <div class="mc-header">
        <div>
          <div class="mc-title">Monte Carlo Прогноз</div>
          <div class="mc-subtitle">5 000 сценариев · Каскад 3М → 6М → 12М · AI-советы</div>
        </div>
        <div class="mc-header-actions">
          <button class="btn btn-primary btn-sm"   id="mc-run">↻ Пересчитать</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-toggle">Параметры</button>
        </div>
      </div>

      <div class="mc-baseline" id="mc-baseline">
        <span>Текущий bCHS: <strong id="mc-bl-bchs">—</strong></span>
        <span>Базовый MR: <strong id="mc-bl-mr">—</strong></span>
        <span id="mc-bl-signals" style="font-size:11px;color:var(--text-muted)"></span>
      </div>

      <div id="mc-config-panel" class="mc-config-panel hidden">
        ${this._configPanelHTML()}
      </div>

      <div id="mc-results">
        <div class="mc-loading hidden" id="mc-loading">
          <div class="mc-spinner"></div>
          <div class="mc-loading-text">Анализируем контекст и запускаем сценарии...</div>
        </div>
        <div id="mc-output" class="hidden"></div>
        <div id="mc-nodata" class="mc-nodata hidden">
          <div class="mc-nodata-icon"></div>
          <div class="mc-nodata-title">Прогноз ещё не запущен</div>
          <button class="btn btn-primary" id="mc-first-run">▶ Запустить прогноз</button>
        </div>
      </div>
    `,document.getElementById(`mc-run`)?.addEventListener(`click`,()=>this._runAndRender()),document.getElementById(`mc-cfg-toggle`)?.addEventListener(`click`,()=>this._toggleConfig()),document.getElementById(`mc-first-run`)?.addEventListener(`click`,()=>this._runAndRender());let t=document.getElementById(`mc-bl-bchs`),n=document.getElementById(`mc-bl-mr`);t&&(t.textContent=this.bchs_raw===null?`—`:String(this.bchs_raw)),n&&(n.textContent=this._fmtMR(this.cfg.monthly_revenue))},_configPanelHTML(){let e=this.cfg,t=(t,n,r,i,a)=>`
      <div class="mc-cfg-field">
        <label class="mc-cfg-label">${n}</label>
        <input type="number" class="mc-cfg-input" id="mcc-${t}"
               value="${e[t]===void 0?J.DEFAULTS[t]:e[t]}"
               step="${r}" min="${i}" max="${a}" />
      </div>`;return`
      <div class="mc-config-inner">
        <div class="mc-config-title">Параметры симуляции</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
          Параметры автоматически корректируются под сигналы клиента.
          Здесь можно задать базовые значения.
        </div>
        <div class="mc-config-grid">
          <div class="mc-config-col">
            <div class="mc-config-group-title">Динамика bCHS</div>
            ${t(`drift`,`Дрейф (ежемес.)`,`0.1`,`-10`,`10`)}
            ${t(`volatility`,`Волатильность (σ)`,`0.1`,`0`,`20`)}
            ${t(`mean_reversion`,`Сила возврата к норме`,`0.01`,`0`,`1`)}
            ${t(`equilibrium`,`Норма равновесия (0–100)`,`1`,`0`,`100`)}
            ${t(`monthly_revenue`,`Базовый MR ($/мес)`,`100`,`0`,`9999999`)}
          </div>
          <div class="mc-config-col">
            <div class="mc-config-group-title">Вероятности событий</div>
            ${t(`p_strategic_meeting`,`P(стратег. встреча)`,`0.01`,`0`,`1`)}
            ${t(`impact_strategic_meeting`,`Эффект стратег. встречи`,`0.5`,`-20`,`20`)}
            ${t(`p_fast_response`,`P(быстрый ответ)`,`0.01`,`0`,`1`)}
            ${t(`impact_fast_response`,`Эффект быстрого ответа`,`0.5`,`-10`,`10`)}
            ${t(`p_upsell`,`P(апселл)`,`0.01`,`0`,`1`)}
            ${t(`impact_upsell_mr`,`Эффект апселла (MR)`,`100`,`-9999`,`9999`)}
            ${t(`p_escalation`,`P(эскалация)`,`0.01`,`0`,`1`)}
            ${t(`impact_escalation`,`Эффект эскалации`,`0.5`,`-30`,`0`)}
            ${t(`p_complaint`,`P(жалоба)`,`0.01`,`0`,`1`)}
            ${t(`impact_complaint`,`Эффект жалобы`,`0.5`,`-20`,`0`)}
            ${t(`p_mr_downgrade`,`P(снижение MR)`,`0.01`,`0`,`1`)}
            ${t(`impact_mr_downgrade`,`Эффект снижения MR`,`100`,`-9999`,`0`)}
            ${t(`p_churn`,`P(отток / мес)`,`0.005`,`0`,`0.5`)}
          </div>
        </div>
        <div class="mc-config-actions">
          <button class="btn btn-primary btn-sm"   id="mc-cfg-save">Сохранить и пересчитать</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-reset">Сброс к умолчаниям</button>
          <button class="btn btn-secondary btn-sm" id="mc-cfg-close">✕ Закрыть</button>
        </div>
      </div>`},_toggleConfig(){let e=document.getElementById(`mc-config-panel`);e&&(this.configOpen=!this.configOpen,e.classList.toggle(`hidden`,!this.configOpen),this.configOpen&&(this._bindConfigEvents(),e.scrollIntoView({behavior:`smooth`,block:`nearest`})))},_bindConfigEvents(){let e=document.getElementById(`mc-cfg-save`),t=document.getElementById(`mc-cfg-reset`),n=document.getElementById(`mc-cfg-close`);e&&!e._bound&&(e._bound=!0,e.addEventListener(`click`,async()=>{this._readConfigFromForm(),e.textContent=`⏳ Сохраняем...`,e.disabled=!0,await this.saveConfig(this.client.id,this.cfg),e.textContent=`Сохранить и пересчитать`,e.disabled=!1;let t=document.getElementById(`mc-bl-mr`);t&&(t.textContent=this._fmtMR(this.cfg.monthly_revenue)),window.App.toast(`✅ Параметры сохранены`,`success`),await this._runAndRender()})),t&&!t._bound&&(t._bound=!0,t.addEventListener(`click`,()=>{this.cfg=Object.assign({},J.DEFAULTS,{monthly_revenue:this.client?.monthly_revenue||5e3});let e=document.getElementById(`mc-config-panel`);e&&(e.innerHTML=this._configPanelHTML()),this._bindConfigEvents(),window.App.toast(`Параметры сброшены к умолчаниям`,``)})),n&&!n._bound&&(n._bound=!0,n.addEventListener(`click`,()=>{this.configOpen=!1,document.getElementById(`mc-config-panel`)?.classList.add(`hidden`)}))},_readConfigFromForm(){for(let e of Object.keys(J.DEFAULTS)){let t=document.getElementById(`mcc-${e}`);t&&(this.cfg[e]=parseFloat(t.value)||J.DEFAULTS[e])}},async _runAndRender(){let e=document.getElementById(`mc-loading`),t=document.getElementById(`mc-output`),n=document.getElementById(`mc-nodata`);e?.classList.remove(`hidden`),t?.classList.add(`hidden`),n?.classList.add(`hidden`);try{let n=await fetch(`${Y}/mc/context`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({client_id:this.client.id})}),r=null;if(n.ok){let e=await n.json();e.error||(r=e)}let i=Object.assign({},J.DEFAULTS,r?.suggested_cfg||{},this.cfg||{});this.client.monthly_revenue&&(i.monthly_revenue=this.client.monthly_revenue);let a=r?.current_bchs??this.bchs_raw??null,o=J.run(a,i);this.result=o,this.advice=r?.advice||null,this.serverCtx=r,this._lastSnapshot={ts:new Date().toISOString(),current_bchs:r?.current_bchs??null,horizons:o.horizons,advice:this.advice,signals:r?.active_signals||[],cfg:i},this._saveSnapshotToStrategy().catch(()=>{});let s=document.getElementById(`mc-bl-bchs`),c=document.getElementById(`mc-bl-mr`),l=document.getElementById(`mc-bl-signals`);s&&(s.textContent=a===null?`—`:String(Math.round(a*10)/10)),c&&(c.textContent=this._fmtMR(i.monthly_revenue)),l&&r?.active_signals?.length&&(l.innerHTML=`<span class="mc-signal-badge">`+r.active_signals.length+` сигналов учтено</span>`),e?.classList.add(`hidden`),t&&(t.classList.remove(`hidden`),this._renderOutput(t))}catch(n){console.error(`[MCPage._runAndRender]`,n),e?.classList.add(`hidden`),t&&(t.classList.remove(`hidden`),t.innerHTML=`<div class="mc-error-state">
          <div class="mc-error-icon">!</div>
          <div class="mc-error-title">Ошибка прогноза</div>
          <div class="mc-error-text">${n.message}</div>
        </div>`)}},_renderOutput(e){let t=this.result;e.innerHTML=`
      <div class="mc-horizons" id="mc-horizons">
        ${this._horizonCard(`3m`,t.horizons[`3m`])}
        ${this._horizonCard(`6m`,t.horizons[`6m`])}
        ${this._horizonCard(`12m`,t.horizons[`12m`])}
      </div>

      <div id="mc-horizon-detail"></div>

      ${this.advice?this._renderAdvice(this.advice):``}
    `,this._bindHorizonCards(),this._renderHorizonDetail(),this._updateRiskChip()},_churnThreshold(e){return{"3m":{low:5,medium:15},"6m":{low:10,medium:25},"12m":{low:20,medium:40}}[e]??{low:8,medium:20}},_churnClass(e,t){let n=this._churnThreshold(t);return e<n.low?`low`:e<n.medium?`medium`:`high`},_riskForHorizon(e){let t=this.result?.horizons?.[e];if(!t)return`medium`;let n=t.churn_rate??0,r=this._churnThreshold(e);return n>=r.medium*2?`critical`:n>=r.medium?`high`:n>=r.low?`medium`:`low`},_updateRiskChip(){let e=document.getElementById(`mc-risk-chip`);if(!e)return;let t={low:`Низкий риск`,medium:`Средний риск`,high:`Высокий риск`,critical:`Критический`},n=this._riskForHorizon(this.activeHorizon||`3m`);e.textContent=t[n],e.className=`mc-advice-risk-chip `+n},_renderAdvice(e){({low:`Низкий риск`,medium:`Средний риск`,high:`Высокий риск`,critical:`Критический`})[this._riskForHorizon(this.activeHorizon||`3m`)];let t=(e.advice||[]).map(e=>`
      <div class="mc-advice-row">
        <div class="mc-advice-dot ${e.priority??`medium`}"></div>
        <div class="mc-advice-content">
          <div class="mc-advice-action">${e.action}</div>
          <div class="mc-advice-impact">${e.impact}</div>
        </div>
        <div class="mc-advice-horizon-tag">${e.horizon}</div>
      </div>
    `).join(``),n=e.signals_impact||e.upside_scenario;return`
      <div class="mc-advice-block">
        <div class="mc-advice-header">
          <div class="mc-advice-title">AI-анализ</div>
          <div class="mc-advice-risk-chip" id="mc-risk-chip"></div>
        </div>

        ${e.key_insight?`
          <div class="mc-advice-insight">
            ${e.key_insight}
          </div>`:``}

        ${e.summary?`
          <div class="mc-advice-summary">${e.summary}</div>`:``}

        ${t?`
          <div class="mc-advice-list">
            <div class="mc-advice-list-title">Рекомендации</div>
            ${t}
          </div>`:``}

        ${n?`
          <div class="mc-advice-footer">
            ${e.signals_impact?`
              <div class="mc-advice-signals-row">
                <span class="mc-footer-label">Сигналы</span>
                <span>${e.signals_impact}</span>
              </div>`:``}
            ${e.upside_scenario?`
              <div class="mc-advice-upside-row">
                <span class="mc-footer-label">Upside</span>
                <span>${e.upside_scenario}</span>
              </div>`:``}
          </div>`:``}
      </div>`},_horizonCard(e,t){let n={"3m":`3 Месяца`,"6m":`6 Месяцев`,"12m":`12 Месяцев`},r=e===this.activeHorizon,i=t.churn_rate,a=this._churnThreshold(e),o=i<a.low?`mc-churn-green`:i<a.medium?`mc-churn-yellow`:`mc-churn-red`;return`
      <div class="mc-horizon-card${r?` mc-horizon-active`:``}"
           data-horizon="${e}">
        <div class="mc-horizon-label">${n[e]}</div>
        <div class="mc-horizon-bchs">${t.bchs.median.toFixed(1)}</div>
        <div class="mc-horizon-meta">bCHS медиана</div>
        <div class="mc-horizon-mr">${this._fmtMR(t.mr.median)}</div>
        <div class="mc-horizon-meta">MR медиана</div>
        <div class="mc-churn-badge ${o}">${i.toFixed(1)}% отток</div>
      </div>`},_bindHorizonCards(){document.querySelectorAll(`.mc-horizon-card`).forEach(e=>{e.addEventListener(`click`,()=>{this.activeHorizon=e.dataset.horizon,document.querySelectorAll(`.mc-horizon-card`).forEach(e=>e.classList.toggle(`mc-horizon-active`,e.dataset.horizon===this.activeHorizon)),this._renderHorizonDetail(),this._updateRiskChip()})})},_renderHorizonDetail(){let e=document.getElementById(`mc-horizon-detail`);if(!e)return;let t=this.result.horizons[this.activeHorizon],n={"3m":`3 месяца`,"6m":`6 месяцев`,"12m":`12 месяцев`};e.style.opacity=`0`,e.style.transform=`translateY(6px)`,e.style.transition=`opacity 0.2s ease, transform 0.2s ease`,setTimeout(()=>{e.innerHTML=`
        <div class="mc-stats-grid">
          ${this._bchsStatsCard(t)}
          ${this._mrStatsCard(t)}
          ${this._churnGaugeCard(t,this.activeHorizon)}
        </div>
        <div class="mc-section">
          <div class="mc-section-title">
            Прогноз · ${n[this.activeHorizon]}
            <span style="font-weight:400;font-size:11px;color:#9ca3af">
              из ${t.n.toLocaleString(`ru-RU`)} симуляций
            </span>
          </div>
          <div class="mc-scenario-bars">
            ${this._scenarioBars(t)}
          </div>
        </div>
      `,e.style.opacity=`1`,e.style.transform=`translateY(0)`},120)},_scenarioBars(e){let t=e.bchs;return[{label:`P10 → P25`,from:t.p10,to:t.p25,color:`#fee2e2`,text:`#ef4444`},{label:`P25 → Медиана`,from:t.p25,to:t.median,color:`#fef9c3`,text:`#d97706`},{label:`Медиана`,from:t.median,to:t.median,color:`#e0e7ff`,text:`#6366f1`},{label:`Медиана → P75`,from:t.median,to:t.p75,color:`#dcfce7`,text:`#10b981`},{label:`P75 → P90`,from:t.p75,to:t.p90,color:`#d1fae5`,text:`#059669`}].map(e=>{let t=e.from===e.to?e.from:(e.from+e.to)/2,n=Math.max(t,2);return`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:100px;font-size:11px;color:#9ca3af;flex-shrink:0">${e.label}</div>
          <div style="flex:1;background:#f4f4f8;border-radius:20px;height:8px;overflow:hidden">
            <div style="width:${n}%;background:${e.color};height:100%;border-radius:20px;
                        border:1px solid ${e.text}22;transition:width 0.4s ease"></div>
          </div>
          <div style="width:36px;text-align:right;font-size:12px;font-weight:600;color:${e.text}">
            ${e.to.toFixed(1)}
          </div>
        </div>`}).join(``)},_bchsStatsCard(e){let t=e.bchs;return`
      <div class="mc-stats-card">
        <div class="mc-stats-card-title">Прогноз bCHS (0–100)</div>
        <table class="mc-pct-table">
          <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${t.p10.toFixed(1)}</td></tr>
          <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${t.p25.toFixed(1)}</td></tr>
          <tr class="mc-pct-highlight">
            <td class="mc-pct-label">Медиана</td>
            <td class="mc-pct-val"><strong>${t.median.toFixed(1)}</strong></td>
          </tr>
          <tr><td class="mc-pct-label">Среднее</td><td class="mc-pct-val">${t.mean.toFixed(1)}</td></tr>
          <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${t.p75.toFixed(1)}</td></tr>
          <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${t.p90.toFixed(1)}</td></tr>
        </table>
      </div>`},_mrStatsCard(e){let t=e.mr;return`
      <div class="mc-stats-card">
        <div class="mc-stats-card-title">Прогноз MR</div>
        <table class="mc-pct-table">
          <tr><td class="mc-pct-label">P10</td><td class="mc-pct-val">${this._fmtMR(t.p10)}</td></tr>
          <tr><td class="mc-pct-label">P25</td><td class="mc-pct-val">${this._fmtMR(t.p25)}</td></tr>
          <tr class="mc-pct-highlight">
            <td class="mc-pct-label">Медиана</td>
            <td class="mc-pct-val"><strong>${this._fmtMR(t.median)}</strong></td>
          </tr>
          <tr><td class="mc-pct-label">Среднее</td><td class="mc-pct-val">${this._fmtMR(t.mean)}</td></tr>
          <tr><td class="mc-pct-label">P75</td><td class="mc-pct-val">${this._fmtMR(t.p75)}</td></tr>
          <tr><td class="mc-pct-label">P90</td><td class="mc-pct-val">${this._fmtMR(t.p90)}</td></tr>
        </table>
      </div>`},_churnGaugeCard(e,t=`3m`){let n=e.churn_rate,r=this._churnThreshold(t),i=n<r.low?`#10b981`:n<r.medium?`#f59e0b`:`#ef4444`,a=n<r.low?`Риск оттока низкий — сценарий устойчив`:n<r.medium?`Умеренный риск — держать под контролем`:`Высокий риск оттока — требует вмешательства`,o=2*Math.PI*38,s=o*(1-Math.min(n/50*100,100)/100);return`
      <div class="mc-stats-card">
        <div class="mc-stats-card-title">Риск оттока</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px 0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38"
                    fill="none" stroke="var(--border)" stroke-width="8"/>
            <circle cx="50" cy="50" r="38"
                    fill="none" stroke="${i}" stroke-width="8"
                    stroke-dasharray="${o.toFixed(2)}"
                    stroke-dashoffset="${s.toFixed(2)}"
                    stroke-linecap="round"
                    transform="rotate(-90 50 50)" />
            <text x="50" y="52"
                  text-anchor="middle" dominant-baseline="middle"
                  font-size="16" font-weight="700"
                  fill="${i}" font-family="Inter">${n.toFixed(1)}%</text>
          </svg>
          <div style="text-align:center;font-size:11.5px;color:var(--text-secondary);line-height:1.4">${a}</div>
          <div style="font-size:11px;color:var(--text-muted)">
            ${e.churn_count.toLocaleString(`ru-RU`)} из ${e.n.toLocaleString(`ru-RU`)} сценариев
          </div>
        </div>
      </div>`},async _saveSnapshotToStrategy(){if(!(!this.client?.id||!this._lastSnapshot))try{await fetch(`${Y}/mc/snapshot`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({client_id:this.client.id,snapshot:this._lastSnapshot})})}catch{}},_fmtMR(e){return e==null?`—`:Math.abs(e)>=1e6?(e/1e6).toFixed(2)+` М`:Math.abs(e)>=1e3?(e/1e3).toFixed(1)+` К`:Math.round(e).toLocaleString(`ru-RU`)}};var X={service_delivery:{label:`Service Delivery`,icon:`🎯`,modules:{dashboard:!0,portfolio:!0,detail_overview:!0,detail_history:!0,detail_status_log:!0,detail_delivery:!0,detail_monte_carlo:!1,clients:!0,entry:!0,monte_carlo_page:!1,ai_strategies:!1,bcg_analysis:!1},dashboard_focus:[`utilization`,`escalations`,`replacements`],welcome_message:`Твой фокус — команда и операции. Начни с Dashboard чтобы увидеть кто требует внимания.`},account_manager:{label:`Account Manager`,icon:`🤝`,modules:{dashboard:!0,portfolio:!0,detail_overview:!0,detail_history:!0,detail_status_log:!0,detail_delivery:!1,detail_monte_carlo:!1,clients:!0,entry:!0,monte_carlo_page:!1,ai_strategies:!1,bcg_analysis:!1},dashboard_focus:[`revenue`,`health`,`activities`],welcome_message:`Твой фокус — отношения и revenue. Начни с Portfolio чтобы увидеть общую картину.`},csm_analyst:{label:`CSM / Analyst`,icon:`📊`,modules:{dashboard:!0,portfolio:!0,detail_overview:!0,detail_history:!0,detail_status_log:!0,detail_delivery:!0,detail_monte_carlo:!0,clients:!0,entry:!0,monte_carlo_page:!0,ai_strategies:!0,bcg_analysis:!0},dashboard_focus:[`health`,`revenue`,`risk`,`utilization`],welcome_message:`Полный доступ активирован. Все модули доступны.`}};function Ie(){try{return X[localStorage.getItem(`bchs_role`)]??X.csm_analyst}catch{return X.csm_analyst}}function Le(){try{return localStorage.getItem(`bchs_role`)||`csm_analyst`}catch{return`csm_analyst`}}function Re(e){try{if(!X[e]){console.warn(`[RoleConfig] Неизвестная роль: "${e}"`);return}localStorage.setItem(`bchs_role`,e)}catch(e){console.warn(`[RoleConfig] localStorage недоступен:`,e.message)}}function ze(e){return Ie().modules[e]!==!1}function Z(){let e=Ie(),t={dashboard:`dashboard`,portfolio:`portfolio`,entry:`entry`,clients:`clients`};document.querySelectorAll(`.nav-item[data-page]`).forEach(n=>{let r=t[n.dataset.page];n.style.display=r&&e.modules[r]===!1?`none`:``}),document.querySelectorAll(`.bottom-nav-btn[data-page]`).forEach(n=>{let r=t[n.dataset.page];n.style.display=r&&e.modules[r]===!1?`none`:``})}window.ROLE_CONFIG=X,window.getRoleConfig=Ie,window.getCurrentRole=Le,window.setCurrentRole=Re,window.canAccess=ze,window.applyRoleToNav=Z;var Be=`https://bchs-api.lexsnitko.workers.dev`,Ve={openModal(){$.openModal(`
      <div style="max-width:480px">
        <div style="font-size:16px;font-weight:600;margin-bottom:16px">💾 Бэкап и восстановление</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-primary" id="bk-download-btn">⬇️ Скачать бэкап (JSON)</button>
          <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:4px">
            <div style="font-size:13px;font-weight:600;margin-bottom:8px">📤 Восстановить из файла</div>
            <input type="file" id="bk-file-input" accept=".json"
              style="font-size:13px;margin-bottom:10px;width:100%" />
            <button class="btn btn-secondary" id="bk-restore-btn">🔄 Восстановить</button>
          </div>
          <div id="bk-progress" style="display:none;margin-top:8px">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px" id="bk-progress-text">Подготовка...</div>
            <div style="height:6px;background:var(--border);border-radius:4px;overflow:hidden">
              <div id="bk-progress-bar"
                style="height:100%;background:var(--blue);border-radius:4px;width:0%;transition:width 0.3s"></div>
            </div>
          </div>
        </div>
      </div>
    `),document.getElementById(`bk-download-btn`)?.addEventListener(`click`,()=>this.download()),document.getElementById(`bk-restore-btn`)?.addEventListener(`click`,()=>{let e=document.getElementById(`bk-file-input`)?.files?.[0];if(!e){$.toast(`Выберите файл`,`error`);return}this.restore(e)})},async download(){try{$.toast(`⏳ Собираем данные...`,``);let e=(e,t=2e3)=>fetch(`${Be}/tables/${e}?limit=${t}`).then(e=>e.json()).then(e=>Array.isArray(e.data)?e.data:Array.isArray(e)?e:[]).catch(()=>[]),[t,n,r,i,a,o,s,c,l]=await Promise.all([f.getClients(),f.getAllBCHS(),f.getAllPC(),f.getAllStatusEntries(),e(`mc_configs`),e(`account_strategies`),e(`portfolio_strategies`),e(`fte_entries`),e(`my_activities`)]),u={version:4,ts:new Date().toISOString(),clients:t,bchs:n,pc:r,status:i,mc:a,account_strategies:o,portfolio_strategies:s,fte_entries:c,my_activities:l},d=new Blob([JSON.stringify(u,null,2)],{type:`application/json`}),p=URL.createObjectURL(d);Object.assign(document.createElement(`a`),{href:p,download:`bchs_backup_v4_${new Date().toISOString().slice(0,10)}.json`}).click(),URL.revokeObjectURL(p),$.toast(`✅ Бэкап скачан! (v4 — 9 таблиц)`,`success`)}catch(e){$.toast(`❌ Ошибка бэкапа: `+e.message,`error`)}},async restore(e){try{let t=await e.text(),n=JSON.parse(t);if(!n.version||!n.clients){$.toast(`❌ Неверный формат файла`,`error`);return}if(!confirm(`Восстановить данные из бэкапа v${n.version} от ${n.ts?.slice(0,10)}?\n\nВСЕ ТЕКУЩИЕ ДАННЫЕ БУДУТ УДАЛЕНЫ!`))return;let r=document.getElementById(`bk-progress`),i=document.getElementById(`bk-progress-bar`),a=document.getElementById(`bk-progress-text`),o=(e,t)=>{r&&(r.style.display=`block`),i&&(i.style.width=e+`%`),a&&(a.textContent=t)},s=[{key:`clients`,name:`clients`},{key:`bchs`,name:`bchs_entries`},{key:`pc`,name:`pc_entries`},{key:`status`,name:`status_entries`},{key:`mc`,name:`mc_configs`},{key:`account_strategies`,name:`account_strategies`},{key:`portfolio_strategies`,name:`portfolio_strategies`},{key:`fte_entries`,name:`fte_entries`},{key:`my_activities`,name:`my_activities`}];for(let e=0;e<s.length;e++){let{key:t,name:r}=s[e],i=n[t]||[];o(Math.round(e/s.length*80),`Восстанавливаем ${r} (${i.length} записей)...`);for(let e of i){let t={...e};[`id`,`gs_project_id`,`gs_table_name`,`created_at`,`updated_at`].forEach(e=>delete t[e]),await fetch(`${Be}/tables/${r}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}).catch(()=>{})}}o(100,`✅ Готово!`),f.clearCache(),$.toast(`✅ Восстановление завершено!`,`success`),setTimeout(()=>{$.closeModal(),$.navigate(`dashboard`)},1200)}catch(e){$.toast(`❌ Ошибка восстановления: `+e.message,`error`)}}},He={KEY:14,GROWTH:21,GROWTH_EARLY:14,STABLE:30,TAIL:60},Q={checkin:{icon:`💬`,label:`Check-in`},call:{icon:`📞`,label:`Звонок`},meeting:{icon:`🤝`,label:`Встреча`},qbr:{icon:`📊`,label:`QBR`},email:{icon:`📧`,label:`Email`}},Ue={async render(){document.getElementById(`main-content`).innerHTML=`
      <div class="page-header">
        <div class="page-title">📍 Точки касания</div>
        <div class="page-subtitle">Кого и когда контактировать — авто и ручные напоминания</div>
      </div>
      <div id="tp-content">
        <div style="padding:32px;text-align:center;color:var(--text-muted)">⏳ Загрузка...</div>
      </div>`,await this._load()},async _load(){let e=document.getElementById(`tp-content`);try{let[t,n,r,i]=await Promise.all([f.getClients(),f.getAllBCHS(),f.getAllPC(),f.getTouchPoints()]),a=t.map(e=>({client:e,...k.computeClient(e,n,r)})),o=this._buildRecommendations(a,i),s=o.filter(e=>e.urgency===`overdue`),c=o.filter(e=>e.urgency===`due`),l=o.filter(e=>e.urgency===`upcoming`);e.innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
          ${this._statCard(`🔴 Просрочено`,s.length,`#EF4444`)}
          ${this._statCard(`🟡 Сегодня`,c.length,`#F59E0B`)}
          ${this._statCard(`🔵 На неделе`,l.length,`#6366f1`)}
        </div>

        <div class="form-section">
          <div style="display:flex;align-items:center;justify-content:space-between;
                      margin-bottom:14px;flex-wrap:wrap;gap:8px">
            <div class="form-section-title" style="margin:0">
              Рекомендованные касания
            </div>
            <button class="btn btn-primary btn-sm" id="tp-add-btn">
              + Добавить касание
            </button>
          </div>

          ${s.length?`
            <div style="font-size:11px;font-weight:700;color:#EF4444;
                        text-transform:uppercase;letter-spacing:.5px;
                        margin-bottom:8px">🔴 Просрочено</div>
            ${s.map(e=>this._rowHTML(e)).join(``)}
            <div style="height:16px"></div>`:``}

          ${c.length?`
            <div style="font-size:11px;font-weight:700;color:#F59E0B;
                        text-transform:uppercase;letter-spacing:.5px;
                        margin-bottom:8px">🟡 Нужно сегодня</div>
            ${c.map(e=>this._rowHTML(e)).join(``)}
            <div style="height:16px"></div>`:``}

          ${l.length?`
            <div style="font-size:11px;font-weight:700;color:#6366f1;
                        text-transform:uppercase;letter-spacing:.5px;
                        margin-bottom:8px">🔵 Ближайшая неделя</div>
            ${l.map(e=>this._rowHTML(e)).join(``)}`:``}

          ${!s.length&&!c.length&&!l.length?`
            <div style="text-align:center;padding:40px;color:var(--text-muted)">
              ✅ Все клиенты покрыты касаниями — хорошая работа!
            </div>`:``}
        </div>
      `,this._bindEvents(a,i)}catch(t){console.error(`[TouchPoints]`,t),e.innerHTML=`<div style="padding:32px;text-align:center;color:var(--md-red)">
        ❌ Ошибка: ${t.message}</div>`}},_buildRecommendations(e,t){let n=new Date,r=[];for(let i of e){let e=i.client,a=String(e.id),o=t.filter(e=>String(e.client_id)===a&&e.completed_at).sort((e,t)=>new Date(t.completed_at)-new Date(e.completed_at))[0]??null,s=o?new Date(o.completed_at):null,c=He[e.bcg_category]??30,l=s?new Date(s.getTime()+c*24*60*60*1e3):new Date(n.getTime()-1),u=Math.round((l-n)/(1440*60*1e3)),d=i.trend?.direction===`down`&&i.bchs!==null&&i.bchs<0||i.bchs!==null&&i.bchs<-20,f;if(u<0)f=`overdue`;else if(u<=3)f=`due`;else if(u<=7)f=`upcoming`;else continue;r.push({client:e,row:i,lastDate:s,nextDate:l,diffDays:u,urgency:f,boosted:d,freq:c,lastNote:o?.notes??``,lastType:o?.type??`checkin`})}return r.sort((e,t)=>{let n={overdue:0,due:1,upcoming:2};return n[e.urgency]===n[t.urgency]?(e.row.bchs??999)-(t.row.bchs??999):n[e.urgency]-n[t.urgency]})},_rowHTML(e){let t=e.client,n={KEY:`⭐`,STABLE:`🐄`,GROWTH:`💎`,GROWTH_EARLY:`🌱`,TAIL:`📦`}[t.bcg_category]??`•`,r=e.lastDate?this._daysAgo(e.lastDate):`никогда`,i=e.urgency===`overdue`?`#EF4444`:e.urgency===`due`?`#F59E0B`:`#6366f1`,a=e.boosted?`<span style="font-size:10px;background:#fef2f2;color:#EF4444;
                      border-radius:4px;padding:2px 5px;margin-left:4px">
           ⚠ bCHS падает</span>`:``,o=Object.entries(Q).map(([e,t])=>`<option value="${e}">${t.icon} ${t.label}</option>`).join(``);return`
      <div class="tp-row" data-cid="${t.id}"
           style="display:flex;align-items:center;gap:10px;
                  padding:10px 12px;border-radius:8px;margin-bottom:6px;
                  background:var(--surface);border:1px solid var(--border);
                  flex-wrap:wrap">
        <div style="min-width:0;flex:1">
          <div style="font-weight:600;font-size:13px;white-space:nowrap;
                      overflow:hidden;text-overflow:ellipsis">
            ${n} ${t.name}${a}
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
            Последний контакт: <strong>${r}</strong>
            · каждые ${e.freq} дней
            · bCHS ${e.row.bchs??`—`}
          </div>
        </div>
        <div style="font-size:12px;font-weight:700;color:${i};
                    white-space:nowrap;min-width:80px;text-align:right">
          ${e.urgency===`overdue`?`${Math.abs(e.diffDays)}д просрочено`:e.urgency===`due`?`сегодня`:`через ${e.diffDays}д`}
        </div>
        <select class="form-select tp-type-select" data-cid="${t.id}"
                style="width:130px;font-size:12px;padding:4px 8px">
          ${o}
        </select>
        <button class="btn btn-primary btn-sm tp-done-btn"
                data-cid="${t.id}" data-name="${t.name}"
                style="white-space:nowrap;font-size:12px">
          ✓ Отметить
        </button>
      </div>`},_historySection(e,t){let n=[...e].filter(e=>e.completed_at).sort((e,t)=>new Date(t.completed_at)-new Date(e.completed_at)).slice(0,20);if(!n.length)return``;let r=Object.fromEntries(t.map(e=>[String(e.id),e.name]));return`
      <div class="form-section" style="margin-top:16px">
        <div class="form-section-title">📋 История последних касаний</div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr>
              <th>Клиент</th><th>Тип</th><th>Дата</th><th>Заметка</th><th></th>
            </tr></thead>
            <tbody>${n.map(e=>{let t=Q[e.type]??{icon:`•`,label:e.type},n=r[String(e.client_id)]??e.client_id,i=new Date(e.completed_at).toLocaleDateString(`ru-RU`,{day:`numeric`,month:`short`});return`<tr>
        <td style="font-size:12px;font-weight:600">${n}</td>
        <td style="font-size:12px">${t.icon} ${t.label}</td>
        <td style="font-size:12px;color:var(--text-muted)">${i}</td>
        <td style="font-size:12px;color:var(--text-secondary);max-width:220px">
  ${this._formatNotePreview(e.notes)}
</td>
        <td>
          <button class="btn btn-secondary btn-sm tp-del-btn"
                  data-id="${e.id}" style="font-size:11px;padding:2px 7px">
            ✕
          </button>
        </td>
      </tr>`}).join(``)}</tbody>
          </table>
        </div>
      </div>`},_bindEvents(e,t){document.querySelectorAll(`.tp-done-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.cid,n=e.dataset.name,r=document.querySelector(`.tp-type-select[data-cid="${t}"]`)?.value??`checkin`;this._openDoneModal(t,n,r)})}),document.getElementById(`tp-add-btn`)?.addEventListener(`click`,()=>{this._openAddModal(e)}),document.querySelectorAll(`.tp-del-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{await f.deleteTouchPoint(e.dataset.id),window.App.toast(`Удалено`,`success`),this._load()})})},_openDoneModal(e,t,n){window.App.openModal(`
      <div style="max-width:400px">
        <div style="font-size:15px;font-weight:700;margin-bottom:4px">
          ✓ Отметить касание
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px">
          ${t}
        </div>
        <div class="form-group">
          <label class="form-label">Заметка (необязательно)</label>
          <textarea class="form-textarea" id="tp-note-input"
                    style="min-height:80px;resize:vertical"
                    placeholder="Что обсудили, о чём договорились..."></textarea>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="tp-done-confirm" style="flex:1">
            ✓ Сохранить
          </button>
          <button class="btn btn-secondary"
                  onclick="window.App.closeModal()">Отмена</button>
        </div>
      </div>`),document.getElementById(`tp-done-confirm`)?.addEventListener(`click`,async()=>{let r=document.getElementById(`tp-note-input`)?.value.trim()??``;try{await f.saveTouchPoint({client_id:e,type:n,completed_at:new Date().toISOString(),notes:r}),window.App.closeModal(),window.App.toast(`✅ Касание с ${t} отмечено`,`success`),this._load()}catch(e){window.App.toast(`❌ Ошибка: `+e.message,`error`)}})},_openAddModal(e){let t=e.sort((e,t)=>e.client.name.localeCompare(t.client.name)).map(e=>`<option value="${e.client.id}">${e.client.name}</option>`).join(``),n=Object.entries(Q).map(([e,t])=>`<option value="${e}">${t.icon} ${t.label}</option>`).join(``);window.App.openModal(`
      <div style="max-width:400px">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">
          + Добавить касание
        </div>
        <div class="form-group">
          <label class="form-label">Клиент</label>
          <select class="form-select" id="tp-add-client">${t}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Тип</label>
          <select class="form-select" id="tp-add-type">${n}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Дата (оставь пустым = сегодня)</label>
          <input class="form-input" type="date" id="tp-add-date"
                 value="${new Date().toISOString().slice(0,10)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Заметка</label>
          <textarea class="form-textarea" id="tp-add-note"
                    style="min-height:70px;resize:vertical"
                    placeholder="Что обсудили..."></textarea>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="tp-add-confirm" style="flex:1">
            Сохранить
          </button>
          <button class="btn btn-secondary"
                  onclick="window.App.closeModal()">Отмена</button>
        </div>
      </div>`),document.getElementById(`tp-add-confirm`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`tp-add-client`)?.value,t=document.getElementById(`tp-add-type`)?.value??`checkin`,n=document.getElementById(`tp-add-date`)?.value,r=document.getElementById(`tp-add-note`)?.value.trim()??``;try{await f.saveTouchPoint({client_id:e,type:t,completed_at:n?new Date(n).toISOString():new Date().toISOString(),notes:r}),window.App.closeModal(),window.App.toast(`✅ Касание добавлено`,`success`),this._load()}catch(e){window.App.toast(`❌ Ошибка: `+e.message,`error`)}})},_statCard(e,t,n){return`
      <div class="kpi-card" style="text-align:center">
        <div class="kpi-value" style="color:${n}">${t}</div>
        <div class="kpi-label">${e}</div>
      </div>`},_daysAgo(e){let t=Math.round((Date.now()-e.getTime())/(1440*60*1e3));return t===0?`сегодня`:t===1?`вчера`:t<7?`${t} дн. назад`:t<30?`${Math.round(t/7)} нед. назад`:`${Math.round(t/30)} мес. назад`},_formatNotePreview(e){if(!e)return`<span style="color:var(--text-muted)">—</span>`;let t=e.match(/📋 Контекст:\n([\s\S]*?)(?:\n\n|$)/),n=e.match(/✅ Задачи:\n([\s\S]*?)(?:\n\n|$)/),r=e.match(/👣 Дальнейшие шаги:\n([\s\S]*?)(?:\n\n|$)/);if(t||n||r){let e=[];return t&&e.push(`<span style="color:var(--text-muted);font-size:10px">📋</span> ${t[1].trim().slice(0,60)}${t[1].trim().length>60?`…`:``}`),n&&e.push(`<span style="color:var(--text-muted);font-size:10px">✅</span> ${n[1].trim().slice(0,60)}${n[1].trim().length>60?`…`:``}`),r&&e.push(`<span style="color:var(--text-muted);font-size:10px">👣</span> ${r[1].trim().slice(0,60)}${r[1].trim().length>60?`…`:``}`),e.map(e=>`<div style="line-height:1.5">${e}</div>`).join(``)}return`<span>${e.slice(0,80)}${e.length>80?`…`:``}</span>`}},$={currentPage:null,currentParam:null,async init(){document.querySelectorAll(`.nav-item`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),this.navigate(e.dataset.page),document.getElementById(`sidebar`).classList.remove(`open`)})}),document.querySelectorAll(`.bottom-nav-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),e.dataset.page&&this.navigate(e.dataset.page)})}),document.getElementById(`menu-toggle`)?.addEventListener(`click`,()=>{document.getElementById(`sidebar`).classList.toggle(`open`)}),document.getElementById(`topbar-add`)?.addEventListener(`click`,()=>{this.navigate(`entry`)}),document.addEventListener(`click`,e=>{let t=document.getElementById(`sidebar`),n=document.getElementById(`menu-toggle`);t?.classList.contains(`open`)&&!t.contains(e.target)&&e.target!==n&&t.classList.remove(`open`)}),document.addEventListener(`keydown`,e=>{let t=document.activeElement?.tagName?.toLowerCase();t===`input`||t===`textarea`||t===`select`||((e.key===`n`||e.key===`N`)&&this.navigate(`entry`),e.key===`Escape`&&this.navigate(`dashboard`),(e.key===`r`||e.key===`R`)&&this.navigate(this.currentPage||`dashboard`))}),document.getElementById(`modal-close`)?.addEventListener(`click`,()=>{this.closeModal()}),document.getElementById(`modal-overlay`)?.addEventListener(`click`,e=>{e.target===document.getElementById(`modal-overlay`)&&this.closeModal()}),document.getElementById(`backup-btn`)?.addEventListener(`click`,()=>{Ve.openModal()});try{await m.run()}catch(e){console.warn(`[Seed]`,e)}O.init().catch(e=>console.warn(`[CalendarEngine.init]`,e)),typeof Z==`function`&&Z(),await this.navigate(`dashboard`)},async navigate(e,t){this.currentPage=e,this.currentParam=t??null;let n=e===`detail`;switch(document.querySelectorAll(`.nav-item`).forEach(t=>{t.classList.toggle(`active`,t.dataset.page===e||n&&t.dataset.page===`dashboard`)}),document.querySelectorAll(`.bottom-nav-btn`).forEach(t=>{t.classList.toggle(`active`,t.dataset.page===e||n&&t.dataset.page===`dashboard`)}),window.scrollTo({top:0,behavior:`smooth`}),e){case`dashboard`:await A.render();break;case`touchpoints`:await Ue.render();break;case`entry`:await j.render(t??null),j._pendingMonth&&(j.selectedMonth=j._pendingMonth,j.selectedYear=j._pendingYear,j._pendingMonth=null,j._pendingYear=null,j._buildForm());break;case`detail`:t?await z.render(t):await A.render();break;case`clients`:await de.render(t??null);break;case`calendars`:await fe.render();break;case`tracker`:await pe.render({clientId:t??null});break;case`portfolio`:await _e.render();break;default:console.warn(`[App.navigate] Unknown page: "${e}", falling back to dashboard`),await A.render()}},navigateEntryMonthYear(e,t,n){j._pendingMonth=t,j._pendingYear=n,this.navigate(`entry`,e)},_moduleNotFound(e){let t=document.getElementById(`main-content`);t&&(t.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Модуль не загружен: ${e}</div>
        <div class="empty-state-text">Проверьте подключение скриптов в index.html</div>
      </div>`)},openModal(e){document.getElementById(`modal-overlay`).classList.remove(`hidden`),document.getElementById(`modal-content`).innerHTML=e},closeModal(){document.getElementById(`modal-overlay`).classList.add(`hidden`);let e=document.getElementById(`modal-content`);e&&(e.innerHTML=``)},toast(e,t=``){let n=document.getElementById(`toast-container`);if(!n)return;let r=document.createElement(`div`);r.className=`toast${t?` `+t:``}`,r.textContent=e,n.appendChild(r),setTimeout(()=>{r.style.opacity=`0`,r.style.transition=`opacity 0.3s`,setTimeout(()=>r.remove(),300)},2800)}};window.App=$,document.addEventListener(`DOMContentLoaded`,()=>{$.init().catch(e=>{console.error(`[App] Init error:`,e);let t=document.getElementById(`main-content`);t&&(t.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Ошибка запуска</div>
        <div class="empty-state-text">${e.message}</div>
      </div>`)})});