# DOM-01 Domain Boundary and Common Promotion

- Priority: P1
- Enforcement: Warning
- 적용 범위: `features/domain-*`, `features/common`, `features/<bounded-context>/shared`

## MUST

- 도메인 폴더가 해당 기능의 UI/API/캐시 정책을 소유한다.
- 정책이 다르면 재사용 대신 복사 후 분기한다.
- 공통 승격 전 `Promotion Request`를 남긴다.
- `features/<bounded-context>/shared`는 같은 bounded context 안에서 2개 이상 subfeature가 재사용하고, 특정 subfeature의 service/query key/policy를 직접 소유하지 않는 자산만 둔다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `DOM-01` | 제한적 | 도메인 소유권(UI/API/캐시) 일관성 |
| `DOM-02` | 제한적 | 정책 불일치 시 분기/분리 근거 |
| `DOM-03` | 없음 | Promotion Request 작성 여부 |

## SHOULD

- 아래 3조건을 모두 만족할 때만 `common`으로 승격한다.
  1. 2개 이상 도메인에서 동일 요구로 반복 사용
  2. 도메인 고유 용어/정책 의존 없음
  3. 공통 변경 책임 수용 가능
- 아래 3조건을 모두 만족할 때만 bounded-context `shared`를 둔다.
  1. 2개 이상 subfeature에서 반복 사용
  2. 특정 subfeature의 query key/service 정책을 직접 참조하지 않음
  3. bounded context 내부 공통 용어로 설명 가능

## MUST NOT

- 재사용 가능성만으로 조기 승격하지 않는다.
- 특정 subfeature의 service/query key를 감싼 hook를 `shared`/`common`으로 승격하지 않는다.

## Promotion Request 템플릿

```md
### Common Promotion Request
- Candidate: /features/domain-orders/components/StatusBadge.tsx
- Used by: domain-orders, domain-delivery
- Policy Independence: Yes
- Owner: @작업자_깃헙_계정
- Risk: medium (API naming alignment)
- Rollback Plan: common 제거 후 각 도메인 복구 가능
```

## 롤백 규칙

- common 승격 후 2주 내 불필요한 도메인 정책 유입이 확인되면 도메인으로 되돌린다.
- 롤백 시점과 이유를 PR에 남긴다.

## 왜 필요한가

성급한 common 승격은 결합도 증가로 이어지고, 결국 모든 도메인의 변경 속도를 떨어뜨린다.

## 리뷰 체크 (Yes/No)

- 공통 승격 근거(2개 이상 + 정책 비의존)가 있는가?
- `shared` 자산이 특정 subfeature 소유권을 침범하지 않는가?
- Promotion Request가 작성되었는가?
- 롤백 계획이 있는가?

## 자동 검증

- 린트: 제한적
- 리뷰 수동: 필수
