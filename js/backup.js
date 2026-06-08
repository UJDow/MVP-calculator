/* ============================================
   Portfolio BCHS — Backup / Restore v7.0
   ============================================ */

import { API } from './api.js';
import { App } from './app.js';

const BASE_URL = 'https://bchs-api.lexsnitko.workers.dev';

export const Backup = {

  openModal() {
    App.openModal(`
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
    `);

    document.getElementById('bk-download-btn')
      ?.addEventListener('click', () => this.download());
    document.getElementById('bk-restore-btn')
      ?.addEventListener('click', () => {
        const file = document.getElementById('bk-file-input')?.files?.[0];
        if (!file) { App.toast('Выберите файл', 'error'); return; }
        this.restore(file);
      });
  },

  async download() {
    try {
      App.toast('⏳ Собираем данные...', '');
      const fetchTable = (name, limit = 2000) =>
        fetch(`${BASE_URL}/tables/${name}?limit=${limit}`)
          .then(r => r.json())
          .then(j => Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []))
          .catch(() => []);

      const [clients, bchs, pc, status, mc, accountStrats, portfolioStrats, fteEntries, myActivities] =
        await Promise.all([
          API.getClients(),
          API.getAllBCHS(),
          API.getAllPC(),
          API.getAllStatusEntries(),
          fetchTable('mc_configs'),
          fetchTable('account_strategies'),
          fetchTable('portfolio_strategies'),
          fetchTable('fte_entries'),
          fetchTable('my_activities'),
        ]);

      const backup = {
        version: 4,
        ts: new Date().toISOString(),
        clients, bchs, pc, status, mc,
        account_strategies:   accountStrats,
        portfolio_strategies: portfolioStrats,
        fte_entries:          fteEntries,
        my_activities:        myActivities,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), {
        href: url,
        download: `bchs_backup_v4_${new Date().toISOString().slice(0, 10)}.json`,
      });
      a.click();
      URL.revokeObjectURL(url);
      App.toast('✅ Бэкап скачан! (v4 — 9 таблиц)', 'success');
    } catch (e) {
      App.toast('❌ Ошибка бэкапа: ' + e.message, 'error');
    }
  },

  async restore(file) {
    try {
      const text   = await file.text();
      const backup = JSON.parse(text);

      if (!backup.version || !backup.clients) {
        App.toast('❌ Неверный формат файла', 'error');
        return;
      }
      if (!confirm(`Восстановить данные из бэкапа v${backup.version} от ${backup.ts?.slice(0,10)}?\n\nВСЕ ТЕКУЩИЕ ДАННЫЕ БУДУТ УДАЛЕНЫ!`)) return;

      const progress    = document.getElementById('bk-progress');
      const progressBar = document.getElementById('bk-progress-bar');
      const progressTxt = document.getElementById('bk-progress-text');
      const setProgress = (pct, txt) => {
        if (progress)    progress.style.display = 'block';
        if (progressBar) progressBar.style.width = pct + '%';
        if (progressTxt) progressTxt.textContent = txt;
      };

      const tables = [
        { key: 'clients',             name: 'clients'             },
        { key: 'bchs',                name: 'bchs_entries'        },
        { key: 'pc',                  name: 'pc_entries'          },
        { key: 'status',              name: 'status_entries'      },
        { key: 'mc',                  name: 'mc_configs'          },
        { key: 'account_strategies',  name: 'account_strategies'  },
        { key: 'portfolio_strategies',name: 'portfolio_strategies' },
        { key: 'fte_entries',         name: 'fte_entries'         },
        { key: 'my_activities',       name: 'my_activities'       },
      ];

      for (let i = 0; i < tables.length; i++) {
        const { key, name } = tables[i];
        const rows = backup[key] || [];
        setProgress(Math.round((i / tables.length) * 80), `Восстанавливаем ${name} (${rows.length} записей)...`);

        for (const row of rows) {
          const payload = { ...row };
          ['id', 'gs_project_id', 'gs_table_name', 'created_at', 'updated_at'].forEach(k => delete payload[k]);
          await fetch(`${BASE_URL}/tables/${name}`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
          }).catch(() => {});
        }
      }

      setProgress(100, '✅ Готово!');
      API.clearCache();
      App.toast('✅ Восстановление завершено!', 'success');
      setTimeout(() => { App.closeModal(); App.navigate('dashboard'); }, 1200);
    } catch (e) {
      App.toast('❌ Ошибка восстановления: ' + e.message, 'error');
    }
  },
};
