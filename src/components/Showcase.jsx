'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ShowcaseSection() {
  return (
    <section className="py-16 lg:py-20 xl:py-25">
      <div className="main-container">
        {/* Heading */}
        <div className="text-center mb-10 lg:mb-[70px]">
          <div className="space-y-3">
            <h2 data-ns-animate data-delay="0.1">
              Experience the power of our platform.
            </h2>
            <p
              data-ns-animate
              data-delay="0.2"
              className="max-w-[680px] mx-auto"
            >
              Our platform is crafted with a clean, user-friendly interface that ensures effortless
              navigation while delivering powerful capabilities under the hood.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-y-14 lg:gap-x-14 mb-14">
          <ShowcaseItem
            col="col-span-12"
            delay="0.3"
            image="/images/ns-img-323.png"
            title="AI-powered patient care solutions in healthcare."
            desc="Empowering healthcare providers with smart, scalable solutions."
          />

          <ShowcaseItem
            col="col-span-12 lg:col-span-6"
            delay="0.1"
            image="/images/ns-img-324.png"
            title="Retail analytics for better insights"
            desc="Understand shopper behavior and drive data-led decisions."
          />

          <ShowcaseItem
            col="col-span-12 lg:col-span-6"
            delay="0.2"
            image="/images/ns-img-325.png"
            title="Risk management tools for finance sectors"
            desc="Identify, assess, and mitigate financial risk with confidence."
          />

          <ShowcaseItem
            col="col-span-12"
            delay="0.1"
            image="/images/ns-img-326.png"
            title="Proven results with measurable outcomes"
            desc="Evidence-based outcomes that speak for themselves."
          />
        </div>

        {/* CTA */}
        <div data-ns-animate data-delay="0.2" className="text-center">
          <PrimaryButton href="/case-study" variant="secondary">
            See all projects
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}

/* ================= COMPONENTS ================= */

function ShowcaseItem({ col, delay, image, title, desc }) {
  return (
    <div className={col} data-ns-animate data-delay={delay}>
      <figure className="space-y-6">
        <div className="relative w-full h-[300px] lg:h-[802px] rounded-[20px] overflow-hidden group cursor-pointer">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-[20px] transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />

          {/* Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%-8px)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-1/2 transition-all duration-500 ease-out">
            <PrimaryButton href="/case-study-details">
              View details
            </PrimaryButton>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:justify-between">
          <h3 className="text-heading-6 sm:text-heading-5">{title}</h3>
          <p className="max-w-[257px] text-left md:text-right">{desc}</p>
        </div>
      </figure>
    </div>
  )
}

function PrimaryButton({ href, children, variant = 'primary' }) {
  const variantClass =
    variant === 'secondary' ? 'btn-secondary-v2' : 'btn-green-v2'

  return (
    <div className="group/btn-v2 inline-block w-[85%] md:w-auto rounded-full transition-transform duration-500">
      <Link
        href={href}
        className={`btn-xl-v2 ${variantClass} group-hover/btn-v2:btn-primary-v2 inline-flex h-12 md:h-auto w-full md:w-auto items-center justify-center gap-1.5 rounded-full font-medium lowercase transition-all duration-500`}
      >
        <span className="first-letter:uppercase">{children}</span>

        <div className="relative size-6 overflow-hidden">
          <Icon translate="-translate-x-6 group-hover/btn-v2:translate-x-1" />
          <Icon translate="-translate-x-2 group-hover/btn-v2:translate-x-6" />
        </div>
      </Link>
    </div>
  )
}

function Icon({ translate }) {
  return (
    <span
      className={`absolute inset-0 size-6 transition-all duration-300 ease-in-out ${translate}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M11 5H13V7H11V5Z" />
        <path d="M5 5H7V7H5V5Z" />
        <path d="M14 8H16V10H14V8Z" />
        <path d="M8 8H10V10H8V8Z" />
        <path d="M17 11H19V13H17V11Z" />
        <path d="M11 11H13V13H11V11Z" />
        <path d="M14 14H16V16H14V14Z" />
        <path d="M8 14H10V16H8V14Z" />
        <path d="M11 17H13V19H11V17Z" />
        <path d="M5 17H7V19H5V17Z" />
      </svg>
    </span>
  )
}