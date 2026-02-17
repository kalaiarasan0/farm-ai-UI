import { http } from './http';

export const orderService = {
    // List orders with pagination
    listOrders: async (limit = 50, offset = 0) => {
        return await http.get(`/api/v1/orders/list?limit=${limit}&offset=${offset}`);
    },

    // Search orders by query (order number or customer name)
    searchOrders: async (query, limit = 50, offset = 0) => {
        return await http.get(`/api/v1/orders/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    },

    // Get specific order details by ID
    getOrderById: async (id) => {
        return await http.get(`/api/v1/orders/${id}`);
    },

    // Place a new order
    placeOrder: async (data) => {
        return await http.post('/api/v1/orders/place-order', data);
    },

    // Map animal to order item
    mapAnimalToOrderItem: async (animalId, orderItemId) => {
        return await http.patch(`/api/v1/track/animals/map-animal-to-order-item?animal_id=${animalId}&order_item_id=${orderItemId}`);
    },

    // Map animal to remove from order item
    removeAnimalToOrderItem: async (animalId, orderItemId) => {
        return await http.patch(`/api/v1/track/animals/un-map-animal-from-order-item?animal_id=${animalId}&order_item_id=${orderItemId}`);
    },

    //Update Order status
    updateOrderStatus: async (id, status) => {
        return await http.patch(`/api/v1/orders/status/${id}?payload=${status}`);
    }
};
