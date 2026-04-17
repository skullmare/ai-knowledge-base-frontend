import { useState } from 'react'
import usePlatformUserStore from '@store/platformUser'

export function useCreatePlatformUserModal() {
    const createUser = usePlatformUserStore((s) => s.createUser)

    const [isOpen, setIsOpen] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        login: false,
        email: false,
        role: false,
    })

    const open = () => setIsOpen(true)

    const close = () => {
        setIsOpen(false)
        setFirstName('')
        setLastName('')
        setLogin('')
        setEmail('')
        setSelectedRole(null)
        setTouched({ firstName: false, lastName: false, login: false, email: false, role: false })
    }

    const handleCreate = async () => {
        setTouched({ firstName: true, lastName: true, login: true, email: true, role: true })
        if (!firstName.trim() || !lastName.trim() || !login.trim() || !email.trim() || !selectedRole) return

        setIsCreating(true)
        try {
            await createUser({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                login: login.trim(),
                email: email.trim(),
                role: selectedRole,
            })
            close()
        } finally {
            setIsCreating(false)
        }
    }

    return {
        isOpen, open, close,
        firstName, setFirstName,
        lastName, setLastName,
        login, setLogin,
        email, setEmail,
        selectedRole, setSelectedRole,
        isCreating,
        touched,
        handleCreate,
    }
}
