// ═══════════════════════════════════════════════════════════
//  OMC CALCULATION ENGINE — extracted verbatim (Phase 01: Baseline & Extraction)
//
//  Source: legacy index.html lines 1813–3671 (astro engine + BaZi + Human
//  Design gates + Zi Wei palace + computeChart core). Copied unchanged
//  except for one dedupe (see note below) so behavior is identical to
//  the monolith. This file is pure calculation logic — no DOM access,
//  no globals outside this module, no side effects.
//
//  Do not "improve" this file inside Phase 01. Bug fixes, renames, and
//  refactors belong to the lens phases (04–08) that own each system.
//
//  See /docs/ARCHITECTURE.md for the full dependency map and
//  /docs/KNOWN_APPROXIMATIONS.md for calculation caveats inherited as-is.
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
//  REAL ASTRONOMY ENGINE
//  Based on Jean Meeus "Astronomical Algorithms"
// ═══════════════════════════════════════════════════════════
const RAD = Math.PI/180, DEG = 180/Math.PI;

function toJD(year, month, day, hour=12, tz=0) {
  // Gregorian to Julian Day Number
  if(month <= 2){ year -= 1; month += 12; }
  const A = Math.floor(year/100);
  const B = 2 - A + Math.floor(A/4);
  return Math.floor(365.25*(year+4716)) + Math.floor(30.6001*(month+1)) + day + B - 1524.5 + (hour-tz)/24;
}

function obliquity(T) {
  // Mean obliquity of the ecliptic
  return 23.4392911 - 0.013004167*T - 0.0000001639*T*T + 0.0000005036*T*T*T;
}

function normalizeAngle(a) { return ((a % 360) + 360) % 360; }

// Sun — accurate to ~0.01° (Meeus Ch.27)
function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = normalizeAngle(280.46646 + 36000.76983*T + 0.0003032*T*T);
  const M = normalizeAngle(357.52911 + 35999.05029*T - 0.0001537*T*T) * RAD;
  const C = (1.914602 - 0.004817*T - 0.000014*T*T)*Math.sin(M)
          + (0.019993 - 0.000101*T)*Math.sin(2*M)
          + 0.000289*Math.sin(3*M);
  const sunTrue = L0 + C;
  const omega = normalizeAngle(125.04 - 1934.136*T);
  return normalizeAngle(sunTrue - 0.00569 - 0.00478*Math.sin(omega*RAD));
}

// Moon — good existing
function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L1 = normalizeAngle(218.3165 + 481267.8813*T);
  const M = normalizeAngle(357.5291 + 35999.0503*T) * RAD;
  const Mp = normalizeAngle(134.9634 + 477198.8676*T) * RAD;
  const D = normalizeAngle(297.8502 + 445267.1115*T) * RAD;
  const F = normalizeAngle(93.2721 + 483202.0175*T) * RAD;
  const lon = L1 + 6.2888*Math.sin(Mp) + 1.2740*Math.sin(2*D - Mp) + 0.6583*Math.sin(2*D)
    + 0.2136*Math.sin(2*Mp) - 0.1851*Math.sin(M) - 0.1143*Math.sin(2*F)
    + 0.0588*Math.sin(2*D - 2*Mp) + 0.0572*Math.sin(2*D - M - Mp) + 0.0533*Math.sin(2*D + Mp);
  return normalizeAngle(lon);
}

// Mercury — geocentric ecliptic longitude (Meeus low-precision)
function mercuryLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  // Heliocentric Mercury
  const lM = normalizeAngle(252.250906 + 149472.6746358*T);
  const aM = normalizeAngle(174.7948 + 149472.515*T) * RAD;
  const vM = lM + 23.4400*Math.sin(aM) + 2.9818*Math.sin(2*aM)
    + 0.5255*Math.sin(3*aM) + 0.1058*Math.sin(4*aM);
  const rM = 0.3871 * (1 - 0.2056*Math.cos(aM) - 0.0415*Math.cos(2*aM));
  // Earth heliocentric
  const lE = sunLongitude(jd) + 180;
  const aE = normalizeAngle(357.52911 + 35999.05029*T) * RAD;
  const rE = 1.00014 - 0.01671*Math.cos(aE) - 0.00014*Math.cos(2*aE);
  // Geocentric
  const vMr = vM * RAD, lEr = lE * RAD;
  const x = rM*Math.cos(vMr) - rE*Math.cos(lEr);
  const y = rM*Math.sin(vMr) - rE*Math.sin(lEr);
  return normalizeAngle(Math.atan2(y, x) * DEG);
}

// Venus — geocentric ecliptic longitude
function venusLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const lV = normalizeAngle(181.979801 + 58517.815676*T);
  const aV = normalizeAngle(212.2629 + 58517.8034*T) * RAD;
  const vV = lV + 0.7758*Math.sin(aV) + 0.0033*Math.sin(2*aV);
  const rV = 0.7233 * (1 - 0.0068*Math.cos(aV));
  const lE = sunLongitude(jd) + 180;
  const aE = normalizeAngle(357.52911 + 35999.05029*T) * RAD;
  const rE = 1.00014 - 0.01671*Math.cos(aE) - 0.00014*Math.cos(2*aE);
  const vVr = vV * RAD, lEr = lE * RAD;
  const x = rV*Math.cos(vVr) - rE*Math.cos(lEr);
  const y = rV*Math.sin(vVr) - rE*Math.sin(lEr);
  return normalizeAngle(Math.atan2(y, x) * DEG);
}

// Mars — geocentric ecliptic longitude (Meeus low-precision)
function marsLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const lMa = normalizeAngle(355.433 + 19140.2993*T + 0.000310*T*T);
  const aMa = normalizeAngle(19.3730 + 19140.2964*T) * RAD;
  const Mj = normalizeAngle(20.9 + 3034.906*T) * RAD;
  const vMa = lMa + 10.6912*Math.sin(aMa) + 0.6228*Math.sin(2*aMa)
    + 0.0503*Math.sin(3*aMa) + 0.2777*Math.sin(aMa - 2*Mj) + 0.1348*Math.sin(2*Mj);
  const rMa = 1.5237 * (1 - 0.0934*Math.cos(aMa) - 0.0097*Math.cos(2*aMa));
  const lE = sunLongitude(jd) + 180;
  const aE = normalizeAngle(357.52911 + 35999.05029*T) * RAD;
  const rE = 1.00014 - 0.01671*Math.cos(aE) - 0.00014*Math.cos(2*aE);
  const vMar = vMa * RAD, lEr = lE * RAD;
  const x = rMa*Math.cos(vMar) - rE*Math.cos(lEr);
  const y = rMa*Math.sin(vMar) - rE*Math.sin(lEr);
  return normalizeAngle(Math.atan2(y, x) * DEG);
}

// VSOP87 upgrade for Jupiter and Saturn — now exact degree accuracy
// Uses proper heliocentric L+R series then geocentric conversion

function evalVSOP(terms, tau) {
  return terms.reduce(function(s,t){return s+t[0]*Math.cos(t[1]+t[2]*tau);},0);
}

function vsop87Planet(L0terms,L1terms,R0terms,R1terms, jd) {
  var tau=(jd-2451545)/365250;
  var L=(evalVSOP(L0terms,tau)+evalVSOP(L1terms,tau)*tau)/1e8;
  var R=(evalVSOP(R0terms,tau)+evalVSOP(R1terms,tau)*tau)/1e8;
  // Earth heliocentric
  var eL=(evalVSOP(EARTH_L0,tau)+evalVSOP(EARTH_L1,tau)*tau)/1e8;
  var eR=(evalVSOP(EARTH_R0,tau)+evalVSOP(EARTH_R1,tau)*tau)/1e8;
  var x=R*Math.cos(L)-eR*Math.cos(eL);
  var y=R*Math.sin(L)-eR*Math.sin(eL);
  return normalizeAngle(Math.atan2(y,x)*DEG);
}

const EARTH_L0=[[175347046,0,0],[3341656,4.6732,6283.07585],[34894,4.6261,12566.1517],
  [3497,2.7441,5753.3849],[3418,2.8289,3.5231],[3136,3.6277,77713.7715]];
const EARTH_L1=[[628331966747,0,0],[206059,2.678235,6283.07585],[4303,2.6351,12566.1517],
  [425,1.590,3.523],[119,5.796,26.298]];
const EARTH_R0=[[100013989,0,0],[1670700,3.0984635,6283.07585],[13956,3.05525,12566.1517],
  [3084,5.1985,77713.7715],[1628,1.1739,5753.385],[1576,2.8469,7860.419]];
const EARTH_R1=[[103019,1.107490,6283.07585],[1721,1.0644,12566.152],[702,3.142,0]];

function jupiterLongitude(jd) {
  return vsop87Planet(
    [[59954691,0,0],[9695899,5.0619179,529.6909651],[573610,1.444062,1059.381930],
     [306389,5.417347,522.577418],[97178,4.14265,536.804512],[72903,3.64043,421.426128],
     [64264,3.41145,103.092774],[39806,2.29377,419.484457],[38858,1.27232,316.391872],
     [27965,1.78455,398.149003],[13590,5.77481,632.783739],[8246,3.58227,110.206321]],
    [[52993480757,0,0],[489741,4.220667,529.690965],[228918,6.026475,7.113547],
     [27655,4.57266,1059.38193],[20721,5.45939,522.57742],[12106,0.16986,536.80451]],
    [[520887429,0,0],[25209327,3.4910156,529.6909651],[610600,3.841154,1059.381930],
     [282029,2.574199,632.783739],[187647,2.075904,522.577418],[86793,0.71001,419.484457],
     [72063,0.21466,536.804512],[65517,5.97072,316.391872],[56116,4.38649,103.092774]],
    [[1271802,2.6493751,529.6909651],[61662,3.00076,1059.38193],[53444,3.89718,522.57742]],
    jd);
}

function saturnLongitude(jd) {
  return vsop87Planet(
    [[87401354,0,0],[11107660,3.9620509,213.2990954],[1414151,4.5858152,426.5981908],
     [398379,0.521120,109.9456888],[350769,3.303299,426.5981908],[206816,0.246584,72.6460248],
     [79271,3.84007,213.2990954],[23990,4.66977,206.1855484],[16574,0.43719,426.5981908],
     [15820,0.93809,0.9808679],[15054,2.71670,639.8972919],[9381,3.67429,419.4844567]],
    [[21350407549,0,0],[1296855,1.8282054,213.2990954],[564348,2.885001,7.113547],
     [107679,2.277699,206.185548],[98323,1.080651,426.598191]],
    [[955758136,0,0],[52921382,2.39226220,213.2990954],[1873680,5.2354065,426.5981908],
     [1464664,1.6476,216.480489],[821891,5.935,419.484457],[547507,5.015327,206.185548]],
    [[6182981,0.2584352,213.2990954],[506578,0.711147,426.5981908],[341394,5.796358,206.185548]],
    jd);
}

// Uranus — VSOP87
function uranusLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = normalizeAngle(314.055005 + 428.466998*T - 0.0000316*T*T);
  const M = normalizeAngle(142.2386 + 428.4665*T) * RAD;
  const Ms = normalizeAngle(317.020 + 1222.114*T) * RAD;
  return normalizeAngle(L0
    + 5.3042*Math.sin(M) + 0.1534*Math.sin(2*M)
    + 0.9190*Math.sin(M - Ms));
}

// Neptune — VSOP87
function neptuneLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = normalizeAngle(304.348665 + 218.466418*T - 0.0000070*T*T);
  const M = normalizeAngle(256.225 + 218.4665*T) * RAD;
  const Mu = normalizeAngle(142.2386 + 428.4665*T) * RAD;
  return normalizeAngle(L0
    + 1.0302*Math.sin(M) + 0.0337*Math.sin(2*M)
    - 0.4090*Math.sin(M - 2*Mu));
}

// Pluto — interpolated from known positions (Meeus series has ~5deg error)
// Known geocentric positions from JPL Horizons:
const PLUTO_KNOWN = [
  [2415020,  87.5],[2429740, 129.0],[2433282, 150.5],[2436935, 168.0],
  [2440587, 188.5],[2444239, 218.5],[2447892, 237.5],[2451545, 249.0],
  [2452641, 258.0],[2453371, 261.0],[2453479, 264.5],[2454466, 268.0],
  [2455198, 273.5],[2456856, 281.0],[2458485, 291.0],[2458850, 293.5],
  [2460310, 300.5],[2462241, 320.0],
]
function plutoLongitude(jd) {
  // Find surrounding known points and interpolate
  let i = 0;
  while(i < PLUTO_KNOWN.length-2 && jd > PLUTO_KNOWN[i+1][0]) i++;
  const [jd1,l1] = PLUTO_KNOWN[i];
  const [jd2,l2] = PLUTO_KNOWN[i+1];
  const frac = (jd - jd1) / (jd2 - jd1);
  let lon = l1 + frac * (l2 - l1);
  // At ~32 AU, geocentric-heliocentric difference ~1-2 deg max
  // Apply small annual parallax correction
  const T = (jd - 2451545.0) / 36525;
  const sunLon = sunLongitude(jd);
  // Correction for Earth's annual motion (annual aberration ~20 arcsec negligible at Pluto)
  // Geocentric displacement ≈ (1/rP) * cos(lon - sunLon) ~ 0.03*cos = max 2 deg
  const rP = 32.0; // AU, Pluto approx distance
  const delta = (1.0/rP) * Math.cos((lon - sunLon - 180) * RAD) * DEG;
  return normalizeAngle(lon + delta);
}
// (old heliocentric version kept for reference)
function plutoLongitude_h(jd) {
  const T = (jd - 2451545.0) / 36525;
  // Meeus Ch.37 — heliocentric longitude of Pluto
  const J = normalizeAngle(34.35 + 3034.9057*T);
  const S = normalizeAngle(50.08 + 1222.1138*T);
  const P = normalizeAngle(238.96 + 144.9600*T);
  const a = J * RAD, b = S * RAD, p = P * RAD;
  const lon_h = P
    - 19.799*Math.sin(2*(p-a)) + 19.848*Math.cos(2*(p-a))
    + 0.897*Math.sin(p-b)      - 4.956*Math.cos(p-b)
    + 0.610*Math.sin(4*(p-a))  + 1.211*Math.cos(4*(p-a))
    - 0.341*Math.sin(2*(p-b))  + 0.190*Math.cos(2*(p-b))
    + 0.128*Math.sin(6*(p-a))  - 0.351*Math.cos(6*(p-a))
    + 0.217*Math.sin(2*(p-a)-p-b) - 0.169*Math.cos(2*(p-a)-p-b);
  // Heliocentric radius of Pluto
  const lat_h = -3.909*Math.sin(2*(p-a)) + 6.693*Math.cos(2*(p-a));
  const r_P = 40.72 + 6.68*Math.sin(2*(p-a)) - 1.48*Math.cos(2*(p-a));
  // Earth heliocentric
  const aE = normalizeAngle(357.52911 + 35999.05029*T) * RAD;
  const lE = sunLongitude(jd) + 180;
  const rE = 1.00014 - 0.01671*Math.cos(aE) - 0.00014*Math.cos(2*aE);
  const lh = lon_h * RAD, lEr = lE * RAD;
  const x = r_P*Math.cos(lh) - rE*Math.cos(lEr);
  const y = r_P*Math.sin(lh) - rE*Math.sin(lEr);
  return normalizeAngle(Math.atan2(y, x) * DEG);
}

// Ascendant — corrected (Meeus Ch.15, proper GMST)
function calcAscendant(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525;
  const GMST = normalizeAngle(280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T
    - T * T * T / 38710000);
  const LST = normalizeAngle(GMST + lon);
  const eps = obliquity(T) * RAD;
  const lstRad = LST * RAD;
  const latRad = lat * RAD;
  const asc = Math.atan2(
    Math.cos(lstRad),
    -(Math.sin(lstRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps)));
  return normalizeAngle(asc * DEG);
}

// House system — Whole Sign (each house = one whole sign starting from ASC sign)
// This is the most reliable system without full Placidus computation
// MC (Midheaven) calculated separately for career/public axis
function calcHouses(ascLon) {
  const ascSignStart = Math.floor(ascLon / 30) * 30; // start of ASC sign
  const houses = [];
  for(let i=0;i<12;i++) houses.push(normalizeAngle(ascSignStart + i*30));
  return houses;
}

// Midheaven (MC) — approximate from RAMC
function calcMC(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525;
  const GMST = normalizeAngle(280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933*T*T - T*T*T/38710000);
  const RAMC = normalizeAngle(GMST + lon); // Right Ascension of MC
  const eps = obliquity(T) * RAD;
  // MC ecliptic longitude
  const mc = Math.atan2(Math.sin(RAMC*RAD), Math.cos(RAMC*RAD)*Math.cos(eps));
  return normalizeAngle(mc * DEG);
}

