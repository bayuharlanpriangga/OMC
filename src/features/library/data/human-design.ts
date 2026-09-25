import { LibraryArticle } from '../../../types/library';

export const HUMAN_DESIGN_ARTICLES: LibraryArticle[] = [
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
];
