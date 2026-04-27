# 문자 나라 티켓박스 · React 서비스 기획문서

> **Claude Code 착수용 기술기획서 (Frontend Spec)**
> 국립세계문자박물관 수요과제 · 인천 콘텐츠 실증 제작지원 사업
> **v1.1** · 2026-04-23
>
> **v1.1 주요 변경**: S3(문자 선택) 인터랙션 모델을 "3가지 문자 일괄 선택"에서 **"이름 각 음절마다 한 문자씩 골라 조립"**으로 전환. 연쇄적으로 §6 상태관리(`picked`/`syllables`), §7 데이터 모델(`SyllableChoice`), §8.2 (4)/(5) API 계약, S5 디지털 티켓 표시 구조 업데이트. 상세 레이아웃은 『문자나라_티켓박스_화면레이아웃_설계서.md』 v1.1 참조.

---

## 0. TL;DR (문서 읽는 법)

이 문서는 Claude Code가 바로 React 프로젝트를 스캐폴딩하고 구현에 들어갈 수 있도록, 화면/컴포넌트/상태/API 계약까지 모두 명시한 **프론트엔드 기술기획서**입니다.

| 구분 | 내용 |
|---|---|
| **산출물 목표** | 어린이(4~8세) 대상 키오스크형 React 웹앱 — 체험 3분 내외 |
| **구현 범위** | AI 매표소 인터랙션 → 문자 선택 → 캐릭터 생성 → 화면 티켓 표시 |
| **기술 스택** | React 18 + TypeScript + Vite + Zustand + React Router + Framer Motion |
| **AI 연동(외부 API)** | LLM 대화, STT, TTS, DALL·E/Stable Diffusion 이미지 생성 |
| **출력 방식** | 실물 출력 없이 **화면상 디지털 티켓**으로 표시 (Phase 1 기준) |
| **대상 해상도** | 1080×1920 세로형 터치 키오스크 기본 / 태블릿 1280×800 대응 |

읽는 순서 권장: **1 → 3 → 5 → 7 → 13**. 나머지는 참조용.

---

## 1. 프로젝트 개요

### 1.1 서비스 정의

`문자 나라 티켓박스`는 국립세계문자박물관 어린이 관람객이 **AI 매표원과 대화**하며 자신의 이름을 세계 여러 문자로 변환해 보고, 선택한 3가지 문자를 조합해 **AI가 생성한 개인 맞춤 캐릭터가 담긴 디지털 입장권**을 받는 인터랙티브 체험 콘텐츠입니다.

### 1.2 핵심 가치 (Value Proposition)

| 관점 | 가치 |
|---|---|
| 어린이 | "내 이름이 이집트 상형문자로 어떻게 보일까?" — 놀이로 배우는 세계 문자 |
| 보호자 | 박물관 체험을 **손에 쥘 수 있는 기념품**으로 전환 |
| 박물관 | 반응 데이터 축적 → 전시 개선 근거 + 디지털 콘텐츠 글로벌 확장 자산 |

### 1.3 제약조건 (Constraints)

- 체험 시간: **1인 체험 3분 내외** (후속 관람객 대기 고려)
- 입력 장애 허용: 4~8세 발음 부정확 → STT 오인식 대응 필수
- 저조도·박물관 주변 소음 환경에서 동작
- 실증 3개월 동안 **주 6일, 일 6회 이상 운영** → 무중단·자동복구

### 1.4 성공 지표 (KPI)

| 범주 | 지표 | 최소 달성 기준 |
|---|---|---|
| 콘텐츠 | AI 반응형 학습 모듈 | 1종 이상 구현 (본 과제 = 1종) |
| 기능 | 음성/터치 반응 인식 | 둘 다 구현 |
| 분기 | 콘텐츠 분기 구조 | 난이도 3단계 × 문자 선택 3종 |
| 데이터 | 사용자 로그 항목 | 5개 이상 수집 |
| 시각화 | 캐릭터/시각 요소 | 5종 이상 생성 패턴 |
| 다국어 | 다국어 확장 구조 | KR/EN/JP/CN 스위치 가능한 i18n 구조 |
| 플랫폼 | 디바이스 대응 | 키오스크 + 태블릿 반응형 |

---

## 2. 사용자 페르소나 & 여정 맵

### 2.1 1차 페르소나 — 7세 지안이

- "만화 캐릭터 이름 외우는 게 특기." 글자를 읽기 시작함.
- 터치스크린은 익숙, 음성인식은 엄마 폰으로 경험.
- **기대**: 내 이름이 특별하게 보이는 재미 / 뽑기·조합의 서프라이즈.
- **불안**: 대답을 못 하면 어쩌지? → **3초 이상 무응답 시 AI가 자연스럽게 대체 질문**.

