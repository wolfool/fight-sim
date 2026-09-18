import { describe, it, expect } from 'vitest';
import {
  ANIMAL_PRESETS,
  animalToFighter,
  CHIMPANZEE,
  TIGER,
  HUMAN_UNTRAINED,
} from '../animal-traits';

describe('동물 프리셋 10종 - 데이터 무결성', () => {
  const EXPECTED = [
    'chimpanzee', 'gorilla', 'orangutan', 'tiger', 'lion',
    'brown_bear', 'grizzly', 'wolf', 'wild_boar', 'human_untrained',
  ];

  it('10종 모두 등록', () => {
    for (const id of EXPECTED) {
      expect(ANIMAL_PRESETS[id]).toBeDefined();
    }
    expect(Object.keys(ANIMAL_PRESETS)).toHaveLength(10);
  });

  it('필수 바이오메카닉스 (교합력/질주/가속도) 존재', () => {
    for (const id of EXPECTED) {
      const b = ANIMAL_PRESETS[id]!.biomechanics;
      expect(b.biteForce.value).toBeGreaterThan(0);
      expect(b.sprintSpeed.value).toBeGreaterThan(0);
      expect(b.acceleration.value).toBeGreaterThan(0);
    }
  });

  it('자연무기 1개 이상 보유', () => {
    for (const id of EXPECTED) {
      expect(ANIMAL_PRESETS[id]!.behavior.naturalWeapons.length).toBeGreaterThan(0);
    }
  });

  it('행동 성향 0-1 범위', () => {
    for (const id of EXPECTED) {
      const beh = ANIMAL_PRESETS[id]!.behavior;
      for (const v of [beh.aggression, beh.territoriality, beh.flightiness, beh.intelligence, beh.sociality]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('포식자는 비훈련 인간보다 교합력이 셈', () => {
    expect(TIGER.biomechanics.biteForce.value).toBeGreaterThan(
      HUMAN_UNTRAINED.biomechanics.biteForce.value
    );
    expect(CHIMPANZEE.biomechanics.biteForce.value).toBeGreaterThan(
      HUMAN_UNTRAINED.biomechanics.biteForce.value
    );
  });
});

describe('animalToFighter - 파이터 변환', () => {
  it('19 세그먼트 + 0-100 스탯 + animal 타입', () => {
    const f = animalToFighter(CHIMPANZEE);
    expect(f.type).toBe('animal');
    expect(f.body.segments).toHaveLength(19);
    for (const v of Object.values(f.stats)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
    expect(f.body.durability['head']).toBeDefined();
  });

  it('호랑이 스탯이 비훈련 인간보다 strength/velocity 우세', () => {
    const tiger = animalToFighter(TIGER);
    const human = animalToFighter(HUMAN_UNTRAINED);
    expect(tiger.stats.strength).toBeGreaterThan(human.stats.strength);
    expect(tiger.stats.speed).toBeGreaterThan(human.stats.speed);
  });
});
