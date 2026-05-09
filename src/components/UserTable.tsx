import { Edit2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IUser, SortField, SortDirection } from '../types/user.types';

interface IUserTableProps {
  users: IUser[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
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

export const UserTable = ({ users, sortField, sortDirection, onSort, onEdit, onDelete }: IUserTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-sm) border border-(--color-border)">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead>
          <tr className="border-b border-(--color-border)">
            <th 
              onClick={() => onSort('name')}
              className="px-6 py-4 text-[11px] font-bold text-(--color-text-muted) tracking-wider uppercase cursor-pointer hover:text-(--color-primary) transition-colors"
            >
              User {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-(--color-text-muted) tracking-wider uppercase">Contact</th>
            <th className="px-6 py-4 text-[11px] font-bold text-(--color-text-muted) tracking-wider uppercase hidden lg:table-cell">Company</th>
            <th className="px-6 py-4 text-[11px] font-bold text-(--color-text-muted) tracking-wider uppercase">Role</th>
            <th className="px-6 py-4 text-[11px] font-bold text-(--color-text-muted) tracking-wider uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr
                key={user.id}
                className="group/row border-b border-(--color-border-subtle) last:border-b-0 h-[56px] hover:bg-(--color-surface-raised) transition-all duration-[120ms] relative"
              >
                <td className="px-6 py-3.5 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-(--color-primary) rounded-r-sm opacity-0 group-hover/row:opacity-100 transition-opacity duration-[120ms]" />
                  <div className="flex items-center gap-3.5">
                    {user.image ? (
                      <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full object-cover border border-(--color-border) shrink-0" />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-(--color-border)"
                        style={getAvatarStyle(user.firstName + user.lastName)}
                      >
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-(--color-text-primary) text-[14px]">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[12.5px] text-(--color-text-secondary) mt-0.5">
                        Age: {user.age} <span className="mx-1">•</span> <span className="capitalize">{user.gender}</span>
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-(--color-text-secondary) text-[13.5px]">{user.email}</span>
                    <span className="text-[12.5px] text-(--color-text-muted)">{user.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 hidden lg:table-cell">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-(--color-text-secondary) text-[13.5px]">{user.company.name}</span>
                    <span className="text-[12.5px] text-(--color-text-muted)">{user.company.department} <span className="mx-0.5">•</span> {user.company.title}</span>
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
                      to="/user-detail"
                      state={{ userId: user.id }}
                      className="p-1.5 rounded-(--radius-sm) text-[#6b7280] hover:text-(--color-primary) transition-colors duration-[120ms] active:scale-[0.92]"
                      aria-label="View user details"
                    >
                      <Eye className="w-[18px] h-[18px]" />
                    </Link>
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 rounded-(--radius-sm) text-[#6b7280] hover:text-(--color-primary) transition-colors duration-[120ms] active:scale-[0.92]"
                      aria-label="Edit user"
                    >
                      <Edit2 className="w-[18px] h-[18px]" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-1.5 rounded-(--radius-sm) text-[#6b7280] hover:text-[#dc2626] transition-colors duration-0 active:scale-[0.92]"
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
