import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Protected'
import LoginPage from '@pages/login/Login'
import TopicPage from '@pages/topic/Topic'
import TopicsPage from '@pages/topics/Topics'
import UsersPage from '@pages/users/Users'
import NotFound from '@pages/NotFound'
import IndexPage from '@pages/Index'
import AccessDenied from '@pages/AccessDenied'
import SetComponents from '@pages/SetComponents'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

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
                    <ProtectedRoute permission="users.read">
                        <UsersPage />
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