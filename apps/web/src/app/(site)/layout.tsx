import { PropsWithChildren } from 'react'
import { Footer } from './components/layout/footer'
import { Header } from './components/layout/header'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
