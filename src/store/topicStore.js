import { create } from 'zustand';
import { topicService } from '../services/topicService';
import { handleError } from '../utils/handleError';

const useTopicStore = create((set, get) => ({
    topics: [],
    currentTopic: null,
    isLoading: false,
    error: null,
    pagination: {
        total: 0,
        pages: 1,
        current: 1,
        limit: 10,
    },

    fetchTopics: async (queryParams = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await topicService.getAll(queryParams);
            const { success, message, data, pagination } = response;

            if (success) {
                set({
                    topics: data,
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

    fetchOneTopic: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data } = await topicService.getOne(id);
            if (success) {
                set({ currentTopic: data });
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

    createTopic: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data: newTopic } = await topicService.create(data);
            if (success) {
                set((state) => ({
                    topics: [newTopic, ...state.topics]
                }));
                return newTopic;
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

    updateTopic: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data: updatedTopic } = await topicService.update(id, data);
            if (success) {
                set((state) => ({
                    topics: state.topics.map((t) => (t._id === id ? updatedTopic : t)),
                    currentTopic: state.currentTopic?._id === id ? updatedTopic : state.currentTopic,
                }));
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

    deleteTopic: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message } = await topicService.delete(id);
            if (success) {
                set((state) => ({
                    topics: state.topics.filter((t) => t._id !== id)
                }));
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

    approveTopic: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data } = await topicService.approve(id);
            if (success) {
                set((state) => ({
                    topics: state.topics.map((t) => (t._id === id ? data : t))
                }));
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

    clearCurrentTopic: () => set({ currentTopic: null }),
}));

export default useTopicStore;