'use client'

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
  return (
    <section>
      <div className="relative" data-ns-animate data-delay="0.2">
        {/* Gradient overlay left */}
        <div className="absolute left-0 top-0 h-full w-[15%] md:w-[20%] bg-gradient-to-r from-white to-transparent dark:from-background-5 z-40" />

        {/* Gradient overlay right */}
        <div className="absolute right-0 top-0 h-full w-[15%] md:w-[20%] bg-gradient-to-l from-white to-transparent dark:from-background-5 z-40" />

        {/* Marquee */}
        <div className="logos-marquee-container" role="marquee">
          <div className="flex items-center gap-8 justify-center py-7.5">
            {logos.map((logo, index) => (
              <figure
                key={index}
                className={`min-w-[140px] md:min-w-[201px] ${
                  index === 0 ? 'ml-8' : ''
                }`}
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