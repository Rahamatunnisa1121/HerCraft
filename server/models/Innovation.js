const mongoose = require('mongoose');

const InnovationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the 'User' model
    required: true,
  },
  upiId: {
    type: String,
    required: true,
  },
  totalSold: {  // Tracks total units sold
    type: Number,
    default: 0,
  },
  earned: {  // Tracks total earnings
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // New fields added below
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  contact: {
    phone: { type: String, required: true }, // Seller's phone number
   
  },
  itemImage: {
    type: String, // URL or path to the image file
    required: true,
  }
});

module.exports = mongoose.model('Innovation', InnovationSchema);
