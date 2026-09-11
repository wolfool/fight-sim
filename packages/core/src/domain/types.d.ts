export type BodyPartId = 'head' | 'neck' | 'torso_front' | 'torso_back' | 'torso_side_l' | 'torso_side_r' | 'arm_upper_l' | 'arm_lower_l' | 'hand_l' | 'arm_upper_r' | 'arm_lower_r' | 'hand_r' | 'leg_upper_l' | 'leg_lower_l' | 'foot_l' | 'leg_upper_r' | 'leg_lower_r' | 'foot_r' | 'groin';
export type FighterType = 'human' | 'animal' | 'monster' | 'custom';
export type TechniqueCategory = 'strike_punch' | 'strike_kick' | 'strike_elbow' | 'strike_knee' | 'strike_headbutt' | 'grapple_takedown' | 'grapple_throw' | 'grapple_clinch' | 'grapple_choke' | 'grapple_joint' | 'grapple_ground' | 'grapple_sweep' | 'defense_block' | 'defense_parry' | 'defense_dodge' | 'defense_slip' | 'defense_weave' | 'defense_sprawl' | 'special_feint' | 'special_combo' | 'special_counter';
export type Stance = 'orthodox' | 'southpaw' | 'muaythai' | 'wrestling' | 'bjj' | 'open';
export type DamageType = 'blunt' | 'sharp' | 'piercing' | 'crushing';
export type KnockoutRule = 'instant' | 'count10' | 'tko';
export type FinishType = 'ko' | 'tko' | 'submission' | 'decision' | 'surrender' | 'death';
export type TerrainType = 'flat' | 'uneven' | 'slippery' | 'sand' | 'water_shallow';
export type LightingType = 'bright' | 'dim' | 'dark';
export type HomeGroundSide = 'A' | 'B' | 'neutral';
export type FightState = 'STANDING' | 'CLINCH' | 'GROUND_TOP' | 'GROUND_BOTTOM';
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
export interface Reference {
    type: 'paper' | 'database' | 'observation' | 'expert';
    title: string;
    authors?: string[];
    year: number;
    url?: string;
    doi?: string;
    notes?: string;
}
export interface NaturalWeapon {
    type: 'bite' | 'claw' | 'horn' | 'tusk' | 'body_slam' | 'kick' | 'stomp';
    name: string;
    peakForce: number;
    peakForceSource: 'measured' | 'estimated' | 'inferred';
    peakForceConfidence: number;
    contactArea: number;
    damageType: 'piercing' | 'slashing' | 'blunt' | 'crushing';
    reach: number;
    usableStates: FightState[];
}
export interface NaturalArmor {
    type: 'thick_skin' | 'fat_layer' | 'bone_plate' | 'fur' | 'scales';
    location: BodyPartId[];
    thickness: number;
    tensileStrength: number;
    compressiveStrength: number;
    coverage: number;
}
export interface AnimalBiomechanics {
    biteForce: {
        value: number;
        unit: 'N';
        source: Reference;
        confidence: number;
    };
    strikeForce: {
        value: number;
        unit: 'N';
        source: Reference;
        confidence: number;
    };
    swipeForce: {
        value: number;
        unit: 'N';
        source: Reference;
        confidence: number;
    };
    gripStrength: {
        value: number;
        unit: 'N';
        source: Reference;
        confidence: number;
    };
    sprintSpeed: {
        value: number;
        unit: 'm/s';
        source: Reference;
        confidence: number;
    };
    acceleration: {
        value: number;
        unit: 'm/s²';
        source: Reference;
        confidence: number;
    };
    jumpHeight: {
        value: number;
        unit: 'm';
        source: Reference;
        confidence: number;
    };
    jumpDistance: {
        value: number;
        unit: 'm';
        source: Reference;
        confidence: number;
    };
}
export interface AnimalTraits {
    aggression: number;
    territoriality: number;
    flightiness: number;
    intelligence: number;
    sociality: number;
    huntingStyle: 'ambush' | 'chase' | 'grapple' | 'bite' | 'strike' | 'pack';
    preferredRange: 'close' | 'mid' | 'long';
    killMethod: 'suffocation' | 'exsanguination' | 'crushing' | 'neck_break' | 'overwhelm';
    naturalWeapons: NaturalWeapon[];
    armor: NaturalArmor[];
    fearThreshold: number;
    rageThreshold: number;
}
export interface DetailedAnimalProfile {
    taxonomy: {
        class: string;
        order: string;
        family: string;
        genus: string;
        species: string;
        subspecies?: string;
    };
    physical: {
        massRange: {
            min: number;
            max: number;
            avg: number;
        };
        bodyLength: number;
        shoulderHeight: number;
        sexualDimorphism: number;
    };
    biomechanics: AnimalBiomechanics;
    behavior: AnimalTraits;
    ecology: {
        habitat: string[];
        diet: 'carnivore' | 'omnivore' | 'herbivore';
        activityPattern: 'diurnal' | 'nocturnal' | 'crepuscular' | 'cathemeral';
        socialStructure: 'solitary' | 'pair' | 'family' | 'pack' | 'troop' | 'herd';
        territorySize?: number;
        homeRange?: number;
    };
    lifeHistory: {
        lifespan: {
            wild: number;
            captivity: number;
        };
        sexualMaturity: number;
        gestationPeriod: number;
        litterSize: {
            min: number;
            max: number;
            avg: number;
        };
    };
    references: Reference[];
}
//# sourceMappingURL=types.d.ts.map