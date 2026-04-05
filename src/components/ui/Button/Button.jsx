import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  size = '',      // login, interface, logout, modal
  variant = '', // primary, secondary
  disabled = false,
  fullWidth = false,
  className = '',
  ...rest 
}) => {
  const buttonClasses = [
    'button',
    `button--${size}`,
    `button--${variant}`,
    disabled && 'button--disabled',
    fullWidth && 'button--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;