"use strict";
// ============================================
// Monte Carlo Worker for parallel simulation
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
var engine_1 = require("../engine");
// Simplified simulation for worker (no replay, minimal logging)
function runSingleSimulation(fighterA, fighterB, context, seed) {
    return __awaiter(this, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            engine = (0, engine_1.createSimulationEngine)();
            engine.initialize(fighterA, fighterB, __assign(__assign({}, context), { seed: seed }));
            while (engine.step()) {
                // Continue until finished
            }
            return [2 /*return*/, engine.getResult()];
        });
    });
}
function runBatchSimulation(fighterA, fighterB, context, count, baseSeed) {
    return __awaiter(this, void 0, void 0, function () {
        var results, i, result, wins, finishTypes, durations, _i, results_1, r, n, mean, stdDev, p, z, margin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < count)) return [3 /*break*/, 5];
                    return [4 /*yield*/, runSingleSimulation(fighterA, fighterB, context, baseSeed + i)];
                case 2:
                    result = _a.sent();
                    results.push(result);
                    if (!(i % 10 === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 0); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    wins = { A: 0, B: 0, draw: 0 };
                    finishTypes = {};
                    durations = [];
                    for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                        r = results_1[_i];
                        wins[r.winner]++;
                        finishTypes[r.finishType] = (finishTypes[r.finishType] || 0) + 1;
                        durations.push(r.duration);
                    }
                    n = results.length;
                    mean = durations.reduce(function (a, b) { return a + b; }, 0) / n;
                    stdDev = Math.sqrt(durations.reduce(function (a, b) { return a + Math.pow((b - mean), 2); }, 0) / n);
                    p = wins.A / n;
                    z = 1.96;
                    margin = z * Math.sqrt(p * (1 - p) / n);
                    return [2 /*return*/, {
                            winRate: { A: wins.A / n, B: wins.B / n, draw: wins.draw / n },
                            finishTypeDistribution: finishTypes,
                            avgDuration: mean,
                            durationStdDev: stdDev,
                            confidenceInterval: { lower: Math.max(0, p - margin), upper: Math.min(1, p + margin) },
                        }];
            }
        });
    });
}
// Worker message handler
self.onmessage = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, _a, result, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                msg = event.data;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                _a = msg.type;
                switch (_a) {
                    case 'RUN_SIMULATION': return [3 /*break*/, 2];
                    case 'RUN_BATCH': return [3 /*break*/, 4];
                    case 'TERMINATE': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 7];
            case 2: return [4 /*yield*/, runSingleSimulation(msg.payload.fighterA, msg.payload.fighterB, msg.payload.context, msg.payload.seed)];
            case 3:
                result = _b.sent();
                self.postMessage({ type: 'SIMULATION_COMPLETE', payload: result });
                return [3 /*break*/, 7];
            case 4: return [4 /*yield*/, runBatchSimulation(msg.payload.fighterA, msg.payload.fighterB, msg.payload.context, msg.payload.count, msg.payload.baseSeed)];
            case 5:
                result = _b.sent();
                self.postMessage({ type: 'BATCH_COMPLETE', payload: result });
                return [3 /*break*/, 7];
            case 6:
                self.close();
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                self.postMessage({
                    type: 'ERROR',
                    payload: error_1 instanceof Error ? error_1.message : 'Unknown error'
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
// Signal ready
self.postMessage({ type: 'READY' });
//# sourceMappingURL=worker.js.map