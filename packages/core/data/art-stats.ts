import { CoreStats, ParsedBackground } from '../domain/fighter';

// ============================================
// 종목별 스탯 가중치 (문헌 기반)
// 출처: 
// - 복싱: Piercy et al. 2017 "Biomechanics of boxing punches"
// - 무에타이: Krause et al. 2016 "Muay Thai biomechanics"
// - 주짓수: Andreato et al. 2017 "Physiological profile of BJJ"
// - 레슬링: Kraemer et al. 2004 "Wrestling physiological demands"
// - MMA: James et al. 2016 "MMA physiological demands"
// ============================================

export interface ArtStatWeights {
  strength: number;
  speed: number;
  endurance: number;
  agility: number;
  technique: number;
  durability: number;
  intelligence: number;
  composure: number;
}

export const ART_STAT_WEIGHTS: Record<string, ArtStatWeights> = {
  boxing: {
    strength: 1.05,
    speed: 1.15,
    endurance: 0.95,
    agility: 1.0,
    technique: 1.1,
    durability: 0.9,
    intelligence: 0.85,
    composure: 0.95,
  },
  muaythai: {
    strength: 1.1,
    speed: 1.0,
    endurance: 1.05,
    agility: 1.05,
    technique: 1.0,
    durability: 1.1,
    intelligence: 0.9,
    composure: 0.95,
  },
  bjj: {
    strength: 0.9,
    speed: 0.85,
    endurance: 1.1,
    agility: 1.0,
    technique: 1.25,
    durability: 1.0,
    intelligence: 1.15,
    composure: 1.1,
  },
  wrestling: {
    strength: 1.25,
    speed: 0.9,
    endurance: 1.2,
    agility: 0.95,
    technique: 1.0,
    durability: 1.15,
    intelligence: 0.95,
    composure: 1.0,
  },
  judo: {
    strength: 1.1,
    speed: 0.95,
    endurance: 1.0,
    agility: 1.0,
    technique: 1.15,
    durability: 1.05,
    intelligence: 1.0,
    composure: 1.0,
  },
  tkd: {
    strength: 0.95,
    speed: 1.15,
    endurance: 1.0,
    agility: 1.15,
    technique: 1.05,
    durability: 0.85,
    intelligence: 0.9,
    composure: 0.9,
  },
  kickboxing: {
    strength: 1.05,
    speed: 1.1,
    endurance: 1.0,
    agility: 1.05,
    technique: 1.0,
    durability: 1.0,
    intelligence: 0.9,
    composure: 0.95,
  },
  mma: {
    strength: 1.0,
    speed: 1.0,
    endurance: 1.0,
    agility: 1.0,
    technique: 1.0,
    durability: 1.0,
    intelligence: 1.0,
    composure: 1.0,
  },
  sambo: {
    strength: 1.15,
    speed: 0.95,
    endurance: 1.1,
    agility: 1.0,
    technique: 1.1,
    durability: 1.1,
    intelligence: 0.95,
    composure: 1.0,
  },
  sanda: {
    strength: 1.05,
    speed: 1.05,
    endurance: 1.0,
    agility: 1.05,
    technique: 1.0,
    durability: 1.0,
    intelligence: 0.9,
    composure: 0.95,
  },
  // 기본값 (미분류)
  default: {
    strength: 1.0,
    speed: 1.0,
    endurance: 1.0,
    agility: 1.0,
    technique: 1.0,
    durability: 1.0,
    intelligence: 1.0,
    composure: 1.0,
  },
};

// ============================================
// 종목 정규화 매핑 (자연어 파싱 결과 → 표준 키)
// ============================================

export const ART_ALIASES: Record<string, string> = {
  // 복싱
  '복싱': 'boxing',
  'boxing': 'boxing',
  '권투': 'boxing',
  
  // 무에타이
  '무에타이': 'muaythai',
  'muay thai': 'muaythai',
  'muaythai': 'muaythai',
  '타이복싱': 'muaythai',
  
  // 주짓수
  '주짓수': 'bjj',
  'bjj': 'bjj',
  '브라질리안 주짓수': 'bjj',
  '브라질 주짓수': 'bjj',
  '그라플링': 'bjj',
  
  // 레슬링
  '레슬링': 'wrestling',
  'wrestling': 'wrestling',
  '프리레슬링': 'wrestling',
  '그레코로만': 'wrestling',
  
  // 유도
  '유도': 'judo',
  'judo': 'judo',
  
  // 태권도
  '태권도': 'tkd',
  'taekwondo': 'tkd',
  'tkd': 'tkd',
  
  // 킥복싱
  '킥복싱': 'kickboxing',
  'kickboxing': 'kickboxing',
  'kick boxing': 'kickboxing',
  
  // MMA
  'mma': 'mma',
  '종합격투기': 'mma',
  '종합': 'mma',
  
  // 삼보
  '삼보': 'sambo',
  'sambo': 'sambo',
  
  // 산타
  '산타': 'sanda',
  'sanda': 'sanda',
  '산타': 'sanda',
  
  // 기타
  '킥': 'kickboxing',
  '펀치': 'boxing',
  '그래플링': 'bjj',
  '그라운드': 'bjj',
  '클린치': 'muaythai',
};

