import React from 'react';
import { Box } from '@mui/material';

// Flowing gold energy current — decorative divider used between the
// "Systems" grid section and the "Architectural Rigor" section on the
// homepage. Kept in its own file (separate from CelestialMachineAnimation)
// since it is a lightweight, reusable section divider rather than part of
// the birth-chart machine visualization.

export const EnergyFlowBand: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 64, md: 88 },
        backgroundColor: '#000000',
        borderTop: '1px solid #1A1A1A',
        borderBottom: '1px solid #1A1A1A',
        overflow: 'hidden',
      }}
    >
      {/* Soft traveling highlight sweeping across the band */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40%',
          height: '100%',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(224,201,154,0.06) 50%, transparent 100%)',
          animation: 'energyFlowSweep 6s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 1200 120"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ display: 'block', position: 'relative' }}
      >
        <defs>
          <style>
            {`
              @keyframes energyFlowSweep {
                0% { transform: translateX(-120%); }
                50% { transform: translateX(180%); }
                100% { transform: translateX(180%); }
              }
              @keyframes energyFlowDash {
                from { stroke-dashoffset: 240; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes energyFlowPulse {
                0%, 100% { opacity: 0.3; r: 2.4; }
                50% { opacity: 1; r: 3.4; }
              }
              .energy-flow-line {
                animation: energyFlowDash 3.2s linear infinite;
              }
              .energy-flow-particle {
                animation: energyFlowPulse 2.2s ease-in-out infinite;
              }
            `}
          </style>
          <linearGradient id="energyFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0C99A" stopOpacity="0" />
            <stop offset="50%" stopColor="#E0C99A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0C99A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Secondary faint current, for depth behind the main flow */}
        <path
          d="M -20 66 C 200 96, 400 36, 600 66 S 1000 96, 1220 66"
          fill="none"
          stroke="#E0C99A"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.18"
        />

        {/* Main flowing gold current */}
        <path
          d="M -20 60 C 180 20, 380 100, 580 60 S 980 20, 1220 60"
          fill="none"
          stroke="url(#energyFlowGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="16 8"
          className="energy-flow-line"
          opacity="0.85"
        />

        {/* Traveling energy particles along the current */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={120 + i * 300}
            cy={60}
            r={3}
            fill="#E0C99A"
            className="energy-flow-particle"
            style={{ animationDelay: `${i * 0.55}s` }}
          />
        ))}
      </svg>
    </Box>
  );
};
