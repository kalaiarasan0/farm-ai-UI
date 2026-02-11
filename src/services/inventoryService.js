import { http } from './http';

export const inventoryService = {
    getInventories: async (limit = 50, offset = 0) => {
        return await http.get(`/api/v1/inventories/list?limit=${limit}&offset=${offset}`);
    },

    getInventoryByCategoryName: async (name) => {
        return await http.get(`/api/v1/inventories/category-name/${name}`);
    },

    getInventoryAnimals: async (inventoryId) => {
        return await http.get(`/api/v1/track/inventory_animals/list_tracking_animal_in_master_inventory?inventory_id=${inventoryId}`);
    },

    getInventoryByCategoryId: async (category_id) => {
        return await http.get(`/api/v1/inventories/category/${category_id}`);
    }
};
