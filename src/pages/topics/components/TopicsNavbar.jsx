import { useState, useEffect } from 'react';
import Logo from '@assets/images/logo.svg';
import Close from '@assets/icons/close-16.svg';
import './Navbar.css';

const BREAKPOINT = 1000;
const isMobile = () => window.innerWidth < BREAKPOINT;

export default function Navbar({ sections = [], activeSection, onSelect, onOpen }) {
    const [isOpen, setIsOpen] = useState(() => !isMobile());

    useEffect(() => {
        onOpen?.(() => setIsOpen(true));
    }, [onOpen]);

    const handleClose = () => isMobile() && setIsOpen(false);

    const handleSelect = (id) => {
        onSelect?.(id);
        handleClose();
    };

    return (
        <>
            <p className="navbar__label">РАЗДЕЛЫ</p>
            <ul className="navbar__list" role="list">
                {sections.map(({ id, label }) => (
                    <li key={id}>
                        <button
                            className={`navbar__item${activeSection === id ? ' navbar__item--active' : ''}`}
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