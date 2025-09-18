const mongoose = require('mongoose');

const batchUploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  totalRecords: {
    type: Number,
    required: true,
    default: 0
  },
  processedRecords: {
    type: Number,
    default: 0
  },
  failedRecords: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PROCESSING'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  processingErrors: [{
    row: Number,
    message: String,
    data: String
  }],
  successfulTransactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

// Index for better query performance
batchUploadSchema.index({ uploadedBy: 1, createdAt: -1 });
batchUploadSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('BatchUpload', batchUploadSchema);