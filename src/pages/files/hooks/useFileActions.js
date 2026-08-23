import { useState } from 'react'
import useFileStore from '@store/file'

/**
 * Действия над файлом: просмотр, скачивание, векторизация и удаление.
 * Модалки подтверждения держим здесь же, чтобы страница осталась плоской.
 */
export function useFileActions() {
    const vectorizeFile = useFileStore((s) => s.vectorizeFile)
    const devectorizeFile = useFileStore((s) => s.devectorizeFile)
    const deleteFile = useFileStore((s) => s.deleteFile)
    const getFileLink = useFileStore((s) => s.getFileLink)
    const isLoadingVectorize = useFileStore((s) => s.isLoadingVectorize)
    const isLoadingDelete = useFileStore((s) => s.isLoadingDeleteFile)

    const [confirm, setConfirm] = useState({ type: null, file: null })
    const [preview, setPreview] = useState({ isOpen: false, file: null, url: null, isLoading: false })

    const closeConfirm = () => setConfirm({ type: null, file: null })

    const openVectorize = (file) => setConfirm({ type: 'vectorize', file })
    const openDevectorize = (file) => setConfirm({ type: 'devectorize', file })
    const openDelete = (file) => setConfirm({ type: 'delete', file })

    const handleConfirm = async () => {
        const { type, file } = confirm
        if (!file) return

        try {
            if (type === 'vectorize') await vectorizeFile(file._id)
            if (type === 'devectorize') await devectorizeFile(file._id)
            if (type === 'delete') await deleteFile(file._id)
            closeConfirm()
        } catch {
            // сообщение об ошибке показывает снекбар
        }
    }

    const handleDownload = async (file) => {
        try {
            const { url, external } = await getFileLink(file._id, { inline: false })
            // Файлы Google Drive скачиваются на стороне Google — открываем их страницу
            window.open(url, external ? '_blank' : '_self', 'noopener,noreferrer')
        } catch {
            // сообщение об ошибке показывает снекбар
        }
    }

    const handleOpen = async (file) => {
        // Документы Google Drive открываем в отдельном окне по их ссылке
        if (file.source === 'google_drive') {
            if (file.google?.webViewLink) {
                window.open(file.google.webViewLink, '_blank', 'noopener,noreferrer')
            }
            return
        }

        setPreview({ isOpen: true, file, url: null, isLoading: true })
        try {
            const { url } = await getFileLink(file._id, { inline: true })
            setPreview({ isOpen: true, file, url, isLoading: false })
        } catch {
            setPreview({ isOpen: false, file: null, url: null, isLoading: false })
        }
    }

    const closePreview = () => setPreview({ isOpen: false, file: null, url: null, isLoading: false })

    return {
        confirm,
        closeConfirm,
        openVectorize,
        openDevectorize,
        openDelete,
        handleConfirm,
        handleDownload,
        handleOpen,
        preview,
        closePreview,
        isConfirmLoading: isLoadingVectorize || isLoadingDelete,
    }
}
