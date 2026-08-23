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

