import Modal from '@layout/Modal/Modal'
import Dropdown from '@ui/Dropdown/Dropdown'
import { Toggle } from '@ui/Toggle/Toggle'

export function EditAgentUserModal({
    roleOptions, selectedRole, onRoleChange,
    status, onStatusChange, isPending,
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
            <Toggle
                checked={status === 'active'}
                onChange={(v) => onStatusChange(v ? 'active' : 'blocked')}
                disabled={isPending}
                label={isPending ? 'Ожидает' : (status === 'active' ? 'Активен' : 'Заблокирован')}
                hint={isPending ? 'Ожидает назначения роли' : undefined}
            />
        </Modal>
    )
}
