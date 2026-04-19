import { useEffect, useState } from 'react'
import { permissionsService } from '@services/permissions'

export function ProfilePermissions({ userPermissions }) {
    const [groups, setGroups] = useState([])

    useEffect(() => {
        if (!userPermissions.length) return
        permissionsService.getPermissions().then((res) => {
            if (!res.success) return
            const permSet = new Set(userPermissions)
            const filtered = res.data
                .map((g) => ({
                    group: g.group,
                    actions: g.actions.filter((a) => permSet.has(a.key)),
                }))
                .filter((g) => g.actions.length > 0)
            setGroups(filtered)
        })
    }, [userPermissions.length])

    if (!groups.length) return null

    return (
        <div className="profile-page__permissions">
            <span className="profile-page__section-title">Права доступа</span>
            <div className="profile-page__perm-groups">
                {groups.map((g) => (
                    <div key={g.group} className="profile-page__perm-group">
                        <h3 className="profile-page__perm-group-title">{g.group}</h3>
                        <ul className="profile-page__perm-list">
                            {g.actions.map((a) => (
                                <li key={a.key} className="profile-page__perm-item">
                                    {a.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
