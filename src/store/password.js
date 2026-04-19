import { create } from 'zustand'
import { passwordService } from '@services/password'
import { handleError } from '../utils/handleError'

const usePasswordStore = create((set) => ({
    isLoadingChangePassword: false,
    isLoadingForgotPassword: false,
    isLoadingResetPassword: false,
    error: null,

    changePassword: async (payload) => {
        set({ isLoadingChangePassword: true, error: null })
        try {
            const data = await passwordService.change(payload)
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingChangePassword: false })
        }
    },

    forgotPassword: async (payload) => {
        set({ isLoadingForgotPassword: true, error: null })
        try {
            const data = await passwordService.forgot(payload)
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingForgotPassword: false })
        }
    },

    resetPassword: async (token, payload) => {
        set({ isLoadingResetPassword: true, error: null })
        try {
            const data = await passwordService.reset(token, payload)
            return data
        } catch (err) {
            const errorMessage = handleError(err)
            set({ error: errorMessage })
            throw new Error(errorMessage)
        } finally {
            set({ isLoadingResetPassword: false })
        }
    },
}))

export default usePasswordStore
