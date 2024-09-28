// models/RecyclingEntry.js
const mongoose = require('mongoose');

const recyclingEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  weight: { type: Number, required: true },
  imageCount: { type: Number, required: true },
  classifications: [{
    filename: String,
    label: String,
    confidence: Number,
    size_quality: String,
    intensity_quality: String
  }],
  co2Saved: { type: Number, required: true },
  treesSaved: { type: Number, required: true },
  waterSaved: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecyclingEntry', recyclingEntrySchema);