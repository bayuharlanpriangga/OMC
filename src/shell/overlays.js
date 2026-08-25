/*
 * OMC 2.0 — Overlay primitives: Modal, Drawer, DetailPanel (Phase 02)
 *
 * Generic, content-agnostic containers. Evidence/Intelligence content
 * (EvidenceDrawer, insight detail, etc.) is built by later phases on top
 * of these — this file only implements open/close, backdrop, Escape-to-
 * close, and focus trapping (Accessibility §21: focus management for
 * drawers/modals).
 */

(function (global) {
  var FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  var backdropEl = null;
  var openStack = []; // stack of currently open overlay controllers

  function getBackdrop() {
    if (!backdropEl) {
      backdropEl = document.createElement("div");
      backdropEl.className = "omc-overlay-backdrop";
      backdropEl.setAttribute("data-open", "false");
      document.body.appendChild(backdropEl);
    }
    return backdropEl;
  }

  function trapFocus(container, event) {
    var focusable = Array.prototype.slice.call(
      container.querySelectorAll(FOCUSABLE_SELECTOR)
    );
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function createOverlay(kind, options) {
    options = options || {};
    var className =
      kind === "drawer"
        ? "omc-drawer"
        : kind === "detail-panel"
        ? "omc-detail-panel"
        : "omc-modal";
    var useBackdrop = kind !== "detail-panel";

    var el = document.createElement(kind === "detail-panel" ? "aside" : "div");
    el.className = className;
    el.setAttribute("data-open", "false");
    el.setAttribute("role", kind === "detail-panel" ? "complementary" : "dialog");
    if (kind !== "detail-panel") {
      el.setAttribute("aria-modal", "true");
    }
    if (options.labelledBy) {
      el.setAttribute("aria-labelledby", options.labelledBy);
    }

    var header = document.createElement("div");
    header.className = "omc-overlay__header";

    var titleEl = document.createElement("h3");
    titleEl.id = options.titleId || kind + "-title-" + Math.random().toString(36).slice(2, 8);
    titleEl.textContent = options.title || "";
    el.setAttribute("aria-labelledby", titleEl.id);

    var closeBtn = document.createElement("button");
    closeBtn.className = "omc-btn omc-btn--icon omc-overlay__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u2715"; // ✕
    closeBtn.addEventListener("click", function () {
      controller.close();
    });

    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    el.appendChild(header);

    var body = document.createElement("div");
    body.className = "omc-overlay__body";
    el.appendChild(body);

    if (options.bodyEl) {
      body.appendChild(options.bodyEl);
    } else if (options.bodyHTML) {
      body.innerHTML = options.bodyHTML;
    }

    document.body.appendChild(el);

    var lastFocused = null;

    function onKeydown(event) {
      if (event.key === "Escape") {
        controller.close();
        return;
      }
      if (event.key === "Tab") {
        trapFocus(el, event);
      }
    }

    function onBackdropClick() {
      controller.close();
    }

    var controller = {
      el: el,
      body: body,
      isOpen: false,
      open: function () {
        if (controller.isOpen) return;
        controller.isOpen = true;
        lastFocused = document.activeElement;
        el.setAttribute("data-open", "true");
        if (useBackdrop) {
          var bd = getBackdrop();
          bd.setAttribute("data-open", "true");
          bd.addEventListener("click", onBackdropClick);
        }
        document.addEventListener("keydown", onKeydown, true);
        openStack.push(controller);
        var focusable = el.querySelector(FOCUSABLE_SELECTOR);
        (focusable || el).focus();
        if (typeof options.onOpen === "function") options.onOpen();
      },
      close: function () {
        if (!controller.isOpen) return;
        controller.isOpen = false;
        el.setAttribute("data-open", "false");
        document.removeEventListener("keydown", onKeydown, true);
        openStack = openStack.filter(function (c) {
          return c !== controller;
        });
        if (useBackdrop && openStack.every(function (c) {
          return c.el.getAttribute("data-open") !== "true" || c === controller;
        })) {
          var stillNeedsBackdrop = openStack.some(function (c) {
            return c.el.className !== "omc-detail-panel";
          });
          if (!stillNeedsBackdrop) {
            var bd = getBackdrop();
            bd.setAttribute("data-open", "false");
            bd.removeEventListener("click", onBackdropClick);
          }
        }
        if (lastFocused && typeof lastFocused.focus === "function") {
          lastFocused.focus();
        }
        if (typeof options.onClose === "function") options.onClose();
      },
      destroy: function () {
        controller.close();
        el.remove();
      },
      setTitle: function (text) {
        titleEl.textContent = text;
      },
    };

    return controller;
  }

  global.OMCShell = global.OMCShell || {};
  global.OMCShell.overlays = {
    createModal: function (options) {
      return createOverlay("modal", options);
    },
    createDrawer: function (options) {
      return createOverlay("drawer", options);
    },
    createDetailPanel: function (options) {
      return createOverlay("detail-panel", options);
    },
  };
})(window);
