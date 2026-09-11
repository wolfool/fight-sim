export type BodyPartId =
  | 'head' | 'neck'
  | 'torso_front' | 'torso_back' | 'torso_side_l' | 'torso_side_r'
  | 'arm_upper_l' | 'arm_lower_l' | 'hand_l'
  | 'arm_upper_r' | 'arm_lower_r' | 'hand_r'
  | 'leg_upper_l' | 'leg_lower_l' | 'foot_l'
  | 'leg_upper_r' | 'leg_lower_r' | 'foot_r'
  | 'groin';

export type FighterType = 'human' | 'animal' | 'monster' | 'custom';

export type TechniqueCategory =
  | 'strike_punch' | 'strike_kick' | 'strike_elbow' | 'strike_knee' | 'strike_headbutt'
  | 'grapple_takedown' | 'grapple_throw' | 'grapple_clinch'
  | 'grapple_choke' | 'grapple_joint' | 'grapple_ground' | 'grapple_sweep'
  | 'defense_block' | 'defense_parry' | 'defense_dodge' | 'defense_slip' | 'defense_weave' | 'defense_sprawl'
  | 'special_feint' | 'special_combo' | 'special_counter';

export type Stance = 'orthodox' | 'southpaw' | 'muaythai' | 'wrestling' | 'bjj' | 'open';

export type DamageType = 'blunt' | 'sharp' | 'piercing' | 'crushing';

export type KnockoutRule = 'instant' | 'count10' | 'tko';

export type FinishType = 'ko' | 'tko' | 'submission' | 'decision' | 'surrender' | 'death';

export type TerrainType = 'flat' | 'uneven' | 'slippery' | 'sand' | 'water_shallow';
export type LightingType = 'bright' | 'dim' | 'dark';

export type HomeGroundSide = 'A' | 'B' | 'neutral';

export interface Range {
  min: number;
  max: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface ForceVector {
  x: number;
  y: number;
  magnitude: number;
}

export interface VelocityVector {
  x: number;
  y: number;
  magnitude: number;
}

export interface TrajectoryPoint2D {
  t: number;
  position: Vector2;
  velocity: Vector2;
}

export interface JointAngle {
  joint: string;
  angle: number;
  angularVelocity: number;
}

export interface JointTransform2D {
  joint: string;
  position: Vector2;
  angle: number;
}

export interface StatScaling {
  strength: number;
  speed: number;
  technique: number;
  [key: string]: number;
}