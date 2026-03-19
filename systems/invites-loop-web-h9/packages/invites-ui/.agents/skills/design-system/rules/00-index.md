# Design System Rules Index

이 디렉토리는 Tailwind + cva/cn 기반 디자인 시스템 스타일링 규칙을 관리한다.

## 핵심 원칙

- variant 기반 스타일은 **cva**로 정의하고, 클래스 병합은 **cn**으로 수행한다.
- 참조 구현: `features/common/component/Button.tsx`.

## Rule Locator (Path-Independent)

| Rule ID | 현재 파일 위치 |
| --- | --- |
| `DS-01` | `01-cva-cn-styling.md` |
| `DS-02` | `02-tailwind-v4-token-pitfalls.md` |

## 문서 구조

- `00-index.md`: 이 문서 (인덱스/로케이터)
- `01-cva-cn-styling.md`: cva, cn 사용 규칙 (DS-01)
- `02-tailwind-v4-token-pitfalls.md`: Tailwind v4 토큰 + twMerge 충돌 주의사항 (DS-02)
