# 디자인 시스템 접근 방식 비교 분석

> Carbon (IBM), MUI (Google/Community), Salesforce Lightning Design System 3개 시스템의 철학·구조·패턴 비교

---

## 1. IBM Carbon Design System

### 핵심 철학: "Foundation-First" — 디자인 결정을 코드 계층 구조로 표현한다

Carbon의 가장 큰 특징은 **디자인 시스템의 구성 요소를 각각 독립 npm 패키지로 분리**한다는 점이다. 단순히 폴더를 나누는 게 아니라, 각 레이어가 독립적으로 배포·버전관리·설치된다. 이 구조는 "어느 팀이 어느 레이어까지 쓸지"를 선택할 수 있게 하고, 각 레이어가 변경되더라도 상위 레이어에만 영향이 전파된다.

의존성 방향은 단방향이다:

```
@carbon/colors          ← 원시 팔레트 값. 외부 의존 없음.
       ↓
@carbon/themes          ← colors를 참조해 의미 있는 이름으로 매핑
       ↓
@carbon/styles          ← themes를 SCSS로 소비해 전역 CSS 생성
       ↓
@carbon/react           ← styles를 dep으로 가지는 React 컴포넌트 레이어
```

---

### 1-1. 토큰 시스템: 3단계 계층 구조

#### 1단계 — Primitive Token (`@carbon/colors`)

가장 하위 레이어. 색상 값에 아무 의미를 부여하지 않는다. 이름은 `blue60`, `gray10` 처럼 색상 계열 + 명도 숫자 조합으로 쓴다. 여기서 "파란색이 버튼에 쓰인다"는 정보는 없다. JS 모듈과 SCSS 두 포맷으로 동시 배포(`"main"`, `"sass"` 필드 구분)된다.

```js
// 의미 없음, 색상 값 자체만 존재
export const blue60 = "#0f62fe";
export const gray10 = "#f4f4f4";
export const gray80 = "#393939";
```

#### 2단계 — Semantic Token (`@carbon/themes`)

Primitive Token을 가져와 **"이 색이 어떤 맥락에서 쓰이는가"** 를 정의한다. 컴포넌트는 이 이름을 참조한다. 색상 팔레트가 바뀌어도 semantic 이름이 유지되면 컴포넌트 코드는 수정하지 않아도 된다.

> 🔶 **Q. 시멘틱 토큰은 프리미티브 토큰과 다른 파일에서 관리하는 게 좋을까? 따로 관리하면 유지보수성이 떨어질 수도 있지 않나?**
>
> 🟢 분리가 오히려 유지보수성을 높인다. 두 레이어의 변경 주기와 담당자가 다르기 때문이다.
>
> - 프리미티브 토큰(`blue60 = #0f62fe`)은 브랜드 팔레트 자체라서 거의 바뀌지 않는다.
> - 시멘틱 토큰은 "이 맥락에서 어떤 색을 쓸지"를 정의해서, 다크 테마 추가나 상태 색 조정 시 자주 바뀐다.
>
> 같은 파일에 두면 "팔레트 수정"과 "의미 매핑 수정"이 뒤섞여 충돌 위험이 생긴다. Carbon이 `@carbon/colors`와 `@carbon/themes`를 별도 npm 패키지로 분리한 것도 이 이유다. 테마 파일(`white.js`, `g90.js`)이 추가될 때마다 프리미티브는 건드리지 않아도 되는 구조가 핵심이다.
>
> 파일이 두 개라 왔다갔다 해야 한다는 불안감은 있지만, 시멘틱 → 프리미티브의 단방향 import라서 추적이 쉽다. 한 파일에 섞이면 오히려 "이게 원시값인지 의미 매핑인지" 구분이 어려워진다.

