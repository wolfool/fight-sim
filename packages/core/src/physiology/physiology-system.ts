import { RuntimeFighterState } from '../engine/runtime-types';

export const PASSIVE_STAMINA_DRAIN_PER_SEC = 0.15;
export const STAMINA_REGEN_PER_SEC = 0.25;
export const BASE_FATIGUE_RATE = 0.004;

export class PhysiologySystem {
  updatePassive(f: RuntimeFighterState, dt: number): void {
    f.stamina = Math.min(100, f.stamina + STAMINA_REGEN_PER_SEC * dt);

    const injuryLoad = f.injuries.reduce((a, i) => a + i.functionalLoss, 0);
    const targetFatigue = Math.min(1, (1 - f.stamina / 100) * 0.8 + injuryLoad * 0.2);
    f.fatigue += (targetFatigue - f.fatigue) * dt * 0.2;

    f.adrenaline = Math.max(20, f.adrenaline - dt * 2.5);

    f.pain = Math.max(0, f.pain - dt * 0.8);

    if (f.bleedRate > 0) {
      f.bloodLoss += f.bleedRate * dt;
      f.bleedRate = Math.max(0, f.bleedRate - dt * 0.15);
    }
  }

  applyExertion(f: RuntimeFighterState, staminaCost: number): void {
    f.stamina = Math.max(0, f.stamina - staminaCost * 0.5);
  }

  applyDamageStress(f: RuntimeFighterState, damage: number): void {
    f.adrenaline = Math.min(100, f.adrenaline + damage * 1.2);
    f.fear = Math.min(100, f.fear + damage * 0.25);
    f.pain = Math.min(100, f.pain + damage * 0.6);
    f.rage = Math.min(100, f.rage + damage * 0.8);
  }

  recoverBetweenRounds(f: RuntimeFighterState): void {
    f.stamina = Math.min(100, f.stamina + 35);
    f.fatigue = Math.max(0, f.fatigue - 0.25);
    f.adrenaline = 40;
    f.fear = Math.max(0, f.fear - 10);
    f.pain = Math.max(0, f.pain - 15);
    f.bleedRate = Math.max(0, f.bleedRate - 5);
    f.stunTimer = 0;
    f.action = null;
  }
}
