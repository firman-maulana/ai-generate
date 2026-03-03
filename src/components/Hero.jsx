'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-14 md:pt-14 lg:pt-16 max-[1920px]:px-5">
      <div className="bg-background-12 max-w-[1880px] mx-auto relative pt-20 -mb-2 md:pt-30 border overflow-hidden border-background-12 rounded-3xl xl:rounded-4xl">
        {/* Decorative lines */}
        <div
          data-ns-animate
          data-delay="0.3"
          data-instant
          data-direction="up"
          className="hidden md:block absolute w-full h-full top-0 left-0 before:content-[''] before:absolute before:left-[7%] 2xl:before:left-[16%] before:z-10 before:w-px before:h-full before:bg-stroke-3 before:top-0 after:content-[''] after:absolute after:right-[7%] 2xl:after:right-[16%] after:z-10 after:w-px after:h-full after:bg-stroke-3 after:top-0 z-10"
        >
          <div className="absolute w-full h-px bg-stroke-3 top-[44%] xl:top-[43%] before:absolute before:content-[''] before:size-3 before:bg-white before:drop-shadow-[0,1px,2px,#AFB9C6] before:left-[6.3%] 2xl:before:left-[15.7%] before:z-20 before:-top-2 before:ring-6 before:ring-stroke-3 before:rounded-full after:absolute after:content-[''] after:size-3 after:bg-white after:ring-6 after:ring-stroke-3 after:right-[6.3%] 2xl:after:right-[15.7%] after:z-20 after:-top-[7px] after:drop-shadow-[0,1px,2px,#AFB9C6] after:rounded-full" />
        </div>

        <div className="main-container relative z-30">
          {/* Text */}
          <div className="text-center mb-12 lg:mb-20 xl:mb-33">
            <h1
              className="font-medium mb-3 opacity-0"
              data-ns-animate
              data-instant
              data-delay="0.1"
            >
              Using AI applications to boost
              <br className="hidden md:block" />
              business success.
            </h1>

            <p
              className="max-w-[750px] mx-auto mb-7 md:mb-14"
              data-ns-animate
              data-instant
              data-delay="0.2"
            >
              Our startup development services aim to fast-track your path from idea to launch,
              equipping you with the technical skills and strategic insights essential for success.
            </p>

            {/* Buttons */}
            <div className="flex md:flex-row flex-col gap-y-3 md:gap-y-0 items-center justify-center gap-x-4">
              {/* Discover */}
              <div
                data-ns-animate
                data-delay="0.4"
                data-direction="left"
                data-offset="50"
                data-instant
                className="w-[90%] md:w-auto"
              >
                <div className="group/btn-v2 mx-auto inline-block w-[85%] rounded-full transition-transform duration-500 ease-in-out md:mx-0 md:w-auto">
                  <Link
                    href="/services"
                    className="btn-xl-v2 btn-secondary-v2 group-hover/btn-v2:btn-primary-v2 mx-auto inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full text-center font-medium lowercase transition-all duration-500 ease-in-out md:h-auto md:w-auto"
                  >
                    <span className="inline-block transition-transform duration-300 ease-in-out first-letter:uppercase">
                      Discover
                    </span>
                    {IconSwap()}
                  </Link>
                </div>
              </div>

              {/* Get Started */}
              <div
                data-ns-animate
                data-delay="0.5"
                data-direction="left"
                data-offset="50"
                data-instant
                className="w-[90%] md:w-auto"
              >
                <div className="group/btn-v2 mx-auto inline-block w-[85%] rounded-full transition-transform duration-500 ease-in-out md:mx-0 md:w-auto">
                  <Link
                    href="/signin"
                    className="btn-xl-v2 btn-gray-v2 group-hover/btn-v2:btn-secondary-v2 mx-auto inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full text-center font-medium lowercase transition-all duration-500 ease-in-out md:h-auto md:w-auto"
                  >
                    <span className="inline-block transition-transform duration-300 ease-in-out first-letter:uppercase">
                      Get started
                    </span>
                    {IconSwap()}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Banner */}
          <figure
            data-ns-animate
            data-delay="0.4"
            data-instant
            className="max-w-[620px] -mb-3 lg:max-w-[840px] xl:max-w-[1000px] 2xl:max-w-[1016px] min-[1800px]:!max-w-[1166px] mx-auto"
          >
            <Image
              src="/images/ns-img-327.png"
              alt="Hero banner"
              width={1200}
              height={700}
              className="w-full h-full object-cover"
              priority
            />
          </figure>
        </div>
      </div>
    </section>
  )
}

/* Reusable icon animation */
function IconSwap() {
  return (
    <div className="relative size-6 overflow-hidden">
      <span className="btn-v2-icon absolute inset-0 size-6 -translate-x-6 transition-all duration-300 ease-in-out group-hover/btn-v2:translate-x-1">
        <GridIcon />
      </span>
      <span className="btn-v2-icon absolute size-6 -translate-x-2 transition-all duration-300 ease-in-out group-hover/btn-v2:translate-x-6">
        <GridIcon />
      </span>
    </div>
  )
}

function GridIcon() {
  return (
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
  )
}