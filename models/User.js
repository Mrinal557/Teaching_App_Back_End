const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const subscriptionSchema = new mongoose.Schema({
  physicalChemistry: {
    videoLectures: { type: Boolean, default: false },
    testSeries: { type: Boolean, default: false },
  },
  inorganicChemistry: {
    videoLectures: { type: Boolean, default: false },
    testSeries: { type: Boolean, default: false },
  },
  organicChemistry: {
    videoLectures: { type: Boolean, default: false },
    testSeries: { type: Boolean, default: false },
  },
});

const paymentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  section: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptions: subscriptionSchema,
  payments: [paymentSchema],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Hash the password before saving the user model
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;