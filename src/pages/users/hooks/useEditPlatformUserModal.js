import { useState } from 'react'
import { fileService } from '@services/file'

export function useEditPlatformUserModal(updateUser) {
    const [isOpen, setIsOpen] = useState(false)
    const [userId, setUserId] = useState(null)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)
    const [status, setStatus] = useState('active')
    const [original, setOriginal] = useState(null)
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        login: false,
        email: false,
        role: false,
    })

    const open = (user) => {
        setUserId(user._id)
        setFirstName(user.firstName ?? '')
        setLastName(user.lastName ?? '')
        setLogin(user.login ?? '')
        setEmail(user.email ?? '')
        setPhotoUrl(user.photoUrl ?? '')
        setSelectedRole(user.role?._id ?? null)
        setStatus(user.status ?? 'active')
        setOriginal({
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            login: user.login ?? '',
            email: user.email ?? '',
            photoUrl: user.photoUrl ?? '',
            role: user.role?._id ?? null,
            status: user.status ?? 'active',
        })
        setTouched({ firstName: false, lastName: false, login: false, email: false, role: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setUserId(null)
        setFirstName('')
        setLastName('')
        setLogin('')
        setEmail('')
        setPhotoUrl('')
        setSelectedRole(null)
        setStatus('active')
        setOriginal(null)
        setTouched({ firstName: false, lastName: false, login: false, email: false, role: false })
    }

    const handlePhotoUpload = async (file) => {
        if (!file) return
        setIsUploadingPhoto(true)
        try {
            const res = await fileService.upload(file)
            if (res.success) setPhotoUrl(res.data.url)
        } finally {
            setIsUploadingPhoto(false)
        }
    }

    const handleSave = async () => {
        setTouched({ firstName: true, lastName: true, login: true, email: true, role: true })
        if (!firstName.trim() || !lastName.trim() || !login.trim() || !email.trim() || !selectedRole) return

        const patch = {}
        if (firstName.trim() !== original.firstName.trim()) patch.firstName = firstName.trim()
        if (lastName.trim() !== original.lastName.trim()) patch.lastName = lastName.trim()
        if (login.trim() !== original.login.trim()) patch.login = login.trim()
        if (email.trim() !== original.email.trim()) patch.email = email.trim()
        if (photoUrl.trim() !== original.photoUrl.trim()) patch.photoUrl = photoUrl.trim()
        if (selectedRole !== original.role) patch.role = selectedRole
        if (status !== original.status) patch.status = status

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
        firstName, setFirstName,
        lastName, setLastName,
        login, setLogin,
        email, setEmail,
        photoUrl, setPhotoUrl,
        selectedRole, setSelectedRole,
        status, setStatus,
        isUploadingPhoto,
        handlePhotoUpload,
        isSaving,
        touched,
        handleSave,
    }
}
