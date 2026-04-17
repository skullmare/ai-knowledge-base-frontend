import { useLocation } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import Table from '@layout/Table/Table'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import Protected from '@guards/Protected'
import { useLogout } from '@hooks/useLogout'
import { UsersNavbar } from './components/UsersNavbar'
import { UsersToolbar } from './components/UsersToolbar'
import { EditPlatformUserModal } from './components/EditPlatformUserModal'
import { EditAgentUserModal } from './components/EditAgentUserModal'
import { CreatePlatformRoleModal } from './components/CreatePlatformRoleModal'
import { CreateAgentRoleModal } from './components/CreateAgentRoleModal'
import { CreatePlatformUserModal } from './components/CreatePlatformUserModal'
import { useUsersData } from './hooks/useUsersData'
import { useUsersFilters } from './hooks/useUsersFilters'
import { useEditPlatformUserModal } from './hooks/useEditPlatformUserModal'
import { useEditAgentUserModal } from './hooks/useEditAgentUserModal'
import { useDeleteUserModal } from './hooks/useDeleteUserModal'
import { useCreatePlatformRoleModal } from './hooks/useCreatePlatformRoleModal'
import { useCreateAgentRoleModal } from './hooks/useCreateAgentRoleModal'
import { useCreatePlatformUserModal } from './hooks/useCreatePlatformUserModal'
import { NAV_LINKS, getPlatformUserColumns, getAgentUserColumns } from './Users.constants'
import './css/users.css'

