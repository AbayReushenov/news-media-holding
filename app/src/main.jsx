import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './app/store'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'

// Ensure the page always starts at the top on reload and prevent browser scroll restoration
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
