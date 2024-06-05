const { Router } = require('express')
const { createOrder } = require("../Middleware/payment.middleware")
const router = Router();

router.post('/', createOrder)
router.get('/', createOrder)
router.get('/success', (req, res ) => res.send('success'))
router.get('/failure', (req, res ) => res.send('failure'))
router.get('/pending', (req, res ) => res.send('pending'))
router.get('/webhook', (req, res ) => res.send('webhook'))


module.exports = router