> 🔶 **Q. 여러 컴포넌트(버튼, 인풋, 카드)에서 동일한 primary 시멘틱을 사용할 때, 버튼 색상만 바꾸려면 결국 시멘틱을 추가하고 컴포넌트도 수정하게 되지 않나?**
>
> 🟢 맞다. 그래서 3단계인 Component Token이 존재한다. 이 질문이 정확히 글로벌 시멘틱의 한계를 짚고 있고, Carbon의 해결책이 `component-tokens/` 폴더다.
>
> 버튼이 hover/active/disabled에서 다른 컴포넌트와 다른 색이 필요할 때, 글로벌 `borderInteractive` 대신 `component-tokens/button/` 안의 전용 토큰을 참조한다. 결국 토큰을 추가하고 컴포넌트를 수정하게 되는 건 맞는데, Carbon은 이걸 **의도적인 마찰(friction)**로 설계했다.
>
> _"이 컴포넌트는 시스템 기본값에서 명시적으로 이탈한다"는 신호를 코드베이스에 남기는 것._
>
> 무분별하게 컴포넌트마다 색을 다르게 쓰는 것을 막고, 이탈이 필요할 때는 Component Token이라는 공식 경로를 통해 추적 가능하게 만드는 게 목적이다. Component Token을 가진 컴포넌트가 현재 5개뿐인 것도 정말 필요한 경우에만 만드는 원칙 때문이다. DaisyUI처럼 각 컴포넌트에 CSS 로컬 변수를 두면 바꾸기는 쉽지만, "왜 이 버튼만 다른 색인가?"를 추적하기 어려워지는 트레이드오프가 생긴다.

Semantic Token은 총 **233개**이며, 다음 카테고리로 구성된다:

| 카테고리       | 토큰 예시                                                         | 역할                        |
| -------------- | ----------------------------------------------------------------- | --------------------------- |
| **Background** | `background`, `backgroundInverse`, `backgroundBrand`              | 페이지/섹션 배경            |
| **Layer**      | `layer01`, `layer02`, `layer03` + 각각 Active/Hover/Selected      | 중첩 컨테이너의 깊이별 색상 |
| **Field**      | `field01`, `field02`, `field03`                                   | 입력 영역 깊이별 색상       |
| **Border**     | `borderSubtle`, `borderStrong`, `borderInteractive`               | 테두리 강도별 색상          |
| **Text**       | `textPrimary`, `textSecondary`, `textHelper`, `textError`         | 텍스트 역할별 색상          |
| **Link**       | `linkPrimary`, `linkVisited`, `linkInverse`                       | 링크 상태별 색상            |
| **Icon**       | `iconPrimary`, `iconInteractive`, `iconDisabled`                  | 아이콘 역할별 색상          |
| **Support**    | `supportError`, `supportSuccess`, `supportWarning`, `supportInfo` | 상태 메시지 색상            |
| **Focus**      | `focus`, `focusInset`, `focusInverse`                             | 키보드 포커스 링            |
| **Skeleton**   | `skeletonBackground`, `skeletonElement`                           | 로딩 상태                   |
| **Syntax**     | `syntaxKeyword`, `syntaxString`, `syntaxComment` 등 70개+         | 코드 에디터 문법 강조       |
| **AI**         | `aiAuraStart`, `aiAuraEnd`, `aiBorderStrong` 등 21개              | AI 컴포넌트 전용 색상       |
| **Chat**       | `chatBubbleUser`, `chatBubbleAgent`, `chatShellBackground` 등     | AI 챗 인터페이스            |

이 카테고리 구성 자체가 **Carbon이 어떤 UI 패턴을 디자인 시스템 레벨에서 공식 지원하는지**를 보여준다. 코드 에디터, AI 인터페이스, 챗 UI가 별도 토큰 카테고리를 가진다는 것은 그 패턴들이 일회성 커스텀이 아니라 시스템의 일부임을 의미한다.

**White 테마 vs G90 테마 비교:**

```js
// white.js (라이트 테마)
export const background = white;      // #ffffff
export const layer01   = gray10;      // #f4f4f4
export const textPrimary = gray100;   // #161616
export const borderInteractive = blue60;

// g90.js (다크 테마)
export const background = gray90;    // #262626
export const layer01   = gray80;     // #393939
export const textPrimary = gray10;   // #f4f4f4  ← 반전됨
export const borderInteractive = blue50;         ← 명도 조정됨
```

토큰 이름은 동일하고, 각 테마 파일이 다른 값을 내보낸다. 컴포넌트는 `textPrimary`라는 이름만 알고, 라이트/다크 여부는 신경 쓰지 않는다.

