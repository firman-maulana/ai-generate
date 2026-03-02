'use client'

import { useEffect } from 'react'

export default function AnimationInit() {
  useEffect(() => {
    const initAnimations = () => {
      // Cek apakah GSAP sudah dimuat
      if (typeof window.gsap === 'undefined') {
        // Jika GSAP tidak dimuat setelah 3 detik, tampilkan semua elemen
        const timeout = setTimeout(() => {
          const elements = document.querySelectorAll('[data-ns-animate]')
          elements.forEach(elem => {
            elem.style.opacity = '1'
          })
        }, 3000)
        
        setTimeout(initAnimations, 100)
        return () => clearTimeout(timeout)
      }

      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      if (ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger)
      }

      // Inisialisasi reveal elements
      const elements = document.querySelectorAll('[data-ns-animate]')

      elements.forEach((elem) => {
        const duration = elem.getAttribute('data-duration') ? parseFloat(elem.getAttribute('data-duration')) : 0.6
        const delay = elem.getAttribute('data-delay') ? parseFloat(elem.getAttribute('data-delay')) : 0
        const offset = elem.getAttribute('data-offset') ? parseFloat(elem.getAttribute('data-offset')) : 60
        const instant = elem.hasAttribute('data-instant')
        const direction = elem.getAttribute('data-direction') || 'up'

        let fromProps = {
          opacity: 0,
          duration,
          delay,
          ease: 'power2.out'
        }

        let toProps = {
          opacity: 1,
          duration,
          delay,
          ease: 'power2.out'
        }

        if (!instant && ScrollTrigger) {
          toProps.scrollTrigger = {
            trigger: elem,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }

        switch (direction) {
          case 'left':
            fromProps.x = -offset
            toProps.x = 0
            break
          case 'right':
            fromProps.x = offset
            toProps.x = 0
            break
          case 'down':
            fromProps.y = offset
            toProps.y = 0
            break
          case 'up':
          default:
            fromProps.y = -offset
            toProps.y = 0
            break
        }

        gsap.fromTo(elem, fromProps, toProps)
      })
    }

    // Delay untuk memastikan DOM sudah siap
    setTimeout(initAnimations, 300)

    // Cleanup
    return () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }
  }, [])

  return null
}