# News Feed (React + Vite)

Приложение отображает ленту новостей с бесконечной прокруткой: вниз загружаются следующие посты, вверх — предыдущие. Источник данных — `https://dummyjson.com/posts`.

## Локальный запуск
```bash
npm i
npm run dev
```

## Сборка
```bash
npm run build
npm run preview
```

## Деплой
См. инструкции в корневом `README.md` (GitHub Pages с GitHub Actions).

## Использованы
- React 19 + Vite
- Redux Toolkit
- Ant Design

## API
`https://dummyjson.com/posts?limit=10&skip=0`
