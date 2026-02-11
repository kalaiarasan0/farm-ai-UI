import { http } from './http';

export const animalService = {
    getAnimals: async (limit = 50, offset = 0) => {
        return await http.get(`/api/v1/track/animals/list?limit=${limit}&offset=${offset}`);
    },

    getAnimalCount: async () => {
        return await http.get('/api/v1/track/animals/count');
    },

    getAnimalByTagId: async (tagId) => {
        return await http.get(`/api/v1/track/animals/tag-id/${tagId}`);
    },

    getAnimalById: async (id) => {
        return await http.get(`/api/v1/track/animals/id/${id}`);
    },

    createAnimal: async (data) => {
        return await http.post('/api/v1/track/animals/create', data);
    },

    createInventoryMovement: async (data) => {
        return await http.post('/api/v1/track/inventory_animals/create', data);
    },

    createAnimalEvent: async (data) => {
        return await http.post('/api/v1/track/animal_events/create', data);
    },

    getLookup: async (search = '', additionalParams = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);

        Object.keys(additionalParams).forEach(key => {
            if (additionalParams[key]) {
                params.append(key, additionalParams[key]);
            }
        });

        const queryString = params.toString();
        return await http.get(`/api/v1/track/animals/lookup?${queryString}`);
    },

    getAnimalEventsByAnimalId: async (animalId, limit = 10, offset = 0) => {
        return await http.get(`/api/v1/track/animal_events/list/animal/${animalId}?limit=${limit}&offset=${offset}`);
    },

    getMilkEvents: async (animalId = null, limit = 10, offset = 0) => {
        let url = `/api/v1/track/animal_events/list/milk?limit=${limit}&offset=${offset}`;
        if (animalId) {
            url += `&animal_id=${animalId}`;
        }
        return await http.get(url);
    }
};
