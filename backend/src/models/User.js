const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'farmer', 'distributor', 'retailer', 'consumer'],
    default: 'consumer'
  },
  name: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100
  },
  organization: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100
  },
  location: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    maxlength: 20
  },
  // Farmer-specific fields
  aadhaarId: {
    type: String,
    required: false,
    trim: true,
    maxlength: 12,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^\d{12}$/.test(v);
      },
      message: 'Aadhaar ID must be 12 digits'
    }
  },
  landLocation: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200
  },
  typeOfProduce: {
    type: String,
    required: false,
    enum: ['grains', 'vegetables', 'fruits', 'pulses', 'spices', 'dairy', 'other', ''],
    default: ''
  },
  // Distributor/Retailer-specific fields
  gstin: {
    type: String,
    required: false,
    trim: true,
    maxlength: 15,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
      },
      message: 'Invalid GSTIN format'
    }
  },
  businessName: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200
  },
  contactPerson: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100
  },
  businessAddress: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500
  },
  licenseNumber: {
    type: String,
    required: false,
    trim: true,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);