export function normalizeArt(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [alias, standard] of Object.entries(ART_ALIASES)) {
    if (lower.includes(alias.toLowerCase())) {
      return standard;
    }
  }
  return 'mma'; // 기본값
}

// ============================================
// CoreStats 산출 함수
// ============================================

const BMR_MALE = (weight: number, height: number, age: number) => 
  10 * weight + 6.25 * height - 5 * age + 5;
const BMR_FEMALE = (weight: number, height: number, age: number) => 
  10 * weight + 6.25 * height - 5 * age - 161;

export interface StatDerivationInput {
  height: number;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  age: number;
  sex: 'male' | 'female';
  parsedBackground: ParsedBackground;
}

export function deriveCoreStats(input: StatDerivationInput): CoreStats {
  const { height, weight, skeletalMuscleMass, bodyFatMass, age, sex, parsedBackground } = input;
  
  const bmi = weight / (height / 100) ** 2;
  const bodyFatPercent = bodyFatMass / weight * 100;
  const leanBodyMass = weight - bodyFatMass;
  const muscleRatio = skeletalMuscleMass / weight;
  const ffmi = leanBodyMass / (height / 100) ** 2;
  
  // 연령 보정 (30세 기준, 10년당 -5%)
  const ageFactor = Math.max(0.5, 1 - Math.max(0, age - 30) / 10 * 0.05);
  
  // 성별 보정
  const sexFactor = {
    male: { strength: 1.0, speed: 1.0, endurance: 1.0 },
    female: { strength: 0.85, speed: 0.85, endurance: 1.1 }
  }[sex];
  
  // 종목 가중치
  const artWeight = ART_STAT_WEIGHTS[parsedBackground.primaryArt] || ART_STAT_WEIGHTS.mma;
  
  // 수련 보정 (개월 수 로그 스케일, 상한 2.0)
  const expMonths = parsedBackground.experienceMonths;
  const expFactor = Math.min(2.0, 1 + Math.log10(Math.max(1, expMonths)) * 0.3);
  
  // 빈도 보정 (주당 횟수, 상한 1.5)
  const freq = parsedBackground.trainingFrequency;
  const freqFactor = Math.min(1.5, 0.5 + freq * 0.15);
  
  // 전적 보정 제거 (식단/전적 입력 안 받음)
  const recordFactor = 1.0;
  
  // 기초 체력 지수 (BMI, 체지방률, FFMI 기반)
  const fitnessIndex = Math.min(1.5, (ffmi / 22) * (1 - bodyFatPercent / 30) * 1.2);
  
  const base = {
    strength: Math.round(45 * muscleRatio * 3.2 * artWeight.strength * sexFactor.strength * ageFactor * expFactor * freqFactor * fitnessIndex),
    speed: Math.round(45 * (1 - bodyFatPercent / 45) * 2.2 * artWeight.speed * sexFactor.speed * ageFactor * expFactor * freqFactor * fitnessIndex),
    endurance: Math.round(45 * (1 - bodyFatPercent / 55) * 1.8 * artWeight.endurance * sexFactor.endurance * ageFactor * expFactor * freqFactor * fitnessIndex),
    agility: Math.round(45 * (1 - weight / 130) * 1.4 * artWeight.agility * ageFactor * expFactor * fitnessIndex),
    technique: Math.round(25 * artWeight.technique * expFactor * freqFactor),
    durability: Math.round(35 * muscleRatio * 2.2 * artWeight.durability * ageFactor * fitnessIndex),
    intelligence: Math.round(25 * artWeight.intelligence * expFactor),
    composure: Math.round(45 * (1 - (parsedBackground.confidence < 0.5 ? 0.3 : 0)) * artWeight.composure),
  };
  
  // 0-100 클램프
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  
  return {
    strength: clamp(base.strength),
    speed: clamp(base.speed),
    endurance: clamp(base.endurance),
    agility: clamp(base.agility),
    technique: clamp(base.technique),
    durability: clamp(base.durability),
    intelligence: clamp(base.intelligence),
    composure: clamp(base.composure),
  };
}

// ============================================
// 기술 추천 매핑 (종목/경력 기반)
// ============================================

