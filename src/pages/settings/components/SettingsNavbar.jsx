import { useNavbar } from '@layout/Navbar/Navbar'
import useProfileStore from '@store/profile'
import { SETTINGS_SECTIONS } from '../Settings.constants'

export function SettingsNavbar({ activeSection, onSelect }) {
    const { setIsOpen, isMobile } = useNavbar()
    // Подписываемся именно на permissions: checkPermission — стабильная ссылка,
    // и без этого меню не перерисуется, когда профиль догрузится
    const permissions = useProfileStore((s) => s.permissions)

    const handleSelect = (id) => {
        onSelect?.(id)
        if (isMobile()) setIsOpen(false)
    }

    const visible = SETTINGS_SECTIONS.filter(({ permission }) => permissions.includes(permission))

    return (
        <div className="settings-page__navbar">
            <p className="settings-page__navbar__label">НАСТРОЙКИ</p>
            <ul className="settings-page__navbar__list" role="list">
                {visible.map(({ id, label }) => (
                    <li key={id}>
                        <div
                            className={`settings-page__navbar__item${activeSection === id ? ' settings-page__navbar__item--active' : ''}`}
                            onClick={() => handleSelect(id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') handleSelect(id)
                            }}
                        >
                            {label}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
