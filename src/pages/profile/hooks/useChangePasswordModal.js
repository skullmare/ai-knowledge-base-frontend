import { useState } from 'react'
import { passwordService } from '@services/password'

export function useChangePasswordModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isChanging, setIsChanging] = useState(false)
    const [touched, setTouched] = useState({ oldPassword: false, newPassword: false, confirmPassword: false })

    const open = () => {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTouched({ oldPassword: false, newPassword: false, confirmPassword: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTouched({ oldPassword: false, newPassword: false, confirmPassword: false })
    }

    const passwordsMatch = newPassword === confirmPassword
    const isValid = oldPassword.trim() && newPassword.trim() && confirmPassword.trim() && passwordsMatch

    const handleSave = async () => {
        setTouched({ oldPassword: true, newPassword: true, confirmPassword: true })
        if (!isValid) return

        setIsChanging(true)
        try {
            await passwordService.change({ oldPassword, newPassword, confirmPassword })
            close()
        } finally {
            setIsChanging(false)
        }
    }

    return {
        isOpen, open, close,
        oldPassword, setOldPassword,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        passwordsMatch,
        isChanging,
        touched,
        handleSave,
    }
}
