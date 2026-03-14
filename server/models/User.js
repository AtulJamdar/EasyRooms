const mongoose = require('mongoose');

/**
 * User model - represents a student using the platform.
 *
 * Fields include basic profile information and preferences that will
 * be useful for roommate matching and room recommendations.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phone: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    budget: {
      type: Number,
      min: 0,
    },
    lifestyleHabits: {
      type: [String],
      default: [],
      description: 'Array of keywords describing lifestyle preferences (e.g., quiet, party, early-riser)',
    },
    isAdmin: {
      type: Boolean,
      default: false,
      description: 'Flag used to grant admin access for moderation features',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving if it has been modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

/**
 * Compare a candidate plain-text password to the stored hash.
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
