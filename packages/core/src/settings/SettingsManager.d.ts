import { type UserSettings } from '../data/schemas';
export declare class SettingsManager {
    private static instance;
    private settings;
    private listeners;
    private constructor();
    static getInstance(): SettingsManager;
    private load;
    private save;
    get(): Readonly<UserSettings>;
    set<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void;
    setAll(partial: Partial<UserSettings>): void;
    reset(): void;
    subscribe(listener: (settings: UserSettings) => void): () => void;
    private notify;
}
export declare function useSettings(): Readonly<UserSettings>;
export declare function useSetting<K extends keyof UserSettings>(key: K): UserSettings[K];
export declare function getSettings(): Readonly<UserSettings>;
export declare function setSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void;
//# sourceMappingURL=SettingsManager.d.ts.map