import './App.css'
import { Layout, Typography } from 'antd'
import NewsFeed from './features/news/NewsFeed'
import { t } from './shared/ui/i18n'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  return (
      <Layout style={{ minHeight: '100vh' }}>
          <Header
              style={{
                  background: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1000,
                  height: 64,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
          >
              <Title level={3} style={{ margin: 0 }}>
                  {t('app.title')}
              </Title>
          </Header>
          <Content style={{ padding: '88px 24px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
              <NewsFeed />
          </Content>
      </Layout>
  )
}

export default App
