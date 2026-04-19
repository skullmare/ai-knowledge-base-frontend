import { useState } from 'react'

export function useEditAgentUserModal(updateUser) {
    const [isOpen, setIsOpen] = useState(false)
    const [userId, setUserId] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)
    const [status, setStatus] = useState('active')
    const [original, setOriginal] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [touched, setTouched] = useState({ role: false })

    const open = (user) => {
        setUserId(user._id)
        setSelectedRole(user.role?._id ?? null)
        setStatus(user.status ?? 'active')
        setOriginal({
            role: user.role?._id ?? null,
            status: user.status ?? 'active',
        })
        setTouched({ role: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setUserId(null)
        setSelectedRole(null)
        setStatus('active')
        setOriginal(null)
        setTouched({ role: false })
    }

    const handleSave = async () => {
        setTouched({ role: true })
        if (!selectedRole) return

        const isPending = original.status === 'pending'
        const patch = {}

        if (selectedRole !== original.role) patch.role = selectedRole
        if (!isPending && status !== original.status) patch.status = status

        if (!Object.keys(patch).length) {
            close()
            return
        }

        setIsSaving(true)
        try {
            await updateUser(userId, patch)
            close()
        } finally {
            setIsSaving(false)
        }
    }

    return {
        isOpen, open, close,
        selectedRole, setSelectedRole,
        status, setStatus,
        isPending: status === 'pending',
        isSaving,
        touched,
        handleSave,
    }
}
