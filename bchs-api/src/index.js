const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

/* ── Промпты формируются здесь — фронт их не видит ── */
function buildMessages(body) {
  const type = body.type || 'raw';

  if (type === 'status') {
    return [
      {
        role: 'system',
        content: 'Ты аналитик клиентского портфеля. Отвечай ТОЛЬКО валидным JSON без markdown.',
      },
      {
        role: 'user',
        content: `Проанализируй текст статуса клиента и определи сигналы лояльности.

ТЕКСТ: "${body.text || ''}"

СИГНАЛЫ bCHS (key: описание, вес):
team_scope_request: Запрос расширения команды (+5)
new_services_interest: Интерес к новым услугам (+3)
strategic_sessions: Стратегические сессии (+7)
fast_responses: Быстрые ответы (+2)
internal_events: Приглашение на внутренние события (+3)
shared_business_plans: Совместное планирование (+3)
contract_renewal: Продление контракта (+24)
upsell: Апселл (+16)
cross_sell: Кросс-селл (+13)
positive_feedback: Положительная обратная связь (+5)
slow_responses: Медленные ответы (-2)
missed_meetings: Пропуск встреч (-3)
no_planning: Отказ от планирования (-3)
detailed_report_request: Запрос детальной отчётности (-2)
scope_reduction: Сокращение скоупа (-4)
competitor_mentions: Упоминание конкурентов (-5)
new_decision_maker: Новый ЛПР (-3)
exit_questions: Вопросы об условиях расторжения (-8)
reduced_frequency: Снижение частоты взаимодействий (-2)
no_growth_response: Нет реакции на предложения роста (-2)
complaint: Жалоба / эскалация (-3)
payment_delay_10_30: Задержка оплаты 10-30 дней (-4)
specialist_replacement: Замена специалиста (-5)
escalation: Эскалация до топ-менеджмента (-10)
payment_delay_30plus: Задержка оплаты 30+ дней (-8)
churn: Отток / завершение контракта (-25)

КРИТЕРИИ PC (key: описание, шкала 1-5):
people_count: Размер команды (1=мало, 5=очень много)
project_complexity: Сложность проекта (1=простой, 5=очень сложный)
reporting: Объём отчётности (1=минимум, 5=очень много)
risk_probability: Вероятность рисков (1=низкая, 5=очень высокая)
risk_consequences: Последствия рисков (1=незначит., 5=критичные)
face_role: Роль лица компании (1=фоновая, 5=ключевая)
emotional_load: Эмоциональная нагрузка (1=низкая, 5=очень высокая)

Верни ТОЛЬКО JSON:
{
  "signals": {
    "team_scope_request": false, "new_services_interest": false,
    "strategic_sessions": false, "fast_responses": false,
    "internal_events": false, "shared_business_plans": false,
    "contract_renewal": false, "upsell": false, "cross_sell": false,
    "positive_feedback": false, "slow_responses": false,
    "missed_meetings": false, "no_planning": false,
    "detailed_report_request": false, "scope_reduction": false,
    "competitor_mentions": false, "new_decision_maker": false,
    "exit_questions": false, "reduced_frequency": false,
    "no_growth_response": false, "complaint": false,
    "payment_delay_10_30": false, "specialist_replacement": false,
    "escalation": false, "payment_delay_30plus": false, "churn": false
  },
  "pc": {
    "people_count": 2, "project_complexity": 2, "reporting": 2,
    "risk_probability": 2, "risk_consequences": 2,
    "face_role": 2, "emotional_load": 2
  },
  "explanation": "краткое объяснение на русском"
}`,
      },
    ];
  }

  if (type === 'horizon') {
    const { horizon, summary } = body;
    const hLabels = {
      short: 'краткосрочная (1 месяц)',
      mid:   'среднесрочная (1-2 квартала)',
      long:  'долгосрочная (4 квартала)',
    };
    const top3 = (summary.top3Risk || [])
      .map(r => `${r.name} ($${r.risk}, ${r.pct}%)`)
      .join('; ') || 'нет';

    return [
      {
        role: 'system',
        content: 'Ты стратегический аналитик CSM-портфеля. Отвечай ТОЛЬКО валидным JSON без markdown.',
      },
      {
        role: 'user',
        content: `Предложи стратегию для горизонта: ${hLabels[horizon] || horizon}.

ДАННЫЕ ПОРТФЕЛЯ:
- Всего клиентов: ${summary.total}
- Лояльность: ${summary.avgLoyalty !== null ? summary.avgLoyalty + '%' : 'нет данных'}
- Revenue at Risk: $${summary.totalRisk}
- BCG: KEY=${summary.bcgCount.KEY}, STABLE=${summary.bcgCount.STABLE}, GROWTH=${summary.bcgCount.GROWTH}, TAIL=${summary.bcgCount.TAIL}
- Топ-3 риска: ${top3}
- Средняя реализация потенциала: ${summary.avgPotential !== null ? summary.avgPotential + '%' : 'нет данных'}

Верни ТОЛЬКО JSON:
{"title":"...","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"}`,
      },
    ];
  }

  if (type === 'account') {
    const { client, metrics } = body;
    return [
      {
        role: 'system',
        content: 'Ты CSM-аналитик. Отвечай ТОЛЬКО валидным JSON без markdown.',
      },
      {
        role: 'user',
        content: `Предложи стратегию работы с клиентом.

ПРОФИЛЬ: ${client.name} · BCG: ${client.bcg} · Приоритет: ${client.priority} · MR: $${client.mr}
bCHS текущий: ${metrics.bchs} · Тренд: ${metrics.trend}
MC прогноз 3М: bCHS медиана ${metrics.mc3m} · Риск оттока ${metrics.churn3}
Revenue at Risk: $${metrics.revenueAtRisk}

Верни ТОЛЬКО JSON:
{"goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"}`,
      },
    ];
  }

  /* raw — сырые messages как fallback */
  return body.messages || [];
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url  = new URL(request.url);
    const path = url.pathname;

    /* ── AI Proxy ───────────────────────────────────────────── */
    if (path === '/ai/chat' && request.method === 'POST') {
      try {
        const body     = await request.json();
        const messages = buildMessages(body);

        if (!messages.length) {
          return json({ error: 'No messages provided' }, 400);
        }

        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model:       body.model       ?? 'deepseek-chat',
            temperature: body.temperature ?? 0.3,
            max_tokens:  body.max_tokens  ?? 1000,
            messages,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          return json({ error: `DeepSeek error: ${response.status}`, detail: text }, 502);
        }

        const data = await response.json();
        return json(data);

      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    /* ── Tables CRUD ─────────────────────────────────────────── */
    const match = path.match(/^\/tables\/([a-z_]+)(\/(.+))?$/);
    if (!match) return json({ error: 'Not found' }, 404);

    const table  = match[1];
    const id     = match[3] || null;
    const method = request.method;

    try {
      if (method === 'GET' && !id) {
        const limit = url.searchParams.get('limit') || 500;
        const sort  = url.searchParams.get('sort')  || null;
        let query   = `SELECT * FROM ${table} LIMIT ${limit}`;
        if (sort) query += ` ORDER BY ${sort} DESC`;
        const { results } = await env.DB.prepare(query).all();
        return json({ data: results });
      }

      if (method === 'GET' && id) {
        const { results } = await env.DB.prepare(
          `SELECT * FROM ${table} WHERE id = ?`
        ).bind(id).all();
        return json(results[0] || null);
      }

      if (method === 'POST') {
        const body         = await request.json();
        const keys         = Object.keys(body);
        const placeholders = keys.map(() => '?').join(', ');
        const values       = keys.map(k => body[k]);
        const stmt         = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
        const result       = await env.DB.prepare(stmt).bind(...values).run();
        return json({ success: true, meta: result.meta });
      }

      if (method === 'PUT' && id) {
        const body      = await request.json();
        const keys      = Object.keys(body);
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values    = [...keys.map(k => body[k]), id];
        const stmt      = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
        const result    = await env.DB.prepare(stmt).bind(...values).run();
        return json({ success: true, meta: result.meta });
      }

      if (method === 'DELETE' && id) {
        await env.DB.prepare(
          `DELETE FROM ${table} WHERE id = ?`
        ).bind(id).run();
        return json({ success: true });
      }

      return json({ error: 'Method not allowed' }, 405);

    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};
