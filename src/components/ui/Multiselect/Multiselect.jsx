// components/ui/Multiselect/Multiselect.jsx

import { useState, useRef, useEffect } from 'react'
import Close from '@assets/icons/close-16.svg'
import Check from '@assets/icons/check-16.svg'
import Minus from '@assets/icons/minus-16.svg'
import ChevronUp from '@assets/icons/dropdown-16.svg'
import ChevronDown from '@assets/icons/dropdown-flipped-16.svg'
import './Multiselect.css'

export default function Multiselect({ options = [], value = [], onChange, placeholder = 'Выберите...', label, required, error, size="medium" }) {
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
        if (value.includes(optValue)) {
            onChange(value.filter((v) => v !== optValue))
        } else {
            onChange([...value, optValue])
        }
    }

    const toggleAll = () => {
        if (allSelected) {
            onChange([])
        } else {
            onChange(options.map((o) => o.value))
        }
    }

    const removeOne = (optValue, e) => {
        e.stopPropagation()
        onChange(value.filter((v) => v !== optValue))
    }

    const clearAll = (e) => {
        e.stopPropagation()
        onChange([])
    }

    const selectedOptions = options.filter((o) => value.includes(o.value))

    return (
        <div className="multiselect" ref={containerRef}>
            {label && (
                <label className="multiselect__label" data-required={required ? "true" : "false"}>
                    {label}
                    {required && <span className="multiselect__required-star">*</span>}
                </label>
            )}

            {/* Trigger */}
            <div
                className={`multiselect__trigger ${'multiselect__trigger-'+size.trim()} ${isOpen ? 'multiselect__trigger--open' : ''} ${error ? 'multiselect__trigger--error' : ''}`}
                onClick={() => setIsOpen((v) => !v)}
            >
                
                <div className="multiselect__tags">
                    {selectedOptions.length === 0 && (
                        <span className="multiselect__placeholder">{placeholder}</span>
                    )}
                    {selectedOptions.map((opt) => (
                        <span key={opt.value} className="multiselect__tag">
                            {opt.label}
                            <button
                                className="multiselect__tag-remove"
                                onClick={(e) => removeOne(opt.value, e)}
                            >
                                <Close width="16px" height="16px" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="multiselect__actions">
                    {selectedOptions.length > 0 && (
                        <button className="multiselect__clear" onClick={clearAll}>
                            <Close width="16px" height="16px" />
                        </button>
                    )}
                    <button className="multiselect__chevron">
                        {isOpen ?  <ChevronDown width="16px" height="16px" /> : <ChevronUp width="16px" height="16px" />}
                    </button>
                </div>
            </div>
            {error && <span className="multiselect__error">{error}</span>}
            {/* Dropdown */}
            {isOpen && (
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