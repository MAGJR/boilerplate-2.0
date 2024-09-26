import React from 'react'
import { cn } from '../../helpers/cn'

type EmptyStateProps = {
  children: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border border-dotted border-spacing-2 rounded-xl p-8 border-border animate-fade-up animate-delay-150',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const EmptyStateTitle: React.FC<EmptyStateProps> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={cn(
        'text-sm font-semibold animate-fade-up animate-delay-200',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export const EmptyStateDescription: React.FC<EmptyStateProps> = ({
  children,
  className,
}) => {
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground text-center animate-fade-up animate-delay-300',
        className,
      )}
    >
      {children}
    </p>
  )
}
