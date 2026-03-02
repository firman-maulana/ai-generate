"use client";

import Script from "next/script";

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
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <AnimationInit />
      <main className="space-y-10">
        <Header />
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
      <Script src="/js/springer.min.js" strategy="beforeInteractive" />
      <Script src="/js/vanilla-infinite-marquee.min.js" strategy="beforeInteractive" />
      
      {/* ===== MAIN TEMPLATE JS ===== */}
      <Script src="/js/main.js" strategy="lazyOnload" />
    </>
  );
}