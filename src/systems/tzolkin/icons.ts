import { SolarSeal } from './types';

/**
 * Maps each of the 20 Solar Seals (by number) to its prepared nawal icon
 * filename in /public/tzolkin/nawal/.
 */
const SEAL_ICON_FILENAMES: Record<number, string> = {
  1: 'tzolkin-red-dragon.png',
  2: 'tzolkin-white-wind.png',
  3: 'tzolkin-blue-night.png',
  4: 'tzolkin-yellow-seed.png',
  5: 'tzolkin-red-serpent.png',
  6: 'tzolkin-white-world-bridger.png',
  7: 'tzolkin-blue-hand.png',
  8: 'tzolkin-yellow-star.png',
  9: 'tzolkin-red-moon.png',
  10: 'tzolkin-white-dog.png',
  11: 'tzolkin-blue-monkey.png',
  12: 'tzolkin-yellow-human.png',
  13: 'tzolkin-red-skywalker.png',
  14: 'tzolkin-white-wizard.png',
  15: 'tzolkin-blue-eagle.png',
  16: 'tzolkin-yellow-warrior.png',
  17: 'tzolkin-red-earth.png',
  18: 'tzolkin-white-mirror.png',
  19: 'tzolkin-blue-storm.png',
  20: 'tzolkin-yellow-sun.png',
};

/** Returns the public path to the nawal icon for a given Solar Seal. */
export function getSealIconPath(seal: Pick<SolarSeal, 'number'>): string {
  const filename = SEAL_ICON_FILENAMES[seal.number];
  return filename ? `/tzolkin/nawal/${filename}` : '';
}

/**
 * Returns the public path to the Galactic Castle icon, based on the castle's
 * color (the first word of its name, e.g. "Blue Castle of Burning" -> blue).
 */
export function getCastleIconPath(castleName: string): string {
  const color = castleName.trim().split(/\s+/)[0]?.toLowerCase();
  const validColors = ['red', 'white', 'blue', 'yellow', 'green'];
  if (!color || !validColors.includes(color)) return '';
  return `/tzolkin/castle/tzolkin-${color}-castle.png`;
}
