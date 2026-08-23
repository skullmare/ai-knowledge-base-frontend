import Modal from '@layout/Modal/Modal'
import Multiselect from '@ui/Multiselect/Multiselect'

export function ImportDriveFileModal({ file, roleOptions, roles, onRolesChange, canVectorize, isLoading, onConfirm, onClose }) {
    const willVectorize = canVectorize && roles.length > 0
    return (
        <Modal
            title="Векторизовать файл Google Drive"
            confirmLabel={willVectorize ? 'Векторизовать' : 'Добавить'}
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
                    {canVectorize
                        ? ' Без выбранных ролей файл будет добавлен, но не векторизован.'
                        : ' У вашей роли нет прав на векторизацию — файл будет только подключён.'}
                </span>
            </div>
        </Modal>
    )
}
