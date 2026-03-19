## Salesforce Lightning Design System (SLDS) 버튼 컴포넌트 아키텍처 분석

이 문서는 `systems/salesforce/ui/components/buttons/`를 중심으로 SLDS의 컴포넌트 설계 방식을 분석합니다.
Carbon 분석과 동일한 목적으로, 향후 우리 디자인 시스템 설계 시 아키텍처 레퍼런스로 활용합니다.

---

## 1. 전체 구조 개요

SLDS는 97개의 컴포넌트를 `ui/components/` 아래에 두고, 각 컴포넌트는 다음 구조를 따른다.

```
{component}/
├── base/               필수. 컴포넌트의 기본 변형
│   ├── _index.scss     스타일 정의
│   ├── example.jsx     React 예제 컴포넌트 (문서 + 개발용)
│   └── _touch.scss     터치/모바일 특화 스타일 (선택)
├── {variant}/          선택. 추가 변형 (stateful, dual-stateful 등)
│   ├── _index.scss
│   └── example.jsx
├── mixins/             SCSS mixin 정의
│   └── _index.scss
├── kinetics/           애니메이션 효과 (선택)
│   └── _index.scss
├── tokens/             컴포넌트 전용 디자인 토큰 (YAML)
│   ├── color.yml
│   ├── text-color.yml
│   ├── border-color.yml
│   └── border-radius.yml
├── __tests__/
│   └── snapshot.spec.jsx
├── docs.mdx            Storybook 문서
├── index.stories.js    Storybook 스토리 자동 생성
└── RELEASENOTES.md
```

**Carbon과의 구조 비교:**

| 항목 | Carbon | SLDS |
|------|--------|------|
| 변형 정의 | TypeScript `as const` 상수 배열 | `base/`, `stateful/` 등 **서브디렉토리로 분리** |
| 스타일 | `@carbon/styles`에서 중앙 관리 | 컴포넌트 폴더 내 `_index.scss`에 직접 정의 |
| 토큰 | JS 파일 (`tokens/v11TokenGroup.js`) | **YAML 파일** per-component |
| 문서 | `.mdx` + Storybook | `.mdx` + Storybook (동일) |
| 테스트 | Jest snapshot | Jest + Enzyme snapshot |

---

## 2. 변형 시스템 (Variant System)

### 2.1 서브디렉토리 기반 변형 분리

SLDS 버튼은 복잡도에 따라 변형을 **별도 디렉토리**로 나눈다.

```
buttons/
├── base/           단순 버튼 (primary, destructive, ghost 등 스타일 변형)
├── stateful/       on/off 토글 버튼
├── dual-stateful/  두 가지 상태를 오가는 버튼
└── with-icon/      아이콘 포함 버튼 예시
```

`base/`는 스타일 변형(brand, neutral, destructive...)을 props로 처리하고,
`stateful/`, `dual-stateful/`처럼 **동작이 근본적으로 다른** 경우만 별도 디렉토리로 분리한다.

### 2.2 Props 기반 스타일 분기 (base 내부)

```jsx
// base/example.jsx
const Button = ({
  isBrand,
  isNeutral,
  isOutlineBrand,
  isInverse,
  isDestructive,
  isTextDestructive,
  isSuccess,
  use = 'button',
  ...
}) => {
  const Tag = use; // 'button' | 'a'

  return (
    <Tag
      className={classNames('slds-button', {
        'slds-button_brand': isBrand,
        'slds-button_neutral': isNeutral,
        'slds-button_outline-brand': isOutlineBrand,
        'slds-button_inverse': isInverse,
        'slds-button_destructive': isDestructive,
        'slds-button_text-destructive': isTextDestructive,
        'slds-button_success': isSuccess,
      })}
    >
      {children}
    </Tag>
  );
};
```

**Carbon과의 차이점:**

```ts
// Carbon — 허용 값을 상수 배열로 고정 (컴파일 타임 검증)
const ButtonKinds = ['primary', 'secondary', 'ghost', ...] as const;
type ButtonKind = (typeof ButtonKinds)[number];

// SLDS — boolean props 조합으로 클래스 분기 (런타임 적용)
// 어떤 조합이 유효한지는 PropTypes 커스텀 검증기로 런타임에 확인
```

