import { useState, useEffect, createContext, useContext } from 'react';
import Logo from '@assets/images/logo.svg';
import Close from '@assets/icons/close-16.svg';
import './Navbar.css';

const NavbarContext = createContext(null);

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within Navbar');
  }
  return context;
}

const BREAKPOINT = 1000;
const isMobile = () => window.innerWidth < BREAKPOINT;

export default function Navbar({
  children,
  header,
  footer,
  onOpen,
  isInitiallyOpen
}) {
  const [isOpen, setIsOpen] = useState(() =>
    isInitiallyOpen ?? !isMobile()
  );

  useEffect(() => {
    onOpen?.(() => setIsOpen(true));
  }, [onOpen]);

  const handleClose = () => isMobile() && setIsOpen(false);

  return (
    <NavbarContext.Provider value={{ isOpen, setIsOpen, isMobile: isMobile }}>
      <>
        <div
          className={`navbar__backdrop${isOpen ? ' navbar__backdrop--visible' : ''}`}
          onClick={handleClose}
          aria-hidden="true"
        />

        <nav className={`navbar${isOpen ? ' navbar--open' : ''}`}>
          <div className="navbar__header">
            {header || (
              <>
                <Logo width="87px" />
                <button className="navbar__close" onClick={handleClose}>
                  <Close width="20px" height="20px" />
                </button>
              </>
            )}
          </div>

          <div className="navbar__scroll">
            {children}
          </div>

          {footer ? <div className="navbar__footer">{footer}</div> : undefined}
        </nav>
      </>
    </NavbarContext.Provider>
  );
}