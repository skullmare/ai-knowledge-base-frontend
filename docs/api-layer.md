# Слой работы с API

## HTTP-клиент — `services/api.js`

Один экземпляр axios на всё приложение:

```js
axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true,   // refresh-токен в httpOnly-куке
});
```

### Access-токен

Хранится в модуле и дублируется в `localStorage`, чтобы переживать
перезагрузку страницы. Запросный интерцептор подставляет
`Authorization: Bearer <token>`.

`setAccessToken(token)` — единственная точка записи; `null` очищает и
переменную, и хранилище.

### Автоматическое обновление сессии

Ответный интерцептор на `401`:

```
401 получен
  ├─ путь в SKIP_REFRESH_URLS (/auth/*) → отдать ошибку как есть
  └─ иначе
       ├─ refresh уже идёт → дождаться того же промиса
       └─ иначе → POST /auth/refresh
             ├─ успех   → сохранить токен, повторить исходный запрос
             └─ неудача → очистить токен, перейти на /login
```

Ключевая деталь — **один общий промис обновления**. Если три запроса
одновременно получили `401`, обновление выполняется один раз, а все три
дожидаются его результата и повторяются с новым токеном. Без этого
параллельные запросы отправляли бы три `refresh`, и два из них
провалились бы на уже использованной сессии.

Маршруты `/auth/*` исключены: `401` на входе означает неверные учётные
данные, а не истёкшую сессию, и обновлять там нечего.

## Сервисы ресурсов

По одному модулю на ресурс backend, каждый — тонкая обёртка над `api`:

```js
export const topicService = {
  getAll: async (params) => (await api.get('/topics', { params })).data,
  getOne: async (id) => (await api.get(`/topics/${id}`)).data,
  create: async (payload) => (await api.post('/topics', payload)).data,
  update: async (id, payload) => (await api.patch(`/topics/${id}`, payload)).data,
  approve: async (id) => (await api.post(`/topics/${id}/approve`)).data,
  delete: async (id) => (await api.delete(`/topics/${id}`)).data,
};
```

| Модуль | Ресурс |
| --- | --- |
| `auth.js` | `/auth/*` |
| `profile.js` | `/profile` |
| `password.js` | `/password/*` |
| `topic.js` | `/topics` |
| `topicCategory.js` | `/topic/categories` |
| `platformUser.js` | `/users` |
| `platformRole.js` | `/platform/roles` |
| `agentUser.js` | `/agent/users` |
| `agentRole.js` | `/agent/roles` |
| `log.js` | `/logs` |
| `permissions.js` | `/permissions` |
| `file.js` | `/files/*` |
| `collaboration.js` | WebSocket-провайдер Hocuspocus |

Сервис возвращает тело ответа целиком (`{ success, message, data, pagination }`)
и не хранит состояние — разбор и хранение делает store.

## Контракт с backend

Успех:

```json
{ "success": true, "message": "...", "data": ..., "pagination": { ... } }
```

Ошибка:

```json
{ "success": false, "message": "...", "errors": [{ "path": "login", "message": "..." }] }
```

`utils/handleError` приводит ошибку к строке: сначала склеивает
`errors[].message`, затем берёт `message`, затем отдаёт «Сервер недоступен,
попробуйте позже» при сетевом сбое.

Поле `path` совпадает с именем поля формы — это позволяет подсветить
конкретный ввод, а не показывать общее сообщение.

## Загрузка файлов

Два способа, оба в `services/file.js`:

* **Через сервер** — `POST /files/upload`, `multipart/form-data`, до 10 МБ.
* **Напрямую в хранилище** — `POST /files/presigned-url` → `PUT` по полученной
  ссылке → `POST /files/presigned-complete`. Файл не проходит через backend.