### 2.3 커스텀 PropTypes 검증기

`shared/helpers/prop-types/`에 재사용 가능한 검증기가 있다.

```js
// cannot-be-set-with.js
// 두 prop이 동시에 설정되면 경고
CannotBeSetWith('disabled')
// → use="a" 이면서 disabled가 있으면 경고

// is-dependent-on.js
// 다른 prop이 있어야만 유효한 경우
IsDependentOn('iconName')
// → iconPosition은 iconName 없이 단독으로 쓸 수 없음
```

Carbon의 PropTypes 배열 검증 대신, **prop 간의 관계**를 명시적으로 선언하는 방식.

---

## 3. 스타일 아키텍처 — CSS Custom Properties 시스템

### 3.1 Styling Hooks

SLDS 스타일의 핵심은 **CSS Custom Property(변수)를 통한 런타임 커스터마이징**이다.

```scss
// base/_index.scss
.slds-button {
  // CSS 변수로 스타일을 노출 (기본값은 fallback으로)
  padding-block-start: var(--slds-c-button-spacing-block-start, ...);
  background: var(--slds-c-button-color-background, transparent);
  border-color: var(--slds-c-button-color-border, transparent);
  color: var(--slds-c-button-text-color, var(--slds-g-color-neutral-base-10));
}
```

**네이밍 규칙:**

```
--slds-c-{component}-{property}-{sub-property}
         ↑           ↑           ↑
      컴포넌트명    CSS 속성    세부 속성

예시:
--slds-c-button-color-background     버튼 배경색
--slds-c-button-color-border         버튼 테두리색
--slds-c-button-text-color           버튼 텍스트색
--slds-c-button-spacing-block-start  버튼 상단 패딩
```

### 3.2 변형별 CSS 변수 재할당

각 변형 클래스는 CSS 변수를 덮어씌우는 방식으로 동작한다.

```scss
// base/_index.scss

// brand 변형
.slds-button_brand {
  --slds-c-button-color-background: var(--slds-g-color-brand-base-50);
  --slds-c-button-color-border: var(--slds-g-color-brand-base-50);
  --slds-c-button-text-color: white;

  &:hover {
    --slds-c-button-color-background: var(--slds-g-color-brand-base-60);
  }

  &:active {
    --slds-c-button-color-background: var(--slds-g-color-brand-base-70);
  }

  &[disabled] {
    --slds-c-button-color-background: var(--slds-g-color-neutral-base-80);
  }
}

// destructive 변형
.slds-button_destructive {
  --slds-c-button-color-background: var(--slds-g-color-error-base-40);
  --slds-c-button-text-color: white;
}
```

**Carbon과의 차이점:**

| | Carbon | SLDS |
|---|---|---|
| 테마 적용 방식 | SCSS 변수 컴파일 타임 치환 | CSS Custom Property 런타임 치환 |
| 커스터마이징 | 패키지 재빌드 필요 | CSS 변수 오버라이드만으로 가능 |
| 컴포넌트 토큰 | JS 객체 (테마별 색상값) | CSS 변수 (브라우저에서 바로 오버라이드) |

### 3.3 SCSS Mixin으로 변형 추상화

```scss
// mixins/_index.scss
@mixin button-shape($api-variant, $reassign: true) {
  padding: ...;
  text-align: center;

  @if $reassign {
    // CSS 변수 재할당 포함
    --slds-c-button-color-background: ...;
  }
}

// dual-stateful/_index.scss에서 사용
.slds-button_dual-stateful.slds-is-pressed {
  @include button-shape(brand);  // brand 스타일을 pressed 상태에 적용
}
```

---

## 4. Stateful 버튼 패턴

### 4.1 Stateful Button (on/off 토글)

