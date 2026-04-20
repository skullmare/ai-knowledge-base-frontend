import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'

export function CreateCategoryModal({ name, onNameChange, description, onDescriptionChange, touched, isCreating, onConfirm, onClose }) {
    return (
        <Modal
            title="Создание раздела"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Создать"
            confirmDisabled={!name.trim() || isCreating}
            isLoading={isCreating}
        >
            <Input
                variant="default"
                size="large"
                placeholder="Укажите название раздела"
                showClearButton
                label="Название"
                required
                maxLength={50}
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
                maxLength={300}
                error={touched.description && !description.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
        </Modal>
    )
}