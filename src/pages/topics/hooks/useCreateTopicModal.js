import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useCreateTopicModal(createTopic) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedRoles, setSelectedRoles] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [touched, setTouched] = useState({ name: false, category: false, roles: false })

    const open = () => setIsOpen(true)

    const close = () => {
        setIsOpen(false)
        setName('')
        setSelectedCategory(null)
        setSelectedRoles([])
        setTouched({ name: false, category: false, roles: false })
    }

    const handleCreate = async () => {
        setTouched({ name: true, category: true, roles: true })
        if (!name.trim() || !selectedCategory || !selectedRoles.length) return

        setIsCreating(true)
        try {
            const topic = await createTopic({
                name: name.trim(),
                metadata: {
                    category: selectedCategory,
                    accessibleByRoles: selectedRoles,
                },
            })
            close()
            navigate(`/topic/${topic._id}`)
        } finally {
            setIsCreating(false)
        }
    }

    return {
        isOpen, open, close,
        name, setName,
        selectedCategory, setSelectedCategory,
        selectedRoles, setSelectedRoles,
        isCreating,
        touched,
        handleCreate,
    }
}