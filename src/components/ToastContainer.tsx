import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

export const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[var(--z-toast)] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={dismissToast} />
      ))}
    </div>
  );
};