#### 3단계 — Component Token

글로벌 Semantic Token만으로는 해결하기 어려운 컴포넌트 고유의 색상 값을 별도로 관리한다. `@carbon/themes/src/component-tokens/` 안에 컴포넌트별 파일이 있다. 현재 존재하는 컴포넌트 토큰: **button, content-switcher, notification, tag, status** 5가지다.

이 선택적 적용이 중요하다. 글로벌 토큰으로 표현하기 어려운 상태(hover, active, disabled 등)를 정밀하게 테마별로 지정해야 하는 컴포넌트만 Component Token을 갖는다.

> 🔶 **Q. 그러면 shad/cn처럼 variants를 위주로 버튼의 테마나 스타일을 변경하는 방식이랑 컴포넌트 토큰을 사용하는 방식중에 소규모 작업방식에 더 맞는건 어떤게 있을까?**
>
> 🟢 소규모에서는 **shadcn/ui 스타일 variants 방식**이 더 현실적이다.
>
> 두 방식의 핵심 차이:
>
> | | shadcn/ui variants | Component Token |
> |---|---|---|
> | 스타일 변경 방법 | `variant="primary"` prop 조합 | CSS 변수 값 교체 |
> | 설정 비용 | 낮음 (코드 그대로 읽힘) | 토큰 체계 먼저 설계 필요 |
> | 추적 가능성 | 컴포넌트 코드에서 바로 확인 | 토큰 파일 따라가야 함 |
> | 테마 전환 | variant별 스타일 직접 작성 | 토큰 파일만 바꾸면 전체 반영 |
>
> Component Token이 빛나는 조건은 **"같은 컴포넌트를 여러 테마에서 재사용"**하거나 **"디자이너-개발자 간 토큰 기반 협업"**이 필요할 때다. 소규모 팀에서 테마가 1~2개뿐이라면 이 인프라를 갖추는 비용이 이득보다 크다.
>
> 반면 variants 방식은 `cva()` 같은 유틸리티와 함께 쓰면 변형 조합이 명시적으로 코드에 드러나고, 파일 하나만 열면 버튼의 모든 생김새를 파악할 수 있다. 소규모에서 "추적 가능성"을 확보하는 더 단순한 방법이다.
>
> 단, 나중에 멀티 테마나 대규모 확장이 예상된다면 처음부터 시멘틱 토큰이라도 CSS 변수로 뽑아두는 것이 마이그레이션 비용을 줄이는 절충점이다.

---

### 1-2. 테마 시스템: Zone 기반 인라인 전환

Carbon에서 테마는 두 가지 방식으로 적용할 수 있다.

**방법 1: 전역 테마 설정** — SCSS 컴파일 시 기본 테마를 지정

**방법 2: Zone(인라인 테마)** — HTML 특정 영역에 클래스를 붙여 그 범위 안의 테마를 다르게 적용

`_zone.scss`가 이를 구현한다:

```scss
// _zone.scss 실제 코드 — 4개 테마 클래스를 생성한다
$zones: (
  white: themes.$white,
  g10: themes.$g10,
  g90: themes.$g90,
  g100: themes.$g100,
);

@each $name, $theme in $zones {
  .cds--#{$name} {
    // .cds--white, .cds--g10, .cds--g90, .cds--g100
    background-color: var(--cds-background);
    color: var(--cds-text-primary);

    // 이 클래스 안에서만 적용되는 CSS 변수 오버라이드
    @each $key, $value in $theme {
      --cds-#{$key}: #{$value};
    }
  }
}
```

결과적으로 한 페이지 내에서 영역별로 다른 테마를 쓸 수 있다:

```html
<div class="cds--white">
  ← 이 안은 White 테마
  <button>Light Button</button>
</div>

<div class="cds--g90">
  ← 이 안은 G90 다크 테마
  <button>Dark Button</button>
</div>
```

컴포넌트는 코드를 전혀 바꾸지 않는다. CSS 변수 값만 바뀐다.

---

### 1-3. Motion(애니메이션) 시스템: Productive vs Expressive

Carbon은 애니메이션 easing을 **사용 목적에 따라 2가지 모드**로 구분한다. 이건 단순히 빠름/느림의 차이가 아니라 디자인 철학의 차이다.

