import './Toggle.css'

export function Toggle({ checked, onChange, label, hint, disabled = false }) {
    return (
        <div className={`toggle ${disabled ? 'toggle--disabled' : ''}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                className={`toggle__track ${checked ? 'toggle__track--on' : ''}`}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
            >
                <span className="toggle__thumb" />
            </button>
            {(label || hint) && (
                <div className="toggle__text">
                    {label && <span className="toggle__label">{label}</span>}
                    {hint && <span className="toggle__hint">{hint}</span>}
                </div>
            )}
        </div>
    )
}
