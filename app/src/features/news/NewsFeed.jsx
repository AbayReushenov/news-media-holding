import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Tag, Typography, Space, Row, Col, Spin, Alert } from 'antd'
import { fetchPosts, selectNews } from './newsSlice'

const { Paragraph, Text } = Typography

function truncate(text, maxLines = 3) {
  return (
    <Paragraph ellipsis={{ rows: maxLines, expandable: false }} style={{ marginBottom: 0 }}>
      {text}
    </Paragraph>
  )
}

export default function NewsFeed() {
  const dispatch = useDispatch()
  const { items, skip, isLoading, error, hasMore, firstPageRequested, minSkip, lastChange } = useSelector(selectNews)

  const bottomSentinelRef = useRef(null)
  const topSentinelRef = useRef(null)
  const isFetchingRef = useRef(false)
  const hasUserScrolledRef = useRef(false)

  // Initial load (guarded)
  useEffect(() => {
    if (!firstPageRequested && items.length === 0) {
      dispatch(fetchPosts({ skip: 0 }))
    }
  }, [dispatch, items.length, firstPageRequested])

  // Track user scroll to allow bottom loading after interaction
  useEffect(() => {
    const onScroll = () => {
      if (!hasUserScrolledRef.current && window.scrollY > 20) {
        hasUserScrolledRef.current = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep a ref in sync to prevent rapid double-dispatches
  useEffect(() => {
    isFetchingRef.current = isLoading
  }, [isLoading])

  // Capture the first visible card before we prepend
  const prePrependVisibleIdRef = useRef(null)
  const prePrependOffsetRef = useRef(0)
  const captureFirstVisible = () => {
    const cards = document.querySelectorAll('[data-post-id]')
    for (let i = 0; i < cards.length; i += 1) {
      const el = cards[i]
      const rect = el.getBoundingClientRect()
      if (rect.bottom > 0) {
        prePrependVisibleIdRef.current = Number(el.getAttribute('data-post-id'))
        prePrependOffsetRef.current = rect.top
        break
      }
    }
  }

  const bottomObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          const first = entries[0]
          if (first.isIntersecting && !isFetchingRef.current && hasMore) {
              dispatch(fetchPosts({ skip }))
          }
        },
        { rootMargin: '0px 0px 400px 0px', threshold: 0 }
      ),
    [dispatch, skip, hasMore]
  )

  const topObserver = useMemo(
    () =>
      new IntersectionObserver(
        (entries) => {
          const first = entries[0]
          if (first.isIntersecting && !isFetchingRef.current && minSkip > 0) {
            captureFirstVisible()
            const prevSkip = Math.max(0, minSkip - 10)
            dispatch(fetchPosts({ skip: prevSkip }))
          }
        },
        { rootMargin: '64px 0px 0px 0px', threshold: 0 }
      ),
    [dispatch, minSkip]
  )

  useEffect(() => {
    const current = bottomSentinelRef.current
    if (!current || items.length === 0) return
    bottomObserver.observe(current)
    return () => bottomObserver.unobserve(current)
  }, [bottomObserver, items.length])

  useEffect(() => {
    const current = topSentinelRef.current
    if (!current || items.length === 0) return
    topObserver.observe(current)
    return () => topObserver.unobserve(current)
  }, [topObserver, items.length])

  const isInitialLoading = items.length === 0 && isLoading

  // After a prepend, keep the previously first visible card at the same screen offset
  useEffect(() => {
    if (lastChange !== 'prepend') return
    const prevId = prePrependVisibleIdRef.current
    if (!prevId) return
    const target = document.querySelector(`[data-post-id="${prevId}"]`)
    if (!target) return
    const rect = target.getBoundingClientRect()
    const delta = rect.top - prePrependOffsetRef.current
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta })
    }
  }, [items.length, lastChange])

  return (
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {error && <Alert type='error' message='Не удалось загрузить новости' description={error} />}

          {isInitialLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                  <Spin />
              </div>
          )}

          <div ref={topSentinelRef} />
          {/* Padding top compensates Row's negative top margin from vertical gutter (16 -> 8px) */}
          <div style={{ paddingTop: 8 }}>
              <Row gutter={[16, 16]}>
                  {items.map((post) => (
                      <Col xs={24} md={12} key={post.id}>
                          <div data-post-id={post.id}>
                              <Card title={`${post.id} ${post.title}`} bordered hoverable>
                                  {truncate(post.body)}
                                  <Space wrap style={{ marginTop: 12 }}>
                                      {post.tags?.map((t) => (
                                          <Tag key={t}>{t}</Tag>
                                      ))}
                                      <Text type='secondary'>
                                          Реакции: {post.reactions?.likes ?? post.reactions ?? 0}
                                      </Text>
                                  </Space>
                              </Card>
                          </div>
                      </Col>
                  ))}
              </Row>
          </div>

          {items.length > 0 && (isLoading || hasMore) && (
              <div ref={bottomSentinelRef} style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                  {isLoading ? <Spin /> : <Text type='secondary'>Прокрутите ниже, чтобы загрузить больше…</Text>}
              </div>
          )}
      </Space>
  )
}
