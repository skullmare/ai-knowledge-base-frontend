import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import Dropdown from '@ui/Dropdown/Dropdown'
import Multiselect from '@ui/Multiselect/Multiselect'

export function CreateTopicModal({
    name, onNameChange,
    categoryOptions, selectedCategory, onCategoryChange,
    roleOptions, selectedRoles, onRolesChange,
    touched, isCreating, onConfirm, onClose, isLoading
}) {
    return (
        <Modal
            title="Создание темы"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Создать"
            confirmDisabled={!name.trim() || !selectedCategory || !selectedRoles.length || isCreating}
            isLoading={isLoading}
        >
            <Input
                variant="default"
                size="large"
                placeholder="Укажите название темы"
                showClearButton
                label="Название"
                maxLength={150}
                required
                error={touched.name && !name.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
            />
            <Dropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={onCategoryChange}
                size="large"
                label="Раздел"
                required
                error={touched.category && !selectedCategory ? 'Поле обязательно для заполнения' : undefined}
            />
            <Multiselect
                label="Роли"
                required
                size="large"
                options={roleOptions}
                value={selectedRoles}
                onChange={onRolesChange}
                placeholder="Выберите роли"
                error={touched.roles && !selectedRoles.length ? 'Поле обязательно для заполнения' : undefined}
            />
        </Modal>
    )
}