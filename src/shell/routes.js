/*
 * OMC 2.0 — Shell route table (Phase 02)
 *
 * Source: OMC_2_0_10K10_Final_Design_Specification.docx §6 "Information
 * Architecture". Phase 02 builds the shell and navigation for this
 * target IA; it does not implement the features themselves. Every route
 * below (other than Home's shell scaffold) renders a placeholder that
 * names the roadmap phase that owns its real content — see
 * src/shell/router.js renderPlaceholder().
 *
 * "Systems" is one primary route with five sub-routes (one per
 * metaphysical framework) instead of five separate top-level sidebar
 * items, per the design mandate: "No five disconnected systems
 * pretending to be one product."
 */

(function (global) {
  var ROUTES = [
    {
      id: "home",
      label: "Home",
      sub: "Overview platform",
      icon: "\u2726", // ✦
      path: "",
      ownerPhase: null,
      question: "What is the current shape of my model?",
    },
    {
      id: "patterns",
      label: "Patterns",
      sub: "What keeps repeating",
      icon: "\u25c8", // ◈
      path: "patterns",
      ownerPhase: 9,
      question: "What keeps repeating or conflicting?",
    },
    {
      id: "systems",
      label: "Systems",
      sub: "Five frameworks",
      icon: "\u2609", // ☉
      path: "systems",
      ownerPhase: null,
      question: "What does each framework independently show?",
      children: [
        {
          id: "systems-astrology",
          label: "Astrology",
          sub: "Natal chart & planets",
          icon: "\u2609", // ☉
          path: "systems/astrology",
          ownerPhase: 4,
          system: "astrology",
        },
        {
          id: "systems-human-design",
          label: "Human Design",
          sub: "Type, authority & gates",
          icon: "\u25c9", // ◉
          path: "systems/human-design",
          ownerPhase: 5,
          system: "human-design",
        },
        {
          id: "systems-bazi",
          label: "BaZi \u00b7 \u516b\u5b57",
          sub: "Four pillars destiny",
          icon: "\u516b", // 八
          path: "systems/bazi",
          ownerPhase: 6,
          system: "bazi",
        },
        {
          id: "systems-ziwei",
          label: "Zi Wei Dou Shu",
          sub: "Purple star astrology",
          icon: "\u7d2b", // 紫
          path: "systems/ziwei",
          ownerPhase: 7,
          system: "ziwei",
        },
        {
          id: "systems-numerology",
          label: "Numerology",
          sub: "Life path & numbers",
          icon: "\u221e", // ∞
          path: "systems/numerology",
          ownerPhase: 8,
          system: "numerology",
        },
      ],
    },
    {
      id: "timeline",
      label: "Timeline",
      sub: "Life Replay",
      icon: "\u21bb", // ↻ (placeholder glyph; legacy used an svg icon here)
      path: "timeline",
      ownerPhase: 10,
      question: "How does context change through time?",
    },
    {
      id: "relationships",
      label: "Relationships",
      sub: "Two-person dynamics",
      icon: "\u2ad3", // ⚭
      path: "relationships",
      ownerPhase: 11,
      question: "How do two models interact?",
    },
    {
      id: "explorer",
      label: "Explorer",
      sub: "Question-driven evidence",
      icon: "\u2315", // ⌕-like glyph
      path: "explorer",
      ownerPhase: 12,
      question: "Why is this pattern appearing?",
    },
    {
      id: "personal-os",
      label: "Personal OS",
      sub: "Derived operating model",
      icon: "\u25ce", // ◎
      path: "personal-os",
      ownerPhase: 13,
      question: "How can I understand how I operate?",
    },
    {
      id: "settings",
      label: "Settings",
      sub: "Assumptions & privacy",
      icon: "\u2699", // ⚙
      path: "settings",
      ownerPhase: 14,
      question: "What assumptions/data are being used?",
    },
  ];

  // Flat lookup table (id -> route, including children) used by the
  // router and the command palette.
  var FLAT = {};
  ROUTES.forEach(function (route) {
    FLAT[route.id] = route;
    (route.children || []).forEach(function (child) {
      FLAT[child.id] = child;
    });
  });

  // Bottom nav (mobile) only has room for a handful of items — the
  // roadmap's primary five per the legacy nav weighting: Home, Systems,
  // Patterns, Timeline, Explorer.
  var BOTTOM_NAV_IDS = ["home", "systems", "patterns", "timeline", "explorer"];

  global.OMCShell = global.OMCShell || {};
  global.OMCShell.routes = {
    ROUTES: ROUTES,
    FLAT: FLAT,
    BOTTOM_NAV_IDS: BOTTOM_NAV_IDS,
  };
})(window);
