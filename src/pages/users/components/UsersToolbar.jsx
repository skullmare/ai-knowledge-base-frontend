import Button from '@ui/Button/Button'
import Input from '@ui/Input/Input'
import Protected from '@guards/Protected'
import Plus from '@assets/icons/plus-16.svg'

export function UsersToolbar({
    activeSection,
    search, onSearchChange,
    onCreatePlatformRole, onCreatePlatformUser,
    onCreateAgentRole,
}) {
    const isPlatform = activeSection === 'platform'

    return (
        <div className="users-page__toolbar">
            <h1 className="users-page__title">Управление пользователями</h1>
            <div className="users-page__controls">
                <div className="users-page__controls-search">
                    <Input
                        variant="search"
                        size="medium"
                        placeholder={isPlatform ? 'Поиск по сотрудникам' : 'Поиск по пользователям'}
                        showClearButton={true}
                        showSearchButton
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                {isPlatform ? (
                    <>
                        <Protected permission="platformRoles.create" mode="some">
                            <div className="users-page__controls-btn">
                                <Button size="interface" variant="secondary" onClick={onCreatePlatformRole}>
                                    <Plus />Создать роль
                                </Button>
                            </div>
                        </Protected>
                        <Protected permission="platformUsers.create" mode="some">
                            <div className="users-page__controls-btn">
                                <Button size="interface" variant="primary" onClick={onCreatePlatformUser}>
                                    <Plus />Создать сотрудника
                                </Button>
                            </div>
                        </Protected>
                    </>
                ) : (
                    <Protected permission="agentRoles.create" mode="some">
                        <div className="users-page__controls-btn">
                            <Button size="interface" variant="secondary" onClick={onCreateAgentRole}>
                                <Plus />Создать роль
                            </Button>
                        </div>
                    </Protected>
                )}
            </div>
        </div>
    )
}
