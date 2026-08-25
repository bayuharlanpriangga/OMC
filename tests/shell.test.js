// @vitest-environment jsdom
//
// Phase 02 shell smoke test. Extends the Phase 01 test baseline (does not
// replace tests/regression.test.js). Scope: the app shell mounts, every
// route in src/shell/routes.js renders without throwing, and the command
// palette opens. This does NOT test visual layout/CSS (jsdom has no
// layout engine) or any feature content — later phases add their own
// tests for their own pages as they replace the placeholders here.

import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');

async function mountShell() {
  const errors = [];
  const dom = new JSDOM(html, {
    url: 'file://' + repoRoot + '/index.html',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.addEventListener('error', (e) => {
        errors.push(e.error ? e.error.stack || e.message : e.message);
      });
      window.scrollTo = () => {};
    },
  });
  // Local <script src="src/shell/*.js"> tags load asynchronously even
  // with runScripts: 'dangerously'; give them a tick to execute.
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { dom, errors };
}

describe('Phase 02 app shell', () => {
  let dom;

  afterEach(() => {
    if (dom) dom.window.close();
  });

  it('mounts sidebar, topbar, bottom nav, and main content with no runtime errors', async () => {
    const mounted = await mountShell();
    dom = mounted.dom;
    const doc = dom.window.document;

    expect(mounted.errors).toEqual([]);
    expect(doc.getElementById('omc-app')).toBeTruthy();
    expect(doc.getElementById('omc-sidebar')).toBeTruthy();
    expect(doc.getElementById('omc-topbar')).toBeTruthy();
    expect(doc.getElementById('omc-bottomnav')).toBeTruthy();
    expect(doc.getElementById('omc-main')).toBeTruthy();
  });

  it('renders the Home route with the hero statement by default', async () => {
    const mounted = await mountShell();
    dom = mounted.dom;
    const doc = dom.window.document;

    expect(doc.querySelector('.omc-hero-statement')).toBeTruthy();
  });

  it('renders sidebar items for all 8 primary routes plus 5 system sub-routes', async () => {
    const mounted = await mountShell();
    dom = mounted.dom;
    const doc = dom.window.document;

    expect(doc.querySelectorAll('.omc-sidebar__item').length).toBe(8 + 5);
  });

  it('navigates to every route without throwing and shows an honest placeholder (no invented content)', async () => {
    const mounted = await mountShell();
    dom = mounted.dom;
    const { window } = dom;
    const doc = window.document;

    const routePaths = [
      'systems',
      'systems/astrology',
      'systems/human-design',
      'systems/bazi',
      'systems/ziwei',
      'systems/numerology',
      'patterns',
      'timeline',
      'relationships',
      'explorer',
      'personal-os',
      'settings',
      '',
    ];

    for (const p of routePaths) {
      window.location.hash = '#/' + p;
      window.dispatchEvent(new window.Event('hashchange'));
    }

    expect(mounted.errors).toEqual([]);
    // Last route in the loop is Home again; navigate to one placeholder
    // route and confirm it names its owning phase rather than faking data.
    window.location.hash = '#/systems/astrology';
    window.dispatchEvent(new window.Event('hashchange'));
    expect(doc.querySelector('.omc-placeholder-page').textContent).toMatch(
      /Phase 4/
    );
  });

  it('opens the command palette shell from the top bar trigger', async () => {
    const mounted = await mountShell();
    dom = mounted.dom;
    const { window } = dom;
    const doc = window.document;

    const trigger = doc.getElementById('omc-command-palette-trigger');
    expect(trigger).toBeTruthy();
    trigger.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

    const palette = doc.querySelector('.omc-command-palette');
    expect(palette.getAttribute('data-open')).toBe('true');
  });
});
