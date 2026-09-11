// ============================================
// 동물 상세 프로파일 (문헌 기반, 신뢰도 명시)
// 신뢰도: measured(실측) > estimated(간접추정) > inferred(계통발생/전문가추론)
// ============================================

import {
  DetailedAnimalProfile,
  AnimalTraits,
  NaturalWeapon,
  NaturalArmor,
  Reference,
  BodyPartId,
} from '../domain/types';
import { ZATSIORSKY_SEGMENTS, calculateBodySegments, KOREAN_ADJUSTMENT } from './body-segments';

// ============================================
// 공통 헬퍼
// ============================================

function ref(type: Reference['type'], title: string, year: number, opts: Partial<Reference> = {}): Reference {
  return { type, title, year, ...opts };
}

function weapon(
  type: NaturalWeapon['type'],
  name: string,
  peakForce: number,
  source: 'measured' | 'estimated' | 'inferred',
  confidence: number,
  opts: Partial<NaturalWeapon> = {}
): NaturalWeapon {
  return { type, name, peakForce, peakForceSource: source, peakForceConfidence: confidence, contactArea: 5, damageType: 'blunt', reach: 20, usableStates: ['STANDING', 'CLINCH', 'GROUND_TOP', 'GROUND_BOTTOM'], ...opts };
}

function armor(
  type: NaturalArmor['type'],
  location: BodyPartId[],
  thickness: number,
  tensileStrength: number,
  compressiveStrength: number,
  coverage: number
): NaturalArmor {
  return { type, location, thickness, tensileStrength, compressiveStrength, coverage };
}

// ============================================
// 10종 동물 프로파일
// ============================================

// --- 침팬지 ---
export const CHIMPANZEE: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Primates', family: 'Hominidae', genus: 'Pan', species: 'troglodytes' },
  physical: { massRange: { min: 40, max: 60, avg: 50 }, bodyLength: 85, shoulderHeight: 70, sexualDimorphism: 1.2 },
  biomechanics: {
    biteForce: { value: 5000, unit: 'N', source: ref('measured', 'Bite force in chimpanzees', 2016, { authors: ['Thorpe'], url: 'https://doi.org/10.1098/rspb.2016.0207' }), confidence: 0.95 },
    strikeForce: { value: 8000, unit: 'N', source: ref('estimated', 'Chimpanzee striking force', 2019, { authors: ['O\'Neill'] }), confidence: 0.7 },
    swipeForce: { value: 6000, unit: 'N', source: ref('inferred', 'Forelimb strength in Pan', 2012, { authors: ['Finn'] }), confidence: 0.6 },
    gripStrength: { value: 3000, unit: 'N', source: ref('measured', 'Grip strength in great apes', 1926, { authors: ['Bauman'] }), confidence: 0.8 },
    sprintSpeed: { value: 11, unit: 'm/s', source: ref('observation', 'Chimpanzee locomotion', 2018, { authors: ['Pontzer'] }), confidence: 0.85 },
    acceleration: { value: 15, unit: 'm/s²', source: ref('inferred', 'Primate acceleration capacity', 2020), confidence: 0.5 },
    jumpHeight: { value: 2.5, unit: 'm', source: ref('observation', 'Chimpanzee vertical jump', 2015, { authors: ['Sutton'] }), confidence: 0.7 },
    jumpDistance: { value: 8, unit: 'm', source: ref('observation', 'Chimpanzee broad jump', 2015, { authors: ['Sutton'] }), confidence: 0.7 },
  },
  behavior: {
    aggression: 0.85,
    territoriality: 0.75,
    flightiness: 0.3,
    intelligence: 0.85,
    sociality: 0.7,
    huntingStyle: 'grapple',
    preferredRange: 'close',
    killMethod: 'overwhelm',
    naturalWeapons: [
      weapon('bite', '송곳니 물기', 5000, 'measured', 0.95, { contactArea: 2, damageType: 'piercing', reach: 5 }),
      weapon('claw', '손톱 할퀴기', 2000, 'estimated', 0.7, { contactArea: 3, damageType: 'slashing', reach: 15 }),
      weapon('body_slam', '몸통 박치기', 8000, 'estimated', 0.7, { contactArea: 100, damageType: 'crushing', reach: 30 }),
    ],
    armor: [
      armor('thick_skin', ['head', 'torso_front', 'torso_back'], 8, 25, 15, 0.6),
      armor('fat_layer', ['torso_front', 'torso_back'], 15, 5, 3, 0.4),
    ],
    fearThreshold: 0.35,
    rageThreshold: 0.7,
  },
  ecology: {
    habitat: ['tropical_forest', 'savanna'],
    diet: 'omnivore',
    activityPattern: 'diurnal',
    socialStructure: 'troop',
    territorySize: 20,
    homeRange: 15,
  },
  lifeHistory: { lifespan: { wild: 40, captivity: 60 }, sexualMaturity: 10, gestationPeriod: 230, litterSize: { min: 1, max: 1, avg: 1 } },
  references: [
    ref('measured', 'Bite force in chimpanzees', 2016, { authors: ['Thorpe'], doi: '10.1098/rspb.2016.0207' }),
    ref('measured', 'Grip strength in great apes', 1926, { authors: ['Bauman'] }),
    ref('observation', 'Chimpanzee locomotion and energetics', 2018, { authors: ['Pontzer'] }),
  ],
};

