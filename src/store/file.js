import { create } from 'zustand'
import { fileService } from '@services/file'
import { handleError } from '../utils/handleError'
import useSuccessStore from './success'

const useFileStore = create((set, get) => ({
    files: [],
    pagination: { current: 1, limit: 10, total: 0 },
    uploadProgress: 0,
    isLoadingUpload: false,
    isLoadingFetchFiles: false,
    isLoadingCreateFile: false,
    isLoadingUpdateFile: false,
    isLoadingDeleteFile: false,
    isLoadingVectorize: false,
    error: null,

    /** Загрузка в объектное хранилище (используется и аватарами, и базой знаний). */
    upload: async (file, options = {}) => {
        set({ isLoadingUpload: true, uploadProgress: 0, error: null })
        try {
            const data = await fileService.upload(file, {
                ...options,
                onProgress: (percent) => {
                    set({ uploadProgress: percent })
                    options.onProgress?.(percent)
                },
            })
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingUpload: false })
        }
    },

    fetchFiles: async (queryParams = {}) => {
        set({ isLoadingFetchFiles: true, error: null })
        try {
            const { success, message, data, pagination } = await fileService.getAll(queryParams)
            if (!success) throw new Error(message)

            set({
                files: data.files ?? [],
                pagination: pagination ?? get().pagination,
            })
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingFetchFiles: false })
        }
    },

    /** Полный цикл: загрузка в хранилище + регистрация файла в базе знаний. */
    createFile: async (file, { name, accessibleByRoles = [], onProgress } = {}) => {
        set({ isLoadingCreateFile: true, error: null })
        try {
            const uploaded = await get().upload(file, { onProgress })
            const { key, url, size, mimeType } = uploaded.data

            const { success, message, data } = await fileService.create({
                name: name?.trim() || file.name,
                originalName: file.name,
                key,
                url,
                size,
                mimeType,
                accessibleByRoles,
            })
            if (!success) throw new Error(message)

            set((state) => ({ files: [data, ...state.files] }))
            useSuccessStore.getState().notify('Файлы', 'Файл загружен')
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingCreateFile: false })
        }
    },

    importFromGoogleDrive: async (payload) => {
        set({ isLoadingCreateFile: true, error: null })
        try {
            const { success, message, data } = await fileService.importFromGoogleDrive(payload)
            if (!success) throw new Error(message)

            set((state) => ({ files: [data, ...state.files] }))
            useSuccessStore.getState().notify('Файлы', 'Файл из Google Drive добавлен')
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingCreateFile: false })
        }
    },

    updateFile: async (id, payload) => {
        set({ isLoadingUpdateFile: true, error: null })
        try {
            const { success, message, data } = await fileService.update(id, payload)
            if (!success) throw new Error(message)

            set((state) => ({ files: state.files.map((f) => (f._id === id ? data : f)) }))
            useSuccessStore.getState().notify('Файлы', 'Файл обновлён')
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingUpdateFile: false })
        }
    },

    deleteFile: async (id) => {
        set({ isLoadingDeleteFile: true, error: null })
        try {
            const { success, message } = await fileService.delete(id)
            if (!success) throw new Error(message)

            set((state) => ({ files: state.files.filter((f) => f._id !== id) }))
            useSuccessStore.getState().notify('Файлы', 'Файл удалён')
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingDeleteFile: false })
        }
    },

    vectorizeFile: async (id) => {
        set({ isLoadingVectorize: true, error: null })
        try {
            const { success, message, data } = await fileService.vectorize(id)
            if (!success) throw new Error(message)

            set((state) => ({ files: state.files.map((f) => (f._id === id ? data : f)) }))
            useSuccessStore.getState().notify('Файлы', 'Файл векторизован')
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingVectorize: false })
        }
    },

    devectorizeFile: async (id) => {
        set({ isLoadingVectorize: true, error: null })
        try {
            const { success, message, data } = await fileService.devectorize(id)
            if (!success) throw new Error(message)

            set((state) => ({ files: state.files.map((f) => (f._id === id ? data : f)) }))
            useSuccessStore.getState().notify('Файлы', 'Файл удалён из векторной базы')
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingVectorize: false })
        }
    },

    /** Временная ссылка на файл: inline — просмотр, иначе скачивание. */
    getFileLink: async (id, options) => {
        try {
            const { success, message, data } = await fileService.getLink(id, options)
            if (!success) throw new Error(message)
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        }
    },
}))

export default useFileStore
