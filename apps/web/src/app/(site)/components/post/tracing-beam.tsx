'use client'

import { cn } from '@design-system/react/helpers/cn'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { scrollYProgress } = useScroll({})

  // track velocity of scroll to increase or decrease distance between svg gradient y coordinates.
  const scrollYProgressVelocity = useVelocity(scrollYProgress)
  const [velo, setVelocity] = React.useState(0)

  const contentRef = useRef<HTMLDivElement>(null)

  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight - 46)
    }
  }, [])
  useEffect(() => {
    return scrollYProgressVelocity.onChange((latestVelocity) => {
      setVelocity(latestVelocity)
    })
  }, [])

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight - velo * 500]),
    {
      stiffness: 500,
      damping: 90,
    },
  )
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - velo * 2000]),
    {
      stiffness: 500,
      damping: 90,
    },
  )

  return (
    <motion.div className={cn('relative w-full h-full', className)}>
      <div className="absolute -left-20 top-3">
        <motion.div
          transition={{
            duration: 0.2,
            delay: 0.5,
          }}
          animate={{
            boxShadow:
              scrollYProgress.get() > 0
                ? 'none'
                : 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
          className="ml-[19px] h-8 w-8 rounded-full border border-netural-200 shadow-sm flex items-center justify-center"
        >
          <motion.div
            transition={{
              duration: 0.2,
              delay: 0.5,
            }}
            animate={{
              backgroundColor:
                scrollYProgress.get() > 0 ? 'white' : 'var(--zinc-500)',
              borderColor:
                scrollYProgress.get() > 0 ? 'white' : 'var(--zinc-600)',
            }}
            className="h-2 w-2 rounded-full border border-neutral-300 bg-white"
          />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight} // Set the SVG height
          className=" ml-4 hidden lg:block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#9091A0"
            strokeOpacity="0.16"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1} // set y1 for gradient
              y2={y2} // set y2 for gradient
            >
              <stop stopColor="#111" stopOpacity="0"></stop>
              <stop stopColor="#222"></stop>
              <stop offset="0.325" stopColor="#333"></stop>
              <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  )
}
