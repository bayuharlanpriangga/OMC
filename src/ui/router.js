// ═══════════════════════════════════════════════════════════
//  NEW MULTI-PAGE ROUTER & SIDEBAR SYSTEM
// ═══════════════════════════════════════════════════════════

// ── SIDEBAR ──
function toggleSidebar() {
  // On mobile (<= 900px), toggle uses mobile-open pattern (off-canvas)
  if(window.innerWidth <= 900) {
    openMobileSidebar();
    return;
  }
  document.body.classList.toggle('sidebar-collapsed');
  document.getElementById('sidebar').classList.toggle('collapsed');
}
function openMobileSidebar() {
  document.getElementById('sidebar').classList.remove('collapsed');
  document.getElementById('sb-overlay').style.display = 'block';
  document.body.classList.add('mobile-sidebar-open');
}
function closeMobileSidebar() {
  // Guard: this only closes the MOBILE off-canvas drawer. On desktop the
  // sidebar is permanent — collapsing it here was the bug that made the
  // sidebar vanish every time goPage() ran (i.e. on every navigation).
  if(window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.add('collapsed');
  }
  document.getElementById('sb-overlay').style.display = 'none';
  document.body.classList.remove('mobile-sidebar-open');
}

// ── PAGE ROUTER ──
let _currentPage = 'home';
const PAGE_IDS = ['home','astro','hd','bazi','ziwei','num','overview','depth','tl','transit','daily','compat'];

function goPage(id, clickedEl) {
  // Hide all pages
  PAGE_IDS.forEach(p => {
    const el = document.getElementById('page-'+p);
    if(el) el.classList.remove('active');
  });
  // Show target
  const target = document.getElementById('page-'+id);
  if(target) target.classList.add('active');
  _currentPage = id;

  // Update sidebar active state
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  if(clickedEl) { clickedEl.classList.add('active'); }
  else {
    const match = document.querySelector(`.sb-item[data-page="${id}"]`);
    if(match) match.classList.add('active');
  }

  // Close mobile sidebar
  closeMobileSidebar();

  // Hash for bookmarkability
  try { history.pushState({page:id}, '', '#'+id); } catch(e) { /* iframe/security restriction — safe to ignore */ }

  // If analysis page has data, render it
  if(_globalD && ['overview','depth','tl','transit','daily','compat'].includes(id)) {
    renderAnalysisPage(id);
  }
  
  // Redraw canvases if switching to system page that has result
  if(_globalD) {
    setTimeout(() => triggerCanvasRedraw(id), 100);
  }
}

// Handle browser back/forward
window.addEventListener('popstate', e => {
  const page = (e.state && e.state.page) || 'home';
  goPage(page, null);
});

// Initial page from hash
window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#','');
  if(hash && PAGE_IDS.includes(hash)) goPage(hash, null);
});

// ── GLOBAL DATA STORE ──
let _globalD = null;
let _globalRaw = null;

// ── FORM BUILDER ──
// Build the same form for each system page