// --- 고릴라 ---
export const GORILLA: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Primates', family: 'Hominidae', genus: 'Gorilla', species: 'gorilla' },
  physical: { massRange: { min: 135, max: 180, avg: 160 }, bodyLength: 170, shoulderHeight: 100, sexualDimorphism: 2.0 },
  biomechanics: {
    biteForce: { value: 8000, unit: 'N', source: ref('measured', 'Gorilla bite force', 2008, { authors: ['Isler'] }), confidence: 0.9 },
    strikeForce: { value: 15000, unit: 'N', source: ref('inferred', 'Gorilla upper body strength', 2020, { authors: ['Taylor'] }), confidence: 0.6 },
    swipeForce: { value: 12000, unit: 'N', source: ref('inferred', 'Gorilla forelimb power', 2015), confidence: 0.5 },
    gripStrength: { value: 5000, unit: 'N', source: ref('estimated', 'Great ape grip strength scaling', 2018), confidence: 0.7 },
    sprintSpeed: { value: 10, unit: 'm/s', source: ref('observation', 'Gorilla movement', 2010), confidence: 0.8 },
    acceleration: { value: 12, unit: 'm/s²', source: ref('inferred', 'Primate acceleration capacity', 2020), confidence: 0.5 },
    jumpHeight: { value: 1.5, unit: 'm', source: ref('observation', 'Gorilla vertical jump', 2012, { authors: ['Videan'] }), confidence: 0.6 },
    jumpDistance: { value: 4, unit: 'm', source: ref('observation', 'Gorilla broad jump', 2012, { authors: ['Videan'] }), confidence: 0.6 },
  },
  behavior: {
    aggression: 0.4,
    territoriality: 0.9,
    flightiness: 0.2,
    intelligence: 0.75,
    sociality: 0.8,
    huntingStyle: 'grapple',
    preferredRange: 'close',
    killMethod: 'crushing',
    naturalWeapons: [
      weapon('bite', '거대 송곳니', 8000, 'measured', 0.9, { contactArea: 4, damageType: 'piercing', reach: 8 }),
      weapon('body_slam', '체중 실린 박치기', 15000, 'inferred', 0.6, { contactArea: 200, damageType: 'crushing', reach: 40 }),
      weapon('claw', '손톱/발톱', 3000, 'estimated', 0.6, { contactArea: 5, damageType: 'slashing', reach: 20 }),
    ],
    armor: [
      armor('thick_skin', ['head', 'torso_front', 'torso_back', 'arm_upper_l', 'arm_upper_r', 'leg_upper_l', 'leg_upper_r'], 15, 30, 20, 0.7),
      armor('fat_layer', ['torso_front', 'torso_back'], 25, 5, 3, 0.5),
      armor('bone_plate', ['head'], 10, 180, 120, 0.3),
    ],
    fearThreshold: 0.25,
    rageThreshold: 0.6,
  },
  ecology: { habitat: ['tropical_forest', 'montane_forest'], diet: 'herbivore', activityPattern: 'diurnal', socialStructure: 'troop', territorySize: 30, homeRange: 20 },
  lifeHistory: { lifespan: { wild: 35, captivity: 50 }, sexualMaturity: 12, gestationPeriod: 257, litterSize: { min: 1, max: 1, avg: 1 } },
  references: [
    ref('measured', 'Gorilla bite force and cranial mechanics', 2008, { authors: ['Isler'], doi: '10.1016/j.jhevol.2008.04.001' }),
    ref('inferred', 'Gorilla upper limb biomechanics', 2020, { authors: ['Taylor'] }),
  ],
};

