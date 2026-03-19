## Carbon 토큰 시스템 아키텍처 분석

이 문서는 `@carbon/colors`, `@carbon/themes` 패키지를 중심으로 Carbon 디자인 시스템의 **색상 토큰 계층 구조**를 분석합니다.
Tailwind CSS 기반 프로젝트에서 동일한 설계 철학을 적용하는 방법을 함께 정리합니다.

---

## 1. 전체 구조 개요

Carbon의 토큰 시스템은 3개의 계층으로 나뉩니다.

```
Layer 1: Palette Token     (@carbon/colors)
  → 색상 팔레트의 원자 단위. 순수한 색상값만 담는다.

Layer 2: Semantic Token    (@carbon/themes)
  → "이 색은 어디에 쓰인다"는 의미를 부여. 테마에 따라 다른 팔레트 토큰을 가리킨다.

Layer 3: Component Token   (@carbon/themes/component-tokens)
  → 특정 컴포넌트 전용 토큰. 테마별로 별도 정의.
```

이 계층 구조는 **팔레트를 바꾸지 않고 테마만 교체**할 수 있게 해준다.
컴포넌트는 항상 semantic 토큰만 바라보기 때문에, 테마가 바뀌어도 컴포넌트 코드는 수정하지 않아도 된다.

---

## 2. Layer 1 — Palette Token (`@carbon/colors`)

### 2.1 구조

`colors/src/colors.js`는 Carbon이 지원하는 전체 색상 팔레트를 정의한다.

```js
// 단일 색상
export const black = '#000000';
export const white = '#ffffff';

// 색상 계열 (10 ~ 100 단위)
export const blue10 = '#edf5ff';
export const blue20 = '#d0e2ff';
// ...
export const blue100 = '#001141';

// hover 상태 전용 팔레트
export const blue10Hover = '#c9deff';
export const blue60Hover = '#0043ce';
```

### 2.2 팔레트 네이밍 규칙

| 패턴 | 예시 | 의미 |
|------|------|------|
| `{색상}{단계}` | `blue60` | 해당 색상의 특정 밝기 단계 |
| `{색상}{단계}Hover` | `blue60Hover` | hover 상태 전용 색상 |
| 단계 범위 | 10 ~ 100 (10 단위) | 낮을수록 밝고, 높을수록 어둡다 |

**지원하는 색상 계열:**

```
yellow, orange, red, magenta, purple
blue, cyan, teal, green
coolGray, gray, warmGray
+ black, white (단일값)
```

### 2.3 설계 원칙

- **팔레트 토큰은 의미를 갖지 않는다.** `blue60`은 그냥 `#0f62fe`일 뿐. "primary 버튼 색"이라는 의미는 상위 계층에서 부여한다.
- **hover 색상을 별도 토큰으로 분리**했다. SCSS `darken()`이나 `lighten()` 함수로 런타임 계산하지 않고, 디자이너가 명시적으로 승인한 색만 쓴다.
- **집합 객체도 함께 export**한다. 개별 토큰 외에 `colors`, `hoverColors` 객체로 묶어서도 쓸 수 있다.

---

## 3. Layer 2 — Semantic Token (`@carbon/themes`)

### 3.1 개념

Semantic 토큰은 팔레트 색상에 **역할(role)** 을 부여한다.

```js
// themes/src/white.js

import { blue60, gray10, gray20, ... } from '@carbon/colors';

// 팔레트 토큰 → semantic 토큰으로 매핑
export const background = white;           // "배경색"
export const interactive = blue60;         // "인터랙티브 요소의 기본 색"
export const textPrimary = gray100;        // "본문 텍스트"
export const borderSubtle01 = gray20;      // "미묘한 구분선"
```

컴포넌트는 `blue60`을 직접 쓰지 않고 `interactive`를 쓴다. 테마가 바뀌면 `interactive`가 가리키는 팔레트 토큰만 달라진다.

### 3.2 4개 테마 비교

Carbon은 4개의 테마를 제공한다.

| 테마 | colorScheme | background | 특징 |
|------|------------|------------|------|
| `white` | light | `#ffffff` | 기본 밝은 테마 |
| `g10` | light | `gray10` (`#f4f4f4`) | 약간 어두운 밝은 테마 |
| `g90` | dark | `gray90` (`#262626`) | 어두운 테마 |
| `g100` | dark | `gray100` (`#161616`) | 가장 어두운 테마 |

