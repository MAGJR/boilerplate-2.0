import RSS from 'rss'

import { getPostMetadata } from '@/helpers/get-post-metadata'
import { shared } from '@app/shared'
import { getUrl } from '@app/shared/src/@helpers/get-url'

/**
 * GET function to generate RSS feed.
 * @returns {Promise<Response>} The response containing the RSS feed.
 */
export async function GET(): Promise<Response> {
  const posts = [...getPostMetadata('blog'), ...getPostMetadata('changelog')]

  const feed = new RSS({
    title: shared.config.application.name,
    description: shared.config.application.description,
    site_url: getUrl(),
    feed_url: getUrl('/feed.xml'),
    copyright: `© ${new Date().getFullYear()} ${
      shared.config.application.name
    }`,
    language: 'en-US',
    pubDate: new Date(),
  })

  // eslint-disable-next-line array-callback-return
  posts.map((post) => {
    feed.item({
      title: post.title,
      guid: getUrl(`${post.type}/${post.slug}`),
      url: getUrl(`${post.type}/${post.slug}`),
      date: post.date,
      description: post.excerpt,
      author: shared.config.application.creator.name,
      categories: [post.type],
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  })
}
