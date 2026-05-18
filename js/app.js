/* ============================================
   Portfolio BCHS — Main App Controller
   Router, navigation, toast, init
   ============================================ */

const App = {
  currentPage: null,
  currentParam: null,

  async init() {
    // Bind sidebar nav-items
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        this.navigate(page);
        document.getElementById('sidebar').classList.remove('open');
      });
    });

    // ✅ Bind bottom nav buttons (mobile)
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const page = btn.dataset.page;
        if (page) this.navigate(page);
      });
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
      });
    }

    // Mobile topbar quick entry
    const topbarAdd = document.getElementById('topbar-add');
    if (topbarAdd) {
      topbarAdd.addEventListener('click', () => this.navigate('entry'));
    }

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', e => {
      const sidebar = document.getElementById('sidebar');
      const toggle  = document.getElementById('menu-toggle');
      if (
        sidebar &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== toggle
      ) {
        sidebar.classList.remove('open');
      }
    });

    // ✅ Keyboard shortcuts
    document.addEventListener('keydown', e => {
      // Ignore if user is typing in input/textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'n' || e.key === 'N') this.navigate('entry');
      if (e.key === 'Escape')             this.navigate('dashboard');
      if (e.key === 'r' || e.key === 'R') this.navigate(this.currentPage || 'dashboard');
    });

    // Modal close
    const modalClose = document.getElementById('modal-close');
    if (modalClose) modalClose.addEventListener('click', () => this.closeModal());

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }

    // Run seed
    try {
      await SEED.run();
    } catch (err) {
      console.warn('[Seed] Seed skipped or failed:', err);
    }

    // Load dashboard
    await this.navigate('dashboard');
  },

  async navigate(page, param) {
    this.currentPage  = page;
    this.currentParam = param || null;

    // ✅ Update active state — sidebar
    document.querySelectorAll('.nav-item').forEach(link => {
      const p = link.dataset.page;
      link.classList.toggle('active',
        p === page || (page === 'detail' && p === 'dashboard')
      );
    });

    // ✅ Update active state — bottom nav
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
      const p = btn.dataset.page;
      btn.classList.toggle('active',
        p === page || (page === 'detail' && p === 'dashboard')
      );
    });

    // Scroll to top
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
        if (param) {
          await DetailPage.render(param);
        } else {
          await DashboardPage.render();
        }
        break;

      case 'clients':
        await ClientsPage.render(param || null);
        break;

      default:
        await DashboardPage.render();
    }
  },

  // Special navigation to entry with pre-selected month/year
  navigateEntryMonthYear(clientId, month, year) {
    EntryPage._pendingMonth = month;
    EntryPage._pendingYear  = year;
    this.navigate('entry', clientId);
  },

  /* ---- Modal ---- */
  openModal(html) {
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-content').innerHTML = '';
  },

  /* ---- Toast notifications ---- */
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

// Boot
document.addEventListener('DOMContentLoaded', () => {
  App.init().catch(err => {
    console.error('[App] Init error:', err);
    const main = document.getElementById('main-content');
    if (main) main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Ошибка запуска приложения</div>
        <div class="empty-state-text">${err.message}</div>
      </div>
    `;
  });
});
