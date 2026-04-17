import { RoleCard } from './RoleCard'
import './RolesList.css'

export function RolesList({
    roles,
    showPermissions = false,
    editPermission,
    deletePermission,
    onEdit,
    onDelete,
}) {
    if (!roles.length) {
        return (
            <div className="roles-list__empty">
                <span className="roles-list__empty-text">Роли не найдены</span>
            </div>
        )
    }

    return (
        <div className="roles-list">
            {roles.map((role) => (
                <RoleCard
                    key={role._id}
                    role={role}
                    permissionCount={showPermissions ? (Array.isArray(role.permissions) ? role.permissions.length : 0) : undefined}
                    editPermission={editPermission}
                    deletePermission={deletePermission}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
