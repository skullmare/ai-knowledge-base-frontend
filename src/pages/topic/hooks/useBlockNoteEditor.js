import { useRef, useEffect, useMemo, useCallback } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'
import { ru } from '@blocknote/core/locales'
import { collaborationService } from '@services/collaboration'
import useFileStore from '@store/file'

const DEFAULT_USER_COLOR = '#DDB364'

const base64ToFile = async (dataUrl) => {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const ext = blob.type.split('/')[1] || 'png'
  return new File([blob], `pasted-image.${ext}`, { type: blob.type })
}

// Рекурсивно собирает все image-блоки с base64 URL из дерева блоков
const collectBase64ImageBlocks = (blocks) => {
  const result = []
  for (const block of blocks) {
    if (
      block.type === 'image' &&
      typeof block.props?.url === 'string' &&
      block.props.url.startsWith('data:')
    ) {
      result.push(block)
    }
    if (block.children?.length) {
      result.push(...collectBase64ImageBlocks(block.children))
    }
  }
  return result
}

export const useBlockNoteEditor = (id, profile) => {
  const upload = useFileStore((s) => s.upload)
  const collaborationRef = useRef(null)
  const processingBlocksRef = useRef(new Set())

  // Инициализация collaboration
  if (!collaborationRef.current) {
    collaborationRef.current = collaborationService.createProvider(id)
  }

  // Схема редактора (мемоизирована)
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
      const data = await upload(file)
      return data.data.url
    },
  })

  // Загружает все base64-изображения в S3 и заменяет URL — рекурсивно по всему дереву блоков
  const uploadBase64Images = useCallback(async () => {
    if (!editor) return

    const targets = collectBase64ImageBlocks(editor.document).filter(
      (block) => !processingBlocksRef.current.has(block.id)
    )

    await Promise.all(
      targets.map(async (block) => {
        processingBlocksRef.current.add(block.id)
        try {
          const file = await base64ToFile(block.props.url)
          const data = await upload(file)
          editor.updateBlock(block, {
            props: { ...block.props, url: data.data.url },
          })
        } catch (err) {
          console.error('Failed to upload pasted image to S3:', err)
        } finally {
          processingBlocksRef.current.delete(block.id)
        }
      })
    )
  }, [editor, upload])

  // Подписка на изменения контента для перехвата base64-изображений при любом сценарии
  useEffect(() => {
    if (!editor) return
    return editor.onEditorContentChange(uploadBase64Images)
  }, [editor, uploadBase64Images])

  // После paste создаём пустую Yjs-транзакцию, чтобы гарантированно отправить
  // накопленные изменения на Hocuspocus-сервер (иначе его debounce-сохранение
  // может не сработать, если пользователь ушёл со страницы сразу после вставки)
  useEffect(() => {
    if (!editor) return
    const view = editor._tiptapEditor?.view
    if (!view) return

    const handlePaste = () => {
      setTimeout(() => {
        const ydoc = collaborationRef.current?.ydoc
        if (!ydoc) return
        // Пустая транзакция создаёт Yjs-update, сбрасывающий debounce на сервере
        ydoc.transact(() => {})
      }, 100)
    }

    view.dom.addEventListener('paste', handlePaste)
    return () => view.dom.removeEventListener('paste', handlePaste)
  }, [editor])

  // Настройка awareness
  useEffect(() => {
    if (profile && collaborationRef.current?.provider) {
      collaborationRef.current.provider.setAwarenessField('user', {
        name: profile.login ?? profile.email ?? 'Аноним',
        color: DEFAULT_USER_COLOR,
      })
    }
  }, [profile])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      collaborationService.destroyProvider(collaborationRef.current?.provider)
      collaborationRef.current = null
    }
  }, [id])

  return { editor, isEditorSaving: false }
}
