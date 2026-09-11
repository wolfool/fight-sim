# Fight Simulator - 기획안 (v1.1)

## 1. 프로젝트 개요

### 1.1 핵심 컨셉
**"내 몸으로 싸우면 얼마나 이길까?"** — 사용자 신체 스펙과 격투 이력을 입력하면, 상대(사람/동물/몬스터)와의 전투를 시뮬레이션해 승률, 피해 부위, 전투 과정을 텍스트/시각적으로 보여주는 웹 서비스.

### 1.2 차별화 포인트
- **실제 바이오메카닉스 데이터 기반**: 논문/경기 통계에서 추출한 펀치/킥 힘·속도·궤적 사용
- **해부학적 손상 모델**: 피부·근육·뼈·신경·혈관·장기별 내구도와 압력/에너지 기반 손상 계산
- **완전 자동 시뮬레이션**: 전투 중 사용자 개입 없음. AI가 전술 판단 → 텍스트 로그로 재현
- **자연어 입력 파싱**: "복싱 6개월, 하루 2끼" → 종목·경력·빈도 자동 추출 → 스탯/기술 매핑
- **로컬 퍼스트**: Docker/Node 한 방 실행, 외부 의존성 없음, 완전 오프라인 동작
- **이중 스케일 지원**: 상대적(0-100) ↔ 절대값(SI 단위) 설정 토글로 즉시 전환
- **물리 기반 그래플링**: Matter.js Constraint로 잡기/눕히기/꺾기 실제 힘겨루기 시뮬
- **동물 습성 반영**: 공격성/영역성/도주성/지능/사회성/사냥방식으로 AI 성향 차별화

---

## 2. 사용자 입력 (최소 7개 + 설정 2개)

| 입력 항목 | 타입 | 필수 | 비고 |
|-----------|------|------|------|
| 키 | number (cm) | ✅ | |
| 몸무게 | number (kg) | ✅ | |
| 골격근량 | number (kg) | ✅ | 인바디 등에서 확인 가능 |
| 체지방량 | number (kg) | ✅ | 인바디 등에서 확인 가능 |
| 격투 이력 | string (자연어) | ✅ | 예: "복싱 6개월, 주 3회, 아마추어 2전 1승 1패" |
| 홈그라운드 | select | ✅ | 나 / 상대 / 중립 |
| 죽음을 각오함 | boolean | ✅ | true = 항복 불가, 사망 시 즉시 종료 |
| 스탯 스케일 | select | ⚙️ 설정 | 상대적(0-100) / 절대값(N, m/s, J) |
| 시뮬레이션 횟수 | number | ⚙️ 설정 | 100~2000 (슬라이더, 기본 200) |

> **파생 자동 계산**: BMI, 체지방률, 제지방량, 신체 세그먼트별 질량/단면적, 내구도 프로파일

---

## 3. 상대(오퍼넌트) 프리셋

### 3.1 인간 티어
- 일반인 (비훈련)
- 아마추어 복싱/무에타이/주짓수/레슬링/MMA (각 6개월/1년/3년/5년)
- 프로 선수 (체급별)

### 3.2 동물/몬스터
- 침팬지, 고릴라, 오랑우탄
- 호랑이, 사자, 곰 (불곰/그리즐리)
- 늑대, 멧돼지
- 가상 몬스터 (설정 가능한 스탯)

> 각 프리셋은 **신체 스펙 + 보유 기술 + AI 성향(습성 기반) + 스탯 표현 방식(상대/절대)** 정의

### 3.3 동물 습성/특징 모델 (AnimalTraits)
```typescript
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
  naturalWeapons: NaturalWeapon[];  // 이빨, 발톱, 뿔, 체중 등
  armor: NaturalArmor[];            // 두꺼운 가죽, 뼈 돌기, 지방층 등
  
  // 심리 임계치
  fearThreshold: number;    // 공포 느껴 도망치는 피해 누적치
  rageThreshold: number;    // 분노 상태 진입 임계치 (공격력↑, 방어↓)
}
```

**데이터 소스**: 동물행동학 논문, 국립생물자원관 DB, 내셔널지오그래픽/BBC 다큐 메타데이터, 야생 관측 기록

