// components/EditCategoryModal.jsx
import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'

export function EditCategoryModal({ name, onNameChange, description, onDescriptionChange, touched, isSaving, onConfirm, onClose }) {
    return (
        <Modal
            title="Редактирование раздела"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Сохранить"
            confirmDisabled={!name.trim() || isSaving}
        >
            <Input
                variant="default"
                size="large"
                placeholder="Укажите название раздела"
                showClearButton
                label="Название"
                required
                error={touched.name && !name.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
            />
            <Input
                variant="default"
                size="large"
                placeholder="Опишите контекст раздела для ИИ агента"
                showClearButton
                label="Описание"
                required
                error={touched.description && !description.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
        </Modal>
    )
}