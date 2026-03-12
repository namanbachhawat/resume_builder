const express = require('express');
const router = express.Router();
require('dotenv').config();

// Helper: determine which AI provider to use
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

async function callOpenAI(prompt) {
    const { OpenAI } = require('openai');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
    });
    return response.choices[0].message.content.trim();
}

async function callGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
    const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text.trim();
}

// Smart mock responses based on the type of request
const MOCK_SKILLS = {
    'Software Developer': ['JavaScript', 'Python', 'React.js', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Agile/Scrum', 'TypeScript', 'Docker'],
    'Data Scientist': ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Visualization', 'Pandas', 'Statistical Analysis', 'Deep Learning', 'R', 'Tableau'],
    'Product Manager': ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analysis', 'Roadmap Planning', 'Stakeholder Management', 'A/B Testing', 'JIRA', 'Market Analysis', 'Cross-functional Leadership'],
    'default': ['Communication', 'Problem-Solving', 'Team Collaboration', 'Project Management', 'Critical Thinking', 'Time Management', 'Adaptability', 'Leadership', 'Analytical Skills', 'Attention to Detail'],
};

async function callAI(prompt) {
    if (AI_PROVIDER === 'gemini') {
        return await callGemini(prompt);
    }
    if (AI_PROVIDER === 'mock') {
        // Return mock data — handled per-route below
        throw new Error('__MOCK__');
    }
    return await callOpenAI(prompt);
}

// Wrapper: try real AI first, fall back to mock on any error
async function callAIWithFallback(prompt) {
    try {
        return await callAI(prompt);
    } catch (err) {
        console.log('⚠️  AI call failed, using mock fallback:', err.message);
        throw err; // let route handlers provide context-aware mock data
    }
}

// POST /api/ai/generate-summary
router.post('/generate-summary', async (req, res) => {
    try {
        const { name, experience, skills, education } = req.body;
        const prompt = `Write a professional resume summary (3-4 sentences, first person) for a candidate named ${name || 'the candidate'}.
Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Not specified'}.
Latest experience: ${experience?.[0]?.position || ''} at ${experience?.[0]?.company || ''}.
Education: ${education?.[0]?.degree || ''} in ${education?.[0]?.field || ''} from ${education?.[0]?.institution || ''}.
Keep it concise, powerful, and ATS-friendly.`;

        let summary;
        try {
            summary = await callAIWithFallback(prompt);
        } catch {
            // Mock fallback
            const displayName = name || 'a dedicated professional';
            const role = experience?.[0]?.position || 'professional';
            const company = experience?.[0]?.company || '';
            const degree = education?.[0]?.degree || '';
            const field = education?.[0]?.field || '';
            const skillList = Array.isArray(skills) ? skills.join(', ') : skills || 'diverse technical and soft skills';

            summary = `Results-driven ${role}${company ? ` with experience at ${company}` : ''} passionate about delivering high-quality solutions. ${degree ? `Holding a ${degree}${field ? ` in ${field}` : ''}, I bring` : 'I bring'} a strong foundation in ${skillList}. Known for excellent problem-solving abilities, collaborative mindset, and a commitment to continuous learning and professional growth.`;
        }

        res.json({ success: true, data: summary });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/ai/improve-experience
router.post('/improve-experience', async (req, res) => {
    try {
        const { description, position, company } = req.body;
        const prompt = `Improve the following work experience description for the role of "${position || 'professional'}" at "${company || 'a company'}".
Make it more impactful, using strong action verbs and quantifiable results where possible. Return only the improved description.
Original: ${description}`;

        let improved;
        try {
            improved = await callAIWithFallback(prompt);
        } catch {
            // Mock fallback: enhance the original description with action verbs
            const original = description || 'Worked on various projects and tasks.';
            improved = `Spearheaded key initiatives as ${position || 'a professional'}${company ? ` at ${company}` : ''}, driving measurable impact across multiple projects. ${original} Consistently exceeded performance benchmarks while collaborating with cross-functional teams to deliver innovative solutions on time and within budget.`;
        }

        res.json({ success: true, data: improved });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/ai/suggest-skills
router.post('/suggest-skills', async (req, res) => {
    try {
        const { position, experience, education } = req.body;
        const prompt = `Suggest 10 relevant professional skills (comma-separated, no numbering) for a resume for the role: "${position || 'Software Developer'}".
Consider their experience: ${experience?.[0]?.description || 'Not provided'}.
Return ONLY a comma-separated list of skill names, nothing else.`;

        let skills;
        try {
            const result = await callAIWithFallback(prompt);
            skills = result.split(',').map((s) => s.trim()).filter(Boolean);
        } catch {
            // Mock fallback: pick skills based on position
            const roleKey = Object.keys(MOCK_SKILLS).find(
                (key) => (position || '').toLowerCase().includes(key.toLowerCase())
            );
            skills = MOCK_SKILLS[roleKey] || MOCK_SKILLS['default'];
        }

        res.json({ success: true, data: skills });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
