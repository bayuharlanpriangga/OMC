/*
 * OMC 2.0 — Command palette shell (Phase 02)
 *
 * Roadmap Phase 02 task is explicitly "Implement command palette shell"
 * — the container, keyboard shortcut, search-filtered list, and
 * open/close/focus behavior. Mapping questions to domains/source systems
 * and returning synthesized answers with evidence trace is Phase 12
 * (Explorer). Today this only navigates between the routes in
 * routes.js, which is honest about what exists right now and gives
 * Phase 12 a working shell to extend.
 */

(function (global) {
  function flattenRoutes() {
    var ROUTES = global.OMCShell.routes.ROUTES;
    var flat = [];
    ROUTES.forEach(function (route) {
      flat.push(route);
      (route.children || []).forEach(function (child) {
        flat.push(child);
      });
    });
    return flat;
  }

  function mountCommandPalette(navigate) {
    var allRoutes = flattenRoutes();
    var activeIndex = 0;
    var filtered = allRoutes.slice();

    var backdrop = document.createElement("div");
    backdrop.className = "omc-overlay-backdrop";
    backdrop.setAttribute("data-open", "false");

    var panel = document.createElement("div");
    panel.className = "omc-command-palette";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Explorer command palette");
    panel.setAttribute("data-open", "false");

    var input = document.createElement("input");
    input.type = "text";
    input.className = "omc-input omc-command-palette__input";
    input.placeholder = "Ask or jump to\u2026 (route navigation for now)";
    input.setAttribute("aria-label", "Search routes");

    var list = document.createElement("ul");
    list.className = "omc-command-palette__list";
    list.setAttribute("role", "listbox");

    var hint = document.createElement("div");
    hint.className = "omc-command-palette__hint";
    hint.innerHTML =
      '<span><span class="omc-kbd">\u2191\u2193</span> navigate  <span class="omc-kbd">\u21b5</span> open</span>' +
      '<span><span class="omc-kbd">esc</span> close</span>';

    panel.appendChild(input);
    panel.appendChild(list);
    panel.appendChild(hint);

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    function renderList() {
      list.innerHTML = "";
      if (filtered.length === 0) {
        var empty = document.createElement("div");
        empty.className = "omc-command-palette__empty";
        empty.textContent = "No matching route.";
        list.appendChild(empty);
        return;
      }
      filtered.forEach(function (route, index) {
        var li = document.createElement("li");
        li.className = "omc-command-palette__item";
        li.setAttribute("role", "option");
        li.setAttribute("data-active", String(index === activeIndex));
        li.setAttribute("aria-selected", String(index === activeIndex));
        li.innerHTML =
          '<span aria-hidden="true">' +
          route.icon +
          "</span><span>" +
          route.label +
          (route.ownerPhase
            ? ' <span class="omc-text-sm" style="color:var(--omc-text-muted)">\u00b7 Phase ' +
              route.ownerPhase +
              "</span>"
            : "") +
          "</span>";
        li.addEventListener("click", function () {
          go(route);
        });
        list.appendChild(li);
      });
    }

    function go(route) {
      navigate(route.path);
      close();
    }

    function onInput() {
      var q = input.value.trim().toLowerCase();
      filtered = allRoutes.filter(function (route) {
        return route.label.toLowerCase().indexOf(q) !== -1;
      });
      activeIndex = 0;
      renderList();
    }

    function onKeydown(event) {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        renderList();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderList();
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (filtered[activeIndex]) go(filtered[activeIndex]);
      }
    }

    var lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      filtered = allRoutes.slice();
      activeIndex = 0;
      input.value = "";
      renderList();
      backdrop.setAttribute("data-open", "true");
      panel.setAttribute("data-open", "true");
      document.addEventListener("keydown", onKeydown, true);
      input.focus();
    }

    function close() {
      backdrop.setAttribute("data-open", "false");
      panel.setAttribute("data-open", "false");
      document.removeEventListener("keydown", onKeydown, true);
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    input.addEventListener("input", onInput);
    backdrop.addEventListener("click", close);

    return { open: open, close: close };
  }

  global.OMCShell = global.OMCShell || {};
  global.OMCShell.mountCommandPalette = mountCommandPalette;
})(window);
