# ARC-01 Architecture Foundation

- Priority: P0
- Enforcement: Rule ID별 상이 (`GOV-02` Enforcement Matrix 참조)
- 적용 범위: `app/*`, `features/*`, `packages/*`
- Hard Rule 참조: `GOV-02` (`HR-ARC-01,02,03`, `HR-IMP-01,02,03`)

## SSOT 적용

- 아래 내용은 `HR-ARC-*` 해설이며, 강제 문구 원문/집행 강도는 `GOV-02`를 따른다.
- 예외는 `EX-01` 템플릿으로만 기록한다.

## Current vs Target

- `Current Workspace Pattern`:
  - 대부분의 feature는 `features/*/service.ts -> packages/http/client.ts` 경로를 사용한다.
  - `app/*/page.tsx`는 thin route를 유지하고, 클라이언트 기능은 feature page가 담당한다.
  - `components/Page.tsx + components/elements/*` 구조를 기본으로 사용한다.
- `Target Reference Pattern`:
  - feature별 `app/api/*/route.ts`를 thin proxy boundary로 둔다.
  - 공통 요청 정책은 루트 `middleware.ts`에서 처리한다.
  - `packages/http/proxy.ts` 또는 후속 helper가 upstream forwarding 책임을 가진다.
- 운영 원칙:
  - 기존 코드 수정은 current pattern을 우선한다.
  - 신규 route boundary 시범 도입은 target pattern을 feature 단위로 제한 적용한다.

## MUST

- 기능 코드는 `features/domain-*` 내부에 둔다.
- `app/*/page.tsx`는 라우트 엔트리와 조합만 담당한다.
- API 호출, 캐시 제어, UI 렌더링을 파일 단위로 분리한다.
- `app/*`는 read-only 데이터 조회를 위해 `features/*/service.ts`를 직접 호출하지 않는다.
- feature 화면 진입점은 `components/Page.tsx` 하나로 유지하고, 세부 UI는 `components/elements/*`로 분리한다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `HR-ARC-01` | 경계 린트(선택) | `app/*/page.tsx`가 엔트리/조합만 수행하는지 |
| `HR-ARC-02` | import 제한 규칙 | app이 read-only 데이터 조회를 위해 service를 직접 호출하지 않는지 |
| `HR-ARC-03` | 제한적 | app에서 write/invalidate/정책 side effect 유무 |

## SHOULD

- 공통 요소는 `features/common`으로 모은다.
- 초기에는 단순 구조로 시작하고 복잡도 증가 시 분리한다.

## MUST NOT

- `app/*/page.tsx`에 도메인 비즈니스 로직을 넣지 않는다.
- 도메인 폴더에서 타 도메인 내부 구현을 직접 참조하지 않는다.
- `app/*`에서 write 요청(생성/수정/삭제)이나 invalidate를 직접 처리하지 않는다.

## ARC-EX-01 (허용 예외)

아래 조건을 모두 충족하면 `app/*`의 `service.ts` import 예외를 허용할 수 있다.

1. SEO/SSR 요구가 명확하다.
2. 예외 범위가 해당 라인/파일로 한정된다.
3. `EX-01`에 제거 계획과 만료일이 포함된다.
4. 캐시 정책은 Query 또는 서버 캐시 정책 중 하나로 일관되게 관리한다.

## 왜 필요한가

라우트 파일 비대화와 책임 혼합을 막아 변경 영향 범위를 통제하기 위함이다.

## Bad

```tsx
// app/orders/page.tsx
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const { data } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
  return <div>{/* ... */}</div>;
};

export default Page;
```

## Good

```tsx
// app/orders/page.tsx
import { OrdersPage } from '@/features/domain-orders/components/Page';

const Page = () => <OrdersPage />;

export default Page;
```

```tsx
// features/my/components/Page.tsx
'use client'

import { ReservationDetailDialog } from '@/features/my/components/elements/ReservationDetailDialog'

export const MyPage = () => {
  return (
    <section>
      <ReservationDetailDialog />
    </section>
  )
}
```

```ts
// features/my/service.ts
import { httpClient } from '@/packages/http/client'

export const getMyReservationList = async () => {
  return await httpClient.get('/api/my/reservations')
}
```

## 리뷰 체크 (Yes/No)

- `app/*/page.tsx`가 엔트리 역할만 하는가?
- `app/*`에서 `service.ts` import가 없는가? (예외 시 EX-01 존재)
- `app/*`에서 write/invalidate가 없는가?
- feature의 추가 UI 컴포넌트가 `components/elements/*` 아래에만 있는가?

## 자동 검증

- 린트: 부분 가능(`no-restricted-imports`)
- 리뷰 수동: 필요
