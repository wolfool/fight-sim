"use strict";
// ============================================
// Input Validation & Boundary Tests
// ============================================
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOUNDARY_TEST_CASES = exports.ValidationError = void 0;
exports.validateUserProfile = validateUserProfile;
exports.validateUserSettings = validateUserSettings;
exports.validateParsedBackground = validateParsedBackground;
exports.validateSimulationInput = validateSimulationInput;
exports.runBoundaryTests = runBoundaryTests;
exports.guardAgainstNaN = guardAgainstNaN;
exports.clampToRange = clampToRange;
var schemas_1 = require("../data/schemas");
// ============================================
// 검증 에러 클래스
// ============================================
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(field, code, message, value) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ValidationError';
        _this.field = field;
        _this.code = code;
        _this.value = value;
        return _this;
    }
    return ValidationError;
}(Error));
exports.ValidationError = ValidationError;
exports.BOUNDARY_TEST_CASES = [
    // 키 경계값
    { name: 'height_min', input: { height: 100, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'height_max', input: { height: 250, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'height_below_min', input: { height: 99, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['height'] },
    { name: 'height_above_max', input: { height: 251, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['height'] },
    // 몸무게 경계값
    { name: 'weight_min', input: { height: 170, weight: 20, skeletalMuscleMass: 10, bodyFatMass: 5, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'weight_max', input: { height: 170, weight: 200, skeletalMuscleMass: 100, bodyFatMass: 50, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'weight_below_min', input: { height: 170, weight: 19, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['weight'] },
    { name: 'weight_above_max', input: { height: 170, weight: 201, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['weight'] },
    // 골격근량 경계값
    { name: 'skeletalMuscleMass_min', input: { height: 170, weight: 70, skeletalMuscleMass: 10, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'skeletalMuscleMass_max', input: { height: 170, weight: 70, skeletalMuscleMass: 100, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'skeletalMuscleMass_gt_weight', input: { height: 170, weight: 70, skeletalMuscleMass: 80, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['skeletalMuscleMass'] },
    // 체지방량 경계값
    { name: 'bodyFatMass_min', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 2, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'bodyFatMass_max', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 80, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'bodyFatMass_gt_weight', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 90, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['bodyFatMass'] },
    // 근육+지방 > 몸무게 논리 검증
    { name: 'muscle_plus_fat_gt_weight', input: { height: 170, weight: 70, skeletalMuscleMass: 40, bodyFatMass: 40, martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['bodyComposition'] },
    // 나이 경계값
    { name: 'age_min', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 10, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'age_max', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 100, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: true },
    { name: 'age_below_min', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 9, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['age'] },
    { name: 'age_above_max', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, age: 101, sex: 'male', martialArtsHistory: '복싱 1년', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['age'] },
    // 격투 이력 필수
    { name: 'empty_martial_arts', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '', homeGround: 'neutral', deathAllowed: false }, shouldPass: false, expectedErrors: ['martialArtsHistory'] },
    // 홈그라운드 유효값
    { name: 'invalid_homeground', input: { height: 170, weight: 70, skeletalMuscleMass: 30, bodyFatMass: 15, martialArtsHistory: '복싱 1년', homeGround: 'invalid', deathAllowed: false }, shouldPass: false, expectedErrors: ['homeGround'] },
    // 설정 경계값
    { name: 'simulationCount_min', input: { simulationCount: 100 }, shouldPass: true },
    { name: 'simulationCount_max', input: { simulationCount: 2000 }, shouldPass: true },
    { name: 'simulationCount_below', input: { simulationCount: 99 }, shouldPass: false, expectedErrors: ['simulationCount'] },
    { name: 'simulationCount_above', input: { simulationCount: 2001 }, shouldPass: false, expectedErrors: ['simulationCount'] },
];
// ============================================
// 검증 함수들
// ============================================
function validateUserProfile(input) {
    // Zod 스키마 검증
    var result = schemas_1.UserProfileSchema.safeParse(input);
    if (!result.success) {
        var errors = result.error.errors.map(function (e) {
            return new ValidationError(e.path.join('.'), e.code, e.message, input[e.path[0]]);
        });
        return { success: false, errors: errors };
    }
    // 추가 논리 검증: 근육량 + 지방량 ≤ 몸무게
    var data = result.data;
    if (data.skeletalMuscleMass + data.bodyFatMass > data.weight) {
        return {
            success: false,
            errors: [new ValidationError('bodyComposition', 'custom', '골격근량 + 체지방량이 몸무게를 초과할 수 없습니다', { skeletalMuscleMass: data.skeletalMuscleMass, bodyFatMass: data.bodyFatMass, weight: data.weight })]
        };
    }
    // 근육량이 몸무게 초과 불가
    if (data.skeletalMuscleMass > data.weight) {
        return {
            success: false,
            errors: [new ValidationError('skeletalMuscleMass', 'custom', '골격근량은 몸무게를 초과할 수 없습니다', { skeletalMuscleMass: data.skeletalMuscleMass, weight: data.weight })]
        };
    }
    // 체지방량이 몸무게 초과 불가
    if (data.bodyFatMass > data.weight) {
        return {
            success: false,
            errors: [new ValidationError('bodyFatMass', 'custom', '체지방량은 몸무게를 초과할 수 없습니다', { bodyFatMass: data.bodyFatMass, weight: data.weight })]
        };
    }
    return { success: true, data: data, errors: [] };
}
function validateUserSettings(input) {
    var result = schemas_1.UserSettingsSchema.safeParse(input);
    if (!result.success) {
        var errors = result.error.errors.map(function (e) {
            return new ValidationError(e.path.join('.'), e.code, e.message, input[e.path[0]]);
        });
        return { success: false, errors: errors };
    }
    return { success: true, data: result.data, errors: [] };
}
function validateParsedBackground(input) {
    var result = schemas_1.ParsedBackgroundSchema.safeParse(input);
    if (!result.success) {
        var errors = result.error.errors.map(function (e) {
            return new ValidationError(e.path.join('.'), e.code, e.message, input[e.path[0]]);
        });
        return { success: false, errors: errors };
    }
    // 추가 검증: 수련 개월이 0인데 빈도 > 0 불가
    var data = result.data;
    if (data.experienceMonths === 0 && data.trainingFrequency > 0) {
        return {
            success: false,
            errors: [new ValidationError('trainingFrequency', 'custom', '수련 기간이 0개월인데 주당 횟수가 0보다 클 수 없습니다', data)]
        };
    }
    // 주당 빈도 합리적 범위 (주 14회 초과 불가)
    if (data.trainingFrequency > 14) {
        return {
            success: false,
            errors: [new ValidationError('trainingFrequency', 'custom', '주당 훈련 횟수는 14회를 초과할 수 없습니다', data.trainingFrequency)]
        };
    }
    return { success: true, data: data, errors: [] };
}
// ============================================
// 종합 검증 함수
// ============================================
function validateSimulationInput(input) {
    var allErrors = [];
    var profileA = validateUserProfile(input.fighterA);
    if (!profileA.success) {
        allErrors.push.apply(allErrors, profileA.errors.map(function (e) { return new ValidationError("fighterA.".concat(e.field), e.code, e.message, e.value); }));
    }
    var profileB = validateUserProfile(input.fighterB);
    if (!profileB.success) {
        allErrors.push.apply(allErrors, profileB.errors.map(function (e) { return new ValidationError("fighterB.".concat(e.field), e.code, e.message, e.value); }));
    }
    var settings = validateUserSettings(input.settings);
    if (!settings.success) {
        allErrors.push.apply(allErrors, settings.errors.map(function (e) { return new ValidationError("settings.".concat(e.field), e.code, e.message, e.value); }));
    }
    return {
        success: allErrors.length === 0,
        errors: allErrors,
    };
}
// ============================================
// 테스트 러너
// ============================================
function runBoundaryTests() {
    return __awaiter(this, void 0, void 0, function () {
        var passed, failed, details, _i, BOUNDARY_TEST_CASES_1, testCase, result, testPassed;
        return __generator(this, function (_a) {
            passed = 0;
            failed = 0;
            details = [];
            for (_i = 0, BOUNDARY_TEST_CASES_1 = exports.BOUNDARY_TEST_CASES; _i < BOUNDARY_TEST_CASES_1.length; _i++) {
                testCase = BOUNDARY_TEST_CASES_1[_i];
                result = validateUserProfile(testCase.input);
                testPassed = result.success === testCase.shouldPass;
                if (testPassed) {
                    passed++;
                }
                else {
                    failed++;
                }
                details.push({
                    name: testCase.name,
                    passed: testPassed,
                    expected: testCase.shouldPass,
                    actual: result.success,
                    errors: result.errors.map(function (e) { return ({ field: e.field, code: e.code, message: e.message }); }),
                });
            }
            return [2 /*return*/, { passed: passed, failed: failed, details: details }];
        });
    });
}
// ============================================
// NaN/Infinity 가드
// ============================================
function guardAgainstNaN(value, fieldName, fallback) {
    if (fallback === void 0) { fallback = 0; }
    if (!Number.isFinite(value) || Number.isNaN(value)) {
        console.warn("[Validation] ".concat(fieldName, " is NaN/Infinity, using fallback: ").concat(fallback));
        return fallback;
    }
    return value;
}
function clampToRange(value, min, max, fieldName) {
    var clamped = Math.max(min, Math.min(max, value));
    if (clamped !== value) {
        console.warn("[Validation] ".concat(fieldName, " clamped from ").concat(value, " to ").concat(clamped));
    }
    return clamped;
}
//# sourceMappingURL=input-validation.js.map