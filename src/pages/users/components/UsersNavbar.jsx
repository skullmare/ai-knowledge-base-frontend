import { useNavbar } from '@layout/Navbar/Navbar'

const NAVBAR_GROUPS = [
    {
        label: 'АДМИНКА',
        items: [
            { id: 'platform', label: 'Пользователи' },
            { id: 'platformRoles', label: 'Роли' },
        ],
    },
    {
        label: 'АГЕНТ',
        items: [
            { id: 'agent', label: 'Пользователи' },
            { id: 'agentRoles', label: 'Роли' },
        ],
    },
]

export function UsersNavbar({ activeSection, onSelect }) {
    const { setIsOpen, isMobile } = useNavbar()
    const handleClose = () => isMobile() && setIsOpen(false)

    const handleSelect = (id) => {
        onSelect?.(id)
        handleClose()
    }

    return (
        <>
            {NAVBAR_GROUPS.map(({ label, items }) => (
                <div className="users-page__navbar" key={label}>
                    <p className="users-page__navbar__label">{label}</p>
                    <ul className="users-page__navbar__list" role="list">
                        {items.map(({ id, label: itemLabel }) => (
                            <li key={id} className="users-page__navbar__item-wrapper">
                                <div
                                    className={`users-page__navbar__item${activeSection === id ? ' users-page__navbar__item--active' : ''}`}
                                    onClick={() => handleSelect(id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') handleSelect(id)
                                    }}
                                >
                                    <span className="users-page__navbar__item-label">{itemLabel}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    )
}
