import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  suffix?: string;
}

function Input({ className, type, suffix, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot='input'
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-[36px] min-h-[36px] w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'outline outline-1 outline-offset-[-1px] outline-[#e4e7ec]',
          suffix && 'pr-10',
          className
        )}
        {...props}
      />
      {suffix && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <span className="text-sm font-medium text-[#9CA3AF] leading-tight font-['Inter']">
            {suffix}
          </span>
        </div>
      )}
    </div>
  )
}

export { Input }
