## MUI (Material UI) 버튼 컴포넌트 아키텍처 분석

이 문서는 `systems/mui` (sparse checkout: `packages/mui-material/src/Button`)를 기반으로
MUI의 **Button 컴포넌트**를 중심으로 프로젝트 구성 방식과 설계 원칙을 분석한 내부 참고 문서입니다.
Carbon, Salesforce SLDS 분석과 동일한 목적으로, 향후 우리 디자인 시스템 설계 시 아키텍처 레퍼런스로 활용합니다.

---

## 1. 전반적인 구조 개요

### 1.1 모노레포 구성

MUI는 **pnpm + Lerna + Nx** 조합의 모노레포다.

```
material-ui/
├── package.json           # 루트 (pnpm workspaces)
├── pnpm-workspace.yaml    # workspace 패키지 경로 선언
├── lerna.json             # independent 버전 전략
├── nx.json                # Nx 빌드 캐싱/오케스트레이션
├── packages/
│   ├── mui-material/      # @mui/material — React 컴포넌트
│   ├── mui-base/          # @mui/base — 스타일 없는 헤드리스 컴포넌트
│   ├── mui-system/        # @mui/system — sx prop, theme
│   ├── mui-utils/         # 공유 유틸리티
│   └── ...
└── docs/                  # 문서 사이트 (Next.js)
```

| 항목 | Carbon | SLDS | MUI |
|------|--------|------|-----|
| 패키지 매니저 | Yarn | npm | **pnpm** |
| 버전 관리 | Lerna (independent) | 단일 저장소 | **Lerna (independent)** |
| 빌드 캐싱 | Nx | 없음 | **Nx** |
| 테스트 | Jest + Playwright | Jest + Enzyme | **Vitest** + Playwright |
| 언어 | TypeScript | JSX | **JS (소스) + TS (타입 분리)** |

**특이점:** MUI는 소스 파일이 `.js`이고, 타입 정의는 `.d.ts`로 **완전히 분리**한다.
Carbon이 `.tsx` 하나에 구현과 타입을 모두 담는 것과 대조적이다.

### 1.2 @mui/material 패키지 구조

```
packages/mui-material/
├── package.json           # peerDeps: React ^17~19, emotion (optional)
├── src/
│   ├── index.js           # 전체 public API 진입점
│   ├── Button/            # 컴포넌트 단위 폴더
│   ├── ButtonBase/        # 하위 레이어 (ripple, focus 관리)
│   ├── ButtonGroup/       # ButtonGroup 컨텍스트
│   ├── styles/            # createTheme, ThemeProvider
│   └── zero-styled/       # Pigment CSS 지원 레이어
├── tsconfig.json
└── vitest.config.mts
```

**감정(Emotion) 선택 옵션:** `@emotion/react`, `@emotion/styled`가 peerDeps에 optional로 표기된다.
Pigment CSS(제로 런타임)도 병렬 지원하며, sideEffects가 `false`로 선언되어 트리셰이킹이 가능하다.

### 1.3 Button 폴더 구조

```
src/Button/
├── Button.js          # 구현 (스타일 + 로직 통합)
├── Button.d.ts        # TypeScript 타입 정의 (분리)
├── Button.spec.tsx    # 타입 스펙 테스트
├── Button.test.js     # 단위 테스트 (Vitest)
├── buttonClasses.ts   # 유틸리티 클래스 생성
├── index.js           # public API re-export
└── index.d.ts         # 타입 re-export
```

Carbon(`Button.tsx` + `ButtonBase.tsx` 역할 분리)과 달리,
MUI는 스타일 정의와 렌더링 로직이 **`Button.js` 한 파일**에 모두 담긴다.

---

## 2. 구성요소 (Component Architecture)

### 2.1 Variant × Color 직교 설계

MUI Button의 핵심 설계 철학은 **시각(variant)과 의미(color)의 분리**다.

```js
// Carbon: kind 하나에 시각 + 의미 통합
kind = 'danger--ghost'   // → 위험 의미 + ghost 시각을 하나의 값으로

// MUI: 두 축을 독립 prop으로 분리
variant = 'outlined'     // 시각적 형태
color   = 'error'        // 의미/팔레트
```

| 축 | 허용 값 | 설명 |
|---|---------|------|
| `variant` | `text` / `outlined` / `contained` | 시각적 형태 |
| `color` | `primary` / `secondary` / `error` / `warning` / `info` / `success` / `inherit` | 팔레트 색상 |
| `size` | `small` / `medium` / `large` | 밀도 |

