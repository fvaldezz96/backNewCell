const express = require('express');
const router = express.Router();
const { createOrder } = require('../Middleware/payment.middleware');
const { webHooksFunction } = require('../Middleware/webhook.middleware');
const { validateAndCreateOrder } = require('../Middleware/validateWebHook.middleware');

router.post('/payment', createOrder);
router.post('/webhook', webHooksFunction);
// router.post('/validate-order', validateAndCreateOrder);

module.exports = router;