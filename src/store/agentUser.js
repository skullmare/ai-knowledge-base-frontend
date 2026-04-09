// stores/useAgentUserStore.js
import { create } from 'zustand';
import { agentUserService } from '../services/agentUser';
import { handleError } from '../utils/handleError';
import { storeRegistry } from '../utils/storeRegistry';

const useAgentUserStore = create((set, get) => ({
    users: [],
    currentUser: null,
    isLoadingFetchUsers: false,
    isLoadingFetchOneUser: false,
    isLoadingUpdateUser: false,
    isLoadingDeleteUser: false,
    error: null,
    pagination: {
        total: 0,
        pages: 1,
        current: 1,
        limit: 10,
    },

    updateEntityInStore: (entityId, updatedEntity) => {
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
        set({ isLoadingFetchUsers: true, error: null });
        try {
            const response = await agentUserService.getAll(queryParams);
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
            set({ isLoadingFetchUsers: false });
        }
    },

    fetchOneUser: async (id) => {
        set({ isLoadingFetchOneUser: true, error: null });
        try {
            const { success, message, data } = await agentUserService.getOne(id);
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
            set({ isLoadingFetchOneUser: false });
        }
    },

    updateUser: async (id, data) => {
        set({ isLoadingUpdateUser: true, error: null });
        try {
            const { success, message, data: updatedUser } = await agentUserService.update(id, data);
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
            set({ isLoadingUpdateUser: false });
        }
    },

    deleteUser: async (id) => {
        set({ isLoadingDeleteUser: true, error: null });
        try {
            const { success, message } = await agentUserService.delete(id);
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
            set({ isLoadingDeleteUser: false });
        }
    },

    clearCurrentUser: () => set({ currentUser: null }),
}));

storeRegistry.register('agentRole', useAgentUserStore);

export default useAgentUserStore;