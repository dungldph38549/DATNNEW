import express from 'express';
import { create, getAll, update, remove } from '../controller/banner.js';

const banner_router = express.Router();

banner_router.post('/', create);
banner_router.get('/', getAll);
banner_router.put('/:id', update);
banner_router.delete('/:id', remove);

export default banner_router;
