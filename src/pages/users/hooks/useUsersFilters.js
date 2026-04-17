import { useState, useEffect } from 'react'
// import { useDebounce } from '@hooks/useDebounce'

export function useUsersFilters() {
    const [activeSection, setActiveSection] = useState('platform')
    const [search, setSearch] = useState('')
    // const debouncedSearch = useDebounce(search, 400)

    // Сбрасываем поиск при переключении вкладки
    useEffect(() => {
        setSearch('')
    }, [activeSection])

    return {
        activeSection,
        setActiveSection,
        search,
        setSearch,
        // debouncedSearch,
    }
}