---

## 4. 시뮬레이션 핵심 로직

### 4.1 스탯 산출 파이프라인
```
사용자 입력(신체 5개 + 이력 자연어)
    ↓
자연어 파싱 → {종목, 개월, 주빈도, 식단, 전적, 신뢰도}
    ↓
종목별 가중치 테이블 × 신체 스펙 정규화 → CoreStats(8종)
    ↓
종목/경력 기반 보유 기술 자동 추천
    ↓
심리 상태(Mentality) 산출: killIntent, fearLevel, aggression, painTolerance, surrenderThreshold
    ↓
설정(statsScale)에 따라 상대적(0-100) 또는 절대값(SI) 출력
```

### 4.2 전투 엔진 (Fixed Timestep 60Hz, 결정론적)
```
초기화: 파이터 A/B, 컨텍스트(홈그라운드, 룰, 시드), Matter.js 2D 물리 월드
    ↓
메인 루프 (16.67ms/프레임, 고정 소수점 연산으로 결정론 보장):
  1. 물리 스텝 (위치/속도/충돌, Matter.js + Constraint 조인트)
  2. AI 의사결정 (상황평가 → 후보생성 → 가치평가 → 선택 → 커밋, 습성 가중치 반영)
  3. 충돌/데미지 판정 (히트박스 ↔ 기술 궤적, 압력/에너지 → 조직 손상)
  4. 생리학 업데이트 (피로, 아드레날린, 호르몬)
  5. 심리학 업데이트 (공포, 포기/사망 판정, 홈그라운드 보너스, 분노/도주 상태)
  6. 스냅샷 기록 (리플레이용, 압축 저장)
  7. 텍스트 로그 이벤트 발생 (SSE 스트리밍)
    ↓
종료 조건: KO / TKO / 항복 / 판정 / 사망(deathAllowed 시)
    ↓
결과 집계: 승률(몬테카를로 N회), 부위별 피해, 피니시 타입, 타임라인
```

**결정론 전략**: 고정 시드 + 고정 소수점 라이브러리(decimal.js) + Matter.js 내부 연산 순서 고정 → 동일 시드에서 비트 단위 재현 가능

### 4.3 데미지 계산 공식 (요약)
- **기본 데미지** = (공격자 피크힘 × 기술 계수 × 스탯 스케일링) ÷ (수비자 내구도 × 방어 계수)
- **압력** = 힘 ÷ 접촉면적 (MPa)
- **조직 손상도** = f(압력, 인장강도, 두께, 충격지속시간) — 구체 수식 Phase 2에서 확정
- **골절 확률** = Weibull 분포 기반
- **뇌진탕 확률** = HIC(Head Injury Criterion) 기반
- **내장 파열** = 에너지 > 임계치 시 확률적 발생

**절대값 스케일 앵커 포인트 (인간 기준 100 = ?)**
| 스탯 | 절대값 앵커 | 비고 |
|------|-------------|------|
| strength | 펀치 피크힘 3000N | 프로 헤비급 수준 |
| speed | 펀치 피크속도 12m/s | 동일 |
| endurance | VO2max 65 ml/kg/min | 엘리트 지구력 |
| durability | 두부 HIC 임계치 1000 | KO 50% 확률 |

→ 동물/몬스터는 문헌 실측값 → 인간 앵커 대비 배율로 환산

### 4.4 종료 판정
| 타입 | 조건 |
|------|------|
| KO | 두부 가속도 임계치 초과, 의식 상실 누적, 10카운트 미기상 |
| TKO | 심판 판단: 자력 방어 불가능 |
| 서브미션 | 초크/관절기 탈출 불가 지속 |
| 판정 | 라운드 종료 시 점수 비교 |
| 항복 | 통증 > 임계치, 기능손실 임계치, 심리적 포기 (deathAllowed=false만) |
| **사망** | 중요장기 파열, 과다출혈(40%+), 질식 4-6분, 경추손상 → **즉시 종료** |

