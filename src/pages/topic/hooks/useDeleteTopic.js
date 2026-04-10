import { useState, useCallback } from 'react'
import useTopicStore from '@store/topic'

export const useDeleteTopic = (id, onSuccess) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { deleteTopic, isLoadingDeleteTopic } = useTopicStore()

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  const handleDelete = useCallback(async () => {
    try {
      await deleteTopic(id)
      closeModal()
      onSuccess?.()
    } catch (error) {
      console.error('Ошибка при удалении:', error)
    }
  }, [deleteTopic, id, closeModal, onSuccess])

  return {
    isModalOpen,
    isLoading: isLoadingDeleteTopic,
    openModal,
    closeModal,
    handleDelete
  }
}