```scss
// @carbon/motion 실제 코드
$easings: (
  standard: (
    productive: cubic-bezier(0.2, 0, 0.38, 0.9),
    // 업무 도구 → 빠르고 효율적
    expressive: cubic-bezier(0.4, 0.14, 0.3, 1),
    // 감성 UI  → 부드럽고 풍부한 느낌
  ),
  entrance: (
    productive: cubic-bezier(0, 0, 0.38, 0.9),
    expressive: cubic-bezier(0, 0, 0.3, 1),
  ),
  exit: (
    productive: cubic-bezier(0.2, 0, 1, 0.9),
    expressive: cubic-bezier(0.4, 0.14, 1, 1),
  ),
);
```

duration 스케일도 명확히 정의한다:

| 토큰                    | 값    | 사용 시나리오             |
| ----------------------- | ----- | ------------------------- |
| `$duration-fast-01`     | 70ms  | 호버, 포커스 등 즉각 반응 |
| `$duration-fast-02`     | 110ms | 작은 UI 요소 전환         |
| `$duration-moderate-01` | 150ms | 모달, 드롭다운 등         |
| `$duration-moderate-02` | 240ms | 복잡한 전환               |
| `$duration-slow-01`     | 400ms | 대형 영역 전환            |
| `$duration-slow-02`     | 700ms | 페이지 전환 수준          |

이 분류가 Button의 `isExpressive` prop과 연결된다. 같은 버튼이라도 업무 툴 맥락에선 `productive`, 마케팅 페이지 맥락에선 `expressive` 모드를 쓰도록 시스템이 지원한다.

---

### 1-4. 스페이싱 시스템

Carbon의 스페이싱은 4px 기반 스케일이다. `spacing-01`부터 `spacing-13`까지 고정 스케일과, 뷰포트에 따라 유동적으로 변하는 `fluid-spacing-*` 스케일로 나뉜다.

```js
// @carbon/layout/src/tokens.js
// spacing: 4px 베이스 스케일
spacing01: '0.125rem',  // 2px
spacing02: '0.25rem',   // 4px
spacing03: '0.5rem',    // 8px
spacing04: '0.75rem',   // 12px
spacing05: '1rem',      // 16px
spacing06: '1.5rem',    // 24px
spacing07: '2rem',      // 32px
spacing08: '2.5rem',    // 40px
...
spacing13: '10rem',     // 160px

// 컴포넌트 사이즈 토큰 (높이 기준)
sizeXSmall: '1.5rem',   // 24px
sizeSmall:  '2rem',     // 32px
sizeMedium: '2.5rem',   // 40px
sizeLarge:  '3rem',     // 48px
```

컴포넌트의 `size` prop (`sm`, `md`, `lg` 등)이 내부적으로 이 스페이싱 스케일 값을 참조한다.

---

### 1-5. Feature Flag 시스템: 점진적 마이그레이션 설계

Carbon은 새 기능이나 breaking change를 도입할 때 Feature Flag를 통해 점진적으로 활성화한다. JS와 SCSS 양쪽에 동일한 플래그가 존재한다:

```js
// packages/react/src/feature-flags.js
merge({
  "enable-css-custom-properties": true, // 이미 활성화됨
  "enable-v12-tile-radio-icons": false, // v12에서 도입 예정, 아직 opt-in
  "enable-v12-dynamic-floating-styles": false,
  "enable-presence": false, // 실험적 기능
});
```

```scss
// packages/styles/scss/_feature-flags.scss (동일한 플래그)
@forward "@carbon/feature-flags" with (
  $feature-flags: (
    "enable-css-custom-properties": true,
    "enable-v12-tile-radio-icons": false,
    "enable-dialog-element": false,
  )
);
```

이 패턴의 의미: 소비자가 `enable-v12-*` 플래그를 켜면 v12 변경 사항을 미리 opt-in할 수 있다. 대규모 버전 업 시 모든 변경을 한 번에 받는 게 아니라, 팀별로 준비된 부분부터 순서대로 도입할 수 있다.

---

### 1-6. AI 확장: 시스템이 진화한 방향

