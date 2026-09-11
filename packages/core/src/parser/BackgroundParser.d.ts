import { ParsedBackground } from '../data/schemas';
export interface ParseResult {
    parsed: ParsedBackground;
    warnings: string[];
    extracted: {
        arts: Array<{
            art: string;
            confidence: number;
        }>;
        durations: Array<{
            value: number;
            unit: string;
            confidence: number;
        }>;
        frequencies: Array<{
            value: number;
            confidence: number;
        }>;
    };
}
export declare class BackgroundParser {
    private input;
    parse(input: string): ParseResult;
    private extractArts;
    private extractDurations;
    private extractFrequencies;
    private extractGym;
    private buildParsedBackground;
    private generateWarnings;
}
export declare function parseMartialArtsHistory(input: string): ParseResult;
export declare const ART_OPTIONS: {
    value: string;
    label: string;
    aliases: string[];
}[];
export declare const DURATION_OPTIONS: {
    value: number;
    label: string;
}[];
export declare const FREQUENCY_OPTIONS: {
    value: number;
    label: string;
}[];
//# sourceMappingURL=BackgroundParser.d.ts.map