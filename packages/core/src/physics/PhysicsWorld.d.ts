import { Engine, World, Body, Constraint } from 'matter-js';
import { Vector2, BodyPartId } from '../domain/types';
export declare function setDeterministicSeed(seed: number): void;
export declare function getDeterministicRandom(): number;
export declare function resetDeterministicRng(): void;
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
    timestep: number;
    substeps: number;
    enableSleeping: boolean;
    reproducible: boolean;
}
export declare class PhysicsWorld {
    private engine;
    private world;
    private config;
    private fighters;
    private groundBody;
    private stepCount;
    private accumulatedTime;
    private onCollisionCallbacks;
    constructor(config?: Partial<PhysicsWorldConfig>);
    createFighterBody(id: string, position: Vector2, bodySpec: any, // BodySpec 타입
    maxHealth?: number, maxStamina?: number): FighterPhysics;
    private addLimbConstraints;
    createGrab(attackerId: string, defenderId: string, attackerPart: BodyPartId, defenderPart: BodyPartId, strength: number): Constraint | null;
    releaseGrab(constraint: Constraint): void;
    step(deltaTime?: number): void;
    resetWithSeed(seed: number): void;
    getFighter(id: string): FighterPhysics | undefined;
    removeFighter(id: string): void;
    onCollision(cb: (a: Body, b: Body, pair: any) => void): () => void;
    getWorld(): World;
    getEngine(): Engine;
    getStepCount(): number;
    getDebugData(): any;
    destroy(): void;
}
export declare function createPhysicsWorld(config?: Partial<PhysicsWorldConfig>): PhysicsWorld;
export declare function getPhysicsWorld(): PhysicsWorld | null;
export declare function destroyPhysicsWorld(): void;
//# sourceMappingURL=PhysicsWorld.d.ts.map