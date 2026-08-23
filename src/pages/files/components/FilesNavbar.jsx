import { useNavbar } from '@layout/Navbar/Navbar'
import useProfileStore from '@store/profile'

const SECTIONS = [
    { id: 'files', label: 'Файлы', permission: 'files.read' },
    { id: 'googleDrive', label: 'Google Drive', permission: 'googleDrive.read' },
]

export function FilesNavbar({ activeSection, onSelect }) {
    const { setIsOpen, isMobile } = useNavbar()
    // Подписываемся именно на permissions: checkPermission — стабильная ссылка,
    // и без этого меню не перерисуется, когда профиль догрузится
    const permissions = useProfileStore((s) => s.permissions)

    const handleSelect = (id) => {
        onSelect?.(id)
        if (isMobile()) setIsOpen(false)
    }

    const visible = SECTIONS.filter(({ permission }) => permissions.includes(permission))

    return (
        <div className="files-page__navbar">
            <p className="files-page__navbar__label">ИСТОЧНИКИ</p>
            <ul className="files-page__navbar__list" role="list">
                {visible.map(({ id, label }) => (
                    <li key={id} className="files-page__navbar__item-wrapper">
                        <div
                            className={`files-page__navbar__item${activeSection === id ? ' files-page__navbar__item--active' : ''}`}
                            onClick={() => handleSelect(id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') handleSelect(id)
                            }}
                        >
                            <span className="files-page__navbar__item-label">{label}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
