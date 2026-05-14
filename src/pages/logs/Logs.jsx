import { useLocation } from 'react-router-dom'
import useProfileStore from '@store/profile'
import useAuthStore from '@store/auth'
import Header from '@layout/Header/Header'
import Navbar from '@layout/Navbar/Navbar'
import Layout from '@layout/Layout/Layout'
import Table from '@layout/Table/Table'
import ConfirmModal from '@layout/Modal/ConfirmModal'
import { useLogout } from '@hooks/useLogout'
import { LogsNavbar } from './components/LogsNavbar'
import { LogsToolbar } from './components/LogsToolbar'
import { useLogsFilters } from './hooks/useLogsFilters'
import { useLogsData } from './hooks/useLogsData'
import { NAV_LINKS, getLogColumns } from './Logs.constants'
import './css/logs.css'

export default function LogsPage() {
    const { pathname } = useLocation()
    const { profile } = useProfileStore()
    const { logout } = useAuthStore()

    const {
        handleLogout,
        openLogoutModal,
        closeLogoutModal,
        isLogoutModalOpen,
        isLogoutLoading,
    } = useLogout(logout)

    const filters = useLogsFilters()

    const {
        logs,
        pagination,
        filterGroups,
        isLoadingActions,
        fetchLogs,
        buildParams,
    } = useLogsData({
        debouncedSearch: filters.debouncedSearch,
        selectedAction: filters.selectedAction,
        selectedGroupId: filters.selectedGroupId,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
    })

    const columns = getLogColumns()

    return (
        <Layout
            navbar={
                <Navbar>
                    <LogsNavbar
                        filterGroups={filterGroups}
                        isLoadingActions={isLoadingActions}
                        selectedGroupId={filters.selectedGroupId}
                        selectedAction={filters.selectedAction}
                        onGroupSelect={filters.handleGroupSelect}
                        onItemSelect={filters.handleItemSelect}
                        onClear={filters.clearFilters}
                    />
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
            <div className="logs-page">
                <LogsToolbar
                    search={filters.search}
                    onSearchChange={filters.setSearch}
                    status={filters.status}
                    onStatusChange={filters.setStatus}
                    startDate={filters.startDate}
                    onStartDateChange={filters.setStartDate}
                    endDate={filters.endDate}
                    onEndDateChange={filters.setEndDate}
                />

                <Table
                    columns={columns}
                    data={logs}
                    page={pagination.current}
                    limit={pagination.limit}
                    total={pagination.total}
                    onPageChange={(p) => fetchLogs(buildParams({ page: p }))}
                    onLimitChange={(l) => fetchLogs(buildParams({ page: 1, limit: l }))}
                />
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
