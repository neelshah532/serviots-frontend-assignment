import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { setFilters, UserList, UserDelete } from '../redux/action/userSlice';
import { useDebounce } from '../hooks/useDebounce';
import { UserTable, UserCard, Pagination, SkeletonLoader, UserFormModal, ConfirmDialog } from '../components';
import type { IUser, SortField } from '../types/user.types';

export const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const { filters, users, totalUsers, isLoading } = useAppSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | undefined>(undefined);

  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch(UserList(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (debouncedSearch !== filters.searchQuery) {
      dispatch(setFilters({ searchQuery: debouncedSearch }));
    }
  }, [debouncedSearch, dispatch, filters.searchQuery]);

  useEffect(() => {
    const handleResize = () => { setViewMode(window.innerWidth < 768 ? 'card' : 'table'); };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, []);

  const handleSort = (field: SortField) => {
    if (filters.sortField === field) {
      dispatch(setFilters({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' }));
    } else {
      dispatch(setFilters({ sortField: field, sortDirection: 'asc' }));
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ currentPage: page }));
  };

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = useCallback((user: IUser) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleOpenConfirmDialog = useCallback((user: IUser) => {
    setUserToDelete(user);
    setIsConfirmDialogOpen(true);
  }, []);

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setUserToDelete(undefined);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await dispatch(UserDelete(userToDelete.id)).unwrap();
      dispatch(UserList(filters));
      handleCloseConfirmDialog();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text-primary) tracking-tight">User Management</h1>
          <p className="text-(--color-text-secondary) mt-1.5 text-sm">Manage your team members and their account permissions.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-(--color-primary) text-(--color-text-inverse) rounded-(--radius-md) text-[13.5px] font-semibold shadow-(--shadow-md) hover:-translate-y-px hover:shadow-(--shadow-lg) transition-all duration-(--transition-fast) active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 p-5 bg-(--color-surface) rounded-(--radius-xl) shadow-(--shadow-sm) border border-(--color-border)">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-(--color-text-muted) group-focus-within:text-(--color-primary) transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search by name, email..."
            className="w-full pl-11 pr-4 py-2.5 bg-(--color-surface-raised) border border-transparent rounded-(--radius-lg) text-[14px] text-(--color-text-primary) placeholder-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all duration-200"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <select
              value={filters.roleFilter}
              onChange={(e) => dispatch(setFilters({ roleFilter: e.target.value }))}
              className="appearance-none pl-3 pr-9 py-2 bg-(--color-surface-raised) border border-(--color-border) rounded-(--radius-md) text-sm text-(--color-text-secondary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) transition-all cursor-pointer min-w-[120px]"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none group-hover:text-(--color-text-primary) transition-colors" />
          </div>

          <div className="relative group">
            <select
              value={filters.genderFilter}
              onChange={(e) => dispatch(setFilters({ genderFilter: e.target.value as any }))}
              className="appearance-none pl-3 pr-9 py-2 bg-(--color-surface-raised) border border-(--color-border) rounded-(--radius-md) text-sm text-(--color-text-secondary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) transition-all cursor-pointer min-w-[120px]"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none group-hover:text-(--color-text-primary) transition-colors" />
          </div>

          <div className="relative group">
            <select
              value={filters.sortField}
              onChange={(e) => handleSort(e.target.value as any)}
              className="appearance-none pl-3 pr-9 py-2 bg-(--color-surface-raised) border border-(--color-border) rounded-(--radius-md) text-sm text-(--color-text-secondary) focus:outline-none focus:ring-1 focus:ring-(--color-primary) transition-all cursor-pointer min-w-[140px]"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none group-hover:text-(--color-text-primary) transition-colors" />
          </div>

          <div className="flex items-center gap-1 p-1 bg-(--color-surface-raised) rounded-(--radius-lg) border border-(--color-border-subtle)">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-(--radius-md) transition-all duration-200 ${viewMode === 'table' ? 'bg-(--color-surface) text-(--color-primary) shadow-(--shadow-sm)' : 'text-(--color-text-muted) hover:text-(--color-text-secondary)'}`}
              aria-label="Table view"
            >
              <List className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-(--radius-md) transition-all duration-200 ${viewMode === 'card' ? 'bg-(--color-surface) text-(--color-primary) shadow-(--shadow-sm)' : 'text-(--color-text-muted) hover:text-(--color-text-secondary)'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader type={viewMode} count={5} />
      ) : users.length > 0 ? (
        <>
          {viewMode === 'table' ? (
            <UserTable
              users={users}
              sortField={filters.sortField}
              sortDirection={filters.sortDirection}
              onSort={handleSort}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenConfirmDialog}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {users.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenConfirmDialog}
                />
              ))}
            </div>
          )}

          <div className="mt-4">
            <Pagination
              currentPage={filters.currentPage}
              totalItems={totalUsers}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-(--color-surface) rounded-(--radius-xl) border border-dashed border-(--color-border)">
          <div className="w-16 h-16 bg-(--color-surface-raised) text-(--color-text-muted) rounded-full flex items-center justify-center mb-6">
            <Filter className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-(--color-text-primary)">No users found</h3>
          <p className="text-(--color-text-secondary) mt-2 max-w-xs mx-auto text-sm leading-relaxed">We couldn't find any users matching your current filters. Try adjusting your search or filters.</p>
          <button
            onClick={() => { setSearchInput(''); dispatch(setFilters({ searchQuery: '', roleFilter: '', genderFilter: 'all', currentPage: 1 })); }}
            className="mt-8 text-sm font-semibold text-(--color-primary) hover:underline active:opacity-70 transition-all"
          >
            Clear all filters
          </button>
        </div>
      )}

      <UserFormModal
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        selectedUser={selectedUser}
        onClose={handleCloseModal}
        onSuccess={() => dispatch(UserList(filters))}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        user={userToDelete}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
