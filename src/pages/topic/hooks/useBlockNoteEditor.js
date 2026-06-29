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

const collectBase64ImageBlocks = (blocks) => {
  const result = []
  for (const block of blocks) {
    if (block.type === 'image' && block.props?.url?.startsWith('data:')) {
      result.push(block)
    }
    if (block.children?.length) result.push(...collectBase64ImageBlocks(block.children))
  }
  return result
}

export const useBlockNoteEditor = (id, profile) => {
  const upload = useFileStore((s) => s.upload)
  const collaborationRef = useRef(null)
  const processingBlocksRef = useRef(new Set())
  const profileRef = useRef(profile)
  useEffect(() => { profileRef.current = profile }, [profile])

  if (!collaborationRef.current) {
    collaborationRef.current = collaborationService.createProvider(id, {
      onProviderRecreated: (newProvider) => {
        collaborationRef.current = { ...collaborationRef.current, provider: newProvider }
        if (profileRef.current) {
          newProvider.setAwarenessField('user', {
            name: profileRef.current.login ?? profileRef.current.email ?? 'Аноним',
            color: DEFAULT_USER_COLOR,
          })
        }
      },
    })
  }

  const schema = useMemo(() => {
    const { paragraph, heading, image, video, audio, file, numberedListItem, bulletListItem } = defaultBlockSpecs
    return BlockNoteSchema.create({
      blockSpecs: { paragraph, heading, image, video, audio, file, numberedListItem, bulletListItem },
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
      const { data } = await upload(file)
      return data.url
    },
  })

  // Загружает base64-изображения в S3 и заменяет URL в блоках
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
          const { data } = await upload(file)
          editor.updateBlock(block, { props: { ...block.props, url: data.url } })
        } catch (err) {
          console.error('Failed to upload pasted image:', err)
        } finally {
          processingBlocksRef.current.delete(block.id)
        }
      })
    )
  }, [editor, upload])

  useEffect(() => {
    if (!editor) return
    return editor.onEditorContentChange(uploadBase64Images)
  }, [editor, uploadBase64Images])

  // Отключает провайдер, давая серверу время вызвать onStoreDocument, затем переподключается.
  // Используется перед критическими операциями (approve), чтобы гарантировать актуальность данных в БД.
  const forceSync = useCallback(() => new Promise((resolve) => {
    const provider = collaborationRef.current?.provider
    if (!provider) return resolve()
    provider.disconnect()
    setTimeout(() => { provider.connect(); resolve() }, 800)
  }), [])

  useEffect(() => {
    const provider = collaborationRef.current?.provider
    if (profile && provider) {
      provider.setAwarenessField('user', {
        name: profile.login ?? profile.email ?? 'Аноним',
        color: DEFAULT_USER_COLOR,
      })
    }
  }, [profile])

  useEffect(() => {
    return () => {
      collaborationService.destroyProvider(collaborationRef.current?.provider)
      collaborationRef.current = null
    }
  }, [id])

  return { editor, forceSync }
}
