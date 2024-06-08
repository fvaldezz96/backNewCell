const { Router } = require('express')
const { createOrder } = require("../Middleware/payment.middleware")
const router = Router();

router.post('/', createOrder)
router.get('/success', (req, res) => {
    const datosDePago = req.query;
    res.render('success', { datosDePago });
});

router.get('/failure', (req, res) => {
    const datosDePago = req.query;
    console.error('Pago fallido:', datosDePago);
    res.render('failure', { datosDePago });
});

router.get('/pending', (req, res) => {
    const datosDePago = req.query;
    res.render('pending', { datosDePago });
});

module.exports = router