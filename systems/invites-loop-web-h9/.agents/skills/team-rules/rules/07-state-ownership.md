# STATE-01 State Ownership

- Priority: P0
- Enforcement: `HR-STATE-01` Warning (`GOV-02` Enforcement Matrix 기준)
- 적용 범위: 상태 저장 로직 전반

## SSOT 적용

- 강제 문구 원문/집행 강도는 `GOV-02`를 따른다.
- 본 문서는 `HR-STATE-01` 운영 해설과 경계 조건 판단 가이드를 제공한다.

## MUST

- 서버 상태는 TanStack Query를 단일 소스로 사용한다.
- URL 공유가 필요한 상태는 URL 상태로 관리한다.
- 앱 전역 UI 상태는 store(Jotai 등)로 관리한다.
- 컴포넌트 임시 상태는 local state로 관리한다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `HR-STATE-01` | 패턴 탐지(제한) | 서버 payload를 store/local state에 중복 저장하는지 |

## MUST NOT

- 서버 상태를 store에 중복 저장하지 않는다.

## SHOULD

- 상태 추가 전 아래 질문으로 위치를 먼저 결정한다.
  1. 서버가 진실 소스인가?
  2. URL로 공유해야 하는가?
  3. 앱 전역 UI 상태인가?
  4. 로컬 상태로 충분한가?

## 경계 조건 (예외 판단 가이드)

- `Form Draft`: 저장 전 임시 입력값은 local/form state 허용
- `Optimistic UI`: Query cache 기반 낙관 업데이트 우선, 별도 store 복제 금지
- `SSR 초기데이터`: hydrate 이후 Query cache를 단일 소스로 유지
- `URL schema 변경`: 파라미터 버전 마이그레이션 규칙을 PR에 명시

## 왜 필요한가

상태 위치가 섞이면 동기화 버그가 반복되고 변경 통제가 어려워진다.

## 리뷰 체크 (Yes/No)

- 서버 데이터가 Query cache 외에 중복 저장되지 않았는가?
- URL/전역/로컬 상태 역할이 분리되었는가?
- 경계 조건(폼/낙관업데이트/SSR)에서 예외 사유가 명시되었는가?

## 자동 검증

- 린트: 제한적
- 리뷰 수동: 필수
