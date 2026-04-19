import { useState } from 'react'
import usePlatformRoleStore from '@store/platformRole'
import { permissionsService } from '@services/permissions'

export function useEditPlatformRoleModal() {
    const updateRole = usePlatformRoleStore((s) => s.updateRole)

    const [isOpen, setIsOpen] = useState(false)
    const [roleId, setRoleId] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedPermissions, setSelectedPermissions] = useState([])
    const [permissionOptions, setPermissionOptions] = useState([])
    const [original, setOriginal] = useState(null)
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [touched, setTouched] = useState({ name: false, permissions: false })

    const open = async (role) => {
        setRoleId(role._id)
        setName(role.name ?? '')
        setDescription(role.description ?? '')
        const perms = Array.isArray(role.permissions) ? role.permissions : []
        setSelectedPermissions(perms)
        setOriginal({
            name: role.name ?? '',
            description: role.description ?? '',
            permissions: [...perms].sort(),
        })
        setTouched({ name: false, permissions: false })
        setIsOpen(true)

        setIsLoadingPermissions(true)
        try {
            const res = await permissionsService.getPermissions()
            const flat = res.data.flatMap((group) =>
                group.actions.map((a) => ({ value: a.key, label: a.label }))
            )
            setPermissionOptions(flat)
        } finally {
            setIsLoadingPermissions(false)
        }
    }

    const close = () => {
        setIsOpen(false)
        setRoleId(null)
        setName('')
        setDescription('')
        setSelectedPermissions([])
        setPermissionOptions([])
        setOriginal(null)
        setTouched({ name: false, permissions: false })
    }

    const handleSave = async () => {
        setTouched({ name: true, permissions: true })
        if (!name.trim() || !selectedPermissions.length) return

        const patch = {}
        if (name.trim() !== original.name.trim()) patch.name = name.trim()
        if (description.trim() !== original.description.trim()) patch.description = description.trim()
        if (JSON.stringify([...selectedPermissions].sort()) !== JSON.stringify(original.permissions)) {
            patch.permissions = selectedPermissions
        }

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
        selectedPermissions, setSelectedPermissions,
        permissionOptions,
        isLoadingPermissions,
        isSaving,
        touched,
        handleSave,
    }
}
