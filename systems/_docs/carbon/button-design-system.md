## Carbon React 버튼 디자인 시스템 정리

이 문서는 `systems/carbon` 모노레포 중 `@carbon/react` 패키지의 **Button 컴포넌트**를 중심으로,  
디자인 시스템이 어떻게 구성되고, 어떻게 사용되며, 어떤 규칙을 가지고 있는지를 정리한 내부 참고 문서입니다.  
향후 우리 조직의 디자인 시스템/컴포넌트를 설계·구현할 때 아키텍처 레퍼런스로 활용하는 것을 목표로 합니다.

---

## 1. 전반적인 구조 개요

Carbon 모노레포는 다음과 같은 레이어를 가집니다.

- **모노레포 루트**
  - 여러 패키지(`packages/react`, `packages/styles`, `packages/icons-react` 등)를 워크스페이스로 관리
  - 공통 개발 규칙, 문서(`docs/`), ADR, 가이드 등을 제공
- **`@carbon/react` 패키지 (`systems/carbon/packages/react`)**
  - React 컴포넌트의 **정식 구현**을 제공
  - 스타일은 `@carbon/styles`, 아이콘은 `@carbon/icons-react` 에서 재수출
  - 패키지 레벨에서 feature flag를 통해 CSS/버전 동작을 제어
- **컴포넌트 단위 폴더 (`packages/react/src/components/Button`)**
  - `Button.tsx`: 메인 구현
  - `index.ts`: public API 엔트리
  - `Button.mdx`: Storybook 기반 컴포넌트 문서
  - `docs/overview.mdx`: 외부 문서 사이트(React Storybook 데모)에서 사용하는 overview
  - 그 외 마이그레이션 가이드, 접근성 테스트 문서 등

이 중 버튼은 **“디자인 토큰/변형 정의 → 타입 계층 → 런타임 분기 → 하위 컴포넌트 위임 → 문서/스토리로 서빙”** 이라는 패턴을 명확히 보여주는 컴포넌트입니다.

---

## 2. 구성요소 (Component Architecture)

### 2.1. 토큰 및 변형 정의

`Button.tsx` 상단에는 이 디자인 시스템에서 허용하는 **버튼 변형과 크기**가 토큰으로 정의되어 있습니다.

- **버튼 종류(kind)**

  - `ButtonKinds = ['primary', 'secondary', 'danger', 'ghost', 'danger--primary', 'danger--ghost', 'danger--tertiary', 'tertiary'] as const`
  - `type ButtonKind = (typeof ButtonKinds)[number]`
  - 디자인 시스템 관점에서 “지원하는 버튼 변형”을 **하드코딩된 상수 + 타입**으로 고정
  - 이후 PropTypes에서도 동일한 상수 배열을 사용해 **런타임 검증**까지 일관되게 수행

- **버튼 사이즈(size)**

  - `ButtonSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const`
  - `type ButtonSize = (typeof ButtonSizes)[number]`
  - 시스템 전반에서 공유될 수 있는 **치수 스케일**을 정의
  - 실제 하위 컴포넌트(예: `IconButton`)가 모든 사이즈를 지원하지 않아도, 상위 API는 **디자인 스펙 전체를 표현**하도록 열어 두는 구조

- **툴팁 정렬/위치**

  - `ButtonTooltipAlignments = ['start', 'center', 'end'] as const`
  - `ButtonTooltipPositions = ['top', 'right', 'bottom', 'left']`
  - 아이콘 전용 버튼의 툴팁 위치를 제한된 enum으로 관리하여, **디자인 스펙과 UI 일관성**을 강제

이 레이어는 “디자인 시스템이 어떤 상태/변형을 공식적으로 지원하는가”를 정의하는 **토큰 레이어**입니다.

### 2.2. 타입/Props 계층

버튼 컴포넌트는 **HTML 표준 속성 + 디자인 시스템 확장 속성 + 폴리모픽 렌더링**을 결합한 타입 구조를 가집니다.

