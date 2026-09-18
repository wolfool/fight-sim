# Fight Simulator - 기획안 (v1.5)

## 1. 프로젝트 개요

### 1.1 핵심 컨셉
**"내 몸으로 싸우면 얼마나 이길까?"** — 사용자 신체 스펙과 격투 이력을 입력하면, 상대(사람/동물/몬스터)와의 전투를 시뮬레이션해 승률, 피해 부위, 전투 과정을 텍스트/시각적으로 보여주는 웹 서비스.

### 1.2 차별화 포인트
- **실제 바이오메카닉스 데이터 기반**: 논문/경기 통계에서 추출한 펀치/킥 힘·속도·궤적 사용
- **해부학적 손상 모델**: 피부·근육·뼈·신경·혈관·장기별 내구도와 압력/에너지 기반 손상 계산
- **완전 자동 시뮬레이션**: 전투 중 사용자 개입 없음. AI가 전술 판단 → 텍스트 로그로 재현
- **하이브리드 입력**: 자연어("복싱 6개월, 주 3회") + 드롭다운 선택 병행, confidence 낮으면 보정 유도
- **로컬 퍼스트**: `npm run dev` 한 방 실행, 외부 의존성 없음, 완전 오프라인 동작
- **단일 HTML 배포**: `npm run build:standalone` → `dist/fight-simulator.html` 하나로 배포 — 더블클릭으로 브라우저 실행, 서버·Node·설치 불필요 (esbuild 인라인 번들, 자체 무결성 검증 포함)
- **이중 스케일 지원**: 상대적(0-100, 성인 남성 평균 기준) ↔ 절대값(SI 단위) 설정 토글로 즉시 전환
- **물리 기반 그래플링**: Matter.js Constraint로 잡기/눕히기/꺾기 실제 힘겨루기 시뮬
- **동물 습성 반영**: 공격성/영역성/도주성/지능/사회성/사냥방식 + 실측 바이오메카닉스로 AI 성향 차별화

---

## 2. 사용자 입력 (필수 7개 + 설정 3개)

| 입력 항목 | 타입 | 필수 | 비고 |
|-----------|------|------|------|
| 키 | number (cm) | ✅ | 100~250 |
| 몸무게 | number (kg) | ✅ | 20~200 |
| 골격근량 | number (kg) | ✅ | 인바디 SMM, 10~100 |
| 체지방량 | number (kg) | ✅ | 인바디 FM, 2~80 |
| 격투 이력 | string (자연어) | ✅ | 예: "복싱 6개월, 주 3회" |
| 홈그라운드 | select | ✅ | 나 / 상대 / 중립 |
| 죽음을 각오함 | boolean | ✅ | true = 항복 불가, 사망 시 즉시 종료 |
| 스탯 스케일 | select | ⚙️ 설정 | 상대적(0-100, 성인 남성 평균) / 절대값(N, m/s, J) |
| 시뮬레이션 횟수 | number | ⚙️ 설정 | 100~2000 (슬라이더, 기본 200) |
| 시뮬 시간 제한 | select | ⚙️ 설정 | 1분/5분/10분/무제한 (벽시계 기준) |

> **파생 자동 계산**: BMI, 체지방률, 제지방량, 기초대사량(BMR), 체표면적(BSA), 신체 세그먼트 19개(질량/길이/단면적/뼈밀도/근육두께/지방두께), 내구도 프로파일

---

## 3. 상대(오퍼넌트) 프리셋

### 3.1 인간 티어
- 일반인 (비훈련)
- 아마추어 복싱/무에타이/주짓수/레슬링/MMA (각 6개월/1년/3년/5년)
- 프로 선수 (체급별)

### 3.2 동물/몬스터 (초기 10종)
- 침팬지, 고릴라, 오랑우탄
- 호랑이, 사자, 곰 (불곰/그리즐리)
- 늑대, 멧돼지
- 가상 몬스터 (설정 가능한 스탯)

> 각 프리셋: **신체 스펙 + 보유 기술 + AI 성향(습성 기반) + 실측 바이오메카닉스 + 스탯 표현 방식(상대/절대)**

### 3.3 핵심 타입 정의

