import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'

export function CreateAgentRoleModal({
    name, onNameChange,
    description, onDescriptionChange,
    touched, isCreating, onConfirm, onClose,
}) {
    return (
        <Modal
            title="Создание роли агента"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Создать"
            confirmDisabled={!name.trim() || isCreating}
            isLoading={isCreating}
        >
            <Input
                variant="default"
                size="large"
                placeholder="Укажите название роли"
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
                placeholder="Опишите роль агента"
                showClearButton
                label="Описание"
                maxLength={300}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
        </Modal>
    )
}
