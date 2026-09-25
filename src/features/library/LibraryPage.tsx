import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  BookOpen,
  Search,
  X,
  Clock,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { LibraryArticle } from '../../types/library';
import { LIBRARY_ARTICLES } from '../../services/library-data';
import { SystemId } from '../../types/systems';

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

  return (
    <Box sx={{ py: 6, minHeight: '100vh', backgroundColor: '#0B0E17' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
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
            borderBottom: '1px solid #1E2638',
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
                    backgroundColor: selectedLevel === lvl ? 'rgba(224, 201, 154, 0.15)' : '#121726',
                    color: selectedLevel === lvl ? '#E0C99A' : '#94A3B8',
                    border: '1px solid',
                    borderColor: selectedLevel === lvl ? '#E0C99A' : '#222B3D',
                    fontSize: '0.72rem',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
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
              <Card
                key={article.id}
                onClick={() => setReadingArticle(article)}
                sx={{
                  backgroundColor: '#111624',
                  border: '1px solid #1E283D',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#E0C99A',
                    transform: 'translateY(-2px)',
                    backgroundColor: '#131A2B',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      label={article.categoryName}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.68rem',
                        backgroundColor: 'rgba(224, 201, 154, 0.12)',
                        color: '#E0C99A',
                        border: '1px solid rgba(224, 201, 154, 0.25)',
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8' }}>
                      <Clock size={12} />
                      <Typography variant="caption">{article.readTime}</Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ color: '#EDF1F7', fontFamily: '"Cinzel", serif', fontWeight: 600, mb: 0.8, lineHeight: 1.25 }}>
                    {article.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9BB8DE', display: 'block', mb: 1.5 }}>
                    {article.subtitle}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8125rem', mb: 2.5, lineHeight: 1.5 }}>
                    {article.summary}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {article.tags.map((t) => (
                      <Chip key={t} label={t} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#161F33', color: '#CBD5E1' }} />
                    ))}
                  </Box>
                </CardContent>

                <Box sx={{ px: 3, pb: 2.5, pt: 1, borderTop: '1px solid #1A2438', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={article.level} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                  <Button size="small" endIcon={<ArrowRight size={14} />} sx={{ color: '#E0C99A', p: 0, minWidth: 0 }}>
                    Read Guide
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Reader Modal */}
      {readingArticle && (
        <Dialog
          open={Boolean(readingArticle)}
          onClose={() => setReadingArticle(null)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
              },
            },
          }}
        >
          <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1E2638', p: 3 }}>
            <Box>
              <Chip label={readingArticle.categoryName} size="small" sx={{ mb: 1, backgroundColor: 'rgba(224, 201, 154, 0.1)', color: '#E0C99A' }} />
              <Typography variant="h5" component="div" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', fontWeight: 700 }}>
                {readingArticle.title}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#94A3B8', mt: 0.5 }}>
                {readingArticle.subtitle} · {readingArticle.readTime} ({readingArticle.level})
              </Typography>
            </Box>
            <IconButton onClick={() => setReadingArticle(null)} size="small" sx={{ color: '#94A3B8' }}>
              <X size={20} />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3.5, overflowY: 'auto' }}>
            <Typography variant="body1" sx={{ color: '#D4DCED', fontStyle: 'italic', mb: 3, p: 2, borderRadius: 2, backgroundColor: '#0E1322', borderLeft: '3px solid #E0C99A' }}>
              {readingArticle.summary}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {readingArticle.sections.map((sec, idx) => (
                <Box key={idx}>
                  <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', mb: 1 }}>
                    {sec.heading}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#94A3B8', lineHeight: 1.7, mb: sec.keyPoints ? 1.5 : 0 }}>
                    {sec.body}
                  </Typography>
                  {sec.keyPoints && (
                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#0E1322', border: '1px solid #1E283D', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', fontWeight: 600, display: 'block', mb: 1 }}>
                        Core Principles
                      </Typography>
                      {sec.keyPoints.map((kp, kpIdx) => (
                        <Box key={kpIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                          <CheckCircle2 size={14} className="text-amber-400 mt-1 flex-shrink-0" />
                          <Typography variant="body2" sx={{ color: '#D4DCED' }}>
                            {kp}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </DialogContent>

          <Box sx={{ px: 3, py: 2, borderTop: '1px solid #1E2638', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={() => setReadingArticle(null)} sx={{ color: '#94A3B8' }}>
              Close Article
            </Button>
            {onStartCalculationForSystem && readingArticle.category !== 'fundamentals' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  const sysId = readingArticle.category as SystemId;
                  setReadingArticle(null);
                  onStartCalculationForSystem(sysId);
                }}
                endIcon={<ArrowRight size={16} />}
              >
                Calculate {readingArticle.categoryName} Chart
              </Button>
            )}
          </Box>
        </Dialog>
      )}
    </Box>
  );
};
