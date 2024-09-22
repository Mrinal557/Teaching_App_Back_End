const User = require('../models/User');

const checkSubscription = async (req, res, next) => {
  const { subject, section } = req.query;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSubscribed = user.subscriptions.some(
      (sub) => sub.subject === subject && sub.section === section
    );

    if (!isSubscribed) {
      return res.status(403).json({ error: 'User not subscribed to this section' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkSubscription;