두 축의 조합이 자유롭기 때문에 `outlined + error`, `contained + warning` 등 모든 조합이 별도 구현 없이 지원된다.
단, Carbon의 `xs` `2xl` 같은 극단 사이즈 지원은 없다.

### 2.2 CSS-in-JS + CSS Custom Properties 스타일 레이어

MUI Button의 스타일링은 두 레이어가 결합된다.

**레이어 1: `styled()` + `memoTheme`**

```js
const ButtonRoot = styled(ButtonBase, {
  name: 'MuiButton',
  slot: 'Root',
  overridesResolver: (props, styles) => [ ... ],  // 외부 테마에서 오버라이드 가능
})(
  memoTheme(({ theme }) => ({
    ...theme.typography.button,  // 폰트 스타일을 테마에서 직접 소비
    minWidth: 64,
    // ...
  }))
);
```

**레이어 2: Variant × Color → CSS Custom Properties 매핑**

```js
// theme.palette의 모든 색상을 순회하며 자동으로 CSS 변수 할당
...Object.entries(theme.palette)
  .filter(createSimplePaletteValueFilter())
  .map(([color]) => ({
    props: { color },
    style: {
      '--variant-containedBg': theme.palette[color].main,
      '--variant-outlinedColor': theme.palette[color].main,
      '--variant-textColor': theme.palette[color].main,
    },
  }))
```

사용자가 `theme.palette`에 커스텀 색상을 추가하면, Button이 그 색상을 **자동으로 인식**한다.
SLDS가 컴포넌트별로 CSS 변수를 수동 정의하는 것과 달리, MUI는 팔레트 기반으로 **동적 생성**한다.

**Carbon vs SLDS vs MUI 스타일 비교:**

| | Carbon | SLDS | MUI |
|---|---|---|---|
| 방식 | BEM CSS 클래스 (prefix) | CSS Custom Properties + BEM | CSS-in-JS + CSS Custom Properties |
| 테마 적용 | CSS 토큰 파일 | CSS 변수 오버라이드 | `theme` 객체 직접 소비 |
| 커스텀 색상 | 별도 토큰 정의 필요 | CSS 변수 수동 정의 | palette에 추가하면 자동 반영 |
| 런타임 오버헤드 | 없음 | 없음 | emotion (또는 zero-runtime) |

### 2.3 Classes 시스템 — 프로그래매틱 BEM

```ts
// buttonClasses.ts
const buttonClasses = generateUtilityClasses('MuiButton', [
  'root', 'text', 'outlined', 'contained',
  'colorPrimary', 'colorError', 'sizeSmall', 'sizeLarge',
  'loading', 'loadingIndicator', 'loadingPositionCenter',
  // ...
]);
// 결과: { root: 'MuiButton-root', text: 'MuiButton-text', ... }
```

Carbon의 `cds--btn--primary` 같은 BEM 클래스를 **JS에서 프로그래매틱하게 생성**하는 방식이다.
이 클래스 객체는 세 가지 목적으로 쓰인다:

1. **내부 스타일링**: `styled()` 내에서 `.${buttonClasses.disabled}` 참조
2. **외부 오버라이드**: 사용자가 `classes` prop으로 슬롯별 className 교체 가능
3. **CSS 타겟팅**: 사용자가 전역 CSS에서 `.MuiButton-root` 직접 타겟 가능

### 2.4 ButtonGroup 컨텍스트 통합

```js
// Button.js
const contextProps = React.useContext(ButtonGroupContext);
const buttonGroupButtonContextPositionClassName = React.useContext(ButtonGroupButtonContext);
const resolvedProps = resolveProps(contextProps, inProps);
```

`ButtonGroup` 내부에 배치된 Button은:
- `ButtonGroupContext`에서 `variant`, `color`, `size`, `disabled` 등을 자동 상속
- `ButtonGroupButtonContext`에서 위치 클래스 (`first`, `middle`, `last`)를 받아 border 스타일 조정

Carbon과 SLDS에는 이 레이어가 없다.

### 2.5 Loading 상태 내장

```js
// Button.js
const {
  loading = null,
  loadingIndicator: loadingIndicatorProp,
  loadingPosition = 'center',   // 'start' | 'center' | 'end'
} = props;

// 기본 로딩 인디케이터: CircularProgress
const loadingIndicator = loadingIndicatorProp ?? (
  <CircularProgress aria-labelledby={loadingId} color="inherit" size={16} />
);
```

