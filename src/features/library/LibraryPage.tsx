import React, { useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Chip,
  Button,
  InputAdornment,
} from '@mui/material';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import { LibraryArticle } from '../../types/library';
import { LIBRARY_ARTICLES } from './data';
import { SystemId } from '../../types/systems';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';

interface LibraryPageProps {
  initialCategory?: SystemId | 'all';
  onStartCalculationForSystem?: (systemId: SystemId) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  initialCategory = 'all',
  onStartCalculationForSystem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [readingArticle, setReadingArticle] = useState<LibraryArticle | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { id: 'all', label: 'All Systems' },
    { id: 'astrology', label: 'Astrology' },
    { id: 'human-design', label: 'Human Design' },
    { id: 'numerology', label: 'Numerology' },
    { id: 'bazi', label: 'BaZi' },
    { id: 'zi-wei-dou-shu', label: 'Zi Wei Dou Shu' },
    { id: 'tzolkin', label: 'Tzolkin' },
  ];

  const filteredArticles = LIBRARY_ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || article.level === selectedLevel;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      article.subtitle.toLowerCase().includes(q) ||
      article.summary.toLowerCase().includes(q) ||
      article.tags.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Open the article inline, replacing the grid, instead of in a modal.
  const handleSelectArticle = (article: LibraryArticle) => {
    setReadingArticle(article);
    // Wait for the reader panel to mount/update before scrolling to it.
    requestAnimationFrame(() => {
      readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleBackToGrid = () => {
    setReadingArticle(null);
  };

  return (
    <Box
      sx={{
        py: 6,
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#000000',
        backgroundImage: 'url(/backgrounds/library-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          {readingArticle && (
            <Button
              onClick={handleBackToGrid}
              startIcon={<ArrowLeft size={16} />}
              size="small"
              sx={{
                color: '#E0C99A',
                mb: 2,
                pl: 0,
                '&:hover': { backgroundColor: 'transparent', opacity: 0.8 },
              }}
            >
              Back to Library
            </Button>
          )}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(224, 201, 154, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E0C99A',
              }}
            >
              <BookOpen size={16} />
            </Box>
            <Typography variant="overline" sx={{ color: '#E0C99A', letterSpacing: '0.12em' }}>
              Metaphysica Codex
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Cinzel", serif',
              color: '#EDF1F7',
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.8rem' },
            }}
          >
            Educational Library
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', mt: 1, maxWidth: 680 }}>
            Curated treatises, foundational mechanics, mathematical concepts, and interpretation methodology across all six sovereign metaphysical systems.
          </Typography>
        </Box>

        {/* Filter Controls Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #1A1A1A',
          }}
        >
          {/* Categories Tab Bar */}
          <Tabs
            value={selectedCategory}
            onChange={(_, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 44 }}
          >
            {categories.map((c) => (
              <Tab
                key={c.id}
                value={c.id}
                label={c.label}
                sx={{
                  color: selectedCategory === c.id ? '#E0C99A' : '#94A3B8',
                  minHeight: 44,
                  fontSize: '0.8125rem',
                }}
              />
            ))}
          </Tabs>

          {/* Search Field */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search concepts, tags, systems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} className="text-slate-400" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: 260 }}
            />

            {/* Level Selector */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <Chip
                  key={lvl}
                  label={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  size="small"
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedLevel === lvl ? 'rgba(224, 201, 154, 0.15)' : '#080808',
                    color: selectedLevel === lvl ? '#E0C99A' : '#94A3B8',
                    border: '1px solid',
                    borderColor: selectedLevel === lvl ? '#E0C99A' : '#1C1C1C',
                    fontSize: '0.72rem',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Content area: either the article grid, or the full article reader in its place */}
        {readingArticle ? (
          <ArticleReader
            ref={readerRef}
            article={readingArticle}
            onClose={handleBackToGrid}
            onStartCalculationForSystem={onStartCalculationForSystem}
          />
        ) : filteredArticles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#94A3B8', fontFamily: '"Cinzel", serif' }}>
              No articles found matching criteria.
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedLevel('All');
              }}
              sx={{ mt: 2, color: '#E0C99A' }}
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isActive={false}
                onSelect={handleSelectArticle}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};
