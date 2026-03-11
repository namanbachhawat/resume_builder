import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Edit3, Sparkles, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../utils/api';

export default function HomePage() {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await resumeAPI.getAll();
            setResumes(res.data.data);
        } catch {
            // Backend might not be running; gracefully show empty state
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Delete this resume?')) return;
        try {
            await resumeAPI.delete(id);
            setResumes((prev) => prev.filter((r) => r._id !== id));
            toast.success('Resume deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const templateNames = { 1: 'Classic', 2: 'Modern', 3: 'Premium' };
    const templateColors = { 1: 'bg-blue-500/20 text-blue-400', 2: 'bg-violet-500/20 text-violet-400', 3: 'bg-amber-500/20 text-amber-400' };

    return (
        <div className="gradient-bg min-h-screen">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
                            <FileText size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-lg leading-none">ResumeAI</h1>
                            <p className="text-xs text-slate-400">Builder</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/builder')} className="btn-primary flex items-center gap-2">
                        <Plus size={16} />
                        New Resume
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-brand-600/20 text-brand-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-brand-500/30">
                        <Sparkles size={14} />
                        AI-Powered Resume Builder
                    </div>
                    <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                        Build Your Perfect<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">
                            Resume in Minutes
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
                        Create professional resumes with AI-powered content generation, multiple templates, and one-click PDF export.
                    </p>
                    <button onClick={() => navigate('/builder')} className="btn-primary text-base px-8 py-3 flex items-center gap-2 mx-auto">
                        <Plus size={18} />
                        Create New Resume
                    </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Sparkles, title: 'AI-Powered', desc: 'Generate summaries, improve job descriptions, and suggest skills using AI.', color: 'text-brand-400' },
                        { icon: Layers, title: '3 Templates', desc: 'Choose from Classic, Modern, or Premium templates for every style.', color: 'text-violet-400' },
                        { icon: FileText, title: 'PDF Export', desc: 'Download your resume as a high-quality, print-ready PDF instantly.', color: 'text-emerald-400' },
                    ].map(({ icon: Icon, title, desc, color }) => (
                        <div key={title} className="card hover:bg-white/10 transition-all duration-300 group">
                            <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
                                <Icon size={20} />
                            </div>
                            <h3 className="font-semibold text-white mb-2">{title}</h3>
                            <p className="text-slate-400 text-sm">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* My Resumes */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6">My Resumes</h3>
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Loading...</div>
                    ) : resumes.length === 0 ? (
                        <div className="card text-center py-16">
                            <FileText size={48} className="text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 mb-6">No resumes yet. Create your first one!</p>
                            <button onClick={() => navigate('/builder')} className="btn-primary inline-flex items-center gap-2">
                                <Plus size={16} /> Create Resume
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {resumes.map((resume) => (
                                <div
                                    key={resume._id}
                                    onClick={() => navigate(`/builder/${resume._id}`)}
                                    className="card hover:bg-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/10 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 bg-brand-600/20 rounded-lg flex items-center justify-center">
                                            <FileText size={18} className="text-brand-400" />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); navigate(`/builder/${resume._id}`); }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={(e) => handleDelete(resume._id, e)}
                                                className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-white text-lg mb-1 truncate">{resume.name}</h4>
                                    <p className="text-slate-400 text-sm mb-4 truncate">{resume.email}</p>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${templateColors[resume.template]}`}>
                                            {templateNames[resume.template]} Template
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(resume.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