```typescript
// packages/core/domain/types.ts에 추가

interface NaturalWeapon {
  type: 'bite' | 'claw' | 'horn' | 'tusk' | 'body_slam' | 'kick' | 'stomp';
  name: string;
  peakForce: number;           // N (실측값 우선)
  peakForceSource: 'measured' | 'estimated' | 'inferred';
  peakForceConfidence: number; // 0-1
  contactArea: number;         // cm²
  damageType: 'piercing' | 'slashing' | 'blunt' | 'crushing';
  reach: number;               // cm
  usableStates: FightState[];  // 어떤 상태에서 사용 가능
}

interface NaturalArmor {
  type: 'thick_skin' | 'fat_layer' | 'bone_plate' | 'fur' | 'scales';
  location: BodyPartId[];
  thickness: number;           // mm
  tensileStrength: number;     // MPa
  compressiveStrength: number; // MPa
  coverage: number;            // 0-1 (부위 커버리지)
}

interface Reference {
  type: 'paper' | 'database' | 'observation' | 'expert';
  title: string;
  authors?: string[];
  year: number;
  url?: string;
  doi?: string;
  notes?: string;
}

interface AnimalTraits {
  // 행동 성향 (0-1)
  aggression: number;      // 선제 공격성, 위협 시 맞서기 vs 도망
  territoriality: number;  // 영역 방어 강도, 홈그라운드 가중치
  flightiness: number;     // 도주 성향, 피격 시 회피 vs 반격
  intelligence: number;    // 학습/적응, 함정 회피, 콤보 이해도
  sociality: number;       // 무리 생활성, 도움 요청/협동 공격 가능성
  
  // 사냥/전투 스타일
  huntingStyle: 'ambush' | 'chase' | 'grapple' | 'bite' | 'strike' | 'pack';
  preferredRange: 'close' | 'mid' | 'long';
  killMethod: 'suffocation' | 'exsanguination' | 'crushing' | 'neck_break' | 'overwhelm';
  
  // 신체적 특성
  naturalWeapons: NaturalWeapon[];
  armor: NaturalArmor[];
  
  // 심리 임계치
  fearThreshold: number;    // 공포 느껴 도망치는 피해 누적치 (0-1)
  rageThreshold: number;    // 분노 상태 진입 임계치 (0-1, 공격력↑, 방어↓)
}

interface DetailedAnimalProfile {
  taxonomy: {
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
    subspecies?: string;
  };
  physical: {
    massRange: { min: number; max: number; avg: number }; // kg
    bodyLength: number; // cm
    shoulderHeight: number; // cm
    sexualDimorphism: number; // 수컷/암컷 질량 비율
  };
  biomechanics: {
    // 필수 (모든 동물 필수)
    biteForce: { value: number; unit: 'N'; source: Reference; confidence: number };
    sprintSpeed: { value: number; unit: 'm/s'; source: Reference; confidence: number };
    acceleration: { value: number; unit: 'm/s²'; source: Reference; confidence: number };
    // 선택 (종별 상이)
    strikeForce?: { value: number; unit: 'N'; source: Reference; confidence: number };
    swipeForce?: { value: number; unit: 'N'; source: Reference; confidence: number };
    gripStrength?: { value: number; unit: 'N'; source: Reference; confidence: number };
    jumpHeight?: { value: number; unit: 'm'; source: Reference; confidence: number };
    jumpDistance?: { value: number; unit: 'm'; source: Reference; confidence: number };
  };
  behavior: AnimalTraits;
  ecology: {
    habitat: string[];
    diet: 'carnivore' | 'omnivore' | 'herbivore';
    activityPattern: 'diurnal' | 'nocturnal' | 'crepuscular' | 'cathemeral';
    socialStructure: 'solitary' | 'pair' | 'family' | 'pack' | 'troop' | 'herd';
    territorySize?: number; // km²
    homeRange?: number; // km²
  };
  lifeHistory: {
    lifespan: { wild: number; captivity: number }; // years
    sexualMaturity: number; // years
    gestationPeriod: number; // days
    litterSize: { min: number; max: number; avg: number };
  };
  references: Reference[];
}
```

---

## 4. 시뮬레이션 핵심 로직

### 4.1 스탯 산출 파이프라인
```
사용자 입력(신체 4개 + 이력 자연어/드롭다운 + 설정 3개)
    ↓
자연어 파싱 → {종목, 개월, 주빈도, 신뢰도}
    ↓ (confidence < 0.7 시 드롭다운으로 보정 유도)
종목별 가중치 테이블 × 신체 스펙 정규화 → CoreStats(8종)
    ↓
종목/경력 기반 보유 기술 자동 추천
    ↓
심리 상태(Mentality) 산출
    ↓
설정(statsScale)에 따라 상대적(0-100) 또는 절대값(SI) 출력
```

