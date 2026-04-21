import { useNavigate } from 'react-router-dom';
import Logo from '@assets/images/logo.svg';
import Background from '@assets/images/login-background.png';
import './AccessDenied.css';

export default function AccessDenied() {
  const navigate = useNavigate();

  const handleGoHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleGoLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="login-page-container">
      <div className="login-content">
        <header className="login-header">
          <Logo alt="OPERON" width="92" />
        </header>

        <main className="login-form-container">
          <p className="error-code">403</p>
          <h1 className="error-title">Доступ запрещён</h1>
          <p className="error-description">
            У вашей учётной записи недостаточно прав для просмотра этой страницы.
          </p>
          <div className="error-links">
            <a
              onClick={handleGoHome} 
              className="forgot-password-link"
            >
              На главную
            </a>
            <a
              onClick={handleGoLogin} 
              className="forgot-password-link"
            >
              Войти под другим аккаунтом
            </a>
          </div>
        </main>
      </div>

      <div
        className="login-image-side"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  );
}