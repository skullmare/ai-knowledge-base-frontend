import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Protected'
import LoginPage from '@pages/login/Login'
import ForgotPasswordPage from '@pages/forgot-password/ForgotPassword'
import ResetPasswordPage from '@pages/reset-password/ResetPassword'
import TopicPage from '@pages/topic/Topic'
import TopicsPage from '@pages/topics/Topics'
import UsersPage from '@pages/users/Users'
import ProfilePage from '@pages/profile/Profile'
import NotFound from '@pages/not-found/NotFound'
import IndexPage from '@pages/index/Index'
import AccessDenied from '@pages/access-denied/AccessDenied'
import SetComponents from '@pages/set-components/SetComponents'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                <Route path="/topics" element={
                    <ProtectedRoute permission="topics.read">
                        <TopicsPage />
                    </ProtectedRoute>
                } />

                <Route path="/topic/:id" element={
                    <ProtectedRoute permission="topics.read">
                        <TopicPage />
                    </ProtectedRoute>
                } />

                <Route path="/users" element={
                    <ProtectedRoute permissions={["platformUsers.read", "agentUsers.read"]} mode="some">
                        <UsersPage />
                    </ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />

                <Route path="/403" element={<AccessDenied />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <IndexPage />
                    </ProtectedRoute>
                } />
                <Route path="set-components" element={<SetComponents />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}