import { getPostContent, getPostMetadata } from '@/helpers/get-post-metadata'
import { getUrl, shared } from '@app/shared'
import { Metadata } from 'next'
import { PostWrapper } from '../../components/post/post-wrapper'
import {
  Breadcrumb,
  BreadcrumbContainer,
  BreadcrumbPreviousButton,
  BreadcrumbPreviousNav,
  BreadcrumbPreviousNavItem,
} from '../../components/shared/breadcrumb'
import { CTASection } from '../../components/shared/cta-section'

type PageProps = {
  params: { slug: string }
}

export const generateStaticParams = async () => {
  const posts = getPostMetadata('changelog')
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = params.slug
  const post = getPostContent(slug, 'changelog')

  return {
    title: post.title,
    description: post.subtitle,
    openGraph: {
      images: [getUrl(post.cover)],
    },
  }
}

export default function Page({ params }: PageProps) {
  const slug = params.slug

  const post = getPostContent(slug, 'changelog')
  const related = getPostMetadata('changelog')

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
            <BreadcrumbPreviousNavItem title={post.title} href={post.slug} />
          </BreadcrumbPreviousNav>
        </BreadcrumbContainer>
      </Breadcrumb>
      <PostWrapper post={post} related={related} />
      <CTASection />
    </>
  )
}
