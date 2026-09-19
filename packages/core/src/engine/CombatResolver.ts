import { CoreStats, DurabilityProfile, Injury } from '../domain/fighter';
import { BodyPartId, NaturalArmor } from '../domain/types';
import { RuntimeTechnique } from './default-techniques';
import { Rng } from './rng';

export const PART_WEIGHT: Partial<Record<BodyPartId, number>> = {
  head: 3.0, neck: 2.5,
  torso_front: 1.2, torso_back: 1.2, torso_side_l: 1.0, torso_side_r: 1.0,
  groin: 1.5,
  arm_upper_l: 0.5, arm_upper_r: 0.5, arm_lower_l: 0.4, arm_lower_r: 0.4,
  hand_l: 0.35, hand_r: 0.35,
  leg_upper_l: 0.6, leg_upper_r: 0.6, leg_lower_l: 0.5, leg_lower_r: 0.5,
  foot_l: 0.4, foot_r: 0.4,
};

const PRESSURE_GAIN = 8;
const ENERGY_GAIN = 2;
const TISSUE_TRANSFER = 0.03;
const DAMAGE_GAIN = 10;
const HIC_WINDOW = 0.015;

export function logistic(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function computePressureMPa(peakForceN: number, contactAreaCm2: number): number {
  return (peakForceN / Math.max(1, contactAreaCm2)) * 0.01;
}

export function computeStrikeEnergyJ(peakForceN: number, executionTimeS: number, peakVelocityMs: number): number {
  return peakForceN * executionTimeS * 0.5 * peakVelocityMs * TISSUE_TRANSFER;
}

export function armorFactor(partId: BodyPartId, armor: NaturalArmor[]): number {
  let sum = 0;
  for (const a of armor) {
    if (a.location.includes(partId)) {
      sum += a.thickness * a.coverage;
    }
  }
  return Math.min(3, 1 + sum / 50);
}

export function partResistanceMPa(durability: DurabilityProfile, partId: BodyPartId, armor: NaturalArmor[] = []): number {
  const part = durability[partId];
  if (!part) return 15;
  const res =
    (part.skin.tensileStrength * 0.3 +
     part.muscle.tensileStrength * 2 +
     part.bone.tensileStrength * 0.3) / 4;
  return res * armorFactor(partId, armor);
}

export function computeHic(peakForceN: number, headMassKg: number): number {
  const aG = peakForceN / Math.max(1, headMassKg) / 9.81;
  return Math.pow(aG, 2.5) * HIC_WINDOW;
}

export function weibullFracture(pressureMPa: number, boneTensileMPa: number): number {
  const ratio = pressureMPa / Math.max(1, boneTensileMPa * 0.15);
  if (ratio <= 0) return 0;
  return 1 - Math.exp(-Math.pow(ratio, 2.5));
}

export interface StrikeParams {
  technique: RuntimeTechnique;
  attackerStats: CoreStats;
  attackerFatigue: number;
  attackerAdrenaline: number;
  defenderDurability: DurabilityProfile;
  defenderArmor: NaturalArmor[];
  defenderStats: CoreStats;
  defenderHeadMassKg: number;
  defenseMultiplier: number;
  rng: Rng;
}

export interface StrikeOutcome {
  targetPart: BodyPartId;
  peakForceN: number;
  pressureMPa: number;
  energyJ: number;
  partDamage: number;
  totalDamage: number;
  hic: number;
  concussionP: number;
  fractureP: number;
  fracture: boolean;
  organRuptureP: number;
  organRuptured: boolean;
  koNow: boolean;
  stunDuration: number;
  bleedRate: number;
  injuries: Injury[];
}

export function resolveStrike(p: StrikeParams): StrikeOutcome {
  const tech = p.technique;
  const strengthScale = 0.5 + p.attackerStats.strength / 100;
  const adrenalineScale = 1 + p.attackerAdrenaline / 300;
  const fatigueScale = 1 - p.attackerFatigue * 0.35;
  const peakForceN = tech.biomechanics.peakForce.magnitude * strengthScale * adrenalineScale * fatigueScale;

  const pressureMPa = computePressureMPa(peakForceN, tech.biomechanics.contactArea);
  const energyJ = computeStrikeEnergyJ(
    peakForceN, tech.biomechanics.executionTime, tech.biomechanics.peakVelocity.magnitude
  );

  const targetPart = p.rng.weightedPick(
    tech.effects.damage.targetParts,
    tech.effects.damage.targetParts.map((part) => PART_WEIGHT[part] ?? 1)
  );

  const resistance = partResistanceMPa(p.defenderDurability, targetPart, p.defenderArmor);

  const pressureTerm = Math.pow(pressureMPa / Math.max(0.1, resistance), 1.5) * PRESSURE_GAIN;
  const energyCapacityJ = resistance * tech.biomechanics.contactArea * ENERGY_GAIN;
  const energyTerm = Math.pow(energyJ / Math.max(1, energyCapacityJ), 1.2);
  const partDamage = Math.min(1, pressureTerm + energyTerm);

  const totalDamage = Math.min(100,
    partDamage * (PART_WEIGHT[targetPart] ?? 1) * DAMAGE_GAIN * p.defenseMultiplier
  );

  const isHead = targetPart === 'head';
  const hic = isHead ? computeHic(peakForceN, p.defenderHeadMassKg) : 0;
  const concussionP = isHead ? logistic((hic - 700) / 150) : 0;
  const koNow = isHead && hic > 1000;

  const part = p.defenderDurability[targetPart];
  const fractureP = part ? weibullFracture(pressureMPa, part.bone.tensileStrength) : 0;
  const fracture = fractureP > 0 && p.rng.chance(fractureP);

  const organRuptureP = part?.organ && partDamage > 0.4
    ? logistic((pressureMPa * 10 - part.organ.criticalPressure) / (part.organ.criticalPressure * 0.25))
    : 0;
  const organRuptured = organRuptureP > 0 && p.rng.chance(organRuptureP);

  const stunDuration = tech.effects.stun.duration * (1 - p.defenderStats.durability / 150);

  const bleedRate = tech.effects.bleed.rate * (fracture ? 2 : 1) * (1 - p.defenderStats.durability / 200);

  const injuries: Injury[] = [];
  const now = 0;
  if (partDamage > 0.15 || fracture || organRuptured) {
    const severity: Injury['severity'] =
      partDamage >= 0.95 || organRuptured ? 'critical' :
      partDamage >= 0.7 ? 'severe' :
      partDamage >= 0.4 ? 'moderate' : 'minor';
    const type: Injury['type'] = fracture ? 'fracture'
      : organRuptured ? 'organ_damage'
      : isHead && concussionP > 0.5 ? 'concussion'
      : tech.effects.damage.damageType === 'sharp' || tech.effects.damage.damageType === 'piercing' ? 'laceration'
      : 'bruise';
    injuries.push({
      id: `inj_${targetPart}_${type}_${now}`,
      partId: targetPart,
      type,
      severity,
      functionalLoss: Math.min(1, partDamage * (organRuptured ? 1.5 : 1)),
      timestamp: now,
      description: `${tech.name} → ${targetPart} (${severity})`,
    });
  }

  return {
    targetPart, peakForceN, pressureMPa, energyJ, partDamage, totalDamage,
    hic, concussionP, fractureP, fracture, organRuptureP, organRuptured, koNow,
    stunDuration, bleedRate, injuries,
  };
}
