import { useEffect, useMemo } from 'react'
import usePlatformUserStore from '@store/platformUser'
import useAgentUserStore from '@store/agentUser'
import usePlatformRoleStore from '@store/platformRole'
import useAgentRoleStore from '@store/agentRole'

export function useUsersData({ activeSection, debouncedSearch }) {
    // Platform users
    const fetchPlatformUsers = usePlatformUserStore((s) => s.fetchUsers)
    const platformUsers = usePlatformUserStore((s) => s.users)
    const platformPagination = usePlatformUserStore((s) => s.pagination)
    const updatePlatformUser = usePlatformUserStore((s) => s.updateUser)
    const deletePlatformUser = usePlatformUserStore((s) => s.deleteUser)
    const isLoadingPlatformUsers = usePlatformUserStore((s) => s.isLoadingFetchUsers)

    // Agent users
    const fetchAgentUsers = useAgentUserStore((s) => s.fetchUsers)
    const agentUsers = useAgentUserStore((s) => s.users)
    const agentPagination = useAgentUserStore((s) => s.pagination)
    const updateAgentUser = useAgentUserStore((s) => s.updateUser)
    const deleteAgentUser = useAgentUserStore((s) => s.deleteUser)
    const isLoadingAgentUsers = useAgentUserStore((s) => s.isLoadingFetchUsers)

    // Platform roles
    const fetchPlatformRoles = usePlatformRoleStore((s) => s.fetchRoles)
    const platformRoles = usePlatformRoleStore((s) => s.roles)

    // Agent roles
    const fetchAgentRoles = useAgentRoleStore((s) => s.fetchRoles)
    const agentRoles = useAgentRoleStore((s) => s.roles)

    useEffect(() => {
        fetchPlatformRoles()
        fetchAgentRoles()
    }, [fetchPlatformRoles, fetchAgentRoles])

    useEffect(() => {
        const params = {}
        if (debouncedSearch) params.search = debouncedSearch

        if (activeSection === 'platform') {
            fetchPlatformUsers(params)
        } else {
            fetchAgentUsers(params)
        }
    }, [activeSection, debouncedSearch, fetchPlatformUsers, fetchAgentUsers])

    const platformRoleOptions = useMemo(
        () => platformRoles.map((r) => ({ value: r._id, label: r.name })),
        [platformRoles]
    )

    const agentRoleOptions = useMemo(
        () => agentRoles.map((r) => ({ value: r._id, label: r.name })),
        [agentRoles]
    )

    const buildPlatformParams = (overrides = {}) => ({
        ...(debouncedSearch && { search: debouncedSearch }),
        limit: platformPagination.limit,
        ...overrides,
    })

    const buildAgentParams = (overrides = {}) => ({
        ...(debouncedSearch && { search: debouncedSearch }),
        limit: agentPagination.limit,
        ...overrides,
    })

    return {
        // Platform
        platformUsers,
        platformPagination,
        updatePlatformUser,
        deletePlatformUser,
        fetchPlatformUsers,
        isLoadingPlatformUsers,
        platformRoleOptions,
        buildPlatformParams,

        // Agent
        agentUsers,
        agentPagination,
        updateAgentUser,
        deleteAgentUser,
        fetchAgentUsers,
        isLoadingAgentUsers,
        agentRoleOptions,
        buildAgentParams,
    }
}