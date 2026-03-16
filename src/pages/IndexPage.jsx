// pages/IndexPage.jsx
import { Link } from 'react-router-dom';

const IndexPage = () => {
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Добро пожаловать в Operon</h1>
      <p>Пожалуйста, войдите в систему или перейдите к темам.</p>
      <Link to="/topics" style={{ marginRight: '10px' }}>К темам</Link>
      <Link to="/login">Войти</Link>
    </div>
  );
};

export default IndexPage;