const testimonials = [
  {
    name: "Darrell Steward",
    avatar: "/images/ns-avatar-4.png",
    twitter: "https://x.com",
    text: "As a small business owner, your service has been a lifesaver in managing cash flow and optimizing financial strategies.",
    delay: "0.2",
  },
  {
    name: "Sarah Johnson",
    avatar: "/images/ns-avatar-5.png",
    twitter: "https://x.com",
    text: "The voice duplication feature is absolutely incredible! I've created professional voiceovers in minutes.",
    delay: "0.3",
  },
  {
    name: "Michael Chen",
    avatar: "/images/ns-avatar-6.png",
    twitter: "https://x.com",
    text: "This technology has revolutionized our podcast production. The quality is unbelievably realistic.",
    delay: "0.4",
  },
];

const Star = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-[15px]"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M7.25672 0.486272C7.53172 -0.162091 8.46832 -0.162091 8.74332 0.486274L10.3663 4.31303C10.4823 4.58637 10.7445 4.77313 11.0454 4.79678L15.2582 5.12799C15.9719 5.18411 16.2614 6.05763 15.7175 6.51446L12.5079 9.2107C12.2786 9.40331 12.1784 9.70552 12.2485 9.99343L13.2291 14.0249C13.3952 14.7079 12.6375 15.2478 12.0264 14.8818L8.41965 12.7214C8.16202 12.5671 7.83802 12.5671 7.5804 12.7214L3.9736 14.8818C3.3625 15.2478 2.60477 14.7079 2.77091 14.0249L3.75155 9.99343C3.82159 9.70552 3.72147 9.40331 3.49221 9.2107L0.28245 6.51446C-0.261375 6.05763 0.0280544 5.18411 0.741835 5.12799L4.9547 4.79678C5.25561 4.77313 5.51774 4.58637 5.63367 4.31303L7.25672 0.486272Z"
      fill="#864FFE"
    />
  </svg>
);

export default function Testimonials() {
  return (
    <section
      className="2xl:pt-28 pt-14 sm:pt-16 md:pt-24 2xl:pb-44 pb-20"
      aria-label="Customer testimonials"
    >
      <div className="main-container">
        <div className="text-center mb-14">
          <span className="badge badge-green-v2 mb-4 inline-block">
            Testimonials
          </span>
          <h2 className="xl:max-w-[906px] mx-auto">
            User stories: find out why so many people love our themes!
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <article
              key={i}
              data-ns-animate
              data-delay={item.delay}
              className="bg-white border border-stroke-1 rounded-[20px] p-6 sm:p-8"
            >
              <div className="flex items-center justify-between pb-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} />
                  ))}
                </div>

                <a
                  href={item.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${item.name} on X`}
                >
                  <img src="/images/x-icon.svg" alt="X icon" width={24} />
                </a>
              </div>

              <p className="pb-6">{item.text}</p>

              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={`${item.name} avatar`}
                  className="size-11 rounded-full object-cover"
                />
                <h3 className="font-semibold">{item.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}