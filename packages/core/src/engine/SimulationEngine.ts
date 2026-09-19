import { Fighter } from '../domain/fighter';
import {
  CombatEvent, FightContext, FightResult, RoundResult, PartDamageSummary,
} from '../domain/context';
import { BodyPartId, FinishType } from '../domain/types';
import { Rng } from './rng';
import { DecisionEngine } from './DecisionEngine';
import { RuntimeTechnique, TECHNIQUE_DB } from './default-techniques';
import { RuntimeFighterState, createRuntimeState, ActiveAction } from './runtime-types';
import { PhysiologySystem } from '../physiology/physiology-system';
import { resolveStrike } from './CombatResolver';

const DT = 1 / 60;
const CLINCH_ENTER_DIST = 0.45;
const CLINCH_EXIT_DIST = 0.75;
const KNOCKDOWN_STUN_THRESHOLD = 0.45;
const KNOCKDOWN_DAMAGE_THRESHOLD = 15;
const MAX_KNOCKDOWNS_PER_ROUND = 3;
const CONCUSSION_TKO = 3;
const CHOKE_UNCONSCIOUS_S = 8;
const CHOKE_DEATH_S = 25;
const BLOOD_LOSS_FATAL_RATIO = 0.4;
const EVENT_CAP = 600;
const SCORE_SIG_STRIKE = 4;

const PART_KOREAN: Partial<Record<BodyPartId, string>> = {
  head: '머리', neck: '목', torso_front: '명치·가슴', torso_back: '등', torso_side_l: '왼옆구리', torso_side_r: '오른옆구리',
  groin: '가랑이', arm_upper_l: '왼팔 상단', arm_upper_r: '오른팔 상단',
  arm_lower_l: '왼팔 하단', arm_lower_r: '오른팔 하단', hand_l: '왼손', hand_r: '오른손',
  leg_upper_l: '왼허벅지', leg_upper_r: '오른허벅지',
  leg_lower_l: '왼 정강이', leg_lower_r: '오른 정강이', foot_l: '왼발', foot_r: '오른발',
};

export interface FightFrame {
  t: number;
  round: number;
  ax: number; bx: number;
  aPosture: string; bPosture: string;
  aHealth: number; bHealth: number;
  aStamina: number; bStamina: number;
  aAction: string | null; bAction: string | null;
  aGuard: boolean; bGuard: boolean;
  aDown: boolean; bDown: boolean;
}

function toRuntimeTechniques(techniques: Fighter['techniques']): RuntimeTechnique[] {
  const out: RuntimeTechnique[] = [];
  for (const t of techniques) {
    const rt = t as RuntimeTechnique;
    if (rt.postures) {
      out.push(rt);
    } else {
      const db = TECHNIQUE_DB[t.id];
      if (db) out.push(db);
      else out.push({ ...t, postures: ['STANDING', 'CLINCH'] } as RuntimeTechnique);
    }
  }
  return out;
}

export class DefaultSimulationEngine {
  private rng: Rng;
  private decision: DecisionEngine;
  private physiology = new PhysiologySystem();
  private ctx: FightContext;
  private A!: RuntimeFighterState;
  private B!: RuntimeFighterState;
  private time = 0;
  private round = 1;
  private roundTime = 0;
  private frame = 0;
  private frames: FightFrame[] = [];
  private frameTimer = 0;
  private recordFrames: boolean;
  private roundKnockdowns = { A: 0, B: 0 };
  private roundStartScore = { A: 0, B: 0 };
  private events: CombatEvent[] = [];
  private rounds: RoundResult[] = [];
  private eventSeq = 0;
  private finished = false;
  private finishType: FinishType | null = null;
  private winner: 'A' | 'B' | 'draw' | null = null;
  private finishTime = 0;
  private counters = {
    takedowns: { A: 0, B: 0 },
    submissions: { A: 0, B: 0 },
    clinchTime: { A: 0, B: 0 },
    groundTime: { A: 0, B: 0 },
  };
  private cooldowns = {
    escapeA: 0, escapeB: 0,
    chokeEscapeA: 0, chokeEscapeB: 0,
    surrenderA: 0, surrenderB: 0,
  };

