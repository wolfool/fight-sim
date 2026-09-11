export interface AnchorValues {
    strength: {
        label: '펀치 피크 힘';
        unit: 'N';
        value: number;
        description: string;
    };
    speed: {
        label: '펀치 피크 속도';
        unit: 'm/s';
        value: number;
        description: string;
    };
    endurance: {
        label: '최대 산소 섭취량';
        unit: 'ml/kg/min';
        value: number;
        description: string;
    };
    durability: {
        label: '두부 충격 내성 (HIC)';
        unit: 'HIC';
        value: number;
        description: string;
    };
    strikeImpulse: {
        label: '펀치 임펄스';
        unit: 'N·s';
        value: number;
        description: string;
    };
    strikeEnergy: {
        label: '펀치 충격 에너지';
        unit: 'J';
        value: number;
        description: string;
    };
    biteForce: {
        label: '교합력';
        unit: 'N';
        value: number;
        description: string;
    };
    gripStrength: {
        label: '악력';
        unit: 'N';
        value: number;
        description: string;
    };
    sprintSpeed: {
        label: '최대 질주 속도';
        unit: 'm/s';
        value: number;
        description: string;
    };
}
export declare const ANCHOR_VALUES: AnchorValues;
export type StatKey = keyof AnchorValues;
export declare function relativeToAbsolute(relative: number, stat: StatKey): number;
export declare function absoluteToRelative(absolute: number, stat: StatKey): number;
export declare function formatAbsolute(value: number, stat: StatKey): string;
export declare function getStatLabel(stat: StatKey): string;
export declare function getStatUnit(stat: StatKey): string;
export declare function getStatDescription(stat: StatKey): string;
import { CoreStats } from '../domain/fighter';
export declare function coreStatsToAbsolute(stats: CoreStats): Record<string, number>;
export declare function coreStatsFromAbsolute(absolute: Record<string, number>): Partial<CoreStats>;
//# sourceMappingURL=anchor-values.d.ts.map