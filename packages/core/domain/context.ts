import { HomeGroundSide, TerrainType, LightingType, KnockoutRule, FinishType, Vector2 } from './types';

export interface HomeGroundBonus {
  crowdSupport: number;
  familiarTerrain: number;
  psychologicalEdge: number;
  refereeBias?: number;
}

export interface Environment {
  terrain: TerrainType;
  lighting: LightingType;
  temperature: number;
  humidity: number;
  gravity: number;
  homeGround: HomeGroundSide;
  homeGroundBonus: HomeGroundBonus;
}

export interface FightRules {
  timeLimit: number;
  roundDuration: number;
  maxRounds: number;
  allowedTechniqueCategories: string[];
  forbiddenTargets: string[];
  knockoutRule: KnockoutRule;
  surrenderAllowed: boolean;
  deathAllowed: boolean;
}

export interface FightContext {
  environment: Environment;
  rules: FightRules;
  seed: number;
}

export interface FighterState {
  id: string;
  name: string;
  position: Vector2;
  velocity: Vector2;
  angle: number;
  angularVelocity: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  posture: 'standing' | 'crouching' | 'grounded' | 'clinching' | 'stunned' | 'downed';
  stance: string;
  guard: 'high' | 'mid' | 'low' | 'none';
  activeTechnique: string | null;
  techniqueProgress: number;
  commitment: number;
  injuries: any[];
  fatigue: number;
  adrenaline: number;
  fear: number;
  killIntent: number;
}

export interface CombatEvent {
  id: string;
  timestamp: number;
  type: 'strike' | 'block' | 'dodge' | 'takedown' | 'submission' | 'knockdown' | 'ko' | 'submission_finish' | 'surrender' | 'death' | 'round_start' | 'round_end' | 'clinch' | 'separation' | 'feint' | 'counter';
  actor: 'A' | 'B';
  target: 'A' | 'B';
  techniqueId?: string;
  techniqueName?: string;
  targetPart?: string;
  damage?: number;
  result: 'hit' | 'blocked' | 'dodged' | 'parried' | 'missed' | 'landed' | 'escaped' | 'reversed';
  description: string;
  force?: Vector2;
  knockback?: Vector2;
  stunDuration?: number;
  injuries?: any[];
}

export interface RoundResult {
  round: number;
  duration: number;
  events: CombatEvent[];
  scoreA: number;
  scoreB: number;
  knockdownsA: number;
  knockdownsB: number;
  dominantFighter: 'A' | 'B' | 'even';
}

export interface PartDamageSummary {
  partId: string;
  totalDamage: number;
  injurySeverity: 'none' | 'minor' | 'moderate' | 'severe' | 'critical' | 'loss';
  injuries: any[];
  functionalLoss: number;
}

export interface FightResult {
  simulationId: string;
  winner: 'A' | 'B' | 'draw';
  winProbability: { A: number; B: number; draw: number };
  duration: number;
  rounds: RoundResult[];
  finishType: FinishType;
  finishTime: number;
  summary: {
    totalStrikes: { A: number; B: number };
    significantStrikes: { A: number; B: number };
    takedowns: { A: number; B: number };
    submissions: { A: number; B: number };
    knockdowns: { A: number; B: number };
    clinchTime: { A: number; B: number };
    groundTime: { A: number; B: number };
  };
  damageByPart: {
    A: Record<string, PartDamageSummary>;
    B: Record<string, PartDamageSummary>;
  };
  timeline: CombatEvent[];
}

export interface ReplaySnapshot {
  timestamp: number;
  fighters: {
    [fighterId: string]: {
      position: Vector2;
      angle: number;
      pose: JointTransform2D[];
      velocity: Vector2;
      angularVelocity: number;
      health: number;
      stamina: number;
      activeInjuries: any[];
      currentAction: string | null;
    };
  };
  events: CombatEvent[];
}

export interface WinProbability {
  winRate: { A: number; B: number; draw: number };
  finishTypeDistribution: Record<string, number>;
  avgDuration: number;
  durationStdDev: number;
  confidenceInterval: { lower: number; upper: number };
}