export default function UsersPage() {
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

    const { activeSection, setActiveSection, search, setSearch, debouncedSearch } = useUsersFilters()

    const {
        platformUsers, platformPagination, updatePlatformUser, deletePlatformUser,
        fetchPlatformUsers, platformRoleOptions, buildPlatformParams,
        agentUsers, agentPagination, updateAgentUser, deleteAgentUser,
        fetchAgentUsers, agentRoleOptions, buildAgentParams,
    } = useUsersData({ activeSection, debouncedSearch })

    const editPlatformModal = useEditPlatformUserModal(updatePlatformUser)
    const editAgentModal = useEditAgentUserModal(updateAgentUser)

    const deletePlatformHook = useDeleteUserModal(deletePlatformUser)
    const deleteAgentHook = useDeleteUserModal(deleteAgentUser)

    const createPlatformRoleModal = useCreatePlatformRoleModal()
    const createAgentRoleModal = useCreateAgentRoleModal()
    const createPlatformUserModal = useCreatePlatformUserModal()

    const platformColumns = getPlatformUserColumns({
        onEdit: editPlatformModal.open,
        onDelete: deletePlatformHook.openModal,
    })

    const agentColumns = getAgentUserColumns({
        onEdit: editAgentModal.open,
        onDelete: deleteAgentHook.openModal,
    })

    const isPlatform = activeSection === 'platform'

    return (
        <Layout
            navbar={
                <Navbar>
                    <UsersNavbar
                        activeSection={activeSection}
                        onSelect={setActiveSection}
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
            <div className="users-page">
                <UsersToolbar
                    activeSection={activeSection}
                    search={search}
                    onSearchChange={setSearch}
                    onCreatePlatformRole={createPlatformRoleModal.open}
                    onCreatePlatformUser={createPlatformUserModal.open}
                    onCreateAgentRole={createAgentRoleModal.open}
                />

                {isPlatform ? (
                    <Protected permission="platformUsers.read" mode="some">
                        <Table
                            columns={platformColumns}
                            data={platformUsers}
                            page={platformPagination.current}
                            limit={platformPagination.limit}
                            total={platformPagination.total}
                            onPageChange={(p) => fetchPlatformUsers(buildPlatformParams({ page: p }))}
                            onLimitChange={(l) => fetchPlatformUsers(buildPlatformParams({ page: 1, limit: l }))}
                        />
                    </Protected>
                ) : (
                    <Protected permission="agentUsers.read" mode="some">
                        <Table
                            columns={agentColumns}
                            data={agentUsers}
                            page={agentPagination.current}
                            limit={agentPagination.limit}
                            total={agentPagination.total}
                            onPageChange={(p) => fetchAgentUsers(buildAgentParams({ page: p }))}
                            onLimitChange={(l) => fetchAgentUsers(buildAgentParams({ page: 1, limit: l }))}
                        />
                    </Protected>
                )}
            </div>

            {editPlatformModal.isOpen && (
                <EditPlatformUserModal
                    firstName={editPlatformModal.firstName}
                    onFirstNameChange={editPlatformModal.setFirstName}
                    lastName={editPlatformModal.lastName}
                    onLastNameChange={editPlatformModal.setLastName}
                    login={editPlatformModal.login}
                    onLoginChange={editPlatformModal.setLogin}
                    email={editPlatformModal.email}
                    onEmailChange={editPlatformModal.setEmail}
                    photoUrl={editPlatformModal.photoUrl}
                    onPhotoUrlChange={editPlatformModal.setPhotoUrl}
                    roleOptions={platformRoleOptions}
                    selectedRole={editPlatformModal.selectedRole}
                    onRoleChange={editPlatformModal.setSelectedRole}
                    touched={editPlatformModal.touched}
                    isSaving={editPlatformModal.isSaving}
                    onConfirm={editPlatformModal.handleSave}
                    onClose={editPlatformModal.close}
                />
            )}

            {editAgentModal.isOpen && (
                <EditAgentUserModal
                    roleOptions={agentRoleOptions}
                    selectedRole={editAgentModal.selectedRole}
                    onRoleChange={editAgentModal.setSelectedRole}
                    touched={editAgentModal.touched}
                    isSaving={editAgentModal.isSaving}
                    onConfirm={editAgentModal.handleSave}
                    onClose={editAgentModal.close}
                />
            )}

            {createPlatformRoleModal.isOpen && (
                <CreatePlatformRoleModal
                    name={createPlatformRoleModal.name}
                    onNameChange={createPlatformRoleModal.setName}
                    description={createPlatformRoleModal.description}
                    onDescriptionChange={createPlatformRoleModal.setDescription}
                    permissionOptions={createPlatformRoleModal.permissionOptions}
                    selectedPermissions={createPlatformRoleModal.selectedPermissions}
                    onPermissionsChange={createPlatformRoleModal.setSelectedPermissions}
                    isLoadingPermissions={createPlatformRoleModal.isLoadingPermissions}
                    touched={createPlatformRoleModal.touched}
                    isCreating={createPlatformRoleModal.isCreating}
                    onConfirm={createPlatformRoleModal.handleCreate}
                    onClose={createPlatformRoleModal.close}
                />
            )}

            {createAgentRoleModal.isOpen && (
                <CreateAgentRoleModal
                    name={createAgentRoleModal.name}
                    onNameChange={createAgentRoleModal.setName}
                    description={createAgentRoleModal.description}
                    onDescriptionChange={createAgentRoleModal.setDescription}
                    touched={createAgentRoleModal.touched}
                    isCreating={createAgentRoleModal.isCreating}
                    onConfirm={createAgentRoleModal.handleCreate}
                    onClose={createAgentRoleModal.close}
                />
            )}

            {createPlatformUserModal.isOpen && (
                <CreatePlatformUserModal
                    firstName={createPlatformUserModal.firstName}
                    onFirstNameChange={createPlatformUserModal.setFirstName}
                    lastName={createPlatformUserModal.lastName}
                    onLastNameChange={createPlatformUserModal.setLastName}
                    login={createPlatformUserModal.login}
                    onLoginChange={createPlatformUserModal.setLogin}
                    email={createPlatformUserModal.email}
                    onEmailChange={createPlatformUserModal.setEmail}
                    photoUrl={createPlatformUserModal.photoUrl}
                    onPhotoUrlChange={createPlatformUserModal.setPhotoUrl}
                    roleOptions={platformRoleOptions}
                    selectedRole={createPlatformUserModal.selectedRole}
                    onRoleChange={createPlatformUserModal.setSelectedRole}
                    touched={createPlatformUserModal.touched}
                    isCreating={createPlatformUserModal.isCreating}
                    onConfirm={createPlatformUserModal.handleCreate}
                    onClose={createPlatformUserModal.close}
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
                isOpen={deletePlatformHook.isModalOpen}
                type="danger"
                title="Удаление пользователя"
                confirmLabel="Удалить"
                message={`Вы уверены, что хотите удалить пользователя "${deletePlatformHook.user?.firstName} ${deletePlatformHook.user?.lastName}"?`}
                isLoading={deletePlatformHook.isLoading}
                onConfirm={deletePlatformHook.handleDelete}
                onClose={deletePlatformHook.closeModal}
            />

            <ConfirmModal
                isOpen={deleteAgentHook.isModalOpen}
                type="danger"
                title="Удаление пользователя агента"
                confirmLabel="Удалить"
                message={`Вы уверены, что хотите удалить пользователя "${deleteAgentHook.user?.firstName} ${deleteAgentHook.user?.lastName}"?`}
                isLoading={deleteAgentHook.isLoading}
                onConfirm={deleteAgentHook.handleDelete}
                onClose={deleteAgentHook.closeModal}
            />
        </Layout>
    )
}
