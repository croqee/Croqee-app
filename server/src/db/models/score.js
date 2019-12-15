const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: String,
  modelId: String,
  score: Number,
  date: Date
});

module.exports = mongoose.model('Score', ScoreSchema);