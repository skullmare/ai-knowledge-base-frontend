import { useState } from 'react';
import usePasswordStore from '@store/password';
import Button from '@ui/Button/Button.jsx';
import Input from '@ui/Input/Input.jsx';
import Logo from '@assets/images/logo.svg';
import Background from '@assets/images/login-background.png';
import './ForgotPassword.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ email: false });
  const [sent, setSent] = useState(false);

  const forgotPassword = usePasswordStore((s) => s.forgotPassword);
  const isLoadingForgotPassword = usePasswordStore((s) => s.isLoadingForgotPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true });
    if (!email.trim()) return;

    try {
      await forgotPassword({ email });
      setSent(true);
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
          {sent ? (
            <div>
              <h1 className="login-title">Проверьте почту</h1>
              <p className="auth-hint-text">
                Мы отправили инструкции по восстановлению пароля на&nbsp;
                <strong>{email}</strong>.
              </p>
              <a href="/login" className="forgot-password-link">
                Вернуться к входу
              </a>
            </div>
          ) : (
            <>
              <h1 className="login-title">Восстановление пароля</h1>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <Input
                    label="Email"
                    variant="default"
                    size="large"
                    showClearButton
                    type="email"
                    value={email}
                    error={touched.email && !email.trim() ? 'Введите email' : undefined}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
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
                  isLoading={isLoadingForgotPassword}
                >
                  Отправить
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
