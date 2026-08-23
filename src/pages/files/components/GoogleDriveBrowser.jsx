import Spinner from '@ui/Spinner/Spinner'
import Button from '@ui/Button/Button'
import Protected from '@guards/Protected'
import ChevronRight from '@assets/icons/chevron-right-min-16.svg'
import { formatFileSize, formatDate } from '../Files.constants'

/** Список файлов и директорий подключённого Google Drive. */
export function GoogleDriveBrowser({
    status,
    files,
    breadcrumbs,
    filesError,
    isLoading,
    isSearching,
    onOpenFolder,
    onImport,
}) {
    if (!status.isConnected) {
        return (
            <div className="files-page__empty">
                <p className="files-page__empty-title">Google Drive не подключён</p>
                <p className="files-page__empty-text">
                    Подключите аккаунт в разделе «Настройки системы» → «Google Drive»,
                    чтобы работать с файлами диска.
                </p>
            </div>
        )
    }

    if (isLoading) return <div className="files-page__loader"><Spinner /></div>

    if (filesError) {
        return (
            <div className="files-page__empty">
                <p className="files-page__empty-title">Не удалось получить файлы</p>
                <p className="files-page__empty-text">{filesError}</p>
            </div>
        )
    }

    return (
        <div className="drive-browser">
            {!isSearching && breadcrumbs.length > 0 && (
                <nav className="drive-browser__breadcrumbs" aria-label="Путь">
                    {breadcrumbs.map((crumb, index) => (
                        <span key={crumb.id} className="drive-browser__crumb-wrapper">
                            {index > 0 && <ChevronRight className="drive-browser__crumb-sep" />}
                            <button
                                className="drive-browser__crumb"
                                onClick={() => onOpenFolder(crumb.id)}
                                disabled={index === breadcrumbs.length - 1}
                            >
                                {crumb.name}
                            </button>
                        </span>
                    ))}
                </nav>
            )}

            {files.length === 0 ? (
                <div className="files-page__empty">
                    <p className="files-page__empty-title">Здесь пусто</p>
                </div>
            ) : (
                <ul className="drive-browser__list" role="list">
                    {files.map((file) => (
                        <li key={file.id} className="drive-browser__item">
                            <div
                                className={`drive-browser__item-main${file.isFolder ? ' drive-browser__item-main--folder' : ''}`}
                                onClick={() => file.isFolder && onOpenFolder(file.id)}
                                role={file.isFolder ? 'button' : undefined}
                                tabIndex={file.isFolder ? 0 : undefined}
                                onKeyDown={(e) => {
                                    if (file.isFolder && (e.key === 'Enter' || e.key === ' ')) onOpenFolder(file.id)
                                }}
                            >
                                {file.iconLink
                                    ? <img className="drive-browser__icon" src={file.iconLink} alt="" />
                                    : <span className="drive-browser__icon drive-browser__icon--placeholder" />}

                                <span className="drive-browser__name">{file.name}</span>

                                <span className="drive-browser__meta">
                                    {file.isFolder ? 'Папка' : formatFileSize(file.size)}
                                </span>
                                <span className="drive-browser__meta">{formatDate(file.modifiedTime)}</span>
                            </div>

                            <div className="drive-browser__actions">
                                {file.isLinked && (
                                    <span className={`files-page__status files-page__status--${file.isIndexed ? 'indexed' : 'uploaded'}`}>
                                        <span className="files-page__status-dot" />
                                        {file.isIndexed ? 'Векторизован' : 'Добавлен'}
                                    </span>
                                )}

                                {file.webViewLink && (
                                    <a
                                        className="drive-browser__link"
                                        href={file.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Открыть
                                    </a>
                                )}

                                {!file.isFolder && !file.isLinked && (
                                    <Protected permission="googleDrive.import">
                                        <Button size="interface" variant="secondary" onClick={() => onImport(file)}>
                                            Векторизовать
                                        </Button>
                                    </Protected>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
