import { useEffect, useMemo } from 'react'
import useLogStore from '@store/log'

export function useLogsData({ debouncedSearch, selectedAction, selectedGroupId, status, startDate, endDate }) {
    const fetchLogs = useLogStore((s) => s.fetchLogs)
    const fetchActions = useLogStore((s) => s.fetchActions)
    const logs = useLogStore((s) => s.logs)
    const pagination = useLogStore((s) => s.pagination)
    const isLoadingLogs = useLogStore((s) => s.isLoadingLogs)
    const actions = useLogStore((s) => s.actions)
    const isLoadingActions = useLogStore((s) => s.isLoadingActions)

    useEffect(() => {
        fetchActions()
    }, [fetchActions])

    // filterGroups must be defined before buildParams so closures can reference it
    const filterGroups = useMemo(() =>
        actions.map((group, idx) => ({
            // Use index-based fallback to guarantee unique React keys
            // even if some groups have null/undefined entity from the API
            id: group.entity ?? `group-${idx}`,
            entityKey: group.entity ?? null,  // actual value sent as entityType param
            label: group.group,
            items: group.actions.map((a) => ({ id: a.key, label: a.label })),
        })),
        [actions]
    )

    const buildParams = (overrides = {}) => {
        const params = { limit: pagination.limit }
        if (debouncedSearch) params.search = debouncedSearch
        // specific action takes priority over group-level entityType filter
        if (selectedAction) {
            params.action = selectedAction
        } else if (selectedGroupId) {
            const selectedGroup = filterGroups.find((g) => g.id === selectedGroupId)
            if (selectedGroup?.entityKey) params.entityType = selectedGroup.entityKey
        }
        if (status) params.status = status
        if (startDate) params.startDate = new Date(startDate).toISOString()
        if (endDate) params.endDate = new Date(endDate).toISOString()
        return { ...params, ...overrides }
    }

    useEffect(() => {
        fetchLogs(buildParams())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, selectedAction, selectedGroupId, status, startDate, endDate])

    return {
        logs,
        pagination,
        isLoadingLogs,
        filterGroups,
        isLoadingActions,
        fetchLogs,
        buildParams,
    }
}
