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

