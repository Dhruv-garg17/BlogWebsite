const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  topics: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
