/* 
  `shared`가 특정 하위 기능 전용 코드에 의존하는지 검사합니다.
 `shared`에서는 다른 페이지 전용 `service.ts`, `queryKeys.ts`, `hooks/*`를 import하면 안 됩니다.
 참고 문서:
 - .agents/skills/team-rules/rules/00-governance/hard-rules.md (`HR-ARC-05`)
 - .agents/skills/team-rules/rules/06-domain-boundary-common-promotion.md
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const featuresDir = path.join(rootDir, 'features')
const validExtensions = new Set(['.ts', '.tsx', '.mts'])
const violations = []

const hasExemption = (filePath) => {
  const source = readFileSync(filePath, 'utf8')
  const head = source.split('\n').slice(0, 5).join('\n')
  return /EX-01/.test(head)
}

const normalizeSlashes = (value) => value.split(path.sep).join('/')

const isSharedOwnershipViolation = (importPath, boundedContext, currentFilePath) => {
  const aliasPattern = new RegExp(
    `^@/features/${boundedContext}/(?!shared(?:/|$))[^/]+/(service(\\.ts)?|queryKeys(\\.ts)?|hooks(?:/|$))`,
  )

  if (aliasPattern.test(importPath)) {
    return true
  }

  if (!importPath.startsWith('.')) {
    return false
  }

  const resolvedPath = path.resolve(path.dirname(currentFilePath), importPath)
  const relativeFromFeatures = normalizeSlashes(path.relative(featuresDir, resolvedPath))

  if (
    !relativeFromFeatures.startsWith(`${boundedContext}/`) ||
    relativeFromFeatures.startsWith(`${boundedContext}/shared/`)
  ) {
    return false
  }

  return (
    /\/(service|queryKeys)\.(ts|tsx|mts)$/.test(relativeFromFeatures) ||
    /\/hooks\//.test(relativeFromFeatures)
  )
}

const inspectSharedFile = (filePath, boundedContext) => {
  if (hasExemption(filePath)) {
    return
  }

  const source = readFileSync(filePath, 'utf8')
  const importPattern = /from\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  let match

  while ((match = importPattern.exec(source)) !== null) {
    const importPath = match[1] ?? match[2]

    if (!isSharedOwnershipViolation(importPath, boundedContext, filePath)) {
      continue
    }

    violations.push({
      filePath,
      importPath,
    })
  }
}

const walkSharedDir = (sharedDir, boundedContext) => {
  const entries = readdirSync(sharedDir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(sharedDir, entry.name)

    if (entry.isDirectory()) {
      walkSharedDir(fullPath, boundedContext)
      continue
    }

    if (!entry.isFile() || !validExtensions.has(path.extname(entry.name))) {
      continue
    }

    inspectSharedFile(fullPath, boundedContext)
  }
}

if (existsSync(featuresDir)) {
  const featureRoots = readdirSync(featuresDir, { withFileTypes: true })

  for (const featureRoot of featureRoots) {
    if (!featureRoot.isDirectory()) {
      continue
    }

    const sharedDir = path.join(featuresDir, featureRoot.name, 'shared')
    if (!existsSync(sharedDir)) {
      continue
    }

    walkSharedDir(sharedDir, featureRoot.name)
  }
}

if (violations.length > 0) {
  console.error(
    'HR-ARC-05 위반: `features/<bounded>/shared`가 특정 subfeature의 service/queryKeys/hooks에 의존하고 있습니다.',
  )

  for (const violation of violations) {
    console.error(
      `- ${path.relative(rootDir, violation.filePath)} -> ${violation.importPath}`,
    )
  }

  console.error('예외가 필요한 경우 파일 상단에 EX-01 근거를 명시하세요.')
  process.exit(1)
}

console.log(
  'shared 소유권 검사 통과: `shared`가 특정 subfeature의 service/queryKeys/hooks에 의존하지 않습니다.',
)
