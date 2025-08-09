import './App.css'
import { Layout, Typography } from 'antd'
import NewsFeed from './features/news/NewsFeed'
import { t } from './shared/ui/i18n'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  return (
      <Layout className='layoutRoot'>
          <Header className='headerRoot'>
              <Title level={3} className='headerTitle'>
                  {t('app.title')}
              </Title>
          </Header>
          <Content className='contentRoot'>
              <NewsFeed />
          </Content>
      </Layout>
  )
}

export default App