### 2.2 2차 페르소나 — 보호자

- 체험을 **기록·공유**하고 싶음 → 디지털 티켓에 QR로 원본 이미지 다운로드 링크 제공.

### 2.3 여정 맵 (요약)

| 단계 | 감정 | 행동 | 터치포인트 | UX 목표 |
|---|---|---|---|---|
| 접근 | 호기심 | 키오스크 앞 멈춤 | Attract 화면 | 3초 안에 "재미있겠다" 유발 |
| 진입 | 수줍음·망설임 | AI 인사 듣기 | AI 캐릭터 인트로 | 이름만 말하면 됨을 명확히 |
| 선택 | 몰입 | 문자 카드 3개 터치 | 문자 선택 화면 | 탐색의 재미, 비교 가능 |
| 기대 | 설렘 | 생성 로딩 관람 | 캐릭터 생성 로딩 | 대기시간을 **연출**로 |
| 수령 | 성취감·자랑 | 티켓 확인, QR 촬영 | 디지털 티켓 화면 | 공유 동선 자연스럽게 |

---

## 3. 화면 플로우 (Screen Flow)

### 3.1 전체 상태 다이어그램

```
[S0 Attract/Idle]
      │ touch / 근접센서
      ▼
[S1 AI 인트로 + 언어 선택]
      │ CTA: "시작하기"
      ▼
[S2 이름 입력 (음성+보조 키보드)]
      │ 이름 확정
      ▼
[S3 문자 선택 — 3종 중 선택]
      │ 선택 완료
      ▼
[S4 캐릭터 생성 중 (AI 이미지 생성 로딩)]
      │ 이미지 응답 수신
      ▼
[S5 디지털 티켓 (캐릭터 + 이름 + 변환명 + QR)]
      │ 60초 무조작 or "완료"
      ▼
[S6 작별 인사 + 리셋] → S0
```

### 3.2 화면별 상세 명세

#### S0. Attract / Idle 화면
| 항목 | 내용 |
|---|---|
| 목적 | 지나가는 관람객의 관심 유도 |
| 핵심 UI | 반복 재생 루프 영상(캐릭터 손짓), "터치해서 시작!" 힌트 |
| 인터랙션 | 화면 터치 / 근접 감지(옵션) → S1 전환 |
| 전환 트리거 | `onTouchStart` → `startSession()` dispatch |
| 예외 | 60초 이상 비활성 시 영상 루프 계속 |

#### S1. AI 인트로 + 언어 선택
| 항목 | 내용 |
|---|---|
| 목적 | AI 캐릭터와 첫 만남, 언어 선택 |
| 핵심 UI | 중앙 AI 캐릭터 애니메이션 + 말풍선(TTS 재생 중 글자 타이핑 효과) + 언어 토글(KR/EN/JP/CN) |
| 대사 예시 | "안녕! 여기는 문자 나라 매표소야! 재미있는 여행을 떠나려면 입장권이 필요해." |
| 인터랙션 | "시작하기" 버튼 또는 AI가 "네 이름이 뭐야?"까지 말하고 자동 S2 |
| 전환 트리거 | TTS 종료 `onEnded` 또는 사용자 CTA 클릭 |

#### S2. 이름 입력 (음성 우선, 키보드 보조)
| 항목 | 내용 |
|---|---|
| 목적 | 어린이 이름 획득 (한글) |
| 핵심 UI | 마이크 펄스 애니메이션 + 실시간 인식 텍스트 미리보기 + 보조 "직접 입력" 버튼 |
| 인터랙션 | ① STT 마이크 버튼 → 음성 입력 → 확인 다이얼로그 ("지안이 맞아?") ② 보조 키보드(한글 14자 이내) |
| 예외 | STT 3회 실패 → 키보드 강제 표시 / 이모지 이름(고양이🐱 등) 선택지 제공 |
| 전환 트리거 | 이름 확정 시 `setUserName()` → S3 |
| 접근성 | 이름 미입력 시 "친구" 기본값 + "나중에 해도 돼!" 멘트 |

