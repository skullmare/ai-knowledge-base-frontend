import { useRef } from 'react'
import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import Dropdown from '@ui/Dropdown/Dropdown'
import './EditPlatformUserModal.css'

export function EditPlatformUserModal({
    firstName, onFirstNameChange,
    lastName, onLastNameChange,
    login, onLoginChange,
    email, onEmailChange,
    photoUrl, onPhotoUrlChange,
    onPhotoUpload, isUploadingPhoto,
    roleOptions, selectedRole, onRoleChange,
    touched, isSaving, onConfirm, onClose,
}) {
    const fileInputRef = useRef(null)

    const isValid =
        firstName.trim() && lastName.trim() && login.trim() && email.trim() && selectedRole

    return (
        <Modal
            title="Редактирование пользователя"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Сохранить"
            confirmDisabled={!isValid || isSaving || isUploadingPhoto}
            isLoading={isSaving}
        >
            <div className="edit-platform-user-modal__avatar-section">
                <div className="edit-platform-user-modal__avatar-preview">
                    {photoUrl ? (
                        <img
                            className="edit-platform-user-modal__avatar-img"
                            src={photoUrl}
                            alt="Аватар"
                        />
                    ) : (
                        <span className="edit-platform-user-modal__avatar-placeholder" />
                    )}
                </div>
                <div className="edit-platform-user-modal__avatar-actions">
                    <button
                        type="button"
                        className="edit-platform-user-modal__avatar-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                    >
                        {isUploadingPhoto ? 'Загрузка...' : 'Загрузить фото'}
                    </button>
                    {photoUrl && (
                        <button
                            type="button"
                            className="edit-platform-user-modal__avatar-btn edit-platform-user-modal__avatar-btn--remove"
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
            <Input
                variant="default"
                size="large"
                placeholder="Логин"
                showClearButton
                label="Логин"
                required
                error={touched.login && !login.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={login}
                onChange={(e) => onLoginChange(e.target.value)}
            />
            <Input
                variant="default"
                size="large"
                placeholder="Email"
                showClearButton
                label="Email"
                required
                error={touched.email && !email.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
            />
            <Dropdown
                options={roleOptions}
                value={selectedRole}
                onChange={onRoleChange}
                size="large"
                label="Роль"
                required
                error={touched.role && !selectedRole ? 'Поле обязательно для заполнения' : undefined}
            />
        </Modal>
    )
}
