import { useLocation } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import Table from '@layout/Table/Table'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import { useLogout } from '@hooks/useLogout'
import { useMediaQuery } from '@hooks/useMediaQuery'
import { useFilesFilters } from './hooks/useFilesFilters'
import { useFilesData } from './hooks/useFilesData'
import { useUploadFileModal } from './hooks/useUploadFileModal'
import { useEditFileModal } from './hooks/useEditFileModal'
import { useFileActions } from './hooks/useFileActions'
import { useGoogleDriveBrowser } from './hooks/useGoogleDriveBrowser'
import { FilesNavbar } from './components/FilesNavbar'
import { FilesToolbar } from './components/FilesToolbar'
import { UploadFileModal } from './components/UploadFileModal'
import { EditFileModal } from './components/EditFileModal'
import { FilePreviewModal } from './components/FilePreviewModal'
import { GoogleDriveBrowser } from './components/GoogleDriveBrowser'
import { ImportDriveFileModal } from './components/ImportDriveFileModal'
import { NAV_LINKS, getFileColumns } from './Files.constants'
import './css/files.css'

const CONFIRM_CONFIG = {
    vectorize: {
        type: 'approve',
        title: 'Векторизация файла',
        confirmLabel: 'Векторизовать',
        message: (file) => `Добавить данные из файла «${file?.name}» в векторную базу?`,
    },
    devectorize: {
        type: 'warning',
        title: 'Удаление из векторной базы',
        confirmLabel: 'Убрать',
        message: (file) => `Убрать «${file?.name}» из векторной базы? Сам файл останется в системе.`,
    },
    delete: {
        type: 'delete',
        title: 'Удаление файла',
        confirmLabel: 'Удалить',
        message: (file) => `Удалить файл «${file?.name}»? Действие необратимо.`,
    },
}

export default function FilesPage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const {
        handleLogout, openLogoutModal, closeLogoutModal, isLogoutModalOpen, isLogoutLoading,
    } = useLogout(logout)

    const filters = useFilesFilters()
    const isFilesTab = filters.activeSection === 'files'

    const isCompact = useMediaQuery('(max-width: 1280px)')
    const isNarrow = useMediaQuery('(max-width: 1024px)')
    const isMobile = useMediaQuery('(max-width: 768px)')

    const { files, pagination, roleOptions, rolesForSelect, fetchFiles, buildParams } = useFilesData({
        debouncedSearch: filters.debouncedSearch,
        selectedRole: filters.selectedRole,
        selectedStatus: filters.selectedStatus,
        isActive: isFilesTab,
    })

    const uploadModal = useUploadFileModal()
    const editModal = useEditFileModal()
    const actions = useFileActions()

    const drive = useGoogleDriveBrowser({
        search: filters.debouncedSearch,
        isActive: !isFilesTab,
    })

    const columns = getFileColumns(
        {
            onOpen: actions.handleOpen,
            onDownload: actions.handleDownload,
            onVectorize: actions.openVectorize,
            onDevectorize: actions.openDevectorize,
            onEdit: editModal.open,
            onDelete: actions.openDelete,
        },
        { hideSecondary: isCompact, hideTertiary: isNarrow, hideRoles: isMobile }
    )

    // Минимальная ширина таблицы считается по видимым колонкам: иначе при
    // скрытии части колонок остаётся лишний горизонтальный скролл
    const tableMinWidth = columns
        .filter((column) => !column.actions)
        .reduce((sum, column) => sum + (column.width ?? column.minWidth ?? 150), 0)

    const confirmConfig = actions.confirm.type ? CONFIRM_CONFIG[actions.confirm.type] : null

    return (
        <Layout
            navbar={
                <Navbar>
                    <FilesNavbar
                        activeSection={filters.activeSection}
                        onSelect={filters.setActiveSection}
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
            <div className="files-page">
                {isFilesTab ? (
                    <>
                        <FilesToolbar
                            title="Файлы базы знаний"
                            searchPlaceholder="Поиск по файлам"
                            search={filters.search}
                            onSearchChange={filters.setSearch}
                            roleOptions={roleOptions}
                            selectedRole={filters.selectedRole}
                            onRoleChange={filters.setSelectedRole}
                            selectedStatus={filters.selectedStatus}
                            onStatusChange={filters.setSelectedStatus}
                            onAddFile={uploadModal.open}
                        />

                        <Table
                            layout="fixed"
                            minWidth={tableMinWidth}
                            columns={columns}
                            data={files}
                            page={pagination.current}
                            limit={pagination.limit}
                            total={pagination.total}
                            onPageChange={(page) => fetchFiles(buildParams({ page }))}
                            onLimitChange={(limit) => fetchFiles(buildParams({ page: 1, limit }))}
                        />
                    </>
                ) : (
                    <>
                        <FilesToolbar
                            title="Google Drive"
                            searchPlaceholder="Поиск по диску"
                            search={filters.search}
                            onSearchChange={filters.setSearch}
                        />

                        <GoogleDriveBrowser
                            status={drive.status}
                            files={drive.files}
                            breadcrumbs={drive.breadcrumbs}
                            filesError={drive.filesError}
                            isLoading={drive.isLoadingFiles}
                            isSearching={Boolean(filters.debouncedSearch)}
                            onOpenFolder={drive.openFolder}
                            onImport={drive.openImport}
                        />
                    </>
                )}
            </div>

            {uploadModal.isOpen && (
                <UploadFileModal
                    file={uploadModal.file}
                    onFileChange={uploadModal.handleFileChange}
                    name={uploadModal.name}
                    onNameChange={uploadModal.setName}
                    roleOptions={rolesForSelect}
                    roles={uploadModal.roles}
                    onRolesChange={uploadModal.setRoles}
                    progress={uploadModal.progress}
                    touched={uploadModal.touched}
                    isUploading={uploadModal.isUploading}
                    onConfirm={uploadModal.handleUpload}
                    onClose={uploadModal.close}
                />
            )}

            {editModal.isOpen && (
                <EditFileModal
                    name={editModal.name}
                    onNameChange={editModal.setName}
                    roleOptions={rolesForSelect}
                    roles={editModal.roles}
                    onRolesChange={editModal.setRoles}
                    touched={editModal.touched}
                    isSaving={editModal.isSaving}
                    onConfirm={editModal.handleSave}
                    onClose={editModal.close}
                />
            )}

            {drive.importTarget && (
                <ImportDriveFileModal
                    file={drive.importTarget}
                    roleOptions={rolesForSelect}
                    roles={drive.importRoles}
                    onRolesChange={drive.setImportRoles}
                    canVectorize={drive.canVectorize}
                    isLoading={drive.isImporting}
                    onConfirm={drive.handleImport}
                    onClose={drive.closeImport}
                />
            )}

            {actions.preview.isOpen && (
                <FilePreviewModal
                    file={actions.preview.file}
                    url={actions.preview.url}
                    isLoading={actions.preview.isLoading}
                    onClose={actions.closePreview}
                    onDownload={actions.handleDownload}
                />
            )}

            <ConfirmModal
                isOpen={Boolean(confirmConfig)}
                type={confirmConfig?.type ?? 'warning'}
                title={confirmConfig?.title}
                confirmLabel={confirmConfig?.confirmLabel}
                message={confirmConfig?.message(actions.confirm.file)}
                isLoading={actions.isConfirmLoading}
                onConfirm={actions.handleConfirm}
                onClose={actions.closeConfirm}
            />

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
        </Layout>
    )
}
