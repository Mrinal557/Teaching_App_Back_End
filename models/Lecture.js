const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    section: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;