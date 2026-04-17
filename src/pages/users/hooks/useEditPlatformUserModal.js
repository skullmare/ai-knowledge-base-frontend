import { useState } from 'react'

export function useEditPlatformUserModal(updateUser) {
    const [isOpen, setIsOpen] = useState(false)
    const [userId, setUserId] = useState(null)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)
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
        setTouched({ firstName: false, lastName: false, login: false, email: false, role: false })
    }

    const handleSave = async () => {
        setTouched({ firstName: true, lastName: true, login: true, email: true, role: true })
        if (!firstName.trim() || !lastName.trim() || !login.trim() || !email.trim() || !selectedRole) return

        setIsSaving(true)
        try {
            await updateUser(userId, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                login: login.trim(),
                email: email.trim(),
                photoUrl: photoUrl.trim(),
                role: selectedRole,
            })
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
        isSaving,
        touched,
        handleSave,
    }
}