### 4.2 인간 체세그먼트 추정 (Zatsiorsky-Seluyanov 모델)
```typescript
// packages/core/data/body-segments.ts에 정의

interface SegmentParams {
  massPercent: number;      // 체중 대비 %
  lengthPercent: number;    // 키 대비 %
  comPosition: number;      // 근위단부터 원위단 방향 % (0~1)
  radiusGyration: number;   // 관성 반경 계수
}

// 19개 세그먼트 파라미터 (남성 기준, 여성은 보정 계수 적용) - torso 4분할 18개 + groin
const ZATSIORSKY_SEGMENTS: Record<BodyPartId, SegmentParams> = {
  head: { massPercent: 0.073, lengthPercent: 0.13, comPosition: 0.55, radiusGyration: 0.30 },
  neck: { massPercent: 0.017, lengthPercent: 0.07, comPosition: 0.50, radiusGyration: 0.40 },
  torso_front: { massPercent: 0.160, lengthPercent: 0.30, comPosition: 0.45, radiusGyration: 0.35 },
  torso_back: { massPercent: 0.160, lengthPercent: 0.30, comPosition: 0.45, radiusGyration: 0.35 },
  torso_side_l: { massPercent: 0.040, lengthPercent: 0.30, comPosition: 0.50, radiusGyration: 0.40 },
  torso_side_r: { massPercent: 0.040, lengthPercent: 0.30, comPosition: 0.50, radiusGyration: 0.40 },
  arm_upper_l: { massPercent: 0.028, lengthPercent: 0.186, comPosition: 0.577, radiusGyration: 0.322 },
  arm_lower_l: { massPercent: 0.016, lengthPercent: 0.146, comPosition: 0.457, radiusGyration: 0.303 },
  hand_l: { massPercent: 0.006, lengthPercent: 0.108, comPosition: 0.790, radiusGyration: 0.285 },
  arm_upper_r: { massPercent: 0.028, lengthPercent: 0.186, comPosition: 0.577, radiusGyration: 0.322 },
  arm_lower_r: { massPercent: 0.016, lengthPercent: 0.146, comPosition: 0.457, radiusGyration: 0.303 },
  hand_r: { massPercent: 0.006, lengthPercent: 0.108, comPosition: 0.790, radiusGyration: 0.285 },
  leg_upper_l: { massPercent: 0.100, lengthPercent: 0.245, comPosition: 0.409, radiusGyration: 0.326 },
  leg_lower_l: { massPercent: 0.047, lengthPercent: 0.147, comPosition: 0.439, radiusGyration: 0.416 },
  foot_l: { massPercent: 0.015, lengthPercent: 0.057, comPosition: 0.500, radiusGyration: 0.475 },
  leg_upper_r: { massPercent: 0.100, lengthPercent: 0.245, comPosition: 0.409, radiusGyration: 0.326 },
  leg_lower_r: { massPercent: 0.047, lengthPercent: 0.147, comPosition: 0.439, radiusGyration: 0.416 },
  foot_r: { massPercent: 0.015, lengthPercent: 0.057, comPosition: 0.500, radiusGyration: 0.475 },
  groin: { massPercent: 0.010, lengthPercent: 0.040, comPosition: 0.50, radiusGyration: 0.35 },
};
```

**자동 계산 로직**:
- 세그먼트 질량 = 체중 × massPercent
- 세그먼트 길이 = 키 × lengthPercent
- 단면적 = 질량 / (길이 × 조직밀도) 근사
- 뼈밀도 = 연령/성별/부위별 표준값 (한국인 골밀도 데이터 적용)
- 근육두께 = 골격근량 × 세그먼트별 분포계수 / 단면적
- 지방두께 = 체지방량 × 세그먼트별 분포계수 / 단면적

### 4.3 CoreStats(8종) 산출 공식 (문헌 기반 계수) — **구현체와 동기화됨**

