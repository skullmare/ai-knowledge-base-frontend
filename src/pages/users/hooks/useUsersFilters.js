import { useState, useEffect } from 'react'

const SEARCH_DEBOUNCE_MS = 400

export function useUsersFilters() {
    const [activeSection, setActiveSection] = useState('platform')
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [syncedSection, setSyncedSection] = useState(activeSection)

    // Сброс поиска при смене раздела — производное состояние, а не эффект:
    // так значение обновляется в том же рендере, без лишнего прохода.
    if (activeSection !== syncedSection) {
        setSyncedSection(activeSection)
        setSearch('')
        setDebouncedSearch('')
    }

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [search])

    return {
        activeSection,
        setActiveSection,
        search,
        setSearch,
        debouncedSearch,
    }
}
