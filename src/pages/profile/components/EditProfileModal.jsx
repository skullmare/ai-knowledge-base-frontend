import { useRef } from 'react'
import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import './EditProfileModal.css'

export function EditProfileModal({
    firstName, onFirstNameChange,
    lastName, onLastNameChange,
    photoUrl, onPhotoUrlChange,
    onPhotoUpload, isUploadingPhoto,
    touched, isSaving, onConfirm, onClose,
}) {
    const fileInputRef = useRef(null)
    const isValid = firstName.trim() && lastName.trim()

    return (
        <Modal
            title="Редактирование профиля"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Сохранить"
            confirmDisabled={!isValid || isSaving || isUploadingPhoto}
            isLoading={isSaving}
        >
            <div className="edit-profile-modal__avatar-section">
                {photoUrl ? (
                    <img className="edit-profile-modal__avatar-img" src={photoUrl} alt="Аватар" />
                ) : (
                    <span className="edit-profile-modal__avatar-placeholder" />
                )}
                <div className="edit-profile-modal__avatar-actions">
                    <button
                        type="button"
                        className="edit-profile-modal__avatar-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                    >
                        {isUploadingPhoto ? 'Загрузка...' : 'Загрузить фото'}
                    </button>
                    {photoUrl && (
                        <button
                            type="button"
                            className="edit-profile-modal__avatar-btn edit-profile-modal__avatar-btn--remove"
                            onClick={() => onPhotoUrlChange('')}
                            disabled={isUploadingPhoto}
                        >
                            Удалить фото
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) onPhotoUpload(file)
                            e.target.value = ''
                        }}
                    />
                </div>
            </div>
            <Input
                variant="default"
                size="large"
                placeholder="Имя"
                showClearButton
                label="Имя"
                required
                error={touched.firstName && !firstName.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
            />
            <Input
                variant="default"
                size="large"
                placeholder="Фамилия"
                showClearButton
                label="Фамилия"
                required
                error={touched.lastName && !lastName.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
            />
        </Modal>
    )
}
