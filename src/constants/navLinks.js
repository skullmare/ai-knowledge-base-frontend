// Единый список ссылок верхнего меню. Страницы переэкспортируют его,
// чтобы новый раздел появлялся во всём приложении сразу.
export const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/files', label: 'Файлы', permission: ['files.read', 'googleDrive.read'], permissionMode: 'some' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
    { to: '/settings', label: 'Настройки системы', permission: 'system_settings.read' },
]
