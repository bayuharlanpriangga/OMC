// ═══════════════════════════════════════════════════════════
//  ZI WEI ENGINE
// ═══════════════════════════════════════════════════════════
function zwPalace(birthHourBranch, lunarMonth) {
  // Life palace (命宮): (14 + lunarMonth - hourBranch) % 12
  // lunarMonth: 1-12, hourBranch: 0-11
  return ((14 + lunarMonth - birthHourBranch) % 12 + 12) % 12;
}

// Approximate lunar month from sun longitude
// New moon = sun and moon at same longitude
function approxLunarMonth(sunLon) {
  // Chinese lunar months roughly correspond to sun sign + 1
  // Start of lunar month 1 (正月) when Sun is in Aquarius (~315° ecliptic start for BaZi)
  // Approximate: lunar month = floor(sun lon / 30) + 1, wrapped
  return (Math.floor(normalizeAngle(sunLon) / 30) + 1) % 12 || 12;
}


