# GOV-03 Soft Rules (Guidance)

- 적용 범위: 설계/리팩토링/리뷰 코멘트
- 기본 집행 강도: `Warning` 또는 `Guide`
- 목적: 강제 규칙을 해치지 않는 범위에서 설계 품질을 높인다.

## 1) 구조/분리

- `SR-ARC-01`: 초기에는 과분할하지 않고, 복잡도 신호가 명확해질 때 분리한다.
- `SR-ARC-02`: 공통 승격은 "2개 이상 도메인 + 정책 비의존 + 소유권 합의"를 모두 만족할 때 진행한다.
- `SR-ARC-03`: `features/<bounded-context>/shared`는 동일 bounded context 안에서 2개 이상 subfeature가 재사용하고, 특정 subfeature의 service/query key/policy를 직접 소유하지 않는 자산에 한해 허용한다.

## 2) 데이터/성능

- `SR-RQ-01`: prefetch/optimistic update는 체감 성능 이득이 측정될 때 적용한다.
- `SR-RQ-02`: invalidate는 `all`보다 `lists/detail` 최소 범위를 우선한다.
- `SR-RQ-03`: mutation hook 콜백은 캐시 동기화 책임(invalidate/cache update/rollback)에 집중하고, navigation/toast/dialog 같은 화면 부작용은 호출 컴포넌트가 담당한다.
- `SR-RQ-04`: query key와 query hook은 feature가 소유하며, `app/*`는 이를 직접 생성하지 않는다.

## 3) 타입/표현

- `SR-TYPE-01`: 도메인 식별자/상태 코드는 literal union 또는 브랜드 타입을 우선 사용한다.
- `SR-TYPE-02`: 컴포넌트/훅 계약 타입은 `type`/`interface` 모두 허용하되, 상속 관계를 강조할 때는 `interface ... extends ...`를 우선 고려한다.
- `SR-TYPE-03`: 반복되는 정책값(경로 세그먼트, polling interval, 에러 코드 매핑 등)은 상수로 승격하되, 1회성 literal까지 기계적으로 상수화하지 않는다.
- `SR-REACT-01`: 부모-자식 props 네이밍 계약(`value/on*/handle*`)을 일관되게 유지한다.
- `SR-REACT-02`: `use client`는 실제 브라우저 API, 상태, 이벤트 핸들러가 필요한 경계에만 두고 route page/layout 전체로 관성적으로 확산하지 않는다.
- `SR-REACT-03`: Client Component는 `async` 함수로 선언하지 않는다.

## 4) 문서/리뷰 운영

- `SR-OPS-01`: Soft Rule 위반은 차단보다 "왜 유지/변경하는지" 설계 근거를 남긴다.
- `SR-OPS-02`: 반복되는 Soft Rule 위반은 Hard Rule 승격 후보로 회고 안건에 올린다.

## 5) override 가이드

Soft Rule은 아래 조건 중 하나를 만족하면 override 가능하다.

1. 성능 측정(Profiler, Web Vitals)으로 반대 설계가 우월함이 확인됨
2. 외부 라이브러리 제약으로 규칙 준수가 실익이 없음
3. 단기 실험 코드이며 만료일이 명확함
