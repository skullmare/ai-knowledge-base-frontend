import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import topicStore from '@store/topic'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'

const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными',        permission: 'topics.read' },
    { to: '/users',  label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs',   label: 'Лента событий',             permission: 'logs.read' },
]

export default function TopicsPage() {
    const { pathname } = useLocation()

    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const fetchTopics = topicStore((state) => state.fetchTopics)
    const topics = topicStore((state) => state.topics)

    useEffect(() => { fetchTopics() }, [fetchTopics])

    const handleLogout = async () => {
        try { await logout() } finally { window.location.href = '/login'; }
    }

    return (
        <div>
            <Header
                navLinks={NAV_LINKS}
                activeLink={pathname}
                onLogout={handleLogout}
                userLogin={profile?.login ?? profile?.email}
                userRole={profile?.role?.name ?? 'Role'}
            />
            <h1>Темы</h1>
            <ul>
                {topics.map((topic) => (
                    <li key={topic._id}>{topic.name}</li>
                ))}
            </ul>
        </div>
    )
}