import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { UsersListPage, UserDetailPage, NotFoundPage } from './pages';
import './index.css';

function App() {
  return (
    // No auth-protected routes exist — all routes are public,
    // so routing is defined directly in App.tsx instead of a separate routes file.
    <AppLayout>
      <Routes>
        <Route path="/" element={<UsersListPage />} />
        <Route path="user-detail" element={<UserDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
