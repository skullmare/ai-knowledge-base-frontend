import { useLocation, useParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
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
import ConfirmModal from './components/ConfirmModal'
import './Topic.css'

export default function TopicPage() {
  const { pathname } = useLocation()
  const { id } = useParams()
  const profile = useProfileStore((state) => state.profile)
  const logout = useAuthStore((state) => state.logout)

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

  // Убираем initialEditorContent - редактор будет загружать данные через коллаборацию
  const { editor, isEditorSaving } = useBlockNoteEditor(id, profile)

  const deleteTopicHook = useDeleteTopic(id, () => {
    window.location.href = '/topics'
  })

  const approveTopicHook = useApproveTopic(id, () => {
    refreshTopic()
  })

  const handleLogout = useCallback(async () => {
    try {
      await logout()
    } finally {
      window.location.href = '/login'
    }
  }, [logout])

  const isSaving = isTopicSaving || isEditorSaving
  const isApproved = currentTopic?.status === 'approved'

  const { fields: navbarFields, footer: navbarFooter } = TopicSidebar({
    name,
    selectedCategory,
    selectedRoles,
    categoryOptions,
    roleOptions,
    onNameChange: handleNameChange,
    onCategoryChange: handleCategoryChange,
    onRolesChange: handleRolesChange,
    currentTopic
  })

  if (isPageLoading) {
    return (
      <Layout
        navbar={<Navbar>{navbarFields}</Navbar>}
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
        <div className="topic-page__loading">
          <div className='topic-page__loading-indicator'><Spinner size="large" />Загрузка...</div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <Layout
        navbar={<Navbar footer={navbarFooter}>{navbarFields}</Navbar>}
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
        <div className="topic-page">
          <div className="topic-page__editor-wrapper">
            <TopicToolbar
              isSaving={isSaving}
              onApprove={approveTopicHook.openModal}
              onDelete={deleteTopicHook.openModal}
              isLoadingApprove={approveTopicHook.isLoading}
              isLoadingDelete={deleteTopicHook.isLoading}
              isApproved={isApproved}
            />
            <div className="topic-page__editor">
              <BlockNoteView editor={editor} theme="dark" />
            </div>
          </div>
        </div>
      </Layout>
      <ConfirmModal
        isOpen={deleteTopicHook.isModalOpen}
        type="delete"
        isLoading={deleteTopicHook.isLoading}
        onConfirm={deleteTopicHook.handleDelete}
        onClose={deleteTopicHook.closeModal}
      />
      <ConfirmModal
        isOpen={approveTopicHook.isModalOpen}
        type="approve"
        isLoading={approveTopicHook.isLoading}
        onConfirm={approveTopicHook.handleApprove}
        onClose={approveTopicHook.closeModal}
      />
    </>
  )
}
