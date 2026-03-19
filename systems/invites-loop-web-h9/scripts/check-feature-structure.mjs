/* 
 feature의 컴포넌트 구조가 팀 규칙과 맞는지 검사합니다.
`components`에는 `Page.tsx`만 두고, 
 나머지 UI 컴포넌트는 `components/elements/*`에 있어야 합니다.
 참고 문서:
 - .agents/skills/team-rules/rules/00-governance/hard-rules.md (`HR-ARC-04`)
 - .agents/skills/team-rules/rules/12-react-component-practices.md
*/
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const featuresDir = path.join(rootDir, 'features')
const ignoredFeatureRoots = new Set(['common', 'shell'])
const validExtensions = new Set(['.tsx'])

const violations = []

const hasExemption = (filePath) => {
  const source = readFileSync(filePath, 'utf8')
  const head = source.split('\n').slice(0, 5).join('\n')
  return /EX-01/.test(head)
}

const inspectComponentsDir = (componentsDir) => {
  const entries = readdirSync(componentsDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(componentsDir, entry.name)

    if (entry.isDirectory()) {
      if (entry.name !== 'elements') {
        violations.push({
          filePath: fullPath,
          reason: '`components` 하위 디렉토리는 `elements`만 허용됩니다.',
        })
        continue
      }

      const stack = [fullPath]
      while (stack.length > 0) {
        const currentDir = stack.pop()
        const childEntries = readdirSync(currentDir, { withFileTypes: true })
        for (const childEntry of childEntries) {
          const childPath = path.join(currentDir, childEntry.name)
          if (childEntry.isDirectory()) {
            stack.push(childPath)
            continue
          }

          if (
            !childEntry.isFile() ||
            !validExtensions.has(path.extname(childEntry.name))
          ) {
            continue
          }

          if (hasExemption(childPath)) {
            continue
          }
        }
      }

      continue
    }

    if (!entry.isFile() || !validExtensions.has(path.extname(entry.name))) {
      continue
    }

    if (entry.name === 'Page.tsx' || hasExemption(fullPath)) {
      continue
    }

    violations.push({
      filePath: fullPath,
      reason:
        '`components/Page.tsx` 외 `.tsx`는 `components/elements/*` 아래에만 둘 수 있습니다.',
    })
  }
}

const walkFeatureDir = (featureDir) => {
  const entries = readdirSync(featureDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(featureDir, entry.name)

    if (entry.isDirectory() && entry.name === 'components') {
      inspectComponentsDir(fullPath)
      continue
    }

    if (entry.isDirectory()) {
      walkFeatureDir(fullPath)
    }
  }
}

if (existsSync(featuresDir)) {
  const featureRoots = readdirSync(featuresDir, { withFileTypes: true })

  for (const featureRoot of featureRoots) {
    if (!featureRoot.isDirectory() || ignoredFeatureRoots.has(featureRoot.name)) {
      continue
    }

    walkFeatureDir(path.join(featuresDir, featureRoot.name))
  }
}

if (violations.length > 0) {
  console.error(
    'HR-ARC-04 위반: feature 구조가 `components/Page.tsx + components/elements/*` 규칙을 따르지 않습니다.',
  )

  for (const violation of violations) {
    console.error(`- ${path.relative(rootDir, violation.filePath)} ${violation.reason}`)
  }

  console.error('예외가 필요한 경우 파일 상단에 EX-01 근거를 명시하세요.')
  process.exit(1)
}

console.log(
  'feature 구조 검사 통과: `components/Page.tsx + components/elements/*` 규칙 위반이 없습니다.',
)