### 4.5 홈그라운드 보너스
- 관중 응원 → 멘탈/아드레날린 버프 (+10~20%)
- 지형 익숙함 → 민첩성/밸런스 버프 (+5~15%)
- 심리적 우위 → 공포 감소(-20%), 공격성 증가(+15%)
- (옵션) 심판 편파 → 근소 판정 시 유리

### 4.6 동물 습성 → AI 가중치 매핑
| 습성 | AI 가중치 영향 |
|------|----------------|
| aggression ↑ | 공격 빈도↑, 선제공격↑, 카운터↓, 피니시 지향↑ |
| territoriality ↑ | 홈그라운드 보너스 2배, 영역 벗어날 때 패널티 |
| flightiness ↑ | 회피/거리유지↑, 코너링 시 도주 시도↑, 근접 기피 |
| intelligence ↑ | 페이크/카운터↑, 콤보 다양성↑, 상대 패턴 학습↑ |
| sociality ↑ | 도움 요청(무리 동물), 협동 공격, 위협 시 위축↓ |
| huntingStyle | 선호 기술 풀 제한 (ambush→카운터, chase→추격타격, grapple→테이크다운/초크) |

---

## 5. 출력/결과 화면

### 5.1 실시간 전투 로그 (스트리밍, SSE)
```
[Round 1] 0:12 박민호 → 잽 → 원숭이 머리 적중 (데미지 12, 압력 45MPa)
[Round 1] 0:15 원숭이 → 오른손 훅 → 박민호 턱 적중 (데미지 28, 스턴 0.8s)
[Round 1] 0:23 박민호 → 원투 콤보 → 원숭이 안면 연타 (누적 데미지 45)
[Round 1] 0:41 원숭이 → 테이크다운 시도 → 박민호 스프롤 방어
[Round 1] 1:05 박민호 → 길로틴 초크 → 원숭이 탭아웃 시도 실패
[Round 1] 1:18 원숭이 탈출 → 스탠딩 전환
...
[FINISH] 2:34 박민호 KO 승 (원숭이 두부 HIC 2850, 의식상실)
```

### 5.2 결과 대시보드
- **승률** (몬테카를로 N회, 신뢰구간 ±X% 표시)
- **피니시 타입** / **종료 시간** (평균/중앙값/분포)
- **라운드별 스코어카드**
- **타격/테이크다운/서브미션/클린치/그라운드 통계**

### 5.3 부위별 피해 2D 히트맵
- 인체 전개도(SVG) + 색상 그라데이션 (없음 → 미세 → 경상 → 중상 → 치명 → 기능상실)
- 부위 클릭 시 상세: 조직별 손상도, 기능손실률, 부상 리스트

### 5.4 2D 리플레이어
- Canvas + Matter.js 바디 렌더링
- 재생/일시정지, 배속(0.1×~3×), 시크
- 카메라: 팔로우 / 고정 / 분할
- 옵션: 히트박스 표시, 힘 벡터 표시, 피해 오버레이

---

## 6. 데이터 소스 전략

| 데이터 분류 | 소스 | 활용 |
|-------------|------|------|
| 격투 통계 | UFC Stats(Kaggle), BoxRec, CompuBox | 기술별 적중률, 부위별 분포, KO율, 라운드 페이스 |
| 바이오메카닉스 | 논문(펀치/킥 힘·속도·궤적·관절각), 오픈 모션캡처(CMU) | 기술별 BiomechanicsData |
| 손상 기준 | NHTSA HIC, AIS, 의학논문(장기/뼈 내구도) | TissueDurability, OrganDurability 파라미터 |
| 운동생리학 | 피로회복곡선, 아드레날린/코르티솔, VO2max 모델 | PhysiologySystem |
| 기술 분류 | 무술 매뉴얼, 위키, 영상 메타데이터 | TechniqueTaxonomy, Requirements |
| **동물 습성/생체** | **동물행동학 논문, 국립생물자원관, 야생 관측 DB** | **AnimalTraits, NaturalWeapon, NaturalArmor** |

> 모든 데이터는 **Zod 스키마로 정규화** → 버전 관리 + 신뢰도(confidence) 부여 → **빌드타임 번들링** (`data/bundled/`)

