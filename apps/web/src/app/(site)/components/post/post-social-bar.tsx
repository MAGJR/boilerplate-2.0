import {
  PostMetadata,
  getPreviousAndNextPost,
} from '@/helpers/get-post-metadata'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { getUrl } from '@app/shared'
import { Button } from '@design-system/react/components/ui/button'
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Linkedin,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'

type PostSocialBar = {
  currentPost: PostMetadata
}

export function PostSocialBar({ currentPost }: PostSocialBar) {
  const { previousPost, nextPost } = getPreviousAndNextPost(
    currentPost.slug,
    currentPost.type,
  )
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  const postUrl = getUrl(`${currentPost.type}/${currentPost.slug}`)

  return (
    <div className="border-t border-black/10 dark:border-white/10 overflow-hidden grid grid-cols-[1fr_3fr] items-center pl-8">
      <div className="space-x-2 hidden md:flex items-center">
        <Button variant="outline" size="icon" asChild>
          <a href={`https://twitter.com/share?url=${postUrl}`} target="_blank">
            <Twitter className="w-4 h-4" />
          </a>
        </Button>

        <Button variant="outline" size="icon" asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`}
            target="_blank"
          >
            <Facebook className="w-4 h-4" />
          </a>
        </Button>

        <Button variant="outline" size="icon" asChild>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`}
            target="_blank"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-2">
        <Link
          href={`/${previousPost.type}/${previousPost.slug}`}
          className="flex flex-col justify-start text-left hover:bg-secondary p-8 border-r border-l border-black/5 dark:border-white/5"
        >
          <strong className="text-sm line-clamp-1">{previousPost.title}</strong>
          <small className="flex items-center justify-start text-sm opacity-60">
            <ArrowLeft className="w-3 h-3 mr-2" />
            {dict.site.sections.posts.postSocialBar.buttons.previous.label}
          </small>
        </Link>
        <Link
          href={`/${nextPost.type}/${nextPost.slug}`}
          className="flex flex-col justify-start hover:bg-secondary p-8"
        >
          <strong className="text-sm line-clamp-1">{nextPost.title}</strong>
          <small className="flex items-center justify-end text-sm opacity-60 w-full text-right">
            {dict.site.sections.posts.postSocialBar.buttons.next.label}
            <ArrowRight className="w-3 h-3 ml-2" />
          </small>
        </Link>
      </div>
    </div>
  )
}
