import { useState } from 'react';
import { useParams } from 'react-router-dom';
import usePasswordStore from '@store/password';
import Button from '@ui/Button/Button.jsx';
import Input from '@ui/Input/Input.jsx';
import Logo from '@assets/images/logo.svg';
import Background from '@assets/images/login-background.png';
import './ResetPassword.css';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [success, setSuccess] = useState(false);

  const resetPassword = usePasswordStore((s) => s.resetPassword);
  const isLoadingResetPassword = usePasswordStore((s) => s.isLoadingResetPassword);

  const passwordsMatch = password === confirmPassword;
  const isValid = password.trim() && confirmPassword.trim() && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!isValid) return;

    try {
      const res = await resetPassword(token, { password, confirmPassword });
      if (res?.success) {
        setSuccess(true);
      }
    } catch {
      // ошибка установлена в сторе, useErrorWatcher покажет снекбар
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content">
        <header className="login-header">
          <Logo alt="OPERON" width="92" />
        </header>

        <main className="login-form-container">
          {success ? (
            <div>
              <h1 className="login-title">Пароль изменён</h1>
              <p className="auth-hint-text">
                Ваш пароль был успешно изменён. Теперь вы можете войти с новым паролем.
              </p>
              <a href="/login" className="forgot-password-link">
                Перейти к входу
              </a>
            </div>
          ) : (
            <>
              <h1 className="login-title">Новый пароль</h1>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <Input
                    label="Новый пароль"
                    variant="default"
                    size="large"
                    showClearButton
                    showPasswordToggle
                    type="password"
                    value={password}
                    error={touched.password && !password.trim() ? 'Введите пароль' : undefined}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="··········"
                  />
                </div>

                <div className="input-group">
                  <Input
                    label="Повторите пароль"
                    variant="default"
                    size="large"
                    showClearButton
                    showPasswordToggle
                    type="password"
                    value={confirmPassword}
                    error={
                      touched.confirmPassword && !confirmPassword.trim()
                        ? 'Повторите пароль'
                        : touched.confirmPassword && confirmPassword.trim() && !passwordsMatch
                        ? 'Пароли не совпадают'
                        : undefined
                    }
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="··········"
                  />
                </div>

                <div className="login-helpers">
                  <a href="/login" className="forgot-password-link">
                    Вернуться к входу
                  </a>
                </div>

                <Button
                  type="submit"
                  size="login"
                  variant="primary"
                  isLoading={isLoadingResetPassword}
                >
                  Сохранить пароль
                </Button>
              </form>
            </>
          )}
        </main>
      </div>

      <div
        className="login-image-side"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  );
}
