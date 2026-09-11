import { z } from 'zod';
import {
  BodyPartId,
  TechniqueCategory,
  Stance,
  DamageType,
  KnockoutRule,
  FinishType,
  TerrainType,
  LightingType,
  HomeGroundSide,
  FightState,
  Range,
  Vector2,
  ForceVector,
  VelocityVector,
  TrajectoryPoint2D,
  JointAngle,
  JointTransform2D,
  StatScaling,
} from '../domain/types';

// ============================================
// 공통 기본 스키마
// ============================================

const RangeSchema = z.object({
  min: z.number(),
  max: z.number(),
}).refine(r => r.min <= r.max, { message: 'min must be <= max' });

const Vector2Schema = z.object({
  x: z.number(),
  y: z.number(),
});

const ForceVectorSchema = z.object({
  x: z.number(),
  y: z.number(),
  magnitude: z.number().nonnegative(),
});

const VelocityVectorSchema = z.object({
  x: z.number(),
  y: z.number(),
  magnitude: z.number().nonnegative(),
});

const TrajectoryPoint2DSchema = z.object({
  t: z.number().nonnegative(),
  position: Vector2Schema,
  velocity: Vector2Schema,
});

const JointAngleSchema = z.object({
  joint: z.string(),
  angle: z.number(),
  angularVelocity: z.number(),
});

const JointTransform2DSchema = z.object({
  joint: z.string(),
  position: Vector2Schema,
  angle: z.number(),
});

const StatScalingSchema = z.object({
  strength: z.number(),
  speed: z.number(),
  technique: z.number(),
}).passthrough();

export const FightStateSchema = z.enum(['STANDING', 'CLINCH', 'GROUND_TOP', 'GROUND_BOTTOM']);

// ============================================
// 파이터 관련 스키마
// ============================================

export const ParsedBackgroundSchema = z.object({
  primaryArt: z.string().min(1),
  experienceMonths: z.number().int().nonnegative(),
  trainingFrequency: z.number().int().positive().max(14),
  gymEnvironment: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export const UserProfileSchema = z.object({
  height: z.number().min(100).max(250),
  weight: z.number().min(20).max(200),
  skeletalMuscleMass: z.number().min(10).max(100),
  bodyFatMass: z.number().min(2).max(80),
  age: z.number().int().min(10).max(100).optional(),
  sex: z.enum(['male', 'female']).optional(),
  martialArtsHistory: z.string().min(1),
  homeGround: z.enum(['me', 'opponent', 'neutral']),
  deathAllowed: z.boolean(),
  parsedBackground: ParsedBackgroundSchema.optional(),
});

export const BodySegmentSchema = z.object({
  id: z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ]),
  mass: z.number().positive(),
  length: z.number().positive(),
  crossSection: z.number().positive(),
  boneDensity: z.number().positive(),
  muscleThickness: z.number().nonnegative(),
  fatThickness: z.number().nonnegative(),
});

export const TissueDurabilitySchema = z.object({
  tensileStrength: z.number().positive(),
  shearStrength: z.number().positive(),
  compressiveStrength: z.number().positive(),
  fractureEnergy: z.number().positive(),
  thickness: z.number().positive(),
});

export const OrganDurabilitySchema = z.object({
  organ: z.enum(['brain', 'heart', 'liver', 'spleen', 'kidney', 'lung']),
  criticalPressure: z.number().positive(),
  ruptureThreshold: z.number().positive(),
});

export const PartDurabilitySchema = z.object({
  skin: TissueDurabilitySchema,
  muscle: TissueDurabilitySchema,
  bone: TissueDurabilitySchema,
  nerve: TissueDurabilitySchema,
  vessel: TissueDurabilitySchema,
  organ: OrganDurabilitySchema.optional(),
  functionalThresholds: z.object({
    minorInjury: z.number().min(0).max(1),
    moderateInjury: z.number().min(0).max(1),
    severeInjury: z.number().min(0).max(1),
    lossOfFunction: z.number().min(0).max(1),
  }),
});

export const DurabilityProfileSchema = z.record(PartDurabilitySchema);

export const BodySpecSchema = z.object({
  height: z.number().positive(),
  weight: z.number().positive(),
  bmi: z.number().positive(),
  skeletalMuscleMass: z.number().positive(),
  bodyFatMass: z.number().positive(),
  bodyFatPercent: z.number().min(0).max(100),
  leanBodyMass: z.number().positive(),
  segments: z.array(BodySegmentSchema),
  durability: DurabilityProfileSchema,
});