// ── RETROGRADE DETECTION ──
// Planet is retrograde when its daily motion is negative (moving backward)
// We check longitude difference over ±12 hours
function isRetrograde(lonFn, jd) {
  const lon0 = lonFn(jd - 0.5);
  const lon1 = lonFn(jd + 0.5);
  let diff = lon1 - lon0;
  // Normalize for wrap-around
  if(diff > 180) diff -= 360;
  if(diff < -180) diff += 360;
  return diff < 0; // Negative motion = retrograde
}

// ── ASPECT ENGINE — luminaries wider orbs, applying/separating ──
// Standard orbs by aspect type and whether luminaries involved
const ASPECT_ORBS_LIGHT = { // Sun or Moon involved
  Conjunction:10, Sextile:8, Square:9, Trine:10, Opposition:10
};
const ASPECT_ORBS_STD = { // Other planets
  Conjunction:7, Sextile:5, Square:7, Trine:8, Opposition:8
};

function getOrb(type, pA, pB) {
  const luminaries = new Set(['Sun','Moon']);
  if(luminaries.has(pA) || luminaries.has(pB)) return ASPECT_ORBS_LIGHT[type];
  return ASPECT_ORBS_STD[type];
}

function aspectType(a1, a2) {
  let diff = Math.abs(a1 - a2);
  if(diff > 180) diff = 360 - diff;
  if(diff <= 10) return 'Conjunction';
  if(Math.abs(diff-60) <= 8) return 'Sextile';
  if(Math.abs(diff-90) <= 9) return 'Square';
  if(Math.abs(diff-120) <= 10) return 'Trine';
  if(Math.abs(diff-180) <= 10) return 'Opposition';
  return null;
}

// Applying = planets moving toward exactness | Separating = moving away
// Check motion over next day to determine direction
function isApplying(lonA, lonB, lonFnA, lonFnB, jd) {
  const tomorrow_a = lonFnA ? lonFnA(jd + 1) : lonA;
  const tomorrow_b = lonFnB ? lonFnB(jd + 1) : lonB;
  const curDiff = Math.abs(lonA - lonB);
  const nextDiff = Math.abs(tomorrow_a - tomorrow_b);
  const cur = curDiff > 180 ? 360 - curDiff : curDiff;
  const nxt = nextDiff > 180 ? 360 - nextDiff : nextDiff;
  return nxt < cur; // Getting closer = applying
}

// Aspect with full metadata
function aspectWithOrb(a1, a2, pA, pB, lonFnA, lonFnB, jd) {
  let diff = Math.abs(a1 - a2);
  if(diff > 180) diff = 360 - diff;
  const types = [
    {t:'Conjunction', target:0},
    {t:'Sextile',     target:60},
    {t:'Square',      target:90},
    {t:'Trine',       target:120},
    {t:'Opposition',  target:180},
  ];
  for(const c of types) {
    const exactness = Math.abs(diff - c.target);
    const maxOrb = getOrb(c.t, pA||'', pB||'');
    if(exactness <= maxOrb) {
      const strength = Math.round((1 - exactness/maxOrb) * 100);
      const tight = exactness <= 1.5;
      const applying = (lonFnA && lonFnB && jd)
        ? isApplying(a1, a2, lonFnA, lonFnB, jd)
        : null;
      return {
        type:c.t, exactness: Math.round(exactness*10)/10,
        strength, tight,
        applying, // true=applying, false=separating, null=unknown
        orb: Math.round(exactness*10)/10
      };
    }
  }
  return null;
}

// ── PLANETARY DIGNITY ──
// Essential dignity: domicile, detriment, exaltation, fall
const DIGNITY = {
  Sun:        {domicile:'Leo',       detriment:'Aquarius',   exaltation:'Aries',       fall:'Libra'},
  Moon:       {domicile:'Cancer',    detriment:'Capricorn',  exaltation:'Taurus',      fall:'Scorpio'},
  Mercury:    {domicile:'Gemini',    detriment:'Sagittarius',exaltation:'Virgo',       fall:'Pisces'},
  Venus:      {domicile:'Taurus',    detriment:'Scorpio',    exaltation:'Pisces',      fall:'Virgo'},
  Mars:       {domicile:'Aries',     detriment:'Libra',      exaltation:'Capricorn',   fall:'Cancer'},
  Jupiter:    {domicile:'Sagittarius',detriment:'Gemini',    exaltation:'Cancer',      fall:'Capricorn'},
  Saturn:     {domicile:'Capricorn', detriment:'Cancer',     exaltation:'Libra',       fall:'Aries'},
  Uranus:     {domicile:'Aquarius',  detriment:'Leo',        exaltation:null,          fall:null},
  Neptune:    {domicile:'Pisces',    detriment:'Virgo',      exaltation:null,          fall:null},
  Pluto:      {domicile:'Scorpio',   detriment:'Taurus',     exaltation:null,          fall:null},
};

function getPlanetDignity(planet, sign) {
  const d = DIGNITY[planet];
  if(!d) return null;
  if(d.domicile === sign) return 'domicile';
  if(d.detriment === sign) return 'detriment';
  if(d.exaltation === sign) return 'exaltation';
  if(d.fall === sign) return 'fall';
  return null;
}

function lonToSign(lon) {
  const idx = Math.floor(lon/30);
  const deg = Math.floor(lon % 30);
  const min = Math.floor((lon % 1)*60);
  return { sign: SIGNS[idx], idx, deg, min, lon };
}

function houseOf(lon, houses) {
  for(let i=0;i<12;i++){
    const c1 = houses[i], c2 = houses[(i+1)%12];
    if(c2 > c1) { if(lon >= c1 && lon < c2) return i+1; }
    else { if(lon >= c1 || lon < c2) return i+1; }
  }
  return 1;
}

// ═══════════════════════════════════════════════════════════
//  BAZI ENGINE — Accurate Four Pillars
//  Based on solar terms (节气) not calendar months
// ═══════════════════════════════════════════════════════════
const STEMS=['甲 Jiǎ','乙 Yǐ','丙 Bǐng','丁 Dīng','戊 Wù','己 Jǐ','庚 Gēng','辛 Xīn','壬 Rén','癸 Guǐ'];
const STEM_EL=['Yang Wood','Yin Wood','Yang Fire','Yin Fire','Yang Earth','Yin Earth','Yang Metal','Yin Metal','Yang Water','Yin Water'];
const BRANCHES=['子 Rat','丑 Ox','寅 Tiger','卯 Rabbit','辰 Dragon','巳 Snake','午 Horse','未 Goat','申 Monkey','酉 Rooster','戌 Dog','亥 Pig'];
const BRANCH_EL=['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];

// Solar terms: approximate JD offset from Jan 1 each year for each month transition
// lichun (立春) ~Feb 4, jingzhe ~Mar 6, ... etc.
// These are the solar longitude thresholds: each 30° = new BaZi month
// Month branch starts when Sun reaches: 315°(Yin/Tiger), 345°(Mao/Rabbit), 15°(Chen/Dragon)...
const BAZI_MONTH_START_LON = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285];
// branch index for each solar month: Tiger=2, Rabbit=3, Dragon=4, Snake=5...
const BAZI_MONTH_BRANCH =    [2,   3,   4,  5,  6,  7,   8,   9,  10,  11,   0,   1];

function getBaziMonthIdx(sunLonAtBirth) {
  // Find which solar month we're in based on Sun longitude
  const norm = normalizeAngle(sunLonAtBirth);
  for(let i=0;i<12;i++){
    const start = BAZI_MONTH_START_LON[i];
    const end = BAZI_MONTH_START_LON[(i+1)%12];
    if(start < end){
      if(norm >= start && norm < end) return i;
    } else {
      // wrap-around (315–360 + 0–345 for the Tiger month)
      if(norm >= start || norm < end) return i;
    }
  }
  return 0;
}


function baziYearFromSun(year, month, sunLon) {
  // Accurate: year pillar changes at lichun (Sun lon = 315° = Aquarius 15°)
  // Only relevant in Jan-Feb (months 1-2)
  let baziYr = year;
  const sunNorm = normalizeAngle(sunLon);
  // Before lichun: Sun is in Capricorn/Aquarius range (270°–315°)
  // birthMonth here is the actual birth month from the date input
  if(sunNorm >= 270 && sunNorm < 315 && month <= 2) {
    baziYr = year - 1;
  }
  const si = ((baziYr-4) % 10 + 10) % 10;
  const bi = ((baziYr-4) % 12 + 12) % 12;
  return { stem:STEMS[si], branch:BRANCHES[bi], el:STEM_EL[si], si, bi, baziYr };
}

function baziMonth(sunLon, yearSi) {
  const mi = getBaziMonthIdx(sunLon);
  const bi = BAZI_MONTH_BRANCH[mi];
  // Month stem from year stem: (yearSi % 5) * 2 + monthBranch % 2
  const si = (yearSi % 5 * 2 + bi) % 10;
  return { stem:STEMS[si], branch:BRANCHES[bi], el:STEM_EL[si], si, bi };
}

function baziDay(year, month, day, utcHour, tz) {
  // Use local solar midnight for day pillar
  // Day changes at 23:00 local time (Zi hour start)
  // If hour >= 23, next calendar day
  let adjDay = day, adjMo = month, adjYr = year;
  const localHour = utcHour + tz;
  if(localHour >= 23) {
    // Push to next day
    const dt = new Date(year, month-1, day);
    dt.setDate(dt.getDate()+1);
    adjYr = dt.getFullYear(); adjMo = dt.getMonth()+1; adjDay = dt.getDate();
  } else if(localHour < 0) {
    // Pull to previous day
    const dt = new Date(year, month-1, day);
    dt.setDate(dt.getDate()-1);
    adjYr = dt.getFullYear(); adjMo = dt.getMonth()+1; adjDay = dt.getDate();
  }
  // JD method — standard BaZi day cycle
  const jd = Math.floor(toJD(adjYr, adjMo, adjDay, 12));
  const si = ((jd - 11) % 10 + 10) % 10;
  const bi = ((jd - 11) % 12 + 12) % 12;
  return { stem:STEMS[si], branch:BRANCHES[bi], el:STEM_EL[si], si, bi };
}

function baziHour(daySi, localHour) {
  // Hour branch: Zi=23-01, Chou=01-03, Yin=03-05...
  // Normalize negative hours
  const h = ((localHour % 24) + 24) % 24;
  // Zi hour: 23:00-00:59 = branch 0
  const bi = Math.floor((h + 1) / 2) % 12;
  const si = (daySi % 5 * 2 + bi) % 10;
  return { stem:STEMS[si], branch:BRANCHES[bi], el:STEM_EL[si], si, bi };
}

// ═══════════════════════════════════════════════════════════
//  HUMAN DESIGN ENGINE
//  88° solar arc (not 88 days) for design chart
// ═══════════════════════════════════════════════════════════
// Authentic HD gate order on the wheel (I Ching hexagrams mapped clockwise from 0° Aries)
// Gate 41 starts at ~337.5° (in Pisces), each gate = 5.625°
// Authentic sequence from Jovian Archive
const HD_GATE_WHEEL = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];
// Offset: Gate 41 begins at longitude 337.5° (approx) = Pisces 7.5°
const HD_GATE_OFFSET = 337.5;

function lonToGate(lon) {
  const adjusted = normalizeAngle(lon - HD_GATE_OFFSET);
  const idx = Math.floor(adjusted / 5.625) % 64;
  return HD_GATE_WHEEL[Math.max(0,Math.min(63,idx))];
}

function lonToLine(lon) {
  // Each gate has 6 lines (5.625° / 6 = 0.9375° per line)
  const adjusted = normalizeAngle(lon - HD_GATE_OFFSET);
  const gateOffset = adjusted % 5.625;
  return Math.floor(gateOffset / 0.9375) + 1; // 1-6
}

// Find JD when Sun reaches target longitude (for 88° solar arc)
// Newton's method approximation
function jdWhenSunAt(targetLon, jdApprox) {
  let jd = jdApprox;
  for(let iter=0; iter<10; iter++) {
    const curLon = sunLongitude(jd);
    let diff = normalizeAngle(targetLon - curLon);
    if(diff > 180) diff -= 360; // shortest arc
    if(Math.abs(diff) < 0.001) break;
    jd += diff / 360; // Sun moves ~1°/day
  }
  return jd;
}

function getDesignJD(birthJD) {
  // Design = when Sun was exactly 88° LESS than birth Sun longitude
  const birthSunLon = sunLongitude(birthJD);
  const designSunTarget = normalizeAngle(birthSunLon - 88);
  // Approximate: 88 days before birth
  const jdApprox = birthJD - 88;
  return jdWhenSunAt(designSunTarget, jdApprox);
}

// ═══════════════════════════════════════════════════════════
//  HUMAN DESIGN ENGINE — Graph-based (proper channel connectivity)
//  Type derived from center CONNECTIVITY, not gate boolean presence
// ═══════════════════════════════════════════════════════════

// Complete HD channel list: [gateA, gateB, centerA, centerB]
const HD_CHANNEL_MAP = [
  // Head-Ajna
  [64,47,'Head','Ajna'],[61,24,'Head','Ajna'],[63,4,'Head','Ajna'],
  // Ajna-Throat
  [17,62,'Ajna','Throat'],[43,23,'Ajna','Throat'],[11,56,'Ajna','Throat'],
  // Throat connections
  [35,36,'Throat','Solar Plexus'],[12,22,'Throat','Solar Plexus'],
  [16,48,'Throat','Spleen'],[20,57,'Throat','Spleen'],
  [10,20,'G','Throat'],[31,7,'Throat','G'],[8,1,'Throat','G'],
  [33,13,'Throat','G'],[45,21,'Throat','Heart'],[26,44,'Heart','Spleen'],
  // G center
  [2,14,'G','Sacral'],[46,29,'G','Sacral'],[15,5,'G','Sacral'],
  // Heart/Will
  [21,45,'Heart','Throat'],[26,44,'Heart','Spleen'],
  [25,51,'G','Heart'],[40,37,'Heart','Solar Plexus'],
  // Solar Plexus
  [6,59,'Solar Plexus','Sacral'],[37,40,'Solar Plexus','Heart'],
  [55,39,'Solar Plexus','Root'],[49,19,'Solar Plexus','Root'],
  [30,41,'Solar Plexus','Root'],[22,12,'Solar Plexus','Throat'],
  // Sacral
  [27,50,'Sacral','Spleen'],[59,6,'Sacral','Solar Plexus'],
  [34,57,'Sacral','Spleen'],[34,20,'Sacral','Throat'],
  [9,52,'Sacral','Root'],[3,60,'Sacral','Root'],
  [42,53,'Sacral','Root'],[29,46,'Sacral','G'],
  [5,15,'Sacral','G'],[14,2,'Sacral','G'],
  // Spleen
  [48,16,'Spleen','Throat'],[57,20,'Spleen','Throat'],
  [57,10,'Spleen','G'],[57,34,'Spleen','Sacral'],
  [44,26,'Spleen','Heart'],[50,27,'Spleen','Sacral'],
  [32,54,'Spleen','Root'],[28,38,'Spleen','Root'],
  [18,58,'Spleen','Root'],
  // Root
  [38,28,'Root','Spleen'],[39,55,'Root','Solar Plexus'],
  [41,30,'Root','Solar Plexus'],[19,49,'Root','Solar Plexus'],
  [53,42,'Root','Sacral'],[60,3,'Root','Sacral'],
  [52,9,'Root','Sacral'],[54,32,'Root','Spleen'],
  [58,18,'Root','Spleen'],
];

// Build gate→channels lookup
const GATE_CHANNELS = {};
HD_CHANNEL_MAP.forEach(([a,b,cA,cB]) => {
  if(!GATE_CHANNELS[a]) GATE_CHANNELS[a] = [];
  if(!GATE_CHANNELS[b]) GATE_CHANNELS[b] = [];
  GATE_CHANNELS[a].push({partner:b, centerSelf:cA, centerPartner:cB});
  GATE_CHANNELS[b].push({partner:a, centerSelf:cB, centerPartner:cA});
});

// Get defined centers via channel completion — proper graph approach
function getDefinedCenters(allGates) {
  const gateSet = new Set(allGates);
  const definedCenters = new Set();
  const definedChannels = [];

  HD_CHANNEL_MAP.forEach(([a,b,cA,cB]) => {
    if(gateSet.has(a) && gateSet.has(b)) {
      definedCenters.add(cA);
      definedCenters.add(cB);
      definedChannels.push([a,b,cA,cB]);
    }
  });

  return { centers: [...definedCenters], channels: definedChannels };
}