```typescript
// packages/core/data/art-stats.ts의 deriveCoreStats() 구현체 기준

interface StatDerivationInput {
  height: number;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  age: number;
  sex: 'male' | 'female';
  parsedBackground: ParsedBackground;
}

function deriveCoreStats(input: StatDerivationInput): CoreStats {
  const { height, weight, skeletalMuscleMass, bodyFatMass, age, sex, parsedBackground } = input;
  
  const bmi = weight / (height / 100) ** 2;
  const bodyFatPercent = bodyFatMass / weight * 100;
  const leanBodyMass = weight - bodyFatMass;
  const muscleRatio = skeletalMuscleMass / weight;
  const ffmi = leanBodyMass / (height / 100) ** 2; // Fat-Free Mass Index
  
  // ===== 연령 보정 (비선형: 30대 완만, 50대 이후 급격 감소) =====
  // 출처: Faulkner et al. 2007 "Age-related muscle loss", Mitchell et al. 2012 "Sarcopenia"
  const ageFactor = (age: number) => {
    if (age < 30) return 1.0;
    if (age < 50) return Math.max(0.75, 1 - (age - 30) * 0.012);  // 30-50: 연 -1.2%
    return Math.max(0.4, 0.75 - (age - 50) * 0.025);               // 50+: 연 -2.5%
  };
  const ageAdj = ageFactor(age);
  
  // ===== 성별 보정 (부위별 차등: 상체 근력 차이 큼, 하체/지구력 차이 작음) =====
  // 출처: Miller et al. 1993 "Gender differences in strength", Janssen et al. 2000 "Muscle mass distribution"
  const sexFactor = {
    male: { 
      strength: 1.0,      // 기준
      speed: 1.0, 
      endurance: 1.0,
      agility: 1.0,
      durability: 1.0,
    },
    female: { 
      strength: 0.65,     // 상체 근력 ~65% (Miller 1993)
      speed: 0.85,        // 속도 ~85% 
      endurance: 1.1,     // 지방 산화 효율 ↑ (Tarnopolsky 2000)
      agility: 0.95,      // 민첩성 근소 차이
      durability: 0.9,    // 골밀도 낮음
    }
  }[sex];
  
  // ===== 종목 가중치 (문헌 기반 상대적 강조도) =====
  // 복싱: Piercy 2017, 무에타이: Krause 2016, BJJ: Andreato 2017
  // 레슬링: Kraemer 2004, 유도: Franchini 2011, MMA: James 2016
  const artWeight = ART_STAT_WEIGHTS[parsedBackground.primaryArt] ?? ART_STAT_WEIGHTS.mma;
  
  // ===== 수련 보정 (로그 스케일, diminishing returns) =====
  // 출처: Ericsson 1993 "Deliberate practice", Farrow 2008 "Expertise development"
  const expMonths = parsedBackground.experienceMonths;
  const expFactor = Math.min(2.5, 1 + Math.log10(Math.max(1, expMonths)) * 0.35);
  
  // ===== 빈도 보정 (주당 횟수, 과훈련 구간 반영) =====
  // 출처: Halson 2014 "Monitoring training load", Impellizzeri 2004 "Training load"
  const freq = parsedBackground.trainingFrequency;
  const freqFactor = Math.min(1.6, 0.4 + freq * 0.18);  // 주 6회 시 ~1.48, 주 7회 시 1.6 캡
  
  // ===== 기초 체력 지수 (FFMI, 체지방률 기반) =====
  // 출처: Schutz 2002 "FFMI reference", Kyle 2003 "Body composition"
  const fitnessIndex = Math.min(1.6, (ffmi / 22) * (1 - bodyFatPercent / 35) * 1.15);
  
  const base = {
    // strength: 베이스 45 × 근육비율 × 생리학계수 3.2 × 종목 × 성별 × 연령 × 수련 × 빈도 × 체력
    // 3.2: 근단면적 ∝ 근력 (Piercy 2017: 펀치 힘 ∝ CSA^1.2 → 선형 근사)
    strength: Math.round(45 * muscleRatio * 3.2 * artWeight.strength * sexFactor.strength * ageAdj * expFactor * freqFactor * fitnessIndex),
    
    // speed: 베이스 45 × (1 - 체지방률/45) × 생리학계수 2.2 × 종목 × 성별 × 연령 × 수련 × 빈도 × 체력
    // 2.2: 질량비속도 ∝ (1 - 지방률) (Nummela 2007: 스프린트 속도 ∝ 파워/체중)
    speed: Math.round(45 * (1 - bodyFatPercent / 45) * 2.2 * artWeight.speed * sexFactor.speed * ageAdj * expFactor * freqFactor * fitnessIndex),
    
    // endurance: 베이스 45 × (1 - 체지방률/55) × 생리학계수 1.8 × 종목 × 성별 × 연령 × 수련 × 빈도 × 체력
    // 1.8: VO2max ∝ (1 - 지방률) × 심박출량 (Bassett 2000)
    endurance: Math.round(45 * (1 - bodyFatPercent / 55) * 1.8 * artWeight.endurance * sexFactor.endurance * ageAdj * expFactor * freqFactor * fitnessIndex),
    
    // agility: 베이스 45 × (1 - 체중/130) × 생리학계수 1.4 × 종목 × 연령 × 수련 × 체력
    // 1.4: 민첩성 ∝ 파워/체중 × 신경근 협응 (Sheppard 2006)
    agility: Math.round(45 * (1 - weight / 130) * 1.4 * artWeight.agility * ageAdj * expFactor * fitnessIndex),
    
    // technique: 베이스 25 × 종목 × 수련 × 빈도 (체력/성별/연령 의존도 낮음)
    technique: Math.round(25 * artWeight.technique * expFactor * freqFactor),
    
    // durability: 베이스 35 × 근육비율 × 생리학계수 2.2 × 종목 × 연령 × 체력
    // 2.2: 내구도 ∝ 근육량 + 골밀도 (Kohrt 2004: 뼈 강도 ∝ 근육량)
    durability: Math.round(35 * muscleRatio * 2.2 * artWeight.durability * ageAdj * fitnessIndex),
    
    // intelligence: 베이스 25 × 종목 × 수련 (전술 이해도)
    intelligence: Math.round(25 * artWeight.intelligence * expFactor),
    
    // composure: 베이스 45 × (1 - 파싱불확실성) × 종목
    composure: Math.round(45 * (1 - (parsedBackground.confidence < 0.5 ? 0.3 : 0)) * artWeight.composure),
  };
  
  // 0-100 클램프
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  
  return {
    strength: clamp(base.strength),
    speed: clamp(base.speed),
    endurance: clamp(base.endurance),
    agility: clamp(base.agility),
    technique: clamp(base.technique),
    durability: clamp(base.durability),
    intelligence: clamp(base.intelligence),
    composure: clamp(base.composure),
  };
}
```

### 4.4 전투 엔진 (Fixed Timestep 60Hz, Best-Effort Reproducible)
```
초기화: 파이터 A/B, 컨텍스트(홈그라운드, 룰, 시드), Matter.js 2D 물리 월드
    ↓
매치업 초기화: 초기 거리(2m), 자세(orthodox/southpaw), 선공(스피드 높거나 랜덤)
    ↓
메인 루프 (16.67ms/프레임):
  1. 물리 스텝 (위치/속도/충돌, Matter.js + Constraint 조인트)
  2. AI 의사결정 (상황평가 → 후보생성 → 가치평가 → 선택 → 커밋, 습성 가중치 반영)
  3. 충돌/데미지 판정 (히트박스 ↔ 기술 궤적, 압력/에너지 → 조직 손상)
  4. 생리학 업데이트 (피로, 아드레날린, 호르몬)
  5. 심리학 업데이트 (공포, 포기/사망 판정, 홈그라운드 보너스, 분노/도주 상태)
  6. 스냅샷 기록 (리플레이용, 델타 압축 저장)
  7. 텍스트 로그 이벤트 발생 (SSE 스트리밍)
    ↓
종료 조건: KO / TKO / 항복 / 판정 / 사망(deathAllowed 시) / 시간 초과
    ↓
결과 집계: 승률(몬테카를로 N회), 부위별 피해, 피니시 타입, 타임라인
```

