import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../../helpers/cn'

import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/95',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/85',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
        link: 'text-primary underline-offset-4 hover:underline !mx-0 !mh-0 !p-0',
      },
      size: {
        default: 'h-9 px-5 py-2.5',
        sm: 'h-8 px-4 py-2 text-xs',
        lg: 'h-11 px-6 py-3 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {props.children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

type ButtonIconProps = {
  isLoading?: boolean
  className?: string
  icon?: React.FC<{ className?: string }>
}

const ButtonIcon = ({ isLoading, icon: Icon, className }: ButtonIconProps) => {
  return (
    <>
      {isLoading ? (
        <Loader2 className={cn([className, 'animate-spin'])} />
      ) : (
        Icon && <Icon className={className} />
      )}
    </>
  )
}

export { Button, ButtonIcon, buttonVariants }
