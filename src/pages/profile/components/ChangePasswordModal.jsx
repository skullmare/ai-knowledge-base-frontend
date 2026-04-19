import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'

export function ChangePasswordModal({
    oldPassword, onOldPasswordChange,
    newPassword, onNewPasswordChange,
    confirmPassword, onConfirmPasswordChange,
    passwordsMatch, touched, isChanging, onConfirm, onClose,
}) {
    const isValid =
        oldPassword.trim() && newPassword.trim() && confirmPassword.trim() && passwordsMatch

    return (
        <Modal
            title="Смена пароля"
            onClose={onClose}
            onConfirm={onConfirm}
            confirmLabel="Сохранить"
            confirmDisabled={!isValid || isChanging}
            isLoading={isChanging}
        >
            <Input
                type="password"
                showPasswordToggle
                variant="default"
                size="large"
                placeholder="Текущий пароль"
                label="Текущий пароль"
                required
                error={touched.oldPassword && !oldPassword.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={oldPassword}
                onChange={(e) => onOldPasswordChange(e.target.value)}
            />
            <Input
                type="password"
                showPasswordToggle
                variant="default"
                size="large"
                placeholder="Новый пароль"
                label="Новый пароль"
                required
                error={touched.newPassword && !newPassword.trim() ? 'Поле обязательно для заполнения' : undefined}
                value={newPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
            />
            <Input
                type="password"
                showPasswordToggle
                variant="default"
                size="large"
                placeholder="Подтвердите пароль"
                label="Подтвердите пароль"
                required
                error={
                    touched.confirmPassword && !confirmPassword.trim()
                        ? 'Поле обязательно для заполнения'
                        : touched.confirmPassword && confirmPassword.trim() && !passwordsMatch
                        ? 'Пароли не совпадают'
                        : undefined
                }
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
            />
        </Modal>
    )
}
