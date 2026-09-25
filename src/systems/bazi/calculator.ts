import { BirthProfile } from '../../types/birth-data';
import { BaZiCalculationResult, BaZiPillar, EarthlyBranch, HeavenlyStem, WuXingElement, YinYang } from './types';

const STEMS: Array<{ name: string; chinese: string; element: WuXingElement; yinYang: YinYang }> = [
  { name: 'Jia', chinese: '甲', element: 'Wood', yinYang: 'Yang' },
  { name: 'Yi', chinese: '乙', element: 'Wood', yinYang: 'Yin' },
  { name: 'Bing', chinese: '丙', element: 'Fire', yinYang: 'Yang' },
  { name: 'Ding', chinese: '丁', element: 'Fire', yinYang: 'Yin' },
  { name: 'Wu', chinese: '戊', element: 'Earth', yinYang: 'Yang' },
  { name: 'Ji', chinese: '己', element: 'Earth', yinYang: 'Yin' },
  { name: 'Geng', chinese: '庚', element: 'Metal', yinYang: 'Yang' },
  { name: 'Xin', chinese: '辛', element: 'Metal', yinYang: 'Yin' },
  { name: 'Ren', chinese: '壬', element: 'Water', yinYang: 'Yang' },
  { name: 'Gui', chinese: '癸', element: 'Water', yinYang: 'Yin' },
];

const BRANCHES: Array<{ name: string; chinese: string; zodiacAnimal: string; element: WuXingElement }> = [
  { name: 'Zi', chinese: '子', zodiacAnimal: 'Rat', element: 'Water' },
  { name: 'Chou', chinese: '丑', zodiacAnimal: 'Ox', element: 'Earth' },
  { name: 'Yin', chinese: '寅', zodiacAnimal: 'Tiger', element: 'Wood' },
  { name: 'Mao', chinese: '卯', zodiacAnimal: 'Rabbit', element: 'Wood' },
  { name: 'Chen', chinese: '辰', zodiacAnimal: 'Dragon', element: 'Earth' },
  { name: 'Si', chinese: '巳', zodiacAnimal: 'Snake', element: 'Fire' },
  { name: 'Wu', chinese: '午', zodiacAnimal: 'Horse', element: 'Fire' },
  { name: 'Wei', chinese: '未', zodiacAnimal: 'Goat', element: 'Earth' },
  { name: 'Shen', chinese: '申', zodiacAnimal: 'Monkey', element: 'Metal' },
  { name: 'You', chinese: '酉', zodiacAnimal: 'Rooster', element: 'Metal' },
  { name: 'Xu', chinese: '戌', zodiacAnimal: 'Dog', element: 'Earth' },
  { name: 'Hai', chinese: '亥', zodiacAnimal: 'Pig', element: 'Water' },
];

