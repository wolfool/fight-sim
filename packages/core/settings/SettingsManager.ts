// ============================================
// 설정 관리 (localStorage 영구 저장, 마이그레이션 포함)
// ============================================

import { UserSettingsSchema, type UserSettings } from '../data/schemas';

const STORAGE_KEY = 'fight-sim:settings';
const CURRENT_VERSION = 1;

const DEFAULT_SETTINGS: UserSettings = {
  statsScale: 'relative',
  simulationCount: 200,
  timeLimit: '5min',
};

function migrateSettings(raw: any): UserSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS;
  
  const version = raw.version ?? 0;
  let settings = { ...DEFAULT_SETTINGS, ...raw };
  
  // v0 → v1: timeLimit 필드 추가
  if (version < 1) {
    settings.timeLimit = raw.timeLimit ?? '5min';
    settings.version = 1;
  }
  
  // 검증
  const parsed = UserSettingsSchema.safeParse(settings);
  if (!parsed.success) {
    console.warn('[SettingsManager] Invalid settings, using defaults:', parsed.error);
    return DEFAULT_SETTINGS;
  }
  
  return parsed.data;
}

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: UserSettings;
  private listeners: Set<(settings: UserSettings) => void> = new Set();
  
  private constructor() {
    this.settings = this.load();
  }
  
  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }
  
  private load(): UserSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_SETTINGS;
      return migrateSettings(JSON.parse(stored));
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  
  private save(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...this.settings, version: CURRENT_VERSION }));
    } catch (e) {
      console.error('[SettingsManager] Failed to save settings:', e);
    }
  }
  
  get(): Readonly<UserSettings> {
    return this.settings;
  }
  
  get<K extends keyof UserSettings>(key: K): UserSettings[K] {
    return this.settings[key];
  }
  
  set<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    const newSettings = { ...this.settings, [key]: value };
    const parsed = UserSettingsSchema.safeParse(newSettings);
    if (!parsed.success) {
      throw new Error(`Invalid setting value for ${key}: ${parsed.error.message}`);
    }
    this.settings = parsed.data;
    this.save();
    this.notify();
  }
  
  setAll(partial: Partial<UserSettings>): void {
    const newSettings = { ...this.settings, ...partial };
    const parsed = UserSettingsSchema.safeParse(newSettings);
    if (!parsed.success) {
      throw new Error(`Invalid settings: ${parsed.error.message}`);
    }
    this.settings = parsed.data;
    this.save();
    this.notify();
  }
  
  reset(): void {
    this.settings = DEFAULT_SETTINGS;
    this.save();
    this.notify();
  }
  
  subscribe(listener: (settings: UserSettings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.settings);
      } catch (e) {
        console.error('[SettingsManager] Listener error:', e);
      }
    }
  }
}

// ============================================
// React 훅 (클라이언트 사이드 전용)
// ============================================

import { useSyncExternalStore } from 'react';

export function useSettings(): Readonly<UserSettings> {
  const manager = SettingsManager.getInstance();
  
  return useSyncExternalStore(
    manager.subscribe.bind(manager),
    manager.get.bind(manager),
    () => DEFAULT_SETTINGS
  );
}

export function useSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
  const settings = useSettings();
  return settings[key];
}

// ============================================
// 편의 함수
// ============================================

export function getSettings(): Readonly<UserSettings> {
  return SettingsManager.getInstance().get();
}

export function setSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
  SettingsManager.getInstance().set(key, value);
}