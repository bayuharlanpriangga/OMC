/*
 * OMC 2.0 — Sidebar (Phase 02)
 * Renders top-level routes from routes.js. "Systems" expands inline to
 * show its five sub-routes rather than navigating to a disconnected page.
 */

(function (global) {
  function iconSpan(icon) {
    var span = document.createElement("span");
    span.className = "omc-sidebar__icon";
    span.setAttribute("aria-hidden", "true");
    span.textContent = icon;
    return span;
  }

  function labelGroup(label, sub) {
    var wrap = document.createElement("div");
    wrap.className = "omc-sidebar__label-group";
    var labelEl = document.createElement("span");
    labelEl.className = "omc-sidebar__label";
    labelEl.textContent = label;
    wrap.appendChild(labelEl);
    if (sub) {
      var subEl = document.createElement("span");
      subEl.className = "omc-sidebar__sub";
      subEl.textContent = sub;
      wrap.appendChild(subEl);
    }
    return wrap;
  }

  function buildItem(route, navigate, isChild) {
    var a = document.createElement("a");
    a.className = "omc-sidebar__item" + (isChild ? " omc-sidebar__item--sub" : "");
    a.href = "#/" + route.path;
    a.dataset.routeId = route.id;
    a.appendChild(iconSpan(route.icon));
    a.appendChild(labelGroup(route.label, route.sub));
    a.addEventListener("click", function (event) {
      event.preventDefault();
      navigate(route.path);
    });
    return a;
  }

  function mountSidebar(container, navigate) {
    var routes = global.OMCShell.routes.ROUTES;

    var aside = document.createElement("aside");
    aside.className = "omc-sidebar";
    aside.id = "omc-sidebar";

    var logo = document.createElement("div");
    logo.className = "omc-sidebar__logo";
    logo.innerHTML = 'O<em>M</em>C';
    aside.appendChild(logo);

    var nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Primary");

    var navLabel = document.createElement("div");
    navLabel.className = "omc-sidebar__section-label";
    navLabel.textContent = "Navigation";
    nav.appendChild(navLabel);

    routes.forEach(function (route) {
      nav.appendChild(buildItem(route, navigate, false));
      if (route.children) {
        route.children.forEach(function (child) {
          nav.appendChild(buildItem(child, navigate, true));
        });
      }
    });

    aside.appendChild(nav);

    var toggle = document.createElement("button");
    toggle.className = "omc-btn omc-btn--icon omc-sidebar__toggle";
    toggle.setAttribute("aria-label", "Collapse sidebar");
    toggle.setAttribute("aria-pressed", "false");
    toggle.textContent = "\u2b9c"; // ⮜
    toggle.addEventListener("click", function () {
      var appEl = document.getElementById("omc-app");
      var collapsed = appEl.getAttribute("data-sidebar") === "collapsed";
      var next = collapsed ? "expanded" : "collapsed";
      appEl.setAttribute("data-sidebar", next);
      toggle.setAttribute("aria-pressed", String(!collapsed));
      try {
        localStorage.setItem("omc-sidebar-state", next);
      } catch {
        /* ignore storage errors (private mode, quota) */
      }
    });
    aside.appendChild(toggle);

    container.appendChild(aside);

    return {
      el: aside,
      setActive: function (routeId) {
        var items = aside.querySelectorAll(".omc-sidebar__item");
        items.forEach(function (item) {
          if (item.dataset.routeId === routeId) {
            item.setAttribute("aria-current", "page");
          } else {
            item.removeAttribute("aria-current");
          }
        });
      },
    };
  }

  global.OMCShell = global.OMCShell || {};
  global.OMCShell.mountSidebar = mountSidebar;
})(window);
