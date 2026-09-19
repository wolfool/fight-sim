"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FightFrame, CombatEvent } from "@fight-sim/core/engine";
import styles from "../app/page.module.css";

const POSTURE_LABEL: Record<string, string> = {
  clinch: "클린치",
  ground_top: "그라운드(위)",
  ground_bottom: "그라운드(아래)",
  stunned: "스턴!",
  downed: "다운!",
};

const FINISH_TEXT: Record<string, string> = {
  ko: "KO",
  tko: "TKO",
  submission: "서브미션",
  decision: "판정",
  surrender: "항복 승",
  death: "사망",
};

const PART_KOREAN: Record<string, string> = {
  head: "머리", neck: "목", torso_front: "가슴", torso_back: "등",
  torso_side_l: "왼옆구리", torso_side_r: "오른옆구리", groin: "가랑이",
  arm_upper_l: "왼팔", arm_upper_r: "오른팔",
  arm_lower_l: "왼팔 아래", arm_lower_r: "오른팔 아래",
  hand_l: "왼손", hand_r: "오른손",
  leg_upper_l: "왼허벅지", leg_upper_r: "오른허벅지",
  leg_lower_l: "왼 정강이", leg_lower_r: "오른 정강이",
  foot_l: "왼발", foot_r: "오른발",
};

function damageColor(d: number, max: number): string {
  if (d <= 0.5) return "#334155";
  const r = Math.min(1, d / Math.max(1, max));
  if (r < 0.25) return "#eab308";
  if (r < 0.5) return "#f97316";
  if (r < 0.75) return "#ef4444";
  return "#991b1b";
}

