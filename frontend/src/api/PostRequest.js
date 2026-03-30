import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '' });

API.interceptors.request.use((req) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile?.token) {
        req.headers.Authorization = `Bearer ${profile.token}`;
    }
    return req;
});

export const createPost = (postData) => API.post('/post', postData);
export const getPost = (id) => API.get(`/post/${id}`);
export const getTimelinePosts = (userId) => API.get(`/post/${userId}/timeline`);
export const likePost = (postId, userId) => API.put(`/post/${postId}/like`, { userId });
export const commentPost = (postId, { userId, text }) => API.put(`/post/${postId}/comment`, { userId, text });
