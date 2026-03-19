# IMP-01 Import Boundaries

- Priority: P0
- Enforcement: `HR-IMP-01,02,03` Hard Gate (`GOV-02` Enforcement Matrix 기준)
- 적용 범위: 전체 코드베이스

## SSOT 적용

- 강제 문구 원문/집행 강도는 `GOV-02`를 따른다.
- 본 문서는 `HR-IMP-01,02,03`의 경계 해설과 리뷰 기준을 제공한다.

## MUST

- 허용 방향만 사용한다.
- `app/*`는 기본적으로 `components/Page.tsx`를 통해 도메인에 진입한다.
- feature의 세부 UI 컴포넌트는 `components/elements/*`에 둔다.
- `app/*`에서 `features/*/service.ts` import를 금지한다. 예외는 `EX-01` 승인 케이스만 허용한다.

## 허용 방향

- `app/* -> features/domain-*`, `features/common`, `packages/*`
- `features/domain-* -> features/common`, `packages/*`
- `features/common -> packages/*`
- `packages/* -> packages/*`

## MUST NOT

- `packages/* -> features/*`
- `features/common -> features/domain-*`
- `app/*`에서 `service.ts`를 import
- `app/*`에서 fetch 구현 세부 로직을 직접 작성하지 않는다.

## 왜 필요한가

경계가 깨지면 공통 레이어가 도메인에 오염되고, 의존성 역전으로 리팩토링 비용이 폭증한다.

## Bad

```tsx
// app/orders/page.tsx
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/features/domain-orders/service';

const Page = () => {
  const { data } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders({}),
  });

  return <OrderList items={data?.items ?? []} />;
};

export default Page;
```

## Good

```tsx
// features/domain-orders/hooks/queries.ts
import { useQuery } from '@tanstack/react-query';
import { orderKeys } from '@/features/domain-orders/queryKeys';
import { getOrders } from '@/features/domain-orders/service';

export const useOrdersQuery = (params: { status?: string }) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
  });
};
```

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `HR-IMP-01` | `boundaries`/`no-restricted-imports` | `packages/* -> features/*` 예외 사유 |
| `HR-IMP-02` | `boundaries`/`no-restricted-imports` | `features/common -> features/domain-*` 위반 여부 |
| `HR-IMP-03` | import 제한 규칙 | `app/*`에 `service.ts` import가 없는지, 예외 승인 여부 |

```tsx
// app/orders/page.tsx
import { OrdersPage } from '@/features/domain-orders/components/Page';

const Page = () => <OrdersPage />;

export default Page;
```

## 리뷰 체크 (Yes/No)

- 금지 방향 import가 없는가?
- `app/*`에서 `service.ts` import가 없는가? (예외 시 EX-01 존재)
- feature의 추가 `.tsx`가 `components/elements/*` 밖으로 흩어지지 않았는가?

## 자동 검증

- 린트: 가능(`no-restricted-imports`, `eslint-plugin-boundaries`)
- 린트: `app/*`에서 `http client` 직접 import 제한
- 리뷰 수동: 보조
