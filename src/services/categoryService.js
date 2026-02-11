import { http } from './http';

export const categoryService = {
    getCategorys: async (limit = 50, offset = 0) => {
        return await http.get(`/api/v1/category/list?limit=${limit}&offset=${offset}`);
    },

    getCategoryCount: async () => {
        return await http.get('/api/v1/category/count');
    },

    searchCategorys: async (query) => {
        return await http.get(`/api/v1/category/name-search/${query}`);
    },

    getCategoryById: async (id) => {
        return await http.get(`/api/v1/category/id/${id}`);
    },

    updateCategory: async (data) => {
        return await http.patch('/api/v1/category/update', data);
    },

    createCategory: async (data) => {
        return await http.post('/api/v1/category/create', data);
    },

    getCategoryLookups: async () => {
        return await http.get('/api/v1/category/lookups');
    }
};
