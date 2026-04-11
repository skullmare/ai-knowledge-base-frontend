// stores/useAgentRoleStore.js
import { create } from 'zustand';
import { agentRoleService } from '@services/agentRole';
import { handleError } from '../utils/handleError';
import { syncEntityUpdate } from '../utils/syncStores';

const useAgentRoleStore = create((set, get) => ({
    roles: [],
    currentRole: null,
    isLoadingFetchRoles: false,
    isLoadingFetchOneRole: false,
    isLoadingCreateRole: false,
    isLoadingUpdateRole: false,
    isLoadingDeleteRole: false,
    isLoadingDeleteManyRoles: false,
    error: null,

    fetchRoles: async (queryParams = {}) => {
        set({ isLoadingFetchRoles: true, error: null });
        try {
            const response = await agentRoleService.getAll(queryParams);
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
            set({ isLoadingFetchRoles: false });
        }
    },

    fetchOneRole: async (id) => {
        set({ isLoadingFetchOneRole: true, error: null });
        try {
            const { success, message, data } = await agentRoleService.getOne(id);
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
            set({ isLoadingFetchOneRole: false });
        }
    },

    createRole: async (data) => {
        set({ isLoadingCreateRole: true, error: null });
        try {
            const { success, message, data: newRole } = await agentRoleService.create(data);
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
            set({ isLoadingCreateRole: false });
        }
    },

    updateRole: async (id, data) => {
        set({ isLoadingUpdateRole: true, error: null });
        try {
            const { success, message, data: updatedRole } = await agentRoleService.update(id, data);
            if (success) {
                set((state) => ({
                    roles: state.roles.map((r) => (r._id === id ? updatedRole : r)),
                    currentRole: state.currentRole?._id === id ? updatedRole : state.currentRole,
                }));
                syncEntityUpdate('agentRole', id, updatedRole);
            } else {
                set({ error: message });
                throw new Error(message);
            }
        } catch (err) {
            const errorMessage = handleError(err);
            set({ error: errorMessage });
            throw new Error(errorMessage);
        } finally {
            set({ isLoadingUpdateRole: false });
        }
    },

    deleteRole: async (id) => {
        set({ isLoadingDeleteRole: true, error: null });
        try {
            const { success, message } = await agentRoleService.delete(id);
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
            set({ isLoadingDeleteRole: false });
        }
    },

    deleteManyRoles: async (ids) => {
        set({ isLoadingDeleteManyRoles: true, error: null });
        try {
            const { success, message } = await agentRoleService.deleteMany(ids);
            if (success) {
                set((state) => ({
                    roles: state.roles.filter((r) => !ids.includes(r._id))
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
            set({ isLoadingDeleteManyRoles: false });
        }
    },

    clearCurrentRole: () => set({ currentRole: null }),
}));

export default useAgentRoleStore;