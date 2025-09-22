const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  produce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produce',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['PROCESSING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
    default: 'PROCESSING'
  },
  deliveryDate: {
    type: Date
  },
  deliveryAddress: {
    type: String
  },
  trackingId: {
    type: String,
    unique: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  blockchainTxId: {
    type: String
  },
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER'],
    default: 'UPI'
  },
  paymentReference: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
purchaseSchema.index({ buyer: 1 });
purchaseSchema.index({ seller: 1 });
purchaseSchema.index({ produce: 1 });
purchaseSchema.index({ status: 1 });
purchaseSchema.index({ purchaseDate: 1 });
purchaseSchema.index({ trackingId: 1 });

// Generate tracking ID before saving
purchaseSchema.pre('save', function(next) {
  if (!this.trackingId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.trackingId = `TRK${timestamp}${random}`;
  }
  next();
});

// Method to calculate estimated delivery date
purchaseSchema.methods.calculateDeliveryDate = function() {
  const deliveryDays = this.deliveryAddress ? 3 : 2; // More days if custom delivery address
  this.deliveryDate = new Date(this.purchaseDate.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
  return this.deliveryDate;
};

// Method to update purchase status with automatic delivery date calculation
purchaseSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'CONFIRMED' && !this.deliveryDate) {
    this.calculateDeliveryDate();
  }
  
  return this.save();
};

// Virtual for checking if purchase is overdue
purchaseSchema.virtual('isOverdue').get(function() {
  if (this.status === 'DELIVERED' || this.status === 'CANCELLED') {
    return false;
  }
  
  if (this.deliveryDate) {
    return new Date() > this.deliveryDate;
  }
  
  return false;
});

// Virtual for days until delivery
purchaseSchema.virtual('daysUntilDelivery').get(function() {
  if (!this.deliveryDate || this.status === 'DELIVERED') {
    return null;
  }
  
  const diffTime = this.deliveryDate.getTime() - Date.now();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;