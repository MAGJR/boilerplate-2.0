'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '../../helpers/cn'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'
import { useToast } from './use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, icon, variant, ...props }) {
        let defaultIcon
        switch (variant) {
          case 'destructive':
            defaultIcon = <XCircle className="h-5 w-5 text-red-500" />
            break
          default:
            defaultIcon = <CheckCircle className="h-5 w-5 text-green-500" />
        }

        return (
          <Toast key={id} {...props}>
            <div className="flex items-center gap-3">
              <span className={cn([
                'flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full animate-pulse',
                variant === 'destructive' && 'bg-red-100 text-red-500',
                variant === 'default' && 'bg-green-100 text-green-500'
              ])}>
                {icon || defaultIcon}
              </span>
              <div className="grid">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
