const express = require('express');
const router = express.Router();
const { webHooksFunction } = require('../Middleware/webhook.middleware')
router.post('/', webHooksFunction);

module.exports = router;
