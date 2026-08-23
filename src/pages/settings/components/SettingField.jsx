import Input from '@ui/Input/Input'
import { TEXTAREA_KEYS, NUMBER_KEYS } from '../Settings.constants'

/** Поле настройки: секрет, число, длинный промпт или обычная строка. */
export function SettingField({ setting, value, onChange, disabled }) {
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
                    rows={6}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
                {description && <span className="settings-field__hint">{description}</span>}
            </div>
        )
    }

    return (
        <div className="settings-field">
            <Input
                label={name}
                type={isSecret ? 'password' : NUMBER_KEYS.has(key) ? 'number' : 'text'}
                showPasswordToggle={isSecret}
                placeholder={isSecret && hasValue ? '•••••••• (сохранён)' : undefined}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                info={isSecret && hasValue ? 'Оставьте пустым, чтобы не менять сохранённое значение' : description}
            />
        </div>
    )
}
