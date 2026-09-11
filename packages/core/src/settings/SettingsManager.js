"use strict";
// ============================================
// 설정 관리 (localStorage 영구 저장, 마이그레이션 포함)
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
exports.SettingsManager = void 0;
exports.useSettings = useSettings;
exports.useSetting = useSetting;
exports.getSettings = getSettings;
exports.setSetting = setSetting;
var schemas_1 = require("../data/schemas");
var STORAGE_KEY = 'fight-sim:settings';
var CURRENT_VERSION = 1;
var DEFAULT_SETTINGS = {
    statsScale: 'relative',
    simulationCount: 200,
    timeLimit: '5min',
};
function migrateSettings(raw) {
    var _a, _b;
    if (!raw || typeof raw !== 'object')
        return DEFAULT_SETTINGS;
    var version = (_a = raw.version) !== null && _a !== void 0 ? _a : 0;
    var settings = __assign(__assign({}, DEFAULT_SETTINGS), raw);
    // v0 → v1: timeLimit 필드 추가
    if (version < 1) {
        settings.timeLimit = (_b = raw.timeLimit) !== null && _b !== void 0 ? _b : '5min';
        settings.version = 1;
    }
    // 검증
    var parsed = schemas_1.UserSettingsSchema.safeParse(settings);
    if (!parsed.success) {
        console.warn('[SettingsManager] Invalid settings, using defaults:', parsed.error);
        return DEFAULT_SETTINGS;
    }
    return parsed.data;
}
var SettingsManager = /** @class */ (function () {
    function SettingsManager() {
        this.listeners = new Set();
        this.settings = this.load();
    }
    SettingsManager.getInstance = function () {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    };
    SettingsManager.prototype.load = function () {
        if (typeof window === 'undefined')
            return DEFAULT_SETTINGS;
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (!stored)
                return DEFAULT_SETTINGS;
            return migrateSettings(JSON.parse(stored));
        }
        catch (_a) {
            return DEFAULT_SETTINGS;
        }
    };
    SettingsManager.prototype.save = function () {
        if (typeof window === 'undefined')
            return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(__assign(__assign({}, this.settings), { version: CURRENT_VERSION })));
        }
        catch (e) {
            console.error('[SettingsManager] Failed to save settings:', e);
        }
    };
    SettingsManager.prototype.get = function () {
        return this.settings;
    };
    SettingsManager.prototype.get = function (key) {
        return this.settings[key];
    };
    SettingsManager.prototype.set = function (key, value) {
        var _a;
        var newSettings = __assign(__assign({}, this.settings), (_a = {}, _a[key] = value, _a));
        var parsed = schemas_1.UserSettingsSchema.safeParse(newSettings);
        if (!parsed.success) {
            throw new Error("Invalid setting value for ".concat(key, ": ").concat(parsed.error.message));
        }
        this.settings = parsed.data;
        this.save();
        this.notify();
    };
    SettingsManager.prototype.setAll = function (partial) {
        var newSettings = __assign(__assign({}, this.settings), partial);
        var parsed = schemas_1.UserSettingsSchema.safeParse(newSettings);
        if (!parsed.success) {
            throw new Error("Invalid settings: ".concat(parsed.error.message));
        }
        this.settings = parsed.data;
        this.save();
        this.notify();
    };
    SettingsManager.prototype.reset = function () {
        this.settings = DEFAULT_SETTINGS;
        this.save();
        this.notify();
    };
    SettingsManager.prototype.subscribe = function (listener) {
        var _this = this;
        this.listeners.add(listener);
        return function () { return _this.listeners.delete(listener); };
    };
    SettingsManager.prototype.notify = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            try {
                listener(this.settings);
            }
            catch (e) {
                console.error('[SettingsManager] Listener error:', e);
            }
        }
    };
    return SettingsManager;
}());
exports.SettingsManager = SettingsManager;
// ============================================
// React 훅 (클라이언트 사이드 전용)
// ============================================
var react_1 = require("react");
function useSettings() {
    var manager = SettingsManager.getInstance();
    return (0, react_1.useSyncExternalStore)(manager.subscribe.bind(manager), manager.get.bind(manager), function () { return DEFAULT_SETTINGS; });
}
function useSetting(key) {
    var settings = useSettings();
    return settings[key];
}
// ============================================
// 편의 함수
// ============================================
function getSettings() {
    return SettingsManager.getInstance().get();
}
function setSetting(key, value) {
    SettingsManager.getInstance().set(key, value);
}
//# sourceMappingURL=SettingsManager.js.map