const express = require('express');
const router = express.Router();
const { createOrder } = require('../Middleware/payment.middleware');
const { webHooksFunction } = require('../Middleware/webhook.middleware');

router.post('/payment', createOrder);
router.post('/webhook', webHooksFunction);

module.exports = router;