---

## 7. 기술 스택 (결정 사항)

| 계층 | 선택 | 사유 |
|------|------|------|
| 모노레포 | Turborepo | 패키지 분리(core/web), 빌드 캐시 |
| 프레임워크 | Next.js (App Router) | 풀스택, SSR, **로컬 실행 최적화** |
| 언어 | TypeScript | 도메인 모델 타입 안정성 필수 |
| 2D 물리 | Matter.js | 브라우저 네이티브, 가볍고 검증됨, Constraint 지원 |
| 상태관리 | Zustand + TanStack Query | 가볍고 서버상태 관리 좋음 |
| 검증 | Zod | 런타임+컴파일타임 동시 검증 |
| 시각화 | Canvas 2D (자체 렌더러) + SVG(히트맵) | 의존성 최소, 성능 좋음 |
| 고정소수점 | decimal.js | 결정론적 연산 보장 |
| 실행 환경 | **로컬 전용 (Docker Compose / npm run dev)** | 외부 배포 없음, 완전 오프라인 |

---

## 8. 패키지 구조 (Turborepo)

```
fight-sim/
├── apps/
│   └── web/                    # Next.js 프론트엔드 + API 라우트
├── packages/
│   ├── core/                   # 프레임워크 독립 코어 로직
│   │   ├── domain/             # 타입 정의 (Fighter, Technique, Context 등)
│   │   ├── parser/             # BackgroundParser (자연어 → 구조화)
│   │   ├── physics/            # PhysicsWorld (Matter.js 래퍼, 결정론 보장)
│   │   ├── engine/             # SimulationEngine, CombatResolver, DecisionEngine
│   │   ├── physiology/         # PhysiologySystem, PsychologySystem
│   │   ├── settings/           # SettingsManager, 스케일 변환, 영구 저장
│   │   └── data/
│   │       ├── schemas.ts      # Zod 스키마
│   │       ├── art-stats.ts    # 종목별 스탯 가중치 테이블
│   │       ├── animal-traits.ts # 동물 습성/특징 데이터
│   │       ├── techniques/     # 기술 데이터 (JSON/CSV)
│   │       ├── opponents/      # 상대 프리셋 데이터
│   │       ├── bundled/        # 런타임 번들 데이터 (기술/상대/손상모델/동물)
│   │       └── parsers/        # 외부 데이터 파서 (빌드타임용)
│   ├── ui/                     # 공통 UI 컴포넌트 (shadcn/ui 기반)
│   ├── eslint-config/          # 공통 ESLint 설정
│   └── typescript-config/      # 공통 TS 설정
├── turbo.json
├── package.json
├── docker-compose.yml          # 로컬 원클릭 실행 (web + worker 선택)
└── Dockerfile                  # 프로덕션 빌드용
```

---

## 9. 개발 단계 (로드맵)

### Phase 0: 기반 구축 (1.5주)
- Turborepo + Next.js + TS 초기화
- 핵심 도메인 타입 작성 (`packages/core/domain`)
- Zod 스키마 정의 (`packages/core/data/schemas.ts`)
- Matter.js 물리 월드 래퍼 (`packages/core/physics`, 결정론 모드)
- 종목별 스탯 가중치 테이블 (`packages/core/data/art-stats.ts`)
- **설정 시스템** (`packages/core/settings/`: 스케일 변환, 저장)
- **데이터 번들링 파이프라인** (빌드타임 JSON 임베드)
- **동물 습성 데이터 모델/프리셋** (`packages/core/data/animal-traits.ts`)

### Phase 1: 파싱 + 스탯 산출 (1주)
- `BackgroundParser` 구현 (규칙 기반 키워드 매칭, confidence 출력)
- 신체 스펙 → BodySpec 파생 계산 (BMI, 세그먼트 추정: Zatsiorsky 모델)
- 파싱 프리뷰 API (`/api/fighters/parse`) + 수정 UX