#### S3. 문자 선택 (Script Selection) — **v1.1 개편**
| 항목 | 내용 |
|---|---|
| 목적 | **이름의 한 음절마다 1개의 외국 문자를 골라 "나만의 이름 문자 조합"을 완성** — 탐색·비교·의사결정의 재미 |
| 핵심 UI | ① 상단 `SyllableRow` : 한글 이름을 음절 박스로 분해(예: `[나][민][원]`), 활성 박스만 하이라이트 · 완료 박스는 체크마크<br>② 화면 전체에 **떠다니는 문자 카드** 6~8장 (쐐기문자 · 한자 · 히라가나 · 영어 · 태국어 · 이집트 상형문자 등) — 음파 곡선 궤적으로 부유<br>③ 하단 `ResultRow` : 각 음절 박스 아래 ↓ 화살표 + 선택된 문자 슬롯 |
| 데이터 | `/api/transliterate` 응답의 `bySyllable[음절]` → 음절별 후보 6~8개 배열 (`scriptId`, `text`, `explanation`) |
| 인터랙션 | 1) 음절 탭 → 해당 음절 카드 풀이 화면에 "풀려남"(페이드 인 + 부유 시작)<br>2) 떠다니는 카드 탭 → Framer Motion `layoutId`로 하단 슬롯에 **FLIP 안착** + 사운드 `tap-soft`<br>3) 자동으로 다음 음절 활성화 (마지막 음절이면 1.5s 축하 후 S4)<br>4) 이미 선택된 슬롯 재탭 → 편집 모드(해당 음절 카드 풀 재전개) |
| 난이도 3단계 | 상(쐐기·이집트 중심) / 중(한자·태국어) / 하(영어·히라가나) — 연령 프리셋으로 `bySyllable` 후보의 `scriptId` 가중치 조정 |
| 예외 | 같은 카드 재탭 → 선택 취소(카드가 다시 부유군으로 복귀) / 45초 무응답 → AI가 "이것도 멋있어!" 하며 하나를 슬롯 옆에서 반짝임 |
| 전환 트리거 | `picked.every(Boolean) === true` → 1.5s `CelebrateOverlay` → `/generating` |
| 접근성 | 음절 박스는 Tab 순회 가능, 카드에는 `aria-label="{scriptName} 후보: {text}"` 부여 · 동기음(TTS로 문자 이름 낭독) 옵션 제공 |

#### S4. 캐릭터 생성 중 (Loading)
| 항목 | 내용 |
|---|---|
| 목적 | AI 이미지 생성 대기 시간(5~15초)을 몰입 연출로 전환 |
| 핵심 UI | **선택된 음절별 문자들이 하나씩 회오리처럼 중앙으로 모여** 캐릭터 실루엣을 형성 → 프로그레스바 (AI가 재잘재잘 코멘트) |
| 인터랙션 | 없음 (연출만) |
| 예외 | 15초 초과 시 "조금만 더!" 추가 코멘트 / 30초 초과 시 프리셋 조합 fallback |
| 전환 트리거 | `generateCharacter` API 성공 응답 → S5 |

#### S5. 디지털 티켓
| 항목 | 내용 |
|---|---|
| 목적 | 성취감 + 공유 유도 |
| 핵심 UI | 티켓 카드(중앙) = 캐릭터 이미지 + 한글 이름 + **음절 매핑 줄** (예: `나 → 娜  ·  민 → ミン  ·  원 → 𓃭`) + 박물관 로고 + QR 코드 + 발급 일시 |
| QR 기능 | 티켓 이미지 다운로드 URL (보호자 휴대폰으로 촬영) |
| 인터랙션 | "처음으로" 버튼 / 60초 무조작 시 자동 S6 |
| 애니메이션 | 티켓이 인쇄기에서 올라오는 연출(슬라이드업 + 종이 질감 그림자) |

#### S6. 작별 + 리셋
| 항목 | 내용 |
|---|---|
| 목적 | 세션 종료, 다음 사용자 준비 |
| 핵심 UI | 캐릭터 손 흔드는 애니메이션 + "다음에 또 만나!" 멘트 3초 |
| 전환 트리거 | 3초 후 자동 S0 & `resetSession()` |

---

## 4. 정보 구조 & 라우팅

```
/                       → Attract (S0)
/intro                  → AI 인트로 + 언어 (S1)
/name                   → 이름 입력 (S2)
/scripts                → 문자 선택 (S3)
/generating             → 캐릭터 생성 중 (S4)
/ticket                 → 디지털 티켓 (S5)
/goodbye                → 작별 (S6)
/admin                  → 관리자 대시보드 (별도 인증)
```

React Router v6 기준, `<Outlet />`으로 감싸고 **페이지 전환 애니메이션**은 Framer Motion `AnimatePresence`로 통일.

---

## 5. 컴포넌트 아키텍처

### 5.1 디렉토리 구조 (Claude Code에게 지시할 기준)

