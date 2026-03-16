import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import TopicPage from '../pages/TopicPage'
import TopicsPage from '../pages/TopicsPage'
import NotFound from '../pages/NotFound'
import IndexPage from '../pages/IndexPage'
import AccessDenied from '../pages/AccessDeniedPage'

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

                <Route path="/403" element={<AccessDenied />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <IndexPage />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}