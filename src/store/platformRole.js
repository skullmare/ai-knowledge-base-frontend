// stores/usePlatformRoleStore.js
import { create } from 'zustand';
import { platformRoleService } from '../services/platformRole';
import { handleError } from '../utils/handleError';
import { syncEntityUpdate } from '../utils/syncStores';

const usePlatformRoleStore = create((set, get) => ({
    roles: [],
    currentRole: null,
    isLoading: false,
    error: null,

    fetchRoles: async (queryParams = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await platformRoleService.getAll(queryParams);
            const { success, message, data } = response;

            if (success) {
                set({
                    roles: data
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

    fetchOneRole: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data } = await platformRoleService.getOne(id);
            if (success) {
                set({ currentRole: data });
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

    createRole: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data: newRole } = await platformRoleService.create(data);
            if (success) {
                set((state) => ({
                    roles: [newRole, ...state.roles]
                }));
                return newRole;
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

    updateRole: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data: updatedRole } = await platformRoleService.update(id, data);
            if (success) {
                set((state) => ({
                    roles: state.roles.map((r) => (r._id === id ? updatedRole : r)),
                    currentRole: state.currentRole?._id === id ? updatedRole : state.currentRole,
                }));
                syncEntityUpdate('platformRole', id, updatedRole);
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

    deleteRole: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message } = await platformRoleService.delete(id);
            if (success) {
                set((state) => ({
                    roles: state.roles.filter((r) => r._id !== id),
                    currentRole: state.currentRole?._id === id ? null : state.currentRole,
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

    deleteManyRoles: async (ids) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message } = await platformRoleService.deleteMany(ids);
            if (success) {
                set((state) => ({
                    roles: state.roles.filter((r) => !ids.includes(r._id))
                }));
                // syncEntityDelete не нужен
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

    clearCurrentRole: () => set({ currentRole: null }),
}));

export default usePlatformRoleStore;