import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // 1. Import มาก่อน
import cors from 'cors';
import helmet from 'helmet';
import dns from 'dns/promises';
import http from 'http';
import { Server } from 'socket.io';

import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js'; 
import PostRoute from './Routes/PostRoute.js'; 
import ChatRoute from './Routes/ChatRoute.js';

// 2. ค่อยเรียกใช้งาน config หลัง import เสร็จ
dotenv.config(); 

const app = express();
const server = http.createServer(app);

// 1. Middleware ต้องมาก่อนเสมอ
app.use(cors());
app.use(helmet()); // OWASP A6: Security Misconfiguration - set secure HTTP headers
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// 2. แล้วค่อยตามด้วย Routes
app.use('/auth', AuthRoute); 
app.use('/user', UserRoute);  
app.use('/post', PostRoute);
app.use('/chat', ChatRoute);

// real-time chat with socket.io (OWASP A5: Use secure transports in prod https)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) && onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', onlineUsers);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text, conversationId }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', { senderId, text, conversationId, createdAt: new Date() });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    removeUser(socket.id);
    io.emit('getUsers', onlineUsers);
  });
});

// ตั้งค่า DNS
dns.setServers(['8.8.8.8','1.1.1.1']);

// 5. เชื่อมต่อ Database
const PORT = process.env.PORT || 5000; // ตั้งเป็น 5000
const MONGO_DB = process.env.MONGODB_DB;

mongoose 
    .connect(MONGO_DB) 
    .then(() => {
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.log("MongoDB Connection Error: ", error.message);
    });