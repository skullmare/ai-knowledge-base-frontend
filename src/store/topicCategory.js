// stores/useTopicCategoryStore.js
import { create } from 'zustand';
import { topicCategoryService } from '@services/topicCategory';
import { handleError } from '../utils/handleError';
import { syncEntityUpdate } from '../utils/syncStores';

const useTopicCategoryStore = create((set, get) => ({
    categories: [],
    currentCategory: null,
    isLoadingFetchCategories: false,
    isLoadingFetchOneCategory: false,
    isLoadingCreateCategory: false,
    isLoadingUpdateCategory: false,
    isLoadingDeleteCategory: false,
    isLoadingDeleteManyCategories: false,
    error: null,

    fetchCategories: async (queryParams = {}) => {
        set({ isLoadingFetchCategories: true, error: null });
        try {
            const response = await topicCategoryService.getAll(queryParams);
            const { success, message, data } = response;

            if (success) {
                set({ categories: data.categories ?? data })
            } else {
                set({ error: message });
                throw new Error(message);
            }
        } catch (err) {
            const errorMessage = handleError(err);
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoadingFetchCategories: false });
        }
    },

    fetchOneCategory: async (id) => {
        set({ isLoadingFetchOneCategory: true, error: null });
        try {
            const { success, message, data } = await topicCategoryService.getOne(id);
            if (success) {
                set({ currentCategory: data });
            } else {
                set({ error: message });
                throw new Error(message);
            }
        } catch (err) {
            const errorMessage = handleError(err);
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoadingFetchOneCategory: false });
        }
    },

    createCategory: async (data) => {
        set({ isLoadingCreateCategory: true, error: null });
        try {
            const { success, message, data: newCategory } = await topicCategoryService.create(data);
            if (success) {
                set((state) => ({
                    categories: [newCategory, ...state.categories]
                }));
                return newCategory;
            } else {
                set({ error: message });
                throw new Error(message);
            }
        } catch (err) {
            const errorMessage = handleError(err);
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoadingCreateCategory: false });
        }
    },

    updateCategory: async (id, data) => {
        set({ isLoadingUpdateCategory: true, error: null });
        try {
            const { success, message, data: updatedCategory } = await topicCategoryService.update(id, data);
            if (success) {
                set((state) => ({
                    categories: state.categories.map((c) => (c._id === id ? updatedCategory : c)),
                    currentCategory: state.currentCategory?._id === id ? updatedCategory : state.currentCategory,
                }));
                syncEntityUpdate('topicCategory', id, updatedCategory);
            } else {
                set({ error: message });
                throw new Error(message);
            }
        } catch (err) {
            const errorMessage = handleError(err);
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoadingUpdateCategory: false });
        }
    },

    deleteCategory: async (id) => {
        set({ isLoadingDeleteCategory: true, error: null });
        try {
            const { success, message } = await topicCategoryService.delete(id);
            if (success) {
                set((state) => ({
                    categories: state.categories.filter((c) => c._id !== id),
                    currentCategory: state.currentCategory?._id === id ? null : state.currentCategory,
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
            set({ isLoadingDeleteCategory: false });
        }
    },

    deleteManyCategories: async (ids) => {
        set({ isLoadingDeleteManyCategories: true, error: null });
        try {
            const { success, message } = await topicCategoryService.deleteMany(ids);
            if (success) {
                set((state) => ({
                    categories: state.categories.filter((c) => !ids.includes(c._id))
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
            set({ isLoadingDeleteManyCategories: false });
        }
    },

    clearCurrentCategory: () => set({ currentCategory: null }),
}));

export default useTopicCategoryStore;