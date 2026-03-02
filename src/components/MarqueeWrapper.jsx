'use client'

import { useEffect, useRef } from 'react'

export default function MarqueeWrapper({ children, direction = 'left', className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const initMarquee = () => {
      if (typeof window.InfiniteMarquee === 'undefined') {
        setTimeout(initMarquee, 100)
        return
      }

      const container = containerRef.current
      if (container && !container.classList.contains('marquee-initialized')) {
        try {
          new window.InfiniteMarquee({
            element: container,
            speed: 40000,
            smoothEdges: true,
            direction: direction
          })
          container.classList.add('marquee-initialized')
        } catch (error) {
          console.error('Marquee initialization error:', error)
        }
      }
    }

    setTimeout(initMarquee, 500)
  }, [direction])

  return (
    <aside ref={containerRef} className={className}>
      {children}
    </aside>
  )
}
