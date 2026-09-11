"use strict";
// ============================================
// Psychology System - 공포/분노/항복 수식화
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
exports.psychologySystem = exports.PsychologySystem = exports.DEFAULT_PSYCHOLOGY_CONFIG = void 0;
exports.DEFAULT_PSYCHOLOGY_CONFIG = {
    fearPerDamage: 0.8,
    fearPerKnockdown: 15,
    fearPerBloodLoss: 0.5,
    fearDecayPerSecond: 0.5,
    fearHomeGroundReduction: 0.3,
    ragePerDamageTaken: 1.2,
    ragePerDamageDealt: 0.3,
    ragePerTaunt: 5,
    rageDecayPerSecond: 0.8,
    rageThreshold: 70,
    confidenceBase: 50,
    confidencePerWin: 5,
    confidencePerLoss: -8,
    confidencePerKnockdown: -15,
    surrenderBaseThreshold: 60,
    surrenderFearWeight: 0.4,
    surrenderPainWeight: 0.3,
    surrenderFunctionalLossWeight: 0.3,
    surrenderRageReduction: 20,
    homeGroundFearReduction: 0.3,
    homeGroundConfidenceBoost: 0.2,
};
var PsychologySystem = /** @class */ (function () {
    function PsychologySystem(config) {
        if (config === void 0) { config = {}; }
        this.state = {
            fearLevel: 0,
            rageLevel: 0,
            confidence: 50,
            focus: 100,
            surrenderUrge: 0,
        };
        this.config = __assign(__assign({}, exports.DEFAULT_PSYCHOLOGY_CONFIG), config);
        this.reset();
    }
    PsychologySystem.prototype.reset = function () {
        this.state = {
            fearLevel: 0,
            rageLevel: 0,
            confidence: this.config.confidenceBase,
            focus: 100,
            surrenderUrge: 0,
        };
    };
    PsychologySystem.prototype.getState = function () {
        return __assign({}, this.state);
    };
    // ===== 공포 업데이트 =====
    PsychologySystem.prototype.updateFear = function (damageTaken, events, dt, isHomeGround) {
        var delta = 0;
        // 데미지 기반 공포
        delta += damageTaken * this.config.fearPerDamage;
        // 이벤트 기반 공포 (다운, 큰 데미지 등)
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            if (event_1.type === 'knockdown' && event_1.target === 'self') {
                delta += this.config.fearPerKnockdown;
            }
            if (event_1.type === 'strike' && event_1.damage && event_1.damage > 30) {
                delta += event_1.damage * 0.2;
            }
        }
        // 자연 감소
        delta -= this.config.fearDecayPerSecond * dt;
        // 홈그라운드 보너스
        if (isHomeGround) {
            delta -= this.state.fearLevel * this.config.fearHomeGroundReduction * dt;
        }
        this.state.fearLevel = this.clamp(this.state.fearLevel + delta);
    };
    // ===== 분노 업데이트 =====
    PsychologySystem.prototype.updateRage = function (damageTaken, damageDealt, events, dt) {
        var delta = 0;
        delta += damageTaken * this.config.ragePerDamageTaken;
        delta += damageDealt * this.config.ragePerDamageDealt;
        for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
            var event_2 = events_2[_i];
            if (event_2.type === 'taunt') {
                delta += this.config.ragePerTaunt;
            }
        }
        delta -= this.config.rageDecayPerSecond * dt;
        this.state.rageLevel = this.clamp(this.state.rageLevel + delta);
    };
    // ===== 자신감 업데이트 =====
    PsychologySystem.prototype.updateConfidence = function (roundResult, knockdowns, dt) {
        var delta = 0;
        if (roundResult === 'win')
            delta += this.config.confidencePerWin;
        else if (roundResult === 'loss')
            delta += this.config.confidencePerLoss;
        delta += knockdowns * this.config.confidencePerKnockdown;
        // 자연스럽게 기본값으로 회귀
        delta += (this.config.confidenceBase - this.state.confidence) * 0.01 * dt;
        this.state.confidence = this.clamp(this.state.confidence + delta);
    };
    // ===== 포기 충동 계산 =====
    PsychologySystem.prototype.calculateSurrenderUrge = function (painLevel, functionalLoss, deathAllowed) {
        if (deathAllowed)
            return 0; // 죽음을 각오함 = 포기 안 함
        var fearComponent = this.state.fearLevel * this.config.surrenderFearWeight;
        var painComponent = painLevel * this.config.surrenderPainWeight;
        var functionalComponent = functionalLoss * 100 * this.config.surrenderFunctionalLossWeight;
        var urge = fearComponent + painComponent + functionalComponent;
        // 분노가 높으면 포기 충동 감소
        if (this.state.rageLevel > this.config.rageThreshold) {
            urge -= this.config.surrenderRageReduction;
        }
        // 자신감 높으면 포기 충동 감소
        urge -= (this.state.confidence - 50) * 0.2;
        this.state.surrenderUrge = this.clamp(urge);
        return this.state.surrenderUrge;
    };
    // ===== 포기 판정 =====
    PsychologySystem.prototype.checkSurrender = function (painLevel, functionalLoss, deathAllowed) {
        if (deathAllowed)
            return false;
        var urge = this.calculateSurrenderUrge(painLevel, functionalLoss, deathAllowed);
        return urge >= this.config.surrenderBaseThreshold;
    };
    // ===== 홈그라운드 보너스 적용 =====
    PsychologySystem.prototype.applyHomeGroundBonus = function (isHomeGround) {
        if (!isHomeGround)
            return;
        this.state.fearLevel = this.clamp(this.state.fearLevel * (1 - this.config.homeGroundFearReduction));
        this.state.confidence = this.clamp(this.state.confidence +
            this.config.confidenceBase * this.config.homeGroundConfidenceBoost);
    };
    // ===== 킬 인텐트 적용 =====
    PsychologySystem.prototype.applyKillIntent = function (killIntent) {
        // killIntent 0-100: 높을수록 공포 감소, 분노 증가, 포기 억제
        this.state.fearLevel = this.clamp(this.state.fearLevel * (1 - killIntent / 200));
        this.state.rageLevel = this.clamp(this.state.rageLevel + killIntent * 0.3);
        this.state.surrenderUrge = this.clamp(this.state.surrenderUrge * (1 - killIntent / 150));
    };
    PsychologySystem.prototype.clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 100; }
        return Math.max(min, Math.min(max, value));
    };
    return PsychologySystem;
}());
exports.PsychologySystem = PsychologySystem;
exports.psychologySystem = new PsychologySystem();
//# sourceMappingURL=psychology-system.js.map