### Phase 2: 코어 시뮬레이션 (3주)
- `SimulationEngine` 고정 타임스텝 루프 (결정론 검증 테스트 포함)
- `CombatResolver` 충돌/데미지/KO/사망 판정 (데미지 공식 단위 테스트)
- `DecisionEngine` 휴리스틱 AI (습성 가중치 반영, 룰 기반 → MCTS 확장)
- `PhysiologySystem`, `PsychologySystem` (홈그라운드, 분노/도주 상태)
- 단위 테스트: 데미지 공식, KO/사망 판정, 승률 수렴성, 결정론 재현성

### Phase 3: 데이터 구축 (2주)
- UFC/복싱 통계 파싱 → 기술 통계 DB
- 바이오메카닉스 논문 데이터 정규화 (최소 30개 기술)
- 인체 손상 모델 파라미터화 (문헌 값)
- **동물/몬스터 프리셋 작성** (습성 + 자연무기/방어구 + 스탯)
- 번들 데이터 생성 스크립트 (`npm run build:data`)

### Phase 4: API + 기본 UI (2주)
- `/api/simulate` (단일/배치/스트리밍 SSE)
- 입력 폼 (원페이지, 유효성 검사, 파싱 프리뷰, 설정 패널)
- 실시간 로그 뷰어 (자동 스크롤, 하이라이트, 필터)
- 결과 대시보드 (승률, 통계, 피니시 타입, 신뢰구간)

### Phase 5: 2D 시각화 (2주)
- Canvas 2D 렌더러 + Matter.js 디버그 드로우
- `DamageHeatmap2D` - SVG 인체 전개도 + 히트맵 (동물도 지원)
- `ReplayPlayer2D` - 스냅샷 재생, 속도 조절, 카메라, 피해 오버레이
- 타임라인 카드 (라운드별 주요 이벤트)

### Phase 6: 고도화 (지속)
- MCTS 기반 AI 강화
- 콤보/연계 기술 시스템
- 멀티시뮬레이션 비교 뷰
- 벤치마크: 실제 경기 데이터와 예측 비교 (UFC 50경기)

---

## 10. 리스크 및 대응

| 리스크 | 영향도 | 대응 |
|--------|--------|------|
| 자연어 파싱 부정확 | 높음 | 규칙+키워드 우선, 프리뷰로 사용자 확인/수정 가능 |
| 데이터 품질/부족 | 높음 | 다중 소스 교차 검증, 합성 데이터 보강, 신뢰도 가중치 |
| 시뮬레이션 검증 어려움 | 높음 | 실제 경기 영상 비교, 전문가 리뷰, 민감도 분석 |
| 2D 물리 안정성 | 중간 | Matter.js 검증 엔진, 고정 타임스텝, 터널링 방지 |
| 결정론 깨짐 | 중간 | decimal.js + 시드 고정 + 연산 순서 고정, CI에서 재현 테스트 |
| 그래플링 물리 복잡도 | 높음 | Constraint 기반 구현, 디버그 모드로 검증, 폴백(단순 판정) 준비 |
| 동물 데이터 부족 | 높음 | 문헌값 + 전문가 자문 + 합리적 보간, "추정치" 명시 |
| 조합 폭발 (기술×상황) | 중간 | 계층적 AI, 프루닝, 캐싱 |
| 로컬 실행 용량 | 낮음 | 번들 데이터 압축(gzip), 지연 로딩 |
| 법적/윤리 이슈 | 낮음 | 면책 조항, 의료 조언 아님 명시, 동물 학대 방지 필터 |

---

## 11. 즉시 착수 항목 (이번 주)

