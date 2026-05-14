import { useState, useEffect } from 'react'

export function useLogsFilters() {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedAction, setSelectedAction] = useState(null)
    const [selectedGroupId, setSelectedGroupId] = useState(null)
    const [status, setStatus] = useState(null)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 450)
        return () => clearTimeout(timer)
    }, [search])

    const handleGroupSelect = (groupId) => {
        if (selectedGroupId === groupId && selectedAction === null) {
            setSelectedGroupId(null)
        } else {
            setSelectedGroupId(groupId)
            setSelectedAction(null)
        }
    }

    const handleItemSelect = (groupId, itemId) => {
        if (selectedAction === itemId) {
            setSelectedAction(null)
            setSelectedGroupId(null)
        } else {
            setSelectedAction(itemId)
            setSelectedGroupId(groupId)
        }
    }

    const clearFilters = () => {
        setSelectedAction(null)
        setSelectedGroupId(null)
        setStatus(null)
        setStartDate('')
        setEndDate('')
        setSearch('')
    }

    return {
        search, setSearch,
        debouncedSearch,
        selectedAction,
        selectedGroupId,
        handleGroupSelect,
        handleItemSelect,
        clearFilters,
        status, setStatus,
        startDate, setStartDate,
        endDate, setEndDate,
    }
}
