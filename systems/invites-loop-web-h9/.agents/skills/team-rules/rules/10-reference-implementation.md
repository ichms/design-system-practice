# REF-01 Reference Implementation

- Priority: P2
- Enforcement: Guide
- 적용 범위: 신규 기능 개발 시 샘플 참조
- 레퍼런스는 `Current Workspace Pattern`과 `Target Reference Pattern`을 분리해 관리한다.
- 기존 코드 수정 시에는 current pattern을 우선한다.
- 신규 API boundary 또는 점진 전환 작업은 target pattern을 따른다.

## 공통 규칙

- `app/*/page.tsx`는 thin route를 유지한다.
- feature의 화면 진입점은 `components/Page.tsx` 하나만 둔다.
- 추가 `.tsx`는 `components/elements/*` 아래에만 둔다.
- `service.ts`는 React Query 훅 없이 API I/O만 담당한다.

## Current Workspace Pattern

- 실제 기준: `packages/http/client.ts`
- 현재 시범 도입: `my` feature는 `app/api/my/*` + `packages/http/proxy.ts`를 사용한다.
- 기존 `ticket` feature는 `features/*/service.ts -> packages/http/client.ts` 경로를 유지한다.

### Current Example: My Feature

- `app/my/page.tsx`
- `features/my/components/Page.tsx`
- `features/my/components/elements/ReservationDetailDialog.tsx`
- `features/my/hooks/queries.ts`
- `features/my/hooks/mutations.ts`
- `features/my/service.ts`
- `features/my/queryKeys.ts`
- `app/api/my/reservations/*`
- `packages/http/client.ts`
- `packages/http/proxy.ts`

```tsx
// app/my/page.tsx
import { MyPage } from '@/features/my/components/Page'

const MyRoute = () => <MyPage />

export default MyRoute
```

```ts
// features/my/service.ts
import { httpClient } from '@/packages/http/client'

export const getMyReservationList = async () => {
  return await httpClient.get('/api/my/reservations')
}
```

```ts
// app/api/my/reservations/route.ts
import { NextResponse } from 'next/server'
import { listMyReservations } from '@/features/my/server/mock-store'
import { createProxyRouteHandler } from '@/packages/http/proxy'

const fallbackGetReservations = async () => {
  return NextResponse.json({
    success: true,
    data: listMyReservations(),
  })
}

export const GET = createProxyRouteHandler({
  buildPath: () => '/api/my/reservations',
  fallback: fallbackGetReservations,
})
```

## Target Reference Pattern

- 목표 기준: `app/api/*/route.ts` + root `middleware.ts` + proxy helper
- `route.ts`는 thin proxy boundary만 담당한다.
- 인증, 공통 헤더, tracing, rewrite 정책은 root `middleware.ts`에서 처리한다.
- upstream forwarding 책임은 `packages/http/proxy.ts` 또는 후속 proxy helper가 가진다.

### Target Template

- `app/(page)/ticket/page.tsx`
- `app/api/tickets/route.ts`
- `middleware.ts`
- `features/ticket/components/Page.tsx`
- `features/ticket/components/elements/*`
- `features/ticket/hooks/queries.ts`
- `features/ticket/service.ts`
- `features/ticket/queryKeys.ts`
- `packages/http/client.ts`
- `packages/http/proxy.ts`

## Migration Rule

1. 기존 feature 수정은 current pattern을 우선한다.
2. 신규 route boundary 시범 도입은 feature 단위로 target pattern을 제한 적용한다.
3. current와 target을 한 feature 안에서 혼합할 때는 boundary 파일(`app/api/*`, `service.ts`, `packages/http/proxy.ts`)을 명시적으로 둔다.
4. target pattern이 안정화되기 전까지는 reference를 그대로 복붙하지 말고, 현재 워크스페이스 구현과 함께 대조한다.

## 리뷰 체크 (Yes/No)

- 작업 대상 feature가 current pattern인지 target pattern인지 명시되었는가?
- `app/*/page.tsx`가 thin route를 유지하는가?
- `service.ts`가 순수 API 호출만 수행하는가?
- feature의 추가 UI 컴포넌트가 `components/elements/*` 아래에만 있는가?
- target pattern을 적용한 경우 `app/api/*`가 thin proxy boundary로 유지되는가?
- 공통 정책이 endpoint별 구현이 아니라 root `middleware.ts` 또는 proxy helper로 모이는가?

## 자동 검증

- 린트: 일부 가능
- 리뷰 수동: 필요
