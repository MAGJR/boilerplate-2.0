import fs from 'fs'
import matter from 'gray-matter'

export type PostType = 'changelog' | 'blog'

export type PostMetadata = {
  title: string
  date: string
  type: PostType
  subtitle: string
  cover: string
  slug: string
  excerpt?: string
  content?: string
}

export const getPostMetadata = (type: PostType): PostMetadata[] => {
  const folder = `src/posts/${type}`
  const files = fs.readdirSync(folder)
  const markdownPosts = files.filter((file) => file.endsWith('.md'))

  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`${folder}/${fileName}`, 'utf8')
    const matterResult = matter(fileContents)
    return {
      title: matterResult.data.title,
      type,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      cover: matterResult.data.cover,
      slug: fileName.replace('.md', ''),
      excerpt: matterResult.content.slice(0, 300),
    }
  })

  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return posts
}

export const getPostContent = (slug: string, type: PostType): PostMetadata => {
  const folder = `src/posts/${type}`
  const file = `${folder}/${slug}.md`
  const content = fs.readFileSync(file, 'utf8')
  const matterResult = matter(content)

  return {
    title: matterResult.data.title,
    slug,
    type,
    cover: matterResult.data.cover,
    date: matterResult.data.date,
    subtitle: matterResult.data.subtitle,
    content: matterResult.content,
    excerpt: matterResult.content.slice(0, 300),
  }
}

export const getPreviousAndNextPost = (
  slug: string,
  type: PostType,
): {
  previousPost: PostMetadata
  nextPost: PostMetadata
} => {
  const posts = getPostMetadata(type)

  const previousPost =
    posts.find((post, index) => {
      return post.slug === slug && posts[index - 1]
    }) || posts[Math.floor(Math.random() * posts.length)]
  const nextPost =
    posts.find((post, index) => {
      return post.slug === slug && posts[index + 1]
    }) ||
    posts.find((post) => post.slug !== slug) ||
    posts[Math.floor(Math.random() * posts.length)]

  return {
    previousPost,
    nextPost,
  }
}
