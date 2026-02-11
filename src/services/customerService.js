import { http } from './http';

export const customerService = {
    // List & Count
    getCustomerCount: async (params = {}) => {
        // params: { count_type: 'all' | 'name' | 'phone', name?: string, phone?: string }
        const queryParams = new URLSearchParams(params).toString();
        return await http.get(`/api/v1/customers/count?${queryParams}`);
    },

    getCustomers: async (limit = 50, offset = 0, params = {}) => {
        // params: { count_type, name, phone } 
        // Note: The curl example showed query params like count_type=name&name=ka&phone=63
        // We will merge limit/offset with other params
        const queryParams = new URLSearchParams({
            limit,
            offset,
            ...params
        }).toString();
        return await http.get(`/api/v1/customers/list?${queryParams}`);
    },

    // CRUD
    createCustomer: async (data) => {
        return await http.post('/api/v1/customers/create-customer', data);
    },

    getCustomerById: async (id) => {
        return await http.get(`/api/v1/customers/id/${id}`);
    },

    updateCustomer: async (id, data) => {
        return await http.patch(`/api/v1/customers/id/${id}`, data);
    },

    // Aaddresses
    getCustomerAddresses: async (customerId) => {
        return await http.get(`/api/v1/addresses/by-customer-id/${customerId}`);
    },

    updateAddress: async (addressId, data) => {
        return await http.patch(`/api/v1/addresses/id/${addressId}`, data);
    },

    createAddress: async (data) => {
        return await http.post('/api/v1/addresses/create-address', data);
    },

    getAddressById: async (addressId) => {
        return await http.get(`/api/v1/addresses/id/${addressId}`);
    },

    // Location Lookups
    getStates: async () => {
        return await http.get('/api/v1/addresses/states');
    },

    getDistricts: async (state) => {
        return await http.get(`/api/v1/addresses/districts/${state}`);
    },

    getPincodes: async (district) => {
        return await http.get(`/api/v1/addresses/pincodes/${district}`);
    },

    getCustomerLookup: async () => {
        return await http.get('/api/v1/customers/lookup');
    },

    deleteCustomer: async (id) => {
        return await http.delete(`/api/v1/customers/id/${id}`);
    },

    deleteAddress: async (id) => {
        return await http.delete(`/api/v1/addresses/id/${id}`);
    }
};
