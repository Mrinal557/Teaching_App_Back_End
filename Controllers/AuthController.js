const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../Utils/SendEmail');
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
const generateToken = (id) =>
{
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Register a regular user
exports.registerUser = async (req, res) =>
{
  const { email, password } = req.body;

  try
  {
    const user = new User({ email, password });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ token });
  } catch (error)
  {
    console.error('Error in registerUser:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Register an admin
exports.registerAdmin = async (req, res) =>
{
  const { email, password } = req.body;

  try
  {
    const admin = new Admin({ email, password });
    await admin.save();
    const token = generateToken(admin._id);
    res.status(201).json({ token });
  } catch (error)
  {
    console.error('Error in registerAdmin:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login a regular user
exports.loginUser = async (req, res) =>
{
  const { email, password } = req.body;

  try
  {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password)))
    {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token });
  } catch (error)
  {
    console.error('Error in loginUser:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login an admin
exports.loginAdmin = async (req, res) =>
{
  const email = req.body.email, password = req.body.password;
  // console.log('Request body:', req.body);
  try
  {
    // console.log('Login attempt with email:', email);
    // console.log('Password provided:', password);
    const admin = await Admin.findOne({ email });
    // console.log('Admin found:', admin);

    const isMatch = await bcrypt.compare(password, admin.password);
    // console.log('Password match status:', isMatch);
    if (!admin)
    {
      return res.status(401).json({ error: 'Invalid email or password' });
    }


    if (!isMatch)
    {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(admin._id);
    // console.log('Generated JWT token:', token);
    res.json({ token });
  } catch (error)
  {
    console.error('Error in loginAdmin:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot password for users
exports.forgotPassword = async (req, res) =>
{
  const { email } = req.body;

  try
  {
    const user = await User.findOne({ email });

    if (!user)
    {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetUrl = `http://${req.headers.host}/api/auth/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try
    {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error)
    {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.status(500).json({ error: 'Email could not be sent' });
    }
  } catch (error)
  {
    console.error('Error in forgotPassword:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset password for users
exports.resetPassword = async (req, res) =>
{
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  try
  {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
    {
      return res.status(400).json({ error: 'Invalid token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(201).json({ success: true, data: 'Password reset success' });
  } catch (error)
  {
    console.error('Error in resetPassword:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserByEmail = async (req, res) =>
{
  const { email } = req.params;

  try
  {
    const user = await User.findOne({ email });

    if (!user)
    {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error)
  {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAdminByEmail = async (req, res) =>
{
  const { email } = req.params;

  try
  {
    const admin = await Admin.findOne({ email });

    if (!admin)
    {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error)
  {
    res.status(500).json({ error: 'Server error' });
  }
};
