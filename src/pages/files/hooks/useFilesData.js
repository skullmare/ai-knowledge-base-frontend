import { useEffect, useMemo, useCallback } from 'react'
import useFileStore from '@store/file'
import useAgentRoleStore from '@store/agentRole'

export function useFilesData({ debouncedSearch, selectedRole, selectedStatus, isActive }) {
    const fetchFiles = useFileStore((s) => s.fetchFiles)
    const files = useFileStore((s) => s.files)
    const pagination = useFileStore((s) => s.pagination)

    const fetchRoles = useAgentRoleStore((s) => s.fetchRoles)
    const roles = useAgentRoleStore((s) => s.roles)

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    const buildParams = useCallback((overrides = {}) => ({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(selectedRole && { role: selectedRole }),
        ...(selectedStatus && { status: selectedStatus }),
        limit: pagination.limit,
        ...overrides,
    }), [debouncedSearch, selectedRole, selectedStatus, pagination.limit])

    useEffect(() => {
        if (!isActive) return

        const params = {}
        if (debouncedSearch) params.search = debouncedSearch
        if (selectedRole) params.role = selectedRole
        if (selectedStatus) params.status = selectedStatus
        fetchFiles(params).catch(() => {})
    }, [fetchFiles, debouncedSearch, selectedRole, selectedStatus, isActive])

    const roleOptions = useMemo(() => [
        { value: null, label: 'Все роли' },
        ...roles.map((r) => ({ value: r._id, label: r.name })),
    ], [roles])

    const rolesForSelect = useMemo(
        () => roles.map((r) => ({ value: r._id, label: r.name })),
        [roles]
    )

    return { files, pagination, roleOptions, rolesForSelect, fetchFiles, buildParams }
}
