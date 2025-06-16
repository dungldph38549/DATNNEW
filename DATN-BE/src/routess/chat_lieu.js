import express from 'express';
import {  createChatLieu, deleteChatLieu, getAllChatLieu, updateChatLieu } from '../controller/chat_lieu.js';

const chat_lieu_router = express.Router();

chat_lieu_router.get('/', getAllChatLieu);
chat_lieu_router.post('/', createChatLieu);
chat_lieu_router.put('/:id', updateChatLieu);
chat_lieu_router.delete('/:id', deleteChatLieu);

export default chat_lieu_router;
