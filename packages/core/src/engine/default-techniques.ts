import { Technique, BiomechanicsData, TechniqueEffects, AIWeight } from '../domain/fighter';
import {
  TechniqueCategory, FightState, BodyPartId, DamageType, Vector2,
} from '../domain/types';
import { DetailedAnimalProfile, NaturalWeapon } from '../domain/types';

export type Posture = 'standing' | 'clinch' | 'ground_top' | 'ground_bottom' | 'stunned' | 'downed';

export interface RuntimeTechnique extends Technique {
  postures: FightState[];
  chokeLike?: boolean;
}

const FV = (magnitude: number, dir: Vector2 = { x: 0, y: 0 }) => ({ x: dir.x, y: dir.y, magnitude });
const VV = (magnitude: number, dir: Vector2 = { x: 0, y: 0 }) => ({ x: dir.x, y: dir.y, magnitude });

function bio(opts: {
  windupTime: number; executionTime: number; peakForce: number; peakVelocity: number;
  impulse: number; contactArea: number; recoveryTime: number; energyCost: number;
}): BiomechanicsData {
  return {
    windupTime: opts.windupTime,
    windupForce: FV(opts.peakForce * 0.3),
    executionTime: opts.executionTime,
    peakForce: FV(opts.peakForce),
    peakVelocity: VV(opts.peakVelocity),
    impulse: opts.impulse,
    contactArea: opts.contactArea,
    pressure: opts.peakForce / opts.contactArea,
    trajectory: [],
    jointAngles: [],
    energyCost: opts.energyCost,
    metabolicCost: opts.energyCost * 1.2,
    balanceDisruption: 0.05,
    recoveryTime: opts.recoveryTime,
  };
}

function effects(opts: {
  targetParts: BodyPartId[]; damageType: DamageType; stunDuration: number; stunIntensity: number;
  knockbackForce: number; bleedRate?: number;
}): TechniqueEffects {
  return {
    damage: {
      baseDamage: 0,
      scaling: { strength: 1, speed: 0.5, technique: 0.3 },
      targetParts: opts.targetParts,
      damageType: opts.damageType,
    },
    knockback: { force: FV(opts.knockbackForce), torque: 0, duration: 0.2 },
    stun: { duration: opts.stunDuration, intensity: opts.stunIntensity },
    bleed: { rate: opts.bleedRate ?? 0, duration: opts.bleedRate ? 30 : 0 },
    fracture: { probability: 0, bones: [] },
    concussion: { probability: 0, severity: 0 },
    psychological: { fearInduced: 0, intimidation: 0 },
  };
}

function tech(
  id: string, name: string, category: TechniqueCategory, postures: FightState[],
  biomechanics: BiomechanicsData, effect: TechniqueEffects,
  distance: { min: number; max: number }, staminaCost: number,
  aiWeight: Partial<AIWeight> = {},
  extra: Partial<RuntimeTechnique> = {}
): RuntimeTechnique {
  return {
    id, name, category,
    biomechanics,
    requirements: {
      minStats: {},
      staminaCost,
      requiredDistance: distance,
      allowedStances: ['orthodox', 'southpaw', 'muaythai', 'wrestling', 'bjj', 'open'],
      counters: [],
    },
    effects: effect,
    aiWeight: { offensive: 1, defensive: 0, counter: 0, setup: 0, finisher: 0, ...aiWeight },
    postures,
    ...extra,
  };
}