**재현성**: 고정 시드 + 결정론적 RNG(seedrandom) → **동일 입력/시드에서 비트 단위 재현성 목표** (Matter.js 부동소수점 연산 순서 비결정론으로 미세 차이 발생 가능, 허용 오차 ±0.001% 문서화). 완전 결정론 필요 시 별도 고정소수점 물리 엔진 고려.

### 4.5 데미지 계산 공식 (차원 일관성 보장)

```
[1] 기술 피크 힘 계산
peakForce = technique.biomechanics.peakForce.magnitude × statScaling(strength)
단위: N

[2] 압력 계산
pressure = peakForce / contactArea
단위: N/cm² → MPa (× 0.0001)

[3] 충격 에너지
energy = impulse × avgVelocity = peakForce × executionTime × 0.5 × peakVelocity
단위: J

[4] 조직 손상도 (각 조직별) — 에너지 밀도(J/m³) 기준
tissueDamage = min(1, 
    (pressure / tissue.tensileStrength) ^ pressureExponent 
  + (energy / (tissue.fractureEnergy × tissue.thickness × contactArea)) ^ energyExponent)
- pressureExponent = 1.5 (비선형)
- energyExponent = 1.2
- fractureEnergy 단위: J/m², 두께: m, 접촉면적: m² → energy / (J/m² × m × m²) = 무차원

[5] 골절 확률 (Weibull)
P_fracture = 1 - exp(-(strainEnergyDensity / η) ^ β)
- η (척도): bone.fractureEnergy / bone.thickness  (J/m³)
- β (형상): 2.5 (피질골), 1.8 (해면골)
- strainEnergyDensity = energy / (volume) ≈ energy / (contactArea × thickness)

[6] 뇌진탕 확률 (HIC 기반)
HIC = max[(t2 - t1) * ( (1/(t2-t1)) * ∫a(t)dt )^2.5] over 15ms window
   = max[ (t2-t1)^(-1.5) * (∫a(t)dt)^2.5 ]
P_concussion = 1 / (1 + exp(-(HIC - 700) / 150))

[7] 내장 파열 확률
P_rupture = 1 / (1 + exp(-(pressure - organ.criticalPressure) / (organ.criticalPressure * 0.2)))
- pressure 단위: MPa, criticalPressure 단위: MPa

[8] 총 데미지 (0-100 스케일)
totalDamage = Σ(partDamage × partWeight) × defenseMultiplier
- partWeight: 부위별 치명도 가중치 (head=3.0, neck=2.5, torso=1.0, limb=0.5)
- defenseMultiplier: 블럭/패리/회피 시 0.1~0.5
```

**내구도(Durability) 단위 통일**: 
- 인장/전단/압축 강도: **MPa** (N/mm²)
- 파괴 에너지: **J/m²** (단위 면적당 에너지)
- 두께: **mm**
- 임계 압력(장기): **MPa**

### 4.6 종료 판정
| 타입 | 조건 |
|------|------|
| KO | HIC > 1000 또는 의식상실누적 > 임계치 또는 10카운트 미기상 |
| TKO | 자력 방어 불가능 (스턴 지속 > 3s, 체력 < 20%, 자세 붕괴) |
| 서브미션 | 초크/관절기 탈출 불가 5초 지속 또는 의식 상실 |
| 판정 | 라운드 종료 시 점수 비교 (유효타, 컨트롤, 어그레션) |
| 항복 | 통증 > painTolerance × (1 + fearLevel/100) AND deathAllowed=false |
| **사망** | 뇌/심장/대동맥 파열, 출혈량 > 40%, 질식 > 4분, 경추 손상 → **즉시 종료** |
| 시간초과 | 설정된 벽시계 시간 도달 → 판정 |

### 4.7 홈그라운드 보너스
| 요소 | 효과 | 수치 |
|------|------|------|
| 관중 응원 | 멘탈/아드레날린 버프 | composure +10, adrenaline +15% |
| 지형 익숙함 | 민첩성/밸런스 버프 | agility +5, balance +10% |
| 심리적 우위 | 공포 감소, 공격성 증가 | fearLevel -20%, aggression +15% |
| 영역성 동물 | territoriality × 2배 적용 | 위 효과 × (1 + territoriality) |

### 4.8 동물 습성 → AI 가중치 매핑 (확장)

