// Phase 01 lint baseline — intentionally minimal. Purpose is a
// build/test/lint baseline existing (per roadmap Phase 01 task list),
// not enforcing a house style yet. Later phases can tighten this.
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly' },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      // Downgraded, not disabled: src/core/engine.js is a verbatim Phase 01
      // extraction and is expected to trip this on a couple of pre-existing
      // dead-store patterns from the monolith. See docs/ARCHITECTURE.md
      // "Lint findings inherited from legacy" — fixing these is deferred to
      // the lens phase that owns the affected system, not Phase 01.
      'no-useless-assignment': 'warn',
    },
  },
  {
    ignores: ['src/legacy/**'], // legacy monolith kept verbatim for reference; not linted
  },
];