같은 semantic 토큰 이름이 테마마다 다른 팔레트를 가리킨다:

```js
// white.js
export const layer01 = white;         // #ffffff

// g10.js
export const layer01 = gray10;        // #f4f4f4

// g90.js
export const layer01 = gray80;        // #393939

// g100.js
export const layer01 = gray90;        // #262626
```

### 3.3 Semantic 토큰 카테고리

`v11TokenGroup.js`에서 전체 토큰 구조를 확인할 수 있다.

#### Background
```
background                   기본 페이지/앱 배경
backgroundInverse            반전 배경 (다크 테마에서 라이트 컬러)
backgroundBrand              브랜드 강조 배경 (항상 blue60)
backgroundActive             눌림 상태 배경
backgroundHover              호버 상태 배경
backgroundSelected           선택 상태 배경
backgroundSelectedHover      선택+호버 상태 배경
```

#### Layer (계층 배경)
```
layer-01, layer-02, layer-03      각 레이어 깊이의 배경색
layerHover-01~03                  레이어별 hover 상태
layerActive-01~03                 레이어별 active 상태
layerSelected-01~03               레이어별 selected 상태
layerAccent-01~03                 레이어별 accent (강조) 배경
```

> Layer 개념: UI가 카드 위에 모달, 모달 위에 드롭다운 같은 **중첩 구조**를 가질 때, 각 깊이마다 다른 배경색을 쓴다. layer01 → layer02 → layer03 순으로 더 깊은 레이어.

#### Text
```
textPrimary       본문 텍스트
textSecondary     보조 텍스트
textPlaceholder   placeholder
textHelper        helper/설명 텍스트
textError         에러 메시지
textInverse       반전 텍스트 (어두운 배경 위)
textOnColor       색상 배경 위 텍스트
textDisabled      비활성 텍스트
```

#### Support (상태 색상)
```
supportError      에러 (#da1e28)
supportSuccess    성공 (#24a148)
supportWarning    경고 (#f1c21b)
supportInfo       정보 (#0043ce)
supportCaution    주의
```

#### Focus / Border / Icon / Link
각각 역할별로 세분화된 토큰을 제공.

### 3.4 OOP 기반 토큰 메타데이터 시스템

`themes/src/tokens/` 폴더에는 토큰의 **메타데이터를 관리하는 클래스**들이 있다.
실제 스타일 값과는 별개로, 토큰의 구조를 프로그래밍적으로 다루기 위한 시스템이다.

```js
// Token.js — 가장 작은 단위
class Token {
  constructor(name, properties, state) {
    this.kind = 'Token';
    this.name = name;
    this.properties = properties; // ['background', 'border-color'] 등 CSS 프로퍼티
    this.state = state;           // 'hover', 'focus' 등 인터랙션 상태
  }
}

// TokenGroup.js — 관련 토큰의 묶음
// 예: background 그룹 = [background, backgroundHover, backgroundActive, ...]

// TokenSet.js — 함께 쓰여야 하는 토큰의 집합
// 예: layer01 세트 = [layer01, layerHover01, layerActive01, layerSelected01]
```

**이 시스템을 두는 이유:**
- 코드 생성 (SCSS custom property 자동 생성, JSON export 등)
- 문서 자동화 (어떤 토큰이 어떤 CSS 프로퍼티에 쓰이는지 추적)
- 토큰 유효성 검사

---

## 4. Layer 3 — Component Token

### 4.1 개념

Semantic 토큰으로 표현하기 어려운 **컴포넌트 고유의 색상**은 별도 component token으로 분리한다.

`component-tokens/button/tokens.js`를 보면:

```js
const buttonPrimary = {
  whiteTheme: '#0f62fe',
  g10: '#0f62fe',
  g90: '#0f62fe',
  g100: '#0f62fe',
};

const buttonTertiary = {
  whiteTheme: '#0f62fe',    // 라이트 테마: 파란 외곽선 버튼
  g10: '#0f62fe',
  g90: '#ffffff',           // 다크 테마: 흰색 외곽선 버튼
  g100: '#ffffff',
};

const buttonDisabled = {
  whiteTheme: '#c6c6c6',
  g10: '#c6c6c6',
  g90: 'rgb(141 141 141 / 30%)',   // 다크 테마: 반투명 처리
  g100: 'rgb(141 141 141 / 30%)',
};
```

