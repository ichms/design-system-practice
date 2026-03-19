export const isDirty = (origin: unknown, target: unknown): boolean => {
  // 타입이 다르면 무조건 변경
  if (typeof origin !== typeof target) return true

  // null 처리
  if (origin === null || target === null) {
    return origin !== target
  }

  // primitive
  if (typeof origin !== 'object') {
    return origin !== target
  }

  // 배열 처리
  if (Array.isArray(origin) || Array.isArray(target)) {
    if (!Array.isArray(origin) || !Array.isArray(target)) return true
    if (origin.length !== target.length) return true

    for (let i = 0; i < origin.length; i++) {
      if (isDirty(origin[i], target[i])) return true
    }
    return false
  }

  // 객체 처리
  const originKeys = Object.keys(origin as object)
  const targetKeys = Object.keys(target as object)
  const originRecord = origin as Record<string, unknown>
  const targetRecord = target as Record<string, unknown>

  if (originKeys.length !== targetKeys.length) return true

  for (const key of originKeys) {
    if (!(key in targetRecord)) return true
    if (isDirty(originRecord[key], targetRecord[key])) return true
  }

  return false
}
