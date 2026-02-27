'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 lg:py-34 xl:py-39">
      <div className="main-container">
        {/* Heading */}
        <div className="mb-10 text-center md:mb-11 lg:mx-auto lg:max-w-[730px]">
          <span
            data-ns-animate
            data-delay="0.1"
            className="badge badge-gray-light-v2 mb-4"
          >
            How It Work
          </span>
          <h2 data-ns-animate data-delay="0.2" className="mb-3">
            Generate AI Speech with Nexsas
          </h2>
          <p data-ns-animate data-delay="0.3">
            Turn text into natural, human-like voices instantly with powerful AI speech technology.
          </p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col items-center justify-center gap-8 max-lg:flex-wrap sm:flex-row">
          <Step
            delay="0.4"
            bg="bg-ns-green"
            shape="ns-shape-3"
            title="Multiple voice options."
            desc="Choose from a wide range of male and female voices to match your brand’s style."
          />

          <Arrow delay="0.5" left />

          <Step
            delay="0.7"
            bg="bg-background-3"
            shape="ns-shape-2"
            title="Realistic & clear audio"
            desc="Deliver lifelike speech that feels authentic and engaging for your audience."
          />

          <Arrow delay="0.8" />

          <Step
            delay="1"
            bg="bg-ns-green"
            shape="ns-shape-8"
            title="Fast & easy conversion."
            desc="Convert your text into speech within seconds — no technical skills required."
          />
        </div>

        {/* CTA */}
        <div data-ns-animate data-delay="0.5" className="mt-14 text-center">
          <div className="group/btn-v2 mx-auto inline-block w-[85%] rounded-full transition-transform duration-500 ease-in-out md:w-auto">
            <Link
              href="/pricing"
              className="btn-xl-v2 btn-secondary-v2 group-hover/btn-v2:btn-primary-v2 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full font-medium lowercase transition-all duration-500 ease-in-out md:h-auto md:w-auto"
            >
              <span className="first-letter:uppercase">
                Generate Voice
              </span>

              <div className="relative size-6 overflow-hidden">
                <ButtonIcon from="-translate-x-6" to="translate-x-1" />
                <ButtonIcon from="-translate-x-2" to="translate-x-6" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================== Helpers ================== */

function Step({ delay, bg, shape, title, desc }) {
  return (
    <div
      data-ns-animate
      data-delay={delay}
      data-direction="left"
      data-offset="80"
      className={`${bg} flex w-full max-w-[408px] flex-col justify-between rounded-[20px] p-11 max-sm:space-y-8 sm:min-h-[350px]`}
    >
      <div className="text-center">
        <span className={`${shape} text-secondary text-[52px]`} />
      </div>
      <div className="space-y-1 text-center max-md:space-y-0.5">
        <h3 className="text-heading-6 md:text-heading-5">{title}</h3>
        <p className="text-tagline-1 text-secondary/60">{desc}</p>
      </div>
    </div>
  )
}

function Arrow({ delay, left }) {
  return (
    <div
      data-ns-animate
      data-delay={delay}
      data-direction="left"
      data-offset="100"
      data-duration="0.6"
      className={`bg-background-3 absolute top-1/2 z-10 hidden w-full max-w-[52px] -translate-y-1/2 overflow-hidden rounded-[80px] px-4 py-9 ring-8 ring-white lg:inline-block ${
        left ? 'left-[31%]' : 'right-[31%]'
      }`}
    >
      <div className="icon-right-marquee-container size-6 overflow-hidden">
        <figure className="flex size-6 items-center justify-center">
          <Image
            src="/images/icons/new-arrow.svg"
            alt="arrow"
            width={24}
            height={24}
          />
          <Image
            src="/images/icons/new-arrow.svg"
            alt="arrow"
            width={24}
            height={24}
          />
        </figure>
      </div>
    </div>
  )
}

function ButtonIcon({ from, to }) {
  return (
    <span
      className={`btn-v2-icon absolute inset-0 size-6 ${from} transition-all duration-300 ease-in-out group-hover/btn-v2:${to}`}
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