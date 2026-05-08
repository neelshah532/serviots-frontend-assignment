import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeModal, createUser, updateUser } from '../store/userSlice';
import { toast } from '../hooks/useToast';
import type { IUserFormData } from '../types/user.types';

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

export const UserFormModal = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, isEditMode, selectedUser } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState<IUserFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
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
  }, [isModalOpen, isEditMode, selectedUser]);

  if (!isModalOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim() || formData.firstName.length < 2)
      newErrors.firstName = 'First name must be at least 2 characters';
    if (!formData.lastName.trim() || formData.lastName.length < 2)
      newErrors.lastName = 'Last name must be at least 2 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email))
      newErrors.email = 'Valid email is required';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.age < 18 || formData.age > 100)
      newErrors.age = 'Age must be between 18 and 100';

    if (!formData.role.trim()) newErrors.role = 'Role is required';

    if (!formData.address.address.trim()) newErrors['address.address'] = 'Address is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';

    if (!formData.company.name.trim()) newErrors['company.name'] = 'Company name is required';
    if (!formData.company.department.trim())
      newErrors['company.department'] = 'Department is required';
    if (!formData.company.title.trim()) newErrors['company.title'] = 'Job title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (isEditMode && selectedUser) {
        dispatch(updateUser({ id: selectedUser.id, data: formData }));
        toast.success('User successfully updated', `${formData.firstName} ${formData.lastName} has been updated.`);
      } else {
        dispatch(createUser(formData));
        toast.success('User successfully created', `${formData.firstName} ${formData.lastName} has been added to the system.`);
      }
      dispatch(closeModal());
    } catch {
      toast.error('An error occurred while saving user data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...(prev as Record<string, any>)[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'age' ? parseInt(value, 10) || '' : value,
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
      <label htmlFor={name} className="text-[13px] font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleInputChange}
        className={`w-full px-3.5 py-2.5 bg-[var(--color-surface-raised)] shadow-[var(--shadow-inset)] rounded-[var(--radius-md)] text-sm font-normal text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none transition-all duration-150 ${
          errors[name]
            ? 'ring-2 ring-[var(--color-danger)] border-transparent'
            : 'border border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent'
        }`}
      />
      {errors[name] && (
        <span className="text-xs font-normal text-[var(--color-danger)]">{errors[name]}</span>
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
      <label htmlFor={name} className="text-[13px] font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleInputChange}
        className="w-full px-3.5 py-2.5 bg-[var(--color-surface-raised)] shadow-[var(--shadow-inset)] border border-transparent rounded-[var(--radius-md)] text-sm font-normal text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-150 cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="animate-fade-in fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4 sm:p-8 bg-black/40 backdrop-blur-[2px]"
        onClick={() => dispatch(closeModal())}
      >
        {/* Modal card */}
        <div
          className="animate-modal-in w-full max-w-2xl bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] flex flex-col max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border)] shrink-0">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              {isEditMode ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={() => dispatch(closeModal())}
              className="p-1.5 rounded-[var(--radius-sm)] text-[#6b7280] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-all duration-[120ms] active:scale-[0.95]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form id="user-form" onSubmit={handleSubmit}>
              
              {/* Section: Basic */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-0.5 h-5 bg-[var(--color-text-primary)] rounded-full" />
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Basic Information</h3>
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
                  {renderInput('Age', 'age', 'number', formData.age)}
                  {renderSelect('Role', 'role', formData.role, [
                    { value: 'user', label: 'User' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'editor', label: 'Editor' },
                  ])}
                  {renderInput('Profile Image URL', 'image', 'text', formData.image ?? '')}
                </div>
              </div>

              {/* Section: Address */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-0.5 h-5 bg-[var(--color-text-primary)] rounded-full" />
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Address</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {renderInput('Street', 'address.address', 'text', formData.address.address)}
                  {renderInput('City', 'address.city', 'text', formData.address.city)}
                  {renderInput('State', 'address.state', 'text', formData.address.state)}
                  {renderInput('Country', 'address.country', 'text', formData.address.country)}
                </div>
              </div>

              {/* Section: Company */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-0.5 h-5 bg-[var(--color-text-primary)] rounded-full" />
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Company</h3>
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

          {/* Footer */}
          <div className="px-8 py-5 border-t border-[var(--color-border)] flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-50 transition-all duration-[var(--transition-fast)] active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="user-form"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-[var(--color-text-inverse)] bg-[var(--color-primary)] hover:-translate-y-px hover:shadow-[var(--shadow-md)] shadow-[var(--shadow-xs)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-[var(--transition-fast)] active:scale-[0.98] flex items-center justify-center min-w-[110px]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[var(--color-text-inverse)]/30 border-t-[var(--color-text-inverse)] rounded-full animate-spin" />
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
