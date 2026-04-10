import { useLocation, useParams } from 'react-router-dom'
import { useCallback } from 'react'
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
import TopicSidebar from './components/TopicSidebar'
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
  } = useTopicData(id)

  const {
    name,
    selectedCategory,
    selectedRoles,
    handleNameChange,
    handleCategoryChange,
    handleRolesChange,
  } = useAutosave(id, currentTopic, updateTopic)

  const { editor, isEditorSaving } = useBlockNoteEditor(id, profile)

  const handleLogout = useCallback(async () => {
    try { 
      await logout() 
    } finally { 
      window.location.href = '/login' 
    }
  }, [logout])

  const isSaving = isTopicSaving || isEditorSaving
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
          <Spinner size="large" />
        </div>
      </Layout>
    )
  }

  return (
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
          <div className="topic-page__editor-toolbar">
            {isSaving && (
              <div className="topic-page__saving-indicator">
                <Spinner size="small" />
                <span>Сохранение...</span>
              </div>
            )}
          </div>

          <div className="topic-page__editor">
            <BlockNoteView editor={editor} theme="dark" />
          </div>
        </div>
      </div>
    </Layout>
  )
}