  constructor(ctx: FightContext, recordFrames = false) {
    this.ctx = ctx;
    this.rng = new Rng(ctx.seed);
    this.decision = new DecisionEngine(this.rng);
    this.recordFrames = recordFrames;
  }

  initialize(fighterA: Fighter, fighterB: Fighter, ctxOverride?: FightContext): void {
    if (ctxOverride) {
      this.ctx = ctxOverride;
      this.rng = new Rng(ctxOverride.seed);
      this.decision = new DecisionEngine(this.rng);
    }
    this.A = this.buildRuntime(fighterA, 'A');
    this.B = this.buildRuntime(fighterB, 'B');
    this.A.x = -1;
    this.B.x = 1;
    this.A.facing = 1;
    this.B.facing = -1;
    this.applyHomeGround();
    this.log('round_start', 'A', 'A', 'landed', `라운드 ${this.round} 시작`);
  }

  private buildRuntime(f: Fighter, side: 'A' | 'B'): RuntimeFighterState {
    const headSeg = f.body.segments.find((s) => s.id === 'head');
    return createRuntimeState({
      id: f.id,
      name: f.name,
      side,
      stats: { ...f.stats },
      mentality: { ...f.mentality },
      durability: f.body.durability,
      techniques: toRuntimeTechniques(f.techniques),
      armor: f.armor ?? [],
      mass: f.body.weight,
      headMass: headSeg ? headSeg.mass : f.body.weight * 0.08,
      traits: f.traits,
      deathAllowed: this.ctx.rules.deathAllowed,
      isHome: false,
      moveSpeed: f.moveSpeed,
    });
  }

  private applyHomeGround(): void {
    const hg = this.ctx.environment.homeGround;
    if (hg === 'A' || hg === 'B') {
      const home = hg === 'A' ? this.A : this.B;
      home.isHome = true;
      home.stats.composure = Math.min(100, home.stats.composure + 10);
      home.fear = Math.max(0, home.fear * 0.85);
      home.adrenaline = 60;
      const away = hg === 'A' ? this.B : this.A;
      away.fear = Math.min(100, away.fear * 1.1 + 5);
    }
    for (const f of [this.A, this.B]) {
      if (f.isHome && f.traits) {
        f.mentality.aggression = Math.min(100, f.mentality.aggression + f.traits.territoriality * 10);
        f.fear = Math.max(0, f.fear - f.traits.territoriality * 15);
      }
    }
  }

  private log(
    type: CombatEvent['type'], actor: 'A' | 'B', target: 'A' | 'B',
    result: CombatEvent['result'], description: string,
    extra: Partial<CombatEvent> = {}
  ): void {
    this.events.push({
      id: `ev_${this.eventSeq++}`,
      timestamp: Number(this.time.toFixed(2)),
      type, actor, target, result, description,
      ...extra,
    });
    if (this.events.length > EVENT_CAP) this.events.splice(0, this.events.length - EVENT_CAP);
  }

  step(): boolean {
    if (this.finished) return false;
    this.time += DT;
    this.roundTime += DT;
    this.frame++;

    if (this.frame % 2 === 0) {
      this.processFighter(this.A, this.B);
      if (!this.finished) this.processFighter(this.B, this.A);
    } else {
      this.processFighter(this.B, this.A);
      if (!this.finished) this.processFighter(this.A, this.B);
    }
    if (this.finished) return false;
    this.updatePostures();
    this.updateChoke();
    if (this.finished) return false;
    this.checkSurrender(this.A);
    if (!this.finished) this.checkSurrender(this.B);
    if (this.finished) return false;
    this.checkFatal(this.A);
    if (!this.finished) this.checkFatal(this.B);
    if (this.finished) return false;
    this.updateRoundClock();

    if (this.recordFrames) {
      this.frameTimer += DT;
      if (this.frameTimer >= 0.5 || this.finished) {
        this.frameTimer = 0;
        this.recordFrame();
      }
    }

    return !this.finished;
  }

