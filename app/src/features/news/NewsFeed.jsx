import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Tag, Typography, Space, Row, Col, Spin, Alert, Button } from 'antd'
import { fetchPosts, selectNews } from './newsSlice'
import { useInfiniteScroll } from '../../shared/hooks/useInfiniteScroll'
import { useStablePrependScroll } from '../../shared/hooks/useStablePrependScroll'
import { PAGE_SIZE } from './constants'
import { t } from '../../shared/ui/i18n'
import styles from './NewsFeed.module.css'

const { Paragraph, Text } = Typography

function truncate(text, maxLines = 3) {
    return (
        <Paragraph ellipsis={{ rows: maxLines, expandable: false }} className={styles.paragraphTight}>
            {text}
        </Paragraph>
    )
}

export default function NewsFeed() {
    const dispatch = useDispatch()
    const { items, skip, isLoading, error, hasMore, firstPageRequested, minSkip, lastChange } = useSelector(selectNews)

    // Initial load (guarded)
    useEffect(() => {
        if (!firstPageRequested && items.length === 0) {
            dispatch(fetchPosts({ skip: 0 }))
        }
    }, [dispatch, items.length, firstPageRequested])

    // Перенесено в hook useStablePrependScroll
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
        pageSize: PAGE_SIZE,
        onLoadNext,
        onLoadPrev,
        onBeforePrepend: captureFirstVisible,
    })

    const isInitialLoading = items.length === 0 && isLoading

    return (
        <Space direction='vertical' size='large' className={styles.newsFeedRoot}>
            {error && (
                <Alert
                    type='error'
                    message={t('news.error.title')}
                    description={error}
                    action={
                        <Button onClick={() => dispatch(fetchPosts({ skip: items.length === 0 ? 0 : minSkip }))}>
                            {t('news.error.retry')}
                        </Button>
                    }
                    role='alert'
                />
            )}

            {isInitialLoading && (
                <div className={styles.centerPad32}>
                    <Spin />
                </div>
            )}

            <div ref={topSentinelRef} />
            {/* Padding top compensates Row's negative top margin from vertical gutter (16 -> 8px) */}
            <div className={styles.paddingTop8}>
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
                                    <Space wrap className={styles.mt12}>
                                        {post.tags?.map((t) => (
                                            <Tag key={t}>{t}</Tag>
                                        ))}
                                        <Text type='secondary'>
                                            {t('news.reactions', {
                                                count: post.reactions?.likes ?? post.reactions ?? 0,
                                            })}
                                        </Text>
                                    </Space>
                                </Card>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

            {items.length > 0 && (isLoading || hasMore) && (
                <div ref={bottomSentinelRef} className={styles.centerPad24}>
                    {isLoading ? <Spin /> : <Text type='secondary'>{t('news.loadMore')}</Text>}
                </div>
            )}
        </Space>
    )
}