export const HUMAN_TECHNIQUES: RuntimeTechnique[] = [
  tech('jab', '잽', 'strike_punch', ['STANDING'],
    bio({ windupTime: 0.12, executionTime: 0.03, peakForce: 1500, peakVelocity: 8, impulse: 40, contactArea: 25, recoveryTime: 0.15, energyCost: 2 }),
    effects({ targetParts: ['head'], damageType: 'blunt', stunDuration: 0.15, stunIntensity: 0.2, knockbackForce: 100 }),
    { min: 0.4, max: 1.3 }, 2, { offensive: 1, setup: 0.8 }),

  tech('cross', '크로스', 'strike_punch', ['STANDING'],
    bio({ windupTime: 0.18, executionTime: 0.035, peakForce: 2500, peakVelocity: 9.5, impulse: 70, contactArea: 25, recoveryTime: 0.25, energyCost: 4 }),
    effects({ targetParts: ['head', 'torso_front'], damageType: 'blunt', stunDuration: 0.3, stunIntensity: 0.4, knockbackForce: 200 }),
    { min: 0.4, max: 1.4 }, 4, { offensive: 1.2, finisher: 0.3 }),

  tech('lead_hook', '리드 훅', 'strike_punch', ['STANDING'],
    bio({ windupTime: 0.22, executionTime: 0.04, peakForce: 3000, peakVelocity: 8.5, impulse: 80, contactArea: 20, recoveryTime: 0.3, energyCost: 5 }),
    effects({ targetParts: ['head', 'torso_front'], damageType: 'blunt', stunDuration: 0.5, stunIntensity: 0.6, knockbackForce: 300 }),
    { min: 0.3, max: 1.0 }, 5, { offensive: 1.3, finisher: 0.6 }),

  tech('lead_uppercut', '업퍼컷', 'strike_punch', ['STANDING'],
    bio({ windupTime: 0.24, executionTime: 0.04, peakForce: 2800, peakVelocity: 7.5, impulse: 75, contactArea: 20, recoveryTime: 0.32, energyCost: 5 }),
    effects({ targetParts: ['head'], damageType: 'blunt', stunDuration: 0.6, stunIntensity: 0.7, knockbackForce: 150 }),
    { min: 0.2, max: 0.9 }, 5, { offensive: 1.3, finisher: 0.7 }),

  tech('lead_low_kick', '로우킥', 'strike_kick', ['STANDING'],
    bio({ windupTime: 0.28, executionTime: 0.05, peakForce: 4000, peakVelocity: 9, impulse: 110, contactArea: 40, recoveryTime: 0.45, energyCost: 7 }),
    effects({ targetParts: ['leg_upper_l', 'leg_upper_r'], damageType: 'blunt', stunDuration: 0.2, stunIntensity: 0.3, knockbackForce: 100 }),
    { min: 0.7, max: 1.6 }, 7, { offensive: 1.2, setup: 0.5 }),

  tech('rear_round_kick', '라운드킥', 'strike_kick', ['STANDING'],
    bio({ windupTime: 0.32, executionTime: 0.05, peakForce: 4500, peakVelocity: 10, impulse: 130, contactArea: 45, recoveryTime: 0.5, energyCost: 8 }),
    effects({ targetParts: ['head', 'torso_front', 'leg_upper_l'], damageType: 'blunt', stunDuration: 0.8, stunIntensity: 0.8, knockbackForce: 400 }),
    { min: 0.8, max: 1.8 }, 8, { offensive: 1.5, finisher: 0.8 }),

  tech('rear_teep', '티프(직축)', 'strike_kick', ['STANDING'],
    bio({ windupTime: 0.25, executionTime: 0.05, peakForce: 3000, peakVelocity: 8, impulse: 90, contactArea: 50, recoveryTime: 0.4, energyCost: 5 }),
    effects({ targetParts: ['torso_front'], damageType: 'blunt', stunDuration: 0.25, stunIntensity: 0.3, knockbackForce: 500 }),
    { min: 0.8, max: 2.0 }, 5, { offensive: 0.9, setup: 0.6 }),

  tech('lead_elbow', '엘보', 'strike_elbow', ['CLINCH', 'STANDING'],
    bio({ windupTime: 0.18, executionTime: 0.03, peakForce: 3500, peakVelocity: 7, impulse: 70, contactArea: 10, recoveryTime: 0.28, energyCost: 4 }),
    effects({ targetParts: ['head', 'torso_front'], damageType: 'sharp', stunDuration: 0.4, stunIntensity: 0.5, knockbackForce: 100, bleedRate: 8 }),
    { min: 0.2, max: 0.8 }, 4, { offensive: 1.2, finisher: 0.5 }),

  tech('clinch_knee', '무릎 차기', 'strike_knee', ['CLINCH'],
    bio({ windupTime: 0.24, executionTime: 0.05, peakForce: 4000, peakVelocity: 8, impulse: 100, contactArea: 30, recoveryTime: 0.35, energyCost: 6 }),
    effects({ targetParts: ['torso_front', 'head'], damageType: 'blunt', stunDuration: 0.4, stunIntensity: 0.5, knockbackForce: 200 }),
    { min: 0.2, max: 0.7 }, 6, { offensive: 1.3, finisher: 0.5 }),

  tech('double_leg', '더블레그 테이크다운', 'grapple_takedown', ['STANDING'],
    bio({ windupTime: 0.35, executionTime: 0.2, peakForce: 2500, peakVelocity: 5, impulse: 200, contactArea: 200, recoveryTime: 0.5, energyCost: 8 }),
    effects({ targetParts: ['torso_front'], damageType: 'blunt', stunDuration: 0.5, stunIntensity: 0.5, knockbackForce: 300 }),
    { min: 0.5, max: 1.6 }, 8, { offensive: 1.2 }),

  tech('ground_and_pound', '그라운드 앤 파운드', 'grapple_ground', ['GROUND_TOP'],
    bio({ windupTime: 0.2, executionTime: 0.03, peakForce: 2000, peakVelocity: 6, impulse: 50, contactArea: 25, recoveryTime: 0.3, energyCost: 3 }),
    effects({ targetParts: ['head', 'torso_front'], damageType: 'blunt', stunDuration: 0.3, stunIntensity: 0.4, knockbackForce: 50 }),
    { min: 0, max: 0.8 }, 3, { offensive: 1.2, finisher: 0.4 }),

  tech('rear_naked_choke', '리어 네이키드 초크', 'grapple_choke', ['GROUND_TOP'],
    bio({ windupTime: 0.5, executionTime: 0.3, peakForce: 800, peakVelocity: 1, impulse: 100, contactArea: 60, recoveryTime: 0.5, energyCost: 6 }),
    effects({ targetParts: ['neck'], damageType: 'crushing', stunDuration: 0.5, stunIntensity: 0.5, knockbackForce: 0 }),
    { min: 0, max: 0.6 }, 6, { offensive: 1.5, finisher: 1 }, { chokeLike: true }),
];

