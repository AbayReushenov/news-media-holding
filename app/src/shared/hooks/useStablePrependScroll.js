import { useEffect, useRef, useCallback } from 'react'

export function useStablePrependScroll({ items, lastChange }) {
  const elementsRef = useRef(new Map())
  const prePrependVisibleIdRef = useRef(null)
  const prePrependOffsetRef = useRef(0)

  const getItemRef = useCallback((id) => {
    return (el) => {
      if (el) elementsRef.current.set(id, el)
      else elementsRef.current.delete(id)
    }
  }, [])

  const captureFirstVisible = useCallback(() => {
    for (let i = 0; i < items.length; i += 1) {
      const id = items[i]?.id
      const el = id != null ? elementsRef.current.get(id) : null
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.bottom > 0) {
        prePrependVisibleIdRef.current = id
        prePrependOffsetRef.current = rect.top
        break
      }
    }
  }, [items])

  useEffect(() => {
    if (lastChange !== 'prepend') return
    const prevId = prePrependVisibleIdRef.current
    if (!prevId) return
    const el = elementsRef.current.get(prevId)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const delta = rect.top - prePrependOffsetRef.current
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta })
    }
  }, [items, lastChange])

  return { getItemRef, captureFirstVisible }
}
