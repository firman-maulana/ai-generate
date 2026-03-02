'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const logos = [
  {
    light: '/images/client-logo-6.svg',
    dark: '/images/client-logo-6-dark.svg',
    alt: 'Client 1 logo',
  },
  {
    light: '/images/client-logo-7.svg',
    dark: '/images/client-logo-7-dark.svg',
    alt: 'Client 2 logo',
  },
  {
    light: '/images/client-logo-8.svg',
    dark: '/images/client-logo-8-dark.svg',
    alt: 'Client 3 logo',
  },
  {
    light: '/images/client-logo-9.svg',
    dark: '/images/client-logo-9-dark.svg',
    alt: 'Client 4 logo',
  },
  {
    light: '/images/client-logo-10.svg',
    dark: '/images/client-logo-10-dark.svg',
    alt: 'Client 5 logo',
  },
]

export default function ClientLogos() {
  const marqueeRef = useRef(null)

  useEffect(() => {
    const initMarquee = () => {
      if (typeof window.InfiniteMarquee === 'undefined') {
        setTimeout(initMarquee, 100)
        return
      }

      const container = marqueeRef.current
      if (container && !container.classList.contains('marquee-initialized')) {
        try {
          new window.InfiniteMarquee({
            element: container,
            speed: 100000,
            smoothEdges: true,
            direction: 'left',
            gap: '32px'
          })
          container.classList.add('marquee-initialized')
        } catch (error) {
          console.error('Marquee initialization error:', error)
        }
      }
    }

    setTimeout(initMarquee, 800)
  }, [])

  // Duplikasi logos untuk seamless scrolling
  const allLogos = [...logos, ...logos, ...logos]

  return (
    <section>
      <div className="relative" data-ns-animate data-delay="0.2">
        {/* Gradient overlay left */}
        <div className="absolute left-0 top-0 h-full w-[15%] md:w-[20%] bg-gradient-to-r from-white to-transparent dark:from-background-5 z-40 pointer-events-none" />

        {/* Gradient overlay right */}
        <div className="absolute right-0 top-0 h-full w-[15%] md:w-[20%] bg-gradient-to-l from-white to-transparent dark:from-background-5 z-40 pointer-events-none" />

        {/* Marquee */}
        <div ref={marqueeRef} className="logos-marquee-container overflow-hidden" role="marquee">
          <div className="flex items-center gap-8 py-7.5">
            {allLogos.map((logo, index) => (
              <figure
                key={index}
                className="min-w-[140px] md:min-w-[201px] flex-shrink-0"
              >
                {/* Light */}
                <Image
                  src={logo.light}
                  alt={logo.alt}
                  width={201}
                  height={80}
                  loading="lazy"
                  className="dark:hidden"
                />

                {/* Dark */}
                <Image
                  src={logo.dark}
                  alt={logo.alt}
                  width={201}
                  height={80}
                  loading="lazy"
                  className="hidden dark:inline-block"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}