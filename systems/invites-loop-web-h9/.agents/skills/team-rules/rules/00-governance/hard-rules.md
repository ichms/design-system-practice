# GOV-02 Hard Rules (Single Source of Truth)

- 적용 범위: 신규 코드 + 수정 코드
- 집행 강도: Rule ID별 상이 (아래 `Enforcement Matrix`가 SSOT)
- 목적: 문서 간 중복 정의를 제거하고, 필수 규칙을 단일 기준으로 통합한다.

## 0) 운영 원칙

- 강제 규칙 원문, 집행 강도, 검증 메타는 이 문서에서만 수정한다.
- Core Rules 문서는 Rule ID 참조 + 해설/예시만 제공한다.
- 문서 경로는 고정값으로 가정하지 않고 `00-index.md`의 Rule Locator를 참조한다.

## 1) Enforcement Matrix (SSOT)

| Rule ID | Priority | Enforcement | 자동 검증 | 수동 검증 | 비고 |
| --- | --- | --- | --- | --- | --- |
| `HR-ARC-01` | P0 | Hard Gate | `app/*/page.tsx` 경계 린트(선택) | 라우트 책임 확인 | Thin Route 필수 |
| `HR-ARC-02` | P0 | Hard Gate | import 제한 규칙 | app read-only 데이터 처리 위치 확인 | app read-only 경계 |
| `HR-ARC-03` | P0 | Hard Gate | 제한적 | write/invalidate/side effect 위치 확인 | 정책성 행위 차단 |
| `HR-IMP-01` | P0 | Hard Gate | `boundaries`/`no-restricted-imports` | 예외 사유 검토 | `packages -> features` 금지 |
| `HR-IMP-02` | P0 | Hard Gate | `boundaries`/`no-restricted-imports` | 예외 사유 검토 | `common -> domain` 금지 |
| `HR-IMP-03` | P0 | Hard Gate | import 제한 규칙 | 예외 승인 여부 확인 | app -> service 금지 |
| `HR-RQ-01` | P0 | Hard Gate | custom lint/PR bot | key 정규화 확인 | queryKeys factory 강제 |
| `HR-RQ-02` | P0 | Hard Gate | `service.ts` import 룰 | 파일 책임 확인 | React Query 훅 금지 |
| `HR-RQ-03` | P1 | Warning | 제한적(정적 분석 보조) | mutation별 invalidate 확인 | 정적검증 한계로 Warning, `2026-06` 재평가 |
| `HR-STATE-01` | P1 | Warning | 제한적(패턴 탐지) | 상태 소유권 리뷰 | 반복 위반 시 Hard Gate 승격 후보 |
| `HR-TYPE-01` | P0 | Hard Gate | `no-explicit-any` | 예외 사유 검토 | `any` 금지 |
| `HR-TYPE-02` | P1 | Warning | custom lint(선택) | 모델 타입 위치 확인 | `type.ts|types.ts|dto.ts`는 `type` 기본 |
| `HR-TYPE-03` | P1 | Warning | custom lint(선택) | 상수 소스 파생 여부 확인 | literal union 일관성 |
| `HR-TYPE-04` | P2 | Warning | 제한적 | Props/계약 가독성 검토 | `components/hooks`에서 `interface` 허용 |
| `HR-STYLE-01` | P2 | Warning | `func-style`(선택) | 함수 스타일 일관성 확인 | 함수 표현식 기본 |
| `HR-REACT-01` | P1 | Warning | 제한적(패턴 탐지) | 파생 상태/이벤트 분리 검토 | Effect 용도 제한 |
| `HR-REACT-02` | P1 | Warning | `useEffect` fetch 패턴 탐지 | 서버 상태 fetch 경로 확인 | mount fetch 기본 패턴 금지 |
| `HR-REACT-03` | P0 | Hard Gate | `react-hooks/exhaustive-deps` | disable 사유 검토 | hooks deps 비활성화 금지 |
| `HR-ARC-04` | P0 | Hard Gate | custom script | feature 컴포넌트 배치 확인 | `Page.tsx + elements/*` 강제 |
| `HR-ARC-05` | P0 | Hard Gate | custom script | shared 소유권 예외 검토 | shared 하위 subfeature 의존 금지 |
| `HR-REACT-04` | P0 | Hard Gate | lint(`no-restricted-syntax`) | 예외 사유 검토 | app page `use client` 금지 |
| `HR-REACT-05` | P0 | Hard Gate | lint(`@next/next/no-async-client-component`) | 예외 사유 검토 | async client component 금지 |

