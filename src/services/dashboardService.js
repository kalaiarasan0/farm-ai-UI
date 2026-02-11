import { http } from './http';

export const dashboardService = {
    getStats: async () => {
        return await http.get('/api/v1/dashboard/stats');
    }
};
