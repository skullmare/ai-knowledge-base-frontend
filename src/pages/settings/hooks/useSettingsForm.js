import { useEffect, useMemo, useState } from 'react'
import useSystemSettingsStore from '@store/systemSettings'
import { NUMBER_KEYS } from '../Settings.constants'

/**
 * Форма системных настроек. Черновик держим локально, чтобы
 * несохранённые изменения не уезжали в общий стор.
 */
export function useSettingsForm() {
    const settings = useSystemSettingsStore((s) => s.settings)
    const fetchSettings = useSystemSettingsStore((s) => s.fetchSettings)
    const updateSettings = useSystemSettingsStore((s) => s.updateSettings)
    const isLoading = useSystemSettingsStore((s) => s.isLoadingFetchSettings)
    const isSaving = useSystemSettingsStore((s) => s.isLoadingUpdateSettings)

    const [draft, setDraft] = useState({})

    useEffect(() => {
        fetchSettings().catch(() => {})
    }, [fetchSettings])

    const byKey = useMemo(
        () => Object.fromEntries(settings.map((setting) => [setting.key, setting])),
        [settings]
    )

    // Значение секрета сервер не отдаёт — пустое поле означает «не менять»
    const valueOf = (key) => draft[key] ?? (byKey[key]?.isSecret ? '' : byKey[key]?.value ?? '')

    const setValue = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }))

    const isDirty = Object.keys(draft).length > 0

    const resetDraft = () => setDraft({})

    const save = async (keys) => {
        const payload = {}

        for (const key of keys) {
            if (!(key in draft)) continue

            const raw = draft[key]
            const trimmed = typeof raw === 'string' ? raw.trim() : raw

            // Пустой секрет — это «оставить как есть», а не «стереть ключ».
            // Сравниваем после обрезки: ключ из пробелов уходит в провайдера
            // пустым заголовком авторизации
            if (byKey[key]?.isSecret && trimmed === '') continue

            if (NUMBER_KEYS.has(key)) {
                // Пустое числовое поле не отправляем — иначе уедет ноль
                if (trimmed === '' || trimmed === null) continue
                payload[key] = Number(trimmed)
                continue
            }

            payload[key] = trimmed
        }

        if (!Object.keys(payload).length) return

        await updateSettings(payload)
        setDraft((prev) => {
            const next = { ...prev }
            for (const key of Object.keys(payload)) delete next[key]
            return next
        })
    }

    return { settings, byKey, valueOf, setValue, isDirty, resetDraft, save, isLoading, isSaving }
}
