import { useState, useLayoutEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToastContainer } from '../../components';

export const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const storedTheme = localStorage.getItem('app_theme');
      if (storedTheme) {
        return atob(storedTheme) === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useLayoutEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        localStorage.setItem('app_theme', btoa('dark'));
      } else {
        localStorage.setItem('app_theme', btoa('light'));
      }
      return newTheme;
    });
  };


  return (
    <div className="min-h-screen flex flex-col bg-(--color-background)">
      <header className="sticky top-0 z-(--z-header) h-14 bg-(--color-surface)/90 backdrop-blur-md border-b border-(--color-border) transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-bold text-[16px] text-(--color-text-primary) tracking-tight">
              Users Directory
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-(--color-border) text-(--color-text-primary) hover:bg-(--color-surface-raised) transition-all duration-[120ms] active:scale-[0.95] focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      <ToastContainer />
    </div>
  );
};
