"use strict";
// ============================================
// Matter.js 래퍼 (Best-effort 재현성 지원)
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
exports.PhysicsWorld = void 0;
exports.setDeterministicSeed = setDeterministicSeed;
exports.getDeterministicRandom = getDeterministicRandom;
exports.resetDeterministicRng = resetDeterministicRng;
exports.createPhysicsWorld = createPhysicsWorld;
exports.getPhysicsWorld = getPhysicsWorld;
exports.destroyPhysicsWorld = destroyPhysicsWorld;
var matter_js_1 = require("matter-js");
var seedrandom_1 = require("seedrandom");
// ============================================
// 결정론적 RNG
// ============================================
var deterministicRng = null;
function setDeterministicSeed(seed) {
    deterministicRng = (0, seedrandom_1.seedrandom)(seed.toString());
}
function getDeterministicRandom() {
    return deterministicRng ? deterministicRng() : Math.random();
}
function resetDeterministicRng() {
    deterministicRng = null;
}
var DEFAULT_CONFIG = {
    gravity: { x: 0, y: 9.81 },
    timestep: 1000 / 60,
    substeps: 4,
    enableSleeping: false,
    reproducible: true,
};
// ============================================
// PhysicsWorld 클래스
// ============================================
var PhysicsWorld = /** @class */ (function () {
    function PhysicsWorld(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        this.fighters = new Map();
        this.stepCount = 0;
        this.accumulatedTime = 0;
        this.onCollisionCallbacks = [];
        this.config = __assign(__assign({}, DEFAULT_CONFIG), config);
        // 재현성 모드: 시드 고정 (Matter.js 부동소수점 한계로 미세 차이 허용)
        if (this.config.reproducible) {
            setDeterministicSeed(12345); // 기본 시드, 시뮬레이션 시작 시 재설정
        }
        this.engine = matter_js_1.Engine.create({
            gravity: this.config.gravity,
            timing: {
                timestamp: 0,
                timeScale: 1,
                lastDelta: this.config.timestep,
            },
            positionIterations: 8,
            velocityIterations: 6,
            constraintIterations: 4,
            enableSleeping: this.config.enableSleeping,
        });
        this.world = this.engine.world;
        // 바닥 생성
        this.groundBody = matter_js_1.Bodies.rectangle(0, 50, 200, 100, {
            isStatic: true,
            restitution: 0.1,
            friction: 0.8,
            collisionFilter: { group: -1 },
        });
        matter_js_1.World.add(this.world, this.groundBody);
        // 충돌 이벤트
        matter_js_1.Events.on(this.engine, 'collisionStart', function (event) {
            for (var _i = 0, _a = event.pairs; _i < _a.length; _i++) {
                var pair = _a[_i];
                for (var _b = 0, _c = _this.onCollisionCallbacks; _b < _c.length; _b++) {
                    var cb = _c[_b];
                    cb(pair.bodyA, pair.bodyB, pair);
                }
            }
        });
    }
    // ============================================
    // 파이터 바디 생성
    // ============================================
    PhysicsWorld.prototype.createFighterBody = function (id, position, bodySpec, // BodySpec 타입
    maxHealth, maxStamina) {
        if (maxHealth === void 0) { maxHealth = 100; }
        if (maxStamina === void 0) { maxStamina = 100; }
        var segmentBodies = new Map();
        var constraints = [];
        // 메인 바디 (골반/중심)
        var mainBody = matter_js_1.Bodies.circle(position.x, position.y, 15, {
            mass: bodySpec.weight * 0.3,
            restitution: 0.1,
            friction: 0.6,
            frictionAir: 0.05,
            label: "fighter_".concat(id, "_main"),
            collisionFilter: { category: 0x0001, mask: 0x0001 | 0x0002 },
        });
        // 세그먼트별 바디 생성 (단순화: 주요 8개만)
        var segmentDefs = [
            { id: 'torso_front', offset: { x: 0, y: -40 }, radius: 20, massFactor: 0.3 },
            { id: 'head', offset: { x: 0, y: -80 }, radius: 12, massFactor: 0.07 },
            { id: 'arm_upper_l', offset: { x: -30, y: -30 }, radius: 8, massFactor: 0.03 },
            { id: 'arm_lower_l', offset: { x: -50, y: -30 }, radius: 7, massFactor: 0.02 },
            { id: 'hand_l', offset: { x: -65, y: -30 }, radius: 5, massFactor: 0.006 },
            { id: 'arm_upper_r', offset: { x: 30, y: -30 }, radius: 8, massFactor: 0.03 },
            { id: 'arm_lower_r', offset: { x: 50, y: -30 }, radius: 7, massFactor: 0.02 },
            { id: 'hand_r', offset: { x: 65, y: -30 }, radius: 5, massFactor: 0.006 },
            { id: 'leg_upper_l', offset: { x: -15, y: 30 }, radius: 10, massFactor: 0.1 },
            { id: 'leg_lower_l', offset: { x: -15, y: 60 }, radius: 8, massFactor: 0.05 },
            { id: 'foot_l', offset: { x: -15, y: 85 }, radius: 6, massFactor: 0.015 },
            { id: 'leg_upper_r', offset: { x: 15, y: 30 }, radius: 10, massFactor: 0.1 },
            { id: 'leg_lower_r', offset: { x: 15, y: 60 }, radius: 8, massFactor: 0.05 },
            { id: 'foot_r', offset: { x: 15, y: 85 }, radius: 6, massFactor: 0.015 },
        ];
        for (var _i = 0, segmentDefs_1 = segmentDefs; _i < segmentDefs_1.length; _i++) {
            var def = segmentDefs_1[_i];
            var body = matter_js_1.Bodies.circle(position.x + def.offset.x, position.y + def.offset.y, def.radius, {
                mass: bodySpec.weight * def.massFactor,
                restitution: 0.1,
                friction: 0.6,
                frictionAir: 0.05,
                label: "fighter_".concat(id, "_").concat(def.id),
                collisionFilter: { category: 0x0001, mask: 0x0001 | 0x0002 },
            });
            segmentBodies.set(def.id, body);
            // 메인 바디와 연결 (스프링 제약)
            var constraint = matter_js_1.Constraint.create({
                bodyA: mainBody,
                bodyB: body,
                pointA: { x: def.offset.x, y: def.offset.y },
                pointB: { x: 0, y: 0 },
                stiffness: 0.8,
                damping: 0.3,
                length: 0,
            });
            constraints.push(constraint);
        }
        // 세그먼트 간 연결 (팔다리 계층)
        this.addLimbConstraints(mainBody, segmentBodies, constraints);
        // 월드에 추가
        matter_js_1.World.add(this.world, __spreadArray(__spreadArray([mainBody], segmentBodies.values(), true), constraints, true));
        var physics = {
            id: id,
            mainBody: mainBody,
            segmentBodies: segmentBodies,
            constraints: constraints,
            health: maxHealth,
            maxHealth: maxHealth,
            stamina: maxStamina,
            maxStamina: maxStamina,
        };
        this.fighters.set(id, physics);
        return physics;
    };
    PhysicsWorld.prototype.addLimbConstraints = function (mainBody, segments, constraints) {
        var limbChains = [
            ['arm_upper_l', 'arm_lower_l'],
            ['arm_lower_l', 'hand_l'],
            ['arm_upper_r', 'arm_lower_r'],
            ['arm_lower_r', 'hand_r'],
            ['leg_upper_l', 'leg_lower_l'],
            ['leg_lower_l', 'foot_l'],
            ['leg_upper_r', 'leg_lower_r'],
            ['leg_lower_r', 'foot_r'],
            ['torso_front', 'head'],
        ];
        for (var _i = 0, limbChains_1 = limbChains; _i < limbChains_1.length; _i++) {
            var _a = limbChains_1[_i], proximal = _a[0], distal = _a[1];
            var bodyA = segments.get(proximal);
            var bodyB = segments.get(distal);
            if (bodyA && bodyB) {
                // Physics-based stiffness: k = ω² * m_eff, where ω = 2πf (f ~ 10Hz for muscle)
                var mEff = (bodyA.mass * bodyB.mass) / (bodyA.mass + bodyB.mass);
                var stiffness = Math.min(1.0, Math.pow((2 * Math.PI * 10), 2) * mEff / 1000); // 정규화
                var damping = 2 * 0.7 * Math.sqrt(stiffness * mEff); // critical damping ratio 0.7
                var constraint = matter_js_1.Constraint.create({
                    bodyA: bodyA,
                    bodyB: bodyB,
                    pointA: { x: 0, y: 0 },
                    pointB: { x: 0, y: 0 },
                    stiffness: stiffness,
                    damping: damping,
                    length: matter_js_1.Vector.magnitude(matter_js_1.Vector.sub(bodyB.position, bodyA.position)),
                });
                constraints.push(constraint);
            }
        }
    };
    // ============================================
    // 그랩/클린치 제약 생성
    // ============================================
    PhysicsWorld.prototype.createGrab = function (attackerId, defenderId, attackerPart, defenderPart, strength // 0-1, attacker's relative strength
    ) {
        var attacker = this.fighters.get(attackerId);
        var defender = this.fighters.get(defenderId);
        if (!attacker || !defender)
            return null;
        var bodyA = attacker.segmentBodies.get(attackerPart);
        var bodyB = defender.segmentBodies.get(defenderPart);
        if (!bodyA || !bodyB)
            return null;
        // Physics-based grab constraint
        // Stiffness based on combined mass and strength: k ∝ (mA + mB) * strength
        var mEff = (bodyA.mass * bodyB.mass) / (bodyA.mass + bodyB.mass);
        var baseStiffness = 500 * mEff; // N/m per kg
        var stiffness = Math.min(1.0, baseStiffness * strength / 1000);
        // Damping: critical damping ratio ζ = 0.8 for firm grab
        var damping = 2 * 0.8 * Math.sqrt(stiffness * mEff);
        var constraint = matter_js_1.Constraint.create({
            bodyA: bodyA,
            bodyB: bodyB,
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 },
            stiffness: stiffness,
            damping: damping,
            length: matter_js_1.Vector.magnitude(matter_js_1.Vector.sub(bodyB.position, bodyA.position)),
        });
        matter_js_1.World.add(this.world, constraint);
        attacker.constraints.push(constraint);
        defender.constraints.push(constraint);
        return constraint;
    };
    PhysicsWorld.prototype.releaseGrab = function (constraint) {
        matter_js_1.Composite.remove(this.world, constraint);
    };
    // ============================================
    // 시뮬레이션 스텝
    // ============================================
    PhysicsWorld.prototype.step = function (deltaTime) {
        var dt = deltaTime !== null && deltaTime !== void 0 ? deltaTime : this.config.timestep;
        this.accumulatedTime += dt;
        // 고정 서브스텝
        var subDt = dt / this.config.substeps;
        for (var i = 0; i < this.config.substeps; i++) {
            matter_js_1.Engine.update(this.engine, subDt);
        }
        this.stepCount++;
    };
    // 재현성을 위한 시드 리셋
    PhysicsWorld.prototype.resetWithSeed = function (seed) {
        setDeterministicSeed(seed);
        this.stepCount = 0;
        this.accumulatedTime = 0;
    };
    // ============================================
    // 유틸리티
    // ============================================
    PhysicsWorld.prototype.getFighter = function (id) {
        return this.fighters.get(id);
    };
    PhysicsWorld.prototype.removeFighter = function (id) {
        var fighter = this.fighters.get(id);
        if (fighter) {
            matter_js_1.Composite.remove(this.world, __spreadArray(__spreadArray([
                fighter.mainBody
            ], fighter.segmentBodies.values(), true), fighter.constraints, true));
            this.fighters.delete(id);
        }
    };
    PhysicsWorld.prototype.onCollision = function (cb) {
        var _this = this;
        this.onCollisionCallbacks.push(cb);
        return function () {
            var idx = _this.onCollisionCallbacks.indexOf(cb);
            if (idx >= 0)
                _this.onCollisionCallbacks.splice(idx, 1);
        };
    };
    PhysicsWorld.prototype.getWorld = function () {
        return this.world;
    };
    PhysicsWorld.prototype.getEngine = function () {
        return this.engine;
    };
    PhysicsWorld.prototype.getStepCount = function () {
        return this.stepCount;
    };
    // 디버그 렌더링용 데이터 추출
    PhysicsWorld.prototype.getDebugData = function () {
        return {
            bodies: Array.from(this.fighters.values()).flatMap(function (f) { return __spreadArray([
                f.mainBody
            ], f.segmentBodies.values(), true); }).map(function (b) { return ({
                id: b.id,
                label: b.label,
                position: { x: b.position.x, y: b.position.y },
                angle: b.angle,
                velocity: { x: b.velocity.x, y: b.velocity.y },
                circleRadius: b.circleRadius,
                vertices: b.vertices,
            }); }),
            constraints: Array.from(this.fighters.values()).flatMap(function (f) { return f.constraints; }).map(function (c) {
                var _a, _b;
                return ({
                    id: c.id,
                    bodyA: (_a = c.bodyA) === null || _a === void 0 ? void 0 : _a.label,
                    bodyB: (_b = c.bodyB) === null || _b === void 0 ? void 0 : _b.label,
                    pointA: c.pointA,
                    pointB: c.pointB,
                    stiffness: c.stiffness,
                });
            }),
        };
    };
    PhysicsWorld.prototype.destroy = function () {
        matter_js_1.Events.off(this.engine, 'collisionStart');
        matter_js_1.World.clear(this.world, false);
        matter_js_1.Engine.clear(this.engine);
        this.fighters.clear();
        this.onCollisionCallbacks = [];
    };
    return PhysicsWorld;
}());
exports.PhysicsWorld = PhysicsWorld;
// ============================================
// 싱글톤 팩토리
// ============================================
var physicsWorldInstance = null;
function createPhysicsWorld(config) {
    physicsWorldInstance = new PhysicsWorld(config);
    return physicsWorldInstance;
}
function getPhysicsWorld() {
    return physicsWorldInstance;
}
function destroyPhysicsWorld() {
    if (physicsWorldInstance) {
        physicsWorldInstance.destroy();
        physicsWorldInstance = null;
        resetDeterministicRng();
    }
}
//# sourceMappingURL=PhysicsWorld.js.map