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
import Table from '@layout/Table/Table'
import Button from '@ui/Button/Button'
import Input from '@ui/Input/Input'
import Protected from '@guards/Protected'
import Dropdown from '@ui/Dropdown/Dropdown'
import Modal from '@layout/Modal/Modal'
import Catalogue from '@assets/icons/catalogue-16.svg'
import List from '@assets/icons/list-16.svg'
import Plus from '@assets/icons/plus-16.svg'
import './Topics.css'

const NAV_LINKS = [
    { to: '/topics', label: 'Управление данными', permission: 'topics.read' },
    { to: '/users', label: 'Управление пользователями', permission: ['platformUsers.read', 'agentUsers.read'], permissionMode: 'some' },
    { to: '/logs', label: 'Лента событий', permission: 'logs.read' },
]

const TOPIC_COLUMNS = [
    { key: 'name', label: 'Название' },
    {
        key: 'status', label: 'Статус',
        render: (value) => (
            <span className="topic-status">
                <span className={`topic-status__dot topic-status__dot--${value}`} />
                {value === 'approved' ? 'Одобрено' : value === 'review' ? 'На проверке' : 'В архиве'}
            </span>
        )
    },
    { key: 'category', label: 'Раздел', render: (value) => value?.name ?? '—' },
    { key: 'roles', label: 'Роли', render: (value) => value?.length ? value.map((r) => r.name).join(', ') : '—' },
    {
        key: 'createdBy', label: 'Автор',
        render: (value) => value ? (
            <span className="topic-author">
                {value.photoUrl
                    ? <img className="topic-author__avatar" src={value.photoUrl} alt="" />
                    : <span className="topic-author__avatar topic-author__avatar--placeholder" />
                }
                {value.firstName} {value.lastName}
            </span>
        ) : '—'
    },
]

export default function TopicsPage() {
    const { pathname } = useLocation()

    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const fetchTopics = useTopicStore((s) => s.fetchTopics)
    const topics = useTopicStore((s) => s.topics)
    const pagination = useTopicStore((s) => s.pagination)

    const fetchCategories = useTopicCategoryStore((s) => s.fetchCategories)
    const categoriesRaw = useTopicCategoryStore((s) => s.categories)
    const categories = Array.isArray(categoriesRaw) ? categoriesRaw : (categoriesRaw?.categories ?? [])
    const createCategory = useTopicCategoryStore((s) => s.createCategory)

    const fetchRoles = useAgentRoleStore((s) => s.fetchRoles)
    const roles = useAgentRoleStore((s) => s.roles)

    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState(null)
    const [viewMode, setViewMode] = useState('catalogue')

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
        if (viewMode === 'catalogue') params.limit = 100
        fetchTopics(params)
    }, [fetchTopics, search, selectedRole, activeCategory, viewMode])

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

    const tableData = useMemo(() => topics.map((t) => ({
        ...t,
        category: t.metadata?.category,
        roles: t.metadata?.accessibleByRoles,
    })), [topics])

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

    const buildParams = (overrides = {}) => ({
        ...(search && { search }),
        ...(selectedRole && { role: selectedRole }),
        ...(activeCategory !== 'all' && { category: activeCategory }),
        limit: pagination.limit,
        ...overrides,
    })

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
                                <Plus />Создать раздел
                            </Button>
                        </div>
                        <div className="topics-page__controls-btn">
                            <Protected permission="topics.create" mode="some">
                                <Button size="interface" variant="primary">
                                    <Plus />Создать тему
                                </Button>
                            </Protected>
                        </div>
                        <div className="topics-page__controls-btn-mode-container">
                            <button
                                className={`topics-page__controls-btn-mode ${viewMode === 'catalogue' ? 'topics-page__controls-btn-mode--active' : ''}`}
                                onClick={() => setViewMode('catalogue')}
                            >
                                <Catalogue width="20px" height="20px" />
                            </button>
                            <button
                                className={`topics-page__controls-btn-mode ${viewMode === 'list' ? 'topics-page__controls-btn-mode--active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List width="20px" height="20px" />
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'catalogue' ? (
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
                ) : (
                    <Table
                        columns={TOPIC_COLUMNS}
                        data={tableData}
                        page={pagination.current}
                        limit={pagination.limit}
                        total={pagination.total}
                        onPageChange={(p) => fetchTopics(buildParams({ page: p }))}
                        onLimitChange={(l) => fetchTopics(buildParams({ page: 1, limit: l }))}
                    />
                )}
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