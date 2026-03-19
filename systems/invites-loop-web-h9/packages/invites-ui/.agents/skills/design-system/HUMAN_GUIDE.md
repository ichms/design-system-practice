# Design System Human Guide

`design-system` 스킬의 cva/cn 스타일링 규칙을 빠르게 이해하고,  
variant 기반 UI 컴포넌트를 작성·리뷰할 때 적용할 수 있도록 정리한 문서입니다.

## 1) 온보딩 경로

1. `rules/01-cva-cn-styling.md` (`DS-01`): cva/cn 사용 규칙
2. 참조 구현: `features/common/component/Button.tsx`

## 2) 핵심 개념

| 도구 | 역할 |
| --- | --- |
| **cva** | variant별 Tailwind 클래스를 타입 안전하게 정의. 베이스 + variants + defaultVariants. |
| **cn** | clsx + twMerge. 클래스 병합 시 Tailwind 충돌을 해결하고, 뒤에 오는 클래스가 우선. |

## 3) 문서 구조

- `rules/00-index.md`: Rule Locator (규칙 ID ↔ 파일 매핑)
- `rules/01-cva-cn-styling.md`: cva/cn MUST·SHOULD·예시

## 4) 실무 적용 프레임

1. **새 variant 컴포넌트 작성 시**: cva로 베이스 + variants + defaultVariants 정의 → Props에 `VariantProps<typeof xxxVariants>` extends → 렌더 시 `cn(xxxVariants({ ... }), className)`.
2. **리뷰 시**: variant 정의 위치(컴포넌트 전용 vs 공유), cn 호출 순서(사용자 className 마지막), 타입 추출(VariantProps) 여부 확인.

## 5) 반드시 지킬 것 (MUST)

- cva 사용 시 `defaultVariants`로 기본값 지정.
- 컴포넌트 `className`은 항상 `cn(variant결과, className)` 순서로 병합해 외부 오버라이드 허용.
- Props 타입에 `VariantProps<typeof xxxVariants>`를 사용해 variant/size 등 자동 완성 유지.

## 6) 권장 (SHOULD)

- variant 정의는 해당 컴포넌트에서만 쓰이면 같은 파일에 두기.
- 베이스 클래스에는 공통 스타일(레이아웃, 포커스, disabled)만 두고, variant별로 색/크기 등만 분리.

## 7) 참조 구현

- `features/common/component/Button.tsx`: cva + cn + VariantProps 전체 흐름 예시.

## 8) 빠른 참조

- 규칙 상세: `rules/01-cva-cn-styling.md`
- 인덱스: `rules/00-index.md`

---

## 9) 추후 shadcn/ui 치환 시 참고

현재 Button 등 variant 컴포넌트는 **추후 shadcn/ui로 교체**할 예정이다. 치환 시 아래를 맞추면 마이그레이션이 수월하다.

### variant 매핑 (현재 → shadcn)

| 현재 (우리) | shadcn |
| ----------- | ------ |
| `primary`   | `default` (메인 CTA용) |
| `default`   | `secondary`에 가깝게 매핑 가능 |
| `secondary` | `secondary` |
| `outline`   | `outline` |
| `ghost`     | `ghost` |
| `link`      | `link` |
| *(없음)*    | `destructive` — 도입 전에 추가해 두면 치환 시 그대로 대응 가능 |

### size 매핑

| 현재 | shadcn |
| ---- | ------ |
| `sm` | `sm` |
| `md` | `default` (shadcn은 medium을 default로 둠) |
| `lg` | `lg` |
| *(없음)* | `icon` — 아이콘 전용 버튼용. 미리 추가 시 치환 시 호환 좋음 |

### shadcn에 없는 것 (우리 확장)

- **fullWidth**: 치환 후에는 `className="w-full"` 또는 래퍼에서 `cn(buttonVariants(), 'w-full')`로 처리.
- **isLoading / loadingText / leftIcon / rightIcon / loadingIcon**: shadcn은 `disabled` + 자체 `Spinner` + `data-icon="inline-start"` 패턴 사용. 치환 시 (1) 우리 Button을 shadcn Button을 감싼 래퍼로 유지하거나, (2) shadcn Button 소스를 복사한 뒤 이 로직을 그대로 넣는 방식 선택.

### 권장 사항

1. **`buttonVariants` export**: `<a>` 등에 버튼 스타일을 쓸 때와 shadcn 치환 후에도 동일 패턴을 쓰려면 `buttonVariants`를 export 해 두는 것이 좋다. shadcn도 `buttonVariants`를 export 한다.
2. **variant 이름**: 치환 시 한 번에 바꾸려면 `primary` → `default`로 치환 검색하면 된다. 필요하면 현재 단계에서 `destructive` variant를 미리 추가해 두면 API가 shadcn과 맞춰진다.
3. **파일 위치**: shadcn 도입 시 보통 `components/ui/button.tsx`(또는 `packages/ui`)에 두므로, import 경로만 `@/features/common/component/Button` → `@/components/ui/button` 등으로 일괄 변경하면 된다.