```
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx          # QueryClient, i18n, SoundProvider
├── pages/
│   ├── AttractPage.tsx
│   ├── IntroPage.tsx
│   ├── NameInputPage.tsx
│   ├── ScriptSelectPage.tsx
│   ├── GeneratingPage.tsx
│   ├── TicketPage.tsx
│   ├── GoodbyePage.tsx
│   └── admin/
│       └── AdminDashboard.tsx
├── features/
│   ├── ai-character/          # AI 캐릭터 렌더·발화 통합
│   │   ├── AICharacter.tsx
│   │   ├── SpeechBubble.tsx
│   │   └── useTTS.ts
│   ├── voice-input/
│   │   ├── VoiceInputButton.tsx
│   │   └── useSTT.ts
│   ├── script-selection/
│   │   ├── ScriptCard.tsx
│   │   ├── ScriptGrid.tsx
│   │   └── PassportSlots.tsx
│   ├── character-generation/
│   │   ├── GeneratingAnimation.tsx
│   │   └── useGenerateCharacter.ts
│   └── ticket/
│       ├── DigitalTicket.tsx
│       └── TicketQR.tsx
├── components/                # 순수 UI (atomic)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── PulseIndicator.tsx
│   ├── LanguageToggle.tsx
│   └── ...
├── store/
│   ├── sessionStore.ts        # Zustand
│   └── adminStore.ts
├── api/
│   ├── client.ts              # fetch wrapper
│   ├── llm.ts
│   ├── stt.ts
│   ├── tts.ts
│   ├── transliterate.ts
│   ├── generateCharacter.ts
│   └── analytics.ts
├── hooks/
│   ├── useIdleTimeout.ts
│   └── useSound.ts
├── i18n/
│   ├── index.ts
│   └── locales/{ko,en,ja,zh}.json
├── assets/
│   ├── characters/
│   ├── sounds/
│   └── scripts/               # 문자 샘플 이미지·SVG
└── types/
    └── domain.ts
```

### 5.2 핵심 컴포넌트 역할표

| 컴포넌트 | 책임 | 주요 Props |
|---|---|---|
| `<AICharacter />` | 캐릭터 스프라이트 렌더, 상태(idle/talking/thinking/happy) 전환 | `mood`, `speaking: boolean` |
| `<SpeechBubble />` | TTS 재생과 동기화된 타이핑 효과 자막 | `text`, `onFinish` |
| `<VoiceInputButton />` | STT 트리거 + 펄스 애니메이션 + 실시간 중간 결과 | `onResult(text)`, `lang` |
| `<ScriptGrid />` | 문자 카드 셔플·그리드 배치 | `scripts`, `maxSelection=3` |
| `<ScriptCard />` | 언어별 변환된 이름 카드 | `script`, `convertedName`, `selected` |
| `<PassportSlots />` | 선택된 3개 문자 누적 시각화 | `selected[]` |
| `<GeneratingAnimation />` | 문자 수렴 → 캐릭터 실루엣 연출 | `scripts[]`, `progress` |
| `<DigitalTicket />` | 티켓 레이아웃 (캐릭터+이름+QR) | `ticket` |
| `<LanguageToggle />` | i18n 언어 전환 | — |

---

## 6. 상태 관리 (Zustand)

### 6.1 SessionStore — 단일 체험 세션

```ts
// store/sessionStore.ts
type Stage = 'attract' | 'intro' | 'name' | 'scripts' | 'generating' | 'ticket' | 'goodbye';

interface SessionState {
  sessionId: string | null;
  stage: Stage;
  locale: 'ko' | 'en' | 'ja' | 'zh';
  userName: string;                            // 한글 원문 (예: "나민원")
  difficulty: 'easy' | 'normal' | 'hard';

  // v1.1 — 음절 단위 선택 모델
  syllables: string[];                         // NFD 정규화 후 완성형 음절 배열 (예: ['나','민','원'])
  activeIndex: number;                          // 현재 선택 중인 음절 인덱스
  candidates: Record<number, Candidate[]>;     // 음절별 후보 풀 (Candidate: { scriptId, text, explanation, seed })
  picked: (SyllableChoice | null)[];           // 음절별 확정 선택 (null = 미선택)

  generatedCharacter: Character | null;
  ticket: Ticket | null;
  startedAt: number | null;
  events: AnalyticsEvent[];                    // 로컬 큐, 주기적 flush

  // actions
  startSession: () => void;
  setLocale: (l: Locale) => void;
  setUserName: (n: string) => void;            // 내부에서 splitHangulSyllables 호출
  loadCandidates: () => Promise<void>;          // /api/transliterate 호출 후 candidates 채움
  setActiveIndex: (i: number) => void;
  pickFor: (i: number, c: Candidate) => void;  // picked[i] = {...}, 자동으로 다음 음절로 이동
  unpick: (i: number) => void;                  // 슬롯 재탭 → 해제
  setCharacter: (c: Character) => void;
  setTicket: (t: Ticket) => void;
  goTo: (s: Stage) => void;
  resetSession: () => void;
  logEvent: (e: AnalyticsEvent) => void;
}
```

### 6.2 AdminStore — 운영자 대시보드

