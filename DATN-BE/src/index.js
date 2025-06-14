import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chat_lieu_router from './routess/chat_lieu.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/chat-lieu', chat_lieu_router);


mongoose.connect("mongodb://localhost:27017/datn_su25_database")
  .then(() => {
    console.log('Kết nối db thành công');
    app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
  })
  .catch(err => console.error('Lỗi db:', err));
