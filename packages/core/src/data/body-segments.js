"use strict";
// ============================================
// Zatsiorsky-Seluyanov 체세그먼트 파라미터 (남성 기준)
// 출처: Zatsiorsky & Seluyanov (1983), "The mass and inertia characteristics of the human body"
// 한국인 적용을 위해 질량/길이 비율만 사용, 절대값은 입력 신체스펙에서 계산
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEGMENT_FAT_DISTRIBUTION = exports.SEGMENT_MUSCLE_DISTRIBUTION = exports.KOREAN_ADJUSTMENT = exports.ZATSIORSKY_SEGMENTS = void 0;
exports.calculateBodySegments = calculateBodySegments;
exports.deriveBodySpec = deriveBodySpec;
// 18개 세그먼트 파라미터 (Zatsiorsky 남성 데이터 + groin)
// 여성은 massPercent × 0.95, lengthPercent × 0.98 보정 적용
exports.ZATSIORSKY_SEGMENTS = {
    head: {
        massPercent: 0.073,
        lengthPercent: 0.130,
        comPosition: 0.55,
        radiusGyration: 0.30,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    neck: {
        massPercent: 0.017,
        lengthPercent: 0.070,
        comPosition: 0.50,
        radiusGyration: 0.40,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    torso_front: {
        massPercent: 0.160,
        lengthPercent: 0.300,
        comPosition: 0.45,
        radiusGyration: 0.35,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    torso_back: {
        massPercent: 0.160,
        lengthPercent: 0.300,
        comPosition: 0.45,
        radiusGyration: 0.35,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    torso_side_l: {
        massPercent: 0.040,
        lengthPercent: 0.300,
        comPosition: 0.50,
        radiusGyration: 0.40,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    torso_side_r: {
        massPercent: 0.040,
        lengthPercent: 0.300,
        comPosition: 0.50,
        radiusGyration: 0.40,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    arm_upper_l: {
        massPercent: 0.028,
        lengthPercent: 0.186,
        comPosition: 0.577,
        radiusGyration: 0.322,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    arm_lower_l: {
        massPercent: 0.016,
        lengthPercent: 0.146,
        comPosition: 0.457,
        radiusGyration: 0.303,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    hand_l: {
        massPercent: 0.006,
        lengthPercent: 0.108,
        comPosition: 0.790,
        radiusGyration: 0.285,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    arm_upper_r: {
        massPercent: 0.028,
        lengthPercent: 0.186,
        comPosition: 0.577,
        radiusGyration: 0.322,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    arm_lower_r: {
        massPercent: 0.016,
        lengthPercent: 0.146,
        comPosition: 0.457,
        radiusGyration: 0.303,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    hand_r: {
        massPercent: 0.006,
        lengthPercent: 0.108,
        comPosition: 0.790,
        radiusGyration: 0.285,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    leg_upper_l: {
        massPercent: 0.100,
        lengthPercent: 0.245,
        comPosition: 0.409,
        radiusGyration: 0.326,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    leg_lower_l: {
        massPercent: 0.047,
        lengthPercent: 0.147,
        comPosition: 0.439,
        radiusGyration: 0.416,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    foot_l: {
        massPercent: 0.015,
        lengthPercent: 0.057,
        comPosition: 0.500,
        radiusGyration: 0.475,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    leg_upper_r: {
        massPercent: 0.100,
        lengthPercent: 0.245,
        comPosition: 0.409,
        radiusGyration: 0.326,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    leg_lower_r: {
        massPercent: 0.047,
        lengthPercent: 0.147,
        comPosition: 0.439,
        radiusGyration: 0.416,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    foot_r: {
        massPercent: 0.015,
        lengthPercent: 0.057,
        comPosition: 0.500,
        radiusGyration: 0.475,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
    groin: {
        massPercent: 0.010,
        lengthPercent: 0.040,
        comPosition: 0.50,
        radiusGyration: 0.35,
        density: { muscle: 1.04, fat: 0.92, bone: 1.85 },
    },
};
// groin은 torso에 포함되나 별도 내구도 위해 정의
// ZATSIORSKY_SEGMENTS에 포함됨
// ============================================
// 한국인 보정 계수 (국립과학수사연구원 한국인 인체치수조사 2020 기반)
// ============================================
exports.KOREAN_ADJUSTMENT = {
    male: {
        massFactor: 1.0, // Zatsiorsky 남성 데이터와 유사
        lengthFactor: 1.0,
        boneDensityFactor: 1.02, // 한국인 골밀도 약간 높음
    },
    female: {
        massFactor: 0.93, // 여성 체중 비율 차이
        lengthFactor: 0.97,
        boneDensityFactor: 0.95, // 여성 골밀도 낮음
    },
};
// 세그먼트별 근육/지방 분포 계수 (전체 골격근량/체지방량 배분용)
// 출처: Heymsfield et al. 1990, "Muscle mass distribution in humans"
// 합계 = 1.0로 정규화됨
var RAW_MUSCLE_DISTRIBUTION = {
    head: 0.01,
    neck: 0.015,
    torso_front: 0.18,
    torso_back: 0.20,
    torso_side_l: 0.04,
    torso_side_r: 0.04,
    arm_upper_l: 0.035,
    arm_lower_l: 0.02,
    hand_l: 0.005,
    arm_upper_r: 0.035,
    arm_lower_r: 0.02,
    hand_r: 0.005,
    leg_upper_l: 0.14,
    leg_lower_l: 0.06,
    foot_l: 0.01,
    leg_upper_r: 0.14,
    leg_lower_r: 0.06,
    foot_r: 0.01,
    groin: 0.01,
};
var RAW_FAT_DISTRIBUTION = {
    head: 0.02,
    neck: 0.02,
    torso_front: 0.25,
    torso_back: 0.15,
    torso_side_l: 0.06,
    torso_side_r: 0.06,
    arm_upper_l: 0.03,
    arm_lower_l: 0.02,
    hand_l: 0.005,
    arm_upper_r: 0.03,
    arm_lower_r: 0.02,
    hand_r: 0.005,
    leg_upper_l: 0.12,
    leg_lower_l: 0.04,
    foot_l: 0.01,
    leg_upper_r: 0.12,
    leg_lower_r: 0.04,
    foot_r: 0.01,
    groin: 0.02,
};
// 정규화: 합계 = 1.0
function normalizeDistribution(dist) {
    var sum = Object.values(dist).reduce(function (a, b) { return a + b; }, 0);
    var normalized = {};
    for (var _i = 0, _a = Object.entries(dist); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        normalized[k] = v / sum;
    }
    return normalized;
}
exports.SEGMENT_MUSCLE_DISTRIBUTION = normalizeDistribution(RAW_MUSCLE_DISTRIBUTION);
exports.SEGMENT_FAT_DISTRIBUTION = normalizeDistribution(RAW_FAT_DISTRIBUTION);
function calculateBodySegments(input) {
    var height = input.height, weight = input.weight, skeletalMuscleMass = input.skeletalMuscleMass, bodyFatMass = input.bodyFatMass, age = input.age, sex = input.sex;
    var adjustment = exports.KOREAN_ADJUSTMENT[sex];
    // 연령별 골밀도 보정 (30세 피크, 이후 연 0.5% 감소)
    var boneDensityBase = sex === 'male' ? 1.85 : 1.70; // g/cm³
    var ageFactor = Math.max(0.7, 1 - Math.max(0, age - 30) * 0.005);
    var boneDensity = boneDensityBase * adjustment.boneDensityFactor * ageFactor;
    var segments = [];
    // 표준 18개 세그먼트 (groin 포함)
    for (var _i = 0, _a = Object.entries(exports.ZATSIORSKY_SEGMENTS); _i < _a.length; _i++) {
        var _b = _a[_i], partId = _b[0], params = _b[1];
        var id = partId;
        var mass = weight * params.massPercent * adjustment.massFactor;
        var length_1 = height * params.lengthPercent * adjustment.lengthFactor;
        // 원기둥 근사 단면적: A = mass / (length * density_avg)
        var avgDensity = (params.density.muscle + params.density.fat + params.density.bone) / 3;
        var crossSection = (mass * 1000) / (length_1 * avgDensity); // cm²
        // 근육/지방 두께 추정 (단면적 기준 비례 배분)
        var muscleDist = exports.SEGMENT_MUSCLE_DISTRIBUTION[id] || 0;
        var fatDist = exports.SEGMENT_FAT_DISTRIBUTION[id] || 0;
        var muscleThickness = Math.sqrt(mass * muscleDist * 1000 / (Math.PI * crossSection)) * 10; // mm → cm
        var fatThickness = Math.sqrt(mass * fatDist * 1000 / (Math.PI * crossSection)) * 10;
        segments.push({
            id: id,
            mass: Math.round(mass * 1000) / 1000,
            length: Math.round(length_1 * 10) / 10,
            crossSection: Math.round(crossSection * 100) / 100,
            boneDensity: Math.round(boneDensity * 100) / 100,
            muscleThickness: Math.round(muscleThickness * 100) / 100,
            fatThickness: Math.round(fatThickness * 100) / 100,
        });
    }
    return segments;
}
// ============================================
// BodySpec 전체 생성 (파생 계산 포함)
// ============================================
function deriveBodySpec(input) {
    var height = input.height, weight = input.weight, skeletalMuscleMass = input.skeletalMuscleMass, bodyFatMass = input.bodyFatMass, age = input.age, sex = input.sex;
    var bmi = weight / Math.pow((height / 100), 2);
    var bodyFatPercent = bodyFatMass / weight * 100;
    var leanBodyMass = weight - bodyFatMass;
    var segments = calculateBodySegments(input);
    // 내구도 프로파일 생성 (기본값, 연령/성별/체성분 반영)
    var durability = generateDurabilityProfile(segments, age, sex, bodyFatPercent, skeletalMuscleMass);
    return {
        height: height,
        weight: weight,
        bmi: Math.round(bmi * 10) / 10,
        skeletalMuscleMass: skeletalMuscleMass,
        bodyFatMass: bodyFatMass,
        bodyFatPercent: Math.round(bodyFatPercent * 10) / 10,
        leanBodyMass: Math.round(leanBodyMass * 10) / 10,
        segments: segments,
        durability: durability,
    };
}
function generateDurabilityProfile(segments, age, sex, bodyFatPercent, skeletalMuscleMass) {
    var profile = {};
    var ageFactor = Math.max(0.6, 1 - (age - 20) * 0.01);
    var sexFactor = sex === 'male' ? 1.0 : 0.9;
    var muscleFactor = Math.min(1.3, skeletalMuscleMass / 30);
    var fatFactor = Math.max(0.8, 1 - (bodyFatPercent - 15) * 0.01);
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
        var seg = segments_1[_i];
        var baseThickness = seg.muscleThickness + seg.fatThickness;
        var boneMult = ageFactor * sexFactor * muscleFactor * fatFactor;
        profile[seg.id] = {
            skin: {
                tensileStrength: 20 * ageFactor,
                shearStrength: 15 * ageFactor,
                compressiveStrength: 10 * ageFactor,
                fractureEnergy: 5000 * ageFactor,
                thickness: Math.max(1, seg.fatThickness * 0.3 + 1.5),
            },
            muscle: {
                tensileStrength: 4 * muscleFactor * sexFactor,
                shearStrength: 3 * muscleFactor * sexFactor,
                compressiveStrength: 2 * muscleFactor * sexFactor,
                fractureEnergy: 2000 * muscleFactor,
                thickness: seg.muscleThickness,
            },
            bone: {
                tensileStrength: 130 * boneMult,
                shearStrength: 65 * boneMult,
                compressiveStrength: 170 * boneMult,
                fractureEnergy: 5000 * boneMult,
                thickness: Math.max(3, (seg.crossSection * 0.1) / Math.PI * 2),
            },
            nerve: {
                tensileStrength: 5 * ageFactor,
                shearStrength: 4 * ageFactor,
                compressiveStrength: 3 * ageFactor,
                fractureEnergy: 1000 * ageFactor,
                thickness: 0.5,
            },
            vessel: {
                tensileStrength: 3 * ageFactor,
                shearStrength: 2 * ageFactor,
                compressiveStrength: 1 * ageFactor,
                fractureEnergy: 500 * ageFactor,
                thickness: 0.3,
            },
            functionalThresholds: {
                minorInjury: 0.1,
                moderateInjury: 0.4,
                severeInjury: 0.7,
                lossOfFunction: 0.95,
            },
        };
        // 중요 장기가 있는 부위만 organ 추가
        if (['torso_front', 'torso_back', 'head'].includes(seg.id)) {
            var organ = seg.id === 'head' ? 'brain' :
                seg.id === 'torso_front' ? 'heart' : 'liver';
            profile[seg.id].organ = {
                organ: organ,
                criticalPressure: organ === 'brain' ? 50 : organ === 'heart' ? 100 : 80,
                ruptureThreshold: organ === 'brain' ? 15 : organ === 'heart' ? 50 : 30,
            };
        }
    }
    return profile;
}
//# sourceMappingURL=body-segments.js.map