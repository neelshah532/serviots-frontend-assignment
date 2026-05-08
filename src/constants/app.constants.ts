export const API_BASE_URL = 'https://dummyjson.com';
export const PAGINATION_LIMIT = 10;

export const DEFAULT_USER_FILTERS = {
  searchQuery: '',
  roleFilter: '',
  genderFilter: 'all' as const,
  sortField: 'name' as const,
  sortDirection: 'asc' as const,
  currentPage: 1,
};
