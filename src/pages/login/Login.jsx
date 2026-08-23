import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/auth';
import Button from '@ui/Button/Button.jsx';
import Input from '@ui/Input/Input.jsx';
import Logo from '@assets/images/logo.svg';
import Background from '@assets/images/login-background.png';
import './Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ login: false, password: false });

  const doLogin = useAuthStore((state) => state.login);
  const isLoadingLogin = useAuthStore((state) => state.isLoadingLogin);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ login: true, password: true });
    if (!login.trim() || !password.trim()) return;
    const success = await doLogin(login, password);
    if (success) {
      navigate('/verify-2fa');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
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
                error={touched.login && !login.trim() ? "Введите логин" : undefined}
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
                error={touched.password && !password.trim() ? "Введите пароль" : undefined}
                onChange={e => setPassword(e.target.value)}
                placeholder="··········"
              />
            </div>

            <div className="login-helpers">
              <a onClick={handleForgotPassword} className="forgot-password-link">
                Забыли пароль?
              </a>
            </div>

            {/* {error && <p className="login-error">{error}</p>} */}

            <Button
              type="submit"
              size="login"
              variant="primary"
              isLoading={isLoadingLogin}
            >
              Войти
            </Button>
          </form>
        </main>
      </div>

      {/* Правая колонка с фоном */}
      <div
        className="login-image-side"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  );
}