Semantic Token에 `ai*` 카테고리(21개)와 `chat*` 카테고리(17개)가 존재한다는 것은 Carbon이 AI/LLM 인터페이스를 디자인 시스템 수준에서 공식 지원한다는 의미다. 이것은 외부에서 덮어쓰는 커스터마이징이 아니라, 시스템 자체가 이 패턴을 흡수한 것이다.

```js
// AI 컴포넌트 전용 토큰 (white 테마 기준)
export const aiAuraStart = rgba(blue50, 0.1); // AI 강조 글로우 시작
export const aiAuraEnd = rgba(white, 0); // AI 강조 글로우 끝
export const aiBorderStrong = blue50; // AI 컴포넌트 테두리
export const aiDropShadow = rgba(blue60, 0.1); // AI 컴포넌트 그림자

// Chat 인터페이스 전용 토큰
export const chatBubbleUser = gray20; // 유저 버블 배경
export const chatBubbleAgent = white; // AI 버블 배경
export const chatAvatarBot = gray60; // 봇 아바타 색
export const chatAvatarUser = blue60; // 유저 아바타 색
```

컴포넌트 수준에서는 `ChatButton`이 `Button`과 별개 컴포넌트로 존재한다. 같은 버튼이지만 AI 대화 컨텍스트에서 다르게 동작해야 하는 부분(`isQuickAction`, `isSelected` 등)을 분리해서 관리한다.

---

### 1-7. 폴더 구조

```
carbon/
├── packages/
│   ├── colors/                    # @carbon/colors — Primitive 팔레트
│   │   ├── src/index.js           # blue60, gray10 등 raw 색상값
│   │   └── index.scss             # SCSS 포맷도 병행 배포
│   │
│   ├── themes/                    # @carbon/themes — Semantic 토큰 + 테마 정의
│   │   └── src/
│   │       ├── white.js           # 233개 시맨틱 토큰 (라이트)
│   │       ├── g10.js
│   │       ├── g90.js             # 233개 시맨틱 토큰 (다크)
│   │       ├── g100.js
│   │       ├── tools.js           # adjustAlpha() 등 토큰 연산 유틸
│   │       └── component-tokens/  # 컴포넌트별 전용 토큰 (5종)
│   │           ├── button/
│   │           ├── notification/
│   │           ├── tag/
│   │           ├── status/
│   │           └── content-switcher/
│   │
│   ├── styles/                    # @carbon/styles — CSS 생성 레이어
│   │   ├── index.scss             # 모든 모듈의 조합 진입점
│   │   └── scss/
│   │       ├── _config.scss       # $prefix: 'cds', 글로벌 SCSS 설정
│   │       ├── _feature-flags.scss
│   │       ├── _theme.scss        # 테마 mixin + 고대비 모드 대응
│   │       ├── _zone.scss         # .cds--g90 같은 인라인 테마 클래스
│   │       ├── _spacing.scss      # spacing-01 ~ spacing-13
│   │       ├── _motion.scss       # duration 토큰, easing 참조
│   │       └── components/        # 컴포넌트별 SCSS (70개+)
│   │           ├── button/
│   │           ├── accordion/
│   │           └── ...
│   │
│   ├── layout/                    # @carbon/layout — 스페이싱·컨테이너 스케일
│   ├── motion/                    # @carbon/motion — easing, duration 토큰
│   ├── type/                      # @carbon/type — 타이포그래피 스케일
│   │
│   └── react/                     # @carbon/react — React 컴포넌트
│       └── src/
│           └── components/
│               ├── Button/
│               │   ├── Button.tsx          # 공개 API + hasIconOnly 분기
│               │   ├── ButtonBase.tsx      # 실제 DOM 렌더링
│               │   ├── Button.Skeleton.tsx # 로딩 상태 변형
│               │   ├── index.ts            # re-export
│               │   ├── Button.stories.js   # Storybook
│               │   ├── Button.mdx          # 문서 (Usage, API, Feedback 링크 포함)
│               │   ├── button-avt.md       # 접근성 수동 검증 체크리스트
│               │   ├── migrate-to-7.x.md   # 버전 마이그레이션 가이드
│               │   └── __tests__/
│               ├── ButtonSet/
│               └── ChatButton/             # AI 컨텍스트 전용 버튼 (별도 컴포넌트)
│
├── jest.config.js
├── playwright.config.js           # E2E + 접근성 테스트
├── achecker.js                    # IBM Equal Access Checker (자동 접근성 검사)
├── .percy.yml                     # 시각 회귀 테스트
└── nx.json                        # 패키지 간 빌드 의존 그래프
```

