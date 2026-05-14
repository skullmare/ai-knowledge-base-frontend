import Filter from '@ui/Filter/Filter'

export function LogsNavbar({
    filterGroups,
    isLoadingActions,
    selectedGroupId,
    selectedAction,
    onGroupSelect,
    onItemSelect,
    onClear,
}) {
    return (
        <Filter
            label="Фильтр событий"
            groups={filterGroups}
            selectedGroupId={selectedGroupId}
            selectedItemId={selectedAction}
            onGroupSelect={onGroupSelect}
            onItemSelect={onItemSelect}
            onClear={onClear}
            isLoading={isLoadingActions}
        />
    )
}
