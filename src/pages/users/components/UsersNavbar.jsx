import { useNavbar } from '@layout/Navbar/Navbar'

const USER_SECTIONS = [
    { id: 'platform', label: 'Админка' },
    { id: 'agent', label: 'Агент' },
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
            <p className="users-page__navbar__label">ПОЛЬЗОВАТЕЛИ</p>
            <ul className="users-page__navbar__list" role="list">
                {USER_SECTIONS.map(({ id, label }) => (
                    <li key={id} className="users-page__navbar__item-wrapper">
                        <div
                            className={`users-page__navbar__item${activeSection === id ? ' users-page__navbar__item--active' : ''}`}
                            onClick={() => handleSelect(id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleSelect(id)
                                }
                            }}
                        >
                            <span className="users-page__navbar__item-label">{label}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}