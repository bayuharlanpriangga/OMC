/*
 * OMC 2.0 — Router (Phase 02)
 *
 * Hash-based (no server routing needed, works from a plain static file
 * or file://). Resolves the current path to a route in routes.js and
 * renders either the Home shell scaffold or an honest placeholder that
 * names which roadmap phase will implement that page. No route content
 * invents new tokens or fake data — see components.css
 * .omc-placeholder-page.
 */

(function (global) {
  function findRouteByPath(path) {
    var FLAT = global.OMCShell.routes.FLAT;
    var ids = Object.keys(FLAT);
    for (var i = 0; i < ids.length; i++) {
      if (FLAT[ids[i]].path === path) return FLAT[ids[i]];
    }
    return null;
  }

  function parentOf(route) {
    var ROUTES = global.OMCShell.routes.ROUTES;
    for (var i = 0; i < ROUTES.length; i++) {
      if ((ROUTES[i].children || []).indexOf(route) !== -1) return ROUTES[i];
    }
    return null;
  }

  function renderHome(main) {
    main.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "omc-stack omc-fade-in";

    var eyebrow = document.createElement("div");
    eyebrow.className = "omc-placeholder-page__eyebrow";
    eyebrow.textContent = "OMC \u00b7 App Shell";

    var h1 = document.createElement("h1");
    h1.className = "omc-hero-statement";
    h1.textContent = "One person. Five lenses. One evolving model.";

    var p = document.createElement("p");
    p.textContent =
      "This is the Phase 02 app shell: design tokens, layout, navigation, " +
      "command palette, and overlay primitives. The Living Self Model " +
      "hero, pattern surfacing, and daily brief that belong on this page " +
      "are built in later phases (09 Pattern Intelligence, 13 Personal OS).";

    var grid = document.createElement("div");
    grid.className = "omc-grid-3";
    global.OMCShell.routes.ROUTES.filter(function (r) {
      return r.id !== "home";
    }).forEach(function (route) {
      var card = document.createElement("a");
      card.href = "#/" + route.path;
      card.className = "omc-empty-state omc-row";
      card.style.cursor = "pointer";
      card.style.display = "flex";
      card.innerHTML =
        '<span aria-hidden="true" style="color:var(--omc-accent);font-size:var(--omc-text-xl)">' +
        route.icon +
        "</span><span><strong style=\"color:var(--omc-text-primary);display:block\">" +
        route.label +
        "</strong>" +
        (route.sub || "") +
        "</span>";
      grid.appendChild(card);
    });

    wrap.appendChild(eyebrow);
    wrap.appendChild(h1);
    wrap.appendChild(p);
    wrap.appendChild(grid);
    main.appendChild(wrap);
  }

  function renderPlaceholder(main, route) {
    main.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "omc-placeholder-page omc-stack omc-fade-in";

    var eyebrow = document.createElement("div");
    eyebrow.className = "omc-placeholder-page__eyebrow";
    eyebrow.textContent = route.system ? "System \u00b7 " + route.system : "Route";

    var h1 = document.createElement("h1");
    h1.textContent = route.label;

    var sub = document.createElement("p");
    sub.textContent = route.sub || "";

    var empty = document.createElement("div");
    empty.className = "omc-empty-state";
    empty.innerHTML =
      "Not yet migrated. This page renders inside the Phase 02 app shell " +
      "so navigation and layout are already correct, but its real content" +
      (route.ownerPhase
        ? " lands in <strong style=\"color:var(--omc-text-secondary)\">Phase " +
          route.ownerPhase +
          "</strong>."
        : " lands in a later phase.") +
      (route.question
        ? '<br><br><span class="omc-mono omc-text-sm">Guiding question: \u201c' +
          route.question +
          "\u201d</span>"
        : "");

    wrap.appendChild(eyebrow);
    wrap.appendChild(h1);
    if (route.sub) wrap.appendChild(sub);
    wrap.appendChild(empty);
    main.appendChild(wrap);
  }

  function createRouter(options) {
    var main = options.main;
    var sidebar = options.sidebar;
    var bottomNav = options.bottomNav;
    var topbar = options.topbar;

    function currentPath() {
      return (global.location.hash || "#/").replace(/^#\/?/, "");
    }

    function render() {
      var path = currentPath();
      var route = findRouteByPath(path);

      if (!route) {
        route = global.OMCShell.routes.FLAT.home;
      }

      if (route.id === "home") {
        renderHome(main);
      } else {
        renderPlaceholder(main, route);
      }

      main.scrollTop = 0;

      var activeId = route.id;
      var parent = parentOf(route);
      sidebar.setActive(activeId);
      bottomNav.setActive(parent ? parent.id : activeId);

      var crumbLabel = parent ? parent.label + " / " + route.label : route.label;
      topbar.setBreadcrumb(crumbLabel);

      document.title = "OMC \u2014 " + route.label;
    }

    function navigate(path) {
      global.location.hash = "#/" + path;
      // If the hash didn't actually change (e.g. navigating to Home from
      // Home), hashchange won't fire — render explicitly.
      render();
    }

    global.addEventListener("hashchange", render);

    return { render: render, navigate: navigate };
  }

  global.OMCShell = global.OMCShell || {};
  global.OMCShell.createRouter = createRouter;
})(window);
