const mongoose = require('mongoose');

const learningContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['text', 'link'], required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('LearningContent', learningContentSchema);
