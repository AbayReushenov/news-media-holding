import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Tag, Typography, Space, Row, Col, Spin, Alert, Button } from 'antd'
import { fetchPosts, selectNews } from './newsSlice'
import { useInfiniteScroll } from '../../shared/hooks/useInfiniteScroll'
import { useStablePrependScroll } from '../../shared/hooks/useStablePrependScroll'

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

    // UI remains the same; scroll tracking больше не нужен

    // Перенесено в hook useInfiniteScroll
    const { getItemRef, captureFirstVisible } = useStablePrependScroll({ items, lastChange })

    const onLoadNext = useCallback(
        (currentSkip) => {
            dispatch(fetchPosts({ skip: currentSkip }))
        },
        [dispatch]
    )
    const onLoadPrev = useCallback(
        (prevSkip) => {
            dispatch(fetchPosts({ skip: prevSkip }))
        },
        [dispatch]
    )
    const { bottomRef: bottomSentinelRef, topRef: topSentinelRef } = useInfiniteScroll({
        hasMore,
        isLoading,
        skip,
        minSkip,
        pageSize: 10,
        onLoadNext,
        onLoadPrev,
        onBeforePrepend: captureFirstVisible,
    })

    // Наблюдение инкапсулировано в useInfiniteScroll

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
            {error && (
                <Alert
                    type='error'
                    message='Не удалось загрузить новости'
                    description={error}
                    action={
                        <Button onClick={() => dispatch(fetchPosts({ skip: items.length === 0 ? 0 : minSkip }))}>
                            Повторить
                        </Button>
                    }
                    role='alert'
                />
            )}

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
                            <div ref={getItemRef(post.id)} data-post-id={post.id}>
                                <Card
                                    title={post.title}
                                    variant='outlined'
                                    hoverable
                                    aria-label={post.title}
                                    role='article'
                                >
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
