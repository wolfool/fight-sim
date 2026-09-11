// ============================================
// @fight-sim/core - 메인 진입점
// ============================================

// 도메인 타입 (명시적 export로 중복 방지)
export { 
  // types.ts
  BodyPartId, FighterType, TechniqueCategory, Stance, DamageType,
  KnockoutRule, FinishType, TerrainType, LightingType, HomeGroundSide,
  FightState, Range, Vector2, ForceVector, VelocityVector,
  TrajectoryPoint2D, JointAngle, JointTransform2D, StatScaling,
  // animal types
  Reference, NaturalWeapon, NaturalArmor, AnimalBiomechanics,
  AnimalTraits, DetailedAnimalProfile,
} from './domain/types';

export {
  // fighter.ts
  UserProfile, ParsedBackground, BodySegment, TissueDurability,
  OrganDurability, PartDurability, DurabilityProfile, BodySpec,
  CoreStats, Mentality, Injury, Condition, Technique,
  // biomechanics
  BiomechanicsData, TechniqueRequirements, DamageProfile,
  KnockbackProfile, StunProfile, BleedProfile, FractureProfile,
  ConcussionProfile, PsychProfile, TechniqueEffects, AIWeight,
} from './domain/fighter';

export {
  // context.ts
  HomeGroundBonus, Environment, FightRules, FightContext,
  FighterState, CombatEvent, RoundResult, PartDamageSummary,
  FightResult, ReplaySnapshot, WinProbability,
} from './domain/context';

// 데이터 (스키마, 가중치, 앵커, 세그먼트)
export * from './data/schemas';
export * from './data/art-stats';
export * from './data/anchor-values';
export * from './data/body-segments';

// 동물 데이터 (프로파일, 프리셋) - 타입은 domain에서 export됨
export { 
  CHIMPANZEE, GORILLA, ORANGUTAN, TIGER, LION, 
  BROWN_BEAR, GRIZZLY, WOLF, WILD_BOAR, HUMAN_UNTRAINED,
  ANIMAL_PRESETS,
  animalToFighter,
  calculateAnimalSegments,
  generateAnimalDurability,
  deriveAnimalStats,
  deriveAnimalMentality,
} from './data/animal-traits';

// 설정
export * from './settings/SettingsManager';

// 물리
export * from './physics';

// 파서
export * from './parser/BackgroundParser';

// 엔진 (인터페이스만)
export * from './engine';

// 생리학/심리학
export * from './physiology';

// 검증
export * from './validation';

// 시뮬레이션 워커
export * from './simulation';