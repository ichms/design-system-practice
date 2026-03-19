# AI-01 Hard Rules for AI Generation (Deprecated Redirect)

- Priority: P0
- 적용 범위: AI가 생성/수정하는 코드 전체

이 문서는 하위 호환용 진입점이다. 실행형 AI 규칙의 단일 기준은 `AI-OPS-01`이다.

- Execution Source: `30-ai/*` only

## MUST

- AI 규칙은 `AI-OPS-01`을 우선 적용한다.
- Hard Rule 예외가 필요하면 `EX-01` 템플릿 초안을 함께 제시한다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `AI-01` | 없음 | 결과물이 `AI-OPS-01` MUST/MUST NOT을 만족하는지 |

## MUST NOT

- 이 문서에 독립 규칙을 추가해 SSOT와 중복 정의하지 않는다.

## 리뷰 체크 (Yes/No)

- 결과물이 `AI-OPS-01`의 MUST/MUST NOT을 만족하는가?
- 예외가 필요한 경우 Rule ID + Owner + Approver + Expiry를 포함했는가?
