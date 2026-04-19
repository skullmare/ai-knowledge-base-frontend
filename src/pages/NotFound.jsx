import Logo from '@assets/images/logo.svg';
import Background from '@assets/images/login-background.png';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="login-page-container">
      <div className="login-content">
        <header className="login-header">
          <Logo alt="OPERON" width="92" />
        </header>

        <main className="login-form-container">
          <p className="error-code">404</p>
          <h1 className="error-title">Страница не найдена</h1>
          <p className="error-description">
            Запрашиваемая страница не существует или была удалена.
          </p>
          <div className="error-links">
            <a href="/" className="forgot-password-link">На главную</a>
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
