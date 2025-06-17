import express from 'express';
import { create, getAll, update, remove } from '../controller/review.js';

const review_router = express.Router();

review_router.post('/', create);
review_router.get('/', getAll); 
review_router.put('/:id', update);
review_router.delete('/:id', remove);

export default review_router;