  private processFighter(f: RuntimeFighterState, opp: RuntimeFighterState): void {
    const dist = Math.abs(f.x - opp.x);

    this.physiology.updatePassive(f, DT);
    f.decisionCooldown -= DT;
    f.guardTimer -= DT;
    if (f.guardTimer <= 0) f.guard = 'none';
    this.tickCooldowns(f);

    if (f.stunTimer > 0) {
      f.stunTimer -= DT;
      if (f.stunTimer >= KNOCKDOWN_STUN_THRESHOLD && f.posture !== 'downed') {
        f.posture = 'downed';
        f.downTimer = 2.0;
        this.roundKnockdowns[f.side]++;
        f.knockdowns++;
        this.log('knockdown', opp.side, f.side, 'landed',
          `${f.name} 다운 (${this.roundKnockdowns[f.side]}번째)`,
          { stunDuration: Number(f.stunTimer.toFixed(2)) });
        if (this.roundKnockdowns[f.side] >= MAX_KNOCKDOWNS_PER_ROUND) {
          this.finish('tko', opp.side);
          return;
        }
      }
      if (f.stunTimer <= 0 && f.posture === 'stunned') f.posture = 'standing';
      return;
    }

    if (f.downTimer > 0) {
      f.downTimer -= DT;
      if (f.downTimer <= 0 && f.posture === 'downed') f.posture = 'standing';
      return;
    }

    if (f.movementTimer > 0 && (f.posture === 'standing' || f.posture === 'clinch')) {
      const speed = f.moveSpeed * (1 - f.fatigue * 0.3);
      f.x += f.movementDir * speed * DT;
      f.movementTimer -= DT;
    }

    if (f.posture === 'ground_top' || f.posture === 'ground_bottom') {
      this.counters.groundTime[f.side] += DT;
      if (this.getCooldown(f, 'escape') <= 0) {
        this.setCooldown(f, 'escape', 0.5);
        this.rollGroundEscape(f, opp);
      }
    }
    if (f.posture === 'clinch') this.counters.clinchTime[f.side] += DT;

    if (f.action) {
      const act = f.action;
      act.timer -= DT;
      if (act.timer <= 0) {
        if (act.phase === 'windup') {
          act.phase = 'execution';
          act.timer = act.technique.biomechanics.executionTime;
        } else if (act.phase === 'execution') {
          this.resolveAction(f, opp, act);
          if (this.finished) return;
          if (f.action === act) {
            act.phase = 'recovery';
            act.timer = act.technique.biomechanics.recoveryTime;
          }
        } else {
          f.action = null;
        }
      }
      return;
    }

    if (f.applyingChoke) return;

    if (f.decisionCooldown <= 0) {
      f.decisionCooldown = 0.25;
      this.applyDecision(f, opp, dist);
    }
  }

  private tickCooldowns(f: RuntimeFighterState): void {
    if (f.side === 'A') {
      this.cooldowns.escapeA -= DT;
      this.cooldowns.chokeEscapeA -= DT;
      this.cooldowns.surrenderA -= DT;
    } else {
      this.cooldowns.escapeB -= DT;
      this.cooldowns.chokeEscapeB -= DT;
      this.cooldowns.surrenderB -= DT;
    }
  }

  private getCooldown(f: RuntimeFighterState, kind: 'escape' | 'chokeEscape' | 'surrender'): number {
    if (f.side === 'A') {
      return kind === 'escape' ? this.cooldowns.escapeA : kind === 'chokeEscape' ? this.cooldowns.chokeEscapeA : this.cooldowns.surrenderA;
    }
    return kind === 'escape' ? this.cooldowns.escapeB : kind === 'chokeEscape' ? this.cooldowns.chokeEscapeB : this.cooldowns.surrenderB;
  }

  private setCooldown(f: RuntimeFighterState, kind: 'escape' | 'chokeEscape' | 'surrender', v: number): void {
    if (f.side === 'A') {
      if (kind === 'escape') this.cooldowns.escapeA = v;
      else if (kind === 'chokeEscape') this.cooldowns.chokeEscapeA = v;
      else this.cooldowns.surrenderA = v;
    } else {
      if (kind === 'escape') this.cooldowns.escapeB = v;
      else if (kind === 'chokeEscape') this.cooldowns.chokeEscapeB = v;
      else this.cooldowns.surrenderB = v;
    }
  }

