import { useState } from 'react'

export function useCreateCategoryModal(createCategory) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [touched, setTouched] = useState({ name: false, description: false })

    const open = () => setIsOpen(true)

    const close = () => {
        setIsOpen(false)
        setName('')
        setDescription('')
        setTouched({ name: false, description: false })
    }

    const handleCreate = async () => {
        setTouched({ name: true, description: true })
        if (!name.trim() || !description.trim()) return

        setIsCreating(true)
        try {
            await createCategory({ name: name.trim(), description: description.trim() })
            close()
        } finally {
            setIsCreating(false)
        }
    }

    return {
        isOpen, open, close,
        name, setName,
        description, setDescription,
        isCreating,
        touched,
        handleCreate,
    }
}