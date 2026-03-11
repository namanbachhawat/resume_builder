import React from 'react';
import { Lock, Crown } from 'lucide-react';

export default function Template3({ resume }) {
    return (
        <div style={{ position: 'relative', minHeight: '500px', backgroundColor: '#fffbf0', fontFamily: "'Arial', sans-serif" }}>
            {/* Blurred content preview */}
            <div style={{ filter: 'blur(4px)', padding: '32px', opacity: 0.6 }}>
                <div style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)', padding: '24px 32px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                        {resume.name || 'Your Name'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                        {[resume.email, resume.phone, resume.location].filter(Boolean).join(' • ')}
                    </div>
                </div>
                <div style={{ padding: '0 32px' }}>
                    {resume.summary && (
                        <div>
                            <div style={{ borderBottom: '2px solid #f59e0b', paddingBottom: '4px', marginBottom: '8px', fontSize: '12px', fontWeight: '700', color: '#92400e', textTransform: 'uppercase' }}>Summary</div>
                            <p style={{ fontSize: '10px', color: '#333', lineHeight: '1.6' }}>{resume.summary}</p>
                        </div>
                    )}
                    <div style={{ marginTop: '16px', height: '200px', background: 'repeating-linear-gradient(0deg, #fef3c7 0px, #fef3c7 16px, transparent 16px, transparent 24px)' }} />
                </div>
            </div>

            {/* Lock overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255, 251, 235, 0.85)',
                backdropFilter: 'blur(2px)'
            }}>
                <div style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Crown size={28} color="white" />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#92400e', marginBottom: '8px' }}>Premium Template</h3>
                    <p style={{ fontSize: '12px', color: '#a16207', marginBottom: '20px', maxWidth: '220px' }}>
                        Unlock this elegant template and stand out from the crowd.
                    </p>
                    <div style={{
                        background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                        color: 'white',
                        padding: '10px 28px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '13px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                    }}>
                        <Lock size={14} />
                        Upgrade to Unlock
                    </div>
                    <p style={{ fontSize: '10px', color: '#d97706', marginTop: '12px' }}>✓ PDF Export &nbsp; ✓ Premium Layout &nbsp; ✓ Priority Support</p>
                </div>
            </div>
        </div>
    );
}
