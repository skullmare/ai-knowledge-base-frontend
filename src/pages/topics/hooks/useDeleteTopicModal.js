import { useState } from 'react'
import useTopicStore from '@store/topic'

export function useDeleteTopicModal() {
    const { deleteTopic, isLoadingDeleteTopic } = useTopicStore()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [targetTopic, setTargetTopic] = useState(null)

    const openModal = (topic) => {
        setTargetTopic(topic)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setTargetTopic(null)
    }

    const handleDelete = async () => {
        if (!targetTopic) return
        try {
            await deleteTopic(targetTopic._id)
            closeModal()
        } catch (e) {
            // ошибка обрабатывается в store
        }
    }

    return {
        isModalOpen,
        isLoading: isLoadingDeleteTopic,
        targetTopic,
        openModal,
        closeModal,
        handleDelete,
    }
}