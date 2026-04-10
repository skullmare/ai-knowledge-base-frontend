import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@ui/Button/Button';
import HasPermission from '@guards/Protected';
import More from '@assets/icons/more-vertical-16.svg';
import List from '@assets/icons/list-16.svg';
import Logo from '@assets/images/logo.svg';
import './Header.css';

const Header = ({ navLinks = [], activeLink, onLogout, userLogin, userRole, onOpenNavbar, logo = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const dotsBtnRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = ({ target }) => {
      if (
        isMenuOpen &&
        !menuRef.current?.contains(target) &&
        !dotsBtnRef.current?.contains(target)
      ) closeMenu();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 1000) closeMenu(); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderLinks = (mobile = false) =>
    navLinks.map(({ to, label, desktopLabel, permission, permissionMode }) => {
      const link = (
        <Link
          key={to}
          to={to}
          className={`${mobile ? 'mobile-nav-link' : 'nav-link'}${activeLink === to ? ' active' : ''}`}
          onClick={mobile ? closeMenu : undefined}
        >
          {mobile ? label : (desktopLabel ?? label)}
        </Link>
      );

      return permission
        ? <HasPermission key={to} permission={permission} mode={permissionMode}>{link}</HasPermission>
        : link;
    });

  return (
    <header className="header-component">

      {logo ? <Logo width="87px" /> : undefined}

      <nav>{renderLinks()}</nav>

      <div className="profile-block">
        <Link to="/profile" className="user-data-block">
          <span className="login">{userLogin}</span>
          <span className="role">{userRole}</span>
        </Link>
        <Button size="logout" onClick={onLogout}>Выйти</Button>
      </div>

      <div className="header-mobile-actions">
        {
          onOpenNavbar ? <button className="navbar__hamburger-inline" onClick={onOpenNavbar} aria-label="Открыть меню">
            <List className="navbar__hamburger-inline-icon" width="20px" height="20px" />
          </button> : undefined
        }

        <button ref={dotsBtnRef} className="menu-dots-btn" onClick={() => setIsMenuOpen(v => !v)} aria-label="Меню">
          <More className="menu-dots-btn-icon" width="20px" height="20px" />
        </button>
      </div>

      <div className={`mobile-menu-widget${isMenuOpen ? ' active' : ''}`} ref={menuRef}>
        <div className="mobile-profile">
          <Link to="/profile">
            <span className="mobile-login">{userLogin}</span>
            <span className="mobile-role">{userRole}</span>
          </Link>
          <Button size="logout" onClick={onLogout}>Выйти</Button>
        </div>
        <div className="mobile-nav-links">{renderLinks(true)}</div>
      </div>

      <div className={`menu-overlay${isMenuOpen ? ' active' : ''}`} onClick={closeMenu} />
    </header>
  );
};

export default Header;