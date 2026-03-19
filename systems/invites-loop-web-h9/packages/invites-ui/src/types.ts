import type { SVGProps } from 'react'

export const iconSizeMap = {
  xSmall: 12,
  small: 16,
  sMedium: 20,
  medium: 24,
  large: 32,
  xLarge: 40,
  '2xLarge': 48,
  '3xLarge': 56,
  '6xLarge': 80,
} as const

export type IconSize = keyof typeof iconSizeMap

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: IconSize
}
