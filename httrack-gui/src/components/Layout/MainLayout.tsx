import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { useThemeStore } from '../../stores/theme';
import { useEffect } from 'react';

export function MainLayout() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
