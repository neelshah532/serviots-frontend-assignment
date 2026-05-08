import { Edit2, Eye, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IUser } from '../types/user.types';
import { useAppDispatch } from '../store/hooks';
import { openEditModal, openConfirmDialog } from '../store/userSlice';

interface IUserCardProps {
  user: IUser;
}

const getAvatarStyle = (name: string): React.CSSProperties => {
  const hues = [210, 160, 270, 30, 340, 190];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hues[Math.abs(hash) % hues.length];
  return { backgroundColor: `hsl(${hue}, 45%, 92%)`, color: `hsl(${hue}, 50%, 35%)` };
};

const getRoleBadgeClass = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'border-indigo-400/40 text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10';
    case 'editor':
      return 'border-amber-400/40 text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10';
    default:
      return 'border-emerald-400/40 text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10';
  }
};

export const UserCard = ({ user }: IUserCardProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shrink-0" style={getAvatarStyle(user.firstName + user.lastName)}>
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-base text-[var(--color-text-primary)] leading-tight truncate">{user.firstName} {user.lastName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--color-text-muted)] capitalize">{user.gender}, {user.age}</span>
              <span className="w-0.5 h-0.5 rounded-full bg-[var(--color-text-muted)]" />
              <span className={`inline-flex px-2 py-px rounded-[var(--radius-sm)] text-[10px] font-medium capitalize border ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2.5 text-[13px]">
            <Mail className="w-3.5 h-3.5 text-[#6b7280] shrink-0" />
            <span className="truncate text-[var(--color-text-secondary)]">{user.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[13px]">
            <Phone className="w-3.5 h-3.5 text-[#6b7280] shrink-0" />
            <span className="text-[var(--color-text-secondary)]">{user.phone}</span>
          </div>
          <div className="flex items-start gap-2.5 text-[13px]">
            <Building2 className="w-3.5 h-3.5 text-[#6b7280] shrink-0 mt-0.5" />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-medium text-[var(--color-text-secondary)] truncate">{user.company.name}</span>
              <span className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{user.company.title}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 border-t border-[var(--color-border)]">
        <Link to={`/users/${user.id}`} className="flex items-center justify-center gap-1.5 py-3 text-[#6b7280] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all duration-[120ms] active:scale-[0.98]">
          <Eye className="w-3.5 h-3.5" /><span className="text-[11px] font-medium tracking-wide">View</span>
        </Link>
        <button onClick={() => dispatch(openEditModal(user))} className="flex items-center justify-center gap-1.5 py-3 text-[#6b7280] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all duration-[120ms] active:scale-[0.98] border-x border-[var(--color-border)]">
          <Edit2 className="w-3.5 h-3.5" /><span className="text-[11px] font-medium tracking-wide">Edit</span>
        </button>
        <button onClick={() => dispatch(openConfirmDialog(user))} className="flex items-center justify-center gap-1.5 py-3 text-[#6b7280] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-all duration-0 active:scale-[0.98]">
          <Trash2 className="w-3.5 h-3.5" /><span className="text-[11px] font-medium tracking-wide">Delete</span>
        </button>
      </div>
    </div>
  );
};
