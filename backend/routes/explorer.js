// Rutas para probar endpoints

const express = require('express');
const { proxyRequest } = require('../controllers/proxyController');

const router = express.Router();

router.post('/proxy', proxyRequest);

module.exports = router;
