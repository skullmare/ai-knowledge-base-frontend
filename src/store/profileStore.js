import { create } from 'zustand';
import { profileService } from '../services/profileService';
import { handleError } from '../utils/handleError';

const useProfileStore = create((set, get) => ({
    profile: null,
    permissions: [],
    isSystem: false,
    isLoading: false,
    error: null,
    isInitialized: false,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data } = await profileService.getProfile();
            if (success) {
                set({
                    profile: data,
                    permissions: data.role?.permissions || [],
                    isSystem: data.isSystem || data.role?.isSystem || false,
                    isInitialized: true
                });
            } else {
                set({ error: message, isInitialized: true });
            }

        } catch (err) {
            const errorMessage = handleError(err);
            set({ profile: null, permissions: [], isSystem: false, isInitialized: true, error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { success, message, data } = await profileService.updateProfile(payload);
            if (success) {
                set({
                    profile: data
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

    checkPermission: (permission) => {
        const { permissions } = get();
        if (!permission) return true;

        if (Array.isArray(permission)) {
            return permission.every(p => permissions.includes(p));
        }
        return permissions.includes(permission);
    },

    clearProfile: () => set({ profile: null, permissions: [], isSystem: false, isInitialized: false })
}));

export default useProfileStore;