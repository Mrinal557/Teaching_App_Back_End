const mongoose = require('mongoose');

const testSeriesSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  section: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
});

const TestSeries = mongoose.model('TestSeries', testSeriesSchema);

module.exports = TestSeries;