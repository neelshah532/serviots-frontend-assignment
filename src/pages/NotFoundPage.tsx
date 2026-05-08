import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] p-10 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-[var(--color-surface-raised)] rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-inset)]">
          <FileQuestion className="w-10 h-10 text-[var(--color-text-muted)]" />
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-3 tracking-tight">
          404
        </h1>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Page not found
        </h2>
        
        <p className="text-sm text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved. Please check the URL or go back to the homepage.
        </p>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-sm font-medium rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] transition-all duration-[120ms] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
