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

