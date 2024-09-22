// src/controllers/contentController.js
const Lecture = require('../models/Lecture');
const TestSeries = require('../models/TestSeries');

const uploadContent = async (req, res) => {
    try {
        const { subject, section, title, description, link } = req.body;

        // console.log("Request Body:", req.body);

        if (!link) {
            return res.status(400).json({ error: 'Link is required' });
        }

        let content;

        if (section === 'videoLectures') {
            content = new Lecture({
                subject,
                section,
                title,
                description,
                url: link,
                uploadedBy: req.admin._id,
            });
        } else if (section === 'testSeries') {
            content = new TestSeries({
                subject,
                section,
                title,
                description,
                url: link,
                uploadedBy: req.admin._id,
            });
        }

        await content.save();

        // console.log("Content saved:", content);

        res.status(201).json({ message: 'Content uploaded successfully' });
    } catch (error) {
        console.error('Error uploading content:', error.message);
        res.status(400).json({ error: error.message });
    }
};

const getContentBySubjectAndSection = async (req, res) => {
    const { subject, section } = req.params;

    try {
        let content;

        if (section === 'videoLectures') {
            content = await Lecture.find({ subject, section });
        } else if (section === 'testSeries') {
            content = await TestSeries.find({ subject, section });
        }

        res.status(200).json(content);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    uploadContent,
    getContentBySubjectAndSection,
};
