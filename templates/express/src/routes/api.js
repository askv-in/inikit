const express = require('express');
const { health } = require('../controllers/healthController');

const router = express.Router();

/**
 * GET /api/health
 * Simple health check returning service info
 */
router.get('/health', health);

/**
 * Add your API routes below
 * router.use('/users', require('./users'));
 */

module.exports = router;
