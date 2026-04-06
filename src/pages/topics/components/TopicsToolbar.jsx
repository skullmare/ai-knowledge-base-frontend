import Button from '@ui/Button/Button'
import Input from '@ui/Input/Input'
import Protected from '@guards/Protected'
import Dropdown from '@ui/Dropdown/Dropdown'
import Catalogue from '@assets/icons/catalogue-16.svg'
import List from '@assets/icons/list-16.svg'
import Plus from '@assets/icons/plus-16.svg'

export function TopicsToolbar({
    roleOptions, selectedRole, onRoleChange,
    search, onSearchChange,
    viewMode, onViewModeChange,
    onCreateCategory, onCreateTopic,
}) {
    return (
        <div className="topics-page__toolbar">
            <h1 className="topics-page__title">Управление данными</h1>
            <div className="topics-page__controls">
                <div className="topics-page__controls-filter">
                    <Dropdown options={roleOptions} value={selectedRole} onChange={onRoleChange} />
                </div>
                <div className="topics-page__controls-search">
                    <Input
                        variant="search"
                        size="medium"
                        placeholder="Поиск по темам"
                        showSearchButton
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Protected permission="agentRoles.create" mode="some">
                    <div className="topics-page__controls-btn">
                        <Button size="interface" variant="secondary" onClick={onCreateCategory}>
                            <Plus />Создать раздел
                        </Button>
                    </div>
                </Protected>
                <Protected permission="topics.create" mode="some">
                    <div className="topics-page__controls-btn">
                        <Button size="interface" variant="primary" onClick={onCreateTopic}>
                            <Plus />Создать тему
                        </Button>
                    </div>
                </Protected>
                <div className="topics-page__controls-btn-mode-container">
                    <button
                        className={`topics-page__controls-btn-mode ${viewMode === 'catalogue' ? 'topics-page__controls-btn-mode--active' : ''}`}
                        onClick={() => onViewModeChange('catalogue')}
                    >
                        <Catalogue width="20px" height="20px" />
                    </button>
                    <button
                        className={`topics-page__controls-btn-mode ${viewMode === 'list' ? 'topics-page__controls-btn-mode--active' : ''}`}
                        onClick={() => onViewModeChange('list')}
                    >
                        <List width="20px" height="20px" />
                    </button>
                </div>
            </div>
        </div>
    )
}