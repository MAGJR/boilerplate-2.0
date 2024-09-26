import NextTopLoader from 'nextjs-toploader'

import { AuthGuard } from '@/guards/auth.guard'
import { LocaleProvider } from '@/services/internationalization/contexts/locale.context'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { ThemeProvider } from '@design-system/react/components/ui/theme-provider'
import { Toaster } from '@design-system/react/components/ui/toaster'
import { UTMProvider } from '@design-system/react/components/ui/utm-provider'
import { GoogleTagManager } from '@next/third-parties/google'
import { GeistSans } from 'geist/font/sans'
import { Suspense } from 'react'

import '@design-system/react/style.scss'

export const metadata = {
  title: {
    template: `%s · ${shared.config.application.name}`,
    default: 'Page',
  },
  openGraph: {
    images: [shared.config.application.brand.assets.og],
  },
  metadataBase: new URL(shared.config.application.url),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = getLocaleFromRequest()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${GeistSans.className} font-sans`}>
        <NextTopLoader color="#635bff" />
        <Toaster />
        <GoogleTagManager
          gtmId={shared.config.application.providers.analytics.GTM}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme={shared.config.application.theme}
          enableSystem
          disableTransitionOnChange
          value={{
            light: 'light-theme',
            dark: 'dark-theme',
          }}
        >
          <Suspense>
            <LocaleProvider locale={locale}>
              <UTMProvider />
              <AuthGuard>{children}</AuthGuard>
            </LocaleProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
