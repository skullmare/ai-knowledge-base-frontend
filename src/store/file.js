import { create } from 'zustand'
import { fileService } from '@services/file'
import { handleError } from '../utils/handleError'

const useFileStore = create((set) => ({
    isLoadingUpload: false,
    error: null,

    upload: async (file) => {
        set({ isLoadingUpload: true, error: null })
        try {
            const data = await fileService.upload(file)
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingUpload: false })
        }
    },
}))

export default useFileStore
