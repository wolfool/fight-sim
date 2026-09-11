// ============================================
// Matter.js 래퍼 (Best-effort 재현성 지원)
// ============================================

import { Engine, World, Body, Bodies, Constraint, Vector, Events, Runner, Composite } from 'matter-js';
import seedrandom from 'seedrandom';
import { Vector2, BodyPartId } from '../domain/types';
import { ZATSIORSKY_SEGMENTS } from '../data/body-segments';

// ============================================
// 결정론적 RNG
// ============================================

let deterministicRng: (() => number) | null = null;

export function setDeterministicSeed(seed: number): void {
  deterministicRng = seedrandom(seed.toString());
}

export function getDeterministicRandom(): number {
  return deterministicRng ? deterministicRng() : Math.random();
}

export function resetDeterministicRng(): void {
  deterministicRng = null;
}

// ============================================
// 파이터 물리 바디 구성
// ============================================

export interface FighterPhysics {
  id: string;
  mainBody: Body;
  segmentBodies: Map<BodyPartId, Body>;
  constraints: Constraint[];
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
}

export interface PhysicsWorldConfig {
  gravity?: Vector2;
  timestep: number;        // 고정 16.666...ms (60Hz)
  substeps: number;
  enableSleeping: boolean;
  reproducible: boolean;   // 시드 고정으로 재현성 시도 (Matter.js 부동소수점 한계로 미세 차이 허용)
}

const DEFAULT_CONFIG: PhysicsWorldConfig = {
  gravity: { x: 0, y: 9.81 },
  timestep: 1000 / 60,
  substeps: 4,
  enableSleeping: false,
  reproducible: true,
};

// ============================================
// PhysicsWorld 클래스
// ============================================

export class PhysicsWorld {
  private engine: Engine;
  private world: World;
  private config: PhysicsWorldConfig;
  private fighters: Map<string, FighterPhysics> = new Map();
  private groundBody: Body;
  private stepCount = 0;
  private accumulatedTime = 0;
  private onCollisionCallbacks: Array<(a: Body, b: Body, pair: any) => void> = [];
  
  constructor(config: Partial<PhysicsWorldConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // 재현성 모드: 시드 고정 (Matter.js 부동소수점 한계로 미세 차이 허용)
    if (this.config.reproducible) {
      setDeterministicSeed(12345); // 기본 시드, 시뮬레이션 시작 시 재설정
    }
    
    this.engine = Engine.create({
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
    this.groundBody = Bodies.rectangle(0, 50, 200, 100, {
      isStatic: true,
      restitution: 0.1,
      friction: 0.8,
      collisionFilter: { group: -1 },
    });
    World.add(this.world, this.groundBody);
    
    // 충돌 이벤트
    Events.on(this.engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        for (const cb of this.onCollisionCallbacks) {
          cb(pair.bodyA, pair.bodyB, pair);
        }
      }
    });
  }
  
  // ============================================
  // 파이터 바디 생성
  // ============================================
  