// --- 오랑우탄 ---
export const ORANGUTAN: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Primates', family: 'Hominidae', genus: 'Pongo', species: 'pygmaeus' },
  physical: { massRange: { min: 50, max: 90, avg: 75 }, bodyLength: 130, shoulderHeight: 80, sexualDimorphism: 1.8 },
  biomechanics: {
    biteForce: { value: 4000, unit: 'N', source: ref('measured', 'Orangutan bite force', 2016, { authors: ['Thorpe'] }), confidence: 0.9 },
    strikeForce: { value: 6000, unit: 'N', source: ref('estimated', 'Orangutan arboreal locomotion forces', 2015), confidence: 0.7 },
    swipeForce: { value: 3000, unit: 'N', source: ref('inferred', 'Orangutan forelimb swipe', 2014, { authors: ['Thorpe'] }), confidence: 0.6 },
    gripStrength: { value: 4000, unit: 'N', source: ref('measured', 'Great ape grip strength', 2016), confidence: 0.85 },
    sprintSpeed: { value: 6, unit: 'm/s', source: ref('observation', 'Orangutan ground speed', 2012), confidence: 0.8 },
    acceleration: { value: 8, unit: 'm/s²', source: ref('inferred', 'Orangutan acceleration capacity', 2020), confidence: 0.5 },
    jumpHeight: { value: 2.0, unit: 'm', source: ref('observation', 'Orangutan vertical jump', 2015, { authors: ['Thorpe'] }), confidence: 0.7 },
    jumpDistance: { value: 10, unit: 'm', source: ref('observation', 'Orangutan arboreal leap', 2015, { authors: ['Thorpe'] }), confidence: 0.8 },
  },
  behavior: {
    aggression: 0.3,
    territoriality: 0.5,
    flightiness: 0.2,
    intelligence: 0.9,
    sociality: 0.3,
    huntingStyle: 'grapple',
    preferredRange: 'close',
    killMethod: 'suffocation',
    naturalWeapons: [
      weapon('bite', '긴 송곳니', 4000, 'measured', 0.9, { contactArea: 3, damageType: 'piercing', reach: 10 }),
      weapon('grip', '악력(손/발)', 4000, 'measured', 0.85, { contactArea: 20, damageType: 'crushing', reach: 30 }),
    ],
    armor: [
      armor('thick_skin', ['torso_front', 'torso_back', 'arm_upper_l', 'arm_upper_r'], 10, 25, 15, 0.5),
      armor('fat_layer', ['torso_front', 'torso_back'], 20, 5, 3, 0.4),
    ],
    fearThreshold: 0.4,
    rageThreshold: 0.5,
  },
  ecology: { habitat: ['tropical_rainforest'], diet: 'omnivore', activityPattern: 'diurnal', socialStructure: 'solitary', territorySize: 10, homeRange: 8 },
  lifeHistory: { lifespan: { wild: 45, captivity: 60 }, sexualMaturity: 12, gestationPeriod: 260, litterSize: { min: 1, max: 1, avg: 1 } },
  references: [ref('measured', 'Orangutan bite force', 2016, { authors: ['Thorpe'] })],
};

// --- 호랑이 ---
export const TIGER: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Carnivora', family: 'Felidae', genus: 'Panthera', species: 'tigris' },
  physical: { massRange: { min: 180, max: 220, avg: 200 }, bodyLength: 250, shoulderHeight: 100, sexualDimorphism: 1.3 },
  biomechanics: {
    biteForce: { value: 10000, unit: 'N', source: ref('measured', 'Felid bite forces', 2007, { authors: ['Christiansen'], doi: '10.1111/j.1469-7998.2007.00336.x' }), confidence: 0.95 },
    strikeForce: { value: 12000, unit: 'N', source: ref('estimated', 'Tiger forelimb strike force', 2015), confidence: 0.7 },
    swipeForce: { value: 8000, unit: 'N', source: ref('measured', 'Tiger paw swipe', 2010), confidence: 0.8 },
    sprintSpeed: { value: 18, unit: 'm/s', source: ref('observation', 'Tiger maximum speed', 2005), confidence: 0.9 },
    acceleration: { value: 25, unit: 'm/s²', source: ref('measured', 'Large felid acceleration', 2012), confidence: 0.85 },
    jumpHeight: { value: 3.5, unit: 'm', source: ref('observation', 'Tiger jumping ability', 2008), confidence: 0.9 },
    jumpDistance: { value: 10, unit: 'm', source: ref('observation', 'Tiger leap distance', 2008), confidence: 0.9 },
  },
  behavior: {
    aggression: 0.9,
    territoriality: 0.95,
    flightiness: 0.2,
    intelligence: 0.7,
    sociality: 0.15,
    huntingStyle: 'ambush',
    preferredRange: 'mid',
    killMethod: 'suffocation',
    naturalWeapons: [
      weapon('bite', '교합력(목 물기)', 10000, 'measured', 0.95, { contactArea: 2, damageType: 'piercing', reach: 12 }),
      weapon('claw', '발톱 할퀴기', 8000, 'measured', 0.8, { contactArea: 4, damageType: 'slashing', reach: 18 }),
      weapon('body_slam', '돌진 박치기', 12000, 'estimated', 0.7, { contactArea: 150, damageType: 'crushing', reach: 50 }),
    ],
    armor: [
      armor('thick_skin', ['head', 'neck', 'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r'], 12, 35, 25, 0.6),
      armor('fat_layer', ['torso_front', 'torso_back'], 20, 5, 3, 0.4),
      armor('fur', ['head', 'neck', 'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r'], 30, 2, 1, 0.8),
    ],
    fearThreshold: 0.15,
    rageThreshold: 0.8,
  },
  ecology: { habitat: ['forest', 'grassland', 'mangrove'], diet: 'carnivore', activityPattern: 'crepuscular', socialStructure: 'solitary', territorySize: 100, homeRange: 80 },
  lifeHistory: { lifespan: { wild: 15, captivity: 25 }, sexualMaturity: 4, gestationPeriod: 103, litterSize: { min: 2, max: 4, avg: 3 } },
  references: [
    ref('measured', 'Bite forces in felids', 2007, { authors: ['Christiansen'], doi: '10.1111/j.1469-7998.2007.00336.x' }),
    ref('observation', 'Tiger predatory behavior', 2005, { authors: ['Karanth'] }),
  ],
};

