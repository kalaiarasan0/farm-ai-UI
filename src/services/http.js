import { toastEventEmitter } from '../utils/toastEventEmitter';

const BASE_URL = 'http://localhost:8000';

const getHeaders = (isUrlEncoded = false) => {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Accept': 'application/json',
    };

    if (!isUrlEncoded) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
            window.location.href = `${baseUrl}login`;
            // Optional: emit session expired toast if desired, but redirect usually suffices
        }

        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.detail || 'Something went wrong';

        // Handle if detail is array (common in FastAPI/Pydantic validation errors) or object
        if (typeof errorMessage !== 'string') {
            if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage.map(err => err.msg || JSON.stringify(err)).join(', ');
            } else {
                errorMessage = JSON.stringify(errorMessage);
            }
        }

        // Emit toast for client/server errors
        if (response.status >= 400) {
            toastEventEmitter.emit(errorMessage, 'error');
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
    }
    return response.json();
};

const request = async (endpoint, options) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        return await handleResponse(response);
    } catch (error) {
        // Handle network errors (e.g., connection refused)
        if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
            toastEventEmitter.emit('Connection Refused: Server is unreachable', 'error');
        }
        // Re-throw to let caller handle specific logic if needed, 
        // though toast is already handled.
        throw error;
    }
};

export const http = {
    get: async (endpoint) => {
        return request(endpoint, {
            method: 'GET',
            headers: getHeaders(),
        });
    },

    post: async (endpoint, data) => {
        return request(endpoint, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
    },

    patch: async (endpoint, data) => {
        return request(endpoint, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
    },

    postForm: async (endpoint, data) => {
        const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
        return request(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
        });
    },

    put: async (endpoint, data) => {
        return request(endpoint, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
    },

    delete: async (endpoint) => {
        return request(endpoint, {
            method: 'DELETE',
            headers: getHeaders(),
        });
    }
};
