import { useRef, useCallback, cloneElement } from 'react';
import './Layout.css';

export default function Layout({ navbar, header, children }) {
  const openNavbarRef = useRef(null);

  const handleNavbarReady = useCallback((openFn) => {
    openNavbarRef.current = openFn;
  }, []);

  return (
    <div className="layout">
      {navbar && cloneElement(navbar, { onOpen: handleNavbarReady })}
      <div className="layout__right">
        <div className="layout__header">
          {header && cloneElement(header, { onOpenNavbar: () => openNavbarRef.current?.() })}
        </div>
        <main className="layout__content">{children}</main>
      </div>
    </div>
  );
}