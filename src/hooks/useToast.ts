import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning';

export interface IToast {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  isExiting?: boolean;
}

// Global state for toasts so they can be triggered from anywhere
let toasts: IToast[] = [];
let listeners: ((toasts: IToast[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  success: (message: string, description?: string) => addToast(message, 'success', description),
  error: (message: string, description?: string) => addToast(message, 'error', description),
  warning: (message: string, description?: string) => addToast(message, 'warning', description),
};

const addToast = (message: string, type: ToastType, description?: string) => {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.push({ id, message, type, description });
  notifyListeners();

  setTimeout(() => {
    dismissToast(id);
  }, 4000);
};

const dismissToast = (id: string) => {
  const toastItem = toasts.find((t) => t.id === id);
  if (toastItem && !toastItem.isExiting) {
    toastItem.isExiting = true;
    notifyListeners();
    setTimeout(() => {
      removeToast(id);
    }, 200);
  }
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
};

export const useToast = () => {
  const [currentToasts, setCurrentToasts] = useState<IToast[]>(toasts);

  useEffect(() => {
    const listener = (newToasts: IToast[]) => {
      setCurrentToasts(newToasts);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return { toasts: currentToasts, dismissToast };
};
