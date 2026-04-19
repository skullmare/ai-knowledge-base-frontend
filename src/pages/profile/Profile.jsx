import { useLocation } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import Button from '@ui/Button/Button'
import { useLogout } from '@hooks/useLogout'
import { EditProfileModal } from './components/EditProfileModal'
import { ChangePasswordModal } from './components/ChangePasswordModal'
import { ProfilePermissions } from './components/ProfilePermissions'
import { useEditProfileModal } from './hooks/useEditProfileModal'
import { useChangePasswordModal } from './hooks/useChangePasswordModal'
import { NAV_LINKS } from './Profile.constants'
import './css/profile.css'

const STATUS_LABELS = { active: 'Активен', blocked: 'Заблокирован' }

const formatDateTime = (iso) =>
    iso
        ? new Date(iso).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
        : '—'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        })
        : '—'

export default function ProfilePage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const { handleLogout, openLogoutModal, closeLogoutModal, isLogoutModalOpen, isLogoutLoading } =
        useLogout(logout)

    const editModal = useEditProfileModal()
    const pwdModal = useChangePasswordModal()

    if (!profile) return null

    return (
        <Layout
            header={
                <Header
                    navLinks={NAV_LINKS}
                    activeLink={pathname}
                    onLogout={openLogoutModal}
                    userLogin={profile.login ?? profile.email}
                    userRole={profile.role?.name ?? 'Role'}
                    logo={true}
                />
            }
        >
            <div className="profile-page">
                <div className="profile-page__card">
                    {profile.photoUrl ? (
                        <img className="profile-page__avatar" src={profile.photoUrl} alt="Аватар" />
                    ) : (
                        <span className="profile-page__avatar--placeholder" />
                    )}
                    <div className="profile-page__identity">
                        <h1 className="profile-page__name">
                            {profile.firstName} {profile.lastName}
                        </h1>
                        {profile.role?.name && (
                            <span className="profile-page__role-badge">{profile.role.name}</span>
                        )}
                    </div>
                    <div className="profile-page__card-actions">
                        <Button size="interface" variant="secondary" onClick={() => editModal.open(profile)}>
                            Редактировать
                        </Button>
                        <Button size="interface" variant="secondary" onClick={pwdModal.open}>
                            Сменить пароль
                        </Button>
                    </div>
                </div>

                <div className="profile-page__body">
                    <div className="profile-page__info">
                        <span className="profile-page__section-title">Сведения</span>
                        <div className="profile-page__info-list">
                            <div className="profile-page__info-item">
                                <span className="profile-page__info-label">Логин</span>
                                <span className="profile-page__info-value">{profile.login ?? '—'}</span>
                            </div>
                            <div className="profile-page__info-item">
                                <span className="profile-page__info-label">Email</span>
                                <span className="profile-page__info-value">{profile.email ?? '—'}</span>
                            </div>
                            <div className="profile-page__info-item">
                                <span className="profile-page__info-label">Статус</span>
                                <span className="profile-page__info-value">
                                    <span className="profile-page__status">
                                        <span className={`profile-page__status-dot profile-page__status-dot--${profile.status}`} />
                                        {STATUS_LABELS[profile.status] ?? profile.status}
                                    </span>
                                </span>
                            </div>
                            {profile.lastLogin && (
                                <div className="profile-page__info-item">
                                    <span className="profile-page__info-label">Последний вход</span>
                                    <span className="profile-page__info-value">
                                        {formatDateTime(profile.lastLogin)}
                                    </span>
                                </div>
                            )}
                            {profile.createdAt && (
                                <div className="profile-page__info-item">
                                    <span className="profile-page__info-label">В системе с</span>
                                    <span className="profile-page__info-value">
                                        {formatDate(profile.createdAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <ProfilePermissions userPermissions={profile.role?.permissions ?? []} />
                </div>
            </div>

            {editModal.isOpen && (
                <EditProfileModal
                    firstName={editModal.firstName}
                    onFirstNameChange={editModal.setFirstName}
                    lastName={editModal.lastName}
                    onLastNameChange={editModal.setLastName}
                    photoUrl={editModal.photoUrl}
                    onPhotoUrlChange={editModal.setPhotoUrl}
                    onPhotoUpload={editModal.handlePhotoUpload}
                    isUploadingPhoto={editModal.isUploadingPhoto}
                    touched={editModal.touched}
                    isSaving={editModal.isSaving}
                    onConfirm={editModal.handleSave}
                    onClose={editModal.close}
                />
            )}

            {pwdModal.isOpen && (
                <ChangePasswordModal
                    oldPassword={pwdModal.oldPassword}
                    onOldPasswordChange={pwdModal.setOldPassword}
                    newPassword={pwdModal.newPassword}
                    onNewPasswordChange={pwdModal.setNewPassword}
                    confirmPassword={pwdModal.confirmPassword}
                    onConfirmPasswordChange={pwdModal.setConfirmPassword}
                    passwordsMatch={pwdModal.passwordsMatch}
                    touched={pwdModal.touched}
                    isChanging={pwdModal.isChanging}
                    onConfirm={pwdModal.handleSave}
                    onClose={pwdModal.close}
                />
            )}

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                type="warning"
                title="Выход из системы"
                confirmLabel="Выйти"
                message="Вы уверены, что хотите выйти из системы?"
                isLoading={isLogoutLoading}
                onConfirm={handleLogout}
                onClose={closeLogoutModal}
            />
        </Layout>
    )
}
