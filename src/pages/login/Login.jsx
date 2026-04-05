import { useState, useEffect } from 'react';
import useAuthStore from '@store/auth';
import Button from '@ui/Button/Button.jsx';
import Input from '@ui/Input/Input.jsx';
import Logo from '@assets/images/logo.svg';
import Background from '@assets/images/login-background.png';
import './Login.css';
import Spinner from '@ui/Spinner/Spinner';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doLogin(login, password);
  };

  return (
    <div className="login-page-container">
      {/* Левая колонка */}
      <div className="login-content">
        <header className="login-header">
          <Logo alt="OPERON" width="92" />
        </header>

        <main className="login-form-container">
          <h1 className="login-title">Войдите в систему</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <Input
                label="Логин"
                variant="default"
                size="large"
                showClearButton
                value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="username"
              />
            </div>

            <div className="input-group">
              <Input
                label="Пароль"
                variant="default"
                size="large"
                showClearButton
                showPasswordToggle
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="··········"
              />
            </div>

            <div className="login-helpers">
              <a href="/forgot-password" className="forgot-password-link">
                Забыли пароль?
              </a>
            </div>

            <Button
              type="submit"
              size="login"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading && "Загрузка" || "Войти"}
            </Button>

            {error && <p className="login-error">{error}</p>}

          </form>
        </main>
      </div>

      {/* Правая колонка с фоном */}
      <div
        className="login-image-side"
        style={{ backgroundImage: `url(${Background})` }}
      />
      {isLoading && <Spinner />}
    </div>
  );
}