# News Feed (React + Vite)

Приложение отображает ленту новостей с бесконечной прокруткой: вниз загружаются следующие посты, вверх — предыдущие. Источник данных — `https://dummyjson.com/posts`.

## Технологии
- React 19 + Vite
- Redux Toolkit
- Ant Design

## Функциональность
- Загрузка постов партиями по 10
- Догрузка при достижении низа экрана
- Догрузка предыдущих постов при прокрутке вверх
- Стабильный порядок карточек по `id`

## Локальный запуск
```bash
cd app
npm i
npm run dev
```

## Сборка
```bash
cd app
npm run build
npm run preview
```

## Деплой на GitHub Pages
Автодеплой настроен через GitHub Actions (`.github/workflows/deploy.yml`).

Шаги:
1. Создайте репозиторий на GitHub и запушьте код в ветку `main`.
2. В настройках репозитория включите Pages: Settings → Pages → Build and deployment → Source: GitHub Actions.
3. При пуше в `main` workflow соберёт проект и опубликует содержимое `app/dist` на GitHub Pages.

Если репозиторий называется `yourname/your-repo`, сайт будет доступен по адресу `https://yourname.github.io/your-repo/`.

### База для GitHub Pages
Для корректных путей на Pages используется переменная окружения `VITE_APP_BASE` (пример: `/your-repo/`).
Workflow передаёт её автоматически: `VITE_APP_BASE: "/${{ github.event.repository.name }}/"`.
Если деплоите вручную локально, можно запустить:
```bash
cd app
VITE_APP_BASE=/your-repo/ npm run build
```

## Структура проекта
- `app/` — фронтенд-приложение (Vite)
  - `src/features/news/` — лента, состояние и логика пагинации
  - `src/app/store.js` — конфиг стора
  - `vite.config.js` — базовый путь для GitHub Pages
- `.github/workflows/deploy.yml` — GitHub Actions для автодеплоя
- `.gitignore` — исключения для node, сборки и кешей

## Примечания
- В карточке перед названием отображается `id` для удобного тестирования порядка и пагинации.
- Порядок постов принудительно стабилизирован по `id` для корректной работы бесконечной прокрутки вверх/вниз.
