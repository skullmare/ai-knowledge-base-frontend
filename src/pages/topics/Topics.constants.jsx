import { Link } from 'react-router-dom'
import DoubleCheck from '@assets/icons/double-check-24.svg'
import Archive from '@assets/icons/archive-16.svg'
import Delete from '@assets/icons/delete-16.svg'
import DropdownActions from '@ui/DropdownActions/DropdownActions'

export const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
]

const getTopicActions = ({ onApprove, onArchive, onDelete }, row) => [
    {
        label: 'Одобрить',
        icon: DoubleCheck,
        variant: 'approve',
        permission: 'topics.approve',
        permissionMode: 'some',
        hidden: row.status === 'approved',
        onClick: () => onApprove(row),
    },
    {
        label: 'Архивировать',
        icon: Archive,
        permission: 'topics.update',
        permissionMode: 'some',
        hidden: row.status === 'archived',
        onClick: () => onArchive(row),
    },
    {
        label: 'Удалить',
        icon: Delete,
        variant: 'delete',
        permission: 'topics.delete',
        permissionMode: 'some',
        onClick: () => onDelete(row),
    },
]

export const getTopicColumns = ({ onDelete, onApprove, onArchive }) => [
    {
        key: 'name',
        label: 'Название',
        render: (value, row) => (
            <Link className="topics-page__table-name-link" to={`/topic/${row._id}`}>
                {value}
            </Link>
        ),
    },
    {
        key: 'status',
        label: 'Статус',
        render: (value) => (
            <span className="topics-page__table-status">
                <span className={`topics-page__table-status__dot topics-page__table-status__dot--${value}`} />
                {value === 'approved' ? 'Одобрено' : value === 'review' ? 'На проверке' : 'В архиве'}
            </span>
        ),
    },
    {
        key: 'category',
        label: 'Раздел',
        render: (value) => value?.name ?? '—',
    },
    {
        key: 'roles',
        label: 'Роли',
        render: (value) =>
            value?.length ? (
                <div className="topics-page__table-roles">
                    {value.map((r) => (
                        <span key={r._id} className="topics-page__table-role-tag">
                            {r.name}
                        </span>
                    ))}
                </div>
            ) : (
                '—'
            ),
    },
    {
        key: 'createdBy',
        label: 'Автор',
        render: (value) =>
            value ? (
                <span className="topics-page__table-author">
                    {value.photoUrl ? (
                        <img className="topics-page__table-author__avatar" src={value.photoUrl} alt="" />
                    ) : (
                        <span className="topics-page__table-author__avatar topics-page__table-author__avatar--placeholder" />
                    )}
                    {value.firstName} {value.lastName}
                </span>
            ) : (
                '—'
            ),
    },
    {
        key: '_id',
        label: '',
        actions: true,
        render: (_, row) => (
            <DropdownActions
                actions={getTopicActions({ onApprove, onArchive, onDelete }, row)}
            />
        ),
    },
]