| 습성 | AI 가중치 영향 (구체적) |
|------|------------------------|
| aggression ↑ | attackWeight × (1+aggression), feintWeight × (1-aggression), counterWeight × (1-aggression*0.5) |
| territoriality ↑ | 홈그라운드 보너스 × (1+territoriality), 영역 벗어날 때 fearLevel ↑ |
| flightiness ↑ | dodgeWeight × (1+flightiness), distanceMaintainWeight ↑, cornered 시 rageThreshold ↓ |
| intelligence ↑ | comboWeight ↑, counterWeight ↑, patternLearningRate ↑, feintWeight ↑ |
| sociality ↑ | pack 동물: allyNearby 시 fearLevel ↓, cooperationWeight ↑ |
| huntingStyle | ambush→counterWeight↑, chase→pursuitWeight↑, grapple→takedownWeight↑, bite→biteWeight↑ |

**기술 풀 제한**: huntingStyle에 따라 사용 가능 기술 카테고리 필터링

---

## 5. 출력/결과 화면

### 5.1 실시간 전투 로그 (스트리밍, SSE)
```
[Round 1] 0:12 박민호 → 잽 → 침팬지 머리 적중 (데미지 12, 압력 45MPa, 에너지 18J)
[Round 1] 0:15 침팬지 → 오른손 훅 → 박민호 턱 적중 (데미지 28, 스턴 0.8s, HIC 320)
[Round 1] 0:23 박민호 → 원투 콤보 → 침팬지 안면 연타 (누적 데미지 45)
[Round 1] 0:41 침팬지 → 테이크다운 시도 → 박민호 스프롤 방어 (힘겨루기 750N vs 620N)
[Round 1] 1:05 박민호 → 길로틴 초크 → 침팬지 탈출 시도 (그라운드 컨트롤 60% vs 40%)
[Round 1] 1:18 침팬지 탈출 → 스탠딩 전환
...
[FINISH] 2:34 박민호 TKO 승 (침팬지 두부 HIC 2850, 의식상실, 자력방어불가)
```

### 5.2 결과 대시보드
- **승률** (몬테카를로 N회, 클로퍼-피어슨 95% 신뢰구간 표시)
- **피니시 타입 분포** (KO/TKO/서브미션/판정/항복/사망/시간초과)
- **종료 시간 분포** (평균/중앙값/표준편차/백분위)
- **라운드별 스코어카드**
- **타격/테이크다운/서브미션/클린치/그라운드 통계**

### 5.3 부위별 피해 2D 히트맵
- 인체/동물 전개도(SVG) + 색상 그라데이션 (6단계: none/minor/moderate/severe/critical/loss)
- 부위 클릭 시 상세: 조직별 손상도(%), 기능손실률(%), 부상 리스트, 예상 회복 시간

### 5.4 2D 리플레이어
- Canvas 2D + Matter.js 바디 렌더링
- 재생/일시정지, 배속(0.1×~3×), 시크 바
- 카메라: 팔로우 / 고정 / 분할
- 옵션: 히트박스, 힘 벡터, 피해 오버레이, 조직 손상도 표시

---

## 6. 데이터 소스 전략 (문헌 레퍼런스 필수)

| 데이터 분류 | 소스 | 활용 | 신뢰도 요구 |
|-------------|------|------|-------------|
| 격투 통계 | UFC Stats(Kaggle), BoxRec, CompuBox | 기술별 적중률, 부위별 분포, KO율, 라운드 페이스 | measured |
| 바이오메카닉스 | 논문(펀치/킥 힘·속도·궤적·관절각), CMU MoCap | 기술별 BiomechanicsData | measured |
| 손상 기준 | NHTSA HIC, AIS 2015, 의학논문(장기/뼈 내구도) | TissueDurability, OrganDurability | measured |
| 운동생리학 | 피로회복곡선, 아드레날린/코르티솔, VO2max 모델 | PhysiologySystem | measured/estimated |
| 기술 분류 | 무술 매뉴얼, 위키, 영상 메타데이터 | TechniqueTaxonomy, Requirements | inferred |
| **동물 생체/습성** | **동물행동학 논문, 국립생물자원관, 야생 관측 DB, Zoo 데이터** | **DetailedAnimalProfile 전체** | **measured/estimated/inferred + confidence** |

> 모든 데이터: **Zod 스키마로 정규화** → 버전 관리 + 신뢰도(confidence) + 출처(Reference) → **빌드타임 번들링** (`data/bundled/`)

---

## 7. 기술 스택 (확정, 최소화)

| 계층 | 선택 | 사유 |
|------|------|------|
| 모노레포 | Turborepo | 패키지 분리, 빌드 캐시 |
| 프레임워크 | Next.js (App Router) | 풀스택, 로컬 실행 최적화 |
| 언어 | TypeScript | 도메인 모델 타입 안정성 |
| 2D 물리 | Matter.js | 브라우저 네이티브, Constraint 지원 |
| 상태관리 | Zustand | 가볍고 단순 |
| 검증 | Zod | 런타임+컴파일타임 동시 검증 |
| 시각화 | Canvas 2D + SVG | 의존성 최소, 성능 |
| 결정론 RNG | seedrandom | 시드 고정 재현성 |
| 패키지 매니저 | npm | 표준 |

**제외**: TanStack Query(서버 없음), decimal.js(Matter.js와 호환 안됨), Docker(개발엔 불필요), worker(Phase 4까지 불필요), shadcn/ui(직접 구현)

---

## 8. 패키지 구조 (Turborepo, 최소)

