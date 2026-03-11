import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Wand2, Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '../utils/api';

function SectionHeader({ label, open, toggle, icon }) {
    return (
        <button
            type="button"
            onClick={toggle}
            className="w-full flex items-center justify-between py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors mb-3"
        >
            <span className="flex items-center gap-2 font-semibold text-white text-sm">
                {icon}{label}
            </span>
            {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
    );
}

export default function ResumeForm({ resume, setResume }) {
    const [openSections, setOpenSections] = useState({ personal: true, summary: true, education: true, experience: true, skills: true, projects: true });
    const [aiLoading, setAiLoading] = useState({});

    const toggle = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }));
    const update = (field, value) => setResume(prev => ({ ...prev, [field]: value }));

    // Education
    const updateEdu = (i, field, val) => {
        const arr = [...resume.education];
        arr[i] = { ...arr[i], [field]: val };
        update('education', arr);
    };
    const addEdu = () => update('education', [...resume.education, { institution: '', degree: '', field: '', startYear: '', endYear: '', gpa: '' }]);
    const removeEdu = (i) => update('education', resume.education.filter((_, idx) => idx !== i));

    // Experience
    const updateExp = (i, field, val) => {
        const arr = [...resume.experience];
        arr[i] = { ...arr[i], [field]: val };
        update('experience', arr);
    };
    const addExp = () => update('experience', [...resume.experience, { company: '', position: '', startDate: '', endDate: '', current: false, description: '' }]);
    const removeExp = (i) => update('experience', resume.experience.filter((_, idx) => idx !== i));

    // Projects
    const updateProj = (i, field, val) => {
        const arr = [...resume.projects];
        arr[i] = { ...arr[i], [field]: val };
        update('projects', arr);
    };
    const addProj = () => update('projects', [...resume.projects, { name: '', description: '', technologies: '', link: '' }]);
    const removeProj = (i) => update('projects', resume.projects.filter((_, idx) => idx !== i));

    // Skills
    const [skillInput, setSkillInput] = useState('');
    const addSkill = () => {
        if (!skillInput.trim()) return;
        update('skills', [...resume.skills, skillInput.trim()]);
        setSkillInput('');
    };
    const removeSkill = (i) => update('skills', resume.skills.filter((_, idx) => idx !== i));

    // AI Handlers
    const aiAction = async (action, label) => {
        setAiLoading(l => ({ ...l, [action]: true }));
        try {
            let result;
            if (action === 'summary') {
                const res = await aiAPI.generateSummary({ name: resume.name, experience: resume.experience, skills: resume.skills, education: resume.education });
                update('summary', res.data.data);
                toast.success('Summary generated!');
            } else if (action === 'skills') {
                const res = await aiAPI.suggestSkills({ position: resume.experience[0]?.position, experience: resume.experience, education: resume.education });
                const newSkills = res.data.data.filter(s => !resume.skills.includes(s));
                update('skills', [...resume.skills, ...newSkills]);
                toast.success('Skills suggested!');
            } else if (action.startsWith('exp-')) {
                const idx = parseInt(action.replace('exp-', ''));
                const res = await aiAPI.improveExperience({ description: resume.experience[idx].description, position: resume.experience[idx].position, company: resume.experience[idx].company });
                updateExp(idx, 'description', res.data.data);
                toast.success('Experience improved!');
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'AI request failed. Check your API key in .env');
        } finally {
            setAiLoading(l => ({ ...l, [action]: false }));
        }
    };

    return (
        <div className="space-y-3">
            {/* Personal Info */}
            <div className="card">
                <SectionHeader label="Personal Information" open={openSections.personal} toggle={() => toggle('personal')} icon="👤" />
                {openSections.personal && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                        {[
                            { key: 'name', placeholder: 'Full Name *', col: 2 },
                            { key: 'email', placeholder: 'Email Address *', col: 1 },
                            { key: 'phone', placeholder: 'Phone Number', col: 1 },
                            { key: 'location', placeholder: 'City, State', col: 1 },
                            { key: 'linkedin', placeholder: 'LinkedIn URL', col: 1 },
                            { key: 'website', placeholder: 'Portfolio / Website URL', col: 2 },
                        ].map(({ key, placeholder, col }) => (
                            <input
                                key={key}
                                className={`input-field ${col === 2 ? 'sm:col-span-2' : ''}`}
                                placeholder={placeholder}
                                value={resume[key]}
                                onChange={(e) => update(key, e.target.value)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="card">
                <SectionHeader label="Professional Summary" open={openSections.summary} toggle={() => toggle('summary')} icon="📝" />
                {openSections.summary && (
                    <div className="animate-fade-in">
                        <textarea
                            className="input-field h-28 resize-none mb-3"
                            placeholder="Write a compelling professional summary..."
                            value={resume.summary}
                            onChange={(e) => update('summary', e.target.value)}
                        />
                        <button
                            onClick={() => aiAction('summary', 'summary')}
                            disabled={aiLoading.summary}
                            className="flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-sm font-medium px-4 py-2 rounded-lg border border-violet-500/30 transition-all disabled:opacity-50"
                        >
                            <Sparkles size={14} />
                            {aiLoading.summary ? 'Generating...' : 'Generate Summary with AI'}
                        </button>
                    </div>
                )}
            </div>

            {/* Education */}
            <div className="card">
                <SectionHeader label="Education" open={openSections.education} toggle={() => toggle('education')} icon="🎓" />
                {openSections.education && (
                    <div className="space-y-4 animate-fade-in">
                        {resume.education.map((edu, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5 relative">
                                {resume.education.length > 1 && (
                                    <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 btn-danger p-1.5">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input className="input-field sm:col-span-2" placeholder="Institution Name" value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} />
                                    <input className="input-field" placeholder="Degree (e.g. B.S.)" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} />
                                    <input className="input-field" placeholder="Field of Study" value={edu.field} onChange={e => updateEdu(i, 'field', e.target.value)} />
                                    <input className="input-field" placeholder="Start Year" value={edu.startYear} onChange={e => updateEdu(i, 'startYear', e.target.value)} />
                                    <input className="input-field" placeholder="End Year" value={edu.endYear} onChange={e => updateEdu(i, 'endYear', e.target.value)} />
                                    <input className="input-field" placeholder="GPA (optional)" value={edu.gpa} onChange={e => updateEdu(i, 'gpa', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button onClick={addEdu} className="flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                            <Plus size={14} /> Add Education
                        </button>
                    </div>
                )}
            </div>

            {/* Experience */}
            <div className="card">
                <SectionHeader label="Work Experience" open={openSections.experience} toggle={() => toggle('experience')} icon="💼" />
                {openSections.experience && (
                    <div className="space-y-4 animate-fade-in">
                        {resume.experience.map((exp, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5 relative">
                                {resume.experience.length > 1 && (
                                    <button onClick={() => removeExp(i)} className="absolute top-3 right-3 btn-danger p-1.5">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    <input className="input-field" placeholder="Company Name" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} />
                                    <input className="input-field" placeholder="Job Title" value={exp.position} onChange={e => updateExp(i, 'position', e.target.value)} />
                                    <input className="input-field" placeholder="Start Date (e.g. Jan 2022)" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)} />
                                    <div className="flex flex-col gap-1">
                                        <input className="input-field" placeholder="End Date (or leave blank if current)" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)} disabled={exp.current} />
                                        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                                            <input type="checkbox" checked={exp.current} onChange={e => { updateExp(i, 'current', e.target.checked); if (e.target.checked) updateExp(i, 'endDate', ''); }} className="accent-brand-500" />
                                            Currently working here
                                        </label>
                                    </div>
                                </div>
                                <textarea
                                    className="input-field h-24 resize-none mb-2"
                                    placeholder="Describe your responsibilities and achievements..."
                                    value={exp.description}
                                    onChange={e => updateExp(i, 'description', e.target.value)}
                                />
                                <button
                                    onClick={() => aiAction(`exp-${i}`)}
                                    disabled={aiLoading[`exp-${i}`] || !exp.description}
                                    className="flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-violet-500/30 transition-all disabled:opacity-50"
                                >
                                    <Wand2 size={12} />
                                    {aiLoading[`exp-${i}`] ? 'Improving...' : 'Improve with AI'}
                                </button>
                            </div>
                        ))}
                        <button onClick={addExp} className="flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                            <Plus size={14} /> Add Experience
                        </button>
                    </div>
                )}
            </div>

            {/* Skills — Improved */}
            <div className="card">
                <SectionHeader
                    label={`Skills ${resume.skills.length > 0 ? `(${resume.skills.length})` : ''}`}
                    open={openSections.skills}
                    toggle={() => toggle('skills')}
                    icon="⚡"
                />
                {openSections.skills && (
                    <div className="animate-fade-in space-y-4">

                        {/* Input row */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    className="input-field pr-20"
                                    placeholder="Type a skill and press Enter or +"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                                />
                                {skillInput && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                                        Press Enter
                                    </span>
                                )}
                            </div>
                            <button onClick={addSkill} className="btn-primary px-4 py-2.5 shrink-0">
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Quick-add common skills */}
                        <div>
                            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Quick Add</p>
                            <div className="flex flex-wrap gap-1.5">
                                {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'MongoDB', 'REST APIs', 'Figma'].map(s => {
                                    const already = resume.skills.includes(s);
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => { if (!already) { update('skills', [...resume.skills, s]); } }}
                                            disabled={already}
                                            className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-150 ${already
                                                    ? 'bg-brand-600/30 text-brand-400 border-brand-500/40 opacity-60 cursor-default'
                                                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-brand-600/20 hover:text-brand-300 hover:border-brand-500/40 cursor-pointer'
                                                }`}
                                        >
                                            {already ? '✓ ' : '+ '}{s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Added skills — badge list with proficiency */}
                        {resume.skills.length > 0 && (
                            <div>
                                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Your Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {resume.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="group inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600/20 to-violet-600/20 text-brand-200 text-xs px-3 py-1.5 rounded-full border border-brand-500/30 hover:border-brand-400/60 transition-all duration-200"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(i)}
                                                className="ml-0.5 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all duration-150"
                                                title="Remove skill"
                                            >
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Skill count bar */}
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((resume.skills.length / 15) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500 shrink-0">
                                        {resume.skills.length}/15 recommended
                                    </span>
                                </div>
                            </div>
                        )}

                        {resume.skills.length === 0 && (
                            <div className="text-center py-6 border border-dashed border-white/10 rounded-lg">
                                <p className="text-slate-500 text-sm">No skills added yet.</p>
                                <p className="text-slate-600 text-xs mt-1">Type a skill above or use Quick Add.</p>
                            </div>
                        )}

                        {/* AI Button */}
                        <button
                            onClick={() => aiAction('skills')}
                            disabled={aiLoading.skills}
                            className="w-full flex items-center justify-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-sm font-medium px-4 py-2.5 rounded-lg border border-violet-500/30 transition-all disabled:opacity-50 group"
                        >
                            <Lightbulb size={14} className="group-hover:animate-pulse" />
                            {aiLoading.skills ? 'AI is suggesting skills...' : '✨ Suggest Skills with AI'}
                        </button>
                    </div>
                )}
            </div>

            {/* Projects */}
            <div className="card">
                <SectionHeader label="Projects" open={openSections.projects} toggle={() => toggle('projects')} icon="🚀" />
                {openSections.projects && (
                    <div className="space-y-4 animate-fade-in">
                        {resume.projects.map((proj, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5 relative">
                                {resume.projects.length > 1 && (
                                    <button onClick={() => removeProj(i)} className="absolute top-3 right-3 btn-danger p-1.5">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input className="input-field" placeholder="Project Name" value={proj.name} onChange={e => updateProj(i, 'name', e.target.value)} />
                                    <input className="input-field" placeholder="Technologies Used" value={proj.technologies} onChange={e => updateProj(i, 'technologies', e.target.value)} />
                                    <input className="input-field sm:col-span-2" placeholder="Project Link / GitHub URL" value={proj.link} onChange={e => updateProj(i, 'link', e.target.value)} />
                                    <textarea className="input-field sm:col-span-2 h-20 resize-none" placeholder="Describe the project and your contribution..." value={proj.description} onChange={e => updateProj(i, 'description', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button onClick={addProj} className="flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                            <Plus size={14} /> Add Project
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
