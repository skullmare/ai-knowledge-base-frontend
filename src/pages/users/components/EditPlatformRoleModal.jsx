import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import Multiselect from '@ui/Multiselect/Multiselect'

export function EditPlatformRoleModal({
    name, onNameChange,
    description, onDescriptionChange,
    permissionOptions, selectedPermissions, onPermissionsChange,
    isLoadingPermissions,
    touched, isSaving, onConfirm, onClose,
}) {
    const isValid = name.trim() && selectedPermissions.length > 0

    return (
        <Modal
            title="Редактирование роли сотрудника"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Сохранить"
            confirmDisabled={!isValid || isSaving}
            isLoading={isSaving}
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
                size="large"
                value={selectedPermissions}
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
