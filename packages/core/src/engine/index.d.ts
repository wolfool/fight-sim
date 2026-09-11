import { Fighter, FightContext, FightResult, ReplaySnapshot, CombatEvent, WinProbability } from '../domain';
export interface SimulationEngine {
    initialize(fighterA: Fighter, fighterB: Fighter, context: FightContext): void;
    step(): boolean;
    getCurrentState(): SimulationState;
    getResult(): FightResult;
    getReplaySnapshots(): ReplaySnapshot[];
    getCombatLog(): CombatEvent[];
}
export interface SimulationState {
    time: number;
    round: number;
    roundTime: number;
    fighterA: FighterStateSnapshot;
    fighterB: FighterStateSnapshot;
    events: CombatEvent[];
    isFinished: boolean;
    finishType?: string;
}
export interface FighterStateSnapshot {
    id: string;
    health: number;
    stamina: number;
    position: {
        x: number;
        y: number;
    };
    posture: string;
    currentAction: string | null;
    activeInjuries: any[];
}
export interface CombatResolver {
    checkCollision(attacker: any, defender: any, techniqueId: string): CollisionResult;
    calculateDamage(collision: CollisionResult, techniqueId: string, defender: any): DamageResult;
    applyDamage(defender: any, damage: DamageResult): any[];
    checkKnockout(injuries: any[], fighter: any): KOResult;
    checkDeath(injuries: any[], fighter: any, deathAllowed: boolean): DeathResult;
}
export interface CollisionResult {
    hit: boolean;
    contactPoint: {
        x: number;
        y: number;
    };
    force: {
        x: number;
        y: number;
    };
    pressure: number;
    energy: number;
    defenderPart: string;
}
export interface DamageResult {
    totalDamage: number;
    partDamages: Map<string, any>;
    injuries: any[];
    knockback: any;
    stun: any;
    ko: KOResult;
    death: DeathResult;
}
export interface KOResult {
    isKO: boolean;
    type?: 'instant' | 'count10' | 'tko';
    unconsciousTime?: number;
}
export interface DeathResult {
    isDead: boolean;
    cause?: string;
}
export interface DecisionEngine {
    decide(fighter: any, opponent: any, context: DecisionContext): DecisionOutput;
}
export interface DecisionContext {
    distance: number;
    timeRemaining: number;
    staminaRatio: number;
    healthRatio: number;
    opponentHealthRatio: number;
    opponentPosture: string;
    recentEvents: any[];
}
export type DecisionOutput = {
    type: 'attack';
    techniqueId: string;
    targetPart: string;
    commitment: number;
} | {
    type: 'defend';
    guardType: string;
    targetPart: string;
} | {
    type: 'move';
    direction: {
        x: number;
        y: number;
    };
    distance: number;
} | {
    type: 'feint';
    techniqueId: string;
    realTechniqueId?: string;
} | {
    type: 'wait';
    duration: number;
} | {
    type: 'surrender';
};
export interface PhysiologySystem {
    updateFatigue(fighter: any, action: any, dt: number): number;
    updateHormones(fighter: any, events: any[], dt: number): void;
    recoverBetweenRounds(fighter: any): void;
}
export interface PsychologySystem {
    calculateFear(fighter: any, events: any[]): number;
    checkSurrender(fighter: any, deathAllowed: boolean): boolean;
    applyKillIntent(attacker: any, defender: any): void;
    applyHomeGroundBonus(fighter: any, bonus: any): void;
    updateRage(fighter: any, damageTaken: number): void;
}
export interface WinProbabilityCalculator {
    calculate(fighterA: Fighter, fighterB: Fighter, context: FightContext, n: number): Promise<WinProbability>;
}
export declare function createSimulationEngine(): SimulationEngine;
export declare function createCombatResolver(): CombatResolver;
export declare function createDecisionEngine(): DecisionEngine;
export declare function createPhysiologySystem(): PhysiologySystem;
export declare function createPsychologySystem(): PsychologySystem;
export declare function createWinProbabilityCalculator(): WinProbabilityCalculator;
//# sourceMappingURL=index.d.ts.map