"use strict";
// ============================================
// 자연어 격투 이력 파서 (한국어, 규칙 기반 + 키워드 매칭)
// confidence < 0.7 시 UI에서 드롭다운 보정 유도
// ============================================
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FREQUENCY_OPTIONS = exports.DURATION_OPTIONS = exports.ART_OPTIONS = exports.BackgroundParser = void 0;
exports.parseMartialArtsHistory = parseMartialArtsHistory;
var art_stats_1 = require("../data/art-stats");
// ============================================
// 정규식 패턴들
// ============================================
var PATTERNS = {
    // 종목 (가장 긴 매칭 우선)
    arts: [
        /(브라질리안\s*주짓수|브라질\s*주짓수)/gi,
        /(주짓수|BJJ|bjj)/gi,
        /(무에타이|무에\s*타이|Muay\s*Thai|muaythai)/gi,
        /(킥복싱|킥\s*복싱|Kick\s*boxing)/gi,
        /(태권도|Taekwondo|TKD|tkd)/gi,
        /(유도|Judo|judo)/gi,
        /(레슬링|Wrestling|wrestling)/gi,
        /(삼보|Sambo|sambo)/gi,
        /(산타|Sanda|sanda)/gi,
        /(복싱|권투|Boxing|boxing)/gi,
        /(MMA|종합격투기|종합)/gi,
        /(그래플링|그라운드)/gi,
        /(클린치)/gi,
        /(타격|스트라이킹)/gi,
    ],
    // 기간 (개월/년)
    duration: [
        /(\d+(?:\.\d+)?)\s*(년|year|yr)/gi,
        /(\d+(?:\.\d+)?)\s*(개월|달|month|mon|mo)/gi,
        /(\d+(?:\.\d+)?)\s*(주|week|wk)/gi,
    ],
    // 빈도 (주당 횟수)
    frequency: [
        /(주|주당|매주|weekly)\s*(\d+)\s*(회|번|times?)/gi,
        /(\d+)\s*(회|번)\s*(주|주당|매주|weekly)/gi,
        /(격주|biweekly)\s*(\d+)/gi,
        /(매일|daily)\s*(\d+)/gi,
    ],
    // 체육관/환경
    gym: [
        /(체육관|도장|짐|GYM|gym)\s*[:：]?\s*([^.,]+)/gi,
        /(코치|관장|마스터|사범)\s*[:：]?\s*([^.,]+)/gi,
    ],
};
// ============================================
// 메인 파서 클래스
// ============================================
var BackgroundParser = /** @class */ (function () {
    function BackgroundParser() {
        this.input = '';
    }
    BackgroundParser.prototype.parse = function (input) {
        this.input = input.trim();
        var extracted = {
            arts: this.extractArts(),
            durations: this.extractDurations(),
            frequencies: this.extractFrequencies(),
        };
        var parsed = this.buildParsedBackground(extracted);
        var warnings = this.generateWarnings(parsed, extracted);
        return { parsed: parsed, warnings: warnings, extracted: extracted };
    };
    // ============================================
    // 종목 추출
    // ============================================
    BackgroundParser.prototype.extractArts = function () {
        var results = [];
        var matched = new Set();
        // 우선순위 순서로 매칭 (긴 것부터)
        var sortedPatterns = __spreadArray([], PATTERNS.arts, true).sort(function (a, b) {
            var aStr = a.source.length;
            var bStr = b.source.length;
            return bStr - aStr;
        });
        for (var _i = 0, sortedPatterns_1 = sortedPatterns; _i < sortedPatterns_1.length; _i++) {
            var pattern = sortedPatterns_1[_i];
            var matches = this.input.matchAll(pattern);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var raw = match[0].toLowerCase().trim();
                var normalized = (0, art_stats_1.normalizeArt)(raw);
                if (!matched.has(normalized)) {
                    matched.add(normalized);
                    // 매칭 길이 기반 신뢰도
                    var confidence = Math.min(0.95, 0.6 + raw.length * 0.02);
                    results.push({ art: normalized, confidence: confidence });
                }
            }
        }
        // 기본값
        if (results.length === 0) {
            results.push({ art: 'mma', confidence: 0.3 });
        }
        return results.sort(function (a, b) { return b.confidence - a.confidence; });
    };
    // ============================================
    // 기간 추출 (개월 단위로 통일)
    // ============================================
    BackgroundParser.prototype.extractDurations = function () {
        var results = [];
        for (var _i = 0, _a = PATTERNS.duration; _i < _a.length; _i++) {
            var pattern = _a[_i];
            var matches = this.input.matchAll(pattern);
            for (var _b = 0, matches_2 = matches; _b < matches_2.length; _b++) {
                var match = matches_2[_b];
                var value = parseFloat(match[1]);
                var unit = match[2].toLowerCase();
                var months = void 0;
                switch (unit) {
                    case '년':
                    case 'year':
                    case 'yr':
                        months = value * 12;
                        break;
                    case '개월':
                    case '달':
                    case 'month':
                    case 'mon':
                    case 'mo':
                        months = value;
                        break;
                    case '주':
                    case 'week':
                    case 'wk':
                        months = value / 4.33;
                        break;
                    default:
                        months = value;
                }
                results.push({ value: Math.round(months), unit: 'months', confidence: 0.85 });
            }
        }
        return results;
    };
    // ============================================
    // 빈도 추출 (주당 횟수)
    // ============================================
    BackgroundParser.prototype.extractFrequencies = function () {
        var results = [];
        for (var _i = 0, _a = PATTERNS.frequency; _i < _a.length; _i++) {
            var pattern = _a[_i];
            var matches = this.input.matchAll(pattern);
            for (var _b = 0, matches_3 = matches; _b < matches_3.length; _b++) {
                var match = matches_3[_b];
                var value = void 0;
                if (match[1] && match[2] && !isNaN(parseInt(match[1]))) {
                    // "주 3회" 형태
                    value = parseInt(match[2] || match[1]);
                }
                else if (match[1] && !isNaN(parseInt(match[1]))) {
                    // "주당 3회" 형태
                    value = parseInt(match[1]);
                }
                else {
                    continue;
                }
                // "격주" 처리
                if (match[0].includes('격주') || match[0].includes('biweekly')) {
                    value = Math.ceil(value / 2);
                }
                // "매일" 처리
                if (match[0].includes('매일') || match[0].includes('daily')) {
                    value = value * 7;
                }
                results.push({ value: Math.min(14, value), confidence: 0.8 });
            }
        }
        return results;
    };
    // ============================================
    // 체육관 추출
    // ============================================
    BackgroundParser.prototype.extractGym = function () {
        var results = [];
        for (var _i = 0, _a = PATTERNS.gym; _i < _a.length; _i++) {
            var pattern = _a[_i];
            var matches = this.input.matchAll(pattern);
            for (var _b = 0, matches_4 = matches; _b < matches_4.length; _b++) {
                var match = matches_4[_b];
                results.push(match[0].trim());
            }
        }
        return results;
    };
    // ============================================
    // 통합 파싱 결과 구성
    // ============================================
    BackgroundParser.prototype.buildParsedBackground = function (extracted) {
        var _a, _b;
        // 주 종목 (가장 높은 신뢰도)
        var primaryArt = ((_a = extracted.arts[0]) === null || _a === void 0 ? void 0 : _a.art) || 'mma';
        var artConfidence = ((_b = extracted.arts[0]) === null || _b === void 0 ? void 0 : _b.confidence) || 0.3;
        // 수련 개월 (최대값 사용, 여러 개 있으면 가장 큰 것)
        var months = extracted.durations.length > 0
            ? Math.max.apply(Math, extracted.durations.map(function (d) { return d.value; })) : 0;
        var durationConfidence = extracted.durations.length > 0
            ? Math.max.apply(Math, extracted.durations.map(function (d) { return d.confidence; })) : 0;
        // 주당 빈도 (최대값)
        var frequency = extracted.frequencies.length > 0
            ? Math.max.apply(Math, extracted.frequencies.map(function (f) { return f.value; })) : 2; // 기본값
        var freqConfidence = extracted.frequencies.length > 0
            ? Math.max.apply(Math, extracted.frequencies.map(function (f) { return f.confidence; })) : 0.4;
        // 체육관 (첫 번째)
        var gymEnvironment = this.extractGym()[0] || undefined;
        // 전체 신뢰도 (가중 평균)
        var confidence = (artConfidence * 0.4 +
            durationConfidence * 0.25 +
            freqConfidence * 0.2 +
            0.15 // 전적 가중치 고정 (입력 안 받으므로)
        );
        return {
            primaryArt: primaryArt,
            experienceMonths: months,
            trainingFrequency: frequency,
            gymEnvironment: gymEnvironment,
            confidence: Math.round(confidence * 100) / 100,
        };
    };
    // ============================================
    // 경고 생성 (confidence 낮을 때)
    // ============================================
    BackgroundParser.prototype.generateWarnings = function (parsed, extracted) {
        var warnings = [];
        if (parsed.confidence < 0.7) {
            warnings.push('파싱 신뢰도가 낮습니다. 드롭다운에서 직접 선택해 주세요.');
        }
        if (extracted.arts.length > 1) {
            warnings.push("\uC5EC\uB7EC \uC885\uBAA9\uC774 \uAC10\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4: ".concat(extracted.arts.map(function (a) { return a.art; }).join(', '), ". \uC8FC \uC885\uBAA9\uC774 \uB9DE\uB294\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694."));
        }
        if (parsed.experienceMonths === 0) {
            warnings.push('수련 기간을 인식하지 못했습니다. 직접 입력해 주세요.');
        }
        if (extracted.frequencies.length === 0) {
            warnings.push('주당 훈련 횟수를 인식하지 못했습니다. 직접 선택해 주세요.');
        }
        return warnings;
    };
    return BackgroundParser;
}());
exports.BackgroundParser = BackgroundParser;
// ============================================
// 편의 함수
// ============================================
function parseMartialArtsHistory(input) {
    var parser = new BackgroundParser();
    return parser.parse(input);
}
// ============================================
// 드롭다운 옵션 생성 (UI용)
// ============================================
exports.ART_OPTIONS = [
    { value: 'boxing', label: '복싱', aliases: ['복싱', '권투', 'boxing'] },
    { value: 'muaythai', label: '무에타이', aliases: ['무에타이', '무에 타이', 'Muay Thai'] },
    { value: 'bjj', label: '주짓수 (BJJ)', aliases: ['주짓수', 'BJJ', '브라질리안 주짓수', '브라질 주짓수', '그래플링'] },
    { value: 'wrestling', label: '레슬링', aliases: ['레슬링', 'Wrestling', '프리레슬링', '그레코로만'] },
    { value: 'judo', label: '유도', aliases: ['유도', 'Judo'] },
    { value: 'tkd', label: '태권도', aliases: ['태권도', 'Taekwondo', 'TKD'] },
    { value: 'kickboxing', label: '킥복싱', aliases: ['킥복싱', '킥 복싱', 'Kickboxing'] },
    { value: 'mma', label: 'MMA (종합격투기)', aliases: ['MMA', '종합격투기', '종합'] },
    { value: 'sambo', label: '삼보', aliases: ['삼보', 'Sambo'] },
    { value: 'sanda', label: '산타', aliases: ['산타', 'Sanda'] },
];
exports.DURATION_OPTIONS = [
    { value: 0, label: '미입력' },
    { value: 1, label: '1개월' },
    { value: 3, label: '3개월' },
    { value: 6, label: '6개월' },
    { value: 12, label: '1년' },
    { value: 24, label: '2년' },
    { value: 36, label: '3년' },
    { value: 60, label: '5년' },
    { value: 120, label: '10년 이상' },
];
exports.FREQUENCY_OPTIONS = [
    { value: 1, label: '주 1회' },
    { value: 2, label: '주 2회' },
    { value: 3, label: '주 3회' },
    { value: 4, label: '주 4회' },
    { value: 5, label: '주 5회' },
    { value: 6, label: '주 6회' },
    { value: 7, label: '매일' },
];
//# sourceMappingURL=BackgroundParser.js.map