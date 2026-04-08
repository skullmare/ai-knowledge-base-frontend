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
    },
    uploadFile: async (file) => {
      const data = await fileService.upload(file)
      return data.data.url
    },
  })

  useEffect(() => {
    if (profile && collaborationRef.current?.provider) {
      collaborationRef.current.provider.setAwarenessField('user', {
        name: profile.login ?? profile.email ?? 'Аноним'
      })
    }
  }, [profile])

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