import { describe, it, expect } from 'vitest';
import { buildHumanFighter, buildAnimalFighter, buildFightContext } from '../fighter-factory';
import { DefaultSimulationEngine } from '../SimulationEngine';
import { CHIMPANZEE, TIGER, HUMAN_UNTRAINED } from '../../data/animal-traits';

const me = () =>
  buildHumanFighter({
    name: '나',
    height: 175,
    weight: 72,
    skeletalMuscleMass: 32,
    bodyFatMass: 14,
    age: 30,
    sex: 'male',
    parsedBackground: {
      primaryArt: 'default',
      experienceMonths: 0,
      trainingFrequency: 2,
      confidence: 0.5,
    },
    deathAllowed: false,
  });

function runOnce(seed: number, animal: Parameters<typeof buildAnimalFighter>[0]) {
  const e = new DefaultSimulationEngine(
    buildFightContext({ homeGround: 'neutral', deathAllowed: false, timeLimit: '5min', seed })
  );
  e.initialize(me(), buildAnimalFighter(animal));
  let s = 0;
  while (!e.isFinished() && s < 150000) {
    e.step();
    s++;
  }
  return { finished: e.isFinished(), result: e.isFinished() ? e.getResult() : null, steps: s };
}

describe('SimulationEngine smoke', () => {
  it('5분 제한 매치가 반드시 종료된다', () => {
    const { finished, result } = runOnce(42, CHIMPANZEE);
    expect(finished).toBe(true);
    if (!result) throw new Error('not finished');
    expect(['ko', 'tko', 'submission', 'decision', 'surrender', 'death']).toContain(result.finishType);
    expect(result.duration).toBeGreaterThan(0);
    expect(result.timeline.length).toBeGreaterThan(0);
  });

  it('같은 시드면 비트 수준 동일 결과', () => {
    const a = runOnce(7, HUMAN_UNTRAINED);
    const b = runOnce(7, HUMAN_UNTRAINED);
    expect(a.finished && b.finished).toBe(true);
    expect(JSON.stringify(a.result)).toBe(JSON.stringify(b.result));
  });

  it('호랑이는 무수련 인간을 압도한다', () => {
    let tigerWins = 0;
    const N = 30;
    for (let i = 0; i < N; i++) {
      const { finished, result } = runOnce(1000 + i, TIGER);
      expect(finished).toBe(true);
      if (result && result.winner === 'B') tigerWins++;
    }
    expect(tigerWins / N).toBeGreaterThan(0.8);
  });
});