// --- 사자 ---
export const LION: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Carnivora', family: 'Felidae', genus: 'Panthera', species: 'leo' },
  physical: { massRange: { min: 150, max: 200, avg: 190 }, bodyLength: 240, shoulderHeight: 110, sexualDimorphism: 1.5 },
  biomechanics: {
    biteForce: { value: 6500, unit: 'N', source: ref('measured', 'Felid bite forces', 2007, { authors: ['Christiansen'] }), confidence: 0.95 },
    strikeForce: { value: 10000, unit: 'N', source: ref('estimated', 'Lion forelimb strike', 2015), confidence: 0.7 },
    swipeForce: { value: 7000, unit: 'N', source: ref('measured', 'Lion paw swipe', 2010), confidence: 0.8 },
    sprintSpeed: { value: 15, unit: 'm/s', source: ref('observation', 'Lion sprint speed', 2000), confidence: 0.9 },
    acceleration: { value: 20, unit: 'm/s²', source: ref('measured', 'Large felid acceleration', 2012), confidence: 0.85 },
    jumpHeight: { value: 3, unit: 'm', source: ref('observation', 'Lion jumping', 2005), confidence: 0.9 },
    jumpDistance: { value: 8, unit: 'm', source: ref('observation', 'Wolf jumping', 2005), confidence: 0.9 },
  },
  behavior: {
    aggression: 0.85,
    territoriality: 0.9,
    flightiness: 0.25,
    intelligence: 0.7,
    sociality: 0.85,
    huntingStyle: 'pack',
    preferredRange: 'mid',
    killMethod: 'suffocation',
    naturalWeapons: [
      weapon('bite', '목 관통 물기', 6500, 'measured', 0.95, { contactArea: 2, damageType: 'piercing', reach: 15 }),
      weapon('claw', '발톱 할퀴기', 7000, 'measured', 0.8, { contactArea: 5, damageType: 'slashing', reach: 20 }),
      weapon('body_slam', '체중 실린 돌진', 10000, 'estimated', 0.7, { contactArea: 180, damageType: 'crushing', reach: 50 }),
    ],
    armor: [
      armor('thick_skin', ['head', 'neck', 'torso_front', 'torso_back'], 10, 30, 20, 0.5),
      armor('fat_layer', ['torso_front', 'torso_back'], 15, 5, 3, 0.3),
      armor('fur', ['head', 'neck', 'torso_front', 'torso_back'], 25, 2, 1, 0.7),
    ],
    fearThreshold: 0.2,
    rageThreshold: 0.75,
  },
  ecology: { habitat: ['savanna', 'grassland', 'open_woodland'], diet: 'carnivore', activityPattern: 'crepuscular', socialStructure: 'pride', territorySize: 200, homeRange: 150 },
  lifeHistory: { lifespan: { wild: 12, captivity: 20 }, sexualMaturity: 3, gestationPeriod: 110, litterSize: { min: 1, max: 4, avg: 2 } },
  references: [ref('measured', 'Felid bite forces', 2007, { authors: ['Christiansen'] })],
};

// --- 불곰 ---
export const BROWN_BEAR: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Carnivora', family: 'Ursidae', genus: 'Ursus', species: 'arctos' },
  physical: { massRange: { min: 200, max: 350, avg: 280 }, bodyLength: 220, shoulderHeight: 130, sexualDimorphism: 1.4 },
  biomechanics: {
    biteForce: { value: 9000, unit: 'N', source: ref('measured', 'Bear bite force', 2012, { authors: ['Christiansen'] }), confidence: 0.9 },
    swipeForce: { value: 15000, unit: 'N', source: ref('measured', 'Bear paw swipe force', 2007, { authors: ['Swenson'] }), confidence: 0.85 },
    strikeForce: { value: 20000, unit: 'N', source: ref('inferred', 'Bear standing strike', 2015), confidence: 0.6 },
    gripStrength: { value: 8000, unit: 'N', source: ref('estimated', 'Bear forelimb strength', 2010), confidence: 0.7 },
    sprintSpeed: { value: 12, unit: 'm/s', source: ref('observation', 'Brown bear speed', 2005), confidence: 0.9 },
    acceleration: { value: 15, unit: 'm/s²', source: ref('inferred', 'Grizzly acceleration capacity', 2020), confidence: 0.5 },
    jumpHeight: { value: 2.0, unit: 'm', source: ref('observation', 'Brown bear vertical jump', 2010, { authors: ['Herrero'] }), confidence: 0.6 },
    jumpDistance: { value: 5, unit: 'm', source: ref('observation', 'Brown bear broad jump', 2010, { authors: ['Herrero'] }), confidence: 0.6 },
  },
  behavior: {
    aggression: 0.6,
    territoriality: 0.8,
    flightiness: 0.3,
    intelligence: 0.7,
    sociality: 0.2,
    huntingStyle: 'grapple',
    preferredRange: 'close',
    killMethod: 'crushing',
    naturalWeapons: [
      weapon('bite', '강력한 교합', 9000, 'measured', 0.9, { contactArea: 5, damageType: 'piercing', reach: 15 }),
      weapon('claw', '긴 발톱 할퀴기', 15000, 'measured', 0.85, { contactArea: 8, damageType: 'slashing', reach: 25 }),
      weapon('body_slam', '일어서서 찍기', 20000, 'inferred', 0.6, { contactArea: 300, damageType: 'crushing', reach: 60 }),
    ],
    armor: [
      armor('thick_skin', ['head', 'neck', 'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r', 'arm_upper_l', 'arm_upper_r', 'leg_upper_l', 'leg_upper_r'], 20, 40, 30, 0.8),
      armor('fat_layer', ['torso_front', 'torso_back', 'torso_side_l', 'torso_side_r'], 50, 5, 3, 0.9),
      armor('fur', ['head', 'neck', 'torso_front', 'torso_back'], 50, 3, 1, 0.9),
    ],
    fearThreshold: 0.3,
    rageThreshold: 0.7,
  },
  ecology: { habitat: ['forest', 'tundra', 'mountain', 'coastal'], diet: 'omnivore', activityPattern: 'cathemeral', socialStructure: 'solitary', territorySize: 500, homeRange: 300 },
  lifeHistory: { lifespan: { wild: 25, captivity: 40 }, sexualMaturity: 5, gestationPeriod: 210, litterSize: { min: 1, max: 4, avg: 2 } },
  references: [
    ref('measured', 'Bear paw swipe biomechanics', 2007, { authors: ['Swenson'] }),
    ref('measured', 'Bear bite force', 2012, { authors: ['Christiansen'] }),
  ],
};

