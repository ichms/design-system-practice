# invites-loop-web-h9

외주 퍼블리싱 업체 온보딩용 안내 문서입니다.

이 레포는 `pnpm workspace` 기반 모노레포이며, Next.js(App Router) 앱과 공통 UI 패키지로 구성되어 있습니다.

## 1) 개발 환경

- Node.js 20 이상 권장
- pnpm 10.x (`corepack enable` 권장)

## 2) 시작 방법

```bash
pnpm install
pnpm dev
```

- 기본 실행 앱: `apps/invites-loop`
- 개발 서버: `http://localhost:3000`

## 3) 자주 쓰는 명령어

```bash
# 루트에서 실행
pnpm dev       # invites-loop 앱 개발 서버 실행
pnpm build     # invites-loop 프로덕션 빌드
pnpm lint      # invites-loop ESLint 실행

# 앱 단위 실행
pnpm --dir apps/invites-loop run typecheck
pnpm --dir apps/invites-loop run lint
pnpm --dir apps/invites-loop run build
```

## 4) 디렉토리 구조

```text
.
├─ apps/
│  └─ invites-loop/                  # Next.js App Router 애플리케이션
│     ├─ app/                        # 라우트 엔트리(얇은 조합 계층)
│     │  └─ (page)/tokens/...
│     ├─ features/                   # 도메인 단위 기능 소유
│     │  ├─ common/
│     │  │  ├─ components/           # 공통 컴포넌트
│     │  │  │  ├─ */.tsx
│     │  │  │  └─ index.ts
│     │  │  ├─ model/
│     │  │  └─ type.ts
│     │  └─ token-docs/              # 특정 컴포넌트
│     │     ├─ components/
│     │     │  ├─ Page.tsx
│     │     │  └─ elements/*.tsx
│     │     ├─ model/
│     │     └─ type.ts
│     │
│     ├─ public/
│     └─ package.json
├─ packages/
│  ├─ invites-ui/                    # 공통 UI 라이브러리 (이 곳은 아이콘 사용/추가하는 용도로만 사용하시면 됩니다.)
│  │  └─ src/
│  │     ├─ component/
│  │     ├─ icons/
│  │     ├─ styles/
│  │     ├─ lib/
│  │     └─ types.ts
│  ├─ config-eslint/                 # 공유 ESLint 설정
│  ├─ config-tailwind/               # 공유 Tailwind/PostCSS 설정
│  ├─ config-typescript/             # 공유 TSConfig 설정
│  └─ config-commitlint/             # 공유 Commitlint 설정
├─ scripts/                          # 구조/규칙 검증 스크립트
├─ .husky/                           # 훅 파일(현재 비활성화 상태)
├─ pnpm-workspace.yaml
└─ package.json
```

## 5) 외주 퍼블리싱 작업 원칙 (필수)

- 퍼블리싱 구현은 기본적으로 `apps/invites-loop/features/*/components`에서 진행합니다.
- 페이지 엔트리(`apps/invites-loop/app/*/page.tsx`)는 라우팅/조합만 담당하고, UI 상세 구현을 직접 담지 않습니다.
- feature 진입 컴포넌트는 `components/Page.tsx`를 사용합니다.
- feature 내부 세부 UI는 `components/elements/*.tsx`에 둡니다.
- 공통화가 필요한 UI는 `apps/invites-loop/features/common/components`로 이동하고 앱에서 재사용합니다.
- 아이콘 리소스는 `packages/invites-ui/src/icons`에 React 컴포넌트 형태로 추가하고, 실제 문서 페이지/화면 조합은 `apps/invites-loop`에서만 진행합니다.
- `packages/invites-ui`는 재사용 가능한 UI와 아이콘 컴포넌트 제공만 담당하며, 문서 페이지나 서비스 성격의 화면 로직은 두지 않습니다.
- `app/*`에서 `features/*/service.ts` 직접 import는 금지입니다. 데이터/정책 로직은 feature 계층에서 소유합니다.
- `any` 타입 사용은 금지합니다.
- 문자열 유니온 타입이 필요한 경우 직접 문자열을 반복 선언하지 말고, `as const` 상수 객체를 먼저 정의한 뒤 타입을 파생해서 사용합니다.

## 6) 커밋/검증 규칙

- 이 레포는 현재 Husky를 비활성화한 상태입니다.
- 커밋 전 아래 명령을 수동 실행해 주세요.
  - `pnpm test`

## 7) 외주 산출물 전달 기준

- 변경 파일은 가능한 기능 단위(feature 단위)로 묶어서 PR 생성
- PR 본문에 아래 항목 포함
  - 작업 범위
  - UI 변경 스크린샷(PC/모바일)
  - 반응형 기준(브레이크포인트)
  - 재사용 컴포넌트 추가/수정 내역
  - 알려진 이슈 또는 후속 작업

## 8) 참고

- 앱 기본 README: `apps/invites-loop/README.md`
- 팀 아키텍처 규칙: `.agents/skills/team-rules/rules/*`
