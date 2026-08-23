import Input from '@ui/Input/Input'
import { TEXTAREA_KEYS, NUMBER_KEYS } from '../Settings.constants'

/** Поле настройки: секрет, число, длинный промпт или обычная строка. */
export function SettingField({ setting, value, onChange, disabled, action }) {
    if (!setting) return null

    const { key, name, description, isSecret, hasValue } = setting

    if (TEXTAREA_KEYS.has(key)) {
        return (
            <div className="settings-field">
                <label className="settings-field__label" htmlFor={key}>{name}</label>
                <textarea
                    id={key}
                    className="settings-field__textarea"
                    value={value}
                    rows={5}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
                {description && <span className="settings-field__hint">{description}</span>}
            </div>
        )
    }

    const isNumber = NUMBER_KEYS.has(key)

    return (
        <div className={`settings-field${isNumber ? ' settings-field--narrow' : ''}`}>
            <Input
                label={name}
                type={isSecret ? 'password' : isNumber ? 'number' : 'text'}
                showPasswordToggle={isSecret}
                placeholder={isSecret && hasValue ? '•••••••• (сохранён)' : undefined}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                info={isSecret && hasValue ? 'Оставьте пустым, чтобы не менять сохранённое значение' : description}
            />
            {action && (
                <button className="settings-field__action" onClick={action.onClick} type="button">
                    {action.label}
                </button>
            )}
        </div>
    )
}