export const CoreStatsSchema = z.object({
  strength: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  endurance: z.number().min(0).max(100),
  agility: z.number().min(0).max(100),
  technique: z.number().min(0).max(100),
  durability: z.number().min(0).max(100),
  intelligence: z.number().min(0).max(100),
  composure: z.number().min(0).max(100),
});

export const MentalitySchema = z.object({
  killIntent: z.number().min(0).max(100),
  fearLevel: z.number().min(0).max(100),
  aggression: z.number().min(0).max(100),
  painTolerance: z.number().min(0).max(100),
  surrenderThreshold: z.number().min(0).max(100),
});

export const InjurySchema = z.object({
  id: z.string(),
  partId: z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ]),
  type: z.enum(['bruise', 'laceration', 'fracture', 'dislocation', 'concussion', 'organ_damage', 'nerve_damage', 'vessel_rupture']),
  severity: z.enum(['minor', 'moderate', 'severe', 'critical']),
  functionalLoss: z.number().min(0).max(1),
  timestamp: z.number().nonnegative(),
  description: z.string(),
});

export const ConditionSchema = z.object({
  fatigue: z.number().min(0).max(100),
  injury: z.array(InjurySchema),
  adrenaline: z.number().min(0).max(100),
});

// ============================================
// 기술 관련 스키마
// ============================================

export const BiomechanicsDataSchema = z.object({
  windupTime: z.number().positive(),
  windupForce: ForceVectorSchema,
  executionTime: z.number().positive(),
  peakForce: ForceVectorSchema,
  peakVelocity: VelocityVectorSchema,
  impulse: z.number().positive(),
  contactArea: z.number().positive(),
  pressure: z.number().positive(),
  trajectory: z.array(TrajectoryPoint2DSchema),
  jointAngles: z.array(JointAngleSchema),
  energyCost: z.number().nonnegative(),
  metabolicCost: z.number().nonnegative(),
  balanceDisruption: z.number().min(0).max(1),
  recoveryTime: z.number().positive(),
});

export const TechniqueRequirementsSchema = z.object({
  minStats: CoreStatsSchema.partial(),
  staminaCost: z.number().nonnegative(),
  requiredDistance: RangeSchema,
  allowedStances: z.array(z.enum(['orthodox', 'southpaw', 'muaythai', 'wrestling', 'bjj', 'open'])),
  counters: z.array(z.string()),
});

export const DamageProfileSchema = z.object({
  baseDamage: z.number().nonnegative(),
  scaling: StatScalingSchema,
  targetParts: z.array(z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ])),
  damageType: z.enum(['blunt', 'sharp', 'piercing', 'crushing']),
});

export const KnockbackProfileSchema = z.object({
  force: ForceVectorSchema,
  torque: z.number(),
  duration: z.number().positive(),
});

export const StunProfileSchema = z.object({
  duration: z.number().nonnegative(),
  intensity: z.number().min(0).max(1),
});

export const BleedProfileSchema = z.object({
  rate: z.number().nonnegative(),
  duration: z.number().nonnegative(),
});

export const FractureProfileSchema = z.object({
  probability: z.number().min(0).max(1),
  bones: z.array(z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ])),
});

export const ConcussionProfileSchema = z.object({
  probability: z.number().min(0).max(1),
  severity: z.number().min(0).max(1),
});

export const PsychProfileSchema = z.object({
  fearInduced: z.number().min(0).max(1),
  intimidation: z.number().min(0).max(1),
});

export const TechniqueEffectsSchema = z.object({
  damage: DamageProfileSchema,
  knockback: KnockbackProfileSchema,
  stun: StunProfileSchema,
  bleed: BleedProfileSchema,
  fracture: FractureProfileSchema,
  concussion: ConcussionProfileSchema,
  psychological: PsychProfileSchema,
});

export const AIWeightSchema = z.object({
  offensive: z.number().min(0).max(1),
  defensive: z.number().min(0).max(1),
  counter: z.number().min(0).max(1),
  setup: z.number().min(0).max(1),
  finisher: z.number().min(0).max(1),
});

