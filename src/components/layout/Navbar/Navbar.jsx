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
      <div
        className={`navbar__backdrop${isOpen ? ' navbar__backdrop--visible' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <nav className={`navbar${isOpen ? ' navbar--open' : ''}`} aria-label="Разделы">
        <div className="navbar__header">
          <Logo width="87px" />
          <button className="navbar__close" onClick={handleClose} aria-label="Закрыть меню">
            <Close width="20px" height="20px" />
          </button>
        </div>

        <div className="navbar__scroll">
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
        </div>
      </nav>
    </>
  );
}