# h9 프로젝트 디자인 시스템 고도화 계획

> 기준 스택: Next.js 16 / React 19 / Tailwind v4 / shadcn/ui 컨버팅 예정
> 현재 상태: `packages/invites-ui` 에 BlockButton, SearchField, 아이콘 존재. shadcn `components.json` 설정 완료. 토큰은 `packages/config-tailwind/tailwind.config.mjs` JS 객체 방식.

---

## 현황 진단

### 잘 되어 있는 것

- Primitive 토큰 체계 구축 완료 (colors, spacing, radius, fontSize)
- CVA + cn 패턴 정착, 컴포넌트 스타일 타입 안전
- Agent rules로 camelCase 함정, twMerge 충돌 등 알려진 문제 문서화
- `components.json` 셋업으로 shadcn 컨버팅 준비 완료

### 지금 해결해야 할 문제들

| # | 문제 | 위치 | 영향 |
|---|---|---|---|
| 1 | `cn` 유틸에 `extendTailwindMerge` 미적용 | `src/lib/utils.ts` | 커스텀 fontSize + textColor 동시 사용 시 색상 클래스 무음 제거 |
| 2 | Semantic 토큰 camelCase → 클래스 미생성 | `tailwind.config.mjs` | `text-semantic-text-lightDefault` 등 Tailwind 클래스로 쓸 수 없음 |
| 3 | Component-specific 토큰 없음 | — | 컴포넌트 색상이 primitive에 직결, 추후 테마 전환 불가 |
| 4 | Hover/Disabled 처리 불일치 | `BlockButton.tsx` | colorType마다 disabled 색상 수동 지정, 유지보수 부담 |
| 5 | Tailwind v4 CSS-first 방식 미전환 | `tailwind.config.mjs` | v3 JS 객체 방식 혼용 → camelCase 문제 근본 원인 |
| 6 | Flat API만 존재, Compound 없음 | `BlockButton.tsx` | shadcn 컨버팅 시 구조 불일치 발생 가능 |

---

## 고도화 방향

### 1. `cn` 유틸 — `extendTailwindMerge` 적용 (즉시 해결)

**문제**: `utils.ts`가 기본 `twMerge`를 그대로 사용 중. 커스텀 fontSize 토큰(`text-bodySm-SB`)이 textColor(`text-common-100`)와 같은 그룹으로 취급돼 하나가 제거된다.

**해결**: DS-02 룰에 이미 답이 있다. `extendTailwindMerge`로 커스텀 fontSize 그룹을 등록해야 한다.

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customFontScales = [
  'displayXL', 'displaySm',
  'headlineXL', 'headlineLg', 'headlineMd', 'headlineSm',
  'titleLg', 'titleMd', 'titleSm',
  'bodyLg', 'bodyMd', 'bodySm',
  'captionLg', 'captionMd',
]
const customFontWeights = ['B', 'SB', 'M', 'R']

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{
        text: [(value: string) => {
          const lastDash = value.lastIndexOf('-')
          if (lastDash === -1) return false
          return (
            customFontScales.includes(value.slice(0, lastDash)) &&
            customFontWeights.includes(value.slice(lastDash + 1))
          )
        }],
      }],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
```

---

### 2. Tailwind v4 CSS-first 토큰으로 전환

**문제**: 현재 `tailwind.config.mjs` JS 객체 방식은 Tailwind v3 방식이다. v4는 `@theme {}` CSS 블록을 정식 방식으로 권장하며, CSS 변수(`--color-blue-50`) 기반이라 camelCase 문제가 없다.

**현재 방식 (v3 스타일)**:
```js
// tailwind.config.mjs
colors: {
  semantic: {
    text: {
      lightDefault: '#ffffff', // → text-semantic-text-lightDefault 미생성
    }
  }
}
```

**목표 방식 (v4 CSS-first)**:
```css
/* packages/config-tailwind/styles.css */
@theme {
  /* Primitive */
  --color-blue-50: #1a71ff;
  --color-common-100: #ffffff;
  --color-neutral-5: #171719;

  /* Semantic — kebab-case로 전환 */
  --color-text-default: var(--color-neutral-5);
  --color-text-light-default: var(--color-common-100);
  --color-bg-base: var(--color-common-100);

  /* Radius */
  --radius-8: 8px;
  --radius-12: 12px;
}
```

**검토 포인트**:
- `tailwind.config.mjs`의 JS 토큰을 CSS 변수로 단계적으로 이전
- camelCase 키(`lightDefault`, `normalBg`)를 모두 kebab-case로 변경
- shadcn이 요구하는 `--background`, `--primary` 등 CSS 변수와 **네이밍 정렬 필요**

---

### 3. shadcn/ui 컨버팅 준비 — CSS 변수 네이밍 정렬

**문제**: shadcn은 HSL 기반 CSS 변수(`--primary: 222.2 47.4% 11.2%`)를 기대한다. 현재 토큰은 hex 방식이다.

**현재 shadcn `components.json`**: `cssVariables: true`, `baseColor: neutral` 설정 완료.

**필요 작업**: 기존 semantic 토큰을 shadcn 변수명으로 매핑하는 브릿지 레이어를 CSS에 추가.

```css
/* src/styles/index.css */
@layer base {
  :root {
    /* shadcn 기대 변수 → 프로젝트 primitive 토큰으로 매핑 */
    --background: 0 0% 100%;          /* common.100 = #ffffff */
    --foreground: 240 4% 10%;         /* neutral.5 = #171719 */
    --primary: 220 100% 55%;          /* blue.50 = #1a71ff */
    --primary-foreground: 0 0% 100%;  /* common.100 */
    --muted: 220 9% 94%;              /* coolNeutral.98 */
    --muted-foreground: 240 4% 46%;   /* coolNeutral.50 */
    --border: 220 8% 88%;             /* coolNeutral.95 */
    --radius: 8px;
  }
}
```

**주의**: shadcn 변수와 기존 프로젝트 토큰을 **두 개의 진실 원천**으로 유지하면 충돌한다. 목표는 shadcn 변수가 프로젝트 CSS 변수를 참조하는 단방향 구조.

```
Primitive CSS 변수 (--color-blue-50)
  └─ Semantic CSS 변수 (--color-primary)
        └─ shadcn 변수 (--primary) → shadcn 컴포넌트
