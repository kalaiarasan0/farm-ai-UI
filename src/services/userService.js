import { http } from './http';

export const userService = {
    getMe: async () => {
        return await http.get('/users/me/personal-details');
    },
    getProfilePicDetails: async () => {
        return await http.get('/users/me/profile-pic-details');
    }
};
