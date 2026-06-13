import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Reveal-on-scroll wrapper: slides its content up into view and fades it in the
 * first time it enters the viewport.
 *
 * - `as`     render as this tag (e.g. "h1", "span", "dl") so no extra wrapper
 *            element is introduced for text/flow content.
 * - `delay`  stagger delay in ms.
 * - 400ms ease-in-out by default; respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  duration = 400,
  y = 16,
  className = '',
  ...rest
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style = {
    transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : `translateY(${y}px)`,
    willChange: 'opacity, transform',
  }

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  )
}
