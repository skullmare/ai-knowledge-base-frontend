import Protected from '@guards/Protected'
import EditIcon from '@assets/icons/edit-16.svg'
import Delete from '@assets/icons/delete-16.svg'
import './RoleCard.css'

export function RoleCard({
    role,
    permissionCount,
    editPermission,
    deletePermission,
    onEdit,
    onDelete,
}) {
    return (
        <div className="role-card">
            <div className="role-card__header">
                <span className="role-card__name">{role.name}</span>
                <div className="role-card__actions">
                    <Protected permission={editPermission} mode="some">
                        <button
                            className="role-card__action-btn"
                            onClick={() => onEdit(role)}
                            title="Редактировать"
                        >
                            <EditIcon width="16px" height="16px" />
                        </button>
                    </Protected>
                    {!role.isSystem && (
                        <Protected permission={deletePermission} mode="some">
                            <button
                                className="role-card__action-btn role-card__action-btn--delete"
                                onClick={() => onDelete(role)}
                                title="Удалить"
                            >
                                <Delete width="16px" height="16px" />
                            </button>
                        </Protected>
                    )}
                </div>
            </div>

            {role.description && (
                <div className="role-card__description-wrapper"><p className="role-card__description">{role.description}</p></div>
            )}

            {permissionCount !== undefined && (
                <div className="role-card__footer">
                    <span className="role-card__permissions-badge">
                        {permissionCount === 0
                            ? 'Нет прав'
                            : `${permissionCount} ${getPermissionLabel(permissionCount)}`}
                    </span>
                </div>
            )}
        </div>
    )
}

function getPermissionLabel(count) {
    if (count % 10 === 1 && count % 100 !== 11) return 'право'
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'права'
    return 'прав'
}
