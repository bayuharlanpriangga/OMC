/*
 * OMC 2.0 — Top context bar (Phase 02)
 *
 * Shell-only scope: breadcrumb of the current route plus placeholder
 * slots for the temporal/relationship context switches described in the
 * Design Spec's Living Self Model (§2 — "selecting a time point reweights
 * temporal signals", "selecting a relationship switches the model into
 * relational mode"). Those switches have no data to act on until Phase
 * 10 (Timeline) and Phase 11 (Relationships) exist, so they render as
 * disabled placeholders here rather than fake interactivity.
 */

(function (global) {
  function mountTopContextBar(container, onOpenCommandPalette) {
    var bar = document.createElement("header");
    bar.className = "omc-topbar";
    bar.id = "omc-topbar";

    var breadcrumb = document.createElement("div");
    breadcrumb.className = "omc-topbar__breadcrumb";
    breadcrumb.id = "omc-topbar-breadcrumb";
    breadcrumb.setAttribute("aria-live", "polite");

    var actions = document.createElement("div");
    actions.className = "omc-topbar__actions";

    var timeSlot = document.createElement("div");
    timeSlot.className = "omc-topbar__context-slot";
    timeSlot.title = "Temporal context — lands in Phase 10 (Life Replay)";
    timeSlot.textContent = "Time: current";

    var relSlot = document.createElement("div");
    relSlot.className = "omc-topbar__context-slot";
    relSlot.title = "Relationship context — lands in Phase 11";
    relSlot.textContent = "Solo view";

    var paletteBtn = document.createElement("button");
    paletteBtn.className = "omc-btn";
    paletteBtn.id = "omc-command-palette-trigger";
    paletteBtn.setAttribute("aria-haspopup", "dialog");
    paletteBtn.innerHTML =
      'Explorer <span class="omc-kbd">\u2318K</span>';
    paletteBtn.addEventListener("click", onOpenCommandPalette);

    actions.appendChild(timeSlot);
    actions.appendChild(relSlot);
    actions.appendChild(paletteBtn);

    bar.appendChild(breadcrumb);
    bar.appendChild(actions);

    container.appendChild(bar);

    return {
      el: bar,
      setBreadcrumb: function (label) {
        breadcrumb.innerHTML = "";
        var strong = document.createElement("strong");
        strong.textContent = label;
        breadcrumb.appendChild(strong);
      },
    };
  }

  global.OMCShell = global.OMCShell || {};
  global.OMCShell.mountTopContextBar = mountTopContextBar;
})(window);
