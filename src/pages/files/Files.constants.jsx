import DropdownActions from '@ui/DropdownActions/DropdownActions'
import DoubleCheck from '@assets/icons/double-check-24.svg'
import Minus from '@assets/icons/minus-16.svg'
import Edit from '@assets/icons/edit-16.svg'
import Delete from '@assets/icons/delete-16.svg'
import Archive from '@assets/icons/archive-16.svg'
import Catalogue from '@assets/icons/catalogue-16.svg'

export { NAV_LINKS } from '@/constants/navLinks'

// Сколько тегов ролей показываем в ячейке до сворачивания в «+N»:
// так строки таблицы держат одинаковую высоту
const VISIBLE_ROLES = 2

const STATUS_LABELS = {
    uploaded: 'Не векторизован',
    indexing: 'Векторизуется',
    indexed: 'Векторизован',
    error: 'Ошибка',
}

const SOURCE_LABELS = {
    storage: 'Хранилище',
    google_drive: 'Google Drive',
}

export const formatFileSize = (bytes) => {
    if (bytes === null || bytes === undefined) return '—'
    if (bytes < 1024) return `${bytes} Б`

    const units = ['КБ', 'МБ', 'ГБ', 'ТБ']
    let value = bytes / 1024
    let unitIndex = 0

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024
        unitIndex += 1
    }

    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

export const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatDateShort = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    })
}

const getFileActions = ({ onOpen, onDownload, onVectorize, onDevectorize, onEdit, onDelete }, row) => [
    {
        label: row.source === 'google_drive' ? 'Открыть в Google Drive' : 'Открыть',
        icon: Catalogue,
        permission: 'files.read',
        onClick: () => onOpen(row),
    },
    {
        label: 'Скачать',
        icon: Archive,
        permission: 'files.read',
        onClick: () => onDownload(row),
    },
    {
        label: 'Векторизовать',
        icon: DoubleCheck,
        variant: 'approve',
        permission: 'files.vectorize',
        hidden: row.vectorData?.isIndexed,
        onClick: () => onVectorize(row),
    },
    {
        label: 'Убрать из векторной базы',
        icon: Minus,
        permission: 'files.vectorize',
        hidden: !row.vectorData?.isIndexed,
        onClick: () => onDevectorize(row),
    },
    {
        label: 'Редактировать',
        icon: Edit,
        permission: 'files.update',
        onClick: () => onEdit(row),
    },
    {
        label: 'Удалить',
        icon: Delete,
        variant: 'delete',
        permission: 'files.delete',
        onClick: () => onDelete(row),
    },
]

const RolesCell = ({ roles }) => {
    if (!roles?.length) return <span className="files-page__cell-muted">—</span>

    const visible = roles.slice(0, VISIBLE_ROLES)
    const hidden = roles.length - visible.length

    return (
        <div className="files-page__roles" title={roles.map((r) => r.name).join(', ')}>
            {visible.map((role) => (
                <span key={role._id} className="files-page__role-tag">{role.name}</span>
            ))}
            {hidden > 0 && (
                <span className="files-page__role-tag files-page__role-tag--more">+{hidden}</span>
            )}
        </div>
    )
}

/**
 * Колонки таблицы файлов. На узких экранах часть колонок скрывается —
 * иначе таблица уезжает в горизонтальный скролл и обрезается по краю.
 *
 * @param {Object} handlers — обработчики действий над строкой
 * @param {{ hideSecondary?: boolean, hideTertiary?: boolean, hideRoles?: boolean }} [viewport]
 */
export const getFileColumns = (
    handlers,
    { hideSecondary = false, hideTertiary = false, hideRoles = false } = {}
) => [
    {
        key: 'name',
        label: 'Название',
        minWidth: hideRoles ? 168 : 240,
        render: (value, row) => (
            <button
                className="files-page__name"
                onClick={() => handlers.onOpen(row)}
                title={value}
                type="button"
            >
                <span className="files-page__name-title">{value}</span>
                {row.vectorData?.error && (
                    <span className="files-page__name-error" title={row.vectorData.error}>
                        {row.vectorData.error}
                    </span>
                )}
            </button>
        ),
    },
    {
        key: 'status',
        label: 'Статус',
        width: hideRoles ? 140 : 156,
        render: (value) => (
            <span className="files-page__status">
                <span className={`files-page__status-dot files-page__status-dot--${value}`} />
                <span className="files-page__cell-text">{STATUS_LABELS[value] ?? value}</span>
            </span>
        ),
    },
    {
        key: 'source',
        label: 'Источник',
        width: 132,
        hidden: hideTertiary,
        render: (value) => <span className="files-page__cell-text">{SOURCE_LABELS[value] ?? value}</span>,
    },
    {
        key: 'size',
        label: 'Размер',
        width: 96,
        hidden: hideSecondary,
        render: (_, row) => (
            <span className="files-page__cell-text">
                {formatFileSize(row.storage?.size ?? row.google?.size ?? null)}
            </span>
        ),
    },
    {
        key: 'accessibleByRoles',
        label: 'Роли',
        width: 224,
        hidden: hideRoles,
        render: (value) => <RolesCell roles={value} />,
    },
    {
        key: 'createdAt',
        label: 'Загружен',
        width: 108,
        hidden: hideSecondary,
        render: (value) => (
            <span className="files-page__cell-text" title={formatDate(value)}>
                {formatDateShort(value)}
            </span>
        ),
    },
    {
        key: '_id',
        label: '',
        actions: true,
        render: (_, row) => <DropdownActions actions={getFileActions(handlers, row)} />,
    },
].filter((column) => !column.hidden)
