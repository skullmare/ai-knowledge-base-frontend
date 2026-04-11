import { useState, useRef, useEffect } from 'react';
import DropdownIcon from '@assets/icons/dropdown-16.svg';
import DropdownFlippedIcon from '@assets/icons/dropdown-flipped-16.svg';
import './Dropdown.css';

export default function Dropdown({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Выбрать', 
  menuWidth, 
  label, 
  required, 
  labelClassName, 
  size = "medium", 
  error,
  disabled = false  // Добавлен проп disabled
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = ({ target }) => {
      if (!ref.current?.contains(target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    if (disabled) return; // Предотвращаем выбор при disabled
    onChange?.(val);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((v) => !v);
    }
  };

  const ChevronIcon = isOpen ? DropdownFlippedIcon : DropdownIcon;

  return (
    <div className={`dropdown${isOpen ? ' dropdown--open' : ''}${disabled ? ' dropdown--disabled' : ''}`} ref={ref}>
      {label && (
        <label className={`input-component__label ${labelClassName}`} data-required={required}>
          {label}
          {required && <span className="input-component__required-star">*</span>}
        </label>
      )}
      <button
        className={`dropdown__trigger dropdown__trigger-${size}${error ? ' dropdown__trigger--error' : ''}${disabled ? ' dropdown__trigger--disabled' : ''}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        aria-disabled={disabled}
      >
        <span className={`dropdown__label${selected ? ' dropdown__label--selected' : ''}${disabled ? ' dropdown__label--disabled' : ''}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronIcon width="16px" height="16px" color="white" className="dropdown__chevron" />
      </button>
      {error && <span className="dropdown__error">{error}</span>}
      {isOpen && !disabled && ( // Не показываем меню если disabled
        <ul
          className="dropdown__menu"
          role="listbox"
          style={menuWidth ? { width: menuWidth } : undefined}
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown__option${option.value === value ? ' dropdown__option--active' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}