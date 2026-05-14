import { useState } from 'react'
import DropdownIcon from '@assets/icons/dropdown-16.svg'
import DropdownFlippedIcon from '@assets/icons/dropdown-flipped-16.svg'
import CloseIcon from '@assets/icons/close-16.svg'
import './Filter.css'

/**
 * Hierarchical filter panel with collapsible groups.
 *
 * groups: [{ id, label, items: [{ id, label }] }]
 * selectedGroupId: id of the selected group (group-level filter), or null
 * selectedItemId: id of the selected item (item-level filter), or null
 * onGroupSelect: (groupId) => void — called when a group label is clicked
 * onItemSelect: (groupId, itemId) => void — called when an item is clicked
 * onClear: () => void — clears the current selection
 */
export default function Filter({
    groups = [],
    selectedGroupId = null,
    selectedItemId = null,
    onGroupSelect,
    onItemSelect,
    onClear,
    label = 'Фильтры',
    isLoading = false,
}) {
    const [expandedGroups, setExpandedGroups] = useState({})

    // String key prevents undefined/null collision in the state object
    const toggleExpand = (groupId) => {
        const key = String(groupId)
        setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const hasSelection = selectedGroupId !== null || selectedItemId !== null

    if (isLoading) {
        return (
            <div className="filter">
                <div className="filter__header">
                    <span className="filter__label">{label}</span>
                </div>
                <div className="filter__loading">
                    <span className="filter__loading-text">Загрузка...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="filter">
            <div className="filter__header">
                <span className="filter__label">{label}</span>
                {hasSelection && (
                    <button
                        className="filter__clear-btn"
                        onClick={onClear}
                        title="Сбросить фильтры"
                        type="button"
                    >
                        <CloseIcon width="12px" height="12px" />
                        <span>Сбросить</span>
                    </button>
                )}
            </div>

            <ul className="filter__list" role="list">
                {groups.map((group) => {
                    const expandKey = String(group.id)
                    const isExpanded = expandedGroups[expandKey] ?? false
                    const isGroupActive = selectedGroupId === group.id && selectedItemId === null

                    return (
                        <li key={group.id} className="filter__group">
                            <div className="filter__group-row">
                                <div
                                    className={`filter__group-label${isGroupActive ? ' filter__group-label--active' : ''}`}
                                    onClick={() => onGroupSelect?.(group.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') onGroupSelect?.(group.id)
                                    }}
                                >
                                    {group.label}
                                </div>
                                <button
                                    className="filter__group-toggle"
                                    onClick={() => toggleExpand(group.id)}
                                    aria-expanded={isExpanded}
                                    type="button"
                                    title={isExpanded ? 'Свернуть' : 'Развернуть'}
                                >
                                    {isExpanded
                                        ? <DropdownFlippedIcon width="12px" height="12px" />
                                        : <DropdownIcon width="12px" height="12px" />
                                    }
                                </button>
                            </div>

                            {isExpanded && group.items.length > 0 && (
                                <ul className="filter__items" role="list">
                                    {group.items.map((item) => (
                                        <li key={item.id} className="filter__item-wrapper">
                                            <div
                                                className={`filter__item${selectedItemId === item.id ? ' filter__item--active' : ''}`}
                                                onClick={() => onItemSelect?.(group.id, item.id)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') onItemSelect?.(group.id, item.id)
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
