// ============================================
// @fight-sim/core - 메인 진입점
// ============================================

// 도메인 타입
export * from '../domain';

// 데이터
export * from '../data/schemas';
export * from '../data/art-stats';
export * from '../data/anchor-values';
export * from '../data/body-segments';
export * from '../data/animal-traits';

// 설정
export * from '../settings/SettingsManager';

// 물리
export * from '../physics/PhysicsWorld';

// 파서
export * from '../parser/BackgroundParser';

// 엔진 (인터페이스만)
export * from '../engine';