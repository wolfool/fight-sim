"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingsSchema = exports.WinProbabilitySchema = exports.ReplaySnapshotSchema = exports.FightResultSchema = exports.PartDamageSummarySchema = exports.RoundResultSchema = exports.CombatEventSchema = exports.FightContextSchema = exports.FightRulesSchema = exports.EnvironmentSchema = exports.HomeGroundBonusSchema = exports.DetailedAnimalProfileSchema = exports.AnimalTraitsSchema = exports.ReferenceSchema = exports.NaturalArmorSchema = exports.NaturalWeaponSchema = exports.TechniqueSchema = exports.AIWeightSchema = exports.TechniqueEffectsSchema = exports.PsychProfileSchema = exports.ConcussionProfileSchema = exports.FractureProfileSchema = exports.BleedProfileSchema = exports.StunProfileSchema = exports.KnockbackProfileSchema = exports.DamageProfileSchema = exports.TechniqueRequirementsSchema = exports.BiomechanicsDataSchema = exports.ConditionSchema = exports.InjurySchema = exports.MentalitySchema = exports.CoreStatsSchema = exports.BodySpecSchema = exports.DurabilityProfileSchema = exports.PartDurabilitySchema = exports.OrganDurabilitySchema = exports.TissueDurabilitySchema = exports.BodySegmentSchema = exports.UserProfileSchema = exports.ParsedBackgroundSchema = exports.FightStateSchema = void 0;
var zod_1 = require("zod");
// ============================================
// 공통 기본 스키마
// ============================================
var RangeSchema = zod_1.z.object({
    min: zod_1.z.number(),
    max: zod_1.z.number(),
}).refine(function (r) { return r.min <= r.max; }, { message: 'min must be <= max' });
var Vector2Schema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
});
var ForceVectorSchema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
    magnitude: zod_1.z.number().nonnegative(),
});
var VelocityVectorSchema = zod_1.z.object({
    x: zod_1.z.number(),
    y: zod_1.z.number(),
    magnitude: zod_1.z.number().nonnegative(),
});
var TrajectoryPoint2DSchema = zod_1.z.object({
    t: zod_1.z.number().nonnegative(),
    position: Vector2Schema,
    velocity: Vector2Schema,
});
var JointAngleSchema = zod_1.z.object({
    joint: zod_1.z.string(),
    angle: zod_1.z.number(),
    angularVelocity: zod_1.z.number(),
});
var JointTransform2DSchema = zod_1.z.object({
    joint: zod_1.z.string(),
    position: Vector2Schema,
    angle: zod_1.z.number(),
});
var StatScalingSchema = zod_1.z.object({
    strength: zod_1.z.number(),
    speed: zod_1.z.number(),
    technique: zod_1.z.number(),
}).passthrough();
exports.FightStateSchema = zod_1.z.enum(['STANDING', 'CLINCH', 'GROUND_TOP', 'GROUND_BOTTOM']);
// ============================================
// 파이터 관련 스키마
// ============================================
exports.ParsedBackgroundSchema = zod_1.z.object({
    primaryArt: zod_1.z.string().min(1),
    experienceMonths: zod_1.z.number().int().nonnegative(),
    trainingFrequency: zod_1.z.number().int().positive().max(14),
    gymEnvironment: zod_1.z.string().optional(),
    confidence: zod_1.z.number().min(0).max(1),
});
exports.UserProfileSchema = zod_1.z.object({
    height: zod_1.z.number().min(100).max(250),
    weight: zod_1.z.number().min(20).max(200),
    skeletalMuscleMass: zod_1.z.number().min(10).max(100),
    bodyFatMass: zod_1.z.number().min(2).max(80),
    age: zod_1.z.number().int().min(10).max(100).optional(),
    sex: zod_1.z.enum(['male', 'female']).optional(),
    martialArtsHistory: zod_1.z.string().min(1),
    homeGround: zod_1.z.enum(['me', 'opponent', 'neutral']),
    deathAllowed: zod_1.z.boolean(),
    parsedBackground: exports.ParsedBackgroundSchema.optional(),
});
exports.BodySegmentSchema = zod_1.z.object({
    id: zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ]),
    mass: zod_1.z.number().positive(),
    length: zod_1.z.number().positive(),
    crossSection: zod_1.z.number().positive(),
    boneDensity: zod_1.z.number().positive(),
    muscleThickness: zod_1.z.number().nonnegative(),
    fatThickness: zod_1.z.number().nonnegative(),
});
exports.TissueDurabilitySchema = zod_1.z.object({
    tensileStrength: zod_1.z.number().positive(),
    shearStrength: zod_1.z.number().positive(),
    compressiveStrength: zod_1.z.number().positive(),
    fractureEnergy: zod_1.z.number().positive(),
    thickness: zod_1.z.number().positive(),
});
exports.OrganDurabilitySchema = zod_1.z.object({
    organ: zod_1.z.enum(['brain', 'heart', 'liver', 'spleen', 'kidney', 'lung']),
    criticalPressure: zod_1.z.number().positive(),
    ruptureThreshold: zod_1.z.number().positive(),
});
exports.PartDurabilitySchema = zod_1.z.object({
    skin: exports.TissueDurabilitySchema,
    muscle: exports.TissueDurabilitySchema,
    bone: exports.TissueDurabilitySchema,
    nerve: exports.TissueDurabilitySchema,
    vessel: exports.TissueDurabilitySchema,
    organ: exports.OrganDurabilitySchema.optional(),
    functionalThresholds: zod_1.z.object({
        minorInjury: zod_1.z.number().min(0).max(1),
        moderateInjury: zod_1.z.number().min(0).max(1),
        severeInjury: zod_1.z.number().min(0).max(1),
        lossOfFunction: zod_1.z.number().min(0).max(1),
    }),
});
exports.DurabilityProfileSchema = zod_1.z.record(exports.PartDurabilitySchema);
exports.BodySpecSchema = zod_1.z.object({
    height: zod_1.z.number().positive(),
    weight: zod_1.z.number().positive(),
    bmi: zod_1.z.number().positive(),
    skeletalMuscleMass: zod_1.z.number().positive(),
    bodyFatMass: zod_1.z.number().positive(),
    bodyFatPercent: zod_1.z.number().min(0).max(100),
    leanBodyMass: zod_1.z.number().positive(),
    segments: zod_1.z.array(exports.BodySegmentSchema),
    durability: exports.DurabilityProfileSchema,
});
exports.CoreStatsSchema = zod_1.z.object({
    strength: zod_1.z.number().min(0).max(100),
    speed: zod_1.z.number().min(0).max(100),
    endurance: zod_1.z.number().min(0).max(100),
    agility: zod_1.z.number().min(0).max(100),
    technique: zod_1.z.number().min(0).max(100),
    durability: zod_1.z.number().min(0).max(100),
    intelligence: zod_1.z.number().min(0).max(100),
    composure: zod_1.z.number().min(0).max(100),
});
exports.MentalitySchema = zod_1.z.object({
    killIntent: zod_1.z.number().min(0).max(100),
    fearLevel: zod_1.z.number().min(0).max(100),
    aggression: zod_1.z.number().min(0).max(100),
    painTolerance: zod_1.z.number().min(0).max(100),
    surrenderThreshold: zod_1.z.number().min(0).max(100),
});
exports.InjurySchema = zod_1.z.object({
    id: zod_1.z.string(),
    partId: zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ]),
    type: zod_1.z.enum(['bruise', 'laceration', 'fracture', 'dislocation', 'concussion', 'organ_damage', 'nerve_damage', 'vessel_rupture']),
    severity: zod_1.z.enum(['minor', 'moderate', 'severe', 'critical']),
    functionalLoss: zod_1.z.number().min(0).max(1),
    timestamp: zod_1.z.number().nonnegative(),
    description: zod_1.z.string(),
});
exports.ConditionSchema = zod_1.z.object({
    fatigue: zod_1.z.number().min(0).max(100),
    injury: zod_1.z.array(exports.InjurySchema),
    adrenaline: zod_1.z.number().min(0).max(100),
});
// ============================================
// 기술 관련 스키마
// ============================================
exports.BiomechanicsDataSchema = zod_1.z.object({
    windupTime: zod_1.z.number().positive(),
    windupForce: ForceVectorSchema,
    executionTime: zod_1.z.number().positive(),
    peakForce: ForceVectorSchema,
    peakVelocity: VelocityVectorSchema,
    impulse: zod_1.z.number().positive(),
    contactArea: zod_1.z.number().positive(),
    pressure: zod_1.z.number().positive(),
    trajectory: zod_1.z.array(TrajectoryPoint2DSchema),
    jointAngles: zod_1.z.array(JointAngleSchema),
    energyCost: zod_1.z.number().nonnegative(),
    metabolicCost: zod_1.z.number().nonnegative(),
    balanceDisruption: zod_1.z.number().min(0).max(1),
    recoveryTime: zod_1.z.number().positive(),
});
exports.TechniqueRequirementsSchema = zod_1.z.object({
    minStats: exports.CoreStatsSchema.partial(),
    staminaCost: zod_1.z.number().nonnegative(),
    requiredDistance: RangeSchema,
    allowedStances: zod_1.z.array(zod_1.z.enum(['orthodox', 'southpaw', 'muaythai', 'wrestling', 'bjj', 'open'])),
    counters: zod_1.z.array(zod_1.z.string()),
});
exports.DamageProfileSchema = zod_1.z.object({
    baseDamage: zod_1.z.number().nonnegative(),
    scaling: StatScalingSchema,
    targetParts: zod_1.z.array(zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ])),
    damageType: zod_1.z.enum(['blunt', 'sharp', 'piercing', 'crushing']),
});
exports.KnockbackProfileSchema = zod_1.z.object({
    force: ForceVectorSchema,
    torque: zod_1.z.number(),
    duration: zod_1.z.number().positive(),
});
exports.StunProfileSchema = zod_1.z.object({
    duration: zod_1.z.number().nonnegative(),
    intensity: zod_1.z.number().min(0).max(1),
});
exports.BleedProfileSchema = zod_1.z.object({
    rate: zod_1.z.number().nonnegative(),
    duration: zod_1.z.number().nonnegative(),
});
exports.FractureProfileSchema = zod_1.z.object({
    probability: zod_1.z.number().min(0).max(1),
    bones: zod_1.z.array(zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ])),
});
exports.ConcussionProfileSchema = zod_1.z.object({
    probability: zod_1.z.number().min(0).max(1),
    severity: zod_1.z.number().min(0).max(1),
});
exports.PsychProfileSchema = zod_1.z.object({
    fearInduced: zod_1.z.number().min(0).max(1),
    intimidation: zod_1.z.number().min(0).max(1),
});
exports.TechniqueEffectsSchema = zod_1.z.object({
    damage: exports.DamageProfileSchema,
    knockback: exports.KnockbackProfileSchema,
    stun: exports.StunProfileSchema,
    bleed: exports.BleedProfileSchema,
    fracture: exports.FractureProfileSchema,
    concussion: exports.ConcussionProfileSchema,
    psychological: exports.PsychProfileSchema,
});
exports.AIWeightSchema = zod_1.z.object({
    offensive: zod_1.z.number().min(0).max(1),
    defensive: zod_1.z.number().min(0).max(1),
    counter: zod_1.z.number().min(0).max(1),
    setup: zod_1.z.number().min(0).max(1),
    finisher: zod_1.z.number().min(0).max(1),
});
exports.TechniqueSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    aliases: zod_1.z.array(zod_1.z.string()),
    category: zod_1.z.enum([
        'strike_punch', 'strike_kick', 'strike_elbow', 'strike_knee', 'strike_headbutt',
        'grapple_takedown', 'grapple_throw', 'grapple_clinch',
        'grapple_choke', 'grapple_joint', 'grapple_ground', 'grapple_sweep',
        'defense_block', 'defense_parry', 'defense_dodge', 'defense_slip', 'defense_weave', 'defense_sprawl',
        'special_feint', 'special_combo', 'special_counter',
    ]),
    biomechanics: exports.BiomechanicsDataSchema,
    requirements: exports.TechniqueRequirementsSchema,
    effects: exports.TechniqueEffectsSchema,
    aiWeight: exports.AIWeightSchema,
    source: zod_1.z.object({
        dataset: zod_1.z.string(),
        study: zod_1.z.string().optional(),
        confidence: zod_1.z.number().min(0).max(1),
        sampleSize: zod_1.z.number().int().positive().optional(),
    }),
    version: zod_1.z.number().int().positive(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
// ============================================
// 동물 관련 스키마
// ============================================
exports.NaturalWeaponSchema = zod_1.z.object({
    type: zod_1.z.enum(['bite', 'claw', 'horn', 'tusk', 'body_slam', 'kick', 'stomp']),
    name: zod_1.z.string(),
    peakForce: zod_1.z.number().positive(),
    peakForceSource: zod_1.z.enum(['measured', 'estimated', 'inferred']),
    peakForceConfidence: zod_1.z.number().min(0).max(1),
    contactArea: zod_1.z.number().positive(),
    damageType: zod_1.z.enum(['piercing', 'slashing', 'blunt', 'crushing']),
    reach: zod_1.z.number().nonnegative(),
    usableStates: zod_1.z.array(exports.FightStateSchema),
});
exports.NaturalArmorSchema = zod_1.z.object({
    type: zod_1.z.enum(['thick_skin', 'fat_layer', 'bone_plate', 'fur', 'scales']),
    location: zod_1.z.array(zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ])),
    thickness: zod_1.z.number().positive(),
    tensileStrength: zod_1.z.number().positive(),
    compressiveStrength: zod_1.z.number().positive(),
    coverage: zod_1.z.number().min(0).max(1),
});
exports.ReferenceSchema = zod_1.z.object({
    type: zod_1.z.enum(['paper', 'database', 'observation', 'expert']),
    title: zod_1.z.string(),
    authors: zod_1.z.array(zod_1.z.string()).optional(),
    year: zod_1.z.number().int().min(1800).max(2100),
    url: zod_1.z.string().url().optional(),
    doi: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.AnimalTraitsSchema = zod_1.z.object({
    aggression: zod_1.z.number().min(0).max(1),
    territoriality: zod_1.z.number().min(0).max(1),
    flightiness: zod_1.z.number().min(0).max(1),
    intelligence: zod_1.z.number().min(0).max(1),
    sociality: zod_1.z.number().min(0).max(1),
    huntingStyle: zod_1.z.enum(['ambush', 'chase', 'grapple', 'bite', 'strike', 'pack']),
    preferredRange: zod_1.z.enum(['close', 'mid', 'long']),
    killMethod: zod_1.z.enum(['suffocation', 'exsanguination', 'crushing', 'neck_break', 'overwhelm']),
    naturalWeapons: zod_1.z.array(exports.NaturalWeaponSchema),
    armor: zod_1.z.array(exports.NaturalArmorSchema),
    fearThreshold: zod_1.z.number().min(0).max(1),
    rageThreshold: zod_1.z.number().min(0).max(1),
});
exports.DetailedAnimalProfileSchema = zod_1.z.object({
    taxonomy: zod_1.z.object({
        class: zod_1.z.string(),
        order: zod_1.z.string(),
        family: zod_1.z.string(),
        genus: zod_1.z.string(),
        species: zod_1.z.string(),
        subspecies: zod_1.z.string().optional(),
    }),
    physical: zod_1.z.object({
        massRange: zod_1.z.object({ min: zod_1.z.number().positive(), max: zod_1.z.number().positive(), avg: zod_1.z.number().positive() }),
        bodyLength: zod_1.z.number().positive(),
        shoulderHeight: zod_1.z.number().positive(),
        sexualDimorphism: zod_1.z.number().positive(),
    }),
    biomechanics: zod_1.z.object({
        biteForce: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('N'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
        strikeForce: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('N'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
        swipeForce: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('N'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
        gripStrength: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('N'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
        sprintSpeed: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('m/s'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
        acceleration: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('m/s²'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
        jumpHeight: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('m'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
        jumpDistance: zod_1.z.object({ value: zod_1.z.number().positive(), unit: zod_1.z.literal('m'), source: exports.ReferenceSchema, confidence: zod_1.z.number().min(0).max(1) }),
    }),
    behavior: exports.AnimalTraitsSchema,
    ecology: zod_1.z.object({
        habitat: zod_1.z.array(zod_1.z.string()),
        diet: zod_1.z.enum(['carnivore', 'omnivore', 'herbivore']),
        activityPattern: zod_1.z.enum(['diurnal', 'nocturnal', 'crepuscular', 'cathemeral']),
        socialStructure: zod_1.z.enum(['solitary', 'pair', 'family', 'pack', 'troop', 'herd']),
        territorySize: zod_1.z.number().positive().optional(),
        homeRange: zod_1.z.number().positive().optional(),
    }),
    lifeHistory: zod_1.z.object({
        lifespan: zod_1.z.object({ wild: zod_1.z.number().positive(), captivity: zod_1.z.number().positive() }),
        sexualMaturity: zod_1.z.number().positive(),
        gestationPeriod: zod_1.z.number().int().positive(),
        litterSize: zod_1.z.object({ min: zod_1.z.number().int().nonnegative(), max: zod_1.z.number().int().positive(), avg: zod_1.z.number().positive() }),
    }),
    references: zod_1.z.array(exports.ReferenceSchema),
});
// ============================================
// 전투 컨텍스트 스키마
// ============================================
exports.HomeGroundBonusSchema = zod_1.z.object({
    crowdSupport: zod_1.z.number().min(0).max(1),
    familiarTerrain: zod_1.z.number().min(0).max(1),
    psychologicalEdge: zod_1.z.number().min(0).max(1),
    refereeBias: zod_1.z.number().min(0).max(1).optional(),
});
exports.EnvironmentSchema = zod_1.z.object({
    terrain: zod_1.z.enum(['flat', 'uneven', 'slippery', 'sand', 'water_shallow']),
    lighting: zod_1.z.enum(['bright', 'dim', 'dark']),
    temperature: zod_1.z.number(),
    humidity: zod_1.z.number().min(0).max(100),
    gravity: zod_1.z.number().positive().default(9.81),
    homeGround: zod_1.z.enum(['A', 'B', 'neutral']),
    homeGroundBonus: exports.HomeGroundBonusSchema,
});
exports.FightRulesSchema = zod_1.z.object({
    timeLimit: zod_1.z.number().nonnegative(),
    roundDuration: zod_1.z.number().positive(),
    maxRounds: zod_1.z.number().int().positive(),
    allowedTechniqueCategories: zod_1.z.array(zod_1.z.enum([
        'strike_punch', 'strike_kick', 'strike_elbow', 'strike_knee', 'strike_headbutt',
        'grapple_takedown', 'grapple_throw', 'grapple_clinch',
        'grapple_choke', 'grapple_joint', 'grapple_ground', 'grapple_sweep',
        'defense_block', 'defense_parry', 'defense_dodge', 'defense_slip', 'defense_weave', 'defense_sprawl',
        'special_feint', 'special_combo', 'special_counter',
    ])),
    forbiddenTargets: zod_1.z.array(zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ])),
    knockoutRule: zod_1.z.enum(['instant', 'count10', 'tko']),
    surrenderAllowed: zod_1.z.boolean(),
    deathAllowed: zod_1.z.boolean(),
});
exports.FightContextSchema = zod_1.z.object({
    environment: exports.EnvironmentSchema,
    rules: exports.FightRulesSchema,
    seed: zod_1.z.number().int(),
});
// ============================================
// 시뮬레이션 결과 스키마
// ============================================
exports.CombatEventSchema = zod_1.z.object({
    id: zod_1.z.string(),
    timestamp: zod_1.z.number().nonnegative(),
    type: zod_1.z.enum(['strike', 'block', 'dodge', 'takedown', 'submission', 'knockdown', 'ko', 'submission_finish', 'surrender', 'death', 'round_start', 'round_end', 'clinch', 'separation', 'feint', 'counter']),
    actor: zod_1.z.enum(['A', 'B']),
    target: zod_1.z.enum(['A', 'B']),
    techniqueId: zod_1.z.string().optional(),
    techniqueName: zod_1.z.string().optional(),
    targetPart: zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ]).optional(),
    damage: zod_1.z.number().optional(),
    result: zod_1.z.enum(['hit', 'blocked', 'dodged', 'parried', 'missed', 'landed', 'escaped', 'reversed']),
    description: zod_1.z.string(),
    force: Vector2Schema.optional(),
    knockback: Vector2Schema.optional(),
    stunDuration: zod_1.z.number().optional(),
    injuries: zod_1.z.array(exports.InjurySchema).optional(),
});
exports.RoundResultSchema = zod_1.z.object({
    round: zod_1.z.number().int().positive(),
    duration: zod_1.z.number().positive(),
    events: zod_1.z.array(exports.CombatEventSchema),
    scoreA: zod_1.z.number(),
    scoreB: zod_1.z.number(),
    knockdownsA: zod_1.z.number().int().nonnegative(),
    knockdownsB: zod_1.z.number().int().nonnegative(),
    dominantFighter: zod_1.z.enum(['A', 'B', 'even']),
});
exports.PartDamageSummarySchema = zod_1.z.object({
    partId: zod_1.z.enum([
        'head', 'neck',
        'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r',
        'arm_upper_l', 'arm_lower_l', 'hand_l',
        'arm_upper_r', 'arm_lower_r', 'hand_r',
        'leg_upper_l', 'leg_lower_l', 'foot_l',
        'leg_upper_r', 'leg_lower_r', 'foot_r',
        'groin',
    ]),
    totalDamage: zod_1.z.number().nonnegative(),
    injurySeverity: zod_1.z.enum(['none', 'minor', 'moderate', 'severe', 'critical', 'loss']),
    injuries: zod_1.z.array(exports.InjurySchema),
    functionalLoss: zod_1.z.number().min(0).max(1),
});
exports.FightResultSchema = zod_1.z.object({
    simulationId: zod_1.z.string(),
    winner: zod_1.z.enum(['A', 'B', 'draw']),
    winProbability: zod_1.z.object({ A: zod_1.z.number().min(0).max(1), B: zod_1.z.number().min(0).max(1), draw: zod_1.z.number().min(0).max(1) }),
    duration: zod_1.z.number().positive(),
    rounds: zod_1.z.array(exports.RoundResultSchema),
    finishType: zod_1.z.enum(['ko', 'tko', 'submission', 'decision', 'surrender', 'death', 'timeout']),
    finishTime: zod_1.z.number().positive(),
    summary: zod_1.z.object({
        totalStrikes: zod_1.z.object({ A: zod_1.z.number().int().nonnegative(), B: zod_1.z.number().int().nonnegative() }),
        significantStrikes: zod_1.z.object({ A: zod_1.z.number().int().nonnegative(), B: zod_1.z.number().int().nonnegative() }),
        takedowns: zod_1.z.object({ A: zod_1.z.number().int().nonnegative(), B: zod_1.z.number().int().nonnegative() }),
        submissions: zod_1.z.object({ A: zod_1.z.number().int().nonnegative(), B: zod_1.z.number().int().nonnegative() }),
        knockdowns: zod_1.z.object({ A: zod_1.z.number().int().nonnegative(), B: zod_1.z.number().int().nonnegative() }),
        clinchTime: zod_1.z.object({ A: zod_1.z.number().nonnegative(), B: zod_1.z.number().nonnegative() }),
        groundTime: zod_1.z.object({ A: zod_1.z.number().nonnegative(), B: zod_1.z.number().nonnegative() }),
    }),
    damageByPart: zod_1.z.object({
        A: zod_1.z.record(exports.PartDamageSummarySchema),
        B: zod_1.z.record(exports.PartDamageSummarySchema),
    }),
    timeline: zod_1.z.array(exports.CombatEventSchema),
});
exports.ReplaySnapshotSchema = zod_1.z.object({
    timestamp: zod_1.z.number().nonnegative(),
    fighters: zod_1.z.record(zod_1.z.object({
        position: Vector2Schema,
        angle: zod_1.z.number(),
        pose: zod_1.z.array(JointTransform2DSchema),
        velocity: Vector2Schema,
        angularVelocity: zod_1.z.number(),
        health: zod_1.z.number().min(0).max(100),
        stamina: zod_1.z.number().min(0).max(100),
        activeInjuries: zod_1.z.array(exports.InjurySchema),
        currentAction: zod_1.z.string().nullable(),
    })),
    events: zod_1.z.array(exports.CombatEventSchema),
});
exports.WinProbabilitySchema = zod_1.z.object({
    winRate: zod_1.z.object({ A: zod_1.z.number().min(0).max(1), B: zod_1.z.number().min(0).max(1), draw: zod_1.z.number().min(0).max(1) }),
    finishTypeDistribution: zod_1.z.record(zod_1.z.number().min(0).max(1)),
    avgDuration: zod_1.z.number().positive(),
    durationStdDev: zod_1.z.number().nonnegative(),
    confidenceInterval: zod_1.z.object({ lower: zod_1.z.number(), upper: zod_1.z.number() }),
});
// ============================================
// 설정 스키마
// ============================================
exports.UserSettingsSchema = zod_1.z.object({
    statsScale: zod_1.z.enum(['relative', 'absolute']).default('relative'),
    simulationCount: zod_1.z.number().int().min(100).max(2000).default(200),
    timeLimit: zod_1.z.enum(['1min', '5min', '10min', 'unlimited']).default('5min'),
    version: zod_1.z.number().int().positive().default(1),
});
//# sourceMappingURL=schemas.js.map