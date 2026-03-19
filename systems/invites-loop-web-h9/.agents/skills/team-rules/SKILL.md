---
name: nextjs-domain-architecture
description: Domain-oriented architecture standard for Next.js App Router + TanStack Query projects. Use when defining team conventions, outsourcing handoff rules, AI agent coding constraints, and gradual scaling rules for service/hooks/query keys/state ownership.
---

# Next.js Domain Architecture Skill (Rules-Driven)

`rules/` 하위 문서를 기준으로 Next.js App Router + TanStack Query 프로젝트의 생성/수정/리뷰를 일관되게 수행하기 위한 실행형 스킬이다.

## When To Use

- 팀 규칙을 기준으로 신규 기능을 생성할 때
- 기존 기능을 리팩토링/수정할 때
- 외주 산출물/AI 산출물의 구조 적합성을 리뷰할 때
- PR에서 Hard Gate/Warning 판단과 예외 기록이 필요할 때

## Source Of Truth

- Hard Rule 원문/집행 강도 SSOT: `rules/00-governance/hard-rules.md` (`GOV-02`)
- Priority/Enforcement 해석 기준: `rules/00-governance/priority-matrix.md` (`GOV-01`)
- 실행형 AI 지시 SSOT: `rules/30-ai/ai-agent-rules.md` (`AI-OPS-01`)
- 문서 경로 탐색: `rules/00-index.md` (Rule Locator)

참고 전용 문서(`*.example.md`, `rules/50-reference/*`)는 실행 지시로 해석하지 않는다.

## Reference Interpretation

- 레퍼런스 문서는 `Current Workspace Pattern`과 `Target Reference Pattern`을 함께 가질 수 있다.
- 기존 코드 수정 시에는 현재 워크스페이스 패턴을 우선한다.
- 신규 API boundary 도입이나 점진 전환 작업에서는 target reference를 따른다.
- 둘이 충돌하면 현재 워크스페이스를 깨지 않는 범위에서 target 구조를 feature 단위로 시범 도입한다.

## Execution Order

1. 작업 유형을 결정한다.
2. `GOV-02` 기준 Hard Gate를 먼저 적용한다.
3. 해당 도메인의 Core Rule(`ARC/RQ/IMP/STATE/TYPE/REACT`)을 적용한다.
4. Warning/Guide 항목은 리뷰 코멘트와 개선 계획을 남긴다.
5. Hard Rule 예외가 필요하면 `EX-01` 템플릿 초안을 작성한다.

## Work Modes

- `Mode A (신규 기능 생성)`: 파일 세트를 순서대로 생성한다.
- `Mode B (기존 코드 수정)`: 필요한 파일만 최소 수정한다.

### Mode A 생성 순서 (`AI-OPS-01`)

1. `type.ts`
2. `queryKeys.ts`
3. `service.ts`
4. `hooks/queries.ts`
5. `hooks/mutations.ts` (mutation 필요 시)
6. `components/Page.tsx` + 필요 시 `components/elements/*.tsx`
7. `app/*/page.tsx`

## Hard Gate Checklist (Must Pass)

- `HR-ARC-01`: `app/*/page.tsx`는 Thin Route(엔트리/조합)만 담당한다.
- `HR-ARC-02`: `app/*`는 read-only 데이터 조회를 위해 `features/*/service.ts`를 직접 호출하지 않는다.
- `HR-ARC-03`: `app/*`에서 write/invalidate/정책성 side effect를 직접 처리하지 않는다.
- `HR-IMP-01`: `packages/* -> features/*` import 금지.
- `HR-IMP-02`: `features/common -> features/domain-*` import 금지.
- `HR-IMP-03`: `app/*`에서 `features/*/service.ts` import 금지. 예외는 `EX-01` 승인 케이스만 허용.
- `HR-RQ-01`: query key는 `queryKeys.ts` factory로만 생성/사용.
- `HR-RQ-02`: `service.ts`에 React Query 훅 import 금지(순수 API만).
- `HR-TYPE-01`: `any` 금지.
- `HR-REACT-03`: `react-hooks/exhaustive-deps` 비활성화 금지.

Hard Gate 위반은 `EX-01` 승인 정보 없이 머지할 수 없다.