### 4.2 Component Token이 필요한 이유

`buttonTertiary`처럼 **라이트/다크에서 색이 완전히 반전**되는 경우는 semantic 토큰 하나로 표현할 수 없다.
또한 `buttonDisabled`처럼 다크 테마에서만 반투명 처리가 필요한 경우도 있다.

Component token은 이런 **컴포넌트별 예외 케이스**를 명시적으로 관리한다.

---

## 5. Tailwind 프로젝트 적용 패턴

### 5.1 Layer 1 → `tailwind.config.js` 팔레트

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // Carbon의 @carbon/colors와 동일한 구조
      blue: {
        10: '#edf5ff',
        20: '#d0e2ff',
        60: '#0f62fe',
        60Hover: '#0043ce',   // hover 전용 토큰도 명시적으로 정의
      },
      gray: {
        10: '#f4f4f4',
        100: '#161616',
      },
    }
  }
}
```

### 5.2 Layer 2 → CSS Custom Properties

```css
/* semantic 토큰을 CSS 변수로 */
:root {
  --color-background: theme(colors.white);
  --color-layer-01: theme(colors.white);
  --color-interactive: theme(colors.blue.60);
  --color-text-primary: theme(colors.gray.100);
  --color-border-subtle: theme(colors.gray.20);
}

/* 다크 테마 = Carbon g90 */
.dark {
  --color-background: theme(colors.gray.90);
  --color-layer-01: theme(colors.gray.80);
  --color-interactive: theme(colors.blue.40);
  --color-text-primary: theme(colors.white);
  --color-border-subtle: theme(colors.gray.70);
}
```

```js
// tailwind.config.js — semantic 토큰을 Tailwind 유틸리티로
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        'layer-01': 'var(--color-layer-01)',
        interactive: 'var(--color-interactive)',
        'text-primary': 'var(--color-text-primary)',
      }
    }
  }
}
```

### 5.3 Layer 3 → CVA (class-variance-authority)

```ts
import { cva } from 'class-variance-authority';

// Carbon의 component-tokens/button/tokens.js를 CVA로 표현
const button = cva(
  // base
  'inline-flex items-center font-medium transition-colors',
  {
    variants: {
      kind: {
        primary: [
          'bg-[--button-primary] text-white',
          'hover:bg-[--button-primary-hover]',
          'active:bg-[--button-primary-active]',
        ],
        tertiary: [
          'bg-transparent border border-[--button-tertiary] text-[--button-tertiary]',
          'hover:bg-[--button-tertiary-hover]',
        ],
      },
      size: {
        sm: 'h-8 px-4 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { kind: 'primary', size: 'md' },
  }
);
```

CSS에서 component token을 테마별로 정의:

```css
:root {
  --button-primary: #0f62fe;
  --button-primary-hover: #0050e6;
  --button-tertiary: #0f62fe;
}

.dark {
  --button-tertiary: #ffffff;       /* 다크에서 반전 */
  --button-disabled: rgb(141 141 141 / 30%);  /* 다크에서 반투명 */
}
```

---

## 6. 핵심 설계 원칙 요약

| 원칙 | Carbon 구현 | Tailwind 적용 |
|------|------------|--------------|
| **팔레트와 의미 분리** | `@carbon/colors` vs `@carbon/themes` | `theme.colors` (팔레트) vs CSS variables (semantic) |
| **컴포넌트는 semantic 토큰만 참조** | `background`, `interactive` 등 | `var(--color-interactive)` |
| **테마 교체 = 토큰 값만 교체** | white.js → g100.js | `:root` → `.dark` CSS 변수 재정의 |
| **hover는 함수 계산 금지, 명시적 토큰** | `blue60Hover` 별도 정의 | `blue.60Hover` 별도 key 정의 |
| **컴포넌트 예외는 component token으로** | `buttonTertiary` per-theme | CVA + CSS custom property |
| **Layer 개념으로 중첩 UI 대응** | `layer01 ~ layer03` | `--color-layer-01 ~ 03` 세트 |
