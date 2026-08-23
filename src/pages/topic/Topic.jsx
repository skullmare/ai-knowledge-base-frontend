import { useLocation, useParams, useNavigate } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import Spinner from '@ui/Spinner/Spinner'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { NAV_LINKS } from './Topic.constants'
import { useAutosave } from './hooks/useAutosave'
import { useBlockNoteEditor } from './hooks/useBlockNoteEditor'
import { useTopicData } from './hooks/useTopicData'
import { useDeleteTopic } from './hooks/useDeleteTopic'
import { useApproveTopic } from './hooks/useApproveTopic'
import TopicSidebar from './components/TopicSidebar'
import TopicToolbar from './components/TopicToolbar'
import ConfirmModal from '@layout/Modal/ConfirmModal' // только один импорт
import { useLogout } from '@hooks/useLogout'
import './Topic.css'

export default function TopicPage() {
  const { pathname } = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = useProfileStore((state) => state.profile)
  const checkPermission = useProfileStore((state) => state.checkPermission)
  const logout = useAuthStore((state) => state.logout)

  const canUpdate = checkPermission('topics.update')

  // Используем хук выхода
  const {
    handleLogout,
    openLogoutModal,
    closeLogoutModal,
    isLogoutModalOpen,
    isLogoutLoading,
  } = useLogout(logout)

  const {
    currentTopic,
    updateTopic,
    roleOptions,
    categoryOptions,
    isPageLoading,
    isSaving: isTopicSaving,
    refreshTopic
  } = useTopicData(id)

  const {
    name,
    selectedCategory,
    selectedRoles,
    handleNameChange,
    handleCategoryChange,
    handleRolesChange,
  } = useAutosave(id, currentTopic, updateTopic)

  const { editor, forceSync, isSynced } = useBlockNoteEditor(id, profile, !isPageLoading)

  const deleteTopicHook = useDeleteTopic(id, () => {
    navigate('/topics')
  })

  const approveTopicHook = useApproveTopic(id, () => {
    refreshTopic()
  }, forceSync)

  const isSaving = isTopicSaving

  const { fields: navbarFields, footer: navbarFooter } = TopicSidebar({
    name,
    selectedCategory,
    selectedRoles,
    categoryOptions,
    roleOptions,
    onNameChange: handleNameChange,
    onCategoryChange: handleCategoryChange,
    onRolesChange: handleRolesChange,
    currentTopic,
    canUpdate
  })

  return (
    <>
      <Layout
        navbar={<Navbar footer={navbarFooter}>{navbarFields}</Navbar>}
        header={
          <Header
            navLinks={NAV_LINKS}
            activeLink={pathname}
            onLogout={openLogoutModal} // Передаем openLogoutModal вместо handleLogout
            userLogin={profile?.login ?? profile?.email}
            userRole={profile?.role?.name ?? 'Role'}
          />
        }
      >
        <div className="topic-page">
          <div className="topic-page__editor-wrapper">
            <TopicToolbar
              isSaving={isSaving}
              onApprove={approveTopicHook.openModal}
              onDelete={deleteTopicHook.openModal}
              isLoadingApprove={approveTopicHook.isLoading}
              isLoadingDelete={deleteTopicHook.isLoading}
            />
            <div className="topic-page__editor" style={{ position: 'relative' }}>
              {!isSynced && (
                <div className="topic-page__editor-skeleton" aria-hidden="true">
                  <div className="topic-page__editor-skeleton-line" style={{ height: 28, width: '55%' }} />
                  <div className="topic-page__editor-skeleton-line" style={{ height: 18, width: '90%' }} />
                  <div className="topic-page__editor-skeleton-line" style={{ height: 18, width: '80%' }} />
                  <div className="topic-page__editor-skeleton-line" style={{ height: 18, width: '85%' }} />
                  <div className="topic-page__editor-skeleton-line" style={{ height: 18, width: '70%' }} />
                  <div className="topic-page__editor-skeleton-line" style={{ height: 18, width: '88%' }} />
                  <div className="topic-page__editor-skeleton-line" style={{ height: 18, width: '60%' }} />
                </div>
              )}
              <div style={{ visibility: isSynced ? 'visible' : 'hidden', height: isSynced ? undefined : 0 }}>
                <BlockNoteView editor={editor} theme="dark" editable={canUpdate} />
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Модалки */}
      <ConfirmModal
        isOpen={deleteTopicHook.isModalOpen}
        type="warning"
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
        isOpen={isLogoutModalOpen}
        type="warning"
        title="Выход из системы"
        confirmLabel="Выйти"
        message="Вы уверены, что хотите выйти из системы?"
        isLoading={isLogoutLoading}
        onConfirm={handleLogout}
        onClose={closeLogoutModal}
      />
    </>
  )
}