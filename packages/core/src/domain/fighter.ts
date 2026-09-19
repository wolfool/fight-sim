import {
  BodyPartId, FighterType, TechniqueCategory, Stance, DamageType,
  KnockoutRule, FinishType, TerrainType, LightingType, HomeGroundSide,
  Range, Vector2, ForceVector, VelocityVector, TrajectoryPoint2D,
  JointAngle, JointTransform2D, StatScaling, NaturalArmor, AnimalTraits
} from './types';

export interface UserProfile {
  height: number;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  age?: number;
  sex?: 'male' | 'female';
  martialArtsHistory: string;
  homeGround: 'me' | 'opponent' | 'neutral';
  deathAllowed: boolean;
  parsedBackground?: ParsedBackground;
}

export interface ParsedBackground {
  primaryArt: string;
  experienceMonths: number;
  trainingFrequency: number;
  gymEnvironment?: string;
  confidence: number;
  secondaryArt?: string;
  secondaryExperienceMonths?: number;
}

export interface BodySegment {
  id: BodyPartId;
  mass: number;
  length: number;
  crossSection: number;
  boneDensity: number;
  muscleThickness: number;
  fatThickness: number;
}

export interface TissueDurability {
  tensileStrength: number;
  shearStrength: number;
  compressiveStrength: number;
  fractureEnergy: number;
  thickness: number;
}

export interface OrganDurability {
  organ: 'brain' | 'heart' | 'liver' | 'spleen' | 'kidney' | 'lung';
  criticalPressure: number;
  ruptureThreshold: number;
}

export interface PartDurability {
  skin: TissueDurability;
  muscle: TissueDurability;
  bone: TissueDurability;
  nerve: TissueDurability;
  vessel: TissueDurability;
  organ?: OrganDurability;
  functionalThresholds: {
    minorInjury: number;
    moderateInjury: number;
    severeInjury: number;
    lossOfFunction: number;
  };
}

export interface DurabilityProfile {
  [partId: string]: PartDurability;
}

export interface BodySpec {
  height: number;
  weight: number;
  bmi: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  bodyFatPercent: number;
  leanBodyMass: number;
  segments: BodySegment[];
  durability: DurabilityProfile;
}

export interface CoreStats {
  strength: number;
  speed: number;
  endurance: number;
  agility: number;
  technique: number;
  durability: number;
  intelligence: number;
  composure: number;
}

export interface Mentality {
  killIntent: number;
  fearLevel: number;
  aggression: number;
  painTolerance: number;
  surrenderThreshold: number;
}

export interface Injury {
  id: string;
  partId: BodyPartId;
  type: 'bruise' | 'laceration' | 'fracture' | 'dislocation' | 'concussion' | 'organ_damage' | 'nerve_damage' | 'vessel_rupture';
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  functionalLoss: number;
  timestamp: number;
  description: string;
}

export interface Condition {
  fatigue: number;
  injury: Injury[];
  adrenaline: number;
}

export interface Fighter {
  id: string;
  name: string;
  type: FighterType;
  profile: UserProfile;
  body: BodySpec;
  stats: CoreStats;
  techniques: Technique[];
  mentality: Mentality;
  condition: Condition;
  armor?: NaturalArmor[];
  traits?: AnimalTraits;
  moveSpeed?: number;
}

export interface BiomechanicsData {
  windupTime: number;
  windupForce: ForceVector;
  executionTime: number;
  peakForce: ForceVector;
  peakVelocity: VelocityVector;
  impulse: number;
  contactArea: number;
  pressure: number;
  trajectory: TrajectoryPoint2D[];
  jointAngles: JointAngle[];
  energyCost: number;
  metabolicCost: number;
  balanceDisruption: number;
  recoveryTime: number;
}

export interface TechniqueRequirements {
  minStats: Partial<CoreStats>;
  staminaCost: number;
  requiredDistance: Range;
  allowedStances: Stance[];
  counters: string[];
}

export interface DamageProfile {
  baseDamage: number;
  scaling: StatScaling;
  targetParts: BodyPartId[];
  damageType: DamageType;
}

export interface KnockbackProfile {
  force: ForceVector;
  torque: number;
  duration: number;
}

export interface StunProfile {
  duration: number;
  intensity: number;
}

export interface BleedProfile {
  rate: number;
  duration: number;
}

export interface FractureProfile {
  probability: number;
  bones: BodyPartId[];
}

export interface ConcussionProfile {
  probability: number;
  severity: number;
}

export interface PsychProfile {
  fearInduced: number;
  intimidation: number;
}

export interface TechniqueEffects {
  damage: DamageProfile;
  knockback: KnockbackProfile;
  stun: StunProfile;
  bleed: BleedProfile;
  fracture: FractureProfile;
  concussion: ConcussionProfile;
  psychological: PsychProfile;
}

export interface AIWeight {
  offensive: number;
  defensive: number;
  counter: number;
  setup: number;
  finisher: number;
}

export interface Technique {
  id: string;
  name: string;
  category: TechniqueCategory;
  biomechanics: BiomechanicsData;
  requirements: TechniqueRequirements;
  effects: TechniqueEffects;
  aiWeight: AIWeight;
}

