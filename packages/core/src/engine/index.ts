export * from './rng';
export * from './default-techniques';
export * from './CombatResolver';
export * from './DecisionEngine';
export * from './runtime-types';
export * from './SimulationEngine';
export * from './fighter-factory';
export * from './WinProbabilityCalculator';

import { FightContext } from '../domain/context';
export type { CombatEvent, FightResult, WinProbability, RoundResult } from '../domain/context';
import { DefaultSimulationEngine } from './SimulationEngine';

export function createSimulationEngine(context?: FightContext): DefaultSimulationEngine {
  return new DefaultSimulationEngine(
    context ?? {
      environment: { terrain: 'flat', lighting: 'bright', temperature: 20, humidity: 50, gravity: 9.81, homeGround: 'neutral', homeGroundBonus: { crowdSupport: 50, familiarTerrain: 50, psychologicalEdge: 10 } },
      rules: { timeLimit: 300, roundDuration: 300, maxRounds: 1, allowedTechniqueCategories: [], forbiddenTargets: [], knockoutRule: 'tko', surrenderAllowed: true, deathAllowed: false },
      seed: 1,
    }
  );
}
