'use client'

import { useDictionary } from '@/services/internationalization/hooks/dictionary.hook'
import { Button } from '@design-system/react/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface Feature {
  cover: string
  title: string
  description: string
  link?: {
    title: string
    href: string
  }
}

export function MorePossibilitiesSection() {
  const { dict } = useDictionary()

  const features = dict.site.sections.morePossibilities.main
    .features as Feature[]

  return (
    <section className="py-16 bg-gradient-to-b from-card/30 to-background">
      <div className="container max-w-screen-xl mx-auto px-4">
        <SectionHeader dict={dict} />
        <FeatureGrid features={features} />
      </div>
    </section>
  )
}

function SectionHeader({ dict }) {
  return (
    <header className="mb-12">
      <h2 className="text-3xl font-normal md:max-w-[30%] mb-4">
        {dict.site.sections.morePossibilities.header.title}
      </h2>
      <p className="opacity-80 text-lg max-w-[70%]">
        {dict.site.sections.morePossibilities.header.description}
      </p>
    </header>
  )
}

function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-8">
      {features.map((feature, index) => (
        <FeatureItem key={index} {...feature} />
      ))}
    </div>
  )
}

function FeatureItem({ cover, title, description, link }: Feature) {
  return (
    <div className="grid grid-cols-2 overflow-hidden flex items-center bg-secondary rounded-lg">
      <div className="p-12">
        <h4 className="mb-2 font-bold">{title}</h4>
        <p className="opacity-80">{description}</p>

        {link && (
          <Button asChild className="mt-16">
            <Link href={link.href}>{link.title}</Link>
          </Button>
        )}
      </div>
      <div>
        <Image
          src={cover}
          alt={title}
          className="h-[full] w-full object-cover"
          width={468}
          height={468}
        />
      </div>
    </div>
  )
}
