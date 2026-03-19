# Git Commit Convention Guide

---

# 1. 목적

커밋 메시지는 단순한 작업 기록이 아니라 **코드 변경의 의도를 전달하는 인터페이스**입니다.

Conventional Commits를 도입하는 목적은 다음과 같습니다.

* 커밋 히스토리 가독성 향상
* PR 리뷰 시 변경 의도 파악 속도 향상
* 릴리즈 노트 및 버전 관리 자동화 기반 확보
* 협업 시 변경 유형에 대한 커뮤니케이션 비용 감소

즉, 커밋 메시지를 **자유로운 서술형 기록이 아닌 구조화된 메타데이터**로 사용하는 것이 핵심입니다.

---

# 2. 기본 구조

Conventional Commits는 다음 구조를 사용합니다.

```text
<type>(optional scope): <description>
```

예시

```text
feat(auth): OAuth 로그인 기능 추가

fix(cart): 쿠폰 적용 시 결제 금액 계산 오류 수정

refactor(user): 사용자 검증 로직을 service 레이어로 분리
```

---

# 3. Commit Type 기준

팀에서 기본적으로 사용하는 타입은 다음과 같습니다.

| type     | 의미        | 사용 기준             |
| -------- | --------- | ----------------- |
| feat     | 기능 추가     | 사용자 기능 변화         |
| fix      | 버그 수정     | 의도와 다른 동작 수정      |
| refactor | 구조 개선     | 기능 변화 없이 코드 구조 개선 |
| docs     | 문서 변경     | README, 가이드       |
| style    | 코드 스타일 변경 | formatting only   |
| test     | 테스트 코드    | 테스트 추가/수정         |
| chore    | 기타 작업     | 설정, dependency    |

---

# 4. 프론트엔드 팀 추천 확장 타입

프론트엔드 팀에서는 기본 타입만으로는 변경 의도가 충분히 드러나지 않는 경우가 많습니다.  
특히 성능, 빌드, CI/CD, 되돌리기 작업은 별도 타입으로 분리하는 편이 히스토리 관리에 유리합니다.

| type   | 의미         | 프론트엔드 기준 사용 예                             |
| ------ | ---------- | ----------------------------------------- |
| perf   | 성능 개선      | 렌더링 최적화, 번들 크기 감소, 이미지 로딩 개선              |
| build  | 빌드 관련 변경   | Vite/Webpack/Next.js build 설정 변경          |
| ci     | CI/CD 변경   | GitHub Actions, Jenkins, EAS, 배포 파이프라인 수정 |
| revert | 이전 커밋 되돌리기 | 배포 이슈 대응, 기능 롤백                           |

## 4.1 perf

사용자 기능은 바뀌지 않지만 **성능 지표 개선이 목적**인 경우 사용합니다.

```text
perf(image): 메인 배너 이미지 lazy loading 적용
perf(table): 대용량 리스트 가상 스크롤 적용
perf(search): 검색 결과 디바운싱 적용으로 불필요한 요청 감소
```

다음과 같은 경우에 적합합니다.

* LCP, CLS, INP 개선
* 번들 크기 감소
* 불필요한 리렌더링 제거
* 네트워크 요청 수 감소
* 캐시 전략 개선

단, 성능 개선과 함께 사용자 기능이 함께 추가되었다면 `feat`로 보는 것이 더 적절할 수 있습니다.

## 4.2 build

**빌드 결과물이나 번들링 방식에 직접 영향을 주는 변경**에 사용합니다.

```text
build(config): tsconfig 경로 alias 설정 수정
build(next): standalone output 설정 추가
build(vite): vendor chunk 분리 전략 변경
```

다음과 같은 경우에 적합합니다.

* bundler 설정 변경
* env/build profile 수정
* alias, transpile, polyfill 설정 변경
* 정적 자산 빌드 전략 수정

## 4.3 ci

**CI/CD 파이프라인, 검증 자동화, 배포 자동화**에 관련된 변경에 사용합니다.

```text
ci(config): GitHub Actions PR 검사 워크플로 추가
ci(config): main 브랜치 배포 파이프라인 수정
ci(eas): 앱 배포 workflow 환경변수 주입 방식 변경
```

다음과 같은 경우에 적합합니다.

* GitHub Actions 수정
* Jenkins / CircleCI / EAS workflow 수정
* 테스트, 린트, 빌드 자동화 변경
* PR 검사 파이프라인 수정

## 4.4 revert

기존 커밋 또는 기능을 **의도적으로 되돌리는 경우** 사용합니다.

```text
revert(pay): 결제 UI 개편 커밋 되돌리기
revert(auth): 소셜 로그인 기능 롤백
```

특히 운영 중인 서비스에서 빠른 장애 대응이나 롤백 이력을 명확히 남길 때 유용합니다.

---

