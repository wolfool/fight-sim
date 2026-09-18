"use client";

import styles from "../app/page.module.css";
import { ANIMAL_PRESETS } from "@fight-sim/core/data/animal-traits";

const OPPONENT_ORDER = [
  "human_untrained",
  "chimpanzee",
  "gorilla",
  "orangutan",
  "tiger",
  "lion",
  "brown_bear",
  "grizzly",
  "wolf",
  "wild_boar",
] as const;

export const KOREAN_NAME: Record<string, string> = {
  human_untrained: "인간 (비훈련)",
  chimpanzee: "침팬지",
  gorilla: "고릴라",
  orangutan: "오랑우탄",
  tiger: "호랑이",
  lion: "사자",
  brown_bear: "불곰",
  grizzly: "그리즐리",
  wolf: "늑대",
  wild_boar: "멧돼지",
};

const HUNTING_STYLE_LABEL: Record<string, string> = {
  ambush: "매복",
  chase: "추격",
  grapple: "그래플",
  bite: "물기",
  strike: "타격",
  pack: "무리 사냥",
  charge: "돌진",
};

const KILL_METHOD_LABEL: Record<string, string> = {
  suffocation: "질식",
  exsanguination: "과다출혈",
  crushing: "압사",
  neck_break: "목 분절",
  overwhelm: "제압",
  piercing: "관통",
  none: "치명타 없음",
};

export interface OpponentPickerProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function OpponentPicker({ selected, onSelect }: OpponentPickerProps) {
  return (
    <section>
      <div className={styles.sectionTitle}>
        <span className={styles.cardNum}>5</span> 상대 선택
        <span className={styles.ddHint}>문헌 기반 실측 프로파일</span>
      </div>
      <div className={styles.oppGrid}>
        {OPPONENT_ORDER.map((id) => {
          const p = ANIMAL_PRESETS[id];
          if (!p) return null;
          const active = selected === id;
          return (
            <button
              key={id}
              type="button"
              className={`${styles.oppCard} ${active ? styles.oppCardActive : ""}`}
              onClick={() => onSelect(id)}
            >
              {active && <span className={styles.oppPick}>✓</span>}
              <span className={styles.oppName}>{KOREAN_NAME[id] ?? id}</span>
              <span className={styles.oppSci}>
                {p.taxonomy.genus} {p.taxonomy.species}
                {p.taxonomy.subspecies ? ` ${p.taxonomy.subspecies}` : ""}
              </span>
              <div className={styles.oppStatsRow}>
                <span className={styles.oppStat}>
                  체중 <b>{p.physical.massRange.min}~{p.physical.massRange.max}kg</b>
                </span>
                <span className={styles.oppStat}>
                  교합력 <b>{p.biomechanics.biteForce.value.toLocaleString()}N</b>
                </span>
                <span className={styles.oppStat}>
                  질주 <b>{p.biomechanics.sprintSpeed.value}m/s</b>
                </span>
              </div>
              <div className={styles.oppTraits}>
                <span className={styles.oppTag}>
                  {HUNTING_STYLE_LABEL[p.behavior.huntingStyle] ?? p.behavior.huntingStyle}
                </span>
                <span className={styles.oppTag}>
                  {KILL_METHOD_LABEL[p.behavior.killMethod] ?? p.behavior.killMethod}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
