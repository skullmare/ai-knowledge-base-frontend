import Input from '@ui/Input/Input'
import Dropdown from '@ui/Dropdown/Dropdown'

const STATUS_OPTIONS = [
    { value: null, label: 'Все статусы' },
    { value: 'success', label: 'Успешно' },
    { value: 'error', label: 'Ошибка' },
]

export function LogsToolbar({
    search, onSearchChange,
    status, onStatusChange,
    startDate, onStartDateChange,
    endDate, onEndDateChange,
}) {
    return (
        <div className="logs-page__toolbar">
            <h1 className="logs-page__title">Лента событий</h1>
            <div className="logs-page__controls">
                <div className="logs-page__controls-search">
                    <Input
                        variant="search"
                        size="medium"
                        placeholder="Поиск по сообщению"
                        showClearButton
                        showSearchButton
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="logs-page__controls-status">
                    <Dropdown
                        options={STATUS_OPTIONS}
                        value={status}
                        onChange={onStatusChange}
                        placeholder="Все статусы"
                    />
                </div>
                <div className="logs-page__controls-date">
                    <input
                        className="logs-page__date-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        title="Дата начала"
                        placeholder="Дата начала"
                    />
                </div>
                <div className="logs-page__controls-date">
                    <input
                        className="logs-page__date-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        title="Дата конца"
                        placeholder="Дата конца"
                    />
                </div>
            </div>
        </div>
    )
}
