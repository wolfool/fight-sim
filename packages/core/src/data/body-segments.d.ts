import { BodyPartId } from '../domain/types';
export interface SegmentParams {
    massPercent: number;
    lengthPercent: number;
    comPosition: number;
    radiusGyration: number;
    density: {
        muscle: number;
        fat: number;
        bone: number;
    };
}
export declare const ZATSIORSKY_SEGMENTS: Record<BodyPartId, SegmentParams>;
export declare const KOREAN_ADJUSTMENT: {
    male: {
        massFactor: number;
        lengthFactor: number;
        boneDensityFactor: number;
    };
    female: {
        massFactor: number;
        lengthFactor: number;
        boneDensityFactor: number;
    };
};
export declare const SEGMENT_MUSCLE_DISTRIBUTION: Record<BodyPartId, number>;
export declare const SEGMENT_FAT_DISTRIBUTION: Record<BodyPartId, number>;
import { BodySegment, BodySpec } from '../domain/fighter';
export interface SegmentCalcInput {
    height: number;
    weight: number;
    skeletalMuscleMass: number;
    bodyFatMass: number;
    age: number;
    sex: 'male' | 'female';
}
export declare function calculateBodySegments(input: SegmentCalcInput): BodySegment[];
export declare function deriveBodySpec(input: SegmentCalcInput): BodySpec;
//# sourceMappingURL=body-segments.d.ts.map