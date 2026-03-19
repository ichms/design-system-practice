import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const blockButtonVariants = cva(
  'inline-flex w-full items-center justify-center font-pretendard transition-all focus-visible:outline-none disabled:pointer-events-none select-none rounded-radius-8',
  {
    variants: {
      colorType: {
        blue: 'bg-blue-50 text-common-100 active:bg-blue-40 disabled:bg-coolNeutral-97 disabled:text-neutral-5',
        grey: 'bg-blueGrey-99 text-neutral-5 active:bg-blueGrey-90 disabled:bg-coolNeutral-97 disabled:text-neutral-5',
      },
      size: {
        L: 'h-56 px-16 gap-6 text-bodySm-SB',
        M: 'h-50 px-14 gap-6 text-bodySm-SB',
        S: 'h-40 w-fit px-12 gap-6 text-captionLg-SB',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        colorType: 'blue',
        selected: true,
        class: 'ring-3 ring-blue-80',
      },
      {
        colorType: 'grey',
        selected: true,
        class: 'ring-3 ring-blueGrey-90',
      },
    ],
    defaultVariants: {
      colorType: 'blue',
      size: 'L',
      selected: false,
    },
  },
)

export { blockButtonVariants }

export interface BlockButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof blockButtonVariants> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const BlockButton = forwardRef<HTMLButtonElement, BlockButtonProps>(
  (
    { className, colorType, size, selected, leftIcon, rightIcon, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(blockButtonVariants({ colorType, size, selected }), className)}
        {...props}
      >
        {leftIcon && <span className='inline-flex shrink-0'>{leftIcon}</span>}
        {children}
        {rightIcon && <span className='inline-flex shrink-0'>{rightIcon}</span>}
      </button>
    )
  },
)


