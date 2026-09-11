"use strict";
// ============================================
// Worker Manager for Monte Carlo simulations
// ============================================
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
exports.WorkerManager = void 0;
exports.getWorkerManager = getWorkerManager;
exports.initializeWorkers = initializeWorkers;
var WorkerManager = /** @class */ (function () {
    function WorkerManager(workerCount) {
        if (workerCount === void 0) { workerCount = navigator.hardwareConcurrency || 4; }
        this.workerCount = workerCount;
        this.workers = [];
        this.pendingSimulations = new Map();
        this.pendingBatch = null;
        this.simulationIdCounter = 0;
        this.batchIdCounter = 0;
        this.nextWorkerIndex = 0;
    }
    WorkerManager.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var createSimulationEngine, _loop_1, this_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('../engine'); })];
                    case 1:
                        createSimulationEngine = (_a.sent()).createSimulationEngine;
                        _loop_1 = function (i) {
                            var worker;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        worker = new Worker(new URL('../simulation/worker.ts', import.meta.url), { type: 'module' });
                                        worker.onmessage = function (event) { return _this.handleWorkerMessage(event, worker); };
                                        worker.onerror = function (error) { return _this.handleWorkerError(error, worker); };
                                        worker.postMessage({ type: 'INIT', payload: { engine: createSimulationEngine } });
                                        this_1.workers.push(worker);
                                        // Wait for ready signal
                                        return [4 /*yield*/, new Promise(function (resolve) {
                                                var handler = function (event) {
                                                    if (event.data.type === 'READY') {
                                                        worker.onmessage = null; // Remove temporary handler
                                                        worker.onmessage = function (e) { return _this.handleWorkerMessage(e, worker); };
                                                        resolve();
                                                    }
                                                };
                                                worker.onmessage = handler;
                                            })];
                                    case 1:
                                        // Wait for ready signal
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.workerCount)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(i)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    WorkerManager.prototype.handleWorkerMessage = function (event, worker) {
        var msg = event.data;
        if (msg.type === 'SIMULATION_COMPLETE') {
            var pending = this.pendingSimulations.get(msg.payload.simulationId);
            if (pending) {
                this.pendingSimulations.delete(msg.payload.simulationId);
                pending.resolve(msg.payload);
            }
        }
        else if (msg.type === 'BATCH_COMPLETE') {
            if (this.pendingBatch) {
                var pending = this.pendingBatch;
                this.pendingBatch = null;
                pending.resolve(msg.payload);
            }
        }
        else if (msg.type === 'ERROR') {
            // Handle errors for both single and batch
            var simPending = this.pendingSimulations.get(msg.payload.simulationId);
            if (simPending) {
                this.pendingSimulations.delete(msg.payload.simulationId);
                simPending.reject(new Error(msg.payload.error));
            }
            else if (this.pendingBatch) {
                var pending = this.pendingBatch;
                this.pendingBatch = null;
                pending.reject(new Error(msg.payload.error));
            }
        }
    };
    WorkerManager.prototype.handleWorkerError = function (error, worker) {
        console.error('[WorkerManager] Worker error:', error);
        // Reject all pending on this worker
        for (var _i = 0, _a = this.pendingSimulations; _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], pending = _b[1];
            pending.reject(new Error("Worker error: ".concat(error.message)));
        }
        this.pendingSimulations.clear();
        if (this.pendingBatch) {
            this.pendingBatch.reject(new Error("Worker error: ".concat(error.message)));
            this.pendingBatch = null;
        }
    };
    WorkerManager.prototype.runSimulation = function (fighterA, fighterB, context, seed) {
        return __awaiter(this, void 0, void 0, function () {
            var simulationId, worker;
            var _this = this;
            return __generator(this, function (_a) {
                simulationId = ++this.simulationIdCounter;
                worker = this.getNextWorker();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.pendingSimulations.set(simulationId, { resolve: resolve, reject: reject });
                        worker.postMessage({
                            type: 'RUN_SIMULATION',
                            payload: { fighterA: fighterA, fighterB: fighterB, context: context, seed: seed, simulationId: simulationId }
                        });
                        // Timeout after 30 seconds
                        setTimeout(function () {
                            if (_this.pendingSimulations.has(simulationId)) {
                                _this.pendingSimulations.delete(simulationId);
                                reject(new Error('Simulation timeout'));
                            }
                        }, 30000);
                    })];
            });
        });
    };
    WorkerManager.prototype.runBatch = function (fighterA, fighterB, context, count, baseSeed) {
        return __awaiter(this, void 0, void 0, function () {
            var worker;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.pendingBatch) {
                    throw new Error('Batch simulation already in progress');
                }
                worker = this.getNextWorker();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.pendingBatch = { resolve: resolve, reject: reject };
                        _this.batchIdCounter++;
                        worker.postMessage({
                            type: 'RUN_BATCH',
                            payload: { fighterA: fighterA, fighterB: fighterB, context: context, count: count, baseSeed: baseSeed, batchId: _this.batchIdCounter }
                        });
                        // Timeout: 10 seconds per simulation * count
                        setTimeout(function () {
                            if (_this.pendingBatch) {
                                _this.pendingBatch = null;
                                reject(new Error('Batch simulation timeout'));
                            }
                        }, count * 10000);
                    })];
            });
        });
    };
    WorkerManager.prototype.getNextWorker = function () {
        var worker = this.workers[this.nextWorkerIndex];
        this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length;
        return worker;
    };
    WorkerManager.prototype.terminate = function () {
        for (var _i = 0, _a = this.workers; _i < _a.length; _i++) {
            var worker = _a[_i];
            worker.postMessage({ type: 'TERMINATE' });
            worker.terminate();
        }
        this.workers = [];
        this.pendingSimulations.clear();
        this.pendingBatch = null;
    };
    return WorkerManager;
}());
exports.WorkerManager = WorkerManager;
// Singleton instance
var workerManagerInstance = null;
function getWorkerManager() {
    if (!workerManagerInstance) {
        workerManagerInstance = new WorkerManager();
    }
    return workerManagerInstance;
}
function initializeWorkers() {
    return __awaiter(this, void 0, void 0, function () {
        var manager;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manager = getWorkerManager();
                    return [4 /*yield*/, manager.initialize()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=worker-manager.js.map