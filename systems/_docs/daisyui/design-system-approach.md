# DaisyUI 디자인 시스템 접근 방식 분석

> DaisyUI v5 (`5.5.19`) 기준. Tailwind CSS 4 플러그인 형태의 CSS-Only 컴포넌트 라이브러리.

---

## 핵심 철학: "Tailwind를 그대로 쓰되, 클래스 조합 복잡도를 줄인다"

DaisyUI가 존재하는 이유는 하나다. Tailwind CSS는 강력하지만 컴포넌트 하나를 만들려면 수십 개의 유틸리티 클래스를 조합해야 한다. DaisyUI는 그 조합을 `.btn`, `.card`, `.modal` 같은 의미 있는 단일 클래스로 압축한다.

```html
<!-- Tailwind만 사용할 때 -->
<button class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700
               text-white text-sm font-semibold rounded-md transition-colors
               focus:outline-none focus:ring-2 focus:ring-blue-500 ...">
  Click
</button>

<!-- DaisyUI 사용 시 -->
<button class="btn btn-primary">Click</button>
```

이 단순함이 가능한 이유는 DaisyUI가 **CSS Custom Property(변수)를 토큰으로 쓰는 CSS-Only 레이어**이기 때문이다. React, Vue, Angular 어디에도 종속되지 않는다. HTML 클래스만 붙이면 어떤 환경에서도 동작한다.

---

## 1. 시스템 구성 개요

DaisyUI는 Tailwind CSS의 **플러그인**으로 동작한다. 별도 런타임이 없다. 빌드 시 Tailwind의 `addBase`, `addComponents`, `addUtilities` API를 통해 CSS를 주입한다.

```
사용자의 tailwind.config.js
    └── daisyui 플러그인 등록
            ↓
        index.js (plugin.withOptions)
            ↓
    ┌───────────────────────────────┐
    │  pluginOptionsHandler.js      │  ← 테마 선택, prefix 설정
    │  base/ → addBase()            │  ← CSS 리셋, 루트 색상 설정
    │  components/ → addComponents()│  ← 컴포넌트 클래스
    │  utilities/ → addUtilities()  │  ← 유틸 클래스 (join, glass 등)
    └───────────────────────────────┘
```

---

## 2. 토큰 시스템: CSS Custom Property를 직접 토큰으로

DaisyUI의 토큰은 별도 파일이나 JS 객체가 아니다. **테마 파일 자체가 곧 CSS 변수 선언이다.**

### 토큰 구조

각 테마 파일(e.g. `src/themes/light.css`)은 다음 변수들로 구성된다:

```css
/* src/themes/light.css */
color-scheme: light;

/* 색상 토큰 — oklch 색공간 사용 */
--color-base-100: oklch(100% 0 0);        /* 가장 밝은 배경 */
--color-base-200: oklch(98% 0 0);         /* 카드, 사이드바 배경 */
--color-base-300: oklch(95% 0 0);         /* 테두리, 구분선 배경 */
--color-base-content: oklch(21% 0.006 285.885);  /* 기본 텍스트 */

--color-primary: oklch(45% 0.24 277.023);
--color-primary-content: oklch(93% 0.034 272.788); /* primary 위의 텍스트 */
--color-secondary: oklch(65% 0.241 354.308);
--color-secondary-content: oklch(94% 0.028 342.258);
--color-accent: oklch(77% 0.152 181.912);
--color-accent-content: oklch(38% 0.063 188.416);
--color-neutral: oklch(14% 0.005 285.823);
--color-neutral-content: oklch(92% 0.004 286.32);

/* 상태 색상 */
--color-info:    oklch(74% 0.16 232.661);
--color-success: oklch(76% 0.177 163.223);
--color-warning: oklch(82% 0.189 84.429);
--color-error:   oklch(71% 0.194 13.428);
/* 각 상태 색상에도 -content 쌍이 존재 */

/* 모양 토큰 */
--radius-selector: 0.5rem;  /* 체크박스, 라디오, 토글 등 */
--radius-field: 0.25rem;    /* 입력 필드, 버튼 등 */
--radius-box: 0.5rem;       /* 카드, 모달 등 컨테이너 */

/* 크기 토큰 */
--size-selector: 0.25rem;
--size-field: 0.25rem;

/* 시각 효과 토큰 */
--border: 1px;
--depth: 1;    /* 입체감 강도 (0이면 flat) */
--noise: 0;    /* 노이즈 텍스처 강도 */
```

### oklch 색공간 채택의 의미

DaisyUI v5는 `#hex`나 `rgb()` 대신 **oklch** 색공간을 쓴다. 이는 단순한 기술 선택이 아니라 디자인 시스템 철학이다.

oklch는 `oklch(밝기% 채도 색조)` 형태다. 이 공간에서는 같은 밝기 값끼리 실제로 인간의 눈에 비슷한 밝기로 보인다(perceptual uniformity). 덕분에:

