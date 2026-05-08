import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import type { IToast } from '../hooks/useToast';

interface IToastProps {
  toast: IToast;
  onClose: (id: string) => void;
}

export const Toast = ({ toast, onClose }: IToastProps) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-[#22c55e]" />;
      case 'error': return <XCircle className="w-5 h-5 text-[#ef4444]" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-[#f59e0b]" />;
      default: return undefined;
    }
  };

  return (
    <div className={`${toast.isExiting ? 'animate-toast-out' : 'animate-toast-in'} flex items-start gap-3 px-4 py-3.5 bg-[#121214] rounded-lg shadow-2xl w-80 pointer-events-auto border border-[#27272a]`}>
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 flex flex-col">
        <p className="text-sm font-semibold text-white">{toast.message}</p>
        {toast.description && (
          <p className="text-[13px] text-[#a1a1aa] mt-0.5">{toast.description}</p>
        )}
      </div>
      <button onClick={() => onClose(toast.id)} className="shrink-0 p-1 rounded-md text-[#71717a] hover:text-white hover:bg-[#27272a] transition-all duration-150" aria-label="Close toast">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
