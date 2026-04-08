import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Layout from '@layout/Layout/Layout'
import { collaborationService } from '@services/collaboration'
import { fileService } from '@services/file'
import { NAV_LINKS } from './Topic.constants'
import '@blocknote/mantine/style.css'
import './Topic.css'

export default function TopicPage() {
  const { pathname } = useLocation()
  const { id } = useParams()
  const { profile } = useProfileStore()
  const { logout } = useAuthStore()

  const collaborationRef = useRef(null)
  if (!collaborationRef.current) {
    collaborationRef.current = collaborationService.createProvider(id)
  }

  useEffect(() => {
    return () => {
      collaborationService.destroyProvider(collaborationRef.current?.provider)
      collaborationRef.current = null
    }
  }, [])

  const { provider, ydoc } = collaborationRef.current

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: ydoc.getXmlFragment('document-store'),
      user: {
        name: profile?.login ?? profile?.email ?? 'Аноним',
        color: generateColor(profile?._id),
      },
    },
    uploadFile: async (file) => {
      const data = await fileService.upload(file)
      return data.data.url
    },
  })

  const handleLogout = async () => {
    try { await logout() } finally { window.location.href = '/login' }
  }

  return (
    <Layout
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
        <div className="topic-page__editor">
          <BlockNoteView editor={editor} theme="dark" />
        </div>
      </div>
    </Layout>
  )
}

function generateColor(id) {
  if (!id) return '#94a3b8'
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`
}