import { useLocation } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import Table from '@layout/Table/Table'
import { useTopicsFilters } from './hooks/useTopicsFilters'
import { useTopicsData } from './hooks/useTopicsData'
import { useCreateCategoryModal } from './hooks/useCreateCategoryModal'
import { useEditCategoryModal } from './hooks/useEditCategoryModal'
import { TopicsToolbar } from './components/TopicsToolbar'
import { TopicsCatalogue } from './components/TopicsCatalogue'
import { CreateCategoryModal } from './components/CreateCategoryModal'
import { EditCategoryModal } from './components/EditCategoryModal'
import { TopicsNavbar } from './components/TopicsNavbar'
import { NAV_LINKS, TOPIC_COLUMNS } from './Topics.constants'
import { useCreateTopicModal } from './hooks/useCreateTopicModal'
import { CreateTopicModal } from './components/CreateTopicModal'
import './Topics.css'

export default function TopicsPage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const filters = useTopicsFilters()
    const {
        navSections,
        roleOptions,
        createTopic,
        isLoadingCreateTopic,
        groupedTopics,
        rolesForSelect,
        tableData,
        pagination,
        createCategory,
        updateCategory,
        fetchTopics,
        fetchCategories,
        buildParams,
        categories
    } = useTopicsData({
        debouncedSearch: filters.debouncedSearch,
        selectedRole: filters.selectedRole,
        activeCategory: filters.activeCategory,
        viewMode: filters.viewMode,
    })
    const categoryModal = useCreateCategoryModal(createCategory)
    const editModal = useEditCategoryModal(updateCategory, fetchTopics, buildParams, fetchCategories)
    const topicModal = useCreateTopicModal(createTopic)

    const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }))

    const handleLogout = async () => {
        try { await logout() } finally { window.location.href = '/login' }
    }

    return (
        <Layout
            navbar={
                <Navbar>
                    <TopicsNavbar
                        sections={navSections}
                        activeSection={filters.activeCategory}
                        onSelect={filters.setActiveCategory}
                    />
                </Navbar>
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
                <TopicsToolbar
                    roleOptions={roleOptions}
                    selectedRole={filters.selectedRole}
                    onRoleChange={filters.setSelectedRole}
                    search={filters.search}
                    onSearchChange={filters.setSearch}
                    viewMode={filters.viewMode}
                    onViewModeChange={filters.setViewMode}
                    onCreateCategory={categoryModal.open}
                    onCreateTopic={topicModal.open}
                />

                {filters.viewMode === 'catalogue' ? (
                    <TopicsCatalogue
                        groupedTopics={groupedTopics}
                        categories={categories}
                        onEditCategory={editModal.open}
                    />
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

            {categoryModal.isOpen && (
                <CreateCategoryModal
                    name={categoryModal.name}
                    onNameChange={categoryModal.setName}
                    description={categoryModal.description}
                    onDescriptionChange={categoryModal.setDescription}
                    touched={categoryModal.touched}
                    isCreating={categoryModal.isCreating}
                    onConfirm={categoryModal.handleCreate}
                    onClose={categoryModal.close}
                />
            )}
            {editModal.isOpen && (
                <EditCategoryModal
                    name={editModal.name}
                    onNameChange={editModal.setName}
                    description={editModal.description}
                    onDescriptionChange={editModal.setDescription}
                    touched={editModal.touched}
                    isSaving={editModal.isSaving}
                    onConfirm={editModal.handleSave}
                    onClose={editModal.close}
                />
            )}
            {topicModal.isOpen && (
                <CreateTopicModal
                    name={topicModal.name}
                    onNameChange={topicModal.setName}
                    categoryOptions={categoryOptions}
                    selectedCategory={topicModal.selectedCategory}
                    onCategoryChange={topicModal.setSelectedCategory}
                    roleOptions={rolesForSelect}
                    selectedRoles={topicModal.selectedRoles}
                    onRolesChange={topicModal.setSelectedRoles}
                    touched={topicModal.touched}
                    isCreating={topicModal.isCreating}
                    onConfirm={topicModal.handleCreate}
                    onClose={topicModal.close}
                    isLoading={isLoadingCreateTopic}
                />
            )}
        </Layout>
    )
}