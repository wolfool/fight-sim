// ============================================
// Psychology System - 공포/분노/항복 수식화
// ============================================

import { Fighter } from '../domain/fighter';

export interface PsychologyState {
  fearLevel: number;        // 0-100: 공포 수준
  rageLevel: number;        // 0-100: 분노 수준
  confidence: number;       // 0-100: 자신감
  focus: number;            // 0-100: 집중도
  surrenderUrge: number;    // 0-100: 포기 충동
}

export interface PsychologyConfig {
  // 공포 증가/감소 계수
  fearPerDamage: number;           // 데미지당 공포 증가
  fearPerKnockdown: number;        // 다운당 공포 증가
  fearPerBloodLoss: number;        // 출혈량%당 공포 증가
  fearDecayPerSecond: number;      // 초당 자연 감소
  fearHomeGroundReduction: number; // 홈그라운드 공포 감소
  
  // 분노 증가/감소 계수
  ragePerDamageTaken: number;      // 받은 데미지당 분노 증가
  ragePerDamageDealt: number;      // 준 데미지당 분노 증가 (우세 시)
  ragePerTaunt: number;            // 도발당 분노 증가
  rageDecayPerSecond: number;      // 초당 자연 감소
  rageThreshold: number;           // 분노 상태 진입 임계값
  
  // 자신감
  confidenceBase: number;          // 기본 자신감
  confidencePerWin: number;        // 우세 라운드당 증가
  confidencePerLoss: number;       // 열세 라운드당 감소
  confidencePerKnockdown: number;  // 다운 시 감소
  
  // 포기 임계값
  surrenderBaseThreshold: number;  // 기본 포기 임계값
  surrenderFearWeight: number;     // 공포 가중치
  surrenderPainWeight: number;     // 통증 가중치
  surrenderFunctionalLossWeight: number; // 기능상실 가중치
  surrenderRageReduction: number;  // 분노 시 포기 임계값 감소
  
  // 홈그라운드 보너스
  homeGroundFearReduction: number;
  homeGroundConfidenceBoost: number;
}

export const DEFAULT_PSYCHOLOGY_CONFIG: PsychologyConfig = {
  fearPerDamage: 0.8,
  fearPerKnockdown: 15,
  fearPerBloodLoss: 0.5,
  fearDecayPerSecond: 0.5,
  fearHomeGroundReduction: 0.3,
  
  ragePerDamageTaken: 1.2,
  ragePerDamageDealt: 0.3,
  ragePerTaunt: 5,
  rageDecayPerSecond: 0.8,
  rageThreshold: 70,
  
  confidenceBase: 50,
  confidencePerWin: 5,
  confidencePerLoss: -8,
  confidencePerKnockdown: -15,
  
  surrenderBaseThreshold: 60,
  surrenderFearWeight: 0.4,
  surrenderPainWeight: 0.3,
  surrenderFunctionalLossWeight: 0.3,
  surrenderRageReduction: 20,
  
  homeGroundFearReduction: 0.3,
  homeGroundConfidenceBoost: 0.2,
};

export class PsychologySystem {
  private config: PsychologyConfig;
  private state: PsychologyState = {
    fearLevel: 0,
    rageLevel: 0,
    confidence: 50,
    focus: 100,
    surrenderUrge: 0,
  };
  
  constructor(config: Partial<PsychologyConfig> = {}) {
    this.config = { ...DEFAULT_PSYCHOLOGY_CONFIG, ...config };
    this.reset();
  }
  
  reset(): void {
    this.state = {
      fearLevel: 0,
      rageLevel: 0,
      confidence: this.config.confidenceBase,
      focus: 100,
      surrenderUrge: 0,
    };
  }
  
  getState(): Readonly<PsychologyState> {
    return { ...this.state };
  }
  
