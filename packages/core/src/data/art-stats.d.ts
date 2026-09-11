import { CoreStats, ParsedBackground } from '../domain/fighter';
export interface ArtStatWeights {
    strength: number;
    speed: number;
    endurance: number;
    agility: number;
    technique: number;
    durability: number;
    intelligence: number;
    composure: number;
}
export declare const ART_STAT_WEIGHTS: Record<string, ArtStatWeights>;
export declare const ART_ALIASES: Record<string, string>;
export declare function normalizeArt(input: string): string;
export interface StatDerivationInput {
    height: number;
    weight: number;
    skeletalMuscleMass: number;
    bodyFatMass: number;
    age: number;
    sex: 'male' | 'female';
    parsedBackground: ParsedBackground;
}
export declare function deriveCoreStats(input: StatDerivationInput): CoreStats;
export declare const ART_TECHNIQUE_MAP: Record<string, string[]>;
export declare function getRecommendedTechniques(primaryArt: string, experienceMonths: number): string[];
//# sourceMappingURL=art-stats.d.ts.map