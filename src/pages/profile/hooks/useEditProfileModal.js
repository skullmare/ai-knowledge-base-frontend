import { useState } from 'react'
import useFileStore from '@store/file'
import useProfileStore from '@store/profile'

export function useEditProfileModal() {
    const updateProfile = useProfileStore((s) => s.updateProfile)
    const upload = useFileStore((s) => s.upload)

    const [isOpen, setIsOpen] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    const [original, setOriginal] = useState(null)
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [touched, setTouched] = useState({ firstName: false, lastName: false })

    const open = (profile) => {
        setFirstName(profile.firstName ?? '')
        setLastName(profile.lastName ?? '')
        setPhotoUrl(profile.photoUrl ?? '')
        setOriginal({
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            photoUrl: profile.photoUrl ?? '',
        })
        setTouched({ firstName: false, lastName: false })
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setFirstName('')
        setLastName('')
        setPhotoUrl('')
        setOriginal(null)
        setTouched({ firstName: false, lastName: false })
    }

    const handlePhotoUpload = async (file) => {
        if (!file) return
        setIsUploadingPhoto(true)
        try {
            const res = await upload(file)
            if (res.success) setPhotoUrl(res.data.url)
        } finally {
            setIsUploadingPhoto(false)
        }
    }

    const handleSave = async () => {
        setTouched({ firstName: true, lastName: true })
        if (!firstName.trim() || !lastName.trim()) return

        const patch = {}
        if (firstName.trim() !== original.firstName.trim()) patch.firstName = firstName.trim()
        if (lastName.trim() !== original.lastName.trim()) patch.lastName = lastName.trim()
        if (photoUrl.trim() !== original.photoUrl.trim()) patch.photoUrl = photoUrl.trim()

        if (!Object.keys(patch).length) {
            close()
            return
        }

        setIsSaving(true)
        try {
            await updateProfile(patch)
            close()
        } finally {
            setIsSaving(false)
        }
    }

    return {
        isOpen, open, close,
        firstName, setFirstName,
        lastName, setLastName,
        photoUrl, setPhotoUrl,
        isUploadingPhoto,
        handlePhotoUpload,
        isSaving,
        touched,
        handleSave,
    }
}
