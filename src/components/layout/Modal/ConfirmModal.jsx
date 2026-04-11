// components/ui/ConfirmModal.jsx
import React from 'react';
import Modal from '@layout/Modal/Modal';
import Attention from '@assets/icons/attention-16.svg';

// Предопределенные конфиги для разных типов действий
const MODAL_CONFIGS = {
  delete: {
    title: 'Подтвердите действие',
    confirmLabel: 'Удалить',
    defaultMessage: 'Вы точно хотите удалить этот элемент?',
  },
  approve: {
    title: 'Подтвердите действие',
    confirmLabel: 'Одобрить',
    defaultMessage: 'Вы точно хотите одобрить этот элемент?',
  },
  warning: {
    title: 'Внимание',
    confirmLabel: 'Продолжить',
    defaultMessage: 'Вы уверены, что хотите продолжить?',
  },
  info: {
    title: 'Информация',
    confirmLabel: 'OK',
    defaultMessage: '',
  },
};

const ConfirmModal = ({ 
  isOpen, 
  type = 'warning', 
  isLoading = false, 
  onConfirm, 
  onClose,
  title,           // переопределение заголовка
  confirmLabel,    // переопределение текста кнопки
  cancelLabel = 'Отмена',  // текст кнопки отмены
  message,         // кастомное сообщение
  children,        // кастомный контент вместо message
  icon = <Attention width="20px" height="20px" />,
  variant = 'danger', // danger, primary, warning
}) => {
  if (!isOpen) return null;

  const config = MODAL_CONFIGS[type] || MODAL_CONFIGS.warning;
  
  const finalTitle = title || config.title;
  const finalConfirmLabel = confirmLabel || config.confirmLabel;
  const content = children || message || config.defaultMessage;

  return (
    <Modal
      title={finalTitle}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel={finalConfirmLabel}
      cancelLabel={cancelLabel}
      isLoading={isLoading}
      icon={icon}
      variant={variant}
    >
      {typeof content === 'string' ? <p>{content}</p> : content}
    </Modal>
  );
};

export default ConfirmModal;