import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Spinner from '@ui/Spinner/Spinner'
import LoginPage from '@pages/login/Login'
import VerifyTwoFactorPage from '@pages/verify-2fa/VerifyTwoFactor'
import ForgotPasswordPage from '@pages/forgot-password/ForgotPassword'
import ResetPasswordPage from '@pages/reset-password/ResetPassword'
import NotFound from '@pages/not-found/NotFound'
import AccessDenied from '@pages/access-denied/AccessDenied'

// Страницы за авторизацией грузятся по требованию: редактор BlockNote
// весит больше остального приложения, а нужен только на странице темы.
const IndexPage = lazy(() => import('@pages/index/Index'))
const TopicsPage = lazy(() => import('@pages/topics/Topics'))
const TopicPage = lazy(() => import('@pages/topic/Topic'))
const UsersPage = lazy(() => import('@pages/users/Users'))
const LogsPage = lazy(() => import('@pages/logs/Logs'))
const ProfilePage = lazy(() => import('@pages/profile/Profile'))

const guarded = (element, props = {}) => (
    <ProtectedRoute {...props}>{element}</ProtectedRoute>
)

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Spinner />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify-2fa" element={<VerifyTwoFactorPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="/403" element={<AccessDenied />} />

                    <Route path="/" element={guarded(<IndexPage />)} />
                    <Route path="/topics" element={guarded(<TopicsPage />, { permission: 'topics.read' })} />
                    <Route path="/topic/:id" element={guarded(<TopicPage />, { permission: 'topics.read' })} />
                    <Route
                        path="/users"
                        element={guarded(<UsersPage />, {
                            permissions: ['platformUsers.read', 'agentUsers.read'],
                            mode: 'some'
                        })}
                    />
                    <Route path="/logs" element={guarded(<LogsPage />, { permission: 'logs.read' })} />
                    <Route path="/profile" element={guarded(<ProfilePage />)} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}
