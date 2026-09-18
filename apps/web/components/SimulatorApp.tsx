"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../app/page.module.css";
import type { ParsedBackground } from "@fight-sim/core/data/schemas";
import {
  BackgroundParser,
  type ParseResult,
} from "@fight-sim/core/parser/BackgroundParser";
import StatsPreview from "./StatsPreview";
import OpponentPicker, { KOREAN_NAME } from "./OpponentPicker";

const parser = new BackgroundParser();

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

export default function SimulatorApp() {
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("72");
  const [smm, setSmm] = useState("32");
  const [fm, setFm] = useState("14");
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState<"male" | "female">("male");

  const [historyText, setHistoryText] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [parsing, setParsing] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const [art, setArt] = useState("none");
  const [months, setMonths] = useState(0);
  const [freq, setFreq] = useState(0);

  const [homeGround, setHomeGround] = useState<"me" | "opponent" | "neutral">("neutral");
  const [deathAllowed, setDeathAllowed] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsScale, setStatsScale] = useState<"relative" | "absolute">("relative");
  const [simulationCount, setSimulationCount] = useState(200);
  const [timeLimit, setTimeLimit] = useState("5min");

  const [opponent, setOpponent] = useState<string | null>(null);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    const text = historyText.trim();
    if (!text) {
      setParseResult(null);
      setParsing(false);
      return;
    }
    setParsing(true);
    const timer = setTimeout(() => {
      setParseResult(parser.parse(text));
      setParsing(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [historyText]);

  useEffect(() => {
    if (parseResult && !manualOverride) {
      setArt(parseResult.parsed.primaryArt || "none");
      setMonths(parseResult.parsed.experienceMonths ?? 0);
      setFreq(parseResult.parsed.trainingFrequency ?? 0);
    }
  }, [parseResult, manualOverride]);

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
  const backgroundValid = historyText.trim() !== "" || art !== "none";
  const formValid = specValid && backgroundValid && opponent !== null;

  const parsedBackground: ParsedBackground | null = useMemo(() => {
    if (!specValid) return null;
    return {
      primaryArt: art === "none" ? "default" : art,
      experienceMonths: months,
      trainingFrequency: freq,
      confidence: parseResult?.parsed.confidence ?? 0.5,
    };
  }, [specValid, art, months, freq, parseResult]);

  const confidence = parseResult?.parsed.confidence ?? 0;
  const confClass =
    confidence >= 0.7 ? styles.confGood : confidence >= 0.4 ? styles.confWarn : styles.confBad;
  const confLabel =
    confidence >= 0.7 ? "높음" : confidence >= 0.4 ? "보통" : "낮음";

  const opponentLabel = opponent ? (KOREAN_NAME[opponent] ?? opponent) : "";

  const onManualChange = <T,>(setter: (v: T) => void) => (v: T) => {
    setManualOverride(true);
    setter(v);
  };

  const onDeathToggle = () => {
    if (deathAllowed) {
      setDeathAllowed(false);
    } else {
      setShowDeathModal(true);
    }
  };

  const onSimulate = () => {
    setNotice(true);
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
                <span className={styles.ddHint}>
                  {parsing ? "파싱 중..." : "자연어 + 직접 선택 병행"}
                </span>
              </div>
              <textarea
                className={styles.textarea}
                placeholder="예: 복싱 6개월, 주 3회 · 주짓수 1년 · 태권도 3년 (도장)"
                value={historyText}
                onChange={(e) => {
                  setHistoryText(e.target.value);
                  setManualOverride(false);
                }}
              />

              {parseResult && (
                <div className={styles.parsePreview}>
                  <div className={styles.parseTop}>
                    <span className={styles.parseLabel}>파싱 결과</span>
                    <span className={`${styles.confBadge} ${confClass}`}>
                      신뢰도 {confLabel} · {Math.round(confidence * 100)}%
                    </span>
                  </div>
                  <div className={styles.parseItems}>
                    <span className={styles.parseItem}>
                      종목 <b>{ART_OPTIONS.find((o) => o.value === parseResult.parsed.primaryArt)?.label ?? parseResult.parsed.primaryArt}</b>
                    </span>
                    <span className={styles.parseItem}>
                      경력 <b>{monthLabel(parseResult.parsed.experienceMonths)}</b>
                    </span>
                    <span className={styles.parseItem}>
                      빈도 <b>주 {parseResult.parsed.trainingFrequency}회</b>
                    </span>
                  </div>
                  {parseResult.warnings.length > 0 && (
                    <span className={styles.warnText}>{parseResult.warnings.join(" · ")}</span>
                  )}
                </div>
              )}

              <div className={styles.ddRow}>
                <div className={styles.field}>
                  <label className={styles.label}>종목</label>
                  <select
                    className={styles.select}
                    value={art}
                    onChange={(e) => onManualChange(setArt)(e.target.value)}
                  >
                    {ART_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>경력</label>
                  <select
                    className={styles.select}
                    value={months}
                    onChange={(e) => onManualChange(setMonths)(Number(e.target.value))}
                  >
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {monthLabel(m)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>빈도</label>
                  <select
                    className={styles.select}
                    value={freq}
                    onChange={(e) => onManualChange(setFreq)(Number(e.target.value))}
                  >
                    {FREQ_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        주 {f}회
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {!backgroundValid && (
                <span className={styles.err}>격투 이력을 입력하거나 직접 선택하세요</span>
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
                  <span className={`${styles.chev} ${settingsOpen ? styles.chevOpen : ""}`}>▼</span>
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
            disabled={!formValid}
            onClick={onSimulate}
          >
            시뮬레이션 시작 <span className={styles.simArrow}>→</span>
          </button>
          <p className={styles.statusCard}>
            {!specValid ? (
              <span className={styles.statusErr}>신체 스펙 값을 확인하세요</span>
            ) : !backgroundValid ? (
              <span className={styles.statusWarn}>격투 이력을 입력하거나 선택하세요</span>
            ) : opponent === null ? (
              <span className={styles.statusWarn}>상대를 선택하세요</span>
            ) : (
              <span className={styles.statusOk}>
                준비 완료 · 상대: {opponentLabel}
              </span>
            )}
          </p>
          {notice && (
            <div className={styles.statusCard}>
              <b>시뮬레이션 엔진 준비 중 (Phase 2)</b>
              <br />
              CombatResolver · DecisionEngine · SimulationEngine 구현 후
              몬테카를로 승률, 전투 로그, 부위별 피해 히트맵이 표시됩니다.
              현재는 스탯 프리뷰와 상대 설정까지 지원됩니다.
            </div>
          )}
        </div>

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
