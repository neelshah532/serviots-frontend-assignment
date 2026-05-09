import { useState, useEffect, useMemo } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useAppDispatch } from '../redux/store/hooks';
import { UserCreate, UserUpdate } from '../redux/action/userSlice';
import type { IUser, IUserFormData } from '../types/user.types';
import { validateUserForm } from '../utils/userValidation';

const INITIAL_FORM_DATA: IUserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: 18,
  gender: 'male',
  role: 'user',
  image: '',
  address: { address: '', city: '', state: '', country: '' },
  company: { name: '', department: '', title: '' },
};

interface IUserFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  selectedUser: IUser | undefined;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserFormModal = ({ isOpen, isEditMode, selectedUser, onClose, onSuccess }: IUserFormModalProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<IUserFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isModifyContent = useMemo(() => {
    const compareTo = isEditMode && selectedUser ? {
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      phone: selectedUser.phone,
      age: selectedUser.age,
      gender: selectedUser.gender,
      role: selectedUser.role,
      image: selectedUser.image,
      address: { ...selectedUser.address },
      company: { ...selectedUser.company },
    } : INITIAL_FORM_DATA;

    return JSON.stringify(formData) !== JSON.stringify(compareTo);
  }, [formData, isEditMode, selectedUser]);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && selectedUser) {
        setFormData({
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          phone: selectedUser.phone,
          age: selectedUser.age,
          gender: selectedUser.gender,
          role: selectedUser.role,
          image: selectedUser.image,
          address: { ...selectedUser.address },
          company: { ...selectedUser.company },
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setErrors({});
    }
  }, [isOpen, isEditMode, selectedUser]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors = validateUserForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && selectedUser) {
        await dispatch(UserUpdate({ id: selectedUser.id, data: formData })).unwrap();
      } else {
        await dispatch(UserCreate(formData)).unwrap();
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error while creating or updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'age') {
      const numericValue = value.replace(/\D/g, '').slice(0, 3);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue ? parseInt(numericValue, 10) : 0,
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...(prev as Record<string, any>)[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const renderInput = (
    label: string,
    name: string,
    type: string = 'text',
    value: string | number
  ) => (
    <div className="flex flex-col gap-2 mb-6">
      <label htmlFor={name} className="text-[13px] font-medium text-(--color-text-secondary)">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleInputChange}
        className={`w-full px-3.5 py-2.5 bg-(--color-surface-raised) shadow-(--shadow-inset) rounded-(--radius-md) text-sm font-normal text-(--color-text-primary) placeholder-(--color-text-muted) focus:outline-none transition-all duration-150 ${errors[name]
          ? 'ring-2 ring-(--color-danger) border-transparent'
          : 'border border-transparent focus:ring-2 focus:ring-(--color-primary) focus:border-transparent'
          }`}
      />
      {errors[name] && (
        <span className="text-xs font-normal text-(--color-danger)">{errors[name]}</span>
      )}
    </div>
  );

  const renderSelect = (
    label: string,
    name: string,
    value: string,
    options: { value: string; label: string }[]
  ) => (
    <div className="flex flex-col gap-2 mb-6">
      <label htmlFor={name} className="text-[13px] font-medium text-(--color-text-secondary)">
        {label}
      </label>
      <div className="relative group/select">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full pl-3.5 pr-10 py-2.5 bg-(--color-surface-raised) shadow-(--shadow-inset) border border-transparent rounded-(--radius-md) text-sm font-normal text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all duration-150 cursor-pointer appearance-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) pointer-events-none group-hover/select:text-(--color-text-primary) transition-colors" />
      </div>
    </div>
  );

  return (
    <>
      <div
        className="animate-fade-in fixed inset-0 z-(--z-modal-backdrop) flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <div
          className="animate-modal-in w-full max-w-2xl bg-(--color-surface) rounded-(--radius-xl) shadow-(--shadow-modal) flex flex-col max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-8 py-5 border-b border-(--color-border) shrink-0">
            <h2 className="text-lg font-bold text-(--color-text-primary)">
              {isEditMode ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-(--radius-sm) text-[#6b7280] hover:text-(--color-text-primary) hover:bg-(--color-surface-raised) transition-all duration-[120ms] active:scale-[0.95]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form id="user-form" onSubmit={handleSubmit}>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-0.5 h-5 bg-(--color-text-primary) rounded-full" />
                  <h3 className="text-sm font-bold text-(--color-text-primary)">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {renderInput('First Name', 'firstName', 'text', formData.firstName)}
                  {renderInput('Last Name', 'lastName', 'text', formData.lastName)}
                  {renderInput('Email Address', 'email', 'email', formData.email)}
                  {renderInput('Phone Number', 'phone', 'text', formData.phone)}
                  {renderSelect('Gender', 'gender', formData.gender, [
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ])}
                  {renderInput('Age', 'age', 'text', formData.age)}
                  {renderSelect('Role', 'role', formData.role, [
                    { value: 'user', label: 'User' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'moderator', label: 'Moderator' },
                  ])}
                  {renderInput('Profile Image URL', 'image', 'text', formData.image ?? '')}
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-0.5 h-5 bg-(--color-text-primary) rounded-full" />
                  <h3 className="text-sm font-bold text-(--color-text-primary)">Address</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {renderInput('Street', 'address.address', 'text', formData.address.address)}
                  {renderInput('City', 'address.city', 'text', formData.address.city)}
                  {renderInput('State', 'address.state', 'text', formData.address.state)}
                  {renderInput('Country', 'address.country', 'text', formData.address.country)}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-0.5 h-5 bg-(--color-text-primary) rounded-full" />
                  <h3 className="text-sm font-bold text-(--color-text-primary)">Company</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {renderInput('Company Name', 'company.name', 'text', formData.company.name)}
                  {renderInput('Department', 'company.department', 'text', formData.company.department)}
                  <div className="sm:col-span-2">
                    {renderInput('Job Title', 'company.title', 'text', formData.company.title)}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="px-8 py-5 border-t border-(--color-border) flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-(--radius-sm) text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface-raised) disabled:opacity-50 transition-all duration-(--transition-fast) active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="user-form"
              disabled={isSubmitting || !isModifyContent}
              className="px-6 py-2 text-sm font-medium rounded-(--radius-sm) text-(--color-text-inverse) bg-(--color-primary) hover:-translate-y-px hover:shadow-(--shadow-md) shadow-(--shadow-xs) disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-(--transition-fast) active:scale-[0.98] flex items-center justify-center min-w-[110px]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-(--color-text-inverse)/30 border-t-(--color-text-inverse) rounded-full animate-spin" />
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
