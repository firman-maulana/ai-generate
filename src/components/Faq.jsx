'use client'

export default function FaqSection() {
  return (
    <section className="max-[1920px]:px-5">
  <div
    className="bg-background-12 max-w-[1880px] mx-auto lg:py-25 md:py-20 py-18 xl:py-28 rounded-2xl md:rounded-4xl"
    data-ns-animate
    data-delay="0.1"
  >
    <div className="main-container">
      <div className="text-center space-y-3 md:space-y-5 max-w-[720px] mx-auto lg:mb-[70px] mb-12">
        <span
          data-ns-animate
          data-delay="0.2"
          className="badge badge-white-v2 uppercase"
        >
          FAQ
        </span>

        <div className="space-y-3">
          <h2 data-ns-animate data-delay="0.3">
            All the essential information you need to understand.
          </h2>
          <p data-ns-animate data-delay="0.4">
            By offering concise and informative responses, this section helps users find solutions
            without the need to contact customer support, saving time
          </p>
        </div>
      </div>

      <div className="accordion max-w-[770px] mx-auto space-y-4">
        {/* Item 1 */}
        <div className="accordion-item active-accordion bg-white rounded-2xl md:rounded-4xl px-6 md:px-8">
          <button className="accordion-action flex items-center cursor-pointer justify-between py-6 md:py-8 w-full">
            <span className="flex-1 text-left lg:text-heading-6 text-tagline-1 font-normal text-secondary">
              What is Artificial Intelligence?
            </span>

            <span className="accordion-arrow ml-2.5 block sm:ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  className="stroke-secondary dark:stroke-accent"
                />
              </svg>
            </span>
          </button>

          <div className="accordion-content">
            <div className="border-t border-t-stroke-2 pt-6 pb-8">
              <p>
                Artificial Intelligence (AI) refers to computer systems that can perform tasks
                typically requiring human intelligence, such as learning, reasoning, problem-solving,
                and decision-making.
              </p>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="accordion-item bg-white rounded-2xl md:rounded-4xl px-6 md:px-8">
          <button className="accordion-action flex items-center cursor-pointer justify-between py-6 md:py-8 w-full">
            <span className="flex-1 text-left lg:text-heading-6 text-tagline-1 font-normal text-secondary">
              How is Machine Learning connected to Artificial Intelligence?
            </span>

            <span className="accordion-arrow ml-2.5 block sm:ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  className="stroke-secondary dark:stroke-accent"
                />
              </svg>
            </span>
          </button>

          <div className="accordion-content">
            <div className="border-t border-t-stroke-2 pt-6 pb-8">
              <p>
                Machine Learning is a subset of AI that enables computers to learn and improve from
                experience without being explicitly programmed.
              </p>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="accordion-item bg-white rounded-2xl md:rounded-4xl px-6 md:px-8">
          <button className="accordion-action flex items-center cursor-pointer justify-between py-6 md:py-8 w-full">
            <span className="flex-1 text-left lg:text-heading-6 text-tagline-1 font-normal text-secondary">
              Is Artificial Intelligence taking over human jobs?
            </span>

            <span className="accordion-arrow ml-2.5 block sm:ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  className="stroke-secondary dark:stroke-accent"
                />
              </svg>
            </span>
          </button>

          <div className="accordion-content">
            <div className="border-t border-t-stroke-2 pt-6 pb-8">
              <p>
                While AI is automating certain tasks, it's more accurate to say it's transforming jobs
                rather than eliminating them.
              </p>
            </div>
          </div>
        </div>

        {/* Item 4 */}
        <div className="accordion-item bg-white rounded-2xl md:rounded-4xl px-6 md:px-8">
          <button className="accordion-action flex items-center cursor-pointer justify-between py-6 md:py-8 w-full">
            <span className="flex-1 text-left lg:text-heading-6 text-tagline-1 font-normal text-secondary">
              What are the various types of Artificial Intelligence?
            </span>

            <span className="accordion-arrow ml-2.5 block sm:ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  className="stroke-secondary dark:stroke-accent"
                />
              </svg>
            </span>
          </button>

          <div className="accordion-content">
            <div className="border-t border-t-stroke-2 pt-6 pb-8">
              <p>
                AI can be categorized into Narrow AI, General AI, and Super AI. Currently, we only
                have Narrow AI.
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