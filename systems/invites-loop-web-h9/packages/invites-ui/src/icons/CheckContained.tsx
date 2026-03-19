import { iconSizeMap, type IconProps } from '../types'

export const CheckContained = ({
  size = 'medium',
  width,
  height,
  ...props
}: IconProps) => {
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
        d='M15.142 9.98299L10.875 14.25L9.42049 12.7955M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
