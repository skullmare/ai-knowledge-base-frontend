import { useState, useRef, useEffect } from 'react';
import DropdownIcon from '@assets/icons/dropdown-16.svg';
import DropdownFlippedIcon from '@assets/icons/dropdown-flipped-16.svg';
import './Dropdown.css';

export default function Dropdown({ options = [], value, onChange, placeholder = 'Выбрать', menuWidth }) {
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
    onChange?.(val);
    setIsOpen(false);
  };

  const ChevronIcon = isOpen ? DropdownFlippedIcon : DropdownIcon;

  return (
    <div className={`dropdown${isOpen ? ' dropdown--open' : ''}`} ref={ref}>
      <button
        className="dropdown__trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`dropdown__label${selected ? ' dropdown__label--selected' : ''}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronIcon width="10px" height="10px" color="white" className="dropdown__chevron" />
      </button>

      {isOpen && (
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