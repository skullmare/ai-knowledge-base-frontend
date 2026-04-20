import Delete from '@assets/icons/delete-16.svg'
import EditIcon from '@assets/icons/edit-16.svg'
import DropdownActions from '@ui/DropdownActions/DropdownActions'

export const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
]

const getPlatformUserActions = ({ onEdit, onDelete }, row) => [
    {
        label: 'Редактировать',
        icon: EditIcon,
        permission: 'platformUsers.update',
        permissionMode: 'some',
        onClick: () => onEdit(row),
    },
    {
        label: 'Удалить',
        icon: Delete,
        variant: 'delete',
        permission: 'platformUsers.delete',
        permissionMode: 'some',
        hidden: row.isSystem,
        onClick: () => onDelete(row),
    },
]

const getAgentUserActions = ({ onEdit, onDelete }, row) => [
    {
        label: 'Редактировать',
        icon: EditIcon,
        permission: 'agentUsers.update',
        permissionMode: 'some',
        onClick: () => onEdit(row),
    },
    {
        label: 'Удалить',
        icon: Delete,
        variant: 'delete',
        permission: 'agentUsers.delete',
        permissionMode: 'some',
        onClick: () => onDelete(row),
    },
]

export const getPlatformUserColumns = ({ onEdit, onDelete }) => [
    {
        key: 'firstName',
        label: 'Пользователь',
        render: (value, row) => (
            <span className="users-page__table-author">
                {row.photoUrl ? (
                    <img className="users-page__table-author__avatar" src={row.photoUrl} alt="" />
                ) : (
                    <span className="users-page__table-author__avatar users-page__table-author__avatar--placeholder" />
                )}
                <span className="users-page__table-author__names">
                    {row.firstName} {row.lastName}
                </span>
            </span>
        ),
    },
    {
        key: 'login',
        label: 'Логин',
        render: (value) => value ?? '—',
    },
    {
        key: 'email',
        label: 'Email',
        render: (value) => value ?? '—',
    },
    {
        key: 'role',
        label: 'Роль',
        render: (value) => value?.name ?? '—',
    },
    {
        key: 'status',
        label: 'Статус',
        render: (value) => (
            <span className="users-page__table-status">
                <span className={`users-page__table-status__dot users-page__table-status__dot--${value}`} />
                {value === 'active' ? 'Активен' : 'Заблокирован'}
            </span>
        ),
    },
    {
        key: '_id',
        label: '',
        actions: true,
        render: (_, row) => (
            <DropdownActions
                actions={getPlatformUserActions({ onEdit, onDelete }, row)}
            />
        ),
    },
]

export const getAgentUserColumns = ({ onEdit, onDelete }) => [
    {
        key: 'firstName',
        label: 'Пользователь',
        render: (value, row) => (
            <span className="users-page__table-author">
                <span className="users-page__table-author__avatar users-page__table-author__avatar--placeholder" />
                {row.firstName} {row.lastName}
            </span>
        ),
    },
    {
        key: 'phone',
        label: 'Телефон',
        render: (value) => value ?? '—',
    },
    {
        key: 'role',
        label: 'Роль',
        render: (value) => value?.name ?? '—',
    },
    {
        key: 'status',
        label: 'Статус',
        render: (value) => {
            const label = value === 'active' ? 'Активен' : value === 'pending' ? 'Ожидает' : 'Заблокирован'
            return (
                <span className="users-page__table-status">
                    <span className={`users-page__table-status__dot users-page__table-status__dot--${value}`} />
                    {label}
                </span>
            )
        },
    },
    {
        key: 'lastActivity',
        label: 'Последняя активность',
        render: (value) =>
            value
                ? new Date(value).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                  })
                : '—',
    },
    {
        key: '_id',
        label: '',
        actions: true,
        render: (_, row) => (
            <DropdownActions
                actions={getAgentUserActions({ onEdit, onDelete }, row)}
            />
        ),
    },
]