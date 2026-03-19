# REACT-01 React Component Practices

- Priority: P1
- Enforcement: Rule ID별 상이 (`GOV-02` Enforcement Matrix 참조)
- 적용 범위: `features/*`의 React 컴포넌트/훅 (`.tsx`, `.jsx`)

## SSOT 적용

- 강제 문구 원문/집행 강도는 `GOV-02`를 따른다.
- 본 문서는 `HR-REACT-01,02,03` 해설과 운영 가이드를 제공한다.

## MUST

- Effect는 외부 시스템 동기화 용도로만 사용한다.
- 파생 상태는 render 단계에서 계산하고, 비싼 계산은 `useMemo`로 처리한다.
- 이벤트에 의해 발생한 로직은 Effect가 아니라 이벤트 핸들러에 둔다.
- eslint의 `react-hooks/exhaustive-deps`를 비활성화하지 않는다.
- 서버 상태 fetch는 TanStack Query 또는 `app -> features/*/service.ts` read-only 패턴으로 처리한다.
- `use client`는 실제 상호작용 경계에만 두고, `app/*/page.tsx`는 특별한 이유가 없으면 Server Component로 유지한다.
- feature의 `components` 디렉토리에는 템플릿 역할의 `Page.tsx` 하나만 두고, 나머지 `.tsx` UI는 `components/elements/*`에 둔다.
- 부모가 소유한 상태값은 명사형 props로 전달한다. (`query`, `selectedId`, `isOpen`)
- 부모 상태 변경 요청 핸들러는 `on*` 접두사로 전달한다. (`onQueryChange`, `onSelect`, `onOpenChange`)
- 자식 내부 DOM 이벤트 핸들러는 `handle*` 네이밍을 사용한다. (`handleChange`, `handleClick`)

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `HR-REACT-01` | 패턴 탐지(제한) | Effect가 외부 시스템 동기화 용도인지 |
| `HR-REACT-02` | `useEffect` fetch 패턴 탐지 | 서버 상태 fetch가 Query/허용 패턴인지 |
| `HR-REACT-03` | `react-hooks/exhaustive-deps` | disable 사유와 범위 최소화 여부 |

## SHOULD

- Effect 의존성은 최소화하고, updater function 패턴으로 불필요한 의존성을 제거한다.
- 객체/함수 의존성으로 인한 재실행이 발생하면 Effect 내부로 이동해 안정화한다.
- 컴포넌트 간 전달은 props/composition을 우선 사용한다.
- `controlled`/`uncontrolled` 여부와 무관하게 부모-자식 네이밍 계약을 동일하게 적용한다.
- Props/훅 계약 타입은 `type`/`interface` 모두 허용한다. 상속 관계를 명확히 표현할 때는 `interface ... extends ...`를 우선 고려한다.
- 반복되는 경로/시간/정책 literal은 상수로 승격하되, 단일 사용 문자열까지 과도하게 상수화하지 않는다.
- `components/elements/*`는 UI 조합 조각에 집중시키고, 데이터 조회/변경 hook 생성 책임은 `Page.tsx` 또는 `hooks/*`에 둔다.

## MUST NOT

- `useEffect`를 파생 상태 계산/이벤트 처리 용도로 사용하지 않는다.
- mount 시점 데이터 fetch를 `useEffect` 기본 패턴으로 사용하지 않는다.
- 서버 상태를 Jotai/local state에 중복 저장하지 않는다.
- Context를 전역 상태 기본 수단으로 사용하지 않는다.
- 부모의 React setter(`setQuery`, `setOpen`)를 자식 props 이름으로 직접 노출하지 않는다.
- 필요한 이유 없이 route/page/layout 전체에 `use client`를 붙이지 않는다.
- Client Component를 `async` 함수로 선언하지 않는다.
- `components/elements/*` 밖에 추가 `.tsx` UI 컴포넌트를 흩어 놓지 않는다.
- `components/elements/*`에 hook/helper/type 파일을 두지 않는다.

## 예외 가이드

아래는 예외를 허용할 수 있다.

1. 3rd-party SDK 구독/해제 로직이 Effect를 강제하는 경우
2. 애니메이션 라이브러리 연동으로 DOM sync Effect가 필요한 경우
3. 레거시 컴포넌트 이행 단계에서 단기적으로 setter 노출이 필요한 경우

예외는 EX-01 템플릿으로 사유/만료일을 남긴다.

## 참고 예시

- 상세 예시는 `REACT-01-EX`를 따른다.

## 리뷰 체크 (Yes/No)

- Effect가 외부 시스템 동기화에만 사용되었는가?
- `useEffect` 기반 mount fetch 대신 Query/server 패턴을 사용했는가?
- `use client`가 최소 경계에만 적용되었는가?
- Client Component가 `async` 함수가 아닌가?
- `Page.tsx`가 feature의 유일한 템플릿 진입점이고, 세부 UI가 `components/elements/*`에 정리되어 있는가?
- 부모-자식 props 네이밍이 계약(`value`/`on*`/`handle*`)을 따르는가?
- 타입 규칙이 일관적인가? (`type.ts|types.ts|dto.ts`는 `type`, 컴포넌트/훅은 `type`/`interface` 허용)
- 예외 사용 시 EX-01 양식이 있는가?

## 자동 검증

- 린트: 가능(`react-hooks/exhaustive-deps`)
- 리뷰 수동: 필수
