export type ToastType = 'success' | 'error' | 'warning';

export interface IToast {
    id: string;
    message: string;
    description?: string;
    type: ToastType;
    isExiting?: boolean;
}

