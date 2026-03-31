// stores/useLogStore.js
import { create } from 'zustand';
import { logService } from '../services/log';
import { handleError } from '../utils/handleError';

const useLogStore = create((set, get) => ({
    logs: [],
    currentLog: null,
    isLoading: false,
    error: null,
    pagination: {
        total: 0,
        pages: 1,
        current: 1,
        limit: 20,
    },

    /**
     * Получить список логов с фильтрацией и пагинацией
     * @param {Object} queryParams - параметры запроса
     * @param {number} queryParams.page - номер страницы
     * @param {number} queryParams.limit - количество на странице
     * @param {string} queryParams.action - тип действия
     * @param {string} queryParams.entityType - тип сущности
     * @param {string} queryParams.entityId - ID сущности
     * @param {string} queryParams.user - ID пользователя
     * @param {'success'|'error'} queryParams.status - статус выполнения
     * @param {string} queryParams.search - поиск по сообщению
     * @param {string} queryParams.startDate - начальная дата (ISO)
     * @param {string} queryParams.endDate - конечная дата (ISO)
     */
    fetchLogs: async (queryParams = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await logService.getAll(queryParams);
            const { success, message, data, pagination } = response;

            if (success) {
                set({
                    logs: data,
                    pagination: {
                        total: Number(pagination.total),
                        pages: Number(pagination.pages),
                        current: Number(pagination.current),
                        limit: Number(pagination.limit),
                    }
                });
            } else {
                set({ error: message });
                throw new Error(message);
            }
        } catch (err) {
            const errorMessage = handleError(err);
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Получить один лог по ID
     * @param {string} id - ID лога
     */
    fetchOneLog: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data } = await logService.getOne(id);
            if (success) {
                set({ currentLog: data });
            } else {
                set({ error: message });
                throw new Error(message);
            }
        } catch (err) {
            const errorMessage = handleError(err);
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoading: false });
        }
    },

    clearCurrentLog: () => set({ currentLog: null }),
    
    clearLogs: () => set({ logs: [], pagination: { total: 0, pages: 1, current: 1, limit: 20 } }),
}));

export default useLogStore;