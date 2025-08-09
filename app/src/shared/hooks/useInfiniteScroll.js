import { useEffect, useMemo, useRef } from 'react'

export function useInfiniteScroll({
  hasMore,
  isLoading,
  skip,
  minSkip,
  pageSize,
  onLoadNext,
  onLoadPrev,
  onBeforePrepend,
  rootMarginBottom = '400px',
  rootMarginTop = '64px',
}) {
  const bottomRef = useRef(null)
  const topRef = useRef(null)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    isFetchingRef.current = isLoading
  }, [isLoading])

  const bottomObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          const first = entries[0]
          if (first.isIntersecting && !isFetchingRef.current && hasMore) {
            onLoadNext?.(skip)
          }
        },
        { rootMargin: `0px 0px ${rootMarginBottom} 0px`, threshold: 0 }
      ),
    [hasMore, onLoadNext, rootMarginBottom, skip]
  )

  const topObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          const first = entries[0]
          if (first.isIntersecting && !isFetchingRef.current && minSkip > 0) {
            onBeforePrepend?.()
            const prevSkip = Math.max(0, minSkip - pageSize)
            onLoadPrev?.(prevSkip)
          }
        },
        { rootMargin: `${rootMarginTop} 0px 0px 0px`, threshold: 0 }
      ),
    [minSkip, onLoadPrev, onBeforePrepend, pageSize, rootMarginTop]
  )

  useEffect(() => {
    const el = bottomRef.current
    if (!el) return
    bottomObserver.observe(el)
    return () => bottomObserver.unobserve(el)
  }, [bottomObserver])

  useEffect(() => {
    const el = topRef.current
    if (!el) return
    topObserver.observe(el)
    return () => topObserver.unobserve(el)
  }, [topObserver])

  return { bottomRef, topRef }
}
