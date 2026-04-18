const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Resume = require('../models/Resume');

// Middleware: check MongoDB connection before any resume operation
router.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            error: 'Database is not connected. Please check MongoDB configuration.',
            hint: 'The server is running but MongoDB authentication failed. Check your MONGODB_URI credentials.'
        });
    }
    next();
});

// POST /api/resume/create
router.post('/create', async (req, res) => {
    try {
        const resume = new Resume(req.body);
        const saved = await resume.save();
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// GET /api/resume/:id
router.get('/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }
        res.status(200).json({ success: true, data: resume });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT /api/resume/update/:id
router.put('/update/:id', async (req, res) => {
    try {
        const resume = await Resume.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }
        res.status(200).json({ success: true, data: resume });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// GET /api/resume/ - list all resumes (for home page)
router.get('/', async (req, res) => {
    try {
        const resumes = await Resume.find({}, 'name email template createdAt').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: resumes });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE /api/resume/:id
router.delete('/:id', async (req, res) => {
    try {
        const resume = await Resume.findByIdAndDelete(req.params.id);
        if (!resume) {
            return res.status(404).json({ success: false, error: 'Resume not found' });
        }
        res.status(200).json({ success: true, message: 'Resume deleted' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
