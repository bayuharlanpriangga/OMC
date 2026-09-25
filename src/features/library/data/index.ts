import { LibraryArticle } from '../../../types/library';
import { ASTROLOGY_ARTICLES } from './astrology';
import { HUMAN_DESIGN_ARTICLES } from './human-design';
import { NUMEROLOGY_ARTICLES } from './numerology';
import { BAZI_ARTICLES } from './bazi';
import { ZI_WEI_DOU_SHU_ARTICLES } from './zi-wei-dou-shu';
import { TZOLKIN_ARTICLES } from './tzolkin';

// Each metaphysical system now owns its own article file under `data/`.
// This keeps the content easy to find and extend per system, instead of
// one large flat file holding every article for every system.
export const LIBRARY_ARTICLES_BY_SYSTEM: Record<string, LibraryArticle[]> = {
  astrology: ASTROLOGY_ARTICLES,
  'human-design': HUMAN_DESIGN_ARTICLES,
  numerology: NUMEROLOGY_ARTICLES,
  bazi: BAZI_ARTICLES,
  'zi-wei-dou-shu': ZI_WEI_DOU_SHU_ARTICLES,
  tzolkin: TZOLKIN_ARTICLES,
};

export const LIBRARY_ARTICLES: LibraryArticle[] = [
  ...ASTROLOGY_ARTICLES,
  ...HUMAN_DESIGN_ARTICLES,
  ...NUMEROLOGY_ARTICLES,
  ...BAZI_ARTICLES,
  ...ZI_WEI_DOU_SHU_ARTICLES,
  ...TZOLKIN_ARTICLES,
];

export {
  ASTROLOGY_ARTICLES,
  HUMAN_DESIGN_ARTICLES,
  NUMEROLOGY_ARTICLES,
  BAZI_ARTICLES,
  ZI_WEI_DOU_SHU_ARTICLES,
  TZOLKIN_ARTICLES,
};
