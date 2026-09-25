import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Button } from '@mui/material';
import { Clock, ArrowRight } from 'lucide-react';
import { LibraryArticle } from '../../../types/library';

interface ArticleCardProps {
  article: LibraryArticle;
  isActive: boolean;
  onSelect: (article: LibraryArticle) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isActive, onSelect }) => {
  return (
    <Card
      onClick={() => onSelect(article)}
      sx={{
        backgroundColor: isActive ? '#0F0F0F' : '#080808',
        border: '1px solid',
        borderColor: isActive ? '#E0C99A' : '#1C1C1C',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#E0C99A',
          transform: 'translateY(-2px)',
          backgroundColor: '#0F0F0F',
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
            <Chip key={t} label={t} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#121212', color: '#CBD5E1' }} />
          ))}
        </Box>
      </CardContent>

      <Box sx={{ px: 3, pb: 2.5, pt: 1, borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip label={article.level} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
        <Button size="small" endIcon={<ArrowRight size={14} />} sx={{ color: '#E0C99A', p: 0, minWidth: 0 }}>
          {isActive ? 'Reading Now' : 'Read Guide'}
        </Button>
      </Box>
    </Card>
  );
};
