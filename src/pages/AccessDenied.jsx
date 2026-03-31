// pages/AccessDenied.jsx
import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1 style={{ color: '#d32f2f' }}>403 — Доступ запрещен</h1>
      <p>У вашей учетной записи недостаточно прав для просмотра этой страницы.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>На главную</Link>
        <Link to="/login">Войти под другим аккаунтом</Link>
      </div>
    </div>
  );
}