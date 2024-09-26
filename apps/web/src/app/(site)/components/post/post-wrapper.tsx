import Markdown from 'markdown-to-jsx'
import Link from 'next/link'

import { PostMetadata } from '@/helpers/get-post-metadata'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { shared } from '@app/shared'
import { Badge } from '@design-system/react/components/ui/badge'
import { cn } from '@design-system/react/helpers/cn'
import { PostSocialBar } from './post-social-bar'
import { TracingBeam } from './tracing-beam'

type PostWrapperProps = {
  post: PostMetadata
  related: PostMetadata[]
}

export function PostWrapper({ post, related }: PostWrapperProps) {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <>
      <div className="pt-16">
        <div className="container max-w-screen-xl">
          <div className="flex items-center space-x-4 mb-8">
            <Badge>{post.type}</Badge>
            <time
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {post.date}
            </time>
          </div>
          <h1 className="md:max-w-[60rem] mb-4 font-normal text-3xl md:text-4xl">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground md:max-w-[50%]">
            {post.subtitle}
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-52 h-[calc(100%-13rem)] w-full border border-border bg-secondary/20 dark:bg-black/30 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.05)] backdrop-blur-lg"></div>
        <div className="container max-w-screen-xl lg:px-8 grid grid-cols-4 gap-5 px-0 pt-10 lg:gap-10">
          <div className="relative col-span-4 md:col-span-3">
            <TracingBeam>
              <div className="flex flex-col space-y-2 bg-white dark:bg-zinc-950 border-b-node sm:rounded-md-t-xl sm:border sm:border-border">
                <img
                  alt={post.title}
                  width="1200"
                  height="630"
                  decoding="async"
                  data-nimg="1"
                  className="aspect-[1200/630] rounded-md-t-xl object-cover blur-0 border-b border-border"
                  src={post.cover}
                />
                <article className="lg:prose-lg dark:prose-invert prose prose-gray max-w-none transition-all prose-headings:relative prose-headings:scroll-mt-20 prose-headings:font-display prose-headings:font-bold px-5 pb-4 pt-4 sm:px-10">
                  <Markdown>{post.content}</Markdown>
                </article>
                <PostSocialBar currentPost={post} />
              </div>
            </TracingBeam>
          </div>
          <aside className="sticky top-20 col-span-1 mt-48 hidden flex-col divide-y divide-gray-200 dark:divide-border self-start sm:flex">
            <div className="flex flex-col space-y-4 py-5">
              <p className="text-sm text-muted-foreground">
                {dict.site.sections.posts.postWrapper.aside.writtenBy}
              </p>
              <a
                className="group flex items-center space-x-3"
                target="_blank"
                rel="noopener noreferrer"
                href={shared.config.application.creator.twitter}
              >
                <img
                  alt={shared.config.application.creator.name}
                  loading="lazy"
                  width="40"
                  height="40"
                  decoding="async"
                  data-nimg="1"
                  className="rounded-full transition-all group-hover:brightness-90 blur-0"
                  src={shared.config.application.creator.image}
                />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    {shared.config.application.creator.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @
                    {shared.config.application.creator.twitter.replace(
                      'https://twitter.com/',
                      '',
                    )}
                  </p>
                </div>
              </a>
            </div>
            {related.length && (
              <div className="flex flex-col space-y-4 py-5">
                <p className="text-sm text-muted-foreground">
                  {dict.site.sections.posts.postWrapper.aside.readMore}
                </p>
                <ul className="flex flex-col space-y-4">
                  {related.map((item) => (
                    <li
                      key={item.slug}
                      className={cn([item.slug === post.slug && 'hidden'])}
                    >
                      <Link
                        className="group flex flex-col space-y-2"
                        href={`/blog/${item.slug}`}
                      >
                        <p className="font-semibold underline-offset-4 group-hover:underline">
                          {item.title}
                        </p>
                        <p className="line-clamp-2 text-sm text-muted-foreground underline-offset-2 group-hover:underline">
                          {item.subtitle}
                        </p>
                        <p className="text-xs text-gray-400 underline-offset-2 group-hover:underline">
                          {item.date}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
