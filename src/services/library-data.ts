import { LibraryArticle } from '../types/library';

export const LIBRARY_ARTICLES: LibraryArticle[] = [
  // Astrology
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

  // Human Design
  {
    id: 'hd-nine-centers',
    category: 'human-design',
    categoryName: 'Human Design',
    title: 'The Nine Centers of the Bodygraph',
    subtitle: 'Fixed Electromagnetic Consistency vs Open Sensory Attunement',
    readTime: '7 min read',
    level: 'Beginner',
    tags: ['Bodygraph', 'Centers', 'Chakras', 'Conditioning'],
    summary: 'How energy moves through defined (colored) and undefined (white) hubs in your bio-energetic design.',
    sections: [
      {
        heading: 'The Nature of Definition',
        body: 'In Human Design, defined centers possess a consistent, fixed broadcast frequency that you emit into the world. Undefined or open centers lack fixed energy; they act as porous antennae, amplifying the energetic environment and serving as the primary school of conditioning.',
        keyPoints: [
          'Defined = Reliable broadcast energy and fixed personal mechanics',
          'Open/Undefined = Sensory reception, potential wisdom, and vulnerability to mental conditioning',
        ],
      },
      {
        heading: 'The Four Motor Centers',
        body: 'Life movement relies on four engines: the Sacral (pure generative endurance), Heart/Ego (willpower and material drive), Solar Plexus (emotional waves), and Root (adrenal pressure).',
      },
    ],
  },
  {
    id: 'hd-auric-types',
    category: 'human-design',
    categoryName: 'Human Design',
    title: 'The Four Aura Types & Inner Authority',
    subtitle: 'Generators, Manifestors, Projectors, and Reflectors',
    readTime: '9 min read',
    level: 'Intermediate',
    tags: ['Aura Types', 'Strategy', 'Authority', 'Deconditioning'],
    summary: 'Understand the electromagnetic architecture of human auras and the non-mental decision compass.',
    sections: [
      {
        heading: 'Aura Mechanics',
        body: 'Every human being is enveloped in an auric field extending approximately two arm-lengths in all directions. Generators have open, enveloping auras; Manifestors have closed, repelling auras that create pathways; Projectors have focused, penetrating auras designed to recognize others; Reflectors have sampling, Teflon-like auras that gauge collective health.',
      },
    ],
  },

  // Numerology
  {
    id: 'numerology-sacred-geometry',
    category: 'numerology',
    categoryName: 'Numerology',
    title: 'Pythagorean Numerology & The Vibrational Monad',
    subtitle: 'From Number 1 to 9: The Cyclical Journey of Creation',
    readTime: '5 min read',
    level: 'Beginner',
    tags: ['Life Path', 'Pythagoras', 'Master Numbers', 'Cycles'],
    summary: 'Deciphering numbers as ontological building blocks of consciousness rather than mere quantitative counters.',
    sections: [
      {
        heading: 'The Pythagorean Principle',
        body: 'Pythagoras taught that "all things are numbers." In metaphysical mathematics, numbers are living qualitative states. 1 represents the initial spark of source consciousness, 2 introduces the dialectic of polarity, 3 brings synthesis and generative creation, and 4 anchors physical form.',
      },
      {
        heading: 'Master Numbers (11, 22, 33)',
        body: 'Master numbers carry double-digit identical frequencies that resist premature reduction. They indicate intensified evolutionary tension and service to broader human evolution.',
      },
    ],
  },

  // BaZi
  {
    id: 'bazi-four-pillars-introduction',
    category: 'bazi',
    categoryName: 'BaZi',
    title: 'BaZi: The Art of the Four Pillars of Destiny',
    subtitle: 'Tian Gan, Di Zhi, and the Cosmic Solar Calendar',
    readTime: '8 min read',
    level: 'Intermediate',
    tags: ['Tian Gan', 'Di Zhi', 'Day Master', 'Wu Xing'],
    summary: 'How classical Chinese metaphysics charts the distribution of the Five Elements (Wood, Fire, Earth, Metal, Water) at birth.',
    sections: [
      {
        heading: 'Heavenly Stems and Earthly Branches',
        body: 'BaZi translates literally to "Eight Characters." Each temporal pillar consists of a Heavenly Stem (manifest celestial energy) resting atop an Earthly Branch (terrestrial vessel harboring hidden elemental stems).',
        keyPoints: [
          'Year Pillar represents ancestry, grandparents, and outer social reputation',
          'Month Pillar denotes career, parental environment, and seasonal Qi strength',
          'Day Pillar reflects the core self (Day Master) and domestic/spousal partnership',
          'Hour Pillar embodies future creations, children, and late-life fulfillment',
        ],
      },
    ],
  },

  // Zi Wei Dou Shu
  {
    id: 'zi-wei-dou-shu-imperial-astrology',
    category: 'zi-wei-dou-shu',
    categoryName: 'Zi Wei Dou Shu',
    title: 'Zi Wei Dou Shu: The Imperial Court of Stars',
    subtitle: 'The 12 Palaces, Emperor Stars, and the Four Cosmic Transformations',
    readTime: '10 min read',
    level: 'Advanced',
    tags: ['Imperial Stars', 'Si Hua', 'Ming Gong', 'Palaces'],
    summary: 'An introduction to China’s highest-level astrological tradition used by ancient imperial court counselors.',
    sections: [
      {
        heading: 'The 12 Palaces of Experience',
        body: 'Zi Wei Dou Shu places human existence onto a grid of 12 interconnected palaces. The Life Palace (Ming Gong) commands the entire chart. The San Fang Si Zheng (The Three Harmonious Triads) interconnects Life, Wealth, Career, and Travel palaces.',
      },
      {
        heading: 'The Four Transformations (Si Hua)',
        body: 'The catalysts that bring static stars to life are the Four Transformations: Hua Lu (Wealth & Flow), Hua Quan (Authority & Execution), Hua Ke (Fame & Honor), and Hua Ji (Karmic Friction & Debt).',
      },
    ],
  },

  // Tzolkin
  {
    id: 'tzolkin-sacred-matrix',
    category: 'tzolkin',
    categoryName: 'Tzolkin',
    title: 'The Tzolkin: Galactic Synchronization',
    subtitle: '260 Days, 20 Solar Seals, and 13 Creation Rays',
    readTime: '6 min read',
    level: 'Beginner',
    tags: ['Maya', 'Galactic Kin', 'Solar Seals', 'Harmonic Matrix'],
    summary: 'Synchronizing human neurobiology with 4th-dimensional time cycles through the sacred Mayan harmonic count.',
    sections: [
      {
        heading: 'The 13:20 Harmonic Frequency',
        body: 'Unlike artificial mechanical time based on the 12:60 clock and calendar, the Tzolkin operates on 13:20 natural harmonic timing. 13 represents the thirteen primary joints in the human body and the thirteen lunar cycles, while 20 reflects the twenty human fingers and toes and the twenty archetypal solar seals.',
      },
      {
        heading: 'The Galactic Cross (Destiny Oracle)',
        body: 'Your Kin does not walk alone; it is held by an archetypal council: the Guide Kin directs your higher path, the Antipode Kin strengthens you through contrast, the Analog Kin supports you with effortless kinship, and the Occult Kin reveals hidden subconscious magic.',
      },
    ],
  },
];