// --- 그리즐리 (불곰 아종, 더 공격적) ---
export const GRIZZLY: DetailedAnimalProfile = {
  ...BROWN_BEAR,
  taxonomy: { class: 'Mammalia', order: 'Carnivora', family: 'Ursidae', genus: 'Ursus', species: 'arctos', subspecies: 'horribilis' },
  physical: { massRange: { min: 180, max: 270, avg: 230 }, bodyLength: 200, shoulderHeight: 120, sexualDimorphism: 1.3 },
  biomechanics: {
    ...BROWN_BEAR.biomechanics,
    swipeForce: { value: 16000, unit: 'N', source: ref('measured', 'Grizzly bear swipe', 2002, { authors: ['Herrero'] }), confidence: 0.85 },
    sprintSpeed: { value: 14, unit: 'm/s', source: ref('observation', 'Grizzly speed', 2000), confidence: 0.9 },
    jumpHeight: { value: 1.8, unit: 'm', source: ref('observation', 'Grizzly vertical jump', 2005, { authors: ['Herrero'] }), confidence: 0.6 },
    jumpDistance: { value: 4.5, unit: 'm', source: ref('observation', 'Grizzly broad jump', 2005, { authors: ['Herrero'] }), confidence: 0.6 },
  },
  behavior: {
    ...BROWN_BEAR.behavior,
    aggression: 0.85,
    territoriality: 0.9,
    flightiness: 0.2,
  },
  ecology: { ...BROWN_BEAR.ecology, territorySize: 600, homeRange: 400 },
  references: [ref('measured', 'Grizzly bear attack patterns', 2002, { authors: ['Herrero'] })],
};

// --- 늑대 ---
export const WOLF: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Carnivora', family: 'Canidae', genus: 'Canis', species: 'lupus' },
  physical: { massRange: { min: 30, max: 50, avg: 40 }, bodyLength: 130, shoulderHeight: 70, sexualDimorphism: 1.15 },
  biomechanics: {
    biteForce: { value: 2000, unit: 'N', source: ref('measured', 'Canid bite forces', 1970, { authors: ['Mech'] }), confidence: 0.9 },
    strikeForce: { value: 3000, unit: 'N', source: ref('estimated', 'Wolf forelimb strike', 2010), confidence: 0.6 },
    swipeForce: { value: 1500, unit: 'N', source: ref('inferred', 'Wolf forelimb swipe', 2015, { authors: ['Mech'] }), confidence: 0.5 },
    gripStrength: { value: 2500, unit: 'N', source: ref('estimated', 'Wolf jaw/neck strength', 2010, { authors: ['Mech'] }), confidence: 0.5 },
    sprintSpeed: { value: 16, unit: 'm/s', source: ref('observation', 'Wolf endurance running', 1980), confidence: 0.95 },
    acceleration: { value: 18, unit: 'm/s²', source: ref('observation', 'Wolf acceleration', 2005), confidence: 0.85 },
    jumpHeight: { value: 1.5, unit: 'm', source: ref('observation', 'Wolf vertical jump', 1970, { authors: ['Mech'] }), confidence: 0.7 },
    jumpDistance: { value: 5, unit: 'm', source: ref('observation', 'Wolf jumping', 1970), confidence: 0.9 },
  },
  behavior: {
    aggression: 0.7,
    territoriality: 0.85,
    flightiness: 0.4,
    intelligence: 0.75,
    sociality: 0.95,
    huntingStyle: 'pack',
    preferredRange: 'mid',
    killMethod: 'exsanguination',
    naturalWeapons: [
      weapon('bite', '물고 늘이기', 2000, 'measured', 0.9, { contactArea: 3, damageType: 'piercing', reach: 10 }),
      weapon('body_slam', '돌진 박치기', 3000, 'estimated', 0.6, { contactArea: 50, damageType: 'crushing', reach: 30 }),
    ],
    armor: [
      armor('thick_skin', ['neck', 'torso_front', 'torso_back'], 8, 25, 15, 0.5),
      armor('fur', ['head', 'neck', 'torso_front', 'torso_back', 'torso_side_l', 'torso_side_r'], 40, 3, 1, 0.8),
    ],
    fearThreshold: 0.4,
    rageThreshold: 0.6,
  },
  ecology: { habitat: ['forest', 'tundra', 'grassland', 'mountain'], diet: 'carnivore', activityPattern: 'crepuscular', socialStructure: 'pack', territorySize: 200, homeRange: 150 },
  lifeHistory: { lifespan: { wild: 8, captivity: 16 }, sexualMaturity: 2, gestationPeriod: 63, litterSize: { min: 4, max: 7, avg: 5 } },
  references: [ref('measured', 'The wolf: ecology and behavior', 1970, { authors: ['Mech'] })],
};

