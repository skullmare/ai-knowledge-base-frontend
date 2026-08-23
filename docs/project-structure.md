# Структура проекта

```
ai-knowledge-base-frontend/
├── index.html                точка входа Vite
├── vite.config.js            плагины и алиасы путей
├── eslint.config.js          правила линтера
├── Dockerfile                сборка и раздача статики
│
└── src/
    ├── main.jsx              монтирование React
    ├── App.jsx               восстановление сессии, роутер, уведомления
    ├── index.css, App.css    глобальные стили и шрифты
    │
    ├── router/
    │   ├── App.jsx           таблица маршрутов и ленивая загрузка
    │   └── ProtectedRoute.jsx защита маршрута по сессии и правам
    │
    ├── pages/                экраны, по каталогу на страницу
    │   └── <page>/
    │       ├── Page.jsx          композиция экрана
    │       ├── Page.constants.jsx колонки таблиц, наборы полей
    │       ├── components/       части только этого экрана
    │       ├── hooks/            логика только этого экрана
    │       └── css/              стили экрана
    │
    ├── components/
    │   ├── ui/               Button, Input, Dropdown, Multiselect,
    │   │                     Toggle, Filter, Spinner, Snackbar
    │   ├── layout/           Layout, Header, Navbar, Table, Modal
    │   └── guards/           HasPermission
    │
    ├── store/                zustand-сторы по доменам
    ├── services/             HTTP-вызовы, по файлу на ресурс
    ├── hooks/                переиспользуемые хуки вне домена
    ├── utils/                чистые функции без React
    └── assets/               шрифты, иконки, изображения
```

## Правила размещения

**Компонент используется на одном экране** → `pages/<page>/components/`.
Появился второй потребитель → переезжает в `components/ui` или `components/layout`.

**Логика состояния экрана** → `pages/<page>/hooks/`. Каждое модальное окно
получает свой хук (`useCreateTopicModal`, `useDeleteRoleModal`): открытие,
поля, отправка и сброс живут вместе, а страница остаётся разметкой.

**Данные домена** → `store/`. Экран не хранит серверные данные в `useState`.

**Запрос к API** → `services/`. Компонент не импортирует `api` напрямую.

## Алиасы путей

Заданы в `vite.config.js`. Относительные пути вида `../../..` не используются.

| Алиас | Куда указывает |
| --- | --- |
| `@` | `src` |
| `@pages` | `src/pages` |
| `@components` | `src/components` |
| `@ui` | `src/components/ui` |
| `@layout` | `src/components/layout` |
| `@guards` | `src/components/guards` |
| `@store` | `src/store` |
| `@services` | `src/services` |
| `@router` | `src/router` |
| `@hooks` | `src/hooks` |
| `@utils` | `src/utils` |
| `@assets` | `src/assets` |

Конфиг Vite — ESM-модуль, поэтому пути строятся через `import.meta.url`,
а не через `__dirname`, которого в ESM не существует.

## Соглашения именования

| Что | Как | Пример |
| --- | --- | --- |
| Компонент | `PascalCase.jsx` | `TopicToolbar.jsx` |
| Хук | `useCamelCase.js` | `useTopicsData.js` |
| Store | `camelCase.js`, экспорт `useXStore` | `topicCategory.js` |
| Сервис | `camelCase.js`, экспорт `xService` | `platformUser.js` |
| Стили | рядом с компонентом или в `css/` экрана | `Topic.css` |

## Стили

CSS-модулей нет: используются обычные файлы с БЭМ-подобными именами
(`topic-page__editor-toolbar`). Файл стилей лежит рядом со своим компонентом
или в каталоге `css/` экрана и импортируется этим компонентом.
