import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { PAGINATION_LIMIT } from '../constants/app.constants';

export const useUsers = () => {
  const { users, filters } = useAppSelector((state) => state.user);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (filters.roleFilter) {
      result = result.filter((user) => user.role === filters.roleFilter);
    }

    // Gender filter
    if (filters.genderFilter !== 'all') {
      result = result.filter((user) => user.gender === filters.genderFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortField === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (filters.sortField === 'age') {
        comparison = a.age - b.age;
      }
      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [users, filters]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (filters.currentPage - 1) * PAGINATION_LIMIT;
    return filteredAndSortedUsers.slice(startIndex, startIndex + PAGINATION_LIMIT);
  }, [filteredAndSortedUsers, filters.currentPage]);

  const totalFilteredUsers = filteredAndSortedUsers.length;

  return {
    paginatedUsers,
    totalFilteredUsers,
    filteredAndSortedUsers,
  };
};
