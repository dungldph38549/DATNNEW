import express from 'express';
import { create, getAll, remove, update } from '../controller/chat_lieu.js';

const chat_lieu_router = express.Router();

chat_lieu_router.get('/', getAll);
chat_lieu_router.post('/', create);
chat_lieu_router.put('/:id', update);
chat_lieu_router.delete('/:id', remove);

export default chat_lieu_router;