```ts
interface AdminState {
  isAuthed: boolean;
  metrics: {
    sessionsToday: number;
    avgDurationSec: number;
    topScripts: Array<{ script: string; count: number }>;
    errorRate: number;
  };
  live: {
    currentStage: Stage | 'idle';
    uptimeSec: number;
  };
  fetchMetrics: () => Promise<void>;
}
```

---

## 7. 데이터 모델 (TypeScript)

```ts
// types/domain.ts

export type ScriptId =
  | 'latin' | 'hanja' | 'katakana' | 'thai'
  | 'greek' | 'egyptian' | 'cuneiform' | 'devanagari';

export interface Script {
  id: ScriptId;
  labelKo: string;
  labelEn: string;
  era: 'ancient' | 'modern';
  region: string;                // "동아시아", "중동" 등
  previewSvg: string;            // asset path
  difficulty: 1 | 2 | 3;
}

/**
 * v1.1 — 음절(syllable) 단위 후보·선택 모델
 *
 * 기존 ConvertedName(이름 1개 = 문자 1개) 구조를 폐기하고,
 * 각 음절마다 독립된 후보 풀과 선택을 갖는 구조로 변경.
 */
export interface Candidate {
  scriptId: ScriptId;
  text: string;                  // 예: 음절 "나"에 대한 "Na" / "娜" / "𓈖"
  explanation?: string;          // 1줄 설명 (선택적, 상세 모드에서 노출)
  seed: number;                  // 부유 궤적(FloatingScripts)의 난수 시드
}

export interface SyllableChoice {
  syllable: string;              // 원본 한글 음절 (예: "나")
  scriptId: ScriptId;
  text: string;                  // 선택된 문자 표기
  explanation?: string;
}

export interface Character {
  id: string;
  imageUrl: string;              // 생성 결과 이미지
  promptUsed: string;            // 디버그·재생성용
  traits: string[];              // ["이집트 상형문자 풍", "모험가 복장"]
  createdAt: string;
}

export interface Ticket {
  id: string;                    // 세션ID와 동일
  userName: string;              // 한글 원문 (예: "나민원")
  syllableMap: SyllableChoice[]; // v1.1: 음절별 매핑 (예: 나→娜, 민→ミン, 원→𓃭)
  character: Character;
  issuedAt: string;
  downloadUrl: string;           // QR 타겟
}

export interface AnalyticsEvent {
  sessionId: string;
  type:
    | 'session_start' | 'locale_change' | 'name_captured' | 'stt_failed'
    | 'syllable_activated' | 'syllable_picked' | 'syllable_unpicked'
    | 'generation_requested' | 'generation_succeeded' | 'generation_failed'
    | 'ticket_shown' | 'session_end' | 'idle_timeout';
  stage: Stage;
  // payload 예시:
  //   syllable_picked: { syllableIndex: 0, syllable: '나', scriptId: 'hanja', text: '娜' }
  //   syllable_activated: { syllableIndex: 1, syllable: '민' }
  payload?: Record<string, unknown>;
  ts: number;
}
```

---

## 8. API 계약 (Frontend 관점)

> Claude Code가 바로 `src/api/`에 타입 안전 함수로 구현하고, 초기에는 **MSW(Mock Service Worker)** 로 Mock을 붙여 개발할 수 있도록 설계.

### 8.1 공통 규약

- Base URL: `import.meta.env.VITE_API_BASE`
- 모든 요청 헤더에 `X-Session-Id` 포함
- 에러 포맷: `{ code: string; message: string; retryable: boolean }`

### 8.2 엔드포인트 명세

#### (1) `POST /api/stt`  — 음성 → 텍스트
```json
// Request (multipart/form-data)
{ "audio": "<blob>", "lang": "ko" }

// Response
{ "text": "지안이", "confidence": 0.92, "alternates": ["지안", "지완"] }
```

#### (2) `POST /api/tts` — 텍스트 → 음성
```json
// Request
{ "text": "안녕! 네 이름이 뭐야?", "lang": "ko", "voice": "kid-friendly-female" }

// Response (audio/mpeg 또는 JSON with url)
{ "audioUrl": "https://.../tts/abc123.mp3", "durationMs": 2100 }
```

#### (3) `POST /api/llm/chat` — AI 매표원 대사 생성
```json
// Request
{
  "sessionId": "s_01H...",
  "stage": "intro",
  "userName": "지안",
  "locale": "ko",
  "context": { "picked": [], "activeSyllable": null, "retryCount": 0 }
}

// Response
{
  "utterance": "멋진 이름이네! 문자 나라에서는 모두 자기만의 문자 이름이 있어.",
  "nextAction": "GO_SCRIPT_SELECT"
}
```