  private applyDecision(f: RuntimeFighterState, opp: RuntimeFighterState, dist: number): void {
    const d = this.decision.decide(f, opp, dist);
    switch (d.type) {
      case 'attack': {
        const tech = d.technique;
        this.physiology.applyExertion(f, tech.requirements.staminaCost);
        f.action = {
          technique: tech,
          phase: 'windup',
          timer: tech.biomechanics.windupTime,
          targetId: opp.id,
        };
        break;
      }
      case 'defend':
        f.guard = 'high';
        f.guardTimer = d.duration;
        break;
      case 'move':
        f.movementTimer = d.duration;
        f.movementDir = d.dir * (f.x < opp.x ? 1 : -1);
        break;
      case 'escape':
        break;
      case 'wait':
        f.decisionCooldown = 0.3;
        break;
    }
  }

  private resolveAction(f: RuntimeFighterState, opp: RuntimeFighterState, act: ActiveAction): void {
    const tech = act.technique;
    const dist = Math.abs(f.x - opp.x);

    if (tech.category === 'grapple_takedown') {
      this.resolveTakedown(f, opp, tech);
      return;
    }

    const isChoke = tech.chokeLike || tech.category === 'grapple_choke';
    if (isChoke) {
      this.startChoke(f, opp, tech);
      return;
    }

    if (dist > tech.requirements.requiredDistance.max * 1.25) {
      this.log('strike', f.side, opp.side, 'missed', `${f.name}의 ${tech.name}, 빗나감`, {
        techniqueId: tech.id, techniqueName: tech.name,
      });
      return;
    }

    const dodgeChance = Math.max(
      0.05,
      Math.min(0.35, 0.05 + (opp.stats.speed + opp.stats.agility - f.stats.speed) / 400)
    );
    if (opp.posture === 'standing' && this.rng.chance(dodgeChance)) {
      this.log('dodge', f.side, opp.side, 'dodged', `${opp.name}, ${tech.name} 회피!`, {
        techniqueId: tech.id, techniqueName: tech.name,
      });
      return;
    }

    const guardBlocks = this.defenseMultiplier(opp, tech) < 1;

    const outcome = resolveStrike({
      technique: tech,
      attackerStats: f.stats,
      attackerFatigue: f.fatigue,
      attackerAdrenaline: f.adrenaline,
      defenderDurability: opp.durability,
      defenderArmor: opp.armor,
      defenderStats: opp.stats,
      defenderHeadMassKg: opp.headMass,
      defenseMultiplier: guardBlocks ? 0.15 : 1,
      rng: this.rng,
    });

    f.strikes++;
    if (outcome.totalDamage >= SCORE_SIG_STRIKE) f.significantStrikes++;
    f.score += Math.max(0.3, outcome.totalDamage / 8);

    opp.health = Math.max(0, opp.health - outcome.totalDamage);
    opp.damageByPart[outcome.targetPart] = (opp.damageByPart[outcome.targetPart] ?? 0) + outcome.totalDamage;
    opp.stunTimer = Math.max(opp.stunTimer, outcome.stunDuration);
    if (opp.stunTimer > 0 && opp.posture === 'standing') opp.posture = 'stunned';
    opp.bleedRate = Math.max(opp.bleedRate, outcome.bleedRate);
    opp.injuries.push(...outcome.injuries);
    this.physiology.applyDamageStress(opp, outcome.totalDamage);

    const kb = Math.min(0.6, tech.biomechanics.impulse / Math.max(20, opp.mass * 20));
    opp.x += (f.x < opp.x ? 1 : -1) * kb;
    if (opp.applyingChoke && outcome.totalDamage >= SCORE_SIG_STRIKE) {
      opp.applyingChoke = false;
      opp.action = null;
    }

    const partKo = PART_KOREAN[outcome.targetPart] ?? outcome.targetPart;
    const dmgTxt = outcome.totalDamage >= SCORE_SIG_STRIKE ? '유효타' : '타격';
    if (guardBlocks) {
      this.log('block', f.side, opp.side, 'blocked',
        `${f.name}의 ${tech.name} — ${opp.name} 가드로 방어 (데미지 ${outcome.totalDamage.toFixed(1)})`,
        {
          techniqueId: tech.id, techniqueName: tech.name, targetPart: outcome.targetPart,
          damage: Number(outcome.totalDamage.toFixed(2)),
        });
    } else {
      this.log('strike', f.side, opp.side, 'hit',
        `${f.name}의 ${tech.name} → ${opp.name} ${partKo} ${dmgTxt}! (데미지 ${outcome.totalDamage.toFixed(1)})`,
        {
          techniqueId: tech.id, techniqueName: tech.name, targetPart: outcome.targetPart,
          damage: Number(outcome.totalDamage.toFixed(2)),
          stunDuration: Number(outcome.stunDuration.toFixed(2)),
          injuries: outcome.injuries,
        });
    }

    if (outcome.koNow) {
      this.finish('ko', f.side);
      return;
    }
    if (outcome.concussionP > 0 && this.rng.chance(outcome.concussionP)) {
      opp.concussions++;
      opp.stunTimer = Math.max(opp.stunTimer, 2.0);
      this.log('strike', f.side, opp.side, 'hit', `${opp.name} 뇌진탕 (${opp.concussions}회)`, {
        techniqueId: tech.id, techniqueName: tech.name, targetPart: 'head',
      });
      if (opp.concussions >= CONCUSSION_TKO) {
        this.finish('tko', f.side);
        return;
      }
    }
    if (outcome.organRuptured) {
      if (this.ctx.rules.deathAllowed) {
        this.finish('death', f.side, `${f.name}의 ${tech.name} — ${opp.name} 장기 파열`);
      } else {
        this.finish('ko', f.side);
      }
      return;
    }
    if (
      (outcome.stunDuration > KNOCKDOWN_STUN_THRESHOLD ||
        outcome.totalDamage >= KNOCKDOWN_DAMAGE_THRESHOLD) &&
      opp.posture !== 'downed'
    ) {
      opp.posture = 'downed';
      opp.downTimer = 2.0;
      opp.stunTimer = 0;
      this.roundKnockdowns[opp.side]++;
      opp.knockdowns++;
      f.score += 2;
      this.log('knockdown', f.side, opp.side, 'landed',
        `${f.name}의 ${tech.name} — ${opp.name} 다운! (${this.roundKnockdowns[opp.side]}번째)`,
        { techniqueId: tech.id, techniqueName: tech.name });
      if (this.roundKnockdowns[opp.side] >= MAX_KNOCKDOWNS_PER_ROUND) {
        this.finish('tko', f.side);
        return;
      }
    }
    if (opp.health <= 0) this.finish('tko', f.side);
  }

