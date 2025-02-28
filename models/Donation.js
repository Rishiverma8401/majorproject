const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  donationType: { 
    type: String, 
    required: true, 
    enum: ['monetary', 'food', 'clothing', 'medicine', 'organ', 'other']
  },
  itemName: {
    type: String,
    required: function() {
      return this.donationType !== 'monetary';
    }
  },
  quantity: {
    type: Number,
    required: function() {
      return this.donationType !== 'monetary';
    }
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'distributed', 'rejected'],
    default: 'pending'
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Donation', DonationSchema);
