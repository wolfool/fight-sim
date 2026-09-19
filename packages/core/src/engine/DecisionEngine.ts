import { RuntimeFighterState } from './runtime-types';
import { RuntimeTechnique } from './default-techniques';
import { Rng } from './rng';

export type EngineDecision =
  | { type: 'attack'; technique: RuntimeTechnique }
  | { type: 'defend'; duration: number }
  | { type: 'move'; dir: -1 | 1; duration: number }
  | { type: 'escape' }
  | { type: 'wait' };

const POSTURE_TO_STATE: Record<string, string> = {
  standing: 'STANDING',
  clinch: 'CLINCH',
  ground_top: 'GROUND_TOP',
  ground_bottom: 'GROUND_BOTTOM',
};

export class DecisionEngine {
  constructor(private rng: Rng) {}

  decide(self: RuntimeFighterState, opp: RuntimeFighterState, distance: number): EngineDecision {
    const noise = () => this.rng.float(0.85, 1.15);

    if (self.posture === 'ground_bottom' && opp.posture !== 'standing') {
      return { type: 'escape' };
    }
    if (self.posture === 'ground_bottom' && opp.posture === 'standing') {
      return this.rng.chance(0.5) ? { type: 'escape' } : { type: 'move', dir: 1, duration: 0.3 };
    }
    if (self.posture === 'downed' || self.posture === 'stunned') {
      return { type: 'wait' };
    }

    const aggr = self.mentality.aggression / 100;
    const traitsAggr = self.traits ? (0.4 + self.traits.aggression * 0.8) : 1;
    const flightiness = self.traits ? self.traits.flightiness : 0.25;
    const healthRatio = self.health / 100;
    const staminaRatio = self.stamina / 100;
    const oppDowned = opp.posture === 'downed' || opp.posture === 'stunned';
    const rageBoost = self.rage > 60 ? 1.3 : 1;
    const fearPenalty = self.fear > 60 ? 0.6 : 1;

    const hunting = self.traits?.huntingStyle;
    const cower = self.fear > 85 && self.health < 30;

    const candidates: Array<{ score: number; decision: EngineDecision }> = [];

    for (const tech of self.techniques) {
      const stateKey = POSTURE_TO_STATE[self.posture] ?? 'STANDING';
      if (!tech.postures.includes(stateKey as never)) continue;
      if (self.stamina < tech.requirements.staminaCost) continue;

      const isChoke = tech.chokeLike || tech.category === 'grapple_choke';
      if (isChoke && !oppDowned) continue;
      if (tech.category === 'grapple_takedown' && opp.posture !== 'standing') continue;
      if (tech.category === 'grapple_takedown' && self.posture !== 'standing') continue;

      const d = tech.requirements.requiredDistance;
      if (distance < d.min || distance > d.max) continue;

      let score =
        tech.aiWeight.offensive *
        (0.5 + aggr) * traitsAggr * rageBoost * fearPenalty *
        (0.6 + staminaRatio * 0.4);

      if (opp.health < 25) score *= 1 + tech.aiWeight.finisher;
      if (oppDowned && (tech.category === 'grapple_ground' || isChoke)) score *= 1.6;
      if (self.pain > 50) score *= 0.8;

      if (!cower) {
        if (hunting === 'ambush') {
          if (distance > 1.6) score *= 0.5;
          else score *= 1.4;
        } else if (hunting === 'charge' || hunting === 'chase') {
          if (distance > 1.2) score *= 1.2;
        }
        candidates.push({ score: score * noise(), decision: { type: 'attack', technique: tech } });
      }
    }

    const threat = opp.action?.phase === 'windup' ? 1.5 : 0.5;
    const guardScore =
      (self.stats.composure / 100) * (0.4 + threat) * (0.6 + flightiness) *
      (oppDowned ? 0.1 : 1) * (cower ? 2.5 : 1) * noise();
    candidates.push({ score: guardScore, decision: { type: 'defend', duration: 0.5 } });

    const advanceScore =
      (0.3 + aggr * 0.7) * traitsAggr *
      (healthRatio < 0.2 ? 0.5 : 1) *
      (distance < 0.55 ? 0.1 : 1) *
      (hunting === 'charge' ? 1.8 : hunting === 'chase' ? 1.5 : hunting === 'ambush' && distance > 1.6 ? 0.6 : 1) *
      noise();
    candidates.push({ score: advanceScore, decision: { type: 'move', dir: 1, duration: 0.3 } });

    const retreatScore =
      (self.fear / 100) * 1.2 * (0.3 + flightiness) *
      (healthRatio < 0.35 ? 1.6 : 0.7) *
      (cower ? 2.2 : hunting === 'charge' ? 0.3 : 1) *
      noise();
    candidates.push({ score: retreatScore, decision: { type: 'move', dir: -1, duration: 0.4 } });

    const waitScore = 0.25 + self.fatigue * 0.5;
    candidates.push({ score: waitScore * noise(), decision: { type: 'wait' } });

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    return best ? best.decision : { type: 'wait' };
  }
}