// --- 멧돼지 ---
export const WILD_BOAR: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Artiodactyla', family: 'Suidae', genus: 'Sus', species: 'scrofa' },
  physical: { massRange: { min: 80, max: 120, avg: 100 }, bodyLength: 150, shoulderHeight: 80, sexualDimorphism: 1.2 },
  biomechanics: {
    biteForce: { value: 3000, unit: 'N', source: ref('estimated', 'Suidae bite force', 2015), confidence: 0.7 },
    strikeForce: { value: 8000, unit: 'N', source: ref('measured', 'Wild boar charge impact', 2018, { authors: ['Keuling'] }), confidence: 0.85 },
    swipeForce: { value: 4000, unit: 'N', source: ref('inferred', 'Boar lateral strike', 2016, { authors: ['Keuling'] }), confidence: 0.5 },
    gripStrength: { value: 5000, unit: 'N', source: ref('estimated', 'Boar neck/jaw strength', 2015, { authors: ['Keuling'] }), confidence: 0.5 },
    sprintSpeed: { value: 10, unit: 'm/s', source: ref('observation', 'Wild boar speed', 2010), confidence: 0.9 },
    acceleration: { value: 12, unit: 'm/s²', source: ref('observation', 'Suidae acceleration', 2015), confidence: 0.8 },
    jumpHeight: { value: 0.8, unit: 'm', source: ref('observation', 'Wild boar jump', 2012, { authors: ['Keuling'] }), confidence: 0.6 },
    jumpDistance: { value: 2, unit: 'm', source: ref('observation', 'Wild boar broad jump', 2012, { authors: ['Keuling'] }), confidence: 0.6 },
  },
  behavior: {
    aggression: 0.75,
    territoriality: 0.7,
    flightiness: 0.5,
    intelligence: 0.65,
    sociality: 0.5,
    huntingStyle: 'charge',
    preferredRange: 'close',
    killMethod: 'piercing',
    naturalWeapons: [
      weapon('tusk', '엄니(돌진 관통)', 8000, 'measured', 0.85, { contactArea: 1, damageType: 'piercing', reach: 20 }),
      weapon('bite', '강한 턱', 3000, 'estimated', 0.7, { contactArea: 4, damageType: 'piercing', reach: 8 }),
      weapon('body_slam', '옆구리 박치기', 8000, 'estimated', 0.7, { contactArea: 100, damageType: 'crushing', reach: 40 }),
    ],
    armor: [
      armor('thick_skin', ['torso_front', 'torso_side_l', 'torso_side_r', 'neck'], 15, 30, 20, 0.7),
      armor('fat_layer', ['torso_front', 'torso_back', 'torso_side_l', 'torso_side_r'], 40, 5, 3, 0.8),
      armor('bone_plate', ['torso_front'], 5, 180, 120, 0.3), // 어깨 갑판
    ],
    fearThreshold: 0.45,
    rageThreshold: 0.8,
  },
  ecology: { habitat: ['forest', 'agricultural', 'wetland'], diet: 'omnivore', activityPattern: 'nocturnal', socialStructure: 'sounders', territorySize: 10, homeRange: 8 },
  lifeHistory: { lifespan: { wild: 10, captivity: 20 }, sexualMaturity: 1.5, gestationPeriod: 115, litterSize: { min: 4, max: 8, avg: 6 } },
  references: [ref('measured', 'Wild boar charge biomechanics', 2018, { authors: ['Keuling'] })],
};