## 2) 아키텍처/경계 원문

- `HR-ARC-01`: `app/*/page.tsx`는 라우트 엔트리/조합만 담당한다.
- `HR-ARC-02`: `app/*`는 read-only 데이터 조회를 위해 `features/*/service.ts`를 직접 호출하지 않는다.
- `HR-ARC-03`: `app/*`에서 write 요청(생성/수정/삭제), invalidate, 정책성 side effect를 직접 처리하지 않는다.
- `HR-ARC-04`: feature의 `components` 디렉토리에는 `Page.tsx`만 두고, 추가 `.tsx` UI는 `components/elements/*` 아래에만 둔다.
- `HR-ARC-05`: `features/<bounded>/shared`는 특정 subfeature의 `service.ts`, `queryKeys.ts`, `hooks/*`에 의존하지 않는다.
- `HR-IMP-01`: `packages/* -> features/*` import 금지.
- `HR-IMP-02`: `features/common -> features/domain-*` import 금지.
- `HR-IMP-03`: `app/*`에서 `features/*/service.ts` import를 금지한다. 예외는 `EX-01` 승인 케이스만 허용한다.

## 3) 서버 상태/쿼리 원문

- `HR-RQ-01`: query key는 `queryKeys.ts` factory를 통해서만 생성/사용한다.
- `HR-RQ-02`: `service.ts`는 순수 API 함수만 포함한다(React Query 훅 금지).
- `HR-RQ-03`: mutation 성공 시 영향 범위(`lists/detail`) invalidate를 누락하지 않는다.
- `HR-STATE-01`: 서버 상태를 store/local state로 중복 저장하지 않는다.

## 4) 타입/스타일/안전성 원문

- `HR-TYPE-01`: `any` 사용 금지.
- `HR-TYPE-02`: `type.ts|types.ts|dto.ts`의 모델 타입 선언은 기본적으로 `type`을 사용한다.
- `HR-TYPE-03`: 유니온 타입은 상수(`as const`) 소스에서 파생한다.
- `HR-TYPE-04`: `components/*`, `hooks/*`의 Props/계약 타입은 가독성 목적의 `interface` 사용을 허용한다(`extends` 필요 시 우선 권장).
- `HR-STYLE-01`: 신규 함수는 기본적으로 함수 표현식(`const fn = () => {}`)을 사용한다.

## 5) React 운영 원문

- `HR-REACT-01`: `useEffect`를 파생 상태 계산/이벤트 처리 용도로 사용하지 않는다.
- `HR-REACT-02`: mount fetch를 `useEffect` 기본 패턴으로 구현하지 않는다.
- `HR-REACT-03`: `react-hooks/exhaustive-deps` 비활성화 금지.
- `HR-REACT-04`: `app/*/page.tsx`에 `use client`를 붙이지 않는다.
- `HR-REACT-05`: Client Component를 `async` 함수로 선언하지 않는다.

## 6) 예외 처리

- Hard Rule 예외는 `EX-01` 템플릿을 필수로 작성한다.
- 예외 없는 Hard Rule 위반은 머지 차단 대상이다.

## 7) 검증 맵

- 상세 검증 방식은 `OPS-01`을 따른다.

## 8) 중복 정의 금지

- Hard Rule 원문은 이 문서에서만 정의한다.
- 다른 문서는 Rule ID를 참조하고 해설/예시만 제공한다.