  createFighterBody(
    id: string,
    position: Vector2,
    bodySpec: any, // BodySpec 타입
    maxHealth = 100,
    maxStamina = 100
  ): FighterPhysics {
    const segmentBodies = new Map<BodyPartId, Body>();
    const constraints: Constraint[] = [];
    
    // 메인 바디 (골반/중심)
    const mainBody = Bodies.circle(position.x, position.y, 15, {
      mass: bodySpec.weight * 0.3,
      restitution: 0.1,
      friction: 0.6,
      frictionAir: 0.05,
      label: `fighter_${id}_main`,
      collisionFilter: { category: 0x0001, mask: 0x0001 | 0x0002 },
    });
    
    // 세그먼트별 바디 생성 (단순화: 주요 8개만)
    const segmentDefs = [
      { id: 'torso_front' as BodyPartId, offset: { x: 0, y: -40 }, radius: 20, massFactor: 0.3 },
      { id: 'head' as BodyPartId, offset: { x: 0, y: -80 }, radius: 12, massFactor: 0.07 },
      { id: 'arm_upper_l' as BodyPartId, offset: { x: -30, y: -30 }, radius: 8, massFactor: 0.03 },
      { id: 'arm_lower_l' as BodyPartId, offset: { x: -50, y: -30 }, radius: 7, massFactor: 0.02 },
      { id: 'hand_l' as BodyPartId, offset: { x: -65, y: -30 }, radius: 5, massFactor: 0.006 },
      { id: 'arm_upper_r' as BodyPartId, offset: { x: 30, y: -30 }, radius: 8, massFactor: 0.03 },
      { id: 'arm_lower_r' as BodyPartId, offset: { x: 50, y: -30 }, radius: 7, massFactor: 0.02 },
      { id: 'hand_r' as BodyPartId, offset: { x: 65, y: -30 }, radius: 5, massFactor: 0.006 },
      { id: 'leg_upper_l' as BodyPartId, offset: { x: -15, y: 30 }, radius: 10, massFactor: 0.1 },
      { id: 'leg_lower_l' as BodyPartId, offset: { x: -15, y: 60 }, radius: 8, massFactor: 0.05 },
      { id: 'foot_l' as BodyPartId, offset: { x: -15, y: 85 }, radius: 6, massFactor: 0.015 },
      { id: 'leg_upper_r' as BodyPartId, offset: { x: 15, y: 30 }, radius: 10, massFactor: 0.1 },
      { id: 'leg_lower_r' as BodyPartId, offset: { x: 15, y: 60 }, radius: 8, massFactor: 0.05 },
      { id: 'foot_r' as BodyPartId, offset: { x: 15, y: 85 }, radius: 6, massFactor: 0.015 },
    ];
    
    for (const def of segmentDefs) {
      const body = Bodies.circle(
        position.x + def.offset.x,
        position.y + def.offset.y,
        def.radius,
        {
          mass: bodySpec.weight * def.massFactor,
          restitution: 0.1,
          friction: 0.6,
          frictionAir: 0.05,
          label: `fighter_${id}_${def.id}`,
          collisionFilter: { category: 0x0001, mask: 0x0001 | 0x0002 },
        }
      );
      
      segmentBodies.set(def.id, body);
      
      // 메인 바디와 연결 (스프링 제약)
      const constraint = Constraint.create({
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
    World.add(this.world, [mainBody, ...segmentBodies.values(), ...constraints]);
    
    const physics: FighterPhysics = {
      id,
      mainBody,
      segmentBodies,
      constraints,
      health: maxHealth,
      maxHealth,
      stamina: maxStamina,
      maxStamina,
    };
    
    this.fighters.set(id, physics);
    return physics;
  }
  
  private addLimbConstraints(
    mainBody: Body,
    segments: Map<BodyPartId, Body>,
    constraints: Constraint[]
  ): void {
    const limbChains: [BodyPartId, BodyPartId][] = [
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
    
    for (const [proximal, distal] of limbChains) {
      const bodyA = segments.get(proximal);
      const bodyB = segments.get(distal);
      if (bodyA && bodyB) {
        // Physics-based stiffness: k = ω² * m_eff, where ω = 2πf (f ~ 10Hz for muscle)
        const mEff = (bodyA.mass * bodyB.mass) / (bodyA.mass + bodyB.mass);
        const stiffness = Math.min(1.0, (2 * Math.PI * 10) ** 2 * mEff / 1000); // 정규화
        const damping = 2 * 0.7 * Math.sqrt(stiffness * mEff); // critical damping ratio 0.7
        
        const constraint = Constraint.create({
          bodyA,
          bodyB,
          pointA: { x: 0, y: 0 },
          pointB: { x: 0, y: 0 },
          stiffness,
          damping,
          length: Vector.magnitude(Vector.sub(bodyB.position, bodyA.position)),
        });
        constraints.push(constraint);
      }
    }
  }
  
  // ============================================
  // 그랩/클린치 제약 생성
  // ============================================
  
  createGrab(
    attackerId: string,
    defenderId: string,
    attackerPart: BodyPartId,
    defenderPart: BodyPartId,
    strength: number  // 0-1, attacker's relative strength
  ): Constraint | null {
    const attacker = this.fighters.get(attackerId);
    const defender = this.fighters.get(defenderId);
    if (!attacker || !defender) return null;
    
    const bodyA = attacker.segmentBodies.get(attackerPart);
    const bodyB = defender.segmentBodies.get(defenderPart);
    if (!bodyA || !bodyB) return null;
    
    // Physics-based grab constraint
    // Stiffness based on combined mass and strength: k ∝ (mA + mB) * strength
    const mEff = (bodyA.mass * bodyB.mass) / (bodyA.mass + bodyB.mass);
    const baseStiffness = 500 * mEff; // N/m per kg
    const stiffness = Math.min(1.0, baseStiffness * strength / 1000);
    
    // Damping: critical damping ratio ζ = 0.8 for firm grab
    const damping = 2 * 0.8 * Math.sqrt(stiffness * mEff);
    
    const constraint = Constraint.create({
      bodyA,
      bodyB,
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: 0 },
      stiffness,
      damping,
      length: Vector.magnitude(Vector.sub(bodyB.position, bodyA.position)),
    });
    
    World.add(this.world, constraint);
    attacker.constraints.push(constraint);
    defender.constraints.push(constraint);
    
    return constraint;
  }
  
  releaseGrab(constraint: Constraint): void {
    Composite.remove(this.world, constraint);
  }
  
  // ============================================
  // 시뮬레이션 스텝
  // ============================================
  
  step(deltaTime?: number): void {
    const dt = deltaTime ?? this.config.timestep;
    this.accumulatedTime += dt;
    
    // 고정 서브스텝
    const subDt = dt / this.config.substeps;
    for (let i = 0; i < this.config.substeps; i++) {
      Engine.update(this.engine, subDt);
    }
    
    this.stepCount++;
  }
  
  // 재현성을 위한 시드 리셋
  resetWithSeed(seed: number): void {
    setDeterministicSeed(seed);
    this.stepCount = 0;
    this.accumulatedTime = 0;
  }
  
  // ============================================
  // 유틸리티
  // ============================================
  
  getFighter(id: string): FighterPhysics | undefined {
    return this.fighters.get(id);
  }
  
  removeFighter(id: string): void {
    const fighter = this.fighters.get(id);
    if (fighter) {
      Composite.remove(this.world, [
        fighter.mainBody,
        ...fighter.segmentBodies.values(),
        ...fighter.constraints,
      ]);
      this.fighters.delete(id);
    }
  }
  
  onCollision(cb: (a: Body, b: Body, pair: any) => void): () => void {
    this.onCollisionCallbacks.push(cb);
    return () => {
      const idx = this.onCollisionCallbacks.indexOf(cb);
      if (idx >= 0) this.onCollisionCallbacks.splice(idx, 1);
    };
  }
  
  getWorld(): World {
    return this.world;
  }
  
  getEngine(): Engine {
    return this.engine;
  }
  
  getStepCount(): number {
    return this.stepCount;
  }
  
  // 디버그 렌더링용 데이터 추출
  getDebugData(): any {
    return {
      bodies: Array.from(this.fighters.values()).flatMap(f => [
        f.mainBody,
        ...f.segmentBodies.values(),
      ]).map(b => ({
        id: b.id,
        label: b.label,
        position: { x: b.position.x, y: b.position.y },
        angle: b.angle,
        velocity: { x: b.velocity.x, y: b.velocity.y },
        circleRadius: (b as any).circleRadius,
        vertices: b.vertices,
      })),
      constraints: Array.from(this.fighters.values()).flatMap(f => f.constraints).map(c => ({
        id: c.id,
        bodyA: c.bodyA?.label,
        bodyB: c.bodyB?.label,
        pointA: c.pointA,
        pointB: c.pointB,
        stiffness: c.stiffness,
      })),
    };
  }
  
  destroy(): void {
    Events.off(this.engine, 'collisionStart');
    World.clear(this.world, false);
    Engine.clear(this.engine);
    this.fighters.clear();
    this.onCollisionCallbacks = [];
  }
}

// ============================================
// 싱글톤 팩토리
// ============================================

let physicsWorldInstance: PhysicsWorld | null = null;

export function createPhysicsWorld(config?: Partial<PhysicsWorldConfig>): PhysicsWorld {
  physicsWorldInstance = new PhysicsWorld(config);
  return physicsWorldInstance;
}

export function getPhysicsWorld(): PhysicsWorld | null {
  return physicsWorldInstance;
}

export function destroyPhysicsWorld(): void {
  if (physicsWorldInstance) {
    physicsWorldInstance.destroy();
    physicsWorldInstance = null;
    resetDeterministicRng();
  }
}