#### (4) `POST /api/transliterate` — **음절 단위** 다국어 변환 (v1.1)
```json
// Request
{
  "name": "나민원",
  "syllables": ["나","민","원"],
  "targetScripts": ["latin","hanja","katakana","thai","egyptian","cuneiform","greek"],
  "perSyllableCount": 7          // 음절당 후보 수 (기본 6~8)
}

// Response — 음절을 키로 하는 후보 맵
{
  "bySyllable": {
    "나": [
      { "scriptId": "latin",     "text": "Na",  "explanation": "로마자 표기" },
      { "scriptId": "hanja",     "text": "娜",  "explanation": "여성 이름에 쓰이는 한자" },
      { "scriptId": "katakana",  "text": "ナ",  "explanation": "일본어 음가" },
      { "scriptId": "thai",      "text": "นะ",  "explanation": "태국어 음가" },
      { "scriptId": "egyptian",  "text": "𓈖",   "explanation": "이집트 상형 음가" },
      { "scriptId": "cuneiform", "text": "𒈾",   "explanation": "수메르 쐐기문자 음가" }
    ],
    "민": [ /* 동일 구조의 6~8개 후보 */ ],
    "원": [ /* 동일 구조의 6~8개 후보 */ ]
  }
}
```
> 프론트엔드는 `bySyllable[음절]`을 받은 뒤, 각 후보에 **랜덤 `seed`를 부여**하여 `FloatingScripts`의 사인파 궤적 파라미터로 사용합니다.

#### (5) `POST /api/character/generate` — DALL·E/SD 이미지 생성 (v1.1)
```json
// Request — 음절별 선택을 그대로 전달
{
  "sessionId": "s_01H...",
  "userName": "나민원",
  "syllableMap": [
    { "syllable": "나", "scriptId": "hanja",     "text": "娜" },
    { "syllable": "민", "scriptId": "katakana",  "text": "ミン" },
    { "syllable": "원", "scriptId": "egyptian",  "text": "𓃭" }
  ],
  "stylePreset": "child-friendly-vector"
}

// Response
{
  "characterId": "c_abc",
  "imageUrl": "https://cdn.../c_abc.png",
  "traits": ["한자 모티프", "가타카나 현대적 디자인", "이집트 상형문자 문양"],
  "promptUsed": "a cute chibi adventurer child named 나민원 whose syllables are depicted as 娜·ミン·𓃭 ..."
}
```
> 백엔드 프롬프트 조립 시 `syllableMap[].scriptId` 다양성에 따라 `traits`를 누적합니다. 3개 음절이 모두 같은 scriptId를 고른 경우에도(몰입형 시나리오) 자연스러운 캐릭터가 나오도록 fallback 프롬프트를 준비합니다.

#### (6) `POST /api/ticket/finalize` — 티켓 생성 + 공유 URL 발급
```json
// Request
{ "sessionId": "s_01H...", "characterId": "c_abc" }

// Response
{
  "ticketId": "t_01H...",
  "downloadUrl": "https://.../t_01H...png",
  "issuedAt": "2026-04-23T10:12:33Z"
}
```

#### (7) `POST /api/analytics/events` — 이벤트 로그 배치 수집
```json
// Request
{ "events": [ /* AnalyticsEvent[] */ ] }

// Response
{ "accepted": 12 }
```

### 8.3 Mock 전략

개발 초기에는 **MSW + `src/mocks/handlers.ts`** 로 위 7개 엔드포인트를 시뮬레이션.
- `/api/stt` → 1.2초 지연 후 고정 텍스트
- `/api/character/generate` → 8초 지연 후 사전 준비된 캐릭터 이미지 8장 중 1장 반환

---

## 9. UI/UX 가이드라인 (4~8세 어린이 친화)

### 9.1 설계 원칙

| 원칙 | 구체 규칙 |
|---|---|
| **큰 터치 영역** | 최소 120×120px, 카드 간격 24px 이상 |
| **쉬운 문장** | 1문장 12어절 이내, 초등 저학년 어휘 |
| **음성 우선·자막 동반** | TTS 재생 + 자막 타이핑 동기화 |
| **실수 허용** | 모든 단계 뒤로가기, 3회까지 재시도 허용 |
| **대기시간 연출** | 로딩 = 지루함 아닌 몰입. 캐릭터 코멘트·미세 애니메이션 |
| **반응 피드백** | 모든 터치에 0.1s 이내 시각·효과음·햅틱(지원 시) |

### 9.2 비주얼 토큰

```css
/* tailwind.config.ts 또는 CSS Variables */
--color-primary:     #FFB84C;   /* 따뜻한 오렌지 */
--color-secondary:   #4C9AFF;   /* 말풍선 블루 */
--color-accent:      #FF6B9D;   /* 포인트 핑크 */
--color-bg-warm:     #FFF8E7;   /* 파피루스 크림 */
--color-text:        #2E2A4A;   /* 어두운 보라-브라운 */
--font-display:      'Gaegu', 'KCC-Ganpan', sans-serif;  /* 둥근 손글씨 */
--font-body:         'Pretendard', system-ui;
--radius-card:       24px;
--shadow-card:       0 12px 24px rgba(46,42,74,0.12);
```

