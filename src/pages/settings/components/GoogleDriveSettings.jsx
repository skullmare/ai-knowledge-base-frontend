import Button from '@ui/Button/Button'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import { SettingField } from './SettingField'
import { SECTION_FIELDS } from '../Settings.constants'
import { useGoogleDriveConnection } from '../hooks/useGoogleDriveConnection'

export function GoogleDriveSettings({ byKey, valueOf, setValue, onSave, isSaving, isDirty }) {
    const connection = useGoogleDriveConnection()
    const { status } = connection

    const callbackUrl = `${window.location.origin}/settings/google-callback`

    return (
        <div className="settings-section">
            <div className="settings-section__fields">
                {SECTION_FIELDS.google_drive.map((key) => (
                    <SettingField
                        key={key}
                        setting={byKey[key]}
                        value={valueOf(key)}
                        onChange={(value) => setValue(key, value)}
                        action={key === 'google_drive_redirect_uri' && !valueOf(key) ? {
                            label: 'Подставить адрес этого интерфейса',
                            onClick: () => setValue(key, callbackUrl),
                        } : undefined}
                    />
                ))}

                <p className="settings-section__note">
                    Redirect URI должен быть добавлен в «Authorized redirect URIs» OAuth-клиента
                    в Google Cloud Console — символ в символ, иначе Google вернёт
                    <code>redirect_uri_mismatch</code>. Для этого интерфейса адрес такой:
                    <code>{callbackUrl}</code>
                </p>

                <div className="settings-callout">
                    <div className="settings-callout__text">
                        <span className="settings-callout__title">
                            <span className={`settings-callout__dot${status.isConnected ? ' settings-callout__dot--on' : ''}`} />
                            {status.isConnected
                                ? `Диск подключён${status.email ? `: ${status.email}` : ''}`
                                : 'Диск не подключён'}
                        </span>
                        <span className="settings-callout__desc">
                            {status.isConfigured
                                ? 'Подключение выполняется во всплывающем окне Google.'
                                : 'Сначала сохраните Client ID и Client Secret — без них подключение недоступно.'}
                        </span>
                    </div>

                    {status.isConnected ? (
                        <Button size="interface" variant="secondary" onClick={connection.openDisconnect}>
                            Отключить
                        </Button>
                    ) : (
                        <Button
                            size="interface"
                            variant="primary"
                            onClick={connection.handleConnect}
                            isLoading={connection.isLoading}
                            disabled={!status.isConfigured}
                        >
                            Подключить
                        </Button>
                    )}
                </div>
            </div>

            <div className="settings-section__actions">
                <Button
                    size="interface"
                    variant="primary"
                    onClick={() => onSave(SECTION_FIELDS.google_drive)}
                    isLoading={isSaving}
                    disabled={!isDirty}
                >
                    Сохранить
                </Button>
            </div>

            <ConfirmModal
                isOpen={connection.isDisconnectOpen}
                type="warning"
                title="Отключение Google Drive"
                confirmLabel="Отключить"
                message="Файлы, уже добавленные в базу знаний, перестанут обновляться. Продолжить?"
                isLoading={connection.isLoading}
                onConfirm={connection.handleDisconnect}
                onClose={connection.closeDisconnect}
            />
        </div>
    )
}