```
fight-sim/
├── apps/
│   └── web/                    # Next.js 프론트엔드 + API 라우트
├── packages/
│   ├── core/                   # 프레임워크 독립 코어
│   │   ├── domain/             # 타입 정의
│   │   ├── parser/             # BackgroundParser
│   │   ├── physics/            # PhysicsWorld (Matter.js 래퍼)
│   │   ├── engine/             # SimulationEngine, CombatResolver, DecisionEngine
│   │   ├── physiology/         # PhysiologySystem, PsychologySystem
│   │   ├── settings/           # SettingsManager
│   │   └── data/
│   │       ├── schemas.ts      # Zod 스키마
│   │       ├── art-stats.ts    # 종목별 스탯 가중치 + CoreStats 산출
│   │       ├── anchor-values.ts # 절대값 앵커 (성인 남성 평균)
│   │       ├── body-segments.ts # Zatsiorsky 세그먼트 파라미터
│   │       ├── animal-traits.ts # 동물 프로파일 10종 + 스키마
│   │       ├── techniques/     # 기술 데이터 (JSON)
│   │       ├── opponents/      # 상대 프리셋 데이터
│   │       ├── bundled/        # 런타임 번들 (자동 생성)
│   │       └── parsers/        # 외부 데이터 파서 (빌드타임)
│   ├── ui/                     # 공통 UI 컴포넌트 (최소)
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json
└── package.json
```

---

## 9. 개발 단계 (로드맵)

### Phase 0: 기반 구축 (1주) ← **현재**
- [ ] Turborepo + Next.js + TS 초기화
- [ ] 핵심 도메인 타입 완성 (`packages/core/domain`)
- [ ] Zod 스키마 (`schemas.ts`)
- [ ] 종목별 가중치 + CoreStats 산출 (`art-stats.ts`)
- [ ] 절대값 앵커 (`anchor-values.ts`)
- [ ] 체세그먼트 파라미터 (`body-segments.ts`)
- [ ] 동물 프로파일 10종 (`animal-traits.ts`)
- [ ] Matter.js 래퍼 (`PhysicsWorld.ts`)
- [ ] BackgroundParser 골격 (`BackgroundParser.ts`)
- [ ] SettingsManager (`SettingsManager.ts`)
- [ ] 번들링 스크립트 (`build:data`)

### Phase 1: 파싱 + 스탯 산출 (1주)
- [ ] BackgroundParser 구현 (규칙+키워드, confidence 출력)
- [ ] 신체 스펙 → BodySpec 파생 계산 (Zatsiorsky 적용)
- [ ] 파싱 프리뷰 API + 수정 UX (드롭다운 병행)

### Phase 2: 코어 시뮬레이션 (2주)
- [ ] SimulationEngine (고정 타임스텝, 재현성 테스트)
- [ ] CombatResolver (데미지 공식 단위 테스트)
- [ ] DecisionEngine (휴리스틱 + 습성 가중치)
- [ ] Physiology/Psychology 시스템
- [ ] 단위 테스트: 데미지, KO/사망, 승률 수렴, 재현성

### Phase 3: 데이터 구축 (1.5주)
- [ ] UFC/복싱 통계 → 기술 DB
- [ ] 바이오메카닉스 논문 → 30개 기술 데이터
- [ ] 손상 모델 파라미터화
- [ ] 동물/몬스터 프리셋 완성
- [ ] 번들 데이터 생성

### Phase 4: API + 기본 UI (1.5주)
- [ ] `/api/simulate` (단일/배치/스트리밍)
- [ ] 입력 폼 (하이브리드: 자연어 + 드롭다운)
- [ ] 실시간 로그 뷰어
- [ ] 결과 대시보드

### Phase 5: 2D 시각화 (1.5주)
- [ ] Canvas 렌더러 + Matter.js 디버그 드로우
- [ ] DamageHeatmap2D (SVG 전개도)
- [ ] ReplayPlayer2D
- [ ] 타임라인 카드

### Phase 6: 고도화 (지속)
- [ ] MCTS AI, 콤보 시스템, 비교 뷰, 벤치마크

---

## 10. 리스크 및 대응

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| 자연어 파싱 부정확 | 높음 | 하이브리드(자연어+드롭다운), confidence<0.7 시 강제 보정 |
| 데이터 품질/부족 | 높음 | 3단계 신뢰도, 다중 소스 교차검증, "추정치" 명시 |
| 시뮬레이션 검증 어려움 | 높음 | UFC 50경기 벤치마크, 민감도 분석 |
| 2D 물리 안정성 | 중간 | 고정 타임스텝, 터널링 방지, 디버그 모드 |
| 재현성 미세 차이 | 중간 | 시드 고정, 허용 오차 문서화 |
| 그래플링 물리 복잡도 | 높음 | Constraint 파라미터 튜닝, 폴백 단순 판정 준비 |
| 동물 데이터 부족 | 높음 | 문헌값 우선, 추정값 명시, 전문가 자문 |
| 조합 폭발 | 중간 | 계층적 AI, 프루닝, 캐싱 |
| 법적/윤리 이슈 | 낮음 | 면책 조항, 의료 조언 아님, 동물 학대 방지 필터 |

