// The article content now lives in per-system files under
// `src/features/library/data/` (astrology.ts, human-design.ts, etc.)
// instead of one large flat file. This module is kept only so any
// existing `from '../services/library-data'` imports keep working.
export { LIBRARY_ARTICLES, LIBRARY_ARTICLES_BY_SYSTEM } from '../features/library/data';
