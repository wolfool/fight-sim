// ============================================
// 엔진 골격 (Phase 2에서 구현)
// ============================================

import { Fighter, FightContext, FightResult, ReplaySnapshot, CombatEvent, WinProbability } from '../domain';

// ============================================
// 시뮬레이션 엔진 인터페이스
// ============================================

export interface SimulationEngine {
  initialize(fighterA: Fighter, fighterB: Fighter, context: FightContext): void;
  step(): boolean;  // false = 종료
  getCurrentState(): SimulationState;
  getResult(): FightResult;
  getReplaySnapshots(): ReplaySnapshot[];
  getCombatLog(): CombatEvent[];
}

export interface SimulationState {
  time: number;
  round: number;
  roundTime: number;
  fighterA: FighterStateSnapshot;
  fighterB: FighterStateSnapshot;
  events: CombatEvent[];
  isFinished: boolean;
  finishType?: string;
}

export interface FighterStateSnapshot {
  id: string;
  health: number;
  stamina: number;
  position: { x: number; y: number };
  posture: string;
  currentAction: string | null;
  activeInjuries: any[];
}

// ============================================
// 전투 해결자 인터페이스
// ============================================

export interface CombatResolver {
  checkCollision(attacker: any, defender: any, techniqueId: string): CollisionResult;
  calculateDamage(collision: CollisionResult, techniqueId: string, defender: any): DamageResult;
  applyDamage(defender: any, damage: DamageResult): any[];
  checkKnockout(injuries: any[], fighter: any): KOResult;
  checkDeath(injuries: any[], fighter: any, deathAllowed: boolean): DeathResult;
}

export interface CollisionResult {
  hit: boolean;
  contactPoint: { x: number; y: number };
  force: { x: number; y: number };
  pressure: number;
  energy: number;
  defenderPart: string;
}

export interface DamageResult {
  totalDamage: number;
  partDamages: Map<string, any>;
  injuries: any[];
  knockback: any;
  stun: any;
  ko: KOResult;
  death: DeathResult;
}

export interface KOResult {
  isKO: boolean;
  type?: 'instant' | 'count10' | 'tko';
  unconsciousTime?: number;
}

export interface DeathResult {
  isDead: boolean;
  cause?: string;
}

// ============================================
// 의사결정 엔진 인터페이스
// ============================================

export interface DecisionEngine {
  decide(fighter: any, opponent: any, context: DecisionContext): DecisionOutput;
}

export interface DecisionContext {
  distance: number;
  timeRemaining: number;
  staminaRatio: number;
  healthRatio: number;
  opponentHealthRatio: number;
  opponentPosture: string;
  recentEvents: any[];
}

export type DecisionOutput =
  | { type: 'attack'; techniqueId: string; targetPart: string; commitment: number }
  | { type: 'defend'; guardType: string; targetPart: string }
  | { type: 'move'; direction: { x: number; y: number }; distance: number }
  | { type: 'feint'; techniqueId: string; realTechniqueId?: string }
  | { type: 'wait'; duration: number }
  | { type: 'surrender' };

// ============================================
// 생리학/심리학 시스템 인터페이스
// ============================================

export interface PhysiologySystem {
  updateFatigue(fighter: any, action: any, dt: number): number;
  updateHormones(fighter: any, events: any[], dt: number): void;
  recoverBetweenRounds(fighter: any): void;
}

// PsychologySystem은 physiology에서 구현됨

// ============================================
// 승률 계산기
// ============================================

export interface WinProbabilityCalculator {
  calculate(fighterA: Fighter, fighterB: Fighter, context: FightContext, n: number): Promise<WinProbability>;
}

// ============================================
// 팩토리 함수들 (구현 시 교체)
// ============================================

export function createSimulationEngine(): SimulationEngine {
  throw new Error('Not implemented - Phase 2');
}

export function createCombatResolver(): CombatResolver {
  throw new Error('Not implemented - Phase 2');
}

export function createDecisionEngine(): DecisionEngine {
  throw new Error('Not implemented - Phase 2');
}

export function createPhysiologySystem(): PhysiologySystem {
  throw new Error('Not implemented - Phase 2');
}

export function createWinProbabilityCalculator(): WinProbabilityCalculator {
  throw new Error('Not implemented - Phase 2');
}

