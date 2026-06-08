/* ============================================
   js/app.js — Main App Controller (ES Module)
   Portfolio BCHS v7.0
   Router, navigation, toast, init, role guard
   ============================================ */

import { SEED }          from './seed.js';
import { API }           from './api.js';
import { CalendarEngine } from './calendar_engine.js';
import { DashboardPage } from './pages/dashboard.js';
import { EntryPage }     from './pages/entry.js';
import { DetailPage }    from './pages/detail.js';
import { ClientsPage }   from './pages/clients.js';
import { CalendarsPage } from './pages/calendars.js';
import { TrackerPage }   from './pages/tracker.js';
import { PortfolioPage } from './pages/portfolio.js';
import { applyRoleToNav } from './role_config.js';
import { Backup }        from './backup.js';

export const App = {
  currentPage:  null,
  currentParam: null,

  async init() {

    /* ── Sidebar nav links ── */
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        this.navigate(link.dataset.page);
        document.getElementById('sidebar').classList.remove('open');
      });
    });

    /* ── Bottom nav buttons ── */
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        if (btn.dataset.page) this.navigate(btn.dataset.page);
      });
    });

    /* ── Hamburger menu ── */
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    /* ── Topbar "+" button ── */
    document.getElementById('topbar-add')?.addEventListener('click', () => {
      this.navigate('entry');
    });

    /* ── Close sidebar on outside click ── */
    document.addEventListener('click', e => {
      const sidebar = document.getElementById('sidebar');
      const toggle  = document.getElementById('menu-toggle');
      if (
        sidebar?.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== toggle
      ) {
        sidebar.classList.remove('open');
      }
    });

    /* ── Keyboard shortcuts ── */
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'n' || e.key === 'N') this.navigate('entry');
      if (e.key === 'Escape')             this.navigate('dashboard');
      if (e.key === 'r' || e.key === 'R') this.navigate(this.currentPage || 'dashboard');
    });

    /* ── Modal close handlers ── */
    document.getElementById('modal-close')?.addEventListener('click', () => {
      this.closeModal();
    });
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) this.closeModal();
    });

    /* ── Backup button ── */
    document.getElementById('backup-btn')?.addEventListener('click', () => {
      Backup.openModal();
    });

    /* ── Seed demo data (silent fail) ── */
    try { await SEED.run(); } catch (e) { console.warn('[Seed]', e); }

    /* ── Calendar engine pre-fetch (silent fail) ── */
    CalendarEngine.init().catch(e => console.warn('[CalendarEngine.init]', e));

    /* ── Apply role-based nav visibility ── */
    if (typeof applyRoleToNav === 'function') applyRoleToNav();

    /* ── Initial route ── */
    await this.navigate('dashboard');
  },

  async navigate(page, param) {
    this.currentPage  = page;
    this.currentParam = param ?? null;

    /* ── Highlight active nav items ── */
    const isDetail = page === 'detail';
    document.querySelectorAll('.nav-item').forEach(link => {
      link.classList.toggle(
        'active',
        link.dataset.page === page || (isDetail && link.dataset.page === 'dashboard')
      );
    });
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.classList.toggle(
        'active',
        btn.dataset.page === page || (isDetail && btn.dataset.page === 'dashboard')
      );
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (page) {

      case 'dashboard':
        await DashboardPage.render();
        break;

      case 'entry':
        await EntryPage.render(param ?? null);
        /* ── Restore pending month/year after render ── */
        if (EntryPage._pendingMonth) {
          EntryPage.selectedMonth = EntryPage._pendingMonth;
          EntryPage.selectedYear  = EntryPage._pendingYear;
          EntryPage._pendingMonth = null;
          EntryPage._pendingYear  = null;
          EntryPage._buildForm();          // ← исправлено: было buildForm()
        }
        break;

      case 'detail':
        if (param) await DetailPage.render(param);
        else        await DashboardPage.render();
        break;

      case 'clients':
        await ClientsPage.render(param ?? null);
        break;

      case 'calendars':
        await CalendarsPage.render();
        break;

      case 'tracker':
        await TrackerPage.render({ clientId: param ?? null });
        break;

      case 'portfolio':
        await PortfolioPage.render();
        break;

      default:
        console.warn(`[App.navigate] Unknown page: "${page}", falling back to dashboard`);
        await DashboardPage.render();
    }
  },

  /* ── Convenience: jump to entry with pre-set month/year ── */
  navigateEntryMonthYear(clientId, month, year) {
    EntryPage._pendingMonth = month;
    EntryPage._pendingYear  = year;
    this.navigate('entry', clientId);
  },

  /* ── Module-not-found fallback (used inside navigate if needed) ── */
  _moduleNotFound(name) {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Модуль не загружен: ${name}</div>
        <div class="empty-state-text">Проверьте подключение скриптов в index.html</div>
      </div>`;
  },

  /* ── Modal helpers ── */
  openModal(html) {
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-content').innerHTML = '';
  },

  /* ── Toast notifications ── */
  toast(msg, type = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast${type ? ' ' + type : ''}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity    = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 2800);
  },
};

/* ── Expose globally so pages can call window.App.* ── */
window.App = App;

/* ── Bootstrap on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  App.init().catch(err => {
    console.error('[App] Init error:', err);
    const main = document.getElementById('main-content');
    if (main) main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Ошибка запуска</div>
        <div class="empty-state-text">${err.message}</div>
      </div>`;
  });
});
