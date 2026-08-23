import Modal from '@layout/Modal/Modal'
import Multiselect from '@ui/Multiselect/Multiselect'

export function ImportDriveFileModal({ file, roleOptions, roles, onRolesChange, isLoading, onConfirm, onClose }) {
    return (
        <Modal
            title="Векторизовать файл Google Drive"
            confirmLabel={roles.length ? 'Векторизовать' : 'Добавить'}
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
        >
            <div className="files-modal">
                <p className="files-modal__file-name">{file?.name}</p>

                <Multiselect
                    label="Роли пользователей агента"
                    placeholder="Кому доступны данные из файла"
                    options={roleOptions}
                    value={roles}
                    onChange={onRolesChange}
                />
                <span className="files-modal__hint">
                    Файл останется в Google Drive — в базу знаний попадёт только его текст.
                    Без выбранных ролей файл будет добавлен, но не векторизован.
                </span>
            </div>
        </Modal>
    )
}