function BodyModel({ parts, max, title }: { parts: Record<string, number>; max: number; title: string }) {
  const d = (id: string) => parts[id] ?? 0;
  const col = (id: string) => damageColor(d(id), max);
  return (
    <div className={styles.bodyCol}>
      <span className={styles.bodyTitle}>{title}</span>
      <svg viewBox="0 0 120 195" className={styles.bodySvg}>
        <circle cx="60" cy="20" r="13" fill={col("head")} stroke="#0f172a" strokeWidth="1">
          <title>{`${PART_KOREAN.head}: ${Math.round(d("head"))}`}</title>
        </circle>
        <rect x="53" y="34" width="14" height="9" rx="2" fill={col("neck")} stroke="#0f172a" strokeWidth="1">
          <title>{`${PART_KOREAN.neck}: ${Math.round(d("neck"))}`}</title>
        </rect>
        <rect x="38" y="44" width="44" height="50" rx="4" fill={col("torso_front")} stroke={damageColor(d("torso_back"), max)} strokeWidth="3">
          <title>{`${PART_KOREAN.torso_front}: ${Math.round(d("torso_front"))} / 등: ${Math.round(d("torso_back"))}`}</title>
        </rect>
        <ellipse cx="36" cy="64" rx="5" ry="14" fill={col("torso_side_l")} stroke="#0f172a" strokeWidth="1">
          <title>{`${PART_KOREAN.torso_side_l}: ${Math.round(d("torso_side_l"))}`}</title>
        </ellipse>
        <ellipse cx="84" cy="64" rx="5" ry="14" fill={col("torso_side_r")} stroke="#0f172a" strokeWidth="1">
          <title>{`${PART_KOREAN.torso_side_r}: ${Math.round(d("torso_side_r"))}`}</title>
        </ellipse>
        <rect x="49" y="94" width="22" height="8" rx="2" fill={col("groin")} stroke="#0f172a" strokeWidth="1">
          <title>{`${PART_KOREAN.groin}: ${Math.round(d("groin"))}`}</title>
        </rect>
        <rect x="16" y="46" width="14" height="24" rx="3" fill={col("arm_upper_l")} stroke="#0f172a" strokeWidth="1" />
        <rect x="16" y="72" width="14" height="22" rx="3" fill={col("arm_lower_l")} stroke="#0f172a" strokeWidth="1" />
        <circle cx="23" cy="100" r="6" fill={col("hand_l")} stroke="#0f172a" strokeWidth="1" />
        <rect x="90" y="46" width="14" height="24" rx="3" fill={col("arm_upper_r")} stroke="#0f172a" strokeWidth="1" />
        <rect x="90" y="72" width="14" height="22" rx="3" fill={col("arm_lower_r")} stroke="#0f172a" strokeWidth="1" />
        <circle cx="97" cy="100" r="6" fill={col("hand_r")} stroke="#0f172a" strokeWidth="1" />
        <rect x="43" y="104" width="16" height="34" rx="3" fill={col("leg_upper_l")} stroke="#0f172a" strokeWidth="1" />
        <rect x="43" y="140" width="16" height="32" rx="3" fill={col("leg_lower_l")} stroke="#0f172a" strokeWidth="1" />
        <rect x="41" y="174" width="20" height="9" rx="3" fill={col("foot_l")} stroke="#0f172a" strokeWidth="1" />
        <rect x="61" y="104" width="16" height="34" rx="3" fill={col("leg_upper_r")} stroke="#0f172a" strokeWidth="1" />
        <rect x="61" y="140" width="16" height="32" rx="3" fill={col("leg_lower_r")} stroke="#0f172a" strokeWidth="1" />
        <rect x="59" y="174" width="20" height="9" rx="3" fill={col("foot_r")} stroke="#0f172a" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function ReplaySection({
  frames, timeline, aName, bName, aEmoji, bEmoji, finishType, winnerName,
}: {
  frames: FightFrame[];
  timeline: CombatEvent[];
  aName: string;
  bName: string;
  aEmoji: string;
  bEmoji: string;
  finishType: string;
  winnerName: string | null;
}) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const lastTsRef = useRef(0);

  const endT = frames.length > 0 ? frames[frames.length - 1]?.t ?? 0 : 0;

  useEffect(() => {
    if (!playing) {
      lastTsRef.current = 0;
      return;
    }
    let raf = 0;
    const tick = (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setT((prev) => {
        const nt = prev + dt * speed;
        if (nt >= endT) {
          setPlaying(false);
          return endT;
        }
        return nt;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, endT]);

  const f = useMemo(() => {
    let i = 0;
    while (i < frames.length - 1 && (frames[i + 1]?.t ?? 0) <= t) i++;
    return frames[i] ?? null;
  }, [frames, t]);

  const dmgA = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of timeline) {
      if (e.timestamp > t) break;
      if (e.target === "A" && e.targetPart && e.damage && (e.result === "hit" || e.result === "blocked")) {
        m[e.targetPart] = (m[e.targetPart] ?? 0) + e.damage;
      }
    }
    return m;
  }, [timeline, t]);

  const dmgB = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of timeline) {
      if (e.timestamp > t) break;
      if (e.target === "B" && e.targetPart && e.damage && (e.result === "hit" || e.result === "blocked")) {
        m[e.targetPart] = (m[e.targetPart] ?? 0) + e.damage;
      }
    }
    return m;
  }, [timeline, t]);

  const dmgMax = useMemo(() => {
    let m = 10;
    for (const v of Object.values(dmgA)) if (v > m) m = v;
    for (const v of Object.values(dmgB)) if (v > m) m = v;
    return m;
  }, [dmgA, dmgB]);

  const lastEvt = useMemo(() => {
    let ev: CombatEvent | null = null;
    for (const e of timeline) {
      if (e.timestamp <= t) ev = e;
      else break;
    }
    return ev;
  }, [timeline, t]);

  const feed = useMemo(
    () => timeline.filter((e) => e.timestamp <= t).slice(-6),
    [timeline, t]
  );

  if (!f) return null;

  const xs: number[] = [];
  for (const fr of frames) {
    xs.push(fr.ax, fr.bx);
  }
  const minX = Math.min(...xs) - 0.6;
  const maxX = Math.max(...xs) + 0.6;
  const posPct = (x: number) => ((x - minX) / (maxX - minX)) * 88 + 6;
  const atEnd = endT > 0 && t >= endT - 0.01;

  const chipsOf = (side: "a" | "b") => {
    const chips: string[] = [];
    const posture = side === "a" ? f.aPosture : f.bPosture;
    const guard = side === "a" ? f.aGuard : f.bGuard;
    const down = side === "a" ? f.aDown : f.bDown;
    if (POSTURE_LABEL[posture]) chips.push(POSTURE_LABEL[posture]);
    if (guard) chips.push("가드");
    if (down && !POSTURE_LABEL[posture]) chips.push("무방비");
    return chips;
  };

  return (
    <div className={styles.replayWrap}>
      <div className={styles.stage}>
        <div className={styles.stageRoundInfo}>
          라운드 {f.round} · {(f.t % 300).toFixed(1)}초
          {finishType === "death" && atEnd && <span className={styles.stageDeath}>사망 연출</span>}
        </div>
        <div className={styles.stageFloor}>
          <div
            className={`${styles.fighter} ${styles.fighterA}`}
            style={{ left: `${posPct(f.ax)}%`, zIndex: f.aDown ? 1 : 2 }}
          >
            <span className={styles.actionBubble}>{f.aAction}</span>
            <span className={styles.fighterToken}>{aEmoji}</span>
            <span className={styles.fighterName}>{aName}</span>
            <div className={styles.stateChips}>
              {chipsOf("a").map((c) => (
                <span key={c} className={`${styles.chip} ${c === "다운!" || c === "스턴!" ? styles.chipWarn : ""}`}>{c}</span>
              ))}
            </div>
          </div>
          <div
            className={`${styles.fighter} ${styles.fighterB}`}
            style={{ left: `${posPct(f.bx)}%`, zIndex: f.bDown ? 1 : 2 }}
          >
            <span className={styles.actionBubble}>{f.bAction}</span>
            <span className={styles.fighterToken}>{bEmoji}</span>
            <span className={styles.fighterName}>{bName}</span>
            <div className={styles.stateChips}>
              {chipsOf("b").map((c) => (
                <span key={c} className={`${styles.chip} ${c === "다운!" || c === "스턴!" ? styles.chipWarn : ""}`}>{c}</span>
              ))}
            </div>
          </div>
          {atEnd && (
            <div className={styles.finishOverlay}>
              <span className={styles.finishText}>{FINISH_TEXT[finishType] ?? finishType}</span>
              <span className={styles.finishSub}>
                {winnerName ? `${winnerName} 승리` : "무승부"}
              </span>
            </div>
          )}
        </div>
        <div className={styles.hpRow}>
          <div className={styles.hpSide}>
            <span className={styles.hpLabel}>{aName}</span>
            <div className={styles.hpBar}>
              <div className={styles.hpFillA} style={{ width: `${f.aHealth}%` }} />
            </div>
            <div className={styles.stBar}>
              <div className={styles.stFill} style={{ width: `${f.aStamina}%` }} />
            </div>
          </div>
          <div className={styles.hpSideRight}>
            <span className={styles.hpLabel}>{bName}</span>
            <div className={styles.hpBar}>
              <div className={styles.hpFillB} style={{ width: `${f.bHealth}%` }} />
            </div>
            <div className={styles.stBar}>
              <div className={styles.stFill} style={{ width: `${f.bStamina}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.captionBar}>
        {lastEvt ? lastEvt.description : "전투 시작 대기 중..."}
      </div>

      <div className={styles.ctrlRow}>
        <button type="button" className={styles.ctrlBtn} onClick={() => {
          if (atEnd) setT(0);
          setPlaying(!playing);
        }}>
          {playing ? "⏸ 일시정지" : atEnd ? "↺ 다시 보기" : "▶ 재생"}
        </button>
        <div className={styles.speedGroup}>
          {[1, 2, 4, 8].map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.ctrlBtn} ${speed === s ? styles.ctrlBtnActive : ""}`}
              onClick={() => setSpeed(s)}
            >
              ×{s}
            </button>
          ))}
        </div>
        <input
          className={styles.scrub}
          type="range"
          min={0}
          max={Math.max(0.1, endT)}
          step={0.1}
          value={t}
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value));
          }}
        />
        <span className={styles.timeDisplay}>
          {t.toFixed(1)}s / {endT.toFixed(0)}s
        </span>
      </div>

      <div className={styles.bodyGrid}>
        <BodyModel parts={dmgA} max={dmgMax} title={`${aName} 피해 (실시간)`} />
        <div className={styles.feedCol}>
          <span className={styles.bodyTitle}>전투 피드</span>
          <div className={styles.feedBox}>
            {feed.map((e) => (
              <div
                key={e.id}
                className={`${styles.feedItem} ${
                  e.type === "ko" || e.type === "death" || e.type === "submission_finish"
                    ? styles.feedFinish
                    : e.type === "knockdown" ? styles.feedKd : ""
                }`}
              >
                <span className={styles.feedTime}>{e.timestamp}s</span>
                <span className={styles.feedText}>{e.description}</span>
              </div>
            ))}
          </div>
          <div className={styles.bmLegend}>
            <span className={styles.legendLabel}>피해 강도</span>
            <span className={styles.legendBar} />
            <span className={styles.legendLabel}>치명</span>
          </div>
        </div>
        <BodyModel parts={dmgB} max={dmgMax} title={`${bName} 피해 (실시간)`} />
      </div>
    </div>
  );
}
