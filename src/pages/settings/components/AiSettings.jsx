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
    const fixed = useSystemSettingsStore((s) => s.fixed)

    const [isRecreateOpen, setIsRecreateOpen] = useState(false)

    useEffect(() => {
        fetchModels()
    }, [fetchModels])

    const handleTest = () => {
        // Обрезаем так же, как при сохранении: ключ из пробелов уходит
        // в провайдера пустым заголовком авторизации
        const apiKey = valueOf('ai_api_key').trim()
        const baseURL = valueOf('ai_base_url').trim()

        // Пустое поле — проверяем уже сохранённый ключ
        testConnection(apiKey ? { apiKey, baseURL } : {}).catch(() => {})
    }

    const handleRecreate = () => {
        recreateCollection()
            .then(() => setIsRecreateOpen(false))
            .catch(() => {})
    }

    return (
        <div className="settings-section">
            <div className="settings-section__fields">
                {SECTION_FIELDS.ai.map((key) => (
                    <SettingField
                        key={key}
                        setting={byKey[key]}
                        value={valueOf(key)}
                        onChange={(value) => setValue(key, value)}
                    />
                ))}

                <div className="settings-callout">
                    <div className="settings-callout__text">
                        <span className="settings-callout__title">Проверка подключения</span>
                        <span className="settings-callout__desc">
                            {modelsError
                                ? `Список моделей недоступен: ${modelsError}`
                                : `Доступно моделей по текущему ключу: ${models.length}`}
                        </span>
                    </div>
                    <Button size="interface" variant="secondary" onClick={handleTest} isLoading={isTesting}>
                        Проверить
                    </Button>
                </div>

                <div className="settings-field">
                    <span className="settings-field__label">Модель эмбеддингов</span>
                    <p className="settings-field__readonly">
                        <code>{fixed.embeddingModel || '—'}</code>
                        {fixed.embeddingDimensions ? ` · ${fixed.embeddingDimensions} измерений` : ''}
                    </p>
                    <span className="settings-field__hint">
                        Модель зафиксирована: вся векторная база лежит в её пространстве, и смена
                        модели потребовала бы пересоздания коллекции и повторной векторизации всего.
                        Она принимает документы, изображения, аудио и видео напрямую — отдельный
                        сервис разбора документов не нужен.
                    </span>
                </div>

                <div className="settings-callout settings-callout--danger">
                    <div className="settings-callout__text">
                        <span className="settings-callout__title">Пересоздать векторную коллекцию</span>
                        <span className="settings-callout__desc">
                            Нужно один раз, если коллекция Qdrant была создана под другую размерность —
                            иначе векторизация падает с ошибкой размерности вектора.
                        </span>
                    </div>
                    <Button size="interface" variant="secondary" onClick={() => setIsRecreateOpen(true)}>
                        Пересоздать
                    </Button>
                </div>
            </div>

            <div className="settings-section__actions">
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
