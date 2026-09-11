"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ART_TECHNIQUE_MAP = exports.ART_ALIASES = exports.ART_STAT_WEIGHTS = void 0;
exports.normalizeArt = normalizeArt;
exports.deriveCoreStats = deriveCoreStats;
exports.getRecommendedTechniques = getRecommendedTechniques;
exports.ART_STAT_WEIGHTS = {
    boxing: {
        strength: 1.05,
        speed: 1.15,
        endurance: 0.95,
        agility: 1.0,
        technique: 1.1,
        durability: 0.9,
        intelligence: 0.85,
        composure: 0.95,
    },
    muaythai: {
        strength: 1.1,
        speed: 1.0,
        endurance: 1.05,
        agility: 1.05,
        technique: 1.0,
        durability: 1.1,
        intelligence: 0.9,
        composure: 0.95,
    },
    bjj: {
        strength: 0.9,
        speed: 0.85,
        endurance: 1.1,
        agility: 1.0,
        technique: 1.25,
        durability: 1.0,
        intelligence: 1.15,
        composure: 1.1,
    },
    wrestling: {
        strength: 1.25,
        speed: 0.9,
        endurance: 1.2,
        agility: 0.95,
        technique: 1.0,
        durability: 1.15,
        intelligence: 0.95,
        composure: 1.0,
    },
    judo: {
        strength: 1.1,
        speed: 0.95,
        endurance: 1.0,
        agility: 1.0,
        technique: 1.15,
        durability: 1.05,
        intelligence: 1.0,
        composure: 1.0,
    },
    tkd: {
        strength: 0.95,
        speed: 1.15,
        endurance: 1.0,
        agility: 1.15,
        technique: 1.05,
        durability: 0.85,
        intelligence: 0.9,
        composure: 0.9,
    },
    kickboxing: {
        strength: 1.05,
        speed: 1.1,
        endurance: 1.0,
        agility: 1.05,
        technique: 1.0,
        durability: 1.0,
        intelligence: 0.9,
        composure: 0.95,
    },
    mma: {
        strength: 1.0,
        speed: 1.0,
        endurance: 1.0,
        agility: 1.0,
        technique: 1.0,
        durability: 1.0,
        intelligence: 1.0,
        composure: 1.0,
    },
    sambo: {
        strength: 1.15,
        speed: 0.95,
        endurance: 1.1,
        agility: 1.0,
        technique: 1.1,
        durability: 1.1,
        intelligence: 0.95,
        composure: 1.0,
    },
    sanda: {
        strength: 1.05,
        speed: 1.05,
        endurance: 1.0,
        agility: 1.05,
        technique: 1.0,
        durability: 1.0,
        intelligence: 0.9,
        composure: 0.95,
    },
    // 기본값 (미분류)
    default: {
        strength: 1.0,
        speed: 1.0,
        endurance: 1.0,
        agility: 1.0,
        technique: 1.0,
        durability: 1.0,
        intelligence: 1.0,
        composure: 1.0,
    },
};
// ============================================
// 종목 정규화 매핑 (자연어 파싱 결과 → 표준 키)
// ============================================
exports.ART_ALIASES = {
    // 복싱
    '복싱': 'boxing',
    'boxing': 'boxing',
    '권투': 'boxing',
    // 무에타이
    '무에타이': 'muaythai',
    'muay thai': 'muaythai',
    'muaythai': 'muaythai',
    '타이복싱': 'muaythai',
    // 주짓수
    '주짓수': 'bjj',
    'bjj': 'bjj',
    '브라질리안 주짓수': 'bjj',
    '브라질 주짓수': 'bjj',
    '그라플링': 'bjj',
    // 레슬링
    '레슬링': 'wrestling',
    'wrestling': 'wrestling',
    '프리레슬링': 'wrestling',
    '그레코로만': 'wrestling',
    // 유도
    '유도': 'judo',
    'judo': 'judo',
    // 태권도
    '태권도': 'tkd',
    'taekwondo': 'tkd',
    'tkd': 'tkd',
    // 킥복싱
    '킥복싱': 'kickboxing',
    'kickboxing': 'kickboxing',
    'kick boxing': 'kickboxing',
    // MMA
    'mma': 'mma',
    '종합격투기': 'mma',
    '종합': 'mma',
    // 삼보
    '삼보': 'sambo',
    'sambo': 'sambo',
    // 산타
    '산타': 'sanda',
    'sanda': 'sanda',
    '산타': 'sanda',
    // 기타
    '킥': 'kickboxing',
    '펀치': 'boxing',
    '그래플링': 'bjj',
    '그라운드': 'bjj',
    '클린치': 'muaythai',
};
function normalizeArt(input) {
    var lower = input.toLowerCase().trim();
    for (var _i = 0, _a = Object.entries(exports.ART_ALIASES); _i < _a.length; _i++) {
        var _b = _a[_i], alias = _b[0], standard = _b[1];
        if (lower.includes(alias.toLowerCase())) {
            return standard;
        }
    }
    return 'mma'; // 기본값
}
// ============================================
// CoreStats 산출 함수
// ============================================
var BMR_MALE = function (weight, height, age) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
};
var BMR_FEMALE = function (weight, height, age) {
    return 10 * weight + 6.25 * height - 5 * age - 161;
};
function deriveCoreStats(input) {
    var height = input.height, weight = input.weight, skeletalMuscleMass = input.skeletalMuscleMass, bodyFatMass = input.bodyFatMass, age = input.age, sex = input.sex, parsedBackground = input.parsedBackground;
    var bmi = weight / Math.pow((height / 100), 2);
    var bodyFatPercent = bodyFatMass / weight * 100;
    var leanBodyMass = weight - bodyFatMass;
    var muscleRatio = skeletalMuscleMass / weight;
    var ffmi = leanBodyMass / Math.pow((height / 100), 2);
    // ===== 연령 보정 (비선형: 30대 완만, 50대 이후 급격 감소) =====
    // 출처: Faulkner et al. 2007 "Age-related muscle loss", Mitchell et al. 2012 "Sarcopenia"
    var ageFactor = function (age) {
        if (age < 30)
            return 1.0;
        if (age < 50)
            return Math.max(0.75, 1 - (age - 30) * 0.012); // 30-50: 연 -1.2%
        return Math.max(0.4, 0.75 - (age - 50) * 0.025); // 50+: 연 -2.5%
    };
    var ageAdj = ageFactor(age);
    // ===== 성별 보정 (부위별 차등: 상체 근력 차이 큼, 하체/지구력 차이 작음) =====
    // 출처: Miller et al. 1993 "Gender differences in strength", Janssen et al. 2000 "Muscle mass distribution"
    var sexFactor = {
        male: {
            strength: 1.0, // 기준
            speed: 1.0,
            endurance: 1.0,
            agility: 1.0,
            durability: 1.0,
        },
        female: {
            strength: 0.65, // 상체 근력 ~65% (Miller 1993)
            speed: 0.85, // 속도 ~85% 
            endurance: 1.1, // 지방 산화 효율 ↑ (Tarnopolsky 2000)
            agility: 0.95, // 민첩성 근소 차이
            durability: 0.9, // 골밀도 낮음
        }
    }[sex];
    // ===== 종목 가중치 (문헌 기반 상대적 강조도) =====
    // 복싱: Piercy 2017, 무에타이: Krause 2016, BJJ: Andreato 2017
    // 레슬링: Kraemer 2004, 유도: Franchini 2011, MMA: James 2016
    var artWeight = exports.ART_STAT_WEIGHTS[parsedBackground.primaryArt] || exports.ART_STAT_WEIGHTS.mma;
    // ===== 수련 보정 (로그 스케일, diminishing returns) =====
    // 출처: Ericsson 1993 "Deliberate practice", Farrow 2008 "Expertise development"
    var expMonths = parsedBackground.experienceMonths;
    var expFactor = Math.min(2.5, 1 + Math.log10(Math.max(1, expMonths)) * 0.35);
    // ===== 빈도 보정 (주당 횟수, 과훈련 구간 반영) =====
    // 출처: Halson 2014 "Monitoring training load", Impellizzeri 2004 "Training load"
    var freq = parsedBackground.trainingFrequency;
    var freqFactor = Math.min(1.6, 0.4 + freq * 0.18); // 주 6회 시 ~1.48, 주 7회 시 1.6 캡
    // ===== 기초 체력 지수 (FFMI, 체지방률 기반) =====
    // 출처: Schutz 2002 "FFMI reference", Kyle 2003 "Body composition"
    var fitnessIndex = Math.min(1.6, (ffmi / 22) * (1 - bodyFatPercent / 35) * 1.15);
    var base = {
        // strength: 베이스 45 × 근육비율 × 생리학계수 3.2 × 종목 × 성별 × 연령 × 수련 × 빈도 × 체력
        // 3.2: 근단면적 ∝ 근력 (Piercy 2017: 펀치 힘 ∝ CSA^1.2 → 선형 근사)
        strength: Math.round(45 * muscleRatio * 3.2 * artWeight.strength * sexFactor.strength * ageAdj * expFactor * freqFactor * fitnessIndex),
        // speed: 베이스 45 × (1 - 체지방률/45) × 생리학계수 2.2 × 종목 × 성별 × 연령 × 수련 × 빈도 × 체력
        // 2.2: 질량비속도 ∝ (1 - 지방률) (Nummela 2007: 스프린트 속도 ∝ 파워/체중)
        speed: Math.round(45 * (1 - bodyFatPercent / 45) * 2.2 * artWeight.speed * sexFactor.speed * ageAdj * expFactor * freqFactor * fitnessIndex),
        // endurance: 베이스 45 × (1 - 체지방률/55) × 생리학계수 1.8 × 종목 × 성별 × 연령 × 수련 × 빈도 × 체력
        // 1.8: VO2max ∝ (1 - 지방률) × 심박출량 (Bassett 2000)
        endurance: Math.round(45 * (1 - bodyFatPercent / 55) * 1.8 * artWeight.endurance * sexFactor.endurance * ageAdj * expFactor * freqFactor * fitnessIndex),
        // agility: 베이스 45 × (1 - 체중/130) × 생리학계수 1.4 × 종목 × 연령 × 수련 × 체력
        // 1.4: 민첩성 ∝ 파워/체중 × 신경근 협응 (Sheppard 2006)
        agility: Math.round(45 * (1 - weight / 130) * 1.4 * artWeight.agility * ageAdj * expFactor * fitnessIndex),
        // technique: 베이스 25 × 종목 × 수련 × 빈도 (체력/성별/연령 의존도 낮음)
        technique: Math.round(25 * artWeight.technique * expFactor * freqFactor),
        // durability: 베이스 35 × 근육비율 × 생리학계수 2.2 × 종목 × 연령 × 체력
        // 2.2: 내구도 ∝ 근육량 + 골밀도 (Kohrt 2004: 뼈 강도 ∝ 근육량)
        durability: Math.round(35 * muscleRatio * 2.2 * artWeight.durability * ageAdj * fitnessIndex),
        // intelligence: 베이스 25 × 종목 × 수련 (전술 이해도)
        intelligence: Math.round(25 * artWeight.intelligence * expFactor),
        // composure: 베이스 45 × (1 - 파싱불확실성) × 종목
        composure: Math.round(45 * (1 - (parsedBackground.confidence < 0.5 ? 0.3 : 0)) * artWeight.composure),
    };
    // 0-100 클램프
    var clamp = function (v) { return Math.max(0, Math.min(100, v)); };
    return {
        strength: clamp(base.strength),
        speed: clamp(base.speed),
        endurance: clamp(base.endurance),
        agility: clamp(base.agility),
        technique: clamp(base.technique),
        durability: clamp(base.durability),
        intelligence: clamp(base.intelligence),
        composure: clamp(base.composure),
    };
}
// ============================================
// 기술 추천 매핑 (종목/경력 기반)
// ============================================
exports.ART_TECHNIQUE_MAP = {
    boxing: [
        'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
        'body_jab', 'body_cross', 'slip', 'weave', 'parry', 'block_high', 'block_low',
        'footwork_step', 'pivot', 'feint_jab', 'combo_1_2', 'combo_1_2_3',
    ],
    muaythai: [
        'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
        'lead_teep', 'rear_teep', 'lead_round_kick', 'rear_round_kick', 'lead_low_kick', 'rear_low_kick',
        'lead_elbow', 'rear_elbow', 'clinch_entry', 'clinch_knee', 'clinch_elbow', 'clinch_sweep',
        'block_high', 'block_low', 'check_kick', 'catch_kick', 'parry', 'slip',
        'feint_teep', 'combo_punch_kick',
    ],
    bjj: [
        'double_leg', 'single_leg', 'ankle_pick', 'guard_pull', 'closed_guard', 'open_guard',
        'half_guard', 'butterfly_guard', 'de_la_riva', 'spider_guard', 'mount_escape',
        'side_control_escape', 'back_escape', 'rear_naked_choke', 'guillotine', 'triangle',
        'armbar', 'kimura', 'americana', 'omoplata', 'kneebar', 'heel_hook',
        'sweep_scissor', 'sweep_hip', 'sweep_flower', 'pass_guard', 'take_back',
        'technical_standup', 'sprawl',
    ],
    wrestling: [
        'double_leg', 'single_leg', 'high_crotch', 'low_single', 'blast_double',
        'fireman_carry', 'hip_toss', 'headlock_throw', 'snap_down', 'spin_behind',
        'front_headlock', 'go_behind', 'standup_escape', 'sit_out', 'switch',
        'granby_roll', 'peterson_roll', 'turk', 'cradle', 'half_nelson',
        'sprawl', 'whizzer', 'front_headlock_sprawl',
    ],
    judo: [
        'osoto_gari', 'o_uchi_gari', 'seoi_nage', 'ippon_seoi_nage', 'uchi_mata',
        'harai_goshi', 'tai_otoshi', 'kouchi_gari', 'kouchigake', 'tomoc_nage',
        'kesa_gatame', 'kuzure_kesa_gatame', 'yoko_shiho_gatame', 'tate_shiho_gatame',
        'juji_gatame', 'ude_garami', 'okuri_eri_jime', 'kata_ha_jime', 'gyaku_juji_jime',
        'ukemi', 'kuzushi', 'grip_fighting',
    ],
    tkd: [
        'front_kick', 'round_kick', 'side_kick', 'back_kick', 'hook_kick', 'axe_kick',
        'tornado_kick', 'spin_hook_kick', 'double_kick', 'combo_kick_punch',
        'block_high', 'block_low', 'dodge', 'footwork_advance', 'footwork_retreat',
        'feint_kick', 'counter_kick',
    ],
    kickboxing: [
        'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
        'lead_teep', 'rear_teep', 'lead_round_kick', 'rear_round_kick', 'lead_low_kick', 'rear_low_kick',
        'block_high', 'block_low', 'check_kick', 'parry', 'slip', 'weave',
        'combo_punch_kick', 'feint_kick',
    ],
    mma: [
        'jab', 'cross', 'lead_hook', 'rear_hook', 'lead_uppercut', 'rear_uppercut',
        'lead_teep', 'rear_teep', 'lead_round_kick', 'rear_round_kick', 'lead_low_kick', 'rear_low_kick',
        'lead_elbow', 'rear_elbow', 'double_leg', 'single_leg', 'clinch_entry',
        'clinch_knee', 'clinch_elbow', 'sprawl', 'ground_and_pound', 'rear_naked_choke',
        'guillotine', 'triangle', 'armbar', 'guard_pass', 'sweep', 'standup',
        'feint', 'combo_strike_takedown',
    ],
    sambo: [
        'double_leg', 'single_leg', 'fireman_carry', 'hip_toss', 'bodylock_takedown',
        'leg_lock', 'kneebar', 'heel_hook', 'ankle_lock', 'toe_hold',
        'rear_naked_choke', 'guillotine', 'triangle', 'armbar', 'kimura',
        'guard_pass', 'sweep', 'standup', 'combo_throw_submission',
    ],
    sanda: [
        'jab', 'cross', 'hook', 'uppercut', 'lead_kick', 'rear_kick', 'low_kick',
        'double_leg', 'single_leg', 'hip_toss', 'bodylock_throw', 'side_kick',
        'sprawl', 'clinch_knee', 'combo_strike_throw',
    ],
};
function getRecommendedTechniques(primaryArt, experienceMonths) {
    var base = exports.ART_TECHNIQUE_MAP[primaryArt] || exports.ART_TECHNIQUE_MAP.mma;
    // 경력에 따라 고급 기술 추가
    if (experienceMonths >= 24) {
        return base; // 모든 기술 해금
    }
    if (experienceMonths >= 12) {
        return base.slice(0, Math.floor(base.length * 0.8));
    }
    return base.slice(0, Math.floor(base.length * 0.5));
}
//# sourceMappingURL=art-stats.js.map