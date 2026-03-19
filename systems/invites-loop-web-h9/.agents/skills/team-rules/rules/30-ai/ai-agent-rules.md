# AI-OPS-01 AI Agent Execution Rules

- 적용 대상: Codex / Claude / Cursor 등 코드 생성/수정 에이전트
- 목적: 사람 설명형 규칙과 분리된 "실행형 지시"를 제공한다.

## 0) Execution Source

- 실행형 지시는 `rules/30-ai/*`만 사용한다.
- `*.example.md`, `50-reference/*`는 참고 전용이며 실행 지시로 해석하지 않는다.
- 플랫폼/System 지시와 충돌 시 플랫폼/System 지시를 우선한다.
- 문서의 `features/domain-*` 표기는 개념 예시다. 실제 생성 시에는 현재 레포의 기능명 규칙(`features/ticket/*`, `features/orders/*` 등)을 우선 따른다.

## 1) 실행 모드

- `Mode A (신규 기능 생성)`: 파일 세트를 순서대로 생성한다.
- `Mode B (기존 코드 수정)`: 필요한 파일만 최소 수정한다. 생성 순서를 강제하지 않는다.

## 2) 공통 MUST

- `AI-MUST-01`: Hard Rule(`GOV-02`)을 우선 적용한다.
- `AI-MUST-02`: query key는 `queryKeys.ts` factory를 사용한다.
- `AI-MUST-03`: 서버 상태는 TanStack Query cache를 단일 소스로 유지한다.
- `AI-MUST-04`: `app/*`는 라우트 엔트리/조합만 담당하도록 생성한다. `features/*/service.ts` import는 예외 승인 없이는 생성하지 않는다.
- `AI-MUST-05`: 규칙 충돌 시 `GOV-01` 우선순위를 따른다.
- `AI-MUST-06`: `type.ts|types.ts|dto.ts`의 모델 타입은 `type`으로 생성한다.
- `AI-MUST-07`: `components/*`, `hooks/*`의 Props/계약 타입은 `type` 또는 `interface`를 사용한다. 가독성/상속(`extends`)이 필요한 경우 `interface`를 우선 고려한다.
- `AI-MUST-08`: `app/*/page.tsx`는 기본적으로 Server Component로 생성한다. 클라이언트 상호작용은 가능한 한 `features/*/components/*`로 내린다.
- `AI-MUST-09`: query key와 query hook의 소유권은 해당 feature의 `queryKeys.ts`, `hooks/*`에 둔다. `app/*`는 route param 전달과 조합만 담당한다.
- `AI-MUST-10`: mutation hook의 `onSuccess`/`onError`에는 invalidate, cache update, optimistic rollback 같은 캐시 동기화 책임만 둔다. navigation, dialog, toast, form reset 같은 화면 부작용은 호출 컴포넌트에서 처리한다.
- `AI-MUST-11`: feature의 `components` 디렉토리에는 템플릿 역할의 `Page.tsx` 하나만 두고, 나머지 `.tsx` UI 조각은 `components/elements/*`에 생성한다.

## 3) 공통 MUST NOT

- `AI-NOT-01`: `service.ts`에 React Query import 생성 금지.
- `AI-NOT-02`: `queryKeys.ts` 없이 배열/문자열 key 하드코딩 금지.
- `AI-NOT-03`: `packages/* -> features/*` import 생성 금지.
- `AI-NOT-04`: `any` 생성 금지.
- `AI-NOT-05`: 부모 setter를 자식 props(`setX`)로 직접 노출하는 코드 생성 금지.
- `AI-NOT-06`: `type.ts|types.ts|dto.ts`에서 모델 타입을 `interface`로 기본 생성하지 않는다.
- `AI-NOT-07`: `app/*/page.tsx`에 관성적으로 `use client`를 붙이지 않는다.
- `AI-NOT-08`: Client Component를 `async` 함수로 생성하지 않는다.
- `AI-NOT-09`: 특정 subfeature의 service/query key에 의존하는 hook을 `shared` 디렉토리로 승격하지 않는다.
- `AI-NOT-10`: `components/elements/*` 밖에 추가 `.tsx` 컴포넌트를 생성하지 않는다.
- `AI-NOT-11`: `components/elements/*`에 hook/helper/type 파일을 생성하지 않는다.

## 4) Mode A 생성 순서 (신규 기능)

1. `type.ts`
2. `queryKeys.ts`
3. `service.ts`
4. `hooks/queries.ts`
5. `hooks/mutations.ts` (mutation이 있는 경우에만)
6. `components/Page.tsx`
7. `components/elements/*` (세부 UI가 필요한 경우에만)
8. `app/*/page.tsx`

## 5) 출력 계약 (기본안)

에이전트는 가능한 경우 아래 순서로 결과를 출력한다.

1. 생성/수정 파일 목록
2. Hard Rule 준수 체크(통과/예외)
3. 예외가 있으면 Rule ID + 사유 + 만료일

## 6) 예외 처리

- Hard Rule 예외는 자동 승인할 수 없다.
- 예외가 필요한 경우 `EX-01` 양식 초안을 함께 제시한다.
