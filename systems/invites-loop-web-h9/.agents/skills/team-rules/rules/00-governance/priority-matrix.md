# GOV-01 Priority and Enforcement Matrix

- 적용 범위: 전체 규칙
- 목적: `Priority(위험도)`와 `Enforcement(집행 강도)`를 분리해 운영 충돌을 방지한다.

## 1) Priority (위험도)

- `P0`: 즉시 장애/보안/데이터 정합성 붕괴 위험
- `P1`: 유지보수성/변경 안정성에 중대한 위험
- `P2`: 품질/확장성 개선 목적

Priority는 "위험도"만 의미한다. 머지 차단 여부를 직접 결정하지 않는다.

## 2) Enforcement (집행 강도)

- `Hard Gate`: CI/리뷰에서 차단. 예외 승인 없이는 머지 불가.
- `Warning`: CI 경고 + 리뷰 코멘트 필수. 기본 머지 가능.
- `Guide`: 참고 권고. 회고/리팩토링 백로그로 관리.

## 3) 기본 매핑

| Priority | 기본 Enforcement | 비고 |
| --- | --- | --- |
| P0 | Hard Gate | 원칙적으로 즉시 차단 |
| P1 | Warning | 팀 합의 시 Hard Gate 승격 가능 |
| P2 | Guide | 특정 항목만 Hard Gate 예외 지정 가능 |

## 4) 예외 승격/강등 규칙

- `P2`라도 운영상 반드시 막아야 하는 항목은 Rule ID에 `Hard Gate(예외)`를 명시한다.
- `P0`라도 외부 제약으로 즉시 차단이 불가능하면 `Warning(임시)`로 두고 만료일을 둔다.
- 승격/강등은 반드시 `EX-01` 예외 템플릿으로 기록한다.

## 5) 충돌 해소 우선순위

규칙이 충돌하면 아래 순서를 따른다.

1. 런타임 안전성
2. 아키텍처 경계
3. 데이터 정합성
4. 스타일/표현 일관성

## 6) 리뷰 체크 (Yes/No)

- Priority와 Enforcement를 혼동 없이 기재했는가?
- Hard Gate 항목에 예외 승인 정보(Owner/Approver/Expiry)가 있는가?
- P2 항목이 무근거로 차단 규칙으로 운영되지 않는가?
