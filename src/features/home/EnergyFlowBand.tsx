import React, { useId } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface EnergyFlowBandProps {
  /**
   * 'band'     — compact horizontal divider block (the original placement),
   *              used as a normal in-flow element between sections. Used on
   *              mobile, where there is no room to embed it behind a grid.
   * 'embedded' — absolutely fills its position:relative parent and sits
   *              behind sibling content (z-index 0, pointer-events none).
   *              Used on desktop, layered behind the transparent system
   *              cards grid so the current flows visibly through them.
   */
  variant?: 'band' | 'embedded';
  sx?: SxProps<Theme>;
}

// Wavy "current" paths the energy travels along. Drawn almost invisibly
// (very low opacity, blurred) so the effect reads as drifting energy/wind
// rather than a drawn line — the glowing orbs riding along each path are
// what the eye actually follows.
const BAND_STREAKS = [
  'M -20 60 C 180 20, 380 100, 580 60 S 980 20, 1220 60',
  'M -20 66 C 200 96, 400 36, 600 66 S 1000 96, 1220 66',
  'M -20 54 C 220 84, 420 24, 640 54 S 1040 84, 1220 54',
];

const EMBEDDED_STREAKS = [
  'M -20 60 C 220 -10, 420 130, 640 60 S 1040 -10, 1220 60',
  'M -20 220 C 240 160, 440 280, 660 220 S 1060 160, 1220 220',
  'M -20 400 C 200 340, 420 460, 640 400 S 1020 340, 1220 400',
  'M -20 560 C 240 620, 440 500, 660 560 S 1060 620, 1220 560',
];

export const EnergyFlowBand: React.FC<EnergyFlowBandProps> = ({ variant = 'band', sx }) => {
  const uid = useId();
  const isEmbedded = variant === 'embedded';
  const streaks = isEmbedded ? EMBEDDED_STREAKS : BAND_STREAKS;
  const viewBoxHeight = isEmbedded ? 600 : 120;

  return (
    <Box
      sx={{
        ...(isEmbedded
          ? {
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }
          : {
              position: 'relative',
              width: '100%',
              height: { xs: 64, md: 88 },
              backgroundColor: '#000000',
              borderTop: '1px solid #1A1A1A',
              borderBottom: '1px solid #1A1A1A',
              overflow: 'hidden',
            }),
        ...sx,
      }}
    >
      <svg
        viewBox={`0 0 1200 ${viewBoxHeight}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <radialGradient id={`${uid}-orb`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5E6C4" stopOpacity="1" />
            <stop offset="45%" stopColor="#E0C99A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E0C99A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {streaks.map((d, i) => {
          const pathId = `${uid}-path-${i}`;
          const baseDuration = isEmbedded ? 10 + i * 2.5 : 7 + i * 2;
          return (
            <g key={pathId}>
              {/* Faint guiding current — almost invisible, just enough depth */}
              <path
                id={pathId}
                d={d}
                fill="none"
                stroke="#E0C99A"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={isEmbedded ? 0.05 : 0.1}
                filter={`url(#${uid}-blur)`}
              />

              {/* Two staggered glowing wisps riding the current, like gusts of wind */}
              <circle r={isEmbedded ? 10 : 6} fill={`url(#${uid}-orb)`} filter={`url(#${uid}-blur)`}>
                <animateMotion dur={`${baseDuration}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
              <circle r={isEmbedded ? 7 : 4} fill={`url(#${uid}-orb)`} filter={`url(#${uid}-blur)`} opacity={0.7}>
                <animateMotion
                  dur={`${baseDuration}s`}
                  begin={`${-baseDuration / 2}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}
      </svg>
    </Box>
  );
};
