import { useState } from 'react'

export function useDeleteUserModal(deleteUser) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const openModal = (row) => {
        setUser(row)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setUser(null)
    }

    const handleDelete = async () => {
        if (!user) return
        setIsLoading(true)
        try {
            await deleteUser(user._id)
            closeModal()
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isModalOpen,
        user,
        isLoading,
        openModal,
        closeModal,
        handleDelete,
    }
}