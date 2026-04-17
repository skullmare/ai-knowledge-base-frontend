import { useState } from 'react'
import useAgentRoleStore from '@store/agentRole'

export function useEditAgentRoleModal() {
    const updateRole = useAgentRoleStore((s) => s.updateRole)

    const [isOpen, setIsOpen] = useState(false)
    const [roleId, setRoleId] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [touched, setTouched] = useState({ name: false })

    const open = (role) => {
        setRoleId(role._id)
        setName(role.name ?? '')
        setDescription(role.description ?? '')
        setTouched({ name: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setRoleId(null)
        setName('')
        setDescription('')
        setTouched({ name: false })
    }

    const handleSave = async () => {
        setTouched({ name: true })
        if (!name.trim()) return

        setIsSaving(true)
        try {
            await updateRole(roleId, {
                name: name.trim(),
                description: description.trim(),
            })
            close()
        } finally {
            setIsSaving(false)
        }
    }

    return {
        isOpen, open, close,
        name, setName,
        description, setDescription,
        isSaving,
        touched,
        handleSave,
    }
}
