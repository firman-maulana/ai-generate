'use client'

import Image from 'next/image'

export default function Features() {
  return (
    <section className="max-[1920px]:px-5">
      <div className="bg-background-12 mx-auto max-w-[1880px] rounded-3xl py-20 lg:rounded-4xl lg:py-30 xl:py-39">
        <div className="main-container">
          {/* Heading */}
          <div className="mb-10 space-y-4 text-center md:mb-14 lg:mx-auto lg:max-w-[740px]">
            <span
              data-ns-animate
              data-delay="0.1"
              className="badge badge-white text-secondary font-medium"
            >
              Feature
            </span>
            <h2 data-ns-animate data-delay="0.2">
              Robust features that enhance your mobile experience.
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-12 gap-y-10 md:gap-x-8">
            {/* Feature 1 */}
            <div className="col-span-12 md:col-span-6" data-ns-animate data-delay="0.3">
              <div className="relative h-full min-h-[450px] overflow-hidden rounded-[20px] bg-white sm:min-h-[780px] md:min-h-[720px] lg:p-10.5">
                <div
                  data-ns-animate
                  data-delay="0.3"
                  className="absolute bottom-0 left-0 z-10 h-[480px] w-full bg-(image:--color-gradient-11) blur-[2px] md:bottom-20 lg:bottom-0"
                />

                <figure
                  data-ns-animate
                  data-delay="0.4"
                  className="absolute right-0 bottom-2 md:bottom-40 lg:bottom-20 xl:bottom-2"
                >
                  <Image
                    src="/images/ns-img-310.png"
                    alt="Duplicate the voice"
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </figure>

                <div
                  data-ns-animate
                  data-delay="0.4"
                  data-instant
                  className="absolute right-10.5 bottom-10.5 left-6 z-20 sm:left-10.5 md:left-6 xl:left-10.5"
                >
                  <h3 className="text-heading-6 md:text-heading-5">Duplicate the voice</h3>
                  <p className="max-w-[450px]">
                    Each Nexsas applies an activation function to the weighted sum of its inputs to
                    generate an output.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-span-12 space-y-8 md:col-span-6">
              {/* Voice marquee */}
              <div
                className="space-y-6 rounded-[20px] bg-white p-5 sm:p-8 md:p-5 xl:p-8"
                data-ns-animate
                data-delay="0.4"
              >
                <div className="bg-background-12 space-y-7 rounded-2xl pt-[25px] pb-[27px]">
                  <aside className="logos-marquee-container">
                    <VoiceRow
                      avatars={[
                        '15',
                        '16',
                        '17',
                        '18',
                      ]}
                    />
                  </aside>

                  <aside className="logos-right-marquee-container">
                    <VoiceRow
                      avatars={[
                        '19',
                        '1',
                        '2',
                        '3',
                      ]}
                    />
                  </aside>
                </div>

                <div data-ns-animate data-delay="0.4" className="max-md:space-y-0.5">
                  <h3 className="text-heading-6 md:text-heading-5">
                    Create a voiceover for your video.
                  </h3>
                  <p className="max-w-[450px]">
                    A Nexsas network consists of nodes called Nexsas that are interconnected.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                className="space-y-8 rounded-[20px] bg-white p-5 sm:p-8 md:p-5 xl:p-8"
                data-ns-animate
                data-delay="0.2"
              >
                <div className="flex items-center justify-center -space-x-12">
                  {['311', '312', '313'].map((img, i) => (
                    <figure
                      key={img}
                      className={`w-full max-w-[214px] overflow-hidden rounded-b-[15px] ${
                        i === 0
                          ? 'rotate-[12deg] shadow-13'
                          : i === 2
                          ? '-rotate-[12deg] shadow-13'
                          : 'relative z-10'
                      }`}
                    >
                      <Image
                        src={`/images/ns-img-${img}.png`}
                        alt="Completed file"
                        width={214}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  ))}
                </div>

                <div data-ns-animate data-delay="0.1" className="relative z-20">
                  <h3 className="text-heading-6 md:text-heading-5">
                    Get your completed files.
                  </h3>
                  <p className="max-w-[450px]">
                    The inputs are multiplied by their respective weights, summed, and then passed
                    through the activation function.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== Helper ===== */

function VoiceRow({ avatars }) {
  return (
    <div className="flex items-center gap-x-7">
      {avatars.map((id, index) => (
        <div
          key={id}
          className={`inline-flex w-full max-w-[168px] min-w-[168px] items-center gap-x-3 rounded-[300px] bg-white p-1 ${
            index === 0 ? 'ml-7' : ''
          }`}
        >
          <figure className="size-14 overflow-hidden rounded-[300px]">
            <Image
              src={`/images/ns-avatar-${id}.png`}
              alt={`Voice ${index + 1}`}
              width={56}
              height={56}
              className="size-full object-cover"
            />
          </figure>
          <span className="text-it-heading-6 text-secondary font-normal">
            Voice-{String(index + 1).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  )
}