const mongoose = require('mongoose');

const NgoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationName: {
      type: String,
      required: [true, 'Please add organization name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Organization name cannot be more than 100 characters'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please add registration number'],
      unique: true,
    },
    yearFounded: {
      type: Number,
    },
    mission: {
      type: String,
      required: [true, 'Please add mission statement'],
      maxlength: [1000, 'Mission statement cannot be more than 1000 characters'],
    },
    vision: {
      type: String,
      maxlength: [1000, 'Vision statement cannot be more than 1000 characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    primaryLocation: {
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
    additionalLocations: [
      {
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
    ],
    contactEmail: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    contactPhone: {
      type: String,
      maxlength: [20, 'Phone number cannot be longer than 20 characters'],
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    focusAreas: [String],
    requirements: [
      {
        category: {
          type: String,
          enum: ['monetary', 'goods', 'volunteer', 'other'],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: String,
        quantity: Number,
        urgency: {
          type: String,
          enum: ['low', 'medium', 'high', 'critical'],
          default: 'medium',
        },
        deadline: Date,
        status: {
          type: String,
          enum: ['open', 'in-progress', 'fulfilled', 'closed'],
          default: 'open',
        },
      },
    ],
    documents: [
      {
        documentType: String,
        documentName: String,
        documentUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    about: {
      type: String,
      maxlength: [5000, 'About text cannot be more than 5000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Geocode & create location field
NgoSchema.pre('save', async function (next) {
  // Only update if primary location address is modified
  if (!this.isModified('primaryLocation.street') && 
      !this.isModified('primaryLocation.city') && 
      !this.isModified('primaryLocation.state') && 
      !this.isModified('primaryLocation.country')) {
    next();
  }
  
  // For a real application, here you would call a geocoding service
  // to convert the address into coordinates

  // This is a placeholder for demonstration purposes
  if (this.primaryLocation) {
    this.primaryLocation.formattedAddress = `${this.primaryLocation.street}, ${this.primaryLocation.city}, ${this.primaryLocation.state}, ${this.primaryLocation.zipcode}, ${this.primaryLocation.country}`;
    
    // Set some default coordinates if no geocoding service is used
    if (!this.primaryLocation.coordinates || this.primaryLocation.coordinates.length !== 2) {
      this.primaryLocation.coordinates = [0, 0]; // Default to [longitude, latitude]
    }
  }
  
  next();
});

// Reverse populate with virtuals
NgoSchema.virtual('donations', {
  ref: 'Donation',
  localField: '_id',
  foreignField: 'ngo',
  justOne: false,
});

module.exports = mongoose.model('Ngo', NgoSchema); 