```

---

### 4. Component-specific 토큰 도입 (LINE Corp 방식 참고)

**문제**: BlockButton에서 색상이 primitive에 직결되어 있다.

```tsx
// 현재: primitive 직결
'bg-blue-50 text-common-100 active:bg-blue-40 disabled:bg-coolNeutral-97'
```

컴포넌트 토큰 레이어를 두면 "버튼 색만 바꾸기"가 가능해진다.

```css
/* @theme 또는 @layer base */
--button-primary-bg: var(--color-blue-50);
--button-primary-bg-active: var(--color-blue-40);
--button-primary-text: var(--color-common-100);
--button-primary-bg-disabled: var(--color-coolNeutral-97);
```

```tsx
// 컴포넌트 토큰 참조 (Tailwind v4 arbitrary value 또는 CSS class)
'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]'
```

**우선순위**: shadcn 컨버팅 이후 shadcn 컴포넌트의 CSS 변수 구조를 따라가는 것도 방법. 먼저 shadcn 마이그레이션 범위를 확정한 뒤 결정하는 것이 좋다.

---

### 5. Disabled/Hover 상태값 통일 (LINE Corp 방식)

**문제**: BlockButton에서 colorType별로 disabled 색상을 각각 지정 중.

```tsx
// 현재: colorType마다 수동 지정
blue: 'bg-blue-50 text-common-100 active:bg-blue-40 disabled:bg-coolNeutral-97 disabled:text-neutral-5',
grey: 'bg-blueGrey-99 text-neutral-5 active:bg-blueGrey-90 disabled:bg-coolNeutral-97 disabled:text-neutral-5',
```

LINE Corp 방식처럼 Hover/Disabled를 opacity 공통 규칙으로 처리하면 토큰 수를 줄일 수 있다.

```tsx
// 개선 방향: 상태를 opacity로 통일
const blockButtonVariants = cva(
  '... disabled:opacity-50 active:opacity-80 disabled:pointer-events-none',
  { variants: { ... } }
)
```

**검토 필요**: 현재 디자인 스펙이 색상 교체 방식인지 opacity 방식인지 디자이너와 먼저 합의해야 한다. opacity 방식은 배경색에 따라 예상과 다른 색상이 나올 수 있다.

---

### 6. Compound 패턴 도입 — shadcn 컨버팅 전 검토

**현재**: BlockButton은 Flat API 전용. `leftIcon`, `rightIcon` props로 슬롯을 제어한다.

**shadcn 컴포넌트 구조**: shadcn의 Button은 기본적으로 Flat이지만, 복잡한 컴포넌트(Select, Dialog, Command 등)는 Compound 구조다.

**Toss TDS 방식 적용 기준**:
```
단순하고 자주 쓰는 케이스   →  Flat API 유지 (BlockButton 현행)
복잡하고 변형이 잦은 케이스  →  Compound API 추가 (shadcn 컨버팅 대상 컴포넌트)
```

**shadcn 컨버팅 후보 컴포넌트 선정 시 체크리스트**:
- props가 4개 이상이고 조합 가능성이 높은가?
- 내부 슬롯(아이콘, 뱃지, 트레일링 액션 등)의 변형이 많은가?
- 현재 Flat props로 감당이 안 되는 요구사항이 있는가?

---

## shadcn 컨버팅 로드맵

```
Phase 1 — 기반 정비 (지금)
  ├─ cn 유틸 extendTailwindMerge 적용
  ├─ tailwind.config camelCase → kebab-case 전환
  └─ shadcn CSS 변수 브릿지 레이어 추가

Phase 2 — shadcn 컴포넌트 도입
  ├─ 기존 컴포넌트와 겹치지 않는 새 컴포넌트부터 shadcn으로 추가
  │   (Button → 기존 BlockButton과 역할 분리 필요)
  └─ Storybook 추가 (shadcn + 커스텀 컴포넌트 병행 문서화)

Phase 3 — 기존 컴포넌트 컨버팅
  ├─ BlockButton → shadcn Button 기반으로 교체
  ├─ SearchField → shadcn Input 기반으로 교체
  └─ Component-specific 토큰 레이어 정비
```

---

## 우선순위 요약

| 우선순위 | 항목 | 이유 |
|---|---|---|
| 🔴 즉시 | `cn` 유틸 `extendTailwindMerge` 적용 | 현재 스타일 버그 발생 가능, 수정 범위 작음 |
| 🔴 즉시 | camelCase 토큰 → kebab-case 전환 | shadcn 도입 전 반드시 정리 필요 |
| 🟡 shadcn 전 | shadcn CSS 변수 브릿지 레이어 | 컨버팅 시작 전 구조 결정해야 함 |
| 🟡 shadcn 전 | Flat vs Compound 기준 정의 | 어떤 컴포넌트를 shadcn으로 교체할지 결정 기준 |
| 🟢 중장기 | Component-specific 토큰 도입 | shadcn 컴포넌트 구조 확정 후 설계 |
| 🟢 중장기 | Storybook 추가 | 컴포넌트 수가 충분히 쌓인 후 |