  // ===== 공포 업데이트 =====
  updateFear(damageTaken: number, events: CombatEvent[], dt: number, isHomeGround: boolean): void {
    let delta = 0;
    
    // 데미지 기반 공포
    delta += damageTaken * this.config.fearPerDamage;
    
    // 이벤트 기반 공포 (다운, 큰 데미지 등)
    for (const event of events) {
      if (event.type === 'knockdown' && event.target === 'self') {
        delta += this.config.fearPerKnockdown;
      }
      if (event.type === 'strike' && event.damage && event.damage > 30) {
        delta += event.damage * 0.2;
      }
    }
    
    // 자연 감소
    delta -= this.config.fearDecayPerSecond * dt;
    
    // 홈그라운드 보너스
    if (isHomeGround) {
      delta -= this.state.fearLevel * this.config.fearHomeGroundReduction * dt;
    }
    
    this.state.fearLevel = this.clamp(this.state.fearLevel + delta);
  }
  
  // ===== 분노 업데이트 =====
  updateRage(damageTaken: number, damageDealt: number, events: CombatEvent[], dt: number): void {
    let delta = 0;
    
    delta += damageTaken * this.config.ragePerDamageTaken;
    delta += damageDealt * this.config.ragePerDamageDealt;
    
    for (const event of events) {
      if (event.type === 'taunt') {
        delta += this.config.ragePerTaunt;
      }
    }
    
    delta -= this.config.rageDecayPerSecond * dt;
    
    this.state.rageLevel = this.clamp(this.state.rageLevel + delta);
  }
  
  // ===== 자신감 업데이트 =====
  updateConfidence(roundResult: 'win' | 'loss' | 'draw', knockdowns: number, dt: number): void {
    let delta = 0;
    
    if (roundResult === 'win') delta += this.config.confidencePerWin;
    else if (roundResult === 'loss') delta += this.config.confidencePerLoss;
    
    delta += knockdowns * this.config.confidencePerKnockdown;
    
    // 자연스럽게 기본값으로 회귀
    delta += (this.config.confidenceBase - this.state.confidence) * 0.01 * dt;
    
    this.state.confidence = this.clamp(this.state.confidence + delta);
  }
  
  // ===== 포기 충동 계산 =====
  calculateSurrenderUrge(painLevel: number, functionalLoss: number, deathAllowed: boolean): number {
    if (deathAllowed) return 0; // 죽음을 각오함 = 포기 안 함
    
    const fearComponent = this.state.fearLevel * this.config.surrenderFearWeight;
    const painComponent = painLevel * this.config.surrenderPainWeight;
    const functionalComponent = functionalLoss * 100 * this.config.surrenderFunctionalLossWeight;
    
    let urge = fearComponent + painComponent + functionalComponent;
    
    // 분노가 높으면 포기 충동 감소
    if (this.state.rageLevel > this.config.rageThreshold) {
      urge -= this.config.surrenderRageReduction;
    }
    
    // 자신감 높으면 포기 충동 감소
    urge -= (this.state.confidence - 50) * 0.2;
    
    this.state.surrenderUrge = this.clamp(urge);
    return this.state.surrenderUrge;
  }
  
  // ===== 포기 판정 =====
  checkSurrender(painLevel: number, functionalLoss: number, deathAllowed: boolean): boolean {
    if (deathAllowed) return false;
    
    const urge = this.calculateSurrenderUrge(painLevel, functionalLoss, deathAllowed);
    return urge >= this.config.surrenderBaseThreshold;
  }
  
  // ===== 홈그라운드 보너스 적용 =====
  applyHomeGroundBonus(isHomeGround: boolean): void {
    if (!isHomeGround) return;
    
    this.state.fearLevel = this.clamp(this.state.fearLevel * (1 - this.config.homeGroundFearReduction));
    this.state.confidence = this.clamp(this.state.confidence + 
      this.config.confidenceBase * this.config.homeGroundConfidenceBoost);
  }
  
  // ===== 킬 인텐트 적용 =====
  applyKillIntent(killIntent: number): void {
    // killIntent 0-100: 높을수록 공포 감소, 분노 증가, 포기 억제
    this.state.fearLevel = this.clamp(this.state.fearLevel * (1 - killIntent / 200));
    this.state.rageLevel = this.clamp(this.state.rageLevel + killIntent * 0.3);
    this.state.surrenderUrge = this.clamp(this.state.surrenderUrge * (1 - killIntent / 150));
  }
  
  private clamp(value: number, min = 0, max = 100): number {
    return Math.max(min, Math.min(max, value));
  }
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

export const psychologySystem = new PsychologySystem();

