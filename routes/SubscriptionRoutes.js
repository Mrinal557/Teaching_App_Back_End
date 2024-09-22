const express = require('express');
const router = express.Router();
const { protectUser } = require('../middleware/authMiddleware');
const subscriptionsController = require('../Controllers/SubscriptionController');

// router.post('/subscribe', protectUser, createSubscription);
router.get('/subscriptions', protectUser, subscriptionsController.getSubscriptions);
router.post('/payment-callback', subscriptionsController.handlePaymentCallback);
router.get('/test', protectUser, (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});

module.exports = router;