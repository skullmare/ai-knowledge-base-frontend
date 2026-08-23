import { create } from 'zustand'
import { systemSettingsService } from '@services/systemSettings'
import { handleError } from '../utils/handleError'
import useSuccessStore from './success'

const useSystemSettingsStore = create((set, get) => ({
    settings: [],
    // Значения, зашитые в бэкенде: модель эмбеддингов и размерность векторов
    fixed: { embeddingModel: '', embeddingDimensions: null },
    models: [],
    isLoadingFetchSettings: false,
    isLoadingUpdateSettings: false,
    isLoadingFetchModels: false,
    isLoadingTestConnection: false,
    isLoadingRecreate: false,
    modelsError: null,
    error: null,

    fetchSettings: async () => {
        set({ isLoadingFetchSettings: true, error: null })
        try {
            const { success, message, data } = await systemSettingsService.getAll()
            if (!success) throw new Error(message)

            set({ settings: data.settings ?? [], fixed: data.fixed ?? get().fixed })
            return data.settings
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingFetchSettings: false })
        }
    },

    updateSettings: async (values) => {
        set({ isLoadingUpdateSettings: true, error: null })
        try {
            const { success, message } = await systemSettingsService.update(values)
            if (!success) throw new Error(message)

            // Секреты сервер не возвращает — перечитываем состояние целиком
            const { data } = await systemSettingsService.getAll()
            set({ settings: data.settings ?? [], fixed: data.fixed ?? get().fixed })

            useSuccessStore.getState().notify('Настройки системы', 'Настройки сохранены')
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingUpdateSettings: false })
        }
    },

    /** Список моделей RouterAI. Ошибка не считается сбоем страницы — показываем её рядом с полем. */
    fetchModels: async () => {
        set({ isLoadingFetchModels: true, modelsError: null })
        try {
            const { success, message, data } = await systemSettingsService.getModels()
            if (!success) throw new Error(message)

            set({ models: data.models ?? [] })
            return data.models
        } catch (err) {
            set({ models: [], modelsError: handleError(err) })
            return []
        } finally {
            set({ isLoadingFetchModels: false })
        }
    },

    testConnection: async (payload) => {
        set({ isLoadingTestConnection: true, error: null })
        try {
            const { success, message, data } = await systemSettingsService.testConnection(payload)
            if (!success) throw new Error(message)

            useSuccessStore.getState().notify(
                'RouterAI',
                `Подключение работает, доступно моделей: ${data.modelsCount}`
            )
            set({ models: data.models ?? [], modelsError: null })
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingTestConnection: false })
        }
    },

    /** Пересоздание коллекции Qdrant после смены модели эмбеддингов. */
    recreateCollection: async () => {
        set({ isLoadingRecreate: true, error: null })
        try {
            const { success, message, data } = await systemSettingsService.recreateCollection()
            if (!success) throw new Error(message)

            useSuccessStore.getState().notify(
                'Векторная база',
                `Коллекция пересоздана (размерность ${data.vectorSize}). Требуется повторная векторизация: тем — ${data.resetTopics}, файлов — ${data.resetFiles}.`
            )
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingRecreate: false })
        }
    },
}))

export default useSystemSettingsStore
