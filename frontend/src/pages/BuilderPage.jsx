import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Eye, EyeOff, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import { resumeAPI } from '../utils/api';
import { downloadResumeAsPDF } from '../utils/pdfDownload';

const defaultResume = {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    education: [{ institution: '', degree: '', field: '', startYear: '', endYear: '', gpa: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', current: false, description: '' }],
    skills: [],
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    template: 1,
};

export default function BuilderPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(defaultResume);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [savedId, setSavedId] = useState(id || null);

    useEffect(() => {
        if (id) loadResume(id);
    }, [id]);

    const loadResume = async (resumeId) => {
        try {
            const res = await resumeAPI.getById(resumeId);
            setResume(res.data.data);
            setSavedId(resumeId);
        } catch {
            toast.error('Failed to load resume');
        }
    };

    const handleSave = async () => {
        if (!resume.name || !resume.email) {
            toast.error('Name and email are required');
            return;
        }
        setSaving(true);
        try {
            if (savedId) {
                await resumeAPI.update(savedId, resume);
                toast.success('Resume updated!');
            } else {
                const res = await resumeAPI.create(resume);
                setSavedId(res.data.data._id);
                navigate(`/builder/${res.data.data._id}`, { replace: true });
                toast.success('Resume saved!');
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        if (resume.template === 3) {
            toast.error('Upgrade to Premium to download this template');
            return;
        }
        setDownloading(true);
        try {
            const filename = `${resume.name || 'resume'}_resume.pdf`;
            await downloadResumeAsPDF('resume-preview-container', filename);
            toast.success('PDF downloaded!');
        } catch {
            toast.error('Failed to generate PDF');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="gradient-bg min-h-screen">
            {/* Header */}
            <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft size={18} />
                            <span className="text-sm font-medium hidden sm:block">My Resumes</span>
                        </button>
                        <div className="w-px h-6 bg-white/10 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-brand-400" />
                            <span className="font-semibold text-white text-sm truncate max-w-[120px] sm:max-w-none">
                                {resume.name || 'Untitled Resume'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPreviewMode(!previewMode)}
                            className="btn-secondary flex items-center gap-2 text-sm"
                        >
                            {previewMode ? <EyeOff size={15} /> : <Eye size={15} />}
                            <span className="hidden sm:block">{previewMode ? 'Edit' : 'Preview'}</span>
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
                            <Save size={15} />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button onClick={handleDownload} disabled={downloading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all text-sm flex items-center gap-2 active:scale-95">
                            <Download size={15} />
                            <span className="hidden sm:block">{downloading ? 'Exporting...' : 'Download PDF'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Template Selector */}
                <TemplateSelector
                    selected={resume.template}
                    onSelect={(t) => setResume((prev) => ({ ...prev, template: t }))}
                />

                <div className={`mt-6 ${previewMode ? '' : 'grid grid-cols-1 xl:grid-cols-2 gap-6'}`}>
                    {/* Form Panel */}
                    {!previewMode && (
                        <div className="animate-fade-in">
                            <ResumeForm resume={resume} setResume={setResume} />
                        </div>
                    )}

                    {/* Preview Panel */}
                    <div className={`animate-fade-in ${previewMode ? 'max-w-3xl mx-auto' : ''}`}>
                        <div className="card">
                            <h3 className="section-title">
                                <Eye size={18} className="text-brand-400" />
                                Live Preview
                            </h3>
                            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                                <ResumePreview resume={resume} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
