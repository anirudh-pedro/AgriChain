const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'FAILED'],
    default: 'PENDING'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  validated: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'generic'
  },
  fabricTxId: {
    type: String,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance (removed duplicate indexes)
transactionSchema.index({ submittedBy: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
// Note: hash and transactionId indexes are automatically created by unique: true

module.exports = mongoose.model('Transaction', transactionSchema);