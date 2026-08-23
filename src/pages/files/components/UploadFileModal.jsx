import { useRef, useState } from 'react'
import Modal from '@layout/Modal/Modal'
import Input from '@ui/Input/Input'
import Button from '@ui/Button/Button'
import Multiselect from '@ui/Multiselect/Multiselect'
import { formatFileSize } from '../Files.constants'

export function UploadFileModal({
    file, onFileChange,
    name, onNameChange,
    roleOptions, roles, onRolesChange,
    progress, touched, isUploading,
    onConfirm, onClose,
}) {
    const inputRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

    const pick = () => inputRef.current?.click()

    const handleDrop = (event) => {
        event.preventDefault()
        setIsDragging(false)
        if (isUploading) return

        const dropped = event.dataTransfer.files?.[0]
        if (dropped) onFileChange(dropped)
    }

    const hasError = touched.file && !file

    return (
        <Modal
            title="Добавить файл"
            confirmLabel="Загрузить"
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isUploading}
        >
            <div className="files-modal">
                <input
                    ref={inputRef}
                    type="file"
                    className="files-modal__file-input"
                    onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                />

                <div
                    className={[
                        'files-dropzone',
                        isDragging && 'files-dropzone--dragging',
                        hasError && 'files-dropzone--error',
                    ].filter(Boolean).join(' ')}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={file ? undefined : pick}
                    role={file ? undefined : 'button'}
                    tabIndex={file ? undefined : 0}
                    onKeyDown={(e) => {
                        if (!file && (e.key === 'Enter' || e.key === ' ')) pick()
                    }}
                >
                    {file ? (
                        <div className="files-dropzone__file">
                            <div className="files-dropzone__file-info">
                                <span className="files-dropzone__file-name" title={file.name}>{file.name}</span>
                                <span className="files-dropzone__file-size">{formatFileSize(file.size)}</span>
                            </div>
                            <Button
                                size="small"
                                variant="secondary"
                                onClick={pick}
                                disabled={isUploading}
                            >
                                Заменить
                            </Button>
                        </div>
                    ) : (
                        <div className="files-dropzone__empty">
                            <span className="files-dropzone__hint">
                                Перетащите файл сюда или <span className="files-dropzone__link">выберите на диске</span>
                            </span>
                            <span className="files-dropzone__note">
                                Файл загружается напрямую в хранилище, минуя сервер — размер не ограничен
                            </span>
                        </div>
                    )}
                </div>

                {hasError && <span className="files-modal__error">Выберите файл для загрузки</span>}

                {isUploading && (
                    <div className="files-modal__progress">
                        <div className="files-modal__progress-track">
                            <div className="files-modal__progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="files-modal__progress-label">Загружено {progress}%</span>
                    </div>
                )}

                <Input
                    label="Название"
                    required
                    placeholder="Название файла в базе знаний"
                    value={name}
                    disabled={isUploading}
                    onChange={(e) => onNameChange(e.target.value)}
                    error={touched.name && !name.trim() ? 'Название обязательно' : undefined}
                />

                <Multiselect
                    label="Роли пользователей агента"
                    placeholder="Кому доступны данные из файла"
                    options={roleOptions}
                    value={roles}
                    onChange={onRolesChange}
                    disabled={isUploading}
                />
                <span className="files-modal__hint">
                    Роли можно задать позже — векторизация станет доступна после выбора хотя бы одной.
                </span>
            </div>
        </Modal>
    )
}
