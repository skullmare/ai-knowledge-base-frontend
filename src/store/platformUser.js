// stores/usePlatformUserStore.js
import { create } from 'zustand';
import { userService } from '../services/user';
import { handleError } from '../utils/handleError';
import { storeRegistry } from '../utils/storeRegistry';

const usePlatformUserStore = create((set, get) => ({
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
    pagination: {
        total: 0,
        pages: 1,
        current: 1,
        limit: 10,
    },

    updateEntityInStore: (entityType, entityId, updatedEntity) => {
        if (entityType !== 'platformRole') return;
        
        set((state) => ({
            users: state.users.map((user) => ({
                ...user,
                role: user.role?._id === entityId ? updatedEntity : user.role
            })),
            currentUser: state.currentUser?.role?._id === entityId
                ? { ...state.currentUser, role: updatedEntity }
                : state.currentUser,
        }));
    },

    fetchUsers: async (queryParams = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await userService.getAll(queryParams);
            const { success, message, data, pagination } = response;

            if (success) {
                set({
                    users: data,
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

    fetchOneUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data } = await userService.getOne(id);
            if (success) {
                set({ currentUser: data });
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

    createUser: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data: newUser } = await userService.create(data);
            if (success) {
                set((state) => ({
                    users: [newUser, ...state.users]
                }));
                return newUser;
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

    updateUser: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data: updatedUser } = await userService.update(id, data);
            if (success) {
                set((state) => ({
                    users: state.users.map((u) => (u._id === id ? updatedUser : u)),
                    currentUser: state.currentUser?._id === id ? updatedUser : state.currentUser,
                }));
                return updatedUser;
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

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message } = await userService.delete(id);
            if (success) {
                set((state) => ({
                    users: state.users.filter((u) => u._id !== id),
                    currentUser: state.currentUser?._id === id ? null : state.currentUser,
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

    clearCurrentUser: () => set({ currentUser: null }),
}));

storeRegistry.register('platformRole', usePlatformUserStore);

export default usePlatformUserStore;