# 5. Scope 사용 기준

Scope는 **어느 영역에 영향을 주는지 명확히 하기 위한 선택 요소**입니다.

```text
feat(auth): 로그인 기능 추가
fix(order): 할인 금액 계산 오류 수정
refactor(table): 페이지네이션 로직 분리
```

scope는 보통 다음 기준으로 작성합니다.

* 도메인
* 모듈
* 기능 단위
* 플랫폼(web, admin, app)
* 공통 레이어(auth, api, ui, hooks)

예

```text
auth
user
payment
cart
dashboard
table
api
ui
app
web
admin
```

대규모 프로젝트에서는 scope가 커밋 히스토리 탐색에 큰 도움이 됩니다.

---

# 6. Type 선택 기준 (실무에서 헷갈리는 케이스)

## 6.1 UI 변경

UI 변경은 `style`이 아니라 대부분 `feat` 또는 `fix`입니다.

### 새로운 UI 추가

```text
feat(dashboard): 환자 통계 카드 위젯 추가
```

### UI 버그 수정

```text
fix(header): 모바일에서 네비게이션이 겹치는 문제 수정
```

### 단순 formatting

```text
style: prettier 포맷 적용
```

## 6.2 리팩토링

기능 변화가 없는 경우만 `refactor`를 사용합니다.

```text
refactor(user): 사용자 검증 로직 분리
refactor(auth): 중복된 토큰 검증 로직 제거
```

다음 경우는 refactor가 아닙니다.

* 기능 동작이 변경됨
* API 응답 구조 변경
* UI 동작 변경

이 경우 `feat` 또는 `fix`입니다.

## 6.3 dependency 업데이트

```text
chore(deps): react-query 버전 업데이트
```

또는 빌드 영향이 크다면

```text
build: vite 빌드 설정 수정
```

## 6.4 성능 최적화와 리팩토링의 차이

같은 구조 변경처럼 보여도 **목적이 성능 개선이면 `perf`**, 기능 변화 없는 구조 정리면 `refactor`입니다.

```text
perf(list): 리스트 렌더링 메모이제이션 적용
refactor(list): 리스트 렌더링 로직 컴포넌트로 분리
```

## 6.5 배포 설정 수정은 chore인가 ci인가 build인가

* 배포 파이프라인 수정 → `ci`
* 번들/빌드 설정 수정 → `build`
* 기타 운영성 설정 수정 → `chore`

---

# 7. Description 작성 기준

Description은 다음 원칙을 따릅니다.

## 7.1 변경 목적이 드러나야 한다

Bad

```text
fix: 로그인 수정
```

Good

```text
fix(auth): 토큰 만료 시 로그인 재시도 반복되는 문제 수정
```

## 7.2 무엇을 했는지보다 왜 했는지가 드러나야 한다

Bad

```text
refactor: 사용자 코드 수정
```

Good

```text
refactor(user): 중복된 사용자 검증 로직을 service로 분리
```

## 7.3 가능하면 명령형으로 작성

```text
feat: 로그인 검증 로직 추가
fix: 결제 금액 계산 오류 수정
refactor: 사용자 조회 로직 분리
```

---

# 8. Breaking Change

호환성을 깨는 변경이 있는 경우 다음 두 가지 방식 중 하나를 사용합니다.

### 방법 1

```text
feat!: 사용자 API 응답 구조 변경
```

### 방법 2

```text
feat(api): 사용자 응답 구조 변경

BREAKING CHANGE: userName 필드가 name으로 변경됨
```

Breaking Change는 보통 다음 상황에서 사용합니다.

* API 응답 구조 변경
* 함수 인터페이스 변경
* 기존 기능 제거

---

# 9. 실무 예시

### Feature

```text
feat(auth): refresh token 로직 구현
feat(table): 서버 사이드 페이지네이션 추가
feat(search): 검색어 하이라이트 기능 추가
```

### Fix

```text
fix(auth): 토큰 만료 시 무한 리다이렉트 발생하는 문제 수정
fix(payment): 통화 포맷팅 오류 수정
fix(ui): iOS에서 모달 스크롤이 잠기지 않는 문제 수정
```

### Refactor

```text
refactor(api): API 호출 로직을 service 레이어로 분리
refactor(user): 사용자 관련 hook 분리
refactor(table): 페이지네이션 상태 관리 로직 분리
```

### Perf

```text
perf(home): 초기 렌더링 시 불필요한 API 호출 제거
perf(image): 썸네일 이미지 압축 및 preload 전략 개선
perf(feed): 무한 스크롤 렌더링 최적화
```

### Build

```text
build(next): image remotePatterns 설정 추가
build: 번들 분석 도구 설정 추가
```

### CI

```text
ci: PR 생성 시 lint 및 test 자동 실행 추가
ci(deploy): 운영 배포 전 빌드 검증 단계 추가
```

