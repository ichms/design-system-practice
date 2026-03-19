/**
 @args 판별해야할 값
 args의 값이 빈객체, 빈배열, 그 외에 javascript의 falsy값을 갖고 있을 경우 false를 리턴
*/
export const isTruthy = (...args: unknown[]): boolean => {
  if (args.length === 0) {
    throw new Error('인자가 필요한 함수입니다.')
  }
  return args.every((argument) => {
    if (Array.isArray(argument) === true && argument.length === 0) return false // 빈배열
    if (!argument) return false // falsy 값
    if (typeof argument === 'object' && Object.keys(argument).length === 0) return false // 빈객체

    return true
  })
}
