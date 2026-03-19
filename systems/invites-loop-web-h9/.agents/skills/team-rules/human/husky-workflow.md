# Husky 워크플로우 (Human)

이 문서는 개발자가 커밋/푸시 단계에서 어떤 검증이 자동 실행되는지 빠르게 확인하기 위한 가이드입니다.

## 1) 현재 Hook 구성

- `pre-commit` -> `pnpm lint`
- `pre-push` -> `pnpm ci:check`

`pnpm ci:check` 실행 순서:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm lint:rules`

## 2) 개발 흐름

1. `git add ...`
2. `git commit -m "..."`
3. `pre-commit`에서 린트 통과 시 커밋 완료
4. `git push`
5. `pre-push`에서 `ci:check` 통과 시 푸시 완료

## 3) 실패 시 대응

- 커밋이 막히면: `pnpm lint` 결과를 먼저 수정
- 푸시가 막히면: `pnpm ci:check` 결과를 순서대로 수정

## 4) 운영 원칙

- 기본적으로 `--no-verify` 사용 금지
- Hook 동작 이상 시 `pnpm install`로 Husky 재설치
- 로컬에서 사전 확인: `pnpm lint`, `pnpm ci:check`
