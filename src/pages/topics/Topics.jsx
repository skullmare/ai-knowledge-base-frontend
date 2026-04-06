import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import useTopicStore from '@store/topic'
import useTopicCategoryStore from '@store/topicCategory'
import useAgentRoleStore from '@store/agentRole'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import Button from '@ui/Button/Button'
import Input from '@ui/Input/Input'
import Protected from '@guards/Protected'
import Dropdown from '@ui/Dropdown/Dropdown'
import Modal from '@layout/Modal/Modal'
import './Topics.css'
import Plus from '@assets/icons/plus-16.svg'

const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
]

export default function TopicsPage() {
    const { pathname } = useLocation()

    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const fetchTopics = useTopicStore((s) => s.fetchTopics)
    const topics = useTopicStore((s) => s.topics)

    const fetchCategories = useTopicCategoryStore((s) => s.fetchCategories)
    const categories = useTopicCategoryStore((s) => s.categories)
    const createCategory = useTopicCategoryStore((s) => s.createCategory)

    const fetchRoles = useAgentRoleStore((s) => s.fetchRoles)
    const roles = useAgentRoleStore((s) => s.roles)

    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)

    const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
    const [categoryName, setCategoryName] = useState('')
    const [categoryDescription, setCategoryDescription] = useState('')
    const [isCreatingCategory, setIsCreatingCategory] = useState(false)

    useEffect(() => {
        fetchCategories()
        fetchRoles()
    }, [fetchCategories, fetchRoles])

    useEffect(() => {
        const params = {}
        if (search) params.search = search
        if (selectedRole) params.role = selectedRole
        if (activeCategory !== 'all') params.category = activeCategory
        fetchTopics(params)
    }, [fetchTopics, search, selectedRole, activeCategory])

    const navSections = useMemo(() => [
        { id: 'all', label: 'Все' },
        ...categories.map((c) => ({ id: c._id, label: c.name })),
    ], [categories])

    const roleOptions = useMemo(() => [
        { value: null, label: 'Все роли' },
        ...roles.map((r) => ({ value: r._id, label: r.name })),
    ], [roles])

    const groupedTopics = useMemo(() => {
        const map = new Map()
        for (const topic of topics) {
            const cat = topic.metadata?.category
            if (!cat) continue
            if (!map.has(cat._id)) map.set(cat._id, { category: cat, topics: [] })
            map.get(cat._id).topics.push(topic)
        }
        return Array.from(map.values())
    }, [topics])

    const handleLogout = async () => {
        try { await logout() } finally { window.location.href = '/login' }
    }

    const closeCreateCategoryModal = () => {
        setIsCreateCategoryModalOpen(false)
        setCategoryName('')
        setCategoryDescription('')
    }

    const handleCreateCategory = async () => {
        setIsCreatingCategory(true)
        try {
            await createCategory({ name: categoryName.trim(), description: categoryDescription.trim() })
            closeCreateCategoryModal()
        } finally {
            setIsCreatingCategory(false)
        }
    }

    return (
        <Layout
            navbar={
                <Navbar
                    sections={navSections}
                    activeSection={activeCategory}
                    onSelect={setActiveCategory}
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
            <div className="topics-page">
                <div className="topics-page__toolbar">
                    <h1 className="topics-page__title">Управление данными</h1>
                    <div className="topics-page__controls">
                        <div className="topics-page__controls-filter">
                            <Dropdown
                                options={roleOptions}
                                value={selectedRole}
                                onChange={setSelectedRole}
                            />
                        </div>
                        <div className="topics-page__controls-search">
                            <Input
                                variant="search"
                                size="medium"
                                placeholder="Поиск по темам"
                                showSearchButton
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="topics-page__controls-btn">
                            <Button
                                size="interface"
                                variant="secondary"
                                onClick={() => setIsCreateCategoryModalOpen(true)}
                            >
                                <Plus color="white"></Plus>Создать раздел
                            </Button>
                        </div>
                        <div className="topics-page__controls-btn">
                            <Protected permission="topics.create" mode="some">
                                <Button size="interface" variant="primary">
                                    <Plus color="white"></Plus>Создать тему
                                </Button>
                            </Protected>
                        </div>
                    </div>
                </div>

                <div className="topics-page__grid">
                    {groupedTopics.map(({ category, topics: catTopics }) => (
                        <div key={category._id} className="topics-page__group">
                            <h2 className="topics-page__group-title">{category.name}</h2>
                            <ul className="topics-page__list">
                                {catTopics.map((topic) => (
                                    <li key={topic._id} className="topics-page__item">
                                        {topic.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {isCreateCategoryModalOpen && (
                <Modal
                    title="Создание раздела"
                    onClose={closeCreateCategoryModal}
                    onConfirm={handleCreateCategory}
                    confirmLabel="Создать"
                    confirmDisabled={!categoryName.trim() || isCreatingCategory}
                >
                    <Input
                        variant="default"
                        size="large"
                        placeholder="Укажите название раздела"
                        showClearButton
                        label="Название"
                        required
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <Input
                        variant="default"
                        size="large"
                        placeholder="Опишите контекст раздела для ИИ агента"
                        showClearButton
                        label="Описание"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                </Modal>
            )}
        </Layout>
    )
}