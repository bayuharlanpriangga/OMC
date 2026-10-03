import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { BaseChartResult } from '../../../../types/systems';
import {
  NumerologyCalculationResult,
  NumerologyNumber,
  NumerologyPeriod,
} from '../../../../systems/numerology/types';

/** Satu baris laporan: label + keterangan kecil di kiri, angka (emas) di kanan. */
const ReportRow: React.FC<{ label: string; value: React.ReactNode; caption?: string; highlight?: boolean }> = ({
  label,
  value,
  caption,
  highlight,
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 2,
      py: 0.9,
      borderBottom: '1px solid #172133',
    }}
  >
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: '#EDF1F7', fontWeight: 600 }}>
        {label}
        {highlight && <Chip label="Now" size="small" sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} />}
      </Typography>
      {caption && (
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
          {caption}
        </Typography>
      )}
    </Box>
    <Typography
      variant="body1"
      sx={{ color: '#E0C99A', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right', flexShrink: 0 }}
    >
      {value}
    </Typography>
  </Box>
);

const ageRange = (p: NumerologyPeriod) => (p.endAge === null ? `Age ${p.startAge}+` : `Age ${p.startAge}–${p.endAge}`);

const isCurrentPeriod = (p: NumerologyPeriod, age: number) =>
  age >= p.startAge && (p.endAge === null || age <= p.endAge);

interface NumerologyVisualizationProps {
  result: BaseChartResult<NumerologyCalculationResult>;
}

export const NumerologyVisualization: React.FC<NumerologyVisualizationProps> = ({ result }) => {
  const { data } = result;
  const { lifePathNumber, destinyNumber, soulUrgeNumber, personalityNumber, birthdayNumber, maturityNumber } = data;
  const [reportTab, setReportTab] = useState(0);

  const coreCards = [
    { title: 'Life Path Number', num: lifePathNumber, desc: 'Central cosmic highway and evolutionary curriculum' },
    { title: 'Expression / Destiny', num: destinyNumber, desc: 'Acoustic nominal frequency and natural talents' },
    { title: 'Soul Urge / Heart', num: soulUrgeNumber, desc: 'Subconscious yearnings and spiritual longing' },
    { title: 'Personality Number', num: personalityNumber, desc: 'Outer demeanor and first impression frequency' },
    { title: 'Birthday Number', num: birthdayNumber, desc: 'Specific catalyst gift endowed on day of arrival' },
    { title: 'Maturity Number', num: maturityNumber, desc: 'Mid-life synthesis of Life Path and Destiny' },
  ].filter((c): c is { title: string; num: NumerologyNumber; desc: string } => c.num !== null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Primary Life Path Banner */}
      <Box sx={{ pb: 3, borderBottom: '1px solid #1E283D' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 3 }}>
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: '#161E30',
              border: '2px solid #E0C99A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E0C99A',
              flexShrink: 0,
            }}
          >
            <Typography variant={lifePathNumber.display.length > 3 ? 'h4' : 'h3'} sx={{ fontWeight: 800, lineHeight: 1 }}>
              {lifePathNumber.display}
            </Typography>
            {lifePathNumber.isMasterNumber && (
              <Typography variant="caption" sx={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#FBBF24', textTransform: 'uppercase' }}>
                Master
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', fontWeight: 700 }}>
                {lifePathNumber.name}
              </Typography>
              {lifePathNumber.isMasterNumber && (
                <Chip label="Master Vibration" size="small" sx={{ backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#FDE68A', border: '1px solid #D97706' }} />
              )}
            </Box>
            <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 1 }}>
              "{lifePathNumber.tagline}"
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {lifePathNumber.keywords.map((kw) => (
                <Chip key={kw} label={kw} size="small" sx={{ backgroundColor: '#131929', color: '#94A3B8' }} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Grid of Core Numbers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        {coreCards.map((item, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          const isLastRow = row === Math.floor((coreCards.length - 1) / 2);
          return (
            <Box
              key={item.title}
              sx={{
                py: 2.5,
                pr: { xs: 0, sm: col === 0 ? 3 : 0 },
                pl: { xs: 0, sm: col === 1 ? 3 : 0 },
                borderBottom: { xs: i === coreCards.length - 1 ? 'none' : '1px solid #1E283D', sm: isLastRow ? 'none' : '1px solid #1E283D' },
                borderRight: { xs: 'none', sm: col === 0 ? '1px solid #1E283D' : 'none' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.title}
                </Typography>
                <Box
                  sx={{
                    minWidth: 38,
                    height: 38,
                    px: 1,
                    borderRadius: '19px',
                    backgroundColor: '#141C2E',
                    border: '1px solid #283755',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.num.isMasterNumber ? '#FBBF24' : '#E0C99A',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  {item.num.display}
                </Box>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#EDF1F7', fontWeight: 600, mb: 0.5 }}>
                {item.num.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1.5 }}>
                {item.desc}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {item.num.keywords.slice(0, 3).map((kw) => (
                  <Chip key={kw} label={kw} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: '#161F33', color: '#D4DCED' }} />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Full numerology report: Birth / Name / Hybrid */}
      <Box sx={{ pt: 3, borderTop: '1px solid #1E283D' }}>
        <Box sx={{ borderBottom: '1px solid #1E283D', mb: 1 }}>
          <Tabs value={reportTab} onChange={(_, val) => setReportTab(val)}>
            <Tab label="Birth" />
            <Tab label="Name" />
            <Tab label="Hybrid" />
          </Tabs>
        </Box>

        {/* Tab 0: angka kelahiran, pinnacle, cycle */}
        {reportTab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 4 }}>
            <Box>
              <ReportRow label="Life Path" value={data.birth.lifePath.display} caption="Month + day + year, each reduced first" />
              <ReportRow label="Birth Day" value={data.birth.birthDay.display} caption="Day of birth" />
              <ReportRow
                label="Karmic Debt"
                value={data.birth.karmicDebts.length === 0 ? '0' : data.birth.karmicDebts.join(', ')}
                caption="13, 14, 16 or 19 in Life Path or Birth Day"
              />
              <ReportRow label="Personal Year" value={data.personalYearNumber} caption={`Calendar year ${data.currentYear}`} />
            </Box>
            <Box>
              {data.birth.pinnacles.map((p, i) => (
                <ReportRow
                  key={`pin-${i}`}
                  label={`${['First', 'Second', 'Third', 'Fourth'][i]} Pinnacle`}
                  value={p.value}
                  caption={ageRange(p)}
                  highlight={isCurrentPeriod(p, data.currentAge)}
                />
              ))}
              {data.birth.cycles.map((p, i) => (
                <ReportRow
                  key={`cyc-${i}`}
                  label={`${['First', 'Second', 'Third'][i]} Cycle`}
                  value={p.value}
                  caption={ageRange(p)}
                  highlight={isCurrentPeriod(p, data.currentAge)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Tab 1: angka nama */}
        {reportTab === 1 &&
          (data.name ? (
            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 4 }}>
                <Box>
                  <ReportRow label="Expression" value={data.name.expression.display} caption="All letters, each name reduced then added" />
                  <ReportRow label="Minor Expression" value={data.name.minorExpression.display} caption="First + last name only" />
                  <ReportRow label="Heart's Desire" value={data.name.heartsDesire.display} caption="Vowels" />
                  <ReportRow label="Minor Heart's Desire" value={data.name.minorHeartsDesire.display} caption="Vowels of first + last name" />
                  <ReportRow label="Personality" value={data.name.personality.display} caption="Consonants" />
                </Box>
                <Box>
                  <ReportRow
                    label="Heart's Desire / Personality Bridge"
                    value={data.name.heartPersonalityBridge}
                    caption="Difference between the two"
                  />
                  <ReportRow label="Balance" value={data.name.balance.display} caption="Sum of initials" />
                  <ReportRow label="Cornerstone" value={data.name.cornerstone} caption="First letter of first name" />
                  <ReportRow label="Subconscious Self" value={data.name.subconsciousSelf} caption="9 minus the number of Karmic Lessons" />
                  <ReportRow
                    label="Karmic Lessons"
                    value={data.name.karmicLessons.length === 0 ? '—' : data.name.karmicLessons.join(', ')}
                    caption="Numbers missing from your name"
                  />
                </Box>
              </Box>
              {data.name.nameKarmicDebts.length > 0 && (
                <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 1.5 }}>
                  Karmic Debt in name: {data.name.nameKarmicDebts.map((k) => `${k.source} ${k.display}`).join(', ')}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#94A3B8', py: 1.5 }}>
              Name numbers could not be calculated because the name has no A–Z letters.
            </Typography>
          ))}

        {/* Tab 2: angka hybrid */}
        {reportTab === 2 &&
          (data.hybrid ? (
            <Box sx={{ maxWidth: 560 }}>
              <ReportRow label="Maturity" value={data.hybrid.maturity.display} caption="Life Path + Expression" />
              <ReportRow
                label="Life Path / Expression Bridge"
                value={data.hybrid.lifePathExpressionBridge}
                caption="Difference between the two"
              />
              <ReportRow label="Rational Thought" value={data.hybrid.rationalThought.display} caption="First name" />
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#94A3B8', py: 1.5 }}>
              Hybrid numbers could not be calculated because the name has no A–Z letters.
            </Typography>
          ))}
      </Box>

      {/* Calculation Derivation Proof */}
      <Box sx={{ pt: 3, borderTop: '1px solid #1E283D' }}>
        <Typography variant="subtitle2" sx={{ color: '#E0C99A', mb: 1.5, fontFamily: '"Cinzel", serif' }}>
          Mathematical Derivation ({data.calculationMethod} Method)
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            '& > *:first-of-type': {
              borderBottom: { xs: '1px solid #1E283D', md: 'none' },
              borderRight: { xs: 'none', md: '1px solid #1E283D' },
              pb: { xs: 2, md: 0 },
              pr: { xs: 0, md: 3 },
            },
            '& > *:last-child': { pl: { xs: 0, md: 3 }, pt: { xs: 2, md: 0 } },
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
              Life Path Calculation
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {data.digitBreakdown.lifePathSteps.map((step, sIdx) => (
                <Typography key={sIdx} variant="caption" sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                  {step}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
              Expression Calculation
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {data.digitBreakdown.destinySteps.map((step, sIdx) => (
                <Typography key={sIdx} variant="caption" sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                  {step}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Interpretations */}
      <Box sx={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #1E283D' }}>
        <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', pt: 3 }}>
          Vibrational Interpretations
        </Typography>
        {result.interpretations.map((sec, idx) => (
          <Box
            key={idx}
            sx={{ py: 3, borderBottom: idx === result.interpretations.length - 1 ? 'none' : '1px solid #1E283D' }}
          >
            <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'block', mb: 0.5 }}>
              {sec.category}
            </Typography>
            <Typography variant="h6" sx={{ color: '#EDF1F7', mb: 1, fontFamily: '"Cinzel", serif' }}>
              {sec.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#D4DCED', mb: 1.5 }}>
              {sec.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
