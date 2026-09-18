import { describe, it, expect } from 'vitest';
import { deriveCoreStats, getRecommendedTechniques } from '../art-stats';
import { deriveBodySpec, calculateBodySegments } from '../body-segments';
import type { ParsedBackground } from '../schemas';

const bg = (art = 'boxing', months = 6, freq = 3): ParsedBackground => ({
  primaryArt: art,
  experienceMonths: months,
  trainingFrequency: freq,
  confidence: 0.8,
});

const MALE = { height: 175, weight: 72, skeletalMuscleMass: 32, bodyFatMass: 14, age: 30, sex: 'male' as const };

describe('deriveBodySpec - 신체 파생 계산', () => {
  it('19개 세그먼트 생성 (torso 4분할 18개 + groin)', () => {
    const spec = deriveBodySpec(MALE);
    expect(spec.segments).toHaveLength(19);
    expect(spec.segments.some((s) => s.id === 'groin')).toBe(true);
  });

  it('세그먼트 질량 합이 체중의 85~97% (Zatsiorsky 분할)', () => {
    const spec = deriveBodySpec(MALE);
    const sum = spec.segments.reduce((a, s) => a + s.mass, 0);
    expect(sum).toBeGreaterThan(MALE.weight * 0.85);
    expect(sum).toBeLessThan(MALE.weight * 0.97);
  });

  it('BMI/체지방률/제지방량 정확성', () => {
    const spec = deriveBodySpec(MALE);
    expect(spec.bmi).toBeCloseTo(23.5, 0);
    expect(spec.bodyFatPercent).toBeCloseTo(19.4, 0);
    expect(spec.leanBodyMass).toBeCloseTo(58, 0);
  });

  it('핵심 장기 내구도 포함 (뇌/심장/간)', () => {
    const d = deriveBodySpec(MALE).durability;
    expect(d.head?.organ?.organ).toBe('brain');
    expect(d.torso_front?.organ?.organ).toBe('heart');
    expect(d.torso_back?.organ?.organ).toBe('liver');
  });

  it('여성은 동일 체중 기준 세그먼트 질량/골밀도 낮음', () => {
    const m = calculateBodySegments({ ...MALE, sex: 'male' });
    const f = calculateBodySegments({ ...MALE, sex: 'female' });
    const mSum = m.reduce((a, s) => a + s.mass, 0);
    const fSum = f.reduce((a, s) => a + s.mass, 0);
    expect(fSum).toBeLessThan(mSum);
    expect(f[0].boneDensity).toBeLessThan(m[0].boneDensity);
  });
});

describe('deriveCoreStats - 스탯 산출', () => {
  const KEYS = ['strength', 'speed', 'endurance', 'agility', 'technique', 'durability', 'intelligence', 'composure'] as const;

  it('8종 스탯 모두 0-100 범위', () => {
    const stats = deriveCoreStats({ ...MALE, parsedBackground: bg() });
    for (const k of KEYS) {
      expect(stats[k]).toBeGreaterThanOrEqual(0);
      expect(stats[k]).toBeLessThanOrEqual(100);
    }
  });

  it('극단 입력에서도 0-100 클램프 유지', () => {
    const extreme = deriveCoreStats({
      height: 100, weight: 200, skeletalMuscleMass: 100, bodyFatMass: 2, age: 100, sex: 'male',
      parsedBackground: bg('wrestling', 120, 7),
    });
    for (const k of KEYS) {
      expect(extreme[k]).toBeGreaterThanOrEqual(0);
      expect(extreme[k]).toBeLessThanOrEqual(100);
    }
  });

  it('여성 상체 근력 보정 (동일 조건 대비 strength 낮음)', () => {
    const m = deriveCoreStats({ ...MALE, sex: 'male', parsedBackground: bg() });
    const f = deriveCoreStats({ ...MALE, sex: 'female', parsedBackground: bg() });
    expect(f.strength).toBeLessThan(m.strength);
    expect(f.endurance).toBeGreaterThan(m.endurance);
  });

  it('연령 60세는 30세 대비 근력/속도 감소', () => {
    const young = deriveCoreStats({ ...MALE, age: 30, parsedBackground: bg() });
    const old = deriveCoreStats({ ...MALE, age: 60, parsedBackground: bg() });
    expect(old.strength).toBeLessThan(young.strength);
    expect(old.speed).toBeLessThan(young.speed);
  });

  it('수련 5년은 6개월 대비 기술/지능 상승', () => {
    const rookie = deriveCoreStats({ ...MALE, parsedBackground: bg('boxing', 6, 3) });
    const veteran = deriveCoreStats({ ...MALE, parsedBackground: bg('boxing', 60, 3) });
    expect(veteran.technique).toBeGreaterThan(rookie.technique);
    expect(veteran.intelligence).toBeGreaterThan(rookie.intelligence);
  });

  it('골격근량 증가 시 근력 상승', () => {
    const low = deriveCoreStats({ ...MALE, skeletalMuscleMass: 28, parsedBackground: bg() });
    const high = deriveCoreStats({ ...MALE, skeletalMuscleMass: 42, parsedBackground: bg() });
    expect(high.strength).toBeGreaterThan(low.strength);
  });

  it('레슬링은 복싱 대비 strength 강조', () => {
    const boxer = deriveCoreStats({ ...MALE, parsedBackground: bg('boxing', 24, 3) });
    const wrestler = deriveCoreStats({ ...MALE, parsedBackground: bg('wrestling', 24, 3) });
    expect(wrestler.strength).toBeGreaterThan(boxer.strength);
    expect(boxer.speed).toBeGreaterThan(wrestler.speed);
  });
});

describe('getRecommendedTechniques - 기술 해금', () => {
  it('24개월+ 전체 해금', () => {
    const full = getRecommendedTechniques('boxing', 24);
    expect(full.length).toBeGreaterThan(15);
  });

  it('6개월은 절반 수준', () => {
    const full = getRecommendedTechniques('boxing', 24);
    const half = getRecommendedTechniques('boxing', 6);
    expect(half.length).toBeLessThan(full.length);
    expect(half.length).toBe(Math.floor(full.length * 0.5));
  });

  it('미지원 종목은 MMA 기본 폴로 폴백', () => {
    const t = getRecommendedTechniques('unknown_art', 24);
    expect(t.length).toBeGreaterThan(0);
    expect(t).toContain('jab');
  });
});
