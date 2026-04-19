export const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
]
