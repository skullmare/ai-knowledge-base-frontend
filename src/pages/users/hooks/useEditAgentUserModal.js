import { useState } from 'react'

export function useEditAgentUserModal(updateUser) {
    const [isOpen, setIsOpen] = useState(false)
    const [userId, setUserId] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [touched, setTouched] = useState({ role: false })

    const open = (user) => {
        setUserId(user._id)
        setSelectedRole(user.role?._id ?? null)
        setTouched({ role: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setUserId(null)
        setSelectedRole(null)
        setTouched({ role: false })
    }

    const handleSave = async () => {
        setTouched({ role: true })
        if (!selectedRole) return

        setIsSaving(true)
        try {
            await updateUser(userId, { role: selectedRole })
            close()
        } finally {
            setIsSaving(false)
        }
    }

    return {
        isOpen, open, close,
        selectedRole, setSelectedRole,
        isSaving,
        touched,
        handleSave,
    }
}