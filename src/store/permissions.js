import { create } from 'zustand'
import { permissionsService } from '@services/permissions'
import { handleError } from '../utils/handleError'

const usePermissionsStore = create((set) => ({
    permissions: [],
    isLoadingFetchPermissions: false,
    error: null,

    fetchPermissions: async () => {
        set({ isLoadingFetchPermissions: true, error: null })
        try {
            const { success, message, data } = await permissionsService.getPermissions()
            if (success) {
                set({ permissions: data })
                return data
            } else {
                set({ error: message })
                throw new Error(message)
            }
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingFetchPermissions: false })
        }
    },
}))

export default usePermissionsStore