```jsx
// stateful/example.jsx
const StatefulButton = ({ ...props }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <button
      className={classNames('slds-button slds-button_neutral', {
        'slds-is-selected': isSelected,
        'slds-not-selected': !isSelected,
      })}
      aria-pressed={isSelected}
      onClick={() => setIsSelected(!isSelected)}
    >
      {/* 세 가지 텍스트 레이어 — CSS로 상태에 따라 visibility 제어 */}
      <span className="slds-text-not-selected">Follow</span>
      <span className="slds-text-selected">Following</span>
      <span className="slds-text-selected-focus">Unfollow</span>
    </button>
  );
};
```

**텍스트 3벌 패턴:**

```scss
// stateful/_index.scss
.slds-button {
  .slds-text-selected { display: none; }
  .slds-text-selected-focus { display: none; }
}

.slds-is-selected {
  .slds-text-not-selected { display: none; }
  .slds-text-selected { display: inline; }

  &:focus .slds-text-selected { display: none; }
  &:focus .slds-text-selected-focus { display: inline; }
}
```

JS로 텍스트를 교체하지 않고, **CSS visibility 제어**로 상태별 텍스트를 관리한다.
접근성(스크린 리더) 관점에서도 `aria-pressed`로 상태를 전달하므로 텍스트 3벌이 필요 없다.
다만 시각적으로 hover/focus 시 텍스트가 바뀌는 UX를 구현하기 위한 패턴이다.

### 4.2 Dual Stateful Button

```jsx
// dual-stateful/example.jsx
// neutral ↔ brand 두 스타일을 오가는 버튼
<button
  className={classNames('slds-button slds-button_dual-stateful', {
    'slds-button_neutral': !isPressed,
    'slds-is-pressed': isPressed,
  })}
  aria-pressed={isPressed}
>
  <span className="slds-text-not-pressed">Like</span>
  <span className="slds-text-pressed">Liked</span>
</button>
```

`.slds-is-pressed` 상태에서 mixin을 통해 brand 스타일이 적용된다:

```scss
.slds-button_dual-stateful.slds-is-pressed {
  @include button-shape(brand);
}
```

---

## 5. Kinetics 애니메이션 시스템

SLDS만의 독특한 기능으로, 포인터(마우스/터치) 위치를 추적해 애니메이션 원점을 동적으로 계산한다.

### 5.1 동작 방식

```jsx
// base/example.jsx
const Button = ({ kxScope, kxType }) => {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // 포인터 위치를 CSS 변수로 전달
    e.currentTarget.style.setProperty(
      '--slds-kx-button-pointer-position-x',
      `${e.clientX - rect.left}px`
    );
    e.currentTarget.style.setProperty(
      '--slds-kx-button-pointer-position-y',
      `${e.clientY - rect.top}px`
    );
  };

  return (
    <button
      kx-scope={kxScope}
      kx-type={kxType}        // 'ripple' | 'underline'
      onMouseMove={handleMouseMove}
    />
  );
};
```

### 5.2 두 가지 애니메이션 타입

```scss
// kinetics/_index.scss

// 1. Ripple 효과 — 클릭 지점에서 원형 파동
[kx-scope="button"][kx-type="ripple"]::after {
  left: var(--slds-kx-button-pointer-position-x);
  top: var(--slds-kx-button-pointer-position-y);
  animation: slds-kx-button_ripple 0.3s ease-out;
}

@keyframes slds-kx-button_ripple {
  from { transform: scale(0); opacity: 0.4; }
  to   { transform: scale(3); opacity: 0; }
}

// 2. Underline 효과 — 포인터 x 위치에서 밑줄이 퍼짐
[kx-scope="button"][kx-type="underline"]::after {
  transform-origin: var(--slds-kx-button-pointer-position-x) 0;
  transition: transform 0.2s ease;
}

// 접근성: 애니메이션 선호 없음
@media (prefers-reduced-motion: reduce) {
  [kx-scope="button"] { animation: none; }
}
```

---

## 6. 컴포넌트 토큰 (YAML 방식)

SLDS는 컴포넌트 전용 토큰을 **YAML 파일**로 관리한다.

