import { useState } from 'react'
import useFileStore from '@store/file'

const initialState = { file: null, name: '', roles: [] }

export function useUploadFileModal() {
    const createFile = useFileStore((s) => s.createFile)
    const isLoadingCreateFile = useFileStore((s) => s.isLoadingCreateFile)

    const [isOpen, setIsOpen] = useState(false)
    const [file, setFile] = useState(initialState.file)
    const [name, setName] = useState(initialState.name)
    const [roles, setRoles] = useState(initialState.roles)
    const [progress, setProgress] = useState(0)
    const [touched, setTouched] = useState({ file: false, name: false, roles: false })

    const open = () => {
        setFile(initialState.file)
        setName(initialState.name)
        setRoles(initialState.roles)
        setProgress(0)
        setTouched({ file: false, name: false, roles: false })
        setIsOpen(true)
    }

    const close = () => setIsOpen(false)

    const handleFileChange = (selected) => {
        setFile(selected)
        setTouched((t) => ({ ...t, file: true }))
        // Имя по умолчанию — имя файла, но пользователь может его переопределить
        if (selected && !name.trim()) setName(selected.name)
    }

    const handleUpload = async () => {
        setTouched({ file: true, name: true, roles: true })
        if (!file || !name.trim()) return

        try {
            await createFile(file, {
                name: name.trim(),
                accessibleByRoles: roles,
                onProgress: setProgress,
            })
            setIsOpen(false)
        } catch {
            // сообщение об ошибке показывает снекбар
        }
    }

    return {
        isOpen, open, close,
        file, handleFileChange,
        name, setName,
        roles, setRoles,
        progress,
        touched,
        isUploading: isLoadingCreateFile,
        handleUpload,
    }
}
