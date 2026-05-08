export interface IUserAddress {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface IUserCompany {
  name: string;
  department: string;
  title: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  role: string;
  image: string;
  birthDate: string;
  university: string;
  address: IUserAddress;
  company: IUserCompany;
}

export interface IUserListResponse {
  users: IUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface IUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  role: string;
  image?: string;
  address: IUserAddress;
  company: IUserCompany;
}

export type SortField = 'name' | 'age';
export type SortDirection = 'asc' | 'desc';
export type GenderFilter = 'all' | 'male' | 'female';

export interface IUserFilters {
  searchQuery: string;
  roleFilter: string;
  genderFilter: GenderFilter;
  sortField: SortField;
  sortDirection: SortDirection;
  currentPage: number;
}
