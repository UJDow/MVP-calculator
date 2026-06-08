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
  const type = body.type ?? 'raw';

  if (type === 'status') {
    const text = body.text ?? '';
    return [
      {
        role: 'system',
        content:
          'Ты CSM-аналитик. Анализируй текст статуса клиента. ' +
          'Отвечай ТОЛЬКО валидным JSON без markdown и без пояснений.',
      },
      {
        role: 'user',
        content:
          `Проанализируй текст статуса клиента и верни JSON:\n` +
          `{"signals":{"sig1":true,"sig2":false,...},"pc":{"key1":3,"key2":4,...},"explanation":"..."}\n\n` +
          `Текст статуса:\n${text}`,
      },
    ];
  }

  if (type === 'horizon') {
  const h      = body.horizon   ?? 'short';
  const s      = body.summary   ?? {};
  const dir    = body.direction ?? null;
  const exist  = body.existing_strategies ?? {};
  const snap   = body.clients_snapshot    ?? [];

  const labels = {
    short: 'краткосрочная (1 месяц)',
    mid:   'среднесрочная (1–2 квартала)',
    long:  'долгосрочная (4 квартала)',
  };

  const dirText = dir
    ? `\nНАПРАВЛЕНИЕ от менеджера: "${dir}"\nОбязательно учитывай это направление как главный приоритет.\n`
    : '';

  const existText = Object.entries(exist)
    .filter(([, v]) => v?.goal)
    .map(([k, v]) => `- ${labels[k] ?? k}: ${v.goal}`)
    .join('\n') || 'не заданы';

  const snapText = snap.length
    ? snap.map(c =>
        `  • ${c.name} [${c.bcg}] bCHS:${c.bchs ?? '—'} тренд:${c.trend ?? '—'} ` +
        `MR:$${c.mr ?? 0} отток:${c.churn ?? '—'}% риск:$${c.risk ?? 0}`
      ).join('\n')
    : 'нет данных';

  return [
    {
      role: 'system',
      content:
        'Ты стратегический аналитик CSM-портфеля с опытом 10+ лет. ' +
        'Генерируй конкретные, реалистичные стратегии на основе данных. ' +
        'Отвечай ТОЛЬКО валидным JSON без markdown.',
    },
    {
      role: 'user',
      content:
        `Предложи 3 ВАРИАНТА стратегии для горизонта: ${labels[h] ?? h}.` +
        `${dirText}\n` +
        `СВОДКА ПОРТФЕЛЯ:\n` +
        `- Всего клиентов: ${s.total ?? '—'}\n` +
        `- Средняя лояльность: ${s.avgLoyalty != null ? s.avgLoyalty + '%' : 'нет данных'}\n` +
        `- Revenue at Risk: $${(s.totalRisk ?? 0).toLocaleString('ru-RU')}\n` +
        `- BCG: KEY=${s.bcgCount?.KEY ?? 0}, STABLE=${s.bcgCount?.STABLE ?? 0}, ` +
        `GROWTH=${s.bcgCount?.GROWTH ?? 0}, GROWTH_EARLY=${s.bcgCount?.GROWTH_EARLY ?? 0}, ` +
        `TAIL=${s.bcgCount?.TAIL ?? 0}\n` +
        `- Топ-3 риска: ${s.top3Risk ?? 'нет'}\n` +
        `- Средняя реализация потенциала: ${s.avgPotential != null ? s.avgPotential + '%' : 'нет данных'}\n\n` +
        `КЛИЕНТЫ ПОРТФЕЛЯ (топ по риску):\n${snapText}\n\n` +
        `УЖЕ НАПИСАННЫЕ СТРАТЕГИИ (не повторяй, развивай логику):\n${existText}\n\n` +
        `Верни СТРОГО валидный JSON с 3 вариантами:\n` +
        `{"variants":[` +
        `{"label":"Вариант 1: название","title":"...","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"},` +
        `{"label":"Вариант 2: название","title":"...","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"},` +
        `{"label":"Вариант 3: название","title":"...","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"}` +
        `]}`,
    },
  ];
}

if (type === 'account') {
  const c    = body.client   ?? {};
  const m    = body.metrics  ?? {};
  const dir  = body.direction ?? null;
  const hist = body.bchs_history       ?? [];
  const sigs = body.active_signals     ?? [];
  const pc   = body.pc_components      ?? {};
  const prev = body.previous_strategies ?? [];

  const dirText = dir
    ? `\nНАПРАВЛЕНИЕ от менеджера: "${dir}"\nЭто главный приоритет стратегии.\n`
    : '';

  const histText = hist.length
    ? hist.map(h => `${h.month}/${h.year}: bCHS=${h.bchs ?? '—'} лояльность=${h.loyalty ?? '—'}%`).join(', ')
    : 'нет истории';

  const sigsText = sigs.length
    ? sigs.join(', ')
    : 'активных сигналов нет';

  const pcText = Object.keys(pc).length
    ? Object.entries(pc).map(([k, v]) => `${k}:${v}`).join(', ')
    : 'нет данных';

  const prevText = prev.length
    ? prev.map(p => `- ${p.goal?.slice(0, 80) ?? '—'} [${p.status ?? '—'}, ${p.created_at?.slice(0, 10) ?? '—'}]`).join('\n')
    : 'предыдущих стратегий нет';

  return [
    {
      role: 'system',
      content:
        'Ты опытный CSM-аналитик. Предлагай конкретные действия, ' +
        'учитывай историю и контекст клиента. ' +
        'Отвечай ТОЛЬКО валидным JSON без markdown.',
    },
    {
      role: 'user',
      content:
        `Предложи 3 ВАРИАНТА стратегии работы с клиентом.` +
        `${dirText}\n` +
        `ПРОФИЛЬ: ${c.name ?? '—'} · BCG: ${c.bcg ?? '—'} · ` +
        `Приоритет: ${c.priority ?? '—'} · MR: $${Number(c.monthly_revenue ?? 0).toLocaleString('ru-RU')}\n` +
        `Engagement: ${c.engagement ?? '—'} · Phase: ${c.phase ?? '—'}\n\n` +
        `МЕТРИКИ:\n` +
        `- bCHS текущий: ${m.bchs_current ?? '—'} · Тренд: ${m.trend ?? '—'}\n` +
        `- MC 3М: медиана ${m.mc_3m_median ?? '—'} · отток ${m.mc_3m_churn ?? '—'}\n` +
        `- MC 12М: медиана ${m.mc_12m_median ?? '—'} · отток ${m.mc_12m_churn ?? '—'}\n` +
        `- Revenue at Risk: $${Number(c.revenue_at_risk ?? 0).toLocaleString('ru-RU')}\n\n` +
        `ИСТОРИЯ bCHS (последние месяцы): ${histText}\n\n` +
        `АКТИВНЫЕ СИГНАЛЫ: ${sigsText}\n\n` +
        `PC КОМПОНЕНТЫ: ${pcText}\n\n` +
        `ПРЕДЫДУЩИЕ СТРАТЕГИИ:\n${prevText}\n\n` +
        `Верни СТРОГО валидный JSON с 3 вариантами:\n` +
        `{"variants":[` +
        `{"label":"Вариант 1: название","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"},` +
        `{"label":"Вариант 2: название","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"},` +
        `{"label":"Вариант 3: название","goal":"...","actions":"...","success_metric":"...","deadline":"YYYY-MM-DD"}` +
        `]}`,
    },
  ];
}


  /* raw — фронт сам передаёт messages */
  return body.messages ?? [];
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
