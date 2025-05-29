const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ngo',
      required: true,
    },
    donationType: {
      type: String,
      enum: ['monetary', 'goods', 'organ'],
      required: [true, 'Please specify donation type'],
    },
    // For monetary donations
    amount: {
      type: Number,
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'other'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
    },
    // For goods donations
    goods: {
      title: String,
      description: String,
      category: String,
      condition: {
        type: String,
        enum: ['new', 'like-new', 'good', 'fair', 'poor'],
      },
      quantity: Number,
      estimatedValue: Number,
      images: [String],
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
          type: String,
          enum: ['cm', 'inch', 'm', 'ft'],
          default: 'cm',
        },
      },
      weight: {
        value: Number,
        unit: {
          type: String,
          enum: ['kg', 'lb', 'g'],
          default: 'kg',
        },
      },
    },
    // For organ donations
    organ: {
      organType: {
        type: String,
        enum: [
          'kidney',
          'liver',
          'heart',
          'lung',
          'pancreas',
          'intestine',
          'cornea',
          'bone_marrow',
          'blood',
          'plasma',
          'tissue',
          'other',
        ],
      },
      medicalInformation: String,
      consentGiven: {
        type: Boolean,
        default: false,
      },
      legalDisclaimerAccepted: {
        type: Boolean,
        default: false,
      },
      donorCompatibilityInfo: String,
    },
    // Common fields for all donation types
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    notes: String,
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    // Logistics information
    logistics: {
      pickupRequired: {
        type: Boolean,
        default: false,
      },
      pickupAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
      pickupDate: Date,
      pickupInstructions: String,
      deliveryDate: Date,
      trackingNumber: String,
      carrier: String,
    },
    // Tax receipt information
    taxReceipt: {
      issued: {
        type: Boolean,
        default: false,
      },
      receiptNumber: String,
      issueDate: Date,
      receiptUrl: String,
    },
    // Admin fields
    adminNotes: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: Date,
  },
  {
    timestamps: true,
  }
);

// Static method to get total donations by NGO
DonationSchema.statics.getTotalDonationsByNgo = async function (ngoId) {
  const stats = await this.aggregate([
    {
      $match: { ngo: mongoose.Types.ObjectId(ngoId), status: 'completed' },
    },
    {
      $group: {
        _id: '$donationType',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  return stats;
};

// Pre-save hook to validate donation type specific fields
DonationSchema.pre('save', function (next) {
  // Validate monetary donation fields
  if (this.donationType === 'monetary') {
    if (!this.amount || this.amount <= 0) {
      return next(new Error('Monetary donations require a positive amount'));
    }
  }
  
  // Validate goods donation fields
  if (this.donationType === 'goods') {
    if (!this.goods || !this.goods.title || !this.goods.description) {
      return next(new Error('Goods donations require title and description'));
    }
  }
  
  // Validate organ donation fields
  if (this.donationType === 'organ') {
    if (!this.organ || !this.organ.organType) {
      return next(new Error('Organ donations require an organ type'));
    }
    
    if (!this.organ.consentGiven || !this.organ.legalDisclaimerAccepted) {
      return next(new Error('Consent and legal disclaimer acceptance are required for organ donations'));
    }
  }
  
  next();
});

module.exports = mongoose.model('Donation', DonationSchema); 