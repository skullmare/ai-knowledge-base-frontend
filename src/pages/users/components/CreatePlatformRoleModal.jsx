import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import Multiselect from '@ui/Multiselect/Multiselect'

export function CreatePlatformRoleModal({
    name, onNameChange,
    description, onDescriptionChange,
    permissionOptions, selectedPermissions, onPermissionsChange,
    isLoadingPermissions,
    touched, isCreating, onConfirm, onClose,
}) {
    const isValid = name.trim() && selectedPermissions.length > 0

    return (
        <Modal
            title="Создание роли сотрудника"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Создать"
            confirmDisabled={!isValid || isCreating}
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
                placeholder="Опишите роль сотрудника"
                showClearButton
                label="Описание"
                maxLength={300}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
            <Multiselect
                options={permissionOptions}
                value={selectedPermissions}
                size="large"
                onChange={onPermissionsChange}
                placeholder={isLoadingPermissions ? 'Загрузка прав...' : 'Выберите права доступа'}
                label="Права доступа"
                required
                disabled={isLoadingPermissions}
                error={touched.permissions && !selectedPermissions.length ? 'Поле обязательно для заполнения' : undefined}
            />
        </Modal>
    )
}
