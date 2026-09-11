// ============================================
// Input Validation & Boundary Tests
// ============================================

import { UserProfileSchema, UserSettingsSchema, ParsedBackgroundSchema } from '../data/schemas';
import { UserProfile, ParsedBackground } from '../domain/fighter';
import { UserSettings } from '../domain/types';
import { z } from 'zod';

// ============================================
// 검증 에러 클래스
// ============================================

export class ValidationError extends Error {
  public field: string;
  public code: string;
  public value: any;
  
  constructor(field: string, code: string, message: string, value: any) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
    this.value = value;
  }
}

// ============================================
// 경계값 테스트 케이스
// ============================================

export interface BoundaryTestCase {
  name: string;
  input: UserProfile;
  shouldPass: boolean;
  expectedErrors?: string[];
}

export const BOUNDARY_TEST_CASES: BoundaryTestCase[] = [
  // 키 경계값
  { name: 'height_min', input: { height: 100, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'height_max', input: { height: 250, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'height_below_min', input: { height: 99, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['height'] },
  { name: 'height_above_max', input: { height: 251, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['height'] },
  
  // 몸무게 경계값
  { name: 'weight_min', input: { height: 170, weight: 20, skeletalMuscleMass: 10, bodyFatMass: 5, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'weight_max', input: { height: 170, weight: 200, skeletalMuscleMass: 100, bodyFatMass: 50, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'weight_below_min', input: { height: 170, weight: 19, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['weight'] },
  { name: 'weight_above_max', input: { height: 170, weight: 201, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['weight'] },
  
  // 골격근량 경계값
  { name: 'skeletalMuscleMass_min', input: { height: 170, weight: 70, skeletalMuscleMass: 10, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'skeletalMuscleMass_max', input: { height: 170, weight: 70, skeletalMuscleMass: 100, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'skeletalMuscleMass_gt_weight', input: { height: 170, weight: 70, skeletalMuscleMass: 80, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['skeletalMuscleMass'] },
  
  // 체지방량 경계값
  { name: 'bodyFatMass_min', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 2, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'bodyFatMass_max', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 80, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'bodyFatMass_gt_weight', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 90, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['bodyFatMass'] },
  
  // 근육+지방 > 몸무게 논리 검증
  { name: 'muscle_plus_fat_gt_weight', input: { height: 170, weight: 70, skeletalMuscleMass: 40, bodyFatMass: 40, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['bodyComposition'] },
  
  // 나이 경계값
  { name: 'age_min', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 10, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'age_max', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 100, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
  { name: 'age_below_min', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 9, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['age'] },
  { name: 'age_above_max', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 101, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['age'] },
  
  // 격투 이력 필수
  { name: 'empty_martial_arts', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['martialArtsHistory'] },
  
  // 홈그라운드 유효값
  { name: 'invalid_homeground', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'me', deathAllowed: false }, shouldPass: true },
  { name: 'invalid_homeground2', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'opponent', deathAllowed: false }, shouldPass: true },
];

export const SETTINGS_TEST_CASES = [
  { name: 'simulationCount_min', input: { simulationCount: 100 }, shouldPass: true },
  { name: 'simulationCount_max', input: { simulationCount: 2000 }, shouldPass: true },
  { name: 'simulationCount_below', input: { simulationCount: 99 }, shouldPass: false, expectedErrors: ['simulationCount'] },
  { name: 'simulationCount_above', input: { simulationCount: 2001 }, shouldPass: false, expectedErrors: ['simulationCount'] },
  { name: 'timeLimit_valid', input: { timeLimit: '5min' }, shouldPass: true },
  { name: 'timeLimit_invalid', input: { timeLimit: 'invalid' }, shouldPass: false, expectedErrors: ['timeLimit'] },
];

// ============================================
// 검증 함수들
// ============================================

export function validateUserProfile(input: any): { success: boolean; data?: UserProfile; errors: ValidationError[] } {
  const result = UserProfileSchema.safeParse(input);
  
  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map(e => 
      new ValidationError(e.path.join('.'), e.code, e.message, input[e.path[0]])
    );
    return { success: false, errors };
  }
  
  const data = result.data;
  if (data.skeletalMuscleMass + data.bodyFatMass > data.weight) {
    return {
      success: false,
      errors: [new ValidationError('bodyComposition', 'custom', 
        '골격근량 + 체지방량이 몸무게를 초과할 수 없습니다', 
        { skeletalMuscleMass: data.skeletalMuscleMass, bodyFatMass: data.bodyFatMass, weight: data.weight })]
    };
  }
  
  if (data.skeletalMuscleMass > data.weight) {
    return {
      success: false,
      errors: [new ValidationError('skeletalMuscleMass', 'custom', 
        '골격근량은 몸무게를 초과할 수 없습니다', 
        { skeletalMuscleMass: data.skeletalMuscleMass, weight: data.weight })]
    };
  }
  
  if (data.bodyFatMass > data.weight) {
    return {
      success: false,
      errors: [new ValidationError('bodyFatMass', 'custom', 
        '체지방량은 몸무게를 초과할 수 없습니다', 
        { bodyFatMass: data.bodyFatMass, weight: data.weight })]
    };
  }
  
  return { success: true, data, errors: [] };
}

export function validateUserSettings(input: any): { success: boolean; data?: UserSettings; errors: ValidationError[] } {
  const result = UserSettingsSchema.safeParse(input);
  
  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map(e => 
      new ValidationError(e.path.join('.'), e.code, e.message, input[e.path[0]])
    );
    return { success: false, errors };
  }
  
  return { success: true, data: result.data, errors: [] };
}

export function validateParsedBackground(input: any): { success: boolean; data?: ParsedBackground; errors: ValidationError[] } {
  const result = ParsedBackgroundSchema.safeParse(input);
  
  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map(e => 
      new ValidationError(e.path.join('.'), e.code, e.message, input[e.path[0]])
    );
    return { success: false, errors };
  }
  
  const data = result.data;
  if (data.experienceMonths === 0 && data.trainingFrequency > 0) {
    return {
      success: false,
      errors: [new ValidationError('trainingFrequency', 'custom', 
        '수련 기간이 0개월인데 주당 횟수가 0보다 클 수 없습니다', 
        data)]
    };
  }
  
  if (data.trainingFrequency > 14) {
    return {
      success: false,
      errors: [new ValidationError('trainingFrequency', 'custom', 
        '주당 훈련 횟수는 14회를 초과할 수 없습니다', 
        data.trainingFrequency)]
    };
  }
  
  return { success: true, data, errors: [] };
}

// ============================================
// 종합 검증 함수
// ============================================

export function validateSimulationInput(input: {
  fighterA: UserProfile;
  fighterB: UserProfile;
  settings: UserSettings;
}): { success: boolean; errors: ValidationError[] } {
  const allErrors: ValidationError[] = [];
  
  const profileA = validateUserProfile(input.fighterA);
  if (!profileA.success) {
    allErrors.push(...profileA.errors.map(e => new ValidationError(`fighterA.${e.field}`, e.code, e.message, e.value)));
  }
  
  const profileB = validateUserProfile(input.fighterB);
  if (!profileB.success) {
    allErrors.push(...profileB.errors.map(e => new ValidationError(`fighterB.${e.field}`, e.code, e.message, e.value)));
  }
  
  const settings = validateUserSettings(input.settings);
  if (!settings.success) {
    allErrors.push(...settings.errors.map(e => new ValidationError(`settings.${e.field}`, e.code, e.message, e.value)));
  }
  
  return {
    success: allErrors.length === 0,
    errors: allErrors,
  };
}

// ============================================
// 테스트 러너
// ============================================

export async function runBoundaryTests(): Promise<{ passed: number; failed: number; details: any[] }> {
  let passed = 0;
  let failed = 0;
  const details: any[] = [];
  
  for (const testCase of BOUNDARY_TEST_CASES) {
    const result = validateUserProfile(testCase.input);
    const testPassed = result.success === testCase.shouldPass;
    
    if (testPassed) {
      passed++;
    } else {
      failed++;
    }
    
    details.push({
      name: testCase.name,
      passed: testPassed,
      expected: testCase.shouldPass,
      actual: result.success,
      errors: result.errors.map(e => ({ field: e.field, code: e.code, message: e.message })),
    });
  }
  
  return { passed, failed, details };
}

export async function runSettingsTests(): Promise<{ passed: number; failed: number; details: any[] }> {
  let passed = 0;
  let failed = 0;
  const details: any[] = [];
  
  for (const testCase of SETTINGS_TEST_CASES) {
    const result = validateUserSettings(testCase.input);
    const testPassed = result.success === testCase.shouldPass;
    
    if (testPassed) {
      passed++;
    } else {
      failed++;
    }
    
    details.push({
      name: testCase.name,
      passed: testPassed,
      expected: testCase.shouldPass,
      actual: result.success,
      errors: result.errors.map(e => ({ field: e.field, code: e.code, message: e.message })),
    });
  }
  
  return { passed, failed, details };
}

// ============================================
// NaN/Infinity 가드
// ============================================

export function guardAgainstNaN(value: number, fieldName: string, fallback = 0): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    console.warn(`[Validation] ${fieldName} is NaN/Infinity, using fallback: ${fallback}`);
    return fallback;
  }
  return value;
}

export function clampToRange(value: number, min: number, max: number, fieldName: string): number {
  const clamped = Math.max(min, Math.min(max, value));
  if (clamped !== value) {
    console.warn(`[Validation] ${fieldName} clamped from ${value} to ${clamped}`);
  }
  return clamped;
}