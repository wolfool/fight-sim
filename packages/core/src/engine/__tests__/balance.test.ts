import { describe, it, expect } from 'vitest';
import { buildHumanFighter, buildAnimalFighter, buildFightContext } from '../fighter-factory';
import { DefaultSimulationEngine } from '../SimulationEngine';
import { HUMAN_UNTRAINED, CHIMPANZEE, TIGER } from '../../data/animal-traits';
import { getCompositeTechniques } from '../../data/art-stats';

const SPEC = {
  height: 175,
  weight: 72,
  skeletalMuscleMass: 32,
  bodyFatMass: 14,
  age: 30,
  sex: 'male' as const,
  deathAllowed: false,
};

function humanWith(
  art: string,
  months: number,
  freq: number,
  secondary?: { art: string; months: number }
) {
  return buildHumanFighter({
    ...SPEC,
    name: '도전자',
    parsedBackground: {
      primaryArt: art === 'none' ? 'default' : art,
      experienceMonths: months,
      trainingFrequency: freq,
      confidence: 0.9,
      ...(secondary
        ? { secondaryArt: secondary.art, secondaryExperienceMonths: secondary.months }
        : {}),
    },
  });
}

function winRates(fighterA: ReturnType<typeof humanWith>, fighterB: Parameters<typeof buildAnimalFighter>[0], n = 40, seedBase = 5000) {
  let a = 0;
  let b = 0;
  let draw = 0;
  let tdA = 0;
  for (let i = 0; i < n; i++) {
    const e = new DefaultSimulationEngine(
      buildFightContext({ homeGround: 'neutral', deathAllowed: false, timeLimit: '5min', seed: seedBase + i })
    );
    e.initialize(fighterA, buildAnimalFighter(fighterB));
    let s = 0;
    while (!e.isFinished() && s < 150000) {
      e.step();
      s++;
    }
    if (!e.isFinished()) {
      draw++;
      continue;
    }
    const r = e.getResult();
    if (r.winner === 'A') a++;
    else if (r.winner === 'B') b++;
    else draw++;
    tdA += r.summary.takedowns.A;
  }
  return { a: a / n, b: b / n, draw: draw / n, tdA: tdA / n };
}

describe('밸런스 시나리오', () => {
  it(
    '복서 3년은 무수련 인간을 압도한다',
    () => {
      const r = winRates(humanWith('boxing', 36, 4), HUMAN_UNTRAINED);
      expect(r.a).toBeGreaterThan(0.6);
    },
    60000
  );

  it(
    '무수련 vs 무수련은 백중세',
    () => {
      const r = winRates(humanWith('none', 0, 2), HUMAN_UNTRAINED);
      expect(r.a).toBeGreaterThan(0.15);
      expect(r.a).toBeLessThan(0.95);
    },
    60000
  );

  it(
    'MMA 5년 숙련자라도 호랑이를 못 이긴다',
    () => {
      const r = winRates(humanWith('mma', 60, 5), TIGER, 30);
      expect(r.b).toBeGreaterThan(0.85);
    },
    60000
  );

  it(
    '레슬링 5년은 무수련 상대로 테이크다운으로 제압한다',
    () => {
      const r = winRates(humanWith('wrestling', 60, 5), HUMAN_UNTRAINED);
      expect(r.a).toBeGreaterThan(0.6);
      expect(r.tdA).toBeGreaterThan(0.3);
    },
    60000
  );

  it(
    '침팬지는 무수련 인간에게 우위',
    () => {
      const r = winRates(humanWith('none', 0, 2), CHIMPANZEE, 30);
      expect(r.b).toBeGreaterThan(0.55);
    },
    60000
  );

  it('복합 이력: 주+보조 종목 기술 합산', () => {
    const primaryOnly = getCompositeTechniques({
      primaryArt: 'boxing',
      experienceMonths: 36,
      trainingFrequency: 4,
      confidence: 0.9,
    });
    const composite = getCompositeTechniques({
      primaryArt: 'boxing',
      experienceMonths: 36,
      trainingFrequency: 4,
      confidence: 0.9,
      secondaryArt: 'wrestling',
      secondaryExperienceMonths: 24,
    });
    expect(primaryOnly).toContain('jab');
    expect(composite.length).toBeGreaterThan(primaryOnly.length);
    expect(composite).toContain('double_leg');
  });
});
