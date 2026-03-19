# Team Rules Human Guide

`team-rules` 스킬 문서 중 **사람이 읽는 문서**와 **AI가 읽는 문서**를 분리해 안내합니다.

## 1) 문서 구분 원칙

- AI 전용 문서: `rules/00-*`, `rules/30-*`, `rules/40-*`, `rules/50-*`
- 사람 전용 문서: `HUMAN_GUIDE.md`, `human/*`

핵심: `rules/*`는 에이전트 실행 기준(SSOT/운영 매핑)으로 관리하고,
실무자가 빠르게 보는 운영 안내는 `human/*`에 둡니다.

## 2) 사람 문서 빠른 시작

1. `human/hook-naming-convention.md`: Query/Jotai Hook 네이밍
2. `human/feature-structure-must-and-mustnt.md`: 자주 틀리는 구조 Do / Don't
3. `human/husky-workflow.md`: 커밋/푸시 검증 흐름
4. 필요 시 `rules/01,02,05,07,12`를 참고해 상세 원칙 확인

## 3) 개발자가 자주 확인할 운영 기준

- Hook 네이밍:
  - React Query: `use*Query`, `use*Mutation`
  - Jotai: `use*Value`, `useSet*`
- 상태 소유권:
  - 서버 상태는 TanStack Query cache 단일 소스 유지
  - 전역 UI 상태만 store에 둔다
- 경계 규칙:
  - `packages -> features` 금지
  - `features/common -> features/domain-*` 금지
  - `app/*/page.tsx`는 thin route 유지
  - 추가 UI `.tsx`는 `components/elements/*`로 정리

## 4) Husky 품질 게이트

- `pre-commit`: `pnpm lint`
- `pre-push`: `pnpm ci:check`

팀 기준으로 PR 전 최소 1회 `pnpm ci:check`를 수동 실행합니다.

## 5) AI 문서가 필요한 경우

사람 문서로 부족할 때만 `rules/*` 문서를 열어 상세 규칙 ID(예: `HR-RQ-01`, `HR-IMP-02`)를 확인합니다.