export const TechniqueSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  category: z.enum([
    'strike_punch', 'strike_kick', 'strike_elbow', 'strike_knee', 'strike_headbutt',
    'grapple_takedown', 'grapple_throw', 'grapple_clinch',
    'grapple_choke', 'grapple_joint', 'grapple_ground', 'grapple_sweep',
    'defense_block', 'defense_parry', 'defense_dodge', 'defense_slip', 'defense_weave', 'defense_sprawl',
    'special_feint', 'special_combo', 'special_counter',
  ]),
  biomechanics: BiomechanicsDataSchema,
  requirements: TechniqueRequirementsSchema,
  effects: TechniqueEffectsSchema,
  aiWeight: AIWeightSchema,
  source: z.object({
    dataset: z.string(),
    study: z.string().optional(),
    confidence: z.number().min(0).max(1),
    sampleSize: z.number().int().positive().optional(),
  }),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================
// 동물 관련 스키마
// ============================================

export const NaturalWeaponSchema = z.object({
  type: z.enum(['bite', 'claw', 'horn', 'tusk', 'body_slam', 'kick', 'stomp', 'grip', 'strike']),
  name: z.string(),
  peakForce: z.number().positive(),
  peakForceSource: z.enum(['measured', 'estimated', 'inferred']),
  peakForceConfidence: z.number().min(0).max(1),
  contactArea: z.number().positive(),
  damageType: z.enum(['piercing', 'slashing', 'blunt', 'crushing']),
  reach: z.number().nonnegative(),
  usableStates: z.array(FightStateSchema),
});

export const NaturalArmorSchema = z.object({
  type: z.enum(['thick_skin', 'fat_layer', 'bone_plate', 'fur', 'scales', 'thin_skin']),
  location: z.array(z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ])),
  thickness: z.number().positive(),
  tensileStrength: z.number().positive(),
  compressiveStrength: z.number().positive(),
  coverage: z.number().min(0).max(1),
});

export const ReferenceSchema = z.object({
  type: z.enum(['paper', 'database', 'observation', 'expert', 'measured', 'estimated', 'inferred']),
  title: z.string(),
  authors: z.array(z.string()).optional(),
  year: z.number().int().min(1800).max(2100),
  url: z.string().url().optional(),
  doi: z.string().optional(),
  notes: z.string().optional(),
});

export const AnimalTraitsSchema = z.object({
  aggression: z.number().min(0).max(1),
  territoriality: z.number().min(0).max(1),
  flightiness: z.number().min(0).max(1),
  intelligence: z.number().min(0).max(1),
  sociality: z.number().min(0).max(1),
  huntingStyle: z.enum(['ambush', 'chase', 'grapple', 'bite', 'strike', 'pack', 'charge']),
  preferredRange: z.enum(['close', 'mid', 'long']),
  killMethod: z.enum(['suffocation', 'exsanguination', 'crushing', 'neck_break', 'overwhelm', 'piercing']),
  naturalWeapons: z.array(NaturalWeaponSchema),
  armor: z.array(NaturalArmorSchema),
  fearThreshold: z.number().min(0).max(1),
  rageThreshold: z.number().min(0).max(1),
});

