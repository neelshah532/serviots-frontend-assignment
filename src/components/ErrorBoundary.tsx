import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-(--color-background) p-6">
          <div className="max-w-md w-full bg-(--color-surface) rounded-(--radius-xl) shadow-(--shadow-modal) border border-(--color-border) p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-(--color-danger-light) rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-(--color-danger)" />
            </div>
            
            <h1 className="text-2xl font-bold text-(--color-text-primary) mb-2">
              Something went wrong
            </h1>
            
            <p className="text-sm text-(--color-text-secondary) mb-8">
              An unexpected error occurred in the application. Our team has been notified.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-(--color-primary) text-(--color-text-inverse) text-sm font-medium rounded-(--radius-md) shadow-(--shadow-sm) hover:-translate-y-px hover:shadow-(--shadow-md) transition-all duration-[120ms] active:scale-[0.98]"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-(--color-surface-raised) text-(--color-text-primary) text-sm font-medium rounded-(--radius-md) border border-(--color-border) hover:bg-(--color-border-subtle) transition-all duration-[120ms] active:scale-[0.98]"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>

            {/* Optional error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 p-4 bg-(--color-surface-raised) rounded-(--radius-md) text-left w-full overflow-x-auto border border-(--color-border-subtle)">
                <p className="text-xs font-mono text-(--color-text-muted) whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