---

## 11. 즉시 착수 항목 (Phase 0)

1. `packages/core/domain/types.ts` - 누락 타입 추가 (NaturalWeapon, NaturalArmor, Reference)
2. `packages/core/data/schemas.ts` - Zod 스키마 전체
3. `packages/core/data/art-stats.ts` - 종목 가중치 + CoreStats 산출 함수
4. `packages/core/data/anchor-values.ts` - 절대값 앵커 (성인 남성 평균)
5. `packages/core/data/body-segments.ts` - Zatsiorsky 파라미터
6. `packages/core/data/animal-traits.ts` - 동물 10종 프로파일 + 스키마
7. `packages/core/settings/SettingsManager.ts` - 설정 시스템 (최소)
8. `packages/core/physics/PhysicsWorld.ts` - Matter.js 래퍼 (결정론 모드)
9. `packages/core/parser/BackgroundParser.ts` - 파서 골격 (하이브리드 지원)
10. `packages/core/engine/index.ts` - 엔진 골격 (빈 클래스 + 타입)

---

## 12. 설정 시스템 (MVP 최소)

```typescript
interface UserSettings {
  statsScale: 'relative' | 'absolute';      // 기본 'relative'
  simulationCount: number;                   // 기본 200, 범위 100-2000
  timeLimit: '1min' | '5min' | '10min' | 'unlimited'; // 기본 '5min'
  version: number;                           // 현재 버전 (마이그레이션용)
}
```
- 저장: `localStorage['fight-sim:settings']` (버전 포함)
- 마이그레이션: 스키마 변경 시 자동 처리

---

## 13. 하이브리드 입력 UX 플로우

```
[입력 폼]
├── 신체 스펙 (숫자 입력, 실시간 유효성 검사)
├── 격투 이력
│   ├── 자연어 텍스트 영역 (자동 파싱, 디바운스 300ms)
│   │   └── 파싱 결과 프리뷰 표시 (종목/개월/빈도 + confidence)
│   │   └── confidence < 0.7 → 경고 배지 + "직접 선택" 버튼
│   └── 드롭다운 선택 패널 (종목/개월/빈도)
│       └── 자연어 입력과 양방향 동기화
├── 홈그라운드 (라디오)
├── 죽음을 각오함 (토글 + 확인 모달)
└── 설정 패널 (접기 가능: 스탯 스케일, 시뮬 횟수, 시간 제한)
```

---

## 14. 동물 프리셋 10종 - 상세 데이터 (문헌 기반, Phase 3에서 채움)

| 동물 | 학명 | 체중(kg) | 교합력(N) | 질주속도(m/s) | 습성 핵심 | 출처 예시 |
|------|------|----------|-----------|--------------|-----------|-----------|
| 침팬지 | Pan troglodytes | 40-60 | 5000 | 11 | grapple, aggression 0.9, intelligence 0.8 | Bauman 1926, Thorpe 2016 |
| 고릴라 | Gorilla gorilla | 135-180 | 8000 | 10 | territorial 0.8, overwhelm | Isler 2008, Taylor 2020 |
| 오랑우탄 | Pongo pygmaeus | 50-90 | 4000 | 6 | grapple, intelligence 0.9, flightiness 0.2 | Thorpe 2016 |
| 호랑이 | Panthera tigris | 180-220 | 10000 | 18 | ambush, bite 0.9, strikeForce 12000N | Christiansen 2007 |
| 사자 | Panthera leo | 150-200 | 6500 | 15 | pack, suffocation, territorial 0.9 | Van Orsdol 1981 |
| 불곰 | Ursus arctos | 200-350 | 9000 | 12 | grapple, crushing, swipeForce 15000N | Swenson 2007 |
| 그리즐리 | U. a. horribilis | 180-270 | 9500 | 14 | aggression 0.9, territorial 0.8 | Herrero 2002 |
| 늑대 | Canis lupus | 30-50 | 2000 | 16 | pack, chase, exsanguination | Mech 1970 |
| 멧돼지 | Sus scrofa | 80-120 | 3000 | 10 | charge, thick_skin armor, tusk piercing | Keuling 2018 |
| 인간(비훈련) | H. sapiens | 60-80 | 1200 | 8 | fear 0.8, flightiness 0.7 | N/A |

---

## 15. 테스트 전략 (Phase 0부터)

| 레벨 | 대상 | 도구 | 기준 |
|------|------|------|------|
| 단위 | 데미지 공식, 스탯 산출, 파싱, 세그먼트 계산 | Vitest | 100% 커버리지, 스냅샷 테스트 |
| 단위 | CombatResolver (KO/사망/골절 확률) | Vitest | Monte Carlo 1000회로 통계적 검증 |
| 통합 | SimulationEngine (결정론 재현) | Vitest | 동일 시드 10회 실행 → 비트 단위 동일 |
| 통합 | Monte Carlo 승률 수렴성 | Vitest | N=100→200→500→1000 수렴 확인 |
| E2E | 전체 시뮬레이션 플로우 | Playwright | 핵심 시나리오 5개 통과 |

---

*문서 버전: 1.5 | 최종 수정: 2026-09-18 | 작성자: wolfool*