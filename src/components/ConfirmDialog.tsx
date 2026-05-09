import { AlertTriangle, X } from 'lucide-react';
import type { IUser } from '../types/user.types';

interface IConfirmDialogProps {
  isOpen: boolean;
  user: IUser | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({ isOpen, user, onClose, onConfirm }: IConfirmDialogProps) => {
  if (!isOpen || !user) return null;

  return (
    <>
      <div className="animate-fade-in fixed inset-0 z-(--z-modal-backdrop) flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
        <div className="animate-modal-in w-full max-w-sm bg-(--color-surface) rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-7">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-full bg-(--color-danger-light) flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-(--color-danger)" />
              </div>
              <button onClick={onClose} className="p-1.5 rounded-(--radius-sm) text-[#6b7280] hover:text-(--color-text-primary) hover:bg-(--color-surface-raised) transition-all duration-[120ms] active:scale-[0.95]" aria-label="Close dialog">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-5">
              <h3 className="text-base font-bold text-(--color-text-primary)">Delete User</h3>
              <p className="mt-2 text-sm text-(--color-text-secondary) leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-bold text-(--color-text-primary)">{user.firstName} {user.lastName}</span>? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="px-7 py-5 flex justify-end gap-3 border-t border-(--color-border)">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-(--radius-sm) text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface-raised) transition-all duration-[120ms] active:scale-[0.98]">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium rounded-(--radius-sm) text-white bg-(--color-danger) hover:bg-(--color-danger-hover) hover:-translate-y-px hover:shadow-(--shadow-md) shadow-(--shadow-xs) transition-all duration-[120ms] active:scale-[0.98]">Delete User</button>
          </div>
        </div>
      </div>
    </>
  );
};
