# EX-01 Exceptions and Rule Priority

- Priority: P1
- Enforcement: Hard Gate (예외 기록 누락 시)
- 적용 범위: 모든 예외 상황

## MUST

- 규칙 충돌 시 우선순위를 적용한다.
  1. 런타임 안전성
  2. 아키텍처 규칙
  3. 데이터 정합성
  4. 스타일 규칙
- Hard Rule 예외는 PR에 `Owner`, `Approver`, `Expiry`를 필수로 기록한다.
- 만료일 도달 시 7일 내 `갱신` 또는 `제거`를 수행한다.
- 정보 누락 예외는 무효로 본다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `EX-01` | 일부 가능(만료일 포맷/존재) | Owner/Approver/Scope/Expiry 완전성, 만료 대응 여부 |

## MUST NOT

- 사유 없는 `eslint-disable`를 허용하지 않는다.
- 파일 전체 disable을 기본값으로 사용하지 않는다.

## SHOULD

- `eslint-disable`는 라인 단위 최소 범위만 허용한다.
- 예외 기간은 30일 이내를 기본으로 한다(초과 시 재승인 필요).

## Approver 권한 기준

- P0/P1 Hard Rule 예외: Tech Lead 이상 승인
- P2 Hard Gate 예외: 도메인 오너 승인

## 왜 필요한가

예외 기록이 없으면 임시 코드가 표준이 되어 규칙 체계가 빠르게 무너진다.

## 예외 기록 템플릿

```md
### Rule Exception
- Rule ID: IMP-01
- Owner: @작업자_깃헙_계정
- Approver: @리뷰어_깃헙_계정
- Reason: 외부 SDK 구조 제약
- Scope: /features/domain-a/service.ts:21
- Expiry: 2026-04-30
- Follow-up: SDK wrapper 도입 후 제거
```

## 리뷰 체크 (Yes/No)

- 예외 기록에 Rule ID/Owner/Approver/Reason/Scope/Expiry가 모두 있는가?
- 만료된 예외가 방치되지 않았는가?
- disable 범위가 최소인가?

## 자동 검증

- 린트: 부분 가능
- 리뷰 수동: 필수