export function calculateBaZi(
  profile: BirthProfile,
  _settings: Record<string, any> = {}
): BaZiCalculationResult {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const hasTime = !profile.isTimeUnknown && Boolean(profile.birthTime);

  // Year pillar (sexagenary cycle: offset from 1984 which was Jia Zi)
  const yearOffset = ((year - 1984) % 60 + 60) % 60;
  const yearStem = STEMS[yearOffset % 10];
  const yearBranchRaw = BRANCHES[yearOffset % 12];

  // Month pillar
  const monthStemIndex = ((yearOffset % 5) * 2 + month) % 10;
  const monthBranchIndex = ((month + 1) % 12);
  const monthStem = STEMS[monthStemIndex];
  const monthBranchRaw = BRANCHES[monthBranchIndex];

  // Day pillar
  const baseEpochDays = Math.floor((new Date(year, month - 1, day).getTime() - new Date(1900, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = ((baseEpochDays + 15) % 60 + 60) % 60;
  const dayStem = STEMS[dayOffset % 10];
  const dayBranchRaw = BRANCHES[dayOffset % 12];

  // Hour pillar
  let hourPillar: BaZiPillar = { title: 'Hour Pillar', isUnknown: true };

  if (hasTime && profile.birthTime) {
    const [h] = profile.birthTime.split(':').map(Number);
    // 2-hour branch division (23-1 is Zi, 1-3 is Chou, etc.)
    const hourBranchIndex = Math.floor(((h + 1) % 24) / 2);
    const hourStemIndex = ((dayOffset % 5) * 2 + hourBranchIndex) % 10;

    const hourStem = STEMS[hourStemIndex];
    const hourBranchRaw = BRANCHES[hourBranchIndex];

    hourPillar = {
      title: 'Hour Pillar',
      isUnknown: false,
      heavenlyStem: { ...hourStem, tenGod: getTenGod(dayStem, hourStem) },
      earthlyBranch: {
        ...hourBranchRaw,
        hiddenStems: getHiddenStems(hourBranchRaw.name, dayStem),
      },
    };
  }

  const yearPillar: BaZiPillar = {
    title: 'Year Pillar',
    heavenlyStem: { ...yearStem, tenGod: getTenGod(dayStem, yearStem) },
    earthlyBranch: {
      ...yearBranchRaw,
      hiddenStems: getHiddenStems(yearBranchRaw.name, dayStem),
    },
  };

  const monthPillar: BaZiPillar = {
    title: 'Month Pillar',
    heavenlyStem: { ...monthStem, tenGod: getTenGod(dayStem, monthStem) },
    earthlyBranch: {
      ...monthBranchRaw,
      hiddenStems: getHiddenStems(monthBranchRaw.name, dayStem),
    },
  };

  const dayPillar: BaZiPillar = {
    title: 'Day Pillar',
    heavenlyStem: { ...dayStem, tenGod: 'Day Master' },
    earthlyBranch: {
      ...dayBranchRaw,
      hiddenStems: getHiddenStems(dayBranchRaw.name, dayStem),
    },
  };

  // Element counting
  const elementDistribution: Record<WuXingElement, number> = {
    Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0,
  };

  [yearPillar, monthPillar, dayPillar, ...(hourPillar.isUnknown ? [] : [hourPillar])].forEach((p) => {
    if (p.heavenlyStem) elementDistribution[p.heavenlyStem.element] += 1;
    if (p.earthlyBranch) elementDistribution[p.earthlyBranch.element] += 1;
  });

  const totalPoints = Object.values(elementDistribution).reduce((a, b) => a + b, 0);
  const elementPercentages: Record<WuXingElement, number> = {
    Wood: Math.round((elementDistribution.Wood / totalPoints) * 100),
    Fire: Math.round((elementDistribution.Fire / totalPoints) * 100),
    Earth: Math.round((elementDistribution.Earth / totalPoints) * 100),
    Metal: Math.round((elementDistribution.Metal / totalPoints) * 100),
    Water: Math.round((elementDistribution.Water / totalPoints) * 100),
  };

  const dayMasterElement = dayStem.element;
  const sameElementPoints = elementDistribution[dayMasterElement];
  const dayMasterStrength = sameElementPoints >= 3 ? 'Strong' : sameElementPoints === 2 ? 'Balanced' : 'Weak';

  return {
    hasHourPillar: hasTime,
    dayMaster: dayStem,
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    elementDistribution,
    elementPercentages,
    dayMasterStrength,
    favorableElements: getFavorableElements(dayMasterElement, dayMasterStrength),
    unfavorableElements: getUnfavorableElements(dayMasterElement, dayMasterStrength),
  };
}

function getTenGod(dayMaster: HeavenlyStem, target: HeavenlyStem): string {
  if (dayMaster.name === target.name) return 'Friend (Bi Jian)';
  if (dayMaster.element === target.element) return 'Rob Wealth (Jie Cai)';

  const generatingMap: Record<WuXingElement, WuXingElement> = {
    Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
  };
  const controllingMap: Record<WuXingElement, WuXingElement> = {
    Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood',
  };

  const samePolarity = dayMaster.yinYang === target.yinYang;

  // I produce target
  if (generatingMap[dayMaster.element] === target.element) {
    return samePolarity ? 'Eating God (Shi Shen)' : 'Hurting Officer (Shang Guan)';
  }
  // I control target (Wealth)
  if (controllingMap[dayMaster.element] === target.element) {
    return samePolarity ? 'Indirect Wealth (Pian Cai)' : 'Direct Wealth (Zheng Cai)';
  }
  // Target controls me (Officer)
  if (controllingMap[target.element] === dayMaster.element) {
    return samePolarity ? 'Seven Killings (Qi Sha)' : 'Direct Officer (Zheng Guan)';
  }
  // Target produces me (Resource)
  if (generatingMap[target.element] === dayMaster.element) {
    return samePolarity ? 'Indirect Resource (Pian Yin)' : 'Direct Resource (Zheng Yin)';
  }

  return 'Harmonizing Element';
}

function getHiddenStems(branchName: string, dayMaster: HeavenlyStem): HeavenlyStem[] {
  const hiddenMap: Record<string, string[]> = {
    Zi: ['Gui'], Chou: ['Ji', 'Gui', 'Xin'], Yin: ['Jia', 'Bing', 'Wu'],
    Mao: ['Yi'], Chen: ['Wu', 'Yi', 'Gui'], Si: ['Bing', 'Geng', 'Wu'],
    Wu: ['Ding', 'Ji'], Wei: ['Ji', 'Ding', 'Yi'], Shen: ['Geng', 'Ren', 'Wu'],
    You: ['Xin'], Xu: ['Wu', 'Xin', 'Ding'], Hai: ['Ren', 'Jia'],
  };

  const names = hiddenMap[branchName] || [];
  return names.map((n) => {
    const found = STEMS.find((s) => s.name === n)!;
    return { ...found, tenGod: getTenGod(dayMaster, found) };
  });
}

function getFavorableElements(elem: WuXingElement, strength: string): WuXingElement[] {
  if (strength === 'Strong') {
    const drainMap: Record<WuXingElement, WuXingElement[]> = {
      Wood: ['Fire', 'Metal', 'Earth'],
      Fire: ['Earth', 'Water', 'Metal'],
      Earth: ['Metal', 'Wood', 'Water'],
      Metal: ['Water', 'Fire', 'Wood'],
      Water: ['Wood', 'Earth', 'Fire'],
    };
    return drainMap[elem];
  }
  const supportMap: Record<WuXingElement, WuXingElement[]> = {
    Wood: ['Water', 'Wood'],
    Fire: ['Wood', 'Fire'],
    Earth: ['Fire', 'Earth'],
    Metal: ['Earth', 'Metal'],
    Water: ['Metal', 'Water'],
  };
  return supportMap[elem];
}

function getUnfavorableElements(elem: WuXingElement, strength: string): WuXingElement[] {
  if (strength === 'Strong') {
    return [elem];
  }
  const weakenMap: Record<WuXingElement, WuXingElement[]> = {
    Wood: ['Metal', 'Fire'],
    Fire: ['Water', 'Earth'],
    Earth: ['Wood', 'Metal'],
    Metal: ['Fire', 'Water'],
    Water: ['Earth', 'Wood'],
  };
  return weakenMap[elem];
}
