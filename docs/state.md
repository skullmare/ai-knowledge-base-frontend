# Состояние приложения

Состояние домена живёт в zustand-сторах (`src/store/`). Локальное состояние
формы или модального окна остаётся в компоненте или в его хуке.

## Сторы

| Файл | Что хранит |
| --- | --- |
| `profile.js` | текущий пользователь, его права, флаг инициализации, `checkPermission` |
| `auth.js` | вход, подтверждение 2FA, выход |
| `password.js` | смена, запрос восстановления, сброс пароля |
| `topic.js` | темы, текущая тема, пагинация |
| `topicCategory.js` | категории тем |
| `platformUser.js` | сотрудники платформы |
| `platformRole.js` | роли платформы |
| `agentUser.js` | пользователи ИИ-агента |
| `agentRole.js` | роли ИИ-агента |
| `log.js` | журнал событий |
| `permissions.js` | справочник прав для интерфейса |
| `file.js` | загрузка файлов |
| `success.js` | очередь уведомлений об успехе |

## Форма стора

```js
const useTopicStore = create((set) => ({
    topics: [],
    currentTopic: null,
    pagination: { total: 0, pages: 1, current: 1, limit: 10 },

    isLoadingFetchTopics: false,
    isLoadingCreateTopic: false,
    isLoadingUpdateTopic: false,
    error: null,

    fetchTopics: async (params) => { /* ... */ },
}));
```

Правила:

* **Флаг загрузки на каждую операцию**, а не один общий. Интерфейсу нужно
  показывать спиннер на конкретной кнопке, а не блокировать весь экран.
* **Форма данных приводится в сторе**, а не в компоненте. Нормализация вида
  `Array.isArray(data) ? data : data.categories ?? []` в теле компонента
  создаёт новый массив на каждый рендер и ломает `useMemo` потребителей.
* **Текст ошибки** получается через `utils/handleError` и кладётся в `error`;
  показом занимается система уведомлений.
* **`get` в сигнатуре объявляется только если используется** — иначе линтер
  справедливо ругается на мёртвый параметр.

## Синхронизация связанных сущностей

Переименованная категория встречается и в списке категорий, и внутри каждой
темы. Перезагружать всё после каждой правки дорого, поэтому есть механизм
адресного обновления.

```
storeRegistry   реестр: тип сущности → сторы, которые её содержат
syncStores      syncEntityUpdate / syncEntityDelete — рассылка изменения
```

Стор, который хранит чужие сущности, регистрируется в реестре и реализует
`updateEntityInStore(entityType, entityId, updatedEntity)` и
`deleteEntityFromStore(entityId)`.

```
updateCategory(id, data)
   → PATCH /topic/categories/:id
   → обновление в собственном сторе
   → syncEntityUpdate('topicCategory', id, updated)
   → topicStore обновляет metadata.category во всех темах
```

Так один запрос обновляет интерфейс целиком, без повторной загрузки списков.

## Уведомления

```
store.error  ──▶ useErrorWatcher ──▶ ErrorSnackbarStack
successStore ──▶ SuccessSnackbarStack
```

`useErrorWatcher` подписан на поля `error` всех сторов, показывает текст
и очищает поле, чтобы одно и то же сообщение не всплывало повторно.
Компоненты не выводят ошибки самостоятельно.

## Права в интерфейсе

`store/profile` хранит массив `permissions` и функцию `checkPermission`.
Ими пользуются `ProtectedRoute` (маршрут) и `HasPermission` (элемент).
До завершения инициализации оба возвращают `null`, чтобы не мигать
запретом до загрузки профиля.
