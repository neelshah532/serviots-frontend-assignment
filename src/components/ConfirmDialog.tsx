import { AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeConfirmDialog, deleteUser } from '../store/userSlice';
import { toast } from '../hooks/useToast';

export const ConfirmDialog = () => {
  const dispatch = useAppDispatch();
  const { isConfirmDialogOpen, userToDelete } = useAppSelector((state) => state.user);

  if (!isConfirmDialogOpen || !userToDelete) return undefined;

  const handleClose = () => { dispatch(closeConfirmDialog()); };

  const handleConfirm = () => {
    dispatch(deleteUser(userToDelete.id));
    dispatch(closeConfirmDialog());
    toast.success('User deleted successfully');
  };

  return (
    <>
      <div className="animate-fade-in fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]" onClick={handleClose}>
        <div className="animate-modal-in w-full max-w-sm bg-[var(--color-surface)] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-7">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-[var(--color-danger)]" />
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-[var(--radius-sm)] text-[#6b7280] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-all duration-[120ms] active:scale-[0.95]" aria-label="Close dialog">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-5">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">Delete User</h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-bold text-[var(--color-text-primary)]">{userToDelete.firstName} {userToDelete.lastName}</span>? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="px-7 py-5 flex justify-end gap-3 border-t border-[var(--color-border)]">
            <button onClick={handleClose} className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-all duration-[120ms] active:scale-[0.98]">Cancel</button>
            <button onClick={handleConfirm} className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-white bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] shadow-[var(--shadow-xs)] transition-all duration-[120ms] active:scale-[0.98]">Delete User</button>
          </div>
        </div>
      </div>
    </>
  );
};
