import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useTopicStore from '@store/topic'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'

const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
]

const SECTIONS = [
    { id: 'all', label: 'Все' },
    { id: 'connection', label: 'Подключение и настройка' },
    { id: 'clients-work', label: 'Работа с клиентами' },
    { id: 'tech-info', label: 'Техническая информация о компании' },
    { id: 'general-info', label: 'Общая информация' },
    { id: 'requests', label: 'Работа с заявками' },
    { id: 'common-issues', label: 'Частые проблемы' },
    { id: 'faq', label: 'Частые вопросы' },
    { id: 'client-info', label: 'Информация о клиентах' },
    { id: 'client-questions', label: 'Вопросы для клиентов' },
    { id: 'projects', label: 'Описание проектов' },
    { id: 'roles', label: 'Описание ролей пользователей' },
]

export default function TopicsPage() {
    const { pathname } = useLocation()

    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const fetchTopics = useTopicStore((state) => state.fetchTopics)
    const topics = useTopicStore((state) => state.topics)

    const [activeId, setActiveId] = useState('all')

    useEffect(() => { fetchTopics() }, [fetchTopics])

    const handleLogout = async () => {
        try { await logout() } finally { window.location.href = '/login' }
    }

    return (
        <Layout
            navbar={
                <Navbar
                    sections={SECTIONS}
                    activeSection={activeId}
                    onSelect={setActiveId}
                />
            }
            header={
                <Header
                    navLinks={NAV_LINKS}
                    activeLink={pathname}
                    onLogout={handleLogout}
                    userLogin={profile?.login ?? profile?.email}
                    userRole={profile?.role?.name ?? 'Role'}
                />
            }
        >
            <h1>Темы</h1>
            <ul>
                {topics.map((topic) => (
                    <li key={topic._id}>{topic.name}</li>
                ))}
            </ul>
        </Layout>
    )
}