// Check if two centers are CONNECTED via defined channels (BFS)
function centersConnected(centerA, centerB, definedChannels) {
  if(centerA === centerB) return true;
  const adj = {};
  definedChannels.forEach(([,,cA,cB]) => {
    if(!adj[cA]) adj[cA]=[];
    if(!adj[cB]) adj[cB]=[];
    adj[cA].push(cB); adj[cB].push(cA);
  });
  const visited = new Set([centerA]);
  const queue = [centerA];
  while(queue.length) {
    const cur = queue.shift();
    if(cur === centerB) return true;
    (adj[cur]||[]).forEach(n => { if(!visited.has(n)) { visited.add(n); queue.push(n); }});
  }
  return false;
}

// Proper HD Type determination via graph connectivity
function determineHDType(allGates) {
  const {centers, channels} = getDefinedCenters(allGates);
  const dc = new Set(centers);

  // Reflector: NO defined centers (no complete channels at all)
  if(dc.size === 0) return 'Reflector';

  const hasSacral = dc.has('Sacral');
  const hasThroat = dc.has('Throat');

  // Motor centers: Heart, Solar Plexus, Sacral, Root
  const motorCenters = ['Heart','Solar Plexus','Sacral','Root'];
  const definedMotors = motorCenters.filter(m => dc.has(m));

  // Manifestor: motor(s) defined AND motor connected to Throat (no Sacral)
  if(!hasSacral && hasThroat) {
    const motorConnectedToThroat = definedMotors
      .filter(m => m !== 'Sacral')
      .some(m => centersConnected(m, 'Throat', channels));
    if(motorConnectedToThroat) return 'Manifestor';
  }

  // Generator types: Sacral is defined
  if(hasSacral) {
    if(hasThroat) {
      // Check if Sacral connects to Throat (possibly via other centers)
      if(centersConnected('Sacral', 'Throat', channels)) return 'Manifesting Generator';
      // Check if any motor connects to throat while sacral is also defined
      const motorToThroat = definedMotors
        .filter(m => m !== 'Sacral')
        .some(m => centersConnected(m, 'Throat', channels));
      if(motorToThroat) return 'Manifesting Generator';
    }
    return 'Generator';
  }

  // Projector: no Sacral, no motor-to-throat connection
  return 'Projector';
}

// Authority — proper hierarchy with dependency checks
function determineAuthority(allGates) {
  const {centers, channels} = getDefinedCenters(allGates);
  const dc = new Set(centers);
  const type = determineHDType(allGates);

  // Reflector always → Lunar
  if(type === 'Reflector') return 'Lunar';

  // Emotional (Solar Plexus) — overrides everything if defined
  if(dc.has('Solar Plexus')) return 'Emotional';

  // Sacral — only for Generators/MG
  if(dc.has('Sacral') && (type==='Generator'||type==='Manifesting Generator')) return 'Sacral';

  // Splenic — if Spleen defined (Projectors, Manifestors)
  if(dc.has('Spleen')) return 'Splenic';

  // Ego/Heart — Heart defined AND connected to Throat or G
  if(dc.has('Heart')) {
    if(dc.has('Throat') && centersConnected('Heart','Throat',channels)) return 'Ego Manifested';
    if(dc.has('G') && centersConnected('Heart','G',channels)) return 'Ego Projected';
    return 'Ego Manifested';
  }

  // Self-Projected — G defined and connected to Throat (no motors defined)
  if(dc.has('G') && dc.has('Throat') && centersConnected('G','Throat',channels)) return 'Self-Projected';

  // Mental (No-Authority Projector) — only Ajna or Head defined, projector
  if(type === 'Projector') return 'Mental';

  return 'Lunar';
}

// Expose getDefinedCenters as simpler interface
function getDefinedCentersList(allGates) {
  return getDefinedCenters(allGates).centers;
}

// Profile: line numbers from personality Sun gate and design Sun gate
// NOTE (Phase 01 baseline audit): this was a verbatim duplicate of lonToLine()
// defined above (line ~509 of this file / ~2321 of legacy index.html).
// Removed as a no-op dedupe — identical body, so behavior is unchanged.
// See docs/KNOWN_APPROXIMATIONS.md item "duplicate lonToLine".

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


