import { http } from './http';

export const authService = {
    login: async (username, password) => {
        const data = {
            grant_type: 'password',
            username: username,
            password: password,
            scope: '',
            client_id: 'string', // As per curl request in prompt
            client_secret: 'string', // As per curl request usually ignored if not needed, but sending string as placeholder
        };

        const response = await http.postForm('/auth/token', data);
        if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
        }
        return response;
    },

    logout: () => {
        localStorage.removeItem('access_token');
    },

    getToken: () => {
        return localStorage.getItem('access_token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    }
};
