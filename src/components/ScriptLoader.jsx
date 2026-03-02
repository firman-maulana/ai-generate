'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function ScriptLoader() {
  const [scriptsLoaded, setScriptsLoaded] = useState({
    gsap: false,
    scrollTrigger: false,
    swiper: false,
    lenis: false,
    splitText: false,
    drawSvg: false,
    leaflet: false,
    motionPath: false,
    numberCounter: false,
    springer: false,
    stackCard: false,
    marquee: false,
    demoShowcase: false,
    main: false
  })

  const [shouldLoadMarquee, setShouldLoadMarquee] = useState(true)

  useEffect(() => {
    // Check if InfiniteMarquee already exists
    if (typeof window !== 'undefined' && window.InfiniteMarquee) {
      setShouldLoadMarquee(false)
    }
  }, [])

  const handleScriptLoad = (scriptName) => {
    setScriptsLoaded(prev => ({ ...prev, [scriptName]: true }))
  }

  return (
    <>
      {/* Load scripts sequentially to avoid conflicts */}
      <Script 
        src="/js/gsap.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('gsap')}
        id="gsap-script"
      />
      
      {scriptsLoaded.gsap && (
        <Script 
          src="/js/scroll-trigger.min.js" 
          strategy="afterInteractive"
          onLoad={() => handleScriptLoad('scrollTrigger')}
          id="scroll-trigger-script"
        />
      )}
      
      <Script 
        src="/js/swiper.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('swiper')}
        id="swiper-script"
      />
      
      <Script 
        src="/js/lenis.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('lenis')}
        id="lenis-script"
      />
      
      <Script 
        src="/js/split-text.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('splitText')}
        id="split-text-script"
      />
      
      <Script 
        src="/js/draw-svg.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('drawSvg')}
        id="draw-svg-script"
      />
      
      <Script 
        src="/js/leaflet.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('leaflet')}
        id="leaflet-script"
      />
      
      <Script 
        src="/js/motionpathplugin.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('motionPath')}
        id="motionpath-script"
      />
      
      <Script 
        src="/js/number-counter.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('numberCounter')}
        id="number-counter-script"
      />
      
      <Script 
        src="/js/springer.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('springer')}
        id="springer-script"
      />
      
      <Script 
        src="/js/stack-card.min.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('stackCard')}
        id="stack-card-script"
      />
      
      {/* Only load marquee once */}
      {shouldLoadMarquee && (
        <Script 
          src="/js/vanilla-infinite-marquee.min.js" 
          strategy="afterInteractive"
          onLoad={() => {
            handleScriptLoad('marquee')
            setShouldLoadMarquee(false)
          }}
          id="marquee-script"
        />
      )}
      
      <Script 
        src="/js/demo-showcase.js" 
        strategy="afterInteractive"
        onLoad={() => handleScriptLoad('demoShowcase')}
        id="demo-showcase-script"
      />
      
      {/* Load main.js last */}
      {scriptsLoaded.gsap && scriptsLoaded.springer && (
        <Script 
          src="/js/main.js" 
          strategy="afterInteractive"
          onLoad={() => handleScriptLoad('main')}
          id="main-script"
        />
      )}
    </>
  )
}
