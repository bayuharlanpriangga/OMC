/*
 * OMC 2.0 — Bottom navigation, mobile only (<768px) (Phase 02)
 */

(function (global) {
  function mountBottomNav(container, navigate) {
    var FLAT = global.OMCShell.routes.FLAT;
    var ids = global.OMCShell.routes.BOTTOM_NAV_IDS;

    var nav = document.createElement("nav");
    nav.className = "omc-bottomnav";
    nav.id = "omc-bottomnav";
    nav.setAttribute("aria-label", "Primary, mobile");

    var buttons = {};

    ids.forEach(function (id) {
      var route = FLAT[id];
      if (!route) return;
      var btn = document.createElement("button");
      btn.className = "omc-bottomnav__item";
      btn.dataset.routeId = route.id;
      btn.innerHTML =
        '<span class="omc-bottomnav__icon" aria-hidden="true">' +
        route.icon +
        '</span><span>' +
        route.label +
        "</span>";
      btn.addEventListener("click", function () {
        navigate(route.path);
      });
      nav.appendChild(btn);
      buttons[id] = btn;
    });

    container.appendChild(nav);

    return {
      el: nav,
      setActive: function (routeId) {
        Object.keys(buttons).forEach(function (id) {
          if (id === routeId) {
            buttons[id].setAttribute("aria-current", "page");
          } else {
            buttons[id].removeAttribute("aria-current");
          }
        });
      },
    };
  }

  global.OMCShell = global.OMCShell || {};
  global.OMCShell.mountBottomNav = mountBottomNav;
})(window);
