export const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
]

export const TOPIC_COLUMNS = [
    { key: 'name', label: 'Название' },
    {
        key: 'status', label: 'Статус',
        render: (value) => (
            <span className="topic-status">
                <span className={`topic-status__dot topic-status__dot--${value}`} />
                {value === 'approved' ? 'Одобрено' : value === 'review' ? 'На проверке' : 'В архиве'}
            </span>
        )
    },
    { key: 'category', label: 'Раздел', render: (value) => value?.name ?? '—' },
    { key: 'roles', label: 'Роли', render: (value) => value?.length ? value.map((r) => r.name).join(', ') : '—' },
    {
        key: 'createdBy', label: 'Автор',
        render: (value) => value ? (
            <span className="topic-author">
                {value.photoUrl
                    ? <img className="topic-author__avatar" src={value.photoUrl} alt="" />
                    : <span className="topic-author__avatar topic-author__avatar--placeholder" />
                }
                {value.firstName} {value.lastName}
            </span>
        ) : '—'
    },
]