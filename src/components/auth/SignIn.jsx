'use client'

import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push('/chat')
  }

  const handleCreateAccount = () => {
    router.push('/signup')
  }

  return (
<section className="lg:pt-[180px] pt-[120px] lg:pb-[100px] pb-[70px] bg-background-12">
  <div className="main-container">
    <div
      data-ns-animate=""
      data-delay="0.1"
      className="max-w-[866px] w-full mx-auto overflow-hidden sm:bg-[url('/images/ns-img-375.jpg')] bg-cover bg-center bg-no-repeat md:rounded-4xl rounded-[20px] sm:p-[70px]"
    >
      <div
        data-ns-animate=""
        data-delay="0.1"
        className="max-w-[400px] bg-background-1 dark:bg-background-6 rounded-[20px] py-14 px-8"
      >
        <form onSubmit={handleSubmit}>
          <fieldset className="space-y-2 mb-4">
            <label
              htmlFor="email"
              className="block text-tagline-2 font-medium text-secondary dark:text-accent select-none"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="auth-form-input"
              placeholder="Email address"
            />
          </fieldset>
          <fieldset className="space-y-2 mb-4">
            <label
              htmlFor="password"
              className="block text-tagline-2 font-medium text-secondary dark:text-accent select-none"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="auth-form-input"
              placeholder="At least 8 characters"
            />
          </fieldset>
          <div className="mt-8">
            <button
              type="submit"
              className="btn btn-md hover:btn-secondary dark:hover:btn-accent btn-primary w-full before:content-none first-letter:uppercase"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="py-8 text-center">
          <p className="text-tagline-2 font-normal text-secondary dark:text-accent">
            Or
          </p>
        </div>
        <div>
          <div className="space-y-4">
            <button onClick={handleCreateAccount} type="button" className="flex items-center justify-center gap-2 w-full border border-stroke-3 dark:border-stroke-7 py-3 px-8 rounded-full cursor-pointer group transition-colors duration-500 ease-in-out hover:bg-primary-500">
              <span className="text-tagline-2 font-medium text-secondary dark:text-accent group-hover:text-accent transition-colors duration-500 ease-in-out">
                Create an account
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 w-full border border-stroke-3 dark:border-stroke-7 py-3 px-8 rounded-full cursor-pointer group transition-colors duration-500 ease-in-out hover:bg-primary-500">
              <span className="size-6 block">
                <img
                  src="/images/google.svg"
                  alt="google"
                  className="size-full"
                />
              </span>
              <span className="text-tagline-2 font-medium text-secondary dark:text-accent group-hover:text-accent transition-colors duration-500 ease-in-out">
                Continue with Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 w-full border border-stroke-3 dark:border-stroke-7 py-3 px-8 rounded-full cursor-pointer group transition-colors duration-500 ease-in-out hover:bg-primary-500">
              <span className="size-6 block">
                <img
                  src="/images/facebook-v2.svg"
                  alt="facebook"
                  className="size-full"
                />
              </span>
              <span className="text-tagline-2 font-medium text-secondary dark:text-accent group-hover:text-accent transition-colors duration-500 ease-in-out">
                Continue with facebook
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}