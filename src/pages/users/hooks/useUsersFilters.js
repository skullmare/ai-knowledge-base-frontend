import { useState, useEffect } from 'react'

export function useUsersFilters() {
    const [activeSection, setActiveSection] = useState('platform')
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        setSearch('')
        setDebouncedSearch('')
    }, [activeSection])

    return {
        activeSection,
        setActiveSection,
        search,
        setSearch,
        debouncedSearch,
    }
}
