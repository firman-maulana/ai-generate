'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ServicesSection() {
  return (
    <section className="py-14 mt-10 md:py-16 lg:py-24 xl:py-28 overflow-hidden">
      <div className="main-container">
        {/* Heading */}
        <div className="mb-11 lg:mb-9 text-center lg:max-w-[730px] lg:mx-auto">
          <span
            data-ns-animate
            data-delay="0.1"
            className="badge badge-gray-light-v2 mb-5"
          >
            Our Services
          </span>
          <h2 data-ns-animate data-delay="0.2" className="md:mb-3 mb-1">
            Leading companies around the globe rely on NexSaas.
          </h2>
          <p
            data-ns-animate
            data-delay="0.3"
            className="lg:max-w-[530px] lg:mx-auto"
          >
            Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text.
            It's not Latin, though it looks like it
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-12 md:gap-6 gap-y-6">
          <BigServiceCard
            title="Seamless Image Style Transfer"
            desc="Effortlessly transform your images to match any style or mood, from day to night or summer to winter."
            image="/images/ns-img-314.jpg"
            delay="0.1"
          />

          <ServiceCard
            title="Automated Background Replacement"
            desc="Instantly swap backgrounds in your photos for professional results."
            image="/images/ns-img-315.png"
            delay="0.2"
            direction="left"
          />

          <ServiceCard
            title="High-Resolution Upscaling"
            desc="Enhance your images with AI-powered upscaling for sharper and clearer results."
            image="/images/ns-img-317.png"
            delay="0.3"
            direction="right"
          />

          <ServiceCard
            title="Smart Object Removal"
            desc="Remove unwanted objects or distractions with a single click."
            image="/images/ns-img-318.png"
            delay="0.1"
            direction="left"
          />

          <ServiceCard
            title="Color Correction & Enhancement"
            desc="Adjust colors, brightness, and contrast for vibrant images."
            image="/images/ns-img-319.png"
            delay="0.2"
            direction="right"
          />

          <ServiceCard
            title="Batch Image Processing"
            desc="Apply edits to multiple images at once with batch processing."
            image="/images/ns-img-320.png"
            delay="0.1"
            direction="left"
          />

          <ServiceCard
            title="Creative Filters & Effects"
            desc="Apply creative filters and effects for a professional touch."
            image="/images/ns-img-321.png"
            delay="0.2"
            direction="right"
          />

          <BigServiceCard
            title="Seamless Image Style Transfer"
            desc="Effortlessly transform your images to match any style or mood."
            image="/images/ns-img-322.png"
            delay="0.1"
          />
        </div>
      </div>
    </section>
  )
}

/* ================= Components ================= */

function ServiceCard({ title, desc, image, delay, direction }) {
  return (
    <div
      className="col-span-12 group/card-img lg:col-span-6"
      data-ns-animate
      data-delay={delay}
      data-direction={direction}
    >
      <div className="bg-background-12 h-full rounded-3xl border border-background-12 p-5 md:p-8 grid grid-cols-12 md:gap-6 gap-y-16">
        <aside className="pt-14 col-span-12 flex flex-col justify-between space-y-5 md:col-span-6">
          <blockquote className="space-y-2">
            <h3 className="text-heading-5 md:text-heading-4">{title}</h3>
            <p className="text-tagline-1 text-secondary/60">{desc}</p>
          </blockquote>

          <ArrowButton />
        </aside>

        <figure className="h-[360px] md:h-full w-full mx-auto col-span-12 md:col-span-6 overflow-hidden rounded-lg md:rounded-[20px] group-hover/card-img:scale-105 transition-transform duration-500 ease-in-out">
          <Image
            src={image}
            alt={title}
            width={900}
            height={600}
            className="w-full h-full object-cover"
          />
        </figure>
      </div>
    </div>
  )
}

function BigServiceCard({ title, desc, image, delay }) {
  return (
    <div className="col-span-12 group/card-img" data-ns-animate data-delay={delay}>
      <div className="bg-background-12 h-full rounded-4xl border border-background-12 px-5 md:px-8 pt-8 grid grid-cols-12 md:gap-6 gap-y-6">
        <aside className="pt-14 pb-9 col-span-12 md:col-span-5 lg:col-span-3 flex flex-col justify-between space-y-5">
          <blockquote className="space-y-2">
            <h3 className="text-heading-5 md:text-heading-4">{title}</h3>
            <p className="text-tagline-1 text-secondary/60">{desc}</p>
          </blockquote>

          <ArrowButton />
        </aside>

        <figure className="col-span-12 md:col-span-7 lg:col-span-9 overflow-hidden rounded-t-lg md:rounded-t-[20px] group-hover/card-img:scale-105 transition-transform duration-500 ease-in-out">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={700}
            className="w-full h-full object-cover"
          />
        </figure>
      </div>
    </div>
  )
}

function ArrowButton() {
  return (
    <Link
      href="/service-details"
      className="group hover:bg-primary-500 bg-secondary transition-all duration-500 ring-8 ring-white rounded-[40px] w-18 md:w-22 h-10 md:h-13 p-4 md:p-5 flex items-center justify-center overflow-hidden"
    >
      <figure className="size-6 relative overflow-hidden">
        <Image
          src="/images/new-arrow-white.svg"
          alt="arrow"
          width={24}
          height={24}
          className="absolute inset-0 -translate-x-6 group-hover:translate-x-1 transition-transform duration-400 ease-in-out"
        />
        <Image
          src="/images/new-arrow-white.svg"
          alt="arrow"
          width={24}
          height={24}
          className="group-hover:translate-x-6 transition-transform duration-400 ease-in-out"
        />
      </figure>
    </Link>
  )
}