"use strict";
// ============================================
// Injury Interaction Model
// 기존 부상이 새 부상/기능에 미치는 영향
// ============================================
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injurySystem = exports.InjurySystem = exports.DEFAULT_INJURY_RULES = void 0;
exports.DEFAULT_INJURY_RULES = {
    samePartMultiplier: 1.5, // 같은 부위 재손상 시 1.5배 악화
    adjacentTransfer: 0.3, // 인접 부위로 30% 기능 저하 전이
    nerveToMuscleImpact: 0.5, // 신경 손상 → 근육 기능 50% 저하
    vesselToStaminaImpact: 0.4, // 혈관 손상 → 스태미나 회복 40% 감소
    fractureROMReduction: 0.7, // 골절 시 가동범위 70% 감소
};
var InjurySystem = /** @class */ (function () {
    function InjurySystem(rules) {
        if (rules === void 0) { rules = {}; }
        this.injuries = new Map(); // fighterId -> injuries
        this.rules = __assign(__assign({}, exports.DEFAULT_INJURY_RULES), rules);
    }
    // 새 부상 추가 시 기존 부상과의 상호작용 계산
    InjurySystem.prototype.addInjury = function (fighterId, newInjury, allInjuries) {
        var existing = allInjuries.find(function (i) { return i.partId === newInjury.partId; });
        if (existing) {
            // 동일 부위 재손상: 심각도 상승
            var severityOrder = ['minor', 'moderate', 'severe', 'critical'];
            var currentIdx = severityOrder.indexOf(existing.severity);
            var newIdx = severityOrder.indexOf(newInjury.severity);
            var worsenedIdx = Math.min(3, Math.max(currentIdx, newIdx) +
                Math.floor(this.rules.samePartMultiplier * (newIdx - currentIdx + 1)));
            return __assign(__assign({}, newInjury), { severity: severityOrder[worsenedIdx], functionalLoss: Math.min(1, existing.functionalLoss +
                    newInjury.functionalLoss * this.rules.samePartMultiplier), description: "".concat(existing.description, " \u2192 \uC7AC\uC190\uC0C1 \uC545\uD654") });
        }
        // 인접 부위 확인 및 기능 저하 전이
        this.applyAdjacentEffects(fighterId, newInjury, allInjuries);
        return newInjury;
    };
    InjurySystem.prototype.applyAdjacentEffects = function (fighterId, injury, allInjuries) {
        var adjacentParts = this.getAdjacentParts(injury.partId);
        var _loop_1 = function (adjPart) {
            var adjInjury = allInjuries.find(function (i) { return i.partId === adjPart; });
            if (adjInjury) {
                // 인접 부위 이미 손상된 경우 추가 악화
                adjInjury.functionalLoss = Math.min(1, adjInjury.functionalLoss + injury.functionalLoss * this_1.rules.adjacentTransfer);
            }
        };
        var this_1 = this;
        for (var _i = 0, adjacentParts_1 = adjacentParts; _i < adjacentParts_1.length; _i++) {
            var adjPart = adjacentParts_1[_i];
            _loop_1(adjPart);
        }
    };
    InjurySystem.prototype.getAdjacentParts = function (partId) {
        var adjacency = {
            head: ['neck'],
            neck: ['head', 'torso_front', 'torso_back'],
            torso_front: ['neck', 'torso_side_l', 'torso_side_r', 'groin'],
            torso_back: ['neck', 'torso_side_l', 'torso_side_r'],
            torso_side_l: ['torso_front', 'torso_back', 'arm_upper_l', 'leg_upper_l'],
            torso_side_r: ['torso_front', 'torso_back', 'arm_upper_r', 'leg_upper_r'],
            arm_upper_l: ['torso_side_l', 'arm_lower_l'],
            arm_lower_l: ['arm_upper_l', 'hand_l'],
            hand_l: ['arm_lower_l'],
            arm_upper_r: ['torso_side_r', 'arm_lower_r'],
            arm_lower_r: ['arm_upper_r', 'hand_r'],
            hand_r: ['arm_lower_r'],
            leg_upper_l: ['torso_side_l', 'leg_lower_l'],
            leg_lower_l: ['leg_upper_l', 'foot_l'],
            foot_l: ['leg_lower_l'],
            leg_upper_r: ['torso_side_r', 'leg_lower_r'],
            leg_lower_r: ['leg_upper_r', 'foot_r'],
            foot_r: ['leg_lower_r'],
            groin: ['torso_front', 'leg_upper_l', 'leg_upper_r'],
        };
        return adjacency[partId] || [];
    };
    // 기능적 손실 계산 (모든 부상 종합)
    InjurySystem.prototype.calculateFunctionalLoss = function (fighterId, partId, injuries) {
        var totalLoss = 0;
        // 해당 부위 직접 손상
        var directInjury = injuries.find(function (i) { return i.partId === partId; });
        if (directInjury) {
            totalLoss += directInjury.functionalLoss;
        }
        // 인접 부위 전이 손상
        var adjacentParts = this.getAdjacentParts(partId);
        var _loop_2 = function (adjPart) {
            var adjInjury = injuries.find(function (i) { return i.partId === adjPart; });
            if (adjInjury) {
                totalLoss += adjInjury.functionalLoss * this_2.rules.adjacentTransfer;
            }
        };
        var this_2 = this;
        for (var _i = 0, adjacentParts_2 = adjacentParts; _i < adjacentParts_2.length; _i++) {
            var adjPart = adjacentParts_2[_i];
            _loop_2(adjPart);
        }
        // 신경 손상 전이 (해당 부위 신경 손상 시)
        var nerveInjury = injuries.find(function (i) {
            return i.partId === partId && i.type === 'nerve_damage';
        });
        if (nerveInjury) {
            totalLoss += nerveInjury.functionalLoss * this.rules.nerveToMuscleImpact;
        }
        return Math.min(1, totalLoss);
    };
    // 스태미나 회복률 계산 (혈관 손상 반영)
    InjurySystem.prototype.calculateStaminaRecoveryMultiplier = function (injuries) {
        var multiplier = 1.0;
        for (var _i = 0, injuries_1 = injuries; _i < injuries_1.length; _i++) {
            var injury = injuries_1[_i];
            if (injury.type === 'vessel_rupture') {
                multiplier -= injury.functionalLoss * this.rules.vesselToStaminaImpact;
            }
        }
        return Math.max(0.2, multiplier);
    };
    // 관절 가동범위 계산 (골절 반영)
    InjurySystem.prototype.calculateROMLimitation = function (injuries) {
        var romMap = new Map();
        for (var _i = 0, injuries_2 = injuries; _i < injuries_2.length; _i++) {
            var injury = injuries_2[_i];
            if (injury.type === 'fracture') {
                var current = romMap.get(injury.partId) || 1.0;
                romMap.set(injury.partId, current * (1 - this.rules.fractureROMReduction));
            }
        }
        return romMap;
    };
    // 출혈량 계산 (시간당 mL)
    InjurySystem.prototype.calculateBloodLossRate = function (injuries) {
        var rate = 0;
        for (var _i = 0, injuries_3 = injuries; _i < injuries_3.length; _i++) {
            var injury = injuries_3[_i];
            if (injury.type === 'vessel_rupture') {
                // 심각도별 출혈량 (mL/min)
                var severityRate = {
                    minor: 5,
                    moderate: 20,
                    severe: 100,
                    critical: 500,
                };
                rate += severityRate[injury.severity] || 0;
            }
            else if (injury.type === 'laceration') {
                rate += injury.functionalLoss * 10;
            }
        }
        return rate;
    };
    // 총 출혈량으로 인한 사망 위험도
    InjurySystem.prototype.calculateDeathRiskFromBloodLoss = function (totalBloodLoss, bodyWeight) {
        var bloodVolume = bodyWeight * 70; // mL (체중 kg × 70 mL/kg)
        var lossRatio = totalBloodLoss / bloodVolume;
        // 40% 이상 출혈 시 사망 위험 급증
        if (lossRatio >= 0.4)
            return 1.0;
        if (lossRatio >= 0.3)
            return 0.7;
        if (lossRatio >= 0.2)
            return 0.3;
        return 0;
    };
    return InjurySystem;
}());
exports.InjurySystem = InjurySystem;
exports.injurySystem = new InjurySystem();
//# sourceMappingURL=injury-system.js.map