export const TECHNIQUE_DB: Record<string, RuntimeTechnique> = Object.fromEntries(
  HUMAN_TECHNIQUES.map((t) => [t.id, t])
);

const WEAPON_CATEGORY: Record<NaturalWeapon['type'], TechniqueCategory> = {
  bite: 'strike_headbutt',
  tusk: 'strike_headbutt',
  horn: 'strike_headbutt',
  claw: 'strike_kick',
  strike: 'strike_punch',
  kick: 'strike_kick',
  stomp: 'strike_headbutt',
  body_slam: 'strike_headbutt',
  grip: 'grapple_clinch',
};

const WEAPON_PARTS: Record<NaturalWeapon['type'], BodyPartId[]> = {
  bite: ['neck', 'head'],
  tusk: ['torso_front', 'leg_upper_l', 'leg_upper_r'],
  horn: ['torso_front', 'head'],
  claw: ['head', 'torso_front', 'arm_upper_l', 'arm_upper_r'],
  strike: ['head', 'torso_front'],
  kick: ['torso_front', 'head'],
  stomp: ['head', 'torso_front'],
  body_slam: ['torso_front', 'head'],
  grip: ['torso_front', 'arm_upper_l'],
};

export function naturalWeaponToTechniques(profile: DetailedAnimalProfile): RuntimeTechnique[] {
  return profile.behavior.naturalWeapons.map((w, i) => {
    const execTime = w.type === 'body_slam' ? 0.15 : 0.06;
    const velocity = Math.min(12, profile.biomechanics.sprintSpeed.value * 0.7);
    return tech(
      `nw_${w.type}_${i}`, w.name, WEAPON_CATEGORY[w.type],
      ['STANDING', 'CLINCH', 'GROUND_TOP'],
      bio({
        windupTime: w.type === 'body_slam' ? 0.3 : 0.15,
        executionTime: execTime,
        peakForce: w.peakForce,
        peakVelocity: velocity,
        impulse: w.peakForce * execTime,
        contactArea: Math.max(1, w.contactArea),
        recoveryTime: 0.35,
        energyCost: 4,
      }),
      effects({
        targetParts: WEAPON_PARTS[w.type],
        damageType: w.damageType === 'slashing' ? 'sharp' : w.damageType,
        stunDuration: w.type === 'body_slam' ? 0.7 : 0.4,
        stunIntensity: 0.6,
        knockbackForce: w.peakForce * 0.03,
        bleedRate: w.damageType === 'piercing' || w.damageType === 'slashing' ? 15 : 0,
      }),
      { min: 0, max: (w.reach + 50) / 100 },
      4,
      { offensive: 1.2, finisher: 0.5 },
      {
        chokeLike: w.type === 'bite' && profile.behavior.killMethod === 'suffocation',
        postures: ['STANDING', 'CLINCH', 'GROUND_TOP', 'GROUND_BOTTOM'],
      }
    );
  });
}

export function techniquesFromIds(ids: string[]): RuntimeTechnique[] {
  return ids.map((id) => TECHNIQUE_DB[id]).filter((t): t is RuntimeTechnique => t !== undefined);
}
