// hooks/useEditCategoryModal.js
import { useState } from 'react'

export function useEditCategoryModal(onUpdate, fetchTopics, buildParams, fetchCategories) {
    const [isOpen, setIsOpen] = useState(false)
    const [categoryId, setCategoryId] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [touched, setTouched] = useState({ name: false, description: false })
    const [isSaving, setIsSaving] = useState(false)

    const open = (category) => {
        setCategoryId(category._id)
        setName(category.name)
        setDescription(category.description ?? '')
        setTouched({ name: false, description: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setCategoryId(null)
        setName('')
        setDescription('')
    }

    const handleSave = async () => {
        setTouched({ name: true, description: true })
        if (!name.trim() || !description.trim()) return
        setIsSaving(true)
        try {
            await onUpdate(categoryId, { name, description })
            await Promise.all([fetchCategories(), fetchTopics(buildParams())])
            close()
        } finally {
            setIsSaving(false)
        }
    }

    return { isOpen, name, setName, description, setDescription, touched, isSaving, open, close, handleSave }
}