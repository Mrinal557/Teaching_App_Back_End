// routes/authRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  loginAdmin,
  registerAdmin,
  forgotPassword,
  resetPassword,
  getUserByEmail,
  getAdminByEmail
} = require('../Controllers/AuthController');

const router = express.Router();

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.post('/registerAdmin', registerAdmin);
router.post('/loginAdmin', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/getuser/:email', getUserByEmail);
router.get('/getadmin/:email', getAdminByEmail);

module.exports = router;
