// ============================================
// Injury Interaction Model
// 기존 부상이 새 부상/기능에 미치는 영향
// ============================================

import { Injury, BodyPartId } from '../domain/types';

export interface InjuryInteractionRules {
  // 동일 부위 중복 손상 시 악화 계수
  samePartMultiplier: number;
  // 인접 부위 손상 시 기능 저하 전이
  adjacentTransfer: number;
  // 신경 손상이 근육 기능에 미치는 영향
  nerveToMuscleImpact: number;
  // 혈관 손상이 전체 체력에 미치는 영향
  vesselToStaminaImpact: number;
  // 골절이 관절 가동범위에 미치는 영향
  fractureROMReduction: number;
}

export const DEFAULT_INJURY_RULES: InjuryInteractionRules = {
  samePartMultiplier: 1.5,      // 같은 부위 재손상 시 1.5배 악화
  adjacentTransfer: 0.3,        // 인접 부위로 30% 기능 저하 전이
  nerveToMuscleImpact: 0.5,     // 신경 손상 → 근육 기능 50% 저하
  vesselToStaminaImpact: 0.4,   // 혈관 손상 → 스태미나 회복 40% 감소
  fractureROMReduction: 0.7,    // 골절 시 가동범위 70% 감소
};

export class InjurySystem {
  private rules: InjuryInteractionRules;
  private injuries: Map<string, Injury[]> = new Map(); // fighterId -> injuries
  
  constructor(rules: Partial<InjuryInteractionRules> = {}) {
    this.rules = { ...DEFAULT_INJURY_RULES, ...rules };
  }
  
  // 새 부상 추가 시 기존 부상과의 상호작용 계산
addInjury(fighterId: string, newInjury: Injury, allInjuries: Injury[]): Injury {
    const existing = allInjuries.find(i => i.partId === newInjury.partId);
    
    if (existing) {
      // 동일 부위 재손상: 심각도 상승
      const severityOrder = ['minor', 'moderate', 'severe', 'critical'] as const;
      const currentIdx = severityOrder.indexOf(existing.severity);
      const newIdx = severityOrder.indexOf(newInjury.severity);
      const worsenedIdx = Math.min(3, Math.max(currentIdx, newIdx) + 
        Math.floor(this.rules.samePartMultiplier * (newIdx - currentIdx + 1)));
      
      return {
        ...newInjury,
        severity: severityOrder[worsenedIdx] as Injury['severity'],
        functionalLoss: Math.min(1, existing.functionalLoss + 
          newInjury.functionalLoss * this.rules.samePartMultiplier),
        description: `${existing.description} → 재손상 악화`,
      };
    }
    
    // 인접 부위 확인 및 기능 저하 전이
    this.applyAdjacentEffects(fighterId, newInjury, allInjuries);
    
    return newInjury;
  }
  
  private applyAdjacentEffects(fighterId: string, injury: Injury, allInjuries: Injury[]): void {
    const adjacentParts = this.getAdjacentParts(injury.partId);
    
    for (const adjPart of adjacentParts) {
      const adjInjury = allInjuries.find(i => i.partId === adjPart);
      if (adjInjury) {
        // 인접 부위 이미 손상된 경우 추가 악화
        adjInjury.functionalLoss = Math.min(1, 
          adjInjury.functionalLoss + injury.functionalLoss * this.rules.adjacentTransfer);
      }
    }
  }
  