### Revert

```text
revert: 메인 대시보드 필터 개편 커밋 되돌리기
revert(app): iOS 전용 분기 처리 롤백
```

### Docs

```text
docs: 로컬 개발 환경 설정 가이드 추가
docs(api): 사용자 API 문서 업데이트
```

### Chore

```text
chore: eslint 설정 추가
chore(deps): axios 버전 업데이트
```

---

# 10. 좋은 커밋 단위

Conventional Commits는 자연스럽게 **작은 커밋 단위**를 유도합니다.

좋은 예

```text
feat(auth): 로그인 API 추가
feat(auth): 로그인 폼 validation 구현
fix(auth): 로그인 실패 시 에러 메시지 표시
```

나쁜 예

```text
feat: 로그인 + 회원가입 + UI 수정 + 문서 수정
```

---

# 11. Husky와 함께 운영하는 방법

컨벤션 문서는 있어도 **강제 장치가 없으면 시간이 지나며 쉽게 무너집니다.**
프론트엔드 팀에서는 보통 `husky + commitlint` 조합으로 커밋 메시지 규칙을 검증합니다.

## 11.1 왜 Husky를 함께 언급해야 하나

Husky는 Git hook을 통해 커밋 시점에 검증 로직을 실행할 수 있게 해줍니다.
즉, 팀원이 실수로 규칙을 어긴 커밋 메시지를 작성해도 커밋 전에 차단할 수 있습니다.

대표적으로 다음과 같이 사용합니다.

* `pre-commit`: lint-staged, eslint, test 실행
* `commit-msg`: commitlint 실행

## 11.2 권장 운영 방식

* `pre-commit`에서는 코드 품질 검사
* `commit-msg`에서는 커밋 메시지 형식 검사
* PR 단계에서는 CI에서 한 번 더 검증

즉, 로컬과 CI 양쪽에서 모두 검증하는 방식이 가장 안정적입니다.

## 11.3 commit-msg에서 막고 싶은 규칙 예시

* type 누락 금지
* 허용된 type만 사용
* description 비어있음 금지
* header 길이 제한

예시로 다음과 같은 메시지는 허용됩니다.

```text
feat(auth): 로그인 기능 추가
fix(payment): 결제 금액 계산 오류 수정
perf(feed): 피드 목록 렌더링 최적화
```

다음과 같은 메시지는 차단 대상입니다.

```text
로그인 수정
fix
작업
최종 수정
```

## 11.4 Husky를 쓰고 있다면 문서에 명시할 내용

팀 문서에는 아래 정도는 함께 적어두는 것이 좋습니다.

* 이 프로젝트는 Husky를 통해 커밋 메시지를 검증한다.
* 커밋 메시지는 Conventional Commits 형식을 따라야 한다.
* 규칙을 위반하면 `commit-msg` 단계에서 커밋이 차단될 수 있다.
* 긴급 대응으로 hook을 우회하기보다 메시지를 규칙에 맞게 수정하는 것을 원칙으로 한다.

추천 문구 예시:

> 본 프로젝트는 Husky와 commitlint를 사용하여 커밋 메시지 규칙을 검증합니다.
> 모든 커밋 메시지는 Conventional Commits 형식을 따라야 하며, 형식이 맞지 않을 경우 `commit-msg` 단계에서 커밋이 차단될 수 있습니다.

---

# 12. 팀 적용 시 권장 규칙

1. 모든 커밋은 type prefix 사용
2. description은 구체적으로 작성
3. 하나의 커밋은 하나의 목적만 담기
4. 필요 시 scope 사용
5. 성능/빌드/배포/롤백 이력은 별도 타입으로 분리
6. Husky와 commitlint로 규칙을 자동 검증

---

# 13. 추천 커밋 템플릿

```text
<type>(scope): <description>

[optional body]

[optional footer]
```

예시

```text
perf(feed): 목록 렌더링 성능 개선

불필요한 리렌더링으로 인해 스크롤 구간에서 프레임 드랍이 발생하고 있었다.
리스트 아이템 메모이제이션과 intersection observer 조건을 조정해 렌더링 비용을 줄였다.

Refs: #231
```

---

# 14. 정리

좋은 커밋 메시지는 다음 질문에 답해야 합니다.

* 무엇을 변경했는가
* 왜 변경했는가
* 어디에 영향을 주는가

Conventional Commits는 이 정보를 **일관된 형식으로 기록하기 위한 규칙**입니다.
프론트엔드 팀에서는 특히 `perf`, `build`, `ci`, `revert` 같은 확장 타입을 함께 정의하면 히스토리 품질이 훨씬 좋아집니다.
또한 Husky와 commitlint를 함께 사용해야 컨벤션이 문서에만 남지 않고 실제 운영 규칙으로 정착됩니다.
