import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // 1. Import มาก่อน
import cors from 'cors';
import dns from 'dns/promises';

import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js'; 
import PostRoute from './Routes/PostRoute.js'; 

// 2. ค่อยเรียกใช้งาน config หลัง import เสร็จ
dotenv.config(); 

const app = express();

// 1. Middleware ต้องมาก่อนเสมอ
app.use(cors()); 
app.use(express.json()); 
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// 2. แล้วค่อยตามด้วย Routes
app.use('/auth', AuthRoute); 
app.use('/user', UserRoute);  
app.use('/post', PostRoute);

// ตั้งค่า DNS
dns.setServers(['8.8.8.8','1.1.1.1']);

// 5. เชื่อมต่อ Database
const PORT = process.env.PORT || 5001; // **เปลี่ยน Default เป็น 5001 ชั่วคราว**
const MONGO_DB = process.env.MONGODB_DB;

mongoose 
    .connect(MONGO_DB) 
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.log("MongoDB Connection Error: ", error.message);
    });