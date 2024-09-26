import { sessionProvider } from '@/services/session'
import { log } from '@app/shared'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const { user, tenant } = await sessionProvider.getApplicationSession()
  const pathname = headers().get('x-pathname') || ''

  log({
    provider: 'AuthGuard',
    message: `User: ${user?.id}, Tenant: ${tenant?.id}, Pathname: ${pathname}`,
  })

  if (pathname.startsWith('/auth')) {
    log({ provider: 'AuthGuard', message: 'Handling /auth path' })
    // check if user is authenticated
    if (user) {
      log({
        provider: 'AuthGuard',
        message: 'User authenticated, redirecting to /app',
      })
      redirect('/app')
    }

    return <>{children}</>
  }

  if (pathname.startsWith('/app')) {
    log({ provider: 'AuthGuard', message: 'Handling /app path' })
    // check if user is authenticated
    if (!user) {
      log({
        provider: 'AuthGuard',
        message: 'User not authenticated, redirecting to session expired',
      })
      redirect('/auth/session-expired')
    }

    // check if tenant is authenticated
    if (!tenant) {
      log({ provider: 'AuthGuard', message: 'Tenant not authenticated' })
      const firstValidTenant = sessionProvider.getFirstValidTenant(user)
      if (firstValidTenant) {
        log({
          provider: 'AuthGuard',
          message: 'First valid tenant found, redirecting to select account',
        })
        redirect(`/app/select-account/${firstValidTenant}`)
      } else if (!pathname.includes('/app/get-started')) {
        log({
          provider: 'AuthGuard',
          message: 'No valid tenant, redirecting to get started',
        })
        redirect('/app/get-started')
      }
    }
  }

  log({ provider: 'AuthGuard', message: 'Rendering children' })
  return <>{children}</>
}
