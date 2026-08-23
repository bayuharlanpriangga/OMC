// Generates regression fixtures by running the extracted engine against a
// representative set of inputs. These snapshots are Phase 01's proof that
// extraction did not change behavior — later phases must keep matching them
// unless a phase explicitly owns a calculation fix (and updates + documents it).
import { computeChart } from '../src/core/engine.js';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'tests', 'fixtures');
mkdirSync(outDir, { recursive: true });

// Cases carried over from the legacy VALIDATION_CASES (index.html ~line 6038),
// plus additional edge cases for Phase 01 coverage.
const CASES = [
  { id: 'bayu-real', name: 'Bayu (real)', date: '2005-04-18', time: '10:28', city: 'test', lat: -6.732, lon: 108.552, tz: 7 },
  { id: 'j2000', name: 'J2000 test', date: '2000-01-01', time: '12:00', city: 'test', lat: 0, lon: 0, tz: 0 },
  { id: 'pre-lichun-1995', name: 'Feb 3 1995 (before lichun)', date: '1995-02-03', time: '12:00', city: 'test', lat: -6.2, lon: 106.8, tz: 7 },
  { id: 'post-lichun-1995', name: 'Feb 6 1995 (after lichun)', date: '1995-02-06', time: '12:00', city: 'test', lat: -6.2, lon: 106.8, tz: 7 },
  // Additional Phase 01 fixtures — southern hemisphere, no birth time,
  // extreme longitude, and a leap-year/DST-adjacent date.
  { id: 'no-birth-time', name: 'No time given', date: '1990-07-15', time: '', city: 'test', lat: -6.2, lon: 106.8, tz: 7 },
  { id: 'southern-extreme', name: 'Sydney extreme', date: '1988-12-25', time: '23:45', city: 'test', lat: -33.87, lon: 151.21, tz: 11 },
  { id: 'western-hemisphere', name: 'New York', date: '1975-03-10', time: '06:00', city: 'test', lat: 40.71, lon: -74.0, tz: -5 },
  { id: 'leap-day', name: 'Leap day', date: '2004-02-29', time: '00:15', city: 'test', lat: 35.68, lon: 139.69, tz: 9 },
];

const fixtures = {};
for (const c of CASES) {
  const D = computeChart(c.name, c.date, c.time, c.city, c.lat, c.lon, c.tz);
  fixtures[c.id] = { input: c, output: D };
}

writeFileSync(path.join(outDir, 'engine-snapshots.json'), JSON.stringify(fixtures, null, 2));
console.log(`Wrote ${Object.keys(fixtures).length} fixtures to tests/fixtures/engine-snapshots.json`);
