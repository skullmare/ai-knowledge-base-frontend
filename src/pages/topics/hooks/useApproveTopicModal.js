import { useState } from 'react'
import useTopicStore from '@store/topic'

export function useApproveTopicModal() {
    const { approveTopic, isLoadingApproveTopic } = useTopicStore()

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

    const handleApprove = async () => {
        if (!targetTopic) return
        try {
            await approveTopic(targetTopic._id)
            closeModal()
        } catch {
            // ошибка уже разобрана и показана в store
        }
    }

    return {
        isModalOpen,
        isLoading: isLoadingApproveTopic,
        targetTopic,
        openModal,
        closeModal,
        handleApprove,
    }
}