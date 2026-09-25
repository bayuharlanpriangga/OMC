import { BirthProfile } from '../../types/birth-data';
import { StarBrightness, TransformationType, ZiWeiCalculationResult, ZiWeiPalace, ZiWeiStar } from './types';

const BRANCH_NAMES = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
const STEM_NAMES = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

const PALACE_NAMES: Array<{ name: string; chinese: string }> = [
  { name: 'Life Palace (Ming)', chinese: '命宮' },
  { name: 'Siblings', chinese: '兄弟宮' },
  { name: 'Spouse / Marriage', chinese: '夫妻宮' },
  { name: 'Children', chinese: '子女宮' },
  { name: 'Wealth & Prosperity', chinese: '財帛宮' },
  { name: 'Health & Well-being', chinese: '疾厄宮' },
  { name: 'Travel & Migration', chinese: '遷移宮' },
  { name: 'Friends & Allies', chinese: '交友宮' },
  { name: 'Career & Ambition', chinese: '官祿宮' },
  { name: 'Property & Real Estate', chinese: '田宅宮' },
  { name: 'Mental / Karma (Fu De)', chinese: '福德宮' },
  { name: 'Parents & Ancestry', chinese: '父母宮' },
];

export function calculateZiWeiDouShu(
  profile: BirthProfile,
  _settings: Record<string, any> = {}
): ZiWeiCalculationResult {
  const [year, month, day] = profile.birthDate.split('-').map(Number);
  const [hour] = (profile.birthTime || '12:00').split(':').map(Number);

  // Hour branch index (0-11)
  const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);

  // Life Palace branch calculation: starts at Yin (branch 2), + (month - 1) clockwise, - hour counter-clockwise
  const lifePalaceBranchIdx = ((2 + (month - 1) - hourBranchIdx) % 12 + 12) % 12;
  const bodyPalaceBranchIdx = ((2 + (month - 1) + hourBranchIdx) % 12 + 12) % 12;

  // Bureau calculation
  const bureaus = ['Water 2nd Bureau', 'Wood 3rd Bureau', 'Metal 4th Bureau', 'Earth 5th Bureau', 'Fire 6th Bureau'];
  const elementBureau = bureaus[(year + month) % bureaus.length];

  // Distribute 14 Major Stars
  const majorStarDefs: Array<{ name: string; chinese: string; defaultBrightness: StarBrightness }> = [
    { name: 'Zi Wei (The Emperor)', chinese: '紫微', defaultBrightness: 'Miao (Temple)' },
    { name: 'Tian Ji (The Strategist)', chinese: '天機', defaultBrightness: 'Wang (Bright)' },
    { name: 'Tai Yang (The Sun)', chinese: '太陽', defaultBrightness: 'Wang (Bright)' },
    { name: 'Wu Qu (The General)', chinese: '武曲', defaultBrightness: 'Miao (Temple)' },
    { name: 'Tian Tong (The Fortunate)', chinese: '天同', defaultBrightness: 'De (Good)' },
    { name: 'Lian Zhen (The Diplomat)', chinese: '廉貞', defaultBrightness: 'Li (Average)' },
    { name: 'Tian Fu (The Empress)', chinese: '天府', defaultBrightness: 'Miao (Temple)' },
    { name: 'Tai Yin (The Moon)', chinese: '太陰', defaultBrightness: 'Wang (Bright)' },
    { name: 'Tan Lang (The Wolf / Charisma)', chinese: '貪狼', defaultBrightness: 'Miao (Temple)' },
    { name: 'Ju Men (The Advocate)', chinese: '巨門', defaultBrightness: 'Li (Average)' },
    { name: 'Tian Xiang (The Minister)', chinese: '天相', defaultBrightness: 'De (Good)' },
    { name: 'Tian Liang (The Sage)', chinese: '天梁', defaultBrightness: 'Wang (Bright)' },
    { name: 'Qi Sha (The Marshal)', chinese: '七殺', defaultBrightness: 'Miao (Temple)' },
    { name: 'Po Jun (The Pioneer)', chinese: '破軍', defaultBrightness: 'Wang (Bright)' },
  ];

  // Four transformations (Si Hua) based on year stem
  const yearStemIdx = ((year - 4) % 10 + 10) % 10;
  const transformMap: Record<number, Array<{ star: string; type: TransformationType }>> = {
    0: [{ star: 'Lian Zhen', type: 'Hua Lu (Prosperity)' }, { star: 'Po Jun', type: 'Hua Quan (Power)' }, { star: 'Wu Qu', type: 'Hua Ke (Fame)' }, { star: 'Tai Yang', type: 'Hua Ji (Karma)' }],
    1: [{ star: 'Tian Ji', type: 'Hua Lu (Prosperity)' }, { star: 'Tian Liang', type: 'Hua Quan (Power)' }, { star: 'Zi Wei', type: 'Hua Ke (Fame)' }, { star: 'Tai Yin', type: 'Hua Ji (Karma)' }],
    2: [{ star: 'Tian Tong', type: 'Hua Lu (Prosperity)' }, { star: 'Tian Ji', type: 'Hua Quan (Power)' }, { star: 'Wen Chang', type: 'Hua Ke (Fame)' }, { star: 'Lian Zhen', type: 'Hua Ji (Karma)' }],
    3: [{ star: 'Tai Yin', type: 'Hua Lu (Prosperity)' }, { star: 'Tian Tong', type: 'Hua Quan (Power)' }, { star: 'Tian Ji', type: 'Hua Ke (Fame)' }, { star: 'Ju Men', type: 'Hua Ji (Karma)' }],
  };
  const activeTransforms = transformMap[yearStemIdx % 4] || transformMap[0];

  const transformationsSummary: Array<{ star: string; type: TransformationType; palace: string }> = [];

  // Build the 12 Palaces
  const palaces: ZiWeiPalace[] = [];
  for (let i = 0; i < 12; i++) {
    const palaceBranchIdx = (lifePalaceBranchIdx + i) % 12;
    const branchName = BRANCH_NAMES[palaceBranchIdx];
    const stemName = STEM_NAMES[(yearStemIdx * 2 + palaceBranchIdx) % 10];
    const palaceDef = PALACE_NAMES[i];

    // Place 1-2 major stars per palace deterministically
    const starIdx1 = (i * 2 + day) % majorStarDefs.length;
    const starIdx2 = (i * 3 + month) % majorStarDefs.length;

    const majorStars: ZiWeiStar[] = [];
    const star1Def = majorStarDefs[starIdx1];
    const trans1 = activeTransforms.find((t) => star1Def.name.includes(t.star));

    majorStars.push({
      name: star1Def.name,
      chinese: star1Def.chinese,
      brightness: star1Def.defaultBrightness,
      category: 'Major Imperial',
      transformation: trans1?.type,
    });

    if (trans1) {
      transformationsSummary.push({
        star: star1Def.name,
        type: trans1.type,
        palace: palaceDef.name,
      });
    }

    if (i % 2 === 0 && starIdx2 !== starIdx1) {
      const star2Def = majorStarDefs[starIdx2];
      const trans2 = activeTransforms.find((t) => star2Def.name.includes(t.star));
      majorStars.push({
        name: star2Def.name,
        chinese: star2Def.chinese,
        brightness: star2Def.defaultBrightness,
        category: 'Major Imperial',
        transformation: trans2?.type,
      });
      if (trans2) {
        transformationsSummary.push({
          star: star2Def.name,
          type: trans2.type,
          palace: palaceDef.name,
        });
      }
    }

    palaces.push({
      index: i,
      name: palaceDef.name,
      chinese: palaceDef.chinese,
      earthlyBranch: branchName,
      heavenlyStem: stemName,
      isLifePalace: i === 0,
      isBodyPalace: palaceBranchIdx === bodyPalaceBranchIdx,
      majorStars,
      minorStars: ['Left Assistant (Zuo Fu)', 'Right Deputy (You Bi)', 'Lucrative Star (Lu Cun)'].filter(
        (_, sIdx) => (i + sIdx) % 3 === 0
      ),
    });
  }

  return {
    lunarBirthDate: `Lunar Calendar Month ${month}, Day ${day}`,
    lifePalaceBranch: BRANCH_NAMES[lifePalaceBranchIdx],
    bodyPalaceBranch: BRANCH_NAMES[bodyPalaceBranchIdx],
    elementBureau,
    palaces,
    transformationsSummary,
  };
}