---

### 1-8. 접근성(A11y): 시스템 레벨 강제

Carbon은 접근성을 개발자 선택 사항이 아니라 **시스템이 강제하는 규칙**으로 다룬다.

| 레벨            | 수단                                             | 역할                                            |
| --------------- | ------------------------------------------------ | ----------------------------------------------- |
| 빌드 파이프라인 | `achecker.js` (IBM Equal Access Checker)         | WCAG 기준 자동 접근성 검사                      |
| 시각 회귀       | `.percy.yml`                                     | 색상 대비, 포커스 링 등 시각적 접근성 회귀 방지 |
| E2E             | `playwright.config.js`                           | 키보드 탐색, 스크린 리더 시나리오               |
| 런타임          | PropTypes 커스텀 검증기                          | 잘못된 prop 조합을 에러로 알림                  |
| 컴포넌트 내부   | `visually-hidden` span, `aria-describedby`       | 스크린 리더용 보조 텍스트 자동 삽입             |
| 문서            | `button-avt.md` (VoiceOver/JAWS/NVDA 체크리스트) | 수동 검증 가이드를 컴포넌트 폴더에 동봉         |

---

### 1-9. 배포 전략과 버전 관리

각 패키지가 독립적인 버전 번호를 가진다. `@carbon/colors v11.48.0`이 올라가더라도 `@carbon/react`는 준비될 때 업그레이드를 선택할 수 있다. 소비자가 레이어별로 독립 업그레이드할 수 있다는 뜻이다.

| 패키지 | npm 이름         | 실제 버전 |
| ------ | ---------------- | --------- |
| 팔레트 | `@carbon/colors` | 11.48.0   |
| 스타일 | `@carbon/styles` | 1.102.0   |
| React  | `@carbon/react`  | 1.103.0   |

컴포넌트 폴더마다 `migrate-to-7.x.md` 같은 마이그레이션 가이드가 동봉된다. Breaking change를 확인하러 외부 문서 사이트를 찾아갈 필요 없이, 코드베이스 안에서 바로 파악할 수 있다.

---

### 정리: Carbon이 택한 트레이드오프

| 설계 선택                      | 얻는 것                                  | 잃는 것                                                 |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------------- |
| 관심사별 패키지 물리적 분리    | 레이어 독립 업그레이드, 선택적 사용 가능 | 초기 설정·학습 비용 높음                                |
| 233개 Semantic Token           | 모든 UI 상태를 토큰으로 커버             | 어떤 토큰을 써야 하는지 파악하는 데 시간 필요           |
| Zone 기반 인라인 테마          | 한 페이지에서 테마 혼용 가능             | SCSS 컴파일 파이프라인 필수                             |
| Productive / Expressive 이분법 | 맥락에 맞는 움직임 일관성                | 개발자가 맥락을 판단해야 하는 부담                      |
| Feature Flag 시스템            | 팀별 점진적 마이그레이션                 | 플래그 관리 복잡도 증가                                 |
| AI/Chat 토큰을 시스템에 흡수   | AI UI 일관성 확보                        | 토큰 수 증가, AI 토큰이 일반 프로젝트에 불필요한 노이즈 |

---

## 2. MUI (Material UI)

### 철학 및 접근 방식

