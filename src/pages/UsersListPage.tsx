import { useState, useEffect } from 'react';
import { Search, Filter, Plus, LayoutGrid, List } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFilters } from '../store/userSlice';
import { openCreateModal } from '../store/userSlice';
import { useUsers } from '../hooks/useUsers';
import { useDebounce } from '../hooks/useDebounce';
import { UserTable, UserCard, Pagination, SkeletonLoader } from '../components';
import type { SortField } from '../types/user.types';

export const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const { filters, isFetchingUsers, hasUserFetchError } = useAppSelector((state) => state.user);
  const { paginatedUsers, totalFilteredUsers } = useUsers();
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(searchInput, 300);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  useEffect(() => {
    dispatch(setFilters({ searchQuery: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

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

  if (hasUserFetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 bg-[var(--color-danger-light)] text-[var(--color-danger)] rounded-full flex items-center justify-center mb-5">
          <Filter className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Failed to load users</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2 mb-8 max-w-sm">There was a problem fetching the user data.</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-[var(--radius-sm)] text-sm font-medium shadow-[var(--shadow-xs)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] transition-all duration-[120ms] active:scale-[0.98]">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Manage Users</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">View, search, and manage all registered users in the system.</p>
        </div>
        <button
          onClick={() => dispatch(openCreateModal())}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-sm font-medium rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] transition-all duration-[120ms] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-[var(--color-surface)] p-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#6b7280]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-[var(--color-surface-raised)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-border)] transition-all duration-150"
            placeholder="Search by name, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <select value={filters.roleFilter} onChange={(e) => dispatch(setFilters({ roleFilter: e.target.value }))} className="block py-2 pl-3 pr-8 bg-transparent text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-transparent focus:outline-none transition-all duration-150 cursor-pointer min-w-max">
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="">All Roles</option>
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="admin">Admin</option>
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="editor">Editor</option>
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="user">User</option>
          </select>
          <div className="w-px h-4 bg-[var(--color-border)] hidden sm:block"></div>
          <select value={filters.genderFilter} onChange={(e) => dispatch(setFilters({ genderFilter: e.target.value as 'all' | 'male' | 'female' }))} className="block py-2 pl-3 pr-8 bg-transparent text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-transparent focus:outline-none transition-all duration-150 cursor-pointer min-w-max">
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="all">All Genders</option>
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="male">Male</option>
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="female">Female</option>
          </select>
          <div className="w-px h-4 bg-[var(--color-border)] hidden sm:block"></div>
          <select value={filters.sortField} onChange={(e) => handleSort(e.target.value as SortField)} className="block py-2 pl-3 pr-8 bg-transparent text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-transparent focus:outline-none transition-all duration-150 cursor-pointer min-w-max font-medium">
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="name">Sort by Name (A-Z)</option>
            <option className="bg-[var(--color-surface)] text-[var(--color-text-primary)]" value="age">Sort by Age</option>
          </select>
          <div className="hidden md:flex items-center p-0.5 bg-[var(--color-surface-raised)] rounded-[var(--radius-md)] ml-1">
            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-[var(--radius-sm)] transition-all duration-[120ms] ${viewMode === 'table' ? 'bg-[var(--color-surface)] shadow-[var(--shadow-xs)] text-[var(--color-text-primary)]' : 'text-[#6b7280] hover:text-[var(--color-text-primary)]'}`} aria-label="Table view">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('card')} className={`p-1.5 rounded-[var(--radius-sm)] transition-all duration-[120ms] ${viewMode === 'card' ? 'bg-[var(--color-surface)] shadow-[var(--shadow-xs)] text-[var(--color-text-primary)]' : 'text-[#6b7280] hover:text-[var(--color-text-primary)]'}`} aria-label="Card view">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-[420px]">
        {isFetchingUsers ? (
          <SkeletonLoader type={viewMode} count={5} />
        ) : paginatedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
            <div className="w-12 h-12 bg-[var(--color-surface-raised)] rounded-full flex items-center justify-center mb-5">
              <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">No users found</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1.5">Try adjusting your search or filter criteria.</p>
            {(filters.searchQuery || filters.roleFilter || filters.genderFilter !== 'all') && (
              <button onClick={() => dispatch(setFilters({ searchQuery: '', roleFilter: '', genderFilter: 'all' }))} className="mt-5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-[120ms]">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {viewMode === 'table' ? (
              <UserTable users={paginatedUsers} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedUsers.map((user) => {
                  return <UserCard key={user.id} user={user} />;
                })}
              </div>
            )}
            <Pagination currentPage={filters.currentPage} totalItems={totalFilteredUsers} />
          </div>
        )}
      </div>
    </div>
  );
};