  private defenseMultiplier(def: RuntimeFighterState, tech: RuntimeTechnique): number {
    if (def.guard !== 'high') return 1;
    const targetsGuarded = tech.effects.damage.targetParts.some(
      (p) => p === 'head' || p.startsWith('torso') || p === 'neck'
    );
    return targetsGuarded ? 0.15 : 1;
  }

  private resolveTakedown(f: RuntimeFighterState, opp: RuntimeFighterState, tech: RuntimeTechnique): void {
    const atkScore =
      f.stats.strength + f.stats.agility * 0.5 + f.stats.technique * 0.6 + this.rng.float(0, 30);
    const defScore =
      opp.stats.strength * 0.9 + opp.stats.agility * 0.8 + opp.stats.technique * 0.5 + this.rng.float(0, 30);
    if (atkScore > defScore && opp.posture === 'standing') {
      f.posture = 'ground_top';
      opp.posture = 'ground_bottom';
      opp.x = f.x;
      this.counters.takedowns[f.side]++;
      f.score += 1.5;
      opp.health = Math.max(0, opp.health - 3);
      this.log('takedown', f.side, opp.side, 'landed',
        `${f.name}의 ${tech.name} 성공 — ${opp.name}, 그라운드로 넘어간다`, {
          techniqueId: tech.id, techniqueName: tech.name,
        });
    } else {
      this.log('takedown', f.side, opp.side, 'escaped',
        `${opp.name}, ${tech.name} 스프롤로 방어`, {
          techniqueId: tech.id, techniqueName: tech.name,
        });
    }
  }

