import { Edit2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IUser, SortField, SortDirection } from '../types/user.types';
import { useAppDispatch } from '../store/hooks';
import { openEditModal, openConfirmDialog } from '../store/userSlice';

interface IUserTableProps {
  users: IUser[];
}
const getAvatarStyle = (name: string): React.CSSProperties => {
  const hues = [210, 160, 270, 30, 340, 190];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hues[Math.abs(hash) % hues.length];
  return {
    backgroundColor: `hsl(${hue}, 45%, 92%)`,
    color: `hsl(${hue}, 50%, 35%)`
  };
};

const getRoleBadgeClass = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'badge-admin';
    case 'editor':
    case 'moderator':
      return 'badge-editor';
    default:
      return 'badge-user';
  }
};

export const UserTable = ({ users }: IUserTableProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase">User</th>
            <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase">Contact</th>
            <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase hidden lg:table-cell">Company</th>
            <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase">Role</th>
            <th className="px-6 py-4 text-[11px] font-bold text-[var(--color-text-muted)] tracking-wider uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr
                key={user.id}
                className="group/row border-b border-[var(--color-border-subtle)] last:border-b-0 h-[56px] hover:bg-[var(--color-surface-raised)] transition-all duration-[120ms] relative"
              >
                <td className="px-6 py-3.5 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-primary)] rounded-r-sm opacity-0 group-hover/row:opacity-100 transition-opacity duration-[120ms]" />
                  <div className="flex items-center gap-3.5">
                    {user.image ? (
                      <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full object-cover border border-[var(--color-border)] shrink-0" />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-[var(--color-border)]"
                        style={getAvatarStyle(user.firstName + user.lastName)}
                      >
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-[var(--color-text-primary)] text-[14px]">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[12.5px] text-[var(--color-text-secondary)] mt-0.5">
                        Age: {user.age} <span className="mx-1">•</span> <span className="capitalize">{user.gender}</span>
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-[var(--color-text-secondary)] text-[13.5px]">{user.email}</span>
                    <span className="text-[12.5px] text-[var(--color-text-muted)]">{user.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 hidden lg:table-cell">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-[var(--color-text-secondary)] text-[13.5px]">{user.company.name}</span>
                    <span className="text-[12.5px] text-[var(--color-text-muted)]">{user.company.department} <span className="mx-0.5">•</span> {user.company.title}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize border ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/users/${user.id}`}
                      className="p-1.5 rounded-[var(--radius-sm)] text-[#6b7280] hover:text-[var(--color-primary)] transition-colors duration-[120ms] active:scale-[0.92]"
                      aria-label="View user details"
                    >
                      <Eye className="w-[18px] h-[18px]" />
                    </Link>
                    <button
                      onClick={() => dispatch(openEditModal(user))}
                      className="p-1.5 rounded-[var(--radius-sm)] text-[#6b7280] hover:text-[var(--color-primary)] transition-colors duration-[120ms] active:scale-[0.92]"
                      aria-label="Edit user"
                    >
                      <Edit2 className="w-[18px] h-[18px]" />
                    </button>
                    <button
                      onClick={() => dispatch(openConfirmDialog(user))}
                      className="p-1.5 rounded-[var(--radius-sm)] text-[#6b7280] hover:text-[#dc2626] transition-colors duration-0 active:scale-[0.92]"
                      aria-label="Delete user"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
