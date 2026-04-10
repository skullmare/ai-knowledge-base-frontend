import React from 'react'
import Modal from '@layout/Modal/Modal'
import Attention from '@assets/icons/attention-16.svg'

const ConfirmModal = ({ isOpen, type, isLoading, onConfirm, onClose }) => {
  if (!isOpen) return null

  const config = {
    delete: {
      title: 'Подтвердите действие',
      confirmLabel: 'Удалить',
      children: (
        <>
          <p>Вы точно хотите удалить эту тему?</p>
        </>
      )
    },
    approve: {
      title: 'Подтвердите действие',
      confirmLabel: 'Одобрить',
      children: (
        <>
          <p>Вы точно хотите одобрить эту тему?</p>
        </>
      )
    }
  }

  const currentConfig = config[type]

  return (
    <Modal
      title={currentConfig.title}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel={currentConfig.confirmLabel}
      isLoading={isLoading}
      icon={<Attention width="20px" height="20px" />}
    >
      {currentConfig.children}
    </Modal>
  )
}

export default ConfirmModal