- 테마를 만들 때 "색조(hue)만 바꾸면 자동으로 대비가 유지된다"
- `--color-primary-content`의 역할이 명확해진다: primary 색상 위에서 항상 읽히는 텍스트 색

```css
/* cyberpunk 테마: 밝기/채도가 높은 색 사용 */
--color-base-100: oklch(94.51% 0.179 104.32);   /* 노란빛 배경 */
--color-primary:  oklch(74.22% 0.209 6.35);     /* 붉은 primary */
--radius-selector: 0rem;  /* 각진 모서리 → cyberpunk 느낌 */
--depth: 0;               /* flat 디자인 */

/* nord 테마: 낮은 채도, 차가운 색 */
--color-base-100: oklch(95.127% 0.007 260.731);  /* 거의 흰 배경 */
--color-primary:  oklch(59.435% 0.077 254.027);  /* 낮은 채도 파랑 */
--radius-selector: 1rem;  /* 둥근 모서리 */
--depth: 0;               /* flat */
```

**`--depth`와 `--noise` 토큰**이 독특하다. 이 두 값만 조절하면 컴포넌트 전반의 입체감과 텍스처가 바뀐다. 컴포넌트 CSS 내부에서 `calc(var(--depth) * X%)`로 참조하기 때문에 depth=0이면 완전히 플랫, depth=1이면 미세한 입체감이 생긴다.

---

## 3. 테마 시스템: `data-theme` 속성 기반

### 테마 적용 방식

테마는 `data-theme` 속성으로 전환한다. 별도 JavaScript가 필요 없다.

```html
<html data-theme="dark">    ← 전체 페이지를 dark 테마로
  <body>
    <div data-theme="light"> ← 이 안만 light 테마 (인라인 테마)
      ...
    </div>
  </body>
</html>
```

내부 메커니즘을 보면, `pluginOptionsHandler.js`에서 테마 이름을 받아 다음 셀렉터로 CSS를 주입한다:

```js
// pluginOptionsHandler.js 실제 코드
let selector = `:root:has(input.theme-controller[value=${themeName}]:checked), [data-theme=${themeName}]`
if (flags.includes("--default")) {
  selector = `:where(:root), ${selector}`
}
```

즉, `[data-theme="dark"]`가 붙은 요소에 dark 테마의 CSS 변수들이 스코프된다. 이 안의 모든 컴포넌트는 자동으로 해당 테마 변수를 참조한다.

### 기본 제공 테마: 35가지

`src/themes/` 디렉토리에 35개의 테마 파일이 있다. `light`, `dark`가 기본이고, `cyberpunk`, `nord`, `cupcake`, `dracula`, `synthwave` 등 각자 뚜렷한 개성을 가진 테마들이 포함된다.

각 테마는 동일한 변수 이름을 쓰고 값만 다르다. 새 테마를 만들려면 이 변수 목록만 채우면 된다.

### `theme-controller` 패턴: JS 없는 테마 토글

DaisyUI에는 `theme-controller`라는 특수 클래스가 있다. CSS의 `:has()` 셀렉터를 이용해 체크박스/라디오 버튼 상태만으로 테마를 전환한다.

```html
<!-- JS 없이 테마 토글 -->
<input type="radio" name="theme" class="theme-controller" value="light" />
<input type="radio" name="theme" class="theme-controller" value="dark" />
```

`:root:has(input.theme-controller[value="dark"]:checked)` 셀렉터가 활성화되면 dark 테마 변수가 `:root`에 적용된다.

---

## 4. 컴포넌트 시스템: CSS @layer를 통한 우선순위 관리

DaisyUI가 Tailwind와 충돌하지 않는 핵심 이유는 **CSS `@layer`** 를 적극 활용하기 때문이다.

### @layer 구조

```css
/* 버튼 컴포넌트에서 실제 사용되는 레이어 구조 */
.btn {
  @layer daisyui.l1.l2.l3 {
    /* 기본 스타일 — 가장 낮은 우선순위 */
    @apply inline-flex shrink-0 cursor-pointer ...;
  }
}

.btn-primary {
  @layer daisyui.l1.l2.l3 {
    /* variant 스타일 — 기본보다 높지만 Tailwind 유틸보다 낮음 */
    --btn-color: var(--color-primary);
    --btn-fg: var(--color-primary-content);
  }
}
```

`daisyui.l1.l2.l3`처럼 중첩된 레이어명은 의도적이다. 레이어 이름이 길수록 CSS 캐스케이드에서 낮은 우선순위를 가진다. 이 덕분에 사용자가 `.btn`에 Tailwind 유틸리티 클래스를 추가하면 DaisyUI 기본 스타일을 덮어쓸 수 있다.

