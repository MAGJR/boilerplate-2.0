type Post = {
  publishedAt: Date | null
}

type StatusConfigEntry = {
  check: boolean
  label: string
  class: string
}

type StatusResult = {
  label: string
  class: string
}

export function determinePostStatus(post: Post): StatusResult | undefined {
  const now = new Date()

  const statusConfig: Record<string, StatusConfigEntry> = {
    draft: {
      check: !post.publishedAt,
      label: 'Draft',
      class: 'bg-secondary border border-border text-white',
    },
    published: {
      check: post.publishedAt < now,
      label: 'Published',
      class: 'bg-green-500 text-white',
    },
    scheduled: {
      check: post.publishedAt > now,
      label: 'Scheduled',
      class: 'bg-indigo-500',
    },
    // Novos status podem ser adicionados aqui
  }

  for (const status of Object.values(statusConfig)) {
    if (status.check) {
      return { label: status.label, class: status.class }
    }
  }

  return undefined // ou algum valor padrão para status desconhecidos
}