### 9.3 사운드 디자인

| 이벤트 | 사운드 |
|---|---|
| 버튼 탭 | "팝" (200ms, 부드러운 톤) |
| 카드 선택 | "딩~" (음정 상승) |
| 오류 | 하강 멜로디 (절대 경고음 아님) |
| 캐릭터 생성 완료 | "짜잔~" 팡파르 1.5초 |

### 9.4 접근성

- 자막 ON 기본값
- 글자 크기 확대 토글 (관리자 설정)
- 색맹 대비 2단 테마 옵션 (Phase 2)
- 스크린리더 대응은 본 키오스크 대상 특성상 **Phase 2 이후**로 명시

---

## 10. 다국어(i18n) 구조

- 라이브러리: **i18next + react-i18next**
- 파일 구조: `src/i18n/locales/{ko,en,ja,zh}.json`
- 전환 시점: S1에서 사용자가 직접 선택 시 즉시 반영, 이후 동일 세션 유지
- AI 대사는 **서버 응답 기반** (백엔드 LLM 프롬프트에 `locale` 전달) → 클라이언트 번역 키가 아님
- UI 라벨만 로컬 JSON으로 관리
- RTL 언어(아랍어)는 Phase 2에서 검토

---

## 11. 관리자 대시보드 (`/admin`)

### 11.1 최소 기능 (Phase 1)

| 섹션 | 내용 |
|---|---|
| 실시간 상태 | 현재 stage, 가동시간, 마지막 오류 |
| 오늘 지표 | 세션 수, 평균 체험시간, 완주율, 오류율 |
| 문자 선택 랭킹 | 이집트 38%, 한자 24% ... |
| 콘텐츠 제어 | 콘텐츠 ON/OFF, 난이도 프리셋 변경, 강제 리셋 |
| 로그 다운로드 | 기간 지정 CSV 내보내기 |

### 11.2 인증

- 초기: 관리자 PIN 4자리 (Zustand 메모리)
- Phase 2: 박물관 SSO 연동

---

## 12. 에러·예외 시나리오

| 상황 | 대응 |
|---|---|
| STT 3회 연속 실패 | 키보드 강제 표시 + "그림 이름(🐱)" 대체 선택 |
| LLM 응답 타임아웃(5초) | 사전 준비된 안전 대사 풀에서 선택 |
| 이미지 생성 30초 초과 | 프리셋 캐릭터 조합 fallback + 배지 표시 ("특별판!") |
| 네트워크 단절 | Offline 모드 배너 + AI 인사·문자 카드는 로컬 캐시로 계속 동작, 생성만 대기 큐 |
| 사용자 무조작 60초 | AI가 "다음에 또 올래?" 후 S6 → S0 |
| 동일 IP 과다 호출 | Rate limit 에러 친화적 메시지로 포장 |

---

## 13. 단계별 개발 로드맵 (Claude Code 작업 분할)

### Phase 0 · 스캐폴딩 (0.5일)
- [ ] Vite + React 18 + TS 초기화, Tailwind + Framer Motion + Zustand + React Router 설치
- [ ] 라우터·페이지 스텁, i18n 뼈대, `sessionStore` 초안
- [ ] MSW 설정 + Mock 핸들러 7종 더미 응답

### Phase 1 · 핵심 체험 플로우 (3~4일)
- [ ] S0 Attract 영상 루프, 터치 진입
- [ ] S1 AI 캐릭터 + TTS 연동 + 언어 토글
- [ ] S2 STT 이름 입력 + 키보드 폴백
- [ ] S3 문자 선택 그리드 + 여권 슬롯
- [ ] S4 로딩 연출 + `/api/character/generate` 연동
- [ ] S5 디지털 티켓 + QR
- [ ] S6 리셋 사이클

### Phase 2 · 운영·데이터·다국어 (2~3일)
- [ ] AnalyticsEvent 큐·배치 전송
- [ ] `/admin` 대시보드
- [ ] i18n 4개 로케일 라벨 완성
- [ ] 예외 시나리오 전부 대응

### Phase 3 · 실증 대응 (상시)
- [ ] 운영 중 피드백 반영
- [ ] 성능 튜닝(이미지 생성 대기 UX 개선)
- [ ] 해외 MOU 기관 시연용 영어 모드 QA

---

## 14. 비기능 요구사항

