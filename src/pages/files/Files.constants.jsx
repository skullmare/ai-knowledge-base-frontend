import DropdownActions from '@ui/DropdownActions/DropdownActions'
import DoubleCheck from '@assets/icons/double-check-24.svg'
import Minus from '@assets/icons/minus-16.svg'
import Edit from '@assets/icons/edit-16.svg'
import Delete from '@assets/icons/delete-16.svg'
import Archive from '@assets/icons/archive-16.svg'
import Catalogue from '@assets/icons/catalogue-16.svg'

export { NAV_LINKS } from '@/constants/navLinks'

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

export const getFileColumns = (handlers) => [
    {
        key: 'name',
        label: 'Название',
        render: (value, row) => (
            <button className="files-page__table-name" onClick={() => handlers.onOpen(row)}>
                {value}
                {row.vectorData?.error && (
                    <span className="files-page__table-error" title={row.vectorData.error}>
                        {row.vectorData.error}
                    </span>
                )}
            </button>
        ),
    },
    {
        key: 'status',
        label: 'Статус',
        render: (value) => (
            <span className="files-page__status">
                <span className={`files-page__status-dot files-page__status-dot--${value}`} />
                {STATUS_LABELS[value] ?? value}
            </span>
        ),
    },
    {
        key: 'source',
        label: 'Источник',
        render: (value) => SOURCE_LABELS[value] ?? value,
    },
    {
        key: 'size',
        label: 'Размер',
        render: (_, row) => formatFileSize(row.storage?.size ?? row.google?.size ?? null),
    },
    {
        key: 'accessibleByRoles',
        label: 'Роли',
        render: (value) =>
            value?.length ? (
                <div className="files-page__table-roles">
                    {value.map((role) => (
                        <span key={role._id} className="files-page__table-role-tag">{role.name}</span>
                    ))}
                </div>
            ) : (
                '—'
            ),
    },
    {
        key: 'createdAt',
        label: 'Загружен',
        render: (value) => formatDate(value),
    },
    {
        key: '_id',
        label: '',
        actions: true,
        render: (_, row) => <DropdownActions actions={getFileActions(handlers, row)} />,
    },
]
