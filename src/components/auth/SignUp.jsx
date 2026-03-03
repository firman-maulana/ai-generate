'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignUp() {
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const username = e.target.username.value.trim()
    const email = e.target.email.value.trim()
    const password = e.target.password.value
    const confirmPassword = e.target['confirm-password'].value

    // Validasi
    const newErrors = {}
    if (!username) {
      newErrors.username = "Username harus diisi"
    }
    if (!email) {
      newErrors.email = "Email harus diisi"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid"
    }
    if (!password) {
      newErrors.password = "Password harus diisi"
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter"
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    setIsLoading(false)

    if (res.ok) {
      alert("Registrasi berhasil! Silakan login.")
      router.push("/signin")
    } else {
      const data = await res.json()
      alert(data.detail || "Gagal daftar")
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/chat" })
  }

  const handleFacebookSignIn = async () => {
    setIsLoading(true)
    await signIn("facebook", { callbackUrl: "/chat" })
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
              htmlFor="username"
              className="block text-tagline-2 font-medium text-secondary dark:text-accent select-none"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="auth-form-input"
              placeholder="Your unique identifier"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </fieldset>
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
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </fieldset>
          <fieldset className="space-y-2 mb-3">
            <label
              htmlFor="confirm-password"
              className="block text-tagline-2 font-medium text-secondary dark:text-accent select-none"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="auth-form-input"
              placeholder="Re-enter your password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </fieldset>
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-md hover:btn-secondary dark:hover:btn-accent btn-primary w-full before:content-none first-letter:uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Sign up"}
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
            <button 
              className="flex items-center justify-center gap-2 w-full border border-stroke-3 dark:border-stroke-7 py-3 px-8 rounded-full cursor-pointer group transition-colors duration-500 ease-in-out hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
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
            <button 
              className="flex items-center justify-center gap-2 w-full border border-stroke-3 dark:border-stroke-7 py-3 px-8 rounded-full cursor-pointer group transition-colors duration-500 ease-in-out hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleFacebookSignIn}
              disabled={isLoading}
            >
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