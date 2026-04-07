import { useNavbar } from '@layout/Navbar/Navbar';
import '../Topics.css';

export function TopicsNavbar({ sections = [], activeSection, onSelect }) {
    const { setIsOpen, isMobile } = useNavbar();
    const handleClose = () => isMobile() && setIsOpen(false);
    const handleSelect = (id) => {
        onSelect?.(id);
        handleClose();
    };
    return (
        <>
            <p className="topics-page__navbar__label">РАЗДЕЛЫ</p>
            <ul className="topics-page__navbar__list" role="list">
                {sections.map(({ id, label }) => (
                    <li key={id}>
                        <button
                            className={`topics-page__navbar__item${activeSection === id ? ' topics-page__navbar__item--active' : ''}`}
                            onClick={() => handleSelect(id)}
                            aria-current={activeSection === id ? 'page' : undefined}
                        >
                            {label}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}