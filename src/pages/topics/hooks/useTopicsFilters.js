import { useState, useEffect } from 'react'

export function useTopicsFilters() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)
    const [viewMode, setViewMode] = useState('list')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 450)
        return () => clearTimeout(timer)
    }, [search])

    return {
        activeCategory, setActiveCategory,
        search, setSearch,
        debouncedSearch,
        selectedRole, setSelectedRole,
        viewMode, setViewMode,
    }
}