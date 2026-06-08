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

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname; // e.g. /tables/clients

    const match = path.match(/^\/tables\/([a-z_]+)(\/(.+))?$/);
    if (!match) return json({ error: 'Not found' }, 404);

    const table = match[1];
    const id = match[3] || null;
    const method = request.method;

    try {
      if (method === 'GET' && !id) {
        const limit = url.searchParams.get('limit') || 500;
        const sort = url.searchParams.get('sort') || null;
        let query = `SELECT * FROM ${table} LIMIT ${limit}`;
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
        const body = await request.json();
        const keys = Object.keys(body);
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => body[k]);
        const stmt = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
        const result = await env.DB.prepare(stmt).bind(...values).run();
        return json({ success: true, meta: result.meta });
      }

      if (method === 'PUT' && id) {
        const body = await request.json();
        const keys = Object.keys(body);
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = [...keys.map(k => body[k]), id];
        const stmt = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
        const result = await env.DB.prepare(stmt).bind(...values).run();
        return json({ success: true, meta: result.meta });
      }

      if (method === 'DELETE' && id) {
        await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
        return json({ success: true });
      }

      return json({ error: 'Method not allowed' }, 405);

    } catch (e) {
      return json({ error: e.message }, 500);
    }
  },
};
