'use client'

import { useEffect } from 'react'

export default function AnimationInit() {
  useEffect(() => {
    // Tunggu sampai semua script dimuat
    const initAnimations = () => {
      // Cek apakah GSAP dan dependencies sudah dimuat
      if (typeof window.gsap === 'undefined' || typeof window.Springer === 'undefined') {
        setTimeout(initAnimations, 100)
        return
      }

      // Inisialisasi reveal elements
      const elements = document.querySelectorAll('[data-ns-animate]')
      const Springer = window.Springer.default

      elements.forEach((elem) => {
        const duration = elem.getAttribute('data-duration') ? parseFloat(elem.getAttribute('data-duration')) : 0.6
        const delay = elem.getAttribute('data-delay') ? parseFloat(elem.getAttribute('data-delay')) : 0
        const offset = elem.getAttribute('data-offset') ? parseFloat(elem.getAttribute('data-offset')) : 60
        const instant = elem.hasAttribute('data-instant') && elem.getAttribute('data-instant') !== 'false'
        const start = elem.getAttribute('data-start') || 'top 90%'
        const end = elem.getAttribute('data-end') || 'top 50%'
        const direction = elem.getAttribute('data-direction') || 'down'
        const useSpring = elem.hasAttribute('data-spring')
        const spring = useSpring ? Springer(0.2, 0.8) : null
        const rotation = elem.getAttribute('data-rotation') ? parseFloat(elem.getAttribute('data-rotation')) : 0
        const animationType = elem.getAttribute('data-animation-type') || 'from'

        elem.style.opacity = '1'
        elem.style.filter = 'blur(0)'

        let animationProps = {
          opacity: animationType === 'to' ? 1 : 0,
          filter: animationType === 'to' ? 'blur(0)' : 'blur(16px)',
          duration,
          delay,
          ease: useSpring ? spring : 'power2.out'
        }

        if (rotation !== 0) {
          animationProps.rotation = rotation
        }

        if (!instant) {
          animationProps.scrollTrigger = {
            trigger: elem,
            start,
            end,
            scrub: false
          }
        }

        switch (direction) {
          case 'left':
            animationProps.x = -offset
            break
          case 'right':
            animationProps.x = offset
            break
          case 'down':
            animationProps.y = offset
            break
          case 'up':
          default:
            animationProps.y = -offset
            break
        }

        if (animationType === 'to') {
          window.gsap.to(elem, animationProps)
        } else {
          window.gsap.from(elem, animationProps)
        }
      })

      // Tampilkan top nav jika ada
      const topNav = document.querySelector('.top-nav')
      if (topNav) {
        topNav.style.display = 'block'
      }
    }

    // Delay untuk memastikan semua script sudah dimuat
    setTimeout(initAnimations, 500)
  }, [])

  return null
}
