const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ngo',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    resourceType: {
      type: String,
      enum: ['offer', 'request'],
      required: [true, 'Please specify if this is an offer or request'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'equipment',
        'furniture',
        'medical_supplies',
        'food',
        'clothing',
        'volunteers',
        'skills',
        'transportation',
        'venue',
        'educational',
        'technological',
        'other',
      ],
    },
    quantity: {
      type: Number,
      min: [1, 'Quantity must be at least 1'],
    },
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair', 'poor', 'not_applicable'],
      default: 'not_applicable',
    },
    images: [String],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    availability: {
      startDate: Date,
      endDate: Date,
      recurring: Boolean,
      schedule: String,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'fulfilled', 'cancelled', 'expired'],
      default: 'active',
    },
    preferredMethod: {
      type: String,
      enum: ['pickup', 'delivery', 'on_site', 'remote', 'any'],
      default: 'any',
    },
    tags: [String],
    contactPerson: {
      name: String,
      email: String,
      phone: String,
    },
    exchanges: [
      {
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Ngo',
        },
        requestDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined', 'completed'],
          default: 'pending',
        },
        message: String,
        responseDate: Date,
        responseMessage: String,
        completionDate: Date,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        feedback: String,
      },
    ],
    expiryDate: {
      type: Date,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for search
ResourceSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  tags: 'text',
});

// Set expiry date for resource if not set
ResourceSchema.pre('save', function (next) {
  if (!this.expiryDate) {
    // Default expiry date 30 days from creation
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    this.expiryDate = expiryDate;
  }
  next();
});

module.exports = mongoose.model('Resource', ResourceSchema); 