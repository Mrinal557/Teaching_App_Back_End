// src/routes/ContentRoutes.js
const express = require('express');
const router = express.Router();
const contentController = require('../Controllers/ContentController');
const { protectAdmin, protectUser } = require('../middleware/authMiddleware');
const subscriptionController = require('../Controllers/SubscriptionController');

// Upload content (video lectures or test series)
router.post('/upload', protectAdmin, contentController.uploadContent);

// Get content by subject and section for both user and admin
router.get('/:subject/:section', protectUser, contentController.getContentBySubjectAndSection);
router.get('/admin/:subject/:section', protectAdmin, contentController.getContentBySubjectAndSection);
router.get('/subscriptions', protectUser, subscriptionController.getSubscriptions);

module.exports = router;
