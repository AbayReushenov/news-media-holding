import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './app/store'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'

// KISS: единообразная инициализация скролла
if (typeof window !== 'undefined' && typeof window.history?.scrollRestoration !== 'undefined') {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
}

const rootEl = document.getElementById('root')
if (!rootEl) {
    throw new Error('Root element #root not found')
}

createRoot(rootEl).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
)

