const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  notifications: [{ message: String, read: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
