"use client";

import Script from "next/script";

import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import CTASection from "@/components/CTASection";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ServicesSection from "@/components/Services";
import ShowcaseSection from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/Faq";
import ButtonSection from "@/components/Button";
import Footer from "@/components/Footer";
import AnimationInit from "@/components/AnimationInit";

export default function Home() {
  return (
    <>
      <AnimationInit />
      <main className="space-y-10">
        <TopNav />
        <Hero />
        <ClientLogos />
        <CTASection />
        <Features />
        <HowItWorks />
        <ServicesSection />
        <ShowcaseSection />
        <Testimonials />
        <FaqSection />
        <ButtonSection />
        <Footer />
      </main>

      {/* ===== TEMPLATE JS DEPENDENCIES ===== */}
      <Script src="/js/gsap.min.js" strategy="beforeInteractive" />
      <Script src="/js/scroll-trigger.min.js" strategy="beforeInteractive" />
      <Script src="/js/swiper.min.js" strategy="beforeInteractive" />
      <Script src="/js/lenis.min.js" strategy="beforeInteractive" />
      <Script src="/js/split-text.min.js" strategy="beforeInteractive" />
      <Script src="/js/draw-svg.min.js" strategy="beforeInteractive" />
      <Script src="/js/leaflet.min.js" strategy="beforeInteractive" />
      <Script src="/js/motionpathplugin.min.js" strategy="beforeInteractive" />
      <Script src="/js/number-counter.js" strategy="beforeInteractive" />
      <Script src="/js/springer.min.js" strategy="beforeInteractive" />
      <Script src="/js/stack-card.min.js" strategy="beforeInteractive" />
      <Script src="/js/vanilla-infinite-marquee.min.js" strategy="beforeInteractive" />

      {/* ===== OPTIONAL / FEATURE JS ===== */}
      <Script src="/js/demo-showcase.js" strategy="afterInteractive" />

      {/* ===== MAIN TEMPLATE JS (TERAKHIR) ===== */}
      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}