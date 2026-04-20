import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Layout from '@layout/Layout/Layout'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import { useLogout } from '@hooks/useLogout'
import { NAV_LINKS } from '@pages/profile/Profile.constants'
import './Index.css'

const wins = (n) => Array.from({ length: n }, (_, i) => <span key={i} className="win" />)

export default function IndexPage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const { logout } = useAuthStore()
    const { handleLogout, openLogoutModal, closeLogoutModal, isLogoutModalOpen, isLogoutLoading } =
        useLogout(logout)

    return (
        <Layout
            header={
                <Header
                    navLinks={NAV_LINKS}
                    activeLink={pathname}
                    onLogout={openLogoutModal}
                    userLogin={profile?.login ?? profile?.email ?? ''}
                    userRole={profile?.role?.name ?? ''}
                    logo={true}
                />
            }
        >
            <div className="index-page">
                <div className="index-hero">

                    {/* ── Левая колонка: текст ── */}
                    <div className="index-info">
                        <span className="index-info__label">Система управления знаниями</span>
                        <h1 className="index-info__heading">
                            Добро<br />пожаловать<br />в OPERON
                        </h1>
                        <p className="index-info__desc">
                            Единая база знаний строительной компании — документы, регламенты и аналитика в одном месте.
                        </p>
                        <Link to="/topics" className="index-info__cta">
                            Перейти к базе знаний →
                        </Link>
                    </div>

                    {/* ── Правая колонка: сцена ── */}
                    <div className="index-scene">
                        {/* Сетка-чертёж */}
                        <div className="scene-grid" />
                        {/* Виньетка */}
                        <div className="scene-vignette" />
                        {/* Линия земли */}
                        <div className="scene-ground" />

                        {/* Силуэты зданий */}
                        <div className="scene-skyline">

                            {/* Здание 1 — левое малое */}
                            <div className="bld b1">
                                <div className="bld-wins b1-wins">{wins(14)}</div>
                            </div>

                            {/* Здание 2 — среднее */}
                            <div className="bld b2">
                                <div className="bld-wins b2-wins">{wins(20)}</div>
                            </div>

                            {/* Здание 3 — главное с краном */}
                            <div className="bld b3">
                                {/* Кран */}
                                <div className="crane-wrap">
                                    <div className="crane-boom">
                                        <div className="crane-cj">
                                            <div className="crane-cw" />
                                        </div>
                                        <div className="crane-pv" />
                                        <div className="crane-j">
                                            <div className="crane-sw">
                                                <div className="crane-rope" />
                                                <div className="crane-hook" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="crane-mast" />
                                </div>
                                <div className="bld-wins b3-wins">{wins(27)}</div>
                            </div>

                            {/* Здание 4 — высокое правое */}
                            <div className="bld b4">
                                <div className="bld-wins b4-wins">{wins(18)}</div>
                            </div>

                            {/* Здание 5 — малое правое */}
                            <div className="bld b5">
                                <div className="bld-wins b5-wins">{wins(12)}</div>
                            </div>

                        </div>

                        {/* Пыль / строительные частицы */}
                        {Array.from({ length: 10 }, (_, i) => (
                            <span key={i} className={`dust-p dp${i + 1}`} />
                        ))}
                    </div>

                </div>
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
