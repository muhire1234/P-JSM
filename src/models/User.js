// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
     type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
     lowercase: true,
      trim: true
     },
  password: { 
    type: String,
     required: true,
      select: false 
    }, // hashed
  role: { 
    type: String, 
    enum: ['Admin', 'DOD', 'DOS', 'Teacher', 'Security'], 
    required: true 
  },
  schoolId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'School', required: true }
}, 
{ timestamps: true });

// Password hashing before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const hashPasswordInUpdate = async function(next) {
  const update = this.getUpdate();
  if (!update) return next();

  const directPassword = update.password;
  const setPassword = update.$set && update.$set.password;
  const newPassword = directPassword || setPassword;

  if (!newPassword) return next();

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  if (directPassword) update.password = hashed;
  if (update.$set && update.$set.password) update.$set.password = hashed;

  this.setUpdate(update);
  next();
};

UserSchema.pre('findOneAndUpdate', hashPasswordInUpdate);
UserSchema.pre('updateOne', hashPasswordInUpdate);

// Password verification method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
