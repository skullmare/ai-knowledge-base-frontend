import { useState } from 'react'
import useAgentRoleStore from '@store/agentRole'

export function useCreateAgentRoleModal() {
    const createRole = useAgentRoleStore((s) => s.createRole)

    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [touched, setTouched] = useState({ name: false })

    const open = () => setIsOpen(true)

    const close = () => {
        setIsOpen(false)
        setName('')
        setDescription('')
        setTouched({ name: false })
    }

    const handleCreate = async () => {
        setTouched({ name: true })
        if (!name.trim()) return

        setIsCreating(true)
        try {
            await createRole({ name: name.trim(), description: description.trim() })
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