// ═══════════════════════════════════════════════════════════
//  MAIN COMPUTE
// ═══════════════════════════════════════════════════════════
const SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const PSYMS={Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',Ascendant:'↑',Earth:'⊕'};
const ZW_STARS=['紫微 Purple Star','天機 Heavenly Secret','太陽 Sun Star','武曲 Military Arts','天同 Heavenly Harmony','廉貞 Chastity Star','天府 Heavenly Vault','太陰 Moon Star','貪狼 Greedy Wolf','巨門 Giant Gate','天相 Heavenly Minister','天梁 Heavenly Roof'];
const ZW_PAL=['Life','Siblings','Spouse','Children','Wealth','Health','Travel','Friends','Career','Property','Fortune','Parents'];
const HD_AUTHS=['Sacral','Emotional','Splenic','Ego Manifested','Self-Projected','Mental'];
const HD_PROFS=['1/3','1/4','2/4','2/5','3/5','3/6','4/6','4/1','5/1','5/2','6/2','6/3'];
const HD_CENTERS=['Head','Ajna','Throat','G','Heart','Solar Plexus','Sacral','Spleen','Root'];

// Lat/Lon lookup (major cities — extended)
const CITY_LL = {
  'jakarta':[-6.2,106.8],'bandung':[-6.9,107.6],'surabaya':[-7.3,112.7],'yogyakarta':[-7.8,110.4],
  'bali':[-8.4,115.2],'denpasar':[-8.65,115.22],'medan':[3.6,98.7],'semarang':[-7.0,110.4],
  'singapore':[1.35,103.82],'kuala lumpur':[3.15,101.7],'bangkok':[13.75,100.5],'manila':[14.6,121.0],
  'tokyo':[35.68,139.69],'seoul':[37.57,126.98],'beijing':[39.9,116.4],'shanghai':[31.23,121.47],
  'hong kong':[22.32,114.17],'london':[51.5,-0.12],'paris':[48.85,2.35],'berlin':[52.52,13.4],
  'new york':[40.71,-74.0],'los angeles':[34.05,-118.24],'sydney':[-33.87,151.21],'melbourne':[-37.81,144.96],
  'dubai':[25.2,55.27],'mumbai':[19.07,72.88],'delhi':[28.61,77.2],'cairo':[30.05,31.25],
  'default':[-6.2,106.8]
};

function getLatLon(city) {
  const c = city.toLowerCase();
  for(const k in CITY_LL) { if(c.includes(k)) return CITY_LL[k]; }
  return CITY_LL.default;
}

// Approximate timezone from longitude
function tzFromLon(lon) { return Math.round(lon/15); }

function computeChart(name, dateStr, timeStr, city, confirmedLat, confirmedLon, confirmedTz) {
  const d = new Date(dateStr + 'T' + (timeStr||'12:00'));
  const yr = d.getFullYear(), mo = d.getMonth()+1, dy = d.getDate();
  const hr = d.getHours() + d.getMinutes()/60;
  // Use confirmed coords if available, else fall back to lookup
  let lat, lon, tz;
  if(confirmedLat !== undefined && !isNaN(confirmedLat)) {
    lat = confirmedLat; lon = confirmedLon; tz = confirmedTz;
  } else {
    const ll = getLatLon(city);
    lat = ll[0]; lon = ll[1]; tz = tzFromLon(lon);
  }
  const utcHr = hr - tz;

  // Julian Day (UTC)
  const jd = toJD(yr, mo, dy, utcHr, 0);

  // Planetary longitudes
  const sunLon = sunLongitude(jd);
  const moonLon = moonLongitude(jd);
  const mercLon = mercuryLongitude(jd);
  const venLon = venusLongitude(jd);
  const marLon = marsLongitude(jd);
  const jupLon = jupiterLongitude(jd);
  const satLon = saturnLongitude(jd);
  const uraLon = uranusLongitude(jd);
  const nepLon = neptuneLongitude(jd);
  const pluLon = plutoLongitude(jd);
  // Ascendant requires birth time — without it, use Sun as fallback (clearly flagged)
  const ascLon = timeStr ? calcAscendant(jd, lat, lon) : sunLon;
  const earthLon = normalizeAngle(sunLon + 180);

  const lons = { Sun:sunLon, Moon:moonLon, Mercury:mercLon, Venus:venLon, Mars:marLon,
                  Jupiter:jupLon, Saturn:satLon, Uranus:uraLon, Neptune:nepLon, Pluto:pluLon,
                  Ascendant:ascLon };

  const planets = {};
  for(const [p,l] of Object.entries(lons)) {
    const s = lonToSign(l);
    planets[p] = { ...s, sym: PSYMS[p] };
  }

  // ── RETROGRADE DETECTION ──
  const lonFns = {
    Mercury: mercuryLongitude, Venus: venusLongitude, Mars: marsLongitude,
    Jupiter: jupiterLongitude, Saturn: saturnLongitude, Uranus: uranusLongitude,
    Neptune: neptuneLongitude, Pluto: plutoLongitude,
  };
  const retrograde = {};
  Object.entries(lonFns).forEach(([p, fn]) => {
    retrograde[p] = isRetrograde(fn, jd);
  });
  // Sun and Moon never retrograde from geocentric perspective
  retrograde.Sun = false; retrograde.Moon = false;

  // Add retrograde and dignity to planet data
  for(const [p] of Object.entries(lons)) {
    planets[p].retrograde = retrograde[p] || false;
    planets[p].dignity = getPlanetDignity(p, planets[p].sign);
  }

  // Houses — Whole Sign system
  const ascSignIdx = planets.Ascendant.idx;
  const houses = Array.from({length:12},(_,i) => i * 30 + ascSignIdx * 30);
  // MC (Midheaven) — separate from Whole Sign, needed for career axis
  const mc = timeStr ? calcMC(jd, lat, lon) : null;
  const mcSign = mc !== null ? lonToSign(mc) : null;

  // Aspects with full metadata — luminaries get wider orbs, applying/separating
  const pKeys = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn'];
  const aspects = [];
  for(let i=0;i<pKeys.length;i++) {
    for(let j=i+1;j<pKeys.length;j++) {
      const pA = pKeys[i], pB = pKeys[j];
      const asp = aspectWithOrb(lons[pA], lons[pB], pA, pB, lonFns[pA], lonFns[pB], jd);
      if(asp) aspects.push({
        a:pA, b:pB,
        t:asp.type,
        exactness: asp.exactness,
        strength: asp.strength,
        tight: asp.tight,
        applying: asp.applying, // true=applying, false=separating
        orb: asp.exactness
      });
    }
  }
  // Sort aspects by strength (tightest first)
  aspects.sort((a,b) => b.strength - a.strength);

  // Element from signs (Western 4 elements)
  const SIGN_EL={Aries:'Fire',Leo:'Fire',Sagittarius:'Fire',Taurus:'Earth',Virgo:'Earth',Capricorn:'Earth',Gemini:'Air',Libra:'Air',Aquarius:'Air',Cancer:'Water',Scorpio:'Water',Pisces:'Water'};
  const elCounts={Fire:0,Earth:0,Air:0,Water:0};
  ['Sun','Moon','Mercury','Venus','Mars'].forEach(p=>{ const e=SIGN_EL[planets[p].sign]; if(e) elCounts[e]++; });

  // ── BAZI — Solar Term accurate ──
  const localHr = utcHr + tz;
  const byearData = baziYearFromSun(yr, mo, sunLon);
  const byear = { stem:STEMS[byearData.si], branch:BRANCHES[byearData.bi], el:STEM_EL[byearData.si], si:byearData.si, bi:byearData.bi };
  const bmonth = baziMonth(sunLon, byearData.si);
  const bday = baziDay(yr, mo, dy, utcHr, tz);
  const bhour = timeStr ? baziHour(bday.si, localHr) : { stem:'—',branch:'—',el:'—',si:0,bi:0 };
  const dayMaster = bday.el;

  // Element counts from pillars (Five Elements)
  const baziEls = {Wood:0,Fire:0,Earth:0,Metal:0,Water:0};
  [byear,bmonth,bday,bhour].forEach(p => {
    if(!p.el || p.el==='—') return;
    const base = p.el.split(' ')[1];
    if(baziEls[base]!==undefined) baziEls[base]++;
  });
  // Also add hidden stems from branch — multiple elements per branch
  const BRANCH_HIDDEN_FULL = {
    'Rat':   ['Water'],
    'Ox':    ['Earth','Water','Metal'],
    'Tiger': ['Wood','Fire','Earth'],
    'Rabbit':['Wood'],
    'Dragon':['Earth','Wood','Water'],
    'Snake': ['Fire','Earth','Metal'],
    'Horse': ['Fire','Earth'],
    'Goat':  ['Earth','Fire','Wood'],
    'Monkey':['Metal','Water','Earth'],
    'Rooster':['Metal'],
    'Dog':   ['Earth','Fire','Metal'],
    'Pig':   ['Water','Wood'],
  };
  [byear,bmonth,bday,bhour].forEach(p => {
    if(!p.branch || p.branch==='—') return;
    const animal = p.branch.split(' ')[1];
    const hiddenEls = BRANCH_HIDDEN_FULL[animal] || [];
    hiddenEls.forEach((el, idx) => {
      // Main hidden stem = 0.5, secondary = 0.3, tertiary = 0.2
      const weight = idx === 0 ? 0.5 : idx === 1 ? 0.3 : 0.2;
      if(baziEls[el] !== undefined) baziEls[el] += weight;
    });
  });
  // Round and find favourable/unfavourable
  Object.keys(baziEls).forEach(k=>{ baziEls[k]=Math.round(baziEls[k]*10)/10; });
  const favEl = Object.entries(baziEls).sort((a,b)=>a[1]-b[1])[0][0];
  const unfavEl = Object.entries(baziEls).sort((a,b)=>b[1]-a[1])[0][0];

  // ── HIDDEN STEMS per Pillar (完整藏干) ──
  const BRANCH_HIDDEN_STEMS = {
    'Rat':   [{stem:'癸 Guǐ',el:'Yin Water',weight:'主'}],
    'Ox':    [{stem:'己 Jǐ',el:'Yin Earth',weight:'主'},{stem:'癸 Guǐ',el:'Yin Water',weight:'中'},{stem:'辛 Xīn',el:'Yin Metal',weight:'余'}],
    'Tiger': [{stem:'甲 Jiǎ',el:'Yang Wood',weight:'主'},{stem:'丙 Bǐng',el:'Yang Fire',weight:'中'},{stem:'戊 Wù',el:'Yang Earth',weight:'余'}],
    'Rabbit':[{stem:'乙 Yǐ',el:'Yin Wood',weight:'主'}],
    'Dragon':[{stem:'戊 Wù',el:'Yang Earth',weight:'主'},{stem:'乙 Yǐ',el:'Yin Wood',weight:'中'},{stem:'癸 Guǐ',el:'Yin Water',weight:'余'}],
    'Snake': [{stem:'丙 Bǐng',el:'Yang Fire',weight:'主'},{stem:'戊 Wù',el:'Yang Earth',weight:'中'},{stem:'庚 Gēng',el:'Yang Metal',weight:'余'}],
    'Horse': [{stem:'丁 Dīng',el:'Yin Fire',weight:'主'},{stem:'己 Jǐ',el:'Yin Earth',weight:'中'}],
    'Goat':  [{stem:'己 Jǐ',el:'Yin Earth',weight:'主'},{stem:'丁 Dīng',el:'Yin Fire',weight:'中'},{stem:'乙 Yǐ',el:'Yin Wood',weight:'余'}],
    'Monkey':[{stem:'庚 Gēng',el:'Yang Metal',weight:'主'},{stem:'壬 Rén',el:'Yang Water',weight:'中'},{stem:'戊 Wù',el:'Yang Earth',weight:'余'}],
    'Rooster':[{stem:'辛 Xīn',el:'Yin Metal',weight:'主'}],
    'Dog':   [{stem:'戊 Wù',el:'Yang Earth',weight:'主'},{stem:'丁 Dīng',el:'Yin Fire',weight:'中'},{stem:'辛 Xīn',el:'Yin Metal',weight:'余'}],
    'Pig':   [{stem:'壬 Rén',el:'Yang Water',weight:'主'},{stem:'甲 Jiǎ',el:'Yang Wood',weight:'中'}],
  };

  function getHiddenStems(pillar) {
    if(!pillar||pillar.branch==='—') return [];
    const animal = pillar.branch.split(' ')[1];
    return BRANCH_HIDDEN_STEMS[animal] || [];
  }

  const byearHidden  = getHiddenStems(byear);
  const bmonthHidden = getHiddenStems(bmonth);
  const bdayHidden   = getHiddenStems(bday);
  const bhourHidden  = getHiddenStems(bhour);

  // ── 10 GODS (十神) — relationship between stem and Day Master ──
  // Based on Day Master element vs each stem element
  const EL_BASE = {
    'Yang Wood':0,'Yin Wood':1,'Yang Fire':2,'Yin Fire':3,'Yang Earth':4,
    'Yin Earth':5,'Yang Metal':6,'Yin Metal':7,'Yang Water':8,'Yin Water':9
  };
  const STEM_CHAR = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

  function get10God(dmEl, stemEl) {
    if(!dmEl||!stemEl||stemEl==='—') return '';
    const dmIdx = EL_BASE[dmEl] ?? -1;
    const sIdx  = EL_BASE[stemEl] ?? -1;
    if(dmIdx<0||sIdx<0) return '';
    const dmBase = Math.floor(dmIdx/2); // 0=Wood,1=Fire,2=Earth,3=Metal,4=Water
    const sBase  = Math.floor(sIdx/2);
    const dmYin  = dmIdx%2===1; // is DM yin?
    const sYin   = sIdx%2===1;  // is stem yin?
    const samePol= dmYin===sYin;

    // 5 element relationships from DM perspective
    const rel = ((sBase - dmBase + 5) % 5);
    // rel=0 same, rel=1 DM generates, rel=2 generated by, rel=3 controls, rel=4 controlled by
    const RELS_SAME_POL  = ['Friend','Rob Wealth','Output','7 Killings','Indirect Resource'];
    const RELS_DIFF_POL  = ['Rob Wealth','Friend','Hurting Officer','Direct Officer','Direct Resource'];
    // Standard 10 Gods mapping
    if(rel===0) return samePol ? '比肩 Friend'     : '劫財 Rob Wealth';
    if(rel===1) return samePol ? '食神 Eating God'  : '傷官 Hurting Officer';
    if(rel===2) return samePol ? '偏財 Indirect Wealth':'正財 Direct Wealth';
    if(rel===3) return samePol ? '七殺 7 Killings'  : '正官 Direct Officer';
    if(rel===4) return samePol ? '偏印 Indirect Resource':'正印 Direct Resource';
    return '';
  }

  // Calculate 10 Gods for all 4 pillars' stems
  const pillars10Gods = [byear,bmonth,bday,bhour].map((p,i) => ({
    pillar: ['Year','Month','Day','Hour'][i],
    stem: p.stem,
    el: p.el,
    god: i===2 ? '日主 Day Master' : get10God(dayMaster, p.el),
    branch: p.branch,
    hiddenStems: [byearHidden,bmonthHidden,bdayHidden,bhourHidden][i]
  }));

  // ── SYMBOLIC STARS (神煞) — calculated from Day Pillar branch ──
  // Nobleman Star (天乙貴人): from Day Stem
  const NOBLEMAN_MAP = {
    '甲 Jiǎ':['未 Goat','丑 Ox'],'乙 Yǐ':['申 Monkey','子 Rat'],
    '丙 Bǐng':['酉 Rooster','亥 Pig'],'丁 Dīng':['酉 Rooster','亥 Pig'],
    '戊 Wù':['丑 Ox','未 Goat'],'己 Jǐ':['子 Rat','申 Monkey'],
    '庚 Gēng':['丑 Ox','未 Goat'],'辛 Xīn':['午 Horse','寅 Tiger'],
    '壬 Rén':['卯 Rabbit','巳 Snake'],'癸 Guǐ':['卯 Rabbit','巳 Snake']
  };

  // Peach Blossom (桃花): from Year/Day branch
  const PEACH_MAP = {'子 Rat':'酉 Rooster','午 Horse':'卯 Rabbit','卯 Rabbit':'子 Rat','酉 Rooster':'午 Horse',
                     '寅 Tiger':'卯 Rabbit','申 Monkey':'酉 Rooster','巳 Snake':'午 Horse','亥 Pig':'子 Rat',
                     '辰 Dragon':'酉 Rooster','戌 Dog':'卯 Rabbit','丑 Ox':'午 Horse','未 Goat':'子 Rat'};

  // Travelling Horse Star (驛馬): from Year/Day branch
  const HORSE_MAP = {'申 Monkey':'寅 Tiger','子 Rat':'寅 Tiger','辰 Dragon':'寅 Tiger',
                     '寅 Tiger':'申 Monkey','午 Horse':'申 Monkey','戌 Dog':'申 Monkey',
                     '亥 Pig':'巳 Snake','卯 Rabbit':'巳 Snake','未 Goat':'巳 Snake',
                     '巳 Snake':'亥 Pig','酉 Rooster':'亥 Pig','丑 Ox':'亥 Pig'};

  // Academic Star (文昌): from Day Stem
  const ACADEMIC_MAP = {'甲 Jiǎ':'巳 Snake','乙 Yǐ':'午 Horse','丙 Bǐng':'申 Monkey','丁 Dīng':'酉 Rooster',
                        '戊 Wù':'申 Monkey','己 Jǐ':'酉 Rooster','庚 Gēng':'亥 Pig','辛 Xīn':'子 Rat',
                        '壬 Rén':'寅 Tiger','癸 Guǐ':'卯 Rabbit'};

  const allBranches = [byear.branch,bmonth.branch,bday.branch,bhour.branch];
  const dayStemFull = bday.stem; // e.g. '甲 Jiǎ'

  const nobStars  = (NOBLEMAN_MAP[dayStemFull]||[]).filter(nb => allBranches.includes(nb));
  const peachStar = allBranches.filter(b => PEACH_MAP[bday.branch]===b || PEACH_MAP[byear.branch]===b);
  const horseStar = allBranches.filter(b => HORSE_MAP[bday.branch]===b || HORSE_MAP[byear.branch]===b);
  const acaStar   = allBranches.filter(b => ACADEMIC_MAP[dayStemFull]===b);

  // Build symbolic stars list
  const symbolicStars = [];
  if(nobStars.length)  symbolicStars.push({icon:'⭐',name:'Nobleman Star · 天乙貴人',desc:'Cerdas dan selalu mendapat bantuan dari orang berpengaruh di sekitarnya.',loc:nobStars.join(', ')});
  if(acaStar.length)   symbolicStars.push({icon:'📚',name:'Academic Star · 文昌',desc:'Sangat cerdas secara akademis dan intelektual. Menikmati kesuksesan dalam pendidikan.',loc:acaStar.join(', ')});
  if(peachStar.length) symbolicStars.push({icon:'🌸',name:'Peach Blossom Star · 桃花',desc:'Menarik, karismatik, dan memiliki daya pikat sosial yang kuat. Hubungan romantis penuh warna.',loc:peachStar.join(', ')});
  if(horseStar.length) symbolicStars.push({icon:'🐎',name:'Travelling Horse Star · 驛馬',desc:'Sering bepergian atau bekerja di luar negeri. Bintang pergerakan dan mobilitas tinggi.',loc:horseStar.join(', ')});

  // Additional stars
  const GENERAL_MAP = {'子 Rat':['申 Monkey'],'午 Horse':['寅 Tiger'],'卯 Rabbit':['亥 Pig'],'酉 Rooster':['巳 Snake'],
                        '寅 Tiger':['午 Horse'],'申 Monkey':['子 Rat'],'巳 Snake':['酉 Rooster'],'亥 Pig':['卯 Rabbit'],
                        '辰 Dragon':['申 Monkey'],'戌 Dog':['寅 Tiger'],'丑 Ox':['巳 Snake'],'未 Goat':['亥 Pig']};
  const generalStar = allBranches.filter(b=>(GENERAL_MAP[byear.branch]||[]).includes(b));
  if(generalStar.length) symbolicStars.push({icon:'⚔️',name:'General Star · 將星',desc:'Kekayaan, kemakmuran, dan potensi karir di bidang kepemimpinan atau politik.',loc:generalStar.join(', ')});

  // Flower of Romance (咸池)
  const ROMANCE_MAP = {'申 Monkey':'酉 Rooster','子 Rat':'酉 Rooster','辰 Dragon':'酉 Rooster',
                       '寅 Tiger':'卯 Rabbit','午 Horse':'卯 Rabbit','戌 Dog':'卯 Rabbit',
                       '亥 Pig':'子 Rat','卯 Rabbit':'子 Rat','未 Goat':'子 Rat',
                       '巳 Snake':'午 Horse','酉 Rooster':'午 Horse','丑 Ox':'午 Horse'};
  const romanceStar = allBranches.filter(b=>ROMANCE_MAP[byear.branch]===b||ROMANCE_MAP[bday.branch]===b);
  if(romanceStar.length) symbolicStars.push({icon:'💝',name:'Flower of Romance · 咸池',desc:'Romansa dan daya tarik asmara yang kuat. Posisi di Year/Month = pernikahan harmonis; Day/Hour = daya pikat eksternal.',loc:romanceStar.join(', ')});

  // Solitary Star (孤辰/寡宿)
  const SOLITARY_MAP = {'寅 Tiger':['巳 Snake'],'卯 Rabbit':['巳 Snake'],'辰 Dragon':['巳 Snake'],
                         '巳 Snake':['申 Monkey'],'午 Horse':['申 Monkey'],'未 Goat':['申 Monkey'],
                         '申 Monkey':['亥 Pig'],'酉 Rooster':['亥 Pig'],'戌 Dog':['亥 Pig'],
                         '亥 Pig':['寅 Tiger'],'子 Rat':['寅 Tiger'],'丑 Ox':['寅 Tiger']};
  const solitaryStar = allBranches.filter(b=>(SOLITARY_MAP[byear.branch]||[]).includes(b));
  if(solitaryStar.length) symbolicStars.push({icon:'🌙',name:'Solitary Star · 孤辰',desc:'Cenderung memilih waktu sendiri atau jalur yang membawa kesendirian karena pilihan hidup atau takdir.',loc:solitaryStar.join(', ')});

  // ── KUA NUMBER (九宫飞星) ──
  // Kua = (11 - (sum of birth year digits)) % 9  for male
  //     = (sum of birth year digits + 4) % 9     for female
  // Use byearData.baziYr for Kua calculation
  const kuaYrDigits = byearData.baziYr.toString().split('').reduce((a,b)=>a+Number(b),0);
  const kuaYrReduced = kuaYrDigits>9 ? kuaYrDigits.toString().split('').reduce((a,b)=>a+Number(b),0) : kuaYrDigits;
  // Default male — gender detection from city field
  const isFemale = city.toLowerCase().includes('wanita')||city.toLowerCase().includes('female')||city.toLowerCase().includes('perempuan')||city.toLowerCase().includes(' f ');
  let kuaNum = isFemale ? (kuaYrReduced + 4) % 9 : (11 - kuaYrReduced) % 9;
  if(kuaNum===0) kuaNum=9;
  if(kuaNum===5) kuaNum = isFemale ? 8 : 2; // 5 replaces with 2 male, 8 female

  const KUA_DIRECTIONS = {
    1:{good:['SE','E','S','N'],bad:['W','NE','NW','SW'],group:'East Group'},
    2:{good:['NE','W','NW','SW'],bad:['SE','E','S','N'],group:'West Group'},
    3:{good:['S','N','SE','E'],bad:['W','NE','NW','SW'],group:'East Group'},
    4:{good:['N','S','E','SE'],bad:['NE','W','SW','NW'],group:'East Group'},
    6:{good:['W','NE','SW','NW'],bad:['SE','E','S','N'],group:'West Group'},
    7:{good:['NW','SW','NE','W'],bad:['S','N','SE','E'],group:'West Group'},
    8:{good:['SW','NW','W','NE'],bad:['S','N','SE','E'],group:'West Group'},
    9:{good:['E','SE','N','S'],bad:['NE','W','NW','SW'],group:'East Group'},
  };
  const KUA_GOOD_LABELS  = ['Success','Health','Love/Romance','Study'];
  const KUA_BAD_LABELS   = ['Bad Luck','Five Ghosts','Six Killings','Total Loss'];
  const KUA_DIR_COMPASS  = {N:'↑',NE:'↗',E:'→',SE:'↘',S:'↓',SW:'↙',W:'←',NW:'↖'};

  const kuaDirs = KUA_DIRECTIONS[kuaNum] || KUA_DIRECTIONS[1];
  // Requires: gender, year yin/yang polarity, days from birth to next/prev solar term
  // Forward (順): Yang man, Yin woman → count to NEXT solar term
  // Backward (逆): Yin man, Yang woman → count to PREV solar term
  const gender = city.toLowerCase().includes('female') || city.toLowerCase().includes('f') ? 'f' : 'm';
  // Year polarity: Yang years (Jiǎ,Bǐng,Wù,Gēng,Rén) = even stems 0,2,4,6,8
  const yearYangYin = byear.si % 2 === 0 ? 'yang' : 'yin';
  // Forward flow: Yang male or Yin female
  const forwardFlow = (yearYangYin === 'yang') === (gender === 'm');

  // Find days to solar term boundary
  // Solar term = when Sun reaches next multiple of 30° from month start
  const currentMonthStartLon = BAZI_MONTH_START_LON[getBaziMonthIdx(sunLon)];
  const nextMonthStartLon = BAZI_MONTH_START_LON[(getBaziMonthIdx(sunLon)+1)%12];
  // JD when Sun reaches next solar term (approximate: search forward)
  let termJD = jd;
  const targetLon = forwardFlow ? nextMonthStartLon : currentMonthStartLon;
  if(forwardFlow) {
    termJD = jdWhenSunAt(nextMonthStartLon, jd + 15);
  } else {
    termJD = jdWhenSunAt(currentMonthStartLon, jd - 15);
  }
  const daysToTerm = Math.abs(termJD - jd);
  // Rule: 3 days = 1 year of Da Yun
  const luckStartAge = Math.round(daysToTerm / 3);

  const luckPillars = Array.from({length:8},(_,i) => {
    const offset = forwardFlow ? i+1 : -(i+1);
    const pillarSi = ((byear.si + offset) % 10 + 10) % 10;
    const pillarBi = ((byear.bi + offset) % 12 + 12) % 12;
    return {
      age: luckStartAge + i*10,
      stem: STEMS[pillarSi],
      branch: BRANCHES[pillarBi],
      el: STEM_EL[pillarSi],
      flow: forwardFlow ? '順' : '逆'
    };
  });

  // ── HUMAN DESIGN — 88° solar arc for design chart ──
  const designJD = getDesignJD(jd);
  const designSunLon = sunLongitude(designJD);
  const designMoonLon = moonLongitude(designJD);
  const designEarthLon = normalizeAngle(designSunLon + 180);
  const designMercuryLon = mercuryLongitude(designJD);

  // Personality (conscious) gates from birth
  const pGates = [
    lonToGate(sunLon), lonToGate(earthLon),
    lonToGate(moonLon), lonToGate(ascLon),
    lonToGate(mercLon), lonToGate(venLon),
    lonToGate(marLon),
  ];
  // Design (unconscious) gates from 88° prior
  const dGates = [
    lonToGate(designSunLon), lonToGate(designEarthLon),
    lonToGate(designMoonLon), lonToGate(designMercuryLon),
  ];

  const allHDGates = [...new Set([...pGates, ...dGates])];
  // Graph-based center definition
  const hdCenterResult = getDefinedCenters(allHDGates);
  const definedCenters = hdCenterResult.centers;
  const definedChannels = hdCenterResult.channels;
  const undefinedCenters = HD_CENTERS.filter(c=>!definedCenters.includes(c));
  const hdOpenSP = undefinedCenters.includes('Solar Plexus');
  const hdOpenSacral = undefinedCenters.includes('Sacral');

  // Type via graph connectivity (proper)
  const hdTypeStr = determineHDType(allHDGates);
  // Authority via proper hierarchy
  const hdAuth = determineAuthority(allHDGates);

  // Profile = personality line + design line of Sun gate
  const pLine = lonToLine(sunLon);
  const dLine = lonToLine(designSunLon);
  const hdProf = pLine+'/'+dLine;

  const hdStrategy = {Generator:'Wait to Respond','Manifesting Generator':'Wait to Respond then Inform',Projector:'Wait for the Invitation',Manifestor:'Inform before Acting',Reflector:'Wait a Lunar Cycle'}[hdTypeStr];
  const hdNotSelf = {Generator:'Frustration','Manifesting Generator':'Frustration & Anger',Projector:'Bitterness',Manifestor:'Anger',Reflector:'Disappointment'}[hdTypeStr];

  const sunGate = pGates[0];
  const moonGate = pGates[2];
  const ascGate = pGates[3];
  const earthGate = pGates[1];
  const designGate = dGates[0];

  // ── Full personality planet data (gate + line + column) ──
  const PLANET_NAMES = ['Sun','Earth','Moon','Ascendant','Mercury','Venus','Mars'];
  const PLANET_SYMS  = ['☉','⊕','☽','↑','☿','♀','♂'];
  const PLANET_LONS_P = [sunLon,earthLon,moonLon,ascLon,mercLon,venLon,marLon];

  function lonToColumn(lon) {
    const adjusted = normalizeAngle(lon - HD_GATE_OFFSET);
    const gateOffset = adjusted % 5.625;
    const lineOffset = gateOffset % 0.9375;
    return Math.floor(lineOffset / (0.9375/6)) + 1; // 1-6
  }

  const pPlanetData = PLANET_LONS_P.map((l,i) => ({
    name: PLANET_NAMES[i], sym: PLANET_SYMS[i],
    gate: lonToGate(l), line: lonToLine(l), col: lonToColumn(l),
    lon: l, type:'conscious'
  }));

  // Design planets
  const DPLANET_NAMES = ['Design Sun','Design Earth','Design Moon','Design Mercury'];
  const DPLANET_SYMS  = ['◗','◗⊕','◗☽','◗☿'];
  const DPLANET_LONS = [designSunLon,designEarthLon,designMoonLon,designMercuryLon];
  const dPlanetData = DPLANET_LONS.map((l,i) => ({
    name: DPLANET_NAMES[i], sym: DPLANET_SYMS[i],
    gate: lonToGate(l), line: lonToLine(l), col: lonToColumn(l),
    lon: l, type:'unconscious'
  }));

  // ── ZI WEI — Approximate lunar month from Sun longitude ──
  const lunarMonth = approxLunarMonth(sunLon);
  const hourBranch = timeStr ? Math.floor(((localHr % 24 + 24) % 24 + 1) / 2) % 12 : 0;
  const zwLife = zwPalace(hourBranch, lunarMonth);
  const zwCareer = (zwLife + 6) % 12;
  const zwWealth = (zwLife + 2) % 12;
  const zwMarriage = (zwLife + 4) % 12;
  const zwMainStarIdx = (sunGate + moonGate) % 12;
  const zwMain = ZW_STARS[zwMainStarIdx];

  // ═══════════════════════════════════════════════════════════
  //  NUMEROLOGY — Pythagorean 3-Cycle Method (accurate)
  // ═══════════════════════════════════════════════════════════
  function numReduce(n, stopMaster) {
    // reduce to single digit, preserving master numbers 11,22,33 if stopMaster=true
    while(n > 9) {
      if(stopMaster && (n===11||n===22||n===33)) break;
      n = n.toString().split('').reduce((a,b)=>a+Number(b),0);
    }
    return n;
  }
  function numReduceCycle(n) {
    // reduce a cycle value: keep master numbers intact
    if(n===11||n===22||n===33) return n;
    return numReduce(n, true);
  }

  // ── LIFE PATH: 3-Cycle method ──
  // Reduce Month, Day, Year separately first, then add
  const lpMonth = numReduceCycle(mo);
  const lpDay   = numReduceCycle(dy);
  // Year: sum all digits, then reduce
  const yrDigits = yr.toString().split('').reduce((a,b)=>a+Number(b),0);
  const lpYear   = numReduceCycle(yrDigits);
  const lpRawSum = lpMonth + lpDay + lpYear;
  const lp       = numReduceCycle(lpRawSum);
  const lpKarmic = [13,14,16,19].includes(lpRawSum) ? lpRawSum : null;
  const lpIsMaster = (lp===11||lp===22||lp===33);

  // ── LETTER→NUMBER table (Pythagorean) ──
  // A=1 B=2 C=3 D=4 E=5 F=6 G=7 H=8 I=9
  // J=1 K=2 L=3 M=4 N=5 O=6 P=7 Q=8 R=9
  // S=1 T=2 U=3 V=4 W=5 X=6 Y=7 Z=8
  const PYTH = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8};
  const VOWELS = new Set(['a','e','i','o','u']);

  // Y-as-vowel detection: Y is vowel when it's the only vowel sound in the syllable,
  // or when following a consonant without adjacent vowels (Mary, Carolyn, Betty → vowel)
  // Simple rule: Y is vowel if no other vowel is adjacent in the same "cluster"
  function isYVowel(chars, idx) {
    const prev = chars[idx-1]; const next = chars[idx+1];
    const prevIsVowel = prev && VOWELS.has(prev);
    const nextIsVowel = next && VOWELS.has(next);
    // Y is consonant if: prev is vowel (Murray, Hayley), or Y starts the word with vowel sound (Yoda→consonant)
    // Y is vowel if: no vowel adjacent (Mary→vowel, Betty→vowel)
    if(prevIsVowel || nextIsVowel) return false;
    return true; // Y acts as vowel
  }

  function nameToNums(nameStr) {
    // Returns {all, vowels, consonants, lettersMap} for a single name part
    const chars = nameStr.toLowerCase().replace(/[^a-z]/g,'').split('');
    const all=[], vowels=[], consonants=[], lettersMap=[];
    chars.forEach((c,i) => {
      if(!PYTH[c]) return;
      const val = PYTH[c];
      let isV = VOWELS.has(c);
      if(c==='y') isV = isYVowel(chars, i);
      all.push(val);
      if(isV) vowels.push({c, val});
      else consonants.push({c, val});
      lettersMap.push({c, val, isV});
    });
    return {all, vowels, consonants, lettersMap};
  }

  // Split name into parts: first, [middle...], last
  function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/).filter(p=>p.length>0);
    if(parts.length === 0) return ['','',''];
    if(parts.length === 1) return [parts[0],'',''];
    if(parts.length === 2) return [parts[0],'',parts[1]];
    return [parts[0], parts.slice(1,-1).join(' '), parts[parts.length-1]];
  }

  const [nameFirst, nameMiddle, nameLast] = splitName(name);
  const nFirst  = nameToNums(nameFirst);
  const nMiddle = nameToNums(nameMiddle);
  const nLast   = nameToNums(nameLast);

  function calcNameNumber(partsArrays, type) {
    // type: 'all' | 'vowels' | 'consonants'
    let partTotals = [];
    partsArrays.forEach(part => {
      const arr = type==='vowels' ? part.vowels.map(v=>v.val)
                : type==='consonants' ? part.consonants.map(v=>v.val)
                : part.all;
      if(arr.length===0) return;
      const s = arr.reduce((a,b)=>a+b,0);
      partTotals.push(numReduceCycle(s));
    });
    if(partTotals.length===0) return {n:0,raw:0,parts:[]};
    const raw = partTotals.reduce((a,b)=>a+b,0);
    return {n: numReduceCycle(raw), raw, parts: partTotals};
  }

  const nameParts = [nFirst, nMiddle.all.length>0?nMiddle:null, nLast].filter(Boolean);

  const destObj  = calcNameNumber(nameParts, 'all');      // Expression/Destiny
  const soulObj  = calcNameNumber(nameParts, 'vowels');   // Heart's Desire / Soul Urge
  const persObj  = calcNameNumber(nameParts, 'consonants');// Personality

  const dest = destObj.n || 1;
  const soul = soulObj.n || 1;
  const pers = persObj.n || 1;

  const destKarmic = [13,14,16,19].includes(destObj.raw) ? destObj.raw : null;
  const soulKarmic = [13,14,16,19].includes(soulObj.raw) ? soulObj.raw : null;

  // ── BIRTHDAY NUMBER (day of birth reduced) ──
  const birthday = numReduceCycle(dy);

  // ── ATTITUDE / SUN NUMBER (month + day) ──
  const attitude = numReduceCycle(mo + dy);

  // ── PERSONAL YEAR NUMBER ──
  const todayY = new Date().getFullYear();
  const pyRaw = mo + dy + todayY.toString().split('').reduce((a,b)=>a+Number(b),0);
  const personalYear = numReduceCycle(pyRaw);
  const personalMonth = numReduceCycle(personalYear + new Date().getMonth()+1);

  // ── PINNACLE NUMBERS ──
  // First Pinnacle = month + day reduced
  // Second = day + year reduced
  // Third = first + second
  // Fourth = month + year reduced
  const pin1 = numReduceCycle(lpMonth + lpDay);
  const pin2 = numReduceCycle(lpDay + lpYear);
  const pin3 = numReduceCycle(pin1 + pin2);
  const pin4 = numReduceCycle(lpMonth + lpYear);
  // Ages when pinnacles shift (based on LP)
  const pinAge1 = 36 - lp;
  const pinAge2 = pinAge1 + 9;
  const pinAge3 = pinAge2 + 9;

  // ── CHALLENGE NUMBERS ──
  const ch1 = Math.abs(lpMonth - lpDay);
  const ch2 = Math.abs(lpDay - lpYear);
  const ch3 = Math.abs(ch1 - ch2);
  const ch4 = Math.abs(lpMonth - lpYear);

  // ── KARMIC LESSONS (missing numbers in full name) ──
  const allNameNums = new Set([...nFirst.all, ...nMiddle.all, ...nLast.all]);
  const karmicLessons = [1,2,3,4,5,6,7,8,9].filter(n => !allNameNums.has(n));

  // FUSION TRAITS — weighted by system contextual dominance
  // HD → behavioral energy | Astro → social persona | BaZi → survival adaptation
  const fire = elCounts.Fire, water = elCounts.Water, earth = elCounts.Earth, air = elCounts.Air;

  // Month branch contributes to "environmental pressure" — weighted heavier in BaZi
  const BRANCH_TEMP = {'Rat':'cold','Ox':'cold','Tiger':'warming','Rabbit':'warm','Dragon':'dry','Snake':'hot','Horse':'hot','Goat':'hot-dry','Monkey':'cooling','Rooster':'cool','Dog':'dry','Pig':'cold'};
  const monthAnimal = bmonth.branch.split(' ')[1];
  const monthTemp = BRANCH_TEMP[monthAnimal] || 'neutral';
  const monthPressure = monthTemp.includes('hot') ? 'fire' : monthTemp.includes('cold') ? 'water' : monthTemp.includes('warm') ? 'wood' : 'earth';

  // BaZi Day Master strength (simplified season-aware)
  const dmElement = dayMaster.split(' ')[1]; // Wood/Fire/Earth/Metal/Water
  const seasonSupport = {
    Wood: monthPressure==='wood'||monthPressure==='water',
    Fire: monthPressure==='fire'||monthPressure==='wood',
    Earth: monthPressure==='earth'||monthPressure==='fire',
    Metal: monthPressure==='earth'||monthPressure==='metal',
    Water: monthPressure==='water'||monthPressure==='metal',
  }[dmElement] || false;
  const dmStrength = seasonSupport ? 'strong' : 'weak'; // simplified

  // Traits now differentiate by authority context (HD), not just count
  const hdConserving = hdTypeStr === 'Projector' || hdTypeStr === 'Reflector';
  const traits = [
    {n:'Kepemimpinan',    s: Math.min(95, 40 + fire*10 + (planets.Sun.idx===4?18:0) + (lp===1||lp===8?14:0) - (hdConserving?10:0))},
    {n:'Intuisi',         s: Math.min(95, 38 + water*13 + (planets.Moon.idx===11||planets.Moon.idx===3?16:0) + (hdAuth==='Splenic'?15:0))},
    {n:'Kreativitas',     s: Math.min(95, 35 + (fire+air)*8 + (lp===3||lp===6?15:0))},
    {n:'Kedalaman Emosi', s: Math.min(95, 33 + water*13 + (hdOpenSP?15:0) + (planets.Moon.idx===8?18:0))},
    {n:'Analitis',        s: Math.min(95, 28 + (air+earth)*11 + (planets.Mercury.idx===5?16:0) + (lp===7?14:0))},
    {n:'Rohani',          s: Math.min(95, 22 + water*11 + (lp===7||lp===9||lp===11?20:0))},
  ].sort((a,b)=>b.s-a.s);

  // ── SOUL SCORE — dimensional, transparent anatomy ──
  const SIGN_EL2 = {Aries:'Fire',Leo:'Fire',Sagittarius:'Fire',Taurus:'Earth',Virgo:'Earth',Capricorn:'Earth',Gemini:'Air',Libra:'Air',Aquarius:'Air',Cancer:'Water',Scorpio:'Water',Pisces:'Water'};

  const aspHarmony = aspects.filter(a=>a.t==='Trine'||a.t==='Sextile').length;
  const aspTension = aspects.filter(a=>a.t==='Square'||a.t==='Opposition').length;
  const elBalance = 4 - Math.max(...Object.values(elCounts));
  const astroScore = Math.min(100, Math.round(50 + aspHarmony*8 - aspTension*4 + elBalance*6 + (SIGN_EL2[planets.Sun.sign]===SIGN_EL2[planets.Moon.sign]?10:0)));

  const baziMax = Math.max(...Object.values(baziEls));
  const baziMin = Math.min(...Object.values(baziEls).filter(v=>v>0));
  const baziBalance = Math.round(100 - (baziMax - baziMin) * 15);
  const baziScore = Math.min(100, Math.max(30, baziBalance + (dmStrength==='strong'?12:-5)));

  const defRatio = definedCenters.length / 9;
  const hdScore = Math.min(100, Math.round(40 + defRatio*40 + (hdAuth==='Sacral'||hdAuth==='Emotional'?8:0)));

  const shadowBase = Math.max(20, 70 - aspTension*8 + water*10 + (lp===7||lp===9||lp===11?12:0));
  const shadowScore = Math.min(90, Math.round(shadowBase));
  const numCoherence = 100 - Math.abs(lp - dest)*8 - Math.abs(lp - soul)*5;
  const numScore = Math.min(100, Math.max(30, Math.round(numCoherence)));

  const soulDimensions = [
    { label:'Resonansi Astrologis', score: astroScore, weight:0.25, source:'Sun/Moon/Aspect', color:'#c9a84c' },
    { label:'Keseimbangan BaZi', score: baziScore, weight:0.25, source:'Five Elements + Season', color:'#5a9e78' },
    { label:'Koherensi HD', score: hdScore, weight:0.20, source:'Centers/Gates', color:'#6b7fd4' },
    { label:'Integrasi Shadow', score: shadowScore, weight:0.20, source:'Depth Pattern', color:'#8b6fb5' },
    { label:'Keselarasan Numerologi', score: numScore, weight:0.10, source:'LP/Destiny/Soul', color:'#4a9e9e' },
  ];
  const soulScore = Math.round(soulDimensions.reduce((acc,d)=>acc+d.score*d.weight,0));
  const soulLabel = soulScore>=82?'Luminous':soulScore>=68?'Attuned':soulScore>=52?'Emerging':'Seeking';
  const soulDesc = {
    Luminous:'Sistem-sistem utama dalam bagan lahirmu menunjukkan koherensi yang cukup tinggi. Ini bukan berarti hidup tanpa konflik — tapi kapasitas untuk mengintegrasikan pengalaman relatif besar.',
    Attuned:'Ada resonansi kuat di sebagian besar dimensi, dengan beberapa area yang masih dalam proses kalibrasi. Pattern yang muncul berulang adalah area terbesar untuk pertumbuhan.',
    Emerging:'Sistem-sistem dalam bagan lahirmu menunjukkan tension yang produktif. Bukan kelemahan — ini energi transformasi yang belum sepenuhnya diarahkan.',
    Seeking:'Chart-mu menunjukkan banyak internal pull yang berbeda arah. Ini kondisi yang umum — dan biasanya berarti adaptasi yang kamu kembangkan untuk bertahan lebih dominan daripada blueprint aslinya.'
  }[soulLabel];

  // ── ERROR TOLERANCE ANALYSIS ──
  // How sensitive is this chart to birth time uncertainty?
  const ascSensitive = timeStr; // without time, ascendant is unknown
  // Ascendant changes sign roughly every 2 hours
  // HD design calculation: sensitive to minutes
  // BaZi hour pillar: changes every 2 hours
  const birthTimeSensitivity = !timeStr ? 'high' :
    (dy === new Date(yr, mo-1, dy+1, 0, 0).getDate()) ? 'medium' : // near midnight
    (bmonth.branch !== baziMonth(sunLon, byearData.si).branch) ? 'medium' : 'low';

  const sensitivityNote = {
    high: 'Tanpa jam lahir: Ascendant, HD Authority, dan BaZi Hour Pillar tidak dapat dihitung. Hasil ini menggunakan estimasi. Akurasi bisa berbeda ±1-2 sign untuk Ascendant.',
    medium: 'Jam lahir tersedia, tapi lahir dekat pergantian batas (tengah malam atau solar term). Beberapa hasil mungkin sensitif terhadap perbedaan ±30 menit.',
    low: 'Jam lahir dan koordinat lengkap. Hasil relatif stabil untuk variasi waktu normal (±15 menit).'
  }[birthTimeSensitivity];

  // ── SYMBOLIC CONFLICT ENGINE ──
  // This engine PRESERVES contradictions instead of resolving them smoothly.
  // It reads ADAPTATION (coping patterns) not just natal blueprint.

  const SIGN_EL_MAP = {Aries:'Fire',Leo:'Fire',Sagittarius:'Fire',Taurus:'Earth',Virgo:'Earth',Capricorn:'Earth',Gemini:'Air',Libra:'Air',Aquarius:'Air',Cancer:'Water',Scorpio:'Water',Pisces:'Water'};
  const sunEl = SIGN_EL_MAP[planets.Sun.sign] || 'Fire';
  const moonEl = SIGN_EL_MAP[planets.Moon.sign] || 'Water';

  // Read signals per system (domain-specific, not averaged)
  const signals = {
    // HD → behavioral mechanism (how you actually operate day-to-day)
    behavioralEnergy: hdTypeStr==='Generator'||hdTypeStr==='Manifesting Generator' ? 'high' :
                      hdTypeStr==='Manifestor' ? 'initiating' : 'conserving',
    // Astrology → social persona (how you appear in social contexts)
    socialPersona: sunEl==='Fire'||sunEl==='Air' ? 'expansive' : 'contractive',
    // BaZi → survival adaptation (what you do under pressure)
    survivalMode: dmStrength==='strong' ? 'dominant' : 'adaptive',
    // Moon → emotional processing style
    emotionalProcess: moonEl==='Water'?'absorptive': moonEl==='Fire'?'expressive': moonEl==='Air'?'deflective':'containing',
    // LP → life trajectory pull
    trajectoryPull: (lp===1||lp===8||lp===22)?'power':(lp===2||lp===6||lp===9)?'service':(lp===3||lp===5)?'expression':'depth',
    // Month branch → environmental pressure / temperament
    environmentalPressure: monthPressure,
    // Aspect tension → internal friction level
    frictionLevel: aspTension>=3?'high':aspTension>=1?'medium':'low',
  };

  // Detect BEHAVIORAL CONTRADICTIONS (not resolved — preserved as tension)
  const contradictions = [];

  // Contradiction: expansive persona + conserving behavioral energy
  if(signals.socialPersona==='expansive' && signals.behavioralEnergy==='conserving') {
    contradictions.push({
      title: 'Persona Ekspansif, Mekanisme Konservasi Energi',
      systemA: 'Sun '+planets.Sun.sign+' (Astro: Social Persona)',
      signalA: 'Tampil ekspresif, engaging, dan menarik secara sosial',
      systemB: 'HD '+hdTypeStr+' (Behavioral Mechanism)',
      signalB: 'Sistem yang tidak dirancang untuk output energi terus-menerus',
      resolution: 'Kamu mungkin terlihat selalu berenergi — padahal di baliknya sedang dalam mode recovery yang tidak terlihat. Orang membaca silence-mu sebagai rejection karena mereka terbiasa dengan versi ekspresifmu.',
      cost: 'Semakin besar persona sosialmu, semakin besar ekspektasi orang terhadap konsistensinya. Dan biaya untuk mempertahankan konsistensi itu tidak kelihatan dari luar.',
      adaptation: 'Kemungkinan kamu sudah mengembangkan kemampuan untuk "on demand" mengaktifkan persona sosial — tapi dengan biaya energi internal yang tidak proporsional.'
    });
  }

  // Contradiction: dominant survival mode + absorptive emotional processing
  if(signals.survivalMode==='dominant' && signals.emotionalProcess==='absorptive') {
    contradictions.push({
      title: 'Drive Dominansi, Sensitivitas Emosi Tersembunyi',
      systemA: 'BaZi '+dayMaster+' Strong (Survival Mode)',
      signalA: 'Kecenderungan mendominasi situasi dan mengambil kontrol',
      systemB: 'Moon '+planets.Moon.sign+(hdOpenSP?' + HD Open SP':''),
      signalB: 'Menyerap emosi lingkungan tanpa sadar, sangat sensitif terhadap rejection',
      resolution: 'Kamu menampilkan kepercayaan diri dan kontrol, tapi di dalam ada lapisan sensitivitas yang jauh lebih besar dari yang orang duga. Kombinasi ini sering menciptakan pola: mendorong keras ke luar, collapse di dalam.',
      cost: 'Orang dengan pola ini sering tidak mendapat ruang untuk vulnerable karena "image kuat" yang mereka proyeksikan. Lama-lama kelelahan emosi tanpa tempat untuk diproses.',
      adaptation: 'Kemungkinan kamu sudah belajar untuk mengubah emosi menjadi ambisi — yang membuat kamu produktif, tapi jarang benar-benar diproses.'
    });
  }

  // Contradiction: high friction (aspect tension) + service trajectory
  if(signals.frictionLevel==='high' && signals.trajectoryPull==='service') {
    contradictions.push({
      title: 'Internal Friction Tinggi, Dorongan Melayani',
      systemA: aspTension+' Square/Opposition Aspects',
      signalA: 'Tension internal yang signifikan antara berbagai dorongan',
      systemB: 'Life Path '+lp,
      signalB: 'Dorongan kuat untuk berkontribusi dan melayani orang lain',
      resolution: 'Kamu sering membantu orang lain memproses konflik mereka — padahal konflik internal-mu sendiri belum sepenuhnya diselesaikan. Ini bukan kemunafikan. Ini adalah cara lain untuk menghindari duduk dengan ketidaknyamanan diri sendiri.',
      cost: 'Orang yang sangat helpful seringkali adalah orang yang paling kesulitan meminta bantuan. Dan makin banyak orang yang bergantung padamu, makin sulit untuk berhenti.',
      adaptation: 'Helping behavior bisa menjadi coping mechanism yang sangat functional — sampai kamu burnout.'
    });
  }

  // Contradiction: fast cognitive style + weak/adaptive survival mode
  if((air>=2||planets.Mercury.idx===0||planets.Mercury.idx===1) && signals.survivalMode==='adaptive') {
    contradictions.push({
      title: 'Proses Berpikir Cepat, Eksekusi yang Butuh Konteks',
      systemA: 'Mercury '+planets.Mercury.sign+' / Air x'+air,
      signalA: 'Koneksi antar ide sangat cepat, sering sampai sebelum orang lain',
      systemB: 'BaZi '+dayMaster+' '+dmStrength+' — Month '+bmonth.branch,
      signalB: 'Ritme eksekusi yang butuh kondisi yang tepat untuk optimal',
      resolution: 'Kamu bisa melihat solusinya dengan jelas, tapi eksekusinya butuh energi dan kondisi yang tidak selalu tersedia. Ini menciptakan frustasi yang sering kamu alami sebagai "gagal memulai" padahal sebenarnya sedang menunggu alignment yang tepat.',
      cost: 'Orang dengan pola ini sering dilihat sebagai underperformer — padahal sebenarnya sedang menunggu kondisi yang right. Tapi dunia tidak selalu menunggu.',
      adaptation: 'Kemungkinan kamu sudah mengembangkan kemampuan untuk "fake momentum" — terlihat bergerak padahal masih dalam proses alignment internal.'
    });
  }

  // Contradiction: expression trajectory + containing emotional process
  if(signals.trajectoryPull==='expression' && signals.emotionalProcess==='containing') {
    contradictions.push({
      title: 'Dorongan Ekspresif, Proses Emosi yang Menutup',
      systemA: 'Life Path '+lp,
      signalA: 'Terdorong kuat untuk mengekspresikan dan berbagi dengan dunia',
      systemB: 'Moon '+planets.Moon.sign,
      signalB: 'Memproses emosi secara internal, jarang menunjukkan kerentanan sesungguhnya',
      resolution: 'Kamu sangat ekspresif tentang ide, kreativitas, dan pandangan — tapi sangat selektif tentang apa yang benar-benar sedang kamu rasakan. Ada gap antara apa yang kamu bagikan dan apa yang kamu simpan.',
      cost: 'Orang mengenalmu melalui ekspresimu, tapi jarang melalui perasaanmu. Ini menciptakan koneksi yang terasa dalam di satu sisi, tapi satu dimensi di sisi lain.',
      adaptation: 'Expression bisa menjadi armor — cara untuk terlihat open tanpa benar-benar vulnerable.'
    });
  }


  // ── BEHAVIORAL LABELS (not archetypal) ──
  // These describe what you actually DO, not who you essentially ARE
  const BEHAVIORAL_LABELS = {
    // Sun sign behavioral tendency (not identity)
    Aries:      'cenderung bertindak sebelum sepenuhnya memproses konsekuensi',
    Taurus:     'cenderung mempertahankan posisi lebih lama dari yang optimal',
    Gemini:     'cenderung mengoleksi perspektif tanpa selalu settling di satu',
    Cancer:     'cenderung merawat orang lain sebagai cara mengelola kecemasanmu sendiri',
    Leo:        'cenderung mengaitkan self-worth dengan respons orang lain terhadapmu',
    Virgo:      'cenderung menganalisis sebagai cara menunda eksekusi atau keputusan',
    Libra:      'cenderung menunda keputusan sampai ada tekanan eksternal yang memaksanya',
    Scorpio:    'cenderung menyimpan grievance lebih lama dari yang disadari orang lain',
    Sagittarius:'cenderung reframing situasi sulit sebagai "pelajaran" sebagai cara menghindari duduk dengan sakitnya',
    Capricorn:  'cenderung mengukur nilai diri melalui produktivitas dan pencapaian',
    Aquarius:   'cenderung intellectualizing perasaan daripada merasakannya',
    Pisces:     'cenderung melebur ke dalam konteks emosional sekitar sampai kehilangan referensi diri sendiri',
  };

  // HD behavioral tendency (mechanism, not identity)
  const HD_BEHAVIORAL = {
    Generator:            'cenderung melanjutkan hal-hal yang sudah tidak memuaskan karena menghentikannya terasa seperti kegagalan',
    'Manifesting Generator': 'cenderung memulai lebih banyak dari yang bisa diselesaikan, lalu merasa bersalah atas yang ditinggalkan',
    Projector:            'cenderung memberikan pandangan yang tidak diminta, kemudian merasa tidak dihargai ketika tidak disambut',
    Manifestor:           'cenderung bergerak tanpa memberitahu orang lain, kemudian merasa tidak dipahami atas resistance yang muncul',
    Reflector:            'cenderung merefleksikan energi sekitar sampai tidak jelas mana identitas aslinya',
  };

  // BaZi adaptation under stress
  const BAZI_STRESS_PATTERN = {
    'Yang Wood': 'ketika tertekan, cenderung mendorong lebih keras alih-alih mundur untuk recalibrate',
    'Yin Wood':  'ketika tertekan, cenderung mengikuti yang paling kuat di sekitar sampai arah aslinya hilang',
    'Yang Fire': 'ketika tertekan, cenderung intensify output sampai burnout tiba-tiba',
    'Yin Fire':  'ketika tertekan, cenderung menginternalisasi dan menyalahkan diri sebelum orang lain',
    'Yang Earth':'ketika tertekan, cenderung overcommit pada semua orang dan akhirnya tidak bisa memenuhi apapun',
    'Yin Earth': 'ketika tertekan, cenderung diam dan bertahan sampai situasinya terlewati',
    'Yang Metal':'ketika tertekan, cenderung menjadi lebih rigid dan demanding terhadap standar',
    'Yin Metal': 'ketika tertekan, cenderung self-critical dan menarik diri dari situasi yang tidak sempurna',
    'Yang Water':'ketika tertekan, cenderung menghindar dengan selalu punya alasan berikutnya untuk tidak settle',
    'Yin Water': 'ketika tertekan, cenderung overthink sampai paralysis sebelum memutuskan apapun',
  };

  const behavioralLabel = BEHAVIORAL_LABELS[planets.Sun.sign] || 'cenderung beroperasi dengan pola yang tidak selalu konsisten dari luar';
  const hdBehavioral = HD_BEHAVIORAL[hdTypeStr] || 'cenderung beroperasi dengan cara yang tidak selalu dipahami orang lain';
  const baziStress = BAZI_STRESS_PATTERN[dayMaster] || 'ketika tertekan, cenderung menggunakan survival pattern yang tidak selalu optimal jangka panjang';

  // Emotional architecture
  const emotArch = water>=2 || moonEl==='Water' ? 'porous' : water===0 ? 'armored' : 'selective';
  const emotArchDesc = {
    porous: 'arsitektur emosi yang permeabel — kamu menyerap energi orang lain dengan mudah, baik disadari maupun tidak',
    armored: 'arsitektur emosi yang terstruktur — kamu memproses melalui logika sebelum perasaan, yang memberi stabilitas tapi kadang jarak',
    selective: 'arsitektur emosi yang selektif — kamu memilih kapan membuka dan kapan menutup dengan cukup presisi'
  }[emotArch];

  if(signals.socialPersona==='expansive' && signals.behavioralEnergy==='conserving') {
    contradictions.push({
      title:'Charisma Eksternal, Baterai Internal Terbatas',
      systemA:'Sun '+planets.Sun.sign+' ('+sunEl+')',
      signalA:'Tampil ekspresif dan menarik secara sosial',
      systemB:'HD '+hdTypeStr,
      signalB:'Energi tidak dirancang untuk output terus-menerus',
      resolution:'Kamu mungkin terlihat seperti orang yang selalu energik — padahal di balik itu sedang memproses dan recovery. Orang sering salah baca kelelahananmu sebagai penolakan.',
      cost:'Charisma yang besar = magnet proyeksi. Orang akan meletakkan harapan yang tidak pernah kamu minta.',
    });
  }
  if((hdOpenSP || moonEl==='Water') && (lp===1||lp===8||dayMaster.includes('Metal')||dayMaster.includes('Fire'))) {
    contradictions.push({
      title:'Power Drive dengan Luka Emosi yang Tidak Terselesaikan',
      systemA:'LP'+lp+' / Sun '+planets.Sun.sign,
      signalA:'Dorongan kuat menuju authority dan kontrol',
      systemB:'Moon '+planets.Moon.sign+' / HD Open SP',
      signalB:'Batas emosi yang permeabel dan mudah terpengaruh',
      resolution:'Kombinasi ini menciptakan pola: kamu mendorong keras ke luar untuk achievements, tapi secara emosional masih sangat mudah dipengaruhi oleh opini orang yang kamu hormati.',
      cost:'Semakin tinggi posisimu, semakin banyak energi emosional yang harus kamu manage dari orang sekitar.',
    });
  }
  if((air>=2||planets.Mercury.idx<=1) && signals.survivalMode==='adaptive') {
    contradictions.push({
      title:'Pikiran Cepat, Eksekusi Lambat',
      systemA:'Mercury '+planets.Mercury.sign+' / Air x'+air,
      signalA:'Proses berpikir yang cepat dan banyak koneksi',
      systemB:'BaZi '+dayMaster,
      signalB:'Ritme internal yang lebih lambat dan butuh recovery',
      resolution:'Kamu bisa melihat solusi lebih cepat dari rata-rata, tapi sering frustasi karena tubuh dan energimu tidak bisa mengeksekusi secepat pikiranmu inginkan.',
      cost:'Orang intuitif yang cepat adalah target proyeksi "oracle". Kamu sering dimintai jawaban atas masalah yang seharusnya diselesaikan orang itu sendiri.',
    });
  }
  if(dayMaster.includes('Metal') && (moonEl==='Water'||hdOpenSP)) {
    contradictions.push({
      title:'Standar Tinggi, Sensitivitas Tersembunyi',
      systemA:'BaZi '+dayMaster,
      signalA:'Presisi, struktur, dan standar yang tidak mudah kompromi',
      systemB:'Moon '+planets.Moon.sign+(hdOpenSP?' / HD Open SP':''),
      signalB:'Lapisan emosi yang jauh lebih dalam dari yang terlihat',
      resolution:'Dari luar kamu terlihat tegas, principled, dan tidak mudah goyah. Tapi di dalam ada sensitivitas yang besar — yang sering kamu sembunyikan karena takut terlihat lemah.',
      cost:'Menjaga fasad ketegasan itu melelahkan. Biayanya sering muncul dalam bentuk fisik: tension, susah tidur, atau somatik.',
    });
  }
  if(hdTypeStr==='Projector' && (fire>=2||lp===1||lp===8)) {
    contradictions.push({
      title:'Energi Pemimpin di dalam Sistem yang Butuh Undangan',
      systemA:'LP'+lp+' / Fire x'+fire,
      signalA:'Drive yang kuat untuk memimpin dan menginisiasi',
      systemB:'HD Projector',
      signalB:'Sistem yang dirancang untuk menunggu undangan — bukan mendorong',
      resolution:'Kamu punya kapasitas kepemimpinan yang nyata, tapi cara mencapainya berbeda dari kebanyakan. Mendorong langsung akan selalu menciptakan resistance. Kamu dirancang untuk diundang.',
      cost:'Menunggu undangan terasa seperti pasif dan tidak produktif — padahal itu adalah cara paling efisien yang tersedia untukmu.',
    });
  }
  // Default jika tidak ada kontradiksi spesifik
  if(contradictions.length === 0) {
    contradictions.push({
      title:'Koherensi Sistem yang Tidak Biasa',
      systemA:planets.Sun.sign+' ☉',
      signalA:'Identitas yang cukup konsisten lintas konteks',
      systemB:hdTypeStr+' × LP'+lp,
      signalB:'Strategi hidup yang selaras dengan energi dasarmu',
      resolution:'Chart-mu menunjukkan relatif sedikit internal conflict. Ini bukan berarti hidupmu mudah — tapi cara kamu beroperasi cenderung lebih konsisten dari rata-rata. Tantanganmu bukan konflik internal, tapi bagaimana dunia luar bereaksi terhadap konsistensimu.',
      cost:'Konsistensi yang kuat sering membuat orang di sekitarmu tidak nyaman. Kamu menjadi cermin, dan tidak semua orang siap bercermin.',
    });
  }

  // Cross-system convergence — multi-validated patterns
  const convergences = [];
  if((moonEl==='Water' || water >= 2) && hdOpenSP) convergences.push({
    signal:'Amplifikasi Emosi Lintas Tiga Sistem',
    systems:['Moon '+planets.Moon.sign, 'HD Open Solar Plexus', 'Water x'+(water||0)],
    reads:['Moon Water: proses emosi secara mendalam dan visceral','HD Open SP: menyerap emosi orang lain sebagai milik sendiri','Elemen Water: layer tambahan permeabilitas emosional'],
    convergence:'Ketiga sistem menunjuk ke pola yang sama: kamu tidak hanya merasakan emosimu sendiri. Kamu menyerapnya dari ruangan. Dan kamu sering tidak bisa membedakan mana yang asli milikmu.',
    action:'Sebelum bereaksi terhadap emosi besar — tanya dulu: "Apakah ini milikku, atau yang kuambil dari sekitar?"'
  });
  if(dayMaster.includes('Wood') && hdTypeStr === 'Projector') convergences.push({
    signal:'Visi Jauh, Eksekusi Tergantung Konteks',
    systems:['BaZi '+dayMaster, 'HD '+hdTypeStr, 'LP'+lp],
    reads:['Wood: tumbuh terus, selalu melihat potensi ke depan','Projector: sistem yang paling efisien membaca orang dan situasi','LP'+lp+': perjalanan melalui depth, bukan breadth'],
    convergence:'Kamu memiliki kapasitas strategis dan visioner yang nyata. Tapi ketiga sistem ini sekaligus menunjukkan: nilai terbesarmu muncul ketika diundang, bukan ketika mendorong. Eksekusi mandiri sering berakhir kelelahan.',
    action:'Identifikasi 3 orang dalam hidupmu yang benar-benar melihat nilaimu. Fokuskan energi untuk deep collaboration dengan mereka.'
  });
  if(fire >= 2 && (lp===1||lp===8||planets.Sun.idx===4)) convergences.push({
    signal:'Mesin Kepemimpinan yang Butuh Arah yang Tepat',
    systems:['Sun '+planets.Sun.sign,'Fire x'+fire,'LP'+lp],
    reads:['Sun '+planets.Sun.sign+': identitas yang kuat dan ekspresif','Fire x'+fire+': energi inisiasi dan ambisi tinggi','LP'+lp+': jalur menuju pengaruh dan power'],
    convergence:'Tiga sistem ini menunjuk ke potensi kepemimpinan yang besar. Tapi Fire tanpa arah membakar dirinya sendiri. Pertanyaan kritis bukan "bagaimana cara memimpin?" — tapi "memimpin menuju apa?"',
    action:'Tulis satu kalimat: apa yang ingin kamu ubah di dunia sebelum kamu mati? Jawaban itu adalah kompas energimu.'
  });
  if(baziEls.Metal >= 2 && earth >= 1 && (lp===4||lp===7||lp===22)) convergences.push({
    signal:'Arsitek Realita — Builder yang Tidak Bisa Berhenti',
    systems:['BaZi Metal x'+baziEls.Metal,'Earth x'+earth,'LP'+lp],
    reads:['Metal: presisi, struktur, cutting through noise','Earth: fondasi, kestabilan, keandalan','LP'+lp+': jalur melalui membangun sesuatu yang bertahan'],
    convergence:'Kamu dirancang untuk membangun. Tiga sistem ini konsisten: kamu butuh project nyata untuk merasa hidup. Tapi Metal+Earth bisa berubah jadi rigidity — ketika cara menjadi lebih penting dari tujuan.',
    action:'Setiap 6 bulan: tanya apakah sistem yang kamu bangun masih melayani manusianya, atau kamu sudah melayani sistemnya.'
  });
  if(water >= 2 && (lp===7||lp===9||lp===11||lp===12)) convergences.push({
    signal:'Pencari yang Tidak Bisa Berhenti Mencari',
    systems:['Water x'+water,'LP'+lp,'Moon '+planets.Moon.sign],
    reads:['Water: kedalaman, pencarian, tidak ada yang fixed','LP'+lp+': jalur melalui wisdom dan inner knowing','Moon '+planets.Moon.sign+': proses secara emosional dan intuitif'],
    convergence:'Kamu memiliki kapasitas intuisi dan pemahaman yang dalam. Tapi tiga sistem ini juga menunjukkan: kamu sering lebih nyaman mencari daripada menemukan. Karena menemukan berarti harus komit.',
    action:'Bedakan antara "aku belum tahu" dan "aku takut tahu". Keduanya terasa sama dari dalam.'
  });
  if(convergences.length === 0) convergences.push({
    signal:'Pola Unik yang Tidak Mudah Dikategorikan',
    systems:[planets.Sun.sign+' ☉', hdTypeStr, 'LP'+lp, dayMaster],
    reads:[planets.Sun.sign+': identitas inti yang kuat',hdTypeStr+': cara beroperasi yang spesifik','LP'+lp+': jalur hidup yang unik',dayMaster+': bahan dasar energetik'],
    convergence:'Kombinasi empat sistem ini jarang bertemu dengan cara yang persis sama. Ini bukan berarti kamu lebih baik atau lebih buruk dari rata-rata — ini berarti blueprint-mu tidak punya template yang sudah jadi. Kamu harus menemukannya sendiri.',
    action:'Berhenti mencari role model yang persis seperti kamu. Tidak ada. Pelajari dari banyak orang, tapi jangan replikasi siapapun.'
  });

  // Actionable layer
  const SIGN_SHADOW={
    Aries:'Kamu menyerang sebelum diserang — bukan karena berani, tapi karena takut lebih dulu terlihat lemah. Keberanian yang kamu tunjukkan ke dunia adalah perisai, bukan identitas.',
    Taurus:'Kamu menyebut dirimu stabil. Orang sekitarmu menyebutnya sulit berubah. Keduanya benar. Pertanyaannya: seberapa banyak yang kamu pertahankan karena memang berharga, dan seberapa banyak karena melepasnya terasa seperti kalah?',
    Gemini:'Kamu bisa berbicara tentang segalanya kecuali satu hal: apa yang benar-benar menyakitimu. Kata-kata adalah perisaimu. Kefasihan adalah cara kamu tidak pernah harus duduk dengan keheningan.',
    Cancer:'Kamu merawat semua orang sebagai cara untuk tidak perlu dirawat. Karena menjadi yang dibutuhkan lebih aman daripada menjadi yang membutuhkan.',
    Leo:'Kamu membutuhkan cermin — seseorang yang melihatmu dan mengkonfirmasi bahwa kamu nyata, penting, ada. Dan ketika cermin itu tidak ada atau tidak memantulkan yang kamu inginkan, bukan kamu yang hancur. Tapi seluruh narasi dirimu.',
    Virgo:'Bukan standar tinggimu yang menjadi masalah. Masalahnya adalah kamu menerapkan standar yang sama kepada dirimu seperti kepada hasil kerjamu. Dan kamu tidak pernah benar-benar selesai.',
    Libra:'Kamu bukan orang yang suka damai. Kamu adalah orang yang takut konflik. Keduanya terlihat sama dari luar, tapi hanya satu yang membayar harga di dalam.',
    Scorpio:'Kamu tidak pernah benar-benar melepaskan. Kamu hanya menyimpan lebih dalam. Dan setiap orang yang pernah mengkhianatimu masih hidup di suatu tempat dalam arsitektur keputusanmu.',
    Sagittarius:'Kamu menyebut dirimu bebas. Tapi kamu selalu lari dari sesuatu yang spesifik. Perbedaan antara petualangan dan pelarian: salah satunya memilih tujuan, yang lain hanya menjauhi sesuatu.',
    Capricorn:'Kamu bekerja sangat keras untuk orang yang mungkin sudah tidak ada dalam hidupmu lagi — seorang ayah, guru, atau versi dirimu sendiri yang pernah merasa tidak cukup. Achievement-mu adalah jawaban atas pertanyaan yang tidak pernah lagi relevan.',
    Aquarius:'Kamu peduli pada manusia secara universal tetapi sering kesulitan dengan manusia yang spesifik — manusia yang membutuhkan sesuatu yang tidak konsisten, tidak logis, dan tidak bisa diperbaiki dengan framework.',
    Pisces:'Kamu tidak menghindari realita karena kamu tidak mampu menghadapinya. Kamu menghindarinya karena kamu merasakannya terlalu dalam. Dunia yang kamu ciptakan dalam kepalamu bukan delusi — itu perlindungan.'
  };
  const HD_SHADOW={
    Generator:'Kamu menghabiskan energi untuk hal-hal yang tidak pernah benar-benar kamu pilih. Bukan karena dipaksa — tapi karena jauh lebih mudah berkata iya daripada duduk dengan ketidakpastian dari menunggu sesuatu yang benar-benar mengaktifkanmu.',
    'Manifesting Generator':'Kamu meninggalkan banyak hal di tengah jalan dan menyebutnya pivot. Tapi ada biaya tersembunyi: setiap unfinished loop yang kamu tinggalkan tetap aktif di sistem sarafmu, dan itu yang membuatmu kelelahan meski tidak pernah berhenti bergerak.',
    Projector:'Kamu melihat orang dengan sangat jelas — potensinya, blind spot-nya, cara terbaik untuk maju. Dan kamu membagikannya, seringkali tanpa diminta. Lalu merasa tidak dihargai. Tapi pertanyaannya: apakah kamu memberi karena ingin membantu, atau karena ingin diakui bahwa kamu melihat?',
    Manifestor:'Kamu bergerak cepat dan jarang memberitahu orang lain rencanamu — bukan karena kamu lupa, tapi karena bagian dirimu percaya bahwa menjelaskan adalah kelemahan. Itu bukan kebebasan. Itu adalah cara menghindari kemungkinan ditolak sebelum sempat memulai.',
    Reflector:'Kamu sangat adaptif sehingga kadang tidak tahu lagi mana yang asli darimu dan mana yang terserap dari lingkunganmu. Di lingkungan yang salah, kamu tidak hanya tidak nyaman — kamu secara perlahan berhenti menjadi dirimu sendiri.'
  };
  const LP_SHADOW={
    1:'Kamu butuh orang lain lebih dari yang kamu akui. Independensimu adalah ideologi yang kamu bangun sebagai pertahanan terhadap kemungkinan ditinggalkan.',
    2:'Kamu sangat baik dalam membaca kebutuhan orang lain. Tapi ketika ada yang bertanya apa yang kamu butuhkan, kamu blank — bukan karena tidak ada, tapi karena kamu tidak terbiasa menganggap kebutuhanmu cukup penting untuk disuarakan.',
    3:'Kamu belajar dari kegagalan dengan sangat baik. Tapi kamu juga menggunakan "aku masih belajar" sebagai alasan untuk tidak pernah benar-benar komit pada satu versi dirimu.',
    4:'Strukturmu adalah cara kamu merasa aman di dunia yang tidak pasti. Tapi semakin rigid sistemmu, semakin besar ketakutan di baliknya yang coba kamu sembunyikan.',
    5:'Kamu menghindari komitmen yang dalam bukan karena kamu butuh kebebasan — tapi karena kamu tahu terlalu dekat dengan seseorang berarti mereka bisa melihatmu dengan jelas. Dan kamu belum yakin apa yang akan mereka lihat.',
    6:'Kamu memberi dengan tulus. Tapi di balik ketulusanmu ada pertanyaan yang tidak pernah kamu suarakan: "Apakah mereka akan tetap ada jika aku berhenti memberi?"',
    7:'Kamu mencari jawaban di buku, sistem, dan framework karena bertanya langsung kepada seseorang terasa terlalu expose. Knowledge adalah cara aman untuk dekat tanpa benar-benar dekat.',
    8:'Kamu bekerja keras untuk membuktikan sesuatu kepada seseorang yang mungkin sudah tidak ada — atau tidak pernah peduli dengan cara yang kamu harap. Achievement terbesarmu mungkin dibangun di atas pondasi approval yang tidak pernah datang.',
    9:'Wisdom-mu datang dari luka yang sudah kamu proses. Tapi kamu menolong orang lain dengan begitu aktif sampai kamu lupa: menolong orang lain adalah cara yang sangat elegan untuk menghindari menolong dirimu sendiri.',
    11:'Intuisimu tajam — terlalu tajam kadang-kadang. Dan ketajaman itu membuatmu sulit percaya bahwa sesuatu bisa sesederhana kelihatannya. Kamu mencari hidden layer di setiap situasi, termasuk hubunganmu yang paling sederhana.',
    22:'Visimu besar dan nyata. Tapi di balik setiap langkah besar ada satu pertanyaan yang tidak pernah kamu jawab dengan jujur: apakah aku cukup besar untuk ini? Dan ketakutan itu — bukan ketidakmampuan — adalah yang paling sering menghentikanmu.',
    33:'Kamu memberi dengan sangat dalam. Tapi pemberianmu sering datang dari tempat yang tidak sehat: dari rasa bahwa kamu harus selalu berguna untuk layak dicintai. Dan itu bukan kemurahan hati. Itu adalah anxiety yang terlihat mulia.'
  };
  const sunSign = planets.Sun.sign;

  // ── GIFT ↔ WOUND EQUIVALENCE ──
  // Every gift has an exact cost. This is the "truth" layer.
  const GIFT_WOUND = {
    Aries:    {gift:'Keberanian untuk memulai apa yang orang lain takut mulai',wound:'Kamu sering memulai perang yang tidak perlu karena tidak bisa duduk dengan rasa tidak aman'},
    Taurus:   {gift:'Kemampuan membangun sesuatu yang bertahan — fondasi yang tidak mudah goyah',wound:'Kamu bisa bertahan di situasi yang sudah tidak sehat terlalu lama karena berubah terasa lebih menakutkan dari tetap'},
    Gemini:   {gift:'Kemampuan melihat banyak perspektif sekaligus dan menjembatani yang berbeda',wound:'Kamu jarang bisa duduk dengan satu kebenaran cukup lama untuk membiarkannya mengubahmu'},
    Cancer:   {gift:'Kapasitas empati dan pemeliharaan yang membuat orang merasa benar-benar dilihat',wound:'Kamu menyerap luka orang lain sebagai tanggung jawabmu, sampai tidak jelas lagi mana lukamu sendiri'},
    Leo:      {gift:'Kemampuan memberi cahaya — kehadiran yang membuat orang merasa lebih berani hanya dengan berada dekatmu',wound:'Kamu bergantung pada pantulan cahaya itu untuk tahu bahwa kamu nyata'},
    Virgo:    {gift:'Kemampuan melihat apa yang kurang dan memperbaikinya — craftmanship yang tidak punya kompromi',wound:'Kamu menerapkan standar perbaikan yang sama pada dirimu sendiri, dan kamu tidak pernah selesai'},
    Libra:    {gift:'Kemampuan menciptakan harmoni dan membuat semua pihak merasa didengar',wound:'Kamu sering mengorbankan pendapatmu sendiri untuk mempertahankan kenyamanan yang kamu tidak benar-benar rasakan'},
    Scorpio:  {gift:'Kemampuan melihat di balik permukaan dan memahami motivasi yang tidak terucap',wound:'Kamu menggunakan kemampuan itu untuk selalu bersiap diserang — bahkan oleh orang yang tidak punya niat itu'},
    Sagittarius:{gift:'Kemampuan melihat makna di mana orang lain hanya melihat kejadian, dan menginspirasi orang untuk percaya pada sesuatu yang lebih besar',wound:'Kamu menghindari setiap situasi yang memaksamu duduk dengan sesuatu yang tidak bisa kamu ubah menjadi pelajaran atau petualangan'},
    Capricorn:{gift:'Kemampuan membangun struktur jangka panjang dan mencapai hal yang orang lain anggap terlalu ambisius',wound:'Kamu mendefinisikan nilai dirimu dari pencapaian, yang berarti kegagalan bukan hanya kegagalan — itu ancaman eksistensial'},
    Aquarius: {gift:'Kemampuan melihat sistem dan pola yang tidak terlihat orang lain, dan membayangkan yang belum ada',wound:'Kamu menggunakan abstraksi sebagai jarak yang aman dari keterhubungan yang sebenarnya'},
    Pisces:   {gift:'Kemampuan merasakan apa yang tidak terucap dan menciptakan keindahan dari yang tidak terlihat',wound:'Boundary-mu begitu permeabel sampai kamu sering tidak tahu di mana kamu berakhir dan orang lain dimulai'}
  };

  const giftWound = GIFT_WOUND[sunSign] || {
    gift:'Kapasitas unik yang belum sepenuhnya teridentifikasi dalam chart ini',
    wound:'Setiap kekuatan yang belum disadari memiliki shadow yang bekerja tanpa pengawasan'
  };

  const actions = {
    career: dayMaster.includes('Wood')?'Kamu tumbuh dengan proyek jangka panjang yang punya akar — bukan sprint. Hindari lingkungan yang reward volume over depth.':
            dayMaster.includes('Fire')?'Kamu butuh peran yang punya meaning nyata, bukan hanya achievement. Tanpa api tujuan yang jelas, kamu akan membakar dirimu pada hal yang salah.':
            dayMaster.includes('Earth')?'Kamu adalah orang yang membuat sistem berjalan. Tapi kamu sering undervalue diri sendiri karena kontribusimu tidak dramatis — ia hanya membuat semuanya tidak runtuh.':
            dayMaster.includes('Metal')?'Kamu paling powerful dalam peran yang butuh presisi dan prinsip. Tapi awasi: Metal yang terlalu rigid bisa memutus koneksi yang kamu butuhkan untuk maju.':
            'Kamu bekerja terbaik dalam lingkungan yang berubah dan membutuhkan adaptasi. Stabilitas yang terlalu lama membuatmu tidak efisien.',
    relationship: hdOpenSP?'Dengan Solar Plexus open: setiap relasi yang intense akan terasa lebih intense bagimu daripada bagi orang lain. Ini bukan kelemahan — tapi kamu perlu partner yang secara emosional sudah cukup stabil, bukan yang butuh kamu stabilkan.':
                  'HD center-mu menunjukkan cara relasionalmu yang spesifik. Pastikan hubunganmu dibangun di atas siapa kamu, bukan siapa yang dibutuhkan orang lain darimu.',
    growth: 'Shadow primer: '+(SIGN_SHADOW[sunSign]||'').split('.')[0]+'.'
  };

  const shadows = [
    {type:'dshadow', icon:'🌑', title:'Shadow Primer: '+sunSign, body: SIGN_SHADOW[sunSign]||'—'},
    {type:'dgift',   icon:'⚖', title:'Gift ↔ Wound: '+sunSign,
     body: 'GIFT: '+giftWound.gift+'\n\nWOUND: '+giftWound.wound},
    {type:'dwound',  icon:'🩸', title:'Core Pattern: '+dayMaster+' Day Master',
     body: 'Sebagai '+dayMaster+' Day Master, pola yang paling sering berulang tanpa disadari adalah '+(
       dayMaster.includes('Wood')?'mendorong pertumbuhan terus-menerus — bahkan ketika situasinya membutuhkan istirahat, bukan ekspansi. Kamu menyebut ini ambisi. Orang terdekatmu menyebutnya tidak bisa berhenti.':
       dayMaster.includes('Fire')?'membakar dengan sangat terang lalu menghilang. Cycle antara all-in dan collapse yang orang sekitarmu sudah hafal, tapi kamu masih setiap kali merasa seperti pertama kali.':
       dayMaster.includes('Earth')?'mengakomodasi sedikit lagi, sedikit lagi — sampai batas yang kamu punya sudah tidak kelihatan, bahkan oleh kamu sendiri. Kamu tidak kehilangan batas karena dipaksa. Kamu secara perlahan mengikisnya sendiri.':
       dayMaster.includes('Metal')?'memegang standar yang bahkan tidak selalu kamu bisa artikulasikan — kamu hanya tahu ketika sesuatu tidak memenuhinya. Dan daftar yang tidak memenuhinya, termasuk dirimu sendiri, terus bertambah.':
       'mengalir mengikuti orang dan situasi di sekitarmu dengan cara yang terasa seperti fleksibilitas — sampai seseorang bertanya: "apa sebenarnya yang kamu mau?" dan kamu baru sadar kamu tidak tahu.')},
    {type:'dpat', icon:'🔁', title:'Karmic Loop: '+hdTypeStr,
     body: HD_SHADOW[hdTypeStr]||'—'},
  ];

  // TIMELINE
  const curAge = new Date().getFullYear() - yr;
  const phases = [
    {age:0,phase:'Origin',theme:'Fondasi karakter pertama terbentuk',detail:'Lingkungan pertumbuhanmu menanamkan beliefs yang mungkin masih kamu carry hari ini.'},
    {age:7,phase:'Imprint',theme:'Pattern emosional dan attachment awal',detail:'Apa yang kamu pelajari tentang keamanan di usia ini sering menjadi blueprint relasi dewasamu.'},
    {age:14,phase:'Awakening',theme:'Identitas mencari bentuknya',detail:'Konflik pertama antara siapa kamu dan siapa yang diharapkan orang lain.'},
    {age:21,phase:'Launch',theme:'Memasuki dunia dengan identitas yang belum utuh',detail:'Terasa seperti harus punya semua jawaban padahal pertanyaannya pun belum jelas.'},
    {age:28,phase:'Saturn Return',theme:'Audit pertama kehidupan — semua yang tidak otentik retak',detail:'Ini bukan krisis. Ini klarifikasi. Struktur yang salah akan runtuh untuk memberi ruang yang tepat.'},
    {age:35,phase:'Integration',theme:'Siapa kamu vs siapa yang kamu inginkan jadi satu',detail:'Banyak yang menemukan formula hidup terdalamnya setelah melewati keretakan 28.'},
    {age:42,phase:'Authority',theme:'Kekuatan mencapai kematangan penuh',detail:'Jika sudah melewati inner work, ini adalah fase paling powerful. Kamu tahu siapa kamu.'},
    {age:50,phase:'Distillation',theme:'Memilih apa yang benar-benar penting',detail:'Eliminasi bukan karena menyerah, tapi karena kamu akhirnya tahu bedanya.'},
    {age:57,phase:'Second Saturn',theme:'Saturn Return kedua — pemurnian akhir',detail:'Siapa yang kamu jadi setelah melepas semua yang bukan kamu?'},
    {age:63,phase:'Legacy',theme:'Meninggalkan jejak yang bermakna',detail:'Kontribusi bukan sebagai kewajiban, tapi sebagai ekspresi alami dari siapa kamu.'},
  ];

  // TRANSITS (current planetary positions)
  const jdNow = toJD(new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate(), 12);
  const transSun = sunLongitude(jdNow);
  const transMoon = moonLongitude(jdNow);
  const transSat = saturnLongitude(jdNow);
  const transJup = jupiterLongitude(jdNow);
  const transMar = marsLongitude(jdNow);

  function transAspect(transitLon, natalLon, natalName, planet) {
    const t = aspectType(transitLon, natalLon);
    if(t) return {transit:planet, natal:natalName, type:t, transitLon, natalLon};
    // Also check opposite natal point if not already checked
    if(natalName === 'Sun') {
      const tm = aspectType(transitLon, moonLon);
      if(tm) return {transit:planet, natal:'Moon', type:tm, transitLon, natalLon:moonLon};
    }
    return null;
  }

  const transits = [
    transAspect(transSun, sunLon, 'Sun', 'Transit Sun'),
    transAspect(transMoon, moonLon, 'Moon', 'Transit Moon'),
    transAspect(transSat, sunLon, 'Sun', 'Transit Saturn'),
    transAspect(transJup, moonLon, 'Moon', 'Transit Jupiter'),
    transAspect(transMar, sunLon, 'Sun', 'Transit Mars'),
  ].filter(Boolean).slice(0,5);

  const LP_MEANING={1:'Pemimpin & Pioneer',2:'Diplomat & Intuisi',3:'Kreator & Ekspresi',4:'Builder & Disiplin',5:'Kebebasan & Perubahan',6:'Pemelihara & Harmoni',7:'Analis & Pencarian',8:'Kekuatan & Ambisi',9:'Humanis & Bijaksana',11:'Master Intuitif',22:'Master Builder',33:'Master Teacher'};
  const DEST_MEANING={1:'Jalan menuju kepemimpinan mandiri',2:'Jalan menuju kemitraan & diplomasi',3:'Jalan menuju ekspresi kreatif',4:'Jalan menuju keteraturan & fondasi',5:'Jalan menuju kebebasan & petualangan',6:'Jalan menuju tanggung jawab & cinta',7:'Jalan menuju kebijaksanaan & spiritualitas',8:'Jalan menuju kekuasaan & kelimpahan',9:'Jalan menuju pengabdian universal',11:'Jalan menuju pencerahan & inspirasi',22:'Jalan menuju manifestasi besar',33:'Jalan menuju pelayanan mulia'};
  const SOUL_MEANING={1:'Mendambakan kemandirian & orisinalitas',2:'Mendambakan harmoni & koneksi',3:'Mendambakan ekspresi & kreativitas',4:'Mendambakan stabilitas & ketertiban',5:'Mendambakan kebebasan & perubahan',6:'Mendambakan cinta & keindahan',7:'Mendambakan pengetahuan & kedamaian',8:'Mendambakan pencapaian & pengakuan',9:'Mendambakan kebenaran & kebijaksanaan',11:'Mendambakan inspirasi & pencerahan',22:'Mendambakan pembangunan warisan',33:'Mendambakan penyembuhan & pengajaran'};
  const PERS_MEANING={1:'Tampil independen & percaya diri',2:'Tampil hangat & mudah didekati',3:'Tampil ekspresif & menarik',4:'Tampil dapat diandalkan & serius',5:'Tampil dinamis & fleksibel',6:'Tampil perhatian & bertanggung jawab',7:'Tampil misterius & dalam',8:'Tampil kompeten & berwibawa',9:'Tampil bijaksana & penuh perhatian',11:'Tampil karismatik & spiritual',22:'Tampil visioner & kuat',33:'Tampil peduli & menginspirasi'};
  const PY_MEANING={1:'Tahun Baru Awal — menanam benih, memulai proyek baru, mengambil inisiatif',2:'Tahun Kerja Sama — membangun relasi, bersabar, berkolaborasi',3:'Tahun Ekspresi — berkreasi, berkomunikasi, menikmati hidup',4:'Tahun Fondasi — bekerja keras, membangun sistem, disiplin',5:'Tahun Perubahan — adaptasi, petualangan, kebebasan baru',6:'Tahun Tanggung Jawab — fokus keluarga, cinta, menyembuhkan relasi',7:'Tahun Refleksi — belajar, introspeksi, spiritual',8:'Tahun Panen — karir, finansial, manifestasi upaya',9:'Tahun Penutupan — melepas, menyelesaikan siklus, persiapan awal baru'};
  const BIRTHDAY_DESC={1:'Pemimpin alami dengan dorongan mandiri yang kuat',2:'Sensitif dan intuitif, mediator dan penyeimbang',3:'Ekspresif, kreatif, dan komunikator berbakat',4:'Disiplin, pekerja keras, membangun dengan fondasi kuat',5:'Petualang yang mencintai kebebasan dan perubahan',6:'Penuh kasih, bertanggung jawab, pemelihara sejati',7:'Pencari kebenaran, analitis, dan spiritually inclined',8:'Ambisius, pragmatis, mengincar kesuksesan material',9:'Idealis, murah hati, dan berorientasi pada kemanusiaan',11:'Sangat intuitif, idealis, dengan potensi spiritual tinggi',22:'Pemimpin visioner yang mampu mewujudkan impian besar',33:'Pengajar master yang hidup untuk melayani dan menyembuhkan'};

  const confidence = {
    astro: timeStr ? 'high' : 'low',
    bazi: 'high',
    hd: timeStr ? 'medium' : 'low', // HD needs exact birth minute for full accuracy
    note: timeStr
      ? 'Sistem Rumah: Whole Sign (akurat). MC dihitung terpisah. BaZi: Solar term via Sun longitude. HD: 88° solar arc — Type & Authority approx, butuh Swiss Ephemeris untuk gate precision. Planet longitude akurasi ~1-3°.'
      : 'Tanpa jam lahir: Ascendant tidak dapat dihitung, HD invalid, rumah tidak tersedia. BaZi Hour Pillar menggunakan estimasi. Sun/Moon sign tetap akurat.'
  };

  return {
    lons, planets, houses, aspects, elCounts, mc, mcSign, retrograde,
    bazi:{year:byear,month:bmonth,day:bday,hour:bhour,dayMaster,favEl,unfavEl,luckPillars,baziEls,
          byearHidden,bmonthHidden,bdayHidden,bhourHidden,
          pillars10Gods,symbolicStars,kuaNum,kuaDirs,isFemale,
          byearData,luckStartAge},
    hd:{type:hdTypeStr,auth:hdAuth,prof:hdProf,strategy:hdStrategy,notSelf:hdNotSelf,definedCenters,undefinedCenters,sunGate,moonGate,ascGate,earthGate,designGate,pPlanetData,dPlanetData,definedChannels},
    zw:{main:zwMain,life:zwLife,career:zwCareer,wealth:zwWealth,marriage:zwMarriage},
    numerology:{lp,dest,soul,pers,birthday,attitude,personalYear,personalMonth,
      pin1,pin2,pin3,pin4,pinAge1,pinAge2,pinAge3,
      ch1,ch2,ch3,ch4,karmicLessons,
      lpMonth,lpDay,lpYear,lpRawSum,lpKarmic,lpIsMaster,
      destObj,soulObj,persObj,destKarmic,soulKarmic,
      nameFirst,nameMiddle,nameLast,nFirst,nMiddle,nLast,
      LP_MEANING,DEST_MEANING,SOUL_MEANING,PERS_MEANING,PY_MEANING,BIRTHDAY_DESC,LP_SHADOW},
    traits, soulScore, soulLabel, soulDesc, soulDimensions,
    shadows, phases, curAge,
    transits, transSun, transMoon, transSat, transJup, transMar,
    confidence, SIGN_SHADOW, HD_SHADOW,
    sunSign, moonSign:planets.Moon.sign, ascSign:planets.Ascendant.sign,
    sunGate, moonGate,
    fusion:{ convergences, emotArch, emotArchDesc, actions, contradictions, giftWound,
             behavioralLabel, hdBehavioral, baziStress, signals, dmStrength, monthPressure },
    errorTolerance: { sensitivity: birthTimeSensitivity, note: sensitivityNote }
  };
}

