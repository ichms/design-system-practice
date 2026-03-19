# TYPE-01 Types, Style, Safety

- Priority: P1
- Enforcement: Rule ID별 상이 (`GOV-02` Enforcement Matrix 참조)
- 적용 범위: `features/*`, `packages/*`의 TypeScript 코드

## SSOT 적용

- 강제 문구 원문/집행 강도는 `GOV-02`를 따른다.
- 본 문서는 `HR-TYPE-01,02,03,04`, `HR-STYLE-01` 해설/예시 중심으로 운영한다.

## MUST

- 신규 함수 선언은 함수 표현식을 기본으로 사용한다.
- `type.ts|types.ts|dto.ts`의 모델 타입 선언은 `type`을 기본으로 사용한다.
- 유니온 타입은 상수(`as const`)를 단일 소스로 두고 파생한다.
- 불확실 타입 입력은 `unknown`으로 받고 내로잉한다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `HR-TYPE-01` | `@typescript-eslint/no-explicit-any` | 예외 사유가 `EX-01`로 기록됐는지 |
| `HR-TYPE-02` | custom lint(선택) | 모델 타입 파일(`type.ts|types.ts|dto.ts`) 선언 방식 |
| `HR-TYPE-03` | custom lint(선택) | 상수(`as const`) 소스 파생 여부 |
| `HR-TYPE-04` | 제한적 | `interface` 사용 의도(가독성/extends) |
| `HR-STYLE-01` | `func-style`(선택) | 신규 함수 표현식 준수 여부 |

## MUST NOT

- `any`를 사용하지 않는다.
- 문자열 리터럴 유니온을 값 소스 없이 중복 하드코딩하지 않는다.

## 예외 (허용)

아래 케이스는 `interface`를 허용한다.

1. declaration merging
2. 모듈 보강(`declare module`)
3. 외부 라이브러리 타입 계약을 따라야 하는 공개 API 타입
4. 컴포넌트/훅의 Props/계약 타입에서 가독성 개선이 필요한 경우
5. 타입 상속을 명확히 표현하기 위해 `extends`가 필요한 경우

## 컴포넌트/훅 타입 가이드

- `type.ts|types.ts|dto.ts`는 기존 원칙대로 `type`을 기본으로 유지한다.
- `components/*`, `hooks/*`에서는 가독성 목적의 `interface` 사용을 허용한다.
- 특히 상속 관계를 표현해야 할 때는 `interface ... extends ...`를 우선 고려한다.

## SHOULD

- 도메인 식별자/상태 코드는 literal union 또는 브랜드 타입을 우선 사용한다.
- 함수 선언식이 더 적합한 케이스(오버로드 시그니처 등)는 예외 사유를 코멘트로 남긴다.
- 컴포넌트/훅에서 `interface`를 사용할 때는 `Props`/`Result` 등 역할이 드러나는 이름을 사용한다.

## 왜 필요한가

타입 일관성이 없으면 안전성 통제가 깨지고 런타임 오류가 리뷰 단계로 유입된다.

## Bad

```ts
export interface OrderDto {
  id: string;
  status: string;
}

export const isDone = (value: any) => value.status === 'DONE';
```

## Good

```ts
export const ORDER_STATUS = {
  READY: 'READY',
  DONE: 'DONE',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export type OrderDto = {
  id: string;
  status: OrderStatus;
};

export const isOrderDto = (value: unknown): value is OrderDto => {
  if (!value || typeof value !== 'object') return false;
  const v = value as { id?: unknown; status?: unknown };
  return typeof v.id === 'string' && typeof v.status === 'string';
};
```

## Bad

```tsx
type GoodComponentProps =  CommonProps & {
  idea: string
}

export const GoodComponent = ({idea,...props}:GoodComponentProps)=>{
  return (
    <div>... </div>
  )
}
```

## Good

```tsx
interface GoodComponentProps extends CommonProps  {
  idea: string
}

export const GoodComponent = ({idea,...props}:GoodComponentProps)=>{
  return (
    <div>... </div>
  )
}
```


## 리뷰 체크 (Yes/No)

- `any`가 없는가?
- 유니온이 상수 소스에서 파생되는가?
- `type.ts|types.ts|dto.ts`에서 모델 타입을 `type`으로 유지했는가?
- `interface` 사용이 허용 범위(컴포넌트/훅 가독성, extends 필요 등)에 해당하는가?

## 자동 검증

- 린트: 가능(`@typescript-eslint/no-explicit-any`)
- 리뷰 수동: 필요
