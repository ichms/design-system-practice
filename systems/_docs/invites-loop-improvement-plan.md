## invites-loop 디자인 시스템 개선 계획

이 문서는 Carbon, Salesforce Lightning Design System(SLDS), MUI(Material UI) 분석을 바탕으로
`invites-loop-web-h9`의 디자인 시스템을 어떻게 보완할지를 정리한 문서입니다.

참고 분석 문서:

- `docs/carbon/token-system-architecture.md`
- `docs/carbon/button-design-system.md`
- `docs/salesforce/button-component-architecture.md`
- `docs/mui/button-component-architecture.md`

프로젝트 내부 기존 규칙 문서:

- `packages/invites-ui/.agents/skills/design-system/rules/DS-01` — cva/cn 스타일링 규칙
- `packages/invites-ui/.agents/skills/design-system/rules/DS-02` — Tailwind v4 토큰 주의사항
- `packages/invites-ui/.agents/skills/design-system/HUMAN_GUIDE.md` — shadcn/ui 마이그레이션 계획 포함

---

## 1. 토큰 시스템 — 3계층 구조로 재설계

### 현재 문제

`packages/config-tailwind/tailwind.config.mjs`에 팔레트 색상과 semantic 색상이 혼재되어 있다.

```js
// 현재: 한 곳에 flat하게 섞여 있음
colors: {
  blue: { 50: '#1A71FF', ... },       // 팔레트 토큰
  'button-primary': '#1A71FF',        // semantic 토큰
  'button-primary-hover': '#...',     // 같은 레벨에 공존
}
```

팔레트를 수정하면 semantic 토큰과의 연결이 끊기고, semantic 토큰을 추가할수록 config가 비대해진다.

### 개선 방향

Carbon의 3계층 구조를 Tailwind + CSS Custom Property로 구현한다.

```
Layer 1: Palette Token    tailwind.config.mjs의 theme.colors (원자 색상값)
Layer 2: Semantic Token   globals.css의 CSS Custom Property (:root에 정의)
Layer 3: Component Token  컴포넌트별 CSS Custom Property (CVA와 함께 사용)
```

**Layer 1 — Palette (tailwind.config.mjs)**

```js
// 순수한 색상값만. 의미 없음.
colors: {
  blue: {
    10: '#EBF2FF',
    50: '#1A71FF',   // primary 후보
    60: '#0050E6',   // hover 후보
    ...
  },
  neutral: { 5: '...', 10: '...', ... },
}
```

**Layer 2 — Semantic (globals.css)**

```css
:root {
  /* 배경 */
  --color-background: theme(colors.neutral.5);
  --color-background-inverse: theme(colors.neutral.99);

  /* 인터랙티브 */
  --color-interactive: theme(colors.blue.50);
  --color-interactive-hover: theme(colors.blue.60);

  /* 텍스트 */
  --color-text-primary: theme(colors.neutral.99);
  --color-text-secondary: theme(colors.neutral.60);
  --color-text-disabled: theme(colors.neutral.40);

  /* 피드백 상태 */
  --color-error: theme(colors.red.50);
  --color-success: theme(colors.green.50);
  --color-warning: theme(colors.orange.50);
}
```

**Layer 3 — Component (컴포넌트 파일 또는 별도 tokens.css)**

```css
:root {
  --invites-c-button-color-background: var(--color-interactive);
  --invites-c-button-color-background-hover: var(--color-interactive-hover);
  --invites-c-button-text-color: white;
  --invites-c-button-color-border: transparent;
}
```

**참고:** `docs/carbon/token-system-architecture.md` §2, §3

---

## 2. 버튼 컴포넌트 — variant 체계 확장

### 현재 문제

`BlockButton`은 `colorType: blue | grey`, `size: L | M | S` 두 가지 축만 있다.
실제 서비스에서 필요한 ghost, outline, destructive 등이 없어 매번 별도 컴포넌트를 만들게 된다.

### 전제: shadcn/ui 치환 계획과 정렬

`HUMAN_GUIDE.md` §9에 shadcn/ui 치환 계획이 이미 존재한다.
variant 이름을 shadcn 컨벤션에 맞춰 설계해두면 마이그레이션 비용이 최소화된다.

| variant       | 역할                  | shadcn 대응   |
| ------------- | --------------------- | ------------- |
| `default`     | 파란 채움 (현재 blue) | `default`     |
| `secondary`   | 회색 채움 (현재 grey) | `secondary`   |
| `outline`     | 외곽선만              | `outline`     |
| `ghost`       | 배경 없음, 텍스트만   | `ghost`       |
| `destructive` | 빨간 채움 (삭제/경고) | `destructive` |
| `link`        | 링크 스타일           | `link`        |

size는 `sm` / `md`(default) / `lg` / `icon` 으로 맞춘다.

