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

    useEffect(() => {
        fetchLogs(buildParams())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, selectedAction, selectedGroupId, status, startDate, endDate])

    const buildParams = (overrides = {}) => {
        const params = { limit: pagination.limit }
        if (debouncedSearch) params.search = debouncedSearch
        // specific action takes priority over group-level entityType filter
        if (selectedAction) {
            params.action = selectedAction
        } else if (selectedGroupId) {
            params.entityType = selectedGroupId
        }
        if (status) params.status = status
        if (startDate) params.startDate = new Date(startDate).toISOString()
        if (endDate) params.endDate = new Date(endDate).toISOString()
        return { ...params, ...overrides }
    }

    const filterGroups = useMemo(() =>
        actions.map((group) => ({
            id: group.entity,
            label: group.group,
            items: group.actions.map((a) => ({ id: a.key, label: a.label })),
        })),
        [actions]
    )

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