- **기본 Props 확장**

  - `interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { ... }`
  - 표준 HTML 버튼 속성(예: `disabled`, `type`, `onClick`) 위에 다음과 같은 DS 전용 속성을 추가:
    - `kind`, `size`, `isExpressive`, `hasIconOnly`, `isSelected`
    - `dangerDescription`, `iconDescription`
    - 아이콘 전용 버튼용 툴팁 관련 prop(`tooltipAlignment`, `tooltipPosition`, `tooltipHighContrast`, `tooltipDropShadow`)
  - → “플랫폼 기본 동작 + 디자인 시스템 스펙 확장” 패턴

- **폴리모픽 컴포넌트 패턴**

  - `PolymorphicComponentPropWithRef<T, ButtonBaseProps>` 를 이용해 `ButtonProps<T>` 정의
  - `T extends React.ElementType = 'button'` 으로 기본은 `button`, 필요 시 `a`, `div` 등으로 교체 가능
  - → 시맨틱/접근성을 유지하면서도 다양한 DOM/컴포넌트 래퍼에 대응 가능한 구조

- **icon-only 상태에 따른 kind 타입 좁히기**

  - `kind?: ButtonBaseProps['hasIconOnly'] extends true ? IconButtonKind : ButtonKind;`
  - 아이콘 전용 버튼일 때 허용 가능한 kind 집합을 별도 타입(`IconButtonKind`)으로 제한
  - → 타입 레벨에서 “아이콘만 있는 버튼은 이 변형들만 허용”이라는 디자인 규칙을 표현

이 레이어는 **타입 시스템을 통해 디자인 시스템의 규칙을 최대한 고정**하고, API 사용 실수를 줄이는 목적을 가집니다.

### 2.3. 런타임 분기 및 하위 컴포넌트 위임

Button 컴포넌트는 자체적으로 모든 UI를 렌더링하지 않고, **두 가지 하위 구현체로 분기**합니다.

- **일반 버튼 vs 아이콘 전용 버튼 구분**

  - `hasIconOnly` + `kind` 정보를 기반으로 `isIconOnlyButton` 함수로 분기
  - `hasIconOnly === true` 인 경우 아이콘 전용 버튼으로 판단

- **일반 버튼 (텍스트 포함)**

  - `!isIconOnlyButton` 인 경우 `ButtonBase` 컴포넌트로 props를 그대로 전달
  - 이 경로에서는 아이콘 전용에만 의미 있는 prop(`tooltipAlignment` 등)을 제거
  - `ButtonBase` 는 실제 DOM 구조, 클래스, 스타일링을 담당하는 **하위 레벨 구현체**

- **아이콘 전용 버튼**

  - `IconButton` 컴포넌트를 사용해 렌더링
  - Button이 제공하는 추상적인 툴팁 위치/정렬 API를 `PopoverAlignment` 값으로 매핑
  - 아이콘 이미지(`renderIcon`)와 내용(children)을 적절히 조합해 실제 렌더링
  - `size`, `highContrast`, `dropShadow`, `autoAlign` 등 아이콘 전용 UX를 위한 옵션을 함께 전달

이 레이어의 핵심은, **퍼블릭 API(`Button`)는 하나이지만, 실제 렌더링 책임은 구체 컴포넌트(`ButtonBase`, `IconButton`)가 진다**는 점입니다.  
즉, “통합 인터페이스 + 구현체 분리” 패턴입니다.

### 2.4. 접근성(a11y) 및 사용성 가드

디자인 시스템은 단순한 스타일 API가 아니라, **접근성/사용성 규칙도 함께 패키징**합니다.

- **아이콘만 있는 경우 경고**
  - `renderIcon` 이 지정되었지만 `children`과 `iconDescription` 이 없으면 `console.error` 경고 출력
  - → 스크린 리더 사용자에게 의미 없는 버튼이 노출되는 것을 방지

- **PropTypes 기반 런타임 검증**
  - JS 환경 사용자를 위해 TypeScript 타입 외에 `propTypes` 를 별도 정의
  - `kind` 는 `hasIconOnly` 여부에 따라 허용 값 집합(`ButtonKinds` vs `IconButtonKinds`)을 분기하여 검증
  - `iconDescription` 은 `renderIcon` + 아이콘 전용 조합에서 필수로 요구
  - 기타 `size`, `tooltipAlignment`, `tooltipPosition` 등에 대해 **enum 값 검증** 수행

