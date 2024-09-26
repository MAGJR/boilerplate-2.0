import { getPostMetadata } from '@/helpers/get-post-metadata'
import { getUrl } from '@app/shared'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPostMetadata('blog')
  const changelogs = getPostMetadata('changelog')

  return [
    {
      url: getUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: getUrl('/pricing'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: getUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: getUrl('/changelog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...posts.map((post) => {
      return {
        url: getUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }
    }),
    ...changelogs.map((post) => {
      return {
        url: getUrl(`/changelog/${post.slug}`),
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }
    }),
  ]
}
