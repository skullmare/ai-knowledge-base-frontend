export { NAV_LINKS } from '@/constants/navLinks'

const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export const getLogColumns = () => [
    {
        key: 'createdAt',
        label: 'Время',
        render: (value) => (
            <span className="logs-page__date">{formatDate(value)}</span>
        ),
    },
    {
        key: 'user',
        label: 'Пользователь',
        render: (value) =>
            value ? (
                <span className="logs-page__user">
                    {value.photoUrl ? (
                        <img
                            className="logs-page__user-avatar"
                            src={value.photoUrl}
                            alt=""
                        />
                    ) : (
                        <span className="logs-page__user-avatar logs-page__user-avatar--placeholder" />
                    )}
                    <span className="logs-page__user-name">
                        {value.firstName} {value.lastName}
                    </span>
                </span>
            ) : (
                <span className="logs-page__user-name">—</span>
            ),
    },
    {
        key: 'actionLabel',
        label: 'Событие',
        render: (value) => (
            <span className="logs-page__action-label">{value ?? '—'}</span>
        ),
    },
    {
        key: 'entityTypeLabel',
        label: 'Сущность',
        render: (value) => (
            <span className="logs-page__entity-label">{value ?? '—'}</span>
        ),
    },
    {
        key: 'message',
        label: 'Сообщение',
        render: (value) => (
            <span className="logs-page__message" title={value}>{value ?? '—'}</span>
        ),
    },
    {
        key: 'status',
        label: 'Статус',
        render: (value) => (
            <span className={`logs-page__status logs-page__status--${value}`}>
                {value === 'success' ? 'Успешно' : 'Ошибка'}
            </span>
        ),
    },
]
