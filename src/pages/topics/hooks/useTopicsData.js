import { useEffect, useMemo } from 'react'
import useTopicStore from '@store/topic'
import useTopicCategoryStore from '@store/topicCategory'
import useAgentRoleStore from '@store/agentRole'

export function useTopicsData({ debouncedSearch, selectedRole, activeCategory, viewMode }) {
    const fetchTopics = useTopicStore((s) => s.fetchTopics)
    const topics = useTopicStore((s) => s.topics)
    const pagination = useTopicStore((s) => s.pagination)
    const createTopic = useTopicStore((s) => s.createTopic)
    const isLoadingCreateTopic = useTopicStore((s) => s.isLoadingCreateTopic)

    const fetchCategories = useTopicCategoryStore((s) => s.fetchCategories)
    const categoriesRaw = useTopicCategoryStore((s) => s.categories)
    const categories = Array.isArray(categoriesRaw) ? categoriesRaw : (categoriesRaw?.categories ?? [])
    const createCategory = useTopicCategoryStore((s) => s.createCategory)
    const updateCategory = useTopicCategoryStore((s) => s.updateCategory)
    const deleteCategory = useTopicCategoryStore((s) => s.deleteCategory)

    const fetchRoles = useAgentRoleStore((s) => s.fetchRoles)
    const roles = useAgentRoleStore((s) => s.roles)

    useEffect(() => {
        fetchCategories()
        fetchRoles()
    }, [fetchCategories, fetchRoles])

    useEffect(() => {
        const params = {}
        if (debouncedSearch) params.search = debouncedSearch
        if (selectedRole) params.role = selectedRole
        if (activeCategory !== 'all') params.category = activeCategory
        if (viewMode === 'catalogue') params.limit = 100
        fetchTopics(params)
    }, [fetchTopics, debouncedSearch, selectedRole, activeCategory, viewMode])

    const navSections = useMemo(() => [
        { id: 'all', label: 'Все' },
        ...categories.map((c) => ({ id: c._id, label: c.name })),
    ], [categories])

    const roleOptions = useMemo(() => [
        { value: null, label: 'Все роли' },
        ...roles.map((r) => ({ value: r._id, label: r.name })),
    ], [roles])

    const rolesForSelect = useMemo(() => roles.map((r) => ({ value: r._id, label: r.name })), [roles])

    const groupedTopics = useMemo(() => {
        const map = new Map()

        for (const topic of topics) {
            const cat = topic.metadata?.category
            if (!cat) continue

            const fullCategory = categories.find(c => c._id === cat._id)
            if (!fullCategory) continue

            if (!map.has(cat._id)) {
                map.set(cat._id, {
                    category: fullCategory,
                    topics: []
                })
            }
            map.get(cat._id).topics.push(topic)
        }

        return Array.from(map.values())
    }, [topics, categories])

    const tableData = useMemo(() => topics.map((t) => ({
        ...t,
        category: t.metadata?.category,
        roles: t.metadata?.accessibleByRoles,
    })), [topics])

    const buildParams = (overrides = {}) => ({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(selectedRole && { role: selectedRole }),
        ...(activeCategory !== 'all' && { category: activeCategory }),
        limit: pagination.limit,
        ...overrides,
    })

    return {
        topics,
        createTopic,
        pagination,
        categories,
        navSections,
        roleOptions,
        groupedTopics,
        rolesForSelect,
        tableData,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchTopics,
        fetchCategories,
        isLoadingCreateTopic,
        buildParams,
    }
}