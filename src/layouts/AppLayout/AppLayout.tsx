import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer, UserFormModal, ConfirmDialog } from '../../components';

export const AppLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('app_theme');
      if (storedTheme) {
        const decoded = atob(storedTheme);
        if (decoded === 'dark') {
          setIsDarkMode(true);
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch {
      /* silently ignore corrupt localStorage */
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('app_theme', btoa('dark'));
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('app_theme', btoa('light'));
      }
      return newTheme;
    });
  };


  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-[var(--z-header)] h-14 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-bold text-[16px] text-[var(--color-text-primary)] tracking-tight">
              Users Directory
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-all duration-[120ms] active:scale-[0.95] focus:outline-none"
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-[var(--color-danger)] rounded-full border border-[var(--color-surface)]"></span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-all duration-[120ms] active:scale-[0.95] focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content — generous vertical breathing room */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>

      <ToastContainer />
      <UserFormModal />
      <ConfirmDialog />
    </div>
  );
};
