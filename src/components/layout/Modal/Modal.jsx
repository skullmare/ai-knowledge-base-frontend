import { useEffect } from 'react';
import Button from '@ui/Button/Button';
import Input from '@ui/Input/Input';
import Close from '@assets/icons/close-16.svg';
import './Modal.css';

export default function Modal({ title, onClose, onConfirm, confirmLabel = 'Создать', children }) {
  useEffect(() => {
    const handleKeyDown = ({ key }) => { if (key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div className="modal__backdrop modal__backdrop--visible" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Закрыть"><Close width="20px" height="20px" /></button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">
          <Button size="modal" variant="secondary" onClick={onClose}>Отмена</Button>
          <Button size="modal" variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </>
  );
}