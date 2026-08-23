import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import Multiselect from '@ui/Multiselect/Multiselect'

export function EditFileModal({
    name, onNameChange,
    roleOptions, roles, onRolesChange,
    touched, isSaving,
    onConfirm, onClose,
}) {
    return (
        <Modal
            title="Редактировать файл"
            confirmLabel="Сохранить"
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isSaving}
        >
            <div className="files-modal">
                <Input
                    label="Название"
                    required
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    error={touched.name && !name.trim() ? 'Название обязательно' : undefined}
                />

                <Multiselect
                    label="Роли пользователей агента"
                    placeholder="Кому доступны данные из файла"
                    options={roleOptions}
                    value={roles}
                    onChange={onRolesChange}
                />
                <span className="files-modal__hint">
                    Изменение ролей сразу применяется к уже загруженным векторам.
                </span>
            </div>
        </Modal>
    )
}
