import { getPostMetadata } from '@/helpers/get-post-metadata'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { Separator } from '@design-system/react/components/ui/separator'
import { Metadata } from 'next'

import { PostCard } from '../components/post/post-card'
import { Subscribe } from '../components/post/subscribe'
import {
  Breadcrumb,
  BreadcrumbContainer,
  BreadcrumbPreviousButton,
  BreadcrumbPreviousNav,
  BreadcrumbPreviousNavItem,
} from '../components/shared/breadcrumb'
import { CTASection } from '../components/shared/cta-section'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.site.sections.blog.metadata.title,
    description: `${dict.site.sections.blog.metadata.description} ${shared.config.application.name}.`,
  }
}

export default function Page() {
  const postMetadata = getPostMetadata('blog')
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <>
      <Breadcrumb>
        <BreadcrumbContainer>
          <BreadcrumbPreviousButton />
          <BreadcrumbPreviousNav>
            <BreadcrumbPreviousNavItem
              title={shared.config.application.name}
              href="/"
            />
            <BreadcrumbPreviousNavItem title="Blog" href="/blog" />
          </BreadcrumbPreviousNav>
        </BreadcrumbContainer>
      </Breadcrumb>

      <section>
        <div className="container max-w-screen-xl py-12">
          <h1 className="text-3xl font-normal mb-12 md:max-w-[40%] leading-snug">
            {dict.site.sections.blog.title} {shared.config.application.name}.
          </h1>
          <Subscribe />
        </div>
      </section>

      <Separator />

      <section className="py-16">
        <div className="container max-w-screen-xl">
          <ul className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3">
            {postMetadata.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  )
}