### MUI 관점 보완: variant × color 직교 분리 고려

MUI는 **시각(variant)**과 **의미(color)**를 독립 prop으로 분리한다.

```
MUI:    variant="outlined" + color="error"   → outlined 형태의 빨간 버튼
shadcn: variant="destructive"                → 빨간 채움 버튼 (시각 + 의미 묶음)
```

shadcn 방식(`variant`에 시각+의미 묶기)은 단순하고 현 팀 규모에 적합하다.
단, `n × m` 조합이 필요해지는 시점(예: outline 형태의 error 버튼)에는 MUI 방식으로 전환이 유리하다.

**현재 권장: shadcn 컨벤션 유지.** 단, `color` 축 분리가 필요한 케이스가 2개 이상 생기면 재검토.

### 개선 방향

Carbon의 `as const` 패턴으로 허용 값을 고정하고, DS-01 규칙(cva + VariantProps)을 준수한다.

**⚠️ DS-02 제약사항 준수 필수**

- `text-white` 사용 금지 → `text-common-100` 사용
- camelCase 토큰을 `text-*`에 직접 사용 금지 → primitive 토큰으로 매핑해서 사용
- `cn.ts`에 `extendTailwindMerge`로 커스텀 fontSize 등록 필요 (fontSize + textColor 충돌 방지)

**CVA variant 구성 (DS-01 준수)**

```ts
// DS-01: cva 구조 + defaultVariants + VariantProps
const buttonVariants = cva(
  "inline-flex items-center font-medium transition-colors rounded-radius-8 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-50 text-common-100 active:bg-blue-40", // text-white 금지 → text-common-100
        secondary: "bg-blueGrey-99 text-neutral-5 active:bg-blueGrey-90",
        outline: "bg-transparent border border-blue-50 text-blue-50",
        ghost: "bg-transparent text-blue-50 hover:bg-blue-50/10",
        destructive: "bg-red-50 text-common-100 active:bg-red-40",
      },
      size: {
        sm: "h-40 px-12 text-bodySm-SB",
        md: "h-50 px-14 text-bodyMd-SB",
        lg: "h-56 px-16 text-bodyLg-SB",
        icon: "h-40 w-40 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// DS-01: VariantProps로 타입 추출
export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

**DS-01: cn 병합 순서**

```tsx
// variant 결과 먼저, 사용자 className 나중 (외부 오버라이드 허용)
<button className={cn(buttonVariants({ variant, size }), className)} />
```

**참고:** `docs/carbon/button-design-system.md` §2.1, `docs/salesforce/button-component-architecture.md` §3.2, `docs/mui/button-component-architecture.md` §2.1 §7.1, DS-01, DS-02

---

## 3. CSS Custom Property 노출 — Styling Hooks

### 현재 문제

컴포넌트 스타일이 Tailwind 클래스로 하드코딩되어 있어, 특정 맥락에서 색상을 바꾸려면
별도 컴포넌트를 만들거나 `className` override에 의존해야 한다.

```tsx
// 현재: 내부 클래스 직접 덮어씌우기
<BlockButton className="bg-green-500" /> // 불안정
```

### 개선 방향

SLDS의 Styling Hooks 패턴처럼 CSS 변수를 공식 커스터마이징 인터페이스로 노출한다.

```tsx
// 개선 후: CSS 변수 오버라이드로 커스터마이징
<div style={{ "--invites-c-button-color-background": "#00A86B" }}>
  <BlockButton kind="primary">특수 버튼</BlockButton>
</div>
```

컴포넌트 내부 SCSS/className은 변경 없이, 소비하는 쪽에서 변수만 바꾸면 된다.

**문서화 형식 (컴포넌트별 토큰 테이블)**

| CSS 변수                                    | 기본값                           | 영향 범위   |
| ------------------------------------------- | -------------------------------- | ----------- |
| `--invites-c-button-color-background`       | `var(--color-interactive)`       | 배경색      |
| `--invites-c-button-color-background-hover` | `var(--color-interactive-hover)` | hover 배경  |
| `--invites-c-button-text-color`             | `white`                          | 텍스트 색   |
| `--invites-c-button-color-border`           | `transparent`                    | 테두리 색   |
| `--invites-c-button-radius`                 | `var(--radius-8)`                | 모서리 반경 |

### MUI 관점 보완: variant별 CSS 변수 위임 패턴

MUI는 variant별로 CSS 변수에 값을 할당하고, 기본 스타일은 그 변수를 소비하는 구조다.
SLDS의 "컴포넌트별 수동 정의"와 달리 **variant 추가가 CSS 변수 할당 1개**로 완결된다.

```css
/* 기본 스타일: CSS 변수를 소비 */
.btn {
  background: var(--invites-c-button-bg);
  color: var(--invites-c-button-text);
  border-color: var(--invites-c-button-border, transparent);
}