  private startChoke(f: RuntimeFighterState, opp: RuntimeFighterState, tech: RuntimeTechnique): void {
    const canApply =
      opp.posture === 'downed' || opp.posture === 'stunned' || opp.posture === 'ground_bottom';
    if (!canApply) {
      this.log('strike', f.side, opp.side, 'missed',
        `${f.name}의 ${tech.name} 시도 — ${opp.name} 거리를 벌린다`, {
          techniqueId: tech.id, techniqueName: tech.name,
        });
      return;
    }
    f.applyingChoke = true;
    opp.stunTimer = 0;
    this.counters.submissions[f.side]++;
    this.log('submission', f.side, opp.side, 'landed',
      `${f.name}의 ${tech.name} 걸렸다 — ${opp.name}을 조인다`, {
        techniqueId: tech.id, techniqueName: tech.name,
      });
  }

  private updateChoke(): void {
    const pairs: Array<[RuntimeFighterState, RuntimeFighterState]> = [
      [this.A, this.B],
      [this.B, this.A],
    ];
    for (const [f, opp] of pairs) {
      if (!f.applyingChoke) continue;
      if (this.finished) return;
      const targetDown =
        opp.posture === 'downed' || opp.posture === 'stunned' || opp.posture === 'ground_bottom';
      if (!targetDown || f.posture === 'stunned' || f.posture === 'downed') {
        f.applyingChoke = false;
        continue;
      }
      opp.chokeTimer += DT;
      if (this.ctx.rules.deathAllowed) {
        if (opp.chokeTimer >= CHOKE_DEATH_S) {
          this.finish('death', f.side, `${f.name}의 조임 — ${opp.name}, 질식사`);
          return;
        }
      } else if (opp.chokeTimer >= CHOKE_UNCONSCIOUS_S) {
        this.finish('submission', f.side);
        return;
      }
      if (this.getCooldown(opp, 'chokeEscape') <= 0) {
        this.setCooldown(opp, 'chokeEscape', 0.5);
        const esc =
          0.03 +
          (opp.stats.technique * 0.5 + opp.stats.agility * 0.25 -
            f.stats.technique * 0.3 - f.stats.strength * 0.15) / 300;
        const escChance = Math.max(0.02, Math.min(0.35, esc));
        if (this.rng.chance(escChance)) {
          f.applyingChoke = false;
          opp.chokeTimer = Math.max(0, opp.chokeTimer - 3);
          f.posture = 'standing';
          opp.posture = 'standing';
          this.log('submission', opp.side, f.side, 'escaped',
            `${opp.name}, 조이기를 풀어냈다!`);
        }
      }
    }
  }

  private rollGroundEscape(f: RuntimeFighterState, opp: RuntimeFighterState): void {
    const raw =
      0.08 + (f.stats.agility * 0.4 + f.stats.technique * 0.4 -
        opp.stats.strength * 0.2 - opp.stats.technique * 0.3) / 250;
    const escChance = Math.max(0.04, Math.min(0.4, raw));
    if (this.rng.chance(escChance)) {
      f.posture = 'standing';
      opp.posture = 'standing';
      this.log('separation', f.side, opp.side, 'escaped',
        `${f.name}, 그라운드에서 빠져나왔다`);
    }
  }

  private checkSurrender(f: RuntimeFighterState): void {
    if (this.finished || this.getCooldown(f, 'surrender') > 0) return;
    this.setCooldown(f, 'surrender', 0.5);
    if (!this.ctx.rules.surrenderAllowed) return;
    if (f.mentality.killIntent >= 60) return;
    const urge = f.pain * 0.5 + f.fear * 0.4 + f.fatigue * 30;
    if (urge > 55 && this.rng.chance(0.3)) {
      this.finish('surrender', f.side === 'A' ? 'B' : 'A');
    }
  }

  private checkFatal(f: RuntimeFighterState): void {
    if (this.finished) return;
    const fatalBlood = f.bloodVolumeML * BLOOD_LOSS_FATAL_RATIO;
    if (f.bloodLoss > fatalBlood) {
      if (this.ctx.rules.deathAllowed) {
        this.finish('death', f.side === 'A' ? 'B' : 'A', `${f.name}, 실혈 과다로 쓰러진다`);
      } else {
        this.finish('tko', f.side === 'A' ? 'B' : 'A');
      }
    }
  }

