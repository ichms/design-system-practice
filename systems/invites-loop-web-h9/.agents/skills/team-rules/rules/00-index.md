# Team Rules Index

이 디렉토리는 Next.js App Router + TanStack Query 기반 프로젝트의 아키텍처/운영/AI 생성 규칙을 통합 관리한다.

## 핵심 원칙

- 규칙은 `Priority(위험도)`와 `Enforcement(집행 강도)`를 분리해 해석한다.
- Hard Rule 원문은 단일 문서(SSOT)에서만 정의한다.
- 개별 규칙 문서는 해설/예시/도메인 맥락을 제공한다.

## 먼저 읽을 문서 (온보딩)

1. `00-governance/hard-rules.md`
2. `00-governance/priority-matrix.md`
3. `01-architecture-foundation.md`, `02-tanstack-query-rules.md`, `05-import-boundaries.md`, `07-state-ownership.md`, `12-react-component-practices.md`
4. `09-enforcement-and-review.md`
5. `08-exceptions-and-priority.md`

## 규칙 ID 체계

- `GOV-*`: 거버넌스(강제/권장/우선순위)
- `ARC-*`: 아키텍처
- `RQ-*`: TanStack Query
- `AI-*`: AI 코드 생성
- `TYPE-*`: 타입/함수 스타일/안전성
- `IMP-*`: Import 경계
- `DOM-*`: 도메인 경계/common 승격
- `STATE-*`: 상태 소유권
- `EX-*`: 예외/우선순위
- `REV-*`: 검증/리뷰
- `REF-*`: 참조 구현
- `SCALE-*`: 확장/도입
- `REACT-*`: React 컴포넌트/훅 운영
- `OPS-*`: 운영 검증 매핑

## Rule Locator (Path-Independent)

다른 문서에서는 경로 대신 Rule ID를 우선 참조한다. 실제 파일 위치는 아래 표에서 찾는다.

| Rule ID | 현재 파일 위치 |
| --- | --- |
| `GOV-01` | `00-governance/priority-matrix.md` |
| `GOV-02` | `00-governance/hard-rules.md` |
| `GOV-03` | `00-governance/soft-rules.md` |
| `EX-01` | `08-exceptions-and-priority.md` |
| `OPS-01` | `40-operations/enforcement-mapping.md` |
| `AI-OPS-01` | `30-ai/ai-agent-rules.md` |
| `REACT-01-EX` | `12-react-component-practices.example.md` |

## 문서 구조

### Governance (SSOT)

- `00-governance/priority-matrix.md`
- `00-governance/hard-rules.md`
- `00-governance/soft-rules.md`

### Core Rules

1. `01-architecture-foundation.md`
2. `02-tanstack-query-rules.md`
3. `03-hard-rules-ai.md` (deprecated redirect)
4. `04-types-style-safety.md`
5. `05-import-boundaries.md`
6. `06-domain-boundary-common-promotion.md`
7. `07-state-ownership.md`
8. `08-exceptions-and-priority.md`
9. `09-enforcement-and-review.md`
10. `10-reference-implementation.md`
11. `11-scaling-and-adoption.md`
12. `12-react-component-practices.md`
13. `12-react-component-practices.example.md`

### AI / Operations / Reference

- `30-ai/ai-agent-rules.md`
- `40-operations/enforcement-mapping.md`
- `50-reference/glossary.md`

## AI 실행 문서 경계

- 실행형(에이전트 직접 지시): `30-ai/*`
- 참고형(사람 설명/예시): `*.example.md`, `50-reference/*`
- Legacy 리다이렉트: `03-hard-rules-ai.md`

## 운영 규칙

- Hard Rule 변경은 반드시 SSOT 문서를 먼저 수정한다.
- Core Rules 문서는 Hard Rule을 복제하지 않고 Rule ID로 참조한다.
- 예외는 `EX-01` 템플릿으로만 기록한다.