/* 각 variant는 CSS 변수에 값을 주입 */
.btn-default {
  --invites-c-button-bg: var(--color-interactive);
  --invites-c-button-text: white;
}
.btn-outline {
  --invites-c-button-bg: transparent;
  --invites-c-button-text: var(--color-interactive);
  --invites-c-button-border: var(--color-interactive);
}
.btn-ghost {
  --invites-c-button-bg: transparent;
  --invites-c-button-text: var(--color-interactive);
}
```

Tailwind 환경에서는 cva variant 클래스가 이 역할을 담당하므로,
향후 CSS Modules나 SCSS로 이전 시 자연스럽게 이 패턴으로 전환된다.

**참고:** `docs/salesforce/button-component-architecture.md` §3.1, §3.3, `docs/mui/button-component-architecture.md` §2.2 §7.2

---

## 4. Loading 상태 내장 — isLoading prop

### 현재 문제

버튼 클릭 후 비동기 작업 중 로딩 상태를 표현할 방법이 없다.
현재는 사용자가 외부에서 `disabled`를 걸거나 별도 Spinner 컴포넌트를 직접 조합해야 한다.

### 개선 방향

MUI v6의 `loading` prop 내장 패턴을 참고해 버튼에 로딩 상태를 포함시킨다.

```tsx
// packages/invites-ui/src/component/Button.tsx
export interface ButtonProps extends ... {
  isLoading?: boolean;
  loadingPosition?: 'start' | 'center' | 'end';  // 기본: center
}

export const Button = ({ isLoading, loadingPosition = 'center', leftIcon, rightIcon, children, ...props }) => {
  return (
    <button disabled={isLoading || props.disabled} aria-busy={isLoading} ...>
      {isLoading && loadingPosition === 'start' && <Spinner size={16} />}
      {loadingPosition === 'center' ? (
        <span className={cn(isLoading && 'invisible')}>{children}</span>
      ) : children}
      {isLoading && loadingPosition === 'center' && (
        <span className="absolute"><Spinner size={16} /></span>
      )}
      {isLoading && loadingPosition === 'end' && <Spinner size={16} />}
    </button>
  );
};
```

**접근성 (MUI §5.1 참고)**

- `aria-busy={true}` — 스크린 리더에 로딩 중임을 전달
- `disabled` 처리 — 중복 클릭 방지
- `center` 위치 시 children을 `invisible`로 처리해 레이아웃 변화 없이 스피너 오버레이

> MUI가 `loading`을 별도 `LoadingButton`에서 본체로 통합한 이유:
> import를 분리해도 어차피 같이 쓰게 되고, 초기 설계 시부터 내장하는 게 유지보수에 유리하다.

**참고:** `docs/mui/button-component-architecture.md` §2.5 §5.1 §7.3

---

## 5. Stateful 버튼 패턴 추가

### 현재 문제

on/off 상태를 가진 버튼(팔로우, 좋아요, 필터 토글 등)이 필요할 때 매번 상태 관리 로직을
컴포넌트 외부에서 직접 처리해야 한다. 재사용 가능한 stateful 패턴이 없다.

### 개선 방향

SLDS의 Stateful Button 패턴을 참고해 `ToggleButton`을 별도 컴포넌트로 분리한다.

```tsx
// packages/invites-ui/src/component/ToggleButton.tsx
const ToggleButton = ({
  defaultPressed = false,
  onPressedChange,
  children,
}) => {
  const [isPressed, setIsPressed] = useState(defaultPressed);

  return (
    <button
      aria-pressed={isPressed}
      onClick={() => {
        setIsPressed(!isPressed);
        onPressedChange?.(!isPressed);
      }}
      className={cn(
        blockButton({ kind: "tertiary" }),
        isPressed && "bg-[--color-interactive] text-white border-transparent",
      )}
    >
      {children}
    </button>
  );
};
```

> SLDS의 텍스트 3벌 패턴(CSS visibility 제어)은 hover 시 텍스트 교체 UX가 필요한 경우에만 도입.
> 현 서비스에서 필요성이 확인되면 추가 검토.

**참고:** `docs/salesforce/button-component-architecture.md` §4

---

## 6. 컴포넌트 prop 검증 강화

### 현재 문제

충돌하는 prop 조합(예: `as="a"` + `disabled`)에 대한 명시적 검증이 없다.
TypeScript 타입으로는 잡히지 않는 런타임 케이스가 존재한다.

### 개선 방향

SLDS의 `CannotBeSetWith` 패턴을 TypeScript discriminated union으로 구현한다.

```ts
// 링크 버튼과 일반 버튼을 타입으로 분리
type ButtonAsButton = {
  as?: "button";
  disabled?: boolean;
  href?: never;
};

type ButtonAsAnchor = {
  as: "a";
  href: string;
  disabled?: never; // a 태그에 disabled 없음
};