  private updateRoundClock(): void {
    if (this.finished) return;
    const dur = this.ctx.rules.roundDuration;
    if (this.roundTime >= dur) {
      this.pushRoundResult();
      if (this.round >= this.ctx.rules.maxRounds) {
        this.judgeDecision();
        return;
      }
      this.round++;
      this.roundTime = 0;
      this.roundKnockdowns = { A: 0, B: 0 };
      this.roundStartScore = { A: this.A.score, B: this.B.score };
      this.physiology.recoverBetweenRounds(this.A);
      this.physiology.recoverBetweenRounds(this.B);
      this.A.posture = 'standing';
      this.B.posture = 'standing';
      this.A.applyingChoke = false;
      this.B.applyingChoke = false;
      this.A.chokeTimer = 0;
      this.B.chokeTimer = 0;
      this.A.x = -1;
      this.B.x = 1;
      this.A.action = null;
      this.B.action = null;
      this.log('round_start', 'A', 'A', 'landed', `라운드 ${this.round} 시작`);
    }
  }

  private pushRoundResult(): void {
    const sA = this.A.score - this.roundStartScore.A;
    const sB = this.B.score - this.roundStartScore.B;
    this.rounds.push({
      round: this.round,
      duration: Number(this.roundTime.toFixed(1)),
      events: [],
      scoreA: Number(sA.toFixed(2)),
      scoreB: Number(sB.toFixed(2)),
      knockdownsA: this.roundKnockdowns.B,
      knockdownsB: this.roundKnockdowns.A,
      dominantFighter: sA > sB + 0.5 ? 'A' : sB > sA + 0.5 ? 'B' : 'even',
    });
    this.log('round_end', 'A', 'B', 'landed',
      `라운드 ${this.round} 종료 (A:${sA.toFixed(1)}점 B:${sB.toFixed(1)}점)`);
  }

  private judgeDecision(): void {
    const diff = this.A.score - this.B.score;
    if (Math.abs(diff) < 0.5) this.finish('decision', 'draw');
    else this.finish('decision', diff > 0 ? 'A' : 'B');
  }

  private updatePostures(): void {
    const dist = Math.abs(this.A.x - this.B.x);
    const bothStanding = this.A.posture === 'standing' && this.B.posture === 'standing';
    const bothClinch = this.A.posture === 'clinch' && this.B.posture === 'clinch';
    if (bothStanding && dist < CLINCH_ENTER_DIST) {
      this.A.posture = 'clinch';
      this.B.posture = 'clinch';
      this.log('clinch', 'A', 'B', 'landed', '클린치');
    } else if (bothClinch && dist > CLINCH_EXIT_DIST) {
      this.A.posture = 'standing';
      this.B.posture = 'standing';
      this.log('separation', 'A', 'B', 'landed', '클린치 브레이크');
    }
    if (dist < 0.15) {
      const mid = (this.A.x + this.B.x) / 2;
      this.A.x = mid - 0.075;
      this.B.x = mid + 0.075;
    }
  }

  private finish(type: FinishType, winner: 'A' | 'B' | 'draw', description?: string): void {
    if (this.finished) return;
    this.finished = true;
    this.finishType = type;
    this.winner = winner;
    this.finishTime = Number(this.time.toFixed(2));
    const evtType: CombatEvent['type'] =
      type === 'ko' ? 'ko' : type === 'death' ? 'death' :
      type === 'submission' ? 'submission_finish' :
      type === 'surrender' ? 'surrender' : 'ko';
    const winnerName = winner === 'A' ? this.A.name : winner === 'B' ? this.B.name : null;
    const desc =
      description ??
      (type === 'decision'
        ? `판정 승리 — ${winnerName ?? '무승부'}`
        : type === 'tko'
        ? `TKO — ${winnerName} 승리!`
        : type === 'ko'
        ? `KO — ${winnerName} 승리!`
        : type === 'submission'
        ? `서브미션 — ${winnerName} 승리!`
        : type === 'surrender'
        ? `${winner === 'A' ? this.B.name : this.A.name} 항복 — ${winnerName} 승리`
        : `${winnerName} 승리 (사망)`);
    this.log(evtType, winner === 'B' ? 'B' : 'A', winner === 'B' ? 'A' : 'B', 'landed', desc);
  }

