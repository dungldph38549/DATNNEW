const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController.js');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/dashboard', orderController.dashboard);
router.post('/returnOrderRequest', orderController.returnOrderRequest);
router.post('/acceptOrRejectReturn', orderController.acceptOrRejectReturn);
router.get('/revenue', orderController.revenue);
router.get('/topSelling', orderController.topSelling);
router.get('/paymentMethod', orderController.paymentMethod);
router.post('/comfirmDelivery/:id', orderController.comfirmDelivery);
router.get('/return-payment', orderController.returnPayment);
router.get('/user', orderController.getOrdersByUserOrGuest); // get list order by user or guest
router.get('/:id', orderController.getOrderById); 
router.put('/:id', orderController.updateOrder); // cập nhật order từ admin
router.patch('/:id', orderController.updateOrderById ); // cập nhật order từ user
router.delete('/:id', orderController.deleteOrder);

module.exports = router;