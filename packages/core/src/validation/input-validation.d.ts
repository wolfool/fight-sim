import { UserProfile, UserSettings, ParsedBackground } from '../domain/fighter';
export declare class ValidationError extends Error {
    field: string;
    code: string;
    value: any;
    constructor(field: string, code: string, message: string, value: any);
}
export interface BoundaryTestCase {
    name: string;
    input: Partial<UserProfile>;
    shouldPass: boolean;
    expectedErrors?: string[];
}
export declare const BOUNDARY_TEST_CASES: BoundaryTestCase[];
export declare function validateUserProfile(input: any): {
    success: boolean;
    data?: UserProfile;
    errors: ValidationError[];
};
export declare function validateUserSettings(input: any): {
    success: boolean;
    data?: UserSettings;
    errors: ValidationError[];
};
export declare function validateParsedBackground(input: any): {
    success: boolean;
    data?: ParsedBackground;
    errors: ValidationError[];
};
export declare function validateSimulationInput(input: {
    fighterA: UserProfile;
    fighterB: UserProfile;
    settings: UserSettings;
}): {
    success: boolean;
    errors: ValidationError[];
};
export declare function runBoundaryTests(): Promise<{
    passed: number;
    failed: number;
    details: any[];
}>;
export declare function guardAgainstNaN(value: number, fieldName: string, fallback?: number): number;
export declare function clampToRange(value: number, min: number, max: number, fieldName: string): number;
//# sourceMappingURL=input-validation.d.ts.map