`loading={true}` 시:
- 버튼이 `disabled` 처리됨
- `loadingPosition`에 따라 `start`/`center`/`end`에 로딩 인디케이터 표시
- `loadingPosition: 'center'`면 children이 투명해지고 중앙에 스피너 오버레이
- `loadingPosition: 'start'|'end'`면 아이콘 자리에 스피너 표시, children은 유지

Carbon과 SLDS에는 loading 상태 내장이 없다.

### 2.6 폴리모픽 패턴 — `component` prop

```js
// MUI: component prop
<Button component="a" href="/somewhere">링크처럼 동작하는 버튼</Button>
<Button component={RouterLink} to="/page">라우터 링크</Button>

// Carbon: as prop
<Button as="a" href="/somewhere">링크 버튼</Button>
```

MUI는 `href`를 주면 자동으로 `<a>` 엘리먼트로 렌더링한다 (Carbon과 동일). 단, MUI는 TypeScript 레벨에서 `href` 제공 시 `<a>`의 속성을 타입으로 추론하는 정교한 오버로드 시스템(`ExtendButtonBase`)을 갖고 있다.

### 2.7 아이콘 처리 방식

```jsx
// MUI: 노드를 직접 전달 (Icon 컴포넌트 or 어떤 React 노드든 가능)
<Button startIcon={<DeleteIcon />}>삭제</Button>
<Button endIcon={<SendIcon />}>보내기</Button>

// Carbon: 컴포넌트 타입을 전달 (renderIcon, MUI보다 제한적)
<Button renderIcon={Add} iconDescription="추가" />
```

MUI의 `startIcon`/`endIcon`은 **React 노드**를 받아 더 유연하다.
Carbon의 `renderIcon`은 컴포넌트 타입을 받아 내부에서 인스턴스화하므로, MUI처럼 인라인 JSX는 불가능하다.

---

## 3. 타입 시스템 — JS 소스 + 분리된 `.d.ts`

### 3.1 OverridableStringUnion — 확장 가능한 타입

```ts
// Button.d.ts
export interface ButtonPropsColorOverrides {}   // 빈 인터페이스
export interface ButtonPropsVariantOverrides {}  // 빈 인터페이스

color?: OverridableStringUnion<
  'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  ButtonPropsColorOverrides  // ← 사용자가 module augmentation으로 확장
>
```

```ts
// 사용자 프로젝트에서 확장
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    brand: true;   // 'brand' color 추가
  }
}
// 이제 <Button color="brand"> 가 타입 에러 없이 동작
```

Carbon의 `as const` 배열 방식과 달리, MUI는 **module augmentation**으로 타입을 확장한다.

### 3.2 구현(JS)과 타입(.d.ts) 완전 분리

```
Button.js    ← 런타임 동작, PropTypes, 스타일 정의
Button.d.ts  ← TypeScript 타입, 상세 JSDoc, 확장 포인트
```

빌드 시 `.d.ts`를 직접 패키지에 포함하므로, TS 트랜스파일 없이 빌드 결과를 배포할 수 있다.
Carbon이 소스 자체를 TS로 작성해 빌드 시 `.d.ts`를 생성하는 것과 반대 방향이다.

---

## 4. 테마 통합 수준

MUI Button은 테마를 **가장 깊게 소비**하는 디자인 시스템 컴포넌트 중 하나다.

```js
memoTheme(({ theme }) => ({
  ...theme.typography.button,                          // 폰트 스타일
  borderRadius: theme.shape.borderRadius,              // 모서리 반경
  transition: theme.transitions.create([...], {        // 애니메이션 duration
    duration: theme.transitions.duration.short,
  }),
  boxShadow: theme.shadows[2],                         // 그림자 단계
  '&:hover': { boxShadow: theme.shadows[4] },          // hover 그림자
}))
```

| 테마 객체 | 역할 |
|---|---|
| `theme.palette` | 색상 전체 (커스텀 포함) |
| `theme.typography.button` | 버튼 전용 타이포그래피 |
| `theme.shape.borderRadius` | 모서리 반경 |
| `theme.transitions` | 애니메이션 timing |
| `theme.shadows` | 그림자 단계 (contained 버튼) |

`useDefaultProps`를 통해 테마에서 Button의 기본 prop 값을 선언할 수도 있다:

```js
// 테마 설정에서 Button 기본값 제어
createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',    // 전역 기본 variant 변경
        disableRipple: true,    // 전역 ripple 제거
      },
      styleOverrides: {
        root: { borderRadius: 0 },  // 전역 스타일 오버라이드
      },
    },
  },
})
```