## Warning And Guide Checklist

- `HR-RQ-03` (Warning): mutation 성공 경로별 `lists/detail` invalidate 누락 금지.
- `HR-STATE-01` (Warning): 서버 상태를 store/local state에 중복 저장하지 않는다.
- `HR-TYPE-02,03,04` (Warning): 타입 파일의 `type` 기본 원칙, union 상수 소스 파생, 컴포넌트/훅 계약 타입 의도 확인.
- `HR-STYLE-01` (Warning): 신규 함수는 함수 표현식 기본.
- `HR-REACT-01,02` (Warning): Effect 용도 제한, mount fetch 기본 패턴 금지.
- `SCALE-01` (Guide): 3축(크기/복잡도/렌더 영향)으로 분리 필요성을 판단한다.
- `DOM-01` (Warning): common 승격은 3조건(2개 이상 도메인 재사용, 정책 비의존, 소유권 합의) 충족 시만 허용.

## Layer And Import Boundaries

- `app/*`: 라우트 엔트리/조합만 담당
- `features/domain-*`: 도메인 UI/쿼리/서비스/타입 소유
- `features/common`: 도메인 비의존 공통 UI/훅/유틸
- `packages/*`: 범용 모듈만, app 정책/화면 흐름 결정 금지

허용 import 방향:

- `app/* -> features/domain-* | features/common | packages/*`
- `features/domain-* -> features/common | packages/*`
- `features/common -> packages/*`
- `packages/* -> packages/*`

## Query And State Rules

- Query key는 `all > lists > list`, `all > details > detail` 구조를 기본으로 한다.
- key 파라미터는 정규화 객체로 넣는다.
- `service.ts`는 API I/O만 가진다.
- 서버 상태는 TanStack Query cache를 단일 소스로 유지한다.
- URL 공유 상태는 URL에, 전역 UI 상태는 store에, 임시 입력 상태는 local/form state에 둔다.

## Type And React Rules

- `type.ts|types.ts|dto.ts`의 모델 타입 선언은 `type`을 기본으로 한다.
- union은 `as const` 상수 소스에서 파생한다.
- 불확실 입력은 `unknown`으로 받고 내로잉한다.
- `components/*`, `hooks/*`의 Props/계약 타입은 `type`/`interface` 모두 허용한다.
- feature의 화면 진입 컴포넌트는 `components/Page.tsx` 하나만 둔다.
- `components` 하위의 추가 `.tsx`는 `components/elements/*`에만 둔다.
- `components/elements/*`는 UI 컴포넌트 전용이며, hook/helper/type 파일은 둘 수 없다.
- 상속/계약 가독성이 중요하면 `interface ... extends ...`를 우선 고려한다.
- 부모 -> 자식 값 props는 명사형(`query`), 변경 요청은 `on*`, 자식 내부 DOM 핸들러는 `handle*`를 사용한다.

## Exception Protocol (`EX-01`)

Hard Rule 예외는 PR에 아래 필드를 모두 남긴다.

```md
### Rule Exception
- Rule ID: IMP-01
- Owner: @author
- Approver: @reviewer
- Reason: external SDK constraint
- Scope: /features/domain-a/service.ts:21
- Expiry: 2026-04-30
- Follow-up: remove after wrapper migration
```

- 누락 필드가 있으면 예외는 무효다.
- 만료일 도달 시 7일 내 갱신/제거한다.
- `eslint-disable`는 최소 라인 범위 + 사유 주석만 허용한다.

## Output Contract For Agent Responses

가능한 경우 아래 순서로 결과를 출력한다.

1. 생성/수정 파일 목록
2. Hard Rule 준수 체크(통과/예외)
3. Warning/Guide 항목(필요 시 Scale Check 포함)
4. 예외 필요 시 `Rule ID + 사유 + 만료일` 초안

## Quick References

- Governance: `rules/00-governance/*`
- Core Rules: `rules/01-architecture-foundation.md` ~ `rules/12-react-component-practices.md`
- AI Execution: `rules/30-ai/ai-agent-rules.md`
- Enforcement Mapping: `rules/40-operations/enforcement-mapping.md`
- Reference/Glossary: `rules/12-react-component-practices.example.md`, `rules/50-reference/glossary.md`
