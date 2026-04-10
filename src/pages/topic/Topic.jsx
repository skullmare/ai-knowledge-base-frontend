import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useCreateBlockNote, useEditorChange } from '@blocknote/react'
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { ru } from '@blocknote/core/locales'
import useProfileStore from '@store/profile'
import useTopicStore from '@store/topic'
import useAgentRoleStore from '@store/agentRole'
import useTopicCategoryStore from '@store/topicCategory'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Layout from '@layout/Layout/Layout'
import { collaborationService } from '@services/collaboration'
import { fileService } from '@services/file'
import { topicService } from '@services/topic'
import { NAV_LINKS } from './Topic.constants'
import Input from '@ui/Input/Input'
import Dropdown from '@ui/Dropdown/Dropdown'
import Multiselect from '@ui/Multiselect/Multiselect'
import Spinner from '@ui/Spinner/Spinner'
import '@blocknote/mantine/style.css'
import './Topic.css'

const AUTOSAVE_DELAY = 2000
const EDITOR_SAVE_DELAY = 3000

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  const date = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
}

const UserChip = ({ user }) => {
  if (!user) return <span className="topic-meta__user">—</span>
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || '—'
  return (
    <span className="topic-meta__user">
      {user.photoUrl && (
        <img
          className="topic-meta__avatar"
          src={user.photoUrl}
          alt={fullName}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      )}
      {fullName}
    </span>
  )
}

export default function TopicPage() {
  const { pathname } = useLocation()
  const { id } = useParams()
  const { profile } = useProfileStore()
  const { currentTopic, updateTopic, isLoadingUpdateTopic } = useTopicStore()
  const fetchOneTopic = useTopicStore((s) => s.fetchOneTopic)
  const { logout } = useAuthStore()

  const { roles, fetchRoles } = useAgentRoleStore()
  const { categories, fetchCategories } = useTopicCategoryStore()

  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [isEditorSaving, setIsEditorSaving] = useState(false)

  const isSaving = isLoadingUpdateTopic || isEditorSaving

  const isInitializedRef = useRef(false)
  const autosaveTimerRef = useRef(null)

  useEffect(() => {
    if (currentTopic && !isInitializedRef.current) {
      setName(currentTopic.name ?? '')
      setSelectedCategory(currentTopic.metadata?.category?._id ?? null)
      setSelectedRoles(currentTopic.metadata?.accessibleByRoles?.map((r) => r._id) ?? [])
      isInitializedRef.current = true
    }
  }, [currentTopic])

  useEffect(() => {
    fetchRoles()
    fetchCategories()
  }, [])

  const roleOptions = roles.map((r) => ({ value: r._id, label: r.name }))
  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }))

  const scheduleAutosave = (overrides = {}) => {
    if (!isInitializedRef.current) return
    clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => {
      const n = overrides.name ?? name
      const cat = overrides.selectedCategory !== undefined ? overrides.selectedCategory : selectedCategory
      const r = overrides.selectedRoles ?? selectedRoles
      if (!n.trim() || !cat || !r.length) return
      updateTopic(id, {
        name: n,
        metadata: {
          ...currentTopic?.metadata,
          category: cat,
          accessibleByRoles: r,
        },
      })
    }, AUTOSAVE_DELAY)
  }

  const handleNameChange = (e) => {
    const val = e.target.value
    setName(val)
    scheduleAutosave({ name: val })
  }

  const handleCategoryChange = (val) => {
    setSelectedCategory(val)
    scheduleAutosave({ selectedCategory: val })
  }

  const handleRolesChange = (val) => {
    setSelectedRoles(val)
    scheduleAutosave({ selectedRoles: val })
  }

  // ── BlockNote ──────────────────────────────────────────────────────────────
  const {
    paragraph, heading, image, video, audio, file, numberedListItem, bulletListItem,
  } = defaultBlockSpecs

  const schema = BlockNoteSchema.create({
    blockSpecs: { paragraph, heading, image, video, audio, file, numberedListItem, bulletListItem },
  })

  const collaborationRef = useRef(null)
  if (!collaborationRef.current) {
    collaborationRef.current = collaborationService.createProvider(id)
  }

  const editorSaveTimerRef = useRef(null)
  const lastMarkdownRef = useRef('')

  useEffect(() => {
    fetchOneTopic(id)
    return () => {
      clearTimeout(autosaveTimerRef.current)
      clearTimeout(editorSaveTimerRef.current)
      collaborationService.destroyProvider(collaborationRef.current?.provider)
      collaborationRef.current = null
    }
  }, [])

  const { provider, ydoc } = collaborationRef.current

  const editor = useCreateBlockNote({
    schema,
    dictionary: ru,
    collaboration: {
      provider,
      fragment: ydoc.getXmlFragment('document-store'),
    },
    uploadFile: async (file) => {
      const data = await fileService.upload(file)
      return data.data.url
    },
  })

  useEditorChange(() => {
    setIsEditorSaving(true)
    clearTimeout(editorSaveTimerRef.current)
    editorSaveTimerRef.current = setTimeout(async () => {
      const markdown = await editor.blocksToMarkdownLossy(editor.document)
      if (markdown !== lastMarkdownRef.current) {
        lastMarkdownRef.current = markdown
        await topicService.update(id, { markdownContent: markdown })
      }
      setIsEditorSaving(false)
    }, EDITOR_SAVE_DELAY)
  }, editor)

  useEffect(() => {
    if (profile && collaborationRef.current?.provider) {
      collaborationRef.current.provider.setAwarenessField('user', {
        name: profile.login ?? profile.email ?? 'Аноним',
        color: '#DDB364',
      })
    }
  }, [profile])

  const handleLogout = async () => {
    try { await logout() } finally { window.location.href = '/login' }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Layout
      header={
        <Header
          navLinks={NAV_LINKS}
          activeLink={pathname}
          onLogout={handleLogout}
          userLogin={profile?.login ?? profile?.email}
          userRole={profile?.role?.name ?? 'Role'}
          logo={true}
        />
      }
    >
      <div className="topic-page">
        {/* Left sidebar — controls */}
        <div className="topic-page__controls">
          <div className="topic-page__fields">
            <Input
              variant="default"
              size="large"
              placeholder="Укажите название темы"
              showClearButton
              label="Название"
              required
              value={name}
              onChange={handleNameChange}
            />
            <Dropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              size="large"
              label="Раздел"
              required
            />
            <Multiselect
              label="Роли"
              required
              size="large"
              options={roleOptions}
              value={selectedRoles}
              onChange={handleRolesChange}
              placeholder="Выберите роли"
            />
          </div>

          {/* Footer meta */}
          {currentTopic && (
            <div className="topic-meta">
              <div className="topic-meta__row">
                <span className="topic-meta__label">Создано:</span>
                <span className="topic-meta__date">{formatDate(currentTopic.createdAt)}</span>
                <UserChip user={currentTopic.createdBy} />
              </div>
              <div className="topic-meta__row">
                <span className="topic-meta__label">Обновлено:</span>
                <span className="topic-meta__date">{formatDate(currentTopic.updatedAt)}</span>
                <UserChip user={currentTopic.updatedBy} />
              </div>
            </div>
          )}
        </div>

        {/* Right — editor + saving indicator */}
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