```html
<!-- DaisyUI 기본 패딩을 Tailwind로 덮어쓰기 — 충돌 없음 -->
<button class="btn btn-primary px-8">Wide Button</button>
```

### 컴포넌트 내부 토큰 패턴

컴포넌트는 글로벌 색상 토큰을 직접 쓰지 않는다. 대신 **컴포넌트 로컬 CSS 변수**를 거쳐서 참조한다.

```css
/* 버튼 내부 */
.btn {
  --btn-color: var(--color-base-200);   /* 기본값: base 색상 */
  --btn-fg: var(--color-base-content);
  --btn-bg: var(--btn-color);
  background-color: var(--btn-bg);      /* 최종 참조 */
}

.btn-primary {
  --btn-color: var(--color-primary);    /* variant에서 로컬 변수만 교체 */
  --btn-fg: var(--color-primary-content);
}
```

이 간접 참조 구조의 장점: variant 클래스는 `--btn-color`만 바꾸면 된다. hover, active, border, shadow 등 파생되는 모든 값이 `--btn-color` 기준으로 자동 계산된다.

```css
/* hover 상태 — --btn-color 기반으로 자동 계산 */
@media (hover: hover) {
  &:hover {
    --btn-bg: color-mix(in oklab, var(--btn-color), #000 7%);
  }
}

/* border — --btn-bg 기반으로 자동 계산 */
--btn-border: color-mix(in oklab, var(--btn-bg), #000 calc(var(--depth) * 5%));
```

`color-mix(in oklab, ...)` 함수로 hover 색상이나 border 색상을 런타임에 계산한다. 토큰에 hover 색상을 따로 정의하지 않아도 된다.

---

## 5. 폴더 구조

```
daisyui/
├── packages/
│   ├── daisyui/              # 핵심 패키지 (npm: daisyui)
│   │   ├── src/
│   │   │   ├── themes/       # 35개 테마 파일 (각각 CSS 변수 선언)
│   │   │   │   ├── light.css
│   │   │   │   ├── dark.css
│   │   │   │   ├── cyberpunk.css
│   │   │   │   └── ... (35종)
│   │   │   ├── base/         # 글로벌 기반 스타일
│   │   │   │   ├── properties.css    # @property 선언 (CSS 변수 타입 정의)
│   │   │   │   ├── reset.css         # Tailwind preflight 기반 리셋
│   │   │   │   ├── rootcolor.css     # :root, [data-theme] 기본 색상
│   │   │   │   ├── rootscrollgutter.css
│   │   │   │   └── svg.css
│   │   │   ├── components/   # 58개 컴포넌트 (각각 단일 CSS 파일)
│   │   │   │   ├── button.css
│   │   │   │   ├── card.css
│   │   │   │   ├── modal.css
│   │   │   │   └── ... (58종)
│   │   │   └── utilities/    # 유틸리티 클래스
│   │   │       ├── glass.css     # 글래스모피즘 효과
│   │   │       ├── join.css      # 컴포넌트 붙이기 (버튼 그룹 등)
│   │   │       ├── radius.css    # rounded-box, rounded-field 등
│   │   │       └── typography.css
│   │   ├── functions/
│   │   │   ├── plugin.js              # Tailwind withOptions 래퍼
│   │   │   ├── pluginOptionsHandler.js # 테마 선택 + data-theme 셀렉터 주입
│   │   │   └── variables.js           # CSS 변수 목록 정의
│   │   └── index.js          # 플러그인 진입점 (plugin.withOptions export)
│   │
│   ├── docs/                 # 문서 사이트 (SvelteKit)
│   ├── playground/           # 플레이그라운드
│   ├── bundle/               # 빌드 결과물
│   └── logs/                 # 변경 로그
└── package.json              # 루트 모노레포 설정 (bun workspaces)
```

---

## 6. 컴포넌트 수준 디자인 패턴

### 패턴 1: 변형(Variant)은 로컬 변수 교체만 한다

모든 변형(primary, secondary, ghost 등)은 컴포넌트의 로컬 CSS 변수만 바꾼다. CSS 속성을 직접 선언하지 않는다.

```css
.btn-primary  { --btn-color: var(--color-primary); ... }
.btn-ghost    { --btn-bg: #0000; --btn-border: #0000; ... }  /* 투명 */
.btn-outline  { --btn-bg: #0000; --btn-fg: var(--btn-color); ... }
```

### 패턴 2: 크기(Size)는 컴포넌트 로컬 `--size` 변수로

```css
.btn-xs { --size: calc(var(--size-field) * 6); --btn-p: 0.5rem; }
.btn-sm { --size: calc(var(--size-field) * 8); --btn-p: 0.75rem; }
.btn-md { --size: calc(var(--size-field) * 10); --btn-p: 1rem; }   /* 기본 */
.btn-lg { --size: calc(var(--size-field) * 12); --btn-p: 1.25rem; }
.btn-xl { --size: calc(var(--size-field) * 14); --btn-p: 1.5rem; }
```