Carbon과 SLDS는 이 수준의 테마 기반 prop 기본값 제어가 없다.

---

## 5. 접근성 설계

### 5.1 Loading 상태의 접근성

```js
const loadingId = useId(idProp);
const loadingIndicator = (
  <CircularProgress
    aria-labelledby={loadingId}   // 버튼 텍스트로 로딩을 레이블
    color="inherit"
    size={16}
  />
);

// 버튼에 id 부여 (loading 중일 때만)
<ButtonRoot id={loading ? loadingId : idProp} ... >
```

로딩 중인 버튼이 스크린 리더에서 "저장 중..." 처럼 읽히도록, 버튼 자신의 텍스트로 로딩 인디케이터를 레이블한다.

### 5.2 Ripple 효과와 포커스 스타일

`ButtonBase`에서 ripple 효과와 포커스 가시성(`.Mui-focusVisible`)을 관리한다.
`disableRipple` 사용 시 `.Mui-focusVisible` CSS 클래스로 별도 포커스 스타일을 제공해야 한다는 것을 문서에서 명시한다.

---

## 6. Carbon vs SLDS vs MUI 핵심 비교

| 항목 | Carbon | SLDS | MUI |
|------|--------|------|-----|
| **변형 정의** | `as const` 배열 + TS | boolean props + classNames | `variant` × `color` 직교 분리 |
| **타입 확장** | 불가 (상수 배열 고정) | 불가 | **module augmentation** |
| **스타일링** | BEM + SCSS 패키지 | CSS Custom Properties | CSS-in-JS + CSS 변수 |
| **테마 통합** | CSS 토큰 | CSS 변수 오버라이드 | `theme` 객체 직접 소비 |
| **커스텀 색상** | 토큰 재정의 필요 | CSS 변수 수동 정의 | palette에 추가 시 자동 반영 |
| **로딩 상태** | 없음 | 없음 | **내장 (loading + loadingPosition)** |
| **그룹 컨텍스트** | 없음 | 없음 | **ButtonGroupContext 자동 상속** |
| **아이콘 전달** | 컴포넌트 타입 (renderIcon) | 노드 (직접 JSX) | **노드 (startIcon/endIcon)** |
| **폴리모픽** | `as` prop | `use` prop | `component` prop |
| **소스 언어** | TypeScript (.tsx) | JavaScript (.jsx) | JS + 분리된 .d.ts |
| **PropTypes** | TS + PropTypes 병행 | PropTypes + 커스텀 검증기 | PropTypes (자동 생성 주석) |
| **애니메이션** | 없음 | Kinetics (포인터 추적) | Ripple (ButtonBase) |

---

## 7. 우리 디자인 시스템에 적용할 수 있는 패턴

### 7.1 Variant × Color 직교 분리

단일 `kind` prop에 시각과 의미를 묶지 말고, `variant`와 `color`를 분리하면
`n × m` 조합을 별도 구현 없이 지원할 수 있다.

### 7.2 CSS Custom Properties를 통한 variant 스타일 위임

```tsx
// 각 variant는 CSS 변수에 값을 할당하고, 기본 스타일은 CSS 변수를 소비
.btn {
  background: var(--btn-bg);
  color: var(--btn-text);
}
.btn-contained { --btn-bg: var(--color-primary); --btn-text: white; }
.btn-outlined  { --btn-bg: transparent; --btn-text: var(--color-primary); }
```

SLDS의 "변형 클래스가 CSS 변수를 덮어쓰는" 패턴과 MUI의 "팔레트 기반 CSS 변수 동적 생성"을 조합하면,
Tailwind 환경에서도 유사하게 구현 가능하다.

### 7.3 Loading 상태 내장 고려

Loading 상태를 별도 컴포넌트(`LoadingButton`)로 분리하면 import 비용이 발생한다.
MUI v5→v6에서 `loading`을 Button 자체로 통합한 이유가 있다.
초기 설계 시 버튼에 loading 상태를 내장할지 결정이 필요하다.

### 7.4 `classes` prop을 통한 슬롯 오버라이드

컴포넌트 내부를 "슬롯"으로 나누고, 각 슬롯에 className을 주입할 수 있게 하면
사용자가 스타일 오버라이드를 위해 소스를 수정하지 않아도 된다.

### 7.5 `useDefaultProps` 패턴

테마에서 컴포넌트의 기본 prop을 제어하는 구조를 만들면,
시스템 전체의 Button 동작을 코드 변경 없이 테마 설정만으로 제어할 수 있다.
