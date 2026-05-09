
import { toast } from '../hooks/useToast'

interface IApiResponse {
    statusCode: number;
    data: any;
    message?: string;
}

export const handleApiResponse = (response: IApiResponse) => {
    const { statusCode, data, message } = response ?? {};

    switch (statusCode) {
        case 200:
            toast.success(message || 'Success');
            break;

        case 201:
            toast.success(message || 'Success');
            break;

        case 400:
            toast.error(message || 'Bad Request');
            break;

        case 403:
            toast.error(message || 'Forbidden');
            break;

        case 404:
            toast.error(message || 'Not Found');
            break;

        case 409:
            toast.error(message || 'Conflict');
            break;

        case 500:
            toast.error(message || 'Internal Server Error');
            break;

        default:
            toast.error('Unexpected error occurred');
            break;
    }

    return data;
};
