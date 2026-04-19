import { useState } from 'react'
import useAgentRoleStore from '@store/agentRole'

export function useEditAgentRoleModal() {
    const updateRole = useAgentRoleStore((s) => s.updateRole)

    const [isOpen, setIsOpen] = useState(false)
    const [roleId, setRoleId] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [original, setOriginal] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [touched, setTouched] = useState({ name: false })

    const open = (role) => {
        setRoleId(role._id)
        setName(role.name ?? '')
        setDescription(role.description ?? '')
        setOriginal({
            name: role.name ?? '',
            description: role.description ?? '',
        })
        setTouched({ name: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setRoleId(null)
        setName('')
        setDescription('')
        setOriginal(null)
        setTouched({ name: false })
    }

    const handleSave = async () => {
        setTouched({ name: true })
        if (!name.trim()) return

        const patch = {}
        if (name.trim() !== original.name.trim()) patch.name = name.trim()
        if (description.trim() !== original.description.trim()) patch.description = description.trim()

        if (!Object.keys(patch).length) {
            close()
            return
        }

        setIsSaving(true)
        try {
            await updateRole(roleId, patch)
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
