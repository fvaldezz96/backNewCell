const { Router } = require('express')
const { sendClaim } = require('../nodemailer/send-mails')

const router = Router();

router.post('/', sendClaim)

module.exports = router;

