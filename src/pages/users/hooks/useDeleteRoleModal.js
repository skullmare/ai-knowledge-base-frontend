import { useState } from 'react'

export function useDeleteRoleModal(deleteRole) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [role, setRole] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const openModal = (r) => {
        setRole(r)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setRole(null)
    }

    const handleDelete = async () => {
        if (!role) return
        setIsLoading(true)
        try {
            await deleteRole(role._id)
            closeModal()
        } finally {
            setIsLoading(false)
        }
    }

    return { isModalOpen, role, isLoading, openModal, closeModal, handleDelete }
}
