import axios from 'axios'

// ตั้งค่า baseURL ให้รองรับ proxy ของ React CLI หรือ env variable
// ถ้าไม่กำหนดจะใช้ path relative เช่น /auth/login (ใช้กับ proxy ใน package.json)
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '' });

// ต้องใส่ /auth นำหน้า เพื่อให้ตรงกับ app.use('/auth', AuthRoute) ใน Backend
export const logIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/register', formData);
export const forgotPassword = (username) => API.post('/auth/forgot-password', { username });
export const resetPassword = (data) => API.post('/auth/reset-password', data);