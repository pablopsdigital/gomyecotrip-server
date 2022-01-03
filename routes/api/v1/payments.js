'use strict';

const express = require('express');
const router = express.Router();

const {
  getStripeSessionId,
} = require('../../../controllers/stripeController.js');

router.post('/session-id', getStripeSessionId);

module.exports = router;
