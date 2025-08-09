import { Layout, Typography } from 'antd'
import NewsFeed from './features/news/NewsFeed'
import { t } from './shared/ui/i18n'
import styles from './App.module.css'
import './App.css'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
    return (
        <Layout className={styles.layoutRoot}>
            <Header className={styles.headerRoot}>
                <Title level={3} className={styles.headerTitle}>
                    {t('app.title')}
                </Title>
            </Header>
            <Content className={styles.contentRoot}>
                <NewsFeed />
            </Content>
        </Layout>
    )
}

export default App
