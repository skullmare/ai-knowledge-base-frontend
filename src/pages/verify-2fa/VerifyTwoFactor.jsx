import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/auth';
import Button from '@ui/Button/Button.jsx';
import Logo from '@assets/images/logo.svg';
import Background from '@assets/images/login-background.png';
import './VerifyTwoFactor.css';

export default function VerifyTwoFactorPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const verify2fa = useAuthStore((state) => state.verify2fa);
  const isLoadingVerify = useAuthStore((state) => state.isLoadingVerify);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pendingLogin = useAuthStore((state) => state.pendingLogin);
  const error = useAuthStore((state) => state.error);

  useEffect(() => {
    if (!pendingLogin) {
      navigate('/login');
    }
  }, [pendingLogin, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return;
    await verify2fa(code);
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="login-page-container">
      <div className="login-content">
        <header className="login-header">
          <Logo alt="OPERON" width="92" />
        </header>

        <main className="login-form-container">
          <h1 className="login-title">Введите код</h1>
          <p className="twofa-subtitle">
            Мы отправили шестизначный код на вашу почту. Введите его ниже для входа в систему.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="twofa-digits">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  className={`twofa-digit-input${digit ? ' filled' : ''}`}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* {error && <p className="login-error">{error}</p>} */}

            <Button
              type="submit"
              size="login"
              variant="primary"
              isLoading={isLoadingVerify}
              disabled={!isComplete}
            >
              Подтвердить
            </Button>
          </form>
        </main>
      </div>

      <div
        className="login-image-side"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  );
}
