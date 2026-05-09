/* eslint-disable @stylistic/implicit-arrow-linebreak */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { handleApiResponse } from '../../utils/handleApiResponse';
import { handleError } from '../../utils/handleError';
import http from '../../services/http';
import type { IUser, IUserFilters, IUserListResponse } from '../../types/user.types';
import { DEFAULT_USER_FILTERS, PAGINATION_LIMIT } from '../../constants/app.constants';

interface UserState {
  data: any;
  isLoading: boolean;
  error: any;
  users: IUser[];
  totalUsers: number;
  filters: IUserFilters;
  selectedUser: IUser | undefined;
}

const initialState: UserState = {
  data: null,
  isLoading: true,
  error: null,
  users: [],
  totalUsers: 0,
  filters: DEFAULT_USER_FILTERS,
  selectedUser: undefined,
};

const createBaseThunk = (name: string, apiCall: (arg: any, signal: AbortSignal) => Promise<any>, showToast = false) =>
  createAsyncThunk(`user/${name}`, async (arg: any, { rejectWithValue, signal }) => {
    try {
      const response = await apiCall(arg, signal);
      if (showToast) {
        handleApiResponse({
          statusCode: response.status,
          data: response.data,
          message: 'Operation successful',
        });
      }
      return response.data;
    } catch (error: any) {
      handleError(error);
      return rejectWithValue(error.response?.data || 'Operation failed');
    }
  });

// Explicit and easy to read thunks
export const UserList = createBaseThunk('fetchList', (filters: IUserFilters, signal) => {
  let url = '/users';
  const params: any = {
    limit: PAGINATION_LIMIT,
    skip: (filters.currentPage - 1) * PAGINATION_LIMIT,
    sortBy: filters.sortField === 'name' ? 'firstName' : filters.sortField,
    order: filters.sortDirection,
  };

  if (filters.searchQuery) {
    url = '/users/search';
    params.q = filters.searchQuery;
  } else if (filters.roleFilter) {
    url = '/users/filter';
    params.key = 'role';
    params.value = filters.roleFilter;
  } else if (filters.genderFilter && filters.genderFilter !== 'all') {
    url = '/users/filter';
    params.key = 'gender';
    params.value = filters.genderFilter;
  }

  return http.get(url, { params, signal });
});

export const UserSearch = createBaseThunk('search', (query, signal) =>
  http.get('/users/search', { params: { q: query }, signal })
);

export const UserGetById = createBaseThunk('fetchById', (id, signal) =>
  http.get(`/users/${id}`, { signal })
);

export const UserCreate = createBaseThunk('create', (userData, signal) =>
  http.post('/users/add', userData, { signal }), true
);

export const UserUpdate = createBaseThunk('update', ({ id, data }, signal) =>
  http.put(`/users/${id}`, data, { signal }), true
);

export const UserDelete = createBaseThunk('delete', (id, signal) =>
  http.delete(`/users/${id}`, { signal }), true
);

const addAsyncCases = (builder: any, thunk: any, { onFulfilled }: any = {}) => {
  builder
    .addCase(thunk.pending, (state: any) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload;
      onFulfilled?.(state, action);
    })
    .addCase(thunk.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    });
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUserData(state, action) {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<IUserFilters>>) {
      const hasChanges = Object.entries(action.payload).some(
        ([key, value]) => (state.filters as any)[key] !== value
      );

      if (!hasChanges) return;

      state.filters = { ...state.filters, ...action.payload };
      if (Object.keys(action.payload).some((key) => key !== 'currentPage')) {
        state.filters.currentPage = 1;
      }
    },
  },
  extraReducers(builder) {
    addAsyncCases(builder, UserList, {
      onFulfilled: (state: UserState, action: PayloadAction<IUserListResponse>) => {
        state.users = action.payload.users;
        state.totalUsers = action.payload.total;
      },
    });

    addAsyncCases(builder, UserSearch, {
      onFulfilled: (state: UserState, action: PayloadAction<IUserListResponse>) => {
        state.users = action.payload.users;
        state.totalUsers = action.payload.total;
      },
    });

    addAsyncCases(builder, UserGetById, {
      onFulfilled: (state: UserState, action: PayloadAction<IUser>) => {
        state.selectedUser = action.payload;
      },
    });

    addAsyncCases(builder, UserCreate);
    addAsyncCases(builder, UserUpdate);
    addAsyncCases(builder, UserDelete);
  },
});

export const { clearError, setUserData, setFilters } = userSlice.actions;

export default userSlice.reducer;
