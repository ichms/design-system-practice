import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface SearchFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  errorMessage?: string
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, leftIcon, errorMessage, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col', className)}>
        <div
          className={cn(
            'inline-flex w-full items-center rounded-radius px-20 py-8 gap-10 transition-all',
            'bg-coolNeutral-98 border border-transparent',
            'focus-within:bg-neutral-20 focus-within:border-blue-20',
            errorMessage && 'bg-neutral-20 border-red-30',
            'has-[:disabled]:opacity-50 has-[:disabled]:pointer-events-none',
          )}
        >
          {leftIcon && (
            <span className='inline-flex shrink-0 text-neutral-50'>{leftIcon}</span>
          )}
          <input
            ref={ref}
            className='flex-1 bg-transparent outline-none text-neutral-90 placeholder:text-neutral-90 focus:text-common-100 focus:placeholder:text-neutral-50'
            {...props}
          />
        </div>
        {errorMessage && (
          <p className='text-captionLg-R text-red-30'>{errorMessage}</p>
        )}
      </div>
    )
  },
)