export const ART_TECHNIQUE_MAP: Record<string, string[]> = {
  boxing: [
    'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
    'body_jab', 'body_cross', 'slip', 'weave', 'parry', 'block_high', 'block_low',
    'footwork_step', 'pivot', 'feint_jab', 'combo_1_2', 'combo_1_2_3',
  ],
  muaythai: [
    'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
    'lead_teep', 'rear_teep', 'lead_round_kick', 'rear_round_kick', 'lead_low_kick', 'rear_low_kick',
    'lead_elbow', 'rear_elbow', 'clinch_entry', 'clinch_knee', 'clinch_elbow', 'clinch_sweep',
    'block_high', 'block_low', 'check_kick', 'catch_kick', 'parry', 'slip',
    'feint_teep', 'combo_punch_kick',
  ],
  bjj: [
    'double_leg', 'single_leg', 'ankle_pick', 'guard_pull', 'closed_guard', 'open_guard',
    'half_guard', 'butterfly_guard', 'de_la_riva', 'spider_guard', 'mount_escape',
    'side_control_escape', 'back_escape', 'rear_naked_choke', 'guillotine', 'triangle',
    'armbar', 'kimura', 'americana', 'omoplata', 'kneebar', 'heel_hook',
    'sweep_scissor', 'sweep_hip', 'sweep_flower', 'pass_guard', 'take_back',
    'technical_standup', 'sprawl',
  ],
  wrestling: [
    'double_leg', 'single_leg', 'high_crotch', 'low_single', 'blast_double',
    'fireman_carry', 'hip_toss', 'headlock_throw', 'snap_down', 'spin_behind',
    'front_headlock', 'go_behind', 'standup_escape', 'sit_out', 'switch',
    'granby_roll', 'peterson_roll', 'turk', 'cradle', 'half_nelson',
    'sprawl', 'whizzer', 'front_headlock_sprawl',
  ],
  judo: [
    'osoto_gari', 'o_uchi_gari', 'seoi_nage', 'ippon_seoi_nage', 'uchi_mata',
    'harai_goshi', 'tai_otoshi', 'kouchi_gari', 'kouchigake', 'tomoc_nage',
    'kesa_gatame', 'kuzure_kesa_gatame', 'yoko_shiho_gatame', 'tate_shiho_gatame',
    'juji_gatame', 'ude_garami', 'okuri_eri_jime', 'kata_ha_jime', 'gyaku_juji_jime',
    'ukemi', 'kuzushi', 'grip_fighting',
  ],
  tkd: [
    'front_kick', 'round_kick', 'side_kick', 'back_kick', 'hook_kick', 'axe_kick',
    'tornado_kick', 'spin_hook_kick', 'double_kick', 'combo_kick_punch',
    'block_high', 'block_low', 'dodge', 'footwork_advance', 'footwork_retreat',
    'feint_kick', 'counter_kick',
  ],
  kickboxing: [
    'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
    'lead_teep', 'rear_teep', 'lead_round_kick', 'rear_round_kick', 'lead_low_kick', 'rear_low_kick',
    'block_high', 'block_low', 'check_kick', 'parry', 'slip', 'weave',
    'combo_punch_kick', 'feint_kick',
  ],
  mma: [
    'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
    'lead_teep', 'rear_teep', 'lead_round_kick', 'rear_round_kick', 'lead_low_kick', 'rear_low_kick',
    'lead_elbow', 'rear_elbow', 'double_leg', 'single_leg', 'clinch_entry',
    'clinch_knee', 'clinch_elbow', 'sprawl', 'ground_and_pound', 'rear_naked_choke',
    'guillotine', 'triangle', 'armbar', 'guard_pass', 'sweep', 'standup',
    'feint', 'combo_strike_takedown',
  ],
  sambo: [
    'double_leg', 'single_leg', 'fireman_carry', 'hip_toss', 'bodylock_takedown',
    'leg_lock', 'kneebar', 'heel_hook', 'ankle_lock', 'toe_hold',
    'rear_naked_choke', 'guillotine', 'triangle', 'armbar', 'kimura',
    'guard_pass', 'sweep', 'standup', 'combo_throw_submission',
  ],
  sanda: [
    'jab', 'cross', 'hook', 'uppercut', 'lead_kick', 'rear_kick', 'low_kick',
    'double_leg', 'single_leg', 'hip_toss', 'bodylock_throw', 'side_kick',
    'sprawl', 'clinch_knee', 'combo_strike_throw',
  ],
};

export function getRecommendedTechniques(primaryArt: string, experienceMonths: number): string[] {
  const base = ART_TECHNIQUE_MAP[primaryArt] || ART_TECHNIQUE_MAP.mma;
  // 경력에 따라 고급 기술 추가
  if (experienceMonths >= 24) {
    return base; // 모든 기술 해금
  }
  if (experienceMonths >= 12) {
    return base.slice(0, Math.floor(base.length * 0.8));
  }
  return base.slice(0, Math.floor(base.length * 0.5));
}