import { useState, useCallback } from 'react'
import useTopicStore from '@store/topic'

export const useApproveTopic = (id, onSuccess) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { approveTopic, isLoadingApproveTopic } = useTopicStore()

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const handleApprove = useCallback(async () => {
    try {
      await approveTopic(id)
      closeModal()
      onSuccess?.()
    } catch (error) {
      console.error('Ошибка при одобрении:', error)
    }
  }, [approveTopic, id, closeModal, onSuccess])

  return {
    isModalOpen,
    isLoading: isLoadingApproveTopic,
    openModal,
    closeModal,
    handleApprove
  }
}