import { useEffect, useMemo } from 'react'
import Button from '@ui/Button/Button'
import Dropdown from '@ui/Dropdown/Dropdown'
import Input from '@ui/Input/Input'
import useSystemSettingsStore from '@store/systemSettings'
import { SettingField } from './SettingField'
import { SECTION_FIELDS } from '../Settings.constants'

const PROMPT_KEYS = SECTION_FIELDS.agent.filter(
    (key) => key !== 'ai_chat_model' && key !== 'agent_search_limit'
)

export function AgentSettings({ byKey, valueOf, setValue, onSave, isSaving, isDirty }) {
    const models = useSystemSettingsStore((s) => s.models)
    const fetchModels = useSystemSettingsStore((s) => s.fetchModels)
    const isLoadingModels = useSystemSettingsStore((s) => s.isLoadingFetchModels)
    const modelsError = useSystemSettingsStore((s) => s.modelsError)

    useEffect(() => {
        fetchModels()
    }, [fetchModels])

    const currentModel = valueOf('ai_chat_model')

    const modelOptions = useMemo(() => {
        const options = models.map((model) => ({ value: model.id, label: model.name || model.id }))
        // Сохранённая модель может отсутствовать в выдаче — не теряем её из списка
        if (currentModel && !options.some((o) => o.value === currentModel)) {
            options.unshift({ value: currentModel, label: `${currentModel} (сохранена)` })
        }
        return options
    }, [models, currentModel])

    return (
        <div className="settings-section">
            {modelsError ? (
                <>
                    <Input
                        label="Модель ответов агента"
                        value={currentModel}
                        onChange={(e) => setValue('ai_chat_model', e.target.value)}
                        info="Список моделей RouterAI недоступен — укажите идентификатор вручную"
                    />
                    <p className="settings-section__error">{modelsError}</p>
                </>
            ) : (
                <Dropdown
                    label="Модель ответов агента"
                    options={modelOptions}
                    value={currentModel}
                    onChange={(value) => setValue('ai_chat_model', value)}
                    placeholder={isLoadingModels ? 'Загружаем модели…' : 'Выберите модель'}
                    disabled={isLoadingModels}
                />
            )}

            <SettingField
                setting={byKey.agent_search_limit}
                value={valueOf('agent_search_limit')}
                onChange={(value) => setValue('agent_search_limit', value)}
            />

            {PROMPT_KEYS.map((key) => (
                <SettingField
                    key={key}
                    setting={byKey[key]}
                    value={valueOf(key)}
                    onChange={(value) => setValue(key, value)}
                />
            ))}

            <div className="settings-section__actions">
                <Button
                    size="interface"
                    variant="primary"
                    onClick={() => onSave(SECTION_FIELDS.agent)}
                    isLoading={isSaving}
                    disabled={!isDirty}
                >
                    Сохранить
                </Button>
            </div>
        </div>
    )
}
