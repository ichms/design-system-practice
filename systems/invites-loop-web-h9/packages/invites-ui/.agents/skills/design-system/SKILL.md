---
name: design-system-cva-cn
description: Design system styling rules for Tailwind + cva (class-variance-authority) and cn (classnames merge). Use when creating or reviewing UI components that use variant-based styling, shared Button/component patterns, or Tailwind class composition.
---

# Design System Skill (cva / cn)

`rules/` 하위 문서를 기준으로 Tailwind 기반 컴포넌트 스타일링(cva, cn)을 일관되게 적용하기 위한 실행형 스킬이다. 참조 구현: `features/common/component/Button.tsx`.

## When To Use

- variant 기반 Tailwind 컴포넌트를 새로 만들거나 수정할 때
- cva / cn 사용 패턴을 리뷰하거나 가이드할 때
- 디자인 시스템 컴포넌트(Button, Input, Badge 등) 규칙을 적용할 때

## Source Of Truth

- cva/cn 스타일 규칙: `rules/01-cva-cn-styling.md` (`DS-01`)
- Tailwind v4 토큰 + twMerge 충돌 규칙: `rules/02-tailwind-v4-token-pitfalls.md` (`DS-02`)
- 문서 경로 탐색: `rules/00-index.md` (Rule Locator)

## Execution Order

1. 작업 대상이 variant 기반 UI 컴포넌트인지 확인한다.
2. `DS-01`의 MUST 항목(cva 구조, cn 병합 순서, VariantProps)을 적용한다.
3. `DS-02`를 확인한다: `text-*` 색상에 camelCase 토큰 사용 여부, `text-white` 사용 여부, `extendTailwindMerge` 등록 여부.
4. SHOULD/Warning 항목은 리뷰 시 코멘트로 남긴다.

## Rule Summary (DS-01)

- **cva**: 베이스 클래스 + `variants` + `defaultVariants` 구조 사용. 컴포넌트 전용 variants는 해당 파일에만 두고, Props 타입은 `VariantProps<typeof xxxVariants>`로 추출.
- **cn**: Tailwind 클래스 병합 시 `cn(variant결과, className)` 순서 유지. 충돌 시 뒤 인자가 우선되므로 사용자 `className`을 마지막에 둔다.
- **참조**: `features/common/component/Button.tsx`를 기준 패턴으로 따른다.

## Layer And Scope

- 적용 범위: `features/common/component/*`, 도메인 내 공통 UI 컴포넌트
- `cn`은 `@/packages/ui`(또는 프로젝트 cn 유틸)에서 import하고, cva는 `class-variance-authority`에서 import한다.

## Output Contract For Agent Responses

가능한 경우 아래 순서로 결과를 출력한다.

1. 생성/수정 파일 목록
2. DS-01 준수 체크 (cva 구조, cn 사용 위치, VariantProps 적용 여부)
3. 참조(Button.tsx)와의 일관성 여부
