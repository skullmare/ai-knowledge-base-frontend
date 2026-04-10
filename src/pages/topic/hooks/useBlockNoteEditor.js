import { useRef, useState, useEffect, useMemo } from 'react'
import { useCreateBlockNote, useEditorChange } from '@blocknote/react'
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'
import { ru } from '@blocknote/core/locales'
import { collaborationService } from '@services/collaboration'
import { fileService } from '@services/file'
import { topicService } from '@services/topic'

const EDITOR_SAVE_DELAY = 3000
const DEFAULT_USER_COLOR = '#DDB364'

export const useBlockNoteEditor = (id, profile) => {
  const collaborationRef = useRef(null)
  const editorSaveTimerRef = useRef(null)
  const lastMarkdownRef = useRef('')
  const [isEditorSaving, setIsEditorSaving] = useState(false)

  if (!collaborationRef.current) {
    collaborationRef.current = collaborationService.createProvider(id)
  }

  const schema = useMemo(() => {
    const { paragraph, heading, image, video, audio, file, numberedListItem, bulletListItem } = defaultBlockSpecs
    return BlockNoteSchema.create({
      blockSpecs: { 
        paragraph, heading, image, video, audio, file, numberedListItem, bulletListItem 
      },
    })
  }, [])

  const editor = useCreateBlockNote({
    schema,
    dictionary: ru,
    collaboration: {
      provider: collaborationRef.current.provider,
      fragment: collaborationRef.current.ydoc.getXmlFragment('document-store'),
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
        color: DEFAULT_USER_COLOR,
      })
    }
  }, [profile])

  useEffect(() => {
    return () => {
      clearTimeout(editorSaveTimerRef.current)
      collaborationService.destroyProvider(collaborationRef.current?.provider)
      collaborationRef.current = null
    }
  }, [id])

  return { editor, isEditorSaving }
}