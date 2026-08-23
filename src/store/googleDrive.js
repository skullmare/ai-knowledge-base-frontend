import { create } from 'zustand'
import { googleDriveService } from '@services/googleDrive'
import { handleError } from '../utils/handleError'
import useSuccessStore from './success'

const useGoogleDriveStore = create((set) => ({
    status: { isConfigured: false, isConnected: false, email: null, redirectUri: null },
    files: [],
    breadcrumbs: [],
    nextPageToken: null,
    isLoadingStatus: false,
    isLoadingFiles: false,
    isLoadingConnect: false,
    filesError: null,
    error: null,

    fetchStatus: async () => {
        set({ isLoadingStatus: true, error: null })
        try {
            const { success, message, data } = await googleDriveService.getStatus()
            if (!success) throw new Error(message)

            set({ status: data })
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingStatus: false })
        }
    },

    getAuthUrl: async () => {
        set({ error: null })
        try {
            const { success, message, data } = await googleDriveService.getAuthUrl()
            if (!success) throw new Error(message)
            return data.url
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        }
    },

    connect: async (code) => {
        set({ isLoadingConnect: true, error: null })
        try {
            const { success, message, data } = await googleDriveService.connect(code)
            if (!success) throw new Error(message)

            set((state) => ({ status: { ...state.status, isConnected: true, email: data.email } }))
            useSuccessStore.getState().notify('Google Drive', 'Диск подключён')
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingConnect: false })
        }
    },

    disconnect: async () => {
        set({ isLoadingConnect: true, error: null })
        try {
            const { success, message } = await googleDriveService.disconnect()
            if (!success) throw new Error(message)

            set((state) => ({
                status: { ...state.status, isConnected: false, email: null },
                files: [],
                breadcrumbs: [],
            }))
            useSuccessStore.getState().notify('Google Drive', 'Диск отключён')
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingConnect: false })
        }
    },

    /** Ошибку списка держим отдельно: неподключённый диск — это не сбой страницы. */
    fetchFiles: async (params = {}) => {
        set({ isLoadingFiles: true, filesError: null })
        try {
            const { success, message, data } = await googleDriveService.listFiles(params)
            if (!success) throw new Error(message)

            set({
                files: data.files ?? [],
                breadcrumbs: data.breadcrumbs ?? [],
                nextPageToken: data.nextPageToken ?? null,
            })
            return data
        } catch (err) {
            set({ files: [], breadcrumbs: [], filesError: handleError(err) })
            return null
        } finally {
            set({ isLoadingFiles: false })
        }
    },

    /** Локально помечаем файл как подключённый после импорта. */
    markLinked: (driveFileId, knowledgeFile) => set((state) => ({
        files: state.files.map((f) => (
            f.id === driveFileId
                ? { ...f, isLinked: true, knowledgeFileId: knowledgeFile._id, isIndexed: Boolean(knowledgeFile.vectorData?.isIndexed) }
                : f
        )),
    })),
}))

export default useGoogleDriveStore
