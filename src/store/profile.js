// stores/useProfileStore.js
import { create } from 'zustand';
import { profileService } from '../services/profile';
import { handleError } from '../utils/handleError';
import { storeRegistry } from '../utils/storeRegistry';

const useProfileStore = create((set, get) => ({
    profile: null,
    permissions: [],
    isSystem: false,
    isLoadingFetchProfile: false,
    isLoadingUpdateProfile: false,
    error: null,
    isInitialized: false,

    updateEntityInStore: (entityType, entityId, updatedEntity) => {
        if (entityType !== 'platformRole') return;
        
        const { profile } = get();
        
        if (profile?.role?._id === entityId) {
            set({
                profile: {
                    ...profile,
                    role: updatedEntity
                },
                permissions: updatedEntity.permissions || [],
                isSystem: profile.isSystem || updatedEntity.isSystem || false,
            });
        }
    },

    fetchProfile: async () => {
        set({ isLoadingFetchProfile: true, error: null });
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
            set({ isLoadingFetchProfile: false });
        }
    },

    updateProfile: async (payload) => {
        set({ isLoadingUpdateProfile: true, error: null });
        try {
            const { success, message, data } = await profileService.updateProfile(payload);
            if (success) {
                set({
                    profile: data,
                    permissions: data.role?.permissions || [],
                    isSystem: data.isSystem || data.role?.isSystem || false,
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
            set({ isLoadingUpdateProfile: false });
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

storeRegistry.register('platformRole', useProfileStore);

export default useProfileStore;