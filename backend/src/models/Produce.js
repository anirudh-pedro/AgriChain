const mongoose = require('mongoose');

const journeyStepSchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
    enum: ['Farm', 'Collection Center', 'Distributor', 'Retailer', 'Consumer']
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'current', 'pending'],
    default: 'pending'
  },
  verifiedBy: {
    type: String
  },
  blockchainHash: {
    type: String
  }
});

const produceSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    trim: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'kg'
  },
  harvestDate: {
    type: Date,
    required: true
  },
  farmLocation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  quality: {
    type: String,
    required: true,
    enum: ['Premium', 'Good', 'Average'],
    default: 'Good'
  },
  organic: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'SOLD', 'IN_TRANSIT', 'DELIVERED'],
    default: 'AVAILABLE'
  },
  blockchainId: {
    type: String
  },
  journey: [journeyStepSchema]
}, {
  timestamps: true
});

// Indexes for better query performance
produceSchema.index({ farmer: 1 });
produceSchema.index({ status: 1 });
produceSchema.index({ cropName: 'text', farmLocation: 'text', description: 'text' });
produceSchema.index({ price: 1 });
produceSchema.index({ harvestDate: 1 });
produceSchema.index({ organic: 1 });

// Virtual for calculating age of produce
produceSchema.virtual('daysFromHarvest').get(function() {
  return Math.floor((Date.now() - this.harvestDate.getTime()) / (1000 * 60 * 60 * 24));
});

// Method to update journey status
produceSchema.methods.updateJourney = function(stage, location, status = 'current') {
  // Update previous current stage to completed
  this.journey.forEach(step => {
    if (step.status === 'current') {
      step.status = 'completed';
    }
  });
  
  // Find and update the specified stage
  const journeyStep = this.journey.find(step => step.stage === stage);
  if (journeyStep) {
    journeyStep.status = status;
    journeyStep.date = new Date();
    journeyStep.location = location;
  }
  
  return this.save();
};

// Method to initialize journey
produceSchema.methods.initializeJourney = function() {
  const stages = ['Farm', 'Collection Center', 'Distributor', 'Retailer'];
  
  this.journey = stages.map((stage, index) => ({
    stage,
    date: index === 0 ? this.harvestDate : new Date(),
    location: index === 0 ? this.farmLocation : '',
    status: index === 0 ? 'completed' : 'pending'
  }));
  
  return this.save();
};

const Produce = mongoose.model('Produce', produceSchema);

module.exports = Produce;