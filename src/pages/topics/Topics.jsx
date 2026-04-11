import { useLocation } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import Table from '@layout/Table/Table'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import { useLogout } from '@hooks/useLogout'
import { useTopicsFilters } from './hooks/useTopicsFilters'
import { useTopicsData } from './hooks/useTopicsData'
import { useCreateCategoryModal } from './hooks/useCreateCategoryModal'
import { useEditCategoryModal } from './hooks/useEditCategoryModal'
import { useDeleteCategoryModal } from './hooks/useDeleteCategoryModal'
import { useDeleteTopicModal } from './hooks/useDeleteTopicModal'
import { useApproveTopicModal } from './hooks/useApproveTopicModal'
import { useArchiveTopicModal } from './hooks/useArchiveTopicModal'
import { TopicsToolbar } from './components/TopicsToolbar'
import { TopicsCatalogue } from './components/TopicsCatalogue'
import { CreateCategoryModal } from './components/CreateCategoryModal'
import { EditCategoryModal } from './components/EditCategoryModal'
import { TopicsNavbar } from './components/TopicsNavbar'
import { NAV_LINKS, getTopicColumns } from './Topics.constants'
import { useCreateTopicModal } from './hooks/useCreateTopicModal'
import { CreateTopicModal } from './components/CreateTopicModal'
import './css/topics.css'

export default function TopicsPage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const {
        handleLogout,
        openLogoutModal,
        closeLogoutModal,
        isLogoutModalOpen,
        isLogoutLoading,
    } = useLogout(logout)

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
        deleteCategory,
        fetchTopics,
        fetchCategories,
        buildParams,
        categories,
    } = useTopicsData({
        debouncedSearch: filters.debouncedSearch,
        selectedRole: filters.selectedRole,
        activeCategory: filters.activeCategory,
        viewMode: filters.viewMode,
    })

    const categoryModal = useCreateCategoryModal(createCategory)
    const editModal = useEditCategoryModal(updateCategory, fetchTopics, buildParams, fetchCategories)
    const topicModal = useCreateTopicModal(createTopic)

    const {
        deleteModal,
        isLoadingDeleteCategory,
        handleDeleteCategory,
        handleConfirmDelete,
        handleCloseModal,
    } = useDeleteCategoryModal({
        deleteCategory,
        activeCategory: filters.activeCategory,
        setActiveCategory: filters.setActiveCategory,
    })

    const deleteTopicHook = useDeleteTopicModal()
    const approveTopicHook = useApproveTopicModal()
    const archiveTopicHook = useArchiveTopicModal()

    const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }))

    const topicColumns = getTopicColumns({
        onDelete: deleteTopicHook.openModal,
        onApprove: approveTopicHook.openModal,
        onArchive: archiveTopicHook.openModal,
    })

    return (
        <Layout
            navbar={
                <Navbar>
                    <TopicsNavbar
                        sections={navSections}
                        activeSection={filters.activeCategory}
                        onSelect={filters.setActiveCategory}
                        onEditCategory={editModal.open}
                        onDeleteCategory={handleDeleteCategory}
                        categories={categories}
                    />
                </Navbar>
            }
            header={
                <Header
                    navLinks={NAV_LINKS}
                    activeLink={pathname}
                    onLogout={openLogoutModal}
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
                        columns={topicColumns}
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

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                type="warning"
                title="Выход из системы"
                confirmLabel="Выйти"
                message="Вы уверены, что хотите выйти из системы?"
                isLoading={isLogoutLoading}
                onConfirm={handleLogout}
                onClose={closeLogoutModal}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                type="danger"
                title="Удаление раздела"
                confirmLabel="Удалить"
                message={`Вы уверены, что хотите удалить раздел "${deleteModal.category?.name}"?`}
                isLoading={isLoadingDeleteCategory}
                onConfirm={handleConfirmDelete}
                onClose={handleCloseModal}
            />

            <ConfirmModal
                isOpen={deleteTopicHook.isModalOpen}
                type="danger"
                title="Подтвердите действие"
                confirmLabel="Удалить"
                message="Вы точно хотите удалить эту тему?"
                isLoading={deleteTopicHook.isLoading}
                onConfirm={deleteTopicHook.handleDelete}
                onClose={deleteTopicHook.closeModal}
            />

            <ConfirmModal
                isOpen={approveTopicHook.isModalOpen}
                type="warning"
                title="Подтвердите действие"
                confirmLabel="Одобрить"
                message="Вы уверены, что хотите одобрить эту тему?"
                isLoading={approveTopicHook.isLoading}
                onConfirm={approveTopicHook.handleApprove}
                onClose={approveTopicHook.closeModal}
            />

            <ConfirmModal
                isOpen={archiveTopicHook.isModalOpen}
                type="warning"
                title="Подтвердите действие"
                confirmLabel="Архивировать"
                message="Вы уверены, что хотите архивировать эту тему?"
                isLoading={archiveTopicHook.isLoading}
                onConfirm={archiveTopicHook.handleArchive}
                onClose={archiveTopicHook.closeModal}
            />
        </Layout>
    )
}