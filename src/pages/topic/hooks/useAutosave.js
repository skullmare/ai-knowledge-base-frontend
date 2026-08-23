import { useState, useEffect, useRef, useCallback } from 'react'

const AUTOSAVE_DELAY = 1000

export const useAutosave = (id, currentTopic, updateTopic) => {
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedRoles, setSelectedRoles] = useState([])
  const autosaveTimerRef = useRef(null)

  useEffect(() => {
    if (currentTopic) {
      setName(currentTopic.name ?? '')
      setSelectedCategory(currentTopic.metadata?.category?._id ?? null)
      setSelectedRoles(currentTopic.metadata?.accessibleByRoles?.map((r) => r._id) ?? [])
    }
  }, [currentTopic])

  const scheduleAutosave = useCallback((overrides = {}) => {
    clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => {
      const n = overrides.name ?? name
      const cat = overrides.selectedCategory !== undefined ? overrides.selectedCategory : selectedCategory
      const r = overrides.selectedRoles ?? selectedRoles
      
      if (!n.trim() || !cat || !r.length) return
      
      updateTopic(id, {
        name: n,
        metadata: {
          ...currentTopic?.metadata,
          category: cat,
          accessibleByRoles: r,
        },
      })
    }, AUTOSAVE_DELAY)
  }, [id, name, selectedCategory, selectedRoles, currentTopic, updateTopic])

  const handleNameChange = useCallback((e) => {
    const val = e.target.value
    setName(val)
    scheduleAutosave({ name: val })
  }, [scheduleAutosave])

  const handleCategoryChange = useCallback((val) => {
    setSelectedCategory(val)
    scheduleAutosave({ selectedCategory: val })
  }, [scheduleAutosave])

  const handleRolesChange = useCallback((val) => {
    setSelectedRoles(val)
    scheduleAutosave({ selectedRoles: val })
  }, [scheduleAutosave])

  useEffect(() => {
    return () => clearTimeout(autosaveTimerRef.current)
  }, [])

  return {
    name,
    selectedCategory,
    selectedRoles,
    handleNameChange,
    handleCategoryChange,
    handleRolesChange,
  }
}