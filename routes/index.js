const express = require('express');
const router = express.Router();

router.use('/api/products', require('./products'));

module.exports = router;
