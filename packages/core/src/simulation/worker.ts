// ============================================
// Monte Carlo Worker for parallel simulation
// ============================================

import { Fighter, FightContext, FightResult, WinProbability } from '../domain';
import { createSimulationEngine } from '../engine';

// Worker message types
export type WorkerMessage =
  | { type: 'RUN_SIMULATION'; payload: { fighterA: Fighter; fighterB: Fighter; context: FightContext; seed: number } }
  | { type: 'RUN_BATCH'; payload: { fighterA: Fighter; fighterB: Fighter; context: FightContext; count: number; baseSeed: number } }
  | { type: 'TERMINATE' };

export type WorkerResponse =
  | { type: 'SIMULATION_COMPLETE'; payload: FightResult }
  | { type: 'BATCH_COMPLETE'; payload: WinProbability }
  | { type: 'ERROR'; payload: string }
  | { type: 'READY' };

// Simplified simulation for worker (no replay, minimal logging)
async function runSingleSimulation(
  fighterA: Fighter,
  fighterB: Fighter,
  context: FightContext,
  seed: number
): Promise<FightResult> {
  const engine = createSimulationEngine();
  engine.initialize(fighterA, fighterB, { ...context, seed });
  
  while (engine.step()) {
    // Continue until finished
  }
  
  return engine.getResult();
}

async function runBatchSimulation(
  fighterA: Fighter,
  fighterB: Fighter,
  context: FightContext,
  count: number,
  baseSeed: number
): Promise<WinProbability> {
  const results: FightResult[] = [];
  
  for (let i = 0; i < count; i++) {
    const result = await runSingleSimulation(fighterA, fighterB, context, baseSeed + i);
    results.push(result);
    
    // Yield to main thread periodically
    if (i % 10 === 0) {
      await new Promise(r => setTimeout(r, 0));
    }
  }
  
  // Aggregate results
  const wins = { A: 0, B: 0, draw: 0 };
  const finishTypes: Record<string, number> = {};
  const durations: number[] = [];
  
  for (const r of results) {
    wins[r.winner]++;
    finishTypes[r.finishType] = (finishTypes[r.finishType] || 0) + 1;
    durations.push(r.duration);
  }
  
  const n = results.length;
  const mean = durations.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(durations.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  
  // Clopper-Pearson 95% CI for binomial proportion
  const p = wins.A / n;
  const z = 1.96;
  const margin = z * Math.sqrt(p * (1 - p) / n);
  
  return {
    winRate: { A: wins.A / n, B: wins.B / n, draw: wins.draw / n },
    finishTypeDistribution: finishTypes,
    avgDuration: mean,
    durationStdDev: stdDev,
    confidenceInterval: { lower: Math.max(0, p - margin), upper: Math.min(1, p + margin) },
  };
}

// Worker message handler
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;
  
  try {
    switch (msg.type) {
      case 'RUN_SIMULATION': {
        const result = await runSingleSimulation(
          msg.payload.fighterA,
          msg.payload.fighterB,
          msg.payload.context,
          msg.payload.seed
        );
        self.postMessage({ type: 'SIMULATION_COMPLETE', payload: result } as WorkerResponse);
        break;
      }
      
      case 'RUN_BATCH': {
        const result = await runBatchSimulation(
          msg.payload.fighterA,
          msg.payload.fighterB,
          msg.payload.context,
          msg.payload.count,
          msg.payload.baseSeed
        );
        self.postMessage({ type: 'BATCH_COMPLETE', payload: result } as WorkerResponse);
        break;
      }
      
      case 'TERMINATE':
        self.close();
        break;
    }
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      payload: error instanceof Error ? error.message : 'Unknown error' 
    } as WorkerResponse);
  }
};

// Signal ready
self.postMessage({ type: 'READY' } as WorkerResponse);

export {}; // Make this a module

