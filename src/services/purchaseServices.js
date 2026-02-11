import { http } from "./http";

export const purchaseService = {

    createPurchase: async (data) => {
        return await http.post('/api/v1/track/material/create', data);
    },

    listPurchase: async (limit = 0, offset = 50) => {
        return await http.get(`/api/v1/track/material/list?offset=${offset}&limit=${limit}`);
    },

    updatePurchase: async (id, data) => {
        return await http.put(`/api/v1/track/material/update/${id}`, data);
    },

    deletePurchase: async (id) => {
        return await http.delete(`/api/v1/track/material/delete/${id}`);
    },

    getPurchaseById: async (id) => {
        return await http.get(`/api/v1/track/material/${id}`);
    },

    searchPurchase: async (query) => {
        return await http.get(`/api/v1/track/material/search?q=${query}`);
    },

    listPurchaseByDate: async (startDate, endDate, offset = 0, limit = 50) => {
        return await http.get(`/api/v1/track/material/list?start_date=${startDate}&end_date=${endDate}&offset=${offset}&limit=${limit}`);
    },

    listPurchaseByMaterial: async (materialId, offset = 0, limit = 50) => {
        return await http.get(`/api/v1/track/material/list?material_id=${materialId}&offset=${offset}&limit=${limit}`);
    },

    listPurchaseBySupplier: async (supplierId, offset = 0, limit = 50) => {
        return await http.get(`/api/v1/track/material/list?supplier_id=${supplierId}&offset=${offset}&limit=${limit}`);
    },
    
    listPurchaseByDateRange: async (startDate, endDate, offset = 0, limit = 50) => {
        return await http.get(`/api/v1/track/material/list?start_date=${startDate}&end_date=${endDate}&offset=${offset}&limit=${limit}`);
    }
};