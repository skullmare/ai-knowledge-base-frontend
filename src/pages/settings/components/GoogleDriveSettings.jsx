import Button from '@ui/Button/Button'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import { SettingField } from './SettingField'
import { SECTION_FIELDS } from '../Settings.constants'
import { useGoogleDriveConnection } from '../hooks/useGoogleDriveConnection'

export function GoogleDriveSettings({ byKey, valueOf, setValue, onSave, isSaving, isDirty }) {
    const connection = useGoogleDriveConnection()
    const { status } = connection

    return (
        <div className="settings-section">
            {SECTION_FIELDS.google_drive.map((key) => (
                <SettingField
                    key={key}
                    setting={byKey[key]}
                    value={valueOf(key)}
                    onChange={(value) => setValue(key, value)}
                />
            ))}

            <p className="settings-section__note">
                Redirect URI должен совпадать со значением, указанным в OAuth-приложении Google Cloud.
                Для этого интерфейса используйте адрес <code>{window.location.origin}/settings/google-callback</code>.
            </p>

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

            <div className="settings-connection">
                <div className="settings-connection__state">
                    <span className={`settings-connection__dot${status.isConnected ? ' settings-connection__dot--on' : ''}`} />
                    <span className="settings-connection__label">
                        {status.isConnected
                            ? `Подключён${status.email ? `: ${status.email}` : ''}`
                            : 'Диск не подключён'}
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
                        Подключить Google Drive
                    </Button>
                )}
            </div>

            {!status.isConfigured && (
                <p className="settings-section__note">
                    Сначала сохраните Client ID и Client Secret — без них подключение недоступно.
                </p>
            )}

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