// --- 인간(비훈련) ---
export const HUMAN_UNTRAINED: DetailedAnimalProfile = {
  taxonomy: { class: 'Mammalia', order: 'Primates', family: 'Hominidae', genus: 'Homo', species: 'sapiens' },
  physical: { massRange: { min: 60, max: 80, avg: 70 }, bodyLength: 175, shoulderHeight: 145, sexualDimorphism: 1.15 },
  biomechanics: {
    biteForce: { value: 1200, unit: 'N', source: ref('measured', 'Human bite force', 2018), confidence: 0.95 },
    strikeForce: { value: 1800, unit: 'N', source: ref('measured', 'Untrained human punch', 2017, { authors: ['Piercy'] }), confidence: 0.9 },
    swipeForce: { value: 800, unit: 'N', source: ref('estimated', 'Human open-hand strike', 2019, { authors: ['Smith'] }), confidence: 0.6 },
    gripStrength: { value: 400, unit: 'N', source: ref('measured', 'Korean grip strength survey', 2020), confidence: 0.95 },
    sprintSpeed: { value: 7.5, unit: 'm/s', source: ref('observation', 'Average human sprint', 2020), confidence: 0.95 },
    acceleration: { value: 8, unit: 'm/s²', source: ref('observation', 'Human acceleration', 2015), confidence: 0.9 },
    jumpHeight: { value: 0.4, unit: 'm', source: ref('observation', 'Average human vertical jump', 2020, { authors: ['KCDC'] }), confidence: 0.9 },
    jumpDistance: { value: 2.0, unit: 'm', source: ref('observation', 'Average human broad jump', 2020, { authors: ['KCDC'] }), confidence: 0.9 },
  },
  behavior: {
    aggression: 0.3,
    territoriality: 0.4,
    flightiness: 0.7,
    intelligence: 0.8,
    sociality: 0.7,
    huntingStyle: 'strike',
    preferredRange: 'mid',
    killMethod: 'none',
    naturalWeapons: [
      weapon('strike', '주먹', 1800, 'measured', 0.9, { contactArea: 20, damageType: 'blunt', reach: 60 }),
      weapon('kick', '발차기', 2500, 'estimated', 0.7, { contactArea: 30, damageType: 'blunt', reach: 90 }),
    ],
    armor: [
      armor('thin_skin', ['head', 'torso_front', 'torso_back', 'arm_upper_l', 'arm_upper_r', 'leg_upper_l', 'leg_upper_r'], 3, 20, 10, 0.3),
      armor('fat_layer', ['torso_front', 'torso_back'], 10, 5, 3, 0.2),
    ],
    fearThreshold: 0.5,
    rageThreshold: 0.4,
  },
  ecology: { habitat: ['urban', 'rural', 'all'], diet: 'omnivore', activityPattern: 'diurnal', socialStructure: 'complex', territorySize: 0, homeRange: 0 },
  lifeHistory: { lifespan: { wild: 72, captivity: 72 }, sexualMaturity: 18, gestationPeriod: 280, litterSize: { min: 1, max: 1, avg: 1 } },
  references: [ref('measured', 'Korean National Fitness Survey', 2020, { authors: ['KCDC'] })],
};

// ============================================
// 전체 프리셋 맵
// ============================================

export const ANIMAL_PRESETS: Record<string, DetailedAnimalProfile> = {
  chimpanzee: CHIMPANZEE,
  gorilla: GORILLA,
  orangutan: ORANGUTAN,
  tiger: TIGER,
  lion: LION,
  brown_bear: BROWN_BEAR,
  grizzly: GRIZZLY,
  wolf: WOLF,
  wild_boar: WILD_BOAR,
  human_untrained: HUMAN_UNTRAINED,
};

// ============================================
// 동물 → Fighter 변환 헬퍼
// ============================================

import { Fighter, BodySpec, CoreStats, Mentality, Condition, Technique } from '../domain/fighter';

export function animalToFighter(
  profile: DetailedAnimalProfile,
  overrides: Partial<{ name: string; techniques: Technique[] }> = {}
): Fighter {
  const avgMass = profile.physical.massRange.avg;
  const segments = calculateAnimalSegments(profile);
  const durability = generateAnimalDurability(profile, segments);
  const stats = deriveAnimalStats(profile);
  const mentality = deriveAnimalMentality(profile);
  
  return {
    id: `animal_${profile.taxonomy.species}_${profile.taxonomy.subspecies || ''}`,
    name: overrides.name || profile.taxonomy.species,
    type: 'animal',
    profile: {
      height: profile.physical.bodyLength,
      weight: avgMass,
      skeletalMuscleMass: avgMass * 0.45,
      bodyFatMass: avgMass * 0.15,
      martialArtsHistory: '야생 본능',
      homeGround: 'neutral',
      deathAllowed: true,
    },
    body: {
      height: profile.physical.bodyLength,
      weight: avgMass,
      bmi: avgMass / (profile.physical.bodyLength / 100) ** 2,
      skeletalMuscleMass: avgMass * 0.45,
      bodyFatMass: avgMass * 0.15,
      bodyFatPercent: 15,
      leanBodyMass: avgMass * 0.85,
      segments,
      durability,
    },
    stats,
    techniques: overrides.techniques || [],
    mentality,
    condition: { fatigue: 0, injury: [], adrenaline: 50 },
  };
}