```yaml
# buttons/tokens/color.yml
global:
  type: color
  category: button-color

imports:
  - ../../shared/design-tokens/alias/color.yml

props:
  COLOR_BACKGROUND_BUTTON_BRAND:
    value: '{!COLOR_BRAND}'
    comment: Background color for brand button
  COLOR_BACKGROUND_BUTTON_BRAND_HOVER:
    value: '{!COLOR_BRAND_DARK}'
  COLOR_BACKGROUND_BUTTON_DESTRUCTIVE:
    value: '{!COLOR_ERROR}'
```

Carbon의 `component-tokens/button/tokens.js`와 목적은 같지만 형식이 다르다.

| | Carbon | SLDS |
|---|---|---|
| 형식 | JS 객체 (테마별 분기 포함) | YAML (툴체인이 CSS 변수 생성) |
| 처리 시점 | 빌드 타임 (JS import) | 빌드 타임 (YAML → CSS 변환) |
| 테마 분기 | `{ whiteTheme: ..., g90: ... }` | CSS Custom Property로 런타임 처리 |

---

## 7. BEM 네이밍 컨벤션

SLDS는 BEM(Block Element Modifier) 구조를 따른다.

```
slds-{block}             컴포넌트 블록
slds-{block}_{modifier}  변형 (구분자: 언더스코어)
slds-{block}__{element}  하위 요소 (구분자: 더블 언더스코어)

예시:
slds-button              버튼 블록
slds-button_brand        brand 변형
slds-button_neutral      neutral 변형
slds-button__icon        버튼 내부 아이콘 요소
slds-button__icon_left   아이콘 왼쪽 배치
```

> 구 버전 호환: `slds-button--brand` (더블 하이픈) 표기도 지원하나 deprecated.

---

## 8. Carbon vs SLDS 핵심 비교

| 항목 | Carbon | SLDS |
|------|--------|------|
| **변형 정의** | `as const` 배열 + TS 타입 | boolean props + classNames |
| **prop 검증** | PropTypes 배열 검증 | 커스텀 `CannotBeSetWith` / `IsDependentOn` |
| **스타일 격리** | SCSS 중앙 패키지 (`@carbon/styles`) | 컴포넌트 내 SCSS + CSS 변수 노출 |
| **런타임 테마** | CSS Custom Property (v11+) | CSS Custom Property (처음부터) |
| **컴포넌트 토큰** | JS 객체 (테마별 하드코딩) | YAML → CSS 변수 자동 생성 |
| **상태 텍스트** | JS 조건부 렌더링 | CSS visibility 제어 (텍스트 3벌) |
| **애니메이션** | 없음 (별도 패키지) | Kinetics (포인터 추적 내장) |
| **네이밍** | BEM 변형 (`button--primary`) | BEM 표준 (`button_brand`) |

---

## 9. Tailwind 프로젝트 적용 포인트

### Styling Hooks 패턴 → Tailwind arbitrary properties

```tsx
// SLDS 방식: CSS 변수를 외부에 노출해서 오버라이드 허용
// → Tailwind에서는 arbitrary CSS variable로 동일 효과

// 기본 버튼
<button className="bg-[--btn-bg] text-[--btn-text] border-[--btn-border]" />

// 커스텀 테마 적용 (CSS 변수만 바꾸면 됨)
<div style={{ '--btn-bg': '#0070d2', '--btn-text': 'white' }}>
  <button className="bg-[--btn-bg] text-[--btn-text]" />
</div>
```

### CannotBeSetWith 패턴 → Zod 또는 TypeScript discriminated union

```ts
// SLDS의 CannotBeSetWith을 TypeScript 타입으로
type ButtonProps =
  | { as: 'button'; disabled?: boolean }
  | { as: 'a'; href: string };  // a 태그는 disabled 없음
```

### Stateful 텍스트 3벌 패턴 → group 유틸리티

```tsx
// SLDS의 CSS visibility 패턴을 Tailwind group으로 구현
<button className="group">
  <span className="group-data-[pressed=false]:block group-data-[pressed=true]:hidden">
    Follow
  </span>
  <span className="group-data-[pressed=false]:hidden group-data-[pressed=true]:block">
    Following
  </span>
</button>
```
