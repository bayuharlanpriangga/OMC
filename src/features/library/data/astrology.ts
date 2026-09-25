import { LibraryArticle } from '../../../types/library';

export const ASTROLOGY_ARTICLES: LibraryArticle[] = [
  {
    id: 'astrology-chart-mechanics',
    category: 'astrology',
    categoryName: 'Astrology',
    title: 'The Anatomy of the Astrological Wheel',
    subtitle: 'From Horizon to Meridian: Understanding Houses, Angles, and Planetary Geometry',
    readTime: '6 min read',
    level: 'Beginner',
    tags: ['Zodiac', 'Houses', 'Ascendant', 'Aspects'],
    summary: 'An exploration of how the 360-degree celestial sphere is projected onto a two-dimensional natal wheel.',
    sections: [
      {
        heading: 'The Eastern Horizon & The Ascendant',
        body: 'The exact minute you take your first independent breath, a specific degree of the ecliptic is cresting the eastern horizon. Known as the Ascendant or Rising sign, this point anchors the entire house structure. It is the threshold between the invisible underworld (houses 1 through 6) and the visible upper hemisphere (houses 7 through 12).',
        keyPoints: [
          'Earth rotates 1° every four minutes, altering house cusps swiftly',
          'The Ascendant represents physical embodiment and interface with reality',
          'Opposite the Ascendant lies the Descendant (7th house cusp), governing otherness',
        ],
      },
      {
        heading: 'House Systems: Spatial vs Temporal Divisions',
        body: 'Astrologers divide the daily circle of Earth into 12 houses through various mathematical systems. Quadrant systems like Placidus divide the diurnal arcs of time, while Whole Sign assigns each 30-degree zodiac constellation its own house.',
      },
      {
        heading: 'Major Aspects & Harmonic Angles',
        body: 'Aspects are geometric conversations between celestial bodies. Conjunctions (0°) fuse energies, Oppositions (180°) demand relational equilibrium, Squares (90°) generate dynamic friction requiring evolutionary growth, and Trines (120°) indicate effortless natural flow.',
      },
    ],
  },
  {
    id: 'astrology-draconic-astrology',
    category: 'astrology',
    categoryName: 'Astrology',
    title: 'Draconic Astrology: The Soul Blueprint',
    subtitle: 'Orienting to the Lunar Nodes to Unveil Transpersonal Destiny',
    readTime: '8 min read',
    level: 'Advanced',
    tags: ['Draconic', 'Karmic', 'North Node', 'Soul'],
    summary: 'A deep dive into the 0° Aries nodal orientation that unlocks your soul’s subconscious trajectory.',
    sections: [
      {
        heading: 'The Dragon’s Head and Tail',
        body: 'While standard tropical astrology is referenced to the Sun’s vernal equinox, Draconic astrology resets the primary coordinate origin to the True North Node of the Moon. By designating the North Node as 0° Aries, the entire chart rotates to reveal pre-incarnational contracts.',
      },
    ],
  },
];
