import { useState, useEffect } from 'react'

export function useFilesFilters() {
    const [activeSection, setActiveSectionState] = useState('files')
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 450)
        return () => clearTimeout(timer)
    }, [search])

    // Поиск у вкладок разный — при переключении начинаем с чистого поля
    const setActiveSection = (section) => {
        setActiveSectionState(section)
        setSearch('')
        setDebouncedSearch('')
    }

    return {
        activeSection, setActiveSection,
        search, setSearch,
        debouncedSearch,
        selectedRole, setSelectedRole,
        selectedStatus, setSelectedStatus,
    }
}
