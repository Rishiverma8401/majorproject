const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  neededAmount: { 
    type: Number, 
    required: true 
  },
  requestType: {
    type: String,
    required: true,
    enum: ['monetary', 'food', 'clothing', 'medicine', 'organ', 'other']
  },
  itemName: {
    type: String,
    required: function() {
      return this.requestType !== 'monetary';
    }
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Fulfilled'], 
    default: 'Pending' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Request', RequestSchema);
