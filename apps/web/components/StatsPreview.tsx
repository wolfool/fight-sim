"use client";

import { useMemo } from "react";
import styles from "../app/page.module.css";
import { deriveBodySpec } from "@fight-sim/core/data/body-segments";
import {
  deriveCoreStats,
  getRecommendedTechniques,
} from "@fight-sim/core/data/art-stats";
import type {
  ParsedBackground,
  CoreStats,
} from "@fight-sim/core/data/schemas";

const STAT_META: Array<[keyof CoreStats, string]> = [
  ["strength", "힘"],
  ["speed", "속도"],
  ["endurance", "지구력"],
  ["agility", "민첩성"],
  ["technique", "기술"],
  ["durability", "내구도"],
  ["intelligence", "지능"],
  ["composure", "침착성"],
];

const TECH_LABEL: Record<string, string> = {
  jab: "잽",
  cross: "크로스",
  lead_hook: "리드 훅",
  rear_hook: "리어 훅",
  lead_uppercut: "업퍼컷",
  rear_uppercut: "리어 업퍼컷",
  lead_teep: "티프(앞차기)",
  rear_teep: "리어 티프",
  lead_round_kick: "라운드킥",
  lead_low_kick: "로우킥",
  lead_elbow: "엘보",
  double_leg: "더블레그 TD",
  single_leg: "싱글레그 TD",
  rear_naked_choke: "리어 네이키드 초크",
  guillotine: "길로틴",
  triangle: "트라이앵글",
  armbar: "암바",
  kimura: "기무라",
  sprawl: "스프롤",
  slip: "슬립",
  weave: "위빙",
  parry: "패리",
  block_high: "하이 가드",
  osoto_gari: "오소토가리",
  seoi_nage: "세오이나게",
  uchi_mata: "우치마타",
};

export interface StatsPreviewProps {
  height: number;
  weight: number;
  smm: number;
  fm: number;
  age: number;
  sex: "male" | "female";
  parsedBackground: ParsedBackground | null;
}

export default function StatsPreview(props: StatsPreviewProps) {
  const { height, weight, smm, fm, age, sex, parsedBackground } = props;

  const valid =
    height >= 100 && height <= 250 &&
    weight >= 20 && weight <= 200 &&
    smm >= 10 && smm <= 100 &&
    fm >= 2 && fm <= 80 &&
    smm + fm < weight &&
    age >= 10 && age <= 100;

  const body = useMemo(
    () =>
      valid
        ? deriveBodySpec({
            height,
            weight,
            skeletalMuscleMass: smm,
            bodyFatMass: fm,
            age,
            sex,
          })
        : null,
    [valid, height, weight, smm, fm, age, sex]
  );

  const stats = useMemo(
    () =>
      valid && parsedBackground
        ? deriveCoreStats({
            height,
            weight,
            skeletalMuscleMass: smm,
            bodyFatMass: fm,
            age,
            sex,
            parsedBackground,
          })
        : null,
    [valid, parsedBackground, height, weight, smm, fm, age, sex]
  );

  const techniques = useMemo(() => {
    if (!parsedBackground || parsedBackground.primaryArt === "default") return [];
    return getRecommendedTechniques(
      parsedBackground.primaryArt,
      parsedBackground.experienceMonths
    ).slice(0, 8);
  }, [parsedBackground]);

  if (!body || !stats) {
    return (
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <span className={styles.cardNum}>4</span> 실시간 스탯 프리뷰
        </div>
        <p className={styles.statusCard}>
          신체 스펙을 입력하면 파생 지표(BMI, 체지방률, FFMI)와
          <br />
          종목/경력 기반 코어 스탯 8종이 실시간 계산됩니다.
        </p>
      </div>
    );
  }

  const ffmi = body.leanBodyMass / (height / 100) ** 2;

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <span className={styles.cardNum}>4</span> 실시간 스탯 프리뷰
      </div>

      <div>
        {STAT_META.map(([key, label]) => {
          const v = stats[key];
          return (
            <div key={key} className={styles.statRow}>
              <span className={styles.statName}>{label}</span>
              <div className={styles.statTrack}>
                <div
                  className={`${styles.statFill} ${v < 20 ? styles.statFillLow : ""}`}
                  style={{ width: `${Math.max(2, Math.min(100, v))}%` }}
                />
              </div>
              <span className={styles.statNum}>{Math.round(v)}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.derivedGrid}>
        <div className={styles.dItem}>
          <span className={styles.dVal}>{body.bmi.toFixed(1)}</span>
          <span className={styles.dLabel}>BMI</span>
        </div>
        <div className={styles.dItem}>
          <span className={styles.dVal}>{body.bodyFatPercent.toFixed(1)}%</span>
          <span className={styles.dLabel}>체지방률</span>
        </div>
        <div className={styles.dItem}>
          <span className={styles.dVal}>{body.leanBodyMass.toFixed(1)}kg</span>
          <span className={styles.dLabel}>제지방량</span>
        </div>
        <div className={styles.dItem}>
          <span className={styles.dVal}>{ffmi.toFixed(1)}</span>
          <span className={styles.dLabel}>FFMI</span>
        </div>
      </div>

      {techniques.length > 0 && (
        <div className={styles.techChips}>
          {techniques.map((t) => (
            <span key={t} className={styles.chip}>
              {TECH_LABEL[t] ?? t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
