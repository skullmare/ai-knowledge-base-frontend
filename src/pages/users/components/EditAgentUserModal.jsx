import Modal from '@layout/Modal/Modal'
import Dropdown from '@ui/Dropdown/Dropdown'

export function EditAgentUserModal({
    roleOptions, selectedRole, onRoleChange,
    touched, isSaving, onConfirm, onClose,
}) {
    return (
        <Modal
            title="Редактирование пользователя агента"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Сохранить"
            confirmDisabled={!selectedRole || isSaving}
            isLoading={isSaving}
        >
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