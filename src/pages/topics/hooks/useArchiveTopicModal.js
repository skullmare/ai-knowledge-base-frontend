import { useState } from 'react'
import useTopicStore from '@store/topic'

export const useArchiveTopicModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState(null)
    const { updateTopic, isLoadingUpdateTopic } = useTopicStore()

    const openModal = (topic) => {
        setSelectedTopic(topic)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedTopic(null)
        setIsModalOpen(false)
    }

    const handleArchive = async () => {
        if (!selectedTopic) return
        try {
            await updateTopic(selectedTopic._id, { status: 'archived' })
            closeModal()
        } catch (err) {
            console.error(err)
        }
    }

    return {
        isModalOpen,
        isLoading: isLoadingUpdateTopic,
        openModal,
        closeModal,
        handleArchive,
    }
}