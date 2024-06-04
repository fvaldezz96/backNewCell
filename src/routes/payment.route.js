const { Router } = require('express')
const { createOrder } = require("../Middleware/payment.middleware")
const router = Router();

router.post('/', createOrder)
router.get('/', createOrder)


module.exports = router