import { useRef } from 'react'
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

                <div className="files-modal__dropzone">
                    <Button size="modal" variant="secondary" onClick={() => inputRef.current?.click()}>
                        Выбрать файл
                    </Button>
                    <span className="files-modal__dropzone-hint">
                        {file
                            ? `${file.name} · ${formatFileSize(file.size)}`
                            : 'Файл загружается напрямую в хранилище, минуя сервер'}
                    </span>
                </div>

                {touched.file && !file && (
                    <span className="files-modal__error">Выберите файл для загрузки</span>
                )}

                <Input
                    label="Название"
                    required
                    placeholder="Название файла в базе знаний"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    error={touched.name && !name.trim() ? 'Название обязательно' : undefined}
                />

                <Multiselect
                    label="Роли пользователей агента"
                    placeholder="Кому доступны данные из файла"
                    options={roleOptions}
                    value={roles}
                    onChange={onRolesChange}
                />
                <span className="files-modal__hint">
                    Роли можно задать позже — векторизация станет доступна после выбора хотя бы одной.
                </span>

                {isUploading && (
                    <div className="files-modal__progress">
                        <div className="files-modal__progress-bar" style={{ width: `${progress}%` }} />
                        <span className="files-modal__progress-label">{progress}%</span>
                    </div>
                )}
            </div>
        </Modal>
    )
}