  private damageByPartSummary(f: RuntimeFighterState): Record<string, PartDamageSummary> {
    const out: Record<string, PartDamageSummary> = {};
    for (const part of Object.keys(f.damageByPart)) {
      const totalDamage = f.damageByPart[part] ?? 0;
      const injuries = f.injuries.filter((i) => i.partId === part);
      const functionalLoss = injuries.reduce((a, i) => a + i.functionalLoss, 0);
      const injurySeverity: PartDamageSummary['injurySeverity'] =
        functionalLoss >= 1 ? 'loss' :
        functionalLoss >= 0.6 ? 'severe' :
        functionalLoss >= 0.4 ? 'moderate' :
        functionalLoss > 0 ? 'minor' : 'none';
      out[part] = { partId: part, totalDamage, injurySeverity, injuries, functionalLoss };
    }
    return out;
  }

  getResult(): FightResult {
    if (!this.finishType || !this.winner) throw new Error('시뮬레이션이 아직 종료되지 않았습니다');
    const winProb = this.winner === 'draw' ? { A: 0, B: 0, draw: 1 } : { A: 0, B: 0, draw: 0 };
    if (this.winner !== 'draw') winProb[this.winner] = 1;
    return {
      simulationId: `sim_${this.ctx.seed}`,
      winner: this.winner,
      winProbability: winProb,
      duration: Number(this.time.toFixed(2)),
      rounds: this.rounds,
      finishType: this.finishType,
      finishTime: this.finishTime,
      summary: {
        totalStrikes: { A: this.A.strikes, B: this.B.strikes },
        significantStrikes: { A: this.A.significantStrikes, B: this.B.significantStrikes },
        takedowns: this.counters.takedowns,
        submissions: this.counters.submissions,
        knockdowns: { A: this.A.knockdowns, B: this.B.knockdowns },
        clinchTime: this.counters.clinchTime,
        groundTime: this.counters.groundTime,
      },
      damageByPart: {
        A: this.damageByPartSummary(this.A),
        B: this.damageByPartSummary(this.B),
      },
      timeline: this.events,
    };
  }

  getCombatLog(): CombatEvent[] {
    return this.events;
  }

  isFinished(): boolean {
    return this.finished;
  }

  getRound(): number {
    return this.round;
  }

  recordFrame(): void {
    this.frames.push({
      t: Number(this.time.toFixed(2)),
      round: this.round,
      ax: Number(this.A.x.toFixed(2)), bx: Number(this.B.x.toFixed(2)),
      aPosture: this.A.posture, bPosture: this.B.posture,
      aHealth: Math.round(this.A.health), bHealth: Math.round(this.B.health),
      aStamina: Math.round(this.A.stamina), bStamina: Math.round(this.B.stamina),
      aAction: this.A.action ? this.A.action.technique.name : (this.A.applyingChoke ? '초크 조이는 중' : null),
      bAction: this.B.action ? this.B.action.technique.name : (this.B.applyingChoke ? '초크 조이는 중' : null),
      aGuard: this.A.guard === 'high', bGuard: this.B.guard === 'high',
      aDown: this.A.posture === 'downed' || this.A.posture === 'stunned',
      bDown: this.B.posture === 'downed' || this.B.posture === 'stunned',
    });
    if (this.frames.length > 4000) this.frames.shift();
  }

  getFrames(): FightFrame[] {
    return this.frames;
  }

  getCurrentState() {
    return {
      time: Number(this.time.toFixed(2)),
      round: this.round,
      roundTime: Number(this.roundTime.toFixed(2)),
      fighterA: this.snapshotOf(this.A),
      fighterB: this.snapshotOf(this.B),
      events: this.events.slice(-20),
      isFinished: this.finished,
      finishType: this.finishType ?? undefined,
    };
  }

  private snapshotOf(f: RuntimeFighterState) {
    return {
      id: f.id,
      health: Math.round(f.health),
      stamina: Math.round(f.stamina),
      position: { x: Number(f.x.toFixed(2)), y: 0 },
      posture: f.posture,
      currentAction: f.action ? `${f.action.technique.name}(${f.action.phase})` : null,
      activeInjuries: f.injuries.slice(-5),
    };
  }

  getReplaySnapshots(): unknown[] {
    return [];
  }
}
