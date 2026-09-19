import { Fighter } from '../domain/fighter';
import { FightContext } from '../domain/context';
import { ParsedBackground } from '../domain/fighter';
import { DetailedAnimalProfile } from '../domain/types';
import { deriveBodySpec } from '../data/body-segments';
import { deriveCoreStats, getCompositeTechniques } from '../data/art-stats';
import { animalToFighter } from '../data/animal-traits';
import { naturalWeaponToTechniques, techniquesFromIds, RuntimeTechnique } from './default-techniques';
import { Technique } from '../domain/fighter';

export interface HumanFighterInput {
  name: string;
  height: number;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  age: number;
  sex: 'male' | 'female';
  parsedBackground?: ParsedBackground;
  deathAllowed: boolean;
}

export function buildHumanFighter(input: HumanFighterInput): Fighter {
  const body = deriveBodySpec({
    height: input.height,
    weight: input.weight,
    skeletalMuscleMass: input.skeletalMuscleMass,
    bodyFatMass: input.bodyFatMass,
    age: input.age,
    sex: input.sex,
  });

  const stats = deriveCoreStats({
    height: input.height,
    weight: input.weight,
    skeletalMuscleMass: input.skeletalMuscleMass,
    bodyFatMass: input.bodyFatMass,
    age: input.age,
    sex: input.sex,
    parsedBackground:
      input.parsedBackground ?? {
        primaryArt: 'default',
        experienceMonths: 0,
        trainingFrequency: 2,
        confidence: 0.5,
      },
  });

  const primaryArt = input.parsedBackground?.primaryArt ?? 'default';
  const experienceMonths = input.parsedBackground?.experienceMonths ?? 0;
  const techniqueIds = getCompositeTechniques(input.parsedBackground ?? { primaryArt, experienceMonths, trainingFrequency: 2, confidence: 0.5 });
  const techniques: Technique[] = techniquesFromIds(techniqueIds);

  const mentality = {
    killIntent: input.deathAllowed ? 85 : 25,
    fearLevel: Math.round(60 - stats.composure * 0.4),
    aggression: Math.round(35 + stats.composure * 0.3),
    painTolerance: Math.round(40 + stats.durability * 0.3),
    surrenderThreshold: 50,
  };

  return {
    id: `human_${input.name}_${input.weight}kg`,
    name: input.name,
    type: 'human',
    profile: {
      height: input.height,
      weight: input.weight,
      skeletalMuscleMass: input.skeletalMuscleMass,
      bodyFatMass: input.bodyFatMass,
      age: input.age,
      sex: input.sex,
      martialArtsHistory: input.parsedBackground?.primaryArt ?? '무술 경험 없음',
      homeGround: 'neutral',
      deathAllowed: input.deathAllowed,
      parsedBackground: input.parsedBackground,
    },
    body,
    stats,
    techniques,
    mentality,
    condition: { fatigue: 0, injury: [], adrenaline: 50 },
    armor: [],
    moveSpeed: 2.5 + stats.speed / 40,
  };
}

export function buildAnimalFighter(
  profile: DetailedAnimalProfile,
  overrides: Partial<{ name: string }> = {}
): Fighter {
  const base = animalToFighter(profile, { name: overrides.name });
  const techniques: Technique[] = naturalWeaponToTechniques(profile);
  return {
    ...base,
    techniques,
    armor: profile.behavior.armor,
    traits: profile.behavior,
    moveSpeed: profile.biomechanics.sprintSpeed.value * 0.5,
  };
}

export type RuntimeFighter = Fighter & { techniques: RuntimeTechnique[] };

function timeLimitToRounds(t: string): { roundDuration: number; maxRounds: number } {
  switch (t) {
    case '1min':
      return { roundDuration: 60, maxRounds: 1 };
    case '10min':
      return { roundDuration: 300, maxRounds: 2 };
    case 'unlimited':
      return { roundDuration: 300, maxRounds: 5 };
    default:
      return { roundDuration: 300, maxRounds: 1 };
  }
}

export interface ContextOptions {
  homeGround: 'me' | 'opponent' | 'neutral';
  deathAllowed: boolean;
  timeLimit: '1min' | '5min' | '10min' | 'unlimited';
  seed: number;
}

export function buildFightContext(opts: ContextOptions): FightContext {
  const { roundDuration, maxRounds } = timeLimitToRounds(opts.timeLimit);
  return {
    environment: {
      terrain: 'flat',
      lighting: 'bright',
      temperature: 20,
      humidity: 50,
      gravity: 9.81,
      homeGround: opts.homeGround === 'me' ? 'A' : opts.homeGround === 'opponent' ? 'B' : 'neutral',
      homeGroundBonus: { crowdSupport: 50, familiarTerrain: 50, psychologicalEdge: 10 },
    },
    rules: {
      timeLimit: roundDuration * maxRounds,
      roundDuration,
      maxRounds,
      allowedTechniqueCategories: [],
      forbiddenTargets: [],
      knockoutRule: 'tko',
      surrenderAllowed: !opts.deathAllowed,
      deathAllowed: opts.deathAllowed,
    },
    seed: opts.seed,
  };
}
