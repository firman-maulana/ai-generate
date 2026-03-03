"use client"

import Script from "next/script";

import AnimationInit from "@/components/AnimationInit";
import Header from "@/components/Header";
import SignUp from "@/components/auth/SignUp"
import CtaSection from "@/components/auth/CTASection";
import Footer from "@/components/Footer";

export default function SignUpPage() {
    return (
    <>
      <AnimationInit />
      <main>
        <Header />
        <SignUp />
        <CtaSection />
        <Footer />
      </main>

      {/* ===== TEMPLATE JS DEPENDENCIES ===== */}
      <Script src="/js/gsap.min.js" strategy="beforeInteractive" />
      <Script src="/js/scroll-trigger.min.js" strategy="beforeInteractive" />
      <Script src="/js/springer.min.js" strategy="beforeInteractive" />
      <Script src="/js/vanilla-infinite-marquee.min.js" strategy="beforeInteractive" />
      
      {/* ===== MAIN TEMPLATE JS ===== */}
      <Script src="/js/main.js" strategy="lazyOnload" />
    </>
  );
}