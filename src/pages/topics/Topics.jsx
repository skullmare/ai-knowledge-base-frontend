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
import { TopicsToolbar } from './components/TopicsToolbar'
import { TopicsCatalogue } from './components/TopicsCatalogue'
import { CreateCategoryModal } from './components/CreateCategoryModal'
import { NAV_LINKS, TOPIC_COLUMNS } from './Topics.constants'
import './Topics.css'

export default function TopicsPage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const filters = useTopicsFilters()
    const { navSections, roleOptions, groupedTopics, tableData, pagination, createCategory, fetchTopics, buildParams } = useTopicsData({
        debouncedSearch: filters.debouncedSearch,
        selectedRole: filters.selectedRole,
        activeCategory: filters.activeCategory,
        viewMode: filters.viewMode,
    })
    const categoryModal = useCreateCategoryModal(createCategory)

    const handleLogout = async () => {
        try { await logout() } finally { window.location.href = '/login' }
    }

    return (
        <Layout
            navbar={<Navbar sections={navSections} activeSection={filters.activeCategory} onSelect={filters.setActiveCategory} />}
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
                    onCreateTopic={() => {}}
                />

                {filters.viewMode === 'catalogue' ? (
                    <TopicsCatalogue groupedTopics={groupedTopics} />
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
        </Layout>
    )
}