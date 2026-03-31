import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './Protected'
import LoginPage from '../pages/Login'
import TopicPage from '../pages/Topic'
import TopicsPage from '../pages/Topics'
import NotFound from '../pages/NotFound'
import IndexPage from '../pages/Index'
import AccessDenied from '../pages/AccessDenied'

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