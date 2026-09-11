export interface PsychologyState {
    fearLevel: number;
    rageLevel: number;
    confidence: number;
    focus: number;
    surrenderUrge: number;
}
export interface PsychologyConfig {
    fearPerDamage: number;
    fearPerKnockdown: number;
    fearPerBloodLoss: number;
    fearDecayPerSecond: number;
    fearHomeGroundReduction: number;
    ragePerDamageTaken: number;
    ragePerDamageDealt: number;
    ragePerTaunt: number;
    rageDecayPerSecond: number;
    rageThreshold: number;
    confidenceBase: number;
    confidencePerWin: number;
    confidencePerLoss: number;
    confidencePerKnockdown: number;
    surrenderBaseThreshold: number;
    surrenderFearWeight: number;
    surrenderPainWeight: number;
    surrenderFunctionalLossWeight: number;
    surrenderRageReduction: number;
    homeGroundFearReduction: number;
    homeGroundConfidenceBoost: number;
}
export declare const DEFAULT_PSYCHOLOGY_CONFIG: PsychologyConfig;
export declare class PsychologySystem {
    private config;
    private state;
    constructor(config?: Partial<PsychologyConfig>);
    reset(): void;
    getState(): Readonly<PsychologyState>;
    updateFear(damageTaken: number, events: CombatEvent[], dt: number, isHomeGround: boolean): void;
    updateRage(damageTaken: number, damageDealt: number, events: CombatEvent[], dt: number): void;
    updateConfidence(roundResult: 'win' | 'loss' | 'draw', knockdowns: number, dt: number): void;
    calculateSurrenderUrge(painLevel: number, functionalLoss: number, deathAllowed: boolean): number;
    checkSurrender(painLevel: number, functionalLoss: number, deathAllowed: boolean): boolean;
    applyHomeGroundBonus(isHomeGround: boolean): void;
    applyKillIntent(killIntent: number): void;
    private clamp;
}
export interface CombatEvent {
    type: string;
    damage?: number;
    target?: string;
    actor?: string;
}
export interface PsychologyState {
    fearLevel: number;
    rageLevel: number;
    confidence: number;
    focus: number;
    surrenderUrge: number;
}
export declare const psychologySystem: PsychologySystem;
//# sourceMappingURL=psychology-system.d.ts.map