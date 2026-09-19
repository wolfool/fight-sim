import { CoreStats, Mentality, DurabilityProfile } from '../domain/fighter';
import { AnimalTraits, NaturalArmor } from '../domain/types';
import { RuntimeTechnique, Posture } from './default-techniques';

export interface ActiveAction {
  technique: RuntimeTechnique;
  phase: 'windup' | 'execution' | 'recovery';
  timer: number;
  targetId: string;
}

export interface RuntimeFighterState {
  id: string;
  name: string;
  side: 'A' | 'B';
  stats: CoreStats;
  mentality: Mentality;
  traits?: AnimalTraits;
  durability: DurabilityProfile;
  techniques: RuntimeTechnique[];
  armor: NaturalArmor[];
  mass: number;
  headMass: number;
  bloodVolumeML: number;
  posture: Posture;
  x: number;
  facing: 1 | -1;
  health: number;
  stamina: number;
  fatigue: number;
  adrenaline: number;
  fear: number;
  rage: number;
  pain: number;
  stunTimer: number;
  downTimer: number;
  knockdowns: number;
  concussions: number;
  bloodLoss: number;
  bleedRate: number;
  chokeTimer: number;
  applyingChoke: boolean;
  action: ActiveAction | null;
  movementTimer: number;
  movementDir: number;
  moveSpeed: number;
  guard: 'high' | 'low' | 'none';
  guardTimer: number;
  decisionCooldown: number;
  deathAllowed: boolean;
  isHome: boolean;
  score: number;
  strikes: number;
  significantStrikes: number;
  damageByPart: Record<string, number>;
  injuries: import('../domain/fighter').Injury[];
}

export function createRuntimeState(
  base: {
    id: string;
    name: string;
    side: 'A' | 'B';
    stats: CoreStats;
    mentality: Mentality;
    durability: DurabilityProfile;
    techniques: RuntimeTechnique[];
    armor: NaturalArmor[];
    mass: number;
    headMass: number;
    traits?: AnimalTraits;
    deathAllowed: boolean;
    isHome: boolean;
    moveSpeed?: number;
  }
): RuntimeFighterState {
  return {
    id: base.id,
    name: base.name,
    side: base.side,
    stats: base.stats,
    mentality: base.mentality,
    traits: base.traits,
    durability: base.durability,
    techniques: base.techniques,
    armor: base.armor,
    mass: base.mass,
    headMass: base.headMass,
    bloodVolumeML: base.mass * 70,
    posture: 'standing',
    x: 0,
    facing: 1,
    health: 100,
    stamina: 100,
    fatigue: 0,
    adrenaline: 50,
    fear: Math.min(100, Math.max(0, base.mentality.fearLevel)),
    rage: 0,
    pain: 0,
    stunTimer: 0,
    downTimer: 0,
    knockdowns: 0,
    concussions: 0,
    bloodLoss: 0,
    bleedRate: 0,
    chokeTimer: 0,
    applyingChoke: false,
    action: null,
    movementTimer: 0,
    movementDir: 0,
    moveSpeed: base.moveSpeed ?? 2.5 + base.stats.speed / 40,
    guard: 'none',
    guardTimer: 0,
    decisionCooldown: 0,
    deathAllowed: base.deathAllowed,
    isHome: base.isHome,
    score: 0,
    strikes: 0,
    significantStrikes: 0,
    damageByPart: {},
    injuries: [],
  };
}
