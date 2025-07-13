const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/user', orderController.getOrdersByUserOrGuest); // get list order by user or guest
router.get('/:id', orderController.getOrderById); 
router.put('/:id', orderController.updateOrder); // cập nhật order từ admin
router.patch('/:id', orderController.updateOrderById ); // cập nhật order từ user
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
