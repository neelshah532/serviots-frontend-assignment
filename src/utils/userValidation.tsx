import type { IUserFormData } from '../types/user.types';

export const validateUserForm = (formData: IUserFormData): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (!formData.firstName.trim() || formData.firstName.length < 2) {
    newErrors.firstName = 'First name must be at least 2 characters';
  }
  
  if (!formData.lastName.trim() || formData.lastName.length < 2) {
    newErrors.lastName = 'Last name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim() || !emailRegex.test(formData.email)) {
    newErrors.email = 'Valid email is required';
  }

  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  }

  // Age validation: standard range 1-120, max 3 digits
  if (!formData.age) {
    newErrors.age = 'Age is required';
  } else if (formData.age < 1 || formData.age > 120) {
    newErrors.age = 'Age must be between 1 and 120';
  }

  if (!formData.role.trim()) {
    newErrors.role = 'Role is required';
  }

  if (!formData.address.address.trim()) {
    newErrors['address.address'] = 'Address is required';
  }
  
  if (!formData.address.city.trim()) {
    newErrors['address.city'] = 'City is required';
  }
  
  if (!formData.address.state.trim()) {
    newErrors['address.state'] = 'State is required';
  }
  
  if (!formData.address.country.trim()) {
    newErrors['address.country'] = 'Country is required';
  }

  if (!formData.company.name.trim()) {
    newErrors['company.name'] = 'Company name is required';
  }
  
  if (!formData.company.department.trim()) {
    newErrors['company.department'] = 'Department is required';
  }
  
  if (!formData.company.title.trim()) {
    newErrors['company.title'] = 'Job title is required';
  }

  return newErrors;
};
