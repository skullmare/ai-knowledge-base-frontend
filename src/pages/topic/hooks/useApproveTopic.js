import { useState, useCallback } from 'react'
import useTopicStore from '@store/topic'

export const useApproveTopic = (id, onSuccess, forceSync) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { approveTopic, isLoadingApproveTopic } = useTopicStore()

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const handleApprove = useCallback(async () => {
    try {
      // Гарантируем сохранение актуального контента в БД перед approve
      await forceSync?.()
      await approveTopic(id)
      closeModal()
      onSuccess?.()
    } catch (error) {
      console.error('Ошибка при одобрении:', error)
    }
  }, [approveTopic, id, closeModal, onSuccess, forceSync])

  return {
    isModalOpen,
    isLoading: isLoadingApproveTopic,
    openModal,
    closeModal,
    handleApprove
  }
}
