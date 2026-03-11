import React from 'react';
import { Crown, Lock, Check } from 'lucide-react';

const templates = [
    {
        id: 1,
        name: 'Classic',
        desc: 'Clean single-column professional layout',
        free: true,
        preview: (
            <div className="space-y-1">
                <div className="h-2 bg-blue-500 rounded w-full" />
                <div className="h-1.5 bg-slate-300 rounded w-2/3" />
                <div className="h-1 bg-slate-200 rounded w-1/2" />
                <div className="mt-2 space-y-1">
                    {[1, 2, 3].map(i => <div key={i} className="h-1 bg-slate-100 rounded w-full" />)}
                </div>
            </div>
        ),
    },
    {
        id: 2,
        name: 'Modern',
        desc: 'Side panel with two-column layout',
        free: true,
        preview: (
            <div className="flex gap-1.5">
                <div className="w-1/3 bg-slate-800 rounded space-y-1 p-1">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-1 bg-slate-600 rounded w-full" />)}
                </div>
                <div className="flex-1 space-y-1">
                    <div className="h-2 bg-violet-500 rounded w-full" />
                    {[1, 2, 3].map(i => <div key={i} className="h-1 bg-slate-200 rounded w-full" />)}
                </div>
            </div>
        ),
    },
    {
        id: 3,
        name: 'Premium',
        desc: 'Elegant premium design — upgrade to unlock',
        free: false,
        preview: (
            <div className="space-y-1.5">
                <div className="h-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded w-full" />
                <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="h-1 bg-amber-200 rounded" />)}
                </div>
                <div className="space-y-1">
                    {[1, 2].map(i => <div key={i} className="h-1 bg-slate-200 rounded w-full" />)}
                </div>
            </div>
        ),
    },
];

export default function TemplateSelector({ selected, onSelect }) {
    return (
        <div className="card">
            <h3 className="section-title">
                <span className="w-5 h-5 bg-brand-600/30 rounded flex items-center justify-center text-brand-400 text-xs font-bold">T</span>
                Choose Template
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {templates.map((tpl) => (
                    <button
                        key={tpl.id}
                        onClick={() => onSelect(tpl.id)}
                        disabled={!tpl.free}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${!tpl.free
                                ? 'opacity-70 cursor-not-allowed border-white/5 bg-white/3'
                                : selected === tpl.id
                                    ? 'border-brand-500 bg-brand-500/10'
                                    : 'border-white/10 bg-white/3 hover:border-white/30 hover:bg-white/5'
                            }`}
                    >
                        {/* Preview thumbnail */}
                        <div className="bg-white rounded-lg p-3 mb-3 h-16 overflow-hidden">
                            {tpl.preview}
                        </div>

                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-sm">{tpl.name}</span>
                            {tpl.free ? (
                                selected === tpl.id ? (
                                    <span className="w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                                        <Check size={10} className="text-white" />
                                    </span>
                                ) : (
                                    <span className="text-xs text-emerald-400 font-medium">Free</span>
                                )
                            ) : (
                                <Crown size={14} className="text-amber-400" />
                            )}
                        </div>
                        <p className="text-xs text-slate-500 leading-tight">{tpl.desc}</p>

                        {/* Locked overlay */}
                        {!tpl.free && (
                            <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                                <Lock size={20} className="text-amber-400 mb-2" />
                                <span className="text-xs font-semibold text-amber-400">Upgrade to Unlock</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
