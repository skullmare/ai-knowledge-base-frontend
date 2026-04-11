// components/ui/Multiselect/Multiselect.jsx

import { useState, useRef, useEffect } from 'react'
import Close from '@assets/icons/close-16.svg'
import Check from '@assets/icons/check-16.svg'
import Minus from '@assets/icons/minus-16.svg'
import ChevronUp from '@assets/icons/dropdown-16.svg'
import ChevronDown from '@assets/icons/dropdown-flipped-16.svg'
import './Multiselect.css'

export default function Multiselect({ 
  options = [], 
  value = [], 
  onChange, 
  placeholder = 'Выберите...', 
  label, 
  required, 
  error, 
  size = "medium",
  disabled = false  // Добавлен проп disabled
}) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    const allSelected = value.length === options.length
    const someSelected = value.length > 0 && !allSelected

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const toggleOption = (optValue) => {
        if (disabled) return  // Предотвращаем изменение при disabled
        if (value.includes(optValue)) {
            onChange(value.filter((v) => v !== optValue))
        } else {
            onChange([...value, optValue])
        }
    }

    const toggleAll = () => {
        if (disabled) return  // Предотвращаем изменение при disabled
        if (allSelected) {
            onChange([])
        } else {
            onChange(options.map((o) => o.value))
        }
    }

    const removeOne = (optValue, e) => {
        e.stopPropagation()
        if (disabled) return  // Предотвращаем удаление при disabled
        onChange(value.filter((v) => v !== optValue))
    }

    const clearAll = (e) => {
        e.stopPropagation()
        if (disabled) return  // Предотвращаем очистку при disabled
        onChange([])
    }

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen((v) => !v)
        }
    }

    const selectedOptions = options.filter((o) => value.includes(o.value))

    return (
        <div className={`multiselect ${disabled ? 'multiselect--disabled' : ''}`} ref={containerRef}>
            {label && (
                <label className={`multiselect__label ${disabled ? 'multiselect__label--disabled' : ''}`} data-required={required ? "true" : "false"}>
                    {label}
                    {required && <span className="multiselect__required-star">*</span>}
                </label>
            )}

            {/* Trigger */}
            <div
                className={`multiselect__trigger ${'multiselect__trigger-' + size.trim()} ${isOpen ? 'multiselect__trigger--open' : ''} ${error ? 'multiselect__trigger--error' : ''} ${disabled ? 'multiselect__trigger--disabled' : ''}`}
                onClick={handleToggle}
                aria-disabled={disabled}
            >
                
                <div className="multiselect__tags">
                    {selectedOptions.length === 0 && (
                        <span className={`multiselect__placeholder ${disabled ? 'multiselect__placeholder--disabled' : ''}`}>
                            {placeholder}
                        </span>
                    )}
                    {selectedOptions.map((opt) => (
                        <span key={opt.value} className={`multiselect__tag ${disabled ? 'multiselect__tag--disabled' : ''}`}>
                            {opt.label}
                            {!disabled && (
                                <button
                                    className="multiselect__tag-remove"
                                    onClick={(e) => removeOne(opt.value, e)}
                                    disabled={disabled}
                                >
                                    <Close width="16px" height="16px" />
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                <div className="multiselect__actions">
                    {selectedOptions.length > 0 && !disabled && (
                        <button className="multiselect__clear" onClick={clearAll} disabled={disabled}>
                            <Close width="16px" height="16px" />
                        </button>
                    )}
                    <button className={`multiselect__chevron ${disabled ? 'multiselect__chevron--disabled' : ''}`} disabled={disabled}>
                        {isOpen ? <ChevronDown width="16px" height="16px" /> : <ChevronUp width="16px" height="16px" />}
                    </button>
                </div>
            </div>
            {error && <span className="multiselect__error">{error}</span>}
            {/* Dropdown */}
            {isOpen && !disabled && (  // Не показываем dropdown если disabled
                <div className="multiselect__dropdown">
                    {/* Все */}
                    <div className="multiselect__option" onClick={toggleAll}>
                        <span className={`multiselect__checkbox ${allSelected ? 'multiselect__checkbox--checked' : ''}`}>
                            {allSelected ? <Minus color="white" width="16px" height="16px" /> : null}
                        </span>
                        <span className="multiselect__option-label">Все</span>
                    </div>

                    {/* Options */}
                    {options.map((opt) => {
                        const checked = value.includes(opt.value)
                        return (
                            <div
                                key={opt.value}
                                className="multiselect__option"
                                onClick={() => toggleOption(opt.value)}
                            >
                                <span className={`multiselect__checkbox ${checked ? 'multiselect__checkbox--checked' : ''}`}>
                                    {checked && <Check color="white" width="16px" height="16px" />}
                                </span>
                                <span className="multiselect__option-label">{opt.label}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}