type BlockButtonProps = (ButtonAsButton | ButtonAsAnchor) & {
  kind?: ButtonKind;
  size?: ButtonSize;
  children: React.ReactNode;
};
```

### MUI 관점 보완: module augmentation으로 variant 확장

MUI는 `ButtonPropsVariantOverrides` 빈 인터페이스를 제공해, 사용자가 module augmentation으로 타입을 확장할 수 있다.

```ts
// MUI 방식: 빌트인 variant 타입에 외부에서 추가
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    brand: true;
  }
}
```

우리 시스템에서는 현재 `variant`를 `as const` 배열로 고정하는 Carbon 방식을 쓰고 있다.
variant를 자주 추가해야 하는 경우 MUI 방식(빈 인터페이스 노출)으로 전환 검토 가능.
현 팀 규모에서는 `as const` 방식이 더 명시적이어서 적합하다.

**참고:** `docs/salesforce/button-component-architecture.md` §2.3, `docs/mui/button-component-architecture.md` §3.1

---

## 7. 다크 테마 대응 구조

### 현재 문제

다크 테마가 없고, CSS Custom Property 기반이 아니라 추후 다크 테마 추가 시
모든 컴포넌트를 수정해야 하는 구조다.

### 개선 방향

Semantic 토큰을 CSS Custom Property로 관리하면 다크 테마는 `:root` 재정의만으로 된다.
지금 당장 다크 테마를 만들지 않더라도, 구조만 잡아두면 나중에 한 파일 추가로 대응 가능하다.

```css
/* globals.css */
:root {
  --color-background: theme(colors.neutral.5);
  --color-text-primary: theme(colors.neutral.99);
  --color-interactive: theme(colors.blue.50);
}

/* 다크 테마 (나중에 추가) */
.dark {
  --color-background: theme(colors.neutral.95);
  --color-text-primary: theme(colors.neutral.5);
  --color-interactive: theme(colors.blue.40);
}
```

컴포넌트는 `var(--color-interactive)`만 참조하므로 수정 불필요.

**참고:** `docs/carbon/token-system-architecture.md` §5.2

---

## 8. 개선 우선순위 요약

| 순위 | 항목                                               | 이유                            | 참고                                 |
| ---- | -------------------------------------------------- | ------------------------------- | ------------------------------------ |
| ★★★  | 토큰 3계층 분리                                    | 다른 모든 개선의 기반           | Carbon §2~3                          |
| ★★★  | 버튼 variant 확장 (shadcn 정렬)                    | 서비스 필요 + 마이그레이션 준비 | Carbon §2.1, SLDS §2, HUMAN_GUIDE §9 |
| ★★☆  | CSS Custom Property 노출 + variant별 CSS 변수 위임 | 커스터마이징 공식화             | SLDS §3, MUI §2.2                    |
| ★★☆  | 다크 테마 구조 확보                                | 지금 안 하면 나중에 큰 공사     | Carbon §5.2                          |
| ★★☆  | Loading 상태 내장                                  | 비동기 UX 일관성 + 접근성       | MUI §2.5 §5.1                        |
| ★☆☆  | ToggleButton 컴포넌트                              | 필요 시점에 추가                | SLDS §4                              |
| ★☆☆  | Prop 검증 강화                                     | 타입 안전성 향상                | SLDS §2.3, MUI §3.1                  |

---

## 부록: 기존 규칙 요약 (DS-01, DS-02)

개선 작업 시 반드시 준수해야 하는 기존 규칙.

### DS-01 — cva/cn 스타일링

- cva는 `베이스 + variants + defaultVariants` 구조 필수
- Props 타입은 `VariantProps<typeof xxxVariants>`로 추출
- 클래스 병합은 `cn(variant결과, className)` 순서 — 사용자 className이 항상 마지막

### DS-02 — Tailwind v4 제약

- `text-white` 사용 금지 → `text-common-100` (white 팔레트 미포함)
- camelCase 토큰을 `text-*`에 직접 사용 금지 → primitive 토큰으로 대체
- `cn.ts`는 반드시 `extendTailwindMerge`로 커스텀 fontSize 등록 (fontSize/textColor 충돌 방지)
- semantic 토큰은 피그마 참조용, 실제 구현은 primitive 토큰 클래스 사용

### shadcn/ui 마이그레이션 계획 (HUMAN_GUIDE §9)

- 현재 variant 이름을 shadcn 컨벤션(`default`, `secondary`, `outline`, `ghost`, `destructive`, `link`)에 맞춰 설계
- `buttonVariants`를 export해 `<a>` 태그 등에서도 재사용 가능하게 유지
- `fullWidth`, `isLoading`, `leftIcon`, `rightIcon`은 shadcn 치환 후 래퍼 컴포넌트에서 유지
