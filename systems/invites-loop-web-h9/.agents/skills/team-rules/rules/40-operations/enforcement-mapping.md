# OPS-01 Enforcement Mapping

- 목적: "좋은 규칙"을 "검증 가능한 규칙"으로 연결한다.
- 범위: 린트/CI/코드리뷰/PR 템플릿
- 기준: Rule ID별 Enforcement는 `GOV-02`와 동일해야 한다.

## Rule Mapping

| Rule ID | 핵심 규칙 | Enforcement | 자동 검증 | 수동 검증 |
| --- | --- | --- | --- | --- |
| HR-IMP-01,02,03 | import 경계 | Hard Gate | `eslint-plugin-boundaries` 또는 `no-restricted-imports` | 경계 예외 사유 검토 |
| HR-ARC-04 | feature 컴포넌트 배치 | Hard Gate | `scripts/check-feature-structure.mjs` | EX-01 예외 범위 검토 |
| HR-ARC-05 | shared 소유권 | Hard Gate | `scripts/check-shared-ownership.mjs` | shared 승격 사유/만료일 검토 |
| HR-RQ-01 | query key factory 강제 | Hard Gate | custom lint 또는 PR bot(`queryKey: ['` 탐지) | key 정규화 확인 |
| HR-RQ-02 | service.ts 순수 API | Hard Gate | import rule(`service.ts` 내 `@tanstack/react-query` 금지) | 파일 책임 확인 |
| HR-RQ-03 | mutation invalidate 누락 금지 | Warning | 정적 분석 보조(커버리지 제한) | mutation별 invalidate 확인 |
| HR-STATE-01 | 서버 상태 중복 저장 금지 | Warning | 제한적(`store`에 서버 payload 대입 패턴 탐지) | 설계 리뷰 필수 |
| HR-TYPE-01 | any 금지 | Hard Gate | `@typescript-eslint/no-explicit-any` | 예외 사유 검토 |
| HR-TYPE-02,03,04 | type/union/interface 사용 규칙 | Warning | custom lint(선택) | 모델 타입 파일과 컴포넌트/훅 계약 타입의 위치/의도 검토 |
| HR-REACT-01 | Effect 용도 제한 | Warning | 패턴 탐지(제한) | 이벤트/파생 상태 분리 확인 |
| HR-REACT-02 | mount fetch 패턴 제한 | Warning | `useEffect` fetch 패턴 탐지 | Query/허용 fetch 경로 확인 |
| HR-REACT-03 | hooks deps 비활성화 금지 | Hard Gate | `react-hooks/exhaustive-deps` | disable 범위/사유 확인 |
| HR-REACT-04 | app page `use client` 금지 | Hard Gate | `no-restricted-syntax` | 예외 승인 여부 확인 |
| HR-REACT-05 | async client component 금지 | Hard Gate | `@next/next/no-async-client-component` | 예외 승인 여부 확인 |
| SR-RQ-03,04 | mutation 책임 분리 / query 소유권 | Warning | 제한적 | 캐시 동기화와 화면 부작용 분리, app의 query key 생성 여부 확인 |

## PR 템플릿 필수 섹션

1. Hard Rule Pass/Fail
2. Scale Check
3. Exception (있을 때만)

## 운영 지표 (월간)

- Hard Gate 위반 건수
- 예외 발급/해제 비율
- Rule ID별 재발률
- Soft Rule -> Hard Rule 승격 후보
