import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <DatabaseProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="lessons/:slug" element={<LessonPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DatabaseProvider>
  );
}
