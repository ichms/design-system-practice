import { iconSizeMap, type IconProps } from '../types'

export const Menu = ({ size = 'medium', width, height, ...props }: IconProps) => {
  const pixelSize = iconSizeMap[size]

  return (
    <svg
      width={width ?? pixelSize}
      height={height ?? pixelSize}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M20 18H4M20 12H4M20 6H4'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}
