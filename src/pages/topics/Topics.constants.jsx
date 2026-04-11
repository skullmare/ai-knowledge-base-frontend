import { Link } from 'react-router-dom'
import Protected from '@guards/Protected'
import Delete from '@assets/icons/delete-16.svg'
import DoubleCheck from '@assets/icons/double-check-24.svg'
import Archive from '@assets/icons/archive-16.svg'

export const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
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
        render: (value, row) => (
            <div className="topics-page__table-actions">
                {row.status !== 'approved' && (
                    <Protected permission="topics.approve" mode="some">
                        <button
                            className="topics-page__table-actions__btn topics-page__table-actions__btn--approve"
                            onClick={() => onApprove(row)}
                            title="Одобрить"
                        >
                            <DoubleCheck />
                        </button>
                    </Protected>
                )}
                {row.status !== 'archived' && (
                    <Protected permission="topics.update" mode="some">
                        <button
                            className="topics-page__table-actions__btn topics-page__table-actions__btn--archive"
                            onClick={() => onArchive(row)}
                            title="Архивировать"
                        >
                            <Archive />
                        </button>
                    </Protected>
                )}
                <Protected permission="topics.delete" mode="some">
                    <button
                        className="topics-page__table-actions__btn topics-page__table-actions__btn--delete"
                        onClick={() => onDelete(row)}
                        title="Удалить"
                    >
                        <Delete />
                    </button>
                </Protected>
            </div>
        ),
    },
]