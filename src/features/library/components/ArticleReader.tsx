import React from 'react';
import { Box, Typography, Chip, IconButton, Button } from '@mui/material';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LibraryArticle } from '../../../types/library';
import { SystemId } from '../../../types/systems';

interface ArticleReaderProps {
  article: LibraryArticle;
  onClose: () => void;
  onStartCalculationForSystem?: (systemId: SystemId) => void;
}

/**
 * Renders the full article body inline, in-page (instead of a modal Dialog).
 * The parent LibraryPage mounts this at the bottom of the page and scrolls
 * it into view whenever a new article is selected.
 */
export const ArticleReader = React.forwardRef<HTMLDivElement, ArticleReaderProps>(
  ({ article, onClose, onStartCalculationForSystem }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          mt: 5,
          borderRadius: 3,
          border: '1px solid #1E2638',
          backgroundColor: 'rgba(8, 8, 8, 0.92)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid #1E2638',
            p: { xs: 2.5, md: 3 },
          }}
        >
          <Box>
            <Chip
              label={article.categoryName}
              size="small"
              sx={{ mb: 1, backgroundColor: 'rgba(224, 201, 154, 0.1)', color: '#E0C99A' }}
            />
            <Typography variant="h5" component="div" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', fontWeight: 700 }}>
              {article.title}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#94A3B8', mt: 0.5 }}>
              {article.subtitle} · {article.readTime} ({article.level})
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }} aria-label="Close article">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Typography
            variant="body1"
            sx={{
              color: '#D4DCED',
              fontStyle: 'italic',
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#0E1322',
              borderLeft: '3px solid #E0C99A',
            }}
          >
            {article.summary}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {article.sections.map((sec, idx) => (
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
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: { xs: 2.5, md: 3 },
            py: 2,
            borderTop: '1px solid #1E2638',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
            Close Article
          </Button>
          {onStartCalculationForSystem && article.category !== 'fundamentals' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onStartCalculationForSystem(article.category as SystemId)}
              endIcon={<ArrowRight size={16} />}
            >
              Calculate {article.categoryName} Chart
            </Button>
          )}
        </Box>
      </Box>
    );
  }
);

ArticleReader.displayName = 'ArticleReader';
