import { PostMetadata } from '@/helpers/get-post-metadata'
import { shared } from '@app/shared'
import Link from 'next/link'

type PostCardProps = {
  post: PostMetadata
}

export function PostCard({ post }: PostCardProps) {
  return (
    <li>
      <Link href={`/${post.type}/${post.slug}`} className="flex flex-col">
        <img
          className="rounded-md border border-border mb-8"
          src={post.cover}
          alt={post.title}
        />

        <div className="">
          <h2 className="font-bold font-styling font-display line-clamp-5 leading-normal text-xl text-slate-12 mb-2">
            {post.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">{post.subtitle}</p>
          <div className="flex items-center gap-1.5 md:gap-2 lg:mt-3">
            <img
              src={shared.config.application.creator.image}
              alt={shared.config.application.creator.name}
              className="rounded-full h-9 w-9"
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold">
                {shared.config.application.creator.name}
              </p>
              <p className="text-sm opacity-60">
                <time dateTime="2023-11-22">{post.date}</time>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
