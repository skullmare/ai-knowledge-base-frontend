import { useEffect, useState } from 'react'
import useGoogleDriveStore from '@store/googleDrive'
import useFileStore from '@store/file'

/** Навигация по подключённому Google Drive и подключение файлов к базе знаний. */
export function useGoogleDriveBrowser({ search, isActive }) {
    const status = useGoogleDriveStore((s) => s.status)
    const fetchStatus = useGoogleDriveStore((s) => s.fetchStatus)
    const files = useGoogleDriveStore((s) => s.files)
    const breadcrumbs = useGoogleDriveStore((s) => s.breadcrumbs)
    const fetchFiles = useGoogleDriveStore((s) => s.fetchFiles)
    const filesError = useGoogleDriveStore((s) => s.filesError)
    const isLoadingFiles = useGoogleDriveStore((s) => s.isLoadingFiles)
    const markLinked = useGoogleDriveStore((s) => s.markLinked)

    const importFromGoogleDrive = useFileStore((s) => s.importFromGoogleDrive)
    const vectorizeFile = useFileStore((s) => s.vectorizeFile)
    const isImporting = useFileStore((s) => s.isLoadingCreateFile)
    const isVectorizing = useFileStore((s) => s.isLoadingVectorize)

    const [folderId, setFolderId] = useState('root')
    const [importTarget, setImportTarget] = useState(null)
    const [importRoles, setImportRoles] = useState([])

    useEffect(() => {
        if (isActive) fetchStatus().catch(() => {})
    }, [isActive, fetchStatus])

    useEffect(() => {
        if (!isActive || !status.isConnected) return
        fetchFiles(search ? { search } : { folderId })
    }, [isActive, status.isConnected, folderId, search, fetchFiles])

    const openFolder = (id) => setFolderId(id)

    const openImport = (file) => {
        setImportTarget(file)
        setImportRoles([])
    }

    const closeImport = () => setImportTarget(null)

    /** Подключает файл и сразу векторизует его — это одно действие для пользователя. */
    const handleImport = async () => {
        if (!importTarget) return

        try {
            const created = await importFromGoogleDrive({
                fileId: importTarget.id,
                name: importTarget.name,
                accessibleByRoles: importRoles,
            })

            let result = created
            if (importRoles.length) {
                result = await vectorizeFile(created._id)
            }

            markLinked(importTarget.id, result)
            closeImport()
        } catch {
            // сообщение об ошибке показывает снекбар
        }
    }

    return {
        status,
        files,
        breadcrumbs,
        filesError,
        isLoadingFiles,
        folderId,
        openFolder,
        importTarget,
        importRoles,
        setImportRoles,
        openImport,
        closeImport,
        handleImport,
        isImporting: isImporting || isVectorizing,
    }
}
