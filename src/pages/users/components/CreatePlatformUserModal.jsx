import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import Dropdown from '@ui/Dropdown/Dropdown'

export function CreatePlatformUserModal({
    firstName, onFirstNameChange,
    lastName, onLastNameChange,
    login, onLoginChange,
    email, onEmailChange,
    roleOptions, selectedRole, onRoleChange,
    touched, isCreating, onConfirm, onClose,
}) {
    const isValid =
        firstName.trim() && lastName.trim() && login.trim() && email.trim() && selectedRole

    return (
        <Modal
            title="Создание сотрудника"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Создать"
            confirmDisabled={!isValid || isCreating}
            isLoading={isCreating}
        >
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
