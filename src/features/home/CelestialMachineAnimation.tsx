import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

// 12 Astrology Classical & Modern Planets
const PLANETS = [
  { symbol: '☉', name: 'Sun', angle: 0 },
  { symbol: '☽', name: 'Moon', angle: 30 },
  { symbol: '☿', name: 'Mercury', angle: 60 },
  { symbol: '♀', name: 'Venus', angle: 90 },
  { symbol: '♂', name: 'Mars', angle: 120 },
  { symbol: '♃', name: 'Jupiter', angle: 150 },
  { symbol: '♄', name: 'Saturn', angle: 180 },
  { symbol: '♅', name: 'Uranus', angle: 210 },
  { symbol: '♆', name: 'Neptune', angle: 240 },
  { symbol: '♇', name: 'Pluto', angle: 270 },
  { symbol: '☊', name: 'Node', angle: 300 },
  { symbol: '⚸', name: 'Lilith', angle: 330 },
];

// Sacred Numerology Core & Master Numbers
const NUMEROLOGY_NUMBERS = [
  { num: '1', angle: 0 },
  { num: '2', angle: 30 },
  { num: '3', angle: 60 },
  { num: '4', angle: 90 },
  { num: '5', angle: 120 },
  { num: '6', angle: 150 },
  { num: '7', angle: 180 },
  { num: '8', angle: 210 },
  { num: '9', angle: 240 },
  { num: '11', angle: 270 },
  { num: '22', angle: 300 },
  { num: '33', angle: 330 },
];

// Human Design Bodygraph 9 Energy Centers
// Scaled & centered inside the r=110 core circle (center is 300, 300)
const HD_CENTERS = {
  head: { x: 300, y: 220, label: 'Head', shape: 'triangle-up' },
  ajna: { x: 300, y: 248, label: 'Ajna', shape: 'triangle-down' },
  throat: { x: 300, y: 278, label: 'Throat', shape: 'square' },
  gCenter: { x: 300, y: 312, label: 'G', shape: 'diamond' },
  heart: { x: 334, y: 326, label: 'Heart', shape: 'triangle-small' },
  spleen: { x: 258, y: 345, label: 'Spleen', shape: 'triangle-left' },
  solarPlexus: { x: 342, y: 345, label: 'Solar', shape: 'triangle-right' },
  sacral: { x: 300, y: 350, label: 'Sacral', shape: 'square' },
  root: { x: 300, y: 382, label: 'Root', shape: 'square' },
};

// Human Design Connecting Channels (between centers)
const HD_CHANNELS = [
  { id: 'head-ajna', from: 'head', to: 'ajna', name: 'Inspiration / Awareness' },
  { id: 'ajna-throat', from: 'ajna', to: 'throat', name: 'Conceptualization' },
  { id: 'throat-g', from: 'throat', to: 'gCenter', name: 'Identity & Direction' },
  { id: 'throat-heart', from: 'throat', to: 'heart', name: 'Manifestation / Ego' },
  { id: 'g-heart', from: 'gCenter', to: 'heart', name: 'Initiation' },
  { id: 'g-spleen', from: 'gCenter', to: 'spleen', name: 'Survival Awakening' },
  { id: 'g-sacral', from: 'gCenter', to: 'sacral', name: 'Response & Energy' },
  { id: 'heart-solar', from: 'heart', to: 'solarPlexus', name: 'Community Rhythm' },
  { id: 'spleen-sacral', from: 'spleen', to: 'sacral', name: 'Instinct & Preservation' },
  { id: 'spleen-root', from: 'spleen', to: 'root', name: 'Adrenaline Pressure' },
  { id: 'sacral-solar', from: 'sacral', to: 'solarPlexus', name: 'Emotional Power' },
  { id: 'sacral-root', from: 'sacral', to: 'root', name: 'Evolutionary Mutation' },
  { id: 'solar-root', from: 'solarPlexus', to: 'root', name: 'Cycles & Feelings' },
];

