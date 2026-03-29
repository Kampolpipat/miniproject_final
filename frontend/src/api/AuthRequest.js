import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5001' });

// ต้องใส่ /auth นำหน้า เพื่อให้ตรงกับ app.use('/auth', AuthRoute) ใน Backend
export const logIn = (formData) => API.post('/auth/login', formData); 
export const signUp = (formData) => API.post('/auth/register', formData);