// ═══════════════════════════════════════════════════════════
//  MODULE EXPORTS (added during Phase 01 extraction — engine
//  logic above this line is verbatim from legacy index.html,
//  see docs/ARCHITECTURE.md)
// ═══════════════════════════════════════════════════════════
export {
approxLunarMonth,
aspectType,
aspectWithOrb,
baziDay,
baziHour,
baziMonth,
baziYearFromSun,
calcAscendant,
calcHouses,
calcMC,
centersConnected,
computeChart,
determineAuthority,
determineHDType,
evalVSOP,
getBaziMonthIdx,
getDefinedCenters,
getDefinedCentersList,
getDesignJD,
getLatLon,
getOrb,
getPlanetDignity,
houseOf,
isApplying,
isRetrograde,
jdWhenSunAt,
jupiterLongitude,
lonToGate,
lonToLine,
lonToSign,
marsLongitude,
mercuryLongitude,
moonLongitude,
neptuneLongitude,
normalizeAngle,
obliquity,
plutoLongitude,
plutoLongitude_h,
saturnLongitude,
sunLongitude,
toJD,
tzFromLon,
uranusLongitude,
venusLongitude,
vsop87Planet,
zwPalace,
ASPECT_ORBS_LIGHT,
ASPECT_ORBS_STD,
BAZI_MONTH_BRANCH,
BAZI_MONTH_START_LON,
BRANCHES,
BRANCH_EL,
CITY_LL,
DIGNITY,
EARTH_L0,
EARTH_L1,
EARTH_R0,
EARTH_R1,
GATE_CHANNELS,
HD_AUTHS,
HD_CENTERS,
HD_CHANNEL_MAP,
HD_GATE_OFFSET,
HD_GATE_WHEEL,
HD_PROFS,
PLUTO_KNOWN,
PSYMS,
RAD,
SIGNS,
STEMS,
STEM_EL,
ZW_PAL,
ZW_STARS,
};
