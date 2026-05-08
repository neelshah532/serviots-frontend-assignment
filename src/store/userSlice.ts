import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IUser, IUserFilters, IUserFormData } from '../types/user.types';
import { dummyUsers } from '../constants/dummyUsers';
import { DEFAULT_USER_FILTERS } from '../constants/app.constants';

interface UserState {
  users: IUser[];
  totalUsers: number;
  isFetchingUsers: boolean;
  hasUserFetchError: boolean;
  filters: IUserFilters;
  selectedUser: IUser | undefined;
  isModalOpen: boolean;
  isEditMode: boolean;
  isConfirmDialogOpen: boolean;
  userToDelete: IUser | undefined;
}

const initialState: UserState = {
  users: dummyUsers,
  totalUsers: dummyUsers.length,
  isFetchingUsers: false,
  hasUserFetchError: false,
  filters: DEFAULT_USER_FILTERS,
  selectedUser: undefined,
  isModalOpen: false,
  isEditMode: false,
  isConfirmDialogOpen: false,
  userToDelete: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<IUserFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when any filter other than page changes
      if (Object.keys(action.payload).some((key) => key !== 'currentPage')) {
        state.filters.currentPage = 1;
      }
    },
    openCreateModal(state) {
      state.isModalOpen = true;
      state.isEditMode = false;
      state.selectedUser = undefined;
    },
    openEditModal(state, action: PayloadAction<IUser>) {
      state.isModalOpen = true;
      state.isEditMode = true;
      state.selectedUser = action.payload;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.isEditMode = false;
      state.selectedUser = undefined;
    },
    openConfirmDialog(state, action: PayloadAction<IUser>) {
      state.isConfirmDialogOpen = true;
      state.userToDelete = action.payload;
    },
    closeConfirmDialog(state) {
      state.isConfirmDialogOpen = false;
      state.userToDelete = undefined;
    },
    createUser(state, action: PayloadAction<IUserFormData>) {
      const newUser: IUser = {
        ...action.payload,
        image: action.payload.image || '',
        id: Date.now(),
        birthDate: '2000-01-01', // Mock default
        university: 'Unknown', // Mock default
      };
      state.users.unshift(newUser);
      state.totalUsers = state.users.length;
    },
    updateUser(state, action: PayloadAction<{ id: number; data: IUserFormData }>) {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.data };
      }
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.totalUsers = state.users.length;
    },
  },
});

export const {
  setFilters,
  openCreateModal,
  openEditModal,
  closeModal,
  openConfirmDialog,
  closeConfirmDialog,
  createUser,
  updateUser,
  deleteUser,
} = userSlice.actions;

export default userSlice.reducer;
