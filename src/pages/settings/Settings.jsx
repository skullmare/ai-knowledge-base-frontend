import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import Spinner from '@ui/Spinner/Spinner'
import { useLogout } from '@hooks/useLogout'
import { useSettingsForm } from './hooks/useSettingsForm'
import { SettingsNavbar } from './components/SettingsNavbar'
import { AiSettings } from './components/AiSettings'
import { GoogleDriveSettings } from './components/GoogleDriveSettings'
import { AgentSettings } from './components/AgentSettings'
import { NAV_LINKS, SETTINGS_SECTIONS } from './Settings.constants'
import './css/settings.css'

const SECTION_COMPONENTS = {
    ai: AiSettings,
    google_drive: GoogleDriveSettings,
    agent: AgentSettings,
}

export default function SettingsPage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const permissions = useProfileStore((s) => s.permissions)
    const { logout } = useAuthStore()

    const {
        handleLogout, openLogoutModal, closeLogoutModal, isLogoutModalOpen, isLogoutLoading,
    } = useLogout(logout)

    const form = useSettingsForm()

    const availableSections = useMemo(
        () => SETTINGS_SECTIONS.filter(({ permission }) => permissions.includes(permission)),
        [permissions]
    )

    const [activeSection, setActiveSection] = useState(null)
    const currentId = activeSection ?? availableSections[0]?.id ?? null
    const current = availableSections.find((section) => section.id === currentId)

    const SectionComponent = current ? SECTION_COMPONENTS[current.id] : null

    return (
        <Layout
            navbar={
                <Navbar>
                    <SettingsNavbar activeSection={currentId} onSelect={setActiveSection} />
                </Navbar>
            }
            header={
                <Header
                    navLinks={NAV_LINKS}
                    activeLink={pathname}
                    onLogout={openLogoutModal}
                    userLogin={profile?.login ?? profile?.email}
                    userRole={profile?.role?.name ?? 'Role'}
                />
            }
        >
            <div className="settings-page">
                {!current ? (
                    <div className="settings-page__empty">
                        <p className="settings-page__empty-title">Нет доступных разделов</p>
                        <p className="settings-page__empty-text">
                            У вашей роли нет прав на изменение системных настроек.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="settings-page__head">
                            <h1 className="settings-page__title">{current.title}</h1>
                            <p className="settings-page__description">{current.description}</p>
                        </div>

                        {form.isLoading ? (
                            <div className="settings-page__loader"><Spinner /></div>
                        ) : (
                            <SectionComponent
                                byKey={form.byKey}
                                valueOf={form.valueOf}
                                setValue={form.setValue}
                                onSave={form.save}
                                isSaving={form.isSaving}
                                isDirty={form.isDirty}
                            />
                        )}
                    </>
                )}
            </div>

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
