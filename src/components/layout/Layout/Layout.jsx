import { useState, useCallback, cloneElement } from 'react';
import './Layout.css';

export default function Layout({ navbar, header, children }) {
  const [openNavbar, setOpenNavbar] = useState(null);

  // Функция открытия хранится в состоянии, а не в ref: ref нельзя читать
  // во время рендера, а header получает обработчик именно там.
  const handleNavbarReady = useCallback((openFn) => setOpenNavbar(() => openFn), []);

  return (
    <div className="layout">
      {navbar && cloneElement(navbar, { onOpen: handleNavbarReady })}
      <div className="layout__right">
        <div className="layout__header">
          {header && cloneElement(header, navbar ? { onOpenNavbar: openNavbar } : {})}
        </div>
        <main className="layout__content">{children}</main>
      </div>
    </div>
  );
}
