/* 
 이 파일은 queryKey를 문자열/배열로 직접 쓰는 코드를 찾아 막습니다.
 queryKey는 반드시 queryKeys.ts(factory)에서 만든 값을 사용해야 합니다.
 참고 문서:
 - .agents/skills/team-rules/rules/00-governance/hard-rules.md (`HR-RQ-01`)
 - .agents/skills/team-rules/rules/02-tanstack-query-rules.md
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const scanRoots = ['app', 'features', 'packages']
const validExtensions = new Set(['.ts', '.tsx', '.mts'])
const ignoredDirs = new Set(['node_modules', '.next', 'out', 'build', '.git', '.agents'])

const violations = []

const countLine = (source, index) => source.slice(0, index).split('\n').length

const hasExemption = (lines, lineNumber) => {
  const current = lines[lineNumber - 1] ?? ''
  const previous = lines[lineNumber - 2] ?? ''
  return /EX-01/.test(current) || /EX-01/.test(previous)
}

const isQueryKeyFactoryFile = (filePath) => {
  return /queryKeys?\.(ts|tsx|mts)$/.test(path.basename(filePath))
}

const inspectFile = (filePath) => {
  if (isQueryKeyFactoryFile(filePath)) {
    return
  }

  const source = readFileSync(filePath, 'utf8')
  const lines = source.split('\n')
  const patterns = [
    { kind: 'array literal', regex: /\bqueryKey\s*:\s*\[/g },
    { kind: 'string literal', regex: /\bqueryKey\s*:\s*['"`]/g },
  ]

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0
    let match

    while ((match = pattern.regex.exec(source)) !== null) {
      const lineNumber = countLine(source, match.index)
      if (hasExemption(lines, lineNumber)) {
        continue
      }

      violations.push({
        filePath,
        kind: pattern.kind,
        lineNumber,
        sourceLine: (lines[lineNumber - 1] ?? '').trim(),
      })
    }
  }
}

const walkDir = (dirPath) => {
  const entries = readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) {
      continue
    }

    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      walkDir(fullPath)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    if (!validExtensions.has(path.extname(entry.name))) {
      continue
    }

    inspectFile(fullPath)
  }
}

for (const root of scanRoots) {
  const targetPath = path.join(rootDir, root)
  if (!existsSync(targetPath)) {
    continue
  }
  walkDir(targetPath)
}

if (violations.length > 0) {
  console.error(
    'HR-RQ-01 위반: queryKey 하드코딩이 감지되었습니다. queryKeys.ts factory를 사용하세요.',
  )
  for (const violation of violations) {
    const relativePath = path.relative(rootDir, violation.filePath)
    console.error(
      `- ${relativePath}:${violation.lineNumber} (${violation.kind}) ${violation.sourceLine}`,
    )
  }
  console.error(
    '예외가 필요한 경우 해당 라인(또는 바로 위 라인)에 EX-01 근거를 명시하세요.',
  )
  process.exit(1)
}

console.log(
  'queryKey 하드코딩 검사 통과: queryKeys.ts factory 강제 규칙에 위반이 없습니다.',
)