  private getAdjacentParts(partId: BodyPartId): BodyPartId[] {
    const adjacency: Record<BodyPartId, BodyPartId[]> = {
      head: ['neck'],
      neck: ['head', 'torso_front', 'torso_back'],
      torso_front: ['neck', 'torso_side_l', 'torso_side_r', 'groin'],
      torso_back: ['neck', 'torso_side_l', 'torso_side_r'],
      torso_side_l: ['torso_front', 'torso_back', 'arm_upper_l', 'leg_upper_l'],
      torso_side_r: ['torso_front', 'torso_back', 'arm_upper_r', 'leg_upper_r'],
      arm_upper_l: ['torso_side_l', 'arm_lower_l'],
      arm_lower_l: ['arm_upper_l', 'hand_l'],
      hand_l: ['arm_lower_l'],
      arm_upper_r: ['torso_side_r', 'arm_lower_r'],
      arm_lower_r: ['arm_upper_r', 'hand_r'],
      hand_r: ['arm_lower_r'],
      leg_upper_l: ['torso_side_l', 'leg_lower_l'],
      leg_lower_l: ['leg_upper_l', 'foot_l'],
      foot_l: ['leg_lower_l'],
      leg_upper_r: ['torso_side_r', 'leg_lower_r'],
      leg_lower_r: ['leg_upper_r', 'foot_r'],
      foot_r: ['leg_lower_r'],
      groin: ['torso_front', 'leg_upper_l', 'leg_upper_r'],
    };
    return adjacency[partId] || [];
  }
  
  // 기능적 손실 계산 (모든 부상 종합)
  calculateFunctionalLoss(fighterId: string, partId: BodyPartId, injuries: Injury[]): number {
    let totalLoss = 0;
    
    // 해당 부위 직접 손상
    const directInjury = injuries.find(i => i.partId === partId);
    if (directInjury) {
      totalLoss += directInjury.functionalLoss;
    }
    
    // 인접 부위 전이 손상
    const adjacentParts = this.getAdjacentParts(partId);
    for (const adjPart of adjacentParts) {
      const adjInjury = injuries.find(i => i.partId === adjPart);
      if (adjInjury) {
        totalLoss += adjInjury.functionalLoss * this.rules.adjacentTransfer;
      }
    }
    
    // 신경 손상 전이 (해당 부위 신경 손상 시)
    const nerveInjury = injuries.find(i => 
      i.partId === partId && i.type === 'nerve_damage');
    if (nerveInjury) {
      totalLoss += nerveInjury.functionalLoss * this.rules.nerveToMuscleImpact;
    }
    
    return Math.min(1, totalLoss);
  }
  
  // 스태미나 회복률 계산 (혈관 손상 반영)
  calculateStaminaRecoveryMultiplier(injuries: Injury[]): number {
    let multiplier = 1.0;
    for (const injury of injuries) {
      if (injury.type === 'vessel_rupture') {
        multiplier -= injury.functionalLoss * this.rules.vesselToStaminaImpact;
      }
    }
    return Math.max(0.2, multiplier);
  }
  
  // 관절 가동범위 계산 (골절 반영)
  calculateROMLimitation(injuries: Injury[]): Map<BodyPartId, number> {
    const romMap = new Map<BodyPartId, number>();
    
    for (const injury of injuries) {
      if (injury.type === 'fracture') {
        const current = romMap.get(injury.partId) || 1.0;
        romMap.set(injury.partId, current * (1 - this.rules.fractureROMReduction));
      }
    }
    
    return romMap;
  }
  
  // 출혈량 계산 (시간당 mL)
  calculateBloodLossRate(injuries: Injury[]): number {
    let rate = 0;
    for (const injury of injuries) {
      if (injury.type === 'vessel_rupture') {
        // 심각도별 출혈량 (mL/min)
        const severityRate = {
          minor: 5,
          moderate: 20,
          severe: 100,
          critical: 500,
        };
        rate += severityRate[injury.severity] || 0;
      } else if (injury.type === 'laceration') {
        rate += injury.functionalLoss * 10;
      }
    }
    return rate;
  }
  
  // 총 출혈량으로 인한 사망 위험도
  calculateDeathRiskFromBloodLoss(totalBloodLoss: number, bodyWeight: number): number {
    const bloodVolume = bodyWeight * 70; // mL (체중 kg × 70 mL/kg)
    const lossRatio = totalBloodLoss / bloodVolume;
    
    // 40% 이상 출혈 시 사망 위험 급증
    if (lossRatio >= 0.4) return 1.0;
    if (lossRatio >= 0.3) return 0.7;
    if (lossRatio >= 0.2) return 0.3;
    return 0;
  }
}

export const injurySystem = new InjurySystem();

