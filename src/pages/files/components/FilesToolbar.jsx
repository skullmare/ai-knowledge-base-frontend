import Button from '@ui/Button/Button'
import Input from '@ui/Input/Input'
import Dropdown from '@ui/Dropdown/Dropdown'
import Protected from '@guards/Protected'
import Plus from '@assets/icons/plus-16.svg'

const STATUS_OPTIONS = [
    { value: null, label: 'Все статусы' },
    { value: 'indexed', label: 'Векторизован' },
    { value: 'uploaded', label: 'Не векторизован' },
    { value: 'indexing', label: 'В обработке' },
    { value: 'error', label: 'Ошибка' },
]

export function FilesToolbar({
    title,
    searchPlaceholder,
    search,
    onSearchChange,
    roleOptions,
    selectedRole,
    onRoleChange,
    selectedStatus,
    onStatusChange,
    onAddFile,
}) {
    return (
        <div className="files-page__toolbar">
            <h1 className="files-page__title">{title}</h1>
            <div className="files-page__controls">
                {roleOptions && (
                    <div className="files-page__controls-filter">
                        <Dropdown options={roleOptions} value={selectedRole} onChange={onRoleChange} />
                    </div>
                )}
                {onStatusChange && (
                    <div className="files-page__controls-filter">
                        <Dropdown options={STATUS_OPTIONS} value={selectedStatus} onChange={onStatusChange} />
                    </div>
                )}
                <div className="files-page__controls-search">
                    <Input
                        variant="search"
                        size="medium"
                        placeholder={searchPlaceholder}
                        showClearButton
                        showSearchButton
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                {onAddFile && (
                    <Protected permission="files.upload">
                        <div className="files-page__controls-btn">
                            <Button size="interface" variant="primary" onClick={onAddFile}>
                                <Plus />Добавить файл
                            </Button>
                        </div>
                    </Protected>
                )}
            </div>
        </div>
    )
}
