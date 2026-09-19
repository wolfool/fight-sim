"use client";

import { useState } from "react";
import type { SimulationReport } from "@fight-sim/core/engine";
import styles from "../app/page.module.css";
import ReplaySection from "./ReplaySection";

const PART_KOREAN: Partial<Record<string, string>> = {
  head: "머리", neck: "목", torso_front: "명치·가슴", torso_back: "등",
  torso_side_l: "왼옆구리", torso_side_r: "오른옆구리", groin: "가랑이",
  arm_upper_l: "왼팔 상단", arm_upper_r: "오른팔 상단",
  arm_lower_l: "왼팔 하단", arm_lower_r: "오른팔 하단",
  hand_l: "왼손", hand_r: "오른손",
  leg_upper_l: "왼허벅지", leg_upper_r: "오른허벅지",
  leg_lower_l: "왼 정강이", leg_lower_r: "오른 정강이",
  foot_l: "왼발", foot_r: "오른발",
};

const FINISH_KOREAN: Record<string, string> = {
  ko: "KO", tko: "TKO", submission: "서브미션",
  decision: "판정", surrender: "항복", death: "사망",
};

export default function ResultsPanel({
  report, myName, opponentLabel, opponentEmoji, deathAllowed,
}: {
  report: SimulationReport;
  myName: string;
  opponentLabel: string;
  opponentEmoji: string;
  deathAllowed: boolean;
}) {
  const { probability: p, sampleResult: sample, runs } = report;
  const myRate = Math.round(p.winRate.A * 100);
  const oppRate = Math.round(p.winRate.B * 100);
  const drawRate = Math.max(0, 100 - myRate - oppRate);

  const finishes = Object.entries(p.finishTypeDistribution)
    .sort((a, b) => b[1] - a[1]);

  const log = sample.timeline.slice(-40);

  const dmgRows = (side: "A" | "B") =>
    Object.values(sample.damageByPart[side])
      .sort((a, b) => b.totalDamage - a.totalDamage)
      .slice(0, 4)
      .filter((d) => d.totalDamage > 0.5);
  const dmgMax = Math.max(
    1,
    ...dmgRows("A").map((d) => d.totalDamage),
    ...dmgRows("B").map((d) => d.totalDamage)
  );

  const verdict =
    myRate >= oppRate + 10 ? `${myName} 우위` :
    oppRate >= myRate + 10 ? `${opponentLabel} 우위` : "백중세";

  const [summaryCopied, setSummaryCopied] = useState(false);
  const onCopySummary = async () => {
    const top = finishes
      .slice(0, 3)
      .map(([type, count]) => `${FINISH_KOREAN[type] ?? type} ${count}회`)
      .join(", ");
    const text =
      `[Fight Simulator] ${myName} vs ${opponentLabel} (${runs}회 시뮬레이션)\n` +
      `승률 ${myRate}% vs ${oppRate}% (${verdict})\n` +
      `종료 방식: ${top} · 평균 ${Math.floor(p.avgDuration / 60)}분 ${Math.round(p.avgDuration % 60)}초`;
    try {
      await navigator.clipboard.writeText(text);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 1500);
    } catch {
      /* 클립보드 미지원 무시 */
    }
  };

  return (
    <section className={styles.resultsCard}>
      <div className={styles.cardTitle}>
        <span className={styles.cardNum}>4</span> 시뮬레이션 결과
        <span className={styles.ddHint}>{runs}회 몬테카를로 · 95% 신뢰구간 ±{Math.round((p.confidenceInterval.upper - p.confidenceInterval.lower) * 50)}%</span>
      </div>

      {report.frames && report.frames.length > 0 && (
        <ReplaySection
          frames={report.frames}
          timeline={sample.timeline}
          aName={myName}
          bName={opponentLabel}
          aEmoji={String.fromCodePoint(0x1f9cd)}
          bEmoji={opponentEmoji}
          finishType={sample.finishType}
          winnerName={sample.winner === "A" ? myName : sample.winner === "B" ? opponentLabel : null}
        />
      )}

      <div className={styles.verdictRow}>
        <span className={styles.verdictBadge}>{verdict}</span>
        <span className={styles.verdictScore}>
          {myName} <b>{myRate}%</b> vs <b>{oppRate}%</b> {opponentLabel}
        </span>
        <button type="button" className={styles.copySummaryBtn} onClick={onCopySummary}>
          {summaryCopied ? "복사됨!" : "요약 복사"}
        </button>
      </div>

      <div className={styles.rateBar}>
        <div className={styles.rateSeg} style={{ width: `${myRate}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)" }} />
        <div className={styles.rateSeg} style={{ width: `${drawRate}%`, background: "#475569" }} />
        <div className={styles.rateSeg} style={{ width: `${oppRate}%`, background: "linear-gradient(90deg,#ef4444,#f97316)" }} />
      </div>
      <div className={styles.rateLegend}>
        <span>{myName} 승 {myRate}%</span>
        {drawRate > 0 && <span>무승부 {drawRate}%</span>}
        <span>{opponentLabel} 승 {oppRate}%</span>
      </div>

      <div className={styles.finishChips}>
        {finishes.map(([type, count]) => (
          <span key={type} className={`${styles.finishChip} ${type === "death" ? styles.finishChipDeath : ""}`}>
            {FINISH_KOREAN[type] ?? type} <b>{count}회</b>
            <span className={styles.finishPct}>{Math.round((count / runs) * 100)}%</span>
          </span>
        ))}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>평균 전투 시간</span>
          <span className={styles.statVal}>
            {Math.floor(p.avgDuration / 60)}분 {Math.round(p.avgDuration % 60)}초
          </span>
          <span className={styles.statSub}>표준편차 ±{Math.round(p.durationStdDev)}초</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>샘플 유효타 (나/상대)</span>
          <span className={styles.statVal}>
            {sample.summary.significantStrikes.A} / {sample.summary.significantStrikes.B}
          </span>
          <span className={styles.statSub}>총 타격 {sample.summary.totalStrikes.A} / {sample.summary.totalStrikes.B}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>테이크다운 / 다운</span>
          <span className={styles.statVal}>
            {sample.summary.takedowns.A} / {sample.summary.knockdowns.A}
          </span>
          <span className={styles.statSub}>
            상대 TD {sample.summary.takedowns.B} · 상대 다운 유도 {sample.summary.knockdowns.B}
          </span>
        </div>
      </div>

      <div className={styles.dmgGrid}>
        <div>
          <span className={styles.dmgTitle}>{myName}가 입은 피해</span>
          {dmgRows("A").map((d) => (
            <div key={d.partId} className={styles.dmgRow}>
              <span className={styles.dmgPart}>{PART_KOREAN[d.partId] ?? d.partId}</span>
              <div className={styles.dmgBar}>
                <div className={styles.dmgFill} style={{ width: `${Math.min(100, (d.totalDamage / dmgMax) * 100)}%` }} />
              </div>
              <span className={styles.dmgVal}>{Math.round(d.totalDamage)}</span>
            </div>
          ))}
          {dmgRows("A").length === 0 && <span className={styles.dmgEmpty}>피해 없음</span>}
        </div>
        <div>
          <span className={styles.dmgTitle}>{opponentLabel}가 입은 피해</span>
          {dmgRows("B").map((d) => (
            <div key={d.partId} className={styles.dmgRow}>
              <span className={styles.dmgPart}>{PART_KOREAN[d.partId] ?? d.partId}</span>
              <div className={styles.dmgBar}>
                <div className={styles.dmgFill} style={{ width: `${Math.min(100, (d.totalDamage / dmgMax) * 100)}%`, background: "linear-gradient(90deg,#22d3ee,#3b82f6)" }} />
              </div>
              <span className={styles.dmgVal}>{Math.round(d.totalDamage)}</span>
            </div>
          ))}
          {dmgRows("B").length === 0 && <span className={styles.dmgEmpty}>피해 없음</span>}
        </div>
      </div>

      <details className={styles.logDetails} open>
        <summary className={styles.logSummary}>전투 로그 (샘플 1회 · {sample.finishType === "death" && deathAllowed ? "사망 연출 포함" : `${sample.duration}초`})</summary>
        <div className={styles.logBox}>
          {log.map((e) => (
            <div
              key={e.id}
              className={`${styles.logItem} ${
                e.type === "ko" || e.type === "death" || e.type === "submission_finish" || e.type === "surrender"
                  ? styles.logItemFinish
                  : e.type === "knockdown" ? styles.logItemKd : ""
              }`}
            >
              <span className={styles.logTime}>{e.timestamp}s</span>
              <span className={styles.logText}>{e.description}</span>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
