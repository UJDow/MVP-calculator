/* ============================================
   Portfolio BCHS — Main App Controller v7.0
   Router, navigation, toast, init, role guard
   ============================================ */

const App = {
  currentPage: null,
  currentParam: null,

  async init() {
    // Sidebar nav
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        this.navigate(link.dataset.page);
        document.getElementById('sidebar').classList.remove('open');
      });
    });

    // Bottom nav
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        if (btn.dataset.page) this.navigate(btn.dataset.page);
      });
    });

    // Mobile menu toggle
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Mobile topbar quick entry
    document.getElementById('topbar-add')?.addEventListener('click', () => {
      this.navigate('entry');
    });

    // Close sidebar on outside click
    document.addEventListener('click', e => {
      const sidebar = document.getElementById('sidebar');
      const toggle  = document.getElementById('menu-toggle');
      if (sidebar?.classList.contains('open') &&
          !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove('open');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'n' || e.key === 'N') this.navigate('entry');
      if (e.key === 'Escape')             this.navigate('dashboard');
      if (e.key === 'r' || e.key === 'R') this.navigate(this.currentPage || 'dashboard');
    });

    // Modal close
    document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) this.closeModal();
    });

    // Backup button
    document.getElementById('backup-btn')?.addEventListener('click', () => {
      if (window.Backup) Backup.openModal();
    });

    // Seed + CalendarEngine init
    try { await SEED.run(); } catch(e) { console.warn('[Seed]', e); }
    if (window.CalendarEngine) {
      CalendarEngine.init().catch(e => console.warn('[CalendarEngine.init]', e));
    }

    // Role setup
    if (window.applyRoleToNav) applyRoleToNav();

    await this.navigate('dashboard');
  },

  async navigate(page, param) {
    this.currentPage  = page;
    this.currentParam = param || null;

    // Active state — sidebar
    document.querySelectorAll('.nav-item').forEach(link => {
      link.classList.toggle('active',
        link.dataset.page === page ||
        (page === 'detail' && link.dataset.page === 'dashboard')
      );
    });

    // Active state — bottom nav
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.classList.toggle('active',
        btn.dataset.page === page ||
        (page === 'detail' && btn.dataset.page === 'dashboard')
      );
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (page) {
      case 'dashboard':
        await DashboardPage.render();
        break;
      case 'entry':
        await EntryPage.render(param || null);
        if (EntryPage._pendingMonth) {
          EntryPage.selectedMonth = EntryPage._pendingMonth;
          EntryPage.selectedYear  = EntryPage._pendingYear;
          EntryPage._pendingMonth = null;
          EntryPage._pendingYear  = null;
          EntryPage.buildForm();
        }
        break;
      case 'detail':
        if (param) await DetailPage.render(param);
        else await DashboardPage.render();
        break;
      case 'clients':
        await ClientsPage.render(param || null);
        break;
      case 'calendars':
        if (window.CalendarsPage) await CalendarsPage.render();
        else this._moduleNotFound('CalendarsPage');
        break;
      case 'tracker':
        if (window.TrackerPage) await TrackerPage.render({ clientId: param });
        else this._moduleNotFound('TrackerPage');
        break;
      case 'portfolio':
        if (window.PortfolioPage) await PortfolioPage.render();
        else this._moduleNotFound('PortfolioPage');
        break;
      default:
        await DashboardPage.render();
    }
  },

  _moduleNotFound(name) {
    document.getElementById('main-content').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Модуль не загружен: ${name}</div>
        <div class="empty-state-text">Проверьте подключение скриптов в index.html</div>
      </div>`;
  },

  navigateEntryMonthYear(clientId, month, year) {
    EntryPage._pendingMonth = month;
    EntryPage._pendingYear  = year;
    this.navigate('entry', clientId);
  },

  openModal(html) {
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-content').innerHTML = '';
  },

  toast(msg, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast${type ? ' ' + type : ''}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 2800);
  },
};

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
