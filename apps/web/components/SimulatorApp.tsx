"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../app/page.module.css";
import type { ParsedBackground } from "@fight-sim/core/data/schemas";
import {
  buildHumanFighter,
  buildAnimalFighter,
  buildFightContext,
  runMonteCarlo,
  type SimulationReport,
} from "@fight-sim/core/engine";
import { ANIMAL_PRESETS } from "@fight-sim/core/data/animal-traits";
import StatsPreview from "./StatsPreview";
import OpponentPicker, { KOREAN_NAME } from "./OpponentPicker";
import ResultsPanel from "./ResultsPanel";

const ART_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "none", label: "무수련" },
  { value: "boxing", label: "복싱" },
  { value: "muaythai", label: "무에타이" },
  { value: "kickboxing", label: "킥복싱" },
  { value: "tkd", label: "태권도" },
  { value: "bjj", label: "주짓수" },
  { value: "wrestling", label: "레슬링" },
  { value: "judo", label: "유도" },
  { value: "sambo", label: "삼보" },
  { value: "sanda", label: "산타" },
  { value: "mma", label: "MMA (종합격투기)" },
];

const MONTH_OPTIONS = [0, 3, 6, 12, 24, 36, 60, 120];
const FREQ_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

const TIME_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "1min", label: "1분" },
  { value: "5min", label: "5분" },
  { value: "10min", label: "10분" },
  { value: "unlimited", label: "무제한" },
];

const OPPONENT_EMOJI: Record<string, string> = {
  human_untrained: String.fromCodePoint(0x1f9cd),
  chimpanzee: String.fromCodePoint(0x1f412),
  gorilla: String.fromCodePoint(0x1f98d),
  orangutan: String.fromCodePoint(0x1f9a5),
  tiger: String.fromCodePoint(0x1f42f),
  lion: String.fromCodePoint(0x1f981),
  brown_bear: String.fromCodePoint(0x1f43b),
  grizzly: String.fromCodePoint(0x1f43b),
  wolf: String.fromCodePoint(0x1f43a),
  wild_boar: String.fromCodePoint(0x1f417),
};

function monthLabel(m: number): string {
  if (m === 0) return "무경험";
  if (m < 12) return `${m}개월`;
  const y = m / 12;
  return `${y % 1 === 0 ? y : y.toFixed(1)}년`;
}

const num = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

