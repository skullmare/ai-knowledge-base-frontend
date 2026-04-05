import React, { useState, useRef, useCallback } from 'react';
import './Input.css';
import HideIcon from '@assets/icons/hide-16.svg';
import CloseIcon from '@assets/icons/close-16.svg';
import SearchIcon from '@assets/icons/search-16.svg';

const Input = ({
    type = 'text',
    variant = 'default', // 'default' or 'search'
    size = 'medium', // 'medium' (44px) or 'large' (52px)
    value: externalValue,
    defaultValue = '',
    onChange,
    onBlur,
    onFocus,
    onClear,
    label,
    error,
    errorText, // новый пропс для текста ошибки
    info,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    showPasswordToggle = false,
    showClearButton = false,
    showSearchButton = false,
    className = '',
    containerClassName = '',
    labelClassName = '',
    messageClassName = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [showPassword, setShowPassword] = useState(false);
    const pressTimerRef = useRef();

    const isControlled = externalValue !== undefined;
    const value = isControlled ? externalValue : internalValue;

    const handleChange = useCallback((e) => {
        if (!isControlled) setInternalValue(e.target.value);
        onChange?.(e);
    }, [isControlled, onChange]);

    const handleClear = useCallback(() => {
        const newValue = '';
        if (!isControlled) setInternalValue(newValue);
        onClear?.();
        onChange?.({ target: { value: newValue } });
    }, [isControlled, onChange, onClear]);

    const handlePasswordVisibility = useCallback((show) => {
        if (disabled || readOnly) return;
        setShowPassword(show);
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    }, [disabled, readOnly]);

    const handleMouseDown = useCallback(() => handlePasswordVisibility(true), [handlePasswordVisibility]);
    const handleMouseUp = useCallback(() => handlePasswordVisibility(false), [handlePasswordVisibility]);
    const handleMouseLeave = useCallback(() => handlePasswordVisibility(false), [handlePasswordVisibility]);

    const inputType = (type === 'password' && showPasswordToggle) 
        ? (showPassword ? 'text' : 'password') 
        : type;

    // Функция для определения количества иконок
    const getIconCount = () => {
        let count = 0;
        if (showSearchButton && variant === 'search') count++;
        if (showClearButton && value && !disabled && !readOnly) count++;
        if (showPasswordToggle && type === 'password') count++;
        return count;
    };

    // Функция для получения класса padding в зависимости от количества иконок
    const getIconPaddingClass = (iconCount) => {
        if (iconCount === 1) return 'input-component--has-one-icon';
        if (iconCount === 2) return 'input-component--has-two-icons';
        if (iconCount >= 3) return 'input-component--has-three-icons';
        return '';
    };

    const iconCount = getIconCount();
    const iconPaddingClass = getIconPaddingClass(iconCount);
    
    // Определяем, есть ли вообще иконки
    const hasIcons = iconCount > 0;

    const inputClasses = [
        'input-component',
        `input-component--${variant}`,
        `input-component--${size}`,
        isFocused && 'input-component--focused',
        error && 'input-component--error',
        disabled && 'input-component--disabled',
        readOnly && 'input-component--readonly',
        hasIcons && 'input-component--has-icons',
        iconPaddingClass,
        showSearchButton && 'input-component--has-search-icon',
        className
    ].filter(Boolean).join(' ');

    const showClearIcon = showClearButton && value && !disabled && !readOnly;
    const showPasswordIcon = showPasswordToggle && type === 'password';
    
    // Определяем, какой текст показывать: errorText имеет приоритет над error и info
    const getMessageText = () => {
        if (errorText) return errorText;
        if (error) return error;
        return info;
    };
    
    // Определяем тип сообщения
    const getMessageType = () => {
        if (errorText || error) return 'error';
        if (info) return 'info';
        return null;
    };
    
    const messageText = getMessageText();
    const messageType = getMessageType();

    return (
        <div className={`input-component__container ${containerClassName}`}>
            {label && (
                <label className={`input-component__label ${labelClassName}`} data-required={required}>
                    {label}
                    {required && <span className="input-component__required-star">*</span>}
                </label>
            )}

            <div className="input-component__wrapper">
                <input
                    type={inputType}
                    value={value}
                    onChange={handleChange}
                    onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    placeholder={placeholder}
                    className={inputClasses}
                    {...props}
                />

                {hasIcons && (
                    <div className="input-component__icons">
                        {showSearchButton && variant === 'search' && (
                            <button
                                type="button"
                                className="input-component__icon-button input-component__icon-button--search"
                                disabled={disabled}
                                aria-label="Search"
                            >
                                <SearchIcon />
                            </button>
                        )}
                        {showClearIcon && (
                            <button
                                type="button"
                                className="input-component__icon-button input-component__icon-button--clear"
                                onClick={handleClear}
                                disabled={disabled}
                                aria-label="Clear input"
                            >
                                <CloseIcon />
                            </button>
                        )}
                        {showPasswordIcon && (
                            <button
                                type="button"
                                className="input-component__icon-button input-component__icon-button--password"
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                onTouchStart={handleMouseDown}
                                onTouchEnd={handleMouseUp}
                                disabled={disabled || readOnly}
                                aria-label="Show password (hold)"
                            >
                                <HideIcon />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Отображаем сообщение если есть errorText, error или info */}
            {messageText && (
                <div className={`input-component__message ${messageClassName}`}>
                    <span className={`input-component__message--${messageType}`}>
                        {messageText}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Input;