| 항목 | 기준 |
|---|---|
| 초기 로딩 | 터치 → S1 진입까지 1.5초 이내 |
| 체험 완주 시간 | 2분 30초 ~ 3분 30초 |
| 동시 세션 | 1대 = 1세션 (키오스크 특성) |
| 브라우저 | Chromium 최신 (키오스크 모드 기동) |
| 해상도 | 1080×1920 (세로) 기본 / 1920×1080 대응 |
| 무중단성 | 크래시 시 자동 리로드 (Electron 또는 `chrome --kiosk` + PM2 감시) |

---

## 15. Claude Code 착수용 초기 프롬프트 (복사해서 사용)

> 아래 텍스트를 Claude Code 프로젝트 초기 지시로 그대로 붙여넣으면 됩니다.

```
너는 이제부터 '문자 나라 티켓박스'라는 어린이 대상 박물관 키오스크 React 앱을 만든다.
기획서는 /docs/문자나라_티켓박스_React_기획문서.md 에 있다. 반드시 이 문서의 섹션 5(컴포넌트
아키텍처), 6(상태관리), 7(데이터모델), 8(API 계약)을 정확히 따른다.

Phase 0부터 순서대로 진행한다:
1) Vite + React 18 + TypeScript로 프로젝트를 스캐폴딩한다.
2) 의존성: tailwindcss, framer-motion, zustand, react-router-dom, react-i18next, i18next,
   msw, @tanstack/react-query, howler, qrcode.react
3) src/ 디렉토리를 기획서 5.1과 동일하게 생성한다.
4) types/domain.ts에 기획서 7번 타입 정의를 그대로 옮긴다.
5) store/sessionStore.ts를 기획서 6.1대로 Zustand로 구현한다.
6) api/ 하위에 기획서 8.2의 7개 엔드포인트를 타입 안전 함수로 구현한다.
7) MSW 핸들러를 src/mocks/handlers.ts에 작성해 모든 API에 Mock 응답을 붙인다.
   이미지 생성 Mock은 8초 지연 후 public/mock-characters/ 중 랜덤 반환.
8) pages/ 7개 화면 스텁을 만들고 router.tsx로 연결한다.
9) 디자인 토큰(9.2)을 tailwind.config.ts의 theme.extend에 반영한다.
10) 각 페이지가 기획서 3.2의 "핵심 UI / 인터랙션 / 전환 트리거"를 만족하도록 구현한다.

코드 스타일: 함수형 컴포넌트, Hook 기반, TypeScript strict, ESLint + Prettier.
UI 라벨은 모두 i18n 키로 작성하고 ko/en/ja/zh JSON에 동시 추가한다.
먼저 Phase 0~1의 Todo를 목록으로 보여주고, 각 작업마다 커밋 메시지 초안을 제시한다.
```

---

## 16. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|---|---|---|
| 1.0 | 2026-04-23 | 최초 작성 — 수요과제 제안서 기반 프론트엔드 전체 명세 |
| 1.1 | 2026-04-23 | **S3 인터랙션 모델 전면 개편**. "3가지 문자 일괄 선택" → **"이름의 각 음절마다 1개씩 골라 조립"** 방식으로 변경. 연쇄 변경: §3.2 S3/S5 표, §6.1 `SessionState`(`syllables`/`candidates`/`picked`/`activeIndex`/`pickFor`), §7 도메인(`Candidate`·`SyllableChoice` 신설, `ConvertedName` 폐기, `Ticket.syllableMap`), §8.2 (3) 컨텍스트·(4) `bySyllable` 응답·(5) `syllableMap` 요청, AnalyticsEvent(`syllable_*` 계열 신설). 상세 레이아웃은 『문자나라_티켓박스_화면레이아웃_설계서.md』 v1.1 참조. |

---

### 부록 A. 제안서 요구사항 ↔ 본 문서 대응표

| 제안서 요구사항 | 반영 섹션 |
|---|---|
| LLM 기반 대화형 AI | §3.S1, §8.2(3), §12 타임아웃 |
| 음성 인식/합성 | §3.S2, §8.2(1)(2) |
| 문자 변환 엔진 | §3.S3, §8.2(4) |
| 개인 맞춤 캐릭터 생성 | §3.S4, §8.2(5) |
| 실물 출력 → **화면 출력으로 범위 조정** | §3.S5 디지털 티켓 + QR |
| 데이터 수집·분석 | §7 AnalyticsEvent, §8.2(7), §11 |
| 다국어 대응 | §10 |
| 휴대용 디바이스 호환 | §14 해상도 대응 |
| 난이도 3단계(상중하) | §3.S3 난이도 프리셋 |
| 관리자 화면 | §11 |
| 캐릭터/시각 요소 5종 이상 | §7 traits, §8.2(5) + 프리셋 fallback 8종 |
