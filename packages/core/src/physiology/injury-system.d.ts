import { Injury, BodyPartId } from '../domain/fighter';
export interface InjuryInteractionRules {
    samePartMultiplier: number;
    adjacentTransfer: number;
    nerveToMuscleImpact: number;
    vesselToStaminaImpact: number;
    fractureROMReduction: number;
}
export declare const DEFAULT_INJURY_RULES: InjuryInteractionRules;
export declare class InjurySystem {
    private rules;
    private injuries;
    constructor(rules?: Partial<InjuryInteractionRules>);
    addInjury(fighterId: string, newInjury: Injury, allInjuries: Injury[]): Injury;
    private applyAdjacentEffects;
    private getAdjacentParts;
    calculateFunctionalLoss(fighterId: string, partId: BodyPartId, injuries: Injury[]): number;
    calculateStaminaRecoveryMultiplier(injuries: Injury[]): number;
    calculateROMLimitation(injuries: Injury[]): Map<BodyPartId, number>;
    calculateBloodLossRate(injuries: Injury[]): number;
    calculateDeathRiskFromBloodLoss(totalBloodLoss: number, bodyWeight: number): number;
}
export declare const injurySystem: InjurySystem;
//# sourceMappingURL=injury-system.d.ts.map