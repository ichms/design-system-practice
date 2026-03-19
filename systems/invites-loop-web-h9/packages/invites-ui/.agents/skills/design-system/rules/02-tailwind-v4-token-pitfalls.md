# DS-02 Tailwind v4 Token & twMerge Pitfalls

이 프로젝트는 Tailwind v4 (`@tailwindcss/postcss`) + `@config tailwind.config.cjs` 조합을 사용한다.
아래 규칙을 위반하면 스타일이 무음으로 적용되지 않는다.

---

## 1. camelCase 토큰 키 → 유틸리티 클래스 미생성

### 문제

`tailwind.config.cjs`에 camelCase 키(`lightDefault`, `normalBg` 등)로 정의된 색상은
Tailwind v4에서 해당 키 그대로 유틸리티 클래스를 생성하지 못할 수 있다.

```js
// tailwind.config.cjs
semantic: {
  text: {
    lightDefault: '#ffffff', // ← camelCase → text-semantic-text-lightDefault 미생성
  }
}
```

### MUST

- **배경색**: `bg-semantic-button-block-blue-normalBg` 처럼 `bg-*`는 정상 작동이 확인됐으나,
  `text-*` 계열 camelCase 토큰은 신뢰하지 않는다.
- **흰색 텍스트**는 `text-semantic-text-lightDefault` 대신 `text-common-100`을 사용한다.
  (`common.100 = '#ffffff'`, 숫자 키라 항상 정상 작동)
- **어두운 텍스트**는 `text-semantic-text-default` (`default` = 소문자 단순 키) 사용. ✓

### MUST NOT

- `text-white` 사용 금지. 이 프로젝트는 Tailwind 기본 팔레트를 포함하지 않으므로 미생성된다.
- camelCase 키로 정의된 색상을 `text-*` 유틸리티로 사용하지 않는다.

### 원칙: semantic 토큰 대신 primitive 토큰 사용

피그마 스크린샷의 색상은 semantic 토큰 이름으로 표기되지만, 실제 구현은 `tailwind.config.cjs`에서
해당 semantic 값이 참조하는 **primitive 토큰**으로 작성한다.

```
피그마: Color/Button/Block/Blue/NormalBg
→ tailwind.config: semantic.button.block.blue.normalBg = '#1a71ff' = blue.50
→ 구현: bg-blue-50
```

### semantic → primitive 매핑 (BlockButton 기준)

| semantic | hex | primitive 클래스 |
|---|---|---|
| `button.block.blue.normalBg` | `#1a71ff` | `bg-blue-50` |
| `button.block.blue.pressedBg` | `#0052cc` | `bg-blue-40` |
| `button.block.blue.disableBg` | `#eaebec` | `bg-coolNeutral-97` |
| `button.block.blue.selectBorder` | `#99c2ff` | `ring-blue-80` |
| `button.block.grey.normalBg` | `#edf2f5` | `bg-blueGrey-99` |
| `button.block.grey.pressedBg` | `#d3dfe4` | `bg-blueGrey-90` |
| `button.block.grey.disableBg` | `#eaebec` | `bg-coolNeutral-97` |
| `button.block.grey.selectBorder` | `#d3dfe4` | `ring-blueGrey-90` |
| `text.lightDefault` | `#ffffff` | `text-common-100` |
| `text.default` | `#171719` | `text-neutral-5` |

### 안전한 대체 매핑 (text-* 한정)

| 의도 | 사용 금지 | 사용 |
|---|---|---|
| 흰색 텍스트 | `text-white`, `text-semantic-text-lightDefault` | `text-common-100` |
| 기본 어두운 텍스트 | `text-semantic-text-default` | `text-neutral-5` |
| 비활성 텍스트 | — | `text-neutral-5` |

---

## 2. tailwind-merge — 커스텀 fontSize vs textColor 충돌

### 문제

`tailwind-merge`는 이 프로젝트의 커스텀 fontSize 토큰(`text-bodySm-SB` 등)을 알지 못한다.
`text-*` 접두사가 같은 textColor 클래스(`text-common-100`)와 동일 그룹으로 판단해 하나를 제거한다.

```ts
// cva 내부에서 colorType 뒤에 size가 오면
// text-common-100 + text-bodySm-SB → twMerge가 text-common-100 제거
```

### MUST

- `packages/ui/cn.ts`의 `twMerge`는 반드시 `extendTailwindMerge`로 커스텀 fontSize 그룹을 등록해야 한다.

```ts
// packages/ui/cn.ts
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
      'font-size': [
        {
          text: [
            (value: string) => {
              const lastDash = value.lastIndexOf('-')
              if (lastDash === -1) return false
              const scale = value.slice(0, lastDash)
              const weight = value.slice(lastDash + 1)
              return customFontScales.includes(scale) && customFontWeights.includes(weight)
            },
          ],
        },
      ],
    },
  },
})
```

- **regex 리터럴 직접 사용 금지**: `tailwind-merge`의 classGroups 값으로 regex 객체를 넣으면 동작하지 않는다. 반드시 `(value: string) => boolean` 함수로 감싼다.

### MUST NOT

- `extendTailwindMerge` 없이 `twMerge`를 그대로 쓰면 커스텀 fontSize + textColor가 동시에 사용되는 컴포넌트에서 텍스트 색상이 무음 적용된다.

---

## 3. 리뷰 체크

- [ ] `text-*` 색상 토큰이 camelCase 키 기반인지 확인했는가? → `text-common-100` / `text-semantic-text-default` 사용
- [ ] `text-white` 를 사용하지 않는가?
- [ ] `packages/ui/cn.ts`가 `extendTailwindMerge`로 커스텀 fontSize를 등록하고 있는가?
- [ ] classGroups 내 validator가 regex 객체가 아닌 함수인가?

---

## 4. 참조

- 구현 예시: `packages/ui/component/BlockButton.tsx`
- cn 설정: `packages/ui/cn.ts`
- 색상 토큰 원천: `tailwind.config.cjs`
