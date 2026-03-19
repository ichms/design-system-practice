# RQ-01 TanStack Query Rules

- Priority: P0
- Enforcement: Rule ID별 상이 (`GOV-02` Enforcement Matrix 참조)
- 적용 범위: `features/domain-*/service.ts`, `hooks/*`, `queryKeys.ts`

## SSOT 적용

- 강제 문구 원문/집행 강도는 `GOV-02`를 따른다.
- 본 문서는 `HR-RQ-01,02,03`, `HR-STATE-01`의 해설/예시/리뷰 기준만 제공한다.

## MUST

- TanStack Query는 `@tanstack/react-query` v5 기준으로 사용한다.
- `service.ts`는 순수 API 호출 함수만 가진다.
- `hooks/queries.ts`는 `useQuery` 계열만 가진다.
- `hooks/mutations.ts`는 `useMutation` 계열만 가진다.
- query key는 반드시 `queryKeys.ts` factory를 통해서만 사용한다.
- mutation 성공 시 관련 `lists/detail` invalidate를 수행한다.
- 서버 상태는 Query cache를 단일 소스로 사용한다.
- 조건부 query는 `enabled`로 제어한다.
- 화면은 loading/error 상태를 반드시 처리한다.
- query key와 query hook의 소유권은 feature에 두고, `app/*`는 이를 직접 생성하지 않는다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `HR-RQ-01` | custom lint / PR bot | `queryKeys.ts` factory만 사용하는지 |
| `HR-RQ-02` | `service.ts` import rule | React Query 훅 import 유무 |
| `HR-RQ-03` | 정적 분석 보조(제한) | mutation 성공 경로별 invalidate 누락 여부 |
| `HR-STATE-01` | 패턴 탐지(제한) | 서버 상태 store/local 중복 저장 여부 |

## SHOULD

- key 구조를 `all > lists > list`, `all > details > detail`로 유지한다.
- key 파라미터는 정규화 객체로 전달한다.
- prefetch/optimistic update는 사용자 체감 성능이 필요한 화면에서 사용한다.
- `app/*`는 read-only 데이터 조회를 위해 `service.ts`를 직접 사용하지 않는다.
- mutation hook의 `onSuccess`/`onError`는 invalidate/cache update/rollback 같은 캐시 동기화에 집중하고, 화면 전용 부작용은 호출 컴포넌트에서 처리한다.

## MUST NOT

- `service.ts`에서 React Query 훅을 사용하지 않는다.
- 문자열/배열 query key를 컴포넌트에서 하드코딩하지 않는다.
- 과도한 invalidate(`all`)를 기본값으로 사용하지 않는다.
- `useEffect`로 서버 데이터 fetch를 구현하지 않는다.
- 서버 데이터를 store/local state로 중복 저장하지 않는다.

## 왜 필요한가

캐시 정책 누락과 잘못된 invalidate를 구조적으로 차단하려면 파일 책임을 고정해야 한다.

## 표준 파일 책임

- `app/*`: route param 전달, 엔트리 조합
- `queryKeys.ts`: key factory
- `service.ts`: API I/O
- `hooks/queries.ts`: query hook
- `hooks/mutations.ts`: mutation hook

## queryKeys.ts 파일 위치

- 기본 위치: `features/domain-*/queryKeys.ts`
- 예시: `features/domain-orders/queryKeys.ts`
- 규칙: 도메인별로 1개 파일을 기본으로 두고, 하위 폴더 분리는 key 개수가 많아질 때만 적용한다.

## 리뷰 체크 (Yes/No)

- Query key가 `queryKeys.ts`에서만 생성되는가?
- `app/*`가 query key/query hook을 직접 소유하지 않는가?
- Mutation 성공 시 필요한 invalidate가 최소 범위로 포함되는가?
- mutation hook 콜백과 화면 부작용의 책임이 섞이지 않았는가?
- `service.ts`가 훅 없이 순수 API 함수만 포함하는가?
- 서버 상태를 Query cache 단일 소스로 유지하는가?
- `app/*`에서 `service.ts` import가 없는가? (예외 시 EX-01 존재)

## 자동 검증

- 린트: 가능(커스텀 룰 권장)
- 리뷰 수동: 필요
