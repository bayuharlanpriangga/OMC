import { LibraryArticle } from '../../../types/library';

export const BAZI_ARTICLES: LibraryArticle[] = [
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
];
