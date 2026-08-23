import { useEffect, useState } from 'react'
import Button from '@ui/Button/Button'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import useSystemSettingsStore from '@store/systemSettings'
import { SettingField } from './SettingField'
import { SECTION_FIELDS } from '../Settings.constants'

export function AiSettings({ byKey, valueOf, setValue, onSave, isSaving, isDirty }) {
    const testConnection = useSystemSettingsStore((s) => s.testConnection)
    const isTesting = useSystemSettingsStore((s) => s.isLoadingTestConnection)
    const models = useSystemSettingsStore((s) => s.models)
    const fetchModels = useSystemSettingsStore((s) => s.fetchModels)
    const modelsError = useSystemSettingsStore((s) => s.modelsError)
    const recreateCollection = useSystemSettingsStore((s) => s.recreateCollection)
    const isRecreating = useSystemSettingsStore((s) => s.isLoadingRecreate)

    const [isRecreateOpen, setIsRecreateOpen] = useState(false)

    useEffect(() => {
        fetchModels()
    }, [fetchModels])

    const handleTest = () => {
        const apiKey = valueOf('ai_api_key')
        // Пустое поле — проверяем уже сохранённый ключ
        testConnection(apiKey ? { apiKey, baseURL: valueOf('ai_base_url') } : {}).catch(() => {})
    }

    const handleRecreate = () => {
        recreateCollection()
            .then(() => setIsRecreateOpen(false))
            .catch(() => {})
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

            <div className="settings-connection">
                <div className="settings-connection__state">
                    <span className="settings-connection__label">
                        Пересоздать векторную коллекцию под текущую размерность
                    </span>
                </div>
                <Button size="interface" variant="secondary" onClick={() => setIsRecreateOpen(true)}>
                    Пересоздать
                </Button>
            </div>

            <p className="settings-section__note">
                Размерность вектора задаётся моделью эмбеддингов. После смены модели коллекцию
                нужно пересоздать — иначе векторизация будет падать с ошибкой размерности.
            </p>

            <ConfirmModal
                isOpen={isRecreateOpen}
                type="delete"
                title="Пересоздание векторной коллекции"
                confirmLabel="Пересоздать"
                message="Все векторы будут удалены: темы вернутся на проверку, файлы станут невекторизованными. Их придётся векторизовать заново. Продолжить?"
                isLoading={isRecreating}
                onConfirm={handleRecreate}
                onClose={() => setIsRecreateOpen(false)}
            />
        </div>
    )
}
