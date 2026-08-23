import { useEffect } from 'react'
import Button from '@ui/Button/Button'
import useSystemSettingsStore from '@store/systemSettings'
import { SettingField } from './SettingField'
import { SECTION_FIELDS } from '../Settings.constants'

export function AiSettings({ byKey, valueOf, setValue, onSave, isSaving, isDirty }) {
    const testConnection = useSystemSettingsStore((s) => s.testConnection)
    const isTesting = useSystemSettingsStore((s) => s.isLoadingTestConnection)
    const models = useSystemSettingsStore((s) => s.models)
    const fetchModels = useSystemSettingsStore((s) => s.fetchModels)
    const modelsError = useSystemSettingsStore((s) => s.modelsError)

    useEffect(() => {
        fetchModels()
    }, [fetchModels])

    const handleTest = () => {
        const apiKey = valueOf('ai_api_key')
        // Пустое поле — проверяем уже сохранённый ключ
        testConnection(apiKey ? { apiKey, baseURL: valueOf('ai_base_url') } : {}).catch(() => {})
    }

    return (
        <div className="settings-section">
            {SECTION_FIELDS.ai.map((key) => (
                <SettingField
                    key={key}
                    setting={byKey[key]}
                    value={valueOf(key)}
                    onChange={(value) => setValue(key, value)}
                />
            ))}

            <p className="settings-section__note">
                Модель эмбеддингов должна совпадать по размерности с коллекцией Qdrant.
                При смене модели коллекцию нужно пересоздать, иначе векторизация будет падать.
            </p>

            {modelsError
                ? <p className="settings-section__error">Список моделей недоступен: {modelsError}</p>
                : <p className="settings-section__note">Доступно моделей по текущему ключу: {models.length}</p>}

            <div className="settings-section__actions">
                <Button size="interface" variant="secondary" onClick={handleTest} isLoading={isTesting}>
                    Проверить подключение
                </Button>
                <Button
                    size="interface"
                    variant="primary"
                    onClick={() => onSave(SECTION_FIELDS.ai)}
                    isLoading={isSaving}
                    disabled={!isDirty}
                >
                    Сохранить
                </Button>
            </div>
        </div>
    )
}
