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
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const hashPasswordInUpdate = async function() {
  const update = this.getUpdate();
  if (!update) return;

  const directPassword = update.password;
  const setPassword = update.$set && update.$set.password;
  const newPassword = directPassword || setPassword;

  if (!newPassword) return;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  if (directPassword) update.password = hashed;
  if (update.$set && update.$set.password) update.$set.password = hashed;

  this.setUpdate(update);
};

UserSchema.pre('findOneAndUpdate', hashPasswordInUpdate);
UserSchema.pre('updateOne', hashPasswordInUpdate);

UserSchema.index({ schoolId: 1, role: 1 });

// Password verification method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