`--size-field` 토큰이 기준이 되기 때문에, 테마에서 `--size-field`를 바꾸면 모든 크기가 동시에 조정된다.

### 패턴 3: `join`으로 컴포넌트 조합

`.join` 유틸리티는 자식 요소들의 `border-radius`를 CSS 변수로 제어해서, 인접한 컴포넌트의 모서리를 자동으로 각지게 만든다. JavaScript 없이 순수 CSS로 "버튼 그룹" 패턴을 구현한다.

```html
<div class="join">
  <button class="btn join-item">Left</button>
  <button class="btn join-item">Center</button>
  <button class="btn join-item">Right</button>
</div>
```

내부적으로 `:first-child`, `:last-child` CSS 셀렉터를 이용해 각 방향의 radius 변수(`--join-ss`, `--join-se`, `--join-es`, `--join-ee`)를 0으로 설정한다.

### 패턴 4: `checkbox`/`radio`를 버튼처럼 쓰기

`.btn` 클래스를 `input[type="checkbox"]`나 `input[type="radio"]`에 직접 붙일 수 있다. 체크 상태가 되면 `--btn-color: var(--color-primary)`가 활성화된다.

```html
<input type="checkbox" class="btn btn-primary" aria-label="Toggle" />
```

```css
/* button.css */
&:where(input:checked:not(.filter .btn)) {
  --btn-color: var(--color-primary);
  --btn-fg: var(--color-primary-content);
}
```

이것이 가능한 이유는 컴포넌트 스타일이 HTML 태그에 종속되지 않고, 클래스에만 종속되기 때문이다.

---

## 7. 디자인 시스템 관점 정리

### DaisyUI가 해결하는 문제

| 문제 | 해결 방식 |
|------|---------|
| Tailwind 유틸 클래스 조합이 복잡하다 | 의미 있는 컴포넌트 클래스로 압축 |
| 다크모드/테마 전환이 번거롭다 | `data-theme` 속성 + CSS 변수로 완전 자동화 |
| 테마가 달라도 컴포넌트를 다시 만들어야 한다 | 토큰 값만 바꾸면 모든 컴포넌트가 테마를 따름 |
| 프레임워크별로 다시 구현해야 한다 | CSS-Only, 어떤 프레임워크에서도 동일하게 동작 |

### DaisyUI의 설계 트레이드오프

| 설계 선택 | 얻는 것 | 잃는 것 |
|-----------|---------|---------|
| Tailwind 플러그인으로만 동작 | 설치·통합이 단순함, Tailwind 생태계 그대로 활용 | Tailwind 없이는 사용 불가 |
| CSS-Only, JS 런타임 없음 | 모든 프레임워크 호환, 번들 사이즈 없음 | 복잡한 상태 관리 컴포넌트는 직접 구현 필요 |
| 토큰 수를 최소화 (약 30개) | 테마 만들기 쉬움, 시스템 이해 빠름 | Carbon(233개)에 비해 세밀한 제어 불가 |
| `color-mix()`로 파생색 자동 계산 | hover/border 색상 따로 정의 불필요 | 파생 색상의 예측 가능성 낮아질 수 있음 |
| 35개 내장 테마 | 즉시 사용 가능, 빠른 프로토타이핑 | 기업용 브랜드 커스터마이징엔 추가 작업 필요 |
| `@layer`로 Tailwind와 공존 | 유틸리티 클래스로 자유롭게 덮어쓰기 가능 | 레이어 우선순위 이해 없으면 스타일 충돌 |

---

## 8. 다른 시스템과의 핵심 차이

| 비교 | Carbon (IBM) | DaisyUI |
|------|-------------|---------|
| **철학** | 엔터프라이즈 일관성, 접근성 강제 | 개발자 속도, 프레임워크 자유 |
| **토큰 수** | 233개 (세밀한 제어) | ~30개 (단순함 우선) |
| **프레임워크** | React 패키지 별도 제공 | CSS-Only, 어디서나 동일 |
| **테마 수** | 4개 (White/G10/G90/G100) | 35개 내장 |
| **테마 전환** | CSS 클래스 (`.cds--g90`) | `data-theme` 속성 |
| **색공간** | HEX, rgba | oklch (perceptual uniform) |
| **접근성** | 빌드 파이프라인에 강제 | 컴포넌트 CSS 수준, 자동화 없음 |
| **설치 복잡도** | 높음 (SCSS 컴파일, 패키지 다수) | 낮음 (Tailwind 플러그인 한 줄) |
| **대상** | IBM 제품, 대규모 조직 | 개인 프로젝트 ~ 중소 팀 |
