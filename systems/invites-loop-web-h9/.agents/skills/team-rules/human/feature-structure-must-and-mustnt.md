# Feature Structure MUST / MUST NOT

혼란스러운 경우 빠르게 판단할 수 있도록 자주 틀리는 구조만 `MUST / MUST NOT`로 정리합니다.

## 1) `app/*/page.tsx`에서 hook/use client/useQuery 직접 쓰지 않기

### MUST NOT

```tsx
// app/orders/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'

const OrdersRoute = () => {
  const { data } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  })

  return <div>{data?.length}</div>
}

export default OrdersRoute
```

### MUST

```tsx
// app/orders/page.tsx
import { OrdersPage } from '@/features/orders/components/Page'

const OrdersRoute = () => <OrdersPage />

export default OrdersRoute
```

```ts
// features/orders/hooks/queries.ts
export const useOrdersQuery = () => {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
  })
}
```

핵심:
- `app/*/page.tsx`는 route entry만 담당
- hook과 클라이언트 로직은 feature로 내리기

## 2) `Page.tsx` 외 `.tsx`는 `components/elements/*`로 보내기

### MUST NOT

```text
features/orders/components/Page.tsx
features/orders/components/FilterBar.tsx
features/orders/components/OrderList.tsx
features/orders/components/OrderDialog.tsx
```

### MUST

```text
features/orders/components/Page.tsx
features/orders/components/elements/FilterBar.tsx
features/orders/components/elements/OrderList.tsx
features/orders/components/elements/OrderDialog.tsx
```

```tsx
// features/orders/components/Page.tsx
import { FilterBar } from '@/features/orders/components/elements/FilterBar'
import { OrderList } from '@/features/orders/components/elements/OrderList'

export const OrdersPage = () => {
  return (
    <section>
      <FilterBar />
      <OrderList />
    </section>
  )
}
```

핵심:
- `components/Page.tsx`는 feature의 유일한 템플릿 진입점
- 나머지 UI `.tsx`는 `components/elements/*`

## 3) `service.ts`에는 React Query 넣지 않기

### MUST NOT

```ts
// features/orders/service.ts
import { useQuery } from '@tanstack/react-query'

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  })
}
```

### MUST

```ts
// features/orders/service.ts
import { httpClient } from '@/packages/http/client'

export const getOrders = async () => {
  return await httpClient.get('/api/orders')
}
```

```ts
// features/orders/hooks/queries.ts
import { useQuery } from '@tanstack/react-query'
import { orderKeys } from '@/features/orders/queryKeys'
import { getOrders } from '@/features/orders/service'

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
  })
}
```

핵심:
- `service.ts`는 API I/O만 담당
- React Query 훅은 `hooks/queries.ts`, `hooks/mutations.ts`에 두기

## 4) `shared`는 특정 subfeature 의존이 있으면 만들지 않기

### MUST NOT

```text
features/ticket/shared/hooks/queries.ts
```

```ts
// features/ticket/shared/hooks/queries.ts
import { queueKeys } from '@/features/ticket/queue/queryKeys'
import { getQueueStatus } from '@/features/ticket/queue/service'
```

### MUST

```text
features/ticket/queue/hooks/queries.ts
features/ticket/shared/type.ts
features/ticket/shared/utils.ts
```

핵심:
- `shared`는 진짜 공용 타입/상수/유틸만
- 특정 subfeature의 `service.ts`, `queryKeys.ts`에 의존하면 그건 shared가 아님

## 5) mutation hook 콜백에는 invalidate만, navigation/toast는 컴포넌트에서 처리하기

### MUST NOT

```ts
// features/orders/hooks/mutations.ts
export const useCancelOrderMutation = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast.success('취소되었습니다.')
      router.push('/orders')
    },
  })
}
```

### MUST

```ts
// features/orders/hooks/mutations.ts
export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_, orderId) => {
      void queryClient.invalidateQueries({
        queryKey: orderKeys.detail({ orderId }),
      })
      void queryClient.invalidateQueries({
        queryKey: orderKeys.list(),
      })
    },
  })
}
```

```tsx
// features/orders/components/Page.tsx
const handleCancel = async () => {
  await cancelOrderMutation.mutateAsync(orderId)
  toast.success('취소되었습니다.')
  router.push('/orders')
}
```

핵심:
- hook은 서버 상태 동기화 책임만
- navigation, toast, dialog close는 화면마다 달라질 수 있으므로 컴포넌트에서 처리