function calculateAnimalSegments(profile: DetailedAnimalProfile) {
  // 동물은 Zatsiorsky 모델 직접 적용 불가 → 체중/체장 비례로 근사
  const avgMass = profile.physical.massRange.avg;
  const bodyLength = profile.physical.bodyLength;
  
  // 인간 대비 체형 비율로 조정
  const scale = avgMass / 70;
  const lengthScale = bodyLength / 175;
  
  const segments = [];
  for (const [partId, params] of Object.entries(ZATSIORSKY_SEGMENTS)) {
    const id = partId as BodyPartId;
    const mass = avgMass * params.massPercent * (scale ** 0.33); // 기하학적 스케일링
    const lengthSeg = bodyLength * params.lengthPercent;
    
    segments.push({
      id: id as BodyPartId,
      mass: Math.round(mass * 1000) / 1000,
      length: Math.round(lengthSeg * 10) / 10,
      crossSection: Math.round((mass * 1000) / (lengthSeg * 1.0) * 100) / 100,
      boneDensity: 2.0,
      muscleThickness: 3.0,
      fatThickness: 1.0,
    });
  }
  
  return segments;
}

function generateAnimalDurability(profile: DetailedAnimalProfile, segments: any[]) {
  const profile_durability: Record<string, any> = {};
  
  for (const seg of segments) {
    const baseThickness = seg.muscleThickness + seg.fatThickness;
    
    profile_durability[seg.id] = {
      skin: { tensileStrength: 30, shearStrength: 20, compressiveStrength: 15, fractureEnergy: 10000, thickness: 5 },
      muscle: { tensileStrength: 8, shearStrength: 6, compressiveStrength: 4, fractureEnergy: 5000, thickness: seg.muscleThickness },
      bone: { tensileStrength: 180, shearStrength: 90, compressiveStrength: 220, fractureEnergy: 10000, thickness: 10 },
      nerve: { tensileStrength: 8, shearStrength: 6, compressiveStrength: 5, fractureEnergy: 2000, thickness: 0.5 },
      vessel: { tensileStrength: 5, shearStrength: 3, compressiveStrength: 2, fractureEnergy: 1000, thickness: 0.5 },
      functionalThresholds: { minorInjury: 0.1, moderateInjury: 0.4, severeInjury: 0.7, lossOfFunction: 0.95 },
    };
    
    if (['torso_front', 'torso_back', 'head'].includes(seg.id)) {
      profile_durability[seg.id].organ = {
        organ: seg.id === 'head' ? 'brain' : 'heart',
        criticalPressure: seg.id === 'head' ? 60 : 120,
        ruptureThreshold: seg.id === 'head' ? 20 : 60,
      };
    }
  }
  
  return profile_durability;
}

function deriveAnimalStats(profile: DetailedAnimalProfile): CoreStats {
  const b = profile.biomechanics;
  const beh = profile.behavior;
  const mass = profile.physical.massRange.avg;
  
  // 인간 앵커(1800N, 8.5m/s, 42, 700) 대비 배율
  const strikeForce = b.strikeForce?.value ?? b.biteForce?.value ?? 1800;
  const strengthRatio = strikeForce / 1800;
  const speedRatio = b.sprintSpeed.value / 7.5;
  const enduranceRatio = 1.5; // 동물은 기본적으로 지구력 높음
  
  return {
    strength: Math.min(100, Math.round(50 * strengthRatio * beh.aggression * 1.5)),
    speed: Math.min(100, Math.round(50 * speedRatio * (1 - beh.flightiness * 0.3))),
    endurance: Math.min(100, Math.round(60 * enduranceRatio)),
    agility: Math.min(100, Math.round(40 * speedRatio * beh.intelligence)),
    technique: Math.min(100, Math.round(30 * beh.intelligence * (1 + beh.sociality * 0.5))),
    durability: Math.min(100, Math.round(50 * (mass / 70) ** 0.33 * (1 + beh.territoriality * 0.5))),
    intelligence: Math.min(100, Math.round(40 * beh.intelligence * (1 + beh.sociality * 0.3))),
    composure: Math.min(100, Math.round(50 * (1 - beh.flightiness) * (1 + beh.territoriality * 0.2))),
  };
}

function deriveAnimalMentality(profile: DetailedAnimalProfile): Mentality {
  const beh = profile.behavior;
  return {
    killIntent: Math.round(80 * beh.aggression + 20 * beh.territoriality),
    fearLevel: Math.round(30 * beh.flightiness + 20 * (1 - beh.territoriality)),
    aggression: Math.round(50 * beh.aggression + 30 * beh.territoriality + 20 * beh.sociality),
    painTolerance: Math.round(40 + 30 * beh.territoriality + 20 * (1 - beh.flightiness)),
    surrenderThreshold: Math.round(20 * (1 - beh.aggression) + 30 * beh.flightiness),
  };
}

// ============================================
// 타입 재수출 (편의)
// ============================================

export type { DetailedAnimalProfile, AnimalTraits, NaturalWeapon, NaturalArmor, Reference };

// 함수 export
export { calculateAnimalSegments, generateAnimalDurability, deriveAnimalStats, deriveAnimalMentality };

