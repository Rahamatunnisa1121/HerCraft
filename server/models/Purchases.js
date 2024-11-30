const mongoose = require('mongoose');
const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Innovation', required: true },
  productName: String,
  cost: Number,
  purchaseDate: { type: Date, default: Date.now },
});
module.exports= mongoose.model('Purchase', purchaseSchema);
