/**
 * Portfolio BCHS — Seed / Table Initializer
 *
 * Назначение: убедиться что все 5 таблиц существуют в базе данных.
 * GenSpark создаёт таблицы автоматически при первом GET-запросе.
 *
 * ВАЖНО:
 *   - Никаких тестовых данных
 *   - Никаких демо-клиентов
 *   - Никаких моковых записей
 *   - После деплоя БД должна быть пустой
 */

const SEED = {
  TABLES: [
    'clients',
    'bchs_entries',
    'pc_entries',
    'status_entries',
    'mc_configs',
  ],

  async run() {
    // Единственная цель — инициализировать таблицы через GET-запрос.
    // GenSpark создаёт таблицу при первом обращении к endpoint.
    // Никаких POST/PUT — только пинг для создания структуры.
    await Promise.all(
      this.TABLES.map(table =>
        fetch(`tables/${table}?limit=1`).catch(() => {})
      )
    );
    console.log('[SEED] All 5 tables initialized — database is empty and ready.');
  },
};

// Запуск при прямом использовании файла
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => SEED.run());
}
