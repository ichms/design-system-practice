import { iconSizeMap, type IconProps } from '../types'

export const Share = ({ size = 'medium', width, height, ...props }: IconProps) => {
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
        d='M4 15.5264V19.0096C4 19.5375 4.21071 20.0437 4.58579 20.417C4.96086 20.7903 5.46957 21 6 21H18C18.5304 21 19.0391 20.7903 19.4142 20.417C19.7893 20.0437 20 19.5375 20 19.0096V15.5264M12.0413 15.279L12.0413 4M12.0413 4L7.46987 8.30966M12.0413 4L16.6127 8.30966'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