export const DetailedAnimalProfileSchema = z.object({
  taxonomy: z.object({
    class: z.string(),
    order: z.string(),
    family: z.string(),
    genus: z.string(),
    species: z.string(),
    subspecies: z.string().optional(),
  }),
  physical: z.object({
    massRange: z.object({ min: z.number().positive(), max: z.number().positive(), avg: z.number().positive() }),
    bodyLength: z.number().positive(),
    shoulderHeight: z.number().positive(),
    sexualDimorphism: z.number().positive(),
  }),
biomechanics: z.object({
    biteForce: z.object({ value: z.number().positive(), unit: z.literal('N'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }),
    strikeForce: z.object({ value: z.number().positive(), unit: z.literal('N'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }).optional(),
    swipeForce: z.object({ value: z.number().positive(), unit: z.literal('N'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }).optional(),
    gripStrength: z.object({ value: z.number().positive(), unit: z.literal('N'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }).optional(),
    sprintSpeed: z.object({ value: z.number().positive(), unit: z.literal('m/s'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }),
    acceleration: z.object({ value: z.number().positive(), unit: z.literal('m/s²'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }),
    jumpHeight: z.object({ value: z.number().positive(), unit: z.literal('m'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }).optional(),
    jumpDistance: z.object({ value: z.number().positive(), unit: z.literal('m'), source: ReferenceSchema, confidence: z.number().min(0).max(1) }).optional(),
  }),
  behavior: AnimalTraitsSchema,
  ecology: z.object({
    habitat: z.array(z.string()),
    diet: z.enum(['carnivore', 'omnivore', 'herbivore']),
    activityPattern: z.enum(['diurnal', 'nocturnal', 'crepuscular', 'cathemeral']),
    socialStructure: z.enum(['solitary', 'pair', 'family', 'pack', 'troop', 'herd', 'pride', 'sounders', 'complex']),
    territorySize: z.number().positive().optional(),
    homeRange: z.number().positive().optional(),
  }),
  lifeHistory: z.object({
    lifespan: z.object({ wild: z.number().positive(), captivity: z.number().positive() }),
    sexualMaturity: z.number().positive(),
    gestationPeriod: z.number().int().positive(),
    litterSize: z.object({ min: z.number().int().nonnegative(), max: z.number().int().positive(), avg: z.number().positive() }),
  }),
  references: z.array(ReferenceSchema),
});

// ============================================
// 전투 컨텍스트 스키마
// ============================================

export const HomeGroundBonusSchema = z.object({
  crowdSupport: z.number().min(0).max(1),
  familiarTerrain: z.number().min(0).max(1),
  psychologicalEdge: z.number().min(0).max(1),
  refereeBias: z.number().min(0).max(1).optional(),
});

export const EnvironmentSchema = z.object({
  terrain: z.enum(['flat', 'uneven', 'slippery', 'sand', 'water_shallow']),
  lighting: z.enum(['bright', 'dim', 'dark']),
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  gravity: z.number().positive().default(9.81),
  homeGround: z.enum(['A', 'B', 'neutral']),
  homeGroundBonus: HomeGroundBonusSchema,
});

export const FightRulesSchema = z.object({
  timeLimit: z.number().nonnegative(),
  roundDuration: z.number().positive(),
  maxRounds: z.number().int().positive(),
  allowedTechniqueCategories: z.array(z.enum([
    'strike_punch', 'strike_kick', 'strike_elbow', 'strike_knee', 'strike_headbutt',
    'grapple_takedown', 'grapple_throw', 'grapple_clinch',
    'grapple_choke', 'grapple_joint', 'grapple_ground', 'grapple_sweep',
    'defense_block', 'defense_parry', 'defense_dodge', 'defense_slip', 'defense_weave', 'defense_sprawl',
    'special_feint', 'special_combo', 'special_counter',
  ])),
  forbiddenTargets: z.array(z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ])),
  knockoutRule: z.enum(['instant', 'count10', 'tko']),
  surrenderAllowed: z.boolean(),
  deathAllowed: z.boolean(),
});

export const FightContextSchema = z.object({
  environment: EnvironmentSchema,
  rules: FightRulesSchema,
  seed: z.number().int(),
});

// ============================================
// 시뮬레이션 결과 스키마
// ============================================

export const CombatEventSchema = z.object({
  id: z.string(),
  timestamp: z.number().nonnegative(),
  type: z.enum(['strike', 'block', 'dodge', 'takedown', 'submission', 'knockdown', 'ko', 'submission_finish', 'surrender', 'death', 'round_start', 'round_end', 'clinch', 'separation', 'feint', 'counter']),
  actor: z.enum(['A', 'B']),
  target: z.enum(['A', 'B']),
  techniqueId: z.string().optional(),
  techniqueName: z.string().optional(),
  targetPart: z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ]).optional(),
  damage: z.number().optional(),
  result: z.enum(['hit', 'blocked', 'dodged', 'parried', 'missed', 'landed', 'escaped', 'reversed']),
  description: z.string(),
  force: Vector2Schema.optional(),
  knockback: Vector2Schema.optional(),
  stunDuration: z.number().optional(),
  injuries: z.array(InjurySchema).optional(),
});

export const RoundResultSchema = z.object({
  round: z.number().int().positive(),
  duration: z.number().positive(),
  events: z.array(CombatEventSchema),
  scoreA: z.number(),
  scoreB: z.number(),
  knockdownsA: z.number().int().nonnegative(),
  knockdownsB: z.number().int().nonnegative(),
  dominantFighter: z.enum(['A', 'B', 'even']),
});

export const PartDamageSummarySchema = z.object({
  partId: z.enum([
    'head', 'neck',
    'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
    'arm_upper_l', 'arm_lower_l', 'hand_l',
    'arm_upper_r', 'arm_lower_r', 'hand_r',
    'leg_upper_l', 'leg_lower_l', 'foot_l',
    'leg_upper_r', 'leg_lower_r', 'foot_r',
    'groin',
  ]),
  totalDamage: z.number().nonnegative(),
  injurySeverity: z.enum(['none', 'minor', 'moderate', 'severe', 'critical', 'loss']),
  injuries: z.array(InjurySchema),
  functionalLoss: z.number().min(0).max(1),
});

export const FightResultSchema = z.object({
  simulationId: z.string(),
  winner: z.enum(['A', 'B', 'draw']),
  winProbability: z.object({ A: z.number().min(0).max(1), B: z.number().min(0).max(1), draw: z.number().min(0).max(1) }),
  duration: z.number().positive(),
  rounds: z.array(RoundResultSchema),
  finishType: z.enum(['ko', 'tko', 'submission', 'decision', 'surrender', 'death', 'timeout']),
  finishTime: z.number().positive(),
  summary: z.object({
    totalStrikes: z.object({ A: z.number().int().nonnegative(), B: z.number().int().nonnegative() }),
    significantStrikes: z.object({ A: z.number().int().nonnegative(), B: z.number().int().nonnegative() }),
    takedowns: z.object({ A: z.number().int().nonnegative(), B: z.number().int().nonnegative() }),
    submissions: z.object({ A: z.number().int().nonnegative(), B: z.number().int().nonnegative() }),
    knockdowns: z.object({ A: z.number().int().nonnegative(), B: z.number().int().nonnegative() }),
    clinchTime: z.object({ A: z.number().nonnegative(), B: z.number().nonnegative() }),
    groundTime: z.object({ A: z.number().nonnegative(), B: z.number().nonnegative() }),
  }),
  damageByPart: z.object({
    A: z.record(PartDamageSummarySchema),
    B: z.record(PartDamageSummarySchema),
  }),
  timeline: z.array(CombatEventSchema),
});

export const ReplaySnapshotSchema = z.object({
  timestamp: z.number().nonnegative(),
  fighters: z.record(z.object({
    position: Vector2Schema,
    angle: z.number(),
    pose: z.array(JointTransform2DSchema),
    velocity: Vector2Schema,
    angularVelocity: z.number(),
    health: z.number().min(0).max(100),
    stamina: z.number().min(0).max(100),
    activeInjuries: z.array(InjurySchema),
    currentAction: z.string().nullable(),
  })),
  events: z.array(CombatEventSchema),
});

export const WinProbabilitySchema = z.object({
  winRate: z.object({ A: z.number().min(0).max(1), B: z.number().min(0).max(1), draw: z.number().min(0).max(1) }),
  finishTypeDistribution: z.record(z.number().min(0).max(1)),
  avgDuration: z.number().positive(),
  durationStdDev: z.number().nonnegative(),
  confidenceInterval: z.object({ lower: z.number(), upper: z.number() }),
});

// ============================================
// 설정 스키마
// ============================================

export const UserSettingsSchema = z.object({
  statsScale: z.enum(['relative', 'absolute']).default('relative'),
  simulationCount: z.number().int().min(100).max(2000).default(200),
  timeLimit: z.enum(['1min', '5min', '10min', 'unlimited']).default('5min'),
  version: z.number().int().positive().default(1),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type ParsedBackground = z.infer<typeof ParsedBackgroundSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type BodySpec = z.infer<typeof BodySpecSchema>;
export type CoreStats = z.infer<typeof CoreStatsSchema>;
export type Mentality = z.infer<typeof MentalitySchema>;
export type Condition = z.infer<typeof ConditionSchema>;
export type Technique = z.infer<typeof TechniqueSchema>;
export type AnimalTraits = z.infer<typeof AnimalTraitsSchema>;
export type DetailedAnimalProfile = z.infer<typeof DetailedAnimalProfileSchema>;
export type FightContext = z.infer<typeof FightContextSchema>;
export type FightResult = z.infer<typeof FightResultSchema>;
export type ReplaySnapshot = z.infer<typeof ReplaySnapshotSchema>;
export type WinProbability = z.infer<typeof WinProbabilitySchema>;