이로 인해 TS를 사용하지 않는 프로젝트에서도 **디자인 규칙 위반 시 런타임에서 빠르게 피드백**을 받을 수 있습니다.

---

## 3. 사용 방식 (How It’s Served & Used)

### 3.1. 패키지 레벨 export

버튼 컴포넌트 폴더의 `index.ts` 는 다음과 같이 public API 를 구성합니다.

- `Button` 기본 export 및 named export
- `ButtonProps` 타입 export
- `ButtonKinds`, `ButtonSizes` 등 `Button.tsx` 에서 export 한 모든 항목 재수출
- `ButtonSkeleton` 도 함께 export

상위 `@carbon/react` 패키지는 이 `index.ts` 를 통해 `Button` 을 외부에 노출합니다.  
소비자는 주로 다음과 같이 사용합니다.

```tsx
import { Button } from '@carbon/react';

function MyPage() {
  return (
    <>
      <Button kind="primary">저장</Button>
      <Button kind="ghost" size="sm">취소</Button>
      <Button hasIconOnly renderIcon={Add} iconDescription="추가" />
    </>
  );
}
```

### 3.2. 문서/스토리(Storybook & MDX)를 통한 서빙

Button 컴포넌트는 코드 외에도 **풍부한 문서 및 예제**를 가집니다.

- `Button.mdx`
  - Storybook Docs용 문서
  - Overview, 각 kind(Secondary, Tertiary, Ghost, Danger, Icon-only 등), Skeleton, Component API 를 상세 설명
  - `<Canvas of={ButtonStories.Default} />` 등으로 실제 Storybook 스토리를 임베드하여 **라이브 예제** 제공
  - `<ArgTypes />` 를 사용해 props 테이블을 자동 생성
  - 각 prop(`as`, `className`, `hasIconOnly`, `href`, `iconDescription`, `kind`, `renderIcon`, `size`, `tooltipAlignment`, `tooltipPosition` 등)에 대해
    - 설명
    - 간단한 코드 예제
    - 접근성 관련 주의사항(예: role 추가 필요 여부)
    를 함께 제공

- `docs/overview.mdx`
  - 외부 문서 사이트에서 사용하는 **Live demo 엔트리**
  - `StorybookDemo` 컴포넌트를 통해 `https://react.carbondesignsystem.com` Storybook 인스턴스에 연결
  - `'components-button--default'`, `'components-button--danger'` 등 variant 키로 각 스토리를 노출

이 구조 덕분에, 사용자(디자이너/개발자)는

- 코드 레벨: `@carbon/react` 에서 컴포넌트를 import
- 문서 레벨: Storybook/MDX/공식 웹사이트에서 디자인·사용 가이드를 확인

을 동시에 할 수 있고, **“코드 = 문서 = 디자인 스펙”** 이 최대한 일치하도록 유지됩니다.

### 3.3. Feature Flags 를 통한 전역 동작 제어

`packages/react/src/feature-flags.js` 에서는 `@carbon/feature-flags` 의 `merge` 함수를 사용해  
여러 전역 플래그를 설정합니다.

- 예: `'enable-css-custom-properties'`, `'enable-css-grid'`, `'enable-v11-release'` 등
- 이 플래그들은 **CSS 레벨의 토큰 사용 방식, 레이아웃 시스템, 메이저 버전별 스타일 동작**을 제어
- 버튼을 포함한 모든 컴포넌트가 이 플래그 설정을 공유

즉, 디자인 시스템 차원에서 **버튼의 비주얼/동작을 전역 정책으로 한 번에 토글**할 수 있는 구조입니다.

---

## 4. 규칙 및 설계 원칙

### 4.1. 모노레포 및 패키지 레이어링 규칙

`systems/carbon/AGENTS.md` 에서 명시된 주요 원칙:

- 패키지들은 의도적으로 **레이어링** 되어 있으며, 상위 패키지는 하위 패키지를 재수출/래핑
- `@carbon/react` 와 `@carbon/web-components` 는 “이중 플래그십” 모델:
  - UX/비주얼은 최대한 동등해야 하지만
  - 구현은 각 프레임워크 특성을 따르며 필요 시 다르게 가져가도 됨
