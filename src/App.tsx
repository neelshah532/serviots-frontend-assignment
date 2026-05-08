import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { UsersListPage, UserDetailPage, NotFoundPage } from './pages';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<UsersListPage />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