- **"Everything is a Theme" 아키텍처**: 모든 스타일 결정이 `theme` 객체를 통해 이루어짐. 컴포넌트 자체는 변경 없이 테마만 교체해서 완전히 다른 Look & Feel 구현 가능
- **CSS-in-JS + Zero Runtime 전환 중**: 기존 emotion 기반 런타임 CSS-in-JS에서 `zero-styled`(빌드 타임 스타일 추출)로 마이그레이션 진행 중 (`Button.js`에서 `import { styled } from '../zero-styled'` 확인)
- `**sx` prop / `styled` API 통합\*\*: 컴포넌트 사용자가 테마 토큰을 인라인으로 참조할 수 있는 `sx` prop 시스템
- **Slots 패턴**: 컴포넌트 내부 요소(root, startIcon, endIcon 등)를 "슬롯"으로 추상화하고, 각 슬롯에 클래스와 스타일을 독립적으로 주입할 수 있음 → `useUtilityClasses` 훅으로 관리
- **Props-based Variant**: `variant`, `color`, `size` prop 조합으로 스타일 분기, CSS 클래스 자동 조합 (`contained`, `containedPrimary`, `sizeMedium` 등)
- **단일 패키지 집중**: `mui-material` 하나가 모든 컴포넌트를 포함 (Carbon처럼 foundation별로 분리하지 않음)

### 폴더 구조

```
mui/
├── packages/
│   └── mui-material/      # 메인 컴포넌트 패키지 (모든 컴포넌트 포함)
│       └── src/
│           ├── Button/
│           │   ├── Button.js          # 컴포넌트 구현 (styled 기반)
│           │   ├── buttonClasses.ts   # 유틸리티 클래스 정의
│           │   ├── Button.d.ts        # 타입 정의
│           │   └── index.js           # public export
│           ├── ButtonBase/            # 추상 베이스 컴포넌트
│           ├── styles/                # 테마 시스템 (createTheme 등)
│           └── DefaultPropsProvider/  # 전역 기본값 주입
├── webpackBaseConfig.js
├── vitest.config.mts
└── lerna.json             # pnpm + lerna, independent versioning
```

### 디자인 패턴

| 항목              | 내용                                                                       |
| ----------------- | -------------------------------------------------------------------------- |
| **모노레포 방식** | pnpm Workspaces + Lerna (independent versioning) + NX                      |
| **토큰 계층**     | theme 객체 내 `palette`, `typography`, `spacing`, `components` 직접 구조화 |
| **스타일 시스템** | CSS-in-JS (`styled`) + Zero Runtime 마이그레이션 중                        |
| **컴포넌트 단위** | 컴포넌트 폴더 안에 구현·타입·클래스·테스트 일체 포함                       |
| **확장성 패턴**   | `ButtonBase` → `Button` 상속 구조 (Base 컴포넌트를 공유)                   |
| **테스트**        | Vitest (unit) + 브라우저 테스트 (`vitest.config.browser.mts`)              |
| **배포 단위**     | `@mui/material` 단일 패키지 + `@mui/utils`, `@mui/system` 등 유틸 분리     |

---

## 3. Salesforce Lightning Design System (SLDS)

### 철학 및 접근 방식

- **"CSS-Only, Framework-Agnostic" 원칙**: React·Vue 등 특정 프레임워크에 종속되지 않음. 클래스 네임만 따르면 어떤 환경에서도 동작
- **BEM + 네임스페이스**: `.slds-button`, `.slds-button--brand` 같은 네임스페이스 클래스 체계로 기존 Salesforce 앱과의 충돌 방지
- **Design Token을 YAML로 관리**: 토큰을 `.yml` 파일로 정의하고 빌드 시 CSS 변수, SCSS 변수, JS 객체 등 다양한 포맷으로 변환 (`formats/` 디렉토리)
- **Primitive → Aliases 2단계 토큰**: `primitive/` 에서 원시값 정의, `aliases/`에서 의미론적 이름으로 매핑
- **컴포넌트별 토큰 로컬 소유**: 각 컴포넌트 폴더 안에 `tokens/` 서브폴더를 두어 해당 컴포넌트 전용 토큰을 관리 (e.g., `buttons/tokens/color.yml`)
- **Styling Hooks**: CSS 커스텀 프로퍼티를 통한 외부 테마 커스터마이징 레이어 (`styling-hooks/` 별도 관리)
- **멀티 폼팩터**: `touch/`, `form-factor/` 폴더로 모바일·데스크탑 등 폼팩터별 스타일 분기

### 폴더 구조

