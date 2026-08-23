import { useState } from 'react'
import useFileStore from '@store/file'

export function useEditFileModal() {
    const updateFile = useFileStore((s) => s.updateFile)
    const isSaving = useFileStore((s) => s.isLoadingUpdateFile)

    const [isOpen, setIsOpen] = useState(false)
    const [target, setTarget] = useState(null)
    const [name, setName] = useState('')
    const [roles, setRoles] = useState([])
    const [touched, setTouched] = useState({ name: false })

    const open = (file) => {
        setTarget(file)
        setName(file.name ?? '')
        setRoles((file.accessibleByRoles ?? []).map((r) => r._id ?? r))
        setTouched({ name: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setTarget(null)
    }

    const handleSave = async () => {
        setTouched({ name: true })
        if (!target || !name.trim()) return

        try {
            await updateFile(target._id, {
                name: name.trim(),
                accessibleByRoles: roles,
            })
            close()
        } catch {
            // сообщение об ошибке показывает снекбар
        }
    }

    return { isOpen, target, open, close, name, setName, roles, setRoles, touched, isSaving, handleSave }
}