export const CelestialMachineAnimation: React.FC = () => {
  // Step for animating Human Design channels sequentially
  const [activeChannelIndex, setActiveChannelIndex] = useState(0);

  useEffect(() => {
    // Cycles through connected channels every 750ms
    const interval = setInterval(() => {
      setActiveChannelIndex((prev) => (prev + 1) % HD_CHANNELS.length);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        right: { xs: '-32%', md: '-8%' },
        top: '50%',
        transform: 'translateY(-50%)',
        width: { xs: 520, md: 760 },
        height: { xs: 520, md: 760 },
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9,
      }}
    >
      <svg
        viewBox="0 0 600 600"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <style>
            {`
              @keyframes rotateClockwise {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes rotateCounterClockwise {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
              }
              @keyframes pulseChannel {
                0%, 100% { stroke-opacity: 0.95; stroke-width: 2.8; }
                50% { stroke-opacity: 0.6; stroke-width: 2.2; }
              }
              .planet-ring-rotation {
                transform-origin: 300px 300px;
                animation: rotateClockwise 45s linear infinite;
              }
              .numerology-ring-rotation {
                transform-origin: 300px 300px;
                animation: rotateCounterClockwise 36s linear infinite;
              }
              .active-channel-pulse {
                animation: pulseChannel 1.5s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* 1. Static Sacred Astrolabe Framework Circles */}
        <circle cx="300" cy="300" r="285" fill="none" stroke="#222222" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
        <circle cx="300" cy="300" r="230" fill="none" stroke="#333333" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
        <circle cx="300" cy="300" r="165" fill="none" stroke="#222222" strokeWidth="1" opacity="0.6" />
        <circle cx="300" cy="300" r="110" fill="none" stroke="#262626" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

        {/* Background Axial Cross Lines */}
        <line x1="300" y1="15" x2="300" y2="585" stroke="#1A1A1A" strokeWidth="1" />
        <line x1="15" y1="300" x2="585" y2="300" stroke="#1A1A1A" strokeWidth="1" />
        <line x1="98" y1="98" x2="502" y2="502" stroke="#171717" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="98" y1="502" x2="502" y2="98" stroke="#171717" strokeWidth="1" strokeDasharray="2 4" />

        {/* ============================================================== */}
        {/* 2. OUTER RING (R=230): ANIMATED ASTROLOGY PLANETS (CLOCKWISE)  */}
        {/* ============================================================== */}
        <g className="planet-ring-rotation">
          {/* Subtle Orbit Track */}
          <circle cx="300" cy="300" r="230" fill="none" stroke="#E0C99A" strokeWidth="1" opacity="0.3" />

          {/* 36 Degree Minor Ticks for Zodiac Divisions */}
          {Array.from({ length: 36 }).map((_, i) => {
            const rad = (i * 10 * Math.PI) / 180;
            const x1 = 300 + 226 * Math.cos(rad);
            const y1 = 300 + 226 * Math.sin(rad);
            const x2 = 300 + 234 * Math.cos(rad);
            const y2 = 300 + 234 * Math.sin(rad);
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#444444"
                strokeWidth={i % 3 === 0 ? '1.5' : '0.8'}
                opacity={i % 3 === 0 ? '0.7' : '0.3'}
              />
            );
          })}

          {/* The 12 Astrology Planets with Glyphs and Orbit Nodes */}
          {PLANETS.map((planet, idx) => {
            const rad = (planet.angle * Math.PI) / 180;
            const cx = 300 + 230 * Math.cos(rad);
            const cy = 300 + 230 * Math.sin(rad);

            // Keep planet symbols right-side up relative to viewer or radial
            return (
              <g key={`planet-${idx}`}>
                {/* Orbital Node Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#E0C99A"
                  opacity="0.9"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill="none"
                  stroke="#E0C99A"
                  strokeWidth="0.8"
                  opacity="0.4"
                />

                {/* Astrological Glyph Label */}
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#E0C99A"
                  fontSize="14"
                  fontWeight="600"
                  fontFamily="'Cinzel', serif"
                  style={{
                    textShadow: '0 0 8px rgba(224, 201, 154, 0.6)',
                    pointerEvents: 'none',
                  }}
                >
                  {planet.symbol}
                </text>
              </g>
            );
          })}
        </g>

        {/* ============================================================== */}
        {/* 3. INNER RING (R=165): NUMEROLOGY NUMBERS (COUNTER-CLOCKWISE)  */}
        {/* ============================================================== */}
        <g className="numerology-ring-rotation">
          {/* Subtle Ring Track */}
          <circle cx="300" cy="300" r="165" fill="none" stroke="#60A5FA" strokeWidth="0.8" opacity="0.25" strokeDasharray="3 5" />

          {/* 12 Numerology Numbers (1-9, Master 11, 22, 33) */}
          {NUMEROLOGY_NUMBERS.map((item, idx) => {
            const rad = (item.angle * Math.PI) / 180;
            const nx = 300 + 165 * Math.cos(rad);
            const ny = 300 + 165 * Math.sin(rad);

            return (
              <g key={`num-${idx}`}>
                {/* Micro accent point */}
                <circle
                  cx={nx}
                  cy={ny}
                  r="2"
                  fill="#94A3B8"
                  opacity="0.5"
                />

                {/* Sacred Number Label */}
                <text
                  x={nx}
                  y={ny}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#EDF1F7"
                  fontSize={item.num.length > 1 ? '11' : '12'}
                  fontFamily="'Cinzel', serif"
                  fontWeight="700"
                  opacity="0.85"
                  style={{
                    letterSpacing: '0.05em',
                    pointerEvents: 'none',
                  }}
                >
                  {item.num}
                </text>
              </g>
            );
          })}
        </g>

        {/* ============================================================== */}
        {/* 4. CENTER VOID (R=110): ANIMATED HUMAN DESIGN BODYGRAPH        */}
        {/* ============================================================== */}
        <g id="human-design-bodygraph-center">
          {/* Core Void Protective Glow Ring */}
          <circle cx="300" cy="300" r="98" fill="#000000" fillOpacity="0.4" stroke="#262626" strokeWidth="1" />

          {/* Human Design Connecting Channels */}
          {HD_CHANNELS.map((ch, idx) => {
            const p1 = (HD_CENTERS as any)[ch.from];
            const p2 = (HD_CENTERS as any)[ch.to];
            const isActive = idx === activeChannelIndex;

            return (
              <line
                key={`channel-${ch.id}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isActive ? '#E0C99A' : '#333333'}
                strokeWidth={isActive ? '2.5' : '1.2'}
                strokeDasharray={isActive ? 'none' : '2 3'}
                className={isActive ? 'active-channel-pulse' : undefined}
                style={{
                  transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                  filter: isActive ? 'drop-shadow(0 0 6px #E0C99A)' : 'none',
                }}
              />
            );
          })}

          {/* Human Design Centers (9 Energy Centers) */}
          {Object.entries(HD_CENTERS).map(([key, center]) => {
            // Check if this center is currently attached to the active channel
            const currentChannel = HD_CHANNELS[activeChannelIndex];
            const isCenterActive = currentChannel.from === key || currentChannel.to === key;

            const strokeColor = isCenterActive ? '#E0C99A' : '#555555';
            const fillColor = isCenterActive ? '#1C160B' : '#0B0B0B';

            if (center.shape === 'triangle-up') {
              // Head center
              const points = `${center.x},${center.y - 10} ${center.x - 10},${center.y + 7} ${center.x + 10},${center.y + 7}`;
              return (
                <polygon
                  key={key}
                  points={points}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.3s ease' }}
                />
              );
            }

            if (center.shape === 'triangle-down') {
              // Ajna center
              const points = `${center.x - 10},${center.y - 7} ${center.x + 10},${center.y - 7} ${center.x},${center.y + 10}`;
              return (
                <polygon
                  key={key}
                  points={points}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.3s ease' }}
                />
              );
            }

            if (center.shape === 'diamond') {
              // G-Center
              const s = 10;
              const points = `${center.x},${center.y - s} ${center.x + s},${center.y} ${center.x},${center.y + s} ${center.x - s},${center.y}`;
              return (
                <polygon
                  key={key}
                  points={points}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.3s ease' }}
                />
              );
            }

            if (center.shape === 'triangle-small') {
              // Heart center
              const points = `${center.x},${center.y - 7} ${center.x + 8},${center.y + 6} ${center.x - 8},${center.y + 6}`;
              return (
                <polygon
                  key={key}
                  points={points}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.4"
                  style={{ transition: 'all 0.3s ease' }}
                />
              );
            }

            if (center.shape === 'triangle-left') {
              // Spleen center
              const points = `${center.x + 7},${center.y - 8} ${center.x + 7},${center.y + 8} ${center.x - 8},${center.y}`;
              return (
                <polygon
                  key={key}
                  points={points}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.4"
                  style={{ transition: 'all 0.3s ease' }}
                />
              );
            }

            if (center.shape === 'triangle-right') {
              // Solar Plexus center
              const points = `${center.x - 7},${center.y - 8} ${center.x - 7},${center.y + 8} ${center.x + 8},${center.y}`;
              return (
                <polygon
                  key={key}
                  points={points}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.4"
                  style={{ transition: 'all 0.3s ease' }}
                />
              );
            }

            // Square centers: Throat, Sacral, Root
            return (
              <rect
                key={key}
                x={center.x - 9}
                y={center.y - 9}
                width="18"
                height="18"
                rx="2"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="1.5"
                style={{ transition: 'all 0.3s ease' }}
              />
            );
          })}
        </g>
      </svg>
    </Box>
  );
};
