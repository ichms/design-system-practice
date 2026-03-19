# Hook 네이밍 컨벤션 (Human)

이 문서는 사람이 빠르게 Hook 종류를 구분하고 일관된 이름을 쓰기 위한 가이드입니다.

## 1) 목적

- React Query Hook과 Jotai Hook을 이름만 보고 구분한다.
- 리뷰 시 “의도-구현” 불일치를 빠르게 탐지한다.
- ESLint 자동 검증 규칙과 사람 기준을 동일하게 맞춘다.

## 2) 네이밍 규칙

### React Query

- Query Hook: `use*Query`
- Mutation Hook: `use*Mutation`

예시:

- `useTicketDetailQuery`
- `useQueueStatusQuery`
- `useCreateReservationMutation`

### Jotai

- 값 조회 Hook: `use*Value`
- 값 변경 Hook: `useSet*`

예시:

- `useTokenIdValue`
- `useSetTokenId`

## 3) 파일 배치 규칙

- Query Hook: `features/**/hooks/queries.ts`
- Mutation Hook: `features/**/hooks/mutations.ts`
- Jotai Hook: `features/**/store/*`

## 4) 린트 연동

`eslint.config.mjs`에서 아래를 강제합니다.

- `**/hooks/queries.*` -> exported const는 `use*Query`
- `**/hooks/mutations.*` -> exported const는 `use*Mutation`
- `features/**/store/**` -> exported const는 `use*Value` 또는 `useSet*`

규칙 위반 시 `pnpm lint`에서 에러가 발생합니다.
