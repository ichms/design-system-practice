# REF-GL-01 Glossary

## 핵심 용어

- `Thin Route`: `app/*/page.tsx`가 엔트리/조합만 담당하고 정책 로직은 갖지 않는 구조
- `Domain Ownership`: 기능 도메인이 UI/API/캐시 정책 변경 책임을 가지는 원칙
- `Read-only Fetch in app`: `app/*`에서 직접 수행하는 조회 전용 데이터 호출. 기본 금지이며 예외는 `EX-01` 승인 케이스만 허용
- `Service Layer`: `features/domain-*/service.ts`. 순수 API 호출만 포함
- `Hard Rule`: 위반 시 차단 대상 규칙
- `Soft Rule`: 설계 품질 향상을 위한 권고 규칙
- `Hard Gate`: CI/리뷰 단계에서 머지 차단
- `Warning`: 머지는 가능하나 리뷰 코멘트/추적 필요
- `Guide`: 참고 기준. 즉시 차단 없음

## 네이밍 계약

- 부모 -> 자식 상태값: 명사형(`query`, `selectedId`, `isOpen`)
- 부모 -> 자식 변경요청: `on*` (`onQueryChange`, `onOpenChange`)
- 자식 내부 DOM 핸들러: `handle*` (`handleClick`, `handleChange`)

## 문서 해석 우선순위

1. `GOV-02`
2. `GOV-01`
3. 개별 규칙 문서 (`01~12`)
4. 예시 문서 (`*.example.md`)

경로가 변경될 수 있으므로 파일 위치가 필요할 때는 `00-index.md`의 Rule Locator를 우선 조회한다.
