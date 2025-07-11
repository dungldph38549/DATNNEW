const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);

router.get('/user', orderController.getOrdersByUserOrGuest);

router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.patch('/:id', orderController.updateOrderById );
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
