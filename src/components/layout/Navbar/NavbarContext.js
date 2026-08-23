import { createContext, useContext } from 'react';

// Контекст вынесен из Navbar.jsx: файл с компонентом должен экспортировать
// только компоненты, иначе ломается Fast Refresh.
export const NavbarContext = createContext(null);

export function useNavbar() {
    const context = useContext(NavbarContext);

    if (!context) {
        throw new Error('useNavbar must be used within Navbar');
    }

    return context;
}
