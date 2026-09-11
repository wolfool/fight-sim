export { 
  // types.ts
  BodyPartId, FighterType, TechniqueCategory, Stance, DamageType,
  KnockoutRule, FinishType, TerrainType, LightingType, HomeGroundSide,
  FightState, Range, Vector2, ForceVector, VelocityVector,
  TrajectoryPoint2D, JointAngle, JointTransform2D, StatScaling,
  Injury,
  // animal types
  Reference, NaturalWeapon, NaturalArmor, AnimalBiomechanics,
  AnimalTraits, DetailedAnimalProfile,
} from './types';

export {
  // fighter.ts
  UserProfile, ParsedBackground, BodySegment, TissueDurability,
  OrganDurability, PartDurability, DurabilityProfile, BodySpec,
  CoreStats, Mentality, Condition, Technique, Fighter,
  // biomechanics
  BiomechanicsData, TechniqueRequirements, DamageProfile,
  KnockbackProfile, StunProfile, BleedProfile, FractureProfile,
  ConcussionProfile, PsychProfile, TechniqueEffects, AIWeight,
} from './fighter';

export {
  // context.ts
  HomeGroundBonus, Environment, FightRules, FightContext,
  FighterState, CombatEvent, RoundResult, PartDamageSummary,
  FightResult, ReplaySnapshot, WinProbability,
} from './context';