```
salesforce/
├── ui/
│   ├── components/         # 컴포넌트별 SCSS + 예제
│   │   └── buttons/
│   │       ├── base/           # 기본 버튼 스타일
│   │       ├── stateful/       # 상태 버튼 변형
│   │       ├── dual-stateful/  # 이중 상태 버튼
│   │       ├── with-icon/      # 아이콘 버튼
│   │       ├── mixins/         # SCSS mixin 모음
│   │       ├── kinetics/       # 애니메이션 정의
│   │       ├── tokens/         # 컴포넌트 전용 토큰 (YAML)
│   │       │   ├── color.yml
│   │       │   ├── border-color.yml
│   │       │   └── text-color.yml
│   │       └── docs.mdx
│   ├── dependencies/       # 공용 SCSS 의존성 (typography, layout 등)
│   ├── utilities/          # 유틸리티 클래스 (spacing, text 등)
│   └── vendor/             # normalize.css 등 외부 리셋
├── design-tokens/
│   ├── primitive/          # 원시 토큰 (color-palettes, font-size 등)
│   ├── aliases/            # 의미론적 토큰 (colors, spacing 등)
│   └── themes/             # 테마별 오버라이드
├── styling-hooks/          # CSS 커스텀 프로퍼티 커스터마이징 레이어
├── formats/                # 토큰 빌드 출력 포맷 정의
└── tools/                  # 빌드·생성 스크립트
```

### 디자인 패턴

| 항목              | 내용                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| **모노레포 방식** | 단일 레포 (패키지 분리 없음), gulp 기반 빌드                         |
| **토큰 계층**     | Primitive(YAML) → Aliases(YAML) → Component-local tokens(YAML) 3단계 |
| **스타일 시스템** | SCSS → PostCSS → CSS 변수 변환 파이프라인                            |
| **컴포넌트 단위** | 변형(variant)별 서브폴더 분리 (base, stateful, with-icon 등)         |
| **확장성 패턴**   | SCSS mixin 기반 확장 (`mixins/` 폴더)                                |
| **테스트**        | Jest snapshot + AVA                                                  |
| **배포 단위**     | 단일 npm 패키지 (`@salesforce-ux/design-system`)                     |

---

## 핵심 차이점 요약

| 비교 항목           | Carbon (IBM)           | MUI                       | Salesforce (SLDS)         | DaisyUI                         |
| ------------------- | ---------------------- | ------------------------- | ------------------------- | ------------------------------- |
| **철학**            | 엔터프라이즈 일관성    | Material 기반 테마 시스템 | CSS-Only, 프레임워크 무관 | Tailwind 위의 클래스 압축       |
| **스타일 접근**     | SCSS + CSS 변수        | CSS-in-JS → Zero Runtime  | SCSS → CSS 변수           | CSS Custom Property + `@layer`  |
| **프레임워크 의존** | React 패키지 별도 분리 | React 전용                | 프레임워크 무관           | 프레임워크 무관 (Tailwind 필수) |
| **토큰 수**         | 233개 (세밀함)         | Theme 객체 (JS)           | YAML 다수                 | ~30개 (단순함)                  |
| **색공간**          | HEX, rgba              | HEX, rgba                 | HEX                       | oklch (perceptual uniform)      |
| **테마 수**         | 4개 내장               | 무제한 (객체 교체)        | 제한적                    | 35개 내장                       |
| **테마 전환**       | `.cds--g90` CSS 클래스 | Theme Provider 교체       | CSS 변수 오버라이드       | `data-theme` 속성               |
| **컴포넌트 확장**   | 독립 컴포넌트          | Base 컴포넌트 상속        | SCSS mixin                | 로컬 CSS 변수 교체              |
| **배포 전략**       | 관심사별 다수 패키지   | 기능별 소수 패키지        | 단일 패키지               | 단일 패키지 (Tailwind 플러그인) |
| **접근성 강제**     | 빌드 파이프라인 자동화 | 컴포넌트 수준             | 컴포넌트 수준             | 없음 (개발자 책임)              |
| **대상**            | IBM 제품, 대규모 조직  | 범용                      | Salesforce 생태계         | 개인~중소 팀, 빠른 프로토타이핑 |

> DaisyUI 상세 분석: `[_docs/daisyui/design-system-approach.md](./daisyui/design-system-approach.md)`
