import { iconSizeMap, type IconProps } from '../types'

export const InformationCircle = ({
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
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M10.9 14.9V10.9M10.9 6.89999H10.91M20.9 10.9C20.9 16.4228 16.4228 20.9 10.9 20.9C5.37715 20.9 0.899994 16.4228 0.899994 10.9C0.899994 5.37715 5.37715 0.899994 10.9 0.899994C16.4228 0.899994 20.9 5.37715 20.9 10.9Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
