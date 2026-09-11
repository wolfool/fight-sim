"use strict";
// ============================================
// 절대값 스케일 앵커 포인트 (성인 남성 평균 기준)
// UI 표기: "상대적 (0-100, 성인 남성 평균 기준)" / "절대값 (SI 단위)"
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANCHOR_VALUES = void 0;
exports.relativeToAbsolute = relativeToAbsolute;
exports.absoluteToRelative = absoluteToRelative;
exports.formatAbsolute = formatAbsolute;
exports.getStatLabel = getStatLabel;
exports.getStatUnit = getStatUnit;
exports.getStatDescription = getStatDescription;
exports.coreStatsToAbsolute = coreStatsToAbsolute;
exports.coreStatsFromAbsolute = coreStatsFromAbsolute;
// 성인 남성 평균값 (20-30대, 한국인 체형 반영)
// 출처: 
// - 펀치 힘/속도: Piercy et al. 2017, "Biomechanics of boxing punches" (아마추어 평균)
// - VO2max: 한국인 영양조사/체력조사 2020 (20대 남성 평균)
// - HIC: NHTSA 기준, 일반인 두부 내성
// - 교합력: 한국인 치과학회 평균값
// - 악력: 한국인 체력조사 2020
// - 질주속도: 일반인 100m 평균
exports.ANCHOR_VALUES = {
    strength: {
        label: '펀치 피크 힘',
        unit: 'N',
        value: 1800, // 일반 성인 남성 평균 잽/크로스 피크 힘
        description: '일반 성인 남성(70kg, 복싱 비경험자) 잽 피크 힘 평균값. 프로는 3000N+',
    },
    speed: {
        label: '펀치 피크 속도',
        unit: 'm/s',
        value: 8.5, // 일반 성인 남성 평균 펀치 속도
        description: '일반 성인 남성 펀치 손끝 속도 평균. 프로는 12-15m/s',
    },
    endurance: {
        label: '최대 산소 섭취량',
        unit: 'ml/kg/min',
        value: 42, // 한국 20대 남성 평균 VO2max
        description: '한국인 20-29세 남성 평균 VO2max (국민체력조사 2020). 엘리트는 65+',
    },
    durability: {
        label: '두부 충격 내성 (HIC)',
        unit: 'HIC',
        value: 700, // 일반인 두부 손상 임계치 근사
        description: 'HIC 700에서 뇌진탕 확률 약 50% (NHTSA). 프로 파이터는 목 근육 발달로 내성 높음',
    },
    strikeImpulse: {
        label: '펀치 임펄스',
        unit: 'N·s',
        value: 35, // 1800N × ~20ms
        description: '평균 펀치 임펄스 (힘 × 시간 적분)',
    },
    strikeEnergy: {
        label: '펀치 충격 에너지',
        unit: 'J',
        value: 120, // 0.5 × m × v² 근사
        description: '펀치 전달 운동에너지 평균',
    },
    biteForce: {
        label: '교합력',
        unit: 'N',
        value: 600, // 한국인 성인 남성 평균 교합력 (제1대구치)
        description: '한국인 치과학회 2018 평균값. 여성 약 450N',
    },
    gripStrength: {
        label: '악력',
        unit: 'N',
        value: 400, // 한국인 20대 남성 평균 악력
        description: '국민체력조사 2020, 20-29세 남성 평균 40kgf ≈ 392N',
    },
    sprintSpeed: {
        label: '최대 질주 속도',
        unit: 'm/s',
        value: 7.5, // 일반인 100m 13.3초 기준
        description: '일반 성인 남성 100m 전력질주 평균 속도. 단거리 선수 10-12m/s',
    },
};
function relativeToAbsolute(relative, stat) {
    var anchor = exports.ANCHOR_VALUES[stat].value;
    return (relative / 100) * anchor;
}
function absoluteToRelative(absolute, stat) {
    var anchor = exports.ANCHOR_VALUES[stat].value;
    var relative = (absolute / anchor) * 100;
    return Math.max(0, Math.min(200, relative)); // 0-200% 클램프
}
function formatAbsolute(value, stat) {
    var _a = exports.ANCHOR_VALUES[stat], unit = _a.unit, label = _a.label;
    if (unit === 'N' && value >= 1000) {
        return "".concat((value / 1000).toFixed(1), " kN");
    }
    if (unit === 'ml/kg/min') {
        return "".concat(Math.round(value), " ").concat(unit);
    }
    if (unit === 'HIC') {
        return "".concat(Math.round(value), " ").concat(unit);
    }
    return "".concat(value.toFixed(1), " ").concat(unit);
}
function getStatLabel(stat) {
    return exports.ANCHOR_VALUES[stat].label;
}
function getStatUnit(stat) {
    return exports.ANCHOR_VALUES[stat].unit;
}
function getStatDescription(stat) {
    return exports.ANCHOR_VALUES[stat].description;
}
function coreStatsToAbsolute(stats) {
    return {
        strength: relativeToAbsolute(stats.strength, 'strength'),
        speed: relativeToAbsolute(stats.speed, 'speed'),
        endurance: relativeToAbsolute(stats.endurance, 'endurance'),
        durability: relativeToAbsolute(stats.durability, 'durability'),
        // agility, technique, intelligence, composure는 상대적만 사용
    };
}
function coreStatsFromAbsolute(absolute) {
    return {
        strength: absolute.strength !== undefined ? absoluteToRelative(absolute.strength, 'strength') : undefined,
        speed: absolute.speed !== undefined ? absoluteToRelative(absolute.speed, 'speed') : undefined,
        endurance: absolute.endurance !== undefined ? absoluteToRelative(absolute.endurance, 'endurance') : undefined,
        durability: absolute.durability !== undefined ? absoluteToRelative(absolute.durability, 'durability') : undefined,
    };
}
//# sourceMappingURL=anchor-values.js.map