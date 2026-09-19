import { Fighter } from '../domain/fighter';
import { FightContext, FightResult, WinProbability } from '../domain/context';
import { DefaultSimulationEngine } from './SimulationEngine';
import type { FightFrame } from './SimulationEngine';

export interface SimulationReport {
  probability: WinProbability;
  sampleResult: FightResult;
  runs: number;
  frames?: FightFrame[];
}

const Z = 1.96;

function wilsonCI(p: number, n: number): { lower: number; upper: number } {
  if (n === 0) return { lower: 0, upper: 1 };
  const z2 = Z * Z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const spread = (Z / denom) * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n));
  return { lower: Math.max(0, center - spread), upper: Math.min(1, center + spread) };
}

const MAX_STEPS_MULTIPLIER = 4;

export async function runMonteCarlo(
  fighterA: Fighter,
  fighterB: Fighter,
  context: FightContext,
  n: number,
  onProgress?: (done: number, total: number) => void
): Promise<SimulationReport> {
  const wins = { A: 0, B: 0, draw: 0 };
  const finishDist: Record<string, number> = {};
  let totalDuration = 0;
  let totalDurationSq = 0;
  let sampleResult: FightResult | null = null;
  let sampleFrames: FightFrame[] = [];
  const nowFn = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now();
  let lastYield = nowFn();
  const maxSteps = Math.ceil((context.rules.roundDuration * context.rules.maxRounds) / (1 / 60) * MAX_STEPS_MULTIPLIER) + 600;

  for (let i = 0; i < n; i++) {
    const ctx: FightContext = { ...context, seed: context.seed * 1000 + i };
    const engine = new DefaultSimulationEngine(ctx, i === 0);
    engine.initialize(fighterA, fighterB);
    let steps = 0;
    while (!engine.isFinished() && steps < maxSteps) {
      engine.step();
      steps++;
    }
    if (!engine.isFinished()) {
      wins[(i % 2) === 0 ? 'A' : 'B']++;
      continue;
    }
    const result = engine.getResult();
    if (!sampleResult) sampleResult = result;
    if (i === 0 && engine.isFinished()) sampleFrames = engine.getFrames();
    wins[result.winner]++;
    finishDist[result.finishType] = (finishDist[result.finishType] ?? 0) + 1;
    totalDuration += result.duration;
    totalDurationSq += result.duration * result.duration;

    const nowMs = nowFn();
    if (nowMs - lastYield > 30 || i === n - 1) {
      lastYield = nowMs;
      onProgress?.(i + 1, n);
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  }
  onProgress?.(n, n);

  const completed = wins.A + wins.B + wins.draw;
  const avgDuration = completed > 0 ? totalDuration / completed : 0;
  const durationStdDev =
    completed > 1
      ? Math.sqrt(Math.max(0, totalDurationSq / completed - avgDuration * avgDuration))
      : 0;

  const bestRate = Math.max(wins.A, wins.B) / n;
  const ci = wilsonCI(bestRate, n);

  const probability: WinProbability = {
    winRate: { A: wins.A / n, B: wins.B / n, draw: wins.draw / n },
    finishTypeDistribution: finishDist,
    avgDuration: Number(avgDuration.toFixed(1)),
    durationStdDev: Number(durationStdDev.toFixed(1)),
    confidenceInterval: {
      lower: Number(ci.lower.toFixed(3)),
      upper: Number(ci.upper.toFixed(3)),
    },
  };

  if (!sampleResult) {
    throw new Error('모든 시뮬레이션이 제한 시간 내 종료하지 못했습니다');
  }

  return { probability, sampleResult, runs: n, frames: sampleFrames };
}