function encodeState(obj: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function decodeState(s: string): Record<string, unknown> {
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
}

export default function SimulatorApp() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("72");
  const [smm, setSmm] = useState("32");
  const [fm, setFm] = useState("14");
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState<"male" | "female">("male");

  const [art, setArt] = useState("none");
  const [months, setMonths] = useState(0);
  const [freq, setFreq] = useState(0);
  const [secondary, setSecondary] = useState("none");
  const [secondaryMonths, setSecondaryMonths] = useState(0);

  const [homeGround, setHomeGround] = useState<"me" | "opponent" | "neutral">("neutral");
  const [deathAllowed, setDeathAllowed] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsScale, setStatsScale] = useState<"relative" | "absolute">("relative");
  const [simulationCount, setSimulationCount] = useState(200);
  const [timeLimit, setTimeLimit] = useState("5min");

  const [opponent, setOpponent] = useState<string | null>(null);
  const [reports, setReports] = useState<Record<string, SimulationReport>>({});
  const [simulating, setSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash;
    if (!h.startsWith("#m=")) return;
    try {
      const d = decodeState(h.slice(3));
      const gs = (k: string, dflt: string) => (typeof d[k] === "string" ? (d[k] as string) : dflt);
      const gn = (k: string, dflt: number) =>
        typeof d[k] === "number" && Number.isFinite(d[k] as number) ? (d[k] as number) : dflt;
      const gb = (k: string, dflt: boolean) => (typeof d[k] === "boolean" ? (d[k] as boolean) : dflt);
      setHeight(gs("h", "175"));
      setWeight(gs("w", "72"));
      setSmm(gs("s", "32"));
      setFm(gs("f", "14"));
      setAge(gs("a", "30"));
      setSex(gs("g", "male") === "female" ? "female" : "male");
      setArt(gs("pa", "none"));
      setMonths(gn("pm", 0));
      setFreq(gn("pf", 0));
      setSecondary(gs("sa", "none"));
      setSecondaryMonths(gn("smo", 0));
      setHomeGround(gs("hg", "neutral") as "me" | "opponent" | "neutral");
      setDeathAllowed(gb("da", false));
      setStatsScale(gs("sc", "relative") === "absolute" ? "absolute" : "relative");
      setSimulationCount(gn("n", 200));
      setTimeLimit(gs("tl", "5min"));
      setOpponent(gs("op", null as unknown as string) || null);
    } catch {
      /* 잘못된 링크는 무시 */
    }
  }, []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const h = num(height);
    const w = num(weight);
    const s = num(smm);
    const f = num(fm);
    const a = num(age);
    if (!(h >= 100 && h <= 250)) e.height = "100~250cm로 입력";
    if (!(w >= 20 && w <= 200)) e.weight = "20~200kg로 입력";
    if (!(s >= 10 && s <= 100)) e.smm = "10~100kg (인바디 SMM)";
    if (!(f >= 2 && f <= 80)) e.fm = "2~80kg (인바디 FM)";
    if (!(a >= 10 && a <= 100)) e.age = "10~100세";
    if (s + f >= w) e.smm = "골격근+체지방이 체중보다 적어야 합니다";
    return e;
  }, [height, weight, smm, fm, age]);

  const specValid = Object.keys(errors).length === 0;
  const formValid = specValid && opponent !== null;

  const parsedBackground: ParsedBackground | null = useMemo(() => {
    if (!specValid) return null;
    return {
      primaryArt: art === "none" ? "default" : art,
      experienceMonths: months,
      trainingFrequency: Math.max(1, freq),
      confidence: 0.9,
      ...(secondary !== "none"
        ? { secondaryArt: secondary, secondaryExperienceMonths: secondaryMonths }
        : {}),
    };
  }, [specValid, art, months, freq, secondary, secondaryMonths]);

  const opponentLabel = opponent ? (KOREAN_NAME[opponent] ?? opponent) : "";
  const report = opponent ? reports[opponent] ?? null : null;

  const onDeathToggle = () => {
    if (deathAllowed) {
      setDeathAllowed(false);
    } else {
      setShowDeathModal(true);
    }
  };

  const onSimulate = async () => {
    if (!formValid || !parsedBackground || simulating) return;
    const oppAtStart = opponent;
    const profile = oppAtStart ? ANIMAL_PRESETS[oppAtStart] : null;
    if (!profile || !oppAtStart) return;
    setSimulating(true);
    setProgress(0);
    const me = buildHumanFighter({
      name: "나",
      height: num(height),
      weight: num(weight),
      skeletalMuscleMass: num(smm),
      bodyFatMass: num(fm),
      age: num(age),
      sex,
      parsedBackground,
      deathAllowed,
    });
    const foe = buildAnimalFighter(profile);
    const ctx = buildFightContext({
      homeGround,
      deathAllowed,
      timeLimit: timeLimit as "1min" | "5min" | "10min" | "unlimited",
      seed: Math.floor(Math.random() * 1e9),
    });
    try {
      const rep = await runMonteCarlo(me, foe, ctx, simulationCount, (done, total) =>
        setProgress(Math.round((done / total) * 100))
      );
      setReports((prev) => ({ ...prev, [oppAtStart]: rep }));
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    } finally {
      setSimulating(false);
    }
  };

  const onShare = async () => {
    const payload = {
      h: height, w: weight, s: smm, f: fm, a: age, g: sex,
      pa: art, pm: months, pf: freq, sa: secondary, smo: secondaryMonths,
      hg: homeGround, da: deathAllowed, sc: statsScale, n: simulationCount,
      tl: timeLimit, op: opponent,
    };
    const url = `${window.location.origin}${window.location.pathname}#m=${encodeState(payload)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("링크를 복사하세요:", url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.badgeTop}>
            <span className={styles.badgeDot} />
            문헌 기반 바이오메카닉스 시뮬레이터
          </span>
          <h1 className={styles.title}>
            내 몸으로 싸우면 <span className={styles.titleAccent}>얼마나 이길까?</span>
          </h1>
          <p className={styles.subtitle}>
            신체 스펙과 격투 이력을 입력하면 상대(사람/동물)와의 전투를 시뮬레이션해
            승률, 피해 부위, 전투 과정을 보여줍니다.
          </p>
        </header>

        <div className={styles.layout}>
          <div className={styles.col}>
            <section className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={styles.cardNum}>1</span> 신체 스펙
                <span className={styles.ddHint}>인바디 수치 기준</span>
              </div>
              <div className={styles.specGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    키 <span className={styles.req}>*필수</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.height ? styles.inputInvalid : ""}`}
                    type="number"
                    inputMode="numeric"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                  <span className={styles.err}>{errors.height ?? ""}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    몸무게 <span className={styles.req}>*필수</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.weight ? styles.inputInvalid : ""}`}
                    type="number"
                    inputMode="numeric"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <span className={styles.err}>{errors.weight ?? ""}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    골격근량 <span className={styles.unit}>SMM</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.smm ? styles.inputInvalid : ""}`}
                    type="number"
                    inputMode="numeric"
                    value={smm}
                    onChange={(e) => setSmm(e.target.value)}
                  />
                  <span className={styles.err}>{errors.smm ?? ""}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    체지방량 <span className={styles.unit}>FM</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.fm ? styles.inputInvalid : ""}`}
                    type="number"
                    inputMode="numeric"
                    value={fm}
                    onChange={(e) => setFm(e.target.value)}
                  />
                  <span className={styles.err}>{errors.fm ?? ""}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    나이 <span className={styles.unit}>스탯 보정용</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.age ? styles.inputInvalid : ""}`}
                    type="number"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <span className={styles.err}>{errors.age ?? ""}</span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>성별</label>
                  <div className={styles.scaleRow}>
                    <button
                      type="button"
                      className={`${styles.pill} ${sex === "male" ? styles.pillActive : ""}`}
                      onClick={() => setSex("male")}
                    >
                      남성
                    </button>
                    <button
                      type="button"
                      className={`${styles.pill} ${sex === "female" ? styles.pillActive : ""}`}
                      onClick={() => setSex("female")}
                    >
                      여성
                    </button>
                  </div>
                  <span className={styles.err} />
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={styles.cardNum}>2</span> 격투 이력
                <span className={styles.ddHint}>주 종목 + 보조 종목 조합</span>
              </div>
              <div className={styles.ddRow}>
                <div className={styles.field}>
                  <label className={styles.label}>주 종목</label>
                  <select
                    className={styles.select}
                    value={art}
                    onChange={(e) => setArt(e.target.value)}
                  >
                    {ART_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>주 종목 경력</label>
                  <select
                    className={styles.select}
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {monthLabel(m)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>주당 훈련 빈도</label>
                  <select
                    className={styles.select}
                    value={freq}
                    onChange={(e) => setFreq(Number(e.target.value))}
                  >
                    {FREQ_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        주 {f}회
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.ddRow}>
                <div className={styles.field}>
                  <label className={styles.label}>보조 종목</label>
                  <select
                    className={styles.select}
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                  >
                    {ART_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value === "none" ? "없음" : o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>보조 종목 경력</label>
                  <select
                    className={styles.select}
                    value={secondaryMonths}
                    onChange={(e) => setSecondaryMonths(Number(e.target.value))}
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {monthLabel(m)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {secondary !== "none" && secondaryMonths === 0 && (
                <span className={styles.err}>보조 종목 경력을 선택하면 스탯·기술에 반영됩니다</span>
              )}
            </section>

            <section className={styles.card}>
              <div className={styles.cardTitle}>
                <span className={styles.cardNum}>3</span> 전투 조건
              </div>
              <div className={styles.radioRow}>
                <button
                  type="button"
                  className={`${styles.pill} ${homeGround === "me" ? styles.pillActive : ""}`}
                  onClick={() => setHomeGround("me")}
                >
                  나의 홈
                  <span className={styles.pillDesc}>멘탈·민첩 버프</span>
                </button>
                <button
                  type="button"
                  className={`${styles.pill} ${homeGround === "opponent" ? styles.pillActive : ""}`}
                  onClick={() => setHomeGround("opponent")}
                >
                  상대의 홈
                  <span className={styles.pillDesc}>심리 불리</span>
                </button>
                <button
                  type="button"
                  className={`${styles.pill} ${homeGround === "neutral" ? styles.pillActive : ""}`}
                  onClick={() => setHomeGround("neutral")}
                >
                  중립
                  <span className={styles.pillDesc}>균등 조건</span>
                </button>
              </div>

              <div className={styles.toggleRow} style={{ marginTop: 14 }}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleTitle}>죽음을 각오함</span>
                  <span className={styles.toggleDesc}>
                    항복 불가 · 사망 시 즉시 종료 (deathAllowed)
                  </span>
                </div>
                <button
                  type="button"
                  className={`${styles.switch} ${deathAllowed ? styles.switchOn : ""}`}
                  onClick={onDeathToggle}
                  aria-pressed={deathAllowed}
                >
                  <span className={styles.switchKnob} />
                </button>
              </div>

              <div className={styles.settings} style={{ marginTop: 14 }}>
                <button
                  type="button"
                  className={styles.settingsHead}
                  onClick={() => setSettingsOpen(!settingsOpen)}
                >
                  시뮬레이션 설정
                  <span className={`${styles.chev} ${settingsOpen ? styles.chevOpen : ""}`}>&#9660;</span>
                </button>
                {settingsOpen && (
                  <div className={styles.settingsBody}>
                    <div className={styles.setField}>
                      <span className={styles.setLabel}>스탯 표기 방식</span>
                      <div className={styles.scaleRow}>
                        <button
                          type="button"
                          className={`${styles.pill} ${statsScale === "relative" ? styles.pillActive : ""}`}
                          onClick={() => setStatsScale("relative")}
                        >
                          상대적 (0-100)
                        </button>
                        <button
                          type="button"
                          className={`${styles.pill} ${statsScale === "absolute" ? styles.pillActive : ""}`}
                          onClick={() => setStatsScale("absolute")}
                        >
                          절대값 (N, m/s, J)
                        </button>
                      </div>
                    </div>
                    <div className={styles.setField}>
                      <span className={styles.setLabel}>
                        시뮬레이션 횟수
                        <span className={styles.setVal}>{simulationCount}회</span>
                      </span>
                      <input
                        className={styles.slider}
                        type="range"
                        min={100}
                        max={2000}
                        step={50}
                        value={simulationCount}
                        onChange={(e) => setSimulationCount(Number(e.target.value))}
                      />
                    </div>
                    <div className={styles.setField}>
                      <span className={styles.setLabel}>시간 제한</span>
                      <div className={styles.scaleRow}>
                        {TIME_OPTIONS.map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            className={`${styles.pill} ${timeLimit === o.value ? styles.pillActive : ""}`}
                            onClick={() => setTimeLimit(o.value)}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className={styles.col}>
            <div className={styles.sticky}>
              <StatsPreview
                height={num(height)}
                weight={num(weight)}
                smm={num(smm)}
                fm={num(fm)}
                age={num(age)}
                sex={sex}
                parsedBackground={parsedBackground}
              />
            </div>
          </div>
        </div>

        <OpponentPicker selected={opponent} onSelect={setOpponent} />

        <div className={styles.actionBar}>
          <button
            type="button"
            className={styles.simBtn}
            disabled={!formValid || simulating}
            onClick={onSimulate}
          >
            {simulating
              ? `시뮬레이션 중... ${progress}%`
              : "시뮬레이션 시작"}{" "}
            <span className={styles.simArrow}>&rarr;</span>
          </button>
          <button
            type="button"
            className={styles.shareBtn}
            disabled={!specValid}
            onClick={onShare}
          >
            {copied ? "복사됨!" : "링크 복사"}
          </button>
          <p className={styles.statusCard}>
            {!specValid ? (
              <span className={styles.statusErr}>신체 스펙 값을 확인하세요</span>
            ) : opponent === null ? (
              <span className={styles.statusWarn}>상대를 선택하세요</span>
            ) : (
              <span className={styles.statusOk}>
                준비 완료 · 상대: {opponentLabel}
              </span>
            )}
          </p>
          {simulating && (
            <div className={styles.simProgress}>
              <span className={styles.simProgressLabel}>
                몬테카를로 {simulationCount}회 진행 중... {progress}%
              </span>
              <div className={styles.simProgressBar}>
                <span
                  className={styles.simProgressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {report && (
          <div ref={resultsRef}>
            <ResultsPanel
              report={report}
              myName="나"
              opponentLabel={opponentLabel}
              opponentEmoji={opponent ? OPPONENT_EMOJI[opponent] ?? String.fromCodePoint(0x2753) : String.fromCodePoint(0x2753)}
              deathAllowed={deathAllowed}
            />
          </div>
        )}

        <footer className={styles.footer}>
          <b>Fight Simulator</b> · 모든 데이터는 문헌 기반 추정치이며 실제 결과를 보장하지 않습니다.
          <br />
          본 시뮬레이션은 엔터테인먼트 목적이며 의료/전문가 조언이 아닙니다.
        </footer>
      </div>

      {showDeathModal && (
        <div className={styles.overlay} onClick={() => setShowDeathModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.mTitle}>죽음을 각오하시겠습니까?</h2>
            <p className={styles.mBody}>
              활성화하면 <b>항복이 불가능</b>해지고, 시뮬레이션 중
              <b> 사망 판정 시 즉시 종료</b>됩니다.
              <br />
              일부 상대(대형 맹수 등)와의 매치업에서만 실제 차이가 발생합니다.
            </p>
            <div className={styles.mActions}>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setShowDeathModal(false)}
              >
                취소
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={() => {
                  setDeathAllowed(true);
                  setShowDeathModal(false);
                }}
              >
                각오한다
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
