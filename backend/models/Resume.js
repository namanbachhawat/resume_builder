const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    startYear: { type: String, default: '' },
    endYear: { type: String, default: '' },
    gpa: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: { type: String, default: '' },
    link: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
        summary: { type: String, default: '' },
        education: [educationSchema],
        experience: [experienceSchema],
        skills: [{ type: String }],
        projects: [projectSchema],
        template: { type: Number, default: 1, enum: [1, 2, 3] },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
