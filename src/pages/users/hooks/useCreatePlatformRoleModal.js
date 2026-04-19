import { useState } from 'react'
import usePlatformRoleStore from '@store/platformRole'
import usePermissionsStore from '@store/permissions'

export function useCreatePlatformRoleModal() {
    const createRole = usePlatformRoleStore((s) => s.createRole)
    const fetchPermissions = usePermissionsStore((s) => s.fetchPermissions)

    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedPermissions, setSelectedPermissions] = useState([])
    const [permissionOptions, setPermissionOptions] = useState([])
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [touched, setTouched] = useState({ name: false, permissions: false })

    const open = async () => {
        setIsOpen(true)
        setIsLoadingPermissions(true)
        try {
            const data = await fetchPermissions()
            const flat = data.flatMap((group) =>
                group.actions.map((a) => ({ value: a.key, label: a.label }))
            )
            setPermissionOptions(flat)
        } finally {
            setIsLoadingPermissions(false)
        }
    }

    const close = () => {
        setIsOpen(false)
        setName('')
        setDescription('')
        setSelectedPermissions([])
        setPermissionOptions([])
        setTouched({ name: false, permissions: false })
    }

    const handleCreate = async () => {
        setTouched({ name: true, permissions: true })
        if (!name.trim() || !selectedPermissions.length) return

        setIsCreating(true)
        try {
            await createRole({
                name: name.trim(),
                description: description.trim(),
                permissions: selectedPermissions,
            })
            close()
        } finally {
            setIsCreating(false)
        }
    }

    return {
        isOpen, open, close,
        name, setName,
        description, setDescription,
        selectedPermissions, setSelectedPermissions,
        permissionOptions,
        isLoadingPermissions,
        isCreating,
        touched,
        handleCreate,
    }
}
