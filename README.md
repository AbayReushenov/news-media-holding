# News Media Holding — Лента новостей (React 19 + Vite 7 + RTK + Ant Design)

Приложение отображает ленту новостей с бесконечной прокруткой: при достижении низа подгружается следующая партия, при прокрутке вверх — предыдущая. Данные берутся из публичного API `https://dummyjson.com/posts`.

## Возможности
- Бесконечная прокрутка вниз и вверх (IntersectionObserver)
- Стабильный порядок карточек по `id`
- Обработка сетевых ошибок с возможностью повторить
- Адаптивная сетка карточек (Ant Design Grid)

## Технологии
- React 19, Vite 7
- Redux Toolkit (slice + thunk)
- Ant Design 5

## Быстрый старт
```bash
cd app
npm i
npm run dev
```
Откройте `http://localhost:5173`.

## Сборка и предпросмотр
```bash
cd app
npm run build
npm run preview
```

## Деплой на GitHub Pages
Автодеплой настроен через GitHub Actions (`.github/workflows/deploy.yml`).
- В Settings → Pages выберите Source: GitHub Actions
- Пуш в ветку `main` запустит сборку и публикацию `app/dist`
- Сайт будет доступен по адресу `https://<username>.github.io/<repo>/`

Конфигурация Vite использует базовый путь из переменной окружения `VITE_APP_BASE` (например, `/repo-name/`), значение передаётся в workflow автоматически.

## Архитектура
- `app/src/app` — стор и провайдеры
- `app/src/features/news` — функциональность ленты (UI, slice)
- `app/src/shared/api` — слой данных и клиенты API
- `app/src/shared/hooks` — переиспользуемые хуки (infinite scroll, стабильный prepend-скролл)
- `app/src/shared/lib` — утилиты (retry)

Слои разделены по ответственности (SOLID):
- Компоненты — только UI
- Хуки — побочные эффекты и работа с наблюдателями
- Slice — состояние и редьюсеры, сетевые вызовы через API-сервис

## Переменные окружения
- `VITE_APP_BASE` — базовый путь для ассетов на GitHub Pages. По умолчанию `/`.

## Скрипты
- `npm run dev` — запуск в dev-режиме
- `npm run build` — прод-сборка
- `npm run preview` — локальный предпросмотр собранной версии
- `npm run lint` — проверка кода линтером

## Качество кода
- Принципы SOLID/DRY/KISS
- Логика скролла вынесена в хуки (`useInfiniteScroll`, `useStablePrependScroll`)
- Сетевой слой вынесен в `shared/api` с простой retry-обёрткой
- ESLint настроен для браузерного и node-кода (конфиги и Vite)

## API
Источник данных: `GET https://dummyjson.com/posts?limit=10&skip=0` (+ сортировка по `id` на стороне клиента)

## Лицензия
MIT
