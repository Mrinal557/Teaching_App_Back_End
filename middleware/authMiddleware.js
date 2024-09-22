const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protectUser = async (req, res, next) =>
{
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  {
    token = req.headers.authorization.split(' ')[ 1 ];
  }

  if (!token)
  {
    console.log('No token found!');
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Token decoded:', decoded);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user)
    {
      console.log('User not found!');
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }
    console.log('User authenticated:', req.user.email);
    next();
  } catch (error)
  {
    console.log('Token verification failed: ', error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

const protectAdmin = async (req, res, next) =>
{
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  {
    token = req.headers.authorization.split(' ')[ 1 ];
  }

  if (!token)
  {
    console.log('not authorized, token not found');
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin)
    {
      console.log('admin not found!');
      return res.status(401).json({ error: 'Not authorized, admin not found' });
    }
    next();
  } catch (error)
  {
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protectUser, protectAdmin };