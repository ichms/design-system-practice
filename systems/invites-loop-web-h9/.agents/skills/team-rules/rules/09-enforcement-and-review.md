# REV-01 Enforcement and Review

- Priority: P0
- 적용 범위: CI, 코드리뷰, PR 템플릿
- 기준 문서: `GOV-01`, `GOV-02`, `OPS-01`

## MUST

- Hard 체크리스트를 Pass/Fail로 먼저 판단한다.
- 자동화 가능한 항목은 린트/CI 규칙으로 우선 이관한다.
- Hard Gate 위반은 예외 승인 없이는 CI fail로 차단한다.
- Warning 항목은 리뷰 코멘트와 개선 계획을 남긴다.

## MUST 검증 메타

| Rule ID | 자동 검증 | 수동 검증 체크포인트 |
| --- | --- | --- |
| `REV-01` | CI 워크플로 강제 | Hard Checklist Pass/Fail 기록 |
| `REV-02` | lint/CI job 존재 확인 | 자동화 이관 계획/결과 |
| `REV-03` | Hard Gate fail 시 차단 | 예외 승인(`EX-01`) 첨부 여부 |
| `REV-04` | 없음 | Warning 코멘트 + 개선 계획 남김 여부 |

## Hard Checklist (Pass/Fail)

- `app/*/page.tsx`가 엔트리 역할만 수행하는가?
- `app/*`에서 `features/*/service.ts` import가 없는가? (예외 시 EX-01 존재)
- `app/*/page.tsx`에 `use client`가 없는가?
- Client Component를 `async` 함수로 선언하지 않았는가?
- `service.ts`가 순수 API 함수만 포함하는가?
- query key가 `queryKeys.ts` factory를 통해 사용되는가?
- import 방향 규칙을 위반하지 않았는가?
- `components/Page.tsx` 외 `.tsx`가 `components/elements/*` 밖에 없는가?
- `features/<bounded>/shared`가 특정 subfeature의 `service.ts`, `queryKeys.ts`, `hooks/*`에 의존하지 않는가?
- `any` 금지를 지켰는가?
- `react-hooks/exhaustive-deps`를 비활성화하지 않았는가?

## Warning Checklist (Comment Required)

- mutation 성공 시 invalidate 범위가 최소화되어 있는가?
- mutation hook 콜백은 캐시 동기화에 집중하고, navigation/toast/dialog 같은 화면 부작용은 컴포넌트가 처리하는가?
- 서버 상태/store/로컬 상태의 역할 분리가 유지되는가?
- 컴포넌트 분리 수준이 과하거나 부족하지 않은가?
- `type.ts|types.ts|dto.ts`는 `type`을 유지하고, 컴포넌트/훅에서의 `interface` 사용은 가독성/`extends` 목적에 부합하는가?
- Scale Check에 따른 분리 계획이 필요한가?

## Scale Check 템플릿

```md
### Scale Check
- File: /features/domain-a/components/Page.tsx
- Line Count: 518
- Branch Count: 9
- Render Hotspot: yes/no
- Status: Warning / Hard Gate
- Split Plan: ListSection.tsx, FilterSection.tsx 분리
- Owner: @author
- Target Date: 2026-03-31
```

## 리뷰 체크 (Yes/No)

- Hard 항목 모두 Pass인가?
- Warning 항목에 코멘트/액션이 남았는가?
- 예외가 있다면 EX-01 템플릿이 첨부되었는가?

## 자동 검증

- 린트/CI: Hard Gate 항목 필수 차단
- 리뷰 수동: Warning/Guide 보조