- `carbon-components-react` 등 일부 패키지는 점진적 마이그레이션을 위해 단순 재수출 레이어로 남겨두는 전략 사용

우리 디자인 시스템을 만들 때도:

- “스타일/토큰 → 아이콘 → React 컴포넌트” 처럼 **의도적인 계층 구조**를 설계
- 상위 레이어에서 하위 구현체를 래핑하되, **프레임워크 컨벤션을 우선**하는 것이 좋다는 점을 참고할 수 있습니다.

### 4.2. React 컴포넌트 설계 규칙

`packages/react/AGENTS.md` 및 코드 패턴에서 추출할 수 있는 규칙:

- React 컨벤션을 따르고, **컴포저블하고 선언적인 API** 를 선호
- DOM 직접 접근은 지양하고, refs 를 사용
- 상태 관리 시 `useEffect` 남용을 피하고, 가능한 한 props와 순수 계산으로 해결
- 폴리모픽 컴포넌트(`as` prop)를 통해 시맨틱/접근성을 고려한 유연한 API 제공
- TS + PropTypes 를 함께 사용하여
  - TS 환경에서는 타입 안정성
  - JS 환경에서는 런타임 검증
  을 보장

### 4.3. 버튼 설계 관련 규칙 요약

- **변형(kind)** 는 명시된 enum 값만 허용하며, 각 변형은 디자인 문서에서 명확한 사용 맥락을 가짐
- **아이콘 전용 버튼(hasIconOnly)** 은
  - 별도의 kind 집합을 가지고
  - 필수적인 `iconDescription` 을 요구
  - 툴팁/배지 등 전용 UX를 제공
- **사이즈(size)** 는 공통 스케일을 사용하고, 미지정 시 기본값(`lg`)을 적용
- **접근성**:
  - 비-`button` 요소를 `as` 로 렌더링하는 경우 `role="button"` 등 추가 고려 필요
  - 아이콘만 있는 경우 항상 보조 텍스트/툴팁/aria-label 필요
- **API 표면**은 최대한 일관되게 유지하면서도, 실제 구현체(`IconButton`, `ButtonBase`, `Popover`) 는
  - 각자의 책임(구조, 스타일, 위치 계산 등)에 집중

---

## 5. 우리 디자인 시스템에 적용할 수 있는 패턴

향후 우리가 자체 디자인 시스템/컴포넌트를 만들 때, Carbon Button 구조에서 가져올 수 있는 핵심 패턴은 다음과 같습니다.

- **토큰 우선 설계**
  - variant/kind, size, alignment, position 등 디자인 요소를 **먼저 enum/상수/타입으로 정의**
  - 구현과 문서가 모두 이 토큰을 참조하도록 만들기

- **폴리모픽 컴포넌트 패턴**
  - `as` + `ElementType` 제네릭을 통해 다양한 DOM/컴포넌트를 지원
  - 접근성을 위해 `role`, `aria-*` 속성 정책을 함께 정의

- **통합 API + 구현체 분리**
  - 외부에는 `Button` 하나만 노출하지만,
  - 내부에서는 아이콘 전용/텍스트 버튼/로딩 상태 등으로 하위 컴포넌트를 나눔

- **TS 타입 + PropTypes 병행(필요 시)**
  - 우리 시스템도 JS 소비자가 있다면, 타입 + 런타임 검증을 함께 고려

- **Storybook + MDX 문서화**
  - 컴포넌트별로
    - 사용 가이드
    - 변형 예제
    - Props API
    - 접근성 참고 링크
  를 MDX로 정리하고, Storybook 스토리를 라이브 예제로 임베드

- **Feature flag 기반 전역 정책**
  - 토큰/레이아웃/버전 전환 같은 큰 변경은 플래그를 통해 점진적으로 적용

이 문서는 카본의 Button 컴포넌트를 중심으로 한 정리이지만, 같은 패턴을 다른 컴포넌트(예: `Input`, `Tag`, `Modal`) 설계에도 그대로 확장할 수 있습니다.  
향후 클로드/코드 기반 자동화로 우리 디자인 시스템을 생성할 때, 이 문서를 **“타깃 아키텍처 스펙”** 으로 제공하면 유용합니다.

