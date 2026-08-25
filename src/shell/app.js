/*
 * OMC 2.0 — Shell bootstrap (Phase 02)
 *
 * Builds the #omc-app grid skeleton and mounts sidebar, top context bar,
 * bottom nav, command palette, and router. This is the only file that
 * knows about all the other shell modules; everything else stays
 * decoupled behind the small interfaces defined in each file.
 */

(function (global) {
  function restoreSidebarState(appEl) {
    var saved = null;
    try {
      saved = localStorage.getItem("omc-sidebar-state");
    } catch {
      /* ignore storage errors */
    }
    appEl.setAttribute("data-sidebar", saved || "expanded");
  }

  function restoreMotionPreference() {
    var saved = null;
    try {
      saved = localStorage.getItem("omc-motion");
    } catch {
      /* ignore storage errors */
    }
    if (saved === "reduced") {
      document.documentElement.setAttribute("data-motion", "reduced");
    }
  }

  function init() {
    var root = document.getElementById("omc-app");
    if (!root) return;

    restoreMotionPreference();
    restoreSidebarState(root);

    var main = document.createElement("main");
    main.className = "omc-main";
    main.id = "omc-main";
    main.setAttribute("tabindex", "-1");

    var mainInner = document.createElement("div");
    mainInner.className = "omc-main-inner";
    main.appendChild(mainInner);

    // Placeholders in DOM order matching the CSS grid areas; sidebar and
    // topbar mount functions append themselves directly into #omc-app.
    var sidebarSlot = root;
    var topbarSlot = root;
    var bottomNavSlot = root;

    function navigate(path) {
      router.navigate(path);
    }

    var sidebar = global.OMCShell.mountSidebar(sidebarSlot, navigate);
    var bottomNav = global.OMCShell.mountBottomNav(bottomNavSlot, navigate);

    var commandPalette = global.OMCShell.mountCommandPalette(navigate);
    var topbar = global.OMCShell.mountTopContextBar(topbarSlot, function () {
      commandPalette.open();
    });

    root.appendChild(main);

    var router = global.OMCShell.createRouter({
      main: mainInner,
      sidebar: sidebar,
      bottomNav: bottomNav,
      topbar: topbar,
    });

    router.render();

    // Global command palette shortcut: Cmd/Ctrl+K, from anywhere in the
    // shell (not just when the trigger button has focus).
    document.addEventListener("keydown", function (event) {
      var isK = event.key === "k" || event.key === "K";
      if (isK && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        commandPalette.open();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
