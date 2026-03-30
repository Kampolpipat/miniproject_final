import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '' });

API.interceptors.request.use((req) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile?.token) {
        req.headers.Authorization = `Bearer ${profile.token}`;
    }
    return req;
});

export const getUser = (id) => API.get(`/user/${id}`);
export const getFollowers = (id) => API.get(`/user/${id}/followers`);
export const getFollowing = (id) => API.get(`/user/${id}/following`);
export const updateUser = (id, userData) => API.put(`/user/${id}`, userData);
export const changePassword = (id, data) => API.put(`/user/${id}/change-password`, data);
export const followUser = (id, currentUserId) => API.put(`/user/${id}/follow`, { currentUserId });
export const unfollowUser = (id, currentUserId) => API.put(`/user/${id}/unfollow`, { currentUserId });