1. 레포 초기화 완료 ✅ (GitHub: https://github.com/wolfool/fight-sim)
2. `packages/core/domain/` 타입 정의 작성 중
3. `packages/core/data/schemas.ts` Zod 스키마
4. `packages/core/parser/BackgroundParser.ts` 골격
5. `packages/core/data/art-stats.ts` 종목별 가중치 테이블 (논문 레퍼런스 첨부)
6. `packages/core/physics/PhysicsWorld.ts` Matter.js 래퍼 (결정론 모드)
7. `packages/core/settings/SettingsManager.ts` 설정 시스템
8. `packages/core/data/animal-traits.ts` 동물 습성 모델 + 프리셋 10종
9. `docker-compose.yml` / `Dockerfile` 로컬 실행 환경

---

## 12. 설정 시스템 상세 (신규)

### 12.1 UserSettings 인터페이스
```typescript
interface UserSettings {
  statsScale: 'relative' | 'absolute';  // 기본 'relative'
  simulationCount: number;               // 기본 200, 범위 100-2000
  grapplingMode: 'physics';              // 향후 'simple' 추가 예정
  logDetailLevel: 'minimal' | 'standard' | 'verbose';  // 기본 'standard'
  replayQuality: 'low' | 'medium' | 'high';  // 스냅샷 압축률, 기본 'medium'
  theme: 'light' | 'dark' | 'system';    // 기본 'system'
  language: 'ko' | 'en';                 // 기본 'ko'
  units: 'metric' | 'imperial';          // 기본 'metric'
}
```

### 12.2 스케일 변환 공식
- **상대 → 절대**: `absolute = relative / 100 * ANCHOR_VALUE[stat]`
- **절대 → 상대**: `relative = absolute / ANCHOR_VALUE[stat] * 100` (clamp 0-200)
- 앵커 값은 `packages/core/data/anchor-values.ts`에서 관리

### 12.3 영구 저장
- `localStorage` 키: `fight-sim:settings`
- 마이그레이션: 버전 필드 포함, 스키마 변경 시 자동 마이그레이션

---

## 13. 로컬 실행 아키텍처 (신규)

### 13.1 docker-compose.yml 구조
```yaml
services:
  web:
    build: .
    ports: ["3000:3000"]
    volumes: ["./data:/app/data"]  # 번들 데이터 마운트
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
  # worker:  # 몬테카를로 병렬 처리가 필요할 때 활성화
  #   build: .
  #   command: npm run worker
  #   deploy:
  #     replicas: 4
```

### 13.2 실행 명령어
```bash
# 개발 모드 (핫 리로드)
npm run dev

# 프로덕션 빌드 + 실행
docker compose up --build

# 데이터 번들 재생성
npm run build:data
```

### 13.3 데이터 번들링 전략
- 빌드타임에 `packages/core/data/techniques/`, `opponents/`, `injury-models/` 읽어서
- `packages/core/data/bundled/` 에 단일 JSON.gz로 압축 저장
- 런타임엔 `import bundledData from 'core/data/bundled'` 로 즉시 사용
- 외부 네트워크 호출 **완전 없음**

---

## 14. 그래플링 물리 설계 (신규)

### 14.1 Matter.js Constraint 기반 조인트 시스템
- **그랩 생성**: 공격자 손/팔 바디 ↔ 수비자 몸통/사지 바디 간 `Constraint.create({ stiffness: 0.8, damping: 0.1 })`
- **힘겨루기**: 매 프레임 양측 `strength` 스탯 비율로 `constraint.force` 조정
- **테이크다운**: 그랩 상태에서 중심이동 + 임펄스 적용 → 수비자 밸런스 붕괴 → 그라운드 전이
- **그라운드 컨트롤**: 마운트/가드/백컨트롤 각각 별도 Constraint 토폴로지
- **탈출/스윕**: 수비자 `strength + technique` vs 공격자 `control` 판정 → Constraint 해제/역전

### 14.2 그라운드 상태 머신
```
STANDING
  ├── CLINCH (그랩 성립)
  │     ├── TAKEDOWN_SUCCESS → GROUND_TOP (가드/하프/사이드/마운트/백)
  │     └── TAKEDOWN_DEFENDED → STANDING
  └── STRIKE_EXCHANGE

GROUND_TOP (공격자 위)
  ├── POSTURE_UP → STRIKE_GROUND
  ├── PASS_GUARD → 진전 (가드→하프→사이드→마운트→백)
  ├── SUBMISSION_ATTEMPT → 초크/관절기
  └── ESCAPED → STANDING

GROUND_BOTTOM (수비자 아래)
  ├── DEFEND_STRIKES
  ├── SWEEP_ATTEMPT → GROUND_TOP (역전)
  ├── SUBMISSION_DEFENSE
  ├── STAND_UP → STANDING
  └── GIVE_UP (항복/사망)
```

### 14.3 허용 액션 테이블 (상태별)
| 상태 | 허용 공격 | 허용 방어 | 허용 이동 | 특수 |
|------|-----------|-----------|-----------|------|
| STANDING | 모든 타격, 테이크다운, 클린치 | 블럭, 패리, 회피, 스프롤 | 전진/후퇴/측방 | 페인트 |
| CLINCH | 니, 엘보, 더티복싱, 던지기 | 프레임, 언더훅, 휘감기 | 제한적 체위 변경 | 테이크다운 |
| GROUND_TOP | 그라운드 앤 파운드, 초크, 관절기, 패스 | 자세 유지, 베이스 | 포지션 진전 | 마운트/백 컨트롤 |
| GROUND_BOTTOM | 가드 회복, 스윕, 서브미션(역), 업킥 | 블럭, 프레임, 훅 탈출 | 힙 이스케이프, 스탠드업 | 길로틴/트라이앵글 카운터 |

---

## 15. 참고: 핵심 사용자 시나리오

> **입력**: 키 178, 몸무게 75, 골격근 32, 체지방 12, "복싱 6개월 주 3회", 홈그라운드: 나, 죽음을 각오함: 끔, 스탯 스케일: 상대적, 시뮬 횟수: 200
>
> **상대**: 침팬지 (수컷, 성체, 50kg, 습성: aggression 0.9, territoriality 0.7, flightiness 0.3, intelligence 0.8, sociality 0.6, huntingStyle: grapple, killMethod: overwhelm)
>
> **실행**: 시뮬레이션 200회 몬테카를로 (약 10초)
>
> **출력**:
> - 승률: 사용자 12% / 침팬지 88% / 무승부 0% (신뢰구간 ±7%)
> - 평균 종료: 43초, 피니시: TKO (사용자 8%, 침팬지 92%)
> - 주요 피해: 사용자 머리(치명), 우측 팔(중상) / 침팬지 안면(경상)
> - 전투 로그: 23개 이벤트 텍스트 스트림
> - 리플레이: 2D 재생 가능 (그랩/테이크다운/그라운드 컨트롤 시각화)
> - 스탯 스케일 토글 시: 사용자 펀치힘 2400N / 침팬지 물어뜯기 4500N 표시

---

## 16. 동물 프리셋 예시 (초기 10종)

| 동물 | 체중 | 습성 핵심 | 자연무기 | 예상 난이도 |
|------|------|-----------|----------|-------------|
| 침팬지 | 50kg | 공격적, 그래플링, 지능 높음 | 이빨(물기 5000N), 완력 1.5배 인간 | ★★★★☆ |
| 고릴라 | 160kg | 영역적, 압도적 힘, 온순함 | 이빨, 체중 찍기, 팔힘 4배 인간 | ★★★★★ |
| 호랑이 | 200kg | 매복, 폭발적 속도, 단독 | 이빨(교합력 7000N), 발톱, 체중 | ★★★★★ |
| 사자 | 190kg | 무리, 영역적, 목 물기 | 이빨, 발톱, 체중 | ★★★★★ |
| 불곰 | 300kg | 방어적, 일어서기, 압도적 힘 | 발톱(할퀴기), 이빨, 체중 찍기 | ★★★★★ |
| 그리즐리 | 270kg | 공격적, 영역적, 지구력 | 발톱, 이빨, 체중 | ★★★★★ |
| 오랑우탄 | 80kg | 신중, 나무타기, 완력 | 손아귀 힘 3000N, 이빨 | ★★★★☆ |
| 늑대 | 40kg | 무리, 추적, 물고 늘어지기 | 이빨(교합력 2000N) | ★★★☆☆ |
| 멧돼지 | 100kg | 돌진, 두꺼운 피하조직, 이빨 | 엄니(돌진 관통), 지방층 방어 | ★★★★☆ |
| 인간(비훈련) | 70kg | 낮음, 공포 높음 | 없음 | ★☆☆☆☆ |

---

*문서 버전: 1.1 | 최종 수정: 2026-09-11 | 작성자: wolfool*