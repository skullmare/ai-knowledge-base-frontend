import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import TopicPage from '../pages/TopicPage'
import TopicsPage from '../pages/TopicsPage'
import NotFound from '../pages/NotFound'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/topics" element={
                    <ProtectedRoute>
                        <TopicsPage />
                    </ProtectedRoute>
                } />

                <Route path="/topic/:id" element={
                    <ProtectedRoute>
                        <TopicPage />
                    </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to="/topics" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}