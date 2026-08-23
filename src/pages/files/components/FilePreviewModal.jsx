import Spinner from '@ui/Spinner/Spinner'
import Close from '@assets/icons/close-16.svg'

const IMAGE_TYPES = /^image\//
const INLINE_TYPES = /^(application\/pdf|text\/)/

/** Просмотр файла прямо в интерфейсе. Форматы, которые браузер не умеет
 *  показывать, предлагаем скачать. */
export function FilePreviewModal({ file, url, isLoading, onClose, onDownload }) {
    const mimeType = file?.storage?.mimeType ?? ''
    const canRender = IMAGE_TYPES.test(mimeType) || INLINE_TYPES.test(mimeType)

    return (
        <>
            <div className="modal__backdrop modal__backdrop--visible" onClick={onClose} />
            <div className="file-preview" role="dialog" aria-modal="true">
                <div className="file-preview__header">
                    <h2 className="file-preview__title">{file?.name}</h2>
                    <button className="modal__close" onClick={onClose} aria-label="Закрыть">
                        <Close width="20px" height="20px" />
                    </button>
                </div>

                <div className="file-preview__body">
                    {isLoading && <Spinner />}

                    {!isLoading && url && canRender && (
                        IMAGE_TYPES.test(mimeType)
                            ? <img className="file-preview__image" src={url} alt={file?.name} />
                            : <iframe className="file-preview__frame" src={url} title={file?.name} />
                    )}

                    {!isLoading && url && !canRender && (
                        <div className="file-preview__fallback">
                            <p>Формат «{mimeType || 'неизвестный'}» нельзя показать в браузере.</p>
                            <button className="file-preview__fallback-link" onClick={() => onDownload(file)}>
                                Скачать файл
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
