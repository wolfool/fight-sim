// ============================================
// 절대값 스케일 앵커 포인트 (성인 남성 평균 기준)
// UI 표기: "상대적 (0-100, 성인 남성 평균 기준)" / "절대값 (SI 단위)"
// ============================================

export interface AnchorValues {
  // 힘/파워
  strength: {
    label: '펀치 피크 힘';
    unit: 'N';
    value: number;        // 성인 남성 평균 펀치 피크 힘
    description: string;
  };
  speed: {
    label: '펀치 피크 속도';
    unit: 'm/s';
    value: number;
    description: string;
  };
  endurance: {
    label: '최대 산소 섭취량';
    unit: 'ml/kg/min';
    value: number;
    description: string;
  };
  durability: {
    label: '두부 충격 내성 (HIC)';
    unit: 'HIC';
    value: number;
    description: string;
  };
  // 추가 파생 앵커
  strikeImpulse: {
    label: '펀치 임펄스';
    unit: 'N·s';
    value: number;
    description: string;
  };
  strikeEnergy: {
    label: '펀치 충격 에너지';
    unit: 'J';
    value: number;
    description: string;
  };
  biteForce: {
    label: '교합력';
    unit: 'N';
    value: number;
    description: string;
  };
  gripStrength: {
    label: '악력';
    unit: 'N';
    value: number;
    description: string;
  };
  sprintSpeed: {
    label: '최대 질주 속도';
    unit: 'm/s';
    value: number;
    description: string;
  };
}

// 성인 남성 평균값 (20-30대, 한국인 체형 반영)
// 출처: 
// - 펀치 힘/속도: Piercy et al. 2017, "Biomechanics of boxing punches" (아마추어 평균)
// - VO2max: 한국인 영양조사/체력조사 2020 (20대 남성 평균)
// - HIC: NHTSA 기준, 일반인 두부 내성
// - 교합력: 한국인 치과학회 평균값
// - 악력: 한국인 체력조사 2020
// - 질주속도: 일반인 100m 평균

export const ANCHOR_VALUES: AnchorValues = {
  strength: {
    label: '펀치 피크 힘',
    unit: 'N',
    value: 1800,  // 일반 성인 남성 평균 잽/크로스 피크 힘
    description: '일반 성인 남성(70kg, 복싱 비경험자) 잽 피크 힘 평균값. 프로는 3000N+',
  },
  speed: {
    label: '펀치 피크 속도',
    unit: 'm/s',
    value: 8.5,   // 일반 성인 남성 평균 펀치 속도
    description: '일반 성인 남성 펀치 손끝 속도 평균. 프로는 12-15m/s',
  },
  endurance: {
    label: '최대 산소 섭취량',
    unit: 'ml/kg/min',
    value: 42,    // 한국 20대 남성 평균 VO2max
    description: '한국인 20-29세 남성 평균 VO2max (국민체력조사 2020). 엘리트는 65+',
  },
  durability: {
    label: '두부 충격 내성 (HIC)',
    unit: 'HIC',
    value: 700,   // 일반인 두부 손상 임계치 근사
    description: 'HIC 700에서 뇌진탕 확률 약 50% (NHTSA). 프로 파이터는 목 근육 발달로 내성 높음',
  },
  strikeImpulse: {
    label: '펀치 임펄스',
    unit: 'N·s',
    value: 35,    // 1800N × ~20ms
    description: '평균 펀치 임펄스 (힘 × 시간 적분)',
  },
  strikeEnergy: {
    label: '펀치 충격 에너지',
    unit: 'J',
    value: 120,   // 0.5 × m × v² 근사
    description: '펀치 전달 운동에너지 평균',
  },
  biteForce: {
    label: '교합력',
    unit: 'N',
    value: 600,   // 한국인 성인 남성 평균 교합력 (제1대구치)
    description: '한국인 치과학회 2018 평균값. 여성 약 450N',
  },
  gripStrength: {
    label: '악력',
    unit: 'N',
    value: 400,   // 한국인 20대 남성 평균 악력
    description: '국민체력조사 2020, 20-29세 남성 평균 40kgf ≈ 392N',
  },
  sprintSpeed: {
    label: '최대 질주 속도',
    unit: 'm/s',
    value: 7.5,   // 일반인 100m 13.3초 기준
    description: '일반 성인 남성 100m 전력질주 평균 속도. 단거리 선수 10-12m/s',
  },
};

// ============================================
// 스케일 변환 유틸리티
// ============================================

export type StatKey = keyof AnchorValues;

export function relativeToAbsolute(relative: number, stat: StatKey): number {
  const anchor = ANCHOR_VALUES[stat].value;
  return (relative / 100) * anchor;
}

export function absoluteToRelative(absolute: number, stat: StatKey): number {
  const anchor = ANCHOR_VALUES[stat].value;
  const relative = (absolute / anchor) * 100;
  return Math.max(0, Math.min(200, relative)); // 0-200% 클램프
}

export function formatAbsolute(value: number, stat: StatKey): string {
  const { unit, label } = ANCHOR_VALUES[stat];
  if (unit === 'N' && value >= 1000) {
    return `${(value / 1000).toFixed(1)} kN`;
  }
  if (unit === 'ml/kg/min') {
    return `${Math.round(value)} ${unit}`;
  }
  if (unit === 'HIC') {
    return `${Math.round(value)} ${unit}`;
  }
  return `${value.toFixed(1)} ${unit}`;
}

export function getStatLabel(stat: StatKey): string {
  return ANCHOR_VALUES[stat].label;
}

export function getStatUnit(stat: StatKey): string {
  return ANCHOR_VALUES[stat].unit;
}

export function getStatDescription(stat: StatKey): string {
  return ANCHOR_VALUES[stat].description;
}

// ============================================
// CoreStats 전체 변환
// ============================================

import { CoreStats } from '../domain/fighter';

export function coreStatsToAbsolute(stats: CoreStats): Record<string, number> {
  return {
    strength: relativeToAbsolute(stats.strength, 'strength'),
    speed: relativeToAbsolute(stats.speed, 'speed'),
    endurance: relativeToAbsolute(stats.endurance, 'endurance'),
    durability: relativeToAbsolute(stats.durability, 'durability'),
    // agility, technique, intelligence, composure는 상대적만 사용
  };
}

export function coreStatsFromAbsolute(absolute: Record<string, number>): Partial<CoreStats> {
  return {
    strength: absolute.strength !== undefined ? absoluteToRelative(absolute.strength, 'strength') : undefined,
    speed: absolute.speed !== undefined ? absoluteToRelative(absolute.speed, 'speed') : undefined,
    endurance: absolute.endurance !== undefined ? absoluteToRelative(absolute.endurance, 'endurance') : undefined,
    durability: absolute.durability !== undefined ? absoluteToRelative(absolute.durability, 'durability') : undefined,
  };
}