import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '' });

API.interceptors.request.use((req) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile?.token) {
        req.headers.Authorization = `Bearer ${profile.token}`;
    }
    return req;
});

export const sendMessage = (data) => API.post('/chat/send', data);
export const getMessages = (conversationId) => API.get(`/chat/${conversationId}`);
