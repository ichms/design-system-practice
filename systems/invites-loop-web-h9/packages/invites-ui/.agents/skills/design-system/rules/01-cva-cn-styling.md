# DS-01 cva / cn Styling Rules

- 적용 범위: `features/common/component/*`, variant 기반 UI 컴포넌트
- 참조 구현: `features/common/component/Button.tsx`

## 1. cva (class-variance-authority)

Tailwind 클래스를 variant 기준으로 타입 안전하게 관리할 때 사용한다.

### MUST

- **구조**: `cva('베이스클래스', { variants: { ... }, defaultVariants: { ... } })` 형태로 정의한다.
- **베이스**: 레이아웃·포커스·disabled·transition 등 모든 variant에 공통으로 들어갈 클래스만 첫 인자에 둔다.
- **defaultVariants**: 모든 variant 키에 대한 기본값을 지정한다. (미지정 시 타입에서 `undefined` 허용됨)
- **Props 타입**: 컴포넌트 Props에서 variant 관련 타입은 `VariantProps<typeof xxxVariants>`를 사용해 추출한다.

```ts
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: { default: '...', primary: '...' },
      size: { sm: '...', md: '...' },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

### SHOULD

- variant 정의가 **해당 컴포넌트에서만** 쓰이면 같은 파일에 둔다. 여러 컴포넌트에서 공유할 때만 별도 파일(예: `variants.ts`)로 분리한다.
- variant 키 이름은 `variant`, `size`, `fullWidth` 등 의미가 드러나게 짓는다.

### MUST NOT

- cva 반환 함수를 컴포넌트 밖에서 호출할 때 `undefined`가 들어가면 안 되므로, `defaultVariants`로 기본값을 반드시 채운다.

---

## 2. cn (classnames merge)

`packages/ui`의 `cn`(clsx + twMerge)으로 Tailwind 클래스를 병합한다.

### MUST

- **병합 순서**: `cn(variant결과, className)` 순서를 지킨다. 즉, cva로 만든 클래스를 먼저 넣고, 사용자가 넘긴 `className`을 나중에 넣어, 오버라이드가 가능하게 한다.
- **import**: `cn`은 프로젝트 공용 유틸(`@/packages/ui` 등)에서만 import한다.

```tsx
<button
  className={cn(
    buttonVariants({ variant, size, fullWidth }),
    className,
  )}
  {...props}
/>
```

### SHOULD

- 조건부 클래스가 필요할 때는 `cn(base, condition && '클래스')` 형태로 clsx 조건을 활용한다.
- 같은 유틸리티 그룹(예: `px-4`, `px-6`)이 겹치면 twMerge가 뒤에 오는 값으로 정리하므로, 오버라이드 의도가 있으면 해당 클래스를 `className` 쪽에 둔다.

### MUST NOT

- `className={buttonVariants({ ... })}` 만 쓰고 `className` prop을 받지 않거나, 받더라도 병합하지 않으면 외부에서 스타일 보정이 불가능하므로, 반드시 `cn(..., className)`으로 병합한다.

---

## 3. Bad / Good 예시

### Bad

```tsx
// defaultVariants 누락 → variant/size undefined 가능
const boxVariants = cva('...', {
  variants: { variant: { a: '...' }, size: { s: '...' } },
})

// 사용자 className 무시
<button className={buttonVariants({ variant, size })} />

// VariantProps 미사용 → variant 타입 수동 중복
interface ButtonProps {
  variant?: 'default' | 'primary'
  size?: 'sm' | 'md'
}
```

### Good

```tsx
const buttonVariants = cva('베이스', {
  variants: { variant: { ... }, size: { ... } },
  defaultVariants: { variant: 'default', size: 'md' },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

<button
  className={cn(buttonVariants({ variant, size, fullWidth }), className)}
  {...props}
/>
```

---

## 4. 리뷰 체크 (Yes/No)

- cva에 `defaultVariants`가 모두 지정되어 있는가?
- 컴포넌트에서 `className`을 `cn(variant결과, className)` 순서로 병합하는가?
- Props에 `VariantProps<typeof xxxVariants>`를 사용해 variant 타입을 추출했는가?
- variant 정의가 한 컴포넌트 전용이면 같은 파일에 두었는가?

---

## 5. 참조

- 구현 예시: `features/common/component/Button.tsx`
- cn 유틸: `packages/